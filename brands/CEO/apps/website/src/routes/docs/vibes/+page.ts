/**
 * /docs/vibes — the framework docs, rendered from the package that IS the
 * framework.
 *
 * `DOCS` ships inside `@myavenceo/aven-vibes` (the markdown is the package's
 * own SSOT, frozen into a typed module at its build), so this page can never
 * document a version other than the one installed. The load renders every
 * section here, in a UNIVERSAL load on purpose: at prerender this runs in the
 * build and the finished HTML lands in the static file — the docs are
 * readable with JavaScript off, indexed by anything that reads the file, and
 * the page hydrates on top of markup that was already correct.
 *
 * The demo fences come out of `renderMarkdownDoc` as empty
 * `<div data-md-demo="NAME">` mount points. Injecting each demo's
 * string-rendered markup INTO that placeholder here — still at prerender —
 * is the delivery story the docs tell, applied to themselves: content in the
 * file first, `Island.hydrate` attaching behaviour later. Mounting the demos
 * client-side only would make the docs' own examples contradict the section
 * they illustrate.
 */
import { DOCS, renderMarkdownDoc, type TocEntry } from '@myavenceo/aven-vibes'
import { DEMO_BUNDLES, renderDemoHtml } from '$lib/docs/vibes-demos'

export const prerender = true

export type RenderedSection = {
	slug: string
	title: string
	summary: string
	html: string
	toc: TocEntry[]
}

export async function load(): Promise<{ sections: RenderedSection[] }> {
	const sections: RenderedSection[] = []
	for (const doc of DOCS) {
		const rendered = await renderMarkdownDoc(doc.body)
		let html = rendered.html
		for (const name of Object.keys(DEMO_BUNDLES)) {
			const placeholder = `<div data-md-demo="${name}"></div>`
			if (!html.includes(placeholder)) continue
			const staticHtml = await renderDemoHtml(name)
			html = html.replace(placeholder, `<div data-md-demo="${name}">${staticHtml}</div>`)
		}
		sections.push({
			slug: doc.slug,
			title: doc.title,
			summary: doc.summary,
			html,
			toc: rendered.toc
		})
	}
	return { sections }
}
