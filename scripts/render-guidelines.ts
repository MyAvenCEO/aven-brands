#!/usr/bin/env bun
/**
 * Render every brand's guideline page.
 *
 *   bun run guidelines
 *
 * The architecture running on its own documentation, twice:
 *
 *   Brand (config) ──→ aven-vibes ──→ CSS + HTML
 *
 * Neither page is hand-written HTML, which is the point. A showcase written by
 * hand drifts from the system the moment someone adds a component and forgets
 * the demo; these iterate the actual exports, so a token that exists appears
 * and one that does not, does not. If a page renders wrong, the brand is wrong.
 *
 * That the SAME script produces both, from the same renderer, is the claim this
 * repo makes: a brand is a config, and everything after it is shared.
 */
import { writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { renderViewToString } from '@myavenceo/aven-vibes'
import { createGenerator, createKitchenSink } from '@myavenceo/aven-vibes/brand'
import { avenCeo } from '../packages/aven-ceo/dist/brand.js'
import { avenYma } from '../packages/aven-yma/dist/brand.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

/** The page has no state — it IS the config — so identity is the honest evaluator. */
const evaluate = (expression: unknown) => expression

for (const [brand, out, fontLink] of [
	[
		avenCeo,
		'packages/aven-ceo/kitchen-sink.html',
		'<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300..800&display=swap" rel="stylesheet">'
	],
	[
		avenYma,
		'packages/aven-yma/kitchen-sink.html',
		'<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400..700;1,400..700&family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">'
	]
] as const) {
	const { themeCss, componentCss } = createGenerator(brand)
	const { kitchenSinkView, kitchenSinkCss } = createKitchenSink(brand)
	/* No cast. The kitchen sink returns a ViewDef and says so now that it lives
	   beside the renderer — the two used to be in packages that could not name
	   each other's types, so this line asserted what neither could state. */
	const body = await renderViewToString(kitchenSinkView(), {}, { evaluate })

	const html = `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<title>${brand.name} — design system</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${fontLink}
<style>
${themeCss('plain')}
${componentCss()}
${kitchenSinkCss()}
body { font-family: var(--font-sans); background: var(--color-background); color: var(--color-foreground); margin: 0; -webkit-font-smoothing: antialiased; }
</style>
${body}
</html>
`
	writeFileSync(path.join(root, out), html)
	console.log(`  ${brand.name.padEnd(8)} → ${out} (${Math.round(html.length / 1024)} KB)`)
}
