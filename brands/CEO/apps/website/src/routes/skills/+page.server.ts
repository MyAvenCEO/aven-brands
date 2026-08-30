/** The marketplace page's static sections and the footer, rendered at build. */
import { footerHtml } from '$lib/vibes/footer'
import { renderSkillsSections } from '$lib/vibes/skills'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	return { skillsSections: await renderSkillsSections('en'), footerHtml: await footerHtml('en') }
}
