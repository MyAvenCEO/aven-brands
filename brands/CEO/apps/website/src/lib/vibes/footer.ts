/**
 * THE footer, as configuration — one ViewDef, rendered to HTML at build time
 * and delivered through every page's server load.
 *
 * It carries the two things a German site owes a visitor — the legal pages
 * and a way back into the site. The legal pages are German-only; the English
 * site links to them as they are.
 *
 * Written as the shipped footer's own explicit classes, not a `$use` of the
 * `site-footer` unit, and the reason is honesty about what each one IS. The
 * unit composes brand-above-groups on its own grid and sets its links a step
 * smaller and a tone softer than the footer every page has shipped; adopting
 * it is a REDESIGN decision for whoever owns that call, while this migration's
 * contract is pixel-faithful delivery-as-config. The class algebra is the same
 * either way; when the unit and the shipped footer are reconciled, this view
 * collapses to a `$use site-footer` with three slots.
 *
 * The social glyphs go through `$icon` — the engine's one door for SVG, which
 * opens onto the brand icon registry every surface now reads. Each glyph
 * needs a wrapper node (a `$icon` node renders only its icon), and the
 * wrapper dissolves via `display: contents` in `SiteFooter.svelte` so the
 * `<svg>` stays the flex item it was when Svelte rendered it.
 */
import { legalPath } from '@myavenceo/aven-ceo'
import { SOCIAL_PROFILES } from '@myavenceo/aven-ceo/icons'
import type { ViewNode } from '@myavenceo/aven-vibes'
import { type Lang, langFromPath, localeHref, pick } from '$lib/i18n'
import { common } from '$lib/i18n/common'
import { idFunnelHref } from '$lib/id-service'
import { renderSection } from '$lib/vibes/render'

const LINK_CLASS = 'text-primary-foreground-quiet transition-colors hover:text-primary-foreground'

function footerView(lang: Lang): ViewNode {
	const t = pick(common, lang)

	const legal = [
		/* The impressum follows the reader's language; the rest is German-only for now. */
		{ href: legalPath('impressum', lang), label: t.footer.legal.impressum },
		{ href: legalPath('datenschutz', lang), label: t.footer.legal.datenschutz },
		{ href: legalPath('social-media', lang), label: t.footer.legal.socialMedia },
		{ href: legalPath('widerruf', lang), label: t.footer.legal.widerruf }
		/* AGB/Terms deliberately absent while the page is still a placeholder. */
	]

	const nav = [
		{ href: localeHref(lang, '/skills'), label: t.nav.skills },
		{ href: localeHref(lang, '/avens'), label: t.nav.avens },
		{ href: localeHref(lang, '/pricing'), label: t.nav.pricing },
		{ href: idFunnelHref(), label: t.footer.ctaLabel }
	]

	const linkColumn = (label: string, items: { href: string; label: string }[]): ViewNode => ({
		tag: 'nav',
		class: 'flex flex-col gap-2 text-[length:var(--fs-body)]',
		attrs: { 'aria-label': label },
		children: items.map(
			(item): ViewNode => ({
				tag: 'a',
				class: LINK_CLASS,
				attrs: { href: item.href },
				text: item.label
			})
		)
	})

	return {
		tag: 'footer',
		class: 'bg-primary px-5 py-12 text-primary-foreground sm:px-8',
		children: [
			{
				tag: 'div',
				class: 'mx-auto flex max-w-6xl flex-col gap-8',
				children: [
					{
						tag: 'div',
						class: 'flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between',
						children: [
							{
								tag: 'div',
								children: [
									{
										tag: 'a',
										class: 'flex items-center gap-2.5',
										attrs: { href: localeHref(lang, '/') },
										children: [
											{
												tag: 'img',
												class: 'size-7',
												attrs: { src: '/aven-logo.svg', alt: '', width: '28', height: '28' }
											},
											{
												tag: 'span',
												class: 'text-[length:var(--fs-title)] tracking-tight',
												children: [
													{
														tag: 'span',
														class: 'font-display',
														attrs: { style: 'font-weight: 300; font-size: 1.4em; line-height: 1' },
														text: 'aven'
													},
													{
														tag: 'span',
														class: 'font-sans uppercase',
														attrs: { style: 'font-weight: 700' },
														text: 'CEO'
													}
												]
											}
										]
									},
									{
										tag: 'p',
										class:
											'mt-2 max-w-xs text-[length:var(--fs-meta)] leading-snug text-primary-foreground-quiet',
										text: t.footer.tagline
									}
								]
							},
							linkColumn(t.footer.pagesLabel, nav),
							linkColumn(t.footer.legalLabel, legal),
							{
								tag: 'nav',
								class: 'flex flex-col gap-2 text-[length:var(--fs-body)]',
								attrs: { id: 'site-footer-social', 'aria-label': t.footer.socialLabel },
								children: SOCIAL_PROFILES.map(
									(profile): ViewNode => ({
										tag: 'a',
										class: `flex items-center gap-2 ${LINK_CLASS}`,
										attrs: {
											href: profile.href,
											target: '_blank',
											rel: 'noopener noreferrer'
										},
										children: [
											{ tag: 'span', $icon: { name: profile.icon, size: '1rem' } },
											{ tag: 'span', text: profile.name }
										]
									})
								)
							}
						]
					},

				]
			}
		]
	}
}

/** Rendered once per language per build — the footer does not vary by page. */
const cache = new Map<Lang, Promise<string>>()

export function footerHtml(lang: Lang): Promise<string> {
	let html = cache.get(lang)
	if (!html) {
		html = renderSection(footerView(lang))
		cache.set(lang, html)
	}
	return html
}

/**
 * A ready-made server `load` for routes whose only build-time data is the
 * footer. Routes with sections of their own call `footerHtml` inside theirs.
 * The language is derived from the pathname, the same rule `localeHref`
 * writes: `/de/...` is German, everything else is English.
 */
export async function footerData(pathname: string): Promise<{ footerHtml: string }> {
	return { footerHtml: await footerHtml(langFromPath(pathname)) }
}
