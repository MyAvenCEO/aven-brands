/**
 * THE BAR'S SOCIAL ROW, as configuration.
 *
 * It was the site's last `renderIcon` call site. `SocialIcon.svelte` existed
 * for one reason — a Svelte template cannot write an `<svg>` it does not have
 * the geometry for, so a component wrapped the engine's `renderIcon` and
 * `{@html}`-ed the result. Nineteen lines of adapter around one function call,
 * on one surface.
 *
 * A ViewDef needs no adapter: `$icon` IS the engine's door onto the same brand
 * registry, and the footer and the menu island have gone through it since they
 * were migrated. So the row becomes a view, rendered to HTML once per language
 * at build by the layout's server load, and the header places the string.
 *
 * The menu carries the same profiles at the same size (`nav-menu-social`, in
 * `menu-island.ts`): below 62rem the bar hides this row for room and the menu
 * is the only social surface there is. Two placements of one brand composite,
 * not two ideas about what the row is.
 *
 * Prose lives in block comments only — the utility scanner reads line comments
 * and one apostrophe in one swallows the class candidates (see footer.ts).
 */
import { SOCIAL_PROFILES } from '@myavenceo/aven-ceo/icons'
import type { ViewNode } from '@myavenceo/aven-vibes'
import { type Lang, pick } from '$lib/i18n'
import { common } from '$lib/i18n/common'
import { renderSection } from '$lib/vibes/render'

function socialRowView(lang: Lang): ViewNode {
	const t = pick(common, lang)
	return {
		tag: 'span',
		class: 'social-row social-row--density-tight',
		attrs: { role: 'group', 'aria-label': t.footer.socialLabel },
		children: [
			{
				tag: 'span',
				class: 'social-row-items',
				children: SOCIAL_PROFILES.map(
					(profile): ViewNode => ({
						tag: 'a',
						class: 'social-row-item',
						attrs: {
							href: profile.href,
							target: '_blank',
							rel: 'noopener noreferrer',
							'aria-label': profile.name
						},
						$icon: { name: profile.icon, size: '1.125rem' }
					})
				)
			}
		]
	}
}

/* Rendered once per language per build — the row does not vary by page. */
const cache = new Map<Lang, Promise<string>>()

export function socialRowHtml(lang: Lang): Promise<string> {
	let html = cache.get(lang)
	if (!html) {
		html = renderSection(socialRowView(lang))
		cache.set(lang, html)
	}
	return html
}
