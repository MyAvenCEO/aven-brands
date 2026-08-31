# aven-brand

One skill library for UI/UX, the design system, and the ops that keep it honest.

28 skills, declared as JSON documents and validated when the library loads —
the same decision the unit library made, for the same reason.

---

## Why it is JSON and not 28 files of prose

`brands/CEO/design-system/src/brand/units/*.json` declares what a component IS,
and the engine renders it. A unit that cannot render fails when the package is
built, not when a page is opened.

`skills/*.json` declares what a skill IS, and `generate.mjs` writes it. A skill
that routes to a gate which does not exist, reads a depth file that was deleted,
or sends the reader to a skill that was merged away fails when the library is
built, not when someone invokes it and quietly gets less than they asked for.

Every one of those failure modes was a real defect in one of the two libraries
this merged, not a hypothetical. `registry.mjs` catches six classes of them:

| It catches | Because |
|---|---|
| a `gates` entry with no such script | the skill's verification silently does not happen |
| a `reads` entry with no such file | the skill's substance left with the file |
| an `instead` route to a non-skill | the reader hits a dead end at the moment they are told they are in the wrong place |
| two skills with one name | the matcher picks one and nobody knows which |
| an emoji anywhere | this repo forbids them outright, and the merged library keyed its severity tables on coloured circles |
| one old skill absorbed twice | a merge that was not finished |

Prove it can fail before trusting it — pass a deliberately broken skill to
`validate()` and confirm each class is reported. That is the same rule the
library itself states in `knowledge/gate-discipline.md`.

## Working on it

```bash
bun run skills:check   # validate the library
bun run skills:build   # regenerate .claude/skills/*/SKILL.md
```

`.claude/skills/` is GENERATED. Editing a `SKILL.md` there is editing a build
artefact: the next generate overwrites it. Change the JSON.

Adding a skill: write `skills/<name>.json`, give it a `trigger.not` that says
what it is NOT for, name its gates, and run the two commands. A skill with no
gates has to justify itself in `done` — "it looked right" is not a verification.

## The merge

Two libraries, each half a system.

**avenCEO's UI/UX kit** — 17 skills, deliberately thin: each one routes into a
depth file and names the gates that prove the work. Strong at making a thing
correctly and strong at verifying it, because every claim has a script behind
it. Almost nothing about what happens after the thing ships.

**`design-system-ops`** — 41 skills covering exactly that: drift, adoption,
health, docs coverage, codemods, decision records, change communication,
onboarding, triage. Deep prose, roughly 300 lines a skill, and nothing in any of
them can fail.

Neither shape works alone. A library that can only build has no answer for a
system in use; a library that can only assess produces reports nobody can check.
So: this repo's shape, that library's coverage, and every skill that can be
gated is gated.

**What did not come across, and why**

- The emoji severity keys. Words instead — enforced by the registry.
- The `.ds-ops-config.yml` layer, which duplicates a brand config already held
  as JSON here.
- Per-skill Figma / GitHub / Chromatic auto-pull blocks, restated in roughly
  forty files. One integration story written forty times is thirty-nine chances
  to drift; it lives once, in `knowledge/integrations.md`.

Every absorbed skill is recorded in the absorbing skill's `supersedes`, so the
merge is a record rather than a deletion, and the registry refuses to let two
skills claim the same one.

## Attribution

Portions derive from [design-system-ops](https://github.com/murphytrueman/design-system-ops)
v1.2.1 by Murphy Trueman, used under the MIT License. The upstream ideas kept
here — the A-E drift classification, the adoption tiers, the health scoring, and
the discipline of routing every finding to a named next skill — are theirs.
