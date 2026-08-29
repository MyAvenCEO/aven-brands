---
name: stakeholder-brief
description: "Explain the system's state to people who do not work in it, in their terms, with the real numbers. Use when: someone outside the team needs to understand what the system is doing; investment or headcount is being discussed; a quarterly summary is due. Do NOT use for: telling engineers what changed in a release. If the audience is on the system, use change-communication instead."
invocation: model
---

<!-- GENERATED from skills/aven-brand/skills/stakeholder-brief.json — do not edit.
     Edit the JSON and run `node skills/aven-brand/generate.mjs`. -->

# stakeholder-brief

Explain the system's state to people who do not work in it, in their terms, with the real numbers.

## Read first

- `skills/aven-brand/knowledge/measurement.md`
- `skills/content/voice-tone.md`

## Steps

1. Run system-health FIRST and use its numbers. A brief written from impressions is the thing that destroys credibility the first time someone checks one.
2. Translate each measure into a consequence they already care about: time, risk, or consistency across the products they see.
3. Include what is going badly. A brief with no bad news is read as marketing and discounted entirely, including the good news.
4. Ask for one thing. A brief with four asks gets none of them.

## Output

State, trend, what is going badly, and one ask.

## Gates

Run these and report their real output. A number you did not measure is not a number.

- `skills/gates/check_no_emoji.py`

## Done when

- every number traces to a measured gate
- at least one genuine problem is stated
- exactly one ask is made

## Absorbed

Merged in from `design-system-ops`: `system-pitch`, `visual-report`, `release-retrospective`.
