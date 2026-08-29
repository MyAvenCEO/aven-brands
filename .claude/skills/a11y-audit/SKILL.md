---
name: a11y-audit
description: "Audit against WCAG 2.2 AA with real measurements — contrast, keyboard, targets, motion, RTL — and name the criterion for every finding. Use when: an accessibility check is asked for; a component is being finished; someone asks whether a colour pair passes. Do NOT use for: choosing which token to use in the first place. If the palette itself is in question, use design-tokens instead."
invocation: model
---

<!-- GENERATED from skills/aven-brand/skills/a11y-audit.json — do not edit.
     Edit the JSON and run `node skills/aven-brand/generate.mjs`. -->

# a11y-audit

Audit against WCAG 2.2 AA with real measurements — contrast, keyboard, targets, motion, RTL — and name the criterion for every finding.

## Read first

- `.claude/rules/accessibility.md`
- `skills/accessibility/wcag-checklist.md`
- `skills/accessibility/aria-patterns.md`
- `skills/accessibility/cognitive.md`
- `skills/accessibility/i18n-rtl.md`
- `skills/accessibility/vision.md`
- `skills/accessibility/wcag-aaa.md`

## Steps

1. Run the P0 checks on every interactive element: reachable by Tab, operable by Enter or Space, a visible focus ring at 3:1, name and role and state announced, target at least 24x24, and nothing carried by colour alone.
2. Measure contrast on the RENDER, not on the tokens — and in every state, because a control that passes at rest can fail on hover through a specificity trap.
3. Prioritise the WCAG 2.2 additions: focus not obscured by sticky chrome, target size, and authentication that does not test memory.
4. Check reduced motion for CONTENT LOSS, not just for stillness. An entrance animation that is the only thing revealing text hides that text from the people who asked for less motion.
5. Name the criterion number, the severity, and the specific fix for every finding.

## Output

Findings as criterion, severity, fix. Real measured ratios, never estimated ones.

## Gates

Run these and report their real output. A number you did not measure is not a number.

- `skills/gates/measure_render.mjs`
- `skills/gates/verify_states.mjs`
- `skills/gates/axe_audit.mjs`
- `skills/gates/verify_keyboard.mjs`
- `skills/gates/verify_target_size.mjs`
- `skills/gates/verify_focustrap.mjs`
- `skills/gates/verify_reduced_motion.mjs`
- `skills/gates/verify_rtl.mjs`
- `skills/gates/contrast.py`

## Done when

- every gate above ran and its output is quoted
- no ratio in the report was reasoned rather than measured
- each finding cites its WCAG criterion
