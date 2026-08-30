/**
 * A geometry + paint fingerprint of a page, for a refactor that must change
 * nothing. Records every element's box and the declarations that decide how it
 * looks, keyed by a stable path — so a diff names the element that moved rather
 * than reporting "the page changed".
 */
let chromium
try { ({ chromium } = await import('playwright')) } catch { console.log('_snap: no playwright'); process.exit(1) }
import { writeFileSync } from 'node:fs'

const [url, out, width = '1280'] = process.argv.slice(2)
let browser
try { browser = await chromium.launch({ channel: 'chrome' }) } catch { browser = await chromium.launch() }
const page = await browser.newPage({ viewport: { width: +width, height: 900 } })
await page.goto(url, { waitUntil: 'networkidle' })
await page.emulateMedia({ reducedMotion: 'reduce' })
await page.waitForTimeout(1200)

const snap = await page.evaluate(() => {
  const PROPS = ['display','position','gridTemplateColumns','flexDirection','gap','textAlign',
    'fontSize','fontWeight','lineHeight','letterSpacing','color','backgroundColor',
    'borderRadius','borderTopWidth','borderTopColor','padding','margin','maxInlineSize','aspectRatio']
  const path = (el) => { const p = []; let n = el
    while (n && n !== document.body) { const i = [...n.parentElement.children].indexOf(n); p.unshift(`${n.tagName}${i}`); n = n.parentElement }
    return p.join('/') }
  const out = {}
  for (const el of document.body.querySelectorAll('*')) {
    if (el.closest('script,style,svg')) continue
    const r = el.getBoundingClientRect()
    if (!r.width && !r.height) continue
    const cs = getComputedStyle(el)
    out[path(el)] = {
      box: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)],
      css: PROPS.map((p) => cs[p]).join('|'),
      text: (el.childNodes.length === 1 && el.firstChild.nodeType === 3 ? el.textContent.trim().slice(0, 40) : '')
    }
  }
  return out
})
writeFileSync(out, JSON.stringify(snap, null, 1))
console.log(`${Object.keys(snap).length} elements -> ${out}`)
await browser.close()
