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
/*
 * THE TEAL BAND WAS MONOTONE FOR A REASON, and the reason has to be worked
 * around rather than argued with.
 *
 * Every element on it was `text-band-foreground` — one ink across five type
 * sizes — which reads as flat. But the band is `#217c91`, and MEASURED against
 * it: white is 4.61:1, the accent ring 4.05, the accent edge 3.29, sunflower
 * itself 2.72. White barely clears the 4.5 body text needs, so there is no
 * second body ink available here. Anything tinted at paragraph size fails, and
 * accessibility outranks the aesthetics that want it.
 *
 * So the contrast comes from the two places it still can:
 *
 *   GROUND — the closing moves onto a marine block. Marine against paradise is
 *   a brand pairing, it gives the section an ending that is a shape rather than
 *   a hairline, and white on marine measures 13.98:1, which is the most
 *   headroom anything on this band has had.
 *
 *   LARGE TYPE — the 01/02 counters are 28px, so the 3:1 large-text threshold
 *   applies and `--color-accent-edge` (3.29:1) is legal there. It is the first
 *   warm note in the section and it lands on the only elements that can hold
 *   it.
 */
/*
 * THE TWO ROLES, faced off across a rule.
 *
 * The picture that was behind this band is gone: the illustration and the copy
 * were competing for the same middle third, and every fix for one cost the
 * other. The section's own subject is the pair in its heading, so the pair is
 * the layout — human left ranged right, aven right ranged left, a hairline
 * between them. Same device the cost comparison uses, which is the point: two
 * things being weighed look the same wherever the page weighs them.
 */
:global(#company-roles) {
	--gap: var(--space-loose);
	margin-block-start: var(--space-section);
}
/* Side by side the pair wants more air between the halves than it needs while
   they are stacked — the same query the unit switches on. */
@container (min-width: 44rem) {
	:global(#company-roles) {
		--gap: var(--space-section);
	}
}

:global(.company-role) {
	--gap: var(--space-hairline);
	align-content: start;
}
:global(.company-role-label) {
	margin: 0;
	font-size: var(--fs-eyebrow);
	font-weight: 600;
	letter-spacing: var(--tracking-widest);
	text-transform: uppercase;
	/*
	 * NO opacity. This band's white is 4.61:1 on the teal — 0.11 above what body
	 * text needs — so there is nothing to fade. Softening ink with `opacity` on
	 * a ground with no headroom is the same error twice now, and axe caught it
	 * both times. On this band, hierarchy is size and weight, never strength.
	 */
	color: var(--color-band-foreground);
}
:global(.company-role-title) {
	margin: 0;
	font-family: var(--font-display);
	font-size: clamp(var(--fs-amount), 3.4cqi, 2rem);
	font-weight: 400;
	line-height: 1.15;
	letter-spacing: var(--tracking-tight);
	text-wrap: balance;
	color: var(--color-band-foreground);
}
:global(.company-role-text) {
	margin: 0;
	font-size: var(--fs-lead);
	line-height: 1.4;
	color: var(--color-band-foreground);
}
/*
 * ONE line under the heading, centred, and it sits ABOVE the roles rather than
 * below them: it is the section's thesis and the pair beneath is the evidence.
 */
/* The close is centred, like the subline and the heading above it — it was the
   only block in the band still ranged left. */
:global(#company-closing-panel) {
	text-align: center;
}

:global(#company-subline) {
	--measure: 46rem;
	margin-block-start: var(--space-loose);
	font-size: var(--fs-lead);
	line-height: 1.5;
	text-align: center;
	text-wrap: pretty;
	color: var(--color-band-foreground);
}

:global(#company-closing-panel) {
	margin-block-start: var(--space-section);
	padding: var(--space-loose);
	border-radius: var(--radius-xl);
	background: var(--color-marine);
	color: var(--color-on-dark);
}

:global(#company-heading b) {
	font-weight: 600;
}

/* The company thesis sits on marine, but its emphasised words are authored
   with the light-page tone (text-foreground) — lift them so they read on the
   dark spread. Keyed off the id so the strict utility plugin ignores it. */
/*
 * The thesis' emphasised words are authored with the light-page tone, so they
 * are lifted to read on the dark spread.
 *
 * This selector was a GROUP — `#company-prose strong, #founders-prose strong`
 * (now `#company-subline strong`, the prose grid having collapsed to one line)
 * — and the founders cleanup deleted from the second selector to the closing
 * brace, which left this one dangling with no body. It then took the NEXT
 * rule's block as its own: every `<strong>` in the thesis inherited
 * `#home-hero`'s `display: flex; position: relative; overflow: hidden`, which
 * is why the paragraphs exploded into separate blocks with a void between
 * them. Deleting a selector from inside a group is not deleting a rule.
 */
:global(#company-subline strong) {
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
:global(#home-hero),
:global(#company-band) {
	container-type: inline-size;
}

/*
 * OWN IT — head, picture, ladder, close.
 *
 * It was three equal bordered cards in a row under a centred head, which is the
 * arrangement that makes a section read as generated: the eye lands nowhere and
 * nothing in the layout says which of the three matters. They are STAGES, not
 * options, so they are numbered and the last one carries the ground — the fleet
 * that compounds is the payoff the other two build to.
 */
:global(#own-grid) {
	--gap: var(--space-section);
}
/* Wider measure, looser tracking. At 44rem with `tracking-tight` it broke to
   four lines and the negative tracking closed the letters up exactly where a
   large display line needs them open. */
:global(#own-heading) {
	margin: 0;
	/* Wide enough that each AUTHORED line fits on one rendered line.
	   The heading is two sentences held in two blocks, so the target is two
	   rendered lines, not two per block. German is the constraint: "Sondern
	   einen fuer jede Idee, die du hast" is 41 characters against the English
	   line's 34, and at 20ch and 30ch both languages broke to four. */
	max-inline-size: 46ch;
	font-family: var(--font-display);
	font-size: clamp(var(--fs-display), 5cqi, 3rem);
	font-weight: 400;
	line-height: 1.1;
	letter-spacing: var(--tracking-normal);
	text-wrap: balance;
	color: var(--color-foreground);
}
/*
 * ONE RULE PER PART, branching on `data-script`.
 *
 * There were paired rules for every part — `#shift-was-title` and
 * `#shift-now-title`, `#shift-was-items` and `#shift-now-items`, and so on —
 * because the view chose a different id per side. Twenty-five selectors
 * describing two things that differ in exactly two ways: the ground and the
 * ink. The parts are named once now and the two differences are stated once.
 */
:global(.shift-script) {
	padding: var(--space-loose);
	border-radius: var(--radius-xl);
	display: grid;
	--gap: var(--space-comfortable);
	min-inline-size: 0;
	align-content: start;
}
:global(.shift-script[data-script='without']) {
	background: var(--color-surface-sunken);
}
/* The script being argued for: the accent tint under a sunflower rule.
   Sunflower measures 1.71:1 on cream and cannot be a glyph; as a 3px rule it is
   a shape, which is the job it can hold. */
/* Warm ground, warm ink. Marine on this tint is 13.01:1 and correct, but it
   made the panel read as a blue island in a yellow field; `accent-foreground`
   is the ramp's own ink for use ON the accent and measures 10.67:1 here, so the
   panel is one family throughout and the diptych now differs in BOTH ground and
   ink rather than ground alone. */
:global(.shift-script[data-script='with']) {
	position: relative;
	background: var(--color-accent-surface);
	color: var(--color-accent-foreground);
}
/* The future script's eyebrow takes the warm ramp, like the panel it sits on —
   `accent-ink` at 5.20:1 on that tint. It was `eyebrow-ink`, which is paradise:
   correct on cream and a cool note inside a warm card. */
:global(.shift-script[data-script='with']) :global(.rule-label) {
	color: var(--color-accent-ink);
}
:global(.shift-script[data-script='with']) :global(.shift-script-title),
:global(.shift-script[data-script='with']) :global(.shift-script-items),
:global(.shift-script[data-script='with']) :global(.shift-script-closing) {
	color: var(--color-accent-foreground);
}
:global(.shift-script[data-script='with'])::before {
	content: '';
	position: absolute;
	inset-block-start: 0;
	inset-inline: var(--space-loose);
	block-size: var(--rule-accent);
	border-radius: var(--radius-full);
	background: var(--color-sunflower);
}
:global(.shift-script-title) {
	margin: 0;
	font-family: var(--font-display);
	font-size: clamp(var(--fs-amount), 3.4cqi, 2rem);
	font-weight: 400;
	line-height: 1.15;
	letter-spacing: var(--tracking-tight);
	text-wrap: balance;
	color: var(--color-foreground);
}
:global(.shift-script[data-script='without']) :global(.shift-script-title) {
	color: var(--color-foreground-quiet);
}
:global(.shift-script-items) {
	display: grid;
	gap: var(--space-tight);
	margin: var(--space-tight) 0 0;
	padding: 0;
	list-style: none;
	font-size: var(--fs-lead);
	line-height: 1.45;
	color: var(--color-foreground);
}
:global(.shift-script-items > li) {
	display: flex;
	gap: var(--space-comfortable);
	align-items: baseline;
}
:global(.shift-script[data-script='without']) :global(.shift-script-items) {
	color: var(--color-foreground-quiet);
}
/* Struck, like the salary and like "working to survive": this is the script
   being left behind, and the line says so without a word of copy. */
:global(.shift-script[data-script='without']) :global(.shift-script-items > li > span:last-child) {
	text-decoration: line-through;
	text-decoration-thickness: 1px;
	text-decoration-color: color-mix(in oklab, var(--color-foreground) 35%, transparent);
}
:global(.shift-marker) {
	flex: 0 0 auto;
	inline-size: 1rem;
	block-size: 1px;
	margin-block-start: 0.55em;
	background: color-mix(in oklab, var(--color-foreground) 25%, transparent);
}
:global(.shift-script[data-script='with']) :global(.shift-marker) {
	block-size: var(--rule-mark);
	background: var(--color-paradise);
}
:global(.shift-script-closing) {
	margin: var(--space-comfortable) 0 0;
	font-family: var(--font-display);
	font-size: clamp(var(--fs-lead), 3cqi, var(--fs-amount));
	line-height: 1.3;
	text-wrap: pretty;
	color: var(--color-foreground);
}
:global(.shift-script[data-script='without']) :global(.shift-script-closing) {
	color: var(--color-foreground-quiet);
}
/*
 * The rule-label's index comes from the DOM position, not from a parameter.
 * `ruleLabel(text, '01')` / `ruleLabel(text, '02')` was the view numbering
 * itself; a counter numbers them from where they actually sit.
 */
:global(#shift-scripts) {
	counter-reset: script;
}
:global(#shift-scripts) :global(.rule-label) {
	counter-increment: script;
}
:global(#shift-scripts) :global(.rule-label)::before {
	content: counter(script, decimal-leading-zero);
	font-family: var(--font-display);
	font-size: var(--fs-lead);
	line-height: 1;
	color: var(--color-foreground-quiet);
}

/*
 * OWN IT — head, picture, ladder, close.
 *
 * It was three equal bordered cards in a row under a centred head, which is the
 * arrangement that makes a section read as generated: the eye lands nowhere and
 * nothing in the layout says which of the three matters. They are STAGES, not
 * options, so they are numbered and the last one carries the ground — the fleet
 * that compounds is the payoff the other two build to.
 */
:global(#own-grid) {
	--gap: var(--space-section);
}
:global(#own-head) {
	--measure: 56rem;
	padding-block-start: var(--space-section);
}
/* Wider measure, looser tracking. At 44rem with `tracking-tight` it broke to
   four lines and the negative tracking closed the letters up exactly where a
   large display line needs them open. */
:global(.own-heading-line) {
	display: block;
}
:global(#own-lead) {
	margin: 0;
	max-inline-size: 38rem;
	font-size: var(--fs-lead);
	line-height: 1.5;
	text-wrap: pretty;
	color: var(--color-foreground-quiet);
}
:global(#own-rungs) {
	display: grid;
	gap: var(--space-loose);
	margin: 0;
	padding: 0;
	list-style: none;
}
@container (min-width: 48rem) {
	:global(#own-rungs) {
		grid-template-columns: repeat(3, minmax(0, 1fr));
		align-items: stretch;
	}
}
:global(.own-rung) {
	/*
	 * NOT a `surface`, and the reason is worth keeping.
	 *
	 * `surface` is exactly this device — a padded, rounded box with a ground —
	 * and it now carries the `paper` ground this needs. But every composite here
	 * declares a container, and a container between an element and the box it
	 * used to measure changes what `cqi` means for everything inside it. The
	 * rung's title reads 3cqi of the SECTION; as a surface it would read 3cqi of
	 * the rung, which is narrower when the rungs sit in a row and WIDER when
	 * they stack — so the title would shrink and grow in opposite directions
	 * from the ones it was written for.
	 *
	 * A box unit that is also a container is not a drop-in for a box. This one
	 * keeps its own three declarations until the title is expressed in
	 * something that does not care.
	 */
	padding: var(--space-loose);
	border-radius: var(--radius-xl);
	background: var(--color-surface-sunken);
	display: grid;
	align-content: start;
	--gap: var(--space-tight);
}
/* The payoff rung, on the success tint — marine on it measures 12.15:1. */
:global(.own-rung[data-rung='last']) {
	background: var(--color-success-surface);
}
:global(.own-rung-index) {
	margin: 0;
	font-family: var(--font-display);
	font-size: var(--fs-display);
	font-weight: 400;
	line-height: 1;
	color: var(--color-secondary-strong);
}
:global(.own-rung-count) {
	margin: 0;
	font-size: var(--fs-eyebrow);
	font-weight: 600;
	letter-spacing: var(--tracking-widest);
	text-transform: uppercase;
	color: var(--color-foreground-quiet);
}
:global(.own-rung-title) {
	margin: 0;
	font-family: var(--font-display);
	font-size: clamp(var(--fs-amount), 3cqi, 1.75rem);
	font-weight: 400;
	line-height: 1.15;
	letter-spacing: var(--tracking-tight);
	color: var(--color-foreground);
}
:global(.own-rung-text) {
	margin: 0;
	font-size: var(--fs-section);
	line-height: 1.5;
	text-wrap: pretty;
	color: var(--color-foreground-quiet);
}
:global(#own-closing) {
	--measure: 40rem;
	font-family: var(--font-display);
	font-size: clamp(var(--fs-lead), 3.2cqi, 2rem);
	line-height: 1.25;
	letter-spacing: var(--tracking-tight);
	text-align: center;
	text-wrap: balance;
	color: var(--color-foreground);
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
/* Head and image side by side, so the section opens on a spread rather than
   on a left margin. */
/* One column: the head, then the band, then the diptych, then the turn. The
   partner figure that made row 1 a spread is gone, and a 6fr head beside an
   empty 6fr track is the left-heavy layout this section started with. */
:global(#shift-inner) {
	display: grid;
	gap: 0;
}
/* Centred, like the band and the turn below it. Left-aligned at 34rem in a
   64rem measure it was a column with a margin, which is the reading this
   section kept coming back with. */
:global(#shift-head) {
	--gap: var(--space-tight);
	--measure: 40rem;
}

/* The pull-quote: the page's turn, and the largest thing in the section, so
   it leads. `cqi`, never `vw` — see the note at the call site. */
/* The question is the page's turn, so it gets the treatment the arithmetic's
   statement gets: parenthesised, centred, and the largest thing in view. The
   parens are the reference set's framing device and they are sunflower —
   a shape, which is the only job that tone can hold on cream. */
/*
 * A MARINE BAND, because the question was drowning.
 *
 * It was cream type on cream ground, centred in its own row with a section gap
 * above and below — so the parens, laid out as flex items that wrapped, broke
 * onto lines of their own and hung in roughly three hundred pixels of nothing.
 * The measured effect was a page that looks like it failed to load between two
 * blocks of content.
 *
 * The fix is a GROUND. Marine is the brand's own dark, the question reverses
 * out of it in cream, and the band gives the section its one full-bleed beat
 * between the spread above and the diptych below. The parens stay inline —
 * `display: inline` inside a text block cannot wrap onto their own line the
 * way flex items can — and they are paradise, which on marine is a shape and a
 * tone rather than the 3.93:1 it has to justify on cream.
 */
:global(#shift-question) {
	margin: var(--space-section) 0 0;
	padding: clamp(3rem, 7cqi, 5rem) var(--space-loose);
	border-radius: var(--radius-xl);
	background: var(--color-marine);
	font-family: var(--font-display);
	font-size: clamp(1.75rem, 5cqi, 3rem);
	font-weight: 400;
	line-height: 1.12;
	letter-spacing: var(--tracking-tight);
	text-align: center;
	text-wrap: balance;
	color: var(--color-on-dark);
}
/* Centred, and it owns the row. Left-aligned at 34rem it sat in the
   bottom-left corner with the right half empty — the same orphaning as the
   figure, one block later. */
/*
 * THE CLOSE: the page's one full-strength brand moment, at the decision.
 *
 * It was an accent tint under a sunflower hairline — the same treatment the
 * future script wears two blocks above, so the section ended on a quieter
 * echo of something the reader had already passed. The question is the point
 * of the whole section and it now gets the tone at full strength: sunflower
 * ground, marine ink, measured at 8.27:1.
 *
 * Sunflower is free for this because the price card moved to the success tint.
 * Used once on the page, at the moment there is something to decide — which is
 * the only way an accent stays an accent.
 */
:global(#shift-turn) {
	display: grid;
	justify-items: center;
	gap: 0;
	inline-size: 100%;
	margin: 0;
	padding: var(--space-section) var(--space-loose);
	/* A FRAME, not a fill. Solid sunflower across a block this size was the
	   loudest thing on the page and it was shouting at the reader rather than
	   inviting them; the tone belongs on the edge, where it still says "this is
	   the accent moment", with the ground a step lighter behind the type.
	   Marine on `accent-edge` measures 9.99:1. */
	border: var(--rule-frame) solid var(--color-sunflower);
	border-radius: var(--radius-xl);
	background: var(--color-accent-edge);
	text-align: center;
}
:global(#shift-turn-lead) {
	margin: 0 0 var(--space-comfortable);
	font-size: var(--fs-lead);
	color: var(--color-marine);
}
:global(#shift-turn-kicker) {
	margin: 0;
	font-family: var(--font-display);
	font-size: clamp(2.25rem, 6cqi, 3.75rem);
	font-weight: 400;
	line-height: 1.05;
	letter-spacing: var(--tracking-tight);
	text-wrap: balance;
	color: var(--color-accent-foreground);
}

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
/*
 * TWO THIRDS ARGUMENT, ONE THIRD PICTURE.
 *
 * The scripts were side by side across the full measure, which put the two
 * halves of the comparison at 50% each and left no room for anything else. They
 * stack now — the old script above the new one, the order a reader actually
 * moves through them — inside two thirds, and the picture takes the last third
 * at full height beside both.
 */
:global(#shift-spread) {
	display: grid;
	gap: var(--space-loose);
	margin-block-start: var(--space-section);
}
@container (min-width: 52rem) {
	:global(#shift-spread) {
		grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
		align-items: stretch;
	}
	/* The close spans BOTH tracks, so it sits under the argument and the picture
	   rather than alongside either. It is the section's last word and it belongs
	   to the whole spread, not to one column of it. */
	:global(#shift-turn) {
		grid-column: 1 / -1;
	}
}
:global(#shift-scripts) {
	--gap: var(--space-comfortable);
	align-content: start;
}

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
