# CockroachDB visual repairs

29 October 2026. Repairs to the five grouped Medium findings in
[distributed-operations](distributed-operations.md) and
[cockroachdb-operations](cockroachdb-operations.md). No database experiment or
application behaviour changed. The existing native evidence remains applicable.

## Changes

- **Architecture, Figure 2:** replaced the two-step highlight tour with a direct
  mapping from Mina's selected customer-index entries to primary rows 101 and
  103 and their status. Entry 102 remains explicitly outside the lookup. Removed
  playback controls and the prose instruction to step through it.
- **Architecture, Figure 4:** the local storage sequence now carries the same
  recognisable price versions from memory into a new sorted file, then shows
  input files A and B feeding replacement C. Both versions remain visible; the
  model does not imply that compaction may discard required history. The
  neighbouring explanation still distinguishes Raft history from the local WAL.
  File labels are illustrative, not a claim of one file per range.
- **Query performance, Figure 5:** replaced four boxed paragraphs with aligned
  holder and waiter lanes. A's release boundary ends B's blocked span; the stock
  change appears after that boundary. A remains a lock-only transaction, distinct
  from a complete purchase, and the widths are not observed durations.
- **Operations, Figure 2:** the tenant selector immediately shows matching rows
  and the result count. Removed four playback steps. All four stored customers
  remain visible, including the caller-controlled context counterexample and the
  empty-context result. Phone layout keeps the four rows in a compact two-column
  comparison rather than separating the selector from its answer.
- **Migration, Figure 3:** the stale original PostgreSQL copy now has a permanent
  closed/evidence position. The fresh candidate stays a distinct object before,
  during and after copying. Updated the introductory sentence and caption so they
  no longer explain away a reused actor box. The forward handover is unchanged.

Changed source: four `crdb-*` articles, the architecture figure/model/style files,
`OperationFigure.astro` and `Handover.astro`. No shared player or global CSS edits.
The remaining optional Low findings from these two reports are outside this
worker's repair scope; the coordinator owns any separately accepted polish.

## Confirmation

Read the four complete article explanations, the relevant Storage and durability
reference passage, and the revise/figures/continuity/review skills. Reread changed
introductions, captions, adjacent explanations and later uses. The running
purchase, keys, prices, tenant rows and native outcomes are preserved.

Inspected all five repaired figures in their rendered articles on the coordinator's
4328 development preview and stable 4327 production preview. Desktop and 375 px,
light and dark, were checked using a dedicated IAB tab and then a separate Chrome
review session. The latter avoided interference with other workers' responsive
checks. No horizontal overflow was observed in the repaired scoped figures.
Temporary Chrome viewport and theme overrides were restored.

The local-storage player was inspected at all four states; Next, Back, Reset,
Play/Pause and keyboard button activation worked. The return player was checked
through all five states, including keyboard progression to its endpoint, Back,
Reset and Play/Pause. The original stayed separate in initial, copied and final
views. The forward handover's six states were checked as a dependency. The tenant
selector returned 3, 1 and 0 rows for contexts 10, 20 and missing. Its shared
component's unaffected range player still completed replacement and showed the
blocked old-majority alternative correctly.

Computed theme colours were checked for the changed labels and graphics. On the
alternate surface, secondary text is 6.05:1 in light and 6.15:1 in dark; primary
text is 13.73:1 and 10.89:1 respectively. Small flush/merge labels use secondary
text rather than light-theme teal (which was only 4.36:1). Teal borders and large
lookup arrows retain 4.36:1 light and 8.16:1 dark, above the graphics threshold.
These are targeted computed-colour checks, not a new whole-site contrast audit.

Architecture model imports and every default generated frame were checked for
missing values. `git diff --check` passes for this worker's files. The coordinator
owns the final build, article linter and scoped confirmation.

## Limits

Development HMR reset early interactions while other workers edited the imported
article corpus; those checks were repeated on the stable production preview.
Continuous animation smoothness was not certified from hidden-pane screenshots.
Chrome's synthetic arrow-key menu events did not establish a changed tenant
selection. The coordinator resolved that check in IAB: opening the menu, pressing
Down and Return changed context 10 to 20, with only Rowan returned. No new technical audit or native
database rerun was required for these presentation-only changes.

Saved proof: `/tmp/relational-migration-repaired.png` shows the completed return
with the stale original and fresh authority visibly distinct.
`/tmp/relational-contention-repaired.png` shows the aligned lock and wait spans in
article context.
