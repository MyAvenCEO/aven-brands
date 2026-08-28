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
	<MarketingSiteHeader {lang} overlay />

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

		<div id="home-hero-content" class="mx-auto max-w-3xl text-center">
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
					class="text-pretty text-[length:var(--fs-hero)] font-normal leading-snug sm:text-[length:var(--fs-display)]"
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
		<div class="mx-auto max-w-4xl text-primary-foreground">
			<h2
				id="trust-headline"
				class="mx-auto max-w-2xl text-[length:var(--fs-amount)] font-normal leading-tight tracking-tight text-balance sm:text-[length:var(--fs-display)]"
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
							class="text-[length:var(--fs-micro)] font-medium uppercase leading-tight tracking-[var(--tracking-wide)] text-primary-foreground/60 sm:text-[length:var(--fs-meta)]"
							>{claim}</span
						>
					</li>
				{/each}
			</ul>
		</div>
	</section>

	<!-- The shift: the FOMO that is simply true — post-AGI touches everyone. -->
	<section class="section-band sm:px-8 sm:py-20" aria-labelledby="shift-heading">
		<div class="mx-auto max-w-4xl">
			<div class="mx-auto max-w-2xl text-center">
				<p class="eyebrow-accent">
					{t.shift.eyebrow}
				</p>
				<h2
					id="shift-heading"
					class="mt-4 text-3xl tracking-tight text-pretty text-foreground sm:text-4xl"
				>
					{t.shift.heading}
				</h2>
				<p
					class="mx-auto mt-4 max-w-xl text-[length:var(--fs-title)] leading-snug text-foreground/65 sm:text-base"
				>
					{@html t.shift.bodyHtml}
				</p>
				<p
					class="mx-auto mt-6 max-w-xl text-pretty text-[length:var(--fs-hero)] font-medium leading-snug text-foreground sm:text-[length:var(--fs-amount)]"
				>
					{t.shift.question}
				</p>
			</div>

			<!-- The emotional fork: the same future, seen from both sides. -->
			<div class="mt-10 grid gap-4 sm:grid-cols-2">
				<div class="rounded-2xl bg-primary p-6 sm:p-7">
					<p
						class="text-[length:var(--fs-nano)] font-bold uppercase tracking-[var(--tracking-widest)] text-primary-foreground/50"
					>
						{t.shift.without.eyebrow}
					</p>
					<h3 class="mt-2 text-xl tracking-tight text-primary-foreground sm:text-2xl">
						{t.shift.without.title}
					</h3>
					<ul
						class="mt-4 space-y-2.5 text-[length:var(--fs-section)] leading-snug text-primary-foreground/65"
					>
						{#each t.shift.without.items as item, i (i)}
							<li class="flex gap-2.5">
								<span
									class="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary-foreground/25"
									aria-hidden="true"
								></span>
								<span>{item}</span>
							</li>
						{/each}
					</ul>
					<p
						class="mt-5 border-t border-primary-foreground/15 pt-4 text-[length:var(--fs-hero)] font-light leading-snug text-primary-foreground sm:text-[length:var(--fs-amount)]"
					>
						{t.shift.without.closing}
					</p>
				</div>
				<div class="rounded-2xl border border-accent/25 bg-secondary p-6 sm:p-7">
					<p
						class="text-[length:var(--fs-nano)] font-bold uppercase tracking-[var(--tracking-widest)] text-foreground/50"
					>
						{t.shift.with.eyebrow}
					</p>
					<h3 class="mt-2 text-xl tracking-tight text-foreground sm:text-2xl">
						{t.shift.with.title}
					</h3>
					<ul
						class="mt-4 space-y-2.5 text-[length:var(--fs-section)] leading-snug text-foreground/80"
					>
						{#each t.shift.with.items as item, i (i)}
							<li class="flex gap-2.5">
								<span class="bullet" aria-hidden="true"></span>
								<span>{item}</span>
							</li>
						{/each}
					</ul>
					<p
						class="mt-5 border-t border-foreground/8 pt-4 text-[length:var(--fs-hero)] font-light leading-snug text-foreground sm:text-[length:var(--fs-amount)]"
					>
						{t.shift.with.closing}
					</p>
				</div>
			</div>

			<p
				class="mx-auto mt-10 max-w-xl text-center text-[length:var(--fs-lead)] font-light leading-snug tracking-tight text-foreground sm:text-[length:var(--fs-hero)]"
			>
				{t.shift.closingBefore}
				<strong class="font-sans font-semibold text-accent">{t.shift.closingStrong}</strong>
			</p>
		</div>
	</section>

	<!-- The thesis: the company of the future, named. A paradise-blue spread —
	     the page's turning point, set against the light sections around it. -->
	<section
		class="bg-success px-5 py-20 text-primary-foreground sm:px-8 sm:py-28"
		aria-labelledby="company-heading"
	>
		<div class="mx-auto max-w-3xl text-center">
			<p
				class="text-[length:var(--fs-eyebrow)] font-semibold uppercase tracking-[var(--tracking-wider)] text-primary-foreground/75"
			>
				{t.company.eyebrow}
			</p>
			<h2
				id="company-heading"
				class="mt-5 text-[clamp(2rem,6.5vw,4rem)] font-light leading-tight tracking-tight text-primary-foreground"
			>
				{t.company.heading}
			</h2>
			<div
				id="company-prose"
				class="mx-auto mt-8 max-w-2xl space-y-4 text-[length:var(--fs-title)] leading-relaxed text-primary-foreground/70 sm:text-base"
			>
				{#each t.company.paragraphsHtml as paragraph, i (i)}
					<p class="text-pretty">{@html paragraph}</p>
				{/each}
			</div>
			<p
				class="mx-auto mt-9 max-w-xl border-t border-primary-foreground/15 pt-7 text-[length:var(--fs-lead)] font-light leading-snug tracking-tight text-primary-foreground sm:text-[length:var(--fs-hero)]"
			>
				{t.company.closingLine1}
				<span class="mt-2 block">
					{t.company.closingLine2Before}
					<strong class="font-sans font-medium text-accent">{t.company.closingLine2Strong}</strong>.
				</span>
			</p>
		</div>
	</section>

	<!-- The pitch in one picture: an Aven is something you OWN, and you end up
	     owning several. Three rungs, not prose — the ladder is the argument. -->
	<section class="section-band sm:px-8 sm:py-20" aria-labelledby="own-heading">
		<div class="mx-auto max-w-4xl">
			<div class="mx-auto max-w-2xl text-center">
				<p class="eyebrow-accent">
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
					class="mx-auto mt-4 max-w-xl text-[length:var(--fs-title)] leading-snug text-foreground/65 sm:text-base"
				>
					{t.own.lead}
				</p>
			</div>

			<ol class="mt-10 grid gap-4 sm:grid-cols-3">
				{#each t.own.rungs as rung (rung.title)}
					<li
						class="rounded-2xl border border-foreground/8 bg-surface-raised p-6 shadow-[0_1px_3px_rgba(30,41,59,0.05)]"
					>
						<p
							class="text-[length:var(--fs-eyebrow)] font-bold uppercase tracking-[var(--tracking-wider)] text-accent"
						>
							{rung.count}
						</p>
						<p class="mt-2 font-display text-xl tracking-tight text-foreground">{rung.title}</p>
						<p class="mt-2 text-[length:var(--fs-section)] leading-snug text-foreground/65">
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

	<section
		class="border-b border-border/25 bg-linear-to-b from-surface-soft/25 to-transparent px-5 py-9 sm:px-8 sm:py-11"
		id="founders"
	>
		<div class="mx-auto max-w-5xl">
			<header class="mx-auto max-w-2xl text-center">
				<p class="eyebrow-accent">
					{t.founders.eyebrow}
				</p>
				<h2
					class="mt-2 text-[clamp(1.5rem,4vw,2.15rem)] font-light leading-tight tracking-tight text-foreground/90"
				>
					{t.founders.heading}
				</h2>
				<p
					class="mx-auto mt-4 max-w-xl text-[length:var(--fs-body)] leading-relaxed text-foreground/65 sm:max-w-2xl sm:text-[length:var(--fs-title)] sm:leading-[1.52]"
				>
					{@html t.founders.introHtml}
				</p>
				<p
					class="mx-auto mt-3 max-w-xl text-[length:var(--fs-body)] leading-relaxed text-foreground/65 sm:max-w-2xl sm:text-[length:var(--fs-title)] sm:leading-[1.52]"
				>
					{@html t.founders.teamHtml}
				</p>
			</header>

			<div
				class="mx-auto mt-8 max-w-3xl rounded-2xl border border-foreground/8 bg-surface-raised px-4 py-5 shadow-[0_1px_3px_rgba(30,41,59,0.05)] sm:px-6 sm:py-6"
			>
				<div
					class="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1.2fr)] items-stretch gap-x-2 sm:gap-x-4"
				>
					<div class="flex min-w-0 flex-col items-center justify-start text-center">
						<div
							class="size-14 shrink-0 overflow-hidden rounded-full ring-2 ring-background sm:size-16"
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
							class="mt-0.5 max-w-[9rem] text-[length:var(--fs-nano)] leading-tight text-foreground/50 sm:text-[length:var(--fs-micro)]"
						>
							{t.founders.samuel.caption}
						</p>
					</div>
					<div
						class="flex w-6 min-w-[1.5rem] flex-col justify-center pb-10 sm:w-8 sm:pb-12"
						aria-hidden="true"
					>
						<span
							class="text-center text-2xl font-light leading-none text-foreground/35 sm:text-[length:var(--fs-display)]"
							>+</span
						>
					</div>
					<div class="flex min-w-0 flex-col items-center justify-start text-center">
						<div
							class="size-14 shrink-0 overflow-hidden rounded-full ring-2 ring-background sm:size-16"
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
							class="mt-0.5 max-w-[9rem] text-[length:var(--fs-nano)] leading-tight text-foreground/50 sm:text-[length:var(--fs-micro)]"
						>
							{t.founders.daniel.caption}
						</p>
					</div>
					<div
						class="flex w-6 min-w-[1.5rem] flex-col justify-center pb-10 sm:w-8 sm:pb-12"
						aria-hidden="true"
					>
						<span
							class="text-center text-2xl font-light leading-none text-foreground/35 sm:text-[length:var(--fs-display)]"
							>→</span
						>
					</div>
					<div class="flex min-w-0 flex-col items-center justify-start text-center">
						<div
							class="size-14 shrink-0 overflow-hidden rounded-full ring-2 ring-background sm:size-16 [&>svg]:block [&>svg]:size-full"
							aria-hidden="true"
						>
							{@html beamAvatarSvg('avenCEO', paletteKi, 64, 'fnd-k-ceo')}
						</div>
						<p class="mt-2 eyebrow-quiet">
							{t.founders.ceo.role}
						</p>
						<p
							class="mt-0.5 text-[length:var(--fs-meta)] font-bold tracking-[var(--tracking-wide)] text-accent sm:text-[length:var(--fs-body)]"
						>
							{t.founders.ceo.name}
						</p>
						<p
							class="mt-0.5 max-w-[9rem] text-[length:var(--fs-nano)] leading-tight text-foreground/50 sm:text-[length:var(--fs-micro)]"
						>
							{t.founders.ceo.caption}
						</p>
					</div>
				</div>
				<p
					class="mt-4 border-t border-border/25 pt-3 text-center text-[length:var(--fs-micro)] font-bold tracking-[var(--tracking-widest)] text-accent sm:text-[length:var(--fs-eyebrow)]"
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
				<p class="eyebrow-accent">
					{t.skills.eyebrow}
				</p>
				<h2
					id="skills-preview-heading"
					class="mt-4 text-3xl tracking-tight text-pretty text-foreground sm:text-4xl"
				>
					{t.skills.heading}
				</h2>
				<p
					class="mx-auto mt-4 max-w-xl text-[length:var(--fs-title)] leading-snug text-foreground/65 sm:text-base"
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
					class="inline-flex items-center gap-1.5 text-[length:var(--fs-meta)] font-bold uppercase tracking-[var(--tracking-wider)] text-foreground/65 transition-colors hover:text-foreground"
				>
					{t.skills.all}
				</a>
			</p>
		</div>
	</section>

	<section class="border-b border-border/25 px-5 py-14 sm:px-8 sm:py-16">
		<div class="mx-auto max-w-2xl">
			<div class="pb-6 text-center">
				<p class="eyebrow-accent">
					{t.start.eyebrow}
				</p>
				<h2 class="mt-3 text-3xl tracking-tight text-pretty text-foreground sm:text-4xl">
					{t.start.heading}
				</h2>
				<p
					class="mx-auto mt-3 max-w-lg text-[length:var(--fs-title)] leading-snug text-foreground/65 sm:text-base"
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
/* The company thesis sits on marine, but its emphasised words are authored
   with the light-page tone (text-foreground) — lift them so they read on the
   dark spread. Keyed off the id so the strict utility plugin ignores it. */
#company-prose :global(strong) {
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
	background: linear-gradient(
		to bottom,
		rgba(15, 23, 42, 0.5) 0%,
		rgba(15, 23, 42, 0.32) 42%,
		rgba(15, 23, 42, 0.55) 100%
	);
}

#home-hero-content {
	position: relative;
}

#home-hero-heading {
	color: #fff;
	text-shadow: 0 2px 24px rgba(15, 23, 42, 0.45);
}

#home-hero-lead {
	color: rgba(255, 255, 255, 0.94);
	text-shadow: 0 1px 16px rgba(15, 23, 42, 0.4);
}

/* The muted half of the transformation line is dark by default (built in
   home.ts for the light page) — lift it to a soft white on the video. The
   accent half keeps its brand gold, which reads well over the scrim. */
#home-hero-lead :global(strong.text-foreground\/50) {
	color: rgba(255, 255, 255, 0.68);
}

#home-hero-helper {
	color: rgba(255, 255, 255, 0.72);
	text-shadow: 0 1px 12px rgba(15, 23, 42, 0.4);
}

@media (prefers-reduced-motion: reduce) {
	#home-hero-video {
		display: none;
	}
	/* With the video hidden, the poster still shows via the section's own
	   background so the stage is never blank. */
	#home-hero {
		background: #1e293b center / cover no-repeat url("/hero-poster.jpg");
	}
}
</style>
