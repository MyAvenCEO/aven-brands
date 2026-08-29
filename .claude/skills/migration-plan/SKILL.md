---
name: migration-plan
description: "Move call sites off a superseded vocabulary: count them first, order the work, and generate the mechanical part. Use when: a class, token or component has been replaced and callers must move; a breaking change needs a path for the people on the old thing; a codemod would do most of the work. Do NOT use for: mapping between two different design systems. If the other system is external, use migrate-design-system instead."
invocation: model
---

<!-- GENERATED from skills/aven-brand/skills/migration-plan.json — do not edit.
     Edit the JSON and run `node skills/aven-brand/generate.mjs`. -->

# migration-plan

Move call sites off a superseded vocabulary: count them first, order the work, and generate the mechanical part.

## Read first

- `skills/aven-brand/knowledge/drift.md`
- `skills/workflows/governance.md`

## Steps

1. COUNT the call sites before planning anything. A migration plan built on a guess at the size is a plan for a different migration.
2. Record every old name against its replacement, with a note on what actually differs — that map is what makes the work mechanical instead of a judgement per call site.
3. Separate the mechanical from the structural. A rename is a codemod; an API change is a rewrite, and mixing them in one pass makes the rename unreviewable.
4. Write the codemod for the mechanical part. Run it, then read the diff — a codemod nobody read is a find-and-replace with more confidence.
5. Migrate consumers in dependency order. A shared surface still on the old vocabulary blocks everything above it.
6. Delete the old thing only when the count reaches zero, and prove it with the count rather than believing it.

## Output

The call-site count, the old-to-new map with notes, the codemod, and the ordered plan.

## Gates

Run these and report their real output. A number you did not measure is not a number.

- `skills/gates/lint_hardcodes.py`
- `skills/gates/validate_theme_refs.py`
- `skills/gates/accuracy_report.mjs`

## Done when

- the count is measured and quoted, at the start and at the end
- every mechanical change went through a codemod whose diff was read
- the old vocabulary is deleted only after its count is zero

## Absorbed

Merged in from `design-system-ops`: `codemod-generator`, `migration-agent`.
