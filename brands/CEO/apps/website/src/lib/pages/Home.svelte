<script lang="ts">
/**
 * The landing page, delivered as CONFIGURATION.
 *
 * Every static band — hero, trust, shift, company, ownership, the
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
import ClaimSection from '$lib/components/ClaimSection.svelte'
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

	{@html sections.company}
	{@html sections.shift}


	{@html sections.own}


	<!-- Skills preview: what an Aven can already do, straight from the
	     marketplace. The frame's head and the "see all" line are config; the
	     grid of cards is the shared Svelte component (see the header comment). -->
	<section class="section sm:px-8 sm:py-20" aria-labelledby="skills-preview-heading">
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

	<ClaimSection {lang} head={sections.startHead} />

	<SiteFooter {lang} />
</div>

<style>
/*
 * CONTAINER QUERIES, not media queries, for anything that is about SPACE.
 *
 * A media query asks how wide the window is, which is the wrong question for a
 * block that might be rendered in a sidebar, a storybook stage or a half-width
 * preview — right by accident at full width and wrong everywhere else. Every
 * `.section` declares `container-type: inline-size`, so these ask the section
 * how wide IT is.
 *
 * The two that remain `@media` are `prefers-reduced-motion`: a user preference
 * is not a measurement, and there is no container to ask.
 *
 * THE THRESHOLDS CAME DOWN by 4rem each, because they are no longer measuring
 * the same thing. A section is narrower than the window by its own padding —
 * 736px of content inside a 768px window — so `48rem` against the window and
 * `48rem` against the container are different questions, and the second one was
 * false exactly where the first was true. Measured: the price comparison
 * dropped from two columns to one at 768px until the numbers were re-tuned.
 */
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
/* The three emphasis roles are the `emph` unit now — which also closes a
   drift: they only loaded on this page, so the same spans rendered unstyled
   inside the claim card on every other route. */
/* On the hero photograph the page inks do not apply: everything there is the
   light ink, and `past` is that ink held back. */
:global(#home-hero [data-emph="past"]) {
	color: var(--color-on-dark);
	opacity: 0.6;
}

/* The thesis band is the `company` unit — the measured teal-headroom notes
   live in its part descriptions now. */

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
	/* The MIDDLE stop lightens, the top one does not. The top is the documented
	   guarantee for the nav links over the video's sky and dropping it would
	   re-break exactly the bug the note above records. The middle was the
	   darkest stop of the three (68% against the top's 65%), which is what made
	   the scene look painted over rather than lit through — it takes
	   `--color-scrim-heavy` (55%) rather than the 68% it was.

	   The first attempt used `--color-scrim-text` (45%) and MEASURED at 2.99:1
	   behind the 64px display line — a hundredth under the 3:1 large text needs,
	   which no gate would have caught because every gate reports this element as
	   "sits on imagery, check by eye". 55% is the lightest stop that holds. */
	background: linear-gradient(
		to bottom,
		var(--color-scrim-strong) 0%,
		var(--color-scrim-heavy) 45%,
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
:global(#home-hero) {
	container-type: inline-size;
}

/* The scripts are the `shift` unit's `script` part, branching on
   `data-script` — one rule per part, two branches, in the unit. */

/* The ownership ladder is the `own` unit — including the no-container rung
   note, which now lives where the next person will look for it. */

/* The section's own layout — inner, head, question band, turn — is the
   `shift` unit. */

/*
 * `rule-label` and `paren` are UNITS now — the old decline note said the
 * device becomes one "when the contract grows a non-container composite",
 * and it did: the hugging class (content-sized inline-size) is exactly that.
 * The declarations moved verbatim; only the address changed.
 */
/* The arithmetic is the `cost` unit: overlay, panels, figures, ticker and
   the closing rate all render from its parts, measured colour notes included.
   The crops themselves are `media-frame`. */


/*
 * THE DIVIDER, edge to edge.
 *
 * `100%` of the page rather than a viewport unit: the shell is the containing
 * block, so a percentage gives full bleed without the scrollbar-width error
 * `100vw` introduces and the overflow that error causes at narrow widths.
 *
 * The ratio matches the file (8:3) rather than being capped to a height —
 * capping meant `object-fit: cover` cropped the picture to a strip, which on
 * the previous divider left a sliver of table and none of the subject.
 */
:global(#skills-divider) {
	margin: 0;
	inline-size: 100%;
	aspect-ratio: 1920 / 720;
	overflow: hidden;
	background: var(--color-surface-sunken);
}
:global(#skills-divider img) {
	inline-size: 100%;
	block-size: 100%;
	object-fit: cover;
	display: block;
}

/* The trust band is the `trust` unit — headline, lockup and the three
   claim chips all render from its parts. */


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
