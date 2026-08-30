/**
 * THE MARKETPLACE PAGE'S SECTIONS, AS CONFIGURATION.
 *
 * Hero, marketplace, chain visualization and bundled-pricing band are all
 * build-time facts and render here as ViewDefs. The CTA band keeps the one
 * component with a real form in it.
 *
 * THE MARKETPLACE WAS THE HARD ONE, and the previous pass left it in Svelte
 * because which skills are visible depends on `?plan=`, a query string that
 * only exists in the reader's browser. That reasoning had one hole in it: a
 * query string has FINITELY MANY answers here — one per plan we sell — and
 * the build knows all of them. So the band renders once per selection, at
 * build, and the browser's only job is to pick a key.
 *
 * What that buys is not elegance, it is weight. The Svelte band read
 * `loadSkills` and `loadSkillsByPlan` reactively, so every skill document in
 * BOTH languages travelled to the reader to render thirteen cards that never
 * change. Now the cards are HTML in the prerendered file and the page ships
 * none of it.
 *
 * The selections are computed with `planIncludes`, the same predicate the
 * pricing page and the id service ask, so a plan that starts carrying its own
 * skills changes this band by changing that data — not by anyone editing a
 * list here. An unknown or absent `?plan=` falls back to the same default the
 * build renders into the page, which is why the fallback path costs nothing.
 *
 * The hero's subheading used to clamp against `3.85vw` — the window, not the
 * section. It now clamps against the section's own container (`cqi`), which
 * the id rule in Skills.svelte declares; the clamp's floor and ceiling are
 * unchanged, and at every width where the middle term ruled, the section IS
 * the window's width.
 *
 * Prose lives in block comments only — the utility scanner reads line
 * comments, and one apostrophe in one silently swallows the class
 * candidates (see footer.ts).
 */
import type { ViewNode } from '@myavenceo/aven-vibes'
import { type Lang, localeHref, pick } from '$lib/i18n'
import { localizedPlan, priceLabel } from '$lib/i18n/plans'
import { skills as messages } from '$lib/i18n/skills'
import { PLANS, type PlanId, planIncludes } from '$lib/pricing/plans'
import { loadSkills, loadSkillsByPlan, skillDetailHref } from '$lib/skills/loader'
import { renderSection } from '$lib/vibes/render'
import { skillCardView } from '$lib/vibes/skill-card'

type Messages = (typeof messages)['de']['marketplace']

function heroView(t: Messages): ViewNode {
	return {
		tag: 'section',
		class: 'border-b border-border/25 px-5 py-24 sm:px-8 sm:py-32 md:py-40',
		attrs: { id: 'skills-hero' },
		children: [
			{
				tag: 'div',
				class: 'mx-auto max-w-3xl text-center',
				children: [
					{ tag: 'p', class: 'eyebrow', text: t.hero.eyebrow },
					{
						tag: 'h1',
						class:
							'mt-4 text-[length:var(--fs-amount)] font-semibold tracking-[var(--tracking-tight)] text-pretty leading-snug text-foreground sm:text-3xl md:text-[length:var(--fs-display-lg)] md:leading-[1.15]',
						text: t.hero.heading,
						children: [
							{
								tag: 'span',
								class:
									'mt-2 block text-[clamp(1.25rem,3.85cqi,2.05rem)] font-light leading-[1.08] tracking-tight text-foreground-soft',
								text: t.hero.subheading
							}
						]
					},
					{
						tag: 'p',
						class:
							'mx-auto mt-8 max-w-2xl text-[length:var(--fs-title)] leading-relaxed text-foreground-quiet sm:text-base',
						text: '@@skills-hero-paragraph@@'
					}
				]
			}
		]
	}
}

/** The chain: each step a card, an arrow between them, and the HITL layer
 * below — the one place every skill delegates to when judgement is needed. */
function chainView(t: Messages, lang: Lang): ViewNode {
	const steps = t.chain.steps
	const stepNodes: ViewNode[] = []
	steps.forEach((step, i) => {
		stepNodes.push({
			tag: 'a',
			class:
				'group flex min-w-0 flex-col items-center rounded-xl border border-border/25 bg-surface-raised px-4 py-4 text-center transition-colors hover:border-border/25 hover:bg-surface-sunken sm:w-36',
			attrs: { href: skillDetailHref(step.slug, lang) },
			children: [
				{
					tag: 'p',
					class:
						'text-[length:var(--fs-micro)] font-bold tracking-[var(--tracking-wide)] text-foreground-quiet group-hover:text-foreground-soft',
					text: step.label
				},
				{
					tag: 'p',
					class: 'mt-1 text-[length:var(--fs-eyebrow)] leading-snug text-foreground-quiet',
					text: step.description
				}
			]
		})
		if (i < steps.length - 1) {
			stepNodes.push({
				tag: 'div',
				class: 'flex items-center justify-center text-foreground-quiet sm:self-center',
				attrs: { 'aria-hidden': 'true' },
				children: [{ tag: 'span', class: 'text-lg sm:text-xl', text: '→' }]
			})
		}
	})

	return {
		tag: 'section',
		class:
			'border-b border-border/25 bg-gradient-to-b from-transparent via-white/15 to-transparent px-5 py-14 sm:px-8 sm:py-20',
		children: [
			{
				tag: 'div',
				class: 'mx-auto max-w-4xl',
				children: [
					{
						tag: 'div',
						class: 'text-center',
						children: [
							{ tag: 'p', class: 'eyebrow', text: t.chain.eyebrow },
							{ tag: 'h2', class: 'section-title mt-3 sm:text-3xl', text: t.chain.heading },
							{
								tag: 'p',
								class:
									'mx-auto mt-4 max-w-xl text-[length:var(--fs-title)] leading-snug text-foreground-quiet',
								text: t.chain.paragraph
							}
						]
					},
					{
						tag: 'div',
						class:
							'mt-10 flex flex-col items-center gap-2 sm:flex-row sm:items-stretch sm:justify-center',
						children: stepNodes
					},
					{
						tag: 'div',
						class:
							'mx-auto mt-6 max-w-sm rounded-xl border border-accent/25 bg-accent/8 px-4 py-3 text-center ring-1 ring-accent/15',
						children: [
							{ tag: 'p', class: 'eyebrow', text: t.chain.hitlLabel },
							{
								tag: 'a',
								class:
									'mt-1 block text-[length:var(--fs-meta)] font-bold tracking-[var(--tracking-wide)] text-foreground-soft hover:text-foreground-soft',
								attrs: { href: skillDetailHref('human-reviewer', lang) },
								text: 'human-reviewer'
							},
							{
								tag: 'p',
								class: 'mt-1 text-[length:var(--fs-eyebrow)] text-foreground-quiet',
								text: t.chain.hitlNote
							}
						]
					}
				]
			}
		]
	}
}

function bundleView(t: Messages, lang: Lang, skillCount: number): ViewNode {
	return {
		tag: 'section',
		class: 'border-b border-border/25 px-5 py-12 sm:px-8 sm:py-14',
		children: [
			{
				tag: 'div',
				class: 'mx-auto max-w-3xl text-center',
				children: [
					{ tag: 'p', class: 'eyebrow', text: t.pricing.eyebrow },
					{
						tag: 'h2',
						class: 'mt-3 text-xl font-semibold tracking-tight text-foreground sm:text-2xl',
						text: t.pricing.heading(skillCount)
					},
					{
						tag: 'p',
						class:
							'mx-auto mt-4 max-w-xl text-[length:var(--fs-title)] leading-snug text-foreground-quiet',
						text: t.pricing.paragraph
					},
					{
						tag: 'div',
						class: 'mt-6',
						children: [
							{
								tag: 'a',
								class:
									'inline-flex min-h-11 items-center justify-center rounded-full border border-border/25 bg-surface-raised px-7 text-[length:var(--fs-body)] font-semibold text-foreground transition-colors hover:bg-surface-sunken',
								attrs: { href: localeHref(lang, '/pricing') },
								text: t.pricing.cta
							}
						]
					}
				]
			}
		]
	}
}

/**
 * The marketplace, for ONE selection.
 *
 * The plan a reader arrives with decides which groups are on the page, and
 * `planIncludes` decides that: avenCEO ships every life- and company-skill,
 * avenCOOP carries everything avenCEO does, avenNAME carries none. A group
 * with no skills in it is not a heading over nothing, it is absent — which is
 * how a selection can end up with nothing to show and fall to the empty state.
 */
function marketplaceView(t: Messages, lang: Lang, selected: PlanId): ViewNode {
	const groups = loadSkillsByPlan(lang).filter(
		(g) => planIncludes(selected, g.plan.id) && g.skills.length > 0
	)
	const visibleCount = groups.reduce((n, g) => n + g.skills.length, 0)
	const ownCount = groups.find((g) => g.plan.id === selected)?.skills.length ?? 0
	const selectedPlan = PLANS.find((p) => p.id === selected) ?? PLANS[0]

	const body: ViewNode[] = []

	/* The inclusion line only earns its space when the selection actually
	   inherits from a plan beneath it — one group is its own story. */
	if (groups.length > 1) {
		body.push({
			tag: 'p',
			class:
				'rounded-xl border border-accent/25 bg-accent/8 px-4 py-3 text-[length:var(--fs-body)] leading-snug text-foreground-soft',
			text: t.inclusion(selectedPlan.name, visibleCount, visibleCount - ownCount, ownCount)
		})
	}

	if (groups.length === 0) {
		body.push({
			tag: 'p',
			class:
				'rounded-xl border border-border/25 bg-surface-card px-4 py-6 text-center text-[length:var(--fs-section)] text-foreground-quiet',
			text: t.empty
		})
	}

	for (const group of groups) {
		body.push({
			tag: 'div',
			children: [
				{
					tag: 'div',
					class:
						'mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-border/25 pb-4',
					children: [
						{
							tag: 'div',
							children: [
								{
									tag: 'p',
									class:
										'text-[length:var(--fs-micro)] font-bold uppercase tracking-[var(--tracking-widest)] text-foreground-quiet',
									text: t.group.with(group.plan.name)
								},
								{
									tag: 'h2',
									class: 'mt-1 text-xl font-semibold tracking-tight text-foreground sm:text-2xl',
									text: localizedPlan(group.plan, lang).role
								},
								{
									tag: 'p',
									class: 'mt-1 text-[length:var(--fs-meta)] text-foreground-quiet',
									text: t.group.count(group.skills.length, priceLabel(group.plan, lang))
								}
							]
						},
						{
							tag: 'a',
							class:
								'text-[length:var(--fs-meta)] font-semibold text-foreground-quiet underline underline-offset-4 hover:text-foreground-soft',
							attrs: { href: `${localeHref(lang, '/pricing')}#${group.plan.id}` },
							text: t.group.view(group.plan.name)
						}
					]
				},
				{
					tag: 'div',
					class: 'grid gap-4 md:grid-cols-2',
					children: group.skills.map((skill) => skillCardView(skill, lang))
				}
			]
		})
	}

	return {
		tag: 'section',
		class: 'border-b border-border/25 px-5 py-12 sm:px-8 sm:py-14',
		children: [
			{
				tag: 'div',
				class: 'mx-auto max-w-5xl',
				children: [{ tag: 'div', class: 'space-y-12', children: body }]
			}
		]
	}
}

export type SkillsSections = {
	hero: string
	/* The marketplace band, one rendering per plan a reader can select. The
	   page picks a key; it computes nothing. */
	marketplace: Record<PlanId, string>
	chain: string
	bundle: string
}

export async function renderSkillsSections(lang: Lang): Promise<SkillsSections> {
	const t = pick(messages, lang).marketplace
	const skillCount = loadSkills(lang).length

	/* Selections that render the same band share ONE string, so the page data
	   carries it once however many plans point at it. Today avenCEO and
	   avenCOOP are exactly that case: avenCOOP has no skills of its own yet,
	   so it shows the avenCEO group and nothing more. */
	const byHtml = new Map<string, string>()
	const marketplace = {} as Record<PlanId, string>
	for (const p of PLANS) {
		const html = await renderSection(marketplaceView(t, lang, p.id))
		const shared = byHtml.get(html)
		if (shared === undefined) byHtml.set(html, html)
		marketplace[p.id] = shared ?? html
	}

	return {
		hero: await renderSection(heroView(t), {
			'@@skills-hero-paragraph@@': t.hero.paragraphHtml
		}),
		marketplace,
		chain: await renderSection(chainView(t, lang)),
		bundle: await renderSection(bundleView(t, lang, skillCount))
	}
}
