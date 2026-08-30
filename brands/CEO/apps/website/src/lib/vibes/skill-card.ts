/**
 * THE MARKETPLACE CARD, as configuration.
 *
 * It was 73 lines of Svelte that computed exactly two things — a class string
 * chosen from three constants, and an i18n lookup — and then wrote markup.
 * Neither is dynamic: which variant a card wears and what it says are both
 * facts of the build. So the card is a ViewNode builder, and the surfaces that
 * show cards compose it into their own views instead of mounting a component
 * per card.
 *
 * THE ACCESSIBLE NAME IS THE POINT of doing this now. The card names itself
 * "inbox router — One inbox for everything", with a real em-dash, because that
 * is how the copy is written; up to engine 0.9.2 the attribute sanitiser
 * admitted the hyphen and nothing else from the dash family, so a ViewDef card
 * would have reached the page as "inbox router One inbox for everything" and
 * lost the separator, silently. 0.9.3 keeps dash punctuation, curly quotes,
 * apostrophes, ellipses and non-breaking spaces in attribute values, so the
 * name a screen reader reads is the name on the card. Verified on the render,
 * not assumed.
 *
 * The class algebra is unchanged and deliberately so: `card skill-card`, both,
 * because the skill card COMPOSES the card — the card holds the box, the
 * border, the ground and the hover; the skill card adds the promise line and
 * the footer rail. Carrying only `skill-card` is how this lost its border and
 * its padding the last time the two stopped duplicating each other.
 *
 * Prose lives in block comments only — the utility scanner reads line comments
 * and one apostrophe in one swallows the class candidates (see footer.ts).
 */
import type { ViewNode } from '@myavenceo/aven-vibes'
import type { Lang } from '$lib/i18n'
import { pick } from '$lib/i18n'
import { skills as messages } from '$lib/i18n/skills'
import { plan } from '$lib/pricing/plans'
import { skillDetailHref, skillLabel } from '$lib/skills/loader'
import type { AvenosSkill } from '$lib/skills/types'

export type SkillCardVariant = 'default' | 'spotlight'

/* How much of the founder story the card quotes. The tail is an ellipsis, so
   the card promises a story rather than telling one. */
const QUOTE_CHARS = 100

/**
 * ONE CHARACTER THE SANITISER STILL EATS.
 *
 * Engine 0.9.3 stopped stripping typographic punctuation from attribute
 * values — em-dashes, en-dashes, curly quotes, the curly apostrophe U+2019,
 * ellipses, non-breaking spaces. It stops one character short: the ASCII
 * apostrophe U+0027 is still removed, although it is exactly as harmless as
 * the curly one inside a double-quoted attribute.
 *
 * The site writes the straight apostrophe — sixty-one of them across the
 * English skill copy and not one curly — so this is a convention, not a typo,
 * and rewriting the copy to suit an engine is the wrong direction. But leaving
 * it alone turns "when it's good" into "when its good" in the accessible name:
 * a different word, and a name that no longer matches the label a sighted
 * reader sees.
 *
 * So the NAME (never the visible copy) gets the curly apostrophe, which
 * survives. Delete this the day U+0027 is admitted; the check that it is still
 * needed is one line in the engine sanitiser: the character class in
 * `sanitizeAttributeWhitelist`.
 */
function survivesAsName(value: string): string {
	return value.replaceAll("'", '\u2019')
}

function cardClass(skill: AvenosSkill, variant: SkillCardVariant): string {
	if (skill.comingSoon) return 'card skill-card skill-card--emphasis-soon'
	if (variant === 'spotlight') return 'card skill-card skill-card--emphasis-featured'
	return 'card skill-card'
}

export function skillCardView(
	skill: AvenosSkill,
	lang: Lang,
	variant: SkillCardVariant = 'default'
): ViewNode {
	const t = pick(messages, lang).card
	const label = skillLabel(skill.slug)
	const quote = `"${skill.founderScenario.timestamp} — ${skill.founderScenario.story.slice(
		0,
		QUOTE_CHARS
	)}…"`

	return {
		tag: 'a',
		class: cardClass(skill, variant),
		attrs: {
			href: skillDetailHref(skill.slug, lang),
			'aria-label': survivesAsName(`${label} — ${skill.oneLineCopy}`)
		},
		children: [
			{
				tag: 'div',
				class: 'skill-card-head',
				children: [
					{
						tag: 'p',
						class: 'text text--eyebrow skill-card-eyebrow',
						text: plan(skill.plan).name
					},
					{
						tag: 'span',
						class: skill.comingSoon ? 'badge' : 'badge badge--tone-accent',
						text: skill.comingSoon ? t.soon : t.skill
					}
				]
			},
			{ tag: 'h3', class: 'skill-card-title', text: label },
			{ tag: 'p', class: 'skill-card-summary', text: skill.oneLineCopy },
			{ tag: 'p', class: 'skill-card-quote', text: quote },
			{
				tag: 'div',
				class: 'skill-card-chains',
				children: skill.playsWith.map(
					({ slug }): ViewNode => ({
						tag: 'span',
						class: 'skill-card-chain',
						text: t.chainLabels[slug] ?? slug
					})
				)
			},
			{
				tag: 'div',
				class: 'skill-card-rail',
				children: [
					{
						tag: 'span',
						class: 'skill-card-promise',
						text: `${skill.hero.promiseHoursPerWeek} ${t.saved}`
					},
					{ tag: 'span', class: 'skill-card-more', text: t.view }
				]
			}
		]
	}
}
