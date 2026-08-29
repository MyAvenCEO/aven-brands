# External integrations, once

Depth for `drift-check` and `system-health`.

The library this merged from repeated a per-skill integration block in roughly
forty files: the same Figma, GitHub and Chromatic instructions, restated. One
integration story written forty times is thirty-nine chances for it to drift.
It lives here, once.

---

## The rule that comes first

Pick ONE direction of truth and write it down. Two-way sync with no declared
winner produces a system where neither side can be trusted and every
disagreement becomes an archaeology exercise.

The Figma section that used to sit here went with the `figma-integration`
skill. It is not archived and not commented out: a design tool this project does
not use is a section every reader has to skip and a maintainer has to keep
true. If Figma comes back, the skill and this section come back together.

## Git host

Useful signals for `drift-check`, all of them mechanical:

- Hardcoded values outside the design system package.
- Component names used outside the system's source — a local re-implementation.
- `!important` on a property that a design token owns.
- Commit history on component files, which gives version lag without asking.

## Visual regression services

A high rate of ACCEPTED visual changes outside a release cycle is a drift signal.
It means the team is accepting divergence rather than correcting it, and the tool
that should be catching drift has become the thing normalising it.

## When an integration is unavailable

Log it and proceed with what you have. Never silently produce a partial report
that reads as a complete one — say in the output which sources were unavailable,
because a reader cannot otherwise tell an empty finding from an unchecked one.
