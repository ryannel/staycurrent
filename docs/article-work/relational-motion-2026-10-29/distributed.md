# Distributed and operations motion repair

2026-10-29. Scope: the animated/stepped mechanisms in 19 articles. This is a visual repair, retaining the reviewed technical examples, static exact-value drawings and calculators. No new native database experiment or fresh whole-corpus technical review is claimed.

## Scene inventory

| Module | Scenes | Articles |
| --- | --- | --- |
| `distributed/operations` | lock, journey, overload, boundary, context, range, payment | incidents, capacity, access-control, crdb-operations, crdb-backup |
| `distributed/consensus` | routing, raft, regional, commit, recovery, purchase, copy, membership, backlog | distribution, distributed-commit, placement, cluster-change |
| `distributed/maintenance` | rollout, race, cursor, index, loyalty, upgrade, forward, return | schema-change, crdb-schema-change, crdb-upgrades, crdb-migration |
| `distributed/cockroach` | route, locality, raft, storage, split, commit, refresh, retry, history, follower, readiness, covering | crdb-architecture, crdb-locality, crdb-transactions, crdb-reads, distributed-snapshots, crdb-performance |

36 authored scenes. Shared familiar app/server/database actors, open paths, coloured travelling requests/records, and settled outcomes replace boxed paragraph steppers. Layouts are authored at 760 and 440 units. Branches retain the relevant differences: read contracts, durable versus applied history, prepared versus committed, old/joint/new voting sets, backfill safety, schema failure, return before finalisation, and excluded transfer candidates.

Article introductions were adjusted only where instructions referred to removed step controls or visual elements. Existing figure numbering and anchors remain; stylesheet imports were retained where unaffected static figures depend on them.

## Checks and repairs

- Imported and rendered every scene and meaningful variant at 0, .25, .5, .75 and 1: 325 sampled variant frames; no undefined or NaN geometry.
- Rendered all 325 frames in Chrome at 375 × 900 and 1200 × 900. Measured visible SVG text for clipping and intersecting labels. Repaired lock-holder status, connection status, gateway/leaseholder names, and leader durable-record placement; rechecked the affected scenes at both sizes.
- Inspected live SVG scenes and changed route stacking where paths crossed actor interiors. Both light and dark theme layouts were examined during the pass. The shared player and shell are integrated and tested by the coordinator.
- Exercised native scenario selection and keyboard Replay on the upgrade scene; selected branch remains selected. Scene frames retain every authored option. These are visual and interaction checks, not evidence of native protocol timings.
- Independent source review by the foundations worker found the later loyalty-code attempt could look like NULL was rejected. The attempt now explicitly carries TEA-7, separately from Tariq's stored NULL.
- The coordinator caught two figure-number sequences during integration. Access-control figures are 2 and 3; distributed-commit figures are 2 and 3.

## Independent PostgreSQL drawing review

Read the four new PostgreSQL scene modules and compared the changed mechanisms with retained models, original figure state definitions and article explanations. Scoped to introduced flow/state/branch regressions; no repeat native execution or new claims research.

Concrete findings sent to the PostgreSQL worker:

1. Missing-history branch ticked the later C node despite replay stopping at missing B. Repaired by that worker: C remains muted and unticked.
2. Recovery candidate stayed labelled paused while accepting the payment repair. Repaired and confirmed in source: recovery completes before reconciliation begins. A short intervening accepted-charge caption was also corrected.
3. PostgreSQL's specific consistency-WAL versus later-archive distinction was collapsed into the generic base-plus-WAL chain despite prose teaching two separate checks. Repaired and confirmed in source: a distinct `pgchain` preserves the bundled consistency-WAL stage and later archive boundary; the generic chain stays in the generic backups article.

Other reviewed branches retained their important contracts, including physical U-before-C visibility, required-history fallback/unavailability, HOT/non-HOT index entries, exact filtering before limiting, GIN rechecks, approximation choices, writer fencing, stale-source return, and provider reconciliation without a new charge. Integration and final publication remain with the coordinator.
