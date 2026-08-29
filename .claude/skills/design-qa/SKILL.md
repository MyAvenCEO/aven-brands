---
name: design-qa
description: "Stand up the gates that stop quality regressing, and run them — the fast ones on every commit, the slow ones per release. Use when: CI gates are being set up; a change needs checking before it merges; a regression got through and should not have. Do NOT use for: auditing one component's accessibility by hand. If the work is one component's a11y, use a11y-audit instead."
invocation: model
---

<!-- GENERATED from skills/aven-brand/skills/design-qa.json — do not edit.
     Edit the JSON and run `node skills/aven-brand/generate.mjs`. -->

# design-qa

Stand up the gates that stop quality regressing, and run them — the fast ones on every commit, the slow ones per release.

## Read first

- `skills/workflows/design-qa.md`
- `skills/aven-brand/knowledge/gate-discipline.md`

## Steps

1. Fast gates on every commit: token resolution, contrast on the source, no raw hex or px or timing, no dangling var(), no emoji.
2. Automated a11y over each component's STATES, not just its resting look. Zero serious or critical to merge.
3. The real-render contrast gate, because a static token check cannot see a specificity trap or an alpha composite.
4. Visual regression across variants, sizes, states, both themes, key breakpoints and RTL — with animation frozen and data deterministic.
5. Manual accessibility sign-off per release: keyboard, screen reader, 400% reflow, 200% text spacing, reduced motion, forced colours.
6. A gate that has only ever seen passing input proves nothing. Point each new gate at a deliberate defect and confirm it fails.

## Output

The wired gates, plus the actual output of running them.

## Gates

Run these and report their real output. A number you did not measure is not a number.

- `skills/gates/accuracy_report.mjs`
- `skills/gates/validate_tokens.py`
- `skills/gates/validate_contrast.py`
- `skills/gates/lint_hardcodes.py`
- `skills/gates/validate_theme_refs.py`
- `skills/gates/axe_audit.mjs`
- `skills/gates/measure_render.mjs`
- `skills/gates/verify_states.mjs`
- `skills/gates/check_no_emoji.py`

## Done when

- an unreviewed change cannot introduce a dangling alias, a contrast failure, a raw hex or an axe violation
- snapshots cover dark mode and RTL and the semantic-changing states
- each new gate was proven to fail on a defect

## Absorbed

Merged in from `design-system-ops`: `cicd-integration`, `schema-validator`.
