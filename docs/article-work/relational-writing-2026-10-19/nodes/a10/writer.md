# a10 writer handoff

Status: staged draft complete; return for orchestrator-managed review.

Owned outputs:

- article.astro, sources.md, native-results.txt and this report in this node.
- src/components/relational-next/a10/: four mechanism models in model.ts,
  ConstraintFigure.astro and the native SQL fixtures/checks.

The staged fragment imports as it will resolve from src/articles/relational-next/a10.astro.
No final src article, shared file, build, commit or nested review was created.
All assigned section anchors are preserved; figures contain no heading elements.

## Teaching and scope

The article extends a01's organisations/class bookings with room reservations and
states that it does not change the parent’s one-retained-booking-per-pair policy.
It derives required values and candidate keys, whole tenant-scoped relationships,
conditional uniqueness, deferred circular references, state-scoped interval
exclusion and reference actions. The final enforcement map includes change paths,
counterexamples and the parent’s still-unprotected capacity rule.

Four figures let the reader predict, step, play and change an assumption while
retaining the current step: whole-key matching, partial-index set membership,
deferred required-lead creation and actual interval comparisons. Room/start/state
changes move the interval mark; textual status also conveys acceptance. Phone
layout stacks the two fact cards and comparison gates instead of shrinking labels.
Default text transcripts and the finished default board are rendered without JS.
Controls remain focusable at playback endpoints; clicks clamp to the endpoint.
Playback is explicit, pauses offscreen/on hidden document, holds each narration at
180 words/minute plus 1.8 s inspection, and does not run on parameter changes.
Reduced-motion mode removes transitions while preserving manual and timed steps.

Value representation, equality and input conversion link to a09; dependencies,
reshaping and derived-count contracts link to a11; temporal meaning and retention
link to a12. The article names expected acceptable concurrent outcomes without
duplicating transaction schedules or live-rollout procedures. No children are planned.

## Verification

- Astro compiler transform: staged article and component, zero diagnostics.
- TypeScript strict no-emit check: figure model and extracted browser script passed.
- Deterministic model traversal: 22 parameter combinations × 4 steps passed;
  explicit wrong-tenant, current replacement/reactivation, deferred final-state
  and every overlap/start/resource/state outcome assertions passed.
- Native PostgreSQL 18.6 schema and sequential failure matrix passed. The additional
  actual missing-lead COMMIT rejection is intentionally visible in native-results.txt
  and followed by an assertion that the invalid reservation was not committed.
- Fresh article databases cleaned up after retaining evidence; shared server untouched.

Full site build, theme check and central browser review remain with the orchestrator
as assigned. The worker did not occupy the fixed browser review preview or run pnpm build.

Root delivery preflight removed trailing alignment spaces and the extra blank line at EOF from the psql transcript before independent review. Observed values and checks are unchanged.

## Root teaching repair, 20 October 2026

Shared playback now counts the visible board (cards, gates, interval labels and result) plus narration at 180 words/minute, with three seconds for inspection and a six-second minimum. Hidden interval labels are excluded by innerText. Native SQL, models, prose and manual controls are unchanged.
