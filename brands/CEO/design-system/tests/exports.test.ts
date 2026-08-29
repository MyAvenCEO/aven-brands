import { describe, expect, test } from 'bun:test'
import * as design from '../src/design.js'
import * as generate from '../src/generate.js'
import * as kitchenSink from '../src/kitchen-sink.js'
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
		const css = generate.elementCss()
		for (const selector of ['h1', 'button', 'label']) {
			expect(css).toContain(`${selector} {`)
		}
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
		   without resolving CSS cannot check them either. */
		for (const value of [
			...Object.values(tokens.TONES),
			...Object.values(tokens.FUNCTIONAL),
			...Object.values(tokens.SURFACES),
			...Object.values(tokens.INK)
		]) {
			expect(value).toMatch(/^#[0-9a-f]{6}$/i)
		}
	})
})

describe('the kitchen sink surface', () => {
	test('exports a view and its styling', () => {
		expect(typeof kitchenSink.kitchenSinkView).toBe('function')
		expect(typeof kitchenSink.kitchenSinkCss).toBe('function')
	})

	test('the view names every component and layout somewhere', () => {
		const serialised = JSON.stringify(kitchenSink.kitchenSinkView())
		for (const name of [...design.COMPONENT_NAMES, ...design.LAYOUT_NAMES]) {
			expect(serialised).toContain(name)
		}
	})
})
