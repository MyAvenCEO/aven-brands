/**
 * THE PALETTE — typed access to it. The colours themselves are in the JSON.
 *
 * Every surface used to keep its own copy: the app's `app.css`, the website's
 * `app.css` (whose header openly instructed "copy blocks 1–3 across"), and
 * `aven-ui`'s `brand.style.json`. Four files, one palette, no mechanism — so
 * the vibe layer quietly fell a typeface and two tones behind. That was fixed
 * by making this file the one place a hex was spelled.
 *
 * It is no longer that place. `src/brand/brand.avenceo.json` is, and this file
 * loads it. The reason is the same one that motivated the first consolidation,
 * one level further out: a palette readable only by running TypeScript is a
 * palette every other tool must go through a build to see. A contrast gate, a
 * Figma sync, Style Dictionary, a design tool, another language — all of them
 * can read a JSON file and none of them can read a `.ts` module. The values
 * moved; the structure, the names and the prose did not.
 *
 * One source and three generated consumers, unchanged:
 *
 *   brand.avenceo.json ─┬─→ app/src/brand-theme.css          (Tailwind @theme, the app)
 *                       ├─→ apps/website/src/brand-theme.css (Tailwind @theme, the site)
 *                       └─→ vibeTokens                       (imported by the vibe layer)
 *
 * The generated CSS is committed, so the proof that nothing drifted is that
 * re-running `bun run brand:generate` leaves `git status` clean.
 *
 * Structure follows the original four blocks: TONES (the paint), the CREAM
 * ladder, SURFACES (which rung each part stands on), and ROLES (what a colour
 * MEANS). Components speak roles — `bg-primary`, `text-error` — never tones,
 * so re-pointing a role in the JSON re-skins every surface that uses it.
 */
import { withAlpha } from '@myavenceo/aven-vibes/brand'

import {
	APP_ICON_PLATE_VALUE,
	FONT_STACK_MAP,
	FONT_WEIGHT_MAP,
	flatColor,
	RADII_MAP,
	VIBE_SCALE_MAP
} from './brand-data.js'

/* ══ 1 · THE BRAND TONES ═══════════════════════════════════════════════════
 * The paint itself. Every colour the brand owns is written EXACTLY ONCE, in
 * `brand.avenceo.json` under `color.tones`, under exactly ONE name. */
export const TONES: Record<string, string> = flatColor('tones')

/* ══ 2 · THE CREAM LADDER AND THE SURFACES ═════════════════════════════════
 * `creams` is the light ground family; `contrastInk` is the text guaranteed to
 * read on a filled tone; `surfaces` says which rung of the ladder each part of
 * a page stands on. */
/**
 * THE SURFACES — every surface a page stands on, in both themes.
 *
 * Was `SURFACES`, which named the material and could therefore only ever
 * describe one theme: a dark surface is not a cream. Keys are `<theme>-<rung>`,
 * so a theme switch re-points the five surface rungs at the other ladder
 * instead of inventing a parallel vocabulary.
 *
 * The dark ladder is DECLARED and not yet wired. Nothing renders from it until
 * `surfaces` gains a dark override, which is deliberate: a half-existing dark
 * mode is worse than none, because components start assuming it works.
 */
export const CONTRAST_INK: Record<string, string> = flatColor('contrastInk')
/** The surface colours themselves, per theme: `light-page` … `dark-ink`. */
export const GROUNDS: Record<string, string> = flatColor('grounds')

/** The theme-neutral rungs a component references: `page`, `card`, `sunken`… */
export const SURFACES: Record<string, string> = flatColor('surfaces')

/* ══ 3 · THE ROLES ═════════════════════════════════════════════════════════
 * What a colour MEANS, pointed at the tone that carries the meaning.
 *
 *   ROLE       TONE            WHERE IT SPEAKS
 *   primary    marine          buttons, the rail, the HITL frame
 *   accent     sunflower       the marketing highlight — eyebrows, lead plan
 *   quiet      anchor          held back — meta, captions, type badges
 *   progress   tidal blue      in motion
 *   success    paradise water  settled
 *   error      terracotta      something failed
 *   offer      terracotta      the BETA window — it closes
 *   warning    sunflower       careful — but nothing is broken
 *   info       earth           notice — your turn
 *   secondary  sand            the warm second action
 *
 * Each role that carries TEXT also has an `-ink` face: the same hue darkened
 * far enough to read as running copy. Those are set where they MEASURE, not
 * where they look right; the JSON records the measured ratio on the faces that
 * were once wrong.
 */
export const ROLES: Record<string, string> = flatColor('roles')

/**
 * Roles only the MARKETING site owns. The app has no marketing highlight, so
 * the gold that carries `warning` there carries emphasis here; `offer` is the
 * BETA window, which closes, and borrows the failure tone's urgency. It sits
 * opposite the gold on purpose, so an offer never reads as just a highlight.
 */
export const SITE_ROLES: Record<string, string> = flatColor('siteRoles')

/**
 * Roles only the APP owns: the muted/strong pair for every signal rather than
 * only for failure, the `evidence` family that marks where a value came from,
 * a card that is plain white rather than cream, and the sandbox preview host.
 *
 * The muted/strong pair exists because `error` had it and the others did not,
 * so a screen needing a soft success tint had nowhere in the system to get one
 * and reached for `bg-emerald-100` instead. A gap in a taxonomy does not stay
 * empty; it gets filled from outside.
 */
export const APP_ROLES: Record<string, string> = flatColor('appRoles')

/* ══ 4 · TYPE, RADII, SPACING ══════════════════════════════════════════════ */

/**
 * Font stacks. Typed with the faces the Brand contract requires by name — a
 * brand without `app` and `web` is not renderable, so a missing one should be a
 * compile error rather than an undefined creeping into a stylesheet.
 */
export const FONT_STACK = FONT_STACK_MAP as { app: string; web: string; display?: string }
export const FONT_WEIGHTS: Record<string, string> = FONT_WEIGHT_MAP
export const RADII: Record<string, string> = RADII_MAP
export const VIBE_SCALE: Record<string, string> = VIBE_SCALE_MAP

/* ══ 5 · DERIVED ═══════════════════════════════════════════════════════════
 * Below this line is a DERIVATION: a mapping this brand chose, built with the
 * engine's arithmetic. `withAlpha` is imported rather than defined because
 * arithmetic is not a brand decision. */

/**
 * The flat token map the vibe StyleEngine flattens onto `:host` (`text` →
 * `--text`).
 *
 * DERIVED from the palette rather than hand-kept, which is what let
 * `brand.style.json` drift to a retired Chillax stack, an off-palette gold
 * (`#e6b34d`) and a green (`#2e7d52`) that existed nowhere else. It stays in
 * code because it is a derivation — a mapping plus alpha arithmetic — and not a
 * set of values someone chose.
 */
export const vibeTokens: Record<string, string> = {
	'font-sans': FONT_STACK.app,
	'font-mono': FONT_STACK.app,

	ink: TONES.marine,
	text: TONES.marine,
	muted: withAlpha(TONES.marine, 0.56),
	'muted-strong': withAlpha(TONES.marine, 0.72),

	'bg-a': GROUNDS['light-raised'],
	surface: withAlpha(CONTRAST_INK.white, 0.42),
	'surface-2': withAlpha(CONTRAST_INK.white, 0.55),
	'surface-raised': withAlpha(CONTRAST_INK.white, 0.55),

	border: withAlpha(TONES.marine, 0.14),
	'border-soft': withAlpha(TONES.marine, 0.08),
	'border-strong': withAlpha(TONES.marine, 0.2),

	primary: TONES.marine,
	'primary-foreground': GROUNDS['dark-ink'],
	secondary: TONES.sand,
	'secondary-foreground': TONES.marine,
	'brand-accent': TONES.sunflower,

	ok: TONES.turquoise,
	warn: TONES.earth,
	danger: TONES.terracotta,

	'tech-fill': withAlpha(CONTRAST_INK.white, 0.45),
	'tech-fill-inner': withAlpha(CONTRAST_INK.white, 0.66),
	'hitl-dash': withAlpha(TONES.marine, 0.16),

	...VIBE_SCALE
}

/** The plate an app icon is drawn on — a brand cream, not a fifth one. */
export const APP_ICON_PLATE: string = APP_ICON_PLATE_VALUE

/** Re-exported so existing importers of this package keep resolving. */
export { withAlpha }
