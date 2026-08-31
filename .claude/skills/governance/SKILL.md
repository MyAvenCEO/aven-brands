---
name: governance
description: "Version, contribute, deprecate and announce a change, so a system in use can move without breaking the people on it. Use when: a breaking change is being considered; a component should be added or promoted; something needs deprecating; a contribution has arrived. Do NOT use for: writing the release note itself; choosing the version number for one specific change. If the announcement is the work, use change-communication instead. If the question is only which number to bump, use version-bump-advisor instead."
invocation: model
---

<!-- GENERATED from skills/aven-brand/skills/governance.json — do not edit.
     Edit the JSON and run `node skills/aven-brand/generate.mjs`. -->

# governance

Version, contribute, deprecate and announce a change, so a system in use can move without breaking the people on it.

## Read first

- `skills/workflows/governance.md`

## Steps

1. Version by CONSUMER impact, not by effort. Renaming a token is major however small the diff.
2. A deprecation has three parts and needs all three: the replacement, the migration path, and the date it goes. Two of the three is an announcement, not a deprecation.
3. Promote from a product to the system only on the THIRD independent need. Two is a coincidence.
4. Record the decision where the next person will look for it.

## Output

The version decision with its reasoning, plus the deprecation or promotion record.

## Gates

Run these and report their real output. A number you did not measure is not a number.

- `skills/gates/validate_tokens.py`
- `skills/gates/validate_component_spec.py`

## Done when

- the version reflects consumer impact
- any deprecation names a replacement, a path and a date
- the decision is written down, not only agreed

## Absorbed

Merged in from `design-system-ops`: `governance-encoder`, `governance-review`, `contribution-workflow`, `deprecation-process`.
