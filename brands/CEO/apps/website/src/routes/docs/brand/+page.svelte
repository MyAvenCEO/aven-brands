<script lang="ts">
import { icons } from '@myavenceo/aven-ceo/icons'
import { renderIcon } from '@myavenceo/aven-vibes'
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
	compositeRows,
	declarationsOf,
	elevationScale,
	fontStacks,
	fontWeights,
	iconMarkup,
	inkScale,
	layoutNames,
	leafRows,
	logoVariants,
	radiusScale,
	sections,
	spaceScale,
	tintScale,
	trackingScale,
	typeScale
} from '$lib/docs/sections'
import { specimens } from '$lib/docs/specimens'

/**
 * Which steps the brand sets in its DISPLAY face rather than its body face.
 *
 * The ramp used to render every step in the body font, which showed twelve
 * sizes and only one of the two typefaces — so the face that actually carries
 * every title on the site never appeared in the document describing the type.
 */
const DISPLAY_STEPS = ['fs-hero', 'fs-amount', 'fs-display', 'fs-display-lg']

let active = $state('colour')

/**
 * The theme switch, and why this page of all pages needs one.
 *
 * The surface rungs are theme-neutral by construction — a component says
 * `bg-surface-card` and the theme decides what that is. That claim is either
 * true or it is not, and the only way to find out is to switch the theme and
 * LOOK. A design system that documents a dark mode it has never rendered is
 * documenting an intention.
 *
 * It writes `data-theme` on the document element, which is exactly what a real
 * surface would do, so this is the same mechanism rather than a preview of one.
 */
let theme = $state<'light' | 'dark'>('light')

/*
 * Scoped to THIS section, not the document.
 *
 * Two reasons, and the second is the one that matters. The nav, the site header
 * and the rest of /docs are not part of the specimen, so flipping them would be
 * showing the theme rather than testing it.
 *
 * And custom properties inherit from the nearest ancestor that declares them,
 * so `data-theme` on this element beats the `:root` block no matter what order
 * the stylesheet emits in. On the document element the two selectors have equal
 * specificity and source order decides — which is how the first attempt
 * rendered a dark page with light text at 1.13:1.
 */
const unitGroups = [
	{
		id: 'leafs',
		title: 'Leafs',
		rows: leafRows,
		lede: 'A unit with no slots. It renders itself and nothing goes inside it.'
	},
	{
		id: 'composites',
		title: 'Composites',
		rows: compositeRows,
		lede: 'A unit with slots — a shape other units are placed into. The slot names are the contract, and they are what a caller fills.'
	}
] as const

/* ── The detail viewer ───────────────────────────────────────────────────
   A grid card opens into one unit, where every variant axis and every state is
   a switch. The state preview APPLIES the unit's own declarations rather than
   restating them: `:hover` and `:focus-visible` cannot be forced from a docs
   page, and a second hand-written copy of what hover looks like is precisely
   the drift the system exists to stop. */
let open = $state<string | null>(null)
let state = $state<string | null>(null)
let chosen = $state<Record<string, string>>({})

const allRows = $derived([...leafRows, ...compositeRows])
const openUnit = $derived(open ? allRows.find((u) => u.name === open) : undefined)
const activeState = $derived(openUnit?.states.find((s) => s.name === state))

/** The modifier classes the chosen variants add, as one string. */
const variantClass = $derived(
	Object.entries(chosen)
		.map(([axis, option]) => (axis === 'variant' ? option : `${axis}-${option}`))
		.join(' ')
)

function openDetail(name: string) {
	open = name
	state = null
	chosen = {}
}

function pick(axis: string, option: string) {
	chosen = chosen[axis] === option ? omit(chosen, axis) : { ...chosen, [axis]: option }
}

const omit = (map: Record<string, string>, key: string) =>
	Object.fromEntries(Object.entries(map).filter(([k]) => k !== key))

const backIcon = renderIcon('chevron-right', icons, { size: '1rem' })

/**
 * Dress the specimen with the chosen variant and state.
 *
 * An attachment rather than a class, because the thing being dressed is inside
 * `{@html}` — Svelte compiled none of it, so there is no element here to put a
 * class on. It finds the specimen's own root by the unit's base class and works
 * on that.
 *
 * The state is applied THREE ways, in order of honesty. If the state has a real
 * attribute — `disabled`, `aria-busy`, `aria-selected` — that is set, and the
 * unit's own CSS does the rest, which is the truest preview available. Then the
 * state's declarations are applied inline, so `hover`, `focus` and `active`
 * (which a docs page cannot trigger) still show what they do. And the
 * declarations come from the registry, so this page never holds a second copy
 * of what hover looks like.
 */
const STATE_ATTR: Record<string, [string, string]> = {
	disabled: ['disabled', ''],
	loading: ['aria-busy', 'true'],
	selected: ['aria-selected', 'true'],
	error: ['aria-invalid', 'true']
}

const applyPreview =
	(unit: (typeof allRows)[number], variants: string, forced: string | null) =>
	(node: HTMLElement) => {
		const roots = node.querySelectorAll<HTMLElement>(`.${unit.name}`)
		const st = unit.states.find((s) => s.name === forced)
		const undo: Array<() => void> = []

		for (const root of roots) {
			/* A state that names a part dresses that part, not the unit. */
			const target = st?.part
				? (root.querySelector<HTMLElement>(`.${unit.name}-${st.part}`) ?? root)
				: root

			const added = variants
				.split(' ')
				.filter(Boolean)
				.map((v) => `${unit.name}--${v}`)
			root.classList.add(...added)
			undo.push(() => root.classList.remove(...added))

			if (st) {
				const attr = STATE_ATTR[st.name]
				if (attr) {
					target.setAttribute(attr[0], attr[1])
					undo.push(() => target.removeAttribute(attr[0]))
				}
				const before = target.getAttribute('style') ?? ''
				const inline = st.decls.map(([k, v]) => `${kebab(k)}:${v}`).join(';')
				target.setAttribute('style', before ? `${before};${inline}` : inline)
				undo.push(() =>
					before ? target.setAttribute('style', before) : target.removeAttribute('style')
				)
			}
		}
		return () => {
			for (const fn of undo.reverse()) fn()
		}
	}

/** `minBlockSize` is how a unit writes it; CSS wants `min-block-size`. */
const kebab = (property: string) => property.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)

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

<div id="ceobrand" class="app-shell" data-theme={theme}>
	<header id="cb-head">
		<div>
			<p class="eyebrow-accent">ceoBRAND</p>
			<h1 class="title">Design system</h1>
			<p class="lede">
				Rendered from the brand config itself. If it renders wrong, the system is wrong.
			</p>
		</div>
		<div id="cb-head-actions">
			<div id="cb-theme" role="group" aria-label="Theme">
				{#each ['light', 'dark'] as const as option (option)}
					<button
						type="button"
						class="cb-theme-option"
						aria-pressed={theme === option}
						onclick={() => {
							theme = option
						}}
					>
						{option}
					</button>
				{/each}
			</div>
			<a class="meta" href="/docs/">Back to docs</a>
		</div>
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
									/* Leaving the detail view with the section. Without this, moving
									   from Leafs to Composites kept one leaf's detail on screen and
									   the Composites list rendered as empty. */
									open = null
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
			{#if active === 'logo'}
				<section class="cb-section">
					<p class="eyebrow-quiet">Logo</p>
					<p class="meta">
						The mark, the wordmark and the lockup. The wordmark is two faces in one word — "aven" in
						the thin display face, "CEO" in the heaviest sans — a specification that used to live
						inline at every call site, including two <span class="cb-mono">style</span> attributes
						in the site header.
					</p>
					<div class="cb-gallery">
						{#each logoVariants as variant (variant)}
							<div class="cb-piece">
								<div class="cb-piece-head">
									<span class="cb-mono">.logo--{variant}</span>
								</div>
								<div class="cb-stage">
									<span class="logo logo--{variant}">
										{#if variant !== 'wordmark'}
											<img class="logo-mark" src="/aven-logo.svg" alt="" width="28" height="28">
										{/if}
										{#if variant !== 'mark'}
											<span class="logo-wordmark">
												<span class="logo-word-aven">aven</span
												><span class="logo-word-ceo">CEO</span>
											</span>
										{/if}
									</span>
								</div>
							</div>
						{/each}
					</div>
				</section>
			{:else if active === 'icons'}
				<section class="cb-section">
					<p class="eyebrow-quiet">Icons</p>
					<p class="meta">
						Duotone: a filled backing at 0.2 under the figure, both in
						<span class="cb-mono">currentColor</span>. Two opacities of one colour, never two
						colours — two colours could not be themed, and this is why the row below inverts with
						the theme instead of needing a second file. A view names an icon and nothing more; the
						engine writes every attribute, so no string a view controls reaches the markup. The logo
						mark is not here on purpose: it is ten brand colours, so it stays an image.
					</p>
					<div class="cb-icons">
						{#each iconMarkup as icon (icon.name)}
							<div class="cb-icon">
								<span class="cb-icon-stage">{@html icon.svg}</span>
								<span class="cb-mono">{icon.name}</span>
							</div>
						{/each}
					</div>
				</section>
			{:else if active === 'colour'}
				{#each colourGroups as group (group.id)}
					<section class="cb-section">
						<p class="eyebrow-quiet">{group.title}</p>
						<p class="meta">{group.lede}</p>
						<div class="cb-swatches">
							{#each group.rows as row (row.name)}
								<div class="cb-swatch">
									<div class="cb-chip">
										<span class="cb-chip-half" style="background: var({row.cssVar})"></span>
										{#if row.dark}
											<span
												class="cb-chip-half"
												style="background: {row.dark}"
												title="dark theme"
											></span>
										{/if}
									</div>
									<p class="cb-name">{row.name}</p>
									<p class="cb-mono">{row.value}</p>
									{#if row.dark}
										<p class="cb-mono cb-dark-value">dark {row.dark}</p>
									{/if}
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
							{@const display = DISPLAY_STEPS.includes(step.name)}
							<div class="cb-row">
								<span
									style="font-size: var({step.cssVar}); font-family: var({display
										? '--font-display'
										: '--font-sans'})"
								>
									Every brand is a config
								</span>
								<span class="cb-mono">
									{step.name}
									· {step.value} · {display ? 'display' : 'sans'}
								</span>
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
									style="color: color-mix(in srgb, var(--color-foreground) calc(var({step.cssVar}) * 100%), transparent)"
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
									style="background: color-mix(in srgb, var(--color-foreground) calc(var({step.cssVar}) * 100%), transparent)"
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
			{:else if active === 'leafs' || active === 'composites'}
				{#if openUnit}
					{@const unit = openUnit}
					<section class="cb-section">
						<button type="button" class="cb-back" onclick={() => (open = null)}>
							{@html backIcon}
							<span>All {active}</span>
						</button>
						<h2 class="cb-detail-name">{unit.name}</h2>
						<p class="meta cb-detail-note">{unit.description}</p>

						<!-- The specimen, with whatever variant and state is selected applied to
						     it. Both come from the registry, so what you see is the unit's own
						     answer rather than a second copy of it kept in this page. -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div
							class="cb-detail-stage"
							class:cb-detail-stage--tall={specimens[unit.name]?.tall}
							{@attach applyPreview(unit, variantClass, state)}
						>
							{#if specimens[unit.name]}
								<!-- The `one` specimen, not the gallery. Applying a variant to a stage
								     holding six buttons turns all six primary at once, which shows
								     nothing about what the variant does. -->
								{@html specimens[unit.name].one ?? specimens[unit.name].html}
							{:else}
								<p class="cb-mono cb-unit-todo">no specimen yet</p>
							{/if}
						</div>

						{#if unit.states.length}
							<div class="cb-controls">
								<p class="cb-control-label">State</p>
								<div class="cb-chips">
									<button
										type="button"
										class="cb-chip-btn"
										aria-pressed={state === null}
										onclick={() => (state = null)}
									>
										default
									</button>
									{#each unit.states as st (st.name)}
										<button
											type="button"
											class="cb-chip-btn"
											aria-pressed={state === st.name}
											onclick={() => (state = state === st.name ? null : st.name)}
										>
											{st.name}
										</button>
									{/each}
								</div>
								{#if activeState}
									<p class="cb-control-note">{activeState.note || 'No note on this state.'}</p>
									<dl class="cb-decls">
										{#each activeState.decls as [prop, value] (prop)}
											<div class="cb-decl">
												<dt class="cb-mono">{prop}</dt>
												<dd class="cb-mono">{value}</dd>
											</div>
										{/each}
									</dl>
								{/if}
							</div>
						{/if}

						{#each unit.variants as axis (axis.axis)}
							<div class="cb-controls">
								<p class="cb-control-label">{axis.axis}</p>
								<div class="cb-chips">
									{#each axis.options as option (option.name)}
										<button
											type="button"
											class="cb-chip-btn"
											aria-pressed={chosen[axis.axis] === option.name}
											onclick={() => pick(axis.axis, option.name)}
										>
											{option.name}
										</button>
									{/each}
								</div>
								{#if chosen[axis.axis]}
									{@const picked = axis.options.find((o) => o.name === chosen[axis.axis])}
									{#if picked?.note}
										<p class="cb-control-note">{picked.note}</p>
									{/if}
								{/if}
							</div>
						{/each}

						{#if unit.slots.length}
							<div class="cb-controls">
								<p class="cb-control-label">Slots</p>
								<p class="cb-control-note">
									What a caller fills. A composite is a shape, and these are its openings.
								</p>
								<div class="cb-chips">
									{#each unit.slots as slot (slot)}
										<span class="cb-tag">{slot}</span>
									{/each}
								</div>
							</div>
						{/if}

						{#if unit.parts.length}
							<div class="cb-controls">
								<p class="cb-control-label">Parts</p>
								<dl class="cb-decls">
									{#each unit.parts as part (part.name)}
										<div class="cb-decl">
											<dt class="cb-mono">.{unit.name}-{part.name}</dt>
											<dd>{part.note || '—'}</dd>
										</div>
									{/each}
								</dl>
							</div>
						{/if}
					</section>
				{:else}
					{#each unitGroups.filter((g) => g.id === active) as group (group.id)}
						<section class="cb-section">
							<p class="eyebrow-quiet">{group.title}</p>
							<p class="meta">{group.lede}</p>
							<div class="cb-units">
								{#each group.rows as unit (unit.name)}
									<button
										type="button"
										class="cb-unit"
										class:cb-unit--tall={specimens[unit.name]?.tall}
										onclick={() => openDetail(unit.name)}
									>
										<span class="cb-unit-head">
											<span class="cb-unit-name">{unit.name}</span>
											<span class="cb-unit-tags">
												{#if unit.animates}
													<span class="cb-tag">animates</span>
												{/if}
												{#each unit.variants as axis (axis.axis)}
													<span class="cb-tag">{axis.axis}: {axis.options.length}</span>
												{/each}
												{#if unit.parts.length}
													<span class="cb-tag">{unit.parts.length} parts</span>
												{/if}
												{#if unit.states.length}
													<span class="cb-tag">{unit.states.length} states</span>
												{/if}
											</span>
										</span>
										<span class="cb-unit-stage">
											{#if specimens[unit.name]}
												{@html specimens[unit.name].html}
											{:else}
												<span class="cb-mono cb-unit-todo">no specimen yet</span>
											{/if}
										</span>
										<span class="cb-unit-note">{unit.description}</span>
									</button>
								{/each}
							</div>
						</section>
					{/each}
				{/if}
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
#cb-head-actions {
	display: flex;
	align-items: center;
	gap: var(--space-comfortable);
}
#cb-theme {
	display: inline-flex;
	border: 1px solid var(--color-border);
	border-radius: var(--radius-pill);
	overflow: hidden;
}
.cb-theme-option {
	min-block-size: 2.25rem;
	padding-inline: var(--space-comfortable);
	border: 0;
	background: transparent;
	font: inherit;
	font-size: var(--fs-meta);
	/* Not muted-foreground: it measures 3.59:1 here and fails AA. The unselected
	   half of a switch is still a label someone has to read to operate it. */
	color: var(--color-foreground-quiet);
	cursor: pointer;
	text-transform: capitalize;
}
.cb-theme-option[aria-pressed="true"] {
	background: var(--color-primary);
	color: var(--color-primary-foreground);
}
.cb-theme-option:focus-visible {
	outline: 2px solid var(--color-accent-ink);
	outline-offset: -2px;
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
	background: color-mix(in srgb, var(--color-foreground) 8%, transparent);
	color: var(--color-foreground);
}
.cb-nav[aria-current="true"] {
	background: color-mix(in srgb, var(--color-foreground) 8%, transparent);
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
	/* Not a color-mix: 65% of the foreground over an unknown ground is a
	   relationship, and the count chip sits on a tint the ladder does not
	   name. The role is measured; the relationship was not. */
	color: var(--color-foreground-quiet);
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
.cb-icons {
	display: grid;
	gap: var(--space-comfortable);
	grid-template-columns: repeat(auto-fill, minmax(min(7rem, 100%), 1fr));
	margin-block-start: var(--space-tight);
}
.cb-icon {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.5rem;
	min-inline-size: 0;
}
.cb-icon-stage {
	display: grid;
	place-items: center;
	inline-size: 100%;
	block-size: 4.5rem;
	border: 1px solid var(--color-border);
	border-radius: var(--radius-chip);
	background: var(--color-surface-raised);
	/* The reason the registry exists: one glyph, both themes. */
	color: var(--color-foreground);
}
/* ── The library gallery ─────────────────────────────────────────────────
   One card per unit, each one drawing itself doing its job. Wide, because a
   toast, a table and a modal do not fit in a third of a column and shrinking
   them until they do is how a gallery stops showing you the thing. */
/* ── The detail viewer ─────────────────────────────────────────────────── */
.cb-back {
	display: inline-flex;
	align-items: center;
	gap: var(--space-hairline);
	min-block-size: 2.25rem;
	margin-block-end: var(--space-tight);
	padding: 0;
	border: 0;
	background: transparent;
	font: inherit;
	font-size: var(--fs-meta);
	color: var(--color-foreground-quiet);
	cursor: pointer;
}
.cb-back :global(svg) {
	/* The chevron points forward; this goes back. */
	transform: rotate(180deg);
}
.cb-back:hover {
	color: var(--color-foreground);
}
.cb-detail-name {
	margin: 0;
	font-family: var(--font-mono);
	font-size: var(--fs-title);
	font-weight: 600;
	color: var(--color-foreground);
}
.cb-detail-note {
	max-inline-size: 62ch;
}
.cb-detail-stage {
	display: grid;
	place-items: center;
	min-block-size: 12rem;
	margin-block: var(--space-comfortable);
	padding: var(--space-section);
	border: 1px solid var(--color-border);
	border-radius: var(--radius-card);
	background: var(--color-surface-page);
}
.cb-detail-stage--tall {
	min-block-size: 22rem;
}
.cb-controls {
	margin-block-end: var(--space-comfortable);
	padding-block-end: var(--space-comfortable);
	border-block-end: 1px solid var(--color-border-soft);
}
.cb-control-label {
	margin: 0 0 0.4rem;
	font-size: var(--fs-micro);
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: var(--tracking-wider);
	color: var(--color-foreground-quiet);
}
.cb-control-note {
	margin: 0.5rem 0 0;
	max-inline-size: 62ch;
	font-size: var(--fs-micro);
	line-height: 1.55;
	color: var(--color-foreground-soft);
}
.cb-chips {
	display: flex;
	flex-wrap: wrap;
	gap: 0.375rem;
}
.cb-chip-btn {
	min-block-size: 1.75rem;
	padding-inline: 0.625rem;
	border: 1px solid var(--color-border-strong);
	border-radius: var(--radius-pill);
	background: transparent;
	font-family: var(--font-mono);
	font-size: var(--fs-micro);
	color: var(--color-foreground-soft);
	cursor: pointer;
}
.cb-chip-btn[aria-pressed="true"] {
	background: var(--color-primary);
	border-color: var(--color-primary);
	color: var(--color-primary-foreground);
}
.cb-chip-btn:focus-visible {
	outline: 2px solid var(--color-accent-ink);
	outline-offset: 2px;
}
.cb-units {
	display: grid;
	gap: var(--space-comfortable);
	grid-template-columns: repeat(auto-fill, minmax(min(24rem, 100%), 1fr));
	margin-block-start: var(--space-tight);
}
.cb-unit {
	display: grid;
	grid-template-rows: auto 1fr auto;
	min-inline-size: 0;
	border: 1px solid var(--color-border);
	border-radius: var(--radius-card);
	background: var(--color-surface-raised);
	overflow: hidden;
}
.cb-unit--tall .cb-unit-stage {
	min-block-size: 16rem;
}
.cb-unit-head {
	display: flex;
	flex-wrap: wrap;
	align-items: baseline;
	justify-content: space-between;
	gap: var(--space-hairline);
	padding: var(--space-tight) var(--space-comfortable);
	border-block-end: 1px solid var(--color-border-soft);
	background: var(--color-muted);
}
.cb-unit-name {
	font-family: var(--font-mono);
	font-size: var(--fs-meta);
	font-weight: 600;
	color: var(--color-foreground);
}
.cb-unit-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 0.375rem;
}
.cb-tag {
	padding: 0.05rem 0.4rem;
	border-radius: var(--radius-pill);
	background: var(--color-surface-page);
	font-family: var(--font-mono);
	font-size: var(--fs-nano);
	color: var(--color-foreground-quiet);
}
.cb-unit-stage {
	display: grid;
	place-items: center;
	gap: var(--space-tight);
	min-block-size: 9rem;
	padding: var(--space-comfortable);
	/* The stage is the PAGE ground, not the card's — a specimen has to be seen
	   against what it will actually sit on. */
	background: var(--color-surface-page);
	overflow: hidden;
}
.cb-unit-note {
	margin: 0;
	padding: var(--space-tight) var(--space-comfortable);
	border-block-start: 1px solid var(--color-border-soft);
	font-size: var(--fs-micro);
	line-height: 1.5;
	color: var(--color-foreground-quiet);
}
.cb-unit-slots,
.cb-unit-todo {
	margin: 0;
	padding: 0 var(--space-comfortable) var(--space-tight);
	color: var(--color-foreground-quiet);
}
/* The specimens' own scaffolding — a row, or a stack. Deliberately only two:
   a specimen that needs a third layout is a specimen doing too much. */
.sp-row--cards {
	align-items: stretch;
}
.sp-row {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: center;
	gap: var(--space-tight);
}
.sp-stack {
	display: grid;
	gap: var(--space-tight);
	inline-size: 100%;
	max-inline-size: 22rem;
	min-inline-size: 0;
}
.sp-stack--wide {
	max-inline-size: 100%;
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
	display: flex;
	block-size: 3.5rem;
	overflow: hidden;
	border-radius: var(--radius-chip);
	border: 1px solid var(--color-border);
}
/* Two halves when a role is themed, one when it is not — so the split itself
   tells you which roles carry a dark override, without a badge saying so. */
.cb-chip-half {
	flex: 1;
	min-inline-size: 0;
}
.cb-dark-value {
	color: var(--color-foreground-quiet);
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
	border-block-end: 1px solid color-mix(in srgb, var(--color-foreground) 8%, transparent);
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
	background: color-mix(in srgb, var(--color-foreground) 4%, transparent);
	border: 0;
	border-block-end: 1px solid var(--color-border);
	font: inherit;
	cursor: pointer;
	text-align: start;
}
.cb-piece-head:hover {
	background: color-mix(in srgb, var(--color-foreground) 8%, transparent);
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
	background: color-mix(in srgb, var(--color-foreground) 15%, transparent);
}
</style>
