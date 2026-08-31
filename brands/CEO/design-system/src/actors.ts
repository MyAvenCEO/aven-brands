/**
 * THE ACTOR LIBRARY — avenCEO's components, as data.
 *
 * ACTOR, not unit. The engine renamed the primitive: an `ActorDef` is the
 * class, an `ActorInstance` is the running thing, and `ActorInterface` is the
 * contract between them. This package kept saying "unit" while importing
 * `ActorDef`, which made the taxonomy read as two concepts where there is one.
 * `UnitDef` and friends survive upstream only as `@deprecated` aliases, so the
 * name was already the old one. The deprecated exports at the foot of this
 * file play the same role here, and for the same reason: a rename must not
 * strand a consumer.
 *
 * Each actor is a JSON document declaring its interface, its structure, its
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
 * The old classes are GONE. `components.avenceo.json` carried 29 of them while
 * 222 call sites across the website, the checkout, avenID and the app still
 * named them; that count reached zero and the map was deleted rather than left
 * deprecated. What the file keeps is the layout primitives, which are not a
 * legacy vocabulary but the shapes actors compose inside.
 *
 * `validateRegistry` runs at module load rather than in a test. A unit that
 * cannot render should fail when the package is built, not when a page is
 * opened — and the state contract in particular is worth failing on, because
 * every state it checks is invisible in a screenshot of the resting component.
 */

import type { ActorDef, ActorRegistry } from '@myavenceo/aven-vibes'
import { registryStyles, validateRegistry } from '@myavenceo/aven-vibes'

import accordion from './brand/actors/accordion.json' with { type: 'json' }
import avatar from './brand/actors/avatar.json' with { type: 'json' }
import badge from './brand/actors/badge.json' with { type: 'json' }
import button from './brand/actors/button.json' with { type: 'json' }
import card from './brand/actors/card.json' with { type: 'json' }
import claimCard from './brand/actors/claim-card.json' with { type: 'json' }
import company from './brand/actors/company.json' with { type: 'json' }
import cost from './brand/actors/cost.json' with { type: 'json' }
import emph from './brand/actors/emph.json' with { type: 'json' }
import emptyState from './brand/actors/empty-state.json' with { type: 'json' }
import field from './brand/actors/field.json' with { type: 'json' }
import flowCard from './brand/actors/flow-card.json' with { type: 'json' }
import flowNode from './brand/actors/flow-node.json' with { type: 'json' }
import footer from './brand/actors/footer.json' with { type: 'json' }
import gateCard from './brand/actors/gate-card.json' with { type: 'json' }
import hero from './brand/actors/hero.json' with { type: 'json' }
import homeHero from './brand/actors/home-hero.json' with { type: 'json' }
import icon from './brand/actors/icon.json' with { type: 'json' }
import logo from './brand/actors/logo.json' with { type: 'json' }
import media from './brand/actors/media.json' with { type: 'json' }
import mediaCard from './brand/actors/media-card.json' with { type: 'json' }
import mediaFrame from './brand/actors/media-frame.json' with { type: 'json' }
import modal from './brand/actors/modal.json' with { type: 'json' }
import navLink from './brand/actors/nav-link.json' with { type: 'json' }
import navMenu from './brand/actors/nav-menu.json' with { type: 'json' }
import navbar from './brand/actors/navbar.json' with { type: 'json' }
import own from './brand/actors/own.json' with { type: 'json' }
import pair from './brand/actors/pair.json' with { type: 'json' }
import paren from './brand/actors/paren.json' with { type: 'json' }
import paymentFrame from './brand/actors/payment-frame.json' with { type: 'json' }
import priceTier from './brand/actors/price-tier.json' with { type: 'json' }
import promptBar from './brand/actors/prompt-bar.json' with { type: 'json' }
import prose from './brand/actors/prose.json' with { type: 'json' }
import rowList from './brand/actors/row-list.json' with { type: 'json' }
import ruleLabel from './brand/actors/rule-label.json' with { type: 'json' }
import section from './brand/actors/section.json' with { type: 'json' }
import segment from './brand/actors/segment.json' with { type: 'json' }
import settingRow from './brand/actors/setting-row.json' with { type: 'json' }
import shift from './brand/actors/shift.json' with { type: 'json' }
import sidebar from './brand/actors/sidebar.json' with { type: 'json' }
import skeleton from './brand/actors/skeleton.json' with { type: 'json' }
import skillCard from './brand/actors/skill-card.json' with { type: 'json' }
import socialRow from './brand/actors/social-row.json' with { type: 'json' }
import spinner from './brand/actors/spinner.json' with { type: 'json' }
import stat from './brand/actors/stat.json' with { type: 'json' }
import step from './brand/actors/step.json' with { type: 'json' }
import surface from './brand/actors/surface.json' with { type: 'json' }
import table from './brand/actors/table.json' with { type: 'json' }
import tabs from './brand/actors/tabs.json' with { type: 'json' }
import text from './brand/actors/text.json' with { type: 'json' }
import threadItem from './brand/actors/thread-item.json' with { type: 'json' }
import toast from './brand/actors/toast.json' with { type: 'json' }
import trust from './brand/actors/trust.json' with { type: 'json' }
import viewerFrame from './brand/actors/viewer-frame.json' with { type: 'json' }
import voicePill from './brand/actors/voice-pill.json' with { type: 'json' }
import workbench from './brand/actors/workbench.json' with { type: 'json' }

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
	segment,
	socialRow,
	hero,
	media,
	stat,
	skillCard,
	claimCard,
	flowCard,
	priceTier,
	rowList,
	mediaCard,
	mediaFrame,
	pair,
	flowNode,
	workbench,
	settingRow,
	threadItem,
	viewerFrame,
	voicePill,
	gateCard,
	promptBar,
	paymentFrame,
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
	avatar,
	emptyState,
	spinner,
	skeleton,
	step,
	logo,
	navLink,
	navbar,
	navMenu,
	footer,
	/* The landing page's editorial devices — leaves, appended after the
	   boxes so their declarations win ties inside the components layer. */
	ruleLabel,
	paren,
	emph,
	/* The landing page's own bands, composited from the primitives above —
	   appended after `surface`, `pair` and the layouts so their part
	   declarations win ties inside the components layer, the way the page's
	   unlayered CSS used to win over everything. */
	trust,
	cost,
	company,
	shift,
	own,
	homeHero
] as unknown as ActorDef[]

/**
 * THE CONTAINER CONTRACT, applied once instead of written 34 times.
 *
 * A composite that establishes an inline-size container needs four things
 * together, and three of them are the same in every case:
 *
 *   container-type: inline-size   the containment being asked for
 *   container-name: <its name>    so a descendant can query THIS box
 *   inline-size: 100%             REQUIRED, not a preference — containment
 *                                 makes the box's width independent of its
 *                                 contents, so a container with no width of
 *                                 its own has nothing to size from and
 *                                 collapses to zero
 *   min-inline-size: 0            so a grid or flex item can actually shrink
 *
 * They were spelled out in all 34, which is 235 of the library's 488 sizing
 * declarations restated, and three contract tests existed to check that every
 * actor had remembered them. A rule the system can APPLY does not need a test
 * that asks whether you remembered it.
 *
 * An actor that means something different still says so: `price-tier` sets its
 * own `15rem`, `modal` its `min(34rem, calc(100% - 2rem))`. Explicit values are
 * never overwritten — this fills the blanks, it does not impose.
 */
function withContainerContract(doc: any): any {
	const base = doc?.styling?.base
	if (base?.containerType !== 'inline-size') return doc
	base.containerName ??= doc.name
	base.inlineSize ??= '100%'
	base.minInlineSize ??= '0'
	return doc
}

/** Every unit avenCEO defines, keyed by name. What a `$use` resolves against. */
export const actors: ActorRegistry = Object.fromEntries(
	documents.map(withContainerContract).map((u) => [u.name, u])
)

validateRegistry(actors)

/**
 * The library's CSS, as the flat `components` map the style engine consumes.
 *
 * Compiled once from the declarations rather than per instance: a unit's CSS
 * does not depend on where it is placed, which is the whole reason a design
 * system can have a stylesheet at all.
 */
export const actorStyles = registryStyles(actors)

/** The unit names, so a docs surface can list them without importing the JSON. */
export const actorNames = Object.keys(actors)

/*
 * SUPERSEDES and UNCALLED lived here: a map from each legacy class to the actor
 * that replaced it, and the list of the ones nothing called any more. They made
 * a 222-call-site migration mechanical, and the docs page drew a Migration tab
 * from them.
 *
 * They are gone because the migration is finished. Every surface — the website,
 * the checkout at my.aven.ceo, avenID and the app — renders from actors, the
 * superseded `components` map in `components.avenceo.json` is deleted, and a
 * map from names that no longer exist to names that do is not a record, it is
 * scaffolding that outlived its building.
 */

/*
 * The `units` / `unitStyles` / `unitNames` aliases stood here through the actor
 * rename so a consumer that had not caught up would still compile. avenOS took
 * `actors` directly and the website was renamed with it, so nothing is left to
 * strand and the aliases go with the rest of the transition layer.
 */
