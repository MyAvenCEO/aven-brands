<script lang="ts">
import ReservedNamesBoard from '$lib/components/ReservedNamesBoard.svelte'
import { type Lang, pick } from '$lib/i18n'
import { common } from '$lib/i18n/common'
import { idFunnelHref } from '$lib/id-service'
import { euro, plan } from '$lib/pricing/plans'

type Props = {
	variant?: 'inline' | 'banner'
	lang?: Lang
}

let { variant = 'inline', lang = 'de' }: Props = $props()

const t = $derived(pick(common, lang).idCta)
const avenId = plan('avenid')

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
	window.location.href = idFunnelHref('avenid', slug)
}

const wrapperClass = $derived(
	variant === 'banner'
		? 'rounded-2xl border border-border/25 bg-surface-raised px-5 py-8 shadow-[0_1px_3px_rgba(30,41,59,0.05)] sm:px-10 sm:py-10'
		: 'rounded-2xl border border-border/25 bg-surface-raised px-5 py-7 sm:px-8 sm:py-8'
)
</script>

<form onsubmit={submit} class={wrapperClass} aria-label={t.formLabel}>
	<p class="eyebrow-accent">
		{t.eyebrow}
	</p>
	<h3
		class="mt-2 text-xl font-semibold tracking-tight text-pretty text-foreground sm:text-2xl md:text-[length:var(--fs-amount)]"
	>
		{t.title(euro(avenId.eurPrice))}
	</h3>
	<!-- Our own static copy with inline emphasis — not user content. -->
	<p
		class="mt-3 max-w-2xl text-[length:var(--fs-section)] leading-snug text-foreground/65 sm:text-[length:var(--fs-title)]"
	>
		{@html t.bodyHtml}
	</p>
	<div class="mt-6 flex flex-col gap-2.5 sm:flex-row sm:items-stretch">
		<label
			class="flex min-h-12 flex-1 items-center gap-2 rounded-full border border-border/25 bg-surface-raised px-4"
		>
			<input
				bind:value={name}
				type="text"
				name="aven-name"
				autocomplete="off"
				spellcheck="false"
				placeholder={t.placeholder}
				class="min-w-0 flex-1 bg-transparent py-3 text-[length:var(--fs-title)] font-medium tracking-tight text-foreground outline-none placeholder:text-foreground/35"
			>
			<span class="shrink-0 text-[length:var(--fs-body)] text-foreground/50">.aven.ceo</span>
		</label>
		<button
			type="submit"
			disabled={!slug}
			class="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-primary px-7 text-[length:var(--fs-body)] font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-40 sm:px-8"
		>
			{t.button}
		</button>
	</div>
	<p class="mt-3 text-[length:var(--fs-meta)] leading-snug text-foreground/50">
		{t.exampleLabel} <strong class="font-semibold text-foreground/80">maia.aven.ceo</strong>
		<span class="text-foreground/50"> · </span>
		{t.priceNote(euro(avenId.eurPrice))}
	</p>
	<ReservedNamesBoard {lang} />
</form>
