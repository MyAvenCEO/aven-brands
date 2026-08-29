---
name: version-bump-advisor
description: "Decide major, minor or patch by consumer impact, and catch the small diffs that are secretly breaking. Use when: a release is being cut and the number is unclear; a change looks small but touches a public name. Do NOT use for: writing the announcement. If the note is the work, use change-communication instead."
invocation: model
---

<!-- GENERATED from skills/aven-brand/skills/version-bump-advisor.json — do not edit.
     Edit the JSON and run `node skills/aven-brand/generate.mjs`. -->

# version-bump-advisor

Decide major, minor or patch by consumer impact, and catch the small diffs that are secretly breaking.

## Read first

- `skills/workflows/governance.md`

## Steps

1. Ask only one question: what breaks for someone who upgrades without reading anything?
2. Major is anything that changes a name, a default, or a rendered result that a consumer could be relying on. Renaming a token is major. Changing a default spacing is major. Neither is a large diff.
3. Minor adds. Patch fixes without changing an interface.
4. A visual change with no API change is still breaking if a consumer's screenshot test fails on it. Say so rather than hiding it in a patch.

## Output

The number, and the specific thing that forces it.

## Done when

- the decision names the exact change that forces the level
- visual-only breaks are called out rather than buried
