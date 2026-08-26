/**
 * @myavenceo/aven-brandkit — how a brand becomes CSS.
 *
 * A brand is a `Brand`: colours, scales, primitives, components. This package
 * turns one into a stylesheet, a utility layer, and a build step, and knows
 * nothing about any particular brand while doing it.
 */

export { createGenerator, type Generator } from './generate.js'
export { createKitchenSink, type KitchenSink } from './kitchen-sink.js'
export {
	type ClassUse,
	scanCandidates,
	scanDeclaredClasses,
	scanFiles,
	scanSource
} from './scan.js'
export type { Audience, Brand, BrandScales, Decl, TokenMap } from './types.js'
export { assertNoShadowedTokens, colourNames, pieceNames } from './types.js'
export { createUtilities, type Utilities, type UtilityResult } from './utilities.js'
export {
	type AvenUtilitiesOptions,
	avenUtilities,
	expandApply,
	type GeneratedCss,
	generate
} from './vite.js'
