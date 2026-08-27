<svelte:head>
	<title>{t.title}</title>
	<meta name="description" content={t.description}>
</svelte:head>

<script lang="ts">
import AvenIdCheckCta from '$lib/components/AvenIdCheckCta.svelte'
import MarketingSiteHeader from '$lib/components/MarketingSiteHeader.svelte'
import SiteFooter from '$lib/components/SiteFooter.svelte'
import { type Lang, localeHref, pick } from '$lib/i18n'
import { localizedPlan, priceSuffix } from '$lib/i18n/plans'
import { pricing } from '$lib/i18n/pricing'
import { euro, type Plan, type PlanFeature, type PlanId, plan } from '$lib/pricing/plans'
import { loadSkill, skillDetailHref, skillLabel, skillsIncludedIn } from '$lib/skills/loader'

let { lang }: { lang: Lang } = $props()

const t = $derived(pick(pricing, lang))

/** avenCEO is the one pricing tier on this page; the name + Testride live in
 * the unified CTA band at the bottom. */
const ceo = $derived(localizedPlan(plan('avenceo'), lang))
const ceoSkillCount = $derived(skillsIncludedIn('avenceo', lang).length)
/** avenCEO's non-skill bullets — skills render in their own column. */
const ceoPlain = $derived(ceo.features.filter((f) => !f.skill))

/** A card shows at most this many skills; the rest sit behind "see all". */
const SKILL_CAP = 7

type SkillFeature = PlanFeature & { skill: string }

/**
 * The skills a plan carries, live ones first: its own, plus — along the
 * skill cascade — everything from the plans it includes.
 */
function skillFeatures(p: Plan): SkillFeature[] {
	const cascade: PlanId[] = p.id === 'avencoop' ? ['avenceo'] : []
	return [...p.features, ...cascade.flatMap((id) => localizedPlan(plan(id), lang).features)]
		.filter((f): f is SkillFeature => typeof f.skill === 'string')
		.sort(
			(a, b) =>
				Number(loadSkill(a.skill, lang)?.comingSoon ?? false) -
				Number(loadSkill(b.skill, lang)?.comingSoon ?? false)
		)
}
</script>

<!-- What the plan costs, in ONE panel: the monthly price on the left, the
     revenue share that comes off what it earns on the right, and — when the
     window is open — the BETA strip across the bottom. Every plan uses this
     same panel, so a reader learns the layout once.

     Container queries, not viewport ones: the panel sits in a half-width
     product card on one plan and in avenCOOP's narrow left column on
     another, and it has to split or stack by its OWN width. -->
{#snippet pricePanel(p: Plan)}
	<div class="rounded-2xl border border-border/25 bg-surface-card px-5 py-5">
		<p class="flex flex-wrap items-baseline justify-center gap-x-2">
			<span class="text-3xl font-semibold tabular-nums tracking-tight text-foreground"
				>{euro(p.eurPrice)}&nbsp;€</span
			>
			<span class="text-[length:var(--fs-meta)] font-medium text-foreground/50"
				>{priceSuffix(p, lang)}</span
			>
		</p>
	</div>
{/snippet}

<!-- The transformation, before any fact: what changes in your life. This is
     the one block on a card allowed to be warm — everything below it earns
     trust with numbers, this line earns the wish. -->
{#snippet pitchLine(p: Plan)}
	<p
		class="mx-auto mt-4 max-w-md text-center text-[length:var(--fs-body)] leading-relaxed text-foreground/65 italic"
	>
		{p.pitch}
	</p>
{/snippet}

<!-- Skills on a card are pointers, not blurbs: the skill name, and its short
     title as a 3–5 word gloss. The full sentence lives on the skill's page. -->
{#snippet skillList(items: SkillFeature[])}
	<ul class="mt-2 space-y-1.5 text-[length:var(--fs-body)] leading-snug">
		{#each items.slice(0, SKILL_CAP) as feature (feature.skill)}
			{@const soon = loadSkill(feature.skill, lang)?.comingSoon}
			<li class={soon ? 'opacity-70' : ''}>
				<a
					href={skillDetailHref(feature.skill, lang)}
					class="font-medium underline underline-offset-4 transition-colors {soon
						? 'text-quiet-ink decoration-dashed decoration-quiet/40 hover:decoration-quiet/70'
						: 'text-foreground decoration-foreground/25 hover:decoration-foreground/60'}"
				>
					{skillLabel(feature.skill)}
				</a>
				{#if soon}
					<span
						class="ml-1 rounded-full border border-quiet/25 bg-quiet/15 px-1.5 py-0.5 text-[length:var(--fs-nano)] font-semibold uppercase tracking-[var(--tracking-wide)] text-quiet-ink"
						>{t.soon}</span
					>
				{/if}
				<span class="text-foreground/50">· {feature.title}</span>
			</li>
		{/each}
	</ul>
{/snippet}

<div {lang} class="app-shell">
	<MarketingSiteHeader active="pricing" maxWidth="6xl" {lang} />

	<section
		id="pricing-plans"
		class="scroll-mt-28 border-b border-border/25 px-5 py-14 sm:px-8 sm:py-16"
	>
		<div class="mx-auto max-w-6xl">
			<div class="mx-auto max-w-2xl text-center">
				<p
					class="text-[length:var(--fs-eyebrow)] font-semibold uppercase tracking-[var(--tracking-wider)] text-accent"
				>
					{t.eyebrow}
				</p>
				<h2 class="section-title mt-3 sm:text-3xl">
					{t.heading}
				</h2>
				<!-- The wish first, the three facts after — same order as on the cards. -->
				<p
					class="mx-auto mt-4 max-w-xl text-[length:var(--fs-title)] leading-relaxed text-foreground/80"
				>
					{t.lead}
				</p>
			</div>

			<!-- avenCEO: the one pricing tier — full width, and read top to bottom.
			     A centred header, then the price and the button as one tidy buy
			     box, then a divider and two columns: what's included on the left
			     (daily runtime, the feature titles), the skills you can go read on
			     the right, running the full height. No badge, no revenue-share. -->
			<div
				id={ceo.id}
				class="relative mx-auto mt-12 max-w-3xl scroll-mt-28 rounded-2xl border-2 border-accent/25 bg-surface-raised p-6 pt-9 shadow-[0_1px_3px_rgba(30,41,59,0.05)] sm:p-10"
			>
				<!-- No `uppercase`: the brand is spelled avenCEO, not AVENCEO. -->
				<p class="text-center text-2xl font-semibold tracking-tight text-foreground">{ceo.name}</p>
				<p class="mt-1 text-center text-[length:var(--fs-meta)] leading-snug text-foreground/50">
					{ceo.role}
				</p>

				{@render pitchLine(ceo)}

				<!-- Divider, then the two columns: what's included on the left
				     (daily runtime, the feature titles), the skills you can go read
				     on the right, running the full height. -->
				<div
					class="mx-auto mt-8 grid max-w-3xl items-stretch gap-8 border-t border-border/25 pt-7 sm:grid-cols-2 sm:gap-10"
				>
					<div>
						<p class="eyebrow-accent">
							{t.included}
						</p>
						<div
							class="mt-3 rounded-lg bg-success/8 px-3 py-2 text-[length:var(--fs-meta)] leading-snug"
						>
							<strong class="font-semibold text-success-ink">{t.sovereignty.lead}</strong>
							<span class="text-foreground/80">{t.sovereignty.text}</span>
						</div>
						<!-- Titles only: compact, two columns in the wide left section. -->
						<ul
							class="mt-3 space-y-2 text-left text-[length:var(--fs-body)] leading-snug text-foreground/80"
						>
							{#if ceo.runtime}
								<li class="flex gap-2">
									<span
										aria-hidden="true"
										class="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent"
									></span>
									<span>
										<span class="font-semibold text-foreground/85"
											>{t.runtimeHours(ceo.runtime.hoursPerDay)}</span
										>
										<span class="text-foreground/55"
											>{t.fairUse}
											· {t.extraMinute(ceo.runtime.centsPerExtraMinute)}</span
										>
									</span>
								</li>
							{/if}
							{#each ceoPlain as feature (feature.title)}
								<li class="flex gap-2">
									<span
										aria-hidden="true"
										class="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent"
									></span>
									{#if feature.href}
										<a
											href={feature.href}
											target="_blank"
											rel="noopener noreferrer"
											class="font-medium underline decoration-foreground/25 underline-offset-4 transition-colors hover:decoration-foreground/60"
										>
											{feature.title}
											→
										</a>
									{:else}
										<span class="font-medium text-foreground/80">{feature.title}</span>
									{/if}
								</li>
							{/each}
						</ul>
						<p class="mt-4 text-[length:var(--fs-micro)] leading-snug text-foreground/40">
							{t.postForwardNote}
						</p>
					</div>

					{#if ceoSkillCount > 0}
						<div class="text-left sm:border-l sm:border-border/25 sm:pl-10">
							<p class="eyebrow-accent">
								{t.skills}
							</p>
							{@render skillList(skillFeatures(ceo))}
							<p class="mt-2 text-[length:var(--fs-meta)] text-foreground/50">
								<a
									href={`${localeHref(lang, '/skills')}?plan=${ceo.id}`}
									class="underline underline-offset-4 hover:text-foreground/80"
								>
									{t.allSkills(ceoSkillCount)}
								</a>
							</p>
						</div>
					{/if}
				</div>

				<!-- The buy box last: after the runtime, the included list and the
				     skills, the price and the button. It is invite-only for now, so
				     the button is a status, not a link. -->
				<div class="mt-8 border-t border-border/25 pt-7">
					{@render pricePanel(ceo)}
					<button
						type="button"
						disabled
						class="mt-4 inline-flex min-h-11 w-full cursor-default items-center justify-center rounded-full bg-foreground/10 px-10 text-[length:var(--fs-body)] font-semibold text-foreground/50"
					>
						{t.comingSoon}
					</button>
				</div>
			</div>
		</div>
	</section>

	<section class="border-b border-border/25 px-5 py-14 sm:px-8 sm:py-16" id="aven-id">
		<div class="mx-auto max-w-3xl">
			<AvenIdCheckCta variant="banner" {lang} />
		</div>
	</section>

	<SiteFooter {lang} />
</div>
