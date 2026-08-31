/**
 * Build-time rendering for the site's STATIC sections — the second delivery
 * tier after the menu island, and the simpler one.
 *
 * The island tier ships a bundle to the client because something on it moves.
 * These sections have nothing that moves: they are ViewDefs rendered to HTML
 * once, at build, by the same `renderViewToString` walk the island uses — and
 * the page carries the HTML alone. No bundle in `page.data`, no hydration, no
 * client engine. Zero JavaScript is the whole point of prerendering a
 * marketing page.
 *
 * THE SEAM (`inject`). Two things a section legitimately contains cannot be
 * expressed inside a ViewDef, by the engine's own rules:
 *
 *   - Copy that carries markup (`bodyHtml`, `<strong data-emph>` emphasis):
 *     a `text` node escapes — correctly, that guarantee is why views are safe
 *     to render at all. `format: 'md'` is not an answer either: these strings
 *     are HTML, not markdown.
 *   - Markup outside the engine's tag allowlist: `SAFE_TAGS` admits no
 *     `<video>` and no SVG (a view that can emit arbitrary SVG can emit
 *     script), and the renderer downgrades an unknown tag to a `<div>`. The
 *     hero's video loop and the founders' generated beam avatars live there.
 *
 * So a section puts a `@@token@@` where such a fragment goes, and the caller
 * supplies the fragment; the swap happens here, AFTER the engine has rendered
 * and escaped everything else. This is the same trust move as the pages'
 * `{@html}` before the migration — every injected string is the site's own
 * static copy or markup built from it, never user content — but it is now in
 * exactly one place instead of scattered across templates.
 *
 * A token that stays in the output is a defect (a section asked for a fragment
 * nobody supplied), so it throws rather than shipping `@@lead@@` to a reader.
 */

import { actors } from '@myavenceo/aven-ceo/actors'
import { icons } from '@myavenceo/aven-ceo/icons'
import { Evaluator, renderViewToString, type ViewNode } from '@myavenceo/aven-vibes'

const evaluator = new Evaluator()

export async function renderSection(
	view: ViewNode,
	inject: Record<string, string> = {}
): Promise<string> {
	let html = await renderViewToString(
		view,
		{},
		{
			evaluate: (expr, data) => evaluator.evaluate(expr, data),
			icons,
			/* The engine's option is still spelled `units`: upstream renamed the
			   TYPES (ActorDef, ActorRegistry) but not this field. Our registry
			   is `actors`; the key stays whatever the engine asks for. */
			units: actors
		}
	)
	for (const [token, fragment] of Object.entries(inject)) {
		if (!html.includes(token))
			throw new Error(`[vibes] section render: injection token ${token} not found in the view`)
		html = html.replaceAll(token, fragment)
	}
	const leftover = html.match(/@@[a-z0-9-]+@@/i)
	if (leftover) throw new Error(`[vibes] section render: unfilled token ${leftover[0]}`)
	return html
}
