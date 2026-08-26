/**
 * avenYMA's scales and pieces.
 *
 * The type ramp is FLUID where avenCEO's is fixed. That is not a stylistic
 * flourish: the site's headings are set in `clamp()` so a 4.9rem hero on a
 * desktop becomes 2.8rem on a phone without a breakpoint, and freezing them to
 * steps would have changed the design in the act of systematising it.
 */
import type { Decl } from '@myavenceo/aven-brandkit'
import { GRADIENTS } from './tokens.js'

/**
 * The type ramp.
 *
 * Two families of step: the editorial ones, which are fluid and set in the
 * garamond, and the UI ones, which are fixed and set in Poppins.
 */
export const TYPE_SCALE: Record<string, string> = {
	'fs-hero': 'clamp(2.8rem, 6vw, 4.9rem)',
	'fs-display': 'clamp(2.2rem, 4.4vw, 3.2rem)',
	'fs-section': 'clamp(2rem, 4vw, 3rem)',
	'fs-quote': 'clamp(1.55rem, 3.2vw, 2.2rem)',
	'fs-pull': 'clamp(1.2rem, 1.9vw, 1.5rem)',
	'fs-title': '1.5rem',
	'fs-card-title': '1.4rem',
	'fs-lead': '1.1rem',
	'fs-body': '1rem',
	'fs-small': '0.96rem',
	'fs-meta': '0.92rem',
	'fs-eyebrow': '0.82rem',
	'fs-kicker': '0.74rem',
	'fs-micro': '0.72rem',
	'fs-nano': '0.64rem'
}

/**
 * Letter-spacing.
 *
 * The wide end does real work here — every eyebrow, kicker and value word on
 * the site is uppercase and tracked out, and the exact amount varies by size.
 */
export const TRACKING_SCALE: Record<string, string> = {
	'tracking-tight': '-0.01em',
	'tracking-normal': '0',
	'tracking-wide': '0.14em',
	'tracking-wider': '0.22em',
	'tracking-widest': '0.3em'
}

/** How strongly text asserts itself, as an alpha on the ink. */
export const INK_SCALE: Record<string, string> = {
	'ink-loud': '1',
	'ink-plain': '0.86',
	'ink-quiet': '0.68',
	'ink-faint': '0.5',
	'ink-ghost': '0.34'
}

/** Washes: a tone at low opacity behind something. */
export const TINT_SCALE: Record<string, string> = {
	'tint-wash': '0.06',
	'tint-soft': '0.09',
	'tint-firm': '0.22'
}

/**
 * Elevation.
 *
 * Long, soft and heavily offset — a card here floats well above the page, which
 * is the single biggest difference in feel from avenCEO's near-flat surfaces.
 */
export const ELEVATION_SCALE: Record<string, string> = {
	'shadow-raised': '0 24px 50px -38px rgba(90, 110, 150, 0.5)',
	'shadow-floating': '0 26px 54px -40px rgba(90, 110, 150, 0.4)',
	'shadow-overlay': '0 34px 64px -38px rgba(90, 110, 150, 0.4)'
}

export const RADIUS_SCALE: Record<string, string> = {
	'radius-sm': '12px',
	'radius-md': '20px',
	'radius-lg': '24px',
	'radius-xl': '26px',
	'radius-2xl': '32px'
}

export const SPACE_SCALE: Record<string, string> = {
	'space-tight': '10px',
	'space-snug': '18px',
	'space-comfortable': '28px',
	'space-loose': '52px',
	'space-section': '100px'
}

/** Every scale flattened into the tokens the stylesheet declares. */
export const SCALE_TOKENS: Record<string, string> = {
	...TYPE_SCALE,
	...TRACKING_SCALE,
	...INK_SCALE,
	...TINT_SCALE,
	...ELEVATION_SCALE,
	...RADIUS_SCALE,
	...SPACE_SCALE,
	...GRADIENTS
}

/** The layout shapes the page is built from. */
export const PRIMITIVES: Record<string, Decl> = {
	/* The measure every section is poured into. */
	wrap: {
		maxInlineSize: '1220px',
		marginInline: 'auto',
		paddingInline: '30px'
	},
	/* A vertical run with one gap. */
	stack: {
		display: 'grid',
		gap: 'var(--gap, var(--space-comfortable))'
	},
	'stack-center': {
		textAlign: 'center',
		justifyItems: 'center'
	},
	/* Things side by side that wrap when they must. */
	cluster: {
		display: 'flex',
		flexWrap: 'wrap',
		alignItems: 'var(--align, center)',
		gap: 'var(--gap, var(--space-snug))'
	},
	/* Equal columns that collapse to one on a phone. */
	'grid-auto': {
		display: 'grid',
		gridTemplateColumns: '1fr',
		gap: 'var(--gap, var(--space-comfortable))',
		'@media (min-width: 760px)': {
			gridTemplateColumns: 'repeat(var(--columns, 3), 1fr)'
		}
	},
	/* A column of text at a readable measure. */
	prose: {
		maxInlineSize: 'var(--measure, 560px)'
	}
}

/**
 * The named pieces.
 *
 * Every one of these was a bare selector in a 270-line inline `<style>` block,
 * where `.btn.blue` and `.btn.teal` and `.btn.outline` were three rules that
 * shared nothing and drifted freely. Naming them is what makes the site a
 * design system rather than a page that happens to look consistent.
 */
export const COMPONENTS: Record<string, Decl> = {
	/* ── the button, and its three faces ─────────────────────────────────── */
	btn: {
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: '10px',
		padding: '14px 30px',
		borderRadius: '999px',
		fontFamily: 'var(--font-sans)',
		fontSize: 'var(--fs-meta)',
		fontWeight: 'var(--font-weight-semibold)',
		lineHeight: '1',
		border: '1.5px solid transparent',
		cursor: 'pointer',
		transition: 'background 0.25s, color 0.25s, border-color 0.25s',
		'&:hover': { textDecoration: 'none' }
	},
	'btn-blue': {
		background: 'var(--color-blue)',
		color: 'var(--color-paper)',
		boxShadow: '0 14px 30px -14px color-mix(in oklab, var(--color-blue) 55%, transparent)',
		'&:hover': { background: '#0f4c81' }
	},
	'btn-teal': {
		background: 'var(--color-turquoise)',
		color: 'var(--color-paper)',
		boxShadow: '0 14px 30px -14px color-mix(in oklab, var(--color-turquoise) 55%, transparent)',
		'&:hover': { background: 'var(--color-turquoise-deep)' }
	},
	'btn-outline': {
		background: 'var(--color-paper)',
		color: 'var(--color-navy)',
		borderColor: 'var(--color-line)',
		boxShadow: 'none',
		'&:hover': { borderColor: 'var(--color-turquoise)', color: 'var(--color-turquoise-deep)' }
	},

	/* ── the small uppercase label, in three voices ──────────────────────── */
	kicker: {
		fontSize: 'var(--fs-kicker)',
		fontWeight: 'var(--font-weight-semibold)',
		letterSpacing: 'var(--tracking-widest)',
		textTransform: 'uppercase',
		color: 'var(--color-blue)'
	},
	'kicker-teal': { color: 'var(--color-turquoise-deep)' },
	'kicker-pink': { color: 'var(--color-pink)' },

	/*
	 * The eyebrow, filled with the band.
	 *
	 * The gradient is clipped to the text, which is the brand's signature and
	 * was previously four vendor-prefixed lines repeated at each use site.
	 */
	eyebrow: {
		display: 'block',
		fontSize: 'var(--fs-eyebrow)',
		fontWeight: 'var(--font-weight-semibold)',
		letterSpacing: 'var(--tracking-widest)',
		textTransform: 'uppercase',
		background: 'var(--gradient-band)',
		WebkitBackgroundClip: 'text',
		backgroundClip: 'text',
		WebkitTextFillColor: 'transparent'
	},

	/* ── headings ────────────────────────────────────────────────────────── */
	display: {
		fontFamily: 'var(--font-display)',
		fontWeight: '500',
		lineHeight: '1.14',
		color: 'var(--color-navy)'
	},
	/* The italic pink word inside a heading — the one emphasis the brand uses. */
	em: {
		fontStyle: 'italic',
		color: 'var(--color-pink)'
	},
	/*
	 * The teal thread: a short gradient rule under a section heading. It appears
	 * under every one of them, which is what makes the page feel sewn together.
	 */
	'rule-under': {
		'&::after': {
			content: '""',
			display: 'block',
			inlineSize: '60px',
			blockSize: '3px',
			borderRadius: '3px',
			background: 'var(--gradient-rule)',
			marginBlockStart: '20px'
		}
	},

	/* ── the card ────────────────────────────────────────────────────────── */
	card: {
		background: 'var(--color-paper)',
		borderRadius: 'var(--radius-lg)',
		border: '1px solid var(--color-line)',
		boxShadow: 'var(--shadow-floating)',
		overflow: 'hidden',
		display: 'flex',
		flexDirection: 'column',
		transition: 'transform 0.3s, box-shadow 0.3s',
		'&:hover': { transform: 'translateY(-6px)', boxShadow: 'var(--shadow-overlay)' }
	},
	'card-body': {
		padding: '44px 26px 28px',
		position: 'relative',
		flex: '1',
		display: 'flex',
		flexDirection: 'column'
	},
	/* A step on the journey — a card that centres itself and wears a colour bar. */
	step: {
		position: 'relative',
		textAlign: 'center',
		padding: '40px 28px 34px',
		background: 'var(--color-paper)',
		borderRadius: 'var(--radius-lg)',
		border: '1px solid var(--color-line)',
		boxShadow: 'var(--shadow-raised)',
		transition: 'transform 0.3s, box-shadow 0.3s',
		'&:hover': { transform: 'translateY(-5px)', boxShadow: 'var(--shadow-overlay)' },
		'&::before': {
			content: '""',
			display: 'block',
			inlineSize: '44px',
			blockSize: '4px',
			borderRadius: '4px',
			margin: '0 auto 22px',
			background: 'var(--step-bar, var(--gradient-rule))'
		}
	},

	/* ── the pull quote, and the invitation ──────────────────────────────── */
	quote: {
		fontFamily: 'var(--font-display)',
		fontStyle: 'italic',
		fontSize: 'var(--fs-pull)',
		color: 'var(--color-navy)',
		lineHeight: '1.45'
	},
	invitation: {
		display: 'block',
		fontFamily: 'var(--font-display)',
		fontStyle: 'italic',
		fontSize: 'var(--fs-quote)',
		fontWeight: '500',
		lineHeight: '1.3',
		color: 'var(--color-navy)',
		background:
			'linear-gradient(135deg, color-mix(in oklab, var(--color-turquoise) 8%, transparent) 0%, color-mix(in oklab, var(--color-pink) 6%, transparent) 100%)',
		border: '1px solid color-mix(in oklab, var(--color-turquoise) 22%, transparent)',
		borderRadius: 'var(--radius-md)',
		padding: '26px 36px'
	},

	/*
	 * The legal documents.
	 *
	 * Four pages of dense German prose that nobody designs and everybody has to
	 * be able to read. One component so they cannot each drift their own way.
	 */
	legal: {
		maxInlineSize: '75ch',
		paddingBlock: 'var(--space-loose)',
		'& h1': {
			fontFamily: 'var(--font-display)',
			fontSize: 'var(--fs-display)',
			fontWeight: '500',
			lineHeight: '1.14',
			color: 'var(--color-navy)',
			marginBlockEnd: 'var(--space-snug)'
		},
		'& h2': {
			fontFamily: 'var(--font-display)',
			fontSize: 'var(--fs-title)',
			fontWeight: '500',
			color: 'var(--color-navy)',
			marginBlockStart: 'var(--space-comfortable)',
			marginBlockEnd: 'var(--space-tight)'
		},
		'& h3': {
			fontSize: 'var(--fs-body)',
			fontWeight: 'var(--font-weight-semibold)',
			color: 'var(--color-blue)',
			marginBlockStart: 'var(--space-snug)',
			marginBlockEnd: '0.5rem'
		},
		'& p, & li': { fontSize: 'var(--fs-meta)', color: 'var(--color-ink)' },
		'& p + p': { marginBlockStart: '0.75rem' },
		'& ul, & ol': { marginBlock: '0.75rem', paddingInlineStart: '1.25rem' },
		'& li + li': { marginBlockStart: '0.375rem' },
		'& a': { color: 'var(--color-blue)', textDecoration: 'underline' },
		'& strong': { fontWeight: 'var(--font-weight-semibold)' }
	},

	/* ── the page's bands ────────────────────────────────────────────────── */
	section: { paddingBlock: 'var(--space-section)' },
	'band-mist': { background: 'var(--color-mist)' },
	'band-sage': {
		background: 'linear-gradient(180deg, var(--color-sage) 0%, var(--color-paper) 100%)'
	},
	'band-hero': { background: 'var(--gradient-hero)' }
}

export const PRIMITIVE_NAMES = Object.keys(PRIMITIVES)
export const COMPONENT_NAMES = Object.keys(COMPONENTS)
