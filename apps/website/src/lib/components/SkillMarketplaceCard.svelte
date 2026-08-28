<script lang="ts">
import { type Lang, pick } from '$lib/i18n'
import { skills as messages } from '$lib/i18n/skills'
import { plan } from '$lib/pricing/plans'
import { skillDetailHref, skillLabel } from '$lib/skills/loader'
import type { AvenosSkill } from '$lib/skills/types'

type Props = {
	skill: AvenosSkill
	variant?: 'default' | 'spotlight'
	lang?: Lang
}

let { skill, variant = 'default', lang = 'de' }: Props = $props()

const t = $derived(pick(messages, lang).card)

const cardClass = $derived.by(() =>
	skill.comingSoon
		? 'group flex min-w-0 flex-col rounded-2xl border-2 border-dashed border-quiet/25 bg-surface-soft/25 p-5 opacity-85 transition-all hover:border-quiet/25 hover:opacity-100 sm:p-6'
		: variant === 'spotlight'
			? 'group flex min-w-0 flex-col rounded-2xl border-2 border-accent/25 bg-surface-raised p-6 ring-1 ring-accent/15 shadow-[0_1px_3px_rgba(30,41,59,0.05)] transition-all hover:border-accent/25  sm:p-7'
			: 'group flex min-w-0 flex-col rounded-2xl border border-border/25 bg-surface-raised p-5 transition-all hover:border-border/25 hover:bg-surface-soft  sm:p-6'
)
</script>

<a
	href={skillDetailHref(skill.slug, lang)}
	class={cardClass}
	aria-label={`${skillLabel(skill.slug)} — ${skill.oneLineCopy}`}
>
	<div class="flex items-start justify-between gap-3">
		<p
			class="text-[length:var(--fs-micro)] font-bold uppercase tracking-[var(--tracking-widest)] text-foreground/35"
		>
			{plan(skill.plan).name}
		</p>
		<span
			class="inline-flex items-center rounded-full border px-2 py-0.5 text-[length:var(--fs-nano)] font-bold uppercase tracking-[var(--tracking-wider)] {skill.comingSoon
				? 'border-quiet/25 bg-quiet/8 text-quiet-ink'
				: 'border-accent/25 bg-accent/15 text-accent'}"
		>
			{skill.comingSoon ? t.soon : t.skill}
		</span>
	</div>

	<h3
		class="mt-3 text-[length:var(--fs-title)] font-bold tracking-[var(--tracking-wide)] text-foreground sm:text-[length:var(--fs-title)]"
	>
		{skillLabel(skill.slug)}
	</h3>

	<p
		class="mt-2 text-[length:var(--fs-section)] font-medium leading-snug text-foreground/80 sm:text-[length:var(--fs-title)]"
	>
		{skill.oneLineCopy}
	</p>

	<p
		class="mt-3 text-[length:var(--fs-body)] italic leading-snug text-foreground/65 sm:text-[length:var(--fs-section)]"
	>
		"{skill.founderScenario.timestamp}
		— {skill.founderScenario.story.slice(0, 100)}&hellip;"
	</p>

	<div class="mt-4 flex flex-wrap gap-1.5">
		{#each skill.playsWith as { slug } (slug)}
			<span
				class="inline-flex items-center rounded-full border border-border/25 bg-background/25 px-2 py-0.5 text-[length:var(--fs-nano)] font-semibold text-foreground/50"
			>
				→ {t.chainLabels[slug] ?? slug}
			</span>
		{/each}
	</div>

	<div class="mt-5 flex items-center justify-between border-t border-border/10 pt-4">
		<span
			class="inline-flex items-center rounded-full bg-secondary px-2.5 py-1 text-[length:var(--fs-nano)] font-bold uppercase tracking-[var(--tracking-wide)] text-foreground/70"
		>
			{skill.hero.promiseHoursPerWeek}
			{t.saved}
		</span>
		<span
			class="text-[length:var(--fs-meta)] font-semibold text-foreground/50 transition-colors group-hover:text-foreground/80"
		>
			{t.view}
		</span>
	</div>
</a>
