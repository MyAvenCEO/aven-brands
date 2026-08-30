<script lang="ts">
/**
 * The landing page, delivered as CONFIGURATION.
 *
 * Every static band — hero, trust, shift, company, ownership, founders, the
 * section heads — is a ViewDef in `$lib/vibes/home.ts`, rendered to HTML at
 * build time by the route's server load and placed here with `{@html}`. No
 * island: nothing in those bands moves, so nothing hydrates and they ship
 * zero JavaScript. What remains Svelte in this file is exactly the part a
 * ViewDef cannot be yet:
 *
 *   - `MarketingSiteHeader` (the menu island lives inside it),
 *   - the skills preview GRID: `SkillMarketplaceCard` is shared with the
 *     marketplace page, and its accessible name carries a typographic dash
 *     the engine's attribute sanitiser would strip,
 *   - `AvenIdCheckCta`: real network logic, a future sandbox-tier island,
 *   - `SiteFooter`.
 *
 * All {@html} below renders our own build-rendered views and static copy
 * from $lib/i18n/home.ts — never user content.
 */
import { page } from '$app/state'
import AvenIdCheckCta from '$lib/components/AvenIdCheckCta.svelte'
import MarketingSiteHeader from '$lib/components/MarketingSiteHeader.svelte'
import SiteFooter from '$lib/components/SiteFooter.svelte'
import SkillMarketplaceCard from '$lib/components/SkillMarketplaceCard.svelte'
import { type Lang, pick } from '$lib/i18n'
import { home } from '$lib/i18n/home'
import { loadSkills } from '$lib/skills/loader'
import type { HomeSections } from '$lib/vibes/home'

let { lang }: { lang: Lang } = $props()

const t = $derived(pick(home, lang))

/** A taste of the marketplace: the first six skills, the full list lives at /skills. */
const skillsPreview = $derived(loadSkills(lang).slice(0, 6))

/** The build-rendered sections. A route that renders this page without
 * providing them has broken the delivery contract — fail the build, not the
 * reader. */
const sections: HomeSections = page.data.homeSections
if (!sections) throw new Error('[home] missing homeSections — the route has no server load')
</script>

<svelte:head>
	<title>{t.title}</title>
	<meta name="description" content={t.description}>
</svelte:head>

<div {lang} class="app-shell">
	<MarketingSiteHeader maxWidth="6xl" {lang} overlay />

	{@html sections.hero}

	{@html sections.trust}
	{@html sections.cost}

	{@html sections.shift}

	{@html sections.company}

	{@html sections.own}

	{@html sections.founders}

	<!-- Skills preview: what an Aven can already do, straight from the
	     marketplace. The frame's head and the "see all" line are config; the
	     grid of cards is the shared Svelte component (see the header comment). -->
	<section class="section-band sm:px-8 sm:py-20" aria-labelledby="skills-preview-heading">
		<div class="mx-auto max-w-5xl">
			{@html sections.skillsHead}

			<div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each skillsPreview as skill (skill.slug)}
					<SkillMarketplaceCard {skill} {lang} />
				{/each}
			</div>

			{@html sections.skillsAll}
		</div>
	</section>

	<section class="border-b border-border/8 px-5 py-14 sm:px-8 sm:py-16">
		<div class="mx-auto max-w-2xl">
			{@html sections.startHead}
			<AvenIdCheckCta variant="banner" {lang} />
		</div>
	</section>

	<SiteFooter {lang} />
</div>

<style>
/*
 * Every selector below is `:global(...)` for one reason: the sections arrive
 * through `{@html}` from the build render, so Svelte never compiled their
 * elements and a scoped selector would match nothing. The ids are the same
 * ids the ViewDefs carry — an id plus a scoped rule is this project's shape
 * for genuinely one-off styling, because the utility layer treats an unknown
 * CLASS as a candidate to generate and a bespoke one takes the dev server
 * down.
 */

/*
 * Emphasis inside translated copy.
 *
 * Three roles, styled here rather than in the sentence. `lead` is the default
 * and is only a weight — it used to be four different opacities (80, 82, 85,
 * 88) for one idea, none of which anyone could see the difference between.
 * `strong` is the hero's highlight, and stays sunflower because it sits on a
 * photograph, where the tone reads and the page's inks do not. `past` is the
 * life being left behind, so it is struck through and quiet.
 */
:global([data-emph]) {
	font-weight: 500;
}
:global([data-emph="strong"]) {
	color: var(--color-accent);
}
:global([data-emph="past"]) {
	color: var(--color-foreground-quiet);
	text-decoration: line-through;
}
/* On the hero photograph the page inks do not apply: everything there is the
   light ink, and `past` is that ink held back. */
:global(#home-hero [data-emph="past"]) {
	color: var(--color-on-dark);
	opacity: 0.6;
}

/*
 * Emphasis inside translated copy.
 *
 * The heading used to carry `<span style="color:var(--color-accent)">` in the
 * sentence itself — a colour decision living in content, in two languages, and
 * one that measured 2.72:1 against the band it sits on. Sunflower cannot be
 * made to read on paradise: the lightest version that clears 4.5:1 is white.
 * So on a band the emphasis is weight, and the copy says `<b>`, which is what
 * it meant.
 */
:global(#company-heading b) {
	font-weight: 600;
}

/* The company thesis sits on marine, but its emphasised words are authored
   with the light-page tone (text-foreground) — lift them so they read on the
   dark spread. Keyed off the id so the strict utility plugin ignores it. */
:global(#company-prose strong),
:global(#founders-prose strong) {
	color: var(--color-primary-foreground);
	font-weight: 500;
}

/* The hero is its own dark stage: the video sits behind, a soft scrim
   darkens the bright footage, and the copy goes light on top. Colours and
   the gradient live here (scoped CSS, keyed off ids so the strict utility
   plugin leaves them alone) so the stack stays theme-independent — the
   banner is dark in either theme. */
:global(#home-hero) {
	position: relative;
	isolation: isolate;
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 85vh;
	padding-block: clamp(5rem, 12vh, 9rem);
}

/* The video cannot be a view node (the engine's tag allowlist admits no
   `<video>`), so it arrives through the render seam inside this wrapper —
   which dissolves, so the video's absolute inset still resolves against
   the section. */
:global(#home-hero-media) {
	display: contents;
}

:global(#home-hero-video) {
	position: absolute;
	inset: 0;
	z-index: -2;
	width: 100%;
	height: 100%;
	object-fit: cover;
}

/* Slightly stronger at top and bottom, lighter through the middle where the
   scene reads — enough to carry white text, not enough to flatten it. */
:global(#home-hero-scrim) {
	position: absolute;
	inset: 0;
	z-index: -1;
	/* The scrim's three stops are TOKENS, not percentages written here. They were
	   50/32/55 of marine, mixed at this call site, which is how the top stop came
	   to be 50% -- measurably not enough to carry white nav ink over the video's
	   sky (2.99:1 at the 95th percentile, where the links need 4.5:1). Now the
	   guarantee lives in the role, `--color-scrim-strong`, and raising it fixes
	   every surface that floats text on media rather than this one. */
	background: linear-gradient(
		to bottom,
		var(--color-scrim-strong) 0%,
		var(--color-scrim) 42%,
		var(--color-scrim-heavy) 100%
	);
}

/*
 * The three absolutes as a row, split by hairlines.
 *
 * An id and a scoped rule rather than a class: this project's utility layer
 * treats an unknown CLASS name as a candidate to generate, and a bespoke one
 * takes the dev server down. Anything genuinely one-off is an id.
 *
 * `auto-fit` rather than three fixed columns, so the row becomes a column on a
 * narrow phone instead of squeezing three uppercase captions into 90px each.
 * The rules are `border-inline-start` on every item after the first, which is
 * the same hairline rhythm `nav-menu` uses between destinations -- and they
 * disappear on their own once the items stack, because the first item of each
 * row is the only one that ever loses its rule.
 */
/* The shift section's head: centred, and narrower than the spread below it so
   the eye has one column to start in before the page splits in two. */
/*
 * CONTAINERS FOR THE SECTIONS THAT SIZE TYPE BY THEIR OWN WIDTH.
 *
 * Four headlines on this page clamped against `vw`, which is the WINDOW. In a
 * 1400px browser showing a 640px column the type is set from a box the text is
 * not in — right by accident at full width, wrong in every preview, sidebar
 * and storybook stage. `cqi` is the same number against the element's own
 * container, and a container only exists where something declares one.
 *
 * The `section` unit declares its own; these three are still hand-rolled
 * markup, so they declare one here until they are units too.
 */
:global(#home-hero),
:global(#company-band),
:global(#founders > div) {
	container-type: inline-size;
}

/*
 * THE SHIFT — one left edge, all the way down.
 *
 * It mixed alignments in a single breath: the head centred at 544px, the
 * question centred at 768px, the two scripts spanning the full 1344px, the
 * resolution centred again at 672px. Four measures and two alignments, so the
 * scripts read as a break rather than as the section's middle. Everything
 * starts on the same edge now, and the scripts are the only two-column
 * moment — which makes that split deliberate instead of accidental.
 */
:global(#shift-head) {
	display: grid;
	gap: var(--space-tight);
	max-inline-size: 34rem;
}

/* The pull-quote: the page's turn, and the largest thing in the section, so
   it leads. `cqi`, never `vw` — see the note at the call site. */
:global(#shift-question) {
	max-inline-size: 44rem;
	margin: var(--space-section) 0 0;
	font-family: var(--font-display);
	font-size: clamp(1.75rem, 5cqi, 3rem);
	font-weight: 400;
	line-height: 1.1;
	letter-spacing: var(--tracking-tight);
	text-wrap: balance;
	color: var(--color-foreground);
}
:global(#shift-turn) {
	display: grid;
	gap: var(--space-tight);
	max-inline-size: 34rem;
	margin-block-start: var(--space-section);
	padding-block-start: var(--space-loose);
	border-block-start: 1px solid var(--color-border-soft);
}
:global(#shift-turn-lead) {
	margin: 0;
	font-size: var(--fs-meta);
	color: var(--color-foreground-quiet);
}
:global(#shift-turn-kicker) {
	margin: 0;
	font-family: var(--font-display);
	font-size: clamp(var(--fs-amount), 4cqi, 2.25rem);
	font-weight: 400;
	line-height: 1.15;
	letter-spacing: var(--tracking-tight);
	color: var(--color-eyebrow-ink);
}

/*
 * THE ARITHMETIC — an editorial spread on ONE grid.
 *
 * The previous version stacked blocks at 576px, full, full and 544px, all
 * flush left in a 1344px field: four measures, no relationship, and more than
 * half the width empty beside the parts that mattered. Everything sits in one
 * grid now, so the story and the price FACE each other and the price reads as
 * the answer to the heading rather than a fact filed underneath it.
 */
:global(#cost-grid) {
	display: grid;
	gap: var(--space-section) var(--space-loose);
	align-items: start;
}
@media (min-width: 56rem) {
	:global(#cost-grid) {
		/* The price column is narrower and it still leads, because it holds the
		   largest type on the section. Room is not the only way to lead. */
		grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
	}
	:global(#cost-does) {
		grid-column: 1 / -1;
	}
}
:global(#cost-story) {
	display: grid;
	gap: var(--space-comfortable);
	align-content: start;
	max-inline-size: 34rem;
}
:global(#cost-heading) {
	margin: 0;
	font-family: var(--font-display);
	font-size: clamp(var(--fs-display), 5cqi, 3rem);
	font-weight: 400;
	line-height: 1.08;
	letter-spacing: var(--tracking-tight);
	text-wrap: balance;
	color: var(--color-foreground);
}
:global(#cost-lead) {
	margin: 0;
	font-size: var(--fs-lead);
	line-height: 1.5;
	text-wrap: pretty;
	color: var(--color-foreground-soft);
}
:global(#cost-turn) {
	display: grid;
	gap: var(--space-tight);
	margin-block-start: var(--space-comfortable);
	padding-block-start: var(--space-comfortable);
	border-block-start: 1px solid var(--color-border-soft);
}
:global(#cost-closing) {
	margin: 0;
	font-size: var(--fs-meta);
	color: var(--color-foreground-quiet);
}
:global(#cost-kicker) {
	margin: 0;
	font-family: var(--font-display);
	font-size: clamp(var(--fs-lead), 3cqi, var(--fs-amount));
	font-weight: 400;
	line-height: 1.15;
	letter-spacing: var(--tracking-tight);
	color: var(--color-foreground);
}

/* The price column: one object, the old figure struck directly above the one
   replacing it, held together by the accent edge. */
:global(#cost-price) {
	display: grid;
	gap: var(--space-loose);
	padding-inline-start: var(--space-loose);
	border-inline-start: 2px solid var(--color-sunflower);
}
:global(#cost-was),
:global(#cost-now) {
	display: grid;
	gap: var(--space-hairline);
}
:global(#cost-was-figure),
:global(#cost-now-figure) {
	display: flex;
	flex-wrap: wrap;
	align-items: baseline;
	gap: var(--space-tight);
	margin: 0;
	font-family: var(--font-display);
	font-variant-numeric: tabular-nums;
	line-height: 1;
}
:global(#cost-was-value) {
	font-size: var(--fs-amount);
	font-weight: 400;
	color: var(--color-foreground-quiet);
	/* The page's own gesture, third time: the hero strikes a sentence, the
	   shift a script, this a salary. CSS and not an `<s>` element — SAFE_TAGS
	   admits no `s`, so the tag fell back to a div and the line never drew. */
	text-decoration: line-through;
	text-decoration-thickness: 1px;
	text-decoration-color: var(--color-foreground-quiet);
}
:global(#cost-now-value) {
	font-size: clamp(2.75rem, 7cqi, 4rem);
	font-weight: 400;
	color: var(--color-paradise);
}
:global(#cost-was-unit),
:global(#cost-now-unit) {
	font-family: var(--font-sans);
	font-size: var(--fs-meta);
	color: var(--color-foreground-quiet);
}
:global(#cost-was-note),
:global(#cost-now-note) {
	margin: var(--space-tight) 0 0;
	font-size: var(--fs-meta);
	line-height: 1.55;
	color: var(--color-foreground-soft);
}

/* The receipts, across both columns and separated by a rule: they qualify the
   story and the price equally, so they belong to neither. */
:global(#cost-does) {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(min(13rem, 100%), 1fr));
	gap: var(--space-comfortable) var(--space-loose);
	margin: 0;
	padding-block-start: var(--space-loose);
	border-block-start: 1px solid var(--color-border-soft);
	list-style: none;
}
:global(#cost-does > li) {
	display: flex;
	align-items: baseline;
	gap: var(--space-tight);
	font-size: var(--fs-meta);
	line-height: 1.4;
	color: var(--color-foreground);
}
:global(.cost-does-mark) {
	flex: 0 0 auto;
	inline-size: 0.75rem;
	block-size: 2px;
	background: var(--color-paradise);
}

/*
 * THE SHIFT — one script leads, the other annotates.
 *
 * Two equal columns separated by a rule asked the reader to adjudicate; this
 * asks them to arrive. The past script is a quiet annotation with its lines
 * struck, the future one is set at reading size and marked in paradise — the
 * page's own strike-the-old gesture, third appearance, which is what makes it
 * a gesture rather than a decoration.
 *
 * Paradise DIRECT: 3.93:1 on this ground carries a tracked uppercase eyebrow
 * (3:1 applies) and the markers, which are shapes. No darkened ink, and no
 * inline `style` attribute — the old code wrote both.
 */
:global(#shift-scripts) {
	display: grid;
	gap: var(--space-section);
	margin-block-start: var(--space-section);
}
@media (min-width: 52rem) {
	:global(#shift-scripts) {
		/* The future script gets the room: not a half, a majority. */
		grid-template-columns: 4fr 6fr;
		gap: var(--space-section);
		align-items: start;
	}
}
:global(#shift-was),
:global(#shift-now) {
	display: grid;
	gap: var(--space-tight);
	min-inline-size: 0;
}
:global(#shift-was-eyebrow) {
	color: var(--color-foreground-quiet);
}
/*
 * The one place paradise CANNOT go directly, and the measurement says so:
 * this eyebrow is 11px, so WCAG asks 4.5:1 of it, and paradise on cream is
 * 3.93 — it clears the 3:1 that large text and shapes get, and misses the
 * bar for a glyph this small. `eyebrow-ink` IS paradise, darkened exactly far
 * enough to pass; that is the whole reason the rank exists.
 *
 * The tone still runs through this section undiluted where it can carry
 * itself: the markers are shapes (3:1) and the arithmetic's figure is 56px
 * (3:1). Accessibility outranks aesthetics — the rule the system leads with,
 * and this is what it looks like when it bites.
 */
:global(#shift-now-eyebrow) {
	color: var(--color-eyebrow-ink);
}
:global(#shift-was-title),
:global(#shift-now-title) {
	margin: 0;
	font-family: var(--font-display);
	font-weight: 400;
	line-height: 1.15;
	letter-spacing: var(--tracking-tight);
	text-wrap: balance;
}
:global(#shift-was-title) {
	font-size: var(--fs-lead);
	color: var(--color-foreground-quiet);
}
:global(#shift-now-title) {
	font-size: clamp(var(--fs-amount), 4.5cqi, 2.25rem);
	color: var(--color-foreground);
}
:global(#shift-was-items),
:global(#shift-now-items) {
	display: grid;
	gap: var(--space-tight);
	margin: var(--space-tight) 0 0;
	padding: 0;
	list-style: none;
}
:global(#shift-was-items > li),
:global(#shift-now-items > li) {
	display: flex;
	gap: var(--space-comfortable);
	align-items: baseline;
}
:global(#shift-was-items) {
	font-size: var(--fs-meta);
	line-height: 1.5;
	color: var(--color-foreground-quiet);
}
/* Struck, like the salary and like "working to survive": this is the script
   being left behind, and the line says so without a word of copy. */
:global(#shift-was-items > li > span:last-child) {
	text-decoration: line-through;
	text-decoration-thickness: 1px;
	text-decoration-color: color-mix(in oklab, var(--color-foreground) 35%, transparent);
}
:global(#shift-now-items) {
	font-size: var(--fs-lead);
	line-height: 1.45;
	color: var(--color-foreground);
}
:global(.shift-marker) {
	flex: 0 0 auto;
	inline-size: 1rem;
	block-size: 1px;
	margin-block-start: 0.55em;
	background: color-mix(in oklab, var(--color-foreground) 25%, transparent);
}
:global(#shift-now-items .shift-marker) {
	block-size: 2px;
	background: var(--color-paradise);
}
:global(#shift-was-closing),
:global(#shift-now-closing) {
	margin: var(--space-comfortable) 0 0;
	text-wrap: pretty;
}
:global(#shift-was-closing) {
	font-size: var(--fs-meta);
	color: var(--color-foreground-quiet);
}
:global(#shift-now-closing) {
	font-family: var(--font-display);
	font-size: clamp(var(--fs-lead), 3cqi, var(--fs-amount));
	line-height: 1.3;
	color: var(--color-foreground);
}

:global(#trust-claims) {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(min(9rem, 100%), 1fr));
	gap: var(--space-comfortable);
	inline-size: 100%;
	max-inline-size: 48rem;
	margin-inline: auto;
	margin-block-start: var(--space-loose);
}
:global(#trust-claims > li + li) {
	border-inline-start: 1px solid color-mix(in oklab, var(--color-band-foreground) 15%, transparent);
}

:global(#home-hero-content) {
	position: relative;
}

:global(#home-hero-heading) {
	color: var(--color-on-dark);
	text-shadow: 0 2px 24px color-mix(in srgb, var(--color-marine) 45%, transparent);
}

:global(#home-hero-lead) {
	color: color-mix(in srgb, var(--color-on-dark) 94%, transparent);
	text-shadow: 0 1px 16px color-mix(in srgb, var(--color-marine) 40%, transparent);
}

/* The muted half of the transformation line is dark by default (built in
   home.ts for the light page) — lift it to a soft white on the video. The
   accent half keeps its brand gold, which reads well over the scrim. */
:global(#home-hero-lead strong.text-foreground\/50) {
	color: color-mix(in srgb, var(--color-on-dark) 68%, transparent);
}

:global(#home-hero-helper) {
	color: color-mix(in srgb, var(--color-on-dark) 72%, transparent);
	text-shadow: 0 1px 12px color-mix(in srgb, var(--color-marine) 40%, transparent);
}

/* The CEO's beam avatar arrives through the seam as generated SVG; these two
   declarations are what `[&>svg]:block [&>svg]:size-full` said when the
   wrapper was compiled markup. */
:global(#founders-ceo-avatar svg) {
	display: block;
	width: 100%;
	height: 100%;
}

@media (prefers-reduced-motion: reduce) {
	:global(#home-hero-video) {
		display: none;
	}
	/* With the video hidden, the poster still shows via the section's own
	   background so the stage is never blank. */
	:global(#home-hero) {
		background: var(--color-marine) center / cover no-repeat url("/hero-poster.jpg");
	}
}
</style>
