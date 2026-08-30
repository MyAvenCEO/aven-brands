/** The document and the footer, rendered at build — see $lib/vibes/legal.ts. */
import { SOCIAL_MEDIA_DE } from '@myavenceo/aven-ceo'
import { footerData } from '$lib/vibes/footer'
import { legalDocHtml } from '$lib/vibes/legal'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url }) => {
	return { legalHtml: await legalDocHtml(SOCIAL_MEDIA_DE), ...(await footerData(url.pathname)) }
}
