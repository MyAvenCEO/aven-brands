/** The German marketplace page's static sections — see `/skills/+page.server.ts`. */
import { footerHtml } from '$lib/vibes/footer'
import { idCtaChrome } from '$lib/vibes/id-check-cta'
import { renderSkillsSections } from '$lib/vibes/skills'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	return {
		skillsSections: await renderSkillsSections('de'),
		footerHtml: await footerHtml('de'),
		idCtaChrome: await idCtaChrome('de')
	}
}
