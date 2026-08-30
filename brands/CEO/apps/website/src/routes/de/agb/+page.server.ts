/** The placeholder and the footer, rendered at build — see $lib/vibes/legal.ts. */
import { footerData } from '$lib/vibes/footer'
import { agbPlaceholderHtml } from '$lib/vibes/legal'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url }) => {
	return { legalHtml: await agbPlaceholderHtml(), ...(await footerData(url.pathname)) }
}
