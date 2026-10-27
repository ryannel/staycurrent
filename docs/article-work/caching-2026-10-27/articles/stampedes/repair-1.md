# Repair, round 1: Cache stampedes and the thundering herd

Saved by the orchestrator from the repair agent's final report: the disk filled
(ENOSPC) before the agent could write this file. The orchestrator also made the
one edit the agent could not: the sentence "Check which your server has…" now
follows the Lua script instead of separating it from its lead-in. The final
full re-capture of `screens/` was cut off; `screens/use/` holds the screenshots
taken while repairing. The stale, XFetch, write-delete, many-keys and choosing
sections were proof-read in source but not re-read in the rendered page after
the last edits, so the final review must read them rendered.

Files changed: `src/articles/caching/stampedes.astro`;
`src/components/caching/stampedes/` (XFetchTimeline, XFetchSize, PoolFigure,
ColdStartFigure, StaleFigure, sequences.mjs, xfetch-model.mjs, stampedes.css);
`evidence/stampedes-scripts/` (lab.mjs, resp.mjs); `evidence/stampedes.txt`
(appended "Round 1 repair"). Shared toolkit untouched. Redis 8.10.3 on port
7116, temporary directory, `--save ''`, shut down afterwards.

## Required

- **Teaching R1 / technical R1 (hit ratio):** now "about 99.7%".
- **Teaching R2 / technical R2 (H(y)):** H(y) defined as refreshes expected to
  have started by the time y seconds are left; the first refresh comes where H
  reaches 1; H at the first start averages exactly 1, with the reason (a
  property of independent random events); "Euler's constant" became "γ ≈ 0.577,
  the Euler–Mascheroni constant"; xfetch-model.mjs `fastCycle` comment
  corrected; the result (e^(1/β), the rate drops out) now comes first and the
  derivation is marked as optional reading (teaching S2).
- **Paper bound (orchestrator note):** one paragraph: Theorem 7 stated as an
  upper bound (at β = 1, e − 1/e); simulation and the paper's Goodreads
  experiment both give more; the gap "appears to come from" the Lemma 16 step,
  which uses a refresh probability no higher than at the start of the rebuild
  window and so undercounts; "not confirmed with the authors" kept. The source
  note carries the exact expression, the reviewer's agreement, and that the
  Goodreads trace is bursty.
- **Technical R3 (serve-stale re-check):** the lock winner re-reads `PTTL` and
  refreshes only if the copy is still stale, with the reason; Figure 7's
  caption says so; the lab's stale strategy re-checks (port settable with
  LAB_PORT, 7106 or 7116). Re-measured over 8 runs of 30 s each way (seeds
  7–14): without the re-check, 4 of 8 runs sent 6 or 7 queries instead of 5;
  with it, all 8 sent 5 and the re-check turned away 8 duplicate refreshes.
  Warm-key cycles re-run; prose quotes lock 5 queries, 535 waiting, slowest
  236 ms; stale 5 queries, 523 stale, slowest 35 ms.
- **Teaching R3 (a write that deletes a hot key):** new section "When a write
  deletes a hot key" after XFetch. It names the narrower thundering herd;
  single-flight and the lock still work, serving stale has nothing to serve,
  XFetch cannot act ahead of a write; remedy is to mark the copy stale on write
  (`PEXPIRE trending 5000`, at most 5 s of the old copy if the refresh fails).
  Links to Cache invalidation and consistency through ArticleRef. The table
  gained an "After a delete on write" column; the "Can readers accept…"
  question and the closing paragraph were updated; forward pointer in the size
  section and the narrower sense of thundering herd in the opening (teaching
  S4).
- **Teaching R4 (Figure 8):** one cycle at a time; each rebuild has its own
  numbered lane (six lanes, "first 6 shown" when more); bars drawn only up to
  now during a cycle; when the copy is stored, the cycle holds for 1.5 s
  simulated with a "stored" marker and "New copy stored: N rebuilds for this
  expiry"; own legend matching the drawing; request dots use the shared
  `dotShape` (the new smaller dots); caption and text alternative updated.
- **Teaching R5 (Figure 9):** caption gives the paper's Theorem 7 expression at
  each β as an upper bound (2.35 at β = 1); prose says "The paper's line,
  dotted"; the "Chosen β" dotted series replaced by a labelled marker (β = 1).

## Suggested, applied

- S3: "Many keys expiring together" moved before the cold start.
- S5: queue chart first; the prose leads with it (queue above 1 s for about
  12 s without coalescing, about 4 s with, so nearly every querying miss gives
  up; checked against the model); series renamed "No coalescing"; readouts
  split and coloured by series; Zipf explained in the caption (S15).
- S6: Figure 2's axis in seconds; markers for when the copy is stored, when the
  other page's query arrives and when it gets a connection.
- S7: "e to the 1/β" in labels; lead readout "5.2 (5.2)" with "(formula)";
  neutral lead and late readouts.
- S8 (in part): short lane labels A, B, C on phones in Figures 4 and 6.
- S9: paragraph on finding stampede-prone keys, linking articles 10 and 11.
- S10: Vattani named; link with `hash="read-through"`.
- S11: lease paragraph trimmed. S12: lock limits as a three-item list; fencing
  tokens defined. S13: "query" notes for B and C. S14:
  `db.trending(timeout=2.0)`. S15: "ninety-nine of them are wasted".
- Technical S2: independent arrivals stated; bursty traffic gives more. S3:
  Figure 9 values sampled exactly from the Poisson model. S4: "more than twice
  as early". S5: crashed-holder cost (up to about 2,500 failed views) and three
  mitigations. S6: polling-load formula, single-flight in front of the lock,
  jittered poll interval. S7: XFetch real run 2.75 over 28 expiries and 2.14
  over 29 (each about ±0.4); the derivation carries the claim, the runs show
  the code works and the lead matches (1,028 and 1,036 ms against 1,036
  predicted), no request missed; "77 of 78" dropped. S8: timeout enforced by
  the database (`statement_timeout`, `MAX_EXECUTION_TIME`); Figure 6's setup
  named as the misconfiguration. S9: "or extending the lock". S10: background
  refresh still needs a protected miss path. S11: Valkey 9.0 `DELIFEQ` (checked
  against valkey.io); warning that an unknown command in release code hides the
  rebuild's error; `IFEQ` removed from the SET source entry. S12: line 108
  compares with single-flight; XFetch code comment explains PTTL −1.

## Skipped

- Figure 6 phone notes overlapping step numbers on lane A: placed by the shared
  sequence code, which repairs may not edit.
- Teaching S1 in part: the paper paragraph trimmed to the bound, the evidence
  and the Lemma 16 step; Goodreads detail moved to the Vattani source note.

## Checked

Model tests: 10 pass. Figure 8 stepped through 24 s at β = 1 (desktop, light)
and β = 0.5 (375 px, dark); Figures 4 and 6 stepped to the end with both
release options; Figure 2 at rates 100 and 1,000; Figure 9 at rate 10 with β
0.5 and rate 10,000 with β 2; Figure 10 at capacity 60 and 160; Figure 7
stepped 9 s. No page errors. Screenshots in `screens/use/`.
