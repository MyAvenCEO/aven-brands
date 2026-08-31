---
name: token-build
description: "Turn the token source into the platform artefacts — CSS variables, Tailwind theme, iOS, Android — from one source, in one step. Use when: tokens have to reach a platform; a build pipeline is being set up or changed. Do NOT use for: deciding what the tokens should be. If the token values are in question, use design-tokens instead."
invocation: model
---

<!-- GENERATED from skills/aven-brand/skills/token-build.json — do not edit.
     Edit the JSON and run `node skills/aven-brand/generate.mjs`. -->

# token-build

Turn the token source into the platform artefacts — CSS variables, Tailwind theme, iOS, Android — from one source, in one step.

## Read first

- `skills/workflows/token-build.md`

## Steps

1. One source, many outputs. A platform that hand-maintains its own copy is a second source and will drift.
2. GENERATE, do not hand-write, and say so in the output file. A generated file someone edits is worse than no generation.
3. After generating, verify every var() the surfaces reference actually resolves — a renamed token leaves a dangling reference that renders as nothing and reports nothing.
4. Regenerating is part of the build. A JSON edit that does not reach the stylesheet is an edit that did not happen.

## Output

The generated artefacts plus the command that reproduces them.

## Gates

Run these and report their real output. A number you did not measure is not a number.

- `skills/gates/build_tokens.mjs`
- `skills/gates/validate_tokens.py`
- `skills/gates/validate_theme_refs.py`

## Done when

- validate_theme_refs finds no dangling var()
- every generated file says it is generated and names the command
- the generator was actually run, not just described
