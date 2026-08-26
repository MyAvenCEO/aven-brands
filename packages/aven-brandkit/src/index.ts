/**
 * @myavenceo/aven-brandkit — how a brand becomes CSS.
 *
 * A brand is a `Brand`: colours, scales, primitives, components. This package
 * turns one into a stylesheet, a utility layer, and a build step, and knows
 * nothing about any particular brand while doing it.
 */
export type { Audience, Brand, BrandScales, Decl, TokenMap } from './types.js'
export { assertNoShadowedTokens, colourNames, pieceNames } from './types.js'
export { createUtilities, type Utilities, type UtilityResult } from './utilities.js'
export { createGenerator, type Generator } from './generate.js'
export { scanCandidates, scanDeclaredClasses, scanFiles, scanSource, type ClassUse } from './scan.js'
export { avenUtilities, expandApply, generate, type AvenUtilitiesOptions, type GeneratedCss } from './vite.js'
