# Practitioner review · article · a00, a03 · 26811e2492010b4e35ccdb8c4fc2a165fa3fa5ac

Inputs read: both complete `src/articles/relational-trial-3/{a00,a03}.astro` pieces, their current figure/model components and a03 worksheet; fixed manifest `versions/r02-output.json` (all hashes matched); relevant root, parent, sibling and child plans in `docs/coverage/relational-2026-10-19.yaml`; `docs/article-work/relational-writing-2026-10-19/registry.json`; canonical `docs/coverage/relational-example.md`; supplied current raw evidence `r02/a00-repair-evidence/native-56511.json` and `r02/a03-repair-native-56520.json`; both rendered preview pages; linked primary documentation listed in [practitioner evidence](practitioner-evidence.md). Review instructions and practitioner perspective match `005ab6f`. Commission: intelligent engineering newcomer towards expert practice with minimum reader effort, controlled unpublished trial. Earlier article versions, reports, decisions, repair/writing/run/results notes and other perspectives were withheld and not consulted. Historical disagreement text within the required canonical example was treated only as context, not as an instruction or evidence about these pieces.

Highest severity: none

## Checks

| Check | Result | Note |
| --- | --- | --- |
| Correctness | pass | Both whole pieces checked. Schema/query semantics, update rechecks, snapshot timing, uniqueness, lock limits, serialisable repair, error/retry boundaries, durable acknowledgement and engine contrasts agree with primary documentation and current SQL. Sources and claim groups are named in the evidence record. |
| Evidence | pass | Model/observation boundaries are explicit. Both PostgreSQL 18.6 records support the stated outcomes; in particular the combined lock/count returns 1, then a fresh command returns 2. Current downloadable worksheet files match source. No unrun crash, restore, replica, production throughput or other-engine execution is presented as observed. |
| Coverage | pass | a00 delivers the complete order reservation and useful next questions; a03 teaches invariant/boundary selection, conditional and optimistic changes, uniqueness, snapshots/locks, multirow write skew and complete serialisable repair, deadlock/retry judgement, unknown outcomes and hostile-schedule testing. Awkward failure paths are addressed. |
| Depth, both ways | pass | Missing: no required practical outcome identified. Excess: no unnecessary specialist treatment identified. The compact physical/recovery/selection explanations in a00 and mechanism model in a03 enable decisions; full client, recovery and changing-set protocol machinery stays contextual. |
| Ownership | pass | a00 supplies a usable first answer before a03 deepens concurrency. a03 owns local transaction reasoning and a worked fixed-set serialisable repair; deeper lock/isolation protocols, application outcome recovery, external delivery and physical/service recovery are handed off. No second full treatment found within the reviewed pair. |

## Findings

None at critical, medium or low severity. Finding numbering remains available from practitioner-1.

## Limits

This is a complete practitioner review of both assigned pieces, not a corpus certification. Neighbouring bodies and production deployments were outside the input boundary; ownership is assessed against their plans and the reviewed pair. Read both rendered previews in a hidden browser, checked canonical initial figure values and read every scripted state in source; no screenshot-based layout audit or exhaustive UI playback. Reused the supplied native evidence because the claims and current worksheet matched; no new native execution. Selected schedules plus documentation do not establish every writer's compliance or real failure survival, and the articles say so.

Started: 2026-10-21 20:05:36 UTC (first recorded clock). Ended: 2026-10-21 20:08:40 UTC, including source checking, report writing, saved-file verification and cleanup. Temporary browser tab closed. No database processes or clusters created, so none required removal. No article edits, build, subagents, commit, push or publication.
