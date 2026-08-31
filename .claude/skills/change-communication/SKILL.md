---
name: change-communication
description: "Tell the people on a system what changed, what it costs them, and what to do — sized to how much it actually costs them. Use when: a release affects consumers; a deprecation has to be announced; a breaking change is going out. Do NOT use for: deciding the version number; writing the internal rationale. If the version is the question, use version-bump-advisor instead. If the rationale is the artefact, use decision-record instead."
invocation: model
---

<!-- GENERATED from skills/aven-brand/skills/change-communication.json — do not edit.
     Edit the JSON and run `node skills/aven-brand/generate.mjs`. -->

# change-communication

Tell the people on a system what changed, what it costs them, and what to do — sized to how much it actually costs them.

## Read first

- `skills/workflows/governance.md`
- `skills/content/voice-tone.md`

## Steps

1. Lead with what the reader has to DO. A release note that opens with what the team built makes every reader hunt for their own line.
2. Size the message to the cost. A patch does not need a migration guide and a breaking change is not a changelog line.
3. For anything breaking: the before, the after, the codemod if there is one, and the date the old path stops working.
4. Say what you are NOT changing. Half of the anxiety in a release note is about things that were never at risk.
5. No emoji, in the note or in the headings.

## Output

The note, ordered by what the reader must do.

## Gates

Run these and report their real output. A number you did not measure is not a number.

- `skills/gates/check_no_emoji.py`

## Done when

- the first line tells the reader whether they have to act
- anything breaking names a date and a path
- check_no_emoji passes
