---
name: apply-aesthetic
description: "Resolve a look, a vibe or a named design system into this project's tokens, then re-verify contrast. Use when: a visual direction is named — a brand feel, an archetype, a reference system. Do NOT use for: building a whole brand foundation from nothing. If there is no token system yet, use brandkit instead."
invocation: model
---

<!-- GENERATED from skills/aven-brand/skills/apply-aesthetic.json — do not edit.
     Edit the JSON and run `node skills/aven-brand/generate.mjs`. -->

# apply-aesthetic

Resolve a look, a vibe or a named design system into this project's tokens, then re-verify contrast.

## Read first

- `skills/taste/aesthetic-systems.md`
- `skills/taste/design-taste.md`
- `skills/taste/motion-choreography.md`

## Steps

1. Pick the archetype or named system and resolve it into TOKENS. A direction that lives at call sites is not a direction, it is decoration.
2. Taste serves aesthetics, which is the fourth priority. It never overrides user needs, accessibility or consistency. A brand colour that fails contrast gets adjusted; taste does not win over POUR.
3. Re-run contrast after applying anything. This is the step that gets skipped.
4. Check the anti-slop tells: one radius everywhere, a default flat shadow, an indigo-to-blue gradient, pure black text, flat spacing, near-duplicate neutrals.

## Output

Token overrides plus the reasoning for each, not a list of hexes.

## Gates

Run these and report their real output. A number you did not measure is not a number.

- `skills/gates/design_systems.py`
- `skills/gates/validate_contrast.py`
- `skills/gates/slop_tells.mjs`
- `skills/gates/taste_audit.mjs`

## Done when

- validate_contrast passes in both themes AFTER the direction is applied
- slop_tells reports no HIGH finding
- every value landed in a token, none at a call site
