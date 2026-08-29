/**
 * THE DOCUMENTS — this brand's JSON, and typed access to it.
 *
 * `src/brand/*.json` is the source of truth. The machinery that reads it is NOT
 * here: `flatten`, `describe`, `descriptions`, the validators and
 * `brandFromDocuments` are in `@myavenceo/aven-vibes/brand`, because every one
 * of them is the same code for any brand. This file is the part that genuinely
 * belongs to avenCEO: which documents there are, and the flat maps this
 * package's own exports are built from.
 *
 * The rule for this package, in one line: JSON holds VALUES, the engine holds
 * MACHINERY, and what is left in TypeScript here is either a type or a decision
 * avenCEO made. If you are writing a loop over tokens in this package, it
 * probably belongs in the engine instead.
 */

import type { BrandDocument, ComponentsDocument, Decl } from '@myavenceo/aven-vibes/brand'
import { flatten } from '@myavenceo/aven-vibes/brand'

import brandJson from './brand/brand.avenceo.json' with { type: 'json' }
import componentsJson from './brand/components.avenceo.json' with { type: 'json' }
import factsJson from './brand/facts.avenceo.json' with { type: 'json' }

export type { Decl }

/**
 * The raw documents, for anything that wants the JSON rather than the flat maps
 * — a Figma sync, a token pipeline, a docs surface showing `$description`.
 */
export const brandDocument = brandJson as unknown as BrandDocument
export const componentsDocument = componentsJson as unknown as ComponentsDocument

/* ── The flat maps this package's exports are built from ────────────────── */

export const colorGroups = brandDocument.color
export const scaleGroups = brandDocument.scale

export const flatColor = (group: keyof typeof brandDocument.color) =>
	flatten(brandDocument.color[group])

export const flatScale = (group: 'type' | 'tracking' | 'elevation' | 'radius' | 'space') =>
	flatten(brandDocument.scale[group])

/** The alpha floors. Nested, because they are one axis with two contrast rules. */
export const flatAlpha = (floor: 'on-text' | 'on-surface') =>
	flatten(brandDocument.scale.alpha[floor])

export const BRAND_NAME = brandDocument.name
export const BRAND_SLUG = brandDocument.slug
export const FONT_STACK_MAP = flatten(brandDocument.font.stack)
export const FONT_WEIGHT_MAP = flatten(brandDocument.font.weight)
export const RADII_MAP = flatten(brandDocument.radii)
export const VIBE_SCALE_MAP = flatten(
	(brandJson as unknown as { vibeScale: Parameters<typeof flatten>[0] }).vibeScale
)
export const APP_ICON_PLATE_VALUE = brandDocument.appIconPlate

export const COMPONENTS_MAP = componentsDocument.components
export const LAYOUTS_MAP = componentsDocument.layouts
export const NEAREST_STEP_MAP = (
	componentsJson as unknown as { nearestStep: { values: Record<string, string> } }
).nearestStep.values

/* ── The business facts ─────────────────────────────────────────────────── */

/**
 * Plans, prices and the skill catalog.
 *
 * Data, like the palette. The helpers that read them — `plan()`,
 * `priceLabel()`, `reconcile()` — are avenCEO's own policy and stay in
 * `pricing.ts` and `skills.ts`. They are deliberately NOT in the engine: a UI
 * framework must never learn what a plan is.
 */
export const factsDocument = factsJson as unknown as {
	pricing: { vatNote: string; legacyPlanIds: Record<string, string>; plans: unknown[] }
	skills: { catalog: unknown[] }
}
