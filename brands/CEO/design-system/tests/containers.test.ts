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

/**
 * A unit pinned to the viewport IS the viewport. `nav-menu` is
 * `position: fixed; inset: 0` — its width comes from neither a parent box nor
 * its contents, there is no container above it to answer to, and its type
 * deliberately uses `vw` because `vw` is measuring the box it actually
 * occupies. Containment here would be a declaration with nothing to contain.
 */
const isViewport = (u: any) =>
	u.styling?.base?.position === 'fixed' && u.styling?.base?.inset !== undefined

const slotted = (u: any) => Object.keys(u.interface?.slots ?? {}).length
const composites = all.filter((u) => slotted(u) && !hugs(u) && !isViewport(u))
const hugging = all.filter((u) => slotted(u) && hugs(u))
const leafs = all.filter((u) => !slotted(u))

describe('the container contract', () => {
	test('every composite establishes a container named after itself', () => {
		expect(
			composites
				.filter((u: any) => u.styling?.base?.containerType !== 'inline-size')
				.map((u: any) => u.name)
		).toEqual([])
		expect(
			composites
				.filter((u: any) => u.styling?.base?.containerName !== u.name)
				.map((u: any) => u.name)
		).toEqual([])
	})

	test('every container declares its own inline-size', () => {
		/*
		 * EVERY container, including the viewport-pinned ones. `nav-menu` relied on
		 * `inset: 0` for its width and was exempted here because it is fixed — and
		 * it collapsed to zero the first time anything rendered it as anything but
		 * fixed, which its own specimen does. That is the third time this exact
		 * circularity has cost a layout, so the rule now has no exceptions: if a
		 * unit is a container, it says how wide it is.
		 */
		const everyContainer = all.filter((u) => u.styling?.base?.containerType === 'inline-size')
		expect(everyContainer.filter((u) => !u.styling?.base?.inlineSize).map((u) => u.name)).toEqual(
			[]
		)
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

	test('no unit measures the VIEWPORT, except the app shell', () => {
		/*
		 * A viewport unit inside a component means the component is reading a box
		 * it does not own. `hero` asked for `85vh` and therefore wanted 85% of the
		 * monitor when it was rendered in a 324px preview card; its heading scaled
		 * on `6.5vw`, so display type sized to the window rather than to the hero.
		 *
		 * The exceptions are units whose own box IS the viewport: the application
		 * root, and anything `position: fixed`. There, measuring the viewport is
		 * the unit measuring itself.
		 *
		 * `--hero-min-block` is how a surface still says "fill the screen": the
		 * SURFACE knows whether a hero is a landing page or a card, and the unit
		 * does not.
		 */
		const ALLOWED = new Set(['workbench'])
		const VIEWPORT = /[0-9.]+(?:dv|sv|lv)?(?:vw|vh|vmin|vmax)\b/
		const offenders: string[] = []
		for (const u of all) {
			if (ALLOWED.has(u.name) || isViewport(u)) continue
			const walk = (node: any, path: string) => {
				if (typeof node === 'string') {
					if (VIEWPORT.test(node)) offenders.push(`${u.name}${path} = ${node}`)
					return
				}
				if (node && typeof node === 'object')
					for (const [k, v] of Object.entries(node)) if (!k.startsWith('$')) walk(v, `${path}.${k}`)
			}
			walk(u.styling ?? {}, '')
		}
		expect(offenders).toEqual([])
	})

	test('a container declares a display that containment actually works on', () => {
		/*
		 * `container-type: inline-size` has NO EFFECT on an element whose display
		 * is `inline`. Containment needs a block box, and `display` defaults to
		 * whatever the TAG is — so a unit that declares containment and no display
		 * is inert the moment a surface renders it as a `<span>`.
		 *
		 * Eight units were in that state. The navbar is how it surfaced: at 318px
		 * it still showed a full desktop nav, because the `@container` rule it was
		 * waiting on could never fire. Nothing failed; the query simply never
		 * matched, which looks exactly like a threshold that is too low.
		 */
		const INERT = new Set(['inline', 'contents', undefined, ''])
		const containers = all.filter((u) => u.styling?.base?.containerType === 'inline-size')
		expect(
			containers.filter((u) => INERT.has(u.styling?.base?.display)).map((u) => u.name)
		).toEqual([])
	})
})
