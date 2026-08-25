#!/usr/bin/env bun
/**
 * Regenerate every derived brand file in THIS repo from `src/tokens.ts`.
 *
 *   bun run brand:generate
 *
 * Writes the two icon primitives the package owns, then the website's theme and
 * favicon. avenOS runs its own thin script against the same exported generators
 * (`@myavenceo/aven-ceo/generate`) so both repos emit identical shapes.
 *
 * Everything written here is committed. `git status` staying clean after a run
 * IS the proof that no surface has drifted from the palette.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { appIconSvg, faviconSvg, themeCss } from '../src/generate.js'

const pkgDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const repoRoot = path.resolve(pkgDir, '../..')
const assets = path.join(pkgDir, 'assets')

const logo = readFileSync(path.join(assets, 'logo.svg'), 'utf8')

/**
 * [absolute path, contents] — written only when changed, so mtimes stay put.
 *
 * `static/aven-logo.svg` is a COPY of the package's logo on purpose: the header,
 * the footer and the app's dashboard all reference it by URL (`/aven-logo.svg`),
 * and re-pointing every one of those at a bundled import would be a far larger
 * change than keeping one generated file honest. It is emitted here, so an edit
 * to the copy is reverted by the next run rather than becoming a fourth variant.
 */
const outputs: Array<[string, string]> = [
	[path.join(assets, 'app-icon.svg'), appIconSvg(logo)],
	[path.join(assets, 'favicon.svg'), faviconSvg(logo)],
	[path.join(repoRoot, 'apps/website/src/brand-theme.css'), themeCss('web')],
	[path.join(repoRoot, 'apps/website/static/favicon.svg'), faviconSvg(logo)],
	[path.join(repoRoot, 'apps/website/static/aven-logo.svg'), logo]
]

let changed = 0
for (const [file, contents] of outputs) {
	let previous: string | null = null
	try {
		previous = readFileSync(file, 'utf8')
	} catch {
		previous = null
	}
	if (previous === contents) continue
	writeFileSync(file, contents)
	changed += 1
	console.log(`  wrote ${path.relative(repoRoot, file)}`)
}

console.log(changed === 0 ? 'brand: already in sync' : `brand: regenerated ${changed} file(s)`)
