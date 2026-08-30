/**
 * The menu island, rendered at BUILD time for every page.
 *
 * A server load rather than a universal one, deliberately: `renderViewToString`
 * pulls the engine's markdown stack with it, and a universal load would ship
 * all of that to every client for a render the server already did. With
 * `prerender = true` this runs once per route at build, the HTML and the
 * bundle serialize into the page's data, and the client's only job is
 * `Island.hydrate` — the ~5 KB path.
 *
 * lang and the active destination derive from the pathname here rather than
 * being passed by each page, because the header is on ten routes and a prop
 * threaded through ten call sites is ten chances for one to lie.
 */
import { renderViewToString, Evaluator } from '@myavenceo/aven-vibes'
import { icons } from '@myavenceo/aven-ceo/icons'
import type { Lang } from '$lib/i18n'
import { buildMenuBundle, type MenuBundle } from '$lib/menu-island'
import type { LayoutServerLoad } from './$types'

const evaluator = new Evaluator()

function langOf(pathname: string): Lang {
	/* /docs is written once, in English. */
	if (pathname === '/en' || pathname.startsWith('/en/') || pathname.startsWith('/docs')) return 'en'
	return 'de'
}

function activeOf(pathname: string): 'skills' | 'avens' | 'pricing' | 'docs' | null {
	const path = pathname.replace(/^\/en(?=\/|$)/, '')
	if (path.startsWith('/skills')) return 'skills'
	if (path.startsWith('/avens')) return 'avens'
	if (path.startsWith('/pricing')) return 'pricing'
	if (pathname.startsWith('/docs')) return 'docs'
	return null
}

export const load: LayoutServerLoad = async ({ url }) => {
	const bundle: MenuBundle = buildMenuBundle({
		lang: langOf(url.pathname),
		pathname: url.pathname,
		active: activeOf(url.pathname)
	})
	const html = await renderViewToString(bundle.view, bundle.state, {
		evaluate: (expr, data) => evaluator.evaluate(expr, data),
		icons
	})
	return { menuIsland: { html, bundle } }
}
