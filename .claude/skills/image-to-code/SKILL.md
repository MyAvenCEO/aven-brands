---
name: image-to-code
description: "Turn a screenshot or mockup into code that matches it, and measure the match rather than eyeballing it. Use when: a reference image has to become working UI. Do NOT use for: applying a general aesthetic direction. If there is no reference image, use apply-aesthetic instead."
invocation: model
---

<!-- GENERATED from skills/aven-brand/skills/image-to-code.json — do not edit.
     Edit the JSON and run `node skills/aven-brand/generate.mjs`. -->

# image-to-code

Turn a screenshot or mockup into code that matches it, and measure the match rather than eyeballing it.

## Read first

- `skills/taste/design-taste.md`

## Steps

1. Extract the SYSTEM from the image first — the scale, the rhythm, the palette — then build from that. Building pixel by pixel produces a screen that cannot take a second one.
2. Every extracted value becomes a token.
3. Render and compare. 'It looks close' is not a measurement.
4. Contrast is checked on YOUR render, not assumed from the reference — the reference may well fail.

## Output

Tokens extracted, then the code.

## Gates

Run these and report their real output. A number you did not measure is not a number.

- `skills/gates/measure_render.mjs`
- `skills/gates/taste_audit.mjs`
- `skills/gates/verify_responsive.mjs`
- `skills/gates/slop_tells.mjs`

## Done when

- measure_render passes on the output
- the values live in tokens, not at call sites
