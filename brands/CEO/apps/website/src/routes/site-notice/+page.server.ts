/** The document and the footer, rendered at build — see $lib/vibes/legal.ts. */
import { SITE_NOTICE_EN } from '@myavenceo/aven-ceo'
import { footerData } from '$lib/vibes/footer'
import { legalDocHtml } from '$lib/vibes/legal'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url }) => {
	return { legalHtml: await legalDocHtml(SITE_NOTICE_EN), ...(await footerData(url.pathname)) }
}
