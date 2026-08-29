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
 *
 * `validateRegistry` runs at module load rather than in a test. A unit that
 * cannot render should fail when the package is built, not when a page is
 * opened — and the state contract in particular is worth failing on, because
 * every state it checks is invisible in a screenshot of the resting component.
 */

import type { UnitDef, UnitRegistry } from '@myavenceo/aven-vibes'
import { registryStyles, validateRegistry } from '@myavenceo/aven-vibes'

import button from './brand/units/button.json' with { type: 'json' }
import footer from './brand/units/footer.json' with { type: 'json' }
import logo from './brand/units/logo.json' with { type: 'json' }
import navLink from './brand/units/nav-link.json' with { type: 'json' }
import navbar from './brand/units/navbar.json' with { type: 'json' }

const documents = [button, logo, navLink, navbar, footer] as unknown as UnitDef[]

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
