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
<figure id="claim-banner" aria-hidden="true">
	<img src="/family.jpg" alt="" width="1920" height="720" loading="lazy" decoding="async" />
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
 * THE OFFER BAR, in terracotta.
 *
 * It wore the accent — the same sunflower as the price badge directly above it,
 * so two promotional notes shared one colour and neither read as the distinct
 * thing it is. Terracotta is the brand's other warm tone and it is free here.
 *
 * `terracotta-strong`, not raw terracotta. Measured at the line's real size
 * (16px bold, so 4.5:1 applies rather than the 3:1 large text gets): terracotta
 * as INK on the accent bar is 2.45:1, and as a GROUND under cream 4.19 — a
 * mid-value that fails in both directions. Darkened, cream on it is 5.70:1.
 */
:global(#id-beta-bar) {
	background: var(--color-terracotta-strong);
	color: var(--color-surface-page);
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
	padding: var(--space-hairline) var(--space-tight);
	border-radius: var(--radius-sm);
	/* Sunflower at full strength, not the tint: a discount badge that whispers
	   is not doing the one job it has. Marine on it measures 8.27:1. */
	background: var(--color-sunflower);
	font-size: var(--fs-title);
	font-weight: 600;
	font-variant-numeric: tabular-nums;
	line-height: 1.2;
	white-space: nowrap;
	text-decoration: line-through;
	text-decoration-thickness: 1px;
	color: var(--color-marine);
	box-shadow: var(--shadow-raised, none);
	transform: translateY(-50%) rotate(-7deg);
	transform-origin: left center;
}

/* Matches the divider it replaced: the file's own 8:3, and no height cap —
   capping made `object-fit: cover` crop the picture to a strip. */
:global(#claim-banner) {
	margin: 0;
	inline-size: 100%;
	aspect-ratio: 1920 / 720;
	overflow: hidden;
	background: var(--color-surface-sunken);
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
:global(#claim) :global(.section-inner) {
	max-inline-size: 48rem;
}
</style>
