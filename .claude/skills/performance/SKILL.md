---
name: performance
description: "Hold Core Web Vitals to a budget: what loads, what shifts, and what animates. Use when: a page is slow, janky, or shifting; a performance budget is being set. Do NOT use for: a component's visual quality. If the problem is how it looks, use design-review instead."
invocation: model
---

<!-- GENERATED from skills/aven-brand/skills/performance.json — do not edit.
     Edit the JSON and run `node skills/aven-brand/generate.mjs`. -->

# performance

Hold Core Web Vitals to a budget: what loads, what shifts, and what animates.

## Read first

- `skills/workflows/performance.md`

## Steps

1. Budget LCP, INP and CLS as numbers before optimising anything.
2. Layout shift is usually a missing dimension, not a slow network. Reserve the box.
3. Animate transform and opacity. Anything else asks the browser to lay out sixty times a second.
4. Measure before and after. An optimisation with no measurement is a guess with extra steps.

## Output

The budget, the measurement, and the change with its effect.

## Gates

Run these and report their real output. A number you did not measure is not a number.

- `skills/gates/measure_render.mjs`

## Done when

- before and after numbers exist for every claimed improvement
