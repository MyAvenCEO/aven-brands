---
name: redesign
description: "Modernise an existing UI by auditing it first, then delivering every screen in scope — not a sample. Use when: an existing product or page needs to be brought up to standard. Do NOT use for: a single new component. If only one component is in scope, use design-component instead."
invocation: model
---

<!-- GENERATED from skills/aven-brand/skills/redesign.json — do not edit.
     Edit the JSON and run `node skills/aven-brand/generate.mjs`. -->

# redesign

Modernise an existing UI by auditing it first, then delivering every screen in scope — not a sample.

## Read first

- `skills/workflows/redesign-audit.md`
- `skills/taste/design-taste.md`

## Steps

1. Audit before touching anything: what is actually wrong, and which of it is a token problem rather than a screen problem.
2. Fix at the token layer wherever the fault is systemic. A redesign that repaints screens one at a time rebuilds the drift.
3. Deliver every screen in scope. Split only at a clean boundary when length forces it, and continue to completion.
4. Render and look at each one.

## Output

The audit, then the complete redesigned set.

## Gates

Run these and report their real output. A number you did not measure is not a number.

- `skills/gates/accuracy_report.mjs`
- `skills/gates/taste_audit.mjs`
- `skills/gates/slop_tells.mjs`
- `skills/gates/measure_render.mjs`

## Done when

- the count delivered equals the count in scope
- accuracy_report is green
- each screen was screenshotted and inspected, not just generated
