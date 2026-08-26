/**
 * avenYMA, as a `Brand`.
 *
 * The same twenty-odd lines avenCEO fills in, with different values. That is
 * the proof the architecture works: a third-party brand needs no change to the
 * kit, no fork of the generator, and no permission — only this file.
 */
import type { Brand } from '@myavenceo/aven-brandkit'
import {
	COMPONENTS,
	ELEVATION_SCALE,
	INK_SCALE,
	PRIMITIVES,
	RADIUS_SCALE,
	SCALE_TOKENS,
	SPACE_SCALE,
	TINT_SCALE,
	TRACKING_SCALE,
	TYPE_SCALE
} from './design.js'
import {
	APP_ICON_PLATE,
	APP_ROLES,
	CONTRAST_INK,
	CREAMS,
	FONT_STACK,
	FONT_WEIGHTS,
	RADII,
	ROLES,
	SITE_ROLES,
	SURFACES,
	TONES
} from './tokens.js'

export const avenYma: Brand = {
	name: 'avenYMA',
	slug: 'aven-yma',

	tones: TONES,
	creams: CREAMS,
	contrastInk: CONTRAST_INK,

	surfaces: SURFACES,
	roles: ROLES,
	siteRoles: SITE_ROLES,
	appRoles: APP_ROLES,

	fonts: FONT_STACK,
	fontWeights: FONT_WEIGHTS,
	radii: RADII,
	scales: {
		type: TYPE_SCALE,
		tracking: TRACKING_SCALE,
		ink: INK_SCALE,
		tint: TINT_SCALE,
		elevation: ELEVATION_SCALE,
		radius: RADIUS_SCALE,
		space: SPACE_SCALE
	},
	scaleTokens: SCALE_TOKENS,

	primitives: PRIMITIVES,
	components: COMPONENTS,

	/*
	 * Headings are the display face by default here — the site sets every h1, h2
	 * and h3 in the garamond without a class, and a `<button>` is a button.
	 */
	elements: { 'h1, h2, h3': 'display', button: 'btn' },

	appIconPlate: APP_ICON_PLATE
}

export default avenYma
