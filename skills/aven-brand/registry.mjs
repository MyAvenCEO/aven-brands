/**
 * THE SKILL LIBRARY — aven-brand's skills, as data.
 *
 * The same decision `units.ts` made, for the same reason. A unit is a JSON
 * document declaring what a component IS, validated when the registry loads,
 * because a component that cannot render should fail when the package is built
 * and not when a page is opened. A skill is a JSON document declaring what a
 * skill IS, validated here, because a skill that routes to a gate which does not
 * exist should fail when the library is built and not when someone invokes it
 * and silently gets less than they asked for.
 *
 * What the validation actually catches — every one of these was a real defect in
 * one of the two merged libraries, not a hypothetical:
 *
 *   - a `reads` pointing at a depth file that was renamed or deleted
 *   - a `gates` naming a script that does not exist under skills/gates
 *   - a `trigger.instead` routing to a skill that was merged away
 *   - two skills claiming the same name
 *   - a skill with no gates and no admission of why
 *   - an emoji anywhere in the library, which this repo forbids outright
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const REPO = resolve(HERE, '../..')
const GATES = join(REPO, 'skills/gates')

/* The same expression `check_no_emoji.py` uses. The library that merged into
   this one keyed its severity tables on coloured circles; every one of them is
   now a word, and this is what keeps them words. */
const EMOJI =
	/[\u{1F300}-\u{1FAFF}\u{2190}-\u{21FF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{1F000}-\u{1F0FF}]/u
/* Arrows and box-drawing are the one exception, because a diagram needs them. */
const ALLOWED = /[←-⇿─-╿]/u

export const manifest = JSON.parse(readFileSync(join(HERE, 'manifest.json'), 'utf8'))

export const skills = readdirSync(join(HERE, 'skills'))
	.filter((f) => f.endsWith('.json'))
	.map((f) => JSON.parse(readFileSync(join(HERE, 'skills', f), 'utf8')))
	.sort((a, b) => a.name.localeCompare(b.name))

const REQUIRED = ['name', 'summary', 'trigger', 'steps', 'done']
const AREAS = new Set(['foundation', 'build', 'verify', 'operate', 'communicate'])

export function validate(all = skills) {
	const problems = []
	const names = new Set(all.map((s) => s.name))
	const seen = new Set()

	for (const skill of all) {
		const at = skill.name ?? '(unnamed)'
		for (const key of REQUIRED) if (!skill[key]) problems.push(`${at}: missing "${key}"`)
		if (!/^[a-z][a-z0-9-]*$/.test(skill.name ?? '')) problems.push(`${at}: name is not a slug`)
		if (seen.has(skill.name)) problems.push(`${at}: declared twice`)
		seen.add(skill.name)
		if (skill.area && !AREAS.has(skill.area)) problems.push(`${at}: unknown area "${skill.area}"`)

		/* A depth file that moved takes the skill's substance with it and says
		   nothing. This is the failure mode of a library of prose. */
		for (const path of skill.reads ?? [])
			if (!existsSync(join(REPO, path))) problems.push(`${at}: reads a file that is not there — ${path}`)

		for (const gate of skill.gates ?? [])
			if (!existsSync(join(GATES, gate))) problems.push(`${at}: names a gate that is not there — ${gate}`)

		/* Routing has to land somewhere. A merged-away skill left behind in an
		   `instead` sends the reader to a dead end at exactly the moment they
		   have been told they are in the wrong place. */
		for (const [situation, target] of Object.entries(skill.trigger?.instead ?? {}))
			if (!names.has(target))
				problems.push(`${at}: routes "${situation}" to "${target}", which is not a skill`)

		/* Not every skill can be gated — `decision-record` produces prose. But a
		   skill with no gate has to say how it is checked, in `done`, rather than
		   leaving verification to whether it felt right. */
		if (!(skill.gates ?? []).length && !(skill.done ?? []).length)
			problems.push(`${at}: no gates and no definition of done — nothing here can be checked`)

		const text = JSON.stringify(skill)
		for (const ch of text)
			if (EMOJI.test(ch) && !ALLOWED.test(ch)) problems.push(`${at}: contains an emoji (${ch})`)
	}

	/* A skill absorbed by two others, or by none, is a merge that was not
	   finished. Both happened while this library was being assembled. */
	const absorbed = new Map()
	for (const skill of all)
		for (const old of skill.supersedes ?? []) {
			if (absorbed.has(old))
				problems.push(`"${old}" is claimed by both ${absorbed.get(old)} and ${skill.name}`)
			absorbed.set(old, skill.name)
		}

	return problems
}

const problems = validate()
if (problems.length) {
	throw new Error(`aven-brand: ${problems.length} problem(s)\n  ${problems.join('\n  ')}`)
}
