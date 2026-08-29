<script lang="ts">
/**
 * ceoBRAND — the interactive design-system surface.
 *
 * The generated `kitchen-sink.html` proves the brand renders; this proves it is
 * inspectable. Both read the SAME exports, so neither can drift from the other
 * or from the product: a token that exists appears here, and one that does not,
 * does not. Nothing on this page is a hand-kept list.
 *
 * Per the upgrade plan this is the seed of ceoBRAND. Today the specimens are
 * markup wearing the brand's own classes; once the unit library lands (P3) each
 * specimen becomes the unit itself rendered through aven-vibes, and the aside
 * becomes registry-driven.
 */
import MarketingSiteHeader from '$lib/components/MarketingSiteHeader.svelte'
import {
	colourGroups,
	componentNames,
	declarationsOf,
	elevationScale,
	fontStacks,
	fontWeights,
	inkScale,
	layoutNames,
	radiusScale,
	sections,
	spaceScale,
	specimenTag,
	tintScale,
	trackingScale,
	typeScale
} from '$lib/docs/sections'

let active = $state('colour')
let inspecting = $state<string | null>(null)

const inspectedDecls = $derived(inspecting ? declarationsOf(inspecting) : [])

function inspect(name: string) {
	inspecting = inspecting === name ? null : name
}
</script>

<svelte:head>
	<title>ceoBRAND · avenCEO</title>
	<meta
		name="description"
		content="The avenCEO design system: colour, type, emphasis, geometry and components, rendered from the source."
	>
</svelte:head>

<MarketingSiteHeader active="docs" lang="en" />

<div id="ceobrand" class="app-shell">
	<header id="cb-head">
		<div>
			<p class="eyebrow-accent">ceoBRAND</p>
			<h1 class="title">Design system</h1>
			<p class="lede">
				Rendered from the brand config itself. If it renders wrong, the system is wrong.
			</p>
		</div>
		<a class="meta" href="/docs/">Back to docs</a>
	</header>

	<div id="cb-body">
		<aside id="cb-aside" aria-label="Sections">
			<nav>
				<ul>
					{#each sections as section (section.id)}
						<li>
							<button
								type="button"
								class="cb-nav"
								aria-current={active === section.id ? 'true' : undefined}
								onclick={() => {
									active = section.id
									inspecting = null
								}}
							>
								<span>{section.label}</span>
								<span class="cb-count">{section.count}</span>
							</button>
						</li>
					{/each}
				</ul>
			</nav>
		</aside>

		<main id="cb-main">
			{#if active === 'colour'}
				{#each colourGroups as group (group.id)}
					<section class="cb-section">
						<p class="eyebrow-quiet">{group.title}</p>
						<p class="meta">{group.lede}</p>
						<div class="cb-swatches">
							{#each group.rows as row (row.name)}
								<div class="cb-swatch">
									<div class="cb-chip" style="background: var({row.cssVar})"></div>
									<p class="cb-name">{row.name}</p>
									<p class="cb-mono">{row.value}</p>
								</div>
							{/each}
						</div>
					</section>
				{/each}
			{:else if active === 'type'}
				<section class="cb-section">
					<p class="eyebrow-quiet">Faces</p>
					<p class="meta">The stacks the brand sets its words in.</p>
					<div class="cb-rows">
						{#each fontStacks as font (font.name)}
							<div class="cb-row">
								<span style="font-family: {font.value}; font-size: var(--fs-hero)">
									There is so much more in you
								</span>
								<span class="cb-mono">{font.name}</span>
							</div>
						{/each}
					</div>
				</section>
				<section class="cb-section">
					<p class="eyebrow-quiet">Weights</p>
					<div class="cb-rows">
						{#each fontWeights as weight (weight.name)}
							<div class="cb-row">
								<span style="font-weight: {weight.value}; font-size: var(--fs-lead)">
									{weight.name}
								</span>
								<span class="cb-mono">{weight.value}</span>
							</div>
						{/each}
					</div>
				</section>
				<section class="cb-section">
					<p class="eyebrow-quiet">Ramp</p>
					<p class="meta">Twelve steps. A size not on the ramp is not available.</p>
					<div class="cb-rows">
						{#each typeScale as step (step.name)}
							<div class="cb-row">
								<span style="font-size: var({step.cssVar})">Every brand is a config</span>
								<span class="cb-mono">{step.name} · {step.value}</span>
							</div>
						{/each}
					</div>
				</section>
				<section class="cb-section">
					<p class="eyebrow-quiet">Tracking</p>
					<div class="cb-rows">
						{#each trackingScale as step (step.name)}
							<div class="cb-row">
								<span
									style="letter-spacing: var({step.cssVar}); text-transform: uppercase; font-size: var(--fs-eyebrow)"
								>
									Sovereign founder
								</span>
								<span class="cb-mono">{step.name} · {step.value}</span>
							</div>
						{/each}
					</div>
				</section>
			{:else if active === 'alpha'}
				<section class="cb-section">
					<p class="eyebrow-quiet">Alpha · on text</p>
					<p class="meta">
						Text emphasis as steps, not a continuum. The faintest step is the disabled and watermark
						level and deliberately sits below AA, so it must never carry live text.
					</p>
					<div class="cb-rows">
						{#each inkScale as step (step.name)}
							<div class="cb-row">
								<span
									style="color: color-mix(in srgb, var(--color-marine) calc(var({step.cssVar}) * 100%), transparent)"
								>
									Readable at this weight
								</span>
								<span class="cb-mono">{step.name} · {step.value}</span>
							</div>
						{/each}
					</div>
				</section>
				<section class="cb-section">
					<p class="eyebrow-quiet">Alpha · on surface</p>
					<p class="meta">The same ink as a surface rather than as text.</p>
					<div class="cb-rows">
						{#each tintScale as step (step.name)}
							<div class="cb-row">
								<span
									class="cb-tint"
									style="background: color-mix(in srgb, var(--color-marine) calc(var({step.cssVar}) * 100%), transparent)"
								></span>
								<span class="cb-mono">{step.name} · {step.value}</span>
							</div>
						{/each}
					</div>
				</section>
			{:else if active === 'geometry'}
				<section class="cb-section">
					<p class="eyebrow-quiet">Radius</p>
					<div class="cb-rows">
						{#each radiusScale as step (step.name)}
							<div class="cb-row">
								<span class="cb-geo" style="border-radius: var({step.cssVar})"></span>
								<span class="cb-mono">{step.name} · {step.value}</span>
							</div>
						{/each}
					</div>
				</section>
				<section class="cb-section">
					<p class="eyebrow-quiet">Space</p>
					<div class="cb-rows">
						{#each spaceScale as step (step.name)}
							<div class="cb-row">
								<span class="cb-space" style="inline-size: var({step.cssVar})"></span>
								<span class="cb-mono">{step.name} · {step.value}</span>
							</div>
						{/each}
					</div>
				</section>
				<section class="cb-section">
					<p class="eyebrow-quiet">Elevation</p>
					<div class="cb-rows">
						{#each elevationScale as step (step.name)}
							<div class="cb-row">
								<span class="cb-geo" style="box-shadow: var({step.cssVar})"></span>
								<span class="cb-mono">{step.name}</span>
							</div>
						{/each}
					</div>
				</section>
			{:else if active === 'components'}
				<section class="cb-section">
					<p class="eyebrow-quiet">Components</p>
					<p class="meta">
						Every named component the brand defines, drawn as itself. Select one to read its
						declarations.
					</p>
					<div class="cb-gallery">
						{#each componentNames as name (name)}
							<div class="cb-piece">
								<button
									type="button"
									class="cb-piece-head"
									aria-expanded={inspecting === name}
									onclick={() => inspect(name)}
								>
									<span class="cb-mono">.{name}</span>
									<span class="cb-mono">{inspecting === name ? 'Hide' : 'Inspect'}</span>
								</button>
								<div class="cb-stage">
									{#if specimenTag(name) === 'button'}
										<button type="button" class={name}>Continue</button>
									{:else}
										<div class={name}>The quick brown fox</div>
									{/if}
								</div>
								{#if inspecting === name}
									<dl class="cb-decls">
										{#each inspectedDecls as [prop, value] (prop)}
											<div class="cb-decl">
												<dt class="cb-mono">{prop}</dt>
												<dd class="cb-mono">{value}</dd>
											</div>
										{/each}
									</dl>
								{/if}
							</div>
						{/each}
					</div>
				</section>
			{:else if active === 'layouts'}
				<section class="cb-section">
					<p class="eyebrow-quiet">Layouts</p>
					<p class="meta">
						The layout shapes almost every page is made of. Renamed from "primitives": a unit is now
						the smallest piece, which is what primitive means everywhere else.
					</p>
					<div class="cb-gallery">
						{#each layoutNames as name (name)}
							<div class="cb-piece">
								<button
									type="button"
									class="cb-piece-head"
									aria-expanded={inspecting === name}
									onclick={() => inspect(name)}
								>
									<span class="cb-mono">.{name}</span>
									<span class="cb-mono">{inspecting === name ? 'Hide' : 'Inspect'}</span>
								</button>
								<div class="cb-stage">
									<div class={name}>
										<span class="cb-box"></span>
										<span class="cb-box"></span>
										<span class="cb-box"></span>
									</div>
								</div>
								{#if inspecting === name}
									<dl class="cb-decls">
										{#each inspectedDecls as [prop, value] (prop)}
											<div class="cb-decl">
												<dt class="cb-mono">{prop}</dt>
												<dd class="cb-mono">{value}</dd>
											</div>
										{/each}
									</dl>
								{/if}
							</div>
						{/each}
					</div>
				</section>
			{/if}
		</main>
	</div>
</div>

<style>
#ceobrand {
	min-block-size: 100vh;
}
#cb-head {
	display: flex;
	flex-wrap: wrap;
	gap: var(--space-comfortable);
	align-items: flex-end;
	justify-content: space-between;
	padding: var(--space-section) 1.25rem var(--space-loose);
	border-block-end: 1px solid var(--color-border);
}
#cb-head > div {
	display: grid;
	gap: 0.25rem;
}
#cb-body {
	display: grid;
	grid-template-columns: minmax(0, 1fr);
	gap: 0;
}
@media (min-width: 56rem) {
	#cb-body {
		grid-template-columns: 14rem minmax(0, 1fr);
	}
	#cb-aside {
		border-inline-end: 1px solid var(--color-border);
		border-block-end: none;
		position: sticky;
		top: 0;
		align-self: start;
		max-block-size: 100vh;
		overflow-y: auto;
	}
}
#cb-aside {
	padding: var(--space-comfortable) 1.25rem;
	border-block-end: 1px solid var(--color-border);
}
#cb-aside ul {
	list-style: none;
	margin: 0;
	padding: 0;
	display: grid;
	gap: 0.125rem;
}
.cb-nav {
	inline-size: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: var(--space-tight);
	padding: 0.5rem 0.625rem;
	background: none;
	border: 0;
	border-radius: var(--radius-chip);
	font: inherit;
	font-size: var(--fs-section);
	color: color-mix(in srgb, var(--color-foreground) 75%, transparent);
	cursor: pointer;
	text-align: start;
	min-block-size: 2.25rem;
}
.cb-nav:hover {
	background: color-mix(in srgb, var(--color-marine) 8%, transparent);
	color: var(--color-foreground);
}
.cb-nav[aria-current="true"] {
	background: color-mix(in srgb, var(--color-marine) 8%, transparent);
	color: var(--color-foreground);
	font-weight: 600;
}
.cb-nav:focus-visible {
	outline: 2px solid var(--color-accent-ink);
	outline-offset: 2px;
}
.cb-count {
	font-size: var(--fs-micro);
	font-variant-numeric: tabular-nums;
	color: color-mix(in srgb, var(--color-foreground) 65%, transparent);
}
#cb-main {
	padding: var(--space-loose) 1.25rem 4rem;
	min-inline-size: 0;
}
.cb-section {
	display: grid;
	gap: var(--space-tight);
	margin-block-end: var(--space-section);
	max-inline-size: 62rem;
}
.cb-swatches {
	display: grid;
	gap: var(--space-comfortable);
	grid-template-columns: repeat(auto-fill, minmax(min(9rem, 100%), 1fr));
	margin-block-start: var(--space-tight);
}
.cb-swatch {
	min-inline-size: 0;
}
.cb-chip {
	block-size: 3.5rem;
	border-radius: var(--radius-chip);
	border: 1px solid var(--color-border);
}
.cb-name {
	margin: 0.35rem 0 0;
	font-size: var(--fs-micro);
}
.cb-mono {
	font-family: var(--font-mono);
	font-size: var(--fs-nano);
	color: color-mix(in srgb, var(--color-foreground) 65%, transparent);
	margin: 0;
	overflow-wrap: anywhere;
}
.cb-rows {
	display: grid;
	gap: 0.125rem;
	margin-block-start: var(--space-tight);
}
.cb-row {
	display: flex;
	align-items: baseline;
	justify-content: space-between;
	gap: var(--space-comfortable);
	flex-wrap: wrap;
	padding: 0.5rem 0;
	border-block-end: 1px solid color-mix(in srgb, var(--color-marine) 8%, transparent);
}
.cb-row > span:first-child {
	min-inline-size: 0;
	overflow-wrap: anywhere;
}
.cb-tint,
.cb-geo {
	display: block;
	inline-size: 6rem;
	block-size: 2rem;
	border-radius: var(--radius-chip);
	background: var(--color-surface-raised);
}
.cb-tint {
	border: 1px solid var(--color-border);
}
.cb-geo {
	border: 1px solid var(--color-border);
}
.cb-space {
	display: block;
	block-size: 1rem;
	background: var(--color-accent-ink);
	border-radius: var(--radius-pill);
}
.cb-gallery {
	display: grid;
	gap: var(--space-comfortable);
	grid-template-columns: repeat(auto-fill, minmax(min(18rem, 100%), 1fr));
	margin-block-start: var(--space-tight);
	align-items: start;
}
.cb-piece {
	border: 1px solid var(--color-border);
	border-radius: var(--radius-inner);
	overflow: hidden;
	min-inline-size: 0;
}
.cb-piece-head {
	inline-size: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: var(--space-tight);
	padding: 0.5rem 0.75rem;
	min-block-size: 2.25rem;
	background: color-mix(in srgb, var(--color-marine) 4%, transparent);
	border: 0;
	border-block-end: 1px solid var(--color-border);
	font: inherit;
	cursor: pointer;
	text-align: start;
}
.cb-piece-head:hover {
	background: color-mix(in srgb, var(--color-marine) 8%, transparent);
}
.cb-piece-head:focus-visible {
	outline: 2px solid var(--color-accent-ink);
	outline-offset: -2px;
}
.cb-stage {
	padding: var(--space-comfortable);
	display: flex;
	align-items: center;
	justify-content: center;
	min-block-size: 5rem;
	overflow-x: auto;
}
.cb-decls {
	margin: 0;
	padding: 0.5rem 0.75rem 0.75rem;
	border-block-start: 1px solid var(--color-border);
	display: grid;
	gap: 0.2rem;
}
.cb-decl {
	display: flex;
	gap: var(--space-tight);
	justify-content: space-between;
	flex-wrap: wrap;
}
.cb-decl dt,
.cb-decl dd {
	margin: 0;
}
.cb-box {
	display: block;
	inline-size: 1.5rem;
	block-size: 1.5rem;
	border-radius: var(--radius-chip);
	background: color-mix(in srgb, var(--color-marine) 15%, transparent);
}
</style>
