# avenCEO website workspace

This repository owns the public Svelte website and the small domain packages it consumes:

- `apps/website` — the fully prerendered SvelteKit site;
- `packages/aven-brand` — company, legal, pricing, and website-host facts; and
- `packages/aven-skills` — the public skill catalog.

## Development

Install the locked workspace and run the site:

```sh
bun install --frozen-lockfile
bun run dev
```

Build either environment into `apps/website/dist`:

```sh
bun run build:next
bun run build:production
```

Both builds run the static route and environment-link audit.

## Branch and artifact contract

`next` and `production` are source branches. A successful push build publishes the complete
`dist/` directory to a separate deployment branch:

| Source branch | Deployment branch | Identity links |
| --- | --- | --- |
| `next` | `deploy/next` | `https://id.next.aven.ceo` |
| `production` | `deploy/production` | `https://id.aven.ceo` |

The deployment branches contain only `dist/`. `dist/.source-revision` identifies the exact source
commit. A serving process checks out the matching deployment branch and serves `dist/` directly.

## Packages

`@myavenceo/aven-brand` is compiled to JavaScript and declarations and published to GitHub
Packages only from an explicit `aven-brand-v<version>` tag. The tag version must exactly match the
package version. `@myavenceo/aven-skills` is built in the workspace but is not published yet.
