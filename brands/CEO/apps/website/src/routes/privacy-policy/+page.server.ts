/** The document and the footer, rendered at build — see $lib/vibes/legal.ts. */
import { PRIVACY_POLICY_EN } from '@myavenceo/aven-ceo'
import { footerData } from '$lib/vibes/footer'
import { legalDocHtml } from '$lib/vibes/legal'
import { idCtaChrome } from '$lib/vibes/id-check-cta'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url }) => {
	return { idCtaChrome: await idCtaChrome('en'), legalHtml: await legalDocHtml(PRIVACY_POLICY_EN), ...(await footerData(url.pathname)) }
}
