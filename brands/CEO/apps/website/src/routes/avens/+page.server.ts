/** The Avens registry's static sections and the footer, rendered at build. */
import { renderAvensSections } from '$lib/vibes/avens'
import { footerHtml } from '$lib/vibes/footer'
import { idCtaChrome } from '$lib/vibes/id-check-cta'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	return {
		avensSections: await renderAvensSections('en'),
		footerHtml: await footerHtml('en'),
		idCtaChrome: await idCtaChrome('en')
	}
}
