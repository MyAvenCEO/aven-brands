---
name: critique
description: "Argue for rejecting the work: render it, find what is actually wrong, and cite evidence per finding. Use when: someone asks whether the work is any good; the gates are green and it still looks generated; a taste verdict is wanted. Do NOT use for: scoring a design on the standard rubric. If a scored review is wanted, use design-review instead."
invocation: model
---

<!-- GENERATED from skills/aven-brand/skills/critique.json — do not edit.
     Edit the JSON and run `node skills/aven-brand/generate.mjs`. -->

# critique

Argue for rejecting the work: render it, find what is actually wrong, and cite evidence per finding.

## Read first

- `skills/taste/design-taste.md`
- `skills/taste/aesthetic-systems.md`
- `.claude/rules/components.md`

## Steps

1. RENDER IT FIRST. A critique from source is a critique of what you imagined the source produces.
2. Argue for rejection. The default posture is that this ships and nobody looks again, so the useful question is what a hostile reader would say.
3. Cite evidence per finding: a screenshot, a measured value, a gate line. An unevidenced taste claim is an opinion with a job title.
4. Check the composition decisions no gate can see: whether one thing leads, whether display type is a different size rather than a bolder body, whether the empty state owns its viewport, whether the page ends on purpose.
5. Click every control that declares a state and confirm the state changed. A sort header that draws a chevron and sorts nothing passes every gate.
6. Say plainly which findings are taste and which are defects. Conflating them lets someone dismiss the defects along with the taste.

## Output

Findings with evidence, split into defects and taste.

## Gates

Run these and report their real output. A number you did not measure is not a number.

- `skills/gates/taste_audit.mjs`
- `skills/gates/slop_tells.mjs`
- `skills/gates/measure_render.mjs`
- `skills/gates/verify_interactive.mjs`

## Done when

- the work was rendered and screenshotted, not read
- every finding cites something
- defects and taste are separated
