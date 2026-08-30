/**
 * Did the page actually load?
 *
 * Every render gate here navigates and then measures. None of them asked
 * whether the navigation SUCCEEDED, so a dev server returning 500 was measured
 * like any other page — and a SvelteKit error page is a heading, two
 * paragraphs and no controls, which passes a contrast gate, a target-size gate,
 * a keyboard gate and a responsive gate without a single finding.
 *
 * That is the worst failure mode a gate has. A red gate gets fixed; a green one
 * on a broken page gets believed, and it reported "all 2 text element(s) meet
 * WCAG AA" for a full marketing site while the site was down.
 *
 * `file://` navigations report a null response in Chromium — no HTTP status
 * exists — so only served pages are checked, which is exactly where the
 * question is meaningful.
 */
export function assertServed(response, target) {
	if (!response) return response // file://, or a same-document navigation
	const status = response.status()
	if (status >= 400) {
		console.log(`\nFAIL ${target}`)
		console.log(`  x the server returned HTTP ${status} — there is nothing here to measure.`)
		console.log('  A gate that scores an error page reports green on a broken build.')
		process.exit(1)
	}
	return response
}
