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

/** Every unit avenCEO defines, keyed by name. What a `$use` resolves against. */
export const actors: ActorRegistry = Object.fromEntries(documents.map((u) => [u.name, u]))

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
export type Supersession = {
	/** The unit that replaces it, and the variant if the mapping needs one. */
	unit: string
	as?: string
	/** Why it is not a straight swap, where it is not. */
	note?: string
}

/**
 * Every legacy class, and what replaces it.
 *
 * Measured across all four surfaces rather than remembered — the website, the
 * checkout at my.aven.ceo, avenID, and the Tauri app. That measurement changed
 * the plan twice.
 *
 * It found that CHECKOUT is the most design-system-adopted surface in the
 * estate, and adopted entirely on this vocabulary: `panel`, `well`, `steps`,
 * `eyebrow`, `mark`, `digits`, `alert`. So these classes cannot be deleted as
 * the website migrates — the migration has two consumers, and untying one
 * without the other breaks the one that was doing the right thing.
 *
 * And it found eight classes nothing calls at all, which are deleted rather
 * than mapped. Four of them are the logo's own parts, which nothing uses
 * because the site header never adopted the logo unit: it draws a bare `<img>`
 * with `size-7 shrink-0`. A class emitted for a unit nobody uses is a class
 * with a plan, not a caller.
 */
export const SUPERSEDES: Record<string, Supersession> = {
	/*
	 * SAME-NAME replacements. A unit that takes the name of the legacy class it
	 * replaces is the normal migration path — `btn` becomes `btn`. They are
	 * listed anyway, because the alternative to listing them is a gate that
	 * cannot tell them from an ACCIDENT.
	 *
	 * The accident is real and cost a day: a unit defined as `app-shell` took a
	 * name six surfaces already used to mean "the page wrapper", and silently
	 * restyled every one of them into a two-column grid. The class resolved, the
	 * CSS was valid, and the docs page rendered with its content pushed 700px
	 * right. Nothing could report it, because "took the name deliberately" and
	 * "took the name by accident" look identical to a compiler.
	 *
	 * So intent is written down, and `tests/collisions.test.ts` fails on any unit
	 * class that shadows a legacy class without an entry here.
	 */
	btn: { unit: 'btn', note: 'same name, deliberately — the unit IS the replacement.' },
	card: { unit: 'card', note: 'same name, deliberately.' },
	field: { unit: 'field', note: 'same name, deliberately.' },
	logo: { unit: 'logo', note: 'same name, deliberately.' },
	'logo--mark': {
		unit: 'logo',
		as: 'mark',
		note: 'the legacy modifier and the unit variant are the same thing.'
	},
	'logo--wordmark': {
		unit: 'logo',
		as: 'wordmark',
		note: 'the legacy modifier and the unit variant are the same thing.'
	},
	step: { unit: 'step', note: 'same name, deliberately.' },

	/* Type — one unit, one axis, nine answers. */
	title: { unit: 'text', as: 'title' },
	'section-title': { unit: 'text', as: 'section-title' },
	lede: {
		unit: 'prose',
		as: 'lead',
		note: 'prose owns the measure; the old class did not have one.'
	},
	meta: { unit: 'text', as: 'meta' },
	'mono-meta': { unit: 'text', as: 'mono-meta' },
	digits: { unit: 'text', as: 'digits' },
	eyebrow: { unit: 'text', as: 'eyebrow' },
	'eyebrow-quiet': { unit: 'text', as: 'eyebrow-quiet' },
	label: { unit: 'field', as: 'label', note: 'a label belongs to a field, not to the page.' },

	/* Boxes — three of them differed only in radius, padding and ground. */
	panel: { unit: 'surface', as: 'lg' },
	well: { unit: 'surface', as: 'sunken' },
	chip: { unit: 'badge' },

	/* Structure. */
	'app-shell': {
		unit: 'section',
		note: 'the shell is a section with no rule and the page ground.'
	},
	'section-band': {
		unit: 'section',
		note: 'a padded section with a bottom rule — which is what `section` IS. NOT `section--ground-band`: that variant paints the teal ground and the band foreground, while the legacy class only ever set padding and a border. The two were matched on their names, and migrating on that mapping put page ink on a teal band at 1.18:1 across three routes.'
	},
	steps: { unit: 'step', note: 'the rail is the container; `step` is the stage on it.' },

	/* Controls and feedback. */
	ghost: { unit: 'btn', as: 'ghost' },
	alert: {
		unit: 'toast',
		as: 'placement-inline',
		note: 'Was the one blocker both surfaces shared. A toast is transient and a page alert is not — an error the user must act on stays beside the thing that failed, and a toast that vanishes takes its instruction with it. `placement: inline` is that distinction, and it decides the ROLE too: inline is `role=alert` and interrupts, floating is `role=status` and does not.'
	},
	mark: {
		unit: 'logo',
		as: 'mark',
		note: "checkout and avenID use `mark` for the brand image at the top of a trust screen — which is `flow-card`'s `crest` slot holding a `logo`."
	},

	/* The logo\'s own parts, which the logo unit now owns. */
	'logo-mark': { unit: 'logo' },
	'logo-wordmark': { unit: 'logo' },
	'logo-word-aven': { unit: 'logo' },
	'logo-word-ceo': { unit: 'logo' }
}

/**
 * Legacy classes nothing calls, on any surface.
 *
 * Deletable the moment someone regenerates the component map. Kept as a list
 * rather than simply removed so the next measurement can tell "gone because it
 * was replaced" from "gone because it was never used".
 */
export const UNCALLED: string[] = [
	/*
	 * MEASURED across ALL FOUR surfaces, not one. That distinction is the whole
	 * value of this list, and getting it wrong is how a migration breaks three
	 * products at once.
	 *
	 * The previous contents were counted on the website alone and listed eight
	 * classes. Six of them had live callers elsewhere — `title` (1 in the app),
	 * `lede` (2 on the website itself), and the four `logo-*` parts (34 between
	 * them). Acting on that list would have deleted classes with 39 call sites
	 * behind them.
	 *
	 * Ten more classes read as dead from the website and are not: `panel` (9),
	 * `mark` (9), `alert` (7), `mono-meta` (13, all in the Tauri app), `digits`
	 * (4), `well` (3), `steps` (2), `ghost` (2). Checkout is the most
	 * design-system-adopted surface in the estate and it is adopted entirely on
	 * THESE classes, so a website-only count says the opposite of the truth.
	 *
	 * Reproduce before trusting it:
	 *   grep for `class="..."` containing the bare class name across
	 *   brands/CEO/apps/website/src, avenOS/services/checkout/src,
	 *   avenOS/services/identity/src and avenOS/app/src.
	 *
	 * 172 call sites remain across 20 classes. These two are the only ones at
	 * zero everywhere, and therefore the only ones deletable today.
	 */
	'label',
	'chip'
]

/* ------------------------------------------------------------------ aliases
 * The pre-rename names, kept so a consumer that still says "unit" compiles.
 *
 * The engine does exactly this for `UnitDef`/`UnitRegistry`, and for the same
 * reason: the taxonomy changing is not a good enough reason to break a build
 * that has not caught up yet. New code uses the actor names; these go when no
 * caller is left. */

/** @deprecated use `actors` */
export const units = actors
/** @deprecated use `actorStyles` */
export const unitStyles = actorStyles
/** @deprecated use `actorNames` */
export const unitNames = actorNames
