<script lang="ts">
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
import { loadSkills, loadSkillsByPlan, skillDetailHref } from '$lib/skills/loader'

let { lang }: { lang: Lang } = $props()

const t = $derived(pick(messages, lang).marketplace)
const skills = $derived(loadSkills(lang))
const byPlan = $derived(loadSkillsByPlan(lang))

/**
 * The marketplace is organized by PRODUCT, not by author: a buyer asks which
 * plan a skill comes with. avenCEO carries every skill, so
 * picking one shows exactly its skills; only avenCOOP also carries avenCEO's.
 * `?plan=` lets the pricing
 * page link straight into the right selection.
 */
// Static site (prerendered): the query string only exists in the browser, never at build time.
const fromQuery = $derived(browser ? (page.url.searchParams.get('plan') as PlanId | null) : null)
let picked = $state<PlanId | null>(null)
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

const chainSteps = $derived(t.chain.steps)
</script>

<svelte:head>
	<title>{t.title}</title>
	<meta name="description" content={t.description}>
</svelte:head>

<div {lang} class="app-shell">
	<MarketingSiteHeader active="skills" maxWidth="6xl" {lang} />

	<!-- Hero -->
	<section class="border-b border-border/25 px-5 py-24 sm:px-8 sm:py-32 md:py-40">
		<div class="mx-auto max-w-3xl text-center">
			<p class="eyebrow-accent">
				{t.hero.eyebrow}
			</p>
			<h1
				class="mt-4 text-[length:var(--fs-amount)] font-semibold tracking-[var(--tracking-tight)] text-pretty leading-snug text-foreground sm:text-3xl md:text-[length:var(--fs-display-lg)] md:leading-[1.15]"
			>
				{t.hero.heading}
				<span
					class="mt-2 block text-[clamp(1.25rem,3.85vw,2.05rem)] font-light leading-[1.08] tracking-tight text-foreground/90"
				>
					{t.hero.subheading}
				</span>
			</h1>
			<p
				class="mx-auto mt-8 max-w-2xl text-[length:var(--fs-title)] leading-relaxed text-foreground/65 sm:text-base"
			>
				{@html t.hero.paragraphHtml}
			</p>
		</div>
	</section>

	<!-- Marketplace: sidebar + featured + catalog -->
	<section class="border-b border-border/25 px-5 py-12 sm:px-8 sm:py-14">
		<div class="mx-auto max-w-5xl">
			<div class="space-y-12">
				{#if visibleByPlan.length > 1}
					<p
						class="rounded-xl border border-accent/25 bg-accent/8 px-4 py-3 text-[length:var(--fs-body)] leading-snug text-foreground/80"
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
									class="text-[length:var(--fs-micro)] font-bold uppercase tracking-[var(--tracking-widest)] text-foreground/35"
								>
									{t.group.with(group.plan.name)}
								</p>
								<h2 class="mt-1 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
									{localizedPlan(group.plan, lang).role}
								</h2>
								<p class="mt-1 text-[length:var(--fs-meta)] text-foreground/50">
									{t.group.count(group.skills.length, priceLabel(group.plan, lang))}
								</p>
							</div>
							<a
								href={`${localeHref(lang, '/pricing')}#${group.plan.id}`}
								class="text-[length:var(--fs-meta)] font-semibold text-foreground/50 underline underline-offset-4 hover:text-foreground/80"
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
						class="rounded-xl border border-border/25 bg-surface-card px-4 py-6 text-center text-[length:var(--fs-section)] text-foreground/50"
					>
						{t.empty}
					</p>
				{/each}
			</div>
		</div>
	</section>

	<!-- Chain visualization -->
	<section
		class="border-b border-border/25 bg-gradient-to-b from-transparent via-white/15 to-transparent px-5 py-14 sm:px-8 sm:py-20"
	>
		<div class="mx-auto max-w-4xl">
			<div class="text-center">
				<p class="eyebrow-accent">
					{t.chain.eyebrow}
				</p>
				<h2 class="section-title mt-3 sm:text-3xl">
					{t.chain.heading}
				</h2>
				<p
					class="mx-auto mt-4 max-w-xl text-[length:var(--fs-title)] leading-snug text-foreground/65"
				>
					{t.chain.paragraph}
				</p>
			</div>

			<div
				class="mt-10 flex flex-col items-center gap-2 sm:flex-row sm:items-stretch sm:justify-center"
			>
				{#each chainSteps as step, i (step.slug)}
					<a
						href={skillDetailHref(step.slug, lang)}
						class="group flex min-w-0 flex-col items-center rounded-xl border border-border/25 bg-surface-raised px-4 py-4 text-center transition-colors hover:border-border/25 hover:bg-surface-sunken sm:w-36"
					>
						<p
							class="text-[length:var(--fs-micro)] font-bold tracking-[var(--tracking-wide)] text-foreground/65 group-hover:text-foreground/90"
						>
							{step.label}
						</p>
						<p class="mt-1 text-[length:var(--fs-eyebrow)] leading-snug text-foreground/50">
							{step.description}
						</p>
					</a>
					{#if i < chainSteps.length - 1}
						<div
							class="flex items-center justify-center text-foreground/35 sm:self-center"
							aria-hidden="true"
						>
							<span class="text-lg sm:text-xl">→</span>
						</div>
					{/if}
				{/each}
			</div>

			<div
				class="mx-auto mt-6 max-w-sm rounded-xl border border-accent/25 bg-accent/8 px-4 py-3 text-center ring-1 ring-accent/15"
			>
				<p class="eyebrow-accent">
					{t.chain.hitlLabel}
				</p>
				<a
					href={skillDetailHref('human-reviewer', lang)}
					class="mt-1 block text-[length:var(--fs-meta)] font-bold tracking-[var(--tracking-wide)] text-foreground/80 hover:text-foreground/90"
				>
					human-reviewer
				</a>
				<p class="mt-1 text-[length:var(--fs-eyebrow)] text-foreground/50">
					{t.chain.hitlNote}
				</p>
			</div>
		</div>
	</section>

	<!-- Bundled-pricing band -->
	<section class="border-b border-border/25 px-5 py-12 sm:px-8 sm:py-14">
		<div class="mx-auto max-w-3xl text-center">
			<p class="eyebrow-accent">
				{t.pricing.eyebrow}
			</p>
			<h2 class="mt-3 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
				{t.pricing.heading(skills.length)}
			</h2>
			<p
				class="mx-auto mt-4 max-w-xl text-[length:var(--fs-title)] leading-snug text-foreground/65"
			>
				{t.pricing.paragraph}
			</p>
			<div class="mt-6">
				<a
					href={localeHref(lang, '/pricing')}
					class="inline-flex min-h-11 items-center justify-center rounded-full border border-border/25 bg-surface-raised px-7 text-[length:var(--fs-body)] font-semibold text-foreground transition-colors hover:bg-surface-sunken"
				>
					{t.pricing.cta}
				</a>
			</div>
		</div>
	</section>

	<!-- CTA -->
	<section class="section-band sm:px-8 sm:py-20">
		<div class="mx-auto max-w-2xl">
			<AvenIdCheckCta variant="banner" {lang} />
		</div>
	</section>

	<SiteFooter {lang} />
</div>
