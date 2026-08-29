# Drift, and why the classification is the whole point

Depth for `drift-check` and `migration-plan`. Merged from `design-system-ops`'s
drift note and from what this repo learned running its own migration.

---

## Drift is the normal condition of a used system

The question is never whether a system has drifted. It has. The question is
whether the drift was chosen, how far it has gone, and whether it is
compounding.

Not all drift is bad, and treating it as though it were is how a design system
team becomes a compliance function nobody talks to. A product team that made a
deliberate, recorded exception made a design decision. A product team that
re-implemented a component with slightly different spacing because they did not
know the system version existed created maintenance debt. Same symptom,
opposite response.

## The five classifications

Classify before recommending. The response follows from the classification, and
a report that lists findings without them is a list of problems with no plan.

**A — Intentional divergence.** A deliberate decision, for a known reason. Either
the system genuinely does not serve this context, or the need is real and belongs
in the system. Both outcomes are fine; neither is a mistake. Route to
`decision-record`.

**B — Version lag.** The implementation matches an older version. Normal entropy,
not an error, but it accumulates into a migration burden. Route to
`migration-plan`.

**C — Accidental drift.** Divergence with no intent behind it — most often a
component built locally before the system version existed and never migrated.
The highest priority to correct, because the team would want to know. Fix the
implementation AND review the documentation that failed to prevent it.

**D — Misunderstanding.** The consumer read the documentation and got it wrong.
They believed they were using the system correctly. This is a documentation
defect wearing an implementation's clothes. Route to `docs-coverage`, then
`change-communication`.

**E — System gap.** The system did not have what the team needed, and the
divergence is their solution. Not a mistake — evidence. If the same gap shows up
in three places, the case for adding it is made. Route to `governance`.

## The four dimensions

**Visual** — spacing, colour (especially non-token values), type, radius, shadow,
icons.

**Behavioural** — state transitions, motion, timing, keyboard behaviour, focus
management. The hardest to find without testing and the highest risk, because
it is where accessibility regressions live.

**API** — different props, different names, different semantics from the
published interface. Most common when a team implemented locally.

**Token** — raw values where a token belongs, a token referenced at the wrong
tier, or a local override that contradicts the semantic intent.

## Measure it; do not read for it

A drift report assembled by opening files is a report about the files you
happened to open. The gates in `skills/gates` find these mechanically:

- `lint_hardcodes.py` — raw hex, px and timing outside adapter config.
- `validate_theme_refs.py` — a `var()` pointing at a token that no longer exists.
  This is the one that hides: a renamed token leaves a reference that renders as
  nothing, breaks nothing loudly, and reports nothing.
- `lint_intent.mjs` — a destructive action wearing the primary colour, measured
  on the render rather than inferred from a class name.
- `slop_tells.mjs` — single radius everywhere, flat default shadow, the
  indigo-blue gradient, pure black text, near-duplicate neutrals.
- `measure_render.mjs` and `verify_states.mjs` — contrast that drifted below AA,
  including in hover and focus where a specificity trap can put it.

Detection by styling approach: in custom properties, raw values outside `var()`.
In SCSS, literals not using a variable. In Tailwind, arbitrary-value brackets —
standard utilities that resolve to configured tokens are NOT drift. In CSS-in-JS,
raw values outside the theme object.

## Weight severity by where it sits

The same finding is not the same finding everywhere.

- **Critical path** — authentication, checkout, primary data entry, core
  navigation. Elevate one level.
- **High traffic** — buttons, inputs, cards, modals. Severity stands, but state
  the blast radius.
- **Utility** — layout wrappers, spacing helpers. May drop a level if nothing
  user-facing depends on it.

## Root causes beat findings

Individual findings get fixed. A root cause stops the next fifty. Before
finishing a report, step back: is one team in every row? One component? One
token? Is there a documentation page behind the whole D column?

## What this repo learned running its own

Three things that the general advice does not say, learned by doing it here:

1. **A new name can silently capture an old one.** A unit defined as `app-shell`
   restyled six surfaces that used `.app-shell` to mean "the page wrapper". The
   class resolved, the CSS was valid, nothing failed, and the docs page simply
   rendered with its content pushed 700px right. A new name taking a name the old
   vocabulary still owns is the one migration hazard with no gate. Check the name
   is free before defining it.

2. **A variant that declares nothing is worse than no variant.** Three of one
   unit's four `step` options had no declarations. The switch was in the UI, it
   moved, and it changed nothing — which teaches the reader the control is
   broken. If an option means something, it declares something.

3. **Every gate can pass while the thing is visibly wrong.** A regex that matched
   more elements than intended wrapped six interior parts of a card in a box that
   did not belong there. Fourteen gates were green. It was found by a person
   looking at the screen. Gates prove objective correctness; they do not prove the
   thing looks right, and no number of them ever will.
