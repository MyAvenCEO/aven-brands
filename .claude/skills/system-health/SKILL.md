---
name: system-health
description: "Score a system in use across coverage, adoption, accessibility, drift and documentation, and say which single number to move next. Use when: someone asks how the design system is doing; a quarterly or periodic check is due; a system needs a baseline before investment. Do NOT use for: reviewing one design. If the subject is one screen or component, use design-review instead."
invocation: model
---

<!-- GENERATED from skills/aven-brand/skills/system-health.json — do not edit.
     Edit the JSON and run `node skills/aven-brand/generate.mjs`. -->

# system-health

Score a system in use across coverage, adoption, accessibility, drift and documentation, and say which single number to move next.

## Read first

- `skills/aven-brand/knowledge/measurement.md`

## Steps

1. Measure five things and refuse to estimate any of them: component coverage, adoption, accessibility, drift, and documentation coverage.
2. Every number is a count with a denominator. '80% adopted' with no denominator is a feeling.
3. Compare against the last run if there is one. A single reading says almost nothing; a trend says whether the investment is working.
4. Name ONE number to move next, with the reason. A dashboard where everything is a priority sets no priority.

## Output

The scored dimensions with counts and denominators, the trend if available, and the one number to move.

## Gates

Run these and report their real output. A number you did not measure is not a number.

- `skills/gates/accuracy_report.mjs`
- `skills/gates/lint_hardcodes.py`
- `skills/gates/axe_audit.mjs`
- `skills/gates/measure_render.mjs`
- `skills/gates/validate_tokens.py`

## Done when

- every score is a measured count over a stated denominator
- no number was reasoned rather than counted
- exactly one next priority is named

## Absorbed

Merged in from `design-system-ops`: `system-benchmark`, `full-system-diagnostic`, `adoption-report`.
