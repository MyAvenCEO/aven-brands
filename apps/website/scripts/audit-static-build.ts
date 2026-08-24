import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'

type DeploymentEnvironment = 'next' | 'production'

const environment = process.argv[2] as DeploymentEnvironment | undefined
if (environment !== 'next' && environment !== 'production') {
	console.error('usage: audit-static-build.ts next|production')
	process.exit(2)
}

const websiteRoot = path.resolve(import.meta.dir, '..')
const buildRoot = path.join(websiteRoot, 'dist')
const expectedSiteOrigin = environment === 'next' ? 'https://next.aven.ceo' : 'https://aven.ceo'
const expectedIdentityOrigin =
	environment === 'next' ? 'https://id.next.aven.ceo' : 'https://id.aven.ceo'
const forbiddenOrigins =
	environment === 'next'
		? ['https://aven.ceo', 'https://id.aven.ceo']
		: ['https://next.aven.ceo', 'https://id.next.aven.ceo']

function filesBelow(directory: string): string[] {
	return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
		const absolute = path.join(directory, entry.name)
		return entry.isDirectory() ? filesBelow(absolute) : [absolute]
	})
}

function internalTargetExists(url: URL): boolean {
	let pathname: string
	try {
		pathname = decodeURIComponent(url.pathname)
	} catch {
		return false
	}
	const relative = pathname.replace(/^\/+/, '')
	const candidates = pathname.endsWith('/')
		? [path.join(buildRoot, relative, 'index.html')]
		: [
				path.join(buildRoot, relative),
				path.join(buildRoot, relative, 'index.html'),
				path.join(buildRoot, `${relative}.html`)
			]
	return candidates.some((candidate) => existsSync(candidate) && statSync(candidate).isFile())
}

if (!existsSync(path.join(buildRoot, 'index.html'))) {
	console.error(`missing static build at ${buildRoot}`)
	process.exit(1)
}

const allFiles = filesBelow(buildRoot)
const htmlFiles = allFiles.filter((file) => file.endsWith('.html'))
const searchableFiles = allFiles.filter((file) => /\.(?:html|js|json)$/.test(file))
const failures: string[] = []
const externalOrigins = new Set<string>()
let anchorCount = 0
let identityLinkCount = 0

for (const file of searchableFiles) {
	const content = readFileSync(file, 'utf8')
	for (const forbidden of forbiddenOrigins) {
		if (content.includes(forbidden)) {
			failures.push(`${path.relative(buildRoot, file)} contains forbidden origin ${forbidden}`)
		}
	}
}

for (const file of htmlFiles) {
	const content = readFileSync(file, 'utf8')
	const anchorPattern = /<a\b[^>]*\bhref="([^"]*)"/g
	for (const match of content.matchAll(anchorPattern)) {
		const href = match[1]?.replaceAll('&amp;', '&') ?? ''
		anchorCount += 1
		if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
			continue
		}

		let target: URL
		try {
			target = new URL(href, `${expectedSiteOrigin}/`)
		} catch {
			failures.push(`${path.relative(buildRoot, file)} has invalid href ${JSON.stringify(href)}`)
			continue
		}

		if (target.origin === expectedSiteOrigin) {
			if (!internalTargetExists(target)) {
				failures.push(
					`${path.relative(buildRoot, file)} links to missing internal target ${target.pathname}`
				)
			}
			continue
		}

		if (target.origin === expectedIdentityOrigin) {
			identityLinkCount += 1
			continue
		}

		if (target.protocol === 'http:' || target.protocol === 'https:') {
			externalOrigins.add(target.origin)
		}
	}
}

if (identityLinkCount === 0) failures.push(`no links target ${expectedIdentityOrigin}`)

if (failures.length > 0) {
	for (const failure of failures) console.error(`- ${failure}`)
	console.error(`static ${environment} link audit failed with ${failures.length} problem(s)`)
	process.exit(1)
}

console.log(
	`static ${environment} link audit passed: ${htmlFiles.length} HTML files, ${anchorCount} anchors, ${identityLinkCount} identity links`
)
console.log(`external origins: ${[...externalOrigins].sort().join(', ')}`)
