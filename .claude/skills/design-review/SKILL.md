---
name: design-review
description: "Score a design on six weighted dimensions and return prioritised findings, each with the fix. Use when: a design needs judging before it ships; an existing product needs a consistency audit. Do NOT use for: deciding whether something is any GOOD, as taste. If the question is taste and beauty, use critique instead."
invocation: model
---

<!-- GENERATED from skills/aven-brand/skills/design-review.json — do not edit.
     Edit the JSON and run `node skills/aven-brand/generate.mjs`. -->

# design-review

Score a design on six weighted dimensions and return prioritised findings, each with the fix.

## Read first

- `.claude/rules/review-and-research.md`
- `skills/taste/design-taste.md`

## Steps

1. Score Visual Hierarchy, Consistency, Accessibility, Usability (20% each), Responsiveness and Performance (10% each). Compute the weighted total.
2. Run the accessibility lens properly; use contrast.py for any pair you are unsure of rather than estimating.
3. Check the anti-slop tells. A passing gate is never evidence of taste.
4. Apply the ten usability heuristics and flag violations by number.
5. Rank findings Critical, Major, Minor, Enhancement. Every finding names a specific fix, not a direction.

## Output

The six-dimension scored table, then a findings table: number, severity, finding, recommendation.

## Gates

Run these and report their real output. A number you did not measure is not a number.

- `skills/gates/contrast.py`
- `skills/gates/taste_audit.mjs`
- `skills/gates/slop_tells.mjs`

## Done when

- every score is justified by a named observation
- every finding has a specific fix
- any number quoted came from a gate that was actually run
