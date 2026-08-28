# aven-brands

Every brand the company renders, and the one kit that renders them.

```
packages/aven-ceo         a brand: avenCEO, plus its pricing, skills and legal
packages/aven-yma         a brand: avenYMA
apps/website              avenCEO's marketing site
apps/yma                  avenYMA's site
```

## What a brand is

One interface, `Brand`, in `@myavenceo/aven-vibes/brand`: colours, roles,
scales, primitives, components. A brand is DATA. The generator, the utility
layer, the class scanner and the Vite step are written against that type and
know nothing about any particular brand. They live in avenVIBES, beside the
runtime — a brand's guideline page IS a `ViewDef`, so the two halves belong in
one package rather than in two that cannot name each other's types.

That split is newer than it looks, and it exists because it had to. The
generator used to import avenCEO's palette directly — invisible while there was
one brand, and the whole problem the moment there were two, because the second
would have rendered in the first one's colours.

Adding a brand is one file:

```ts
export const avenXyz: Brand = { name: 'avenXYZ', slug: 'aven-xyz', tones, … }
```

and it gets the entire pipeline: a theme, a component layer, a utility layer
generated from its own scales, and a build step that FAILS on a class that would
render unstyled.

## What a surface does

```ts
// vite.config.ts
import { avenUtilities } from '@myavenceo/aven-yma/vite'
plugins: [avenUtilities({ content: ['src'] }), sveltekit()]
```

```css
/* app.css */
@import "./brand-theme.css";
@import "./brand-components.css";
@aven-utilities;
```

Nothing else. No Tailwind, no config file, no theme block.

## Working on it

```sh
bun install
bun run build:packages     # build both brands, regenerate every CSS file
bun run dev                # avenCEO's site
bun run dev:yma            # avenYMA's site
bun run test
```

Generated CSS is COMMITTED. That is the guarantee: if a hex is edited anywhere
but a brand definition, regenerating restores it and `git status` goes dirty, so
drift fails a check instead of shipping.

## Publishing

Tag `<package>-v<version>`, e.g. `aven-yma-v0.1.0`. One workflow handles every
package; the tag names which.
