#!/usr/bin/env python3
"""Validate that every component spec in components/ meets the house quality bar.

Each spec should document (per CLAUDE.md Component Quality Bar): anatomy, variants,
the states, token mapping, and accessibility. This checks the spec docs themselves —
not generated code.

Usage:
  python3 scripts/validate_component_spec.py
Exit 0 = all specs complete, 1 = a spec is missing a required section.
"""
import re
import sys
from pathlib import Path

# Two different roots, and conflating them is what broke this file.
#
# KIT is where the kit's own material lives — components/, tokens/, taste/,
# accessibility/. It is one level above the gates, and that has stayed true
# through the move from `scripts/` to `skills/gates/`, because the kit moved
# with them.
#
# REPO is the project being checked: the directory that holds CLAUDE.md. Only
# gates that read the project need it. `validate_instruction_surface` did, used
# `parent.parent`, and looked for `skills/CLAUDE.md` — it had been crashing
# since the move. Naming both stops the next person picking the wrong one.
KIT = Path(__file__).resolve().parent.parent


def _repo_root() -> Path:
    here = Path(__file__).resolve()
    for candidate in here.parents:
        if (candidate / "CLAUDE.md").is_file():
            return candidate
    raise SystemExit(f"{Path(__file__).name}: no CLAUDE.md above this script")


ROOT = KIT
COMPONENTS = ROOT / "components"

# section name -> regex that proves it's present (case-insensitive)
REQUIRED = {
    "anatomy": r"anatom|structure|\blayout\b|composition",
    "variants": r"variant",
    "states": r"\bstate",
    "token mapping": r"token|\{[\w.\-]+\}|semantic\.|sizing\.|spacing|breakpoint|grid|\.json",
    "accessibility": r"accessib|a11y|aria|wcag",
}

# files that are subsystem/overview docs, not single-component specs (relaxed: a11y + tokens only)
RELAXED = {"icon-system.md"}
RELAXED_REQUIRED = {"token mapping": REQUIRED["token mapping"], "accessibility": REQUIRED["accessibility"]}


def main():
    if not COMPONENTS.is_dir():
        print(f"ERROR: {COMPONENTS} not found")
        return 1
    files = sorted(COMPONENTS.glob("*.md"))
    problems = []
    for f in files:
        text = f.read_text().lower()
        req = RELAXED_REQUIRED if f.name in RELAXED else REQUIRED
        missing = [name for name, pat in req.items() if not re.search(pat, text, re.I)]
        status = "OK  " if not missing else "MISS"
        print(f"  {status} {f.name}" + (f"  → missing: {', '.join(missing)}" if missing else ""))
        if missing:
            problems.append((f.name, missing))

    print(f"\nChecked {len(files)} component spec(s).")
    if problems:
        print(f"FAIL: {len(problems)} spec(s) missing required sections.")
        return 1
    print("OK: all component specs document anatomy, variants, states, tokens, and a11y.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
