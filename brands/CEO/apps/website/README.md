# aven-website — the avenCEO marketing site

The public site: landing, skills marketplace (`/skills`, per publisher and
slug), pricing, waitlist. Recovered from history (it was stripped in board
0121 "strip avenOS to the avenCITY seed") because the content — the avenCEO
positioning and the seven skill pages — is worth keeping alive.

## Running it

A dev server of its own, deliberately: the Tauri app ships no server at all,
and the two must never share a port.

```bash
bun run dev     # from the repository root; http://localhost:1421
```

The app is unaffected and keeps 1420 (`bun run dev:app`), so both can run
side by side. Nothing here is bundled into the app.

## Notes

- Content lives as JSON in `src/lib/skills/content/{de,en}` with publisher
  profiles in `src/lib/skills/publishers/{de,en}`; adding a skill is adding
  two JSON files.
- Static site: `adapter-static` prerenders every route (`trailingSlash: 'always'`
  → `<route>/index.html`). No server endpoints — query params are read in the
  browser only. The repository's environment build commands write the complete
  site to `dist/` and audit every internal link.
- Pushes to `next` and `production` publish `dist/` to `deploy/next` and
  `deploy/production`, respectively. See the root README and `docs/deployment.md`.
- Brand spelling is `avenCEO` — lowercase `aven`, like `avenOS`.
