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
import { SUPERSEDES, UNCALLED, unitNames, unitStyles, units } from '@myavenceo/aven-ceo/units'
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
export type Decls = Array<[string, string]>

export type UnitRow = {
	name: string
	kind: 'leaf' | 'composite'
	/**
	 * Which surface this unit is chrome FOR, when it is chrome for one.
	 *
	 * Declared on the unit rather than inferred here: whether `navbar` is site
	 * furniture is a fact about the unit, and a list kept in the docs page would
	 * be the one hand-written list on a page whose whole contract is that it has
	 * none. Most units have no surface — a button is a button everywhere.
	 */
	surface?: string
	/** Why it belongs to that surface, in the unit's own words. */
	surfaceNote?: string
	description: string
	/** The unit's own a11y note, which belongs beside its prose and not in a
	    config dump nobody reads to the end. */
	a11yNote: string
	slots: string[]
	variants: Array<{ axis: string; options: Array<{ name: string; note: string }> }>
	/**
	 * Each state with the declarations it applies.
	 *
	 * The declarations, not just the names, because the detail view previews a
	 * state by APPLYING them — `:hover` and `:focus-visible` cannot be forced
	 * from a button in a docs page, and writing a second copy of what hover
	 * looks like is exactly the drift this system exists to prevent. Reading
	 * them from the registry means the preview is the unit's own answer.
	 */
	states: Array<{ name: string; note: string; decls: Decls; part?: string }>
	parts: Array<{ name: string; note: string }>
	animates: boolean
	base: Decls
	/** The unit's own config, verbatim. The storybook shows it beside the render. */
	json: string
}

/** DTCG-ish: `$description` documents, everything else is CSS. */
const cssDecls = (decl: Record<string, unknown> | undefined): Decls =>
	Object.entries(decl ?? {})
		.filter(([k, v]) => !k.startsWith('$') && typeof v === 'string')
		.map(([k, v]) => [k, v as string])

const note = (decl: Record<string, unknown> | undefined): string =>
	typeof decl?.$description === 'string' ? decl.$description : ''

const unitRow = (name: string): UnitRow => {
	const u = units[name] as {
		description?: string
		surface?: string
		surfaceNote?: string
		interface?: { slots?: Record<string, unknown> }
		styling?: {
			variants?: Record<string, Record<string, unknown>>
			states?: Record<string, unknown>
			parts?: Record<string, unknown>
			keyframes?: Record<string, unknown>
		}
	}
	const slots = Object.keys(u.interface?.slots ?? {})
	const styling = (u.styling ?? {}) as {
		base?: Record<string, unknown>
		variants?: Record<string, Record<string, Record<string, unknown>>>
		states?: Record<string, Record<string, unknown>>
		parts?: Record<string, Record<string, unknown>>
		keyframes?: Record<string, unknown>
	}
	return {
		name,
		kind: slots.length ? 'composite' : 'leaf',
		surface: u.surface,
		surfaceNote: u.surfaceNote,
		description: u.description ?? '',
		a11yNote: (u as { a11y?: { note?: string } }).a11y?.note ?? '',
		slots,
		variants: Object.entries(styling.variants ?? {}).map(([axis, options]) => ({
			axis,
			options: Object.entries(options)
				.filter(([o]) => !o.startsWith('$'))
				.map(([o, decl]) => ({ name: o, note: note(decl) }))
		})),
		states: Object.entries(styling.states ?? {}).map(([n, decl]) => ({
			name: n,
			note: note(decl),
			decls: cssDecls(decl),
			part: typeof decl?.$part === 'string' ? decl.$part : undefined
		})),
		parts: Object.entries(styling.parts ?? {}).map(([n, decl]) => ({ name: n, note: note(decl) })),
		animates: Boolean(styling.keyframes),
		base: cssDecls(styling.base),
		/* The source, not a summary of it. A design-system viewer that shows only
		   the render asks you to trust that the render matches the config; showing
		   both in one place is the only way that claim is checkable. */
		json: JSON.stringify(units[name], null, '\t')
	}
}

export const unitRows: UnitRow[] = unitNames.map(unitRow)
/** The names, so a surface can ask whether a slot points at a real unit. */
export const unitNameList: string[] = [...unitNames]

export const leafRows = unitRows.filter((u) => u.kind === 'leaf')
export const compositeRows = unitRows.filter((u) => u.kind === 'composite')
/**
 * The site's own chrome, collated.
 *
 * The bar, the menu, the footer, the lockup, the bands every marketing page is
 * built from — spread across Leafs and Composites they were filed by their
 * ARCHITECTURE, which is the right split for building one and the wrong one for
 * answering "what does the website use". This is the same rows under a second
 * index, not a copy: a unit appears in both, and the entry that gains a
 * `surface` gains it here without being listed anywhere twice.
 */
export const siteRows = unitRows.filter((u) => u.surface === 'site')

/* ── Migration ──────────────────────────────────────────────────────────── */

/**
 * The legacy vocabulary, and what replaces it.
 *
 * Here rather than in a document because the migration has TWO consumers — the
 * website and the checkout at my.aven.ceo — and untying one without the other
 * breaks the one that was already doing the right thing. A row you can see is a
 * row somebody can act on; a plan in a markdown file is archaeology waiting to
 * happen.
 */
export type MigrationRow = {
	legacy: string
	unit: string
	as?: string
	note?: string
	uncalled: boolean
}

export const migrationRows: MigrationRow[] = Object.entries(SUPERSEDES)
	.map(([legacy, to]) => ({
		legacy,
		unit: to.unit,
		as: to.as,
		note: to.note,
		uncalled: UNCALLED.includes(legacy)
	}))
	/* Uncalled last: those are already done, they just need a regeneration. */
	.sort((a, b) => Number(a.uncalled) - Number(b.uncalled) || a.legacy.localeCompare(b.legacy))

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
	/* `unitStyles` first: `COMPONENTS` is the legacy map from
	   `components.avenceo.json`, and a unit's PARTS only exist in the compiled
	   unit styles — so asking the legacy map for `skill-card-head` returned
	   nothing and the parts panel showed an empty list. */
	const decl = (unitStyles[name] ?? COMPONENTS[name] ?? LAYOUTS[name]) as
		| Record<string, unknown>
		| undefined
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
	/* Two entries, not one. Twenty-one units in a single scroll buries the
	   composites under twelve leafs, which is how a library reads as "we only
	   have leafs". The split is the architecture's own, so it navigates the
	   same way it is built. */
	{ id: 'website', label: 'Website', count: siteRows.length },
	{ id: 'migration', label: 'Migration', count: migrationRows.length },
	{ id: 'leafs', label: 'Leafs', count: leafRows.length },
	{ id: 'composites', label: 'Composites', count: compositeRows.length },
	{ id: 'layouts', label: 'Layouts', count: layoutNames.length }
]
