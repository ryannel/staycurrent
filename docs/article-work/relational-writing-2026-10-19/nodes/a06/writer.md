# a06 — writer handoff

Status: ready for orchestrator-managed independent review.

## Owned files

- `docs/article-work/relational-writing-2026-10-19/nodes/a06/article.astro`
- `src/components/relational-next/a06/ChangeFigure.astro`
- `src/components/relational-next/a06/model.mjs`
- `src/components/relational-next/a06/verify.mjs`
- `docs/article-work/relational-writing-2026-10-19/nodes/a06/sources.md`
- this report

The staged fragment imports relative to its final `src/articles/relational-next`
location. Writer did not edit the final fragment, shared files, routes, registry,
server configuration or publication status; no commit, push, shared build or
nested review was run.

## Teaching and boundary

About 3,285 source words including navigation and source notes in the fragment.
The parent supplies a complete address-evolution sequence: add schema; drain old
writers; bridge protocol; guarded conversion and ambiguous-input resolution;
tighten accepted writes; switch readers with current compatibility text; close
the rollback window; retire the old representation. A second complete high-level
cutover sequence transfers exclusive write authority. Recovery and retention
sections finish both arguments, including restored-data retirement.

The three figures expose stored values and consequences at successive stages:

1. Pending versus current/review addresses and the read-switch gate.
2. A competing edit, comparing guarded and blind backfill writes at the same step.
3. Final-boundary and fencing evidence, comparing source fencing with routing only.

All have manual Back/Next/Reset, labelled selection where causal comparison is
useful, and optional Play. Playback uses current action + narration + gate at
200 words/minute plus four seconds comparison, minimum 8.5 seconds. It pauses
on hidden pages and stops at the terminal stage. Transport nodes persist and
use aria-disabled at endpoints to preserve keyboard focus. Comparison panels
stack under 600px; root owns final phone comparison checks.

The article introduces physical work and version-pinned engine checks but leaves
executable DDL, batch enumeration/progress/retry implementation and full move
procedures to a29, a30 and a31 respectively. Those children are linked in context
and again in further reading; shared wrapper supplies bottom child reading.
Transactions, application integration, performance and operations link to their
existing owners without reproducing their curricula.

## Checks and evidence

- Full three fixed reference articles and their figure text read.
- Six primary PostgreSQL 18 documents checked; claim mapping in `sources.md`.
- Native PostgreSQL 18.6 a06-only fixture passed on `rel3_a06_run1` (no shared
  server settings changed); exact statements and observed results in `sources.md`.
- `node src/components/relational-next/a06/verify.mjs` passed all 29 frames plus
  meaningful address/authority assertions.
- Astro compiler 2.13.1 parse and transform of staged fragment and component
  produced zero diagnostics. Direct top-level import was initially unavailable;
  resolving the installed compiler through Astro succeeded without installing
  anything. Full shared build intentionally left to root.
- Root-promoted dev4337 browser: three figures, causal mode comparison, dark
  rendering, Play/Pause/Reset and terminal keyboard focus checked. A dynamic-row styling issue
  found during manual stepping was repaired and visually rechecked.

Limitations are explicit in article and sources: figures are models; native
fixture checks a sequential stale-version condition, not a live migration or
measured lock/concurrency/performance experiment. No database move or recovery
operation was executed. Runtime database remains disposable and open to root
cleanup; writer sessions ended.

## Tree proposals

None. Existing child and sibling scopes fully cover the required deeper work.

## Handoff

Root may refresh the final fragment from the staged file, run shared checks,
perform fixed-preview desktop/phone review and schedule independent reviews.
No required writer-owned work is outstanding.
