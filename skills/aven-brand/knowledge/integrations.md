# External integrations, once

Depth for `figma-integration`, `drift-check` and `system-health`.

The library this merged from repeated a per-skill integration block in roughly
forty files: the same Figma, GitHub and Chromatic instructions, restated. One
integration story written forty times is thirty-nine chances for it to drift.
It lives here, once.

---

## The rule that comes first

Pick ONE direction of truth and write it down. Two-way sync with no declared
winner produces a system where neither side can be trusted and every
disagreement becomes an archaeology exercise.

## Figma

**Variables to tokens.** Map collections and modes onto tiers and themes, not
file by file. A collection is a tier; a mode is a theme. If the Figma file does
not have that shape, fixing the shape comes before syncing anything.

**Component parity.** Same variants, same states, same names, both sides. A name
that differs across the boundary is a translation every person has to perform
forever.

**Reading component specs.** Component properties on the Figma side compared
against props on the code side finds API drift without anyone writing a spec by
hand.

**A caveat worth stating in the output.** Screenshots taken through the REST API
reflect the last PUBLISHED state, not the live file. If there are unpublished
changes, the image is not the current design intent. Say which one you used.

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
