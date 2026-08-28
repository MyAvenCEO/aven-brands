<script lang="ts">
import { page } from '$app/state'
import SocialIcon from '$lib/components/SocialIcon.svelte'
import { type Lang, localeHref, pick, switchLangHref } from '$lib/i18n'
import { common } from '$lib/i18n/common'
import { idFunnelHref } from '$lib/id-service'
import { SOCIAL_PROFILES } from '$lib/social'

type NavActive = 'skills' | 'avens' | 'pricing'

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

/** On the dark video the collapsed bar goes light; everywhere else it is the
 * usual dark-on-cream. The mobile dropdown panel is always a solid light sheet. */
const ink = $derived(overlay ? 'text-primary-foreground' : 'text-foreground')
const socialInk = $derived(
	overlay
		? 'text-primary-foreground/70 transition-colors hover:text-primary-foreground'
		: 'text-foreground/65 transition-colors hover:text-foreground'
)

/** Open state for the mobile dropdown. */
let menuOpen = $state(false)

function linkCls(isActive: boolean) {
	return isActive
		? 'opacity-100 transition-opacity'
		: 'opacity-70 transition-opacity hover:opacity-100'
}

/** The same page in the other language — prerendered, so the pathname is known at build time. */
const otherHref = $derived(switchLangHref(lang, page.url.pathname))
</script>

<header
	class={overlay
		? 'absolute inset-x-0 top-0 z-50'
		: 'sticky top-0 z-50 border-b border-border/25 bg-background/25 backdrop-blur-md'}
>
	<div class="mx-auto {maxW} px-5 lg:px-8">
		<!-- Collapsed bar: logo left; on lg the full nav; on mobile the CTA and a
		     hamburger that drops the nav items into a solid sheet below. -->
		<div class="flex items-center justify-between gap-4 py-3 lg:py-5 {ink}">
			<div class="flex items-center gap-4">
				<a href={localeHref(lang, '/')} class="flex items-center gap-2.5">
					<img src="/aven-logo.svg" alt="" class="size-7 shrink-0" width="28" height="28">
					<span class="text-[length:var(--fs-lead)] font-semibold tracking-tight">avenCEO</span>
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
							<SocialIcon {profile} class="size-4" />
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
				<a
					href={idFunnelHref()}
					class="rounded-full bg-primary px-4 py-1.5 normal-case font-semibold text-primary-foreground transition-opacity hover:opacity-90"
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
					class="rounded-full bg-primary px-3.5 py-1.5 text-[length:var(--fs-eyebrow)] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
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

		<!-- Mobile dropdown: a solid light sheet so the links read in either mode. -->
		{#if menuOpen}
			<nav
				class="mb-3 flex flex-col rounded-2xl border border-border/25 bg-surface-raised p-2 text-[length:var(--fs-body)] font-semibold uppercase tracking-[var(--tracking-wider)] text-foreground shadow-[0_8px_30px_rgba(30,41,59,0.12)] lg:hidden"
			>
				<a
					href={localeHref(lang, '/skills')}
					onclick={() => (menuOpen = false)}
					class="rounded-lg px-3 py-2.5 transition-colors hover:bg-surface-card {active === 'skills' ? 'text-accent' : ''}"
				>
					{t.nav.skills}
				</a>
				<a
					href={localeHref(lang, '/avens')}
					onclick={() => (menuOpen = false)}
					class="rounded-lg px-3 py-2.5 transition-colors hover:bg-surface-card {active === 'avens' ? 'text-accent' : ''}"
				>
					{t.nav.avens}
				</a>
				<a
					href={localeHref(lang, '/pricing')}
					onclick={() => (menuOpen = false)}
					class="rounded-lg px-3 py-2.5 transition-colors hover:bg-surface-card {active === 'pricing' ? 'text-accent' : ''}"
				>
					{t.nav.pricing}
				</a>
				<span
					class="mt-1 flex items-center gap-1.5 border-t border-border/25 px-3 pt-3 tabular-nums"
					aria-label={t.switchLabel}
				>
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
		{/if}
	</div>
</header>
