#!/usr/bin/env python3
"""Lint generated component code for hardcoded values that should be design tokens.

The kit's rule is "zero hardcoded values" — every color/size/radius/duration must come
from a token (CSS var, theme key, asset). Point this at YOUR component source.

Usage:
  python3 scripts/lint_hardcodes.py src/components            # a dir
  python3 scripts/lint_hardcodes.py Button.tsx Card.vue       # files
  python3 scripts/lint_hardcodes.py --ext .tsx,.vue src/

Flags a line with a raw hex color, px length, or ms/s duration UNLESS it:
  - is inside a CSS var / token reference (var(--…), {token…}, theme(…)),
  - is a token-definition file (tokens/*.json),
  - carries an inline allow comment containing 'ds-allow-hardcode'.
Exit 0 = clean, 1 = violations found.
"""
import re
import sys
from pathlib import Path

CODE_EXT = {".css", ".scss", ".tsx", ".jsx", ".ts", ".js", ".vue", ".svelte",
            ".swift", ".kt", ".dart", ".html"}

HEX = re.compile(r"(?<![\w&])#[0-9a-fA-F]{3,8}\b")
PX = re.compile(r"(?<![\w.])\d+(?:\.\d+)?px\b")
MS = re.compile(r"(?<![\w.])\d+(?:\.\d+)?m?s\b")
# raw Tailwind palette utilities (bg-gray-500, text-blue-600, border-red-400 …) that
# bypass semantic tokens — the #1 real-world drift (527 of these in one audited project).
_TW_PREFIX = r"(?:bg|text|border|ring|ring-offset|fill|stroke|from|via|to|divide|outline|decoration|accent|caret|placeholder|shadow)"
_TW_COLOR = r"(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)"
TW = re.compile(rf"(?<![\w-]){_TW_PREFIX}-{_TW_COLOR}-(?:50|100|200|300|400|500|600|700|800|900|950)\b")
# hardcoded font-family not coming from a token/var
FONT = re.compile(r"font-family\s*:\s*(?!.*var\()")
# contexts that mean "this is a token, not a hardcode"
TOKEN_CTX = re.compile(r"var\(--|theme\(|tokens?[./]|\{[\w.\-]+\}|--[\w\-]+\s*:")
ALLOW = "ds-allow-hardcode"
# px values that are conventionally fine (hairlines, zero, 1px borders) — still reported as info? keep strict but allow 0/1px
PX_OK = {"0px", "1px"}


def iter_files(paths, exts):
    for p in paths:
        pp = Path(p)
        if pp.is_dir():
            for f in pp.rglob("*"):
                if f.suffix in exts and "node_modules" not in f.parts:
                    yield f
        elif pp.is_file() and pp.suffix in exts:
            yield pp


def lint_line(line, tailwind=True, allowed_by_previous=False):
    # The marker covers its own line AND the next one. A one-line justification
    # is almost never enough, and forcing it onto the end of the declaration it
    # explains produced comments nobody could read — so the common shape is a
    # short block above the value, and that has to count.
    if allowed_by_previous or ALLOW in line or TOKEN_CTX.search(line):
        return []
    stripped = line.strip()
    if stripped.startswith(("//", "*", "/*", "#", "<!--")):
        return []
    hits = []
    # @media / @container conditions can't use var() (a CSS limitation) — breakpoint px there
    # is not drift; skip px/ms on those lines (still check hex/tailwind/font).
    media_cond = "@media" in line or "@container" in line
    for m in HEX.finditer(line):
        hits.append(("hex", m.group(0)))
    if not media_cond:
        for m in PX.finditer(line):
            if m.group(0) not in PX_OK:
                hits.append(("px", m.group(0)))
        for m in MS.finditer(line):
            hits.append(("time", m.group(0)))
    if tailwind:
        for m in TW.finditer(line):
            hits.append(("tailwind-palette", m.group(0)))
    if FONT.search(line):
        hits.append(("font-family", "literal font-family"))
    return hits


def main(argv):
    exts = CODE_EXT
    tailwind = True
    args = []
    i = 0
    while i < len(argv):
        if argv[i] == "--ext" and i + 1 < len(argv):
            exts = {e if e.startswith(".") else "." + e for e in argv[i + 1].split(",")}
            i += 2
        elif argv[i] in ("--no-tw", "--no-tailwind"):
            tailwind = False
            i += 1
        else:
            args.append(argv[i])
            i += 1
    if not args:
        print(__doc__)
        return 0

    missing = [a for a in args if not Path(a).exists()]
    if missing:
        # Same reason as check_no_emoji: scanning nothing must not read as clean.
        print("ERROR: path(s) not found: " + ", ".join(missing))
        return 1

    files = list(iter_files(args, exts))
    if not files:
        print(f"ERROR: no lintable file(s) under {', '.join(args)}")
        return 1
    violations = 0
    for f in files:
        try:
            text = f.read_text()
        except (UnicodeDecodeError, OSError):
            continue
        # A GENERATED file cannot be fixed where it is flagged. `brand-components.css`
        # accounted for 24 of 38 findings here, and every one of them originates in a
        # unit's JSON — pointing at the output sends the reader to a file whose header
        # says not to edit it, and the real decision stays unexamined. The source is
        # linted on its own terms; this scans what a person actually writes.
        head = text[:400]
        if "GENERATED" in head and ("do not edit" in head.lower() or "generated by" in head.lower()):
            continue
        in_allow = False
        # A multi-line `/* ... */` whose continuation lines do not begin with `*`
        # was scanned AS CODE. Every prose mention of a measurement inside an
        # explanatory comment — "at a 1044px main region", "land at ~337px each"
        # — came back as a hardcoded value, which is how a linter teaches people
        # to stop reading it. `lint_line` can only see one line, so the block
        # state has to be tracked here.
        block_close = None
        prev_allow = False
        for n, line in enumerate(text.splitlines(), 1):
            if block_close:
                if block_close in line:
                    # Anything after the closer on this line is real code.
                    line = line.split(block_close, 1)[1]
                    block_close = None
                else:
                    continue
            # An opener with no closer after it puts us inside a block. BOTH
            # comment syntaxes: the `/* */` fix left `<!-- -->` broken, which is
            # the same defect one file type along — a Svelte component is full of
            # multi-line markup comments and every measurement mentioned in one
            # came back as a finding.
            # The markers are read from the ORIGINAL line, BEFORE any comment
            # truncation. They live inside comments by definition, so truncating
            # first erased every one of them and the exception silently did
            # nothing — the marker was there, the value was still flagged, and the
            # only visible symptom was a justification that appeared to be ignored.
            if "ds-allow-hardcode:start" in line:
                in_allow = True
                continue
            if "ds-allow-hardcode:end" in line:
                in_allow = False
                continue
            if in_allow:
                continue
            for opener, closer in (("/*", "*/"), ("<!--", "-->")):
                if opener in line and closer not in line.split(opener, 1)[1]:
                    block_close = closer
                    line = line.split(opener, 1)[0]
                    break
            for kind, val in lint_line(line, tailwind, allowed_by_previous=prev_allow):
                print(f"{f}:{n}: hardcoded {kind} '{val}' — use a token")
                violations += 1
            # Carried to the NEXT line only. A marker that stayed on would turn
            # one justified exception into a licence for the rest of the file.
            prev_allow = ALLOW in line

    print(f"\nScanned {len(files)} file(s).")
    if violations:
        print(f"FAIL: {violations} hardcoded value(s). Map each to a token, "
              f"or add a '{ALLOW}' comment for a justified exception.")
        return 1
    print("OK: no hardcoded values found.")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
