---
name: docs-coverage
description: "Find which components ship without the documentation someone would need to use them correctly, and rank the gaps by how much the component is used. Use when: components exist but nobody knows how to use them right; the same question keeps being asked about the same component; documentation completeness needs measuring. Do NOT use for: writing the copy inside the product. If the copy is in the UI, use ux-writing instead."
invocation: model
---

<!-- GENERATED from skills/aven-brand/skills/docs-coverage.json — do not edit.
     Edit the JSON and run `node skills/aven-brand/generate.mjs`. -->

# docs-coverage

Find which components ship without the documentation someone would need to use them correctly, and rank the gaps by how much the component is used.

## Read first

- `skills/aven-brand/knowledge/measurement.md`
- `skills/workflows/design-to-code.md`

## Steps

1. Set the bar: a documented component has an anatomy, its variants, ALL of its states, its token mapping, its ARIA pattern and keyboard model, its edge cases, and at least one example of when NOT to use it.
2. Measure every component against that bar rather than sampling — sampling finds the components you already thought about.
3. Rank the gaps by usage. An undocumented component with forty call sites outranks a documented one with two.
4. The state and the edge-case rows are the ones that are actually missing. Anatomy is almost always written; 'what happens when this is empty' almost never is.

## Output

A per-component coverage table plus the gaps ranked by usage.

## Gates

Run these and report their real output. A number you did not measure is not a number.

- `skills/gates/validate_component_spec.py`

## Done when

- every component was measured, not a sample
- the ranking is by usage count, and the counts are real
