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
 *
 * SAFETY. These strings reach the page through Svelte's `{@html}`, which does
 * no sanitising at all. That is safe here for exactly one reason: every string
 * in this file is a build-time constant written by hand, and none of it comes
 * from a config, a network response or a URL. If a specimen ever needs to come
 * from data, it must go through the engine's renderer instead — which is what
 * `SAFE_TAGS` and the icon registry exist for — and not through this file.
 * The engine itself never accepts raw HTML; this is a docs page taking a
 * shortcut the engine deliberately refuses.
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
	 *
	 * Optional: a unit whose range IS one thing — a hero, a navbar, a footer —
	 * has nothing to show a row of, and inventing three of them to satisfy a
	 * type would be three lies about the unit.
	 */
	html?: string
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
		one: `<button class="btn" type="button"><span class="btn-label">Hire your Aven</span></button>`,
		html: `<span class="sp-stack sp-stack--wide" style="justify-items:center">
			<span class="sp-row">
				<button class="btn btn--primary" type="button"><span class="btn-label">Hire your Aven</span></button>
				<button class="btn btn--accent" type="button">
					<span class="btn-label">Claim your name</span>
					<span class="btn-icon-end">${icon('arrow-right', '1em')}</span>
				</button>
				<button class="btn btn--secondary" type="button">
					<span class="btn-icon-start">${icon('search', '1em')}</span>
					<span class="btn-label">Browse skills</span>
				</button>
			</span>
			<span class="sp-row">
				<button class="btn btn--danger" type="button"><span class="btn-label">Delete account</span></button>
				<button class="btn btn--ghost" type="button"><span class="btn-label">Not now</span></button>
				<button class="btn btn--primary" type="button" disabled><span class="btn-label">Coming soon</span></button>
				<button class="btn btn--danger btn--shape-icon" type="button" aria-label="Delete">${icon('close', '1.125rem')}</button>
				<button class="btn btn--ghost btn--shape-icon" type="button" aria-label="Search">${icon('search', '1.125rem')}</button>
			</span>
			<span class="sp-row">
				<button class="btn btn--primary" type="button" aria-busy="true">
					<span class="btn-label">Claiming</span>
					<span class="btn-badge">${icon('spinner', '0.875rem')}</span>
				</button>
				<button class="btn btn--primary" type="button" data-state="success">
					<span class="btn-label">Name claimed</span>
					<span class="btn-badge">${icon('check', '0.875rem')}</span>
				</button>
			</span>
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
		/* ONE field. Two of them side by side made the state switches meaningless —
		   picking `invalid` reddened both, which shows what invalid looks like and
		   nothing about what changes. */
		one: `<span class="field" style="inline-size:20rem">
			<label class="field-label" for="sp-name">Your aven name</label>
			<input class="field-control" id="sp-name" type="text" value="samuel" readonly>
			<p class="field-hint">This becomes samuel.aven.ceo. Every name exists once.</p>
			<p class="field-error">Names are lowercase letters, digits and hyphens. Try samuel-andert.</p>
		</span>`,
		html: `<span class="sp-stack">
			<span class="field field--type-email">
				<label class="field-label" for="sp-mail">Email</label>
				<input class="field-control" id="sp-mail" type="email" autocomplete="email" value="you@aven.ceo" readonly>
			</span>
			<span class="field field--shape-affixed">
				<label class="field-label" for="sp-aff">Your aven name</label>
				<span class="field-shell">
					<input class="field-control" id="sp-aff" type="text" value="maia" readonly>
					<span class="field-suffix">.aven.ceo</span>
				</span>
			</span>
			<span class="field field--control-select">
				<label class="field-label" for="sp-plan">Plan</label>
				<span class="field-shell">
					<select class="field-control" id="sp-plan"><option>Founder</option><option>Company</option></select>
					<span class="field-marker">${icon('chevron-down', '1.125rem')}</span>
				</span>
			</span>
			<span class="field field--type-numeric">
				<label class="field-label" for="sp-code">Device code</label>
				<input class="field-control" id="sp-code" type="text" inputmode="numeric" value="4192" readonly>
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
		one: `<span class="toast toast--tone-success">
			<span class="toast-icon">${icon('check', '1.25rem')}</span>
			<span class="toast-copy">
				<p class="toast-title">Name reserved</p>
				<p class="toast-body">samuel.aven.ceo is yours. We emailed the confirmation.</p>
			</span>
			<button class="toast-dismiss" type="button" aria-label="Dismiss">${icon('close', '1rem')}</button>
		</span>`,
		html: `<span class="sp-stack sp-stack--wide">
			<span class="toast toast--tone-success">
				<span class="toast-icon">${icon('check', '1.25rem')}</span>
				<span class="toast-copy"><p class="toast-title">Name reserved</p><p class="toast-body">samuel.aven.ceo is yours.</p></span>
				<button class="toast-dismiss" type="button" aria-label="Dismiss">${icon('close', '1rem')}</button>
			</span>
			<span class="toast toast--placement-inline toast--tone-error" role="alert">
				<span class="toast-icon">${icon('error', '1.25rem')}</span>
				<span class="toast-copy"><p class="toast-title">That code has expired</p><p class="toast-body">Ask avenOS for a new link and try again.</p></span>
			</span>
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
				<button class="btn btn--neutral btn--size-sm" type="button">Keep it</button>
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
		one: `<a class="card skill-card" href="#specimen" style="inline-size: 19rem">
			<span class="card skill-card-head"><span class="badge badge--tone-progress">Communication</span></span>
			<p class="card skill-card-title">Inbox router</p>
			<p class="card skill-card-summary">Reads every mail as it lands, answers what it can in your voice, and hands you only the ones that need you.</p>
			<span class="card skill-card-rail"><span class="card skill-card-promise">6 hrs/week</span><span class="card skill-card-more">View</span></span>
		</a>`,
		html: `<span class="sp-row sp-row--cards">
			<a class="card skill-card" href="#specimen" style="inline-size: 15rem">
				<span class="card skill-card-head"><span class="badge badge--tone-progress">Communication</span></span>
				<p class="card skill-card-title">Inbox router</p>
				<p class="card skill-card-summary">Answers what it can in your voice, and hands you the rest.</p>
				<span class="card skill-card-rail"><span class="card skill-card-promise">6 hrs/week</span><span class="card skill-card-more">View</span></span>
			</a>
			<a class="skill-card skill-card--emphasis-featured" href="#specimen" style="inline-size: 15rem">
				<span class="card skill-card-head"><span class="badge badge--tone-accent">Most picked</span></span>
				<p class="card skill-card-title">Book keeper</p>
				<p class="card skill-card-summary">Files every receipt the day it arrives.</p>
				<span class="card skill-card-rail"><span class="card skill-card-promise">4 hrs/week</span><span class="card skill-card-more">View</span></span>
			</a>
			<a class="skill-card skill-card--emphasis-soon" href="#specimen" style="inline-size: 15rem">
				<span class="card skill-card-head"><span class="badge">Soon</span></span>
				<p class="card skill-card-title">Blog writer</p>
				<p class="card skill-card-summary">Drafts in your voice, from what you already published.</p>
				<span class="card skill-card-rail"><span class="card skill-card-promise">2 hrs/week</span><span class="card skill-card-more">Join list</span></span>
			</a>
		</span>`
	},
	hero: {
		tall: true,
		/* The real thing: media behind, scrim over it, three lines of copy on top.
		   `min-block-size` is overridden only so the specimen fits a stage — every
		   other value is the unit's. */
		one: `<span class="hero hero--height-short" style="display:flex; inline-size:100%; border-radius: var(--radius-lg)">
			<span class="hero-media"><img class="media media--placement-behind" src="/hero-poster.jpg" alt=""></span>
			<span class="hero-scrim" aria-hidden="true"></span>
			<span class="hero-content">
				<p class="text text--eyebrow hero-eyebrow">The company of the future</p>
				<h3 class="hero-heading" style="margin:0"><span class="hero-heading-mark logo logo--wordmark"><span class="logo-wordmark"><span class="logo-word-aven">aven</span><span class="logo-word-ceo">CEO</span></span></span> runs your company, you lead the vision.</h3>
				<p class="hero-lead">From working to survive to sovereign founder of tomorrow.</p>
				<p class="hero-helper">— your avenCEO gets you there —</p>
				<span class="hero-actions">
					<button class="btn btn--neutral" type="button">See the skills</button>
					<button class="btn btn--accent" type="button">Claim your name</button>
				</span>
			</span>
		</span>`
	},
	media: {
		one: `<img class="media media--ratio-wide" src="/hero-poster.jpg" alt="" style="inline-size: 22rem">`,
		html: `<span class="sp-row">
			<img class="media media--ratio-wide" src="/hero-poster.jpg" alt="" style="inline-size: 13rem">
			<img class="media media--ratio-square" src="/hero-poster.jpg" alt="" style="inline-size: 7rem">
			<img class="media media--ratio-portrait" src="/hero-poster.jpg" alt="" style="inline-size: 6rem">
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
	'flow-card': {
		tall: true,
		/* Every PART the variants target has to be present, or a switch dresses
		   nothing and reads as broken. `status` and `answer` both name parts, so
		   the specimen carries the crest AND the status line even though a real
		   screen shows one or the other. */
		one: `<span class="flow-card" style="display:grid">
			<span class="flow-card-crest">${icon('info', '1.5rem')}</span>
			<p class="text text--eyebrow flow-card-eyebrow">Secure app connection</p>
			<p class="flow-card-status">Taken</p>
			<p class="flow-card-heading" style="margin:0">Authorize this device</p>
			<p class="flow-card-description">Confirm the connection to give the app access to your Aven account.</p>
			<span class="flow-card-code">A4F2-9K7Q</span>
			<span class="flow-card-alert">That code has expired. Ask avenOS for a new one.</span>
			<span class="flow-card-actions">
				<button class="btn btn--ghost" type="button"><span class="btn-label">Not now</span></button>
				<button class="btn btn--primary" type="button"><span class="btn-label">Authorize</span></button>
			</span>
			<p class="flow-card-trust">Securely connected through aven.id</p>
		</span>`
	},
	'claim-card': {
		tall: true,
		one: `<span class="claim-card" style="inline-size:100%; max-inline-size:44rem">
			<span class="claim-card-body">
				<p class="text text--eyebrow claim-card-eyebrow">— Invite only —</p>
				<h3 class="claim-card-heading" style="margin:0">Claim your avenCEO name now</h3>
				<p class="claim-card-lede">Like a domain — but for your avenCEO: e.g. maia.aven.ceo. It exists exactly once — claim it before someone else does.</p>
				<ul class="claim-card-benefits">
					<li class="claim-card-benefit"><span class="claim-card-dot"></span><span>100 MIND credits — for early-bird testing</span></li>
					<li class="claim-card-benefit"><span class="claim-card-dot"></span><span>Your avenCEO name for 1 year</span></li>
					<li class="claim-card-benefit"><span class="claim-card-dot"></span><span>Your place on the waiting list</span></li>
					<li class="claim-card-benefit"><span class="claim-card-dot"></span><span>Your profile in the aven Marketplace</span></li>
				</ul>
				<span class="claim-card-price">
					<span class="claim-card-amount">25 €</span>
					<span class="claim-card-terms">one-time · incl. VAT</span>
				</span>
				<span class="claim-card-form">
					<span class="field field--shape-affixed field--shape-pill field--size-hero field--align-end" style="flex:1 1 16rem; min-inline-size:0">
						<span class="field-shell">
							<input class="field-control" type="text" value="maia" readonly aria-label="Your aven name">
							<span class="field-suffix">.aven.ceo</span>
						</span>
					</span>
					<button class="btn btn--primary btn--size-xl" type="button">
						<span class="btn-label">Claim your name</span>
						<span class="btn-icon-end">${icon('arrow-right', '1em')}</span>
					</button>
				</span>
			</span>
			<span class="claim-card-offer">
				<p class="claim-card-offer-line">+ 30 % off your first 3 months of avenCEO</p>
				<p class="claim-card-offer-note">1 / 10 claimed</p>
			</span>
		</span>`
	},
	'price-tier': {
		tall: true,
		one: `<span class="price-tier price-tier--emphasis-featured" style="display:flex; inline-size:17rem">
			<p class="text text--label price-tier-name">Founder</p>
			<p class="price-tier-price"><span class="price-tier-amount">49 €</span><span class="price-tier-terms">/ month</span></p>
			<ul class="price-tier-features">
				<li class="price-tier-feature"><span class="claim-card-dot"></span><span>Your avenCEO, running daily</span></li>
				<li class="price-tier-feature"><span class="claim-card-dot"></span><span>Six skills included</span></li>
				<li class="price-tier-feature"><span class="claim-card-dot"></span><span>Your name for a year</span></li>
			</ul>
			<span class="price-tier-action"><button class="btn btn--accent" type="button"><span class="btn-label">Start here</span></button></span>
			<p class="price-tier-note">Cancel any time. Incl. VAT.</p>
		</span>`
	},
	'row-list': {
		one: `<ol class="row-list" aria-label="Reserved names" style="inline-size:20rem">
			<li class="row-list-row"><span class="row-list-lead">1</span><span class="row-list-name">maia</span><span class="row-list-meta">2 days ago</span></li>
			<li class="row-list-row"><span class="row-list-lead">2</span><span class="row-list-name">samuel</span><span class="row-list-meta">5 days ago</span></li>
			<li class="row-list-row"><span class="row-list-lead">9</span><span class="row-list-name">daniel</span><span class="row-list-meta">last week</span></li>
			<li class="row-list-row"><span class="row-list-lead">10</span><span class="row-list-name">aven-studio</span><span class="row-list-meta">last week</span></li>
		</ol>`,
		html: `<span class="sp-stack sp-stack--wide">
			<ul class="row-list row-list--style-panel row-list--density-roomy" aria-label="Passkeys">
				<li class="row-list-row"><span class="row-list-lead">${icon('check', '1em')}</span><span class="row-list-name">MacBook Pro — Touch ID</span><span class="row-list-action"><button class="btn btn--danger btn--size-sm" type="button"><span class="btn-label">Revoke</span></button></span></li>
				<li class="row-list-row"><span class="row-list-lead">${icon('check', '1em')}</span><span class="row-list-name">iPhone 15</span><span class="row-list-action"><button class="btn btn--danger btn--size-sm" type="button"><span class="btn-label">Revoke</span></button></span></li>
			</ul>
		</span>`
	},
	'media-card': {
		one: `<a class="media-card" href="#specimen" style="inline-size:13rem">
			<span class="media-card-stage"><img class="media" src="/hero-poster.jpg" alt=""></span>
			<span class="media-card-caption">
				<span class="media-card-line"><span class="media-card-title">Q3 board deck</span><span class="badge badge--face-mono badge--size-sm media-card-kind">pdf</span></span>
			</span>
		</a>`,
		html: `<span class="sp-row sp-row--cards">
			<a class="media-card" href="#specimen" style="inline-size:11rem">
				<span class="media-card-stage"><img class="media" src="/hero-poster.jpg" alt=""></span>
				<span class="media-card-caption"><span class="media-card-line"><span class="media-card-title">Q3 board deck</span><span class="badge badge--face-mono badge--size-sm media-card-kind">pdf</span></span></span>
			</a>
			<a class="media-card media-card--ratio-square" href="#specimen" style="inline-size:11rem">
				<span class="media-card-stage"><span class="media-card-placeholder">no preview</span></span>
				<span class="media-card-caption"><span class="media-card-line"><span class="media-card-title">Invoice 0142</span><span class="badge badge--face-mono badge--size-sm media-card-kind">csv</span></span></span>
			</a>
		</span>`
	},
	'flow-node': {
		one: `<ul style="list-style:none;margin:0;padding:0;inline-size:20rem">
			<li class="flow-node flow-node--status-running">
				<span class="flow-node-head"><span class="flow-node-label">Reading the inbox</span><span class="flow-node-dot" role="status" aria-label="running"></span></span>
				<p class="text text--mono-meta flow-node-detail">142 messages since 09:00</p>
				<ul class="flow-node-children">
					<li class="flow-node flow-node--status-done"><span class="flow-node-head"><span class="flow-node-label">Fetch</span><span class="flow-node-dot" role="status" aria-label="done">${icon('check', '0.6rem')}</span></span></li>
					<li class="flow-node flow-node--status-failed"><span class="flow-node-head"><span class="flow-node-label">Classify</span><span class="flow-node-dot" role="status" aria-label="failed">${icon('close', '0.6rem')}</span></span></li>
				</ul>
			</li>
		</ul>`
	},
	workbench: {
		tall: true,
		one: `<span class="workbench" style="display:grid; block-size:15rem; inline-size:100%; border:1px solid var(--color-border); border-radius:var(--radius-lg)">
			<span class="workbench-rail" style="inline-size:9rem; padding:var(--space-tight)">
				<a class="nav-link" href="#specimen" aria-current="page">Dashboard</a>
				<a class="nav-link" href="#specimen">Skills</a>
				<a class="nav-link" href="#specimen">Artifacts</a>
			</span>
			<span class="workbench-main" style="padding:var(--space-comfortable)">
				<p class="text text--section-title">Main region</p>
				<p class="prose prose--size-fine">Scrolls on its own. The rail does not scroll with it — which is what <code>min-block-size: 0</code> is for.</p>
			</span>
		</span>`
	},
	'setting-row': {
		one: `<span class="sp-stack sp-stack--wide">
			<span class="setting-row">
				<span class="setting-row-copy">
					<p class="setting-row-label">Two-factor authentication</p>
					<p class="setting-row-description">Required for every sign-in. Uses the passkey already on this device.</p>
				</span>
				<span class="setting-row-control"><span class="badge badge--tone-success">On</span></span>
			</span>
			<span class="setting-row setting-row--tone-danger">
				<span class="setting-row-copy">
					<p class="setting-row-label">Delete this account</p>
					<p class="setting-row-description">Everything goes — your aven, its memory, and the name. This cannot be undone.</p>
				</span>
				<span class="setting-row-control"><button class="btn btn--danger btn--size-sm" type="button"><span class="btn-label">Delete</span></button></span>
			</span>
		</span>`
	},
	'thread-item': {
		one: `<span class="sp-stack sp-stack--wide" style="gap:0.15rem">
			<a class="thread-item" href="#specimen" aria-current="true">
				<span class="thread-item-head"><span class="thread-item-title">Route today's inbox</span><span class="text text--mono-meta thread-item-time">09:14</span></span>
				<span class="thread-item-foot"><span class="thread-item-preview">142 messages, 9 need you</span><span class="thread-item-badge"><span class="badge badge--tone-progress badge--size-sm">Running</span></span></span>
			</a>
			<a class="thread-item" href="#specimen">
				<span class="thread-item-head"><span class="thread-item-title">File the Q3 receipts</span><span class="text text--mono-meta thread-item-time">Tue</span></span>
				<span class="thread-item-foot"><span class="thread-item-preview">Done — 34 filed, 2 flagged</span></span>
			</a>
		</span>`
	},
	'viewer-frame': {
		tall: true,
		one: `<span class="viewer-frame viewer-frame--content-code" style="display:flex; inline-size:100%; max-inline-size:30rem; block-size:14rem">
			<span class="viewer-frame-toolbar">
				<span class="badge badge--size-sm">artifact.json</span>
				<span style="margin-inline-start:auto"><button class="btn btn--ghost btn--shape-icon btn--size-sm" type="button" aria-label="Open">${icon('external', '1rem')}</button></span>
			</span>
			<span class="viewer-frame-content" tabindex="0">{
  "name": "inbox-router",
  "runs": 1420,
  "savedHours": 6
}</span>
		</span>`
	},
	'gate-card': {
		tall: true,
		one: `<span class="gate-card" style="display:grid; inline-size:100%; max-inline-size:30rem">
			<span class="gate-card-body">
				<span class="gate-card-head">
					<span class="badge badge--face-mono badge--tone-progress badge--size-sm gate-card-kind">Send</span>
					<p class="gate-card-question">Send this reply to Anna Weber?</p>
					<span class="text text--mono-meta gate-card-asked">2 min ago</span>
				</span>
				<p class="gate-card-detail">Your aven drafted an answer about the Q3 invoice. Nothing is sent until you say so.</p>
				<span class="gate-card-preview">Hi Anna — the Q3 invoice went out on the 14th to accounts@…; I have attached it again here.

Let me know if anything is missing.</span>
			</span>
			<span class="gate-card-actions">
				<button class="btn btn--neutral btn--size-sm" type="button"><span class="btn-label">Edit draft</span></button>
				<button class="btn btn--size-sm" type="button" style="background:var(--color-primary-foreground); color:var(--color-primary); border-color:var(--color-primary-foreground)"><span class="btn-label">Send it</span></button>
			</span>
		</span>`
	},
	'prompt-bar': {
		one: `<span class="prompt-bar" style="display:grid; inline-size:100%; max-inline-size:32rem">
			<span class="prompt-bar-hint">Enter to send · Shift+Enter for a new line</span>
			<span class="prompt-bar-shell">
				<span class="prompt-bar-leading"><button class="btn btn--ghost btn--shape-icon btn--size-sm" type="button" aria-label="Voice">${icon('info', '1.125rem')}</button></span>
				<textarea class="prompt-bar-input" rows="1" aria-label="Ask your aven" placeholder="Ask your aven…"></textarea>
				<span class="prompt-bar-actions"><button class="btn btn--primary btn--shape-icon btn--size-sm" type="button" aria-label="Send">${icon('arrow-right', '1.125rem')}</button></span>
			</span>
		</span>`
	},
	'payment-frame': {
		tall: true,
		one: `<span class="payment-frame" style="display:grid; inline-size:100%; max-inline-size:26rem">
			<span class="payment-frame-stage" style="min-block-size:14rem; display:grid; place-items:center">
				<span class="prose prose--size-fine">The provider's form renders here.</span>
			</span>
			<p class="payment-frame-state">Waiting for the payment provider…</p>
			<span class="payment-frame-fallback">
				<span class="prose prose--size-fine">Not loading?</span>
				<button class="btn btn--neutral btn--size-sm" type="button"><span class="btn-label">Open checkout in a new tab</span></button>
			</span>
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
		one: `<span class="stat"><p class="stat-value">6</p><p class="text text--label stat-label">Hours saved</p><p class="stat-caption">per week, inbox alone</p></span>`,
		html: `<span class="sp-row">
			<span class="stat stat--align-center">
				<p class="stat-value">6</p>
				<p class="text text--label stat-label">Hours saved</p>
				<p class="stat-caption">per week, inbox alone</p>
			</span>
			<span class="stat stat--align-center stat--tone-accent">
				<p class="stat-value">1 / 10</p>
				<p class="text text--label stat-label">Claimed</p>
				<p class="stat-caption">founder seats</p>
			</span>
			<span class="stat stat--align-center stat--size-sm stat--tone-progress">
				<p class="stat-value">13</p>
				<p class="text text--label stat-label">Skills live</p>
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
