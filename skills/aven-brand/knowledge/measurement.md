# Measuring a system in use

Depth for `system-health`, `docs-coverage`, `stakeholder-brief` and `triage`.
Merged from `design-system-ops`'s adoption and coverage notes.

---

## Every number is a count over a denominator

"80% adopted" with no denominator is a feeling with a percent sign. State both
halves: 34 of 42 components consumed from the package. If the denominator is
hard to establish, say so — an honest "we cannot currently count this" is worth
more than a number nobody can reproduce, and it names the next piece of work.

## The five measures

**Coverage** — how much of the interface surface the system actually covers. Not
how many components exist: how many of the things products need are in it. A
system with 60 components and no data table has a coverage problem that a
component count hides.

**Adoption** — how much of the consuming code uses the system versus a local
alternative. Count call sites, per component. The distribution matters more than
the average: one component at 100% and nine at 20% is a different system from ten
at 28%.

**Accessibility** — measured on the render, in every state, in both themes. Not
"we follow WCAG": the output of `axe_audit.mjs`, `measure_render.mjs` and
`verify_states.mjs`.

**Drift** — the count from `drift-check`, split by classification. Total drift
rising while the accidental share falls is a healthier system than the reverse,
and a single total hides that.

**Documentation** — components meeting the documentation bar over components
shipped. The bar is in `docs-coverage`.

## Trend beats reading

One measurement says almost nothing. It is only against a previous run that you
can answer the question anyone actually asks: is this getting better? Keep the
previous run. Report new, resolved, and persistent — and escalate anything
present for two cycles, because persistence is itself a signal that the fix is
not landing.

## Adoption is not a virtue score

A product at low adoption is information, not a failing. The useful question is
which of the five drift classifications explains it. If it is E — the system did
not have what they needed — the finding is about the system, not the team.
Reporting adoption as a league table gets you accurate numbers for one quarter
and gamed numbers forever after.

## What to report

Name ONE number to move next. A dashboard where every dimension is a priority
sets no priority, and its readers learn to skim it. The one number should be the
one whose movement unblocks the most other things — usually coverage or
documentation early, drift and adoption later.

Include what is going badly. A report with no bad news is read as marketing and
discounted in full, which costs you the good news too.
