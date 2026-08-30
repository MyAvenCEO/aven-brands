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
 *     a view is the icon registry, which holds validated glyphs, not
 *     per-name generated art.
 */
import type { ViewNode } from '@myavenceo/aven-vibes'
import { type Lang, localeHref, pick } from '$lib/i18n'
import { home } from '$lib/i18n/home'
import { renderSection } from '$lib/vibes/render'


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
						children: [
							/* The hero NAMES the brand, so it renders the brand — the
							   `inline` variant, which resets the wordmark's 1.4em so the
							   lockup takes this headline's size instead of overshooting it
							   by 40%. */
							{
								tag: 'span',
								class: 'logo logo--inline',
								children: [
									{
										tag: 'span',
										class: 'logo-wordmark',
										children: [
											{ tag: 'span', class: 'logo-word-aven', text: 'aven' },
											{ tag: 'span', class: 'logo-word-ceo', text: 'CEO' }
										]
									}
								]
							},
							{ tag: 'span', text: t.hero.headingLine1 },
							{ tag: 'span', class: 'mt-1 block', text: t.hero.headingLine2 }
						]
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
					/*
					 * The one line that NAMES the brand now renders the brand, rather
					 * than re-typing it in the body font: `avenCEO` was a string here,
					 * so the site's own lockup — two faces, its own tracking, the
					 * 0.714 ratio between the halves — was absent from the sentence
					 * that introduces it. It is the logo leaf, wordmark variant,
					 * inheriting this headline's size so it sits ON the line instead
					 * of beside it.
					 *
					 * The classes rather than `$use`, for the same reason the menu
					 * island writes them: they are the same contract the stylesheet
					 * compiles either way, and this one has to inherit a font-size the
					 * placement cannot yet pass in.
					 */
					{
						tag: 'h2',
						attrs: { id: 'trust-headline' },
						children: [
							{
								tag: 'span',
								class: 'logo logo--inline',
								attrs: { id: 'trust-lockup' },
								children: [
									{
										tag: 'span',
										class: 'logo-wordmark',
										children: [
											{ tag: 'span', class: 'logo-word-aven', text: 'aven' },
											{ tag: 'span', class: 'logo-word-ceo', text: 'CEO' }
										]
									}
								]
							},
							{ tag: 'span', text: '@@trust-headline@@' }
						]
					},
					{
						tag: 'ul',
						attrs: { id: 'trust-claims' },
						/*
						 * Each claim gets its mark. Solar Bold Duotone, the set the rest
						 * of the UI already draws from, and chosen by MEANING rather than
						 * by looking trustworthy in general: a keyhole lock for the
						 * encryption, a checked shield for the privacy, a key for the
						 * ownership — you hold it, which is the whole claim.
						 *
						 * Decorative, so no title reaches the SVG: the words underneath
						 * already say what each one is, and an icon that repeats its own
						 * label is one more thing for a screen reader to read out twice.
						 */
						children: t.trust.claims.map(
							(claim, i): ViewNode => ({
								tag: 'li',
								class: 'stat stat--align-center',
								children: [
									{
										tag: 'span',
										class: 'trust-claim-icon',
										attrs: { 'aria-hidden': 'true' },
										$icon: { name: TRUST_ICONS[i], size: '2.25rem' }
									},
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

/* One mark per claim, in the order the claims are written. */
const TRUST_ICONS = ['trust-encrypted', 'trust-privacy', 'trust-ownership'] as const

/* ----------------------------------------------------------- the arithmetic */

/**
 * A rule-anchored label: tracked caps, then a hairline running to the edge.
 *
 * The editorial device the reference set uses everywhere — it turns a label
 * into a piece of furniture that holds the column together, instead of a
 * caption floating above content. Two elements, no ornament file: the word,
 * and a rule that takes the remaining width.
 */
/*
 * THE TWO ILLUSTRATIONS, in one place, because both are stand-ins.
 *
 * Change the `src` here and the section picks it up — there is nothing else to
 * edit. Drop the file in `static/` and the leading slash resolves to it.
 *
 * `horizon` wants the ridge illustration: a woman on a summit, arms open,
 * facing a low sun over marine ranges — sunflower sky, sand rock, paradise
 * water. It is already this exact palette, which is why it belongs in the
 * section that argues starting is possible now: the arithmetic says what it
 * costs, the picture says what it buys. `/hero.png` stands in until then.
 *
 * Both frames are 16 / 9 and the images must be too, or `object-fit: cover`
 * silently crops a third of the frame away.
 */
const ART = {
	horizon: { src: '/woman-on-mountain.jpg', width: '1920', height: '1072' },
	/* Square, not 16:9 — it sits in a column beside the argument rather than
	   spanning a row, and a wide crop of a portrait subject wastes both. */
	garden: { src: '/man-under-tree.jpg', width: '816', height: '816' },
	assembly: { src: '/avens-assembly.jpg', width: '1088', height: '608' },
	family: { src: '/family.jpg', width: '1920', height: '720' }
} as const

function ruleLabel(text: string, index?: string): ViewNode {
	return {
		tag: 'p',
		class: 'rule-label',
		children: [
			...(index ? [{ tag: 'span', class: 'rule-label-index', text: index }] : []),
			{ tag: 'span', class: 'rule-label-text', text },
			{ tag: 'span', class: 'rule-label-line', attrs: { 'aria-hidden': 'true' } }
		]
	}
}

/**
 * The arithmetic, restyled as an editorial price sheet.
 *
 * The previous pass fixed the GRID and left the styling generic — a correct
 * layout with nothing in it that could only be this page. The reference set
 * shares a vocabulary worth borrowing: an index number that makes a section
 * feel like a page in something, labels anchored by rules rather than
 * floating, parentheses around the line that carries the argument, a ticker
 * of short facts, and one closing statement given the whole width.
 *
 * All of it in brand colour and existing tokens — no new palette, no
 * ornament assets. Retro here means STRUCTURE, not decoration: the devices
 * are rules, brackets and tracked caps, which is what the period actually
 * used, and what a stylesheet can draw without a single image.
 */
function costView(t: (typeof home)['de']): ViewNode {
	return {
		tag: 'section',
		class: 'section section--ground-raised section--measure-page',
		attrs: { 'aria-labelledby': 'cost-heading' },
		children: [
			{
				tag: 'div',
				class: 'section-inner',
				attrs: { id: 'cost-grid' },
				children: [
					{
						tag: 'div',
						attrs: { id: 'cost-story' },
						children: [
							ruleLabel(t.trust.cost.eyebrow, '02'),
							{ tag: 'h2', attrs: { id: 'cost-heading' }, text: t.trust.cost.heading },
							{ tag: 'p', attrs: { id: 'cost-lead' }, text: t.trust.cost.lead }
						]
					},
					/* An illustration slot, described in place so the brief travels with
					   the markup rather than in someone's notes. */
					/*
					 * ARCH-CROPPED, not a rectangle.
					 *
					 * The reference set never shows a plain rectangle: every image is
					 * cut into an arch, an oval or a pill, and that shape is what makes
					 * a page read as composed rather than as a CMS. The crop is a
					 * `border-radius` on the figure with `overflow: hidden` — no mask
					 * asset, no clip-path, and it degrades to a soft rectangle in
					 * anything that cannot round a corner.
					 *
					 * `/hero.png` is a STAND-IN. The intended art is the horizon
					 * illustration: a woman on a ridge, arms open, facing a low sun —
					 * sunflower sky, marine and paradise ranges, sand rock. It is
					 * already this palette, which is why it belongs here rather than
					 * beside it: the section argues that starting is possible now, and
					 * the picture is what that feels like rather than what it costs.
					 */
					{
						tag: 'figure',
						class: 'art-arch',
						attrs: { id: 'cost-art' },
						children: [
							{
								tag: 'img',
								class: 'art-arch-img',
								attrs: {
									src: ART.horizon.src,
									alt: '',
									width: ART.horizon.width,
									height: ART.horizon.height,
									loading: 'lazy',
									decoding: 'async'
								}
							},
							/*
							 * The statement rides ON the picture. It was a line of type in
							 * the flow below it, which made the illustration decoration and
							 * the sentence a caption; over the image they are one thing —
							 * the summit and what standing on it is called. A marine scrim
							 * across the lower third carries it, because the art's own sky
							 * is sunflower and nothing legible sits on that directly.
							 */
							{
								tag: 'figcaption',
								attrs: { id: 'cost-overlay' },
								children: [
									{ tag: 'span', class: 'paren', attrs: { 'aria-hidden': 'true' }, text: '(' },
									{ tag: 'span', attrs: { id: 'cost-kicker' }, text: t.trust.cost.kicker },
									{ tag: 'span', class: 'paren', attrs: { 'aria-hidden': 'true' }, text: ')' }
								]
							}
						]
					},
					/* The ticker: short facts separated by marks, edge to edge. Static,
					   not a marquee — motion here would be decoration that has to be
					   turned off again for anyone who asked for less of it. */
					/* The price sheet. The old figure is struck and bare; the offer is a
					   SUNFLOWER GROUND with marine ink — the brand accent at full
					   strength, in the one job it can hold here. As a mark on cream it
					   measures 1.71:1 and fails even the 3:1 a shape needs; as a ground
					   under marine it is 8.27:1. A colour that cannot be a line can
					   still be a field. */
					{
						tag: 'div',
						attrs: { id: 'cost-price' },
						children: [
							{
								tag: 'div',
								class: 'cost-panel',
								attrs: { id: 'cost-was' },
								children: [
									{ tag: 'p', class: 'cost-panel-label', text: t.trust.cost.human.label },
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
							class: 'cost-panel',
							attrs: { id: 'cost-now' },
							children: [
								{ tag: 'p', class: 'cost-panel-label', text: t.trust.cost.aven.label },
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
						},
						]
					},
					{
						tag: 'p',
						attrs: { id: 'cost-closing' },
						text: t.trust.cost.closing
					},
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
					},
					/* The closing statement, centred and given the full width. It is the
					   emotional turn of the section and it was tucked into the story
					   column at body scale, which is where an argument goes to be
					   missed. */
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
	/*
	 * ONE data attribute, not five ternaries.
	 *
	 * Every node here used to pick its own id — `past ? 'shift-was-title' :
	 * 'shift-now-title'` and four more like it — so the two scripts were two
	 * parallel trees that happened to have the same shape, and the stylesheet
	 * carried a matching pair of rules for every part. That is what a view
	 * "needing a conditional" actually looks like: it is not logic, it is
	 * presentation deciding its own selector.
	 *
	 * The variant is DATA. `data-script` says which of the two this is, the
	 * parts are named the same in both, and CSS branches on the attribute. The
	 * view is now identical for both sides and takes no decision at all — which
	 * is the point, because a ViewDef that cannot make a decision cannot make a
	 * wrong one.
	 */
	return {
		tag: 'div',
		class: 'shift-script',
		attrs: { id: `shift-${side}`, 'data-script': side },
		children: [
			ruleLabel(script.eyebrow),
			{ tag: 'h3', class: 'shift-script-title', text: script.title },
			{
				tag: 'ul',
				class: 'shift-script-items',
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
			{ tag: 'p', class: 'shift-script-closing', text: script.closing }
		]
	}
}

function shiftView(t: (typeof home)['de']): ViewNode {
	return {
		tag: 'section',
		class: 'section section--measure-page',
		attrs: { 'aria-labelledby': 'shift-heading' },
		children: [
			{
				tag: 'div',
				class: 'section-inner',
				attrs: { id: 'shift-inner' },
				children: [
					/*
					 * The head is PAIRED with an image, which is what stops this section
					 * hanging off the left edge. A 544px block of text alone in a
					 * 1344px field is not a composition, it is a column with a margin —
					 * and four of those stacked was the "left-heavy" reading. An oval
					 * crop rather than the arithmetic's arch, so the two sections rhyme
					 * without repeating.
					 */
					{
						tag: 'div',
						attrs: { id: 'shift-head' },
						children: [
							ruleLabel(t.shift.eyebrow, '03'),
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
					{
						tag: 'p',
						attrs: { id: 'shift-question' },
						children: [
							{ tag: 'span', class: 'paren', attrs: { 'aria-hidden': 'true' }, text: '( ' },
							{ tag: 'span', text: '@@shift-question@@' },
							{ tag: 'span', class: 'paren', attrs: { 'aria-hidden': 'true' }, text: ' )' }
						]
					},
					/*
					 * The comparison and the picture, as one spread.
					 *
					 * The two scripts sat side by side and the section had no image at
					 * all, so the argument was four columns of type in a row. Stacked
					 * two-thirds left — the script being left behind above the one being
					 * argued for, which is the order the reader moves through them — and
					 * the picture holds the remaining third: what the second script
					 * actually buys, which is the thing the words cannot say.
					 */
					{
						tag: 'div',
						attrs: { id: 'shift-spread' },
						children: [
							{
								tag: 'div',
								attrs: { id: 'shift-scripts' },
								children: [
									scriptColumn(t.shift.without, 'without'),
									scriptColumn(t.shift.with, 'with')
								]
							},
							{
								tag: 'figure',
								class: 'art-square',
								attrs: { id: 'shift-art' },
								children: [
									{
										tag: 'img',
										class: 'art-arch-img',
										attrs: {
											src: ART.garden.src,
											alt: '',
											width: ART.garden.width,
											height: ART.garden.height,
											loading: 'lazy',
											decoding: 'async'
										}
									}
								]
							},
							/*
							 * A CHILD of the spread, not a sibling of it. It was written
							 * after the spread's `children` array closed, so it was a
							 * sibling in `#shift-inner` — which has no gap — and sat flush
							 * against the row above. It looked spanning because both
							 * elements fill the section measure at the same width, which is
							 * exactly why a width comparison could not tell them apart.
							 */
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
					/* The resolution, on the section's own left edge like everything
					   else. It was centred with utility classes AND an inline `style`
					   attribute carrying the colour — a token bypass, and the last
					   thing on the page still writing one. */
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
					{ tag: 'p', attrs: { id: 'company-subline' }, text: '@@company-subline@@' },
					/*
					 * THE TWO ROLES, faced off across a rule.
					 *
					 * The heading says "1 human + 1 avenCEO" and the prose then had to
					 * spell the two out again inside a sentence. They are the section's
					 * subject, so they get to BE the layout: one each side, ranged toward
					 * the rule between them, the same device the cost comparison uses.
					 */
					{
						tag: 'div',
						attrs: { id: 'company-roles' },
						children: t.company.roles.map(
							(role, i): ViewNode => ({
								tag: 'div',
								class: 'company-role',
								attrs: { 'data-side': i === 0 ? 'human' : 'aven' },
								children: [
									{ tag: 'p', class: 'company-role-label', text: role.label },
									{ tag: 'p', class: 'company-role-title', text: role.title },
									{ tag: 'p', class: 'company-role-text', text: role.text }
								]
							})
						)
					},
					{
						tag: 'div',
						class: 'mx-auto mt-16 max-w-xl',
						attrs: { id: 'company-closing-panel' },
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
		class: 'section section--ground-raised section--measure-page',
		attrs: { 'aria-labelledby': 'own-heading' },
		children: [
			{
				tag: 'div',
				class: 'section-inner',
				attrs: { id: 'own-grid' },
				children: [
					{
						tag: 'div',
						attrs: { id: 'own-head' },
						children: [
							ruleLabel(t.own.eyebrow, '04'),
							{
								tag: 'h2',
								attrs: { id: 'own-heading' },
								text: t.own.headingLine1,
								children: [{ tag: 'span', class: 'own-heading-line', text: t.own.headingLine2 }]
							},
							{ tag: 'p', attrs: { id: 'own-lead' }, text: t.own.lead }
						]
					},
					/*
					 * The picture of the claim, not a decoration beside it: a yard of
					 * Avens turning fruit into stock while nobody watches. The section
					 * argues that an Aven is an asset that works without you, and this
					 * is what that looks like.
					 */
					{
						tag: 'figure',
						class: 'art-band',
						attrs: { id: 'own-art' },
						children: [
							{
								tag: 'img',
								class: 'art-arch-img',
								attrs: {
									src: ART.assembly.src,
									alt: '',
									width: ART.assembly.width,
									height: ART.assembly.height,
									loading: 'lazy',
									decoding: 'async'
								}
							}
						]
					},
					/*
					 * A LADDER, and the numbering is real: one Aven, then one per idea,
					 * then a fleet that compounds. Three equal cards said the three were
					 * alternatives; they are stages, and the last is the payoff, so it
					 * is the one that carries the ground.
					 */
					{
						tag: 'ol',
						attrs: { id: 'own-rungs' },
						children: t.own.rungs.map(
							(rung, i): ViewNode => ({
								tag: 'li',
								class: 'own-rung',
								attrs: i === t.own.rungs.length - 1 ? { 'data-rung': 'last' } : {},
								children: [
									{ tag: 'p', class: 'own-rung-index', text: String(i + 1).padStart(2, '0') },
									{ tag: 'p', class: 'own-rung-count', text: rung.count },
									{ tag: 'p', class: 'own-rung-title', text: rung.title },
									{ tag: 'p', class: 'own-rung-text', text: rung.text }
								]
							})
						)
					},
					{ tag: 'p', attrs: { id: 'own-closing' }, text: t.own.closing }
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
			{ tag: 'p', class: 'text--eyebrow', text: t.skills.eyebrow },
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
			{ tag: 'p', class: 'text--eyebrow', text: t.start.eyebrow },
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
	skillsHead: string
	skillsAll: string
	startHead: string
}

export async function renderHomeSections(lang: Lang): Promise<HomeSections> {
	const t = pick(home, lang)
	return {
		hero: await renderSection(heroView(t), {
			'@@home-hero-video@@': HERO_VIDEO_HTML,
			'@@home-hero-lead@@': t.hero.transformationHtml
		}),
		trust: await renderSection(trustView(t), {
			'@@trust-headline@@': t.trust.headlineRest
		}),
		cost: await renderSection(costView(t)),
		shift: await renderSection(shiftView(t), {
			'@@shift-body@@': t.shift.bodyHtml,
			'@@shift-question@@': t.shift.question
		}),
		company: await renderSection(companyView(t), {
			'@@company-subline@@': t.company.sublineHtml,
			'@@company-closing@@': `${t.company.closingLine2Before} <span class="font-sans font-medium">${t.company.closingLine2Strong}</span>.`
		}),
		own: await renderSection(ownView(t)),
		skillsHead: await renderSection(skillsHeadView(t)),
		skillsAll: await renderSection(skillsAllView(t, lang)),
		startHead: await renderSection(startHeadView(t), { '@@start-body@@': t.start.bodyHtml })
	}
}
