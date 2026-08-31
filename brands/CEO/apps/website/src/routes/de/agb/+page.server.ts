/** The placeholder and the footer, rendered at build — see $lib/vibes/legal.ts. */
import { footerData } from '$lib/vibes/footer'
import { idCtaChrome } from '$lib/vibes/id-check-cta'
import { agbPlaceholderHtml } from '$lib/vibes/legal'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url }) => {
	return {
		idCtaChrome: await idCtaChrome('de'),
		legalHtml: await agbPlaceholderHtml(),
		...(await footerData(url.pathname))
	}
}
