<script lang="ts">
	/**
	 * yma.one — the whole page.
	 *
	 * Every visible decision here is a CLASS from `@myavenceo/aven-yma`: `display`
	 * for a heading, `card` for a card, `btn btn-teal` for the turquoise button,
	 * `eyebrow` for the gradient-filled lockup. Where a one-off is genuinely
	 * one-off, it is a utility generated from the same brand's scales.
	 *
	 * There is no stylesheet in this file, which is the test. The original was a
	 * 270-line `<style>` block in the document head, where `.btn.blue`,
	 * `.btn.teal` and `.btn.outline` shared nothing and every heading repeated
	 * the same four declarations. If any of that had to come back here to make
	 * the page look right, the brand package would not be a design system.
	 */
	import { JOURNEY, LEGAL, NAV, OFFERS, THEMES, VALUES, VAT_NOTE } from '$lib/content.js'

	/*
	 * One tone, three places it shows up: the kicker above a card, the wash
	 * behind its closing line, and the ink on top of that wash. Kept together so
	 * a card cannot be teal in one spot and pink in another — which is exactly
	 * what `.card:nth-child(2) .cat` was one edit away from at all times.
	 */
	const TONE = {
		teal: { kicker: 'kicker kicker-teal', together: 'bg-secondary/8 text-secondary-ink' },
		blue: { kicker: 'kicker', together: 'bg-quiet/8 text-quiet' },
		pink: { kicker: 'kicker kicker-pink', together: 'bg-accent/8 text-accent' }
	} as const
</script>

<svelte:head>
	<title>yma — von beschäftigt zu erfüllt · Yvonne Müller-Andert</title>
	<meta
		name="description"
		content="Wieder Ruhe spüren, bei Dir ankommen und in Deinem Rhythmus leben. Begleitung von Yvonne Müller-Andert."
	/>
</svelte:head>

<!-- ── header ─────────────────────────────────────────────────────────────── -->
<header
	class="sticky top-0 z-50 border-border border-b border-t-[3px] border-t-secondary bg-background/85 backdrop-blur-md"
>
	<div class="wrap flex h-20 items-center gap-6">
		<a href="/" aria-label="yma">
			<img src="/images/yma_logo.svg" alt="yma" class="w-[140px]" />
		</a>
		<nav class="ml-auto hidden gap-8 text-[length:var(--fs-meta)] font-medium lg:flex">
			{#each NAV as item (item.href)}
				<a href={item.href} class="text-quiet transition-colors hover:text-secondary-ink"
					>{item.label}</a
				>
			{/each}
		</nav>
		<a href="#weg" class="btn btn-teal ml-auto lg:ml-0">Zurück zu Dir ♡</a>
	</div>
</header>

<!-- ── hero ───────────────────────────────────────────────────────────────── -->
<section class="band-hero relative overflow-hidden">
	<div class="wrap relative z-10 grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
		<div class="max-w-[600px]">
			<p class="eyebrow mb-6">Zurück zu Dir ♡</p>
			<h1 class="display mb-6 text-[length:var(--fs-hero)]">
				Du trägst so viel für alle — und verlierst dabei <span class="em">Dich selbst</span>.
			</h1>
			<p class="mb-9 max-w-[44ch] text-[length:var(--fs-lead)] text-muted-foreground">
				Wieder Ruhe spüren, bei Dir ankommen und in Deinem Rhythmus leben. Von beschäftigt zu
				erfüllt — ich begleite Dich.
			</p>
			<div class="cluster" style="--gap: 1.75rem">
				<a href="#weg" class="btn btn-blue">Zurück zu Dir ♡</a>
				<a href="#ansatz" class="btn btn-outline">Mein Ansatz</a>
			</div>
		</div>
		<div class="overflow-hidden rounded-[var(--radius-xl)] shadow-floating">
			<img src="/images/yvonne.jpg" alt="Yvonne Müller-Andert" class="h-full w-full object-cover" />
		</div>
	</div>
</section>

<!-- ── the values strip ───────────────────────────────────────────────────── -->
<section class="band-sage py-14">
	<div class="wrap cluster justify-center" style="--gap: 0.75rem">
		{#each VALUES as value, i (value)}
			{#if i > 0}
				<span class="text-[length:var(--fs-nano)] text-warning opacity-70">·</span>
			{/if}
			<span
				class="text-[length:var(--fs-micro)] font-semibold uppercase tracking-[var(--tracking-wider)]"
				class:text-quiet={i === 0}
				class:text-secondary-ink={i === 1 || i === 2}
				class:text-accent={i === 3}>{value}</span
			>
		{/each}
	</div>
</section>

<!-- ── the three themes ───────────────────────────────────────────────────── -->
<section id="fuer-dich" class="section">
	<div class="wrap">
		<div class="stack stack-center mb-14">
			<div class="prose stack-center" style="--measure: 640px">
				<p class="kicker">Ich begleite Dich</p>
				<h2 class="display rule-under text-[length:var(--fs-display)]">
					Kennst Du das Gefühl, <span class="em">nur noch zu funktionieren</span> statt wirklich zu leben?
				</h2>
				<p class="text-muted-foreground">
					Ständig im Außen, im Denken, im Organisieren — und dabei immer weiter von Dir selbst
					entfernt? Genau dort starten wir beide gemeinsam.
				</p>
			</div>
		</div>

		<div class="grid-auto">
			{#each THEMES as theme (theme.title)}
				<article class="card">
					<img src="/images/{theme.image}" alt="" class="h-[200px] w-full object-cover" />
					<div class="card-body">
						<p class="{TONE[theme.tone].kicker} mb-2.5">{theme.kicker}</p>
						<h3 class="display mb-3 text-[length:var(--fs-card-title)]">{theme.title}</h3>
						<p class="mb-5 text-[length:var(--fs-meta)] text-muted-foreground">{theme.body}</p>
						<p
							class="mt-auto rounded-[var(--radius-sm)] px-4.5 py-3.5 text-[length:var(--fs-meta)] font-medium italic leading-relaxed {TONE[
								theme.tone
							].together}"
						>
							{theme.together}
						</p>
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>

<!-- ── how I work ─────────────────────────────────────────────────────────── -->
<section id="ansatz" class="section band-sage">
	<div class="wrap">
		<div class="stack stack-center mb-16">
			<div class="prose stack-center" style="--measure: 600px">
				<p class="kicker kicker-teal">Mein Ansatz</p>
				<h2 class="display rule-under text-[length:var(--fs-section)]">So begleite ich Dich</h2>
			</div>
		</div>

		<div class="grid-auto mx-auto max-w-[980px]" style="--gap: 1.375rem">
			{#each JOURNEY as step (step.title)}
				<article class="step" style="--step-bar: {step.bar}">
					<h3 class="display mb-3 text-[length:var(--fs-title)]">
						{step.title}
						<span class="em">{step.emphasis}</span>
					</h3>
					<p class="mx-auto max-w-[24ch] text-[length:var(--fs-small)] text-muted-foreground">
						{step.body}
					</p>
				</article>
			{/each}
		</div>
	</div>
</section>

<!-- ── why ────────────────────────────────────────────────────────────────── -->
<section id="motivation" class="section band-mist">
	<div class="wrap grid items-center gap-12 lg:grid-cols-[0.82fr_1.18fr]">
		<img
			src="/images/waterdrop.jpg"
			alt=""
			class="aspect-[4/5] w-full rounded-[var(--radius-xl)] object-cover shadow-floating"
		/>
		<div>
			<p class="kicker kicker-pink">Meine Motivation</p>
			<h2 class="display rule-under my-4 text-[length:var(--fs-section)]">Darum begleite ich Dich</h2>
			<div class="quote stack" style="--gap: 1rem">
				<p>
					Weil ich selbst erlebt habe, wie schmerzhaft es sein kann, den Kontakt zu sich selbst zu
					verlieren — und wie viel sich verändert, wenn man wieder <em class="em">bei sich ankommt</em
					>.
				</p>
				<p>Weil ich weiß, was möglich ist, wenn innere Ruhe &amp; Vertrauen zurückkehren.</p>
				<p>
					Und weil ich daran glaube, dass jeder Mensch <em class="em">seinen eigenen Rhythmus</em> in
					sich trägt.
				</p>
			</div>
			<p class="mt-5 font-display text-[length:var(--fs-title)] italic text-quiet">
				Yvonne
			</p>
		</div>
	</div>
</section>

<!-- ── the two offers ─────────────────────────────────────────────────────── -->
<section id="weg" class="section">
	<div class="wrap">
		<div class="stack stack-center mb-14">
			<div class="prose stack-center" style="--measure: 600px">
				<p class="kicker">Deine Begleitung</p>
				<h2 class="display rule-under text-[length:var(--fs-section)]">
					2 Wege · 1 Ziel <span class="em">Zurück zu Dir</span>
				</h2>
			</div>
		</div>

		<div class="grid-auto mx-auto max-w-[980px]" style="--columns: 2">
			{#each OFFERS as offer (offer.title)}
				<article class="card relative" class:ring-2={offer.featured}>
					{#if offer.featured}
						<span
							class="absolute right-6 top-6 rounded-full bg-accent px-3 py-1 text-[length:var(--fs-nano)] font-semibold uppercase tracking-[var(--tracking-wide)] text-primary-foreground"
							>Beliebt</span
						>
					{/if}
					<div class="card-body" style="padding-top: 2.5rem">
						<p class={offer.tone === 'teal' ? 'kicker kicker-teal' : 'kicker kicker-pink'}>
							{offer.meta}
						</p>
						<h3 class="display mt-2 text-[length:var(--fs-title)]">{offer.title}</h3>
						<p class="mb-4 text-[length:var(--fs-meta)] text-muted-foreground">{offer.subtitle}</p>

						<p class="display mb-1 text-[length:var(--fs-card-title)]">{offer.price}</p>
						{#if offer.note}
							<p class="mb-4 text-[length:var(--fs-micro)] text-muted-foreground">{offer.note}</p>
						{/if}

						<p class="mb-5 text-[length:var(--fs-meta)] text-muted-foreground">{offer.body}</p>

						{#if offer.items.length}
							<ul class="stack mb-6 list-none" style="--gap: 0.625rem">
								{#each offer.items as item (item)}
									<li class="flex gap-2.5 text-[length:var(--fs-meta)]">
										<span class="text-secondary" aria-hidden="true">♡</span>
										<span>{item}</span>
									</li>
								{/each}
							</ul>
						{/if}

						<a
							href="mailto:hallo@yma.one"
							class="btn mt-auto {offer.tone === 'teal' ? 'btn-teal' : 'btn-blue'}"
							>Jetzt buchen{offer.featured ? ' ♡' : ''}</a
						>
						<p class="mt-3 text-[length:var(--fs-nano)] text-muted-foreground">{VAT_NOTE}</p>
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>

<!-- ── the closing band ───────────────────────────────────────────────────── -->
<section class="py-20" style="background: var(--gradient-band)">
	<div class="wrap stack stack-center text-primary-foreground">
		<p
			class="text-[length:var(--fs-micro)] font-semibold uppercase tracking-[var(--tracking-wider)] opacity-90"
		>
			{VALUES.join(' · ')}
		</p>
		<p class="display max-w-[26ch] text-[length:var(--fs-display)] text-primary-foreground">
			Wieder Ruhe spüren, bei Dir ankommen und in Deinem Rhythmus leben.
		</p>
	</div>
</section>

<!-- ── footer ─────────────────────────────────────────────────────────────── -->
<footer class="border-border border-t py-14">
	<div class="wrap grid gap-10 sm:grid-cols-3">
		<div>
			<img src="/images/yma_logo.svg" alt="yma" class="mb-4 w-[150px]" />
			<p class="text-[length:var(--fs-meta)] text-muted-foreground">
				yma — von beschäftigt zu erfüllt
			</p>
		</div>
		<nav>
			<p class="kicker mb-3">Navigation</p>
			<ul class="stack list-none" style="--gap: 0.375rem">
				{#each NAV as item (item.href)}
					<li>
						<a href={item.href} class="text-[length:var(--fs-meta)] hover:text-secondary-ink"
							>{item.label}</a
						>
					</li>
				{/each}
			</ul>
		</nav>
		<nav>
			<p class="kicker mb-3">Rechtliches</p>
			<ul class="stack list-none" style="--gap: 0.375rem">
				{#each LEGAL as item (item.href)}
					<li>
						<a href={item.href} class="text-[length:var(--fs-meta)] hover:text-secondary-ink"
							>{item.label}</a
						>
					</li>
				{/each}
			</ul>
		</nav>
	</div>
	<div class="wrap mt-10 text-[length:var(--fs-micro)] text-muted-foreground">
		© 2026 Yvonne Müller-Andert
	</div>
</footer>
