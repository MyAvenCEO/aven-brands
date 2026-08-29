/**
 * avenCEO, as a `Brand`.
 *
 * The file used to be sixty lines of dull assembly — naming values from
 * `tokens.ts` and `design.ts` and doing nothing with them — and its dullness
 * was the point: it was the surface a second brand had to fill in, so any logic
 * here would have been avenCEO's alone.
 *
 * It is now four lines, because that assembly was the same for every brand and
 * moved to `brandFromDocuments` in the kit. What is left is a call: two JSON
 * documents in, a validated brand out. A second brand writes the documents and
 * gets everything after them for free, which is what "a brand is a config" was
 * always supposed to mean.
 *
 * The validation is not incidental. A missing group used to flatten to `{}`,
 * emit `var(--color-)` everywhere it was referenced, and render the page in the
 * browser's defaults rather than failing. It now throws at load, naming every
 * missing part at once.
 */

import type { Brand } from '@myavenceo/aven-vibes/brand'
import { brandFromDocuments } from '@myavenceo/aven-vibes/brand'

import brandDocument from './brand/brand.avenceo.json' with { type: 'json' }
import componentsDocument from './brand/components.avenceo.json' with { type: 'json' }

export const avenCeo: Brand = brandFromDocuments(brandDocument, componentsDocument)

export default avenCeo
