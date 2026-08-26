/**
 * avenCEO's Vite step — the kit's plugin, with this brand already chosen.
 *
 * A surface that belongs to avenCEO does not have to say so:
 *
 *   avenUtilities({ content: ['src'] })
 */
import { type AvenUtilitiesOptions, avenUtilities as plugin } from '@myavenceo/aven-vibes/vite'
import { avenCeo } from './brand.js'

export type AvenCeoUtilitiesOptions = Omit<AvenUtilitiesOptions, 'brand'>

export function avenUtilities(options: AvenCeoUtilitiesOptions) {
	return plugin({ brand: avenCeo, ...options })
}
