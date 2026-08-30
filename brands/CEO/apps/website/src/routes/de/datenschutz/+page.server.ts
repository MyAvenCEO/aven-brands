/** The build-rendered footer — this route's only build-time data. */
import { footerData } from '$lib/vibes/footer'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = ({ url }) => footerData(url.pathname)
