/** The pricing page's static sections and the footer, rendered at build. */
import { footerHtml } from '$lib/vibes/footer'
import { renderPricingSections } from '$lib/vibes/pricing'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	return { pricingSections: await renderPricingSections('en'), footerHtml: await footerHtml('en') }
}
