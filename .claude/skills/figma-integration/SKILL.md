---
name: figma-integration
description: "Keep Figma Variables and code tokens in sync in one direction, and check component parity across the boundary. Use when: Figma and code need to agree on tokens or components. Do NOT use for: auditing the token architecture itself. If the tiers or values are the problem, use design-tokens instead."
invocation: model
---

<!-- GENERATED from skills/aven-brand/skills/figma-integration.json — do not edit.
     Edit the JSON and run `node skills/aven-brand/generate.mjs`. -->

# figma-integration

Keep Figma Variables and code tokens in sync in one direction, and check component parity across the boundary.

## Read first

- `skills/workflows/figma-integration.md`
- `skills/aven-brand/knowledge/integrations.md`

## Steps

1. Pick ONE direction of truth and write it down. Two-way sync with no declared winner produces a system where neither side can be trusted.
2. Map collections and modes to tiers and themes, not file-by-file.
3. Check parity per component: same variants, same states, same names. A name that differs across the boundary is a translation everyone has to do forever.

## Output

The sync mapping, the direction of truth, and a parity table.

## Gates

Run these and report their real output. A number you did not measure is not a number.

- `skills/gates/validate_tokens.py`

## Done when

- the direction of truth is stated
- every mismatch is listed, not silently reconciled

## Absorbed

Merged in from `design-system-ops`: `figma-variable-audit`.
