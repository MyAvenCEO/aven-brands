<script lang="ts">
/**
 * A skill's landing page — delivered as configuration.
 *
 * The eight content sections render from ViewDefs in
 * `$lib/vibes/skill-landing.ts` at build, per skill and language, and arrive
 * here as HTML. What stays Svelte is the shell around `AvenIdCheckCta`
 * (real network logic, a future sandbox-tier island), the header and the
 * footer.
 */
import { page } from '$app/state'
import AvenIdCheckCta from '$lib/components/AvenIdCheckCta.svelte'
import MarketingSiteHeader from '$lib/components/MarketingSiteHeader.svelte'
import SiteFooter from '$lib/components/SiteFooter.svelte'
import { type Lang, pick } from '$lib/i18n'
import { skills as messages } from '$lib/i18n/skills'
import { skillLabel } from '$lib/skills/loader'
import type { AvenosSkill } from '$lib/skills/types'
import type { SkillLandingSections } from '$lib/vibes/skill-landing'

type Props = {
	skill: AvenosSkill
	lang?: Lang
}

let { skill, lang = 'de' }: Props = $props()

const t = $derived(pick(messages, lang).detail)

const sections: SkillLandingSections = page.data.skillSections
if (!sections) throw new Error('[skill] missing skillSections — the route has no server load')
</script>

<svelte:head>
	<title>{skill.comingSoon ? t.titleSoonPrefix : ''}{skillLabel(skill.slug)}{t.titleSuffix}</title>
	<meta name="description" content={skill.oneLineCopy}>
</svelte:head>

<div {lang} class="app-shell">
	<MarketingSiteHeader active="skills" {lang} />

	{@html sections.why}

	{@html sections.gain}

	{@html sections.how}

	{@html sections.mechanics}

	{@html sections.plays}

	{@html sections.value}

	{@html sections.bonus}

	{@html sections.letter}

	<section class="section sm:px-8 sm:py-20">
		<div class="mx-auto max-w-2xl">
			<AvenIdCheckCta variant="banner" {lang} />
			{@html sections.back}
		</div>
	</section>

	<SiteFooter {lang} />
</div>

<style>
/* The avenCEO beam avatars arrive through the render seam as generated SVG;
   these declarations are what `[&>svg]:block [&>svg]:size-full` said when
   the wrappers were compiled markup — the `>` in that arbitrary variant does
   not survive the engine's attribute sanitiser. `:global` because the
   sections arrive through `{@html}` and Svelte never compiled them. */
:global(#skill-scenario-avatar > svg),
:global(#skill-letter-avatar > svg) {
	display: block;
	width: 100%;
	height: 100%;
}
</style>
