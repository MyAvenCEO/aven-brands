<script lang="ts">
import { type Lang, pick } from '$lib/i18n'
import { common } from '$lib/i18n/common'
import { localizedPlan, priceSuffix } from '$lib/i18n/plans'
import { idFunnelHref } from '$lib/id-service'
import { euro, plan } from '$lib/pricing/plans'

type Props = {
	variant?: 'inline' | 'banner'
	lang?: Lang
}

let { variant = 'inline', lang = 'de' }: Props = $props()

const t = $derived(pick(common, lang).idCta)
const avenId = plan('aven-name')
/** What the €25 actually buys — avenNAME's features, in the reader's language. */
const features = $derived(localizedPlan(avenId, lang).features)
/** The real hook: securing the name early also unlocks avenCEO's beta discount. */
const ceoBeta = plan('aven-ceo').beta

let name = $state('')

const slug = $derived(
	name
		.toLowerCase()
		.replace(/[^a-z0-9-]/g, '')
		.replace(/^-+|-+$/g, '')
		.slice(0, 24)
)

function submit(e: SubmitEvent) {
	e.preventDefault()
	if (!slug) return
	window.location.href = idFunnelHref('aven-name', slug)
}

const centered = $derived(variant === 'banner')
const wrapperClass = $derived(
	variant === 'banner'
		? 'rounded-3xl border-2 border-accent/25 bg-surface-raised px-5 py-9 shadow-[0_1px_3px_rgba(30,41,59,0.05)] sm:px-10 sm:py-11'
		: 'rounded-2xl border border-border/25 bg-surface-raised px-5 py-7 sm:px-8 sm:py-8'
)
</script>

<form
	onsubmit={submit}
	class="{wrapperClass} {centered ? 'text-center' : ''}"
	aria-label={t.formLabel}
>
	<p class="eyebrow-accent">
		{t.eyebrow}
	</p>
	<h3
		class="mt-2 text-2xl font-semibold tracking-tight text-balance text-foreground sm:text-3xl md:text-[length:var(--fs-amount)] {centered
			? 'mx-auto max-w-xl'
			: ''}"
	>
		{t.title}
	</h3>
	<!-- Our own static copy with inline emphasis — not user content. -->
	<p
		class="mt-3 text-[length:var(--fs-section)] leading-snug text-foreground/65 sm:text-[length:var(--fs-title)] {centered
			? 'mx-auto max-w-2xl'
			: 'max-w-2xl'}"
	>
		{@html t.bodyHtml}
	</p>

	<!-- The four benefits, styled and sized exactly like avenCEO's ENTHALTEN
	     bullets: a small accent dot and the title, no sub-copy. -->
	<ul
		class="mt-7 grid gap-x-8 gap-y-2 text-left text-[length:var(--fs-body)] leading-snug text-foreground/80 sm:grid-cols-2"
	>
		{#each features as feature (feature.title)}
			<li class="flex gap-2">
				<span aria-hidden="true" class="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent"></span>
				<span class="font-medium text-foreground/80">{feature.title}</span>
			</li>
		{/each}
	</ul>

	<!-- The action block, full card width: the voucher hook, the €25 price as
	     prominently as avenCEO's 385 €, then the name check on one line. -->
	<div class="mt-7 space-y-4">
		{#if ceoBeta}
			<div class="mx-auto max-w-sm rounded-xl bg-offer/25 px-4 py-3 text-center">
				<p class="font-bold leading-snug text-foreground/90">
					{t.betaLine(ceoBeta.discountPct, ceoBeta.months)}
				</p>
				<p class="mt-0.5 text-[length:var(--fs-meta)] font-medium leading-snug text-foreground/55">
					{t.betaScarcity}
				</p>
			</div>
		{/if}
		<div class="border-t border-border/25"></div>
		<div class="rounded-2xl border border-border/25 bg-surface-card px-5 py-4 text-center">
			<p class="flex flex-wrap items-baseline justify-center gap-x-2">
				<span class="text-3xl font-semibold tabular-nums tracking-tight text-foreground">
					{euro(avenId.eurPrice)}&nbsp;€
				</span>
				<span class="text-[length:var(--fs-meta)] font-medium text-foreground/50">
					{priceSuffix(avenId, lang)}
				</span>
			</p>
		</div>
		<div class="flex flex-col gap-2.5 sm:flex-row sm:items-stretch">
			<label
				class="flex min-h-16 flex-1 items-center gap-2 rounded-full border border-accent/25 bg-surface-cream px-6 text-left shadow-[0_1px_3px_rgba(30,41,59,0.05)]"
			>
				<input
					bind:value={name}
					type="text"
					name="aven-name"
					autocomplete="off"
					spellcheck="false"
					placeholder={t.placeholder}
					class="min-w-0 flex-1 bg-transparent py-3 text-[length:var(--fs-amount)] font-semibold tracking-tight text-foreground outline-none placeholder:text-foreground/35"
				>
				<span class="shrink-0 text-[length:var(--fs-title)] font-medium text-foreground/55"
					>.aven.ceo</span
				>
			</label>
			<button
				type="submit"
				disabled={!slug}
				class="inline-flex min-h-16 shrink-0 items-center justify-center rounded-full bg-primary px-8 text-[length:var(--fs-title)] font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-40"
			>
				{t.button}
			</button>
		</div>
	</div>
</form>
