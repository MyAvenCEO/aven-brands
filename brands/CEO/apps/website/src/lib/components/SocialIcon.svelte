<script lang="ts">
/**
 * One social glyph.
 *
 * The geometry is not here — it is in the brand's icon registry, and this
 * renders it through the engine's own `renderIcon`. That is the whole change:
 * the path data used to live in `$lib/social.ts`, where the header, the footer
 * and the privacy document each kept their own idea of which four profiles
 * exist. Now a surface names a profile and gets whatever the brand says.
 */
import { icons, type SocialProfile } from '@myavenceo/aven-ceo/icons'
import { renderIcon } from '@myavenceo/aven-vibes'

let { profile, size = '1rem' }: { profile: SocialProfile; size?: string } = $props()

const svg = $derived(renderIcon(profile.icon, icons, { size }))
</script>

{@html svg}
