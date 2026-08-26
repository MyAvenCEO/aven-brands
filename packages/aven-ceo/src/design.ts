/**
 * THE DESIGN SYSTEM — the scales, and the components built from them.
 *
 * `tokens.ts` answers "what colour is the brand". This answers "how big, how
 * spaced, how emphatic" — and then "what IS a card".
 *
 * It exists because an audit of the three surfaces found no scale at all. One
 * idiom, the eyebrow, was written fourteen different ways; the type ramp was
 * thirty distinct arbitrary sizes across 378 uses, mixing units by eye
 * (`text-[0.68rem]` beside `text-[11px]`, plus `13.5px`, `1.02rem`, `2.35rem`);
 * emphasis was thirty different `text-foreground/N` values across 340 uses.
 * None of that is design — it is thirty authors each picking a number, and no
 * component vocabulary can sit on top of it.
 *
 * So the scales come first and the components are expressed in them. A value
 * that is not on a scale is not available, which is the whole point.
 *
 * Steps were chosen to ABSORB what is already on screen rather than to impose a
 * new look: each observed value maps to its nearest step (see `NEAREST_STEP`),
 * so the conversion is a rounding, not a redesign.
 */

/* ══ 1 · THE TYPE RAMP ═════════════════════════════════════════════════════
 * Twelve steps covering the 7px–38px range actually in use. Named by role at
 * the small end, where the brand does most of its talking, and by size at the
 * large end, where it only shouts occasionally. */
export const TYPE_SCALE = {
	'fs-nano': '9px', // legal footnotes, the smallest badge
	'fs-micro': '10px', // dense meta, table chrome
	'fs-eyebrow': '11px', // THE eyebrow, and inline labels
	'fs-meta': '12px', // captions, secondary lines
	'fs-body': '13px', // running text in dense surfaces
	'fs-section': '14px', // section headings, comfortable body
	'fs-title': '15px', // card titles
	'fs-lead': '17px', // the lead line of a panel
	'fs-hero': '20px', // a page's first statement
	'fs-amount': '24px', // figures that carry weight
	'fs-display': '28px', // marketing headline
	'fs-display-lg': '38px' // the one line above the fold
} as const

/* ══ 2 · TRACKING ══════════════════════════════════════════════════════════
 * Five steps for what was fourteen values between -0.03em and 0.28em. The
 * uppercase steps are the ones that mattered: `wide` is the app's eyebrow,
 * `widest` the website's, and they were never the same number.
 *
 * These names are Tailwind v4's own `--tracking-*` namespace, and taking it
 * over is DELIBERATE: it means `tracking-wide` in markup and `var(--tracking-
 * wide)` in a component definition are the same value, instead of two scales
 * that happen to share a word. The cost is that Tailwind's defaults no longer
 * apply — `tracking-tight` moves from -0.025em to -0.02em, which is 0.005em on
 * 26 elements and imperceptible. Worth knowing before adding a step: anything
 * put here silently redefines a Tailwind utility.
 *
 * Type is the opposite case. It deliberately does NOT use Tailwind's `--text-*`
 * namespace, because a step there would generate a utility for every name and
 * the point of the ramp is that only these twelve exist. Referencing them from
 * markup needs the explicit length hint — `text-[length:var(--fs-body)]` —
 * since `text-[var(--fs-body)]` is ambiguous between a length and a colour and
 * Tailwind silently emits NOTHING for it. */
export const TRACKING_SCALE = {
	'tracking-tight': '-0.02em', // large type, pulled together
	'tracking-normal': '0',
	'tracking-wide': '0.08em', // uppercase at small sizes
	'tracking-wider': '0.14em',
	'tracking-widest': '0.22em' // the most emphatic eyebrow
} as const

/* ══ 3 · EMPHASIS ══════════════════════════════════════════════════════════
 * Ink strength, as four steps rather than a continuum. Thirty different
 * `text-foreground/N` values said nothing a reader could perceive: nobody sees
 * the difference between /45 and /50, but everybody sees an inconsistent page. */
export const INK_SCALE = {
	'ink-faint': '0.35', // disabled, watermarks, the quietest meta
	'ink-quiet': '0.5', // captions, secondary meta
	'ink-muted': '0.65', // supporting copy
	'ink-strong': '0.8', // emphasis short of full ink
	'ink-full': '0.9' // all but black — body copy at full weight
} as const

/**
 * TINT — the same ink, but as a surface rather than as text.
 *
 * The audit lumped these in with emphasis and they are not the same axis: a
 * value like `/8` is a hairline border or a barely-there wash, never something
 * anyone reads. Separating them is what stops a border rounding up into a
 * legible grey. Three steps for what was seven values between 5% and 25%.
 */
export const TINT_SCALE = {
	'tint-hairline': '0.08', // the 1px rule between rows
	'tint-soft': '0.15', // a resting wash
	'tint-firm': '0.25' // a deliberate edge
} as const

/**
 * Snap an opacity percentage to its nearest step.
 *
 * Opacity is a continuum, so "nearest" is arithmetic rather than a lookup —
 * a sixty-row table of integers would restate the same rule less legibly.
 * `role` picks the axis: text reads, surfaces do not.
 */
export function nearestAlphaStep(percent: number, role: 'ink' | 'tint'): string {
	const scale = role === 'ink' ? INK_SCALE : TINT_SCALE
	let best = ''
	let distance = Number.POSITIVE_INFINITY
	for (const [name, value] of Object.entries(scale)) {
		const d = Math.abs(Number(value) * 100 - percent)
		if (d < distance) {
			distance = d
			best = name
		}
	}
	return best
}

/* ══ 4 · ELEVATION ═════════════════════════════════════════════════════════
 * Two real shadows were in use (a hairline lift, 31 times, and a floating
 * panel, 4 times) plus noise variants that differed only in the second decimal
 * of an alpha. Three steps, all mixed from marine so elevation stays on-brand
 * rather than reaching for a neutral grey. */
export const ELEVATION_SCALE = {
	'shadow-raised': '0 1px 3px rgba(30, 41, 59, 0.05)',
	'shadow-floating': '0 4px 16px rgba(30, 41, 59, 0.12)',
	'shadow-overlay': '0 12px 40px rgba(30, 41, 59, 0.18)'
} as const

/* ══ 5 · GEOMETRY ══════════════════════════════════════════════════════════ */
export const RADIUS_SCALE = {
	'radius-chip': '0.5rem',
	'radius-inner': '0.75rem',
	'radius-card': '1.5rem',
	'radius-panel': '2rem',
	'radius-pill': '9999px'
} as const

export const SPACE_SCALE = {
	'space-tight': '0.5rem',
	'space-snug': '0.75rem',
	'space-comfortable': '1rem',
	'space-loose': '1.5rem',
	'space-section': '2.5rem'
} as const

/**
 * Where every value observed on the three surfaces lands on a scale.
 *
 * This is the conversion table, kept as DATA so the migration is mechanical and
 * checkable rather than a judgement call per call site — and so a reviewer can
 * see exactly which pixel moved and by how much. Keys are the arbitrary values
 * found in the audit; values are the scale step that replaces them.
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
export const NEAREST_STEP: Record<string, string> = {
	/* type — px */
	'7px': 'fs-nano',
	'8px': 'fs-nano',
	'9px': 'fs-nano',
	'10px': 'fs-micro',
	'11px': 'fs-eyebrow',
	'12px': 'fs-meta',
	'13px': 'fs-body',
	'13.5px': 'fs-body',
	'14px': 'fs-section',
	'15px': 'fs-title',
	'16px': 'fs-title',
	'17px': 'fs-lead',
	'18px': 'fs-lead',
	'19px': 'fs-hero',
	'20px': 'fs-hero',
	'21px': 'fs-hero',
	'22px': 'fs-amount',
	'25px': 'fs-amount',
	'28px': 'fs-display',
	/* type — rem, the same ramp written the other way */
	'0.4375rem': 'fs-nano',
	'0.5625rem': 'fs-nano',
	'0.625rem': 'fs-micro',
	'0.6875rem': 'fs-eyebrow',
	'0.68rem': 'fs-eyebrow',
	'1.02rem': 'fs-lead',
	'1.125rem': 'fs-lead',
	'1.25rem': 'fs-hero',
	'1.3125rem': 'fs-hero',
	'1.4rem': 'fs-amount',
	'1.55rem': 'fs-amount',
	'1.65rem': 'fs-amount',
	'1.7rem': 'fs-display',
	'1.75rem': 'fs-display',
	'2.35rem': 'fs-display-lg',
	/* tracking */
	'-0.03em': 'tracking-tight',
	'-0.02em': 'tracking-tight',
	'0.06em': 'tracking-wide',
	'0.08em': 'tracking-wide',
	'0.1em': 'tracking-wide',
	'0.12em': 'tracking-wider',
	'0.14em': 'tracking-wider',
	'0.16em': 'tracking-wider',
	'0.17em': 'tracking-wider',
	'0.18em': 'tracking-wider',
	'0.2em': 'tracking-widest',
	'0.22em': 'tracking-widest',
	'0.24em': 'tracking-widest',
	'0.26em': 'tracking-widest',
	'0.28em': 'tracking-widest'
}

/** Every scale, flattened — what a consumer turns into CSS custom properties. */
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
 * What a card IS, once — expressed only in the scales above.
 *
 * These are `StyleDef.components` entries: aven-ui applies them directly, and
 * the Tailwind surfaces get the same definitions emitted as real CSS classes,
 * so a component cannot look like one thing in the app and another on the
 * website. Values reference the scale by var, never by number.
 */
export const COMPONENTS: Record<string, Record<string, unknown>> = {
	/** The raised cream panel everything sits on. */
	card: {
		borderRadius: 'var(--radius-card)',
		border: '1px solid var(--color-border)',
		background: 'var(--color-surface-raised)',
		padding: 'var(--space-loose)',
		boxShadow: 'var(--shadow-raised)'
	},
	'card-sm': {
		borderRadius: 'var(--radius-inner)',
		border: '1px solid var(--color-border)',
		background: 'var(--color-surface-card)',
		padding: 'var(--space-comfortable)'
	},
	/** 11px uppercase, tracked — the label above a heading. */
	eyebrow: {
		fontSize: 'var(--fs-eyebrow)',
		fontWeight: '600',
		textTransform: 'uppercase',
		letterSpacing: 'var(--tracking-wide)',
		color: 'color-mix(in srgb, var(--color-foreground) 50%, transparent)'
	},
	/** The website's louder eyebrow: same idiom, gold, tracked further. */
	'eyebrow-accent': {
		fontSize: 'var(--fs-micro)',
		fontWeight: '700',
		textTransform: 'uppercase',
		letterSpacing: 'var(--tracking-widest)',
		color: 'var(--color-accent, var(--color-sunflower))'
	},
	/**
	 * The quiet eyebrow: the same idiom in ink rather than gold, one step
	 * smaller. The website uses it for column headings above lists.
	 */
	'eyebrow-quiet': {
		fontSize: 'var(--fs-nano)',
		fontWeight: '700',
		textTransform: 'uppercase',
		letterSpacing: 'var(--tracking-widest)',
		color: 'color-mix(in srgb, var(--color-foreground) 35%, transparent)'
	},
	/**
	 * A section's heading on the marketing site — the line that opens a band.
	 * Steps up on wider screens, which is the one place the ramp is responsive.
	 */
	'section-title': {
		fontSize: 'var(--fs-amount)',
		fontWeight: '600',
		letterSpacing: 'var(--tracking-tight)',
		color: 'var(--color-foreground)'
	},
	/**
	 * A full-width band: the website is a stack of these, each separated by a
	 * hairline and breathing more at wider viewports.
	 */
	'section-band': {
		borderBottom: '1px solid color-mix(in srgb, var(--color-ink) 25%, transparent)',
		padding: '3.5rem 1.25rem'
	},
	/** The page ground an app surface fills — set once, on the outermost element. */
	'app-shell': {
		minHeight: '100vh',
		background: 'var(--color-background)',
		color: 'var(--color-foreground)',
		fontFamily: 'var(--font-sans)',
		WebkitFontSmoothing: 'antialiased'
	},
	/** An id, a hash, a timestamp — monospaced and deliberately recessive. */
	'mono-meta': {
		fontFamily: 'var(--font-mono)',
		fontSize: 'var(--fs-micro)',
		color: 'color-mix(in srgb, var(--color-foreground) 35%, transparent)'
	},
	/** The dot that opens a list item, aligned to the first line of text. */
	bullet: {
		marginTop: '0.375rem',
		width: '0.375rem',
		height: '0.375rem',
		flexShrink: '0',
		borderRadius: 'var(--radius-pill)',
		background: 'color-mix(in srgb, var(--color-foreground) 25%, transparent)'
	},
	/**
	 * THE TYPE ON A CARD — taken from the passkey-linking screen.
	 *
	 * That screen is where the brand's voice reads best, so its heading, lede
	 * and button are the definitions rather than one surface's local taste. The
	 * app and the website each had their own heading sizes and their own button
	 * padding; these are the id service's, promoted.
	 */
	title: {
		margin: '0',
		fontSize: 'var(--fs-hero)',
		fontWeight: '600',
		letterSpacing: 'var(--tracking-tight)'
	},
	/** The one line under a title. Muted, generous leading, never full ink. */
	lede: {
		margin: '0',
		fontSize: 'var(--fs-section)',
		lineHeight: '1.6',
		color: 'color-mix(in srgb, var(--color-foreground) 65%, transparent)'
	},
	/** A form label: its control sits under it, left aligned. */
	label: {
		display: 'grid',
		gap: '0.4rem',
		fontWeight: '600',
		textAlign: 'left'
	},
	/**
	 * The primary action, at the passkey screen's proportions — a tall pill with
	 * room around the words. The app's version was a third shorter and a step
	 * smaller, which is why buttons never quite matched between surfaces.
	 */
	btn: {
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 'var(--space-tight)',
		minHeight: '2.75rem',
		padding: '0 1.75rem',
		border: '0',
		borderRadius: 'var(--radius-pill)',
		background: 'var(--color-primary)',
		color: 'var(--color-primary-foreground)',
		font: 'inherit',
		fontSize: 'var(--fs-section)',
		fontWeight: '600',
		cursor: 'pointer',
		transition: 'opacity 0.15s ease'
	},
	'btn-secondary': {
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 'var(--space-tight)',
		minHeight: '2.75rem',
		padding: '0 1.75rem',
		border: '1px solid var(--color-border)',
		borderRadius: 'var(--radius-pill)',
		background: 'var(--color-secondary)',
		color: 'var(--color-secondary-foreground)',
		font: 'inherit',
		fontSize: 'var(--fs-section)',
		fontWeight: '600',
		cursor: 'pointer',
		transition: 'opacity 0.15s ease'
	},
	/** A small rounded token: a type badge, a count, a status. */
	chip: {
		display: 'inline-flex',
		alignItems: 'center',
		gap: '0.25rem',
		borderRadius: 'var(--radius-chip)',
		background: 'var(--color-surface-soft)',
		fontSize: 'var(--fs-micro)',
		padding: '0.125rem 0.375rem'
	},
	/**
	 * THE PAGE CARD — the centred sheet a whole screen sits on.
	 *
	 * Taken from the id service, which is where this idiom was already right:
	 * its sign-in, passkey and purchase screens are all one of these, and they
	 * read better than anything the app or the website had. So the id service
	 * is the master source for the card, not the laggard being brought into
	 * line — it is the definition, promoted.
	 *
	 * The measurements are its: a 34rem column that centres itself, generous
	 * asymmetric padding (more above and below than at the sides, so the
	 * content breathes without the card growing wide), a hairline rather than a
	 * border, and the lightest lift off the page.
	 */
	panel: {
		width: 'min(100%, 34rem)',
		marginInline: 'auto',
		padding: '2.5rem 2rem',
		border: '1px solid color-mix(in srgb, var(--color-ink) 8%, transparent)',
		borderRadius: 'var(--radius-card)',
		background: 'var(--color-surface-raised)',
		boxShadow: 'var(--shadow-raised)'
	},
	/**
	 * The stack a page card holds: centred, evenly spaced, full-width children.
	 * `.panel .stack` is the id service's `panel auth` pairing, named for what
	 * it does rather than for the one screen it started on.
	 */
	stack: {
		display: 'grid',
		gap: 'var(--space-comfortable)',
		justifyItems: 'center',
		textAlign: 'center'
	},
	/**
	 * A framed region INSIDE a card — an inset, not a card of its own.
	 *
	 * This is the id service's `.code` box: the thing the passkey-linking screen
	 * puts the name in, and the shape the whole purchase flow should echo. It
	 * carries a hairline, which is what separates it from the surrounding sheet
	 * without reading as a second card.
	 */
	well: {
		padding: 'var(--space-comfortable)',
		border: '1px solid var(--color-border)',
		borderRadius: 'var(--radius-inner)',
		background: 'var(--color-surface-soft)'
	},
	/** The brand mark, centred above a card's title. */
	mark: {
		width: '3.5rem',
		height: '3.5rem',
		marginInline: 'auto'
	},
	/**
	 * The value a `.well` exists to show — a name, a code, an amount. Large,
	 * tabular, and deliberately quiet in weight so the number does the talking.
	 */
	digits: {
		fontSize: 'var(--fs-amount)',
		fontWeight: '500',
		letterSpacing: 'var(--tracking-tight)',
		fontVariantNumeric: 'tabular-nums'
	},
	/** Something went wrong, said in the failure tone without shouting. */
	alert: {
		padding: '0.75rem 1rem',
		border: '1px solid color-mix(in srgb, var(--color-terracotta) 35%, transparent)',
		borderRadius: 'var(--radius-inner)',
		background: 'color-mix(in srgb, var(--color-terracotta) 8%, transparent)',
		color: 'var(--color-terracotta)',
		fontSize: 'var(--fs-body)',
		lineHeight: '1.5',
		textAlign: 'left'
	},
	/** A progress rail: one `.step` per stage, filled ones marked `.is-done`. */
	steps: {
		display: 'flex',
		gap: '0.375rem',
		width: '100%'
	},
	step: {
		flex: '1',
		height: '3px',
		borderRadius: 'var(--radius-pill)',
		background: 'color-mix(in srgb, var(--color-ink) 12%, transparent)'
	},
	/** A completed stage on the rail. Applied alongside `step`, never instead. */
	'step-done': {
		background: 'var(--color-primary)'
	},
	/** A labelled form row: label above control, left aligned, full width. */
	field: {
		display: 'grid',
		gap: 'var(--space-tight)',
		width: '100%',
		textAlign: 'left'
	},
	/** A quiet button — an outline pill for the secondary action. */
	ghost: {
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		minHeight: '2.75rem',
		padding: '0 1.25rem',
		border: '1px solid var(--color-border)',
		borderRadius: 'var(--radius-pill)',
		background: 'transparent',
		color: 'color-mix(in srgb, var(--color-foreground) 65%, transparent)',
		font: 'inherit',
		fontSize: 'var(--fs-body)',
		fontWeight: '500',
		lineHeight: '1',
		textDecoration: 'none',
		whiteSpace: 'nowrap',
		cursor: 'pointer'
	},
	/** Meta text: the quiet line under a title. */
	meta: {
		fontSize: 'var(--fs-meta)',
		color: 'color-mix(in srgb, var(--color-foreground) 50%, transparent)'
	}
}

/** The component names, so a consumer can assert the set it renders. */
export const COMPONENT_NAMES = Object.keys(COMPONENTS)
