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
import AvenIdCheckCta from '$lib/components/AvenIdCheckCta.svelte'
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

	<section class="border-b border-border/25 px-5 py-14 sm:px-8 sm:py-16" id="aven-id">
		<div class="mx-auto max-w-3xl">
			<AvenIdCheckCta variant="banner" {lang} />
		</div>
	</section>

	<SiteFooter {lang} />
</div>
