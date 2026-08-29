<script lang="ts">
/**
 * /docs — the index of what is documented.
 *
 * One card today (ceoBRAND). It is a grid because the next entries are already
 * named in the upgrade plan: the unit library, the vibe manifest, the gates.
 */
import MarketingSiteHeader from '$lib/components/MarketingSiteHeader.svelte'
import { sections } from '$lib/docs/sections'

const entries = [
	{
		href: '/docs/brand/',
		eyebrow: 'ceoBRAND',
		title: 'Brand',
		lede: 'Every token, face and component the avenCEO design system defines, rendered from the source it ships.',
		meta: `${sections.reduce((n, s) => n + s.count, 0)} items across ${sections.length} sections`
	}
]
</script>

<svelte:head>
	<title>Docs · avenCEO</title>
	<meta name="description" content="Documentation for the avenCEO design system and platform.">
</svelte:head>

<MarketingSiteHeader active="docs" lang="en" />

<main id="docs-index" class="app-shell">
	<div class="center">
		<header class="stack">
			<p class="eyebrow-accent">Documentation</p>
			<h1 class="title">Docs</h1>
			<p class="lede">
				The reference surfaces, each rendered from the same source the product ships, so what you
				read here is what runs.
			</p>
		</header>

		<ul id="docs-grid">
			{#each entries as entry (entry.href)}
				<li>
					<a class="card" href={entry.href}>
						<p class="eyebrow-accent">{entry.eyebrow}</p>
						<h2 class="title">{entry.title}</h2>
						<p class="lede">{entry.lede}</p>
						<p class="meta">{entry.meta}</p>
					</a>
				</li>
			{/each}
		</ul>
	</div>
</main>

<style>
#docs-index {
	padding: var(--space-section) 1.25rem 4rem;
}
#docs-index .center {
	max-inline-size: 60rem;
	margin-inline: auto;
}
#docs-index header {
	display: grid;
	gap: var(--space-tight);
	margin-block-end: var(--space-section);
}
#docs-grid {
	list-style: none;
	margin: 0;
	padding: 0;
	display: grid;
	gap: var(--space-loose);
	grid-template-columns: repeat(auto-fill, minmax(min(20rem, 100%), 1fr));
}
#docs-grid a {
	display: grid;
	gap: var(--space-tight);
	text-decoration: none;
	color: inherit;
	block-size: 100%;
	transition:
		box-shadow 160ms ease-out,
		transform 160ms ease-out;
}
#docs-grid a:hover {
	box-shadow: var(--shadow-floating);
	transform: translateY(-2px);
}
#docs-grid a:focus-visible {
	outline: 2px solid var(--color-accent-ink);
	outline-offset: 3px;
}
@media (prefers-reduced-motion: reduce) {
	#docs-grid a {
		transition: none;
	}
	#docs-grid a:hover {
		transform: none;
	}
}
</style>
