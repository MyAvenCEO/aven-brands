/**
 * Skills, delivered.
 *
 * `units/*.json` compiles to `brand-components.css`; `skills/*.json` compiles to
 * the `.claude/skills/<name>/SKILL.md` files Claude Code actually reads. Same
 * pattern, same reason: the JSON is the source of truth and the consumable form
 * is generated, so the frontmatter cannot drift from the body and a skill cannot
 * quietly stop matching the description it is selected by.
 *
 * The library this merged from hand-maintained 41 SKILL.md files with the
 * trigger conditions written into a prose paragraph in the frontmatter. That
 * works until two of them start sounding right for the same request, and then
 * there is nothing to check.
 *
 *   node skills/aven-brand/generate.mjs
 */
import { mkdirSync, writeFileSync, readdirSync, rmSync, existsSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { skills, manifest } from './registry.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(HERE, '../../.claude/skills')

const list = (items, bullet = '-') => items.map((i) => `${bullet} ${i}`).join('\n')
const numbered = (items) => items.map((s, i) => `${i + 1}. ${s}`).join('\n')

/**
 * The description Claude Code matches a request against.
 *
 * Trigger and anti-trigger in ONE string, because that is the only field the
 * matcher sees. The `not` half is what stops two skills answering the same
 * request — which is the failure mode of every library past about fifteen.
 */
function description(skill) {
	const parts = [skill.summary, `Use when: ${skill.trigger.when.join('; ')}.`]
	if (skill.trigger.not?.length) parts.push(`Do NOT use for: ${skill.trigger.not.join('; ')}.`)
	for (const [situation, target] of Object.entries(skill.trigger.instead ?? {}))
		parts.push(`If ${situation}, use ${target} instead.`)
	return parts.join(' ')
}

function render(skill) {
	const out = [
		'---',
		`name: ${skill.name}`,
		`description: ${JSON.stringify(description(skill))}`,
		'invocation: model',
		'---',
		'',
		`<!-- GENERATED from skills/aven-brand/skills/${skill.name}.json — do not edit.`,
		`     Edit the JSON and run \`node skills/aven-brand/generate.mjs\`. -->`,
		'',
		`# ${skill.name}`,
		'',
		skill.summary,
		''
	]
	if (skill.reads?.length) out.push('## Read first', '', list(skill.reads.map((r) => `\`${r}\``)), '')
	out.push('## Steps', '', numbered(skill.steps), '')
	if (skill.output) out.push('## Output', '', skill.output, '')
	if (skill.gates?.length)
		out.push(
			'## Gates',
			'',
			'Run these and report their real output. A number you did not measure is not a number.',
			'',
			list(skill.gates.map((g) => `\`skills/gates/${g}\``)),
			''
		)
	out.push('## Done when', '', list(skill.done), '')
	if (skill.supersedes?.length)
		out.push(
			'## Absorbed',
			'',
			`Merged in from \`design-system-ops\`: ${skill.supersedes.map((s) => `\`${s}\``).join(', ')}.`,
			''
		)
	return out.join('\n')
}

/* Stale directories are REMOVED, not left. A generator that only adds leaves the
   skill you renamed still installed and still matching requests, which is how a
   library ends up with two answers to one question. */
const wanted = new Set(skills.map((s) => s.name))
if (existsSync(OUT))
	for (const entry of readdirSync(OUT, { withFileTypes: true }))
		if (entry.isDirectory() && !wanted.has(entry.name)) {
			rmSync(join(OUT, entry.name), { recursive: true })
			console.log(`  removed ${entry.name} (no longer in the library)`)
		}

for (const skill of skills) {
	mkdirSync(join(OUT, skill.name), { recursive: true })
	writeFileSync(join(OUT, skill.name, 'SKILL.md'), render(skill))
}
console.log(`${manifest.name} ${manifest.version}: wrote ${skills.length} skill(s) to .claude/skills`)
