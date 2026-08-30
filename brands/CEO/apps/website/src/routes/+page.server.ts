/**
 * The home page's static sections, rendered at BUILD time.
 *
 * Same story as the menu island one level up, minus the island: these
 * sections carry no behaviour, so only their HTML travels — no bundle, no
 * hydration, no client engine. With `prerender = true` this runs once per
 * route at build and the markup is in the emitted file.
 */
import { renderHomeSections } from '$lib/vibes/home'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	return { homeSections: await renderHomeSections('en') }
}
