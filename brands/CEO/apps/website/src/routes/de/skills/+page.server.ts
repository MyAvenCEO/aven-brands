/** The German marketplace page's static sections — see `/skills/+page.server.ts`. */
import { footerHtml } from '$lib/vibes/footer'
import { renderSkillsSections } from '$lib/vibes/skills'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	return { skillsSections: await renderSkillsSections('de'), footerHtml: await footerHtml('de') }
}
