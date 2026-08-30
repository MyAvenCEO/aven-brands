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
import { SOCIAL_PROFILES, icons } from '@myavenceo/aven-ceo/icons'
import { renderIcon } from '@myavenceo/aven-vibes'
import { fade } from 'svelte/transition'
import { page } from '$app/state'
import SocialIcon from '$lib/components/SocialIcon.svelte'
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
	overlay = false
}: {
	active?: NavActive | null
	maxWidth?: '5xl' | '6xl'
	lang?: Lang
	overlay?: boolean
} = $props()

const t = $derived(pick(common, lang))

/** The bar lines up with the content beneath it — see `--navbar-measure`. */
const measure = $derived(maxWidth === '6xl' ? '72rem' : '64rem')

/** Open state for the full-screen menu. */
let menuOpen = $state(false)

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
	   build a page that links to. */
	{ href: '/docs', label: t.nav.docs, key: 'docs' as const, localized: false }
])

const itemHref = (item: (typeof MENU_ITEMS)[number]) =>
	item.localized ? localeHref(lang, item.href) : `${item.href}/`

/** What each destination IS, for the menu. Five words tell you their names; the
 * line tells you which one you want. */
const META: Record<NavActive, string> = $derived({
	skills: t.nav.skillsMeta,
	avens: t.nav.avensMeta,
	pricing: t.nav.pricingMeta,
	docs: t.nav.docsMeta
})

/** The same page in the other language — prerendered, so the pathname is known at build time. */
const otherHref = $derived(switchLangHref(lang, page.url.pathname))
const langHref = (l: Lang) => (lang === l ? page.url.pathname : otherHref)

const menuIcon = renderIcon('menu', icons, { size: '1.25rem' })
const closeIcon = renderIcon('close', icons, { size: '1.25rem' })
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

		<span class="social-row social-row--density-tight" role="group" aria-label={t.footer.socialLabel}>
			<span class="social-row-items">
				{#each SOCIAL_PROFILES as profile (profile.href)}
					<a
						class="social-row-item"
						href={profile.href}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={profile.name}
					>
						<SocialIcon {profile} size="1.125rem" />
					</a>
				{/each}
			</span>
		</span>

		<nav class="navbar-links" aria-label={t.nav.primaryLabel}>
			{#each MENU_ITEMS as item (item.key)}
				<a
					class="nav-link"
					href={itemHref(item)}
					aria-current={active === item.key ? 'page' : undefined}
				>
					{item.label}
				</a>
			{/each}
		</nav>

		<div class="navbar-actions">
			<a class="btn btn--accent" href={idFunnelHref()}>{t.nav.cta}</a>
			<span class="segment" role="group" aria-label={t.switchLabel}>
				<span class="segment-options">
					<a class="segment-option" href={langHref('de')} hreflang="de"
						aria-current={lang === 'de' ? 'true' : undefined}>DE</a
					>
					<span class="segment-divider" aria-hidden="true"></span>
					<a class="segment-option" href={langHref('en')} hreflang="en"
						aria-current={lang === 'en' ? 'true' : undefined}>EN</a
					>
				</span>
			</span>
		</div>

		<button
			class="navbar-toggle"
			type="button"
			aria-label={t.nav.menu}
			aria-expanded={menuOpen}
			aria-controls="site-menu"
			onclick={() => (menuOpen = !menuOpen)}
		>
			{@html menuOpen ? closeIcon : menuIcon}
		</button>
	</div>
</header>

<!--
	A SIBLING of the bar, never a child. The glass bar carries a
	`backdrop-filter`, and a filtered element becomes the containing block for
	its `position: fixed` descendants — measured: a child asking for the full
	viewport rendered 56px tall, the height of the bar, instead of 356px. A menu
	nested in the header would be cropped to the bar, silently, and only while
	the bar happened to be glass.
-->
{#if menuOpen}
	<div class="nav-menu" id="site-menu" data-open="true" transition:fade={{ duration: 150 }}>
		<div class="nav-menu-scrim"></div>
		<button
			class="nav-menu-close"
			type="button"
			aria-label={t.nav.closeMenu}
			onclick={() => (menuOpen = false)}
		>
			{@html closeIcon}
		</button>
		<nav class="nav-menu-panel" aria-label={t.nav.primaryLabel}>
			<div class="nav-menu-head">
				<div class="nav-menu-crest">
					<img class="logo-mark" src="/aven-logo.svg" alt="" width="36" height="36">
				</div>
				<p class="text text--eyebrow nav-menu-eyebrow">{t.nav.whereTo}</p>
			</div>
			<div class="nav-menu-items">
				{#each MENU_ITEMS as item (item.key)}
					<a
						class="nav-menu-item"
						href={itemHref(item)}
						aria-current={active === item.key ? 'page' : undefined}
						onclick={() => (menuOpen = false)}
					>
						<span class="nav-menu-marker"></span>
						{item.label}
						<span class="nav-menu-meta">{META[item.key]}</span>
					</a>
				{/each}
			</div>
			<div class="nav-menu-footer">
				<span class="segment" role="group" aria-label={t.switchLabel}>
					<span class="segment-options">
						<a class="segment-option" href={langHref('de')} hreflang="de"
							aria-current={lang === 'de' ? 'true' : undefined}>DE</a
						>
						<span class="segment-divider" aria-hidden="true"></span>
						<a class="segment-option" href={langHref('en')} hreflang="en"
							aria-current={lang === 'en' ? 'true' : undefined}>EN</a
						>
					</span>
				</span>
				<p class="nav-menu-trust">{t.nav.trust}</p>
			</div>
		</nav>
	</div>
{/if}
