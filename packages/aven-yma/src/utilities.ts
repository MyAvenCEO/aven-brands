/** avenYMA's utility layer — the kit, bound to this brand. */
import { createUtilities } from '@myavenceo/aven-brandkit'
import { avenYma } from './brand.js'

export type { UtilityResult } from '@myavenceo/aven-brandkit'

export const { declarationsFor, appliedDecl, utilityCss, resetCss } = createUtilities(avenYma)
