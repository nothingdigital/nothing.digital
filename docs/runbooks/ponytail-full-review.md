# Ponytail full-code review (multi-agent)

> **Goal:** Every code file reviewed for over-engineering with low per-agent context; nothing missed.  
> **Skill:** `ponytail-review` (findings only — no edits).  
> **When:** Periodic lean-up, after a large feature lands, or before a delete/simplify pass.  
> **Out of scope:** Correctness, security, perf, docs/markdown, lockfiles, images.

Trigger phrase for agents: _Run the ponytail full-code review runbook._

## Preflight

- [ ] Confirm scope: default = all working-tree code (`*.{ts,tsx,js,jsx,mjs,cjs,sql}`), tracked + untracked
- [ ] Confirm mode: **findings only** (do not apply cuts in the same run)
- [ ] Locate skill file (Cursor plugin cache path may change):

```bash
find ~/.cursor/plugins -path '*ponytail*ponytail-review/SKILL.md' 2>/dev/null | head -1
# fallback:
find ~/.claude/plugins -path '*ponytail*ponytail-review/SKILL.md' 2>/dev/null | head -1
```

- [ ] Pick report path: `docs/runbooks/archive/ponytail-full-review-YYYY-MM-DD.md`
- [ ] Create a work dir for this run (ephemeral):

```bash
RUN_DIR="/tmp/ponytail-review-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$RUN_DIR"/{shards,receipts}
echo "$RUN_DIR"
```

## Phase 0 — Manifest (source of truth)

From repo root:

```bash
# tracked + untracked code paths, sorted unique
{
  git ls-files
  git status -u --porcelain | sed 's/^...//'
} | grep -E '\.(ts|tsx|js|jsx|mjs|cjs|sql)$' \
  | grep -vE '^(node_modules/|\.git/)' \
  | sort -u > "$RUN_DIR/manifest.txt"

wc -l "$RUN_DIR/manifest.txt"
```

Optional exclusions (append before `sort -u` if needed):

```bash
# example: skip generated / lock-adjacent noise
grep -vE '^(coverage/|test-results/)'
```

**Rule:** Coverage is complete only when every path in `manifest.txt` appears in some agent’s `## reviewed` list.

## Phase 1 — Shard (keep context low)

Targets per shard (hard caps):

| Cap                   | Value                          | Why                               |
| --------------------- | ------------------------------ | --------------------------------- |
| Max files             | 18                             | Prompt + reads stay small         |
| Max LOC               | ~2000                          | Avoid context collapse            |
| Single-file exception | file >2000 LOC → its own shard | Large files get a dedicated agent |

Generate shards (deterministic pack-first):

```bash
python3 - <<'PY' "$RUN_DIR"
import sys, os
from pathlib import Path
run = Path(sys.argv[1])
manifest = (run / "manifest.txt").read_text().splitlines()
MAX_FILES, MAX_LOC = 18, 2000

def loc(p):
    try:
        return sum(1 for _ in open(p, errors="ignore"))
    except OSError:
        return 0

# Prefer domain-stable order: path sort already groups by tree
items = [(p, loc(p)) for p in manifest]
shards, cur, cl = [], [], 0
for p, n in items:
    if n > MAX_LOC and cur:
        shards.append(cur); cur, cl = [], 0
    if n > MAX_LOC:
        shards.append([(p, n)]); continue
    if cur and (len(cur) >= MAX_FILES or cl + n > MAX_LOC):
        shards.append(cur); cur, cl = [], 0
    cur.append((p, n)); cl += n
if cur:
    shards.append(cur)

out = run / "shards"
for i, shard in enumerate(shards, 1):
    body = "\n".join(p for p, _ in shard) + "\n"
    (out / f"shard-{i:02d}.txt").write_text(body)
    lines = sum(n for _, n in shard)
    print(f"shard-{i:02d}: {len(shard):2d} files  {lines:5d} LOC")
print(f"total shards: {len(shards)}")
PY
```

Expect roughly **15–25 shards** on this repo today (~278 files / ~26k LOC). Counts drift; trust the script, not a fixed A–M table.

### Domain hint (optional label only)

When naming agents in the UI, label by first path prefix (`src/app/admin`, `src/lib`, `scripts`, …). Sharding itself is LOC/file capped — do not hand-merge shards to “look neat” if that blows the caps.

## Phase 2 — Dispatch waves

Use Cursor `Task` → `generalPurpose`, model **`inherit`** (quality over cheapest-fast).

- Wave size: **≤6 agents** in parallel
- Waves: `ceil(shard_count / 6)` sequential batches
- Each agent gets **only** its shard file list + the skill contract below
- Main thread does **not** paste file bodies into the parent context

### Agent prompt template (copy per shard)

```
You are a ponytail-review agent. Findings only — do not edit files.

1. Read and follow exactly:
   <ABSOLUTE_PATH_TO_ponytail-review/SKILL.md>

2. Scope: read EVERY file in this list end-to-end. Treat the list as the full "diff".
   Do not open, search, or cite any path outside this list.

FILES:
- path/one.ts
- path/two.tsx

3. Tags only: delete | stdlib | native | yagni | shrink
4. Out of scope: bugs, security, performance, style nits, test deletions that remove coverage
5. Smoke tests / asserts are NOT bloat — never flag them for deletion

Return EXACTLY this markdown (no preamble):

## reviewed
- path/one.ts
- path/two.tsx

## findings
path/one.ts:L12: yagni: <what>. <replacement>.
(or a single line: Lean already. Ship.)

## net
net: -<N> lines possible.
```

Paste the real paths from `$RUN_DIR/shards/shard-NN.txt` into `FILES` / `## reviewed` expectations.

### Receipts

After each wave, save each agent’s raw reply to:

```bash
# example
"$RUN_DIR/receipts/shard-01.md"
```

## Phase 3 — Coverage gate (mandatory)

```bash
python3 - <<'PY' "$RUN_DIR"
import sys, re
from pathlib import Path
run = Path(sys.argv[1])
manifest = set((run / "manifest.txt").read_text().splitlines())
reviewed = set()
for receipt in sorted((run / "receipts").glob("*.md")):
    text = receipt.read_text()
    # lines under ## reviewed that look like "- path"
    in_rev = False
    for line in text.splitlines():
        if line.strip().lower() == "## reviewed":
            in_rev = True
            continue
        if in_rev and line.startswith("##"):
            break
        if in_rev:
            m = re.match(r"^-?\s*(.+)$", line.strip())
            if m and m.group(1) not in ("reviewed",):
                p = m.group(1).strip().lstrip("- ").strip()
                if p and not p.startswith("#"):
                    reviewed.add(p)
missing = sorted(manifest - reviewed)
extra = sorted(reviewed - manifest)
print(f"manifest={len(manifest)} reviewed={len(reviewed)} missing={len(missing)} extra={len(extra)}")
(run / "missing.txt").write_text("\n".join(missing) + ("\n" if missing else ""))
for p in missing[:50]:
    print("MISSING", p)
if missing:
    raise SystemExit(1)
print("coverage OK")
PY
```

If exit 1:

1. Pack `missing.txt` into new mop-up shards (same caps)
2. Dispatch mop-up agents
3. Re-run the gate until `missing == 0`

### Large-file spot-check (mandatory)

Any file with **>400 LOC** whose shard returned only `Lean already. Ship.` (no findings mentioning that path) → spawn a **second** agent on that file alone. Append the second receipt; prefer its findings if they conflict.

```bash
# list large files for the spot-check pass
python3 - <<'PY' "$RUN_DIR"
import sys
from pathlib import Path
run = Path(sys.argv[1])
for p in (run / "manifest.txt").read_text().splitlines():
    try:
        n = sum(1 for _ in open(p, errors="ignore"))
    except OSError:
        continue
    if n > 400:
        print(f"{n:5d} {p}")
PY
```

## Phase 4 — Aggregate report

Main thread only:

1. Collect all `## findings` lines (`path:L…` or `Lean already`)
2. Drop exact duplicate lines
3. Rank biggest estimated cut first (use line ranges / stated sizes in the finding text)
4. Sum shard `net: -N` values; label as **upper bound** (overlap possible)
5. Write the report:

`docs/runbooks/archive/ponytail-full-review-YYYY-MM-DD.md`

```markdown
# Ponytail full review — YYYY-MM-DD

coverage: N/N files (manifest OK)
shards: K (+ mop-up M, spot-check S)
skill: ponytail-review

## Ranked findings

path:L#: tag: what. replacement.

## Lean shards

- shard-03 (paths…)

## net

net: -N lines possible (sum of shards; may overlap)
```

Update [`SCRATCHPAD.md`](../../SCRATCHPAD.md) only if this run should appear on the live board (one bullet + link to the archive report). Do **not** invent roadmap items from findings.

## Phase 5 — Stop

Do not apply deletions in this run unless the human explicitly starts a follow-up “execute ponytail cuts” task. Prefer small PRs per cut cluster.

## Re-run checklist (anytime)

1. New `$RUN_DIR` + fresh manifest
2. Re-shard (tree size changes — never reuse old shard lists blindly)
3. Waves ≤6, prompt template + skill path
4. Coverage gate → mop-up → large-file spot-check
5. Dated archive report
6. Optional SCRATCHPAD link

## Anti-patterns

| Don’t                                               | Do instead                                  |
| --------------------------------------------------- | ------------------------------------------- |
| One agent on the whole repo                         | Shard to caps                               |
| Paste skill once in parent and hope                 | Paste skill path into **each** agent prompt |
| Trust “I reviewed everything” without `## reviewed` | Diff vs manifest                            |
| Skip large lean files                               | Mandatory solo spot-check                   |
| Mix bug hunt into this pass                         | Separate Bugbot / security-review           |
| Auto-merge fixes from 18 agents                     | Human picks cuts; small PRs                 |

## Snapshot (this repo, 2026-08-08)

Rough shape at last measurement — **recompute**; do not treat as live:

- ~278 code files / ~26k LOC
- Largest: `src/app/admin/clients/actions.ts`, `…/clients/[id]/page.tsx`, `src/lib/admin/client-ops-queries.ts`, `src/lib/supabase/database.ts`, `src/lib/services.ts`
- Expect ~18–22 shards under current caps

## Related

- Skill: ponytail-review (plugin); whole-repo ranking style ≈ ponytail-audit output shape
- Live board: [`SCRATCHPAD.md`](../../SCRATCHPAD.md)
- Doc map: [`../README.md`](../README.md)
