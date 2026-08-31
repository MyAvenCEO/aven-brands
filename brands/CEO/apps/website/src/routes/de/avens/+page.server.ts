/** The German Avens registry's static sections — see `/avens/+page.server.ts`. */
import { renderAvensSections } from '$lib/vibes/avens'
import { footerHtml } from '$lib/vibes/footer'
import { idCtaChrome } from '$lib/vibes/id-check-cta'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	return {
		avensSections: await renderAvensSections('de'),
		footerHtml: await footerHtml('de'),
		idCtaChrome: await idCtaChrome('de')
	}
}
