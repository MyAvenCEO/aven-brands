/**
 * THE MARKETPLACE PAGE'S STATIC SECTIONS, AS CONFIGURATION.
 *
 * Three of the page's five bands are build-time facts and render here as
 * ViewDefs: the hero, the chain visualization, and the bundled-pricing band.
 * The marketplace itself is NOT here, deliberately: which plans and skills
 * are visible depends on the `?plan=` query string, which only exists in the
 * reader's browser — a genuinely dynamic section on a prerendered site, so
 * it stays Svelte in the page. The CTA band hosts AvenIdCheckCta and stays
 * with it.
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
import { skills as messages } from '$lib/i18n/skills'
import { loadSkills, skillDetailHref } from '$lib/skills/loader'
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

export type SkillsSections = {
	hero: string
	chain: string
	bundle: string
	/* Every marketplace card, rendered at build and keyed by slug. Which cards
	   the page SHOWS still depends on the query string; what a card IS does
	   not, so the markup is a build fact and costs the reader no component. */
	cards: Record<string, string>
}

export async function renderSkillsSections(lang: Lang): Promise<SkillsSections> {
	const t = pick(messages, lang).marketplace
	const all = loadSkills(lang)
	const cards: Record<string, string> = {}
	for (const skill of all) {
		cards[skill.slug] = await renderSection(skillCardView(skill, lang))
	}
	return {
		hero: await renderSection(heroView(t), {
			'@@skills-hero-paragraph@@': t.hero.paragraphHtml
		}),
		chain: await renderSection(chainView(t, lang)),
		bundle: await renderSection(bundleView(t, lang, all.length)),
		cards
	}
}
