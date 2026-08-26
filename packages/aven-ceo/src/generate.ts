/**
 * avenCEO's generators — the kit, bound to this brand.
 *
 * The generating lives in `@myavenceo/aven-vibes/brand` so a second brand can
 * use it. What stays here is the binding, and the module path every consumer
 * already imports: a script in avenOS still writes
 *
 *   import { themeCss } from '@myavenceo/aven-ceo/generate'
 *
 * and gets avenCEO's theme, because that is what this package IS.
 */
import { createGenerator } from '@myavenceo/aven-vibes/brand'
import { avenCeo } from './brand.js'

export type { Audience as ThemeVariant } from '@myavenceo/aven-vibes/brand'

const generator = createGenerator(avenCeo)

export const { themeCss, componentCss, elementCss, appIconSvg, faviconSvg } = generator
