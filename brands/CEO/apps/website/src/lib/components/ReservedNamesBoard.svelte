<script lang="ts">
import { type Lang, pick } from '$lib/i18n'
import { common } from '$lib/i18n/common'
import { nextPosition, reservedInOrder } from '$lib/reserved-names'

/**
 * The waiting list itself, under every avenCEO-name call to action — in order,
 * because the order IS the offer: whoever stands first, founds first. The
 * open row at the bottom is the reader's place, and it is a real number
 * (one past the last name actually taken), not a countdown dressed up as
 * scarcity.
 *
 * It renders ONLY what `reserved-names.ts` really holds; with an empty list
 * this draws nothing, because an empty queue is the truth and a padded one
 * is not.
 */
let { limit = 6, lang = 'de' }: { limit?: number; lang?: Lang } = $props()

const t = $derived(pick(common, lang).board)

const taken = $derived(reservedInOrder())
/** Show the head of the queue; a long list keeps its first places visible. */
const shown = $derived(taken.slice(0, limit))
const hidden = $derived(taken.length - shown.length)
</script>

{#if taken.length > 0}
	<div class="mt-6 border-t border-border/25 pt-5">
		<p class="text--eyebrow">
			{t.eyebrow(nextPosition())}
		</p>
		<ol class="mt-3 space-y-1.5">
			{#each shown as name, i (name.slug)}
				<li class="flex items-baseline gap-3 text-[length:var(--fs-body)]">
					<span class="w-6 shrink-0 text-right font-semibold tabular-nums text-foreground-quiet">
						{i + 1}
					</span>
					<span class="font-semibold tracking-tight text-foreground">{name.slug}</span>
					<span class="text-[length:var(--fs-eyebrow)] text-foreground-quiet">.aven.ceo</span>
					{#if name.holder}
						<span class="ml-auto text-[length:var(--fs-eyebrow)] text-foreground-quiet"
							>{name.holder}</span
						>
					{/if}
				</li>
			{/each}
			{#if hidden > 0}
				<li class="flex items-baseline gap-3 text-[length:var(--fs-meta)] text-foreground-quiet">
					<span class="w-6 shrink-0 text-right tabular-nums">⋮</span>
					<span>{t.more(hidden)}</span>
				</li>
			{/if}
			<li
				class="flex items-baseline gap-3 rounded-lg border border-dashed border-accent/25 bg-accent/8 px-2 py-1.5 text-[length:var(--fs-body)]"
			>
				<span class="w-6 shrink-0 text-right font-semibold tabular-nums text-accent-ink">
					{nextPosition()}
				</span>
				<span class="font-semibold tracking-tight text-foreground-quiet">{t.yourName}</span>
				<span class="text-[length:var(--fs-eyebrow)] text-foreground-quiet">.aven.ceo</span>
				<span class="ml-auto text-[length:var(--fs-eyebrow)] font-medium text-accent-ink"
					>{t.free}</span
				>
			</li>
		</ol>
		<p class="mt-3 text-[length:var(--fs-eyebrow)] leading-snug text-foreground-quiet">
			{t.footnote}
		</p>
	</div>
{/if}
