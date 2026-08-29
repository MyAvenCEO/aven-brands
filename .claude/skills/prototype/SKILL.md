---
name: prototype
description: "Prototype at the right fidelity and validate at each level instead of skipping to pixels. Use when: a flow, wireframe or clickable prototype is wanted; a design needs testing with users. Do NOT use for: production code. If the output is shipping code, use design-code instead."
invocation: model
---

<!-- GENERATED from skills/aven-brand/skills/prototype.json — do not edit.
     Edit the JSON and run `node skills/aven-brand/generate.mjs`. -->

# prototype

Prototype at the right fidelity and validate at each level instead of skipping to pixels.

## Read first

- `skills/workflows/prototyping.md`
- `.claude/rules/review-and-research.md`

## Steps

1. Pick the fidelity the QUESTION needs. Content outline answers information needs; a high-fi mockup answers none of them and costs eight hours.
2. Do not skip levels. Each one validates something the next assumes.
3. Map the flow with its decision points, its error paths and its edge cases — a happy path is not a flow.
4. Five users catches most of it. Write the task, not the instruction.

## Output

The artefact at the named fidelity, plus what it will be used to validate.

## Gates

Run these and report their real output. A number you did not measure is not a number.

- `skills/gates/verify_responsive.mjs`
- `skills/gates/verify_keyboard.mjs`

## Done when

- the fidelity matches the question being asked
- error and edge paths are drawn, not just the happy path
