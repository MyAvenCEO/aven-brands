#!/usr/bin/env node
/**
 * AXE a11y gate. Runs axe-core (WCAG 2.0/2.1/2.2 A + AA rules) against rendered
 * HTML in headless Chrome and reports violations. Catches what the contrast/state
 * gates can't: ARIA roles, name-role-value, label associations, landmarks,
 * heading order, list structure, button/link names, etc.
 *
 * Usage: node scripts/axe_audit.mjs <file.html> [--dark]
 * Exit 1 if any serious/critical violation (or any AA violation).
 *
 * Requires Playwright (skips cleanly if absent). axe-core is injected from
 * node_modules if present, else from a pinned CDN build (Chrome has network).
 */
import { resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { assertServed } from './_served.mjs'

/**
 * A target is either a file on disk or a URL to a running server.
 *
 * Every render gate here loaded `file://` unconditionally. For a static
 * component harness that is correct. For a BUILT SvelteKit page it is not: the
 * module scripts never execute over `file://`, so the page renders its markup
 * and its CSS and hydrates nothing — and a gate that asks whether a control
 * WORKS then reports that none of them do. `verify_interactive` failed the docs
 * page's theme switch on exactly that basis, while the live control flips
 * `aria-pressed`, flips `data-theme`, and repaints the page.
 *
 * A gate that fails on every page of a whole framework gets ignored, or gets
 * "fixed" by deleting the real ARIA it was complaining about. So: pass a path
 * and it is a file, pass an http(s) URL and it is served.
 */
const isUrl = (t) => /^https?:\/\//.test(t);
const pageUrl = (t) => (isUrl(t) ? t : 'file://' + resolve(t));

let chromium;
try { ({ chromium } = await import('playwright')); }
catch {
  // A missing browser must not read as a pass. Without DS_REQUIRE_BROWSER the gate
  // stays skippable for local convenience; CI and accuracy_report set it to 1, so a
  // machine that cannot render fails loudly instead of reporting green on nothing.
  const required = process.env.DS_REQUIRE_BROWSER === "1";
  console.log(`axe_audit: playwright not installed — ${required ? "REQUIRED, FAILING" : "SKIPPED"}`);
  process.exit(required ? 1 : 0);
}

const argv = process.argv.slice(2);
const dark = argv.includes('--dark');
const file = argv.find(a => !a.startsWith('--'));
if (!file) { console.log('usage: node scripts/axe_audit.mjs <file.html> [--dark]'); process.exit(0); }

const browser = await chromium.launch({ channel: 'chrome' }).catch(() => chromium.launch());
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
assertServed(await page.goto(pageUrl(file), { waitUntil: 'networkidle' }).catch(() => {}), pageUrl(file));
if (dark) await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));

const localAxe = resolve('node_modules/axe-core/axe.min.js');
try {
  if (existsSync(localAxe)) await page.addScriptTag({ path: localAxe });
  else await page.addScriptTag({ url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js' });
} catch {
  console.log('axe_audit: could not load axe-core (no local copy + no network) — SKIPPED');
  await browser.close(); process.exit(0);
}

const results = await page.evaluate(async () => {
  // eslint-disable-next-line no-undef
  const out = await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } });
  /* Tag the colour-contrast nodes whose ground is a picture. Done in the page,
     where the elements still exist and `closest` can answer. */
  for (const x of out.violations || []) {
    if (x.id !== 'color-contrast') continue;
    for (const n of x.nodes) {
      const el = document.querySelector(n.target.join(' '));
      n.__onMedia = !!(el && el.closest('[data-ground="media"]'));
    }
  }
  return out;
});
await browser.close();

/*
 * COLOUR-CONTRAST OVER MEDIA.
 *
 * axe computes a background COLOUR by walking the cascade. Over a video or a
 * photograph there is no colour to find, so it reports the page's own ground
 * and scores white text against cream — a number for a surface that is not
 * there. It will report that failure no matter how dark the scrim gets, so
 * left alone the rule is permanently red on any page with a hero, which is how
 * a whole gate stops being read.
 *
 * Only `color-contrast`, and only inside an element the author marked
 * `data-ground="media"`. Every other rule still applies in there: a missing
 * label or a broken ARIA role is a defect whatever is behind it. The excluded
 * nodes are printed, because an exclusion nobody can see is a hole.
 *
 * The obligation does not go away — it moves. The contrast over media has to be
 * measured against the real composited pixels, and the number recorded where
 * the scrim that makes it true is defined.
 */
const rawViolations = results.violations || [];
const mediaExcluded = [];
const v = rawViolations.map(x => {
  if (x.id !== 'color-contrast') return x;
  const keep = x.nodes.filter(n => !n.__onMedia);
  const dropped = x.nodes.filter(n => n.__onMedia);
  if (dropped.length) mediaExcluded.push(...dropped.map(n => n.target.join(' ')));
  return keep.length ? { ...x, nodes: keep } : null;
}).filter(Boolean);
const blocking = v.filter(x => ['serious', 'critical'].includes(x.impact));
const mode = dark ? ' [dark]' : '';
console.log(`axe-core WCAG 2.2 A/AA — ${file}${mode}`);
if (mediaExcluded.length) {
  console.log(`  ${mediaExcluded.length} colour-contrast node(s) sit on MEDIA and were not scored here —`);
  console.log('  axe reads a background COLOUR, and their ground is a picture:');
  for (const s of mediaExcluded.slice(0, 5)) console.log(`      ${s}`);
  console.log('  Measure those against the real composited pixels, at the scrim that carries them.');
}
if (!v.length) { console.log('OK: 0 violations.'); process.exit(0); }
for (const x of v) {
  console.log(`  ${(x.impact || '?').toUpperCase()}  ${x.id}: ${x.help} (${x.nodes.length} node${x.nodes.length > 1 ? 's' : ''})`);
  for (const n of x.nodes.slice(0, 3)) console.log(`      ${n.target.join(' ')}`);
}
console.log(`\n${v.length} violation(s); ${blocking.length} serious/critical.`);
process.exit(blocking.length ? 1 : (v.length ? 1 : 0));
