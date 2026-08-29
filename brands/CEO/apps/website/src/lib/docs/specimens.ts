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
	html: string
}

/* Through the engine's own `renderIcon`, not hand-written SVG — a docs page
   that draws its own markup documents itself rather than the system. */
const icon = (name: string, size = '1rem') => renderIcon(name, icons, { size })

export const specimens: Record<string, Specimen> = {
	btn: {
		html: `<span class="sp-row">
			<button class="btn btn--primary btn--size-md" type="button">Hire your Aven</button>
			<button class="btn btn--accent btn--size-md" type="button">Claim your name</button>
			<button class="btn btn--secondary btn--size-md" type="button">Read the docs</button>
			<button class="btn btn--danger btn--size-md" type="button">Delete account</button>
			<button class="btn btn--primary btn--size-md" type="button" disabled>Unavailable</button>
			<button class="btn btn--unavailable btn--size-md" type="button">Coming soon</button>
		</span>`
	},
	badge: {
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
		html: `<span class="sp-row">
			<span class="avatar avatar--size-sm">SA</span>
			<span class="avatar">SA</span>
			<span class="avatar avatar--size-lg">DJ</span>
			<span class="avatar avatar--size-xl">AC</span>
		</span>`
	},
	spinner: {
		html: `<span class="sp-row">
			<span class="spinner spinner--size-sm" role="status" aria-label="Loading">${icon('spinner', '1em')}</span>
			<span class="spinner" role="status" aria-label="Loading">${icon('spinner', '1em')}</span>
			<span class="spinner spinner--size-lg" role="status" aria-label="Loading">${icon('spinner', '1em')}</span>
		</span>`
	},
	skeleton: {
		html: `<span class="sp-stack sp-stack--wide">
			<span class="skeleton skeleton--shape-text" style="inline-size: 70%"></span>
			<span class="skeleton skeleton--shape-text" style="inline-size: 90%"></span>
			<span class="skeleton skeleton--shape-text" style="inline-size: 45%"></span>
		</span>`
	},
	toast: {
		html: `<span class="toast">
			<span class="toast-icon toast-icon--tone-success">${icon('check', '1.25rem')}</span>
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
		html: `<span class="sp-row">
			<span class="surface surface--raised surface--size-sm">Raised</span>
			<span class="surface surface--sunken surface--size-sm">Sunken</span>
			<span class="surface surface--plain surface--size-sm">Plain</span>
		</span>`
	},
	text: {
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
		html: `<span class="sp-row">
			<a class="nav-link" href="#specimen" aria-current="page">Skills</a>
			<a class="nav-link" href="#specimen">Marketplace</a>
			<a class="nav-link" href="#specimen">Pricing</a>
		</span>`
	},
	step: {
		html: `<span class="sp-stack sp-stack--wide">
			<span class="step">Pick the name</span>
			<span class="step">Meet your aven</span>
			<span class="step">Hand it the inbox</span>
		</span>`
	}
}
