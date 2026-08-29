/**
 * `@myavenceo/aven-ceo` — everything every avenCEO surface shares.
 *
 * This was two packages, `aven-brand` and `aven-skills`, always installed
 * together and always versioned in lockstep. Splitting them bought nothing and
 * cost a second publish, a second tag and a second chance to drift; the catalog
 * is a brand fact like the price list is.
 *
 * The company facts, the legal documents, the plans and the skill catalog are
 * re-exported here. The heavier or more specialised pieces keep their own
 * entry points so a consumer only pays for what it uses:
 *
 *   @myavenceo/aven-ceo             company, legal, hosts, social, skills
 *   @myavenceo/aven-ceo/pricing     the plans + their helpers
 *   @myavenceo/aven-ceo/skills      the skill catalog on its own
 *   @myavenceo/aven-ceo/tokens      the palette — the one place a hex is spelled
 *   @myavenceo/aven-ceo/generate    the emitters each repo runs
 *   @myavenceo/aven-ceo/vibes       the brand's vibes — brand style, chat, todo
 *   @myavenceo/aven-ceo/assets/*    logo.svg, favicon.svg, app-icon.svg
 */
export * from './company.js'
export * from './hosts.js'
export * from './imprint.js'
export * from './legal.js'
export * from './privacy.js'
export * from './revocation.js'
export * from './skills.js'
export * from './social-media.js'
export * from './widerruf.js'
