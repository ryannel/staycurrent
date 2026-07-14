# Slice 4.2 — workbench: Loop Rehearsal

**Owner service:** workbench

**Surface:** workbench

**Complexity:** M

**Prerequisite:** Slice 4.1 merged

## Scope

This slice proves the loop's machinery end to end before the operator bets a live run on it: convene → staged authoring → gate → cut v2, the honest no-cut, and the zero-trace discard, each driven through the real CLI against a git-initialized fixture copy of the live topic. The operator's real run at the milestone close is then a first performance, not a first execution — every mechanical path it depends on has already closed once. This is the rehearsal, not the hypothesis test: the milestone's headline (`test_milestone_4_loop-closes.py`'s run test) stays red until the operator's own run resolves against the real tree.

**Required Capabilities:**
- A fixture repository (a git-initialized copy of the real `topics/databases/` tree, staged `site.config.json`; the CLI resolves its root as `process.cwd()`, so the rehearsal runs the repo's own `workbench/cli.mjs` as a subprocess with `cwd` at the fixture root — its `../core/dist` import resolves relative to the CLI file, no copy needed; the site-build assertions use `STAYCURRENT_REPO_ROOT` as established) supports the full cut path: `convene databases` opens a session (frontmatter flips `in-research`, session file exists), v2 artifacts authored into `.staycurrent/staged/databases/` exactly as the writer skill directs (article rewrite with version 2, changelog `## v2` mini-essay with a `**Stance:**` line, provenance with ≥1 entry, skill snapshot riding unchanged), `gate databases` reports PASS across all eleven checks, and `cut databases` lands exactly one commit `cut(databases): v2` — changelog top entry v2, `versions/v2/` complete, frontmatter back to `current` at version 2, `git status` clean.
- After the cut, the site pipeline renders the new state from the fixture root: the changelog page shows v2 standing alone above v1, `/databases/v/1/` becomes the archived render with the superseded banner, and the feed carries the v2 entry — the same build the deployed site would run (per `02-data-flows.md`; build via `STAYCURRENT_REPO_ROOT`).
- The no-cut path on a second fixture session: `log databases --line <finding>…` writes the research-log entry (`## <date> — no-cut`), updates `last_researched`, lands exactly one commit `log(databases): no-cut`, and cuts nothing — no version increment, no changelog entry.
- The discard path leaves zero trace: `convene` then `discard databases` deletes the session file, reverts `in-research`, stages nothing, commits nothing — `git status` clean, `research-log.md` unchanged.
- Every mutation in all three paths is attributable to the machinery: the fixture repo's `git log` shows only the seeded baseline plus the machinery's own commits, and the diffs touch only files the session, gate, and cut mechanics own — the zero-hand-edits invariant, asserted mechanically.

## Design

Drives the Research-Run Flow and Version-Cut Flow in `technical-design/02-data-flows.md` through the CLI contract in `technical-design/03-api-design.md` § workbench/cli.mjs (`convene`, `gate`, `cut`, `log`, `discard` — exit codes and output strings normative), over the stores in `technical-design/04-data-design.md` (session file, staged tree, changelog, research log, version snapshots), against the eleven-check gate (change-proposals 6 and 7). The staged artifacts follow Slice 4.1's writer-skill rules — the rehearsal authors what the skill directs, through the same paths.

## Proof of work

**Proves:** The loop's every resolution — cut, no-cut, discard — closes mechanically through the real gate and cut mechanics against a real topic tree, leaving exactly the commits and files the design says and nothing else.

**How we prove it:** Run the three paths end to end through the real CLI against the git-initialized fixture copy: observe the cut path yield one `cut(databases): v2` commit whose tree passes the eleven-check gate and whose site build renders v2's changelog entry standing alone with v1 archived; observe the no-cut path yield one `log(databases): no-cut` commit, a dated research-log entry, and no new version; observe the discard path yield zero commits, zero staged residue, and an unchanged research log. In every path, diff the fixture repo against its baseline and confirm each changed path belongs to the machinery's contract — the mechanical form of "zero hand-edits". The repository's own `topics/` is never touched.

**Test file:** `tests/bets/first-living-topic/test_slice_15_workbench_loop-rehearsal.py` — generated red at Delivery start; traces to the Research-Run and Version-Cut Flows in `technical-design/02-data-flows.md` and the CLI contract in `technical-design/03-api-design.md`.
