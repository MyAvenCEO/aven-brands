---
name: design-code
description: "Emit production code for a named stack, with tokens, states, a11y and dark mode already in it. Use when: code is wanted for React, Next, SwiftUI, or any other target; an adapter is needed for a framework with no dedicated file. Do NOT use for: deciding what the component should be. If the component is not specified yet, use design-component instead."
invocation: model
---

<!-- GENERATED from skills/aven-brand/skills/design-code.json — do not edit.
     Edit the JSON and run `node skills/aven-brand/generate.mjs`. -->

# design-code

Emit production code for a named stack, with tokens, states, a11y and dark mode already in it.

## Read first

- `.claude/rules/frameworks.md`

## Steps

1. For a target with no dedicated file, read the adapter protocol and generate the adapter first.
2. Tokens, never literals. Every interactive element carries its ARIA. Every state is handled. Dark mode comes from semantic tokens, not a second stylesheet.
3. Mobile-first and responsive.
4. Deliver COMPLETE files. A placeholder comment standing in for unchanged code is a broken output. Asked for N components, deliver N.

## Output

Copy-paste-ready typed code, complete files only.

## Gates

Run these and report their real output. A number you did not measure is not a number.

- `skills/gates/lint_hardcodes.py`
- `skills/gates/lint_intent.mjs`
- `skills/gates/check_no_emoji.py`

## Done when

- lint_hardcodes finds no raw hex/px/timing outside adapter config
- no file contains an elision standing in for real code
- the count delivered equals the count asked for
