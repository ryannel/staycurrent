# Relational depth review verification

This review covers 26 non-PostgreSQL relational reading destinations. The original
commission and article decisions are recorded alongside the independent initial
reviews, uncued first reading and assembled editorial rereads. PostgreSQL's eleven
rebuilt chapters remain onward reading; their earlier publication is not counted
as new work here.

Six chapters received substantive operational examples: isolation, schema changes,
backup/recovery, access control, product comparison and adding another system.
Four new browser lessons cover composite index order, join work, row-policy
composition and outbox delivery. The sandbox now contains 43 lessons and 238 steps.

## Executed evidence

- Native PostgreSQL 18.6: repeated reads, write skew, Serializable rejection and
  complete decision retry, unchanged control-row limits, both backfill/write
  orders, three-connection DDL queue/timeout, policy composition, atomic outbox
  delivery, index order and join plans. Each focused record asserts its important
  result rows and changed condition.
- PostgreSQL and SQLite comparison: the exact two-read schedule is observed on
  both engines, including SQLite's stale-snapshot write failure. MySQL and SQL
  Server rows are explicitly documented expectations, not claimed executions.
- Recovery: logical dump/restore plus a separately created physical base/WAL
  recovery with a named boundary, later acknowledged work missing, and an
  incomplete archive failing to reach the target despite a valid base manifest.
- PGlite: all 43 lessons execute with their intended SQLSTATEs and finish outside
  an open or failed transaction. Focused new-lesson assertions also compare
  returned rows, counts, plan mechanisms and the suggested variations.
- Browser: all 238 lesson steps run through the real editor, worker and result
  renderer. Completion, expected/unexpected errors, edited-query handling,
  search/filtering, cancellation, modal focus, literal output, NULL distinction,
  display limits, restart and mobile result focus are checked.
- Existing article interactions: 192 constraint combinations, 18 lookup cases,
  24 recovery states, 36 concurrent-checkout states and two fact-change layouts
  pass, including keyboard and reset paths.
- Layout: 104 article states across all 26 destinations at 390/1280 pixels in
  light/dark. A long recovery expression initially overflowed at 390; separating
  the function from its argument in prose fixed it. The repeated captures show
  no document overflow, failed images or page errors. All four new lessons also
  pass 16 corresponding layout states.
- Media: baseline capture covers 188 native figure states. The six repaired
  chapters have 16 figure states; the new recovery and outbox diagrams received
  independent representation and phone/desktop review. Screenshots under
  `visual/` and `choices/visual/` preserve representative inspected states.
- Links: the built-site audit checks 2,750 internal route, fragment, download and
  lesson references, with no missing target or unknown lesson. External claims
  are checked against primary references in each author/reviewer evidence record.

The browser filter test initially assumed one index lesson. The new catalogue
correctly has two. Its assertion now derives the expected count from article
membership, including article fragments, and the complete browser suite passes.
This was a test expectation repair, not an application defect.

## Limits and publication

The local data is deliberately small. It establishes semantics and observable
mechanisms, not production capacity, failure-domain coverage or recovery time.
Single-database browser models do not claim to run distributed systems. Server
worksheets and the physical drill provide the separate process/connection work
where that distinction matters.

The initial uncued reading of all 26 pages is complete. Its four required
clarifications explain NULL-aware validation, JOIN USING, DELETE USING and
concrete input conversion. Those repairs passed independent source and editorial
review. The final continuous reader accepted all six expanded articles and the lifecycle
clarification, with no remaining required explanation or prose-flow repair.
Publication verification remains.
The final site build currently passes all 62 pages.

## Plan presentation repair

Native screenshots exposed an obstacle to the two plan-reading lessons: padded,
proportional table rows broke up the plan hierarchy. The renderer now marks only
EXPLAIN responses with the single QUERY PLAN column. Those cells use compact,
unwrapped monospace lines inside the existing focusable scroll region. The phone
grid uses a zero minimum track size so long lines scroll within that region.
Literal text rendering, ordinary result tables, NULL labels and worker output
budgets remain unchanged. Four targeted phone/desktop and light/dark checks verify
indentation, keyboard scrolling, no page overflow, hostile-looking literal text,
an ordinary SELECT using the same column name, and the long-cell truncation notice.
The independent reviewer accepted all four resulting captures and the code.

A full browser rerun was interrupted when a final rebuild briefly replaced its
served files. That run is not counted as a pass; the final rerun uses the stable
built output. The earlier complete run and focused SQL evidence remain recorded.

The stable-output rerun after the plan presentation repair passed all 238 browser
steps and the complete UX checks. The final native comparison of missing, unequal
and doubly missing validation fields also matched the new explanation.

The isolated PostgreSQL review server under
`/private/tmp/staycurrent-relational-depth/data` was stopped cleanly after all
native verification. The physical restore script had already stopped each of
its separately owned clusters. No existing database service was used or stopped.

The sequential reader inspected every supplied initial native figure at desktop
light, plus seven dense phone/dark samples, with no further consequential meaning
or visual finding. This supplements the complete responsive capture metrics; it
does not claim manual inspection of every possible interactive state.

## Final review disposition

Completed 16 October 2026. The uncued initial reading, informed technical review,
independent assembled editorial reread, native figure review and revised continuous
reading are preserved separately under `review/`. The final reading resolves all
four original required teaching gaps. Optional answer-pacing preferences remain
visible in the log; they do not leave an explanation or working example incomplete.
The source is ready to publish under the user's existing explicit instruction.
