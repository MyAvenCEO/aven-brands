/**
 * THE UNIT LIBRARY — avenCEO's components, as data.
 *
 * Each unit is a JSON document declaring its interface, its structure, its
 * variants and its eight states. Nothing here is TypeScript that draws
 * anything; this file collects the documents and validates them, and the engine
 * renders them.
 *
 * What this replaces, per unit:
 *
 *   btn          a CSS class with hover and disabled and nothing else. It had
 *                no focus state and no active state, on every surface, since
 *                the beginning — which the state contract catches the moment
 *                the unit is declared interactive.
 *   logo         three hand-assembled `<img>` + text pairs, each re-declaring
 *                the wordmark's own typography at the call site.
 *   navbar       three implementations: a 257-line marketing header, the
 *                avenID header, and the avenOS dashboard rail.
 *   nav-link     three different treatments of "this is the current page".
 *   site-footer  two implementations of the same legal links.
 *   text         NINE classes — title, section-title, lede, meta, mono-meta,
 *                digits and three eyebrows — that declared only type
 *                properties. They are not components, they are the answer to
 *                "how does this text read", and one `role` axis holds all nine.
 *   surface      four boxes — card, card-sm, well, panel — differing only in
 *                radius, padding and ground. `card-sm` and `well` shared three
 *                of their five declarations.
 *   step         a stage on a rail, with `step-done` folded in as its
 *                `selected` STATE. That class declared two properties and its
 *                own comment said it was "applied alongside `step`, never
 *                instead", which is a state wearing a component's name.
 *
 * The old classes are still emitted by `components.avenceo.json`, because 222
 * call sites across the website and the app still name them. They are
 * SUPERSEDED, not kept: the surface migration deletes them once the last call
 * site moves, and `SUPERSEDES` below is the map that makes that mechanical.
 *
 * `validateRegistry` runs at module load rather than in a test. A unit that
 * cannot render should fail when the package is built, not when a page is
 * opened — and the state contract in particular is worth failing on, because
 * every state it checks is invisible in a screenshot of the resting component.
 */

import type { UnitDef, UnitRegistry } from '@myavenceo/aven-vibes'
import { registryStyles, validateRegistry } from '@myavenceo/aven-vibes'

import accordion from './brand/units/accordion.json' with { type: 'json' }
import avatar from './brand/units/avatar.json' with { type: 'json' }
import badge from './brand/units/badge.json' with { type: 'json' }
import button from './brand/units/button.json' with { type: 'json' }
import card from './brand/units/card.json' with { type: 'json' }
import claimCard from './brand/units/claim-card.json' with { type: 'json' }
import emptyState from './brand/units/empty-state.json' with { type: 'json' }
import field from './brand/units/field.json' with { type: 'json' }
import flowCard from './brand/units/flow-card.json' with { type: 'json' }
import footer from './brand/units/footer.json' with { type: 'json' }
import hero from './brand/units/hero.json' with { type: 'json' }
import icon from './brand/units/icon.json' with { type: 'json' }
import logo from './brand/units/logo.json' with { type: 'json' }
import media from './brand/units/media.json' with { type: 'json' }
import modal from './brand/units/modal.json' with { type: 'json' }
import navLink from './brand/units/nav-link.json' with { type: 'json' }
import navbar from './brand/units/navbar.json' with { type: 'json' }
import prose from './brand/units/prose.json' with { type: 'json' }
import section from './brand/units/section.json' with { type: 'json' }
import select from './brand/units/select.json' with { type: 'json' }
import sidebar from './brand/units/sidebar.json' with { type: 'json' }
import skeleton from './brand/units/skeleton.json' with { type: 'json' }
import skillCard from './brand/units/skill-card.json' with { type: 'json' }
import spinner from './brand/units/spinner.json' with { type: 'json' }
import stat from './brand/units/stat.json' with { type: 'json' }
import step from './brand/units/step.json' with { type: 'json' }
import surface from './brand/units/surface.json' with { type: 'json' }
import table from './brand/units/table.json' with { type: 'json' }
import tabs from './brand/units/tabs.json' with { type: 'json' }
import text from './brand/units/text.json' with { type: 'json' }
import toast from './brand/units/toast.json' with { type: 'json' }

/*
 * Ordered by how much of the estate each one covers, measured across the
 * website, the Tauri app and avenID rather than guessed. `tabs` is here because
 * of that measurement: an earlier pass counted the website only, found zero
 * uses, and left it out — while the app and avenID had forty-seven between
 * them. A website-only count is not an estate count.
 */
const documents = [
	text,
	prose,
	surface,
	card,
	section,
	hero,
	media,
	stat,
	skillCard,
	claimCard,
	flowCard,
	button,
	badge,
	icon,
	tabs,
	field,
	toast,
	table,
	sidebar,
	modal,
	accordion,
	select,
	avatar,
	emptyState,
	spinner,
	skeleton,
	step,
	logo,
	navLink,
	navbar,
	footer
] as unknown as UnitDef[]

/** Every unit avenCEO defines, keyed by name. What a `$use` resolves against. */
export const units: UnitRegistry = Object.fromEntries(documents.map((u) => [u.name, u]))

validateRegistry(units)

/**
 * The library's CSS, as the flat `components` map the style engine consumes.
 *
 * Compiled once from the declarations rather than per instance: a unit's CSS
 * does not depend on where it is placed, which is the whole reason a design
 * system can have a stylesheet at all.
 */
export const unitStyles = registryStyles(units)

/** The unit names, so a docs surface can list them without importing the JSON. */
export const unitNames = Object.keys(units)

/**
 * Which legacy class each unit replaces.
 *
 * Written down rather than remembered, because the surface migration is a
 * find-and-replace over 222 call sites and a map is the difference between
 * that being mechanical and being archaeology. When a row's classes have no
 * remaining callers, the row and the classes both go.
 *
 * Four legacy classes are already gone rather than listed: `card-sm`,
 * `btn-secondary`, `step-done` and `bullet` appeared nowhere but in the
 * generated stylesheet — declared, emitted, and never once used by any of the
 * three surfaces.
 */
export const SUPERSEDES: Record<string, string[]> = {
	text: [
		'title',
		'section-title',
		'lede',
		'meta',
		'mono-meta',
		'digits',
		'eyebrow',
		'eyebrow-accent',
		'eyebrow-quiet'
	],
	surface: ['card', 'well', 'panel'],
	step: ['step', 'steps'],
	btn: ['btn', 'ghost'],
	logo: [],
	navbar: [],
	'nav-link': [],
	'site-footer': []
}
