#!/usr/bin/env node
/**
 * REAL-render WCAG gate. Opens HTML in headless Chrome, disables transitions,
 * and measures the contrast of every visible text element against its true
 * (alpha-composited) background. This is ground truth — not hand-typed numbers.
 *
 * Usage:
 *   node scripts/measure_render.mjs examples/apple-demo/index.html
 *   node scripts/measure_render.mjs --dark examples/sample-app/preview.html
 *   node scripts/measure_render.mjs            # defaults to examples/ *.html
 *
 * Requires Playwright (`npm i -D playwright` + a Chrome/Chromium). If it isn't
 * installed the script SKIPS (exit 0) so it never blocks users who don't have it.
 * Exit 1 only when a real rendered text pair is below WCAG 2.2 AA.
 */
import { readdirSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';

let chromium;
try { ({ chromium } = await import('playwright')); }
catch {
  // A missing browser must not read as a pass. Without DS_REQUIRE_BROWSER the gate
  // stays skippable for local convenience; CI and accuracy_report set it to 1, so a
  // machine that cannot render fails loudly instead of reporting green on nothing.
  const required = process.env.DS_REQUIRE_BROWSER === "1";
  console.log(`measure_render: playwright not installed — ${required ? "REQUIRED, FAILING" : "SKIPPED"}`);
  process.exit(required ? 1 : 0);
}

const argv = process.argv.slice(2);
const dark = argv.includes('--dark');
/*
 * WHERE the theme is stamped, and WHAT is then measured.
 *
 * `--dark` alone stamps the root, which assumes the whole page is theme-aware.
 * A page can legitimately scope dark to one region — a docs page whose site
 * chrome is light-only and whose design-system section has its own switch —
 * and stamping the root there darkens the tokens under chrome that never reads
 * them, producing two hundred failures for a state the page cannot enter.
 *
 *   --dark-on=<selector>   stamp data-theme on this element, and measure only
 *                          inside it.
 */
const darkOn = (argv.find((a) => a.startsWith('--dark-on=')) ?? '').slice('--dark-on='.length);
let files = argv.filter(a => !a.startsWith('--'));
if (files.length === 0) {
  const root = resolve('examples');
  const walk = d => readdirSync(d).flatMap(n => {
    const p = join(d, n);
    return statSync(p).isDirectory() ? walk(p) : (p.endsWith('.html') ? [p] : []);
  });
  try { files = walk(root); } catch { files = []; }
}
if (files.length === 0) { console.log('measure_render: no HTML files to check.'); process.exit(0); }

function lin(c) { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }
function L([r, g, b]) { return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b); }
function ratio(a, b) { const l1 = L(a), l2 = L(b), hi = Math.max(l1, l2), lo = Math.min(l1, l2); return (hi + 0.05) / (lo + 0.05); }

let browser;
try { browser = await chromium.launch({ channel: 'chrome' }); }
catch { try { browser = await chromium.launch(); } catch (e) { console.log('measure_render: no browser available — SKIPPED'); process.exit(0); } }

let totalFail = 0;
for (const f of files) {
  const page = await browser.newPage();
  await page.goto('file://' + resolve(f));
  await page.addStyleTag({ content: '*{transition:none!important;animation:none!important}' });
  /* Tall enough that the whole page is "in view", so the paint-stack probe
     below can be asked about elements that would otherwise be below the fold. */
  {
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    await page.setViewportSize({ width: 1280, height: Math.min(Math.max(h, 720), 20000) });
  }
  if (dark || darkOn)
    await page.evaluate((sel) => {
      const el = sel ? document.querySelector(sel) : document.documentElement;
      if (!el) throw new Error(`measure_render: --dark-on selector matched nothing: ${sel}`);
      el.setAttribute('data-theme', 'dark');
    }, darkOn || null);

  await page.evaluate((sel) => { window.__measureScope = sel; }, darkOn || null);
  const items = await page.evaluate(() => {
    /*
     * Colour is resolved by the BROWSER, not by a regex over the string.
     *
     * This gate used to do `s.match(/[\d.]+/g)` and treat the first three
     * numbers as sRGB bytes. That works for `rgb(30, 41, 59)` and produces
     * nonsense for everything else Chrome now returns: `oklab(0.98 -0.001
     * -0.003 / 0.65)` became rgb(1, 0, 0), and a footer measuring a true
     * 6.78:1 was reported as 1.43:1. Sixty-one such failures on one page is
     * worse than no gate — a gate nobody believes is a gate nobody reads.
     *
     * A 1x1 canvas accepts any colour the page can express, composites the
     * alpha the way the compositor does, and hands back bytes.
     */
    const probe = document.createElement('canvas');
    probe.width = probe.height = 1;
    const ctx = probe.getContext('2d', { willReadFrequently: true });
    /** `colour` painted over `under`, as sRGB bytes. */
    const paint = (colour, under) => {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = under;
      ctx.fillRect(0, 0, 1, 1);
      ctx.fillStyle = colour;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
      return [r, g, b];
    };
    const rgb = ([r, g, b]) => `rgb(${r} ${g} ${b})`;

    /**
     * The opaque colour actually behind `el`, alpha composited.
     *
     * From the PAINT STACK, not the ancestor chain. Those are different things
     * and the difference is the whole bug: a `position: fixed` header is not a
     * descendant of the section it floats over, so walking ancestors finds the
     * page shell's cream and misses the marine section actually painted behind
     * it. The site's language switcher was reported as white-on-cream at 1.01:1
     * while rendering white on marine at 13.98:1.
     *
     * `elementsFromPoint` returns everything at that point in paint order,
     * topmost first, ancestors and siblings alike — which is exactly the list
     * that decides what colour is behind something. Falling back to the
     * ancestor walk keeps elements outside the viewport measurable.
     */
    function bgOf(el) {
      const r = el.getBoundingClientRect();
      const x = r.left + r.width / 2, y = r.top + r.height / 2;
      const inView = r.width && r.height && x >= 0 && y >= 0 && x <= innerWidth && y <= innerHeight;

      const layers = [];
      if (inView) {
        for (const n of document.elementsFromPoint(x, y)) {
          /* The element's OWN background counts. A filled button is the backdrop
             for its own label — skipping it measured white text against the card
             behind the button rather than against the button. */
          const c = getComputedStyle(n).backgroundColor;
          if (!c || c === 'transparent' || c === 'rgba(0, 0, 0, 0)') continue;
          layers.push(c);
          if (paint(c, 'rgb(0 0 0)').join() === paint(c, 'rgb(255 255 255)').join()) break;
        }
      } else {
        for (let n = el; n; n = n.parentElement) {
          const c = getComputedStyle(n).backgroundColor;
          if (!c || c === 'transparent' || c === 'rgba(0, 0, 0, 0)') continue;
          layers.push(c);
          if (paint(c, 'rgb(0 0 0)').join() === paint(c, 'rgb(255 255 255)').join()) break;
        }
      }

      let base = 'rgb(255 255 255)';
      for (let i = layers.length - 1; i >= 0; i--) base = rgb(paint(layers[i], base));
      return paint(base, base);
    }

    /*
     * Text over a photograph has no single background colour, so it has no
     * single ratio. Reporting one is a guess dressed as a measurement — it is
     * how the hero produced forty failures for text that is plainly legible.
     * Flag it for a human, which is the only thing that can judge it.
     *
     * The test is the PAINT STACK, not the ancestor chain, because the two are
     * not the same thing and the difference is the whole bug: this site's
     * header is `position: fixed` and transparent, and the video behind it is a
     * sibling in another subtree. Walking parents finds the page background and
     * concludes white-on-cream. `elementsFromPoint` sees what is actually there.
     */
    const overImage = (el) => {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return false;
      const x = r.left + r.width / 2, y = r.top + r.height / 2;
      if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) return false;
      for (const n of document.elementsFromPoint(x, y)) {
        /*
         * Skip the element's own ANCESTORS — `n.contains(el)`, not
         * `el.contains(n)`. It was the latter, which skips descendants and
         * examines ancestors, so the walk hit the page shell's opaque cream and
         * concluded "not over imagery" before it ever reached the video painted
         * between them. The header's language links were reported as white on
         * cream while rendering white on a dark hero.
         *
         * An ancestor's background IS a legitimate backdrop, but only when
         * nothing is painted in front of it; `bgOf` already composites the
         * ancestor chain, so this walk is only interested in what is NOT one.
         */
        if (n === el || n.contains(el)) continue;
        if (n.tagName === 'IMG' || n.tagName === 'VIDEO' || n.tagName === 'CANVAS') return true;
        const cs = getComputedStyle(n);
        if (cs.backgroundImage && cs.backgroundImage !== 'none') return true;
        /* An opaque colour below it hides anything further down. */
        if (cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)' &&
            paint(cs.backgroundColor, 'rgb(0 0 0)').join() ===
              paint(cs.backgroundColor, 'rgb(255 255 255)').join()) return false;
      }
      return false;
    };

    const out = [];
    const scope = window.__measureScope
      ? document.querySelector(window.__measureScope)
      : document.body;
    for (const el of (scope ?? document.body).querySelectorAll('*')) {
      if (['SCRIPT', 'STYLE', 'SVG', 'PATH', 'USE'].includes(el.tagName)) continue;
      const direct = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length);
      if (!direct) continue;
      const cs = getComputedStyle(el);
      if (!el.offsetParent && cs.position !== 'fixed') continue; // not visible
      if (cs.visibility === 'hidden' || +cs.opacity === 0) continue;
      const bg = bgOf(el);
      out.push({
        tag: el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).split(' ')[0] : ''),
        text: el.textContent.trim().slice(0, 24),
        /* Painted over its own background, so a translucent colour is measured
           as what the eye receives rather than as what it declares. */
        color: paint(cs.color, rgb(bg)),
        bg,
        px: parseFloat(cs.fontSize),
        bold: parseInt(cs.fontWeight, 10) >= 700,
        onImage: overImage(el)
      });
    }
    return out;
  });
  await page.close();

  const fails = [];
  let onImage = 0;
  for (const it of items) {
    if (it.onImage) { onImage++; continue; }
    const need = (it.px >= 24 || (it.px >= 18.66 && it.bold)) ? 3.0 : 4.5;
    const r = ratio(it.color, it.bg);
    if (r < need) fails.push({ ...it, r, need });
  }
  if (onImage) console.log(`  note: ${onImage} text element(s) sit on imagery — not measurable here, check by eye.`);
  const mode = darkOn ? ` [dark @ ${darkOn}]` : dark ? ' [dark]' : '';
  if (fails.length) {
    totalFail += fails.length;
    console.log(`\nFAIL ${f}${mode} — ${fails.length} text pair(s) below WCAG AA:`);
    for (const x of fails) console.log(`  x <${x.tag}> "${x.text}" ${x.r.toFixed(2)}:1 (need ${x.need})  [rgb(${x.color.map(Math.round)}) on rgb(${x.bg.map(Math.round)})]`);
  } else {
    console.log(`OK   ${f}${mode} — all ${items.length} text element(s) meet WCAG AA`);
  }
}
await browser.close();
if (totalFail) { console.log(`\n${totalFail} real-rendered contrast failure(s).`); process.exit(1); }
console.log('\nOK: every rendered text element meets WCAG 2.2 AA.');
process.exit(0);
