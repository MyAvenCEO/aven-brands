<script lang="ts">
/**
 * The landing page, delivered as CONFIGURATION.
 *
 * Every static band — hero, trust, shift, company, ownership, the
 * section heads — is a ViewDef in `$lib/vibes/home.ts`, rendered to HTML at
 * build time by the route's server load and placed here with `{@html}`. No
 * island: nothing in those bands moves, so nothing hydrates and they ship
 * zero JavaScript. What remains Svelte in this file is exactly the part a
 * ViewDef cannot be yet:
 *
 *   - `MarketingSiteHeader` (the menu island lives inside it),
 *   - the skills preview GRID: `SkillMarketplaceCard` is shared with the
 *     marketplace page, and its accessible name carries a typographic dash
 *     the engine's attribute sanitiser would strip,
 *   - `AvenIdCheckCta`: real network logic, a future sandbox-tier island,
 *   - `SiteFooter`.
 *
 * All {@html} below renders our own build-rendered views and static copy
 * from $lib/i18n/home.ts — never user content.
 */
import { page } from '$app/state'
import ClaimSection from '$lib/components/ClaimSection.svelte'
import MarketingSiteHeader from '$lib/components/MarketingSiteHeader.svelte'
import SiteFooter from '$lib/components/SiteFooter.svelte'
import SkillMarketplaceCard from '$lib/components/SkillMarketplaceCard.svelte'
import { type Lang, pick } from '$lib/i18n'
import { home } from '$lib/i18n/home'
import { loadSkills } from '$lib/skills/loader'
import type { HomeSections } from '$lib/vibes/home'

let { lang }: { lang: Lang } = $props()

const t = $derived(pick(home, lang))

/** A taste of the marketplace: the first six skills, the full list lives at /skills. */
const skillsPreview = $derived(loadSkills(lang).slice(0, 6))

/** The build-rendered sections. A route that renders this page without
 * providing them has broken the delivery contract — fail the build, not the
 * reader. */
const sections: HomeSections = page.data.homeSections
if (!sections) throw new Error('[home] missing homeSections — the route has no server load')
</script>

<svelte:head>
	<title>{t.title}</title>
	<meta name="description" content={t.description}>
</svelte:head>

<div {lang} class="app-shell">
	<MarketingSiteHeader maxWidth="6xl" {lang} overlay />

	{@html sections.hero}

	{@html sections.trust}
	{@html sections.cost}

	{@html sections.company}
	{@html sections.shift}


	{@html sections.own}


	<!-- Skills preview: what an Aven can already do, straight from the
	     marketplace. The frame's head and the "see all" line are config; the
	     grid of cards is the shared Svelte component (see the header comment). -->
	<section class="section sm:px-8 sm:py-20" aria-labelledby="skills-preview-heading">
		<div class="mx-auto max-w-5xl">
			{@html sections.skillsHead}

			<div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each skillsPreview as skill (skill.slug)}
					<SkillMarketplaceCard {skill} {lang} />
				{/each}
			</div>

			{@html sections.skillsAll}
		</div>
	</section>

	<ClaimSection {lang} head={sections.startHead} />

	<SiteFooter {lang} />
</div>

<!--
	NO STYLE BLOCK. Every band of this page renders from design-system units —
	home-hero, trust, cost, company, shift, own — plus the shared devices
	(rule-label, paren, emph) and the primitives (stack, center, grid-auto,
	pair, media-frame). The 1,362 lines of :global() CSS that lived here,
	including two duplicate blocks and three dead rules, moved into unit parts
	verbatim, with the measured colour notes as part descriptions. If this page
	needs a new rule, it belongs in a unit; an id plus a page rule here is the
	drift the move closed.
-->
