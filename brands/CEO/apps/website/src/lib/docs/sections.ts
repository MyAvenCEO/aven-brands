/**
 * ceoBRAND — the docs surface, derived from the SSOT.
 *
 * Nothing here is a hand-written list of what the brand contains. Every section
 * reads the exported scales, tones and component definitions, so a token that
 * exists appears and one that does not, does not. That is the same contract the
 * generated kitchen sink holds; this is the interactive half of it.
 *
 * When the unit library lands (plan P3), the specimens below stop being ad-hoc
 * markup and become the units themselves rendered through aven-vibes. Until
 * then this reads the same source the generator does, so it cannot drift.
 */
import {
	COMPONENTS,
	ELEVATION_SCALE,
	INK_SCALE,
	LAYOUTS,
	RADIUS_SCALE,
	SPACE_SCALE,
	TINT_SCALE,
	TRACKING_SCALE,
	TYPE_SCALE
} from '@myavenceo/aven-ceo/design'
import { iconNames, icons } from '@myavenceo/aven-ceo/icons'
import {
	FONT_STACK,
	FONT_WEIGHTS,
	FUNCTIONAL,
	INK,
	ROLES,
	SURFACES,
	TONES
} from '@myavenceo/aven-ceo/tokens'
import { unitNames, units } from '@myavenceo/aven-ceo/units'
import { renderIcon } from '@myavenceo/aven-vibes'

export type SwatchRow = {
	name: string
	value: string
	cssVar: string
	/** The dark theme's value for this same role, when it overrides. */
	dark?: string
}
export type ScaleRow = { name: string; value: string; cssVar: string }

/** A CSS custom property name for a colour token, matching the generator. */
const colourVar = (name: string) => `--color-${name}`

/**
 * One row per ROLE, with both themes on it.
 *
 * `dark-foreground` is not a second token — it is the second value of
 * `foreground`, and listing it as its own row did two bad things. It doubled
 * the apparent size of the palette (ninety-two entries where there are
 * fifty-odd roles), and its swatch rendered EMPTY in the light theme, because
 * `var(--color-dark-foreground)` is not declared there: an undefined custom
 * property invalidates the declaration, so the chip fell back to transparent
 * and looked like a blank card rather than an error.
 *
 * Pairing them fixes both. A role shows what it is in each theme, and the
 * dark chip is painted from the literal value rather than from a variable that
 * only exists under the other theme.
 */
const rows = (map: Record<string, string>): SwatchRow[] => {
	const entries = Object.entries(map)
	const darkOf = new Map(
		entries.filter(([n]) => n.startsWith('dark-')).map(([n, v]) => [n.slice(5), v])
	)
	return entries
		.filter(([name]) => !name.startsWith('dark-'))
		.map(([name, value]) => ({
			name,
			value,
			cssVar: colourVar(name),
			dark: darkOf.get(name)
		}))
}

const scaleRows = (map: Record<string, string>): ScaleRow[] =>
	Object.entries(map).map(([name, value]) => ({ name, value, cssVar: `--${name}` }))

/* ── Colour ─────────────────────────────────────────────────────────────── */

export const colourGroups = [
	{
		id: 'tones',
		title: 'Tones',
		lede: 'The brand identity. Four hues — a colour here is one the logo may use.',
		rows: rows(TONES)
	},
	{
		id: 'functional',
		title: 'Functional',
		lede: 'Colours that carry a meaning and are never identity. Neither is in the logo.',
		rows: rows(FUNCTIONAL)
	},
	{
		id: 'surfaces',
		title: 'Surfaces',
		lede: 'Every rung, in both themes. The light ladder is sand, the dark is marine. The theme-neutral names a component uses are derived from these, not authored.',
		rows: rows(SURFACES)
	},
	{
		id: 'ink',
		title: 'Ink',
		lede: 'Text guaranteed to read on a filled colour. Concrete values, not derivations.',
		rows: rows(INK)
	},
	{
		id: 'roles',
		title: 'Roles',
		lede: 'What the paint MEANS. One group — the site/app split it replaced was mostly synonyms.',
		rows: rows(ROLES)
	}
] as const

/* ── Units ──────────────────────────────────────────────────────────────── */

/**
 * The library, as it actually is: leafs and composites.
 *
 * Not "components". A leaf is a unit with no slots — it renders itself and
 * nothing goes inside it. A composite has slots, so it is a shape other units
 * are placed into. That distinction is the architecture, and the docs page was
 * still showing the pre-unit vocabulary (`.card`, `.chip`, `.well`, `.mark`),
 * which is a list of class names rather than a library.
 *
 * Read from the registry rather than listed here, so a unit that exists appears
 * and one that does not, does not.
 */
export type UnitRow = {
	name: string
	kind: 'leaf' | 'composite'
	description: string
	slots: string[]
	variants: Array<{ axis: string; options: string[] }>
	states: string[]
	parts: string[]
	animates: boolean
}

const unitRow = (name: string): UnitRow => {
	const u = units[name] as {
		description?: string
		interface?: { slots?: Record<string, unknown> }
		styling?: {
			variants?: Record<string, Record<string, unknown>>
			states?: Record<string, unknown>
			parts?: Record<string, unknown>
			keyframes?: Record<string, unknown>
		}
	}
	const slots = Object.keys(u.interface?.slots ?? {})
	const styling = u.styling ?? {}
	return {
		name,
		kind: slots.length ? 'composite' : 'leaf',
		description: u.description ?? '',
		slots,
		variants: Object.entries(styling.variants ?? {}).map(([axis, options]) => ({
			axis,
			options: Object.keys(options).filter((o) => !o.startsWith('$'))
		})),
		states: Object.keys(styling.states ?? {}),
		parts: Object.keys(styling.parts ?? {}),
		animates: Boolean(styling.keyframes)
	}
}

export const unitRows: UnitRow[] = unitNames.map(unitRow)
export const leafRows = unitRows.filter((u) => u.kind === 'leaf')
export const compositeRows = unitRows.filter((u) => u.kind === 'composite')

/* ── Type ───────────────────────────────────────────────────────────────── */

export const fontStacks = Object.entries(FONT_STACK).map(([name, value]) => ({
	name,
	value: String(value)
}))

export const fontWeights = Object.entries(FONT_WEIGHTS).map(([name, value]) => ({
	name,
	value: String(value)
}))

export const typeScale = scaleRows(TYPE_SCALE)
export const trackingScale = scaleRows(TRACKING_SCALE)

/* ── Emphasis and geometry ──────────────────────────────────────────────── */

export const inkScale = scaleRows(INK_SCALE)
export const tintScale = scaleRows(TINT_SCALE)
export const elevationScale = scaleRows(ELEVATION_SCALE)
export const radiusScale = scaleRows(RADIUS_SCALE)
export const spaceScale = scaleRows(SPACE_SCALE)

/* ── Pieces ─────────────────────────────────────────────────────────────── */

/**
 * Which specimen element a component should be drawn as.
 *
 * A button-ish component needs to be a real `<button>` so its hover, focus and
 * active states work in the page; everything else is a block. Derived from the
 * name so a new component appears without anyone editing this file.
 */
export function specimenTag(name: string): 'button' | 'div' {
	return /^(btn|button|chip|ghost)/.test(name) ? 'button' : 'div'
}

export const componentNames = Object.keys(COMPONENTS)
export const layoutNames = Object.keys(LAYOUTS)

/** The declarations behind a component, for the inspector panel. */
export function declarationsOf(name: string): Array<[string, string]> {
	const decl = (COMPONENTS[name] ?? LAYOUTS[name]) as Record<string, unknown> | undefined
	if (!decl) return []
	return Object.entries(decl)
		.filter(([, v]) => typeof v === 'string')
		.map(([k, v]) => [k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`), String(v)])
}

/* ── The aside ──────────────────────────────────────────────────────────── */

export type DocSection = { id: string; label: string; count: number }

/** The logo's variants, from the unit rather than from a list kept here. */
export const logoVariants = ['lockup', 'mark', 'wordmark'] as const

/**
 * Each icon as markup, rendered by the ENGINE rather than by this page.
 *
 * The same `renderIcon` a view uses, so what the gallery shows is what a
 * component gets — a docs page that draws its own SVG would be documenting
 * itself instead of the system.
 */
export const iconMarkup = iconNames.map((name) => ({
	name,
	svg: renderIcon(name, icons, { size: '1.75rem' })
}))

export const sections: DocSection[] = [
	{ id: 'logo', label: 'Logo', count: logoVariants.length },
	{ id: 'icons', label: 'Icons', count: iconNames.length },
	{
		id: 'colour',
		label: 'Colour',
		count: colourGroups.reduce((n, g) => n + g.rows.length, 0)
	},
	{
		id: 'type',
		label: 'Typeface',
		count: typeScale.length + trackingScale.length + fontStacks.length
	},
	{ id: 'alpha', label: 'Alpha', count: inkScale.length + tintScale.length },
	{
		id: 'geometry',
		label: 'Geometry',
		count: radiusScale.length + spaceScale.length + elevationScale.length
	},
	{ id: 'library', label: 'Library', count: unitRows.length },
	{ id: 'layouts', label: 'Layouts', count: layoutNames.length }
]
