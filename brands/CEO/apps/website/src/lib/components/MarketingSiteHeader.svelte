<script lang="ts">
import { fade, fly } from 'svelte/transition'
import { page } from '$app/state'
import SocialIcon from '$lib/components/SocialIcon.svelte'
import { type Lang, localeHref, pick, switchLangHref } from '$lib/i18n'
import { common } from '$lib/i18n/common'
import { idFunnelHref } from '$lib/id-service'
import { SOCIAL_PROFILES } from '@myavenceo/aven-ceo/icons'

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
const maxW = $derived(maxWidth === '6xl' ? 'max-w-6xl' : 'max-w-5xl')

/** Open state for the full-screen mobile menu. */
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

/** The bar is light while it floats transparent over the video (overlay, not
 * yet scrolled) or while the dark mobile menu is open — otherwise dark-on-cream. */
const lightBar = $derived((overlay && !scrolled) || menuOpen)
const solid = $derived(!overlay || scrolled)
const ink = $derived(lightBar ? 'text-primary-foreground' : 'text-foreground')
const socialInk = $derived(
	lightBar
		? 'text-primary-foreground/70 transition-colors hover:text-primary-foreground'
		: 'text-foreground/65 transition-colors hover:text-foreground'
)
/** Fixed over the hero video (so the video sits full-bleed behind it), sticky
 * everywhere else. */
const headerClass = $derived(
	`${overlay ? 'fixed' : 'sticky'} inset-x-0 top-0 z-50 transition-colors duration-200`
)
/** The solid bar's fill/blur/hairline as inline style — these opacity + blur
 * utilities aren't emitted from a dynamic class string, so pin them here. */
const headerStyle = $derived(
	solid
		? 'background-color: color-mix(in oklab, var(--color-surface-page) 10%, transparent); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-bottom: 1px solid color-mix(in oklab, var(--color-border) 60%, transparent);'
		: ''
)

/** The nav points, shared by the desktop bar and the full-screen menu. */
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

function linkCls(isActive: boolean) {
	return isActive
		? 'opacity-100 transition-opacity'
		: 'opacity-70 transition-opacity hover:opacity-100'
}

/** The same page in the other language — prerendered, so the pathname is known at build time. */
const otherHref = $derived(switchLangHref(lang, page.url.pathname))
</script>

<header class={headerClass} style={headerStyle}>
	<div class="relative z-10 mx-auto {maxW} px-5 lg:px-8">
		<!-- Collapsed bar: logo left; on lg the full nav; on mobile the CTA and a
		     hamburger that opens the full-screen menu below. -->
		<div class="flex items-center justify-between gap-4 py-3 lg:py-5 {ink}">
			<div class="flex items-center gap-4">
				<a href={localeHref(lang, '/')} class="flex items-center gap-2.5">
					<img src="/aven-logo.svg" alt="" class="size-7 shrink-0" width="28" height="28">
					<!-- One word, two faces: "aven" in the thin display face, "CEO" in the
					     heaviest Google Sans Flex, uppercase. -->
					<span class="text-[length:var(--fs-lead)] tracking-tight"
						><span class="font-display" style="font-weight: 300; font-size: 1.4em; line-height: 1"
							>aven</span
						><span class="font-sans uppercase" style="font-weight: 700">CEO</span></span
					>
				</a>
				<!-- Social: desktop only — redundant with the footer on phones. -->
				<span
					class="hidden items-center gap-3 lg:flex {socialInk}"
					aria-label={t.footer.socialLabel}
				>
					{#each SOCIAL_PROFILES as profile (profile.href)}
						<a
							href={profile.href}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={profile.name}
						>
							<SocialIcon {profile} />
						</a>
					{/each}
				</span>
			</div>

			<!-- Desktop nav: everything inline. -->
			<nav
				class="hidden items-center gap-x-6 text-[length:var(--fs-eyebrow)] font-semibold uppercase tracking-[var(--tracking-wider)] lg:flex"
			>
				<a href={localeHref(lang, '/skills')} class={linkCls(active === 'skills')}
					>{t.nav.skills}</a
				>
				<a href={localeHref(lang, '/avens')} class={linkCls(active === 'avens')}>{t.nav.avens}</a>
				<a href={localeHref(lang, '/pricing')} class={linkCls(active === 'pricing')}>
					{t.nav.pricing}
				</a>
				<a href="/docs/" class={linkCls(active === 'docs')}>{t.nav.docs}</a>
				<a
					href={idFunnelHref()}
					style="color: var(--color-foreground)"
					class="rounded-full bg-accent px-4 py-1.5 normal-case font-semibold shadow-[var(--shadow-raised)] transition-opacity hover:opacity-90"
				>
					{t.nav.cta}
				</a>
				<span class="flex items-center gap-1.5 tabular-nums" aria-label={t.switchLabel}>
					<a
						href={lang === 'de' ? page.url.pathname : otherHref}
						hreflang="de"
						aria-current={lang === 'de' ? 'true' : undefined}
						class={lang === 'de' ? 'opacity-100' : 'opacity-50 transition-opacity hover:opacity-100'}
					>
						DE
					</a>
					<span aria-hidden="true" class="opacity-30">|</span>
					<a
						href={lang === 'en' ? page.url.pathname : otherHref}
						hreflang="en"
						aria-current={lang === 'en' ? 'true' : undefined}
						class={lang === 'en' ? 'opacity-100' : 'opacity-50 transition-opacity hover:opacity-100'}
					>
						EN
					</a>
				</span>
			</nav>

			<!-- Mobile: the CTA stays out, the rest hides behind the hamburger. -->
			<div class="flex items-center gap-2 lg:hidden">
				<a
					href={idFunnelHref()}
					style="color: var(--color-foreground)"
					class="rounded-full bg-accent px-3.5 py-1.5 text-[length:var(--fs-eyebrow)] font-semibold shadow-[var(--shadow-raised)] transition-opacity hover:opacity-90"
				>
					{t.nav.cta}
				</a>
				<button
					type="button"
					aria-label={t.nav.menu}
					aria-expanded={menuOpen}
					onclick={() => (menuOpen = !menuOpen)}
					class="inline-flex size-9 items-center justify-center rounded-full {ink}"
				>
					{#if menuOpen}
						<svg
							viewBox="0 0 24 24"
							class="size-5"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							aria-hidden="true"
						>
							<path d="M6 6l12 12M18 6L6 18" />
						</svg>
					{:else}
						<svg
							viewBox="0 0 24 24"
							class="size-5"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							aria-hidden="true"
						>
							<path d="M4 7h16M4 12h16M4 17h16" />
						</svg>
					{/if}
				</button>
			</div>
		</div>
	</div>
</header>

{#if menuOpen}
	<!-- Full-screen menu: a translucent glass layer over the page, nav points
	     centred and large. It sits OUTSIDE <header> so its `fixed` box escapes
	     the bar's backdrop-filter and covers the whole viewport; the bar (z-50)
	     stays above it, so its close button closes the menu. -->
	<div class="fixed inset-0 z-40 lg:hidden" transition:fade={{ duration: 150 }}>
		<div class="absolute inset-0 bg-primary/90 backdrop-blur-xl"></div>
		<nav
			class="relative flex h-full flex-col items-center justify-center gap-7 px-6 text-center text-primary-foreground"
		>
			{#each MENU_ITEMS as item, i (item.key)}
				<a
					href={item.localized ? localeHref(lang, item.href) : `${item.href}/`}
					onclick={() => (menuOpen = false)}
					in:fly={{ y: 16, duration: 260, delay: 60 + 50 * i }}
					class="font-display text-[clamp(2.25rem,11vw,3.75rem)] font-medium leading-none tracking-tight transition-opacity hover:opacity-70 {active ===
					item.key
						? 'text-accent'
						: ''}"
				>
					{item.label}
				</a>
			{/each}
			<span
				class="mt-8 flex items-center gap-3 text-[length:var(--fs-hero)] font-semibold tabular-nums"
				aria-label={t.switchLabel}
			>
				<a
					href={lang === 'de' ? page.url.pathname : otherHref}
					hreflang="de"
					aria-current={lang === 'de' ? 'true' : undefined}
					class={lang === 'de'
						? 'text-primary-foreground'
						: 'text-primary-foreground/45 transition-colors hover:text-primary-foreground'}
				>
					DE
				</a>
				<span aria-hidden="true" class="text-primary-foreground/30">|</span>
				<a
					href={lang === 'en' ? page.url.pathname : otherHref}
					hreflang="en"
					aria-current={lang === 'en' ? 'true' : undefined}
					class={lang === 'en'
						? 'text-primary-foreground'
						: 'text-primary-foreground/45 transition-colors hover:text-primary-foreground'}
				>
					EN
				</a>
			</span>
		</nav>
	</div>
{/if}
