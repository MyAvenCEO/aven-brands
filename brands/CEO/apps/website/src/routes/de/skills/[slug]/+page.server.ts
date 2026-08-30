import { error } from '@sveltejs/kit'
import { allSlugs, loadSkill } from '$lib/skills/loader'
import { footerHtml } from '$lib/vibes/footer'
import { renderSkillLandingSections } from '$lib/vibes/skill-landing'
import type { PageServerLoad } from './$types'

export const prerender = true

/** Skills are global — one URL per skill, no publisher segment. */
export const entries = () => allSlugs.map((slug) => ({ slug }))

/* A server load rather than the universal one it replaced — see the English
 * route: the render belongs to the build, not the client bundle. */
export const load: PageServerLoad = async ({ params }) => {
	const skill = loadSkill(params.slug, 'de')
	if (!skill) throw error(404, 'Skill nicht gefunden')
	return {
		skill,
		skillSections: await renderSkillLandingSections(skill, 'de'),
		footerHtml: await footerHtml('de')
	}
}
