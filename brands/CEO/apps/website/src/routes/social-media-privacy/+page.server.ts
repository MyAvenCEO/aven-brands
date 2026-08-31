/** The document and the footer, rendered at build — see $lib/vibes/legal.ts. */
import { SOCIAL_MEDIA_EN } from '@myavenceo/aven-ceo'
import { footerData } from '$lib/vibes/footer'
import { idCtaChrome } from '$lib/vibes/id-check-cta'
import { legalDocHtml } from '$lib/vibes/legal'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url }) => {
	return {
		idCtaChrome: await idCtaChrome('en'),
		legalHtml: await legalDocHtml(SOCIAL_MEDIA_EN),
		...(await footerData(url.pathname))
	}
}
