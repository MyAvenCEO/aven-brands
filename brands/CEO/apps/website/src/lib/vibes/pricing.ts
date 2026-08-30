/**
 * THE PRICING PAGE'S PLAN SECTION, AS CONFIGURATION.
 *
 * One ViewDef: the header, the avenCEO card — name, role, pitch, the
 * sovereignty note, the included list, the skills column, the buy box —
 * rendered to HTML at build by the route's server load. Everything on it is
 * a build-time fact (plans, skills, copy), so nothing hydrates and the
 * section ships zero JavaScript. The CTA band below it hosts
 * `AvenIdCheckCta`, real network logic, and stays Svelte in the page.
 *
 * Two mechanical notes for the next reader:
 *
 * - Svelte left a collapsible space wherever two inline elements met across
 *   a line break; a ViewDef has no text between children, so a spacer node
 *   ({ tag: 'span', text: ' ' }) stands where those spaces were. Without it
 *   the skill label, the soon badge and the gloss run together.
 * - Prose lives in block comments ONLY. The utility scanner reads line
 *   comments as source, and one apostrophe in one re-aligns every string
 *   boundary in the file — silently dropping the class candidates it should
 *   have generated. The footer found that the hard way.
 */
import type { ViewNode } from '@myavenceo/aven-vibes'
import { type Lang, localeHref, pick } from '$lib/i18n'
import { localizedPlan, priceSuffix } from '$lib/i18n/plans'
import { pricing } from '$lib/i18n/pricing'
import { euro, type Plan, type PlanFeature, type PlanId, plan } from '$lib/pricing/plans'
import { loadSkill, skillDetailHref, skillLabel, skillsIncludedIn } from '$lib/skills/loader'
import { renderSection } from '$lib/vibes/render'

/** A card shows at most this many skills; the rest sit behind "see all". */
const SKILL_CAP = 7

type SkillFeature = PlanFeature & { skill: string }

type Messages = (typeof pricing)['de']

/** An inline space where Svelte collapsed a line break between elements. */
const SPACE: ViewNode = { tag: 'span', text: ' ' }

/**
 * The skills a plan carries, live ones first: its own, plus — along the
 * skill cascade — everything from the plans it includes.
 */
function skillFeatures(p: Plan, lang: Lang): SkillFeature[] {
	const cascade: PlanId[] = p.id === 'aven-coop' ? ['aven-ceo'] : []
	return [...p.features, ...cascade.flatMap((id) => localizedPlan(plan(id), lang).features)]
		.filter((f): f is SkillFeature => typeof f.skill === 'string')
		.sort(
			(a, b) =>
				Number(loadSkill(a.skill, lang)?.comingSoon ?? false) -
				Number(loadSkill(b.skill, lang)?.comingSoon ?? false)
		)
}

/**
 * What the plan costs, in ONE panel: the monthly price and its suffix.
 * Container queries, not viewport ones — the panel has to split or stack by
 * its OWN width.
 */
function pricePanel(p: Plan, lang: Lang): ViewNode {
	return {
		tag: 'div',
		class: 'rounded-lg border border-border/25 bg-surface-card px-5 py-5',
		children: [
			{
				tag: 'p',
				class: 'flex flex-wrap items-baseline justify-center gap-x-2',
				children: [
					{
						tag: 'span',
						class: 'text-3xl font-semibold tabular-nums tracking-tight text-foreground',
						text: `${euro(p.eurPrice)} €`
					},
					{
						tag: 'span',
						class: 'text-[length:var(--fs-meta)] font-medium text-foreground-quiet',
						text: priceSuffix(p, lang)
					}
				]
			}
		]
	}
}

/** The transformation, before any fact: what changes in your life. This is
 * the one block on a card allowed to be warm. */
function pitchLine(p: Plan): ViewNode {
	return {
		tag: 'p',
		class:
			'mx-auto mt-4 max-w-md text-center text-[length:var(--fs-body)] leading-relaxed text-foreground-quiet italic',
		text: p.pitch
	}
}

/** Skills on a card are pointers, not blurbs: the skill name, and its short
 * title as a 3-5 word gloss. The full sentence lives on the skill's page. */
function skillList(items: SkillFeature[], lang: Lang, t: Messages): ViewNode {
	return {
		tag: 'ul',
		class: 'mt-2 space-y-1.5 text-[length:var(--fs-body)] leading-snug',
		children: items.slice(0, SKILL_CAP).map((feature): ViewNode => {
			const soon = loadSkill(feature.skill, lang)?.comingSoon
			return {
				tag: 'li',
				...(soon ? { class: 'opacity-70' } : {}),
				children: [
					{
						tag: 'a',
						class: `font-medium underline underline-offset-4 transition-colors ${
							soon
								? 'text-quiet-ink decoration-dashed decoration-quiet/40 hover:decoration-quiet/70'
								: 'text-foreground decoration-foreground/25 hover:decoration-foreground/60'
						}`,
						attrs: { href: skillDetailHref(feature.skill, lang) },
						text: skillLabel(feature.skill)
					},
					...(soon
						? [
								SPACE,
								{
									tag: 'span',
									class:
										'ml-1 rounded-full border border-quiet/25 bg-quiet/15 px-1.5 py-0.5 text-[length:var(--fs-nano)] font-semibold uppercase tracking-[var(--tracking-wide)] text-quiet-ink',
									text: t.soon
								} satisfies ViewNode
							]
						: []),
					SPACE,
					{ tag: 'span', class: 'text-foreground-quiet', text: `· ${feature.title}` }
				]
			}
		})
	}
}

/** One bullet of the included list: the accent dot, then the fact. */
function includedItem(content: ViewNode): ViewNode {
	return {
		tag: 'li',
		class: 'flex gap-2',
		children: [
			{
				tag: 'span',
				class: 'mt-1.5 size-1.5 shrink-0 rounded-full bg-accent',
				attrs: { 'aria-hidden': 'true' }
			},
			content
		]
	}
}

/**
 * avenCEO: the one pricing tier — full width, and read top to bottom. A
 * centred header, then the pitch, then a divider and two columns: what is
 * included on the left (daily runtime, the feature titles), the skills you
 * can go read on the right, running the full height. The buy box last: it is
 * invite-only for now, so the button is a status, not a link.
 */
function plansView(lang: Lang): ViewNode {
	const t = pick(pricing, lang)
	const ceo = localizedPlan(plan('aven-ceo'), lang)
	const ceoSkillCount = skillsIncludedIn('aven-ceo', lang).length
	/* avenCEO's non-skill bullets — skills render in their own column. The
	   digital postal addresses are a Deutsche-Post product, so that bullet
	   (and its note below) show for Germany only. */
	const ceoPlain = ceo.features.filter(
		(f) => !f.skill && (lang === 'de' || !/postal/i.test(f.title))
	)

	const includedColumn: ViewNode = {
		tag: 'div',
		children: [
			{ tag: 'p', class: 'eyebrow', text: t.included },
			{
				tag: 'div',
				class: 'mt-3 rounded-lg bg-success/8 px-3 py-2 text-[length:var(--fs-meta)] leading-snug',
				children: [
					{ tag: 'strong', class: 'font-semibold text-success-ink', text: t.sovereignty.lead },
					SPACE,
					{ tag: 'span', class: 'text-foreground-soft', text: t.sovereignty.text }
				]
			},
			{
				tag: 'ul',
				class:
					'mt-3 space-y-2 text-left text-[length:var(--fs-body)] leading-snug text-foreground-soft',
				children: [
					...(ceo.runtime
						? [
								includedItem({
									tag: 'span',
									class: 'font-semibold text-foreground-soft',
									text: t.mindWeekly(ceo.runtime.mindCredits)
								})
							]
						: []),
					...ceoPlain.map((feature) =>
						includedItem(
							feature.href
								? {
										tag: 'a',
										class:
											'font-medium underline decoration-foreground/25 underline-offset-4 transition-colors hover:decoration-foreground/60',
										attrs: { href: feature.href, target: '_blank', rel: 'noopener noreferrer' },
										text: `${feature.title} →`
									}
								: { tag: 'span', class: 'font-medium text-foreground-soft', text: feature.title }
						)
					)
				]
			},
			...(lang === 'de'
				? [
						{
							tag: 'p',
							class: 'mt-4 text-[length:var(--fs-micro)] leading-snug text-foreground-quiet',
							text: t.postForwardNote
						} satisfies ViewNode
					]
				: [])
		]
	}

	const skillsColumn: ViewNode | null =
		ceoSkillCount > 0
			? {
					tag: 'div',
					class: 'text-left sm:border-l sm:border-border/25 sm:pl-10',
					children: [
						{ tag: 'p', class: 'eyebrow', text: t.skills },
						skillList(skillFeatures(ceo, lang), lang, t),
						{
							tag: 'p',
							class: 'mt-2 text-[length:var(--fs-meta)] text-foreground-quiet',
							children: [
								{
									tag: 'a',
									class: 'underline underline-offset-4 hover:text-foreground-soft',
									attrs: { href: `${localeHref(lang, '/skills')}?plan=${ceo.id}` },
									text: t.allSkills(ceoSkillCount)
								}
							]
						}
					]
				}
			: null

	return {
		tag: 'section',
		class: 'scroll-mt-28 border-b border-border/25 px-5 py-14 sm:px-8 sm:py-16',
		attrs: { id: 'pricing-plans' },
		children: [
			{
				tag: 'div',
				class: 'mx-auto max-w-6xl',
				children: [
					{
						tag: 'div',
						class: 'mx-auto max-w-2xl text-center',
						children: [
							{
								tag: 'p',
								class:
									'text-[length:var(--fs-eyebrow)] font-semibold uppercase tracking-[var(--tracking-wider)] text-accent-ink',
								text: t.eyebrow
							},
							{ tag: 'h2', class: 'section-title mt-3 sm:text-3xl', text: t.heading },
							/* The wish first, the three facts after — same order as on the cards. */
							{
								tag: 'p',
								class:
									'mx-auto mt-4 max-w-xl text-[length:var(--fs-title)] leading-relaxed text-foreground-soft',
								text: t.lead
							}
						]
					},
					{
						tag: 'div',
						class:
							'relative mx-auto mt-12 max-w-3xl scroll-mt-28 rounded-lg border-2 border-accent/25 bg-surface-raised p-6 pt-9 shadow-[var(--shadow-raised)] sm:p-10',
						attrs: { id: ceo.id },
						children: [
							/* No `uppercase`: the brand is spelled avenCEO, not AVENCEO. */
							{
								tag: 'p',
								class: 'text-center text-2xl font-semibold tracking-tight text-foreground',
								text: ceo.name
							},
							{
								tag: 'p',
								class:
									'mt-1 text-center text-[length:var(--fs-meta)] leading-snug text-foreground-quiet',
								text: ceo.role
							},
							pitchLine(ceo),
							{
								tag: 'div',
								class:
									'mx-auto mt-8 grid max-w-3xl items-stretch gap-8 border-t border-border/25 pt-7 sm:grid-cols-2 sm:gap-10',
								children: [includedColumn, ...(skillsColumn ? [skillsColumn] : [])]
							},
							{
								tag: 'div',
								class: 'mt-8 border-t border-border/25 pt-7',
								children: [
									pricePanel(ceo, lang),
									{
										tag: 'button',
										class:
											'mt-4 inline-flex min-h-11 w-full cursor-default items-center justify-center rounded-full bg-muted px-10 text-[length:var(--fs-body)] font-semibold text-foreground-soft',
										attrs: { type: 'button', disabled: '' },
										text: t.comingSoon
									}
								]
							}
						]
					}
				]
			}
		]
	}
}

export type PricingSections = { plans: string }

export async function renderPricingSections(lang: Lang): Promise<PricingSections> {
	return { plans: await renderSection(plansView(lang)) }
}
