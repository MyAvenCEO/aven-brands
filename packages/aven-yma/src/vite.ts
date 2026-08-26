/** avenYMA's Vite step — the kit's plugin, with this brand already chosen. */
import { type AvenUtilitiesOptions, avenUtilities as plugin } from '@myavenceo/aven-vibes/vite'
import { avenYma } from './brand.js'

export type AvenYmaUtilitiesOptions = Omit<AvenUtilitiesOptions, 'brand'>

export function avenUtilities(options: AvenYmaUtilitiesOptions) {
	return plugin({ brand: avenYma, ...options })
}
