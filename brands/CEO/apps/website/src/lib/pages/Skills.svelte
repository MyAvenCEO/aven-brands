<script lang="ts">
/**
 * The marketplace page — its static bands delivered as configuration.
 *
 * Hero, chain visualization and bundled-pricing band are ViewDefs in
 * `$lib/vibes/skills.ts`, rendered at build by the routes' server loads and
 * placed with `{@html}`. The marketplace itself stays Svelte ON PURPOSE:
 * which plans and skills are visible depends on the `?plan=` query string,
 * which only exists in the reader's browser — a genuinely dynamic section on
 * a prerendered site (the build renders the default selection, the client
 * re-renders when a deep link narrows it). The CTA band hosts
 * `AvenIdCheckCta`, real network logic, and stays with it.
 */
import { browser } from '$app/environment'
import { page } from '$app/state'
import AvenIdCheckCta from '$lib/components/AvenIdCheckCta.svelte'
import MarketingSiteHeader from '$lib/components/MarketingSiteHeader.svelte'
import SiteFooter from '$lib/components/SiteFooter.svelte'
import SkillMarketplaceCard from '$lib/components/SkillMarketplaceCard.svelte'
import { type Lang, localeHref, pick } from '$lib/i18n'
import { localizedPlan, priceLabel } from '$lib/i18n/plans'
import { skills as messages } from '$lib/i18n/skills'
import { PLANS, type PlanId, planIncludes } from '$lib/pricing/plans'
import { loadSkills, loadSkillsByPlan } from '$lib/skills/loader'
import type { SkillsSections } from '$lib/vibes/skills'

let { lang }: { lang: Lang } = $props()

const t = $derived(pick(messages, lang).marketplace)
const skills = $derived(loadSkills(lang))
const byPlan = $derived(loadSkillsByPlan(lang))

const sections: SkillsSections = page.data.skillsSections
if (!sections) throw new Error('[skills] missing skillsSections — the route has no server load')

/**
 * The marketplace is organized by PRODUCT, not by author: a buyer asks which
 * plan a skill comes with. avenCEO carries every skill, so
 * picking one shows exactly its skills; only avenCOOP also carries avenCEO's.
 * `?plan=` lets the pricing
 * page link straight into the right selection.
 */
// Static site (prerendered): the query string only exists in the browser, never at build time.
const fromQuery = $derived(browser ? (page.url.searchParams.get('plan') as PlanId | null) : null)
const selected = $derived<PlanId>(
	fromQuery && PLANS.some((p) => p.id === fromQuery) ? fromQuery : 'aven-ceo'
)

const visibleSkills = $derived(skills.filter((s) => planIncludes(selected, s.plan)))
const visibleByPlan = $derived(
	byPlan.filter((g) => planIncludes(selected, g.plan.id) && g.skills.length > 0)
)
const selectedPlan = $derived(PLANS.find((p) => p.id === selected) ?? PLANS[0])
/** What this plan brings itself, versus what it inherits from below it. */
const ownCount = $derived(visibleSkills.filter((s) => s.plan === selected).length)
const inheritedCount = $derived(visibleSkills.length - ownCount)
</script>

<svelte:head>
	<title>{t.title}</title>
	<meta name="description" content={t.description}>
</svelte:head>

<div {lang} class="app-shell">
	<MarketingSiteHeader active="skills" maxWidth="6xl" {lang} />

	{@html sections.hero}

	<!-- Marketplace: sidebar + featured + catalog — dynamic, see the header comment. -->
	<section class="border-b border-border/25 px-5 py-12 sm:px-8 sm:py-14">
		<div class="mx-auto max-w-5xl">
			<div class="space-y-12">
				{#if visibleByPlan.length > 1}
					<p
						class="rounded-xl border border-accent/25 bg-accent/8 px-4 py-3 text-[length:var(--fs-body)] leading-snug text-foreground-soft"
					>
						{t.inclusion(selectedPlan.name, visibleSkills.length, inheritedCount, ownCount)}
					</p>
				{/if}
				{#each visibleByPlan as group (group.plan.id)}
					<div>
						<div
							class="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-border/25 pb-4"
						>
							<div>
								<p
									class="text-[length:var(--fs-micro)] font-bold uppercase tracking-[var(--tracking-widest)] text-foreground-quiet"
								>
									{t.group.with(group.plan.name)}
								</p>
								<h2 class="mt-1 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
									{localizedPlan(group.plan, lang).role}
								</h2>
								<p class="mt-1 text-[length:var(--fs-meta)] text-foreground-quiet">
									{t.group.count(group.skills.length, priceLabel(group.plan, lang))}
								</p>
							</div>
							<a
								href={`${localeHref(lang, '/pricing')}#${group.plan.id}`}
								class="text-[length:var(--fs-meta)] font-semibold text-foreground-quiet underline underline-offset-4 hover:text-foreground-soft"
							>
								{t.group.view(group.plan.name)}
							</a>
						</div>
						<div class="grid gap-4 md:grid-cols-2">
							{#each group.skills as skill (skill.slug)}
								<SkillMarketplaceCard {skill} {lang} />
							{/each}
						</div>
					</div>
				{:else}
					<p
						class="rounded-xl border border-border/25 bg-surface-card px-4 py-6 text-center text-[length:var(--fs-section)] text-foreground-quiet"
					>
						{t.empty}
					</p>
				{/each}
			</div>
		</div>
	</section>

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
