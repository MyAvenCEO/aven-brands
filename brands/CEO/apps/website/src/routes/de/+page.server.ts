/** The German home page's static sections, rendered at build — see `/+page.server.ts`. */
import { renderHomeSections } from '$lib/vibes/home'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	return { homeSections: await renderHomeSections('de') }
}
