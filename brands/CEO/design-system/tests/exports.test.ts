import { describe, expect, test } from 'bun:test'
import * as actorsModule from '../src/actors.js'
import * as design from '../src/design.js'
import * as generate from '../src/generate.js'
import * as tokens from '../src/tokens.js'

/**
 * The public surface, pinned.
 *
 * Consumers in two other repositories import these by name, and a missing
 * export does not fail here — it fails in someone else's build, after publish,
 * as `SyntaxError: Export named 'x' not found`. That is exactly what happened
 * to `elementCss`: it was deleted as collateral when a neighbouring function
 * was removed, shipped in 0.4.0, and surfaced only when the id service could
 * not generate its stylesheet.
 *
 * A test that simply lists the names is dull, and that is the point: deleting
 * an export now requires deleting a line here, which is a decision rather than
 * an accident.
 */

describe('the generate surface', () => {
	test('emits every stylesheet its consumers ask for', () => {
		for (const name of ['themeCss', 'componentCss', 'elementCss', 'appIconSvg', 'faviconSvg']) {
			expect(typeof (generate as Record<string, unknown>)[name]).toBe('function')
		}
	})

	test('each theme variant produces CSS', () => {
		for (const variant of ['app', 'web', 'plain'] as const) {
			const css = generate.themeCss(variant)
			expect(css).toContain('--color-marine')
			// balanced, or a consumer inherits a broken cascade
			expect((css.match(/\{/g) ?? []).length).toBe((css.match(/\}/g) ?? []).length)
		}
	})

	test('the plain variant carries no @theme rule, for surfaces without Tailwind', () => {
		const lines = generate.themeCss('plain').split('\n')
		expect(lines.some((l) => l.trimStart().startsWith('@theme'))).toBe(false)
	})

	test('element defaults cover the tags a class-free surface styles', () => {
		/*
		 * `button` only, and that is the whole list on purpose.
		 *
		 * `h1` and `label` were also here, pointing at `title` and `label` in the
		 * superseded components map. That map is deleted — every surface renders
		 * from actors now — and pointing an element default at a name that no
		 * longer exists emitted nothing while the test still passed on the two
		 * that did.
		 *
		 * A class-free heading is `prose`'s job: it styles `h1` through `h3`, `p`,
		 * lists, links and code inside its own box, which is what a class-free
		 * surface actually is. A bare `<button>` is different — it appears in
		 * third-party and native markup nobody wraps — so it keeps a default, and
		 * that default is the `btn` actor.
		 */
		const css = generate.elementCss()
		expect(css).toContain('button {')
	})
})

describe('the design surface', () => {
	test('exports the scales and the vocabularies', () => {
		for (const name of [
			'TYPE_SCALE',
			'TRACKING_SCALE',
			'INK_SCALE',
			'TINT_SCALE',
			'ELEVATION_SCALE',
			'RADIUS_SCALE',
			'SPACE_SCALE',
			'COMPONENTS',
			'LAYOUTS',
			'COMPONENT_NAMES',
			'LAYOUT_NAMES',
			'NEAREST_STEP'
		]) {
			expect((design as Record<string, unknown>)[name]).toBeDefined()
		}
	})

	test('every component and layout is emitted as a rule', () => {
		const css = generate.componentCss()
		for (const name of [...design.COMPONENT_NAMES, ...design.LAYOUT_NAMES]) {
			expect(css).toContain(`.${name} {`)
		}
	})

	test('every value in the migration table lands on a real step', () => {
		const steps = new Set([
			...Object.keys(design.TYPE_SCALE),
			...Object.keys(design.TRACKING_SCALE)
		])
		for (const target of Object.values(design.NEAREST_STEP)) {
			expect(steps.has(target)).toBe(true)
		}
	})
})

describe('the brand surface', () => {
	test('every primitive is a hex, so a consumer can render it without a browser', () => {
		/* Surfaces and ink joined this list when the palette stopped deriving its
		   own values with `color-mix`: a system that cannot state its own colours
		   without resolving CSS cannot check them either.
		
		   Eight digits are allowed as well as six, and only just. An alpha in a
		   token is normally the bug this whole palette was cleaned up to remove —
		   it describes a RELATIONSHIP to whatever is behind it, and that
		   relationship inverts between themes. The exception is text over media,
		   where the backdrop is a photograph and therefore genuinely unknown: the
		   hero's scrim and text-shadow carry the contrast, and the ink's alpha is
		   the difference between its three lines. It is still a hex, so a consumer
		   can still resolve it without a browser, which is what this test is for. */
		for (const value of [
			...Object.values(tokens.TONES),
			...Object.values(tokens.FUNCTIONAL),
			...Object.values(tokens.SURFACES),
			...Object.values(tokens.INK)
		]) {
			expect(value).toMatch(/^#[0-9a-f]{6}([0-9a-f]{2})?$/i)
		}
	})
})

describe('the unit registry', () => {
	test('every unit compiles to at least its own class', () => {
		/* Replaces the kitchen-sink checks. That page was a committed HTML file
		   generated from the brand, and it could go stale between a change and a
		   regeneration — which it did. The storybook at /docs/brand reads this
		   registry directly, so there is nothing to keep in sync. */
		const css = generate.componentCss()
		for (const name of Object.keys(actorsModule.actors)) {
			expect(css).toContain(`.${name} {`)
		}
	})

	test('a unit with parts emits every one of them', () => {
		const css = generate.componentCss()
		for (const [name, unit] of Object.entries(actorsModule.actors)) {
			for (const part of Object.keys(unit.styling?.parts ?? {})) {
				expect(css).toContain(`.${name}-${part} {`)
			}
		}
	})
})

describe('the icon surface', () => {
	test('every registered icon survives the engine validator', async () => {
		/* The validator runs at module load, so importing IS the assertion — but
		   only if the import happens somewhere. Before this test it happened only
		   on a page that used an icon, which meant a malformed one shipped and
		   failed in a browser rather than here. */
		const { icons, iconNames } = await import('../src/icons.js')
		expect(iconNames.length).toBeGreaterThan(0)
		for (const name of iconNames) expect(icons[name].paths.length).toBeGreaterThan(0)
	})

	test('no icon carries its own colour, so one file serves both themes', async () => {
		const { icons } = await import('../src/icons.js')
		expect(JSON.stringify(icons)).not.toMatch(/#[0-9a-f]{3,6}|fill=|rgb\(/i)
	})
})
