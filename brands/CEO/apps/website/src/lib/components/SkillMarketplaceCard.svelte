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

/*
 * The unit, with an emphasis where the card has one.
 *
 * This used to be three complete class strings — thirty-odd utilities each,
 * differing in a border, a ground and a padding — so the three variants of one
 * card had no shared definition at all and drifted independently. `p-5` here,
 * `p-6` there, `p-7` in the third.
 */
const cardClass = $derived(
	skill.comingSoon
		? 'skill-card skill-card--emphasis-soon'
		: variant === 'spotlight'
			? 'skill-card skill-card--emphasis-featured'
			: 'skill-card'
)
</script>

<a
	href={skillDetailHref(skill.slug, lang)}
	class={cardClass}
	aria-label={`${skillLabel(skill.slug)} — ${skill.oneLineCopy}`}
>
	<div class="skill-card-head">
		<p class="skill-card-eyebrow">{plan(skill.plan).name}</p>
		<span class="badge {skill.comingSoon ? '' : 'badge--tone-accent'}">
			{skill.comingSoon ? t.soon : t.skill}
		</span>
	</div>

	<h3 class="skill-card-title">{skillLabel(skill.slug)}</h3>

	<p class="skill-card-summary">{skill.oneLineCopy}</p>

	<p class="skill-card-quote">
		"{skill.founderScenario.timestamp}
		— {skill.founderScenario.story.slice(0, 100)}&hellip;"
	</p>

	<div class="skill-card-chains">
		{#each skill.playsWith as { slug } (slug)}
			<span class="skill-card-chain">{t.chainLabels[slug] ?? slug}</span>
		{/each}
	</div>

	<div class="skill-card-rail">
		<span class="skill-card-promise">
			{skill.hero.promiseHoursPerWeek}
			{t.saved}
		</span>
		<span class="skill-card-more">{t.view}</span>
	</div>
</a>
