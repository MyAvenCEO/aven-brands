# What a gate proves, and what it cannot

Depth for `design-qa`, `onboarding` and every skill that quotes a number.

---

## Never state a number you did not measure

Any ratio, any "WCAG pass", any "all states OK" comes from running a gate and
reporting its actual output. Not from reasoning, not from memory, not from
what the token file says it should be. If it has not been run, the honest
sentence is "not verified yet".

This is the rule that everything else here serves. A design system's whole
claim is that it is verifiable; a single asserted number that turns out to be
wrong costs more credibility than ten measured ones earn.

## A gate that has only seen passing input proves nothing

Point every new gate at a deliberate defect and confirm it fails. A gate that
has never failed is not known to work — it is known to run.

This repo has caught real gates that could not fail: a contrast gate that
resolved `oklab()` through a regex and reported 1.43:1 where the truth was
6.78:1, and later the same gate reading `color(srgb 0.117 0.16 0.231 / 0.08)` as
three 0-255 channels with the alpha discarded, reporting 1.43:1 against a real
12.14:1. Both cried wolf, and a gate that cries wolf gets ignored — taking the
real failure with it.

Resolve colour by PAINTING it. A 1x1 canvas reads every form the engine can
serialise; a regex reads the forms you thought of.

## Verify every state, not the resting one

A control that passes at rest can fail on hover or focus through a specificity
trap. `measure_render.mjs` sees the resting page; `verify_states.mjs` walks
default, hover and focus on every interactive element.

## Render and look

The gates are green while the UI is visibly broken. Observed here: a checkbox
that would not toggle, a dash sitting at the bottom of its box, an answer panel
showing a grey band, and a card whose interior parts were each wrapped in a box
that did not belong there. All of it passed. All of it was found by a person
looking at the screen.

So: screenshot the thing with transitions off, look at every state, and CLICK
each control to confirm the state actually changed. `verify_interactive.mjs`
catches the specific case of a control that declares `aria-sort` or
`aria-pressed` and changes nothing — but it cannot catch "this is ugly" or "this
does not read".

## Honest scope

The gates prove objective correctness: token consistency, accessibility, absence
of drift. They do not prove taste. Never claim an automatic score on aesthetics,
and never let a passing gate stand in as evidence that something is good. For the
half no script can score, run `critique`, and read it yourself.

## The build is not done until the source reaches the output

A JSON edit that has not been regenerated is an edit that did not happen. This
has bitten twice here: a stale `dist` that a compiler declined to re-emit, and a
generated stylesheet on disk that nothing rebuilt — in both cases the source was
right, the gate read the old output, and everything reported green.

Regenerate, then gate.
