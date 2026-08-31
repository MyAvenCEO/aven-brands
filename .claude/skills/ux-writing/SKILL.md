---
name: ux-writing
description: "Write or review interface copy: frontload the verb, say what happened and how to fix it, and never let an empty state say 'No data'. Use when: labels, errors, empty states or microcopy need writing or reviewing. Do NOT use for: explaining the system to stakeholders. If the audience is outside the product, use stakeholder-brief instead."
invocation: model
---

<!-- GENERATED from skills/aven-brand/skills/ux-writing.json — do not edit.
     Edit the JSON and run `node skills/aven-brand/generate.mjs`. -->

# ux-writing

Write or review interface copy: frontload the verb, say what happened and how to fix it, and never let an empty state say 'No data'.

## Read first

- `skills/content/voice-tone.md`

## Steps

1. Frontload the verb. 'Save changes', not 'Click here to save your changes'.
2. An error says what happened, why, and how to fix it. 'Error: Invalid input' does none of the three.
3. An empty state explains the value and points at the first action.
4. A control names exactly what will happen, and the confirmation uses the same word back.
5. No emoji. Not as a bullet, not as a status dot, not as tone.

## Output

The copy, plus what each line replaced and why.

## Gates

Run these and report their real output. A number you did not measure is not a number.

- `skills/gates/check_no_emoji.py`

## Done when

- check_no_emoji passes
- every error names a recovery
- no empty state says 'No data' or equivalent
