import { describe, expect, test } from 'bun:test'
import {
	canBuyMore,
	isSinglePurchase,
	PLANS,
	plan,
	planIdOf,
	planIncludes,
	planOrder,
	planTexts,
	priceLabel
} from '../src/pricing.js'

/**
 * The pricing invariants, pinned.
 *
 * Two repositories buy from this file — the id service seeds its Polar
 * products from it and the app labels its billing pane from it — so a plan
 * renamed, repriced or re-billed here changes what people are charged
 * somewhere else. These are the facts that must not move silently.
 */

describe('the catalogue', () => {
	test('sells exactly two things: avenNAME once, avenCEO monthly', () => {
		expect(plan('aven-name').name).toBe('avenNAME')
		expect(plan('aven-name').eurPrice).toBe(25)
		expect(plan('aven-name').billing).toBe('once')

		expect(plan('aven-ceo').name).toBe('avenCEO')
		expect(plan('aven-ceo').eurPrice).toBe(377)
		expect(plan('aven-ceo').billing).toBe('monthly')

		// avenCOOP is a relationship you apply for, not a product you book.
		expect(plan('aven-coop').applyOnly).toBe(true)
	})

	test('the avenme tier is gone — one CEO, not a personal and a company one', () => {
		expect(planOrder).toEqual(['aven-name', 'aven-ceo', 'aven-coop'])
		expect(PLANS.some((p) => (p.id as string) === 'avenme')).toBe(false)
	})

	test('every legacy wire key still resolves, and nothing else does', () => {
		// Polar products, subscription rows and old links carry the pre-rename
		// spellings; readers normalise through planIdOf, writers never emit them.
		expect(planIdOf('avenid')).toBe('aven-name')
		expect(planIdOf('avenceo')).toBe('aven-ceo')
		expect(planIdOf('avencoop')).toBe('aven-coop')
		// The current spellings pass straight through.
		for (const id of planOrder) expect(planIdOf(id)).toBe(id)
		// avenme was consolidated away and has no successor — an order for it
		// is history, not a product someone may be handed.
		expect(planIdOf('avenme')).toBeNull()
		expect(planIdOf('')).toBeNull()
		expect(planIdOf(null)).toBeNull()
		expect(planIdOf('nonsense')).toBeNull()
	})

	test('avenNAME carries no skills — it sells the name, not the CEO', () => {
		expect(PLANS.find((p) => p.id === 'aven-name')?.features.every((f) => !f.skill)).toBe(true)
		expect(planIncludes('aven-name', 'aven-ceo')).toBe(false)
		expect(planIncludes('aven-coop', 'aven-ceo')).toBe(true)
	})
})

describe('how often one account may buy', () => {
	test('every plan is single-purchase today', () => {
		for (const p of PLANS) {
			expect(p.maxPerAccount).toBe(1)
			expect(isSinglePurchase(p.id)).toBe(true)
		}
	})

	test('canBuyMore gates the first purchase in and the second out', () => {
		expect(canBuyMore('aven-name', 0)).toBe(true)
		expect(canBuyMore('aven-name', 1)).toBe(false)
		expect(canBuyMore('aven-ceo', 0)).toBe(true)
		expect(canBuyMore('aven-ceo', 1)).toBe(false)
	})
})

describe('what a buyer reads', () => {
	test('the one-off never prints a monthly cadence', () => {
		expect(priceLabel(plan('aven-name'))).toBe('25 € einmalig')
		expect(priceLabel(plan('aven-ceo'))).toBe('377 €/Monat')
	})

	test('both languages carry every feature line', () => {
		for (const p of PLANS) {
			for (const lang of ['de', 'en'] as const) {
				const texts = planTexts(p.id, lang)
				expect(texts.features).toHaveLength(p.features.length)
				expect(texts.role.length).toBeGreaterThan(0)
			}
		}
	})

	test('feature titles stay inside the provider’s 42-char benefit limit', () => {
		for (const p of PLANS) {
			for (const lang of ['de', 'en'] as const) {
				for (const f of planTexts(p.id, lang).features) {
					expect(f.title.length).toBeLessThanOrEqual(42)
				}
			}
		}
	})
})
