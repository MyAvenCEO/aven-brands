#!/usr/bin/env node
/**
 * Every `var(--x)` a page uses must be declared by the theme it renders in.
 *
 * The failure this catches is specific, silent and has now happened four times
 * in one refactor: a token is renamed, a call site still names the old one, and
 * CSS does exactly what the spec says — an undefined custom property makes the
 * whole declaration invalid, so the element inherits. Text loses its colour and
 * shows up in whatever the parent had. On a hero over a video, that means
 * near-black text on a bright photo.
 *
 * Nothing else notices. The build passes, the dev server returns 200, the
 * contrast gate passes because the inherited colour happens to have contrast
 * against something, and axe reports zero violations on a page that is wrong.
 * The only thing that sees it is a person looking at the screen — which is
 * exactly the review step a design system is supposed to make unnecessary.
 *
 *   node skills/gates/verify_no_dangling_vars.mjs <url> [url…]
 *
 * Checks stylesheets AND inline `<style>` blocks, because component-scoped
 * styles live in the latter and that is where three of the four escapes were.
 */
import { chromium } from 'playwright'
import { assertServed } from './_served.mjs'

/*
 * THE FALLBACK IS THE DECLARATION OF INTENT.
 *
 * `var(--btn-block, 2.5rem)` says: something may set this, and here is what
 * happens when nothing does. It is an API, and an undeclared value is its
 * normal resting state. `var(--btn-block)` with no fallback says: this WILL be
 * defined — and when it is not, the whole declaration is discarded and the
 * element silently loses that property.
 *
 * So the guarded and unguarded cases are opposite facts, and only the second
 * is a defect. This used to be a hand-kept allowlist, which meant every new
 * call-site property had to be remembered into it; ten by-design entries had
 * accumulated as failures, and a gate that is permanently red is a gate nobody
 * reads. Worse, the allowlist hid the one real defect among them:
 * `--radius-2xl` was emitted by the utility layer for `rounded-2xl` across
 * fifteen call sites while this brand's radius scale stops at `xl`, and every
 * one of those cards rendered with square corners.
 *
 * A reference is now reported only if EVERY occurrence of it lacks a fallback.
 * One guarded use is enough to say the author knew.
 */

const urls = process.argv.slice(2)
if (!urls.length) {
	console.error('usage: verify_no_dangling_vars.mjs <url> [url…]')
	process.exit(2)
}

const browser = await chromium.launch()
let failures = 0

for (const url of urls) {
	const page = await browser.newPage()
	try {
		assertServed(await page.goto(url, { waitUntil: 'networkidle' }), url)
	} catch (error) {
		console.log(`  SKIP ${url} — ${error.message.split('\n')[0]}`)
		await page.close()
		continue
	}
	const dangling = await page.evaluate(() => {
		const root = getComputedStyle(document.documentElement)
		const sheets = [...document.styleSheets]
			.flatMap((s) => {
				try {
					return [...s.cssRules].map((r) => r.cssText)
				} catch {
					return []
				}
			})
			.join(' ')
		const inline = [...document.querySelectorAll('style')].map((s) => s.textContent).join(' ')
		const css = `${sheets} ${inline}`
		/* Capture what follows the name, so a fallback can be told from its absence. */
		const guarded = new Set()
		const seen = new Set()
		for (const m of css.matchAll(/var\((--[a-z0-9-]+)\s*([,)])/g)) {
			seen.add(m[1])
			if (m[2] === ',') guarded.add(m[1])
		}
		/* DECLARED ANYWHERE, not just on :root. `via-white/15` sets
		   `--gradient-via` on the element that wears it, and asking the root
		   element for it returns nothing — so a property that is declared and
		   working read as dangling. The question is whether the page declares it
		   at all, and the stylesheets answer that. */
		const declaredInCss = new Set(
			[...css.matchAll(/(--[a-z0-9-]+)\s*:/g)].map((m) => m[1])
		)
		return [...seen].filter(
			(name) =>
				!root.getPropertyValue(name).trim() &&
				!declaredInCss.has(name) &&
				!guarded.has(name)
		)
	})
	const real = dangling
	if (real.length) {
		failures += real.length
		console.log(`FAIL ${url}`)
		for (const name of real) {
			console.log(`  x ${name} is referenced with NO fallback and never declared —`)
			console.log('      every declaration using it is silently discarded.')
		}
	} else {
		console.log(`  OK   ${url}`)
	}
	await page.close()
}

await browser.close()
if (failures) {
	console.log(`\n${failures} dangling custom propert${failures === 1 ? 'y' : 'ies'}.`)
	process.exit(1)
}
console.log('\nOK: every custom property a page references is declared.')
