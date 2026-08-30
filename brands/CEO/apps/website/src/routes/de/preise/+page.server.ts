/** The German pricing page's static sections — see `/pricing/+page.server.ts`. */
import { footerHtml } from '$lib/vibes/footer'
import { idCtaChrome } from '$lib/vibes/id-check-cta'
import { renderPricingSections } from '$lib/vibes/pricing'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	return {
		pricingSections: await renderPricingSections('de'),
		footerHtml: await footerHtml('de'),
		idCtaChrome: await idCtaChrome('de')
	}
}
