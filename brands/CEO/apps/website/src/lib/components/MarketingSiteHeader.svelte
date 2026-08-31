<script lang="ts">
/**
 * The marketing bar, rendered from the design system's own units.
 *
 * It used to be 276 lines of Tailwind with the brand lockup retyped inline, the
 * glass fill written as a `style` attribute, and a full-screen menu built from
 * scratch — on ten surfaces, so every one of them inherited whatever this file
 * happened to get wrong. What is left here is the BEHAVIOUR, which is the part
 * a design system has no opinion about: where the page is, which language it is
 * in, whether you have scrolled, whether the menu is open.
 *
 * The looks come from `navbar`, `nav-menu`, `logo`, `nav-link`, `social-row`,
 * `segment` and `btn`. Changing how the bar looks is now an edit to a unit,
 * which every surface picks up at once — including the storybook, where it can
 * be seen and gated.
 */
import { icons } from '@myavenceo/aven-ceo/icons'
import { onMount } from 'svelte'
import { page } from '$app/state'
import { type Lang, localeHref, pick, switchLangHref } from '$lib/i18n'
import { common } from '$lib/i18n/common'
import { idFunnelHref } from '$lib/id-service'

type NavActive = 'skills' | 'avens' | 'pricing' | 'docs'

let {
	active = null,
	maxWidth = '5xl',
	lang = 'de',
	/** Float the bar transparently over a dark hero (home) instead of the
	 * solid sticky bar; the collapsed bar then goes light. */
	overlay = false,
	/** Where the CTA scrolls. Every MARKETING page mounts `ClaimSection`, so
	 * the bare anchor resolves there; a page without one (the docs tools)
	 * passes the home page's anchor instead — a bare `#claim` on such a page
	 * is a dead link, and prerender rightly fails the build on it. */
	claimHref = '#claim'
}: {
	active?: NavActive | null
	maxWidth?: '5xl' | '6xl'
	lang?: Lang
	overlay?: boolean
	claimHref?: string
} = $props()

const t = $derived(pick(common, lang))

/** The bar lines up with the content beneath it — see `--navbar-measure`. */
const measure = $derived(maxWidth === '6xl' ? '72rem' : '64rem')

/** In overlay mode the bar is transparent over the hero video, then solidifies
 * once you scroll past most of it — so it sticks to the top like the sub-pages
 * rather than scrolling away. */
let scrolled = $state(false)
$effect(() => {
	if (!overlay) return
	const onScroll = () => {
		scrolled = window.scrollY > window.innerHeight * 0.7
	}
	onScroll()
	window.addEventListener('scroll', onScroll, { passive: true })
	return () => window.removeEventListener('scroll', onScroll)
})

/**
 * Two INDEPENDENT facts, and they used to be one class.
 *
 * `placement` is where the bar sits and does not change while you are on the
 * page. `tone` is what it looks like right now, and changes as you scroll. The
 * old `overlay` variant carried both, so the scrolled state could not be
 * expressed without also giving up `position: fixed`.
 *
 * The bar is clear while it floats over the video, otherwise glass. The open
 * menu no longer forces it clear: the menu is `--z-overlay` (100) against the
 * bar's `--z-sticky` (50), so it covers the bar completely and carries its own
 * close control. Tinting a bar nobody can see was a rule kept from when the
 * menu sat under it.
 */
const lightBar = $derived(overlay && !scrolled)

/**
 * THE MENU IS AN ISLAND — the first surface on this site whose markup AND
 * behaviour are pure avenVIBES configuration.
 *
 * `+layout.server.ts` rendered the bundle to HTML at build time, so the
 * hamburger and the whole menu are in the prerendered file; here the same
 * bundle hydrates that markup in place. `Island` is imported inside onMount
 * because it is client-only by nature and nothing about SSR needs it.
 *
 * Zero attached listeners means the build's HTML and this bundle disagree —
 * a stale build, exactly the mismatch worth hearing about — so it logs.
 */
let islandHost: HTMLElement | undefined
onMount(() => {
	const data = page.data.menuIsland
	if (!islandHost || !data) return
	let disposed = false
	let island: { dispose(): Promise<void> } | null = null
	void import('@myavenceo/aven-vibes').then(async ({ Island }) => {
		if (disposed || !islandHost) return
		const live = new Island({ container: islandHost, icons })
		island = live
		const attached = await live.hydrate(data.bundle)
		if (attached === 0) console.error('[menu-island] hydrated 0 listeners — stale build?')
	})
	return () => {
		disposed = true
		void island?.dispose()
	}
})
/*
 * While the bar is clear it sits on the hero's footage, and its ground is a
 * PICTURE. A contrast gate walking up for a background-color finds the page
 * cream and reports white ink at 1.01:1 — measuring a surface that is not
 * there. `data-ground="media"` moves the proof to where it can actually be
 * made: measured on the video's own top band, compositing the scrim, the worst
 * pixel is 4.54:1 and the 95th percentile 5.33:1 against 4.5 required. That is
 * what raised `--color-scrim-strong` from 50% to 65%; at 50% the worst was
 * 2.94:1.
 *
 * The attribute is only present while the bar is CLEAR. Once it goes glass it
 * has a real background-color again and is checked like anything else — an
 * exclusion that outlived its reason is how a gate gets quietly disarmed.
 */
const barClass = $derived(
	`navbar ${overlay ? 'navbar--placement-overlay' : ''} ${
		lightBar ? 'navbar--tone-clear' : 'navbar--tone-glass'
	}`
)

/** The nav points, shared by the bar and the menu. */
const MENU_ITEMS = $derived([
	{ href: '/skills', label: t.nav.skills, key: 'skills' as const, localized: true },
	{ href: '/avens', label: t.nav.avens, key: 'avens' as const, localized: true },
	{ href: '/pricing', label: t.nav.pricing, key: 'pricing' as const, localized: true },
	/* ceoBRAND is written once, in English — a design system's reference is its
	   token names and class names, which are not translated. So this point is
	   NOT locale-prefixed: `localeHref(de, '/docs')` would link `/de/docs/`,
	   which does not exist and which the prerenderer correctly refuses to
	   build a page that links to.

	   `hidden` keeps it out of the bar and the menu WITHOUT unbuilding it: the
	   route, its prerender and every existing link still work, and anyone with
	   the URL still arrives. Removing the entry outright would have been the
	   other thing — a dead link for everyone who already has one. */
	{ href: '/docs', label: t.nav.docs, key: 'docs' as const, localized: false, hidden: true }
])

/** What the bar and the menu actually render. */
const VISIBLE_ITEMS = $derived(MENU_ITEMS.filter((i) => !i.hidden))

const itemHref = (item: (typeof MENU_ITEMS)[number]) =>
	item.localized ? localeHref(lang, item.href) : `${item.href}/`

/** The same page in the other language — prerendered, so the pathname is known at build time. */
const otherHref = $derived(switchLangHref(lang, page.url.pathname))
const langHref = (l: Lang) => (lang === l ? page.url.pathname : otherHref)
</script>

<header
	class={barClass}
	data-scrolled={scrolled}
	{...lightBar ? { 'data-ground': 'media' } : {}}
	style="--navbar-measure: {measure}"
>
	<div class="navbar-bar">
		<div class="navbar-brand">
			<a href={localeHref(lang, '/')} class="logo" aria-label="avenCEO">
				<img class="logo-mark" src="/aven-logo.svg" alt="" width="28" height="28">
				<span class="logo-wordmark"
					><span class="logo-word-aven">aven</span><span class="logo-word-ceo">CEO</span></span
				>
			</a>
		</div>

		<!-- The social row, from the layout load's build-rendered ViewDef. It is
		     static markup, so it costs the page no bundle and no hydration. -->
		{@html page.data.socialRowHtml ?? ''}

		<nav class="navbar-links" aria-label={t.nav.primaryLabel}>
			{#each VISIBLE_ITEMS as item (item.key)}
				<a
					class="nav-link"
					href={itemHref(item)}
					aria-current={active === item.key ? 'page' : undefined}
				>
					{item.label}
				</a>
			{/each}
		</nav>

		<!-- The language switch sits BEFORE the call to action, so the bar ends on
		     the thing it wants you to do. A setting placed after the CTA reads as
		     an afterthought to it and puts a low-intent control in the highest
		     position on the row. -->
		<div class="navbar-actions">
			<span class="segment" role="group" aria-label={t.switchLabel}>
				<span class="segment-options">
					<a
						class="segment-option"
						href={langHref('de')}
						hreflang="de"
						aria-current={lang === 'de' ? 'true' : undefined}
						>DE</a
					>
					<span class="segment-divider" aria-hidden="true"></span>
					<a
						class="segment-option"
						href={langHref('en')}
						hreflang="en"
						aria-current={lang === 'en' ? 'true' : undefined}
						>EN</a
					>
				</span>
			</span>
			<!-- Scrolls to the claim block rather than jumping to the external
			     checkout. `ClaimSection` is on every marketing page, so the bare
			     anchor resolves there; pages without one pass `claimHref`. -->
			<a class="btn btn--accent" href={claimHref}>{t.nav.cta}</a>
		</div>

		<!-- The toggle and the menu, from the island's build-rendered HTML. The
		     host and the island root are display: contents, so the toggle sits
		     in the bar's flex flow as if it were a direct child and the fixed
		     menu escapes to the viewport. -->
		<span id="site-menu-island" bind:this={islandHost}>
			{@html page.data.menuIsland?.html ?? ''}
		</span>
	</div>
</header>

<style>
/* The island host must not be a box: the toggle inside it belongs to the
   bar's flex flow, and the menu inside it is position: fixed and belongs to
   the viewport. Two wrappers stand between them and the bar — this span and
   the island's own root — and both dissolve. */
#site-menu-island,
#site-menu-island > :global([data-aven-path]) {
	display: contents;
}
</style>
