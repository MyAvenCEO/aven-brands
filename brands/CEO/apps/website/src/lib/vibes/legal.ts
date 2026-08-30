/**
 * THE LEGAL DOCUMENTS, AS CONFIGURATION.
 *
 * One builder for every legal page from @myavenceo/aven-ceo — the content
 * was already data; now the markup that renders it is too, built at build
 * time and shipped as HTML. Nothing on a legal page moves, so nothing
 * hydrates.
 *
 * The one modelling decision a template hid: a paragraph here is a SEQUENCE
 * of text runs, links and line breaks, and a ViewNode child is always an
 * element — so each text run rides in a bare `<span>`. A span with no class
 * renders exactly as the text node did; the links keep their underline
 * classes verbatim.
 *
 * Prose lives in block comments only — the utility scanner reads line
 * comments, and one apostrophe in one silently swallows the class
 * candidates (see footer.ts).
 */
import type { LegalBlock, LegalDocument } from '@myavenceo/aven-ceo'
import type { ViewNode } from '@myavenceo/aven-vibes'
import { renderSection } from '$lib/vibes/render'

/** Heading style per source depth — 2 is a chapter, 5 a fine print label. */
const HEADING: Record<number, string> = {
	2: 'mt-12 text-xl font-semibold tracking-tight text-foreground border-b border-border/25 pb-2',
	3: 'mt-8 text-[length:var(--fs-lead)] font-semibold tracking-tight text-foreground',
	4: 'mt-6 text-[length:var(--fs-title)] font-semibold text-foreground',
	5: 'mt-5 text-[length:var(--fs-body)] font-semibold text-foreground-soft'
}

const LINK_CLASS =
	'underline decoration-foreground/30 underline-offset-4 transition-colors hover:decoration-foreground/70'

function isList(block: LegalBlock): block is { items: string[] } {
	return 'items' in block
}

/**
 * The documents link to nothing but bare URLs (the link text IS the URL), so
 * a line splits into text and link parts right here — no inline markup model.
 * A real URL needs a host after the scheme and must end on a word char or
 * slash — so the quoted schemes in the SSL prose („http://“ auf „https://“)
 * and a sentence-ending dot never become links. The regex is re-created per
 * call: split() and test() must not share lastIndex state. The straight
 * quote characters in the excluded set are written as \u0022/\u0027 escapes:
 * a bare quote inside a regex literal reads as a string delimiter to the
 * utility scanner and misaligns every class candidate after it.
 */
function parts(line: string): { text: string; href?: string }[] {
	const url = () => /(https?:\/\/[\w-]+(?:\.[\w-]+)+[^\s„“”\u0022\u0027<>]*[\w/])/g
	return line
		.split(url())
		.filter((part) => part !== '')
		.map((part) => {
			const m = part.match(/^https?:\/\/[\w-]+(?:\.[\w-]+)+/)
			return m ? { text: part, href: part } : { text: part }
		})
}

/** One line as inline nodes: text runs in bare spans, URLs as links. */
function lineNodes(line: string): ViewNode[] {
	return parts(line).map((part) =>
		part.href
			? {
					tag: 'a',
					class: LINK_CLASS,
					attrs: { href: part.href, target: '_blank', rel: 'noopener noreferrer' },
					text: part.text
				}
			: { tag: 'span', text: part.text }
	)
}

function blockNode(block: LegalBlock): ViewNode {
	if (isList(block)) {
		return {
			tag: 'ul',
			class: 'mt-3 space-y-2 text-[length:var(--fs-title)] leading-relaxed text-foreground-soft',
			children: block.items.map(
				(item): ViewNode => ({
					tag: 'li',
					class: 'flex gap-2',
					children: [
						{
							tag: 'span',
							class: 'mt-2.5 size-1.5 shrink-0 rounded-full bg-foreground/25',
							attrs: { 'aria-hidden': 'true' }
						},
						{ tag: 'span', class: 'break-words', children: lineNodes(item) }
					]
				})
			)
		}
	}
	const children: ViewNode[] = []
	if (block.lead) {
		children.push(
			{ tag: 'strong', class: 'font-semibold text-foreground-soft', text: block.lead },
			{ tag: 'br' }
		)
	}
	block.lines.forEach((line, l) => {
		if (l > 0) children.push({ tag: 'br' })
		children.push(...lineNodes(line))
	})
	return {
		tag: 'p',
		class: 'mt-3 text-[length:var(--fs-title)] leading-relaxed text-foreground-soft break-words',
		children
	}
}

function docView(doc: LegalDocument): ViewNode {
	const eyebrow = doc.lang === 'de' ? 'Rechtliches' : 'Legal'
	const body: ViewNode[] = []
	for (const section of doc.sections) {
		if (section.title) {
			const level = section.level ?? 2
			body.push({ tag: `h${level}`, class: HEADING[level], text: section.title })
		}
		for (const block of section.blocks) body.push(blockNode(block))
	}
	return {
		tag: 'section',
		class: 'flex-1 px-5 py-16 sm:px-8 sm:py-20',
		children: [
			{
				tag: 'div',
				class: 'mx-auto max-w-2xl',
				children: [
					{ tag: 'p', class: 'eyebrow', text: eyebrow },
					{ tag: 'h1', class: 'section-title mt-3 sm:text-3xl', text: doc.title },
					...body
				]
			}
		]
	}
}

export function legalDocHtml(doc: LegalDocument): Promise<string> {
	return renderSection(docView(doc))
}

/**
 * The AGB placeholder: deliberately empty and noindex until the binding text
 * exists — a legal page that only looks like one helps nobody. Rendered here
 * so the page shell carries no hand-written markup either.
 */
export function agbPlaceholderView(): ViewNode {
	return {
		tag: 'section',
		class: 'flex-1 px-5 py-16 sm:px-8 sm:py-20',
		children: [
			{
				tag: 'div',
				class: 'mx-auto max-w-2xl',
				children: [
					{ tag: 'p', class: 'eyebrow', text: 'Rechtliches' },
					{
						tag: 'h1',
						class: 'section-title mt-3 sm:text-3xl',
						text: 'Allgemeine Geschäftsbedingungen'
					},
					{
						tag: 'p',
						class: 'mt-3 text-[length:var(--fs-title)] leading-relaxed text-foreground-quiet',
						text: 'Die Bedingungen, unter denen wir liefern.'
					},
					{
						tag: 'div',
						class: 'mt-8 rounded-lg border border-dashed border-quiet/25 bg-surface-sunken/25 p-6',
						children: [
							{
								tag: 'p',
								class:
									'text-[length:var(--fs-micro)] font-semibold uppercase tracking-[var(--tracking-wider)] text-quiet-ink',
								text: 'Platzhalter'
							},
							{
								tag: 'p',
								class: 'mt-2 text-[length:var(--fs-section)] leading-relaxed text-foreground-quiet',
								children: [
									{
										tag: 'span',
										text: 'Hier steht bald der rechtsverbindliche Text. Bis dahin ist diese Seite bewusst leer und auf '
									},
									{ tag: 'span', class: 'font-mono text-[length:var(--fs-body)]', text: 'noindex' },
									{
										tag: 'span',
										text: ' gesetzt — ein Rechtstext, der nur so aussieht, als wäre er einer, hilft niemandem.'
									}
								]
							}
						]
					}
				]
			}
		]
	}
}

export function agbPlaceholderHtml(): Promise<string> {
	return renderSection(agbPlaceholderView())
}
