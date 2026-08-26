import {
	COMPONENT_NAMES,
	COMPONENTS,
	ELEVATION_SCALE,
	INK_SCALE,
	PRIMITIVE_NAMES,
	PRIMITIVES,
	RADIUS_SCALE,
	SPACE_SCALE,
	TINT_SCALE,
	TRACKING_SCALE,
	TYPE_SCALE
} from './design.js'
import { CREAMS, TONES } from './tokens.js'

/**
 * THE BRAND GUIDELINE PAGE, AS A VIEW.
 *
 * Not a hand-written HTML file that happens to describe the design system —
 * a `ViewDef` built from the same objects every surface renders from, handed
 * to aven-ui to render. Config in, rendered page out, exactly as the app and
 * the id service work.
 *
 * That matters for more than tidiness. A showcase written by hand drifts from
 * the system the moment someone adds a component and forgets the demo. This
 * one cannot: the sections below iterate the actual exports, so a token that
 * exists appears and a token that does not, does not. If it renders wrong, the
 * design system is wrong.
 *
 * It is also the honest test of the renderer. This is the largest view in the
 * codebase, and it is rendered to a static file by the same string renderer the
 * marketing site will use — so if `renderViewToString` cannot carry a real
 * page, it fails here rather than in production.
 *
 * The view carries CLASSES, never inline styles. Swatches and specimens get
 * their colours from generated helper classes (see `kitchenSinkCss`), which
 * keeps the demonstration honest: everything on the page is drawn with the
 * system's own vocabulary.
 */

type Node = Record<string, unknown>

const el = (tag: string, cls: string | undefined, children: Node[]): Node => ({
	tag,
	...(cls ? { class: cls } : {}),
	children
})
const text = (tag: string, cls: string | undefined, value: string): Node => ({
	tag,
	...(cls ? { class: cls } : {}),
	text: value
})

/** A labelled section, so every block on the page reads the same way. */
function section(eyebrow: string, lede: string | null, body: Node[]): Node {
	return el('section', 'ks-section', [
		text('p', 'eyebrow-accent', eyebrow),
		...(lede ? [text('p', 'meta', lede)] : []),
		...body
	])
}

/** A colour chip plus its name and value. */
function swatch(name: string, value: string): Node {
	return el('div', 'ks-swatch', [
		el('div', `ks-chip ks-chip-${name}`, []),
		text('p', 'ks-swatch-name', name),
		text('p', 'mono-meta', value)
	])
}

/** One row of a scale: a specimen on the left, its name and value on the right. */
function specimen(cls: string, label: string, value: string, sample: string): Node {
	return el('div', 'ks-row', [
		text('span', cls, sample),
		el('span', 'ks-row-meta', [text('span', 'mono-meta', `${label} · ${value}`)])
	])
}

/**
 * Every component, rendered as itself.
 *
 * The ones with a natural demonstration get one; the rest are listed by name
 * with their own class applied, so even a component nobody thought to
 * illustrate still appears wearing its own styles.
 */
const DEMONSTRATED = new Set([
	'panel',
	'stack',
	'stack-center',
	'well',
	'eyebrow',
	'eyebrow-accent',
	'digits',
	'btn',
	'btn-secondary',
	'ghost',
	'chip',
	'alert',
	'steps',
	'step',
	'step-done',
	'title',
	'lede',
	'meta',
	'mark',
	'card',
	'card-sm',
	'mono-meta',
	'bullet'
])

function componentGallery(): Node[] {
	const showcase = el('div', 'panel stack stack-center', [
		text('p', 'eyebrow', 'eyebrow'),
		text('h2', 'title', 'title — the heading on a card'),
		text('p', 'lede', 'lede — the one line under a title, muted and generous.'),
		el('div', 'well ks-full', [
			text('p', 'eyebrow', 'well + eyebrow + digits'),
			text('p', 'digits', 'samuel.aven')
		]),
		el('div', 'steps ks-full', [el('span', 'step step-done', []), el('span', 'step', [])]),
		text('div', 'alert ks-full', 'alert — said in the failure tone, without shouting.'),
		el('div', 'cluster', [
			text('button', 'btn', 'btn'),
			text('button', 'btn-secondary', 'btn-secondary'),
			text('button', 'ghost', 'ghost'),
			text('span', 'chip', 'chip')
		]),
		text('p', 'meta', 'meta — the quiet line under a title.')
	])

	const card = el('div', 'card', [
		text('p', 'eyebrow-quiet', 'eyebrow-quiet'),
		text('p', undefined, 'card — the general raised panel.'),
		text('p', 'mono-meta', 'mono-meta · 7eafc029-bf23-419c'),
		el('p', 'cluster', [
			text('span', 'bullet', ''),
			text('span', undefined, 'bullet — opens a list item.')
		])
	])

	const remaining = COMPONENT_NAMES.filter((n) => !DEMONSTRATED.has(n))

	return [
		showcase,
		card,
		text('div', 'card-sm', 'card-sm'),
		...(remaining.length
			? [
					text('p', 'eyebrow', 'also defined'),
					el(
						'div',
						'cluster',
						remaining.map((n) => text('span', `chip ${n}`, `.${n}`))
					)
				]
			: [])
	]
}

/** The layout primitives, each shown doing the one thing it does. */
function primitiveGallery(): Node[] {
	const box = (label: string) => text('div', 'ks-box', label)
	return [
		text('p', 'eyebrow', 'stack — vertical rhythm'),
		el('div', 'stack ks-demo', [box('one'), box('two'), box('three')]),
		text('p', 'eyebrow', 'cluster — wraps instead of overflowing'),
		el('div', 'cluster ks-demo', [box('a'), box('b'), box('c'), box('d'), box('e')]),
		text('p', 'eyebrow', 'grid-auto — as many columns as fit'),
		el('div', 'grid-auto ks-demo', [box('1'), box('2'), box('3'), box('4')]),
		text('p', 'eyebrow', 'switcher — columns become rows by container width'),
		el('div', 'switcher ks-demo', [box('left'), box('right')]),
		text('p', 'eyebrow', 'sidebar — one fixed, one takes the rest'),
		el('div', 'sidebar ks-demo', [box('side'), box('main')]),
		text('p', 'eyebrow', 'frame — keeps its shape'),
		el('div', 'frame ks-demo ks-frame', [box('16 / 9')]),
		text('p', 'eyebrow', 'center — a measure'),
		el('div', 'center ks-demo', [box('centred to a readable width')])
	]
}

/** The whole page, as one view. */
export function kitchenSinkView(): Node {
	return el('main', 'ks', [
		el('header', 'ks-header', [
			text('p', 'eyebrow-accent', '@myavenceo/aven-ceo'),
			text('h1', 'ks-title', 'Design system'),
			text(
				'p',
				'lede',
				`Rendered by aven-ui from the configs themselves — ${
					Object.keys(TONES).length + Object.keys(CREAMS).length
				} colours, ${Object.keys(TYPE_SCALE).length} type steps, ${PRIMITIVE_NAMES.length} primitives, ${
					COMPONENT_NAMES.length
				} components. Nothing here is written by hand; if it renders wrong, the system is wrong.`
			)
		]),

		section('Colour · tones', 'The paint. Every colour spelled exactly once.', [
			el(
				'div',
				'ks-swatches',
				Object.entries(TONES).map(([n, v]) => swatch(n, v))
			)
		]),
		section('Colour · creams', 'The ladder every surface stands on.', [
			el(
				'div',
				'ks-swatches',
				Object.entries(CREAMS).map(([n, v]) => swatch(n, v))
			)
		]),

		section('Type', 'Twelve steps. A size not on the ramp is not available.', [
			el(
				'div',
				'stack',
				Object.entries(TYPE_SCALE).map(([n, v]) =>
					specimen(`ks-type ks-${n}`, n, v, 'The quick brown fox')
				)
			)
		]),
		section('Tracking', 'Five steps, for what was fourteen values.', [
			el(
				'div',
				'stack',
				Object.entries(TRACKING_SCALE).map(([n, v]) =>
					specimen(`ks-track ks-${n}`, n, v, 'TRACKING SAMPLE')
				)
			)
		]),
		section('Ink', 'Text emphasis, as four steps rather than a continuum.', [
			el(
				'div',
				'stack',
				Object.entries(INK_SCALE).map(([n, v]) =>
					specimen(`ks-ink ks-${n}`, n, v, 'Readable at this weight')
				)
			)
		]),
		section('Tint', 'Surfaces, not text — hairlines and washes.', [
			el(
				'div',
				'stack',
				Object.entries(TINT_SCALE).map(([n, v]) =>
					el('div', 'ks-row', [
						el('span', `ks-tint ks-${n}`, []),
						text('span', 'mono-meta', `${n} · ${v}`)
					])
				)
			)
		]),
		section('Elevation', null, [
			el(
				'div',
				'cluster',
				Object.keys(ELEVATION_SCALE).map((n) => text('div', `ks-box ks-${n}`, n))
			)
		]),
		section('Radius', null, [
			el(
				'div',
				'cluster',
				Object.entries(RADIUS_SCALE).map(([n, v]) => text('div', `ks-box ks-${n}`, `${n} · ${v}`))
			)
		]),
		section('Space', null, [
			el(
				'div',
				'stack',
				Object.entries(SPACE_SCALE).map(([n, v]) =>
					el('div', 'ks-row', [
						el('span', `ks-space ks-${n}`, []),
						text('span', 'mono-meta', `${n} · ${v}`)
					])
				)
			)
		]),

		section(
			`Primitives · ${PRIMITIVE_NAMES.length}`,
			'The shapes almost every layout is made of. Each tuned at the call site by a custom property rather than by a class per value.',
			primitiveGallery()
		),
		section(
			`Components · ${COMPONENT_NAMES.length}`,
			'Each rendered as itself, from the same definitions aven-ui applies as a StyleDef.',
			componentGallery()
		)
	])
}

/**
 * The page's own layout, plus one helper class per token.
 *
 * Generated rather than written so the specimens cannot describe a token that
 * no longer exists: every rule below is derived from the same exports the view
 * iterates. The page needs SOME styling of its own — a swatch has to get its
 * colour somehow — and this is how it gets it without inline styles.
 */
export function kitchenSinkCss(): string {
	const helpers: string[] = []
	for (const name of Object.keys(TONES))
		helpers.push(`.ks-chip-${name} { background: var(--color-${name}); }`)
	for (const name of Object.keys(CREAMS))
		helpers.push(
			`.ks-chip-${name} { background: var(--color-${name}); border: 1px solid var(--color-border); }`
		)
	for (const name of Object.keys(TYPE_SCALE))
		helpers.push(`.ks-${name} { font-size: var(--${name}); }`)
	for (const name of Object.keys(TRACKING_SCALE))
		helpers.push(`.ks-${name} { letter-spacing: var(--${name}); text-transform: uppercase; }`)
	for (const name of Object.keys(INK_SCALE))
		helpers.push(
			`.ks-${name} { color: color-mix(in srgb, var(--color-ink) calc(var(--${name}) * 100%), transparent); }`
		)
	for (const name of Object.keys(TINT_SCALE))
		helpers.push(
			`.ks-${name} { background: color-mix(in srgb, var(--color-ink) calc(var(--${name}) * 100%), transparent); }`
		)
	for (const name of Object.keys(ELEVATION_SCALE))
		helpers.push(`.ks-${name} { box-shadow: var(--${name}); }`)
	for (const name of Object.keys(RADIUS_SCALE))
		helpers.push(`.ks-${name} { border-radius: var(--${name}); }`)
	for (const name of Object.keys(SPACE_SCALE))
		helpers.push(`.ks-${name} { inline-size: var(--${name}); }`)

	return [
		'@layer utilities {',
		"\t/* The page's own furniture. Everything else on it is the system. */",
		'\t.ks { max-inline-size: 62rem; margin-inline: auto; padding: 3rem 1.5rem 6rem; }',
		'\t.ks-header { margin-block-end: 3rem; }',
		'\t.ks-title { font-size: var(--fs-display); margin: .25rem 0 .5rem; letter-spacing: var(--tracking-tight); }',
		'\t.ks-section { margin-block-end: 3.5rem; display: grid; gap: var(--space-comfortable); }',
		'\t.ks-swatches { display: flex; flex-wrap: wrap; gap: var(--space-snug); }',
		'\t.ks-swatch { inline-size: 7rem; }',
		'\t.ks-swatch-name { font-size: var(--fs-micro); margin: .35rem 0 0; }',
		'\t.ks-chip { block-size: 3rem; border-radius: var(--radius-inner); }',
		'\t.ks-row { display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; border-block-end: 1px solid color-mix(in srgb, var(--color-ink) 8%, transparent); padding-block-end: .4rem; }',
		'\t.ks-row-meta { flex-shrink: 0; }',
		'\t.ks-tint { block-size: 1.5rem; inline-size: 8rem; border-radius: var(--radius-chip); }',
		'\t.ks-space { block-size: 1rem; background: var(--color-anchor); border-radius: 2px; }',
		'\t.ks-box { background: var(--color-surface-raised); border: 1px solid var(--color-border); border-radius: var(--radius-inner); padding: 1rem; font-size: var(--fs-micro); }',
		'\t.ks-demo { border: 1px dashed color-mix(in srgb, var(--color-ink) 16%, transparent); border-radius: var(--radius-inner); padding: var(--space-snug); }',
		'\t.ks-frame { --ratio: 16 / 9; max-inline-size: 20rem; }',
		'\t.ks-full { inline-size: 100%; }',
		'',
		'\t/* One helper per token, generated from the same exports the view walks. */',
		...helpers.map((rule) => `\t${rule}`),
		'}',
		''
	].join('\n')
}
