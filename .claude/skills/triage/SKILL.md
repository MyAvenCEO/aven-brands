---
name: triage
description: "Order a queue of design system requests by system impact rather than by who asked loudest. Use when: more requests exist than capacity; a backlog needs ordering; the same request keeps arriving from different teams. Do NOT use for: deciding whether one component belongs in the system. If the question is promotion, use governance instead."
invocation: model
---

<!-- GENERATED from skills/aven-brand/skills/triage.json — do not edit.
     Edit the JSON and run `node skills/aven-brand/generate.mjs`. -->

# triage

Order a queue of design system requests by system impact rather than by who asked loudest.

## Read first

- `skills/workflows/governance.md`
- `skills/aven-brand/knowledge/measurement.md`

## Steps

1. Group by underlying need, not by ticket. Five requests for five components are often one missing primitive.
2. Score by how many consumers are blocked, whether it is an accessibility defect, and whether it is compounding.
3. An accessibility defect outranks a feature. It is not a preference — it is a defect that excludes people.
4. A repeated request is evidence of a gap. Its THIRD independent occurrence is a stronger signal than its urgency.
5. Say plainly what will not be done, so nobody waits for it.

## Output

The grouped and ordered queue, plus an explicit not-doing list.

## Done when

- requests are grouped by need, not listed as filed
- the not-doing list exists and is specific

## Absorbed

Merged in from `design-system-ops`: `backlog-generator`.
