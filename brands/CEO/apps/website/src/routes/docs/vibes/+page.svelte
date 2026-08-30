<script lang="ts">
import type { Island } from '@myavenceo/aven-vibes'
/**
 * avenVIBES framework docs — ten sections from the package's own SSOT.
 *
 * The layout mirrors /docs/brand deliberately: same rail-plus-main grid, the
 * same `sidebar` composite as the navigation (a docs surface that hand-rolls
 * a private sidebar is the drift the system exists to stop), the same sticky
 * offset measured from the real site header. Where /docs/brand renders
 * specimens, this page renders prose — the rendered markdown arrives from the
 * load as classless semantic HTML and the brand's `prose` unit themes it by
 * element, which is exactly the theming contract the engine's docs renderer
 * promises.
 */
import { onMount } from 'svelte'
import MarketingSiteHeader from '$lib/components/MarketingSiteHeader.svelte'
import { hydrateDemo } from '$lib/docs/vibes-demos'
import type { RenderedSection } from './+page.js'

let { data }: { data: { sections: RenderedSection[] } } = $props()

/* Empty until the reader chooses — the first section is the DERIVED default,
   so this never has to read `data` at init (which only captures its initial
   value and warns for it). */
let active = $state('')
const current = $derived(data.sections.find((s) => s.slug === active) ?? data.sections[0])

/**
 * Stop the rail at the site header's edge, not the screen's — the same
 * measured offset /docs/brand uses, for the same WCAG 2.4.11 reason: a
 * hardcoded "about 61px" is wrong after any reflow, so the height is
 * measured and republished on resize.
 */
function stickBelowSiteHeader(node: HTMLElement) {
	const header = document.querySelector('header')
	if (!header) return
	const apply = () =>
		node.style.setProperty('--dv-top', `${header.getBoundingClientRect().height}px`)
	apply()
	const observer = new ResizeObserver(apply)
	observer.observe(header)
	return () => observer.disconnect()
}

/* ── Demo hydration ──────────────────────────────────────────────────────
   The load injected each demo's string-rendered markup into its
   `[data-md-demo]` placeholder at prerender, so the markup below is the
   build's own. Here the behaviour arrives: each placeholder becomes an
   Island and `hydrate` attaches listeners to the markup as it stands —
   nothing is re-rendered at attach time, which is the framework's whole
   hydration story, demonstrated by the page that documents it.

   Re-run per section switch, because `{@html}` replaces the subtree and a
   listener attached to a removed element is behaviour attached to nothing.
   Disposal is symmetric: switching away tears the islands down so a stale
   island cannot keep re-rendering into a detached tree. */
let main = $state<HTMLElement | null>(null)
let mounted = $state(false)

onMount(() => {
	mounted = true
})

$effect(() => {
	/* Read the section synchronously so the effect re-runs on switch —
	   the async work below must not be what creates the dependency. */
	void current.slug
	if (!mounted || !main) return
	const islands: Island[] = []
	let cancelled = false
	const placeholders = main.querySelectorAll<HTMLElement>('[data-md-demo]')
	for (const el of placeholders) {
		const name = el.getAttribute('data-md-demo')
		if (!name) continue
		void hydrateDemo(el, name).then((island) => {
			if (!island) return
			if (cancelled) void island.dispose()
			else islands.push(island)
		})
	}
	return () => {
		cancelled = true
		for (const island of islands) void island.dispose()
	}
})
</script>

<svelte:head>
	<title>avenVIBES · avenCEO</title>
	<meta
		name="description"
		content="The avenVIBES framework: UI as data — views, units, actors, islands and the sandbox, documented from the package itself."
	>
</svelte:head>

<MarketingSiteHeader active="docs" maxWidth="6xl" lang="en" />

<div id="docs-vibes" class="app-shell" {@attach stickBelowSiteHeader}>
	<div id="dv-body">
		<!-- The rail is the `sidebar` composite itself, exactly as /docs/brand
		     uses it. Its head identifies the page; the index is one item per
		     section, in the SSOT's own reading order. The head is NOT an h1 —
		     the active section's rendered markdown opens with its own h1, and
		     a page carries one. -->
		<aside id="dv-aside">
			<nav class="sidebar sidebar--tone-plain" aria-label="Sections">
				<div id="dv-brand">
					<p class="text text--eyebrow">avenVIBES</p>
					<p class="text text--section-title">Framework</p>
					<p class="text text--meta">
						Rendered from the docs the package ships, so this page cannot describe a version other
						than the one installed.
					</p>
				</div>

				<div class="sidebar-items">
					{#each data.sections as section, i (section.slug)}
						<button
							type="button"
							class="sidebar-item"
							aria-current={current.slug === section.slug ? 'true' : undefined}
							onclick={() => {
								active = section.slug
								main?.scrollIntoView({ block: 'start' })
							}}
						>
							<span class="sidebar-marker"></span>
							<span>{section.title}</span>
							<span class="sidebar-count">{i + 1}</span>
						</button>
					{/each}
				</div>

				<div class="sidebar-footer">
					<a class="sidebar-item" href="/docs/">
						<span class="sidebar-marker"></span>
						Back to docs
					</a>
				</div>
			</nav>
		</aside>

		<main id="dv-main" bind:this={main}>
			<article class="prose">
				<!-- Trusted by construction: the html is the package's own docs run
				     through its own renderer at prerender, not user input. -->
				{@html current.html}
			</article>
		</main>
	</div>
</div>

<style>
/*
 * These stay `@media`, and that is the rule rather than an exception to it.
 *
 * Space questions belong in `@container` — a block that might render in a
 * sidebar or a preview should ask its own box, not the window. A PAGE SHELL is
 * the one case where those are the same question: nothing wraps it, so the
 * viewport IS its container. Declaring `container-type` here would buy no
 * accuracy and would cost containment — it establishes a containing block for
 * positioned descendants, and this page has a sticky attachment that depends on
 * not having one.
 *
 * The test for the next reader: is there a box above this that could be
 * narrower than the window? If yes, `@container`. If no, `@media`.
 */

#dv-body {
	display: grid;
	grid-template-columns: minmax(0, 1fr);
	gap: 0;
}
@media (min-width: 56rem) {
	#dv-body {
		/* The layout declares the track; the unit fills it. `auto` here let the
		   rail collapse on /docs/brand once already — see that page. */
		grid-template-columns: 16rem minmax(0, 1fr);
	}
	#dv-aside {
		position: sticky;
		top: var(--dv-top, 0px);
		align-self: start;
		max-block-size: calc(100dvh - var(--dv-top, 0px));
		overflow-y: auto;
		min-inline-size: 0;
	}
	#dv-aside :global(.sidebar) {
		block-size: 100%;
		border-inline-end: 1px solid var(--color-border);
	}
}
#dv-aside {
	border-block-end: 1px solid var(--color-border);
}
@media (min-width: 56rem) {
	#dv-aside {
		border-block-end: none;
	}
}
#dv-brand {
	display: grid;
	gap: 0.25rem;
	padding: var(--space-comfortable) 0.75rem var(--space-tight);
	border-block-end: 1px solid var(--color-border-soft);
	margin-block-end: var(--space-hairline);
}
/* The rail's items are `sidebar-item`s, which the unit styles. Only what a
   <button> does not inherit is set here — same two exceptions as /docs/brand. */
#dv-aside :global(.sidebar-item) {
	inline-size: 100%;
	border: 0;
	font: inherit;
	font-size: var(--fs-meta);
	font-weight: 500;
	text-align: start;
	cursor: pointer;
	background: none;
}
#dv-aside :global(.sidebar-item > span:not([class])) {
	flex: 1 1 auto;
	min-inline-size: 0;
}
#dv-aside :global(.sidebar-item[aria-current="true"]) {
	background: var(--color-surface-sunken);
	color: var(--color-foreground);
	font-weight: 600;
}
#dv-aside :global(.sidebar-item[aria-current="true"] .sidebar-marker) {
	opacity: 1;
}
#dv-main {
	padding: var(--space-loose) 1.25rem 4rem;
	min-inline-size: 0;
}
/* Centred by MARGIN, never by `justify-content: center` on a grid. The prose
   unit is an inline-size container, so its width is independent of its
   contents by definition — a grid that centres it hands it a content-sized
   track, the container has nothing left to size from, and the column
   collapses to single words. The unit's own $description documents this
   failure; this page reproduced it anyway on the first render. */
#dv-main :global(.prose) {
	margin-inline: auto;
}

/* ── The demos ───────────────────────────────────────────────────────────
   Inside `{@html}`, so Svelte compiled none of it and every rule is
   `:global`. The mount point and the demo roots are addressed through the
   stable attributes the engine itself stamps (`data-md-demo`, `data-demo`,
   `data-open`), never through invented class names. */
#dv-main :global([data-md-demo]) {
	margin-block: var(--space-comfortable) var(--space-section);
}
#dv-main :global([data-demo]) {
	display: grid;
	gap: var(--space-comfortable);
	justify-items: start;
	padding: var(--space-comfortable);
}
#dv-main :global(#demo-menu-panel) {
	list-style: none;
	margin: 0;
	padding: var(--space-tight);
	display: grid;
	gap: var(--space-hairline);
	inline-size: 100%;
	border: 1px solid var(--color-border-soft);
	border-radius: var(--radius-md);
	background: var(--color-surface-sunken);
}
#dv-main :global(#demo-menu-panel[data-open="false"]) {
	display: none;
}
#dv-main :global([data-demo="counter"] .stat-value) {
	/* The stat unit's value face at a demo-sized step: the unit's own font
	   stack and weight arrive with the class; only the size is scoped down,
	   from the scale. */
	font-size: var(--fs-amount);
}
</style>
