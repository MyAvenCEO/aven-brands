/**
 * THE PALETTE — the one place in the whole brand where a colour is spelled.
 *
 * Every surface used to keep its own copy: the app's `app.css`, the website's
 * `app.css` (whose header openly instructed "copy blocks 1–3 across"), and
 * `aven-ui`'s `brand.style.json`. Four files, one palette, no mechanism — so
 * the vibe layer quietly fell a typeface and two tones behind.
 *
 * Now there is one source and three generated consumers:
 *
 *   tokens.ts ─┬─→ app/src/brand-theme.css        (Tailwind @theme, the app)
 *              ├─→ apps/website/src/brand-theme.css (Tailwind @theme, the site)
 *              └─→ vibeTokens                      (imported by aven-ui directly)
 *
 * The generated CSS is committed, so the proof that nothing drifted is that
 * re-running `bun run brand:generate` leaves `git status` clean.
 *
 * Structure follows the original four blocks: TONES (the paint), the CREAM
 * ladder, SURFACES (which rung each part stands on), and ROLES (what a colour
 * MEANS). Components speak roles — `bg-primary`, `text-error` — never tones,
 * so re-pointing a role below re-skins every surface that uses it.
 */

/* ══ 1 · THE BRAND TONES ═══════════════════════════════════════════════════
 * The paint itself. Every colour the brand owns is written EXACTLY ONCE,
 * here, under exactly ONE name. Nothing below this block spells a hex. */
export const TONES = {
	/* Row one — the cool half: the brand's own colours, deepest first. */
	marine: '#1e293b', // deep navy — the brand's ink and its fill
	anchor: '#57789e', // steel blue, off the violet side — everything held back
	'tidal-blue': '#2489a0', // teal-blue — work in motion
	'paradise-water': '#449c94', // turquoise — the bright note; settled work
	/* Row two — the warm half: the signals. */
	terracotta: '#c15b40', // burnt orange — the failure tone
	sunflower: '#d2a24a', // clean gold — the brand's highlight
	earth: '#d4a373', // warm amber-tan — notice
	sand: '#f3e7c6', // cream yellow — the warm fill
	chalk: '#f8fafc', // near-white — text on a dark tone
	ink: '#1f2a3d' // dark slate-blue — body copy, never pure black
} as const

/**
 * The cream family, lightest to warmest. Four rungs, four names.
 *
 * `linen` — the page ground — was `#f8f6ef` and read as cream rather than sand.
 * Lifted to `#faf9f4`: +2 on red and green, +5 on blue. The blue channel rising
 * faster is what takes the yellow out, so the page lightens and cools slightly
 * without leaving the warm family the rest of the ladder belongs to.
 */
export const CREAMS = {
	porcelain: '#fffdf7', // the raised card — lightest, lifts off the page
	linen: '#faf9f4', // the page ground everything rests on
	eggshell: '#f6f3e8', // one step warmer — panels, hover
	ivory: '#f6f1e2' // warmest — cards at rest, and selection
} as const

/**
 * Foregrounds that are deliberately NOT tones: text placed on a coloured fill,
 * tuned per fill for contrast rather than pulled from the palette.
 */
export const CONTRAST_INK = {
	'success-foreground': '#fafaf9',
	'warning-foreground': '#2b2313',
	'error-foreground': '#fffefb',
	'info-foreground': '#2b231c',
	white: '#ffffff'
} as const

/* ══ 2 · THE SURFACES ══════════════════════════════════════════════════════
 * Which rung of the cream family each part of the page stands on. */
export const SURFACES: Record<string, string> = {
	'surface-raised': 'var(--color-porcelain)',
	'surface-cream': 'var(--color-linen)',
	'surface-soft': 'var(--color-eggshell)',
	'surface-card': 'var(--color-ivory)',
	/* A card the user has chosen. Every list in the app has a selected row, and
	   none of them could name its colour. */
	'surface-card-selected': 'var(--color-sand)',
	/* The page ground, under its role name. It lived as a literal line in the
	   generator, which put one colour outside the maps the utilities derive from
	   — so `bg-background` resolved to a variable that was never declared. */
	background: 'var(--color-surface-cream)',
	/* A card under the pointer. Its absence is why four screens reached past the
	   system for a hover tint of their own. */
	'surface-card-hover': 'var(--color-eggshell)'
}

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
 */
export const ROLES: Record<string, string> = {
	primary: 'var(--color-marine)',
	'primary-foreground': 'var(--color-chalk)',

	quiet: 'var(--color-anchor)',
	'quiet-foreground': 'var(--color-chalk)',
	'quiet-ink': 'color-mix(in oklab, var(--color-anchor) 82%, black)',

	progress: 'var(--color-tidal-blue)',
	'progress-foreground': 'var(--color-chalk)',
	'progress-ink': 'var(--color-tidal-blue)',

	success: 'var(--color-paradise-water)',
	'success-foreground': CONTRAST_INK['success-foreground'],
	'success-ink': 'var(--color-paradise-water)',

	warning: 'var(--color-sunflower)',
	'warning-foreground': CONTRAST_INK['warning-foreground'],
	'warning-ink': 'color-mix(in oklab, var(--color-sunflower) 74%, black)',

	error: 'var(--color-terracotta)',
	'error-foreground': CONTRAST_INK['error-foreground'],
	'error-ink': 'color-mix(in oklab, var(--color-terracotta) 85%, black)',

	info: 'var(--color-earth)',
	'info-foreground': CONTRAST_INK['info-foreground'],
	'info-ink': 'color-mix(in oklab, var(--color-earth) 72%, black)',

	secondary: 'var(--color-sand)',
	'secondary-foreground': 'var(--color-marine)',

	foreground: 'var(--color-ink)',
	'card-foreground': 'var(--color-foreground)',

	muted: 'color-mix(in srgb, var(--color-marine) 6%, var(--color-surface-cream))',
	'muted-foreground': 'color-mix(in srgb, var(--color-marine) 42%, transparent)',

	border: 'color-mix(in srgb, var(--color-marine) 14%, transparent)',
	input: `color-mix(in srgb, ${CONTRAST_INK.white} 65%, var(--color-surface-cream))`
}

/**
 * Roles only the MARKETING site owns. The app has no marketing highlight, so
 * the gold that carries `warning` there carries emphasis here; `offer` is the
 * BETA window, which closes, and borrows the failure tone's urgency. It sits
 * opposite the gold on purpose, so an offer never reads as just a highlight.
 *
 * The two `-ink` faces darken further than their app counterparts (72%/88% vs
 * warning's 74% and error's 85%) because marketing copy sets them as running
 * text on cream, where the raw tones are too light to read.
 */
export const SITE_ROLES: Record<string, string> = {
	accent: 'var(--color-sunflower)',
	'accent-foreground': CONTRAST_INK['warning-foreground'],
	'accent-ink': 'color-mix(in oklab, var(--color-sunflower) 72%, black)',
	offer: 'var(--color-terracotta)',
	'offer-foreground': CONTRAST_INK['error-foreground'],
	'offer-ink': 'color-mix(in oklab, var(--color-terracotta) 88%, black)',
	/* The site's cards sit on the raised cream; the app's are plain white. */
	card: 'var(--color-surface-raised)'
}

/**
 * Roles only the APP owns: two extra faces of `error` used by the intent list,
 * the sandbox preview host, and a card that is plain white rather than cream.
 */
export const APP_ROLES: Record<string, string> = {
	/*
	 * muted / strong, for every signal rather than only for failure.
	 *
	 * `error` had the pair and the others did not, so a screen needing a soft
	 * success tint had nowhere in the system to get one and reached for
	 * `bg-emerald-100` instead. A gap in a taxonomy does not stay empty; it gets
	 * filled from outside.
	 */
	'error-muted': 'color-mix(in oklab, var(--color-terracotta) 22%, white)',
	'error-strong': 'color-mix(in oklab, var(--color-terracotta) 78%, black)',
	'success-muted': 'color-mix(in oklab, var(--color-paradise-water) 22%, white)',
	'success-strong': 'color-mix(in oklab, var(--color-paradise-water) 78%, black)',
	'warning-muted': 'color-mix(in oklab, var(--color-sunflower) 22%, white)',
	'warning-strong': 'color-mix(in oklab, var(--color-sunflower) 78%, black)',
	'info-muted': 'color-mix(in oklab, var(--color-earth) 22%, white)',
	'info-strong': 'color-mix(in oklab, var(--color-earth) 78%, black)',

	/*
	 * EVIDENCE — where a value came from.
	 *
	 * The grounding markers: the box drawn over a region of a scanned invoice,
	 * the highlight behind a matched span of text, the badge counting the finds.
	 * It is not a signal — nothing succeeded or failed — so it belongs to none of
	 * the roles above, which is why four files invented an amber of their own.
	 *
	 * Sunflower already carries this job in the palette, where it is described as
	 * the brand's highlight. This names that use.
	 */
	evidence: 'var(--color-sunflower)',
	'evidence-soft': 'color-mix(in oklab, var(--color-sunflower) 26%, white)',
	'evidence-ink': 'color-mix(in oklab, var(--color-sunflower) 76%, black)',
	card: CONTRAST_INK.white,
	/* Preview host behind the sandbox iframe — slight contrast vs. the card. */
	'sandbox-host': 'color-mix(in srgb, var(--color-background) 94%, var(--color-foreground))'
}

/* ══ 4 · TYPE, RADII, SPACING ══════════════════════════════════════════════ */

/**
 * The site self-hosts two faces: `Google Sans Flex` carries body, UI and
 * badges, and `FogtwoNo5` is the dedicated display face for titles. Both are
 * served locally (no remote font CDN). `--font-display` is its own token so
 * the title face can move in one line; `--font-serif`/`--font-mono` inherit
 * the body stack until a brand brings a dedicated face back.
 *
 * `app` keeps the self-hosted `InterVariable` (avenOS); only the `web` surface
 * moved to Google Sans Flex. `display` is shared across surfaces — its stack
 * falls back through Google Sans Flex → Inter for any surface without the file.
 */
export const FONT_STACK = {
	app: '"InterVariable", ui-sans-serif, system-ui, -apple-system, sans-serif',
	web: '"Google Sans Flex", "Inter", ui-sans-serif, system-ui, -apple-system, sans-serif',
	display: '"FogtwoNo5", "Google Sans Flex", "Inter", ui-sans-serif, system-ui, sans-serif'
} as const

export const FONT_WEIGHTS: Record<string, string> = {
	'font-weight-medium': '500',
	'font-weight-semibold': '600',
	'font-weight-bold': '700'
}

export const RADII: Record<string, string> = {
	'radius-lg': '1rem',
	'radius-xl': '1.5rem',
	'radius-2xl': '2rem',
	'radius-full': '9999px'
}

/**
 * The vibe layer's own scale — card radii, paddings, gaps and the type ramp,
 * codified from the canonical reference card (GoalsDashboard "cashflow / your
 * climb"). Only `aven-ui` consumes these; Tailwind covers the same ground for
 * the app and site through its own utilities.
 */
export const VIBE_SCALE: Record<string, string> = {
	'radius-card': '1.5rem',
	'radius-inner': '0.75rem',
	'radius-chip': '0.5rem',
	'radius-pill': '9999px',
	'radius-2xl': '1.5rem',
	'radius-md': '0.75rem',

	'pad-card': '1.5rem',
	'pad-card-sm': '1rem 1.25rem',
	'pad-chip': '0.5rem 0.75rem',

	'gap-section': '1.5rem',
	gap: '0.75rem',
	'gap-tight': '0.5rem',

	'max-w': '56rem',

	'fs-micro': '10px',
	'fs-eyebrow': '11px',
	'fs-label': '11px',
	'fs-meta': '12px',
	'fs-body': '13px',
	'fs-section': '0.875rem',
	'fs-title': '0.9375rem',
	'fs-lead': '1.0625rem',
	'fs-hero': '1.25rem',
	'fs-amount': '1.5rem',

	'tracking-eyebrow': '0.08em',
	'tracking-tight': '-0.02em'
}

/* ══ 5 · DERIVED HELPERS ═══════════════════════════════════════════════════ */

/** `#1f2a3d` + 0.56 → `rgba(31, 42, 61, 0.56)`. Used to build the vibe tokens. */
export function withAlpha(hex: string, alpha: number): string {
	const h = hex.replace('#', '')
	const full =
		h.length === 3
			? h
					.split('')
					.map((c) => c + c)
					.join('')
			: h
	const channel = (i: number) => Number.parseInt(full.slice(i, i + 2), 16)
	return `rgba(${channel(0)}, ${channel(2)}, ${channel(4)}, ${alpha})`
}

/**
 * The flat token map `aven-ui`'s StyleEngine flattens onto `:host` (`text` →
 * `--text`). Built from the palette above rather than hand-kept, which is what
 * let `brand.style.json` drift to a retired Chillax stack, an off-palette gold
 * (`#e6b34d`) and a green (`#2e7d52`) that existed nowhere else.
 */
export const vibeTokens: Record<string, string> = {
	'font-sans': FONT_STACK.app,
	'font-mono': FONT_STACK.app,

	ink: TONES.ink,
	text: TONES.ink,
	muted: withAlpha(TONES.ink, 0.56),
	'muted-strong': withAlpha(TONES.ink, 0.72),

	'bg-a': CREAMS.linen,
	surface: withAlpha(CONTRAST_INK.white, 0.42),
	'surface-2': withAlpha(CONTRAST_INK.white, 0.55),
	'surface-raised': withAlpha(CONTRAST_INK.white, 0.55),

	border: withAlpha(TONES.ink, 0.14),
	'border-soft': withAlpha(TONES.ink, 0.08),
	'border-strong': withAlpha(TONES.ink, 0.2),

	primary: TONES.marine,
	'primary-foreground': TONES.chalk,
	secondary: TONES.sand,
	'secondary-foreground': TONES.marine,
	'brand-accent': TONES.sunflower,

	ok: TONES['paradise-water'],
	warn: TONES.earth,
	danger: TONES.terracotta,

	'tech-fill': withAlpha(CONTRAST_INK.white, 0.45),
	'tech-fill-inner': withAlpha(CONTRAST_INK.white, 0.66),
	'hitl-dash': withAlpha(TONES.ink, 0.16),

	...VIBE_SCALE
}

/** The plate an app icon is drawn on — a brand cream, not a fifth one. */
export const APP_ICON_PLATE = CREAMS.linen
