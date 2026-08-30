import { error } from '@sveltejs/kit'
import { allSlugs, loadSkill } from '$lib/skills/loader'
import { footerHtml } from '$lib/vibes/footer'
import type { PageServerLoad } from './$types'

export const prerender = true

/** Skills are global — one URL per skill, no publisher segment. */
export const entries = () => allSlugs.map((slug) => ({ slug }))

/* A server load rather than the universal one it replaces: the footer render
 * happens at build, and a universal load would pull the engine's markdown
 * stack into every client bundle for a render the server already did. */
export const load: PageServerLoad = async ({ params }) => {
	const skill = loadSkill(params.slug, 'en')
	if (!skill) throw error(404, 'Skill not found')
	return { skill, footerHtml: await footerHtml('en') }
}
