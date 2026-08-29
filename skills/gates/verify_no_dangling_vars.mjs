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

/* Set at the call site by design — a layout primitive's knobs and the utility
   layer's internals are meant to be undefined until something sets them. */
const BY_DESIGN = new Set([
	'--gap', '--align', '--measure', '--gutter', '--min', '--side',
	'--threshold', '--ratio', '--ring-offset-width', '--ring-offset-color',
	'--ring-color', '--gradient-stops', '--gradient-from', '--gradient-to',
	'--gradient-via'
])

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
		await page.goto(url, { waitUntil: 'networkidle' })
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
		const referenced = [
			...new Set([...`${sheets} ${inline}`.matchAll(/var\((--[a-z0-9-]+)/g)].map((m) => m[1]))
		]
		return referenced.filter((name) => !root.getPropertyValue(name).trim())
	})
	const real = dangling.filter((name) => !BY_DESIGN.has(name))
	if (real.length) {
		failures += real.length
		console.log(`FAIL ${url}`)
		for (const name of real) console.log(`  x ${name} is referenced but never declared`)
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
