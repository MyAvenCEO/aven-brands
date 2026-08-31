---
name: migrate-design-system
description: "Map this system to or from another one, and keep the crosswalk as a record rather than a one-off translation. Use when: work has to interoperate with Material, HIG, Fluent, Carbon, shadcn, Radix or similar; a system is being adopted or replaced. Do NOT use for: moving call sites off a class this system already replaced. If the migration is internal, from old classes to new units, use migration-plan instead."
invocation: model
---

<!-- GENERATED from skills/aven-brand/skills/migrate-design-system.json — do not edit.
     Edit the JSON and run `node skills/aven-brand/generate.mjs`. -->

# migrate-design-system

Map this system to or from another one, and keep the crosswalk as a record rather than a one-off translation.

## Read first

- `skills/design-systems/interop-protocol.md`
- `skills/design-systems/crosswalk.md`

## Steps

1. Build the crosswalk at the SEMANTIC tier. Primitive-to-primitive mapping produces a palette that resolves and means nothing.
2. Name what has no counterpart. The gaps are the actual finding; the matches are the easy half.
3. Verify contrast after mapping — another system's token that resolves here may not pass here.

## Output

A crosswalk table plus an explicit list of what does not map.

## Gates

Run these and report their real output. A number you did not measure is not a number.

- `skills/gates/validate_tokens.py`
- `skills/gates/validate_contrast.py`

## Done when

- every mapped pair passes contrast in this system
- unmapped concepts are listed rather than quietly dropped
