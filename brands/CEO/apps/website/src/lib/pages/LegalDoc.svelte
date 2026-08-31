<!-- One renderer for every legal document from @myavenceo/aven-ceo — the
     content is data, and since the migration the markup is too: the route's
     server load renders the ViewDef in $lib/vibes/legal.ts at build, and
     this shell places the HTML between the header and the footer. -->
<script lang="ts">
import type { LegalDocument } from '@myavenceo/aven-ceo'
import { page } from '$app/state'
import ClaimSection from '$lib/components/ClaimSection.svelte'
import MarketingSiteHeader from '$lib/components/MarketingSiteHeader.svelte'
import SiteFooter from '$lib/components/SiteFooter.svelte'
import type { Lang } from '$lib/i18n'

let { doc }: { doc: LegalDocument } = $props()

const lang = $derived(doc.lang as Lang)

const html: string | undefined = page.data.legalHtml
if (!html) throw new Error('[legal] missing legalHtml — the route has no server load')
</script>

<svelte:head>
	<title>{doc.title.replaceAll('­', '')} — aven.ceo</title>
</svelte:head>

<div
	{lang}
	class="flex min-h-screen flex-col bg-surface-page text-foreground font-sans antialiased"
>
	<MarketingSiteHeader {lang} />

	{@html html}

	<ClaimSection {lang} />

	<SiteFooter {lang} />
</div>
