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

<!-- Full-bleed, no measure, no padding: every other band on the page is
     contained, so the one that runs edge to edge reads as a break rather than
     another section. Decorative — the head below it says what this is. -->
<figure id="claim-banner" aria-hidden="true">
	<img src="/family.jpg" alt="" width="1920" height="720" loading="lazy" decoding="async" />
</figure>

<section id="claim" class="section" aria-labelledby="claim-heading">
	<div class="section-inner center">
		{#if head}{@html head}{/if}
		<AvenIdCheckCta variant="banner" {lang} />
		{#if tail}{@html tail}{/if}
	</div>
</section>

<style>
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
:global(#claim) :global(.section-inner) {
	--measure: 42rem;
}
</style>
