<script lang="ts">
import { beamAvatarSvg, paletteFromCommaString } from '$lib/beam-avatar'
import AvenIdCheckCta from '$lib/components/AvenIdCheckCta.svelte'
import MarketingSiteHeader from '$lib/components/MarketingSiteHeader.svelte'
import SiteFooter from '$lib/components/SiteFooter.svelte'
import { type Lang, localeHref, pick } from '$lib/i18n'
import { skills as messages } from '$lib/i18n/skills'
import { availabilityNote, skillDetailHref, skillLabel } from '$lib/skills/loader'
import type { AvenosSkill } from '$lib/skills/types'

type Props = {
	skill: AvenosSkill
	lang?: Lang
}

let { skill, lang = 'de' }: Props = $props()

const t = $derived(pick(messages, lang).detail)

/**
 * Skills are global — nobody "publishes" them. The one who speaks for them is
 * avenCEO, the Aven of the avenCEO GmbH: the company's own AI‑CEO, the single
 * point of contact everyone talks to.
 */
const AVEN = 'avenCEO'
const paletteKi = paletteFromCommaString('e8c9a8,d4a574,c9a962,305669,222e49')
</script>

<svelte:head>
	<title>{skill.comingSoon ? t.titleSoonPrefix : ''}{skillLabel(skill.slug)}{t.titleSuffix}</title>
	<meta name="description" content={skill.oneLineCopy}>
</svelte:head>

<div {lang} class="app-shell">
	<MarketingSiteHeader active="skills" {lang} />

	<!-- 1. WHY — Daniel scenario -->
	<section class="border-b border-border/10 px-5 py-24 sm:px-8 sm:py-32 md:py-40">
		<div class="mx-auto max-w-3xl text-center">
			<p class="eyebrow">
				{skill.hero.kicker}
			</p>
			{#if skill.comingSoon}
				<p class="mt-3">
					<span
						class="inline-flex items-center rounded-full border border-quiet/25 bg-quiet/15 px-3 py-1 text-[length:var(--fs-micro)] font-semibold uppercase tracking-[var(--tracking-wider)] text-quiet-ink"
					>
						{t.comingSoon}
					</span>
				</p>
			{/if}
			<h1
				class="mt-4 text-[length:var(--fs-amount)] font-semibold tracking-[var(--tracking-tight)] text-pretty leading-snug text-foreground sm:text-3xl md:text-[length:var(--fs-display-lg)] md:leading-[1.15]"
			>
				{skill.hero.headlineMain}
				<span
					class="mt-3 block font-sans text-[length:var(--fs-title)] font-normal leading-snug tracking-normal text-foreground-quiet sm:text-[length:var(--fs-lead)]"
				>
					{skill.hero.headlineSerifLead}
				</span>
			</h1>
			<div class="mx-auto mt-8 max-w-xl">
				<div
					class="rounded-2xl border border-border/25 bg-surface-raised px-5 py-5 text-left sm:px-6 sm:py-6"
				>
					<p class="eyebrow-quiet">
						{skill.founderScenario.timestamp}
						{t.fromRealLife}
					</p>
					<p
						class="mt-3 text-[length:var(--fs-title)] italic leading-relaxed text-foreground-soft sm:text-[length:var(--fs-title)]"
					>
						"{skill.founderScenario.story}"
					</p>
					<div class="mt-4 flex items-center gap-2 border-t border-border/25 pt-3">
						<div
							class="size-6 shrink-0 overflow-hidden rounded-full ring-1 ring-surface-page [&>svg]:block [&>svg]:size-full"
							aria-hidden="true"
						>
							{@html beamAvatarSvg(AVEN, paletteKi, 32, `skill-aven-${skill.slug}`)}
						</div>
						<p
							class="text-[length:var(--fs-nano)] font-bold tracking-[var(--tracking-wider)] text-accent-ink"
						>
							{t.yourAven}
						</p>
						<p class="text-[length:var(--fs-nano)] text-foreground-quiet">{t.solvesIt}</p>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- 2. WAS DU GEWINNST — benefits first -->
	<section
		class="border-b border-border/10 bg-linear-to-b from-white/15 via-white/8 to-transparent px-5 py-14 sm:px-8 sm:py-20"
	>
		<div class="mx-auto max-w-2xl">
			<div class="text-center">
				<p class="eyebrow">
					{t.gainEyebrow}
				</p>
				<h2
					class="mt-3 text-2xl font-semibold tracking-tight text-pretty text-foreground sm:text-3xl"
				>
					{t.gainHeading(skillLabel(skill.slug))}
				</h2>
				<p
					class="mx-auto mt-3 max-w-md text-[length:var(--fs-eyebrow)] font-bold uppercase tracking-[var(--tracking-wider)] text-accent-ink"
				>
					{skill.hero.promiseHoursPerWeek}
					{t.perWeekBack}
				</p>
			</div>
			<ul
				class="mt-8 space-y-3 text-[length:var(--fs-section)] leading-snug text-foreground-soft sm:text-[length:var(--fs-title)]"
			>
				{#each skill.benefits as benefit (benefit)}
					<li class="flex gap-3">
						<span class="mt-1.5 size-2 shrink-0 rounded-full bg-accent" aria-hidden="true"></span>
						<span>{benefit}</span>
					</li>
				{/each}
			</ul>
		</div>
	</section>

	<!-- 3. HOW — plain-language steps -->
	<section class="section-band sm:px-8 sm:py-20">
		<div class="mx-auto max-w-2xl text-center">
			<p class="eyebrow">
				{t.howEyebrow}
			</p>
			<h2
				class="mt-3 text-2xl font-semibold tracking-tight text-pretty text-foreground sm:text-3xl"
			>
				{t.howHeading}
			</h2>
			<ol class="mt-10 mx-auto max-w-xl list-none space-y-0 p-0">
				{#each skill.howSteps as step, i (step)}
					<li class="border-b border-border/10 py-6 first:border-t first:border-border/25">
						<div class="flex flex-col items-center gap-2 sm:gap-2.5">
							<span
								class="text-[length:var(--fs-eyebrow)] font-bold tabular-nums tracking-[var(--tracking-wide)] text-foreground-quiet"
							>
								{String(i + 1).padStart(2, '0')}
							</span>
							<p
								class="max-w-md text-[length:var(--fs-title)] font-medium leading-snug text-foreground-soft sm:text-[length:var(--fs-lead)]"
							>
								{step}
							</p>
						</div>
					</li>
				{/each}
			</ol>
		</div>
	</section>

	<!-- 4. WHAT — honest mechanics -->
	<section
		class="border-b border-border/10 bg-gradient-to-b from-transparent via-white/15 to-transparent px-5 py-14 sm:px-8 sm:py-20"
	>
		<div class="mx-auto max-w-3xl">
			<div class="text-center">
				<p class="eyebrow">
					{t.mechanicsEyebrow}
				</p>
				<h2 class="section-title mt-3 sm:text-3xl">
					{t.mechanicsHeading}
				</h2>
			</div>
			<div class="mt-8 grid gap-3 sm:grid-cols-3">
				<div class="rounded-xl border border-border/25 bg-surface-raised px-4 py-4">
					<p class="eyebrow-quiet">
						{t.input}
					</p>
					<p class="mt-2 text-[length:var(--fs-body)] leading-snug text-foreground-soft">
						{skill.whatMechanics.input}
					</p>
				</div>
				<div class="rounded-xl border border-accent/25 bg-accent/8 px-4 py-4 ring-1 ring-accent/15">
					<p class="eyebrow">
						{t.magic}
					</p>
					<p class="mt-2 text-[length:var(--fs-body)] leading-snug text-foreground-soft">
						{skill.whatMechanics.magic}
					</p>
				</div>
				<div class="rounded-xl border border-border/25 bg-surface-raised px-4 py-4">
					<p class="eyebrow-quiet">
						{t.output}
					</p>
					<p class="mt-2 text-[length:var(--fs-body)] leading-snug text-foreground-soft">
						{skill.whatMechanics.output}
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- 5. PLAYS WELL WITH -->
	<section class="border-b border-border/10 px-5 py-12 sm:px-8 sm:py-16">
		<div class="mx-auto max-w-3xl">
			<div class="text-center">
				<p class="eyebrow">
					{t.playsEyebrow}
				</p>
				<h2 class="mt-3 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
					{t.playsHeading(skillLabel(skill.slug))}
				</h2>
			</div>
			<ul class="mt-6 grid gap-2.5 sm:grid-cols-2">
				{#each skill.playsWith as { slug, relation } (slug)}
					<li>
						<a
							href={skillDetailHref(slug, lang)}
							class="flex items-start gap-3 rounded-xl border border-border/25 bg-surface-raised px-4 py-3 transition-colors hover:border-border/25 hover:bg-surface-sunken"
						>
							<span class="mt-0.5 text-[length:var(--fs-eyebrow)] font-bold text-accent-ink"
								>→</span
							>
							<div>
								<p
									class="text-[length:var(--fs-eyebrow)] font-bold tracking-[var(--tracking-wide)] text-foreground-soft"
								>
									{skillLabel(slug)}
								</p>
								<p class="mt-0.5 text-[length:var(--fs-meta)] leading-snug text-foreground-quiet">
									{relation}
								</p>
							</div>
						</a>
					</li>
				{/each}
			</ul>
		</div>
	</section>

	<!-- 6. VALUE STACK (Hormozi) -->
	<section
		class="border-b border-border/10 bg-linear-to-b from-transparent via-white/15 to-transparent px-5 py-14 sm:px-8 sm:py-20"
	>
		<div class="mx-auto max-w-2xl">
			<div class="text-center">
				<p class="eyebrow">
					{t.valueEyebrow}
				</p>
				<h2 class="section-title mt-3 sm:text-3xl">
					{t.valueHeading}
				</h2>
			</div>
			<div class="mt-8 rounded-2xl border border-border/25 bg-surface-raised p-5 sm:p-7">
				<p class="eyebrow-quiet">
					{t.standalone}
				</p>
				<ul class="mt-4 space-y-2">
					{#each skill.valueStack.standaloneAlternatives as alt (alt.label)}
						<li class="flex items-baseline justify-between gap-3">
							<span
								class="text-[length:var(--fs-body)] text-foreground-quiet line-through decoration-foreground/30"
								>{alt.label}</span
							>
							{#if alt.eurPerMonth > 0}
								<span
									class="shrink-0 text-[length:var(--fs-body)] font-bold tabular-nums text-foreground-quiet line-through decoration-foreground/30"
								>
									{alt.eurPerMonth}&nbsp;€/m
								</span>
							{:else}
								<span
									class="shrink-0 text-[length:var(--fs-eyebrow)] font-bold uppercase tracking-[var(--tracking-wider)] text-foreground-quiet"
								>
									{t.notAvailable}
								</span>
							{/if}
						</li>
					{/each}
				</ul>
				<div class="mt-5 flex items-baseline justify-between border-t border-border/25 pt-4">
					<span class="text-[length:var(--fs-section)] font-semibold text-foreground-quiet"
						>{t.standaloneTotal}</span
					>
					<span
						class="text-xl font-bold tabular-nums text-foreground line-through decoration-foreground/40"
					>
						≈ {skill.valueStack.standaloneTotalEurPerMonth}&nbsp;€/m
					</span>
				</div>
				<div class="mt-4 rounded-xl border border-accent/25 bg-accent/15 px-4 py-4">
					<p class="text-center eyebrow">
						{t.included}
					</p>
					<p class="mt-2 text-center text-[length:var(--fs-title)] font-bold text-foreground">
						{t.noSurcharge}
					</p>
					<p class="mt-1 text-center text-[length:var(--fs-meta)] text-foreground-quiet">
						{t.noLockIn}
					</p>
				</div>
				<div class="mt-5 grid gap-3 border-t border-border/25 pt-5 sm:grid-cols-3">
					<div>
						<p class="eyebrow-quiet">
							{t.firstRelief}
						</p>
						<p class="mt-1 text-[length:var(--fs-body)] font-medium text-foreground-soft">
							{skill.valueStack.timeDelayToValue}
						</p>
					</div>
					<div>
						<p class="eyebrow-quiet">
							{t.setupEffort}
						</p>
						<p class="mt-1 text-[length:var(--fs-body)] font-medium text-foreground-soft">
							{skill.valueStack.effortToInstall}
						</p>
					</div>
					<div>
						<p class="eyebrow-quiet">
							{t.proof}
						</p>
						<p class="mt-1 text-[length:var(--fs-body)] font-medium text-foreground-soft">
							{skill.valueStack.proof}
						</p>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- 7. BONUSES + GUARANTEE + SCARCITY -->
	<section class="border-b border-border/10 px-5 py-12 sm:px-8 sm:py-16">
		<div class="mx-auto max-w-2xl space-y-6">
			<div class="rounded-2xl border border-border/25 bg-surface-raised p-5 sm:p-6">
				<p class="eyebrow-quiet">
					{t.bonuses}
				</p>
				<ul class="mt-3 space-y-2">
					{#each skill.bonuses as bonus (bonus)}
						<li
							class="flex gap-3 text-[length:var(--fs-body)] leading-snug text-foreground-soft sm:text-[length:var(--fs-section)]"
						>
							<span class="mt-1 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true"></span>
							<span>{bonus}</span>
						</li>
					{/each}
				</ul>
			</div>
			<div class="rounded-xl border border-accent/25 bg-accent/15 px-5 py-4">
				<p class="eyebrow">
					{t.availability}
				</p>
				<p class="mt-1.5 text-[length:var(--fs-body)] leading-snug text-foreground-soft">
					{availabilityNote(skill, lang)}
				</p>
			</div>
		</div>
	</section>

	<!-- 8. LETTER FROM AVENOS -->
	<section
		class="border-b border-border/10 bg-linear-to-b from-white/15 via-white/8 to-transparent px-5 py-12 sm:px-8 sm:py-16"
	>
		<div class="mx-auto max-w-2xl">
			<div
				class="rounded-2xl border border-border/25 bg-surface-raised px-5 py-7 shadow-[var(--shadow-raised)] sm:px-8 sm:py-9"
			>
				<header class="flex items-end justify-between gap-4 border-b border-foreground/[0.06] pb-5">
					<div class="flex items-center gap-3">
						<div
							class="size-10 shrink-0 overflow-hidden rounded-full ring-2 ring-surface-page [&>svg]:block [&>svg]:size-full"
							aria-hidden="true"
						>
							{@html beamAvatarSvg(AVEN, paletteKi, 48, `letter-${skill.slug}`)}
						</div>
						<div>
							<p class="eyebrow">
								{t.writtenBy}
							</p>
							<p
								class="mt-0.5 text-[length:var(--fs-body)] font-bold tracking-[var(--tracking-wide)] text-accent-ink"
							>
								{AVEN}
							</p>
						</div>
					</div>
					<p
						class="text-[length:var(--fs-nano)] font-bold uppercase tracking-[var(--tracking-wider)] text-foreground-quiet"
					>
						{skillLabel(skill.slug)}
					</p>
				</header>
				<p
					class="mt-6 text-[length:var(--fs-title)] italic leading-relaxed text-foreground-soft sm:text-[length:var(--fs-title)] sm:leading-[1.65]"
				>
					{skill.letterFromPublisher}
				</p>
				<footer class="mt-8 border-t border-foreground/[0.06] pt-6">
					<p class="eyebrow-quiet">
						{t.signOff}
					</p>
					<p
						class="mt-1.5 text-[length:var(--fs-body)] font-bold tracking-[var(--tracking-wide)] text-accent-ink"
					>
						{AVEN}
					</p>
				</footer>
			</div>
		</div>
	</section>

	<!-- 9. CTA -->
	<section class="section-band sm:px-8 sm:py-20">
		<div class="mx-auto max-w-2xl">
			<AvenIdCheckCta variant="banner" {lang} />
			<div class="mt-6 text-center">
				<a
					href={localeHref(lang, '/skills')}
					class="text-[length:var(--fs-meta)] font-semibold uppercase tracking-[var(--tracking-wider)] text-foreground-quiet transition-opacity hover:text-foreground-soft"
				>
					{t.backToAll}
				</a>
			</div>
		</div>
	</section>

	<SiteFooter {lang} />
</div>
