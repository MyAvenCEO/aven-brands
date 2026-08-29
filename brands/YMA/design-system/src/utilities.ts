/** avenYMA's utility layer — the kit, bound to this brand. */
import { createUtilities } from '@myavenceo/aven-vibes/brand'
import { avenYma } from './brand.js'

export type { UtilityResult } from '@myavenceo/aven-vibes/brand'

export const { declarationsFor, appliedDecl, utilityCss, resetCss } = createUtilities(avenYma)
