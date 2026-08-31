/**
 * The products — one source of truth for pricing AND the skills marketplace.
 *
 * NOT a ladder. avenNAME is the door: you secure your unique
 * avenCEO name for a year, take your place in the waitlist, and — once
 * invited — test‑ride your avenCEO live with a MIND‑credit grant. avenCEO is the one
 * AI‑CEO for your LIFE and your COMPANY at once: inbox, post, documents and
 * the daily organisation on the personal side; pre‑accounting, finances,
 * website, shop and blog on the company side. There is no longer a split
 * between a "personal" and a "company" CEO — it is one CEO, one per idea, the
 * single point every employee, customer and partner talks to. avenCOOP is not
 * a bigger plan but a different relationship: YOU build your own sovereign
 * Aven BUSINESS — your Skillbundle, sold under your name on our
 * infrastructure — and we sit next to you with hands-on support while you
 * do. We do not build it for you and we take no equity; the only thing we
 * take is a share of the revenue it makes. You APPLY rather than book.
 *
 * avenNAME is a prerequisite, not a part of any plan: every avenCEO
 * has its own name, secured with avenNAME before the avenCEO itself opens.
 *
 * There are exactly TWO things to buy — avenNAME once, avenCEO weekly — and
 * one of each per account: see `maxPerAccount`.
 *
 * The plan ids are WIRE KEYS (API tier enum, Polar `metadata.tier`, our own
 * `subscriptions.tier` and `name_holds.tier` columns, app billing, skills
 * catalogue). They were `avenid`/`avenceo`/`avencoop` while the display names
 * drifted underneath them (avenID → "Secure Name + Testride"; avenFOUNDER →
 * avenCEO); that gap is now closed — key and name say the same thing, in the
 * one kebab-case spelling: `aven-name`, `aven-ceo`, `aven-coop`.
 *
 * Renaming a wire key means rewriting data that already exists, so every
 * reader normalises through `planIdOf` and the old spellings live on in
 * `LEGACY_PLAN_IDS` — a Polar product created as `avenid`, a subscription row
 * written last month and a `?tier=avenceo` link all still resolve. Nothing
 * WRITES a legacy key any more.
 *
 * The old `avenme` tier is GONE, consolidated into avenCEO: there is one CEO,
 * not a personal one and a company one.
 *
 * The five-role ladder (avenCOO/CMO/CTO/CPO/CEO) and the "Sparks" are gone:
 * the company of the future is 1 human (vision) + 1 avenCEO (execution),
 * and that needs no second noun.
 *
 * The skills page filters by THIS, not by publisher: what matters to a buyer
 * is which plan a skill comes with, not which of us built it.
 *
 * This file is pure data + pure helpers, importable from OUTSIDE SvelteKit —
 * it lives in the brand package (`@myavenceo/aven-ceo/pricing`) as the single
 * SSOT: the website renders its product pages from it, the id service syncs
 * its Polar products from it (tier → `metadata.tier`, gross price → the
 * tax-inclusive price amount), and the app's billing pane labels from it.
 * Keep `$lib`/Svelte imports out; anything that needs them lives in the
 * website's plans.ts.
 */
import { factsDocument } from './brand-data.js'

export type PlanId = 'aven-name' | 'aven-ceo' | 'aven-coop'

/**
 * A line on a plan card — and a REAL benefit at the payment provider: every
 * feature becomes its own Polar benefit, titled by `title`. That is why the
 * title is hard-capped at 42 chars (Polar's benefit description limit) and
 * why the longer promise lives in `description`, which only our own surfaces
 * print (the muted subline on the cards) — never the provider. Where a
 * feature IS a shipped skill, `skill` names it and links to its page; the
 * slug stays a plain string: `skills/loader` imports THIS file, so an import
 * the other way would close a cycle.
 */
export interface PlanFeature {
	/** Short punchy title, HARD ≤42 chars — it IS the Polar benefit title. */
	title: string
	/** One warm sentence expanding the title's promise — our surfaces only. */
	description: string
	/** Set where the feature is a shipped skill: the skill page slug. */
	skill?: string
	/** Set where the feature points at a page instead. */
	href?: string
}

export interface Plan {
	id: PlanId
	name: string
	/** One line on what this product takes off your desk. */
	role: string
	/**
	 * The transformation, not the feature list: 1–2 warm sentences on what
	 * this tier changes in the buyer's life. Printed between the role line
	 * and the hard facts — people buy the transformation, never the product.
	 */
	pitch: string
	/**
	 * Who a plan is bought FOR. One avenCEO per idea — life and company in one.
	 * Left unset now that the person/company split is gone; kept on the type
	 * because avenCOOP and future products may still want the badge.
	 */
	per?: 'person' | 'company'
	/**
	 * The price in euro, GROSS (incl. VAT) — the number a person pays. Monthly
	 * for every tier except avenNAME, which is billed once — read `billing`
	 * before you print a `/m`.
	 */
	eurPrice: number
	/**
	 * The price this one is discounted FROM, when it is on a limited offer.
	 *
	 * `eurPrice` stays the number a person actually pays; this is the number
	 * struck through beside it. Absent on a plan that is simply priced, which
	 * is how a surface knows there is nothing to strike — an offer whose window
	 * has to be remembered somewhere else is an offer that outlives it.
	 */
	listEurPrice?: number
	billing: 'once' | 'weekly' | 'monthly'
	/**
	 * How many of this product ONE account may ever hold. `1` on every plan
	 * today: avenNAME is bought once and never again (one name per human),
	 * and avenCEO is one live subscription — booking a second while the first
	 * stands is refused, not stacked. This is the single knob that opens
	 * multi-avenCEO selling later: raise the number here and the surfaces
	 * that read it (the app's billing pane, the id service's subscribe guard)
	 * follow, because none of them counts on their own.
	 */
	maxPerAccount: number
	/**
	 * The share of the revenue your Aven produces that we keep — every payment
	 * fee (Stripe, Polar & Co.) already INSIDE it, not on top. It is the only
	 * thing we take: no equity, no second line. 0 on the tiers that sell you
	 * nothing.
	 */
	revenueSharePct: number
	/**
	 * What the share already contains, when it is more than the default
	 * transaction-fee note — avenCOOP's 30 % swallows app-store fees & co.
	 * because we sell as the official merchant of record.
	 */
	revenueShareNote?: string
	/** avenCOOP is not bookable: you apply and we decide together. */
	applyOnly?: boolean
	/**
	 * The early-adopter BETA deal: a percentage off `eurPrice` for the first
	 * N months. `eurPrice` stays the regular price — the discount is a
	 * limited window on top of it, never a second price to maintain.
	 */
	beta?: { discountPct: number; months: number }
	/**
	 * Included MIND credits and the period they land on. `per: 'once'` is a
	 * fixed early-adopter grant (avenNAME); `per: 'week'` is the allotment that
	 * lands with every weekly cycle of a subscription. Replaces the old
	 * hours/day + per-minute model — credits are a promise about ONE number.
	 */
	runtime?: { mindCredits: number; per: 'once' | 'week' }
	/** What this product does. Skills cascade: avenCOOP carries avenCEO's. */
	features: PlanFeature[]
	/** Marks the product we lead with. */
	highlight?: boolean
}

/** Display order. Plans are NOT cumulative — see `planIncludes`. */
export const PLANS: Plan[] = factsDocument.pricing.plans as Plan[]

export const planOrder: PlanId[] = PLANS.map((p) => p.id)

/**
 * The wire keys as they were spelled before the kebab-case rename, and the
 * ids they mean now. Read-only history: they are accepted from stored rows,
 * provider metadata and inbound links, and never written back.
 *
 * `avenme` has no successor — the tier was consolidated into avenCEO and any
 * row still carrying it is a historical purchase, not a product. It is
 * deliberately absent, so `planIdOf('avenme')` is `null` rather than a
 * silent upgrade to something the buyer never bought.
 */
export const LEGACY_PLAN_IDS: Readonly<Record<string, PlanId>> = Object.freeze(
	factsDocument.pricing.legacyPlanIds as Record<string, PlanId>
)

/**
 * A plan id from any source — our own current spelling, a legacy spelling out
 * of the database or the payment provider, or junk. `null` means "no plan we
 * sell", which callers must handle: an order for a retired tier is still a
 * real order.
 */
export function planIdOf(value: string | null | undefined): PlanId | null {
	if (!value) return null
	if (planOrder.includes(value as PlanId)) return value as PlanId
	return LEGACY_PLAN_IDS[value] ?? null
}

export function plan(id: PlanId): Plan {
	// biome-ignore lint/style/noNonNullAssertion: PlanId is closed over PLANS.
	return PLANS.find((p) => p.id === id)!
}

/**
 * Whether an account holding `held` of this plan may buy one more. Every
 * surface that gates a purchase asks THIS instead of counting for itself —
 * the app's billing pane hides the booking button by it, the id service
 * refuses the checkout by it — so raising `maxPerAccount` to sell several
 * avenCEO subscriptions is a one-number change, not a hunt through three
 * codebases.
 *
 * `held` means what standing means for the plan: names already owned for
 * avenNAME, subscriptions not in an ended state for avenCEO.
 */
export function canBuyMore(id: PlanId, held: number): boolean {
	return held < plan(id).maxPerAccount
}

/** `true` where a plan may be held exactly once — the state today for all of
 * them. Surfaces use it to say "einmalig" rather than to compute a limit. */
export function isSinglePurchase(id: PlanId): boolean {
	return plan(id).maxPerAccount === 1
}

/**
 * Which plan's SKILLS a plan carries. avenCEO is the one product that ships
 * every life‑ and company‑skill; avenCOOP carries everything avenCEO does.
 * avenNAME carries nothing.
 */
const SKILL_CASCADE: PlanId[] = ['aven-ceo', 'aven-coop']
export function planIncludes(selected: PlanId, needed: PlanId): boolean {
	if (selected === needed) return true
	const s = SKILL_CASCADE.indexOf(selected)
	const n = SKILL_CASCADE.indexOf(needed)
	return s >= 0 && n >= 0 && n < s
}

/** "pro Mensch" · "pro Firma" — the role a plan is bought for. */
export function perLabel(p: Plan): string | null {
	if (p.per === 'person') return 'pro Mensch'
	if (p.per === 'company') return 'pro Firma'
	return null
}

/** German price formatting: 1.234,50 €, cents only when there are any. */
export function euro(amount: number): string {
	// Whole euros stay whole (25 €, 385 €); a half-euro BETA price prints its
	// cents in full (188,50 €), never as a stray "188,5".
	const cents = Number.isInteger(amount) ? 0 : 2
	return amount.toLocaleString('de-DE', {
		minimumFractionDigits: cents,
		maximumFractionDigits: cents
	})
}

/** What an early adopter actually pays during the BETA window. */
export function betaPrice(p: Plan): number | null {
	if (!p.beta) return null
	return Math.round(p.eurPrice * (1 - p.beta.discountPct / 100) * 100) / 100
}

/** "25 € einmalig" · "99 €/Woche" · "987 €/Monat" — the whole price in one string. */
export function priceLabel(p: Plan): string {
	if (p.billing === 'once') return `${euro(p.eurPrice)} € einmalig`
	if (p.billing === 'weekly') return `${euro(p.eurPrice)} €/Woche`
	return `${euro(p.eurPrice)} €/Monat`
}

/**
 * The cadence and the VAT clause, on the same line as the number — a price
 * reads as one statement, not as a label stacked on a figure.
 */
export function priceSuffix(p: Plan): string {
	if (p.billing === 'once') return 'einmalig · inkl. USt.'
	if (p.billing === 'weekly') return '/Woche · inkl. USt.'
	return '/Monat · inkl. USt.'
}

/**
 * The one VAT sentence, spelled once. "Netto" alone does not carry it — the
 * explicit clause does.
 */
export const VAT_NOTE: string = factsDocument.pricing.vatNote

// ---------------------------------------------------------------------------
// Bilingual texts. German is the AUTHORED language — the strings on the PLANS
// above — and the English translations live right next to them so both faces
// of every product come from this one file: the website localizes its cards
// from here, and the Polar product descriptions are built from the German
// originals (Polar's Localized Checkout translates the checkout chrome, not
// our copy).

export type PlanLang = 'de' | 'en'

/** A feature's two lines in one language: the punchy title (≤42 chars) and
 * the one-sentence promise underneath. */
export interface PlanFeatureText {
	title: string
	description: string
}

/** Per plan: the role line, the pitch, and the feature texts, in feature order. */
export interface PlanTexts {
	role: string
	pitch: string
	features: PlanFeatureText[]
}

/** The English translations, keyed like PLANS; features in feature order. */
const PLAN_TEXTS_EN: Record<PlanId, PlanTexts> = {
	'aven-name': {
		role: 'Secure your avenCEO name — and test-drive the full avenCEO with 100 MIND credits once you are invited.',
		pitch:
			'Your avenCEO exists exactly once — and it carries your name. Secure it for a year before someone else does, and take it for a test ride with 100 MIND credits once you are invited.',
		features: [
			{
				title: 'Your avenCEO name for 1 year',
				description: 'Your unique name is reserved for you for a year — nobody else can carry it.'
			},
			{
				title: 'Your place on the waiting list',
				description: 'Your spot in line is fixed — the moment we open, it is your turn.'
			},
			{
				title: 'Your profile in the aven Marketplace',
				description: 'Present your vision or idea with your own profile — visible to every Aven.'
			}
		]
	},
	'aven-ceo': {
		role: 'Your AI‑CEO — for your life and your company, in one.',
		pitch:
			'You bring the vision — your avenCEO turns the idea into a company that runs. It works while you sleep and gets better every day. This is what founding feels like when it no longer costs an 80-hour week.',
		features: [
			{
				title: 'One inbox for everything',
				description: 'Email, mail, messages and thoughts land in one place — your Aven sorts them.'
			},
			{
				title: 'Email inbox',
				description: 'Your Aven reads along, replies in your tone and keeps your inbox empty.'
			},
			{
				title: 'Your calendar thinks ahead',
				description:
					'Appointments, travel time and buffers plan themselves — you just glance at it.'
			},
			{
				title: 'Your list sorts itself',
				description:
					'What counts today sits on top — your Aven prioritises by what is actually due.'
			},
			{
				title: 'Document management',
				description:
					'Contracts, invoices, paperwork — filed, named and found again without you searching.'
			},
			{
				title: 'Notes, contacts, relationships',
				description:
					'Your Aven remembers who is who and what connects you — nothing gets lost any more.'
			},
			{
				title: 'Links & bookmarks, findable again',
				description: 'Everything you save is back in seconds — sorted and searchable.'
			},
			{
				title: 'You decide when it counts',
				description:
					'For everything that really matters, your Aven asks you first — you keep the last word.'
			},
			{
				title: 'Pre-accounting',
				description:
					'Receipts, accounts, reconciliation — prepared for your tax advisor, no pile on the desk.'
			},
			{
				title: 'Finance dashboard and invoices',
				description:
					'You see where your company stands at any moment — and invoices write themselves.'
			},
			{
				title: 'Agent API auth proxy',
				description:
					'Your Aven uses services and APIs on your behalf — securely, without exposing your keys.'
			},
			{
				title: 'Website and landing pages',
				description:
					'Your website grows out of your vision — and stays current without you touching it.'
			},
			{
				title: 'Product checkout and shop',
				description:
					'Sell products and services directly — checkout, payment and receipts run on their own.'
			},
			{
				title: 'Blog',
				description: 'Your Aven writes and publishes in your tone — your story stays audible.'
			},
			{
				title: '2 digital postal addresses incl.*',
				description:
					'Your paper and business mail arrives digitised at your Aven — one address each, personal and business, if you need both (excl. Deutsche Post mail forwarding).'
			},
			{
				title: 'Listed in the aven Marketplace',
				description:
					'Your company is findable by customers, partners and other Avens — from day one.'
			}
		]
	},
	'aven-coop': {
		role: 'Hands-on support for your own sovereign Aven business',
		pitch:
			'You do not just want a company — you want your own Aven business. We built the infrastructure and stand beside you until your Skillbundle is live in the Marketplace. Your idea, your name, your work.',
		features: [
			{
				title: 'Hands-on until your bundle is live',
				description:
					'We work beside you while YOU build your Skillbundle — your product, your name, our infrastructure.'
			},
			{
				title: 'Selling in the aven Marketplace',
				description:
					'You sell your bundle yourself — your price, your customers, your name on the product.'
			},
			{
				title: 'Carefree billing',
				description:
					'We sell as the official merchant of record — app-store fees & co. are inside the 30 %, and you receive your payout weekly.'
			},
			{
				title: 'Sovereignty you hand on',
				description: 'Your customers keep their own keys — not you, not us.'
			},
			{
				title: 'Guidance through company formation',
				description: 'We walk you through Germany’s founding bureaucracy — GmbH or UG.'
			}
		]
	}
}

/**
 * A plan's texts in one language. DE reads straight off PLANS (the
 * originals); EN merges the translations over the feature list, so a feature
 * added before its translation lands still prints (in German) instead of
 * vanishing — the EN array is index-aligned with the plan's features.
 */
export function planTexts(id: PlanId, lang: PlanLang): PlanTexts {
	const p = plan(id)
	if (lang === 'de')
		return {
			role: p.role,
			pitch: p.pitch,
			features: p.features.map((f) => ({ title: f.title, description: f.description }))
		}
	const en = PLAN_TEXTS_EN[id]
	return {
		role: en.role,
		pitch: en.pitch,
		features: p.features.map(
			(f, i) => en.features[i] ?? { title: f.title, description: f.description }
		)
	}
}

/** A plan's feature lines flattened to their short titles, in the given language. */
export function featureLabels(id: PlanId, lang: PlanLang): string[] {
	return planTexts(id, lang).features.map((f) => f.title)
}
