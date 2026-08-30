/**
 * THE MENU ISLAND — the site's first surface rendered and driven purely by
 * avenVIBES configuration.
 *
 * One bundle describes the hamburger toggle and the full-screen menu: a
 * ViewDef, a one-key state (`open`), and the root actor's inbox contract
 * (`set-open`). The SAME bundle is used twice, and that identity is the whole
 * architecture:
 *
 *   build    `+layout.server.ts` renders it to HTML with `renderViewToString`,
 *            so the markup — hamburger, destinations, metas, language switch —
 *            is IN THE PRERENDERED FILE, `aria-expanded="false"` and all,
 *            before any JavaScript exists.
 *   client   `MarketingSiteHeader` hydrates that exact markup with `Island`:
 *            the hydrator re-walks this same definition, computes the same
 *            `data-aven-path` for every node, and attaches the `$on`
 *            listeners. Nothing is re-rendered at hydration.
 *
 * A click on the toggle becomes `{ send: 'set-open', payload: { open: true } }`
 * to the root actor `menu`; the DECLARATIVE inbox merges the payload into
 * state — no sandbox, no handler code anywhere — and the island re-renders its
 * subtree in place: `data-open` flips, `aria-expanded` flips, CSS does the
 * rest. The behaviour of the menu is, in total, the `accepts` line below.
 *
 * Everything except `open` is BAKED at build time. Destinations, metas, hrefs
 * and labels are functions of (lang, active, pathname), which the server knows
 * per page — so they are literal text in the view, not state, and the client
 * bundle carries no i18n machinery. The bundle travels to the client through
 * `page.data`, which guarantees build and client hold byte-identical
 * definitions; a drifted pair would hydrate zero listeners, and the header
 * treats that as an error worth logging.
 *
 * The view writes the unit classes (`nav-menu-*`, `navbar-toggle`) explicitly
 * rather than `$use`-ing the nav-menu unit, for one honest reason: the unit's
 * close button lives INSIDE its view, and a placement cannot yet attach `$on`
 * to a unit's internal nodes — event wiring at placement is engine work that
 * has not been designed. The classes are the same contract the stylesheet
 * compiles either way; when placement-level wiring lands, this file shrinks
 * to a `$use`.
 */
import { SOCIAL_PROFILES } from '@myavenceo/aven-ceo/icons'
import type { Vibe, ViewNode } from '@myavenceo/aven-vibes'
import { type Lang, localeHref, pick, switchLangHref } from '$lib/i18n'
import { common } from '$lib/i18n/common'

export type MenuIslandInput = {
	lang: Lang
	pathname: string
	active: 'skills' | 'avens' | 'pricing' | 'docs' | null
}

/** The serializable half of a Vibe — an island carries no style. */
export type MenuBundle = Omit<Vibe, 'style'>

const open = { send: 'set-open', to: 'menu', payload: { open: true } }
const close = { send: 'set-open', to: 'menu', payload: { open: false } }

export function buildMenuBundle({ lang, pathname, active }: MenuIslandInput): MenuBundle {
	const t = pick(common, lang)
	const otherHref = switchLangHref(lang, pathname)
	const langHref = (l: Lang) => (lang === l ? pathname : otherHref)

	const items = [
		{ href: localeHref(lang, '/skills'), label: t.nav.skills, meta: t.nav.skillsMeta, key: 'skills' },
		{ href: localeHref(lang, '/avens'), label: t.nav.avens, meta: t.nav.avensMeta, key: 'avens' },
		{
			href: localeHref(lang, '/pricing'),
			label: t.nav.pricing,
			meta: t.nav.pricingMeta,
			key: 'pricing'
		},
		/* ceoBRAND is written once, in English — never locale-prefixed. */
		{ href: '/docs/', label: t.nav.docs, meta: t.nav.docsMeta, key: 'docs' }
	]

	const itemNodes: ViewNode[] = items.map((item) => ({
		tag: 'a',
		class: 'nav-menu-item',
		attrs: {
			href: item.href,
			...(active === item.key ? { 'aria-current': 'page' } : {})
		},
		/* Closing on navigation is instant feedback; the navigation itself is a
		   plain href and proceeds regardless. */
		$on: { click: close },
		children: [
			{ tag: 'span', class: 'nav-menu-marker' },
			{ tag: 'span', text: item.label },
			{ tag: 'span', class: 'nav-menu-meta', text: item.meta }
		]
	}))

	const langOption = (l: Lang, label: string): ViewNode => ({
		tag: 'a',
		class: 'segment-option',
		attrs: {
			href: langHref(l),
			hreflang: l,
			...(lang === l ? { 'aria-current': 'true' } : {})
		},
		text: label
	})

	const view: ViewNode = {
		tag: 'span',
		children: [
			{
				tag: 'button',
				class: 'btn btn--ghost btn--shape-circle navbar-toggle',
				attrs: {
					type: 'button',
					'aria-label': t.nav.menu,
					'aria-expanded': '$open',
					'aria-controls': 'site-menu'
				},
				$icon: { name: 'menu', size: '1.25rem' },
				$on: { click: open }
			},
			{
				tag: 'div',
				class: 'nav-menu',
				attrs: { id: 'site-menu', 'data-open': '$open' },
				children: [
					{ tag: 'div', class: 'nav-menu-scrim', attrs: { 'aria-hidden': 'true' }, $on: { click: close } },
					{
						tag: 'button',
						class: 'btn btn--ghost btn--shape-circle nav-menu-close',
						attrs: { type: 'button', 'aria-label': t.nav.closeMenu },
						$icon: { name: 'close', size: '1.25rem' },
						$on: { click: close }
					},
					{
						tag: 'nav',
						class: 'nav-menu-panel',
						attrs: { 'aria-label': t.nav.primaryLabel },
						children: [
							{
								tag: 'div',
								class: 'nav-menu-head',
								children: [
									{
										tag: 'div',
										class: 'nav-menu-crest',
										children: [
											{
												tag: 'img',
												class: 'logo-mark',
												/* The bar's own logo size — the crest opens where the
											   logo was, at the size it was, so the takeover reads as
											   the same chrome transformed rather than a second brand
											   mark two hundred pixels from the first. */
											attrs: { src: '/aven-logo.svg', alt: '', width: '28', height: '28' }
											}
										]
									},
									{ tag: 'p', class: 'text text--eyebrow nav-menu-eyebrow', text: t.nav.whereTo }
								]
							},
							{ tag: 'div', class: 'nav-menu-items', children: itemNodes },
						{
							/* What the collapsed bar sheds, the menu carries: below 62rem
							   the bar hides its social row for room, and on a phone this
							   menu is the only navigation surface there is. Same
							   social-row composite, same profiles, from the brand. */
							tag: 'span',
							class: 'social-row nav-menu-social',
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
						},
							{
								tag: 'div',
								class: 'nav-menu-footer',
								children: [
									{
										tag: 'span',
										class: 'segment',
										attrs: { role: 'group', 'aria-label': t.switchLabel },
										children: [
											{
												tag: 'span',
												class: 'segment-options',
												children: [
													langOption('de', 'DE'),
													{ tag: 'span', class: 'segment-divider', attrs: { 'aria-hidden': 'true' } },
													langOption('en', 'EN')
												]
											}
										]
									},
									{ tag: 'p', class: 'nav-menu-trust', text: t.nav.trust }
								]
							}
						]
					}
				]
			}
		]
	}

	return {
		view,
		state: { open: false },
		name: 'menu',
		accepts: { 'set-open': { open: 'boolean' } }
	}
}
