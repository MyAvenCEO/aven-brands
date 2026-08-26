#!/usr/bin/env bun
/**
 * Derive this site's brand files from the avenYMA definition.
 *
 * The same three-line script the avenCEO site runs, pointed at a different
 * brand. That it is the same script is the point — nothing about generating a
 * design system is specific to whose design system it is.
 */
import { writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { componentCss, elementCss, themeCss } from '@myavenceo/aven-yma/generate'

const here = path.dirname(fileURLToPath(import.meta.url))
const src = path.resolve(here, '../src')

for (const [file, css] of [
	['brand-theme.css', themeCss('web')],
	['brand-components.css', componentCss()],
	['brand-elements.css', elementCss()]
] as const) {
	writeFileSync(path.join(src, file), css)
	console.log(`  wrote src/${file}`)
}
