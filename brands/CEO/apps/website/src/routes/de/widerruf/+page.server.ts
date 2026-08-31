/** The build-rendered footer and the closing CTA's chrome. */
import { footerData } from '$lib/vibes/footer'
import { idCtaChrome } from '$lib/vibes/id-check-cta'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url }) => ({
	...(await footerData(url.pathname)),
	/* The closing CTA is on every page now, and it throws loudly without this —
	   which is the throw doing its job rather than a page rendering half a
	   form. */
	idCtaChrome: await idCtaChrome('de')
})
