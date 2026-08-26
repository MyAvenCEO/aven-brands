/**
 * avenCEO's generators — the kit, bound to this brand.
 *
 * The generating moved to `@myavenceo/aven-brandkit` so a second brand could
 * use it. What stays here is the binding, and the module path every consumer
 * already imports: a script in avenOS still writes
 *
 *   import { themeCss } from '@myavenceo/aven-ceo/generate'
 *
 * and gets avenCEO's theme, because that is what this package IS.
 */
import { createGenerator } from '@myavenceo/aven-brandkit'
import { avenCeo } from './brand.js'

export type { Audience as ThemeVariant } from '@myavenceo/aven-brandkit'

const generator = createGenerator(avenCeo)

export const { themeCss, componentCss, elementCss, appIconSvg, faviconSvg } = generator
