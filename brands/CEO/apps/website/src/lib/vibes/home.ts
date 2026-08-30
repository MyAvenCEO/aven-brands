/**
 * THE HOME PAGE'S SECTIONS, AS CONFIGURATION.
 *
 * Every static band of the landing page is a ViewDef here, rendered to HTML
 * once at build time by `renderSection` and delivered as prerendered markup —
 * the same delivery the menu island proved, minus the island: nothing in
 * these sections moves, so nothing hydrates and no bundle travels to the
 * client. The classes are the same vocabulary the Svelte markup wore —
 * unit classes (`section`, `stat`, `text--eyebrow`) where units exist,
 * the generated utilities elsewhere, ids for the genuinely bespoke rules
 * that stay in `Home.svelte`'s stylesheet (`#trust-claims`, `#shift-head`,
 * `#shift-question`, the hero stage).
 *
 * Written as explicit classes rather than `$use`, for the menu island's own
 * honest reason plus two more this page adds:
 *
 *   - a placement cannot put an ATTRIBUTE on a unit's internal node, and the
 *     hero's content wrapper must carry `data-ground="media"` — the marker
 *     that points the contrast gate at the composited video pixels instead
 *     of a background colour that is not there;
 *   - the trust band's stats sit inside a `<ul>`, so each one is an `<li>`,
 *     and a `$use` renders the unit's own root tag (`div`).
 *
 * The class algebra is identical either way; when placement-level attributes
 * land in the engine, these trees shrink to `$use` lines.
 *
 * What is NOT here, and why (the `@@token@@` seam — see `render.ts`):
 *   - the hero's `<video>`: the engine's SAFE_TAGS admits no video element;
 *   - copy carrying markup (`transformationHtml`, `bodyHtml`, …): a view
 *     text node escapes, which is right for a view and wrong for our own
 *     HTML-bearing copy;
 *   - the founders' beam avatar: generated SVG, and the one door for SVG in
 *     a view is the icon registry, which holds validated glyphs, not
 *     per-name generated art.
 */
import type { ViewNode } from '@myavenceo/aven-vibes'
import { beamAvatarSvg, paletteFromCommaString } from '$lib/beam-avatar'
import { type Lang, localeHref, pick } from '$lib/i18n'
import { home } from '$lib/i18n/home'
import { renderSection } from '$lib/vibes/render'
import danielPhoto from '../../images/daniel.png'
import samuelPhoto from '../../images/samuel.jpg'

const paletteKi = paletteFromCommaString('e8c9a8,d4a574,c9a962,305669,222e49')

/* ------------------------------------------------------------------ hero */

/** Full-bleed video banner: the 4K first frame is the poster, so a crisp
 * still is on screen the instant the page paints; the muted 720p loop
 * fades in once it can play. A soft dark scrim keeps the copy legible
 * over the bright footage without hiding the scene. */
function heroView(t: (typeof home)['de']): ViewNode {
	return {
		tag: 'section',
		class: 'px-5 sm:px-8',
		attrs: { id: 'home-hero', 'aria-labelledby': 'home-hero-heading' },
		children: [
			/* The video element cannot be a view node (SAFE_TAGS), so it arrives
			   through the seam; the wrapper dissolves via `display: contents`
			   (#home-hero-media) so the video's own absolute positioning still
			   resolves against the section. */
			{ tag: 'div', attrs: { id: 'home-hero-media' }, text: '@@home-hero-video@@' },
			{ tag: 'div', attrs: { id: 'home-hero-scrim', 'aria-hidden': 'true' } },
			/* Its ground is the FOOTAGE, not a colour. A contrast checker walks the
			   cascade for a background and finds the page cream behind white copy —
			   a number for a surface that is not there, and one it will keep
			   reporting however dark the scrim gets. Measured properly, against the
			   real composited pixels at the height each line sits at: the headline
			   is 5.11:1 (needs 3.0) and the lead 4.72:1 (needs 4.5), which is why
			   `--color-scrim` went from 32% to 68%. Before that they were 2.25 and
			   2.57 and axe was right to shout. */
			{
				tag: 'div',
				class: 'mx-auto max-w-3xl text-center',
				attrs: { id: 'home-hero-content', 'data-ground': 'media' },
				children: [
					{
						tag: 'h1',
						class:
							'mx-auto max-w-3xl text-[clamp(2rem,6.5cqi,4rem)] font-light leading-tight tracking-tight text-pretty',
						attrs: { id: 'home-hero-heading' },
						text: t.hero.headingLine1,
						children: [{ tag: 'span', class: 'mt-1 block', text: t.hero.headingLine2 }]
					},
					{
						tag: 'div',
						class: 'mx-auto mt-8 max-w-2xl',
						children: [
							{
								tag: 'p',
								class:
									'text-pretty text-[length:var(--fs-lead)] font-light leading-snug sm:text-[length:var(--fs-amount)]',
								attrs: { id: 'home-hero-lead' },
								text: '@@home-hero-lead@@'
							},
							{
								tag: 'p',
								class:
									'mt-4 text-[length:var(--fs-section)] leading-snug sm:text-[length:var(--fs-lead)]',
								attrs: { id: 'home-hero-helper' },
								text: t.hero.helper
							}
						]
					}
				]
			}
		]
	}
}

/* The video, verbatim from the old markup — same attributes, same order. */
const HERO_VIDEO_HTML =
	'<video id="home-hero-video" autoplay muted loop playsinline preload="metadata" poster="/hero-poster.jpg" aria-hidden="true">' +
	'<source src="/hero-bg.mp4" type="video/mp4"></video>'

/* ------------------------------------------------------------ trust band */

/**
 * The proposition band, rendered from `section` and `stat`.
 *
 * It was a `bg-primary` utility with the three absolutes assembled by hand:
 * a display-face number, a tracked uppercase caption, and a hairline rule
 * between them, written out three times. `stat` IS that pairing — a figure
 * and what it means, in a fixed relationship — and the band is a ground the
 * `section` vocabulary now names rather than something a page reaches past
 * the unit to get.
 *
 * The ground re-inks the stats. `stat` carries the page's measured inks on
 * its figure and label, and a declared colour does not inherit, so a unit
 * dropped on an inverted band keeps the ground it was built for. The
 * re-inking lives in `ground-primary` for the same reason the language
 * switch's lives in `navbar--tone-clear`.
 */
function trustView(t: (typeof home)['de']): ViewNode {
	return {
		tag: 'section',
		class: 'section section--ground-primary section--measure-wide',
		attrs: { 'aria-labelledby': 'trust-headline' },
		children: [
			{
				tag: 'div',
				class: 'section-inner stack-center',
				children: [
					{
						tag: 'h2',
						class:
							'mx-auto max-w-2xl text-center text-[length:var(--fs-amount)] font-normal leading-snug text-balance sm:text-[length:var(--fs-display)]',
						attrs: { id: 'trust-headline' },
						text: '@@trust-headline@@'
					},
					{
						tag: 'ul',
						attrs: { id: 'trust-claims' },
						children: t.trust.claims.map(
							(claim): ViewNode => ({
								tag: 'li',
								class: 'stat stat--align-center',
								children: [
									{ tag: 'p', class: 'stat-value', text: '100%' },
									{ tag: 'p', class: 'text text--eyebrow stat-label', text: claim }
								]
							})
						)
					}
				]
			}
		]
	}
}

/* ----------------------------------------------------------- the arithmetic */

/**
 * An editorial spread: the story down the left, the price as the object on
 * the right.
 *
 * The previous pass stacked four blocks at four different measures — 576px,
 * then full width, then full width, then 544px — all flush left in a 1344px
 * field. Nothing related them, so the section read as a column that kept
 * changing its mind, with more than half the width empty beside the parts
 * that mattered most. Measured, which is how it was found.
 *
 * One grid now, and every element sits in it. The story column and the price
 * column face each other, which is what makes the price an ANSWER to the
 * heading rather than a fact filed underneath it; the capabilities run as a
 * rule-separated band across both, because they qualify both halves; the turn
 * closes on the story column's own edge.
 *
 * The price panel is the lead — "one thing leads", and on a page about what a
 * company costs, the number is the thing. It gets the accent edge, the
 * largest type on the section, and the right-hand column to itself.
 */
function costView(t: (typeof home)['de']): ViewNode {
	return {
		tag: 'section',
		class: 'section section--ground-raised section--measure-wide',
		attrs: { 'aria-labelledby': 'cost-heading' },
		children: [
			{
				tag: 'div',
				class: 'section-inner',
				attrs: { id: 'cost-grid' },
				children: [
					/* Story column. */
					{
						tag: 'div',
						attrs: { id: 'cost-story' },
						children: [
							{ tag: 'p', class: 'text text--eyebrow', text: t.trust.cost.eyebrow },
							{ tag: 'h2', attrs: { id: 'cost-heading' }, text: t.trust.cost.heading },
							{ tag: 'p', attrs: { id: 'cost-lead' }, text: t.trust.cost.lead },
							{
								tag: 'div',
								attrs: { id: 'cost-turn' },
								children: [
									{ tag: 'p', attrs: { id: 'cost-closing' }, text: t.trust.cost.closing },
									{ tag: 'p', attrs: { id: 'cost-kicker' }, text: t.trust.cost.kicker }
								]
							}
						]
					},
					/* Price column: the struck salary directly above what replaces it,
					   so the swap is one glance rather than an arithmetic exercise. */
					{
						tag: 'div',
						attrs: { id: 'cost-price' },
						children: [
							{
								tag: 'div',
								attrs: { id: 'cost-was' },
								children: [
									{ tag: 'p', class: 'text text--eyebrow', text: t.trust.cost.human.label },
									{
										tag: 'p',
										attrs: { id: 'cost-was-figure' },
										children: [
											{ tag: 'span', attrs: { id: 'cost-was-value' }, text: t.trust.cost.human.value },
											{ tag: 'span', attrs: { id: 'cost-was-unit' }, text: t.trust.cost.human.unit }
										]
									},
									{ tag: 'p', attrs: { id: 'cost-was-note' }, text: t.trust.cost.human.note }
								]
							},
							{
								tag: 'div',
								attrs: { id: 'cost-now' },
								children: [
									{ tag: 'p', class: 'text text--eyebrow', text: t.trust.cost.aven.label },
									{
										tag: 'p',
										attrs: { id: 'cost-now-figure' },
										children: [
											{ tag: 'span', attrs: { id: 'cost-now-value' }, text: t.trust.cost.aven.value },
											{ tag: 'span', attrs: { id: 'cost-now-unit' }, text: t.trust.cost.aven.unit }
										]
									},
									{ tag: 'p', attrs: { id: 'cost-now-note' }, text: t.trust.cost.aven.note }
								]
							}
						]
					},
					/* The band across both columns: what it runs, as receipts. */
					{
						tag: 'ul',
						attrs: { id: 'cost-does' },
						children: t.trust.cost.does.map(
							(job): ViewNode => ({
								tag: 'li',
								children: [
									{ tag: 'span', class: 'cost-does-mark', attrs: { 'aria-hidden': 'true' } },
									{ tag: 'span', text: job }
								]
							})
						)
					}
				]
			}
		]
	}
}

/**
 * One script of the two, and the two are NOT equal.
 *
 * They were: same eyebrow size, same heading size, same list, same weight,
 * separated by a rule — a spread that asks the reader to adjudicate rather
 * than showing them where it lands. The composition rule names this exactly:
 * two things of equal weight give the eye nowhere to go.
 *
 * The past script is now a QUIET ANNOTATION — smaller, unlisted, its lines
 * struck the way the hero strikes "working to survive" and the arithmetic
 * strikes the salary. The future script leads: larger, paradise-marked, and
 * the only one set at reading size. Same idiom in the third place on the page
 * it appears, which is what makes it the page's own gesture rather than a
 * decoration.
 *
 * Paradise DIRECT rather than `eyebrow-ink`. At 3.93:1 on this ground it
 * carries the eyebrow (uppercase, tracked, and large enough at 3:1) and the
 * markers, which are shapes. The old code reached for the darkened ink and
 * wrote it as an inline `style` attribute, which is a token bypass in two
 * ways at once.
 */
function scriptColumn(
	script: (typeof home)['de']['shift']['without'],
	side: 'without' | 'with'
): ViewNode {
	const past = side === 'without'
	return {
		tag: 'div',
		attrs: { id: past ? 'shift-was' : 'shift-now' },
		children: [
			{
				tag: 'p',
				class: 'text text--eyebrow',
				attrs: { id: past ? 'shift-was-eyebrow' : 'shift-now-eyebrow' },
				text: script.eyebrow
			},
			{
				tag: 'h3',
				attrs: { id: past ? 'shift-was-title' : 'shift-now-title' },
				text: script.title
			},
			{
				tag: 'ul',
				attrs: { id: past ? 'shift-was-items' : 'shift-now-items' },
				children: script.items.map(
					(item): ViewNode => ({
						tag: 'li',
						children: [
							{ tag: 'span', class: 'shift-marker', attrs: { 'aria-hidden': 'true' } },
							{ tag: 'span', text: item }
						]
					})
				)
			},
			{
				tag: 'p',
				attrs: { id: past ? 'shift-was-closing' : 'shift-now-closing' },
				text: script.closing
			}
		]
	}
}

function shiftView(t: (typeof home)['de']): ViewNode {
	return {
		tag: 'section',
		class: 'section section--measure-wide',
		attrs: { 'aria-labelledby': 'shift-heading' },
		children: [
			{
				tag: 'div',
				class: 'section-inner',
				children: [
					{
						tag: 'div',
						attrs: { id: 'shift-head' },
						children: [
							{ tag: 'p', class: 'text text--eyebrow', text: t.shift.eyebrow },
							{
								tag: 'h2',
								class: 'text text--display',
								attrs: { id: 'shift-heading' },
								text: t.shift.heading
							},
							{ tag: 'p', class: 'text text--lede', text: '@@shift-body@@' }
						]
					},
					/* The question as a pull-quote. It sized itself with `4.2vw`, which
					   is the window's width and not this section's — `cqi` reads the
					   section's own container instead; the rule lives on the id. */
					{ tag: 'p', attrs: { id: 'shift-question' }, text: '@@shift-question@@' },
					{
						tag: 'div',
						attrs: { id: 'shift-scripts' },
						children: [scriptColumn(t.shift.without, 'without'), scriptColumn(t.shift.with, 'with')]
					},
					/* The resolution, on the section's own left edge like everything
					   else. It was centred with utility classes AND an inline `style`
					   attribute carrying the colour — a token bypass, and the last
					   thing on the page still writing one. */
					{
						tag: 'div',
						attrs: { id: 'shift-turn' },
						children: [
							{ tag: 'p', attrs: { id: 'shift-turn-lead' }, text: t.shift.closingBefore },
							{ tag: 'p', attrs: { id: 'shift-turn-kicker' }, text: t.shift.closingStrong }
						]
					}
				]
			}
		]
	}
}

/* ----------------------------------------------------------- company band */

/** The thesis: the company of the future, named. A tidal-blue spread (the
 * brand's bluer teal) — the page's turning point, set against the light
 * sections around it, with marine accents. The body is two numbered
 * magazine columns, split by a rule — the editorial contrast against the
 * centred heading and close. */
function companyView(t: (typeof home)['de']): ViewNode {
	return {
		tag: 'section',
		class: 'bg-band px-5 py-20 text-band-foreground sm:px-8 sm:py-28',
		attrs: { id: 'company-band', 'aria-labelledby': 'company-heading' },
		children: [
			{
				tag: 'div',
				class: 'mx-auto max-w-5xl',
				children: [
					{
						tag: 'div',
						class: 'text-center',
						children: [
							{
								tag: 'p',
								class:
									'text-[length:var(--fs-eyebrow)] font-semibold uppercase tracking-[var(--tracking-wider)] text-band-foreground',
								text: t.company.eyebrow
							},
							{
								tag: 'h2',
								class:
									'mx-auto mt-5 max-w-3xl text-[clamp(2rem,7cqi,4.5rem)] font-light leading-[1.03] tracking-tight text-band-foreground',
								attrs: { id: 'company-heading' },
								text: t.company.heading
							}
						]
					},
					{
						tag: 'div',
						class:
							'mx-auto mt-14 grid max-w-4xl gap-x-14 gap-y-10 text-left sm:mt-16 lg:grid-cols-2',
						attrs: { id: 'company-prose' },
						children: t.company.paragraphsHtml.map(
							(_, i): ViewNode => ({
								tag: 'div',
								...(i > 0 ? { class: 'lg:border-l lg:border-primary-foreground/15 lg:pl-14' } : {}),
								children: [
									{
										tag: 'span',
										class:
											'font-display text-[length:var(--fs-display)] font-light leading-none text-band-foreground',
										text: String(i + 1).padStart(2, '0')
									},
									{
										tag: 'p',
										class:
											'mt-3 text-[length:var(--fs-title)] leading-relaxed text-band-foreground sm:text-base',
										text: `@@company-paragraph-${i}@@`
									}
								]
							})
						)
					},
					{
						tag: 'div',
						class: 'mx-auto mt-16 max-w-xl border-t border-primary-foreground/12 pt-10 text-center',
						children: [
							{
								tag: 'p',
								class:
									'text-[length:var(--fs-lead)] font-light leading-snug tracking-tight text-band-foreground sm:text-[length:var(--fs-hero)]',
								text: t.company.closingLine1,
								children: [
									/* "All you need for it is <b>your</b> own <b>avenCEO</b>." —
									   one inline run whose emphasis arrives as markup, so the
									   whole line goes through the seam. */
									{ tag: 'span', class: 'mt-2 block', text: '@@company-closing@@' }
								]
							}
						]
					}
				]
			}
		]
	}
}

/* -------------------------------------------------------------- ownership */

/** The pitch in one picture: an Aven is something you OWN, and you end up
 * owning several. Three rungs, not prose — the ladder is the argument. */
function ownView(t: (typeof home)['de']): ViewNode {
	return {
		tag: 'section',
		class: 'section-band sm:px-8 sm:py-20',
		attrs: { 'aria-labelledby': 'own-heading' },
		children: [
			{
				tag: 'div',
				class: 'mx-auto max-w-4xl',
				children: [
					{
						tag: 'div',
						class: 'mx-auto max-w-2xl text-center',
						children: [
							{ tag: 'p', class: 'eyebrow', text: t.own.eyebrow },
							{
								tag: 'h2',
								class: 'mt-4 text-3xl tracking-tight text-pretty text-foreground sm:text-4xl',
								attrs: { id: 'own-heading' },
								text: t.own.headingLine1,
								children: [{ tag: 'span', class: 'mt-1 block', text: t.own.headingLine2 }]
							},
							{
								tag: 'p',
								class:
									'mx-auto mt-4 max-w-xl text-[length:var(--fs-title)] leading-snug text-foreground-quiet sm:text-base',
								text: t.own.lead
							}
						]
					},
					{
						tag: 'ol',
						class: 'mt-10 grid gap-4 sm:grid-cols-3',
						children: t.own.rungs.map(
							(rung): ViewNode => ({
								tag: 'li',
								class:
									'rounded-lg border border-foreground/8 bg-surface-raised p-6 shadow-[var(--shadow-raised)]',
								children: [
									{
										tag: 'p',
										class:
											'text-[length:var(--fs-eyebrow)] font-bold uppercase tracking-[var(--tracking-wider)] text-accent-ink',
										text: rung.count
									},
									{
										tag: 'p',
										class: 'mt-2 font-display text-xl tracking-tight text-foreground',
										text: rung.title
									},
									{
										tag: 'p',
										class:
											'mt-2 text-[length:var(--fs-section)] leading-snug text-foreground-quiet',
										text: rung.text
									}
								]
							})
						)
					},
					{
						tag: 'p',
						class:
							'mx-auto mt-10 max-w-xl text-center text-[length:var(--fs-lead)] font-light leading-snug tracking-tight text-foreground sm:text-[length:var(--fs-hero)]',
						text: t.own.closing
					}
				]
			}
		]
	}
}

/* --------------------------------------------------------------- founders */

/** One person in the line-up: photo (through the seam — the CEO's is
 * generated SVG, the humans' are Vite-hashed imports whose URL only the
 * build knows), then role, name, caption. */
function founderBlock(
	person: { role: string; name: string; caption: string },
	options: { photoToken: string; nameClass: string; avatarId?: string }
): ViewNode {
	return {
		tag: 'div',
		class: 'flex min-w-0 flex-col items-center justify-start text-center',
		children: [
			{
				tag: 'div',
				class: 'size-14 shrink-0 overflow-hidden rounded-full ring-2 ring-surface-page sm:size-16',
				...(options.avatarId ? { attrs: { id: options.avatarId, 'aria-hidden': 'true' } } : {}),
				text: options.photoToken
			},
			{ tag: 'p', class: 'mt-2 eyebrow-quiet', text: person.role },
			{ tag: 'p', class: options.nameClass, text: person.name },
			{
				tag: 'p',
				class:
					'mt-0.5 max-w-[9rem] text-[length:var(--fs-nano)] leading-tight text-foreground-quiet sm:text-[length:var(--fs-micro)]',
				text: person.caption
			}
		]
	}
}

/** The joiner between two people: a `+` or an arrow, purely visual. */
function founderJoiner(glyph: string): ViewNode {
	return {
		tag: 'div',
		class: 'flex w-6 min-w-[1.5rem] flex-col justify-center pb-10 sm:w-8 sm:pb-12',
		attrs: { 'aria-hidden': 'true' },
		children: [
			{
				tag: 'span',
				class:
					'text-center text-2xl font-light leading-none text-foreground-quiet sm:text-[length:var(--fs-display)]',
				text: glyph
			}
		]
	}
}

/** Founders as a 50/50 magazine split: the avenCEO speaks from a turquoise
 * panel on the left, the human + AI team stands on the light right. */
function foundersView(t: (typeof home)['de']): ViewNode {
	return {
		tag: 'section',
		class: 'grid items-stretch lg:grid-cols-2',
		attrs: { id: 'founders' },
		children: [
			{
				tag: 'div',
				class:
					'flex items-center bg-band-alt px-5 py-16 text-band-foreground sm:px-8 sm:py-20 lg:px-14 lg:py-28',
				children: [
					{
						tag: 'div',
						class: 'mx-auto w-full max-w-xl lg:mr-0 lg:ml-auto lg:max-w-md',
						children: [
							{
								tag: 'p',
								class:
									'text-[length:var(--fs-body)] font-semibold uppercase tracking-[var(--tracking-wider)] text-band-foreground',
								text: t.founders.eyebrow
							},
							{
								tag: 'h2',
								class:
									'mt-3 text-[clamp(1.75rem,4.5cqi,2.75rem)] font-light leading-tight tracking-tight text-band-foreground',
								text: t.founders.heading
							},
							{
								tag: 'div',
								class:
									'mt-5 space-y-3 text-[length:var(--fs-title)] leading-relaxed text-band-foreground sm:text-base',
								attrs: { id: 'founders-prose' },
								children: [
									{ tag: 'p', text: '@@founders-intro@@' },
									{ tag: 'p', text: '@@founders-team@@' }
								]
							}
						]
					}
				]
			},
			{
				tag: 'div',
				class: 'flex items-center bg-surface-page px-5 py-16 sm:px-8 sm:py-20 lg:px-14',
				children: [
					{
						tag: 'div',
						class: 'mx-auto w-full max-w-md',
						children: [
							{
								tag: 'div',
								class:
									'grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1.2fr)] items-stretch gap-x-2 sm:gap-x-4',
								children: [
									founderBlock(t.founders.samuel, {
										photoToken: '@@founders-photo-samuel@@',
										nameClass:
											'mt-0.5 truncate text-[length:var(--fs-meta)] font-semibold tracking-tight text-foreground sm:text-[length:var(--fs-body)]'
									}),
									founderJoiner('+'),
									founderBlock(t.founders.daniel, {
										photoToken: '@@founders-photo-daniel@@',
										nameClass:
											'mt-0.5 truncate text-[length:var(--fs-meta)] font-semibold tracking-tight text-foreground sm:text-[length:var(--fs-body)]'
									}),
									founderJoiner('→'),
									founderBlock(t.founders.ceo, {
										photoToken: '@@founders-avatar-ceo@@',
										avatarId: 'founders-ceo-avatar',
										nameClass:
											'mt-0.5 text-[length:var(--fs-meta)] font-bold tracking-[var(--tracking-wide)] text-accent-ink sm:text-[length:var(--fs-body)]'
									})
								]
							},
							{
								tag: 'p',
								class:
									'mt-4 border-t border-border/8 pt-3 text-center text-[length:var(--fs-micro)] font-bold tracking-[var(--tracking-widest)] text-accent-ink sm:text-[length:var(--fs-eyebrow)]',
								text: t.founders.sum
							}
						]
					}
				]
			}
		]
	}
}

/* -------------------------------------------- skills preview + start head */

/** The header block of the skills preview. Only the frame is config: the
 * cards inside the grid are `SkillMarketplaceCard` components, shared with
 * the marketplace page and kept in Svelte — the engine's attribute
 * sanitiser strips typographic dashes, and the card's accessible name
 * (`Name — promise`) is copy, not decoration. */
function skillsHeadView(t: (typeof home)['de']): ViewNode {
	return {
		tag: 'div',
		class: 'mx-auto max-w-2xl text-center',
		children: [
			{ tag: 'p', class: 'eyebrow', text: t.skills.eyebrow },
			{
				tag: 'h2',
				class: 'mt-4 text-3xl tracking-tight text-pretty text-foreground sm:text-4xl',
				attrs: { id: 'skills-preview-heading' },
				text: t.skills.heading
			},
			{
				tag: 'p',
				class:
					'mx-auto mt-4 max-w-xl text-[length:var(--fs-title)] leading-snug text-foreground-quiet sm:text-base',
				text: t.skills.lead
			}
		]
	}
}

/** "See all skills" under the preview grid. */
function skillsAllView(t: (typeof home)['de'], lang: Lang): ViewNode {
	return {
		tag: 'p',
		class: 'mt-8 text-center',
		children: [
			{
				tag: 'a',
				class:
					'inline-flex items-center gap-1.5 text-[length:var(--fs-meta)] font-bold uppercase tracking-[var(--tracking-wider)] text-foreground-quiet transition-colors hover:text-foreground',
				attrs: { href: localeHref(lang, '/skills') },
				text: t.skills.all
			}
		]
	}
}

/** The head of the start band; the CTA below it is `AvenIdCheckCta`, real
 * network logic and a future island — the frame stays in Svelte around it. */
function startHeadView(t: (typeof home)['de']): ViewNode {
	return {
		tag: 'div',
		class: 'pb-6 text-center',
		children: [
			{ tag: 'p', class: 'eyebrow', text: t.start.eyebrow },
			{
				tag: 'h2',
				class: 'mt-3 text-3xl tracking-tight text-pretty text-foreground sm:text-4xl',
				text: t.start.heading
			},
			{
				tag: 'p',
				class:
					'mx-auto mt-3 max-w-lg text-[length:var(--fs-title)] leading-snug text-foreground-quiet sm:text-base',
				text: '@@start-body@@'
			}
		]
	}
}

/* ------------------------------------------------------------------ build */

export type HomeSections = {
	hero: string
	trust: string
	cost: string
	shift: string
	company: string
	own: string
	founders: string
	skillsHead: string
	skillsAll: string
	startHead: string
}

export async function renderHomeSections(lang: Lang): Promise<HomeSections> {
	const t = pick(home, lang)
	const companyParagraphs = Object.fromEntries(
		t.company.paragraphsHtml.map((p, i) => [`@@company-paragraph-${i}@@`, p])
	)
	return {
		hero: await renderSection(heroView(t), {
			'@@home-hero-video@@': HERO_VIDEO_HTML,
			'@@home-hero-lead@@': t.hero.transformationHtml
		}),
		trust: await renderSection(trustView(t), {
			'@@trust-headline@@': t.trust.headlineHtml
		}),
		cost: await renderSection(costView(t)),
		shift: await renderSection(shiftView(t), {
			'@@shift-body@@': t.shift.bodyHtml,
			'@@shift-question@@': t.shift.question
		}),
		company: await renderSection(companyView(t), {
			...companyParagraphs,
			'@@company-closing@@': `${t.company.closingLine2Before} <span class="font-sans font-medium">${t.company.closingLine2Strong}</span>.`
		}),
		own: await renderSection(ownView(t)),
		founders: await renderSection(foundersView(t), {
			'@@founders-intro@@': t.founders.introHtml,
			'@@founders-team@@': t.founders.teamHtml,
			'@@founders-photo-samuel@@': `<img src="${samuelPhoto}" alt="${t.founders.samuel.alt}" class="h-full w-full object-cover" width="64" height="64" decoding="async">`,
			'@@founders-photo-daniel@@': `<img src="${danielPhoto}" alt="${t.founders.daniel.alt}" class="h-full w-full object-cover" width="64" height="64" decoding="async">`,
			'@@founders-avatar-ceo@@': beamAvatarSvg('avenCEO', paletteKi, 64, 'fnd-k-ceo')
		}),
		skillsHead: await renderSection(skillsHeadView(t)),
		skillsAll: await renderSection(skillsAllView(t, lang)),
		startHead: await renderSection(startHeadView(t), { '@@start-body@@': t.start.bodyHtml })
	}
}
