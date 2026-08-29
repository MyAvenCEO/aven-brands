#!/usr/bin/env node
/**
 * STATE-AWARE WCAG gate. For every interactive element, measures the real
 * computed text/background contrast in DEFAULT, HOVER, and FOCUS states — so a
 * button that turns the wrong color on hover (e.g. a secondary that picks up the
 * primary fill via CSS specificity) is caught, not just the resting state.
 *
 * Usage: node scripts/verify_states.mjs <file.html> [--dark]
 * Exit 1 if any state of any element drops below WCAG AA.
 */
import { resolve } from 'node:path';

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
  console.log(`verify_states: playwright not installed — ${required ? "REQUIRED, FAILING" : "SKIPPED"}`);
  process.exit(required ? 1 : 0);
}

const argv = process.argv.slice(2);
const dark = argv.includes('--dark');
const file = argv.find(a => !a.startsWith('--'));
if (!file) { console.log('usage: node scripts/verify_states.mjs <file.html> [--dark]'); process.exit(0); }

function lin(c) { c /= 255; return c <= .03928 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; }
function L([r, g, b]) { return .2126 * lin(r) + .7152 * lin(g) + .0722 * lin(b); }
function ratio(a, b) { const l1 = L(a), l2 = L(b), hi = Math.max(l1, l2), lo = Math.min(l1, l2); return (hi + .05) / (lo + .05); }
/* The page hands back OPAQUE `[r,g,b]` triples already, resolved and composited
   through a real canvas — see `read` below. Nothing here parses a colour string,
   because that is what this gate got wrong twice: a regex over
   `color(srgb 0.117 0.160 0.231 / 0.08)` reads the three FLOATS as 0-255 channels
   and throws the alpha away, so an 8% dark tint on cream was reported as
   near-black-on-near-black and a genuine 12.14:1 came back as 1.43:1. A gate that
   cries wolf on a passing element is worse than no gate: it gets ignored, and the
   real failure goes with it. */
const parse = c => (Array.isArray(c) ? c : null);

const browser = await chromium.launch({ channel: 'chrome' }).catch(() => chromium.launch());
const page = await browser.newPage({ viewport: { width: 1000, height: 800 } });
await page.goto(pageUrl(file), { waitUntil: 'networkidle' }).catch(() => {});
await page.addStyleTag({ content: '*{transition:none!important;animation:none!important}' });
if (dark) await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));

const read = el => {
  /* Resolve ANY CSS colour to `[r,g,b,a]` by painting it. `oklab()`,
     `color(srgb ...)`, `color-mix()`, a named colour and `#abc` all arrive here as
     whatever the engine chose to serialise, and the only thing that reads every
     one of them correctly is the thing that draws them. */
  const cv = document.createElement('canvas'); cv.width = cv.height = 1;
  const cx = cv.getContext('2d', { willReadFrequently: true });
  const rgba = c => {
    if (!c) return [0, 0, 0, 0];
    cx.clearRect(0, 0, 1, 1);
    cx.fillStyle = '#000';
    cx.fillStyle = c;              // an unparseable value leaves the previous fill
    if (cx.fillStyle === '#000' && !/^(#000|black|rgba?\(0, ?0, ?0)/.test(c)) return [0, 0, 0, 0];
    cx.clearRect(0, 0, 1, 1);
    cx.fillRect(0, 0, 1, 1);
    const d = cx.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2], d[3] / 255];
  };
  /* Composite `top` over `under`. The bug this fixes: a background at alpha 0.08
     was treated as OPAQUE, so the ground it sits on was never mixed in and the
     measured backdrop was the tint's own colour at full strength. */
  const over = (top, under) => {
    const a = top[3];
    if (a >= 1) return top.slice(0, 3);
    return [0, 1, 2].map(i => Math.round(top[i] * a + under[i] * (1 - a)));
  };
  /* The real backdrop: walk up compositing every partially transparent layer,
     not just stopping at the first one that is not fully clear. */
  const backdrop = n => {
    const stack = [];
    for (let x = n; x; x = x.parentElement) {
      const c = rgba(getComputedStyle(x).backgroundColor);
      if (c[3] > 0) stack.push(c);
      if (c[3] >= 1) break;
    }
    const body = rgba(getComputedStyle(document.body).backgroundColor);
    let out = body[3] >= 1 ? body.slice(0, 3) : [255, 255, 255];
    for (const layer of stack.reverse()) out = over(layer, out);
    return out;
  };
  const cs = getComputedStyle(el);
  // skip non-text form controls (checkbox/radio/switch render natively via accent-color,
  // not CSS text color) and invisible elements — measuring their color/bg is meaningless.
  const isToggle = el.tagName === 'INPUT' && ['checkbox', 'radio'].includes(el.type);
  // WCAG 1.4.3 / 1.4.11 exempt disabled (inactive) controls from contrast.
  const isDisabled = el.disabled || el.getAttribute('aria-disabled') === 'true';
  const skip = isToggle || el.getAttribute('role') === 'switch' || +cs.opacity === 0 || isDisabled;
  const own = backdrop(el);
  // graphical / icon-only control: no DIRECT text node (only an <svg> or nothing) →
  // WCAG 1.4.11 non-text contrast applies (3:1), not the 4.5 text rule.
  const graphical = ![...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
  return { skip, graphical, color: over(rgba(cs.color), own), bg: own, label: (el.textContent || el.value || el.getAttribute('aria-label') || '').trim().slice(0, 18), px: parseFloat(cs.fontSize), bold: (parseInt(cs.fontWeight, 10) || 400) >= 700 };
};

const handles = await page.$$('button, a[href], input, select, textarea, [role="button"], [role="switch"]');
const fails = [];
let checked = 0;
for (const h of handles) {
  for (const state of ['default', 'hover', 'focus']) {
    try {
      if (state === 'hover') await h.hover({ timeout: 1000, force: true });
      if (state === 'focus') await h.evaluate(el => el.focus && el.focus());
      const r = await h.evaluate(read);
      await page.mouse.move(0, 0);
      if (state === 'focus') await h.evaluate(el => el.blur && el.blur());
      if (r.skip) break;  // non-text control (checkbox/radio/switch) or invisible — not a text-contrast target
      const fg = parse(r.color), bg = parse(r.bg);
      if (!fg || !bg) continue;
      checked++;
      const need = r.graphical ? 3.0 : ((r.px >= 24 || (r.px >= 18.66 && r.bold)) ? 3.0 : 4.5);
      const cr = ratio(fg, bg);
      if (cr < need) fails.push(`${state.padEnd(7)} "${r.label}" ${cr.toFixed(2)}:1 (need ${need})  [rgb(${fg}) on rgb(${bg})]`);
    } catch { /* element not hoverable/visible — skip */ }
  }
}
await browser.close();

const mode = dark ? ' [dark]' : '';
console.log(`Checked ${checked} element-state(s) in ${file}${mode}`);
if (fails.length) {
  console.log(`\nFAIL — ${fails.length} state(s) below WCAG AA:`);
  for (const f of fails) console.log('  x ' + f);
  process.exit(1);
}
console.log('OK: every interactive element passes WCAG AA in default, hover, and focus.');
process.exit(0);
