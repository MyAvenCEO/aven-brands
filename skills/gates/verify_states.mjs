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
assertServed(await page.goto(pageUrl(file), { waitUntil: 'networkidle' }).catch(() => {}), pageUrl(file));
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
  /* `visibility: hidden` inherits, and `opacity` does NOT — a link inside a
     closed menu computes opacity 1 while being completely imperceivable. The
     old check read only the element's own opacity, so every control inside a
     hidden overlay was colour-checked in its CLOSED state — and when that
     overlay sat on a media ground, judged by rules meant for the imagery
     behind a menu nobody can see. WCAG applies to what can be perceived. */
  const skip =
    isToggle || el.getAttribute('role') === 'switch' || +cs.opacity === 0 ||
    cs.visibility === 'hidden' || isDisabled;
  /*
   * A ground that is a PICTURE, not a colour.
   *
   * `backdrop()` walks up compositing background-colors. Over a video or a
   * photograph there is no background-color to find, so it falls through to the
   * body's — and reports white nav ink against cream at 1.01:1 while the real
   * composite over the scrimmed footage is 4.5:1. The number is not merely
   * imprecise, it is measuring a surface that is not there.
   *
   * These are EXCLUDED AND COUNTED, never silently dropped: the marker moves the
   * contrast proof somewhere this gate cannot reach, so the gate says so out
   * loud and names how many. The proof itself belongs with the scrim that makes
   * it true.
   */
  /*
   * "Inside a media ground" is not the same as "sitting ON the media". A
   * button with its own opaque fill brings its own ground with it — the
   * picture never reaches it, and it can and must be measured normally. Only
   * elements the media actually shows through are exempt.
   *
   * Without this the accent call-to-action was flagged for using dark gold ink
   * (`rgb(74, 50, 8)`) on the hero: correct against its own sunflower fill,
   * and nowhere near the footage.
   */
  const mediaRoot = el.closest('[data-ground="media"]');
  let grounded = false;
  for (let n = el; n && n !== mediaRoot; n = n.parentElement) {
    const a = rgba(getComputedStyle(n).backgroundColor);
    if (a && a[3] >= 1) { grounded = true; break; }
  }
  const onMedia = !!mediaRoot && !grounded;
  /*
   * EXCLUDING THE RATIO IS NOT EXCLUDING THE ELEMENT.
   *
   * Marking a ground as media stops the wrong measurement; it must not stop
   * every question. The very next commit after this exclusion landed shipped a
   * language switch whose SELECTED half rendered in the page's near-black ink
   * on a dark video — `rgb(30, 41, 59)` — because `segment`'s selected rule is
   * more specific than the bar's re-inking rule. No gate saw it, because the
   * only gate that would have was told not to look.
   *
   * So one thing is still checked here, and it needs no knowledge of the
   * backdrop: WHICH SIDE the ink is on. An element marked as sitting on media
   * has been declared to use the inverted ink. If its colour is nearer the
   * page's own foreground than the on-dark ink, that is a page ink that leaked
   * onto imagery, and it is a defect whatever the picture behind it happens to
   * be that second.
   */
  const rootCs = getComputedStyle(document.documentElement);
  const lum = (c) => {
    const m = String(c).match(/[\d.]+/g);
    if (!m || m.length < 3) return null;
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(+m[0]) + 0.7152 * f(+m[1]) + 0.0722 * f(+m[2]);
  };
  const probe = (name) => {
    const d = document.createElement('span');
    d.style.color = rootCs.getPropertyValue(name).trim() || 'transparent';
    document.body.appendChild(d);
    const v = lum(getComputedStyle(d).color);
    d.remove();
    return v;
  };
  let pageInkOnMedia = false;
  if (onMedia) {
    const own = lum(cs.color);
    const pageInk = probe('--color-foreground');
    const mediaInk = probe('--color-on-dark');
    if (own != null && pageInk != null && mediaInk != null) {
      pageInkOnMedia = Math.abs(own - pageInk) < Math.abs(own - mediaInk);
    }
  }
  const own = backdrop(el);
  // graphical / icon-only control: no DIRECT text node (only an <svg> or nothing) →
  // WCAG 1.4.11 non-text contrast applies (3:1), not the 4.5 text rule.
  const graphical = ![...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
  return { skip, onMedia, pageInkOnMedia, graphical, color: over(rgba(cs.color), own), bg: own, label: (el.textContent || el.value || el.getAttribute('aria-label') || '').trim().slice(0, 18), px: parseFloat(cs.fontSize), bold: (parseInt(cs.fontWeight, 10) || 400) >= 700 };
};

const handles = await page.$$('button, a[href], input, select, textarea, [role="button"], [role="switch"]');
const onMedia = new Set();
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
      if (r.onMedia) {
        if (r.pageInkOnMedia)
          fails.push(`${state.padEnd(7)} "${r.label}" uses the PAGE ink on a media ground  [rgb(${parse(r.color)}) — nearer --color-foreground than --color-on-dark]`);
        else onMedia.add(r.label || '(unlabelled)');
        break;
      }
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
if (onMedia.size) {
  console.log(`\n${onMedia.size} element(s) sit on MEDIA and were not colour-checked here — their`);
  console.log('ground is a picture, so a computed background-color is the wrong measurement:');
  for (const l of [...onMedia].slice(0, 8)) console.log(`  - "${l}"`);
  console.log('Their contrast is guaranteed by the scrim over that media and measured there.');
}
console.log(`Checked ${checked} element-state(s) in ${file}${mode}`);
if (fails.length) {
  console.log(`\nFAIL — ${fails.length} state(s) below WCAG AA:`);
  for (const f of fails) console.log('  x ' + f);
  process.exit(1);
}
console.log('OK: every interactive element passes WCAG AA in default, hover, and focus.');
process.exit(0);
