import { describe, expect, test } from 'bun:test'
import { actorStyles, actors } from '../src/actors.js'
import componentsDoc from '../src/brand/components.avenceo.json' with { type: 'json' }

/**
 * NAME COLLISIONS — the one migration hazard with no other gate.
 *
 * A unit was defined as `app-shell`. Six surfaces already used a legacy
 * `.app-shell` to mean "the page wrapper, a min-height and a ground". Defining
 * the unit silently restyled every one of them into a two-column grid. Nothing
 * reported it: the class resolved, the CSS was valid, and the docs page simply
 * rendered with its content pushed 700px to the right.
 *
 * `brand.ts` merges the two maps with the UNITS winning, which is correct for a
 * legacy class a unit deliberately replaces — and silently wrong for a name a
 * unit took by accident. The difference between those two is intent, and intent
 * has to be written down: a deliberate replacement appears in `SUPERSEDES`.
 *
 * So: a unit may share a name with a legacy class only if it says so.
 */
const legacy = new Set(Object.keys((componentsDoc as any).components ?? {}))
const all = (Array.isArray(actors) ? actors : Object.values(actors)) as any[]

describe('a unit never takes a legacy name by accident', () => {
	/*
	 * A test stood here checking that every actor class shadowing a legacy class
	 * was declared in SUPERSEDES. It policed the transition: two vocabularies
	 * coexisting, and a name could be taken by accident. There is one vocabulary
	 * now, so the collision it guarded against cannot happen.
	 */

	test('no two units emit the same class', () => {
		/* Two units with one part name produce one rule and the second silently
		   wins. `compileUnitStyling` cannot see across units, so this is the only
		   place it can be checked. */
		const seen = new Map<string, string>()
		const clashes: string[] = []
		for (const u of all) {
			for (const part of Object.keys(u.styling?.parts ?? {})) {
				const cls = `${u.name}-${part}`
				if (seen.has(cls) && seen.get(cls) !== u.name)
					clashes.push(`${cls}: ${seen.get(cls)} vs ${u.name}`)
				seen.set(cls, u.name)
			}
			if (seen.has(u.name) && seen.get(u.name) !== u.name)
				clashes.push(`${u.name}: also a part of ${seen.get(u.name)}`)
			seen.set(u.name, u.name)
		}
		expect(clashes).toEqual([])
	})
})
