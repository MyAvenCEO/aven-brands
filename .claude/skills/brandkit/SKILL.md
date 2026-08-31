---
name: brandkit
description: "Build a brand foundation from nothing: palette, type, scale, and a theme that passes WCAG in both modes before any screen is drawn. Use when: a new brand or product has no design system at all. Do NOT use for: extending a system that exists. If tokens already exist, use design-tokens instead."
invocation: model
---

<!-- GENERATED from skills/aven-brand/skills/brandkit.json — do not edit.
     Edit the JSON and run `node skills/aven-brand/generate.mjs`. -->

# brandkit

Build a brand foundation from nothing: palette, type, scale, and a theme that passes WCAG in both modes before any screen is drawn.

## Read first

- `.claude/rules/tokens-and-color.md`
- `skills/taste/aesthetic-systems.md`

## Steps

1. Establish the brand hue and generate the OKLCH ladder before anything else.
2. Name the ROLES, not the tones. A role that means 'the second brand colour' points at one place so that every use of it moves together.
3. Prove the seeded theme passes WCAG light AND dark before a single screen is built. A foundation that fails contrast fails every screen built on it.
4. Set the type scale, the 4px spacing rhythm, and the radius scale.

## Output

A complete token source plus the generated theme layer.

## Gates

Run these and report their real output. A number you did not measure is not a number.

- `skills/gates/validate_contrast.py`
- `skills/gates/validate_tokens.py`
- `skills/gates/validate_template.py`
- `skills/gates/build_tokens.mjs`

## Done when

- validate_contrast passes light and dark on the seeded theme
- every semantic role resolves to a primitive, none to a literal
