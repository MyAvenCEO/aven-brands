<svelte:head>
	<title>Allgemeine Geschäftsbedingungen — aven.ceo</title>
	<meta name="robots" content="noindex">
</svelte:head>

<script lang="ts">
import { page } from '$app/state'
import MarketingSiteHeader from '$lib/components/MarketingSiteHeader.svelte'
import SiteFooter from '$lib/components/SiteFooter.svelte'

const html: string | undefined = page.data.legalHtml
if (!html) throw new Error('[agb] missing legalHtml — the route has no server load')
</script>

<div
	lang="de"
	class="flex min-h-screen flex-col bg-surface-page text-foreground font-sans antialiased"
>
	<MarketingSiteHeader />

	{@html html}

	<SiteFooter />
</div>
