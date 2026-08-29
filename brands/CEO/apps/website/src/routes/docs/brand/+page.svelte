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
	migrationRows,
	radiusScale,
	sections,
	spaceScale,
	tintScale,
	trackingScale,
	typeScale,
	unitNameList
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
/* NOT `state`. In Svelte a leading `$` is store auto-subscription, so a local
   named `state` turns every `$state(...)` rune in the file into "subscribe to
   the store `state`" — which type-checks as a use-before-declaration and breaks
   every rune above this line. */
let forcedState = $state<string | null>(null)
/* `as const` so the each-block yields the union rather than `string` — an
   inline array literal widens, and the assignment then fails to type. */
const DETAIL_VIEWS = ['preview', 'config'] as const

/**
 * The widths a specimen is checked at.
 *
 * Not a device list — a width list. `mobile` is 390 because that is where a
 * two-column card becomes one and a nav collapses into a drawer, and those are
 * the decisions a storybook exists to let you see. The stage constrains the
 * specimen rather than the browser, so the whole page does not have to reflow
 * to answer the question.
 */
const VIEWPORTS = [
	{
		id: 'desktop',
		label: 'Desktop',
		width: null,
		icon: renderIcon('external', icons, { size: '1em' })
	},
	{
		id: 'mobile',
		label: 'Mobile — 390px',
		width: '390px',
		icon: renderIcon('menu', icons, { size: '1em' })
	}
] as const
let detailView = $state<(typeof DETAIL_VIEWS)[number]>('preview')
let openPart = $state<string | null>(null)
let viewport = $state<(typeof VIEWPORTS)[number]['id']>('desktop')
let chosen = $state<Record<string, string>>({})

const allRows = $derived([...leafRows, ...compositeRows])
const openUnit = $derived(open ? allRows.find((u) => u.name === open) : undefined)
const activeState = $derived(openUnit?.states.find((s) => s.name === forcedState))
const activePart = $derived(openUnit?.parts.find((p) => p.name === openPart))
/* A part's own declarations, read from the compiled stylesheet rather than
   restated here — the part is a real class, so the system already knows. */
const viewportStyle = $derived(
	(() => {
		const w = VIEWPORTS.find((v) => v.id === viewport)?.width
		return w ? `max-inline-size:${w};margin-inline:auto;` : ''
	})()
)
const partDecls = $derived(
	openUnit && openPart ? declarationsOf(`${openUnit.name}-${openPart}`) : []
)

/**
 * The specimen to show, given what is chosen.
 *
 * A variant axis usually DRESSES the specimen — `tone: quiet` is the same card,
 * quieter — and for those the one instance is right and the modifier class does
 * the rest. But some axes name different CONTENT: `flow-card`'s `step` is four
 * real screens of one sequence, and `voice-pill`'s `phase` is eight things the
 * system can be doing. Recolouring a crest and leaving the heading saying
 * "Authorize this device" while the switch reads `pay` is worse than having no
 * switch, because it teaches you the control is broken.
 *
 * First match in axis-declaration order, so two scened axes on one unit resolve
 * the same way every time rather than by whichever was clicked last.
 */
const sceneAxes = $derived(
	openUnit
		? openUnit.variants
				.map((a) => a.axis)
				.filter((axis) => specimens[openUnit.name]?.scenes?.[axis])
		: []
)
const specimenHtml = $derived(
	(() => {
		if (!openUnit) return ''
		const spec = specimens[openUnit.name]
		if (!spec) return ''
		for (const axis of sceneAxes) {
			const scene = spec.scenes?.[axis]?.[chosen[axis] ?? '']
			if (scene) return scene
		}
		return spec.one ?? spec.html ?? ''
	})()
)
/**
 * Walking the sequence, rather than clicking four chips in the right order.
 *
 * Only where an axis has scenes: an axis whose options are a look — quiet,
 * featured — is not a sequence and Back/Next on it would imply an order that
 * does not exist. `default` is position 0, because the resting card IS where
 * these flows start.
 */
const walkAxis = $derived(sceneAxes[0] ?? null)
const walkSteps = $derived(
	walkAxis && openUnit
		? [
				'default',
				...(openUnit.variants
					.find((a) => a.axis === walkAxis)
					?.options.filter((o) => specimens[openUnit.name]?.scenes?.[walkAxis]?.[o.name])
					.map((o) => o.name) ?? [])
			]
		: []
)
const walkAt = $derived(walkAxis ? Math.max(0, walkSteps.indexOf(chosen[walkAxis] ?? 'default')) : 0)

function walk(delta: number) {
	if (!walkAxis) return
	const next = walkSteps[walkAt + delta]
	if (next === undefined) return
	if (next === 'default') clear(walkAxis)
	else pick(walkAxis, next)
}

/** The modifier classes the chosen variants add, as one string. */
const variantClass = $derived(
	Object.entries(chosen)
		.map(([axis, option]) => (axis === 'variant' ? option : `${axis}-${option}`))
		.join(' ')
)

/** Jump from a migration row into the unit that replaces it. */
function openUnitFrom(unit: string) {
	active = compositeRows.some((u) => u.name === unit) ? 'composites' : 'leafs'
	openDetail(unit)
}

function openDetail(name: string) {
	open = name
	forcedState = null
	chosen = {}
	detailView = 'preview'
	openPart = null
}

function pick(axis: string, option: string) {
	chosen = { ...chosen, [axis]: option }
}

/** Back to the resting look for one axis, without touching the others. */
function clear(axis: string) {
	chosen = omit(chosen, axis)
}

const omit = (map: Record<string, string>, key: string) =>
	Object.fromEntries(Object.entries(map).filter(([k]) => k !== key))

const backIcon = renderIcon('chevron-right', icons, { size: '1rem' })

/**
 * Stop the rail at the site header's edge, not the screen's.
 *
 * The marketing header is `position: sticky` and about 61px tall — but "about"
 * is the problem: it is 61 at this width and something else on a phone, after a
 * font swap, or once a nav item wraps. A hardcoded offset is both a lint failure
 * and wrong half the time, so the height is MEASURED and published as
 * `--cb-top`, and a `ResizeObserver` keeps it true when the header reflows.
 *
 * Without it the rail scrolls under the header and its first item is covered —
 * WCAG 2.4.11, which is about a focused element hiding behind sticky chrome and
 * is exactly this bug with a keyboard attached.
 */
function stickBelowSiteHeader(node: HTMLElement) {
	const header = document.querySelector('header')
	if (!header) return
	const apply = () => node.style.setProperty('--cb-top', `${header.getBoundingClientRect().height}px`)
	apply()
	const observer = new ResizeObserver(apply)
	observer.observe(header)
	return () => observer.disconnect()
}

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

<div id="ceobrand" class="app-shell" data-theme={theme} {@attach stickBelowSiteHeader}>
	<div id="cb-body">
		<!-- The page's own header lives INSIDE the rail, above the index — one
		     column that identifies the page, switches its theme and navigates it,
		     rather than a full-width band that pushed the first specimen a
		     screenful down and left a wide empty gutter beside the title.

		     And the rail is the `sidebar` composite itself, not a private copy of
		     one. This page documents that unit; a documentation page that hand-
		     rolls the navigation it is documenting is the drift the whole system
		     exists to stop, and it is the only place where a regression in
		     `sidebar` would be noticed immediately by whoever is reading it. -->
		<aside id="cb-aside">
			<nav class="sidebar sidebar--tone-plain" aria-label="Sections">
				<div id="cb-brand">
					<p class="text text--eyebrow">ceoBRAND</p>
					<h1 class="text text--section-title">Design system</h1>
					<p class="text text--meta">
						Rendered from the brand config itself. If it renders wrong, the system is wrong.
					</p>
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
				</div>

				<div class="sidebar-items">
					{#each sections as section (section.id)}
						<button
							type="button"
							class="sidebar-item"
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
							<span class="sidebar-marker"></span>
							<span>{section.label}</span>
							<span class="sidebar-count">{section.count}</span>
						</button>
					{/each}
				</div>

				<div class="sidebar-footer">
					<a class="sidebar-item" href="/docs/">
						<span class="sidebar-marker"></span>
						Back to docs
					</a>
				</div>
			</nav>
		</aside>

		<main id="cb-main">
			{#if active === 'logo'}
				<section class="cb-section">
					<p class="text text--eyebrow">Logo</p>
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
				<section class="cb-section cb-section--full">
					<p class="text text--eyebrow">Icons</p>
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
						<p class="text text--eyebrow">{group.title}</p>
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
					<p class="text text--eyebrow">Faces</p>
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
					<p class="text text--eyebrow">Weights</p>
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
					<p class="text text--eyebrow">Ramp</p>
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
					<p class="text text--eyebrow">Tracking</p>
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
					<p class="text text--eyebrow">Alpha · on text</p>
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
					<p class="text text--eyebrow">Alpha · on surface</p>
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
					<p class="text text--eyebrow">Radius</p>
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
					<p class="text text--eyebrow">Space</p>
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
					<p class="text text--eyebrow">Elevation</p>
					<div class="cb-rows">
						{#each elevationScale as step (step.name)}
							<div class="cb-row">
								<span class="cb-geo" style="box-shadow: var({step.cssVar})"></span>
								<span class="cb-mono">{step.name}</span>
							</div>
						{/each}
					</div>
				</section>
			{:else if active === 'migration'}
				<section class="cb-section cb-section--full">
					<p class="text text--eyebrow">Migration</p>
					<p class="meta">
						Every class from the vocabulary that predates units, and what replaces it. Measured
						across all four surfaces — the website, the checkout at my.aven.ceo, avenID and the
						Tauri app — not remembered. The measurement is the point: checkout is the most
						design-system-adopted surface in the estate and it is adopted entirely on THESE classes,
						so untying the website without it would break the one that was already doing the right
						thing.
					</p>
					<div class="cb-migration">
						{#each migrationRows as row (row.legacy)}
							<div class="cb-mig" class:cb-mig--done={row.uncalled}>
								<span class="cb-mono cb-mig-from">.{row.legacy}</span>
								<span class="cb-mig-arrow" aria-hidden="true">{@html backIcon}</span>
								<button
									type="button"
									class="cb-mono cb-mig-to"
									onclick={() => openUnitFrom(row.unit)}
								>
									{row.unit}{row.as ? `--${row.as}` : ''}
								</button>
								{#if row.uncalled}
									<span class="cb-tag">nothing calls it</span>
								{/if}
								{#if row.note}
									<p class="cb-mig-note">{row.note}</p>
								{/if}
							</div>
						{/each}
					</div>
				</section>
			{:else if active === 'leafs' || active === 'composites'}
				{#if openUnit}
					{@const unit = openUnit}
					<!-- No 62rem cap here. A reading column is right for a page of prose
					     and wrong for a stage: the specimen should get the screen. -->
					<section class="cb-section cb-section--full">
						<!-- Back, name and tabs on ONE line. Three stacked rows of chrome
						     above a stage is three rows the stage does not get. -->
						<div class="cb-bar">
							<button type="button" class="cb-back" onclick={() => (open = null)}>
								{@html backIcon}
								<span>All {active}</span>
							</button>
							<h2 class="cb-detail-name">{unit.name}</h2>
							<div class="cb-tabs" role="tablist" aria-label="Viewport">
								{#each VIEWPORTS as vp (vp.id)}
									<button
										type="button"
										class="cb-tab"
										role="tab"
										aria-selected={viewport === vp.id}
										title={vp.label}
										onclick={() => (viewport = vp.id)}
									>
										{@html vp.icon}
									</button>
								{/each}
							</div>
							<div class="cb-tabs" role="tablist" aria-label="View">
								{#each DETAIL_VIEWS as view (view)}
									<button
										type="button"
										class="cb-tab"
										role="tab"
										aria-selected={detailView === view}
										onclick={() => (detailView = view)}
									>
										{view}
									</button>
								{/each}
							</div>
						</div>

						<div class="cb-detail">
							<div class="cb-detail-main">
								{#if detailView === 'preview'}
									<!-- The `one` specimen. Applying a variant to a stage holding six
									     buttons turns all six primary at once, which shows nothing. -->
									<div
										class="cb-detail-stage"
										class:cb-detail-stage--tall={specimens[unit.name]?.tall}
										style={viewportStyle}
										{@attach applyPreview(unit, variantClass, forcedState)}
									>
										{#if specimenHtml}
											{@html specimenHtml}
										{:else}
											<p class="cb-mono cb-unit-todo">no specimen yet</p>
										{/if}
									</div>

									<!-- Walk the sequence. Only where the axis IS one: an axis whose
									     options are a look has no order, and offering Back/Next on it
									     would invent one. -->
									{#if walkSteps.length > 1}
										<div class="cb-walk">
											<button
												type="button"
												class="cb-walk-step cb-walk-arrow"
												disabled={walkAt === 0}
												onclick={() => walk(-1)}
												aria-label="Previous {walkAxis}"
											>
												Back
											</button>
											<ol class="cb-walk-rail">
												{#each walkSteps as name, i (name)}
													<li>
														<button
															type="button"
															class="cb-walk-step"
															aria-current={walkAt === i ? 'step' : undefined}
															onclick={() =>
																name === 'default' ? clear(walkAxis ?? '') : pick(walkAxis ?? '', name)}
														>
															{name}
														</button>
													</li>
												{/each}
											</ol>
											<button
												type="button"
												class="cb-walk-step cb-walk-arrow"
												disabled={walkAt === walkSteps.length - 1}
												onclick={() => walk(1)}
												aria-label="Next {walkAxis}"
											>
												Next
											</button>
										</div>
									{/if}
								{:else}
									<pre class="cb-config"><code>{unit.json}</code></pre>
								{/if}

								<p class="cb-detail-note">{unit.description}</p>
							</div>

							<!-- The controls sit beside the stage, not under it: a unit with four
							     axes pushed the specimen off the top of the screen, so you were
							     choosing a variant you could no longer see. -->
							<aside class="cb-detail-controls" aria-label="Variants and states">
								{#if unit.states.length}
									<div class="cb-controls">
										<p class="cb-control-label">State</p>
										<div class="cb-chips">
											<button
												type="button"
												class="cb-chip-btn"
												aria-pressed={forcedState === null}
												onclick={() => (forcedState = null)}
											>
												default
											</button>
											{#each unit.states as st (st.name)}
												<button
													type="button"
													class="cb-chip-btn"
													aria-pressed={forcedState === st.name}
													onclick={() => (forcedState = st.name)}
												>
													{st.name}
												</button>
											{/each}
										</div>
										{#if activeState?.note}
											<!-- Collapsed. The prose is the reason a decision was made and it
											     is worth reading once; leaving four of them open at a time
											     pushes every switch below the fold. -->
											<details class="cb-why">
												<summary class="cb-why-summary">Why</summary>
												<p class="cb-control-note">{activeState.note}</p>
											</details>
										{/if}
									</div>
								{/if}

								{#each unit.variants as axis (axis.axis)}
									<div class="cb-controls">
										<p class="cb-control-label">{axis.axis}</p>
										<div class="cb-chips">
											<!-- Every axis gets a `default`. Without it, choosing an
											     emphasis was a one-way door: there was no way back to the
											     resting look short of reloading. -->
											<button
												type="button"
												class="cb-chip-btn"
												aria-pressed={!chosen[axis.axis]}
												onclick={() => clear(axis.axis)}
											>
												default
											</button>
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
										<div class="cb-chips">
											{#each unit.slots as slot (slot)}
												<!-- A slot named after a unit opens that unit; the rest are
												     labels, because an unnamed opening accepts anything. -->
												{#if unitNameList.includes(slot)}
													<button
														type="button"
														class="cb-tag cb-tag--link"
														onclick={() => openDetail(slot)}
													>
														{slot}
													</button>
												{:else}
													<span class="cb-tag">{slot}</span>
												{/if}
											{/each}
										</div>
									</div>
								{/if}

								{#if unit.parts.length}
									<div class="cb-controls">
										<p class="cb-control-label">Parts</p>
										<div class="cb-chips">
											{#each unit.parts as part (part.name)}
												<button
													type="button"
													class="cb-tag cb-tag--link"
													aria-pressed={openPart === part.name}
													onclick={() => (openPart = openPart === part.name ? null : part.name)}
												>
													{part.name}
												</button>
											{/each}
										</div>
										{#if activePart}
											{#if activePart.note}
												<details class="cb-why">
													<summary class="cb-why-summary">Why</summary>
													<p class="cb-control-note">{activePart.note}</p>
												</details>
											{/if}
											<dl class="cb-decls">
												{#each partDecls as [prop, value] (prop)}
													<div class="cb-decl">
														<dt class="cb-mono">{prop}</dt>
														<dd class="cb-mono">{value}</dd>
													</div>
												{/each}
											</dl>
										{/if}
									</div>
								{/if}
							</aside>
						</div>
					</section>
				{:else}
					{#each unitGroups.filter((g) => g.id === active) as group (group.id)}
						<!-- Full width. A 62rem reading column is right for prose and wrong for a
						     gallery: it gave a 1216px main two columns of cards and left a third of
						     the screen empty. -->
						<section class="cb-section cb-section--full">
							<p class="text text--eyebrow">{group.title}</p>
							<p class="meta">{group.lede}</p>
							<div class="cb-units">
								{#each group.rows as unit (unit.name)}
									<button
										type="button"
										class="cb-unit"
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
											<!-- One instance here too. A grid card showing three variants
											     of a card is three cards, and the eye reads the row as
											     nine things rather than three units. -->
											{#if specimens[unit.name]}
												{@html specimens[unit.name].one ?? specimens[unit.name].html}
											{:else}
												<span class="cb-mono cb-unit-todo">no specimen yet</span>
											{/if}
										</span>
									</button>
								{/each}
							</div>
						</section>
					{/each}
				{/if}
			{:else if active === 'layouts'}
				<section class="cb-section">
					<p class="text text--eyebrow">Layouts</p>
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
/* The rail's own header — identity, then the theme switch, then the index.
   Separated by a rule rather than by a gap, so it reads as the head OF the
   list and not as a first item in it. */
#cb-brand {
	display: grid;
	gap: 0.25rem;
	padding: var(--space-comfortable) 0.75rem var(--space-comfortable);
	border-block-end: 1px solid var(--color-border-soft);
	margin-block-end: var(--space-tight);
}
#cb-theme {
	display: inline-flex;
	justify-self: start;
	margin-block-start: var(--space-tight);
	border: 1px solid var(--color-border);
	border-radius: var(--radius-full);
	overflow: hidden;
}
.cb-theme-option {
	min-block-size: 2rem;
	padding-inline: var(--space-comfortable);
	border: 0;
	background: transparent;
	font: inherit;
	font-size: var(--fs-micro);
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
#cb-body {
	display: grid;
	grid-template-columns: minmax(0, 1fr);
	gap: 0;
}
@media (min-width: 56rem) {
	#cb-body {
		/* `auto`, so the `sidebar` unit's own width decides the column. Pinning
		   the track to 14rem here would mean the docs page overrides the very
		   unit it is demonstrating. */
		grid-template-columns: auto minmax(0, 1fr);
	}
	#cb-aside {
		position: sticky;
		/* The site header is sticky and sits above this. At `top: 0` the rail
		   slid underneath it and lost its first item — and a keyboard tabbing
		   into that item put focus behind opaque chrome, which is WCAG 2.4.11.
		   `--cb-top` is the header's measured height, republished on resize. */
		top: var(--cb-top, 0px);
		align-self: start;
		max-block-size: calc(100dvh - var(--cb-top, 0px));
		overflow-y: auto;
	}
	#cb-aside .sidebar {
		block-size: 100%;
		border-inline-end: 1px solid var(--color-border);
	}
}
#cb-aside {
	border-block-end: 1px solid var(--color-border);
}
@media (min-width: 56rem) {
	#cb-aside {
		border-block-end: none;
	}
}
/* The rail's items are `sidebar-item`s, which the unit styles. Only two things
   are this page's: a <button> does not inherit the page font or fill its track,
   and the label has to take the free space so the count stays at the edge. */
#cb-aside .sidebar-item {
	inline-size: 100%;
	border: 0;
	font: inherit;
	font-size: var(--fs-meta);
	font-weight: 500;
	text-align: start;
	cursor: pointer;
	background: none;
}
#cb-aside .sidebar-item > span:not([class]) {
	flex: 1 1 auto;
	min-inline-size: 0;
}
/* TEMPORARY — remove once `@myavenceo/aven-vibes` >= 0.5.1 is installed.
   `sidebar` declares a `selected` state that draws the fill and reveals the
   marker, and this rail marks its current section the only correct way for a
   navigation: `aria-current`. Up to 0.5.0 the engine compiled `selected` to
   `[aria-selected="true"], [aria-pressed="true"]` only, so the state was
   declared, correctly triggered and rendered nothing. The fix is MyAvenCEO/
   avenVIBES#4; until it is published this page draws what the unit will draw,
   with the unit's own values, so the docs nav does not ship without a current
   item. It is a duplicate on purpose and it is dated. */
#cb-aside .sidebar-item[aria-current="true"] {
	background: var(--color-surface-sunken);
	color: var(--color-foreground);
	font-weight: 600;
}
#cb-aside .sidebar-item[aria-current="true"] .sidebar-marker {
	opacity: 1;
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
.cb-section--full {
	/* Out to the edge, and AFTER `.cb-section` — they share a specificity, so
	   only source order separates them, and declared first this lost silently.
	   `#cb-main` pads the reading sections; the detail view is not one, so the
	   aside sits against the right of the screen and the stage takes the rest. */
	max-inline-size: none;
	margin-inline: -1.25rem;
	padding-inline: 1.25rem;
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
	border-radius: var(--radius-xs);
	background: var(--color-surface-raised);
	/* The reason the registry exists: one glyph, both themes. */
	color: var(--color-foreground);
}
/* ── The library gallery ─────────────────────────────────────────────────
   One card per unit, each one drawing itself doing its job. Wide, because a
   toast, a table and a modal do not fit in a third of a column and shrinking
   them until they do is how a gallery stops showing you the thing. */
/* ── The detail viewer ─────────────────────────────────────────────────── */
/* Stage on the left, controls on the right. Below a wide viewport they stack,
   controls last, because on a phone the specimen is the thing you came for. */
.cb-detail {
	display: grid;
	gap: var(--space-loose);
	margin-block: var(--space-comfortable) 0;
}
@media (min-width: 60rem) {
	.cb-detail {
		/* The specimen takes everything the aside does not. `1fr` and a fixed
		   sidebar rather than a shared max-width, so a wide screen gives the
		   preview the width instead of leaving a gutter beside it. */
		grid-template-columns: minmax(0, 1fr) 14rem;
		align-items: start;
	}
	/* Sticky and self-scrolling, pinned to the top of the viewport, so a long
	   list of variants never scrolls the specimen out of reach — the two things
	   you are comparing have to stay on screen together. */
	.cb-detail-controls {
		position: sticky;
		inset-block-start: 0;
		max-block-size: 100dvh;
		overflow-y: auto;
		overscroll-behavior: contain;
		padding-block: var(--space-tight);
		scrollbar-width: thin;
	}
}
.cb-detail-main {
	min-inline-size: 0;
}
.cb-detail-controls {
	display: grid;
	gap: var(--space-comfortable);
	min-inline-size: 0;
}
.cb-tabs {
	display: flex;
	gap: var(--space-hairline);
	margin-block: var(--space-tight) var(--space-tight);
	border-block-end: 1px solid var(--color-border-soft);
}
.cb-tab {
	min-block-size: 2.25rem;
	padding-inline: var(--space-tight);
	border: 0;
	border-block-end: 2px solid transparent;
	background: transparent;
	font: inherit;
	font-size: var(--fs-meta);
	font-weight: 600;
	color: var(--color-foreground-quiet);
	text-transform: capitalize;
	cursor: pointer;
}
.cb-tab[aria-selected="true"] {
	color: var(--color-foreground);
	border-block-end-color: var(--color-primary);
}
.cb-config {
	max-block-size: 34rem;
	margin: 0;
	padding: var(--space-comfortable);
	overflow: auto;
	border: 1px solid var(--color-border);
	border-radius: var(--radius-lg);
	background: var(--color-surface-sunken);
	font-family: var(--font-mono);
	font-size: var(--fs-micro);
	line-height: 1.6;
	color: var(--color-foreground-soft);
	tab-size: 2;
}
/* One row: back on the left, the unit's name beside it, the view tabs pushed
   right. It was three stacked rows of chrome above the stage. */
.cb-bar {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: var(--space-tight);
	padding-block-end: var(--space-hairline);
	border-block-end: 1px solid var(--color-border-soft);
}
.cb-bar .cb-tabs {
	margin: 0 0 -1px auto;
	border-block-end: 0;
}
.cb-bar .cb-detail-name {
	margin-inline-end: auto;
}
.cb-back {
	display: inline-flex;
	align-items: center;
	gap: var(--space-hairline);
	min-block-size: 1.75rem;
	margin-block-end: 0.15rem;
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
	/* Compact. The name is a label on a page you already navigated to, not a
	   headline — every line it takes is a line the specimen does not get. */
	margin: 0;
	font-family: var(--font-mono);
	font-size: var(--fs-lead);
	font-weight: 600;
	line-height: 1.2;
	color: var(--color-foreground);
}
.cb-detail-note {
	margin: 0;
	max-inline-size: 74ch;
	font-size: var(--fs-meta);
	line-height: 1.6;
	white-space: pre-line;
	color: var(--color-foreground-soft);
}
.cb-detail-stage {
	display: grid;
	place-items: center;
	min-block-size: 22rem;
	margin-block: 0 var(--space-comfortable);
	padding: var(--space-section);
	border: 1px solid var(--color-border);
	border-radius: var(--radius-lg);
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
/* The prose behind a decision, collapsed. Worth reading once, not worth four
   of them open at a time pushing every switch below the fold. */
.cb-why {
	margin-block-start: 0.4rem;
}
.cb-why-summary {
	list-style: none;
	display: inline-flex;
	align-items: center;
	min-block-size: 1.5rem;
	font-family: var(--font-mono);
	font-size: var(--fs-nano);
	color: var(--color-foreground-quiet);
	cursor: pointer;
}
.cb-why-summary::-webkit-details-marker {
	display: none;
}
.cb-why-summary::after {
	content: " +";
}
.cb-why[open] .cb-why-summary::after {
	content: " −";
}
.cb-why-summary:hover {
	color: var(--color-foreground);
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
	border-radius: var(--radius-full);
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
/* One row per legacy class. Flat and dense on purpose — this is a worklist,
   not a gallery, and the thing you want from it is "how many are left". */
.cb-migration {
	display: grid;
	gap: 0.15rem;
	margin-block-start: var(--space-tight);
}
.cb-mig {
	display: grid;
	grid-template-columns: minmax(0, 12rem) auto minmax(0, 14rem) auto;
	align-items: center;
	gap: var(--space-tight);
	padding: var(--space-tight) var(--space-comfortable);
	border: 1px solid var(--color-border-soft);
	border-radius: var(--radius-sm);
	background: var(--color-surface-raised);
}
.cb-mig--done {
	opacity: 0.62;
}
.cb-mig-from {
	color: var(--color-foreground-quiet);
	overflow-wrap: anywhere;
}
.cb-mig-arrow {
	display: inline-flex;
	color: var(--color-border-strong);
}
.cb-mig-to {
	justify-self: start;
	padding: 0.1rem 0.45rem;
	border: 1px solid var(--color-border-soft);
	border-radius: var(--radius-full);
	background: transparent;
	font: inherit;
	font-family: var(--font-mono);
	font-size: var(--fs-micro);
	color: var(--color-foreground);
	cursor: pointer;
}
.cb-mig-to:hover {
	border-color: var(--color-border-strong);
	background: var(--color-muted);
}
.cb-mig-note {
	grid-column: 1 / -1;
	margin: 0.15rem 0 0;
	font-size: var(--fs-micro);
	line-height: 1.5;
	color: var(--color-foreground-soft);
}
.cb-units {
	display: grid;
	gap: var(--space-comfortable);
	/* 21rem, not 24. `auto-fill` fits as many columns as the MINIMUM allows, so
	   three at 24rem needed 1184px and the main region is 1176 — it missed by
	   eight pixels and dropped to two columns with a third of the screen empty. */
	grid-template-columns: repeat(auto-fill, minmax(min(21rem, 100%), 1fr));
	margin-block-start: var(--space-tight);
}
.cb-unit {
	/* Head and stage. No prose: a grid is for finding a unit, and a paragraph
	   under each one turns twenty cards into a wall of text you scroll past.
	   The description lives in the detail view, under the specimen.

	   SQUARE, every one of them. A grid where a claim-card is four times the
	   height of a badge is a grid you scroll rather than scan — the eye loses
	   the row and the tall cards decide the rhythm. A fixed ratio makes the
	   cards comparable, and anything that does not fit scrolls inside its own
	   stage instead of stretching the card. */
	display: grid;
	grid-template-rows: auto minmax(0, 1fr);
	aspect-ratio: 1;
	min-inline-size: 0;
	border: 1px solid var(--color-border);
	border-radius: var(--radius-lg);
	background: var(--color-surface-raised);
	overflow: hidden;
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
/* A tag that goes somewhere. The parts and slots are not decoration — a part
   is a real class with real declarations, and a slot named after a unit is a
   link to that unit. */
.cb-tag--link {
	border: 1px solid var(--color-border-soft);
	font: inherit;
	font-family: var(--font-mono);
	font-size: var(--fs-nano);
	cursor: pointer;
}
.cb-tag--link:hover {
	border-color: var(--color-border-strong);
	color: var(--color-foreground);
}
.cb-tag--link[aria-pressed="true"] {
	background: var(--color-primary);
	border-color: var(--color-primary);
	color: var(--color-primary-foreground);
}
.cb-tag {
	padding: 0.05rem 0.4rem;
	border-radius: var(--radius-full);
	background: var(--color-surface-page);
	font-family: var(--font-mono);
	font-size: var(--fs-nano);
	color: var(--color-foreground-quiet);
}
.cb-unit-stage {
	display: grid;
	/* TOP-aligned, not centred. Centring a specimen that overflows hides its
	   head AND its foot — you scroll up to find the title and down to find the
	   action, and the first glance lands in the middle of a card. Every stage
	   starting at the top also gives the grid a shared baseline, so the row
	   reads across. Horizontal centring stays: a badge in a 21rem column
	   pinned left is a badge floating in a corner. */
	align-content: start;
	justify-items: center;
	gap: var(--space-tight);
	/* `min-block-size: 0` is what lets the stage shrink inside the square and
	   scroll instead of pushing the card taller — a grid child defaults to
	   `auto` and refuses to go below its content. */
	min-block-size: 0;
	/* `auto`, and declared ONCE. A second `overflow: hidden` used to sit at the
	   bottom of this block and win on source order, so the six specimens taller
	   than their square were silently cropped rather than scrollable — the
	   scrollHeight was right, the scrollbar was gone, and nothing reported it. */
	overflow: auto;
	overscroll-behavior: contain;
	padding: var(--space-comfortable);
	/* The stage is the PAGE ground, not the card's — a specimen has to be seen
	   against what it will actually sit on. */
	background: var(--color-surface-page);
}
/* Walking a flow, not choosing a look. A rail under the stage: where you are,
   what is either side of you, and two arrows — the sequence read left to right,
   which is the direction the flow itself runs. */
.cb-walk {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: center;
	gap: var(--space-tight);
	margin-block-start: var(--space-comfortable);
}
.cb-walk-rail {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: center;
	gap: var(--space-hairline);
	margin: 0;
	padding: 0;
	list-style: none;
}
.cb-walk-step {
	min-block-size: 1.75rem;
	padding: 0 0.75rem;
	border: 1px solid var(--color-border);
	border-radius: var(--radius-full);
	background: var(--color-surface-raised);
	font: inherit;
	font-size: var(--fs-micro);
	color: var(--color-foreground-soft);
	cursor: pointer;
	transition: background var(--duration-quick) var(--ease-out);
}
.cb-walk-step:hover:not(:disabled) {
	background: var(--color-muted);
	color: var(--color-foreground);
}
.cb-walk-step[aria-current="step"] {
	background: var(--color-primary);
	border-color: var(--color-primary);
	color: var(--color-primary-foreground);
	font-weight: 600;
}
.cb-walk-step:disabled {
	opacity: 0.4;
	cursor: default;
}
.cb-walk-arrow {
	font-weight: 500;
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
	border-radius: var(--radius-xs);
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
	border-radius: var(--radius-xs);
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
	border-radius: var(--radius-full);
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
	border-radius: var(--radius-sm);
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
	border-radius: var(--radius-xs);
	background: color-mix(in srgb, var(--color-foreground) 15%, transparent);
}
</style>
