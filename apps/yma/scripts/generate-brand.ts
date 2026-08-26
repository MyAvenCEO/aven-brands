#!/usr/bin/env bun
/**
 * Derive this site's brand files from the avenYMA definition.
 *
 * The same three-line script the avenCEO site runs, pointed at a different
 * brand. That it is the same script is the point — nothing about generating a
 * design system is specific to whose design system it is.
 */
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { componentCss, elementCss, faviconSvg, themeCss } from '@myavenceo/aven-yma/generate'

const here = path.dirname(fileURLToPath(import.meta.url))
const src = path.resolve(here, '../src')
const stat = path.resolve(here, '../static')

for (const [file, css] of [
	['brand-theme.css', themeCss('web')],
	['brand-components.css', componentCss()],
	['brand-elements.css', elementCss()]
] as const) {
	writeFileSync(path.join(src, file), css)
	console.log(`  wrote src/${file}`)
}

/*
 * The mark comes from the BRAND, not from a copy in this site's static folder.
 *
 * It sat in both, which is the same drift the palette used to have: edit one and
 * the other is quietly a different logo. The package owns it; the site takes a
 * copy at build time and the copy is regenerated, so it cannot disagree.
 */
mkdirSync(path.join(stat, 'images'), { recursive: true })
copyFileSync(
	fileURLToPath(import.meta.resolve('@myavenceo/aven-yma/assets/logo.svg')),
	path.join(stat, 'images/yma_logo.svg')
)
console.log('  wrote static/images/yma_logo.svg')

const logo = readFileSync(
	fileURLToPath(import.meta.resolve('@myavenceo/aven-yma/assets/logo.svg')),
	'utf8'
)
writeFileSync(path.join(stat, 'favicon.svg'), faviconSvg(logo))
console.log('  wrote static/favicon.svg')
