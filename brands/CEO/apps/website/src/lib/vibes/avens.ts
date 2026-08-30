/**
 * THE AVENS REGISTRY PAGE, AS CONFIGURATION.
 *
 * Every band is a build-time fact — the live Avens, their profiles, their
 * generated beam avatars — so the whole page above the CTA renders from
 * ViewDefs at build. The avatars and the intro copy go through the
 * `@@token@@` seam (`render.ts`): generated SVG has no place in a view (the
 * icon registry is the one door for SVG, and it holds validated glyphs, not
 * per-name art), and HTML-bearing copy must not be escaped like view text.
 *
 * The avatar wrappers wore `[&>svg]:block [&>svg]:size-full` — arbitrary
 * variants whose `>` does not survive the engine's attribute sanitiser — so
 * those two declarations live as an id-scoped rule in Avens.svelte, on the
 * section ids this file emits.
 *
 * Prose lives in block comments only — the utility scanner reads line
 * comments, and one apostrophe in one silently swallows the class
 * candidates (see footer.ts).
 */
import type { ViewNode } from '@myavenceo/aven-vibes'
import { avensOfKind, type LiveAven } from '$lib/avens'
import { beamAvatarSvg, paletteFromCommaString } from '$lib/beam-avatar'
import { type Lang, pick } from '$lib/i18n'
import { avens } from '$lib/i18n/avens'
import { renderSection } from '$lib/vibes/render'

type Messages = (typeof avens)['de']

const paletteCompany = paletteFromCommaString('e8c9a8,d4a574,c9a962,305669,222e49')
const palettePerson = paletteFromCommaString('f7ead9,ccc7a8,88b499,305669,222e49')

/** The handle is the address — the whole point of a registry. */
function handle(a: LiveAven) {
	return `${a.slug}.aven.ceo`
}

/** An inline space where Svelte collapsed a line break between elements. */
const SPACE: ViewNode = { tag: 'span', text: ' ' }

const OUTLINK_CLASS =
	'font-medium text-foreground-quiet underline decoration-foreground/25 underline-offset-4 transition-colors hover:decoration-foreground/60'

function heroView(t: Messages): ViewNode {
	return {
		tag: 'section',
		class: 'border-b border-border/25 px-5 py-20 sm:px-8 sm:py-28',
		children: [
			{
				tag: 'div',
				class: 'mx-auto max-w-3xl text-center',
				children: [
					{ tag: 'p', class: 'eyebrow', text: t.eyebrow },
					{
						tag: 'h1',
						class:
							'mt-4 text-[length:var(--fs-amount)] font-semibold tracking-[var(--tracking-tight)] text-pretty leading-snug text-foreground sm:text-3xl md:text-[length:var(--fs-display-lg)] md:leading-[1.15]',
						text: t.heading
					},
					{
						tag: 'p',
						class:
							'mx-auto mt-6 max-w-2xl text-[length:var(--fs-title)] leading-relaxed text-foreground-quiet sm:text-base',
						text: '@@avens-intro@@'
					}
				]
			}
		]
	}
}

/** One company card: avatar, name, kind badge, the handle, then — when a
 * profile exists — vision left (2/3), who-and-where right (1/3). */
function companyCard(a: LiveAven, t: Messages): ViewNode {
	const profile = t.companies[a.slug]
	return {
		tag: 'article',
		class:
			'flex min-w-0 flex-col rounded-lg border border-foreground/8 bg-surface-raised p-6 shadow-[var(--shadow-raised)]',
		children: [
			{
				tag: 'div',
				class: 'flex items-start gap-4',
				children: [
					{
						tag: 'div',
						class: 'size-14 shrink-0 overflow-hidden rounded-full ring-2 ring-surface-page',
						attrs: { 'aria-hidden': 'true' },
						text: `@@aven-avatar-${a.slug}@@`
					},
					{
						tag: 'div',
						class: 'min-w-0 flex-1',
						children: [
							{
								tag: 'div',
								class: 'flex flex-wrap items-baseline justify-between gap-2',
								children: [
									{
										tag: 'p',
										class: 'text-xl font-semibold tracking-tight text-foreground',
										text: a.name
									},
									{
										tag: 'span',
										class:
											'rounded-full bg-accent/15 px-2.5 py-0.5 text-[length:var(--fs-micro)] font-bold uppercase tracking-[var(--tracking-wider)] text-accent-ink',
										text: t.kind.company
									}
								]
							},
							{
								tag: 'p',
								class: 'mt-0.5 text-[length:var(--fs-body)] text-foreground-quiet',
								children: [
									{ tag: 'span', class: 'font-medium text-foreground-soft', text: a.slug },
									{ tag: 'span', text: '.aven.ceo' }
								]
							}
						]
					}
				]
			},
			...(profile
				? [
						{
							tag: 'div',
							class: 'mt-5 grid gap-4 border-t border-border/25 pt-4 lg:grid-cols-3 lg:gap-6',
							children: [
								{
									tag: 'div',
									class: 'lg:col-span-2',
									children: [
										{ tag: 'p', class: 'eyebrow', text: t.mission },
										{
											tag: 'p',
											class:
												'mt-2 text-[length:var(--fs-section)] leading-snug text-foreground-soft',
											text: profile.mission
										}
									]
								},
								{
									tag: 'div',
									class:
										'text-[length:var(--fs-meta)] leading-snug text-foreground-quiet lg:border-l lg:border-border/25 lg:pl-5',
									children: [
										{
											tag: 'p',
											text: t.behind,
											children: [
												{
													tag: 'span',
													class: 'block font-medium text-foreground-soft',
													text: a.holder
												}
											]
										},
										...(a.link
											? [
													{
														tag: 'p',
														class: 'mt-2',
														children: [
															{
																tag: 'a',
																class: OUTLINK_CLASS,
																attrs: {
																	href: a.link.href,
																	target: '_blank',
																	rel: 'noopener noreferrer'
																},
																text: `${a.link.label} ↗`
															}
														]
													} satisfies ViewNode
												]
											: [])
									]
								}
							]
						} satisfies ViewNode
					]
				: [])
		]
	}
}

/** Company Aven: what the company is FOR, and what it runs. */
function companiesView(t: Messages, companies: LiveAven[]): ViewNode {
	return {
		tag: 'section',
		class: 'border-b border-border/25 px-5 py-12 sm:px-8 sm:py-14',
		attrs: { id: 'avens-companies' },
		children: [
			{
				tag: 'div',
				class: 'mx-auto max-w-6xl',
				children: [
					{
						tag: 'header',
						class: 'max-w-2xl',
						children: [
							{ tag: 'p', class: 'eyebrow', text: t.company.label },
							{
								tag: 'p',
								class: 'mt-2 text-[length:var(--fs-title)] leading-snug text-foreground-quiet',
								text: t.company.lead
							}
						]
					},
					{
						tag: 'div',
						class: 'mt-6 grid gap-4 lg:grid-cols-2',
						children: companies.map((a) => companyCard(a, t))
					}
				]
			}
		]
	}
}

/** One registry line. A personal Aven is private — the line says who stands
 * behind it and, once onboarding frees them, a link and a sentence. */
function personRow(a: LiveAven, t: Messages): ViewNode {
	const bio = t.bios[a.slug]
	return {
		tag: 'li',
		class: 'flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4',
		children: [
			{
				tag: 'div',
				class: 'size-10 shrink-0 overflow-hidden rounded-full ring-2 ring-surface-page',
				attrs: { 'aria-hidden': 'true' },
				text: `@@aven-avatar-${a.slug}@@`
			},
			{
				tag: 'div',
				class: 'min-w-0 flex-1',
				children: [
					{
						tag: 'p',
						class: 'text-[length:var(--fs-title)] font-semibold tracking-tight text-foreground',
						text: a.name
					},
					{
						tag: 'p',
						class: 'text-[length:var(--fs-meta)] text-foreground-quiet',
						text: handle(a)
					},
					...(bio || a.link
						? [
								{
									tag: 'p',
									class:
										'mt-1 max-w-xl text-[length:var(--fs-meta)] leading-snug text-foreground-quiet',
									children: [
										...(bio ? [{ tag: 'span', text: bio } satisfies ViewNode, SPACE] : []),
										...(a.link
											? [
													{
														tag: 'a',
														class: OUTLINK_CLASS,
														attrs: {
															href: a.link.href,
															target: '_blank',
															rel: 'noopener noreferrer'
														},
														text: `${a.link.label} ↗`
													} satisfies ViewNode
												]
											: [])
									]
								} satisfies ViewNode
							]
						: [])
				]
			},
			{
				tag: 'p',
				class: 'ml-auto text-right text-[length:var(--fs-meta)] leading-snug text-foreground-quiet',
				children: [
					{ tag: 'span', text: `${t.behind} ` },
					{ tag: 'span', class: 'font-medium text-foreground-soft', text: a.holder },
					...(a.worksOn
						? [
								{
									tag: 'span',
									class: 'block text-foreground-quiet',
									text: `${t.worksOn} ${a.worksOn}`
								} satisfies ViewNode
							]
						: [])
				]
			}
		]
	}
}

/** Personal Aven: a registry line, nothing more. A personal Aven is private. */
function peopleView(t: Messages, people: LiveAven[]): ViewNode {
	return {
		tag: 'section',
		class: 'border-b border-border/25 px-5 py-12 sm:px-8 sm:py-14',
		attrs: { id: 'avens-people' },
		children: [
			{
				tag: 'div',
				class: 'mx-auto max-w-6xl',
				children: [
					{
						tag: 'header',
						class: 'max-w-2xl',
						children: [
							{ tag: 'p', class: 'eyebrow', text: t.person.label },
							{
								tag: 'p',
								class: 'mt-2 text-[length:var(--fs-title)] leading-snug text-foreground-quiet',
								text: t.person.lead
							},
							{
								tag: 'p',
								class: 'mt-1 text-[length:var(--fs-meta)] leading-snug text-foreground-quiet',
								text: t.activationNote
							}
						]
					},
					{
						tag: 'ul',
						class:
							'mt-6 divide-y divide-border/25 overflow-hidden rounded-lg border border-foreground/8 bg-surface-raised',
						children: people.map((a) => personRow(a, t))
					}
				]
			}
		]
	}
}

function ctaHeadView(t: Messages): ViewNode {
	return {
		tag: 'p',
		class: 'mb-4 text-center text-[length:var(--fs-title)] font-medium text-foreground-soft',
		text: t.cta
	}
}

export type AvensSections = {
	hero: string
	companies: string
	people: string
	ctaHead: string
}

export async function renderAvensSections(lang: Lang): Promise<AvensSections> {
	const t = pick(avens, lang)
	const companies = avensOfKind('company')
	const people = avensOfKind('person')
	const companyAvatars = Object.fromEntries(
		companies.map((a) => [
			`@@aven-avatar-${a.slug}@@`,
			beamAvatarSvg(a.name, paletteCompany, 56, `aven-${a.slug}`)
		])
	)
	const personAvatars = Object.fromEntries(
		people.map((a) => [
			`@@aven-avatar-${a.slug}@@`,
			beamAvatarSvg(a.name, palettePerson, 40, `aven-${a.slug}`)
		])
	)
	return {
		hero: await renderSection(heroView(t), { '@@avens-intro@@': t.introHtml }),
		companies: await renderSection(companiesView(t, companies), companyAvatars),
		people: await renderSection(peopleView(t, people), personAvatars),
		ctaHead: await renderSection(ctaHeadView(t))
	}
}
