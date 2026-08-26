/**
 * avenCEO, as a `Brand`.
 *
 * Everything the design system renders for this company is assembled here and
 * handed to the kit. The file is deliberately dull — it names values defined in
 * `tokens.ts` and `design.ts` and does nothing with them. That dullness is the
 * point: it is the whole surface a SECOND brand has to fill in, and if it grew
 * logic, that logic would be avenCEO's alone and the next brand would not get
 * it.
 */
import type { Brand } from '@myavenceo/aven-brandkit'
import {
	COMPONENTS,
	INK_SCALE,
	PRIMITIVES,
	RADIUS_SCALE,
	SCALE_TOKENS,
	SPACE_SCALE,
	ELEVATION_SCALE,
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

export const avenCeo: Brand = {
	name: 'avenCEO',
	slug: 'aven-ceo',

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

	/* The three bare elements avenCEO styles without a class. */
	elements: { h1: 'title', button: 'btn', label: 'label' },

	appIconPlate: APP_ICON_PLATE
}

export default avenCeo
