---
name: design-tokens
description: "Generate, extend or audit DTCG tokens across the three tiers, and prove every alias resolves and every required pair passes WCAG. Use when: a new palette, scale, or theme is needed; an existing token file has to grow a tier or a mode; someone asks whether a token is used at the right tier. Do NOT use for: turning tokens into CSS/Swift/Compose output; checking a rendered page's contrast. If tokens need to become platform artefacts, use token-build instead. If the question is about a page that already renders, use a11y-audit instead."
invocation: model
---

<!-- GENERATED from skills/aven-brand/skills/design-tokens.json — do not edit.
     Edit the JSON and run `node skills/aven-brand/generate.mjs`. -->

# design-tokens

Generate, extend or audit DTCG tokens across the three tiers, and prove every alias resolves and every required pair passes WCAG.

## Read first

- `.claude/rules/tokens-and-color.md`
- `.claude/rules/typography-and-spacing.md`

## Steps

1. Read the token rules: three tiers, 4px base, Major Third scale, OKLCH palette generation, dark mode swapped at the SEMANTIC layer only.
2. Read the existing token files before adding to them, so the new work matches the structure rather than starting a second one beside it.
3. Primitives are raw values and are never referenced from a component. Semantic tokens are purposes. Component tokens are scoped to one component.
4. For a new palette: generate 11 OKLCH shades, then VERIFY 500 clears 4.5:1 on white for text and 600 clears 3:1 for UI. Do not assert either from the numbers.
5. Pick by INTENT. A destructive action takes the destructive token everywhere it appears, trigger and confirm dialog alike. A blue Delete is a bug, not a variation.
6. Run validate_tokens.py for alias resolution and validate_contrast.py for the required pairs in BOTH themes.

## Output

DTCG JSON with $type/$value/$description preserved on every token.

## Gates

Run these and report their real output. A number you did not measure is not a number.

- `skills/gates/validate_tokens.py`
- `skills/gates/validate_contrast.py`
- `skills/gates/contrast.py`

## Done when

- validate_tokens.py resolves every alias
- validate_contrast.py passes light AND dark on the required pairs
- no raw value appears in a semantic or component token

## Absorbed

Merged in from `design-system-ops`: `token-audit`, `token-compliance`, `theme-audit`.
