<script lang="ts">
/**
 * The Avens registry — delivered as configuration.
 *
 * Every band above the CTA is a build-time fact (the live Avens, their
 * profiles, their generated beam avatars), so hero, company cards and the
 * personal registry render from ViewDefs in `$lib/vibes/avens.ts` at build
 * and arrive here as HTML. What stays Svelte is the shell around
 * `AvenIdCheckCta` (real network logic, a future sandbox-tier island), the
 * header and the footer.
 */
import { page } from '$app/state'
import ClaimSection from '$lib/components/ClaimSection.svelte'
import MarketingSiteHeader from '$lib/components/MarketingSiteHeader.svelte'
import SiteFooter from '$lib/components/SiteFooter.svelte'
import { type Lang, pick } from '$lib/i18n'
import { avens } from '$lib/i18n/avens'
import type { AvensSections } from '$lib/vibes/avens'

let { lang }: { lang: Lang } = $props()

const t = $derived(pick(avens, lang))

const sections: AvensSections = page.data.avensSections
if (!sections) throw new Error('[avens] missing avensSections — the route has no server load')
</script>

<svelte:head>
	<title>{t.title}</title>
	<meta name="description" content={t.description}>
</svelte:head>

<div {lang} class="app-shell">
	<MarketingSiteHeader active="avens" maxWidth="6xl" {lang} />

	{@html sections.hero}

	{@html sections.companies}

	{@html sections.people}

	<ClaimSection {lang} head={sections.ctaHead} />

	<SiteFooter {lang} />
</div>

<style>
/* The beam avatars arrive through the render seam as generated SVG; these
   declarations are what `[&>svg]:block [&>svg]:size-full` said when the
   wrappers were compiled markup — the `>` in that arbitrary variant does not
   survive the engine's attribute sanitiser. `:global` because the sections
   arrive through `{@html}` and Svelte never compiled them. */
:global(#avens-companies div[aria-hidden="true"] > svg),
:global(#avens-people div[aria-hidden="true"] > svg) {
	display: block;
	width: 100%;
	height: 100%;
}
</style>
