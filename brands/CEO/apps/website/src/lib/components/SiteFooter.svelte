<script lang="ts">
/**
 * THE footer, on every page — delivered as build-rendered configuration.
 *
 * The markup lives in `$lib/vibes/footer.ts` as a ViewDef; every route's
 * server load renders it once at build (`footerHtml`/`footerData`) and it
 * arrives here as HTML. Nothing in the footer moves, so nothing hydrates and
 * it ships zero JavaScript.
 *
 * A route that renders this component without providing the HTML has broken
 * the delivery contract — fail the build, not the reader. The `lang` prop
 * stays on the interface because the CALLER knows what language it is
 * rendering, and naming it in the error is what makes the broken route
 * findable.
 */
import { page } from '$app/state'
import type { Lang } from '$lib/i18n'

/* Accepted so call sites keep naming the language they render; the HTML is
 * already the right language because the load derived it from the pathname. */
let { lang = 'de' }: { lang?: Lang } = $props()

const html: string | undefined = page.data.footerHtml
if (!html)
	throw new Error(
		`[footer] no footerHtml in page data at ${page.url.pathname} — the route has no server load`
	)
</script>

{@html html}

<style>
/* A `$icon` node renders only its icon, so each social glyph needed a wrapper
   node in the view — dissolve it, and the `<svg>` is the flex item it was
   when this component rendered the row itself. `:global` because the footer
   arrives through `{@html}` and Svelte never compiled its elements. */
:global(#site-footer-social a > span:first-child) {
	display: contents;
}
</style>
