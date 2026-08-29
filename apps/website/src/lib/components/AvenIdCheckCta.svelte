<script lang="ts">
import { type Lang, pick } from '$lib/i18n'
import { common } from '$lib/i18n/common'
import { localizedPlan, priceSuffix } from '$lib/i18n/plans'
import { pricing } from '$lib/i18n/pricing'
import { idFunnelHref } from '$lib/id-service'
import { euro, plan } from '$lib/pricing/plans'

type Props = {
	variant?: 'inline' | 'banner'
	lang?: Lang
}

let { variant = 'inline', lang = 'de' }: Props = $props()

const t = $derived(pick(common, lang).idCta)
/** For the MIND-credits line — shared wording with the pricing page. */
const tp = $derived(pick(pricing, lang))
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
		? 'rounded-3xl border-2 border-accent/25 bg-surface-raised px-5 py-9 shadow-[var(--shadow-raised)] sm:px-10 sm:py-11'
		: 'rounded-2xl border border-border/25 bg-surface-raised px-5 py-7 sm:px-8 sm:py-8'
)
</script>

<form
	onsubmit={submit}
	class="{wrapperClass} overflow-hidden {centered ? 'text-center' : ''}"
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
		{#if avenId.runtime}
			<li class="flex gap-2">
				<span aria-hidden="true" class="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent"></span>
				<span class="font-semibold text-foreground/85"
					>{tp.mindOnce(avenId.runtime.mindCredits)}</span
				>
			</li>
		{/if}
		{#each features as feature (feature.title)}
			<li class="flex gap-2">
				<span aria-hidden="true" class="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent"></span>
				<span class="font-medium text-foreground/80">{feature.title}</span>
			</li>
		{/each}
	</ul>

	<!-- The action block, full card width: the voucher hook, the €25 price as
	     prominently as avenCEO's price, then the name check on one line. -->
	<div class="mt-7 space-y-5">
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
		<!-- One field, read as one address: the name types RIGHT-aligned so it
		     sits flush against the fixed ".aven.ceo" suffix — a divided,
		     non-editable segment at the SAME size. Field and button share one
		     height (h-20) so they line up exactly on desktop.

		     `flex-1` is deliberately `sm:` only. This wrapper is `flex-col`
		     until `sm`, and in a column the MAIN axis is vertical — so an
		     unprefixed `flex-1` sets `flex-basis: 0` on the height and the
		     field collapses to its content (40px) no matter what `h-` says.
		     It did exactly that at h-16 before anyone measured it.

		     The field is the action of this card, so it is deliberately the
		     largest control on it: 80px tall against the button's text, and set
		     one step up the ramp from the rest of the block. -->
		<div class="flex flex-col gap-2.5 sm:flex-row sm:items-stretch">
			<label
				class="flex h-20 items-stretch overflow-hidden rounded-full border-2 border-accent/40 bg-surface-cream text-left shadow-[var(--shadow-floating)] sm:flex-1"
			>
				<input
					bind:value={name}
					type="text"
					name="aven-name"
					autocomplete="off"
					spellcheck="false"
					placeholder={t.placeholder}
					class="min-w-0 flex-1 bg-transparent pl-7 pr-2 text-right text-[length:var(--fs-amount)] font-medium tracking-tight text-foreground outline-none placeholder:text-foreground/35"
				>
				<span
					class="flex shrink-0 select-none items-center border-l border-accent/30 bg-surface-soft/60 px-6 text-[length:var(--fs-amount)] font-medium text-foreground/45"
					>.aven.ceo</span
				>
			</label>
			<button
				type="submit"
				disabled={!slug}
				class="inline-flex h-20 shrink-0 items-center justify-center rounded-full bg-primary px-9 text-[length:var(--fs-lead)] font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-40"
			>
				{t.button}
			</button>
		</div>
	</div>

	<!-- The early-adopter perk as a full-width footer bar clipped to the card's
	     rounded corners: negative margins cancel the card padding, overflow-hidden
	     on the form rounds it off. -->
	{#if ceoBeta}
		<div class="-mx-5 -mb-9 mt-8 bg-accent px-5 py-4 text-center sm:-mx-10 sm:-mb-11 sm:px-10">
			<p class="font-bold leading-snug text-foreground/90">
				{t.betaLine(ceoBeta.discountPct, ceoBeta.months)}
			</p>
			<p class="mt-0.5 text-[length:var(--fs-meta)] font-medium leading-snug text-foreground/60">
				{t.betaScarcity}
			</p>
		</div>
	{/if}
</form>
