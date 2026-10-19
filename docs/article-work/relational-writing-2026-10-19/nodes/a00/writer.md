# a00 writer handoff

**Ready for orchestrator-managed review.** No nested reviewer or commit.

## Files

- Staged draft: `docs/article-work/relational-writing-2026-10-19/nodes/a00/article.astro`.
- Components: `src/components/relational-next/a00/RowsFigure.astro`,
  `OrderFigure.astro`, `models.mjs`, `queries.mjs`, `verify.mjs`.
- Evidence: this directory's `sources.md`.

The fragment imports are relative to final
`src/articles/relational-next/a00.astro`, not its staged location. Root promoted
an earlier version for browser checks; **re-promote the final staged file** to
include the final customer-join clarification and expanded source links.
No worker edit was made to the final source fragment or shared files.

## Teaching and scope

The shop's order is the running case. Readers leave with a usable first account
of identity, references, result meaning, atomic changes, a conditional reservation,
the application boundary, physical work, compatible change, recovery and system
selection. Two figures teach join row multiplication and empty matches, then
transaction visibility and partial failure. The conditional update is a worked
high-level correctness choice; detailed locking/isolation and recovery protocols
stay with a03 and a04. Performance, live changes, operating procedures and candidate
evaluation each supply a useful orientation before linking their dedicated owner.

All nine reserved section IDs are preserved. Each actual child is linked in
context. The wrapper supplies the bottom reading tree. The end route table gives
the exact setup-first then a01 → a02 → a03 → a04 working route, parent-first task
paths and conditional adoption routes. No proposed tree changes.

## Verification

Native PostgreSQL 18.6 assertions passed in `rel3_a00_run1`: expected SQL results,
model agreement, NULL/count edge cases, separate commits, rollback, commit, and
two competing conditional updates consuming only the one available mug. No
server changes or other article databases were touched. See `sources.md` for
the observed results and repeat command.

Astro compilation of the fragment and two components passed without diagnostics.
Browser rendering and meaningful control changes passed on root's 4337 preview;
both light and dark figure layouts inspected. Independent review should still
check narrow-viewport layout, teaching quality and the ordinary task-path handoff.
The orchestrator will run the shared build after final promotion.

All three fixed references, including their rendered figure narratives and
controls, were read. Source checks use primary PostgreSQL 18 and SQLite docs.
Models and actual native results are explicitly distinguished.

## Runtime note

An extra reference preview was initially started on 4357 before root's 4337
restart. An elevated exact-command process lookup at handoff found no matching
4357 process. Root's 4337 and the shared PostgreSQL server were left running.

## Orchestrator repair after B01

The orchestrator repaired the two players' pacing, endpoint focus and internal
heading tags without changing this article, SQL or data models. See
`batches/b01/root-a00-repair.md` for changed behaviour and root checks; independent
teaching recheck and the final assembled build establish acceptance.
