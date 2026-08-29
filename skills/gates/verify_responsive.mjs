#!/usr/bin/env node
/**
 * RESPONSIVE gate. Loads each harness at narrow viewports and fails if the
 * document overflows horizontally (a sideways scrollbar = broken responsive
 * layout). Catches the common causes: fixed px widths that don't shrink,
 * unreset <ul>/<ol> list padding, non-wrapping flex rows, and
 * grid minmax(Npx,1fr) minimums larger than the viewport.
 *
 * --scale renders with a larger root font, which is the cheap local proxy for two
 * real situations this gate otherwise misses: another platform's wider fallback
 * font (Linux Chromium measured a label 2px wider than macOS Chrome and tipped a
 * page over at 280px), and a user who has set a larger default text size. A layout
 * that only fits at exactly 16px is fitting by luck.
 *
 * Usage: node scripts/verify_responsive.mjs <file.html | dir> [--widths=280,320,414]
 *                                           [--scale=1.25] [--advisory]
 * Exit 1 if any file overflows at any tested width (0 with --advisory).
 */
import { readdirSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';

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
  console.log(`verify_responsive: playwright not installed — ${required ? "REQUIRED, FAILING" : "SKIPPED"}`);
  process.exit(required ? 1 : 0);
}

const argv = process.argv.slice(2);
const target = argv.find(a => !a.startsWith('--'));
if (!target) { console.log('usage: node scripts/verify_responsive.mjs <file.html | dir> [--widths=280,320,414]'); process.exit(0); }
const widths = (argv.find(a => a.startsWith('--widths=')) || '--widths=280,320,414').split('=')[1].split(',').map(Number);
const scale = Number((argv.find(a => a.startsWith('--scale=')) || '--scale=1').split('=')[1]) || 1;
const advisory = argv.includes('--advisory');

/* A URL is one target and never touches the filesystem — `statSync` on
   \"http://localhost:1421/...\" resolves it as a relative PATH and throws
   ENOENT, which is how URL support silently stops at the directory walk. */
const abs = isUrl(target) ? target : resolve(target);
const files = !isUrl(target) && statSync(abs).isDirectory()
  ? readdirSync(abs).filter(f => f.endsWith('.html')).map(f => join(abs, f)).sort()
  : [abs];

const browser = await chromium.launch({ channel: 'chrome' });
const fails = [];
for (const w of widths) {
  const page = await browser.newPage({ viewport: { width: w, height: 800 } });
  for (const f of files) {
    await page.goto(pageUrl(f));
    if (scale !== 1) await page.addStyleTag({ content: `html{font-size:${16 * scale}px}` });
    const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (over > 1) {
      const culprit = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        for (const el of document.querySelectorAll('*')) {
          const r = el.getBoundingClientRect();
          if (r.right > vw + 1 && r.width <= vw + 40) return el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).split(' ')[0] : '');
        }
        return '?';
      });
      fails.push(`${f.split('/').pop()} @${w}px overflow +${over}px (widest: ${culprit})`);
    }
  }
  await page.close();
}
await browser.close();

const at = `${widths.join('/')}px${scale !== 1 ? ` @ ${scale}x root font` : ''}`;
if (fails.length) {
  console.log(`verify_responsive: ${advisory ? 'ADVISORY' : 'FAIL'} (${at})`);
  for (const m of fails) console.log('  x ' + m);
  if (!advisory) process.exit(1);
  console.log('  (advisory run — reported, not failed)');
  process.exit(0);
}
console.log(`verify_responsive: OK — ${files.length} file(s), no horizontal overflow at ${at}`);
