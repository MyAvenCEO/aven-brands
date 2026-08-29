<script lang="ts">
import { legalPath } from '@myavenceo/aven-ceo'
import SocialIcon from '$lib/components/SocialIcon.svelte'
import { type Lang, localeHref, pick } from '$lib/i18n'
import { common } from '$lib/i18n/common'
import { idFunnelHref } from '$lib/id-service'
import { SOCIAL_PROFILES } from '$lib/social'

/**
 * THE footer, on every page. It carries the two things a German site owes a
 * visitor — the legal pages and a way back into the site. The legal pages
 * are German-only; the English site links to them as they are.
 */
let { lang = 'de' }: { lang?: Lang } = $props()

const t = $derived(pick(common, lang))

const legal = $derived([
	// The impressum follows the reader's language; the rest is German-only for now.
	{ href: legalPath('impressum', lang), label: t.footer.legal.impressum },
	{ href: legalPath('datenschutz', lang), label: t.footer.legal.datenschutz },
	{ href: legalPath('social-media', lang), label: t.footer.legal.socialMedia },
	{ href: legalPath('widerruf', lang), label: t.footer.legal.widerruf }
	// AGB/Terms deliberately absent while the page is still a placeholder.
])

const nav = $derived([
	{ href: localeHref(lang, '/skills'), label: t.nav.skills },
	{ href: localeHref(lang, '/avens'), label: t.nav.avens },
	{ href: localeHref(lang, '/pricing'), label: t.nav.pricing },
	{ href: idFunnelHref(), label: t.footer.ctaLabel }
])

const year = 2026
</script>

<footer class="bg-primary px-5 py-12 text-primary-foreground sm:px-8">
	<div class="mx-auto flex max-w-6xl flex-col gap-8">
		<div class="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
			<div>
				<a href={localeHref(lang, '/')} class="flex items-center gap-2.5">
					<img src="/aven-logo.svg" alt="" class="size-7" width="28" height="28">
					<span class="text-[length:var(--fs-title)] tracking-tight"
						><span class="font-display" style="font-weight: 300; font-size: 1.4em; line-height: 1"
							>aven</span
						><span class="font-sans uppercase" style="font-weight: 700">CEO</span></span
					>
				</a>
				<p
					class="mt-2 max-w-xs text-[length:var(--fs-meta)] leading-snug text-primary-foreground/55"
				>
					{t.footer.tagline}
				</p>
			</div>

			<nav
				class="flex flex-col gap-2 text-[length:var(--fs-body)]"
				aria-label={t.footer.pagesLabel}
			>
				{#each nav as item (item.href)}
					<a
						href={item.href}
						class="text-primary-foreground/65 transition-colors hover:text-primary-foreground"
					>
						{item.label}
					</a>
				{/each}
			</nav>

			<nav
				class="flex flex-col gap-2 text-[length:var(--fs-body)]"
				aria-label={t.footer.legalLabel}
			>
				{#each legal as item (item.href)}
					<a
						href={item.href}
						class="text-primary-foreground/65 transition-colors hover:text-primary-foreground"
					>
						{item.label}
					</a>
				{/each}
			</nav>

			<nav
				class="flex flex-col gap-2 text-[length:var(--fs-body)]"
				aria-label={t.footer.socialLabel}
			>
				{#each SOCIAL_PROFILES as profile (profile.href)}
					<a
						href={profile.href}
						target="_blank"
						rel="noopener noreferrer"
						class="flex items-center gap-2 text-primary-foreground/65 transition-colors hover:text-primary-foreground"
					>
						<SocialIcon {profile} />
						{profile.name}
					</a>
				{/each}
			</nav>
		</div>

		<div
			class="flex flex-col gap-2 border-t border-primary-foreground/15 pt-6 text-[length:var(--fs-eyebrow)] text-primary-foreground/45 sm:flex-row sm:items-center sm:justify-between"
		>
			<p>© {year} {t.footer.copyright}</p>
		</div>
	</div>
</footer>
