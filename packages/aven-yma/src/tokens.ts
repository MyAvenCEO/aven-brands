/**
 * avenYMA's paint.
 *
 * A second brand, and the reason the machinery had to come out of avenCEO's
 * package: nothing here is warm, nothing here is navy, and the typefaces are a
 * garamond and a geometric sans rather than one variable grotesque. If the
 * generator still imported avenCEO's palette, this file could not exist.
 *
 * The values are Yvonne's, lifted from the live yma.one and given the role
 * names the kit understands. Lifting them is the whole exercise: the site had
 * one set of colours declared inline in its HTML and a second, stale set in an
 * unlinked stylesheet, and no way to tell which was real short of reading both.
 */

/**
 * The brand's own colours, each spelled exactly once.
 *
 * Three families — a blue that carries the voice, a turquoise that carries
 * calm, and a pink that carries warmth — plus the two neutrals everything is
 * written in.
 */
export const TONES = {
	/* The blues: authority, and the deeper one is the heading colour. */
	navy: '#284a7a', // deepest — every heading, and the brand's ink
	blue: '#2f73a6', // the working blue — links, nav, the first step
	calm: '#2e9ec2', // lighter, cooler — the middle of the journey

	/* The turquoise: the thread that runs through the whole page. */
	turquoise: '#3ba8a4',
	'turquoise-deep': '#2c8a86', // for text, where the light one would fail

	/* The pinks: warmth, and the emphasis inside a heading. */
	rose: '#e386a1',
	pink: '#db5a90',
	'pink-deep': '#c74a7e',

	/* The neutrals. */
	ink: '#2c3646', // body copy — a blue-grey, never black
	ash: '#6d7787' // secondary copy
} as const

/**
 * The light grounds, lightest first.
 *
 * Cool where avenCEO's are warm — the same slot in the system, a different
 * temperature, which is exactly the kind of thing a brand gets to decide.
 */
export const CREAMS = {
	paper: '#ffffff', // the card, and the page
	mist: '#f6fbfd', // the blue wash — the about band
	sage: '#f1faf6', // the green wash — the values strip
	blush: '#fdf5f9', // the pink wash — the softest band
	line: '#eef3f7' // hairlines and card borders
} as const

/** Text guaranteed to read on a filled tone. */
export const CONTRAST_INK = {
	'success-foreground': '#ffffff',
	'warning-foreground': '#2c3646',
	'error-foreground': '#ffffff',
	'info-foreground': '#ffffff',
	white: '#ffffff'
} as const

/** Which rung each part of a page stands on. */
export const SURFACES: Record<string, string> = {
	'surface-raised': 'var(--color-paper)',
	'surface-cream': 'var(--color-mist)',
	'surface-soft': 'var(--color-sage)',
	'surface-card': 'var(--color-paper)',
	'surface-card-selected': 'var(--color-blush)',
	'surface-card-hover': 'var(--color-mist)',
	background: 'var(--color-paper)'
}

/**
 * What a colour MEANS here.
 *
 * The mapping is not avenCEO's with the hexes swapped. `primary` is the navy
 * because that is what a heading is; `secondary` is the turquoise because the
 * turquoise is the thread, not a second-choice fill; and `accent` is the pink,
 * which appears only inside a heading and never as a surface.
 */
export const ROLES: Record<string, string> = {
	primary: 'var(--color-navy)',
	'primary-foreground': '#ffffff',

	secondary: 'var(--color-turquoise)',
	'secondary-foreground': '#ffffff',
	'secondary-ink': 'var(--color-turquoise-deep)',

	accent: 'var(--color-pink)',
	'accent-foreground': '#ffffff',
	'accent-ink': 'var(--color-pink-deep)',

	quiet: 'var(--color-blue)',
	'quiet-foreground': '#ffffff',
	'quiet-ink': 'var(--color-blue)',

	foreground: 'var(--color-ink)',
	'muted-foreground': 'var(--color-ash)',
	muted: 'var(--color-mist)',
	border: 'var(--color-line)',
	input: 'var(--color-line)',
	card: 'var(--color-paper)',
	'card-foreground': 'var(--color-ink)',

	/* The signals. Yvonne's site has no error states, but a design system that
	   cannot express one is not finished — these come from the palette rather
	   than from a default nobody chose. */
	progress: 'var(--color-calm)',
	'progress-foreground': '#ffffff',
	'progress-ink': 'var(--color-blue)',
	success: 'var(--color-turquoise)',
	'success-foreground': CONTRAST_INK['success-foreground'],
	'success-ink': 'var(--color-turquoise-deep)',
	warning: 'var(--color-rose)',
	'warning-foreground': CONTRAST_INK['warning-foreground'],
	'warning-ink': 'var(--color-pink-deep)',
	error: 'var(--color-pink-deep)',
	'error-foreground': CONTRAST_INK['error-foreground'],
	'error-ink': 'var(--color-pink-deep)',
	info: 'var(--color-calm)',
	'info-foreground': CONTRAST_INK['info-foreground'],
	'info-ink': 'var(--color-blue)'
}

/**
 * THE BAND — the one gradient the brand is recognised by.
 *
 * It runs blue → turquoise → rose → pink and appears as the eyebrow's text
 * fill, as the rule under a section heading, and along the top of the footer.
 * It is a token because it is a brand ASSET, not a decoration someone repeats.
 */
export const GRADIENTS: Record<string, string> = {
	'gradient-band':
		'linear-gradient(100deg, #3a86b4 0%, #4fb1ad 34%, #e08bb0 68%, var(--color-pink) 100%)',
	'gradient-rule':
		'linear-gradient(90deg, var(--color-turquoise) 0%, var(--color-blue) 100%)',
	'gradient-hero':
		'radial-gradient(70% 60% at 6% 0%, #f3ecfb 0%, transparent 55%), radial-gradient(55% 60% at 2% 92%, #e9f6f1 0%, transparent 60%), linear-gradient(180deg, #fdfbff 0%, #fcf7fb 100%)'
}

/** Roles a marketing site has and an application does not. */
export const SITE_ROLES: Record<string, string> = { ...GRADIENTS }

/** Roles an application has. avenYMA is a site; the slot stays honest and empty. */
export const APP_ROLES: Record<string, string> = { ...GRADIENTS }

/**
 * Two typefaces, and they do different jobs.
 *
 * Cormorant Garamond sets every heading and every pull quote — it is where the
 * warmth is. Poppins sets everything a reader has to work through. avenCEO uses
 * one face for both; that is a brand decision, not a system constraint, which
 * is why the stacks are per-brand.
 */
export const DISPLAY_STACK = '"Cormorant Garamond", Georgia, serif'

export const FONT_STACK = {
	app: '"Poppins", system-ui, -apple-system, sans-serif',
	web: '"Poppins", system-ui, -apple-system, sans-serif',
	display: DISPLAY_STACK
}

export const FONT_WEIGHTS: Record<string, string> = {
	'font-weight-medium': '500',
	'font-weight-semibold': '600',
	'font-weight-bold': '700'
}

/** Generous, rounded geometry — the opposite end from avenCEO's tight radii. */
export const RADII: Record<string, string> = {
	'radius-sm': '12px',
	'radius-md': '20px',
	'radius-lg': '24px',
	'radius-xl': '26px',
	'radius-2xl': '32px'
}

/** The plate an app icon is drawn on. */
export const APP_ICON_PLATE = CREAMS.paper
