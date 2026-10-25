# Practitioner review — batch 19

Reviewed `distributed-commit` v01, **Transactions across partitions**, against the fixed batch-19 manifest and its plan, ownership inputs and original shared-example snapshot. All six integrated source hashes match the manifest; all 26 inspected frozen source/input/evidence/build-file hashes match `v01/files.json`. The canonical example input hash is `44656a905fac8edd2306a441e32bb91f54d7e250efaecc1b80e5c4049cd13d31`.

## Findings

No substantive practitioner or technical findings.

The stated protocol supports the promised understanding: preparation retains durable work and protection; a missing vote cannot permit commit; final recording precedes notification; prepared participants cannot use a timeout to contradict a possible decision. The classic blocking example correctly allows both participants to have prepared even though a deadline led the coordinator to abort. The replicated cases rely explicitly on authoritative agreement and recovery, rather than treating two cached copies or a replacement process as sufficient. The unavailable-quorum branch also excludes an accessible participant that already knows COMMIT, so its waiting conclusion is warranted.

The article preserves purchase-103's starting rows, 29.00 total, pending result and absent payment. It gives useful invariant-scope and latency judgement without assuming two tables mean two participants or a fixed number of round trips. Visibility/cleanup, isolation, common snapshots, caller request recovery and external effects have appropriate boundaries and onward reading.

## Evidence and limits

Checked the applicable primary passages in [Gray and Lamport, sections 2–3 and recovery](https://lamport.azurewebsites.net/video/consensus-on-transaction-commit.pdf), [Microsoft's 2PC overview](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-tpsod/e34079f0-22de-4c03-9cb8-84c2448a4613), [PostgreSQL 18 PREPARE TRANSACTION](https://www.postgresql.org/docs/18/sql-prepare-transaction.html), [Spanner's multi-split write path](https://cloud.google.com/spanner/docs/whitepapers/life-of-reads-and-writes), [secondary indexes](https://cloud.google.com/spanner/docs/secondary-indexes), [foreign keys](https://cloud.google.com/spanner/docs/foreign-keys/overview), and [CockroachDB's transaction layer and Parallel Commits](https://www.cockroachlabs.com/docs/stable/architecture/transaction-layer).

Inspected the figure model and both verifiers alongside their recorded results. The 22-state/38-transition enumeration checks only its finite abstract safety rules; it does not implement messages, elections or distributed recovery and proves no liveness. The PGlite 0.5.8 / PostgreSQL 18.3 WASM results corroborate fixed local purchase arithmetic and rollback, without testing distributed commit, concurrency or native server behaviour. The article accurately labels these schedules illustrative and reports no native cluster run or timings. Existing results were reused; no fixture reproduction was necessary.

Bounded rendering/control inspection at the supplied preview confirmed both Figure 2 terminal branches, Figure 3's recovered COMMIT and no-quorum waiting states, and reset on case changes. Calibrated against the reference Sequence diagrams message-order passage and Storage and durability recovery passage/rendering. This is technical/ownership coverage with bounded rendering inspection; responsive layout, alternate themes and the full visual/editorial review remain with their assigned reviewers. Shared themes were unchanged. No authoring verdicts or earlier reviews were read; no article edits, builds or publication were performed.
