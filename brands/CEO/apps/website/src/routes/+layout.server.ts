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

import { icons } from '@myavenceo/aven-ceo/icons'
import { Evaluator, renderViewToString } from '@myavenceo/aven-vibes'
import { langFromPath } from '$lib/i18n'
import { buildMenuBundle, type MenuBundle } from '$lib/menu-island'
import type { LayoutServerLoad } from './$types'

const evaluator = new Evaluator()

/*
 * The locale comes from `langFromPath`, the i18n module's own answer, and not
 * from a copy written here.
 *
 * The copy was WRONG IN BOTH DIRECTIONS: it treated `/en/` as the English
 * prefix and everything else as German, when this site is the other way round
 * — the root IS English and `/de/` carries the prefix (`localeHref` says so:
 * an English href is the bare path). So every English route rendered a German
 * menu, on every page, from the moment the island shipped.
 *
 * The lesson is the duplication, not the inversion. A second implementation of
 * a rule the module already owns cannot be right for long, and this one was
 * never right at all; `/docs` needs no special case either, because it has no
 * `/de/` prefix and so is already English by the real rule.
 */

/*
 * Which destination is the current one, in either language.
 *
 * It stripped a `/en` prefix that this site does not have and then matched
 * English slugs only, so no German route was ever marked current: `/de/preise/`
 * matched nothing, and neither did `/de/skills/`. The prefix to strip is
 * `/de`, and `preise` is `pricing` — the same slug map `localeHref` uses to
 * build those URLs in the first place.
 */
function activeOf(pathname: string): 'skills' | 'avens' | 'pricing' | 'docs' | null {
	const path = pathname.replace(/^\/de(?=\/|$)/, '') || '/'
	if (path.startsWith('/skills')) return 'skills'
	if (path.startsWith('/avens')) return 'avens'
	if (path.startsWith('/pricing') || path.startsWith('/preise')) return 'pricing'
	if (path.startsWith('/docs')) return 'docs'
	return null
}

export const load: LayoutServerLoad = async ({ url }) => {
	const bundle: MenuBundle = buildMenuBundle({
		lang: langFromPath(url.pathname),
		pathname: url.pathname,
		active: activeOf(url.pathname)
	})
	const html = await renderViewToString(bundle.view, bundle.state, {
		evaluate: (expr, data) => evaluator.evaluate(expr, data),
		icons
	})
	return { menuIsland: { html, bundle } }
}
