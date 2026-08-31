<script lang="ts">
/**
 * THE CLOSING CTA, once, for every page.
 *
 * Five page shells each ended with their own version of this — the same form
 * in a slightly different section, with a different measure, a different pad
 * and, on two of them, a different id. Nothing shared it, so the banner that
 * belongs above it existed on the home page only and the navbar's call to
 * action had nowhere reliable to point.
 *
 * It carries three things now and every page gets all three: the banner, the
 * head where the page supplies one, and the form. `#claim` is the anchor the
 * bar's button scrolls to, and it is here rather than on any one page so that
 * the link is never dead.
 */
import AvenIdCheckCta from '$lib/components/AvenIdCheckCta.svelte'
import type { Lang } from '$lib/i18n'

let {
	lang = 'de',
	/** The page's own lead-in, already rendered. Not every page has one. */
	head = '',
	/** Anything the page wants under the form — SkillLanding puts its back link there. */
	tail = ''
}: { lang?: Lang; head?: string; tail?: string } = $props()
</script>

<section id="claim" class="section" aria-labelledby="claim-heading">
	<div class="section-inner center">
		{#if head}{@html head}{/if}
		<AvenIdCheckCta variant="banner" {lang} />
		{#if tail}{@html tail}{/if}
	</div>
</section>

<!-- Full-bleed, no measure, no padding: every other band is contained, so the
     one that runs edge to edge reads as a break rather than another section.
     Decorative, so no alt text.

     BELOW the offer, not above it. Leading with the picture asked the reader to
     look before it had told them what they were looking at; the offer states
     the thing and the banner closes the page on it. -->
<figure id="claim-banner" data-ground="media">
	<img src="/family.jpg" alt="" width="1920" height="720" loading="lazy" decoding="async" />
	<!-- An imprint, not a caption: it sits IN the picture the way a maker's mark
	     sits in a print, at half strength so it belongs to the image rather than
	     covering it. Decorative — the page has already said this. -->
	<figcaption id="claim-imprint" aria-hidden="true">— own your life —</figcaption>
</figure>

<style>
/*
 * The claim block's own styling, which has to live HERE.
 *
 * These rules were in `Home.svelte`, whose `<style>` only loads on the home
 * page — so on /pricing/, /skills/, /avens/ and every legal route the offer bar
 * had no ground and the price figures ran together unstyled. A shared component
 * carrying page-scoped styles is a component that is only styled on one page.
 */
/* The figures share a baseline row; the terms sit under them. */
:global(#id-price-figures) {
	display: flex;
	flex-wrap: wrap;
	align-items: baseline;
	justify-content: center;
	gap: 0 var(--space-tight);
	margin: 0;
}
:global(#id-price-terms) {
	flex-basis: 100%;
	margin-block-start: var(--space-hairline);
	font-size: var(--fs-meta);
	font-weight: 500;
	text-align: center;
	color: var(--color-foreground-quiet);
}
/*
 * The superseded price as a small tilted badge on the right of the one you pay.
 *
 * Absolutely positioned, so it contributes NO width: the amount stays exactly
 * where it would be with no offer running, and the badge hangs beside it. A
 * strike set inline moved the real number off centre, which defeats the point
 * of showing it.
 */
/*
 * The eyebrow in the brand yellow — `accent-ink`, which IS sunflower darkened
 * exactly far enough to be text. Sunflower itself measures 1.75:1 on this card
 * and this line is 11px, so WCAG asks 4.5 of it. The ink is 5.80:1. Same rank
 * `eyebrow-ink` holds for paradise, and the same reason it exists.
 */
:global(#claim) :global(.text--eyebrow) {
	color: var(--color-accent-ink);
}
/* Full width: it is the one action on the card, so it takes the card. */
:global(#id-claim-action) {
	inline-size: 100%;
}

:global(#id-price-now) {
	position: relative;
	display: inline-flex;
	align-items: baseline;
}
:global(#id-price-was) {
	position: absolute;
	inset-inline-start: 100%;
	inset-block-start: 50%;
	margin-inline-start: var(--space-tight);
	padding: var(--space-hairline) var(--space-snug);
	border-radius: var(--radius-sm);
	/*
	 * Solid terracotta, not the tint it wore before.
	 *
	 * A discount badge drawn as a 1px outline on a near-white ground asks to be
	 * read as chrome. This is the offer; it should be the second-loudest thing
	 * on the card after the price it replaces. Cream on `terracotta-strong`
	 * measures 5.70:1, so the strike survives being small AND being struck.
	 */
	background: var(--color-terracotta-strong);
	border: 0;
	font-size: var(--fs-body);
	font-weight: 600;
	font-variant-numeric: tabular-nums;
	line-height: 1.15;
	white-space: nowrap;
	color: var(--color-surface-page);
	box-shadow: var(--shadow-raised, none);
	transform: translateY(-50%) rotate(-7deg);
	transform-origin: left center;
}
/*
 * The saving, stated as a number, stacked under the struck price.
 *
 * The strike says what it WAS; on its own it leaves the reader to do the
 * subtraction. The percentage is the claim, so it is the part set in the
 * brand's yellow — the only warm note on a terracotta ground, at 8.42:1.
 */
/* The strike sits on the price alone — set on the badge it propagates into
   the saving line below, striking the very number the badge exists to state. */
:global(#id-price-was) > :global(span:first-child) {
	text-decoration: line-through;
	text-decoration-thickness: 2px;
	text-decoration-color: color-mix(in srgb, var(--color-surface-page) 70%, transparent);
}
:global(#id-price-off) {
	display: block;
	margin-block-start: 1px;
	font-size: var(--fs-micro, var(--fs-meta));
	font-weight: 700;
	letter-spacing: var(--tracking-wide);
	text-transform: uppercase;
	color: var(--color-accent-edge);
}

/* Matches the divider it replaced: the file's own 8:3, and no height cap —
   capping made `object-fit: cover` crop the picture to a strip. */
:global(#claim-banner) {
	position: relative;
	margin: 0;
	inline-size: 100%;
	aspect-ratio: 1920 / 720;
	overflow: hidden;
	background: var(--color-surface-sunken);
}
/*
 * The imprint sits in the bottom quarter, centred, in the display face at half
 * strength. `aria-hidden` and no contrast claim: it is part of the picture, and
 * anything a reader must be able to read is in the card above it.
 */
:global(#claim-imprint) {
	position: absolute;
	inset-inline: 0;
	inset-block-end: 0;
	block-size: 25%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-family: var(--font-display);
	font-size: clamp(0.625rem, 1.5cqi, 1.125rem);
	letter-spacing: var(--tracking-wide);
	/*
	 * Marine, at full strength. The bottom quarter of this picture averages
	 * #897b55 — sand and stone — and the brand's own dark reads against it at
	 * 3.5:1, the same figure the cream reached at 78%, from the other side. A
	 * mark pressed INTO the paper rather than laid over it.
	 */
	color: var(--color-marine);
}
:global(#claim-banner img) {
	display: block;
	inline-size: 100%;
	block-size: 100%;
	object-fit: cover;
}
/*
 * 48rem, to match the avenCEO plan card exactly.
 *
 * The two offers are the same offer at two commitments — the name and the
 * subscription — so a reader comparing them should be comparing prices, not
 * widths. `#aven-ceo` measures 768px; this is the same number.
 *
 * As `max-inline-size`, not `--measure`: this element is a `.section-inner`
 * first, and the section unit's own cap (1152px) wins over `.center`'s knob by
 * source order. The knob was set and silently did nothing — the block stayed
 * 1152px wide while the CSS claimed 42rem.
 */
/* The one action on the card, sized to be it: the claim is the whole point of
   this block, so the button is the largest control on it rather than a link
   under a paragraph. `btn--accent` is the brand yellow; marine on sunflower
   measures 8.27:1. */
:global(#id-claim-action) {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-block-size: 3.5rem;
	padding-inline: var(--space-section);
	font-size: var(--fs-lead);
	font-weight: 600;
}

:global(#claim) :global(.section-inner) {
	max-inline-size: 48rem;
}
</style>
