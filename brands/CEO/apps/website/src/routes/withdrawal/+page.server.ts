/** The build-rendered footer and the claim card's chrome — the page mounts
 * the global closing CTA, which throws without it. */

import { footerData } from '$lib/vibes/footer'
import { idCtaChrome } from '$lib/vibes/id-check-cta'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url }) => {
	return { idCtaChrome: await idCtaChrome('en'), ...(await footerData(url.pathname)) }
}
