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
	<figcaption id="claim-imprint" aria-hidden="true"><span id="claim-imprint-mark">own your life</span></figcaption>
</figure>

<style>
/*
 * Only the page-composition rules remain: where the claim section sits, how
 * wide it runs, and the banner that closes the page under it. Everything that
 * styles the CARD ITSELF — the panel, the price block, the struck badge, the
 * action — moved into the `claim-card` unit in the design system, where the
 * storybook composite and this page render from the same declarations. The
 * `#id-*` layer that lived here was the drift: two renderers of one offer.
 */

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
 * The imprint sits in the bottom quarter, centred, in the display face.
 * `aria-hidden` and no contrast claim: it is part of the picture, and anything
 * a reader must be able to read is in the card above it.
 */
:global(#claim-imprint) {
	position: absolute;
	inset-inline: 0;
	inset-block-end: 0;
	block-size: 25%;
	display: flex;
	align-items: center;
	justify-content: center;
}
/*
 * The imprint wears the button's edge: a `radius-full` stadium with the ring
 * drawn INSET, which is the one signature shape in this system and the reason
 * the mark reads as part of the brand rather than as a caption someone typed
 * on the picture.
 *
 * The RIM is half strength, the words are not. A rule drawn at full white cuts
 * the photograph in two; the words at half white disappear into the bright of
 * the dress behind them. So the frame recedes and the text stays: solid
 * on-dark, 3.99:1 over the bottom quarter's #897b55 mean.
 */
:global(#claim-imprint-mark) {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: var(--space-tight) var(--space-loose);
	border-radius: var(--radius-full);
	box-shadow: inset 0 0 0 var(--rule-accent)
		color-mix(in srgb, var(--color-on-dark) 50%, transparent);
	font-family: var(--font-display);
	font-size: clamp(0.625rem, 1.5cqi, 1.125rem);
	letter-spacing: var(--tracking-wide);
	color: var(--color-on-dark);
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
 * source order.
 */
:global(#claim) :global(.section-inner) {
	max-inline-size: 48rem;
}
</style>
