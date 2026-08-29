/**
 * avenCEO's icons.
 *
 * Geometry, validated at module load — so an icon that is not purely path data
 * fails the package build rather than reaching a page. That check is the reason
 * icons can exist at all: the engine's tag allowlist admits no SVG, because a
 * view that can emit arbitrary SVG can emit script, and this registry is the
 * one door through it.
 *
 * Drawn on the lucide 24x24 grid at stroke width 2. Not an arbitrary choice: it
 * means a new icon can be lifted from lucide and dropped in without redrawing,
 * and the set stays coherent as it grows rather than accumulating a second
 * visual language one icon at a time.
 */

import type { IconRegistry } from '@myavenceo/aven-vibes'
import { validateIconRegistry } from '@myavenceo/aven-vibes'

import document from './brand/icons.avenceo.json' with { type: 'json' }

export const icons: IconRegistry = (document as unknown as { icons: IconRegistry }).icons

validateIconRegistry(icons)

/** The icon names, so a docs surface can list them without importing the JSON. */
export const iconNames = Object.keys(icons)

/**
 * The public social profiles.
 *
 * Here rather than in the website because the header, the footer and anything
 * else that links out all need the same four, and because the icon each one
 * uses is a NAME into the registry above — so no surface handles path data.
 */
export type SocialProfile = { name: string; href: string; icon: string }

import socialDocument from './brand/social.avenceo.json' with { type: 'json' }

export const SOCIAL_PROFILES: SocialProfile[] = (socialDocument as { profiles: SocialProfile[] })
	.profiles

/* A profile naming an icon that does not exist renders an empty span, silently.
   Fail here instead. */
for (const profile of SOCIAL_PROFILES) {
	if (!icons[profile.icon])
		throw new Error(`social profile "${profile.name}": no icon named "${profile.icon}"`)
}
