<script lang="ts">
/**
 * The marketplace page — every band but one delivered as configuration.
 *
 * Hero, marketplace, chain visualization and bundled-pricing band are ViewDefs
 * in `$lib/vibes/skills.ts`, rendered at build by the routes' server loads and
 * placed with `{@html}`. The CTA band hosts `AvenIdCheckCta`, which owns a
 * form, and stays with it.
 *
 * The marketplace used to be Svelte because `?plan=` only exists in the
 * reader's browser. It is configuration now because that query string has
 * finitely many answers — one per plan we sell — and the build renders the
 * band for every one of them. What is left here is the pick, and it is the
 * whole of the page's product logic:
 *
 *   an unknown or absent plan is the default the build already put on the page.
 *
 * The page no longer reads the skill catalogue at all, which is the point: it
 * used to pull every skill document in both languages into the reader's bundle
 * to render thirteen cards that never change.
 */
import { page } from '$app/state'
import AvenIdCheckCta from '$lib/components/AvenIdCheckCta.svelte'
import MarketingSiteHeader from '$lib/components/MarketingSiteHeader.svelte'
import SiteFooter from '$lib/components/SiteFooter.svelte'
import { type Lang, pick } from '$lib/i18n'
import { skills as messages } from '$lib/i18n/skills'
import type { PlanId } from '$lib/pricing/plans'
import type { SkillsSections } from '$lib/vibes/skills'

let { lang }: { lang: Lang } = $props()

const t = $derived(pick(messages, lang).marketplace)

const sections: SkillsSections = page.data.skillsSections
if (!sections) throw new Error('[skills] missing skillsSections — the route has no server load')

/**
 * The marketplace is organized by PRODUCT, not by author: a buyer asks which
 * plan a skill comes with. `?plan=` lets the pricing page link straight into
 * the right selection.
 *
 * Static site (prerendered): the query string only exists in the browser,
 * never at build time. A plan we do not sell — a stale link, a typo, a hand-
 * written URL — is not an error page, it is the default selection, which is
 * also the band the build wrote into this file.
 *
 * WHY AN EFFECT AND NOT A `$derived`. `{@html}` does not re-render during
 * hydration: it CLAIMS the markup the server wrote and trusts it, so a derived
 * that computes a different band on the client is simply never applied and a
 * deep link from the pricing page silently shows the default. (An `{#each}`
 * does re-render, which is why the Svelte version this replaced did not have
 * to think about it — the difference was found by building both and opening
 * `?plan=aven-name` in each.) An effect runs AFTER hydration, so assigning
 * here is a real change the html block acts on; it re-runs on client
 * navigation too, because `page.url` is reactive.
 */
const DEFAULT_PLAN: PlanId = 'aven-ceo'
let selected = $state<PlanId>(DEFAULT_PLAN)
$effect(() => {
	const q = page.url.searchParams.get('plan')
	selected = q && q in sections.marketplace ? (q as PlanId) : DEFAULT_PLAN
})
</script>

<svelte:head>
	<title>{t.title}</title>
	<meta name="description" content={t.description}>
</svelte:head>

<div {lang} class="app-shell">
	<MarketingSiteHeader active="skills" maxWidth="6xl" {lang} />

	{@html sections.hero}

	{@html sections.marketplace[selected]}

	{@html sections.chain}

	{@html sections.bundle}

	<!-- CTA -->
	<section class="section-band sm:px-8 sm:py-20">
		<div class="mx-auto max-w-2xl">
			<AvenIdCheckCta variant="banner" {lang} />
		</div>
	</section>

	<SiteFooter {lang} />
</div>

<style>
/* The hero's subheading clamps against `cqi` — the section's own width, not
   the window's — and a container only exists where something declares one.
   `:global` because the hero arrives through `{@html}` and Svelte never
   compiled it. */
:global(#skills-hero) {
	container-type: inline-size;
}
</style>
