/**
 * THE LOADER — the only place that reads the brand JSON.
 *
 * `src/brand/*.json` is the source of truth. This file is the machine that
 * reads it: it flattens DTCG `{ $type, $value }` groups into the flat
 * `Record<string, string>` maps the generator, the utility scanner and the
 * kitchen sink already consume, and it adds the types TypeScript callers want.
 *
 * The split is deliberate and is the rule for this package: JSON holds VALUES,
 * TypeScript holds MACHINERY. A hex, a size, a component's declarations are
 * data and live in the JSON. A function that derives one token from another
 * (`withAlpha`, `vibeTokens`, `nearestAlphaStep`) is machinery and lives in
 * code. If you find yourself typing a colour into a `.ts` file in this package,
 * it belongs in the JSON instead.
 *
 * Why it matters beyond tidiness: the palette used to be readable only by
 * running TypeScript. Every other consumer — a Figma sync, Style Dictionary,
 * a contrast gate, a design tool, another language — had to go through a build
 * to see a hex. Now they read a file.
 */
import type { Decl } from '@myavenceo/aven-vibes/brand'

import brandJson from './brand/brand.avenceo.json' with { type: 'json' }
import componentsJson from './brand/components.avenceo.json' with { type: 'json' }

export type { Decl }

/** A DTCG token as it appears in the JSON. */
type DtcgToken = { $type?: string; $value: string | number; $description?: string }

/** A DTCG group: named tokens, plus an optional `$description` of the group. */
type DtcgGroup = { $description?: string } & Record<string, DtcgToken | string | undefined>

/**
 * Flatten one DTCG group to `name -> value`.
 *
 * `$description` keys are group prose, not tokens, and are skipped. Values are
 * stringified because everything downstream emits CSS, where `0.65` and
 * `"0.65"` are the same thing and the generator only ever concatenates.
 */
export function flatten(group: DtcgGroup): Record<string, string> {
	const out: Record<string, string> = {}
	for (const [name, token] of Object.entries(group)) {
		if (name.startsWith('$') || token === undefined) continue
		if (typeof token === 'string') {
			out[name] = token
			continue
		}
		out[name] = String(token.$value)
	}
	return out
}

/** The prose attached to a group, for tooling that wants to show it. */
export function describe(group: DtcgGroup): string | undefined {
	return group.$description
}

/** Every `$description` in a group, keyed by token name. */
export function descriptions(group: DtcgGroup): Record<string, string> {
	const out: Record<string, string> = {}
	for (const [name, token] of Object.entries(group)) {
		if (name.startsWith('$') || token === undefined || typeof token === 'string') continue
		if (token.$description) out[name] = token.$description
	}
	return out
}

/* ── The parsed documents ───────────────────────────────────────────────── */

const brandDoc = brandJson as unknown as {
	name: string
	slug: string
	color: Record<string, DtcgGroup>
	font: { stack: DtcgGroup; weight: DtcgGroup }
	radii: DtcgGroup
	vibeScale: DtcgGroup
	scale: Record<string, DtcgGroup>
	appIconPlate: string
}

const componentsDoc = componentsJson as unknown as {
	components: Record<string, Decl>
	primitives: Record<string, Decl>
	nearestStep: { values: Record<string, string> }
}

/**
 * The raw documents, for anything that wants the JSON rather than the flat maps
 * — a Figma sync, a token pipeline, a docs surface showing `$description`.
 */
export const brandDocument = brandDoc
export const componentsDocument = componentsDoc

/* ── The flat maps every existing consumer expects ──────────────────────── */

export const colorGroups = brandDoc.color
export const scaleGroups = brandDoc.scale

export const flatColor = (group: string): Record<string, string> =>
	flatten(brandDoc.color[group] ?? {})

export const flatScale = (group: string): Record<string, string> =>
	flatten(brandDoc.scale[group] ?? {})

export const BRAND_NAME = brandDoc.name
export const BRAND_SLUG = brandDoc.slug
export const FONT_STACK_MAP = flatten(brandDoc.font.stack)
export const FONT_WEIGHT_MAP = flatten(brandDoc.font.weight)
export const RADII_MAP = flatten(brandDoc.radii)
export const VIBE_SCALE_MAP = flatten(brandDoc.vibeScale)
export const APP_ICON_PLATE_VALUE = brandDoc.appIconPlate

export const COMPONENTS_MAP = componentsDoc.components
export const PRIMITIVES_MAP = componentsDoc.primitives
export const NEAREST_STEP_MAP = componentsDoc.nearestStep.values
