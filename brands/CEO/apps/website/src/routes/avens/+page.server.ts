/** The build-rendered footer; this page's own sections migrate next. */
import { footerData } from '$lib/vibes/footer'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = ({ url }) => footerData(url.pathname)
