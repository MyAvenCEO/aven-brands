/**
 * THE skill catalog — one entry per skill, and the only place a skill's
 * identity is decided.
 *
 * The website and the app both had a list of skills, and the lists disagreed:
 * the website sold `email-ingestor`, `document-extractor`, `brain-memorizer`;
 * the app ran `inbox`, `docs`, `brain`. Same six things, two vocabularies, no
 * way to notice when one side gained a skill the other had never heard of.
 *
 * This file holds what both sides genuinely share — identity, name, tagline,
 * the plan it comes with — and nothing else. It deliberately does NOT hold:
 *
 *   · the marketing content (hero copy, value stack, the founder's letter),
 *     which is localized JSON and belongs to the website;
 *   · the workflows (nodes, contracts, machines, views), which are runtime
 *     and belong to the app.
 *
 * Those are two FACETS of one skill, not two skills, so each consumer attaches
 * its own facet by `id`. What makes this a single source of truth rather than
 * a third list is the pair of guards below: a facet that names a skill the
 * catalog does not know is a mistake, and so is a catalog entry no one
 * implements.
 */
import { factsDocument } from './brand-data.js'

/** Which tier a skill first appears in; higher tiers include it. */
export type SkillPlan = 'aven-ceo'

export interface SkillEntry {
	/** The canonical id. The app's registry and the website's route both use it. */
	id: string
	/** Display name, in the product's own words. */
	name: string
	/** One line: what it does for you. The website's `oneLineCopy`. */
	tagline: string
	/** The tier it comes with. */
	plan: SkillPlan
	/** Announced but not built. The website shows it; the app has no workflow. */
	comingSoon?: boolean
	/**
	 * The website's URL slug, when it differs from the id. Marketing named
	 * several of these before the app did, and the URLs are public — so the
	 * difference is recorded rather than renamed away.
	 */
	slug?: string
}

/**
 * The catalog. Ordered as the marketplace lists it: what you get first, first.
 */
export const CATALOG: SkillEntry[] = factsDocument.skills.catalog as SkillEntry[]

/** By canonical id. */
export function skillById(id: string): SkillEntry | undefined {
	return CATALOG.find((s) => s.id === id)
}

/** By the website's URL slug, which falls back to the id. */
export function skillBySlug(slug: string): SkillEntry | undefined {
	return CATALOG.find((s) => (s.slug ?? s.id) === slug)
}

/** The public URL slug for a skill — the id unless marketing named it first. */
export function slugOf(entry: SkillEntry): string {
	return entry.slug ?? entry.id
}

/**
 * Which catalog ids a set of implementations covers, and which it invents.
 * The guard both consumers run in their tests: `unknown` must be empty, or
 * someone has a skill the catalog has never heard of.
 */
export function reconcile(ids: string[]): {
	known: string[]
	unknown: string[]
	missing: string[]
} {
	const catalogIds = new Set(CATALOG.map((s) => s.id))
	const given = new Set(ids)
	return {
		known: ids.filter((id) => catalogIds.has(id)),
		unknown: ids.filter((id) => !catalogIds.has(id)),
		missing: CATALOG.filter((s) => !given.has(s.id)).map((s) => s.id)
	}
}
