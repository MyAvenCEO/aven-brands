---
name: design-component
description: "Design or build one component or screen: anatomy, variants, all eight states, token mapping, ARIA — then render it and click it. Use when: a component or screen has to be designed or built; an existing component needs a variant, a size, or a missing state; a spec is needed before code. Do NOT use for: emitting the code for a specific framework; reviewing something already built. If the target stack matters, use design-code instead. If the work is judging existing UI, use design-review instead."
invocation: model
---

<!-- GENERATED from skills/aven-brand/skills/design-component.json — do not edit.
     Edit the JSON and run `node skills/aven-brand/generate.mjs`. -->

# design-component

Design or build one component or screen: anatomy, variants, all eight states, token mapping, ARIA — then render it and click it.

## Read first

- `.claude/rules/components.md`
- `.claude/rules/accessibility.md`
- `.claude/rules/tokens-and-color.md`

## Steps

1. Composition first, before anything is styled: one thing leads, display type is at least 2.5x body, an empty state owns its viewport, the page ends on purpose.
2. Anatomy, then variants, then all eight states. Loading is not disabled — a dimmed control says 'you cannot', not 'this is happening'.
3. Map every value to a token. Zero raw hex, px or timing.
4. Write the ARIA pattern and the keyboard model BEFORE the CSS, not after.
5. RENDER IT AND LOOK. The gates pass while a checkbox will not toggle and a dash sits at the bottom of its box. Screenshot every state with transitions off, then CLICK each control and assert the state actually changed.
6. Run the gates. Report the real N/N line.

## Output

Anatomy diagram, variants table, states table, token mapping, a11y notes, and working code.

## Gates

Run these and report their real output. A number you did not measure is not a number.

- `skills/gates/validate_component_spec.py`
- `skills/gates/measure_render.mjs`
- `skills/gates/verify_states.mjs`
- `skills/gates/verify_responsive.mjs`
- `skills/gates/verify_target_size.mjs`
- `skills/gates/verify_keyboard.mjs`
- `skills/gates/verify_interactive.mjs`
- `skills/gates/verify_overflow.mjs`
- `skills/gates/verify_reduced_motion.mjs`
- `skills/gates/axe_audit.mjs`
- `skills/gates/lint_hardcodes.py`
- `skills/gates/check_no_emoji.py`

## Done when

- every gate above printed OK
- a screenshot exists for each state and each was reached by an actual interaction
- a control that declares aria-pressed/expanded/sorted/checked was clicked and something changed

## Absorbed

Merged in from `design-system-ops`: `component-audit`, `component-api-validator`, `accessibility-per-component`, `component-decision-tree`.
