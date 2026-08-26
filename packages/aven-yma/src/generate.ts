/** avenYMA's generators — the kit, bound to this brand. */
import { createGenerator } from '@myavenceo/aven-brandkit'
import { avenYma } from './brand.js'

export type { Audience as ThemeVariant } from '@myavenceo/aven-brandkit'

export const { themeCss, componentCss, elementCss, appIconSvg, faviconSvg } =
	createGenerator(avenYma)
