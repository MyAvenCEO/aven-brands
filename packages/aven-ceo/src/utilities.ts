/**
 * avenCEO's utility layer — the kit, bound to this brand.
 *
 * Same reason as `generate.ts`: the machinery is shared, the values are not.
 */
import { createUtilities } from '@myavenceo/aven-brandkit'
import { avenCeo } from './brand.js'

export type { UtilityResult } from '@myavenceo/aven-brandkit'

const utilities = createUtilities(avenCeo)

export const { declarationsFor, appliedDecl, utilityCss, resetCss } = utilities
