<script lang="ts">
import { beamAvatarSvg, paletteFromCommaString } from '$lib/beam-avatar'
import AvenIdCheckCta from '$lib/components/AvenIdCheckCta.svelte'
import MarketingSiteHeader from '$lib/components/MarketingSiteHeader.svelte'
import SiteFooter from '$lib/components/SiteFooter.svelte'
import SkillMarketplaceCard from '$lib/components/SkillMarketplaceCard.svelte'
import { type Lang, localeHref, pick } from '$lib/i18n'
import { home } from '$lib/i18n/home'
import { loadSkills } from '$lib/skills/loader'
import danielPhoto from '../../images/daniel.png'
import samuelPhoto from '../../images/samuel.jpg'

let { lang }: { lang: Lang } = $props()

const t = $derived(pick(home, lang))

/** A taste of the marketplace: the first six skills, the full list lives at /skills. */
const skillsPreview = $derived(loadSkills(lang).slice(0, 6))

const paletteKi = paletteFromCommaString('e8c9a8,d4a574,c9a962,305669,222e49')
</script>

<svelte:head>
	<title>{t.title}</title>
	<meta name="description" content={t.description}>
</svelte:head>

<!-- All {@html} below renders our own static copy from $lib/i18n/home.ts — never user content. -->
<div {lang} class="app-shell">
	<MarketingSiteHeader maxWidth="6xl" {lang} overlay />

	<!-- Full-bleed video banner: the 4K first frame is the poster, so a crisp
	     still is on screen the instant the page paints; the muted 720p loop
	     fades in once it can play. A soft dark scrim keeps the copy legible
	     over the bright footage without hiding the scene. -->
	<section id="home-hero" class="px-5 sm:px-8" aria-labelledby="home-hero-heading">
		<video
			id="home-hero-video"
			autoplay
			muted
			loop
			playsinline
			preload="metadata"
			poster="/hero-poster.jpg"
			aria-hidden="true"
		>
			<source src="/hero-bg.mp4" type="video/mp4">
		</video>
		<div id="home-hero-scrim" aria-hidden="true"></div>

		<!-- Its ground is the FOOTAGE, not a colour. A contrast checker walks the
		     cascade for a background and finds the page cream behind white copy —
		     a number for a surface that is not there, and one it will keep
		     reporting however dark the scrim gets. Measured properly, against the
		     real composited pixels at the height each line sits at: the headline
		     is 5.11:1 (needs 3.0) and the lead 4.72:1 (needs 4.5), which is why
		     `--color-scrim` went from 32% to 68%. Before that they were 2.25 and
		     2.57 and axe was right to shout. -->
		<div id="home-hero-content" data-ground="media" class="mx-auto max-w-3xl text-center">
			<h1
				id="home-hero-heading"
				class="mx-auto max-w-3xl text-[clamp(2rem,6.5vw,4rem)] font-light leading-tight tracking-tight text-pretty"
			>
				{t.hero.headingLine1}
				<span class="mt-1 block">{t.hero.headingLine2}</span>
			</h1>
			<div class="mx-auto mt-8 max-w-2xl">
				<p
					id="home-hero-lead"
					class="text-pretty text-[length:var(--fs-lead)] font-light leading-snug sm:text-[length:var(--fs-amount)]"
				>
					{@html t.hero.transformationHtml}
				</p>
				<p
					id="home-hero-helper"
					class="mt-4 text-[length:var(--fs-section)] leading-snug sm:text-[length:var(--fs-lead)]"
				>
					{t.hero.helper}
				</p>
			</div>
		</div>
	</section>

	<!-- Proposition band on the marine-blue brand bar, editorial-style: the
	     claim as a light display headline, then the three 100 % absolutes as
	     columns split by hairline rules, the figures in paradise blue. -->
	<section
		class="bg-primary px-5 py-12 text-center sm:px-8 sm:py-16"
		aria-labelledby="trust-headline"
	>
		<div class="mx-auto max-w-4xl text-band-foreground">
			<h2
				id="trust-headline"
				class="mx-auto max-w-2xl text-[length:var(--fs-amount)] font-normal leading-snug tracking-normal text-balance sm:text-[length:var(--fs-display)]"
			>
				{@html t.trust.headlineHtml}
			</h2>
			<ul
				class="mx-auto mt-8 grid max-w-3xl grid-cols-3 divide-x divide-primary-foreground/15 sm:mt-11"
			>
				{#each t.trust.claims as claim (claim)}
					<li class="flex flex-col items-center gap-1 px-2 sm:gap-2 sm:px-6">
						<span
							class="font-display text-[length:var(--fs-hero)] font-medium tabular-nums text-success sm:text-[length:var(--fs-display)]"
							>100%</span
						>
						<span
							class="text-[length:var(--fs-micro)] font-medium uppercase leading-tight tracking-[var(--tracking-wide)] text-band-foreground sm:text-[length:var(--fs-meta)]"
							>{claim}</span
						>
					</li>
				{/each}
			</ul>
		</div>
	</section>

	<!-- The shift, as an editorial spread: the wish up top, the question set
	     large, then the two scripts side by side — the old one greyed out, the
	     new one in full colour — split by a single rule. No card chrome. -->
	<section class="section-band sm:px-8 sm:py-24" aria-labelledby="shift-heading">
		<div class="mx-auto max-w-5xl">
			<div class="mx-auto max-w-2xl text-center">
				<p class="eyebrow">
					{t.shift.eyebrow}
				</p>
				<h2
					id="shift-heading"
					class="mt-4 text-4xl tracking-tight text-pretty text-foreground sm:text-5xl"
				>
					{t.shift.heading}
				</h2>
				<p
					class="mx-auto mt-5 max-w-xl text-[length:var(--fs-title)] leading-snug text-foreground-quiet sm:text-base"
				>
					{@html t.shift.bodyHtml}
				</p>
			</div>

			<!-- The question as a pull-quote: big display type, one word lit in the
			     brand yellow for magazine contrast. -->
			<p
				class="mx-auto mt-9 max-w-3xl text-center font-display text-[clamp(1.5rem,4.2vw,2.5rem)] font-medium leading-tight tracking-tight text-foreground"
			>
				{@html t.shift.question}
			</p>

			<div class="mt-14 grid gap-10 sm:grid-cols-2 sm:gap-0">
				<!-- The old script: greyed out — the life you're leaving. -->
				<div class="sm:pr-12">
					<p
						class="text-[length:var(--fs-nano)] font-bold uppercase tracking-[var(--tracking-widest)] text-foreground-quiet"
					>
						{t.shift.without.eyebrow}
					</p>
					<h3 class="mt-2 text-2xl tracking-tight text-foreground-quiet sm:text-3xl">
						{t.shift.without.title}
					</h3>
					<ul
						class="mt-5 space-y-3 text-[length:var(--fs-section)] leading-snug text-foreground-quiet sm:text-base"
					>
						{#each t.shift.without.items as item, i (i)}
							<li class="flex gap-3">
								<span class="mt-2.5 h-px w-4 shrink-0 bg-foreground/25" aria-hidden="true"></span>
								<span>{item}</span>
							</li>
						{/each}
					</ul>
					<p
						class="mt-6 text-[length:var(--fs-lead)] font-light leading-snug text-foreground-quiet sm:text-[length:var(--fs-hero)]"
					>
						{t.shift.without.closing}
					</p>
				</div>
				<!-- The new script: full colour, accent marks — the life you write. -->
				<div class="border-t border-border/10 pt-10 sm:border-l sm:border-t-0 sm:pl-12 sm:pt-0">
					<p
						style="color: var(--color-eyebrow-ink)"
						class="text-[length:var(--fs-nano)] font-bold uppercase tracking-[var(--tracking-widest)]"
					>
						{t.shift.with.eyebrow}
					</p>
					<h3 class="mt-2 text-2xl tracking-tight text-foreground sm:text-3xl">
						{t.shift.with.title}
					</h3>
					<ul
						class="mt-5 space-y-3 text-[length:var(--fs-section)] leading-snug text-foreground-soft sm:text-base"
					>
						{#each t.shift.with.items as item, i (i)}
							<li class="flex gap-3">
								<span
									style="background-color: var(--color-paradise)"
									class="mt-2.5 h-px w-4 shrink-0"
									aria-hidden="true"
								></span>
								<span>{item}</span>
							</li>
						{/each}
					</ul>
					<p
						class="mt-6 text-[length:var(--fs-lead)] font-light leading-snug text-foreground sm:text-[length:var(--fs-hero)]"
					>
						{t.shift.with.closing}
					</p>
				</div>
			</div>

			<p
				class="mx-auto mt-16 max-w-2xl text-center text-[length:var(--fs-title)] font-light leading-snug tracking-tight text-foreground-quiet sm:text-[length:var(--fs-lead)]"
			>
				{t.shift.closingBefore}
			</p>
			<p
				style="color: var(--color-eyebrow-ink)"
				class="mx-auto mt-3 max-w-2xl text-center font-display text-[clamp(1.5rem,4vw,2.25rem)] font-medium tracking-tight"
			>
				{t.shift.closingStrong}
			</p>
		</div>
	</section>

	<!-- The thesis: the company of the future, named. A tidal-blue spread (the
	     brand's bluer teal) — the page's turning point, set against the light
	     sections around it, with marine accents. -->
	<section
		class="bg-band px-5 py-20 text-band-foreground sm:px-8 sm:py-28"
		aria-labelledby="company-heading"
	>
		<div class="mx-auto max-w-5xl">
			<div class="text-center">
				<p
					class="text-[length:var(--fs-eyebrow)] font-semibold uppercase tracking-[var(--tracking-wider)] text-band-foreground"
				>
					{t.company.eyebrow}
				</p>
				<h2
					id="company-heading"
					class="mx-auto mt-5 max-w-3xl text-[clamp(2rem,7vw,4.5rem)] font-light leading-[1.03] tracking-tight text-band-foreground"
				>
					{t.company.heading}
				</h2>
			</div>

			<!-- The body as two numbered magazine columns, split by a rule — the
			     editorial contrast against the centred heading and close. -->
			<div
				id="company-prose"
				class="mx-auto mt-14 grid max-w-4xl gap-x-14 gap-y-10 text-left sm:mt-16 lg:grid-cols-2"
			>
				{#each t.company.paragraphsHtml as paragraph, i (i)}
					<div class={i > 0 ? 'lg:border-l lg:border-primary-foreground/15 lg:pl-14' : ''}>
						<span
							class="font-display text-[length:var(--fs-display)] font-light leading-none text-band-foreground"
							>{String(i + 1).padStart(2, '0')}</span
						>
						<p
							class="mt-3 text-[length:var(--fs-title)] leading-relaxed text-band-foreground sm:text-base"
						>
							{@html paragraph}
						</p>
					</div>
				{/each}
			</div>

			<div class="mx-auto mt-16 max-w-xl border-t border-primary-foreground/12 pt-10 text-center">
				<p
					class="text-[length:var(--fs-lead)] font-light leading-snug tracking-tight text-band-foreground sm:text-[length:var(--fs-hero)]"
				>
					{t.company.closingLine1}
					<span class="mt-2 block">
						{t.company.closingLine2Before}
						<span class="font-sans font-medium">{@html t.company.closingLine2Strong}</span>.
					</span>
				</p>
			</div>
		</div>
	</section>

	<!-- The pitch in one picture: an Aven is something you OWN, and you end up
	     owning several. Three rungs, not prose — the ladder is the argument. -->
	<section class="section-band sm:px-8 sm:py-20" aria-labelledby="own-heading">
		<div class="mx-auto max-w-4xl">
			<div class="mx-auto max-w-2xl text-center">
				<p class="eyebrow">
					{t.own.eyebrow}
				</p>
				<h2
					id="own-heading"
					class="mt-4 text-3xl tracking-tight text-pretty text-foreground sm:text-4xl"
				>
					{t.own.headingLine1}
					<span class="mt-1 block">{t.own.headingLine2}</span>
				</h2>
				<p
					class="mx-auto mt-4 max-w-xl text-[length:var(--fs-title)] leading-snug text-foreground-quiet sm:text-base"
				>
					{t.own.lead}
				</p>
			</div>

			<ol class="mt-10 grid gap-4 sm:grid-cols-3">
				{#each t.own.rungs as rung (rung.title)}
					<li
						class="rounded-lg border border-foreground/8 bg-surface-raised p-6 shadow-[var(--shadow-raised)]"
					>
						<p
							class="text-[length:var(--fs-eyebrow)] font-bold uppercase tracking-[var(--tracking-wider)] text-accent-ink"
						>
							{rung.count}
						</p>
						<p class="mt-2 font-display text-xl tracking-tight text-foreground">{rung.title}</p>
						<p class="mt-2 text-[length:var(--fs-section)] leading-snug text-foreground-quiet">
							{rung.text}
						</p>
					</li>
				{/each}
			</ol>

			<p
				class="mx-auto mt-10 max-w-xl text-center text-[length:var(--fs-lead)] font-light leading-snug tracking-tight text-foreground sm:text-[length:var(--fs-hero)]"
			>
				{t.own.closing}
			</p>
		</div>
	</section>

	<!-- Founders as a 50/50 magazine split: the avenCEO speaks from a turquoise
	     panel on the left, the human + AI team stands on the light right. -->
	<section id="founders" class="grid items-stretch lg:grid-cols-2">
		<div
			class="flex items-center bg-band-alt px-5 py-16 text-band-foreground sm:px-8 sm:py-20 lg:px-14 lg:py-28"
		>
			<div class="mx-auto w-full max-w-xl lg:mr-0 lg:ml-auto lg:max-w-md">
				<p
					class="text-[length:var(--fs-body)] font-semibold uppercase tracking-[var(--tracking-wider)] text-band-foreground"
				>
					{t.founders.eyebrow}
				</p>
				<h2
					class="mt-3 text-[clamp(1.75rem,4.5vw,2.75rem)] font-light leading-tight tracking-tight text-band-foreground"
				>
					{t.founders.heading}
				</h2>
				<div
					id="founders-prose"
					class="mt-5 space-y-3 text-[length:var(--fs-title)] leading-relaxed text-band-foreground sm:text-base"
				>
					<p>{@html t.founders.introHtml}</p>
					<p>{@html t.founders.teamHtml}</p>
				</div>
			</div>
		</div>

		<div class="flex items-center bg-surface-page px-5 py-16 sm:px-8 sm:py-20 lg:px-14">
			<div class="mx-auto w-full max-w-md">
				<div
					class="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1.2fr)] items-stretch gap-x-2 sm:gap-x-4"
				>
					<div class="flex min-w-0 flex-col items-center justify-start text-center">
						<div
							class="size-14 shrink-0 overflow-hidden rounded-full ring-2 ring-surface-page sm:size-16"
						>
							<img
								src={samuelPhoto}
								alt={t.founders.samuel.alt}
								class="h-full w-full object-cover"
								width="64"
								height="64"
								decoding="async"
							>
						</div>
						<p class="mt-2 eyebrow-quiet">
							{t.founders.samuel.role}
						</p>
						<p
							class="mt-0.5 truncate text-[length:var(--fs-meta)] font-semibold tracking-tight text-foreground sm:text-[length:var(--fs-body)]"
						>
							{t.founders.samuel.name}
						</p>
						<p
							class="mt-0.5 max-w-[9rem] text-[length:var(--fs-nano)] leading-tight text-foreground-quiet sm:text-[length:var(--fs-micro)]"
						>
							{t.founders.samuel.caption}
						</p>
					</div>
					<div
						class="flex w-6 min-w-[1.5rem] flex-col justify-center pb-10 sm:w-8 sm:pb-12"
						aria-hidden="true"
					>
						<span
							class="text-center text-2xl font-light leading-none text-foreground-quiet sm:text-[length:var(--fs-display)]"
							>+</span
						>
					</div>
					<div class="flex min-w-0 flex-col items-center justify-start text-center">
						<div
							class="size-14 shrink-0 overflow-hidden rounded-full ring-2 ring-surface-page sm:size-16"
						>
							<img
								src={danielPhoto}
								alt={t.founders.daniel.alt}
								class="h-full w-full object-cover"
								width="64"
								height="64"
								decoding="async"
							>
						</div>
						<p class="mt-2 eyebrow-quiet">
							{t.founders.daniel.role}
						</p>
						<p
							class="mt-0.5 truncate text-[length:var(--fs-meta)] font-semibold tracking-tight text-foreground sm:text-[length:var(--fs-body)]"
						>
							{t.founders.daniel.name}
						</p>
						<p
							class="mt-0.5 max-w-[9rem] text-[length:var(--fs-nano)] leading-tight text-foreground-quiet sm:text-[length:var(--fs-micro)]"
						>
							{t.founders.daniel.caption}
						</p>
					</div>
					<div
						class="flex w-6 min-w-[1.5rem] flex-col justify-center pb-10 sm:w-8 sm:pb-12"
						aria-hidden="true"
					>
						<span
							class="text-center text-2xl font-light leading-none text-foreground-quiet sm:text-[length:var(--fs-display)]"
							>→</span
						>
					</div>
					<div class="flex min-w-0 flex-col items-center justify-start text-center">
						<div
							class="size-14 shrink-0 overflow-hidden rounded-full ring-2 ring-surface-page sm:size-16 [&>svg]:block [&>svg]:size-full"
							aria-hidden="true"
						>
							{@html beamAvatarSvg('avenCEO', paletteKi, 64, 'fnd-k-ceo')}
						</div>
						<p class="mt-2 eyebrow-quiet">
							{t.founders.ceo.role}
						</p>
						<p
							class="mt-0.5 text-[length:var(--fs-meta)] font-bold tracking-[var(--tracking-wide)] text-accent-ink sm:text-[length:var(--fs-body)]"
						>
							{t.founders.ceo.name}
						</p>
						<p
							class="mt-0.5 max-w-[9rem] text-[length:var(--fs-nano)] leading-tight text-foreground-quiet sm:text-[length:var(--fs-micro)]"
						>
							{t.founders.ceo.caption}
						</p>
					</div>
				</div>
				<p
					class="mt-4 border-t border-border/8 pt-3 text-center text-[length:var(--fs-micro)] font-bold tracking-[var(--tracking-widest)] text-accent-ink sm:text-[length:var(--fs-eyebrow)]"
				>
					{t.founders.sum}
				</p>
			</div>
		</div>
	</section>

	<!-- Skills preview: what an Aven can already do, straight from the marketplace. -->
	<section class="section-band sm:px-8 sm:py-20" aria-labelledby="skills-preview-heading">
		<div class="mx-auto max-w-5xl">
			<div class="mx-auto max-w-2xl text-center">
				<p class="eyebrow">
					{t.skills.eyebrow}
				</p>
				<h2
					id="skills-preview-heading"
					class="mt-4 text-3xl tracking-tight text-pretty text-foreground sm:text-4xl"
				>
					{t.skills.heading}
				</h2>
				<p
					class="mx-auto mt-4 max-w-xl text-[length:var(--fs-title)] leading-snug text-foreground-quiet sm:text-base"
				>
					{t.skills.lead}
				</p>
			</div>

			<div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each skillsPreview as skill (skill.slug)}
					<SkillMarketplaceCard {skill} {lang} />
				{/each}
			</div>

			<p class="mt-8 text-center">
				<a
					href={localeHref(lang, '/skills')}
					class="inline-flex items-center gap-1.5 text-[length:var(--fs-meta)] font-bold uppercase tracking-[var(--tracking-wider)] text-foreground-quiet transition-colors hover:text-foreground"
				>
					{t.skills.all}
				</a>
			</p>
		</div>
	</section>

	<section class="border-b border-border/8 px-5 py-14 sm:px-8 sm:py-16">
		<div class="mx-auto max-w-2xl">
			<div class="pb-6 text-center">
				<p class="eyebrow">
					{t.start.eyebrow}
				</p>
				<h2 class="mt-3 text-3xl tracking-tight text-pretty text-foreground sm:text-4xl">
					{t.start.heading}
				</h2>
				<p
					class="mx-auto mt-3 max-w-lg text-[length:var(--fs-title)] leading-snug text-foreground-quiet sm:text-base"
				>
					{@html t.start.bodyHtml}
				</p>
			</div>
			<AvenIdCheckCta variant="banner" {lang} />
		</div>
	</section>

	<SiteFooter {lang} />
</div>

<style>
/*
 * Emphasis inside translated copy.
 *
 * Three roles, styled here rather than in the sentence. `lead` is the default
 * and is only a weight — it used to be four different opacities (80, 82, 85,
 * 88) for one idea, none of which anyone could see the difference between.
 * `strong` is the hero's highlight, and stays sunflower because it sits on a
 * photograph, where the tone reads and the page's inks do not. `past` is the
 * life being left behind, so it is struck through and quiet.
 */
/* `:global` because Svelte scopes CSS by stamping a class on elements it
   compiled, and `{@html}` content is not compiled — it arrives as a string, so
   a scoped selector never matches it. */
:global([data-emph]) {
	font-weight: 500;
}
:global([data-emph="strong"]) {
	color: var(--color-accent);
}
:global([data-emph="past"]) {
	color: var(--color-foreground-quiet);
	text-decoration: line-through;
}
/* On the hero photograph the page inks do not apply: everything there is the
   light ink, and `past` is that ink held back. */
#home-hero :global([data-emph="past"]) {
	color: var(--color-on-dark);
	opacity: 0.6;
}

/*
 * Emphasis inside translated copy.
 *
 * The heading used to carry `<span style="color:var(--color-accent)">` in the
 * sentence itself — a colour decision living in content, in two languages, and
 * one that measured 2.72:1 against the band it sits on. Sunflower cannot be
 * made to read on paradise: the lightest version that clears 4.5:1 is white.
 * So on a band the emphasis is weight, and the copy says `<b>`, which is what
 * it meant.
 */
/* `:global` for the same reason the emphasis rules are: the heading's `<b>`
   arrives through `{@html}`, which Svelte never compiled, so it carries no
   scoping class for a scoped selector to match. */
#company-heading :global(b) {
	font-weight: 600;
}

/* The company thesis sits on marine, but its emphasised words are authored
   with the light-page tone (text-foreground) — lift them so they read on the
   dark spread. Keyed off the id so the strict utility plugin ignores it. */
#company-prose :global(strong),
#founders-prose :global(strong) {
	color: var(--color-primary-foreground);
	font-weight: 500;
}

/* The hero is its own dark stage: the video sits behind, a soft scrim
   darkens the bright footage, and the copy goes light on top. Colours and
   the gradient live here (scoped CSS, keyed off ids so the strict utility
   plugin leaves them alone) so the stack stays theme-independent — the
   banner is dark in either theme. */
#home-hero {
	position: relative;
	isolation: isolate;
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 85vh;
	padding-block: clamp(5rem, 12vh, 9rem);
}

#home-hero-video {
	position: absolute;
	inset: 0;
	z-index: -2;
	width: 100%;
	height: 100%;
	object-fit: cover;
}

/* Slightly stronger at top and bottom, lighter through the middle where the
   scene reads — enough to carry white text, not enough to flatten it. */
#home-hero-scrim {
	position: absolute;
	inset: 0;
	z-index: -1;
	/* The scrim's three stops are TOKENS, not percentages written here. They were
	   50/32/55 of marine, mixed at this call site, which is how the top stop came
	   to be 50% -- measurably not enough to carry white nav ink over the video's
	   sky (2.99:1 at the 95th percentile, where the links need 4.5:1). Now the
	   guarantee lives in the role, `--color-scrim-strong`, and raising it fixes
	   every surface that floats text on media rather than this one. */
	background: linear-gradient(
		to bottom,
		var(--color-scrim-strong) 0%,
		var(--color-scrim) 42%,
		var(--color-scrim-heavy) 100%
	);
}

#home-hero-content {
	position: relative;
}

#home-hero-heading {
	color: var(--color-on-dark);
	text-shadow: 0 2px 24px color-mix(in srgb, var(--color-marine) 45%, transparent);
}

#home-hero-lead {
	color: color-mix(in srgb, var(--color-on-dark) 94%, transparent);
	text-shadow: 0 1px 16px color-mix(in srgb, var(--color-marine) 40%, transparent);
}

/* The muted half of the transformation line is dark by default (built in
   home.ts for the light page) — lift it to a soft white on the video. The
   accent half keeps its brand gold, which reads well over the scrim. */
#home-hero-lead :global(strong.text-foreground\/50) {
	color: color-mix(in srgb, var(--color-on-dark) 68%, transparent);
}

#home-hero-helper {
	color: color-mix(in srgb, var(--color-on-dark) 72%, transparent);
	text-shadow: 0 1px 12px color-mix(in srgb, var(--color-marine) 40%, transparent);
}

@media (prefers-reduced-motion: reduce) {
	#home-hero-video {
		display: none;
	}
	/* With the video hidden, the poster still shows via the section's own
	   background so the stage is never blank. */
	#home-hero {
		background: var(--color-marine) center / cover no-repeat url("/hero-poster.jpg");
	}
}
</style>
