/**
 * A SKILL'S LANDING PAGE, AS CONFIGURATION.
 *
 * Eight sections, every one a build-time function of (skill, lang): the
 * founder scenario, the benefits, the plain-language steps, the honest
 * mechanics, the plays-well-with links, the value stack, bonuses and
 * availability, and the letter from avenCEO. The routes' server loads render
 * them per skill at build; only the CTA (AvenIdCheckCta — real network
 * logic) and the shell stay Svelte.
 *
 * The two beam avatars go through the render seam (generated SVG has no
 * place in a view), and their old [&>svg] utilities live as id-scoped rules
 * in SkillLanding.svelte — the '>' in that arbitrary variant does not
 * survive the engine's attribute sanitiser.
 *
 * Prose lives in block comments only — the utility scanner reads line
 * comments, and one apostrophe in one silently swallows the class
 * candidates (see footer.ts).
 */
import type { ViewNode } from '@myavenceo/aven-vibes'
import { beamAvatarSvg, paletteFromCommaString } from '$lib/beam-avatar'
import { type Lang, localeHref, pick } from '$lib/i18n'
import { skills as messages } from '$lib/i18n/skills'
import { availabilityNote, skillDetailHref, skillLabel } from '$lib/skills/loader'
import type { AvenosSkill } from '$lib/skills/types'
import { renderSection } from '$lib/vibes/render'

type Messages = (typeof messages)['de']['detail']

/**
 * Skills are global — nobody "publishes" them. The one who speaks for them is
 * avenCEO, the Aven of the avenCEO GmbH: the company's own AI-CEO, the single
 * point of contact everyone talks to.
 */
const AVEN = 'avenCEO'
const paletteKi = paletteFromCommaString('e8c9a8,d4a574,c9a962,305669,222e49')

/* 1. WHY — the founder scenario. */
function whyView(skill: AvenosSkill, t: Messages): ViewNode {
	return {
		tag: 'section',
		class: 'border-b border-border/10 px-5 py-24 sm:px-8 sm:py-32 md:py-40',
		children: [
			{
				tag: 'div',
				class: 'mx-auto max-w-3xl text-center',
				children: [
					{ tag: 'p', class: 'eyebrow', text: skill.hero.kicker },
					...(skill.comingSoon
						? [
								{
									tag: 'p',
									class: 'mt-3',
									children: [
										{
											tag: 'span',
											class:
												'inline-flex items-center rounded-full border border-quiet/25 bg-quiet/15 px-3 py-1 text-[length:var(--fs-micro)] font-semibold uppercase tracking-[var(--tracking-wider)] text-quiet-ink',
											text: t.comingSoon
										}
									]
								} satisfies ViewNode
							]
						: []),
					{
						tag: 'h1',
						class:
							'mt-4 text-[length:var(--fs-amount)] font-semibold tracking-[var(--tracking-tight)] text-pretty leading-snug text-foreground sm:text-3xl md:text-[length:var(--fs-display-lg)] md:leading-[1.15]',
						text: skill.hero.headlineMain,
						children: [
							{
								tag: 'span',
								class:
									'mt-3 block font-sans text-[length:var(--fs-title)] font-normal leading-snug tracking-normal text-foreground-quiet sm:text-[length:var(--fs-lead)]',
								text: skill.hero.headlineSerifLead
							}
						]
					},
					{
						tag: 'div',
						class: 'mx-auto mt-8 max-w-xl',
						children: [
							{
								tag: 'div',
								class:
									'rounded-lg border border-border/25 bg-surface-raised px-5 py-5 text-left sm:px-6 sm:py-6',
								children: [
									{
										tag: 'p',
										class: 'eyebrow-quiet',
										text: `${skill.founderScenario.timestamp} ${t.fromRealLife}`
									},
									{
										tag: 'p',
										class:
											'mt-3 text-[length:var(--fs-title)] italic leading-relaxed text-foreground-soft sm:text-[length:var(--fs-title)]',
										text: `"${skill.founderScenario.story}"`
									},
									{
										tag: 'div',
										class: 'mt-4 flex items-center gap-2 border-t border-border/25 pt-3',
										children: [
											{
												tag: 'div',
												class:
													'size-6 shrink-0 overflow-hidden rounded-full ring-1 ring-surface-page',
												attrs: { id: 'skill-scenario-avatar', 'aria-hidden': 'true' },
												text: '@@skill-scenario-avatar@@'
											},
											{
												tag: 'p',
												class:
													'text-[length:var(--fs-nano)] font-bold tracking-[var(--tracking-wider)] text-accent-ink',
												text: t.yourAven
											},
											{
												tag: 'p',
												class: 'text-[length:var(--fs-nano)] text-foreground-quiet',
												text: t.solvesIt
											}
										]
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

/* 2. What you gain — benefits first. */
function gainView(skill: AvenosSkill, t: Messages): ViewNode {
	return {
		tag: 'section',
		class:
			'border-b border-border/10 bg-linear-to-b from-white/15 via-white/8 to-transparent px-5 py-14 sm:px-8 sm:py-20',
		children: [
			{
				tag: 'div',
				class: 'mx-auto max-w-2xl',
				children: [
					{
						tag: 'div',
						class: 'text-center',
						children: [
							{ tag: 'p', class: 'eyebrow', text: t.gainEyebrow },
							{
								tag: 'h2',
								class:
									'mt-3 text-2xl font-semibold tracking-tight text-pretty text-foreground sm:text-3xl',
								text: t.gainHeading(skillLabel(skill.slug))
							},
							{
								tag: 'p',
								class:
									'mx-auto mt-3 max-w-md text-[length:var(--fs-eyebrow)] font-bold uppercase tracking-[var(--tracking-wider)] text-accent-ink',
								text: `${skill.hero.promiseHoursPerWeek} ${t.perWeekBack}`
							}
						]
					},
					{
						tag: 'ul',
						class:
							'mt-8 space-y-3 text-[length:var(--fs-section)] leading-snug text-foreground-soft sm:text-[length:var(--fs-title)]',
						children: skill.benefits.map(
							(benefit): ViewNode => ({
								tag: 'li',
								class: 'flex gap-3',
								children: [
									{
										tag: 'span',
										class: 'mt-1.5 size-2 shrink-0 rounded-full bg-accent',
										attrs: { 'aria-hidden': 'true' }
									},
									{ tag: 'span', text: benefit }
								]
							})
						)
					}
				]
			}
		]
	}
}

/* 3. HOW — plain-language steps. */
function howView(skill: AvenosSkill, t: Messages): ViewNode {
	return {
		tag: 'section',
		class: 'section-band sm:px-8 sm:py-20',
		children: [
			{
				tag: 'div',
				class: 'mx-auto max-w-2xl text-center',
				children: [
					{ tag: 'p', class: 'eyebrow', text: t.howEyebrow },
					{
						tag: 'h2',
						class:
							'mt-3 text-2xl font-semibold tracking-tight text-pretty text-foreground sm:text-3xl',
						text: t.howHeading
					},
					{
						tag: 'ol',
						class: 'mt-10 mx-auto max-w-xl list-none space-y-0 p-0',
						children: skill.howSteps.map(
							(step, i): ViewNode => ({
								tag: 'li',
								class: 'border-b border-border/10 py-6 first:border-t first:border-border/25',
								children: [
									{
										tag: 'div',
										class: 'flex flex-col items-center gap-2 sm:gap-2.5',
										children: [
											{
												tag: 'span',
												class:
													'text-[length:var(--fs-eyebrow)] font-bold tabular-nums tracking-[var(--tracking-wide)] text-foreground-quiet',
												text: String(i + 1).padStart(2, '0')
											},
											{
												tag: 'p',
												class:
													'max-w-md text-[length:var(--fs-title)] font-medium leading-snug text-foreground-soft sm:text-[length:var(--fs-lead)]',
												text: step
											}
										]
									}
								]
							})
						)
					}
				]
			}
		]
	}
}

/* 4. WHAT — honest mechanics: input, magic, output. */
function mechanicsView(skill: AvenosSkill, t: Messages): ViewNode {
	const cell = (
		eyebrowClass: string,
		label: string,
		value: string,
		boxClass: string
	): ViewNode => ({
		tag: 'div',
		class: boxClass,
		children: [
			{ tag: 'p', class: eyebrowClass, text: label },
			{
				tag: 'p',
				class: 'mt-2 text-[length:var(--fs-body)] leading-snug text-foreground-soft',
				text: value
			}
		]
	})
	return {
		tag: 'section',
		class:
			'border-b border-border/10 bg-gradient-to-b from-transparent via-white/15 to-transparent px-5 py-14 sm:px-8 sm:py-20',
		children: [
			{
				tag: 'div',
				class: 'mx-auto max-w-3xl',
				children: [
					{
						tag: 'div',
						class: 'text-center',
						children: [
							{ tag: 'p', class: 'eyebrow', text: t.mechanicsEyebrow },
							{ tag: 'h2', class: 'section-title mt-3 sm:text-3xl', text: t.mechanicsHeading }
						]
					},
					{
						tag: 'div',
						class: 'mt-8 grid gap-3 sm:grid-cols-3',
						children: [
							cell(
								'eyebrow-quiet',
								t.input,
								skill.whatMechanics.input,
								'rounded-xl border border-border/25 bg-surface-raised px-4 py-4'
							),
							cell(
								'eyebrow',
								t.magic,
								skill.whatMechanics.magic,
								'rounded-xl border border-accent/25 bg-accent/8 px-4 py-4 ring-1 ring-accent/15'
							),
							cell(
								'eyebrow-quiet',
								t.output,
								skill.whatMechanics.output,
								'rounded-xl border border-border/25 bg-surface-raised px-4 py-4'
							)
						]
					}
				]
			}
		]
	}
}

/* 5. Plays well with — the chain links. */
function playsView(skill: AvenosSkill, t: Messages, lang: Lang): ViewNode {
	return {
		tag: 'section',
		class: 'border-b border-border/10 px-5 py-12 sm:px-8 sm:py-16',
		children: [
			{
				tag: 'div',
				class: 'mx-auto max-w-3xl',
				children: [
					{
						tag: 'div',
						class: 'text-center',
						children: [
							{ tag: 'p', class: 'eyebrow', text: t.playsEyebrow },
							{
								tag: 'h2',
								class: 'mt-3 text-xl font-semibold tracking-tight text-foreground sm:text-2xl',
								text: t.playsHeading(skillLabel(skill.slug))
							}
						]
					},
					{
						tag: 'ul',
						class: 'mt-6 grid gap-2.5 sm:grid-cols-2',
						children: skill.playsWith.map(
							({ slug, relation }): ViewNode => ({
								tag: 'li',
								children: [
									{
										tag: 'a',
										class:
											'flex items-start gap-3 rounded-xl border border-border/25 bg-surface-raised px-4 py-3 transition-colors hover:border-border/25 hover:bg-surface-sunken',
										attrs: { href: skillDetailHref(slug, lang) },
										children: [
											{
												tag: 'span',
												class: 'mt-0.5 text-[length:var(--fs-eyebrow)] font-bold text-accent-ink',
												text: '→'
											},
											{
												tag: 'div',
												children: [
													{
														tag: 'p',
														class:
															'text-[length:var(--fs-eyebrow)] font-bold tracking-[var(--tracking-wide)] text-foreground-soft',
														text: skillLabel(slug)
													},
													{
														tag: 'p',
														class:
															'mt-0.5 text-[length:var(--fs-meta)] leading-snug text-foreground-quiet',
														text: relation
													}
												]
											}
										]
									}
								]
							})
						)
					}
				]
			}
		]
	}
}

/* 6. The value stack: what the alternatives cost, struck through, and what
 * this one costs — nothing on top. */
function valueView(skill: AvenosSkill, t: Messages): ViewNode {
	const facts = (label: string, value: string): ViewNode => ({
		tag: 'div',
		children: [
			{ tag: 'p', class: 'eyebrow-quiet', text: label },
			{
				tag: 'p',
				class: 'mt-1 text-[length:var(--fs-body)] font-medium text-foreground-soft',
				text: value
			}
		]
	})
	return {
		tag: 'section',
		class:
			'border-b border-border/10 bg-linear-to-b from-transparent via-white/15 to-transparent px-5 py-14 sm:px-8 sm:py-20',
		children: [
			{
				tag: 'div',
				class: 'mx-auto max-w-2xl',
				children: [
					{
						tag: 'div',
						class: 'text-center',
						children: [
							{ tag: 'p', class: 'eyebrow', text: t.valueEyebrow },
							{ tag: 'h2', class: 'section-title mt-3 sm:text-3xl', text: t.valueHeading }
						]
					},
					{
						tag: 'div',
						class: 'mt-8 rounded-lg border border-border/25 bg-surface-raised p-5 sm:p-7',
						children: [
							{ tag: 'p', class: 'eyebrow-quiet', text: t.standalone },
							{
								tag: 'ul',
								class: 'mt-4 space-y-2',
								children: skill.valueStack.standaloneAlternatives.map(
									(alt): ViewNode => ({
										tag: 'li',
										class: 'flex items-baseline justify-between gap-3',
										children: [
											{
												tag: 'span',
												class:
													'text-[length:var(--fs-body)] text-foreground-quiet line-through decoration-foreground/30',
												text: alt.label
											},
											alt.eurPerMonth > 0
												? {
														tag: 'span',
														class:
															'shrink-0 text-[length:var(--fs-body)] font-bold tabular-nums text-foreground-quiet line-through decoration-foreground/30',
														text: `${alt.eurPerMonth} €/m`
													}
												: {
														tag: 'span',
														class:
															'shrink-0 text-[length:var(--fs-eyebrow)] font-bold uppercase tracking-[var(--tracking-wider)] text-foreground-quiet',
														text: t.notAvailable
													}
										]
									})
								)
							},
							{
								tag: 'div',
								class: 'mt-5 flex items-baseline justify-between border-t border-border/25 pt-4',
								children: [
									{
										tag: 'span',
										class: 'text-[length:var(--fs-section)] font-semibold text-foreground-quiet',
										text: t.standaloneTotal
									},
									{
										tag: 'span',
										class:
											'text-xl font-bold tabular-nums text-foreground line-through decoration-foreground/40',
										text: `≈ ${skill.valueStack.standaloneTotalEurPerMonth} €/m`
									}
								]
							},
							{
								tag: 'div',
								class: 'mt-4 rounded-xl border border-accent/25 bg-accent/15 px-4 py-4',
								children: [
									{ tag: 'p', class: 'text-center eyebrow', text: t.included },
									{
										tag: 'p',
										class:
											'mt-2 text-center text-[length:var(--fs-title)] font-bold text-foreground',
										text: t.noSurcharge
									},
									{
										tag: 'p',
										class: 'mt-1 text-center text-[length:var(--fs-meta)] text-foreground-quiet',
										text: t.noLockIn
									}
								]
							},
							{
								tag: 'div',
								class: 'mt-5 grid gap-3 border-t border-border/25 pt-5 sm:grid-cols-3',
								children: [
									facts(t.firstRelief, skill.valueStack.timeDelayToValue),
									facts(t.setupEffort, skill.valueStack.effortToInstall),
									facts(t.proof, skill.valueStack.proof)
								]
							}
						]
					}
				]
			}
		]
	}
}

/* 7. Bonuses, then availability — the honest scarcity line. */
function bonusView(skill: AvenosSkill, t: Messages, lang: Lang): ViewNode {
	return {
		tag: 'section',
		class: 'border-b border-border/10 px-5 py-12 sm:px-8 sm:py-16',
		children: [
			{
				tag: 'div',
				class: 'mx-auto max-w-2xl space-y-6',
				children: [
					{
						tag: 'div',
						class: 'rounded-lg border border-border/25 bg-surface-raised p-5 sm:p-6',
						children: [
							{ tag: 'p', class: 'eyebrow-quiet', text: t.bonuses },
							{
								tag: 'ul',
								class: 'mt-3 space-y-2',
								children: skill.bonuses.map(
									(bonus): ViewNode => ({
										tag: 'li',
										class:
											'flex gap-3 text-[length:var(--fs-body)] leading-snug text-foreground-soft sm:text-[length:var(--fs-section)]',
										children: [
											{
												tag: 'span',
												class: 'mt-1 size-1.5 shrink-0 rounded-full bg-accent',
												attrs: { 'aria-hidden': 'true' }
											},
											{ tag: 'span', text: bonus }
										]
									})
								)
							}
						]
					},
					{
						tag: 'div',
						class: 'rounded-xl border border-accent/25 bg-accent/15 px-5 py-4',
						children: [
							{ tag: 'p', class: 'eyebrow', text: t.availability },
							{
								tag: 'p',
								class: 'mt-1.5 text-[length:var(--fs-body)] leading-snug text-foreground-soft',
								text: availabilityNote(skill, lang)
							}
						]
					}
				]
			}
		]
	}
}

/* 8. The letter from avenCEO. */
function letterView(skill: AvenosSkill, t: Messages): ViewNode {
	return {
		tag: 'section',
		class:
			'border-b border-border/10 bg-linear-to-b from-white/15 via-white/8 to-transparent px-5 py-12 sm:px-8 sm:py-16',
		children: [
			{
				tag: 'div',
				class: 'mx-auto max-w-2xl',
				children: [
					{
						tag: 'div',
						class:
							'rounded-lg border border-border/25 bg-surface-raised px-5 py-7 shadow-[var(--shadow-raised)] sm:px-8 sm:py-9',
						children: [
							{
								tag: 'header',
								class:
									'flex items-end justify-between gap-4 border-b border-foreground/[0.06] pb-5',
								children: [
									{
										tag: 'div',
										class: 'flex items-center gap-3',
										children: [
											{
												tag: 'div',
												class:
													'size-10 shrink-0 overflow-hidden rounded-full ring-2 ring-surface-page',
												attrs: { id: 'skill-letter-avatar', 'aria-hidden': 'true' },
												text: '@@skill-letter-avatar@@'
											},
											{
												tag: 'div',
												children: [
													{ tag: 'p', class: 'eyebrow', text: t.writtenBy },
													{
														tag: 'p',
														class:
															'mt-0.5 text-[length:var(--fs-body)] font-bold tracking-[var(--tracking-wide)] text-accent-ink',
														text: AVEN
													}
												]
											}
										]
									},
									{
										tag: 'p',
										class:
											'text-[length:var(--fs-nano)] font-bold uppercase tracking-[var(--tracking-wider)] text-foreground-quiet',
										text: skillLabel(skill.slug)
									}
								]
							},
							{
								tag: 'p',
								class:
									'mt-6 text-[length:var(--fs-title)] italic leading-relaxed text-foreground-soft sm:text-[length:var(--fs-title)] sm:leading-[1.65]',
								text: skill.letterFromPublisher
							},
							{
								tag: 'footer',
								class: 'mt-8 border-t border-foreground/[0.06] pt-6',
								children: [
									{ tag: 'p', class: 'eyebrow-quiet', text: t.signOff },
									{
										tag: 'p',
										class:
											'mt-1.5 text-[length:var(--fs-body)] font-bold tracking-[var(--tracking-wide)] text-accent-ink',
										text: AVEN
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

/** The back-to-all line under the CTA. */
function backView(t: Messages, lang: Lang): ViewNode {
	return {
		tag: 'div',
		class: 'mt-6 text-center',
		children: [
			{
				tag: 'a',
				class:
					'text-[length:var(--fs-meta)] font-semibold uppercase tracking-[var(--tracking-wider)] text-foreground-quiet transition-opacity hover:text-foreground-soft',
				attrs: { href: localeHref(lang, '/skills') },
				text: t.backToAll
			}
		]
	}
}

export type SkillLandingSections = {
	why: string
	gain: string
	how: string
	mechanics: string
	plays: string
	value: string
	bonus: string
	letter: string
	back: string
}

export async function renderSkillLandingSections(
	skill: AvenosSkill,
	lang: Lang
): Promise<SkillLandingSections> {
	const t = pick(messages, lang).detail
	return {
		why: await renderSection(whyView(skill, t), {
			'@@skill-scenario-avatar@@': beamAvatarSvg(AVEN, paletteKi, 32, `skill-aven-${skill.slug}`)
		}),
		gain: await renderSection(gainView(skill, t)),
		how: await renderSection(howView(skill, t)),
		mechanics: await renderSection(mechanicsView(skill, t)),
		plays: await renderSection(playsView(skill, t, lang)),
		value: await renderSection(valueView(skill, t)),
		bonus: await renderSection(bonusView(skill, t, lang)),
		letter: await renderSection(letterView(skill, t), {
			'@@skill-letter-avatar@@': beamAvatarSvg(AVEN, paletteKi, 48, `letter-${skill.slug}`)
		}),
		back: await renderSection(backView(t, lang))
	}
}
