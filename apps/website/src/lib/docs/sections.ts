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
	PRIMITIVES,
	RADIUS_SCALE,
	SPACE_SCALE,
	TINT_SCALE,
	TRACKING_SCALE,
	TYPE_SCALE
} from '@myavenceo/aven-ceo/design'
import {
	CREAMS,
	FONT_STACK,
	FONT_WEIGHTS,
	ROLES,
	SITE_ROLES,
	SURFACES,
	TONES
} from '@myavenceo/aven-ceo/tokens'

export type SwatchRow = { name: string; value: string; cssVar: string }
export type ScaleRow = { name: string; value: string; cssVar: string }

/** A CSS custom property name for a colour token, matching the generator. */
const colourVar = (name: string) => `--color-${name}`

const rows = (map: Record<string, string>): SwatchRow[] =>
	Object.entries(map).map(([name, value]) => ({ name, value, cssVar: colourVar(name) }))

const scaleRows = (map: Record<string, string>): ScaleRow[] =>
	Object.entries(map).map(([name, value]) => ({ name, value, cssVar: `--${name}` }))

/* ── Colour ─────────────────────────────────────────────────────────────── */

export const colourGroups = [
	{
		id: 'tones',
		title: 'Tones',
		lede: 'The paint. Every brand colour spelled exactly once.',
		rows: rows(TONES)
	},
	{
		id: 'creams',
		title: 'Creams',
		lede: 'The light ground family every surface stands on.',
		rows: rows(CREAMS)
	},
	{
		id: 'surfaces',
		title: 'Surfaces',
		lede: 'Which rung of the page each region sits on.',
		rows: rows(SURFACES)
	},
	{
		id: 'roles',
		title: 'Roles',
		lede: 'What the paint MEANS. Shared by every surface.',
		rows: rows(ROLES)
	},
	{
		id: 'site-roles',
		title: 'Site roles',
		lede: 'Roles only the marketing site owns.',
		rows: rows(SITE_ROLES)
	}
] as const

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
export const primitiveNames = Object.keys(PRIMITIVES)

/** The declarations behind a component, for the inspector panel. */
export function declarationsOf(name: string): Array<[string, string]> {
	const decl = (COMPONENTS[name] ?? PRIMITIVES[name]) as Record<string, unknown> | undefined
	if (!decl) return []
	return Object.entries(decl)
		.filter(([, v]) => typeof v === 'string')
		.map(([k, v]) => [k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`), String(v)])
}

/* ── The aside ──────────────────────────────────────────────────────────── */

export type DocSection = { id: string; label: string; count: number }

export const sections: DocSection[] = [
	{
		id: 'colour',
		label: 'Colour',
		count: colourGroups.reduce((n, g) => n + g.rows.length, 0)
	},
	{
		id: 'type',
		label: 'Type',
		count: typeScale.length + trackingScale.length + fontStacks.length
	},
	{ id: 'emphasis', label: 'Emphasis', count: inkScale.length + tintScale.length },
	{
		id: 'geometry',
		label: 'Geometry',
		count: radiusScale.length + spaceScale.length + elevationScale.length
	},
	{ id: 'components', label: 'Components', count: componentNames.length },
	{ id: 'primitives', label: 'Primitives', count: primitiveNames.length }
]
