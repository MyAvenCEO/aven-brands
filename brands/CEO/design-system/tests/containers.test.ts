import { describe, expect, test } from 'bun:test'
import { units } from '../src/units.js'

/**
 * THE CONTAINER CONTRACT.
 *
 * A design system's components adapt to the box they are given, not to the
 * window. A composite dropped into a 320px sidebar and the same composite on a
 * 320px phone are the same situation; a viewport media query calls them
 * different ones and gets one of them wrong.
 *
 * The rule is universal and has two halves. The second is the one that bites:
 *
 *   1. Every COMPOSITE establishes an inline-size container named after itself.
 *   2. Every container declares an `inline-size` of its own.
 *
 * (2) is not a preference. `container-type: inline-size` makes the box's width
 * independent of its contents — that IS the containment — so a container with no
 * width of its own has nothing left to size from and collapses to zero. Three
 * units did exactly that when the rule was first applied, and one became a
 * column of single words.
 *
 * LEAFS ARE EXCLUDED, deliberately. A badge, a button, an icon size to their
 * CONTENT, and containment is precisely what takes that away.
 */
/**
 * Widths that come FROM THE CONTENT. A container's width may not, so a unit
 * declaring one of these cannot be a container — the two are circular, and the
 * box collapses. `voice-pill` is the case: the notch must hug what it holds,
 * because a notch that spans the footer is a toolbar.
 */
const CONTENT_SIZED = new Set(['fit-content', 'max-content', 'min-content', 'auto'])

const all = (Array.isArray(units) ? units : Object.values(units)) as any[]
const hugs = (u: any) => CONTENT_SIZED.has(u.styling?.base?.inlineSize)
const composites = all.filter((u) => Object.keys(u.interface?.slots ?? {}).length && !hugs(u))
const hugging = all.filter((u) => Object.keys(u.interface?.slots ?? {}).length && hugs(u))
const leafs = all.filter((u) => !Object.keys(u.interface?.slots ?? {}).length)

describe('the container contract', () => {
	test('every composite establishes a container named after itself', () => {
		expect(
			composites
				.filter((u: any) => u.styling?.base?.containerType !== 'inline-size')
				.map((u: any) => u.name)
		).toEqual([])
		expect(
			composites.filter((u: any) => u.styling?.base?.containerName !== u.name).map((u: any) => u.name)
		).toEqual([])
	})

	test('every container declares its own inline-size', () => {
		expect(
			composites.filter((u: any) => !u.styling?.base?.inlineSize).map((u: any) => u.name)
		).toEqual([])
	})

	test('a unit that hugs its content is never a container', () => {
		/* The two are circular: containment removes content-based sizing, and
		   `fit-content` IS content-based sizing. `voice-pill` collapsed to a
		   sliver with its orb hanging outside it. */
		expect(hugging.filter((u) => u.styling?.base?.containerType).map((u) => u.name)).toEqual([])
	})

	test('no leaf is a container', () => {
		expect(
			leafs.filter((u: any) => u.styling?.base?.containerType).map((u: any) => u.name)
		).toEqual([])
	})

	test('no unit anywhere carries a VIEWPORT media query', () => {
		/* `prefers-reduced-motion` is a person's setting, not a size, and stays.
		   A `min-width` media query inside a unit means that unit is answering to
		   the window instead of to the box it was handed. */
		const offenders: string[] = []
		for (const u of all) {
			for (const m of JSON.stringify(u.styling ?? {}).matchAll(/@media \(([^"]*?)\)/g)) {
				if (/\b(min|max)-(width|inline-size)\b/.test(m[1])) offenders.push(`${u.name}: ${m[0]}`)
			}
		}
		expect(offenders).toEqual([])
	})
})
