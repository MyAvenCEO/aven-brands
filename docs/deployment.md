# Static website delivery

The `next` and `production` branches contain reviewed source. They never contain generated
`dist/` files.

On a successful push build, `.github/workflows/publish-site.yml` writes the complete static site to
the corresponding deployment branch:

- `next` -> `deploy/next`
- `production` -> `deploy/production`

Each deployment branch contains only `dist/`. The serving process should:

1. fetch or check out the required deployment branch;
2. verify that `dist/.source-revision` is the expected source commit when a specific revision is
   requested; and
3. atomically switch its document root to that checkout's `dist/` directory.

The serving process does not run Bun, install dependencies, or contact the identity service.

## Branch protection

Protect `main`, `next`, and `production` and require the CI workflow. Do not protect `deploy/next`
or `deploy/production` with a rule that blocks the repository `GITHUB_TOKEN`; only the publishing
workflow writes those branches.

## Package publishing

To publish `@myavenceo/aven-brand` version `0.1.0`, merge the version change first and create the
exact tag `aven-brand-v0.1.0`. The tag workflow compiles ESM and declarations and publishes only the
files selected by the package manifest.

Consumers configure the organization scope and authenticate with a token that can read packages:

```ini
@myavenceo:registry=https://npm.pkg.github.com
```
