/**
 * What each unit looks like when it is actually doing its job.
 *
 * The gallery used to draw every class with the words "The quick brown fox" in
 * it, which tells you the font and nothing else — a badge, a button, a field
 * and a table header all looked like the same sentence in different weights.
 * A design system viewer that cannot show you a field being a field is a list
 * of class names with extra steps.
 *
 * So each unit gets a specimen: real content, real props, and where the unit
 * has states worth seeing, more than one of them side by side. Markup rather
 * than a render call because the units are still CSS-only on this surface —
 * when they render through the engine this file becomes the props instead.
 */
import { icons } from '@myavenceo/aven-ceo/icons'
import { renderIcon } from '@myavenceo/aven-vibes'

export type Specimen = {
	/** Extra room for a unit that needs it — a modal, an empty state. */
	tall?: boolean
	/**
	 * The gallery view: every variant at once, for the grid card.
	 *
	 * Its job is to answer "what is this unit" at a glance, which needs the
	 * range visible.
	 */
	html: string
	/**
	 * The explorer view: ONE instance, for the detail page.
	 *
	 * A different specimen, not the same one reused, and that is the whole
	 * point. The explorer applies the chosen variant to what is on the stage —
	 * so a stage holding six buttons turns all six primary at once, which shows
	 * you nothing and is actively misleading about what the variant does. One
	 * instance, one variant, one state.
	 */
	one?: string
}

/* Through the engine's own `renderIcon`, not hand-written SVG — a docs page
   that draws its own markup documents itself rather than the system. */
const icon = (name: string, size = '1rem') => renderIcon(name, icons, { size })

export const specimens: Record<string, Specimen> = {
	btn: {
		one: `<button class="btn" type="button">Hire your Aven</button>`,
		html: `<span class="sp-row">
			<button class="btn btn--primary btn--size-md" type="button">Hire your Aven</button>
			<button class="btn btn--accent btn--size-md" type="button">Claim your name</button>
			<button class="btn btn--secondary btn--size-md" type="button">Read the docs</button>
			<button class="btn btn--danger btn--size-md" type="button">Delete account</button>
			<button class="btn btn--primary btn--size-md" type="button" disabled>Unavailable</button>
			<button class="btn btn--unavailable btn--size-md" type="button">Coming soon</button>
			<button class="btn btn--icon btn--size-md" type="button" aria-label="Search">${icon('search', '1.125rem')}</button>
		</span>`
	},
	icon: {
		one: `<span class="icon">${icon('check', '1em')}</span>`,
		html: `<span class="sp-row">
			<span class="icon icon--size-sm">${icon('check', '1em')}</span>
			<span class="icon">${icon('search', '1em')}</span>
			<span class="icon icon--size-md icon--tone-progress">${icon('info', '1em')}</span>
			<span class="icon icon--size-lg icon--tone-warning">${icon('warning', '1em')}</span>
			<span class="icon icon--size-xl icon--tone-error">${icon('error', '1em')}</span>
		</span>`
	},
	badge: {
		one: `<span class="badge">Running</span>`,
		html: `<span class="sp-row">
			<span class="badge badge--tone-neutral">Draft</span>
			<span class="badge badge--tone-progress">Running</span>
			<span class="badge badge--tone-success">Live</span>
			<span class="badge badge--tone-warning">Review</span>
			<span class="badge badge--tone-error">Failed</span>
			<span class="badge badge--emphasis-quiet">Beta</span>
		</span>`
	},
	field: {
		html: `<span class="sp-stack">
			<span class="field">
				<label class="field-label" for="sp-name">Your aven name</label>
				<input class="field-control" id="sp-name" type="text" value="samuel" readonly>
				<p class="field-hint">This becomes samuel.aven.ceo. Every name exists once.</p>
			</span>
			<span class="field">
				<label class="field-label" for="sp-bad">Your aven name</label>
				<input class="field-control" id="sp-bad" type="text" value="Samuel Andert" aria-invalid="true" readonly>
				<p class="field-error">Names are lowercase letters, digits and hyphens. Try samuel-andert.</p>
			</span>
		</span>`
	},
	select: {
		html: `<span class="select">
			<label class="select-label" for="sp-plan">Plan</label>
			<span class="select-shell">
				<select class="select-control" id="sp-plan">
					<option>Founder</option>
					<option>Company</option>
				</select>
				<span class="select-marker">${icon('chevron-down', '1.125rem')}</span>
			</span>
		</span>`
	},
	avatar: {
		one: `<span class="avatar">SA</span>`,
		html: `<span class="sp-row">
			<span class="avatar avatar--size-sm">SA</span>
			<span class="avatar">SA</span>
			<span class="avatar avatar--size-lg">DJ</span>
			<span class="avatar avatar--size-xl">AC</span>
		</span>`
	},
	spinner: {
		one: `<span class="spinner" role="status" aria-label="Loading">${icon('spinner', '1em')}</span>`,
		html: `<span class="sp-row">
			<span class="spinner spinner--size-sm" role="status" aria-label="Loading">${icon('spinner', '1em')}</span>
			<span class="spinner" role="status" aria-label="Loading">${icon('spinner', '1em')}</span>
			<span class="spinner spinner--size-lg" role="status" aria-label="Loading">${icon('spinner', '1em')}</span>
		</span>`
	},
	skeleton: {
		one: `<span class="skeleton" style="inline-size: 14rem"></span>`,
		html: `<span class="sp-stack sp-stack--wide">
			<span class="skeleton skeleton--shape-text" style="inline-size: 70%"></span>
			<span class="skeleton skeleton--shape-text" style="inline-size: 90%"></span>
			<span class="skeleton skeleton--shape-text" style="inline-size: 45%"></span>
		</span>`
	},
	toast: {
		html: `<span class="toast toast--tone-success">
			<span class="toast-icon">${icon('check', '1.25rem')}</span>
			<span class="toast-copy">
				<p class="toast-title">Name reserved</p>
				<p class="toast-body">samuel.aven.ceo is yours. We emailed the confirmation.</p>
			</span>
			<button class="toast-dismiss" type="button" aria-label="Dismiss">${icon('close')}</button>
		</span>`
	},
	tabs: {
		html: `<span class="tabs">
			<span class="tabs-list" role="tablist" aria-label="Skill">
				<button class="tabs-tab" type="button" role="tab" aria-selected="true">Overview</button>
				<button class="tabs-tab" type="button" role="tab" aria-selected="false">Permissions</button>
				<button class="tabs-tab" type="button" role="tab" aria-selected="false">History</button>
			</span>
			<span class="tabs-panel" role="tabpanel">Routes your inbox and drafts the replies you would have written.</span>
		</span>`
	},
	accordion: {
		html: `<span class="sp-stack sp-stack--wide">
			<details class="accordion" open>
				<summary class="accordion-summary">
					<span class="accordion-label">What does an aven actually do?</span>
					<span class="accordion-marker">${icon('chevron-down', '1.125rem')}</span>
				</summary>
				<span class="accordion-content">It runs the parts of the company you would otherwise do yourself, and keeps what it learns.</span>
			</details>
			<details class="accordion">
				<summary class="accordion-summary">
					<span class="accordion-label">Can I take my data with me?</span>
					<span class="accordion-marker">${icon('chevron-down', '1.125rem')}</span>
				</summary>
			</details>
		</span>`
	},
	table: {
		html: `<span class="table-scroller">
			<table class="table">
				<thead><tr>
					<th class="table-header" scope="col">Skill</th>
					<th class="table-header" scope="col">Status</th>
					<th class="table-header table-numeric" scope="col">Hours saved</th>
				</tr></thead>
				<tbody>
					<tr><td class="table-cell">Inbox router</td><td class="table-cell"><span class="badge badge--tone-success">Live</span></td><td class="table-cell table-numeric">6</td></tr>
					<tr><td class="table-cell">Book keeper</td><td class="table-cell"><span class="badge badge--tone-progress">Running</span></td><td class="table-cell table-numeric">4</td></tr>
					<tr><td class="table-cell">Blog writer</td><td class="table-cell"><span class="badge badge--emphasis-quiet">Beta</span></td><td class="table-cell table-numeric">2</td></tr>
				</tbody>
			</table>
		</span>`
	},
	'empty-state': {
		tall: true,
		html: `<span class="empty-state">
			<span class="empty-state-icon">${icon('search', '2rem')}</span>
			<p class="empty-state-title">No skills yet</p>
			<p class="empty-state-body">Skills are the jobs your aven takes over. Start with the inbox — it is the one most founders hand off first.</p>
			<span class="empty-state-action"><button class="btn btn--primary btn--size-md" type="button">Browse skills</button></span>
		</span>`
	},
	modal: {
		tall: true,
		html: `<span class="modal" data-specimen-static>
			<span class="modal-head">
				<p class="modal-title" id="sp-modal">Release samuel.aven.ceo?</p>
				<button class="modal-close" type="button" aria-label="Close">${icon('close', '1.125rem')}</button>
			</span>
			<span class="modal-body">The name goes back on the list immediately and anyone can take it. This cannot be undone.</span>
			<span class="modal-actions">
				<button class="btn btn--secondary btn--size-sm" type="button">Keep it</button>
				<button class="btn btn--danger btn--size-sm" type="button">Release the name</button>
			</span>
		</span>`
	},
	sidebar: {
		tall: true,
		html: `<span class="sidebar" style="inline-size: 14rem">
			<span class="sidebar-items">
				<a class="nav-link" href="#specimen" aria-current="page">Overview</a>
				<a class="nav-link" href="#specimen">Skills</a>
				<a class="nav-link" href="#specimen">Billing</a>
			</span>
			<span class="sidebar-footer"><span class="badge badge--emphasis-quiet">Beta</span></span>
		</span>`
	},
	surface: {
		one: `<span class="surface" style="inline-size: 15rem">A padded, rounded box.</span>`,
		html: `<span class="sp-row">
			<span class="surface surface--raised surface--size-sm">Raised</span>
			<span class="surface surface--sunken surface--size-sm">Sunken</span>
			<span class="surface surface--plain surface--size-sm">Plain</span>
		</span>`
	},
	text: {
		one: `<p class="text">One human plus one avenCEO</p>`,
		html: `<span class="sp-stack sp-stack--wide">
			<p class="text text--title">One human plus one avenCEO</p>
			<p class="text text--lede">The company of the future has two roles, and one of them is not a person.</p>
			<p class="text text--meta">Updated 12 minutes ago</p>
			<p class="text text--eyebrow-quiet">Availability</p>
		</span>`
	},
	logo: {
		html: `<span class="sp-row">
			<span class="logo logo--lockup"><img class="logo-mark" src="/aven-logo.svg" alt="" width="28" height="28"><span class="logo-wordmark"><span class="logo-word-aven">aven</span><span class="logo-word-ceo">CEO</span></span></span>
			<span class="logo logo--mark"><img class="logo-mark" src="/aven-logo.svg" alt="" width="28" height="28"></span>
			<span class="logo logo--wordmark"><span class="logo-wordmark"><span class="logo-word-aven">aven</span><span class="logo-word-ceo">CEO</span></span></span>
		</span>`
	},
	'nav-link': {
		one: `<a class="nav-link" href="#specimen">Marketplace</a>`,
		html: `<span class="sp-row">
			<a class="nav-link" href="#specimen" aria-current="page">Skills</a>
			<a class="nav-link" href="#specimen">Marketplace</a>
			<a class="nav-link" href="#specimen">Pricing</a>
		</span>`
	},
	card: {
		one: `<span class="card" style="inline-size: 17rem"><span class="badge badge--tone-progress">Running</span><p class="text text--section-title">Inbox router</p><p class="prose prose--size-fine">Reads every mail, answers what it can, and hands you the rest.</p></span>`,
		html: `<span class="sp-row sp-row--cards">
			<span class="card" style="inline-size: 15rem">
				<span class="badge badge--tone-progress">Running</span>
				<p class="text text--section-title">Inbox router</p>
				<p class="prose prose--size-fine">Reads every mail, answers what it can, and hands you the rest.</p>
			</span>
			<span class="card card--emphasis-featured" style="inline-size: 15rem">
				<span class="badge badge--tone-accent">Most picked</span>
				<p class="text text--section-title">Book keeper</p>
				<p class="prose prose--size-fine">Files every receipt the day it arrives.</p>
			</span>
			<span class="card card--emphasis-quiet" style="inline-size: 15rem">
				<span class="badge badge--emphasis-quiet">Soon</span>
				<p class="text text--section-title">Blog writer</p>
				<p class="prose prose--size-fine">Drafts in your voice, from what your company already published.</p>
			</span>
		</span>`
	},
	'skill-card': {
		tall: true,
		one: `<a class="skill-card" href="#specimen" style="inline-size: 19rem">
			<span class="skill-card-head"><span class="badge badge--tone-progress">Communication</span></span>
			<p class="skill-card-title">Inbox router</p>
			<p class="skill-card-summary">Reads every mail as it lands, answers what it can in your voice, and hands you only the ones that need you.</p>
			<span class="skill-card-rail"><span class="skill-card-promise">6 hrs/week</span><span class="skill-card-more">View</span></span>
		</a>`,
		html: `<span class="sp-row sp-row--cards">
			<a class="skill-card" href="#specimen" style="inline-size: 15rem">
				<span class="skill-card-head"><span class="badge badge--tone-progress">Communication</span></span>
				<p class="skill-card-title">Inbox router</p>
				<p class="skill-card-summary">Answers what it can in your voice, and hands you the rest.</p>
				<span class="skill-card-rail"><span class="skill-card-promise">6 hrs/week</span><span class="skill-card-more">View</span></span>
			</a>
			<a class="skill-card skill-card--emphasis-featured" href="#specimen" style="inline-size: 15rem">
				<span class="skill-card-head"><span class="badge badge--tone-accent">Most picked</span></span>
				<p class="skill-card-title">Book keeper</p>
				<p class="skill-card-summary">Files every receipt the day it arrives.</p>
				<span class="skill-card-rail"><span class="skill-card-promise">4 hrs/week</span><span class="skill-card-more">View</span></span>
			</a>
			<a class="skill-card skill-card--emphasis-soon" href="#specimen" style="inline-size: 15rem">
				<span class="skill-card-head"><span class="badge">Soon</span></span>
				<p class="skill-card-title">Blog writer</p>
				<p class="skill-card-summary">Drafts in your voice, from what you already published.</p>
				<span class="skill-card-rail"><span class="skill-card-promise">2 hrs/week</span><span class="skill-card-more">Join list</span></span>
			</a>
		</span>`
	},
	hero: {
		tall: true,
		one: `<span class="hero hero--ground-marine hero--height-short" style="display:grid; inline-size:100%; border-radius: var(--radius-lg); overflow:hidden">
			<span class="hero-content">
				<p class="hero-eyebrow">The company of the future</p>
				<h3 class="hero-heading" style="margin:0">avenCEO runs your company, you lead the vision.</h3>
				<p class="hero-lead">From working to survive to sovereign founder of tomorrow.</p>
				<span class="hero-actions">
					<button class="btn btn--accent" type="button">Claim your name</button>
					<button class="btn btn--secondary" type="button">See the skills</button>
				</span>
			</span>
		</span>`
	},
	navbar: {
		tall: true,
		one: `<span class="navbar" style="position: static; inline-size: 100%; max-inline-size: 44rem">
			<span class="navbar-bar">
				<span class="navbar-brand"><span class="logo logo--lockup"><img class="logo-mark" src="/aven-logo.svg" alt="" width="24" height="24"><span class="logo-wordmark"><span class="logo-word-aven">aven</span><span class="logo-word-ceo">CEO</span></span></span></span>
				<span class="navbar-actions">
					<a class="nav-link" href="#specimen">Skills</a>
					<a class="nav-link" href="#specimen">Pricing</a>
					<button class="btn btn--accent btn--size-sm" type="button">Hire your Aven</button>
					<button class="navbar-toggle" type="button" aria-expanded="false" aria-label="Menu">${icon('menu', '1.25rem')}</button>
				</span>
			</span>
		</span>`
	},
	'site-footer': {
		tall: true,
		one: `<span class="site-footer" style="inline-size: 100%; max-inline-size: 44rem">
			<span class="site-footer-inner">
				<span class="site-footer-brand">
					<span class="logo logo--lockup"><img class="logo-mark" src="/aven-logo.svg" alt="" width="24" height="24"><span class="logo-wordmark"><span class="logo-word-aven">aven</span><span class="logo-word-ceo">CEO</span></span></span>
					<span class="site-footer-link">Your own AI, your own company.</span>
				</span>
				<span class="site-footer-groups">
					<span class="site-footer-group">
						<p class="site-footer-group-title">Product</p>
						<a class="site-footer-link" href="#specimen">Skills</a>
						<a class="site-footer-link" href="#specimen">Pricing</a>
					</span>
					<span class="site-footer-group">
						<p class="site-footer-group-title">Legal</p>
						<a class="site-footer-link" href="#specimen">Imprint</a>
						<a class="site-footer-link" href="#specimen">Privacy</a>
					</span>
				</span>
			</span>
			<span class="site-footer-meta"><span>&copy; 2026 avenCEO</span><span>Built in Switzerland</span></span>
		</span>`
	},
	section: {
		one: `<span class="section" style="display:block;inline-size:100%"><span class="section-inner" style="display:block"><p class="text text--eyebrow-quiet">Section</p><p class="text text--section-title">One band of a page</p></span></span>`,
		tall: true,
		html: `<span class="sp-stack sp-stack--wide" style="gap: 0">
			<span class="section section--rhythm-tight" style="display:block">
				<span class="section-inner" style="display:block">
					<p class="text text--eyebrow-quiet">Default</p>
					<p class="text text--section-title">A band with a rule under it</p>
				</span>
			</span>
			<span class="section section--rhythm-tight section--ground-band" style="display:block">
				<span class="section-inner" style="display:block">
					<p class="text text--eyebrow-quiet">Band</p>
					<p class="text text--section-title">The page's turning point</p>
				</span>
			</span>
			<span class="section section--rhythm-tight section--ground-band-alt" style="display:block">
				<span class="section-inner" style="display:block">
					<p class="text text--eyebrow-quiet">Band alt</p>
					<p class="text text--section-title">The second voice</p>
				</span>
			</span>
		</span>`
	},
	stat: {
		one: `<span class="stat"><p class="stat-value">6</p><p class="stat-label">Hours saved</p><p class="stat-caption">per week, inbox alone</p></span>`,
		html: `<span class="sp-row">
			<span class="stat stat--align-center">
				<p class="stat-value">6</p>
				<p class="stat-label">Hours saved</p>
				<p class="stat-caption">per week, inbox alone</p>
			</span>
			<span class="stat stat--align-center stat--tone-accent">
				<p class="stat-value">1 / 10</p>
				<p class="stat-label">Claimed</p>
				<p class="stat-caption">founder seats</p>
			</span>
			<span class="stat stat--align-center stat--size-sm stat--tone-progress">
				<p class="stat-value">13</p>
				<p class="stat-label">Skills live</p>
				<p class="stat-caption">three more in beta</p>
			</span>
		</span>`
	},
	prose: {
		one: `<p class="prose">Every decision and every correction flows back into your aven\u2019s skills. After a year it is the memory, the experience and the judgment of your company.</p>`,
		html: `<span class="sp-stack sp-stack--wide">
			<p class="prose prose--size-lead">Once AI does nearly every job, around the clock, at the price of electricity, trading time for money stops paying.</p>
			<p class="prose">Every decision and every correction flows back into your aven's skills. After a year it is the memory, the experience and the judgment of your company — and with that, its most valuable asset.</p>
			<p class="prose prose--size-fine">Prices include VAT. Cancel any time.</p>
		</span>`
	},
	step: {
		one: `<span class="step">Pick the name</span>`,
		html: `<span class="sp-stack sp-stack--wide">
			<span class="step">Pick the name</span>
			<span class="step">Meet your aven</span>
			<span class="step">Hand it the inbox</span>
		</span>`
	}
}
