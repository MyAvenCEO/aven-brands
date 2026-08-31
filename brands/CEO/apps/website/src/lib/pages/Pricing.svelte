<script lang="ts">
/**
 * The pricing page, delivered as configuration.
 *
 * The whole plan section — header, avenCEO card, buy box — is a ViewDef in
 * `$lib/vibes/pricing.ts`, rendered at build by the route's server load and
 * placed here with `{@html}`. What stays Svelte is the shell around
 * `AvenIdCheckCta` (real network logic, a future sandbox-tier island), the
 * header and the footer.
 */
import { page } from '$app/state'
import ClaimSection from '$lib/components/ClaimSection.svelte'
import MarketingSiteHeader from '$lib/components/MarketingSiteHeader.svelte'
import SiteFooter from '$lib/components/SiteFooter.svelte'
import { type Lang, pick } from '$lib/i18n'
import { pricing } from '$lib/i18n/pricing'
import type { PricingSections } from '$lib/vibes/pricing'

let { lang }: { lang: Lang } = $props()

const t = $derived(pick(pricing, lang))

const sections: PricingSections = page.data.pricingSections
if (!sections) throw new Error('[pricing] missing pricingSections — the route has no server load')
</script>

<svelte:head>
	<title>{t.title}</title>
	<meta name="description" content={t.description}>
</svelte:head>

<div {lang} class="app-shell">
	<MarketingSiteHeader active="pricing" maxWidth="6xl" {lang} />

	{@html sections.plans}

	<ClaimSection {lang} />

	<SiteFooter {lang} />
</div>
