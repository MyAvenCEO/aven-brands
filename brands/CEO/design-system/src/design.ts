/**
 * THE DESIGN SYSTEM — typed access to the scales and the components.
 *
 * `tokens.ts` answers "what colour is the brand". This answers "how big, how
 * spaced, how emphatic" — and then "what IS a card". Like the palette, the
 * values now live in JSON (`src/brand/brand.avenceo.json` for the scales,
 * `src/brand/components.avenceo.json` for the pieces) and this file loads them
 * and adds types. It spells no size, no ratio and no declaration of its own.
 *
 * The scales exist because an audit of the three surfaces found no scale at
 * all. One idiom, the eyebrow, was written fourteen different ways; the type
 * ramp was thirty distinct arbitrary sizes across 378 uses, mixing units by eye
 * (`text-[0.68rem]` beside `text-[11px]`, plus `13.5px`, `1.02rem`, `2.35rem`);
 * emphasis was thirty different `text-foreground/N` values across 340 uses.
 * None of that is design — it is thirty authors each picking a number, and no
 * component vocabulary can sit on top of it.
 *
 * So the scales come first and the components are expressed in them. A value
 * that is not on a scale is not available, which is the whole point.
 *
 * Steps were chosen to ABSORB what was already on screen rather than to impose
 * a new look: each observed value maps to its nearest step (see `NEAREST_STEP`),
 * so the conversion was a rounding, not a redesign. The one place that rule was
 * broken deliberately is emphasis, where several steps were raised to where
 * they MEASURE against WCAG rather than where they looked right.
 */
import { nearestStepOn } from '@myavenceo/aven-vibes/brand'

import {
	COMPONENTS_MAP,
	type Decl,
	flatAlpha,
	flatScale,
	LAYOUTS_MAP,
	NEAREST_STEP_MAP
} from './brand-data.js'

export type { Decl }

/* ══ 1 · THE TYPE RAMP ═════════════════════════════════════════════════════
 * Twelve steps covering the 7px–38px range actually in use. Named by role at
 * the small end, where the brand does most of its talking, and by size at the
 * large end, where it only shouts occasionally. */
export const TYPE_SCALE: Record<string, string> = flatScale('type')

/* ══ 2 · TRACKING ══════════════════════════════════════════════════════════
 * Five steps for what was fourteen values between -0.03em and 0.28em. The
 * uppercase steps are the ones that mattered: `wide` is the app's eyebrow,
 * `widest` the website's, and they were never the same number.
 *
 * These names are Tailwind v4's own `--tracking-*` namespace, and taking it
 * over is DELIBERATE: it means `tracking-wide` in markup and `var(--tracking-
 * wide)` in a component definition are the same value, instead of two scales
 * that happen to share a word. The cost is that Tailwind's defaults no longer
 * apply. Worth knowing before adding a step: anything put here silently
 * redefines a Tailwind utility.
 *
 * Type is the opposite case. It deliberately does NOT use Tailwind's `--text-*`
 * namespace, because a step there would generate a utility for every name and
 * the point of the ramp is that only these twelve exist. Referencing them from
 * markup needs the explicit length hint — `text-[length:var(--fs-body)]` —
 * since `text-[var(--fs-body)]` is ambiguous between a length and a colour and
 * Tailwind silently emits NOTHING for it. */
export const TRACKING_SCALE: Record<string, string> = flatScale('tracking')

/* ══ 3 · EMPHASIS ══════════════════════════════════════════════════════════
 * Ink strength as steps rather than a continuum. Thirty different
 * `text-foreground/N` values said nothing a reader could perceive: nobody sees
 * the difference between /45 and /50, but everybody sees an inconsistent page.
 *
 * The steps are set where they PASS, not where they looked nice — the JSON
 * records the measured ratio on each. One exception, and it is deliberate:
 * `ink-faint` sits below AA because it is the disabled and watermark level,
 * WCAG 1.4.3 exempts inactive controls, and a system with no sub-AA step has
 * nowhere to put the one job that legitimately needs one. It must never carry
 * live text. */
export const INK_SCALE: Record<string, string> = flatAlpha('on-text')

/**
 * TINT — the same ink, but as a surface rather than as text.
 *
 * The audit lumped these in with emphasis and they are not the same axis: a
 * value like `/8` is a hairline border or a barely-there wash, never something
 * anyone reads. Separating them is what stops a border rounding up into a
 * legible grey.
 */
export const TINT_SCALE: Record<string, string> = flatAlpha('on-surface')

/**
 * Snap an opacity percentage to its nearest step.
 *
 * Opacity is a continuum, so "nearest" is arithmetic rather than a lookup —
 * a sixty-row table of integers would restate the same rule less legibly.
 * `role` picks the axis: text reads, surfaces do not.
 */
export function nearestAlphaStep(percent: number, role: 'ink' | 'tint'): string {
	return nearestStepOn(role === 'ink' ? INK_SCALE : TINT_SCALE, percent)
}

/* ══ 4 · ELEVATION ═════════════════════════════════════════════════════════
 * Two real shadows were in use (a hairline lift, 31 times, and a floating
 * panel, 4 times) plus noise variants that differed only in the second decimal
 * of an alpha. Three steps, all mixed from marine so elevation stays on-brand
 * rather than reaching for a neutral grey. */
export const ELEVATION_SCALE: Record<string, string> = flatScale('elevation')

/* ══ 5 · GEOMETRY ══════════════════════════════════════════════════════════ */
export const RADIUS_SCALE: Record<string, string> = flatScale('radius')
export const SPACE_SCALE: Record<string, string> = flatScale('space')

/**
 * Where every value observed on the three surfaces lands on a scale.
 *
 * The conversion table, kept as DATA so the migration was mechanical and
 * checkable rather than a judgement call per call site — and so a reviewer can
 * see exactly which pixel moved and by how much. Keys are the arbitrary values
 * found in the audit; values are the scale step that replaced them.
 *
 * Every mapping is to the NEAREST step. Thirty-one of the sixty-one mappings
 * are exact — the value was already on a step — and of the thirty that move,
 * most move by 1px or less. The largest single move is 2.4px
 * (`1.65rem` -> `fs-amount`), and that value appeared exactly once.
 *
 * Emphasis is deliberately NOT in this table: opacity is a continuum where
 * "nearest" is arithmetic, so `nearestAlphaStep` computes it instead of
 * restating the same rule across sixty rows of integers.
 */
export const NEAREST_STEP: Record<string, string> = NEAREST_STEP_MAP

/** Every scale flattened into the tokens the CSS declares. */
export const SCALE_TOKENS: Record<string, string> = {
	...TYPE_SCALE,
	...TRACKING_SCALE,
	...ELEVATION_SCALE,
	...RADIUS_SCALE,
	...SPACE_SCALE,
	...INK_SCALE,
	...TINT_SCALE
}

/* ══ 6 · THE COMPONENTS ════════════════════════════════════════════════════
 * What a card, a button, an eyebrow IS — expressed entirely in the scales and
 * roles above, so no component spells a value of its own. */
export const COMPONENTS: Record<string, Decl> = COMPONENTS_MAP

/* ══ 7 · THE LAYOUT LAYOUTS ═════════════════════════════════════════════
 * The shapes almost every layout is made of. In the unit model these become
 * the declared arrangement a composite names, rather than CSS a page writes. */
export const LAYOUTS: Record<string, Decl> = LAYOUTS_MAP

/** Primitive names, so a consumer can assert the set it renders. */
export const LAYOUT_NAMES = Object.keys(LAYOUTS)

/** The component names, so a consumer can assert the set it renders. */
export const COMPONENT_NAMES = Object.keys(COMPONENTS)
