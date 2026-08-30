/**
 * The framework docs' live demos — each one a real vibe, delivered as a real
 * island.
 *
 * The docs markdown carries `demo` fences, which `renderMarkdownDoc` turns
 * into `<div data-md-demo="NAME"></div>` mount points. This module is the
 * consumer's half of that contract: the named bundles, the build-time static
 * render that goes INSIDE the placeholder (so the demo's markup is in the
 * prerendered file, exactly the delivery story the section it sits in is
 * describing), and the client-side hydration that attaches behaviour.
 *
 * The bundles wear the brand's own classes (`btn`, `surface`, `stat`) rather
 * than demo styling, because a demo that looks foreign proves nothing: the
 * claim under test is that a vibe renders native inside this brand.
 *
 * Both demos route their toggle/increment through the HOST inbox and then
 * DELIVER into the root's declared `accepts` contract. That indirection is
 * not ceremony — the declarative tier cannot compute (`!open`, `count + 1`
 * are not expressions, by design), so the host computes the next value and
 * the message that actually mutates state is the contracted one
 * (`set-open`/`set-count`), payload-checked against `accepts` like any other
 * actor message. The demo therefore exercises the exact path the docs
 * describe instead of a shortcut around it.
 */
import { Evaluator, Island, renderViewToString, type UiBundle } from '@myavenceo/aven-vibes'

/** An island bundle: everything a vibe has except `style` — the brand CSS is the style. */
export type DemoBundle = Omit<UiBundle, 'style'>

const menuIsland: DemoBundle = {
	name: 'menu-island',
	accepts: { 'set-open': { open: 'boolean' } },
	state: { open: false },
	view: {
		tag: 'div',
		class: 'surface',
		attrs: { 'data-demo': 'menu' },
		children: [
			{
				tag: 'button',
				class: 'btn btn--secondary',
				text: 'Toggle menu',
				attrs: { type: 'button', 'aria-expanded': '$open', 'aria-controls': 'demo-menu-panel' },
				$on: { click: { send: 'toggle-menu' } }
			},
			{
				tag: 'ul',
				attrs: { id: 'demo-menu-panel', 'data-open': '$open' },
				children: [
					{ tag: 'li', text: 'Docs' },
					{ tag: 'li', text: 'Pricing' },
					{ tag: 'li', text: 'Skills' }
				]
			}
		]
	}
}

const counterIsland: DemoBundle = {
	name: 'counter-island',
	accepts: { 'set-count': { count: 'number' } },
	state: { count: 0 },
	view: {
		tag: 'div',
		class: 'surface',
		attrs: { 'data-demo': 'counter' },
		children: [
			{
				tag: 'p',
				class: 'stat',
				children: [
					{ tag: 'span', class: 'stat-value', text: '$count' },
					{ tag: 'span', class: 'stat-caption', text: 'messages delivered' }
				]
			},
			{
				tag: 'button',
				class: 'btn btn--secondary',
				text: 'Increment',
				attrs: { type: 'button' },
				$on: { click: { send: 'increment' } }
			}
		]
	}
}

export const DEMO_BUNDLES: Record<string, DemoBundle> = {
	'menu-island': menuIsland,
	'counter-island': counterIsland
}

const evaluator = new Evaluator()

/**
 * The static half: the demo's markup, rendered exactly as a build would
 * render it. Runs inside the universal `load`, so at prerender time this
 * HTML lands in the shipped file — the demo is CONTENT before it is
 * behaviour, which is the delivery-tier story the docs make.
 */
export function renderDemoHtml(name: string): Promise<string> {
	const bundle = DEMO_BUNDLES[name]
	if (!bundle) return Promise.resolve('')
	return renderViewToString(bundle.view, bundle.state, {
		evaluate: (expression, data) => evaluator.evaluate(expression, data)
	})
}

/**
 * The behaviour half: hydrate one placeholder whose static markup the load
 * already injected. Returns the island so the caller can dispose it when the
 * section unmounts, and warns on a zero-listener hydration because that is
 * the stale-build signal the docs tell readers to check for.
 */
export async function hydrateDemo(container: HTMLElement, name: string): Promise<Island | null> {
	const bundle = DEMO_BUNDLES[name]
	if (!bundle) return null
	const island = new Island({
		container,
		onEvent: (event) => {
			/* The host tier computes what the declarative tier cannot, then
			   speaks back through the root's DECLARED contract. */
			if (event.send === 'toggle-menu') {
				const open = island.getState().open === true
				void island
					.messageRouter()
					.deliver({ send: 'set-open', payload: { open: !open } }, 'menu-island')
			}
			if (event.send === 'increment') {
				const count = Number(island.getState().count ?? 0)
				void island
					.messageRouter()
					.deliver({ send: 'set-count', payload: { count: count + 1 } }, 'counter-island')
			}
		}
	})
	const attached = await island.hydrate(bundle)
	if (attached === 0) console.warn(`[docs] demo "${name}" hydrated zero listeners - stale markup?`)
	return island
}
