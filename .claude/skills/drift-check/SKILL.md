---
name: drift-check
description: "Sweep a system in use for divergence from its own intent, classify why each instance happened, and route it to the skill that resolves it. Use when: a system has been in use and nobody knows how far it has moved; hardcoded values, local re-implementations or stale versions are suspected; two products that share a system no longer look like they do. Do NOT use for: comparing ONE component against ONE spec; auditing a token file's structure. If one component against its spec, use design-component instead. If the token architecture itself, use design-tokens instead."
invocation: model
---

<!-- GENERATED from skills/aven-brand/skills/drift-check.json — do not edit.
     Edit the JSON and run `node skills/aven-brand/generate.mjs`. -->

# drift-check

Sweep a system in use for divergence from its own intent, classify why each instance happened, and route it to the skill that resolves it.

## Read first

- `skills/aven-brand/knowledge/drift.md`
- `skills/design-systems/interop-protocol.md`

## Steps

1. Name the reference point first. Drift is always relative to something, and if there is no single source of truth, THAT is the top finding.
2. Sweep four dimensions: visual (spacing, colour, radius), behavioural (states, focus, motion), API (prop names and semantics), and token (raw values where a token belongs, or the wrong tier).
3. Measure it. lint_hardcodes finds raw values, validate_theme_refs finds references to tokens that no longer exist, lint_intent finds a destructive action wearing the primary colour. A drift report assembled by reading is a drift report of what you happened to open.
4. Classify every instance, because the response depends on WHY: a deliberate documented exception, version lag, accidental divergence, a misreading of the docs, or a gap where the system did not have what was needed.
5. Weight severity by where it sits. The same drift on a checkout control and on a layout wrapper are not the same finding.
6. Route each one: an exception becomes a decision record, version lag becomes a migration plan, accidental drift gets fixed AND the doc that failed to prevent it gets reviewed, a misreading is a documentation gap, a system gap is a contribution.
7. Then step back and name the ROOT PATTERNS. Individual findings get fixed; a root cause stops the next fifty.

## Output

A findings table with location, dimension, classification, severity and action; then the classification groups; then the root patterns.

## Gates

Run these and report their real output. A number you did not measure is not a number.

- `skills/gates/lint_hardcodes.py`
- `skills/gates/validate_theme_refs.py`
- `skills/gates/lint_intent.mjs`
- `skills/gates/measure_render.mjs`
- `skills/gates/slop_tells.mjs`

## Done when

- every finding carries a classification and a named next skill, not just a description
- the numbers came from gates that were run, and their output is quoted
- system gaps are distinguished from mistakes — a team that worked around a real gap did not do something wrong
- the root-pattern section says something the findings list does not

## Absorbed

Merged in from `design-system-ops`: `drift-detection`, `design-to-code-check`, `naming-audit`.
