# Practitioner review · article mode · batch06 · v01

Inputs read: [frozen manifest](v01/manifest.json), all five complete `source/src/articles/relational-collection/{r15,r18,r19,r20,r21}.astro` files, their figure markup and scripts, imported core data, briefs, commission, shared example and bounded parent/sibling/child plans. Current preview: `http://127.0.0.1:4440/review/relational-collection/`, exact storage, crash-recovery, backup-and-restore, replicas-and-read-routing and failover routes. Read the complete final Sources/disclosures, including the collapsed rendered Sources. Read [mechanical applicability](v01/mechanical/applicability.md), native verifiers, results, provenance and supporting command records. Current review skill and practitioner perspective only. No author quality notes, peer reports, history or live later article versions were inputs.

Highest severity: none.

This is independent initial article coverage, not final complete or corpus review.

## Checks

| Piece | Check | Result | Note |
| --- | --- | --- | --- |
| r15 | 1. Correctness | pass | PostgreSQL heap versions, snapshot visibility, changing/reusable ctid, both HOT conditions and BRIN exception are accurate; InnoDB undo is identified as a different design. |
| r15 | 2. Evidence | pass | Native tuple counts, addresses and heap sizes match the frozen verifier/results. The six-step figure is explicitly conceptual. |
| r15 | 3. Coverage | pass | Explains retained snapshots, delete/abort cleanup, reusable space versus shrinkage, rewrite locks/space, index work and diagnosis before maintenance. |
| r15 | 4. Depth, both ways | pass | Enough physical detail to explain growing files and write amplification; no missing decision-critical mechanism or unnecessary specialist derivation identified. |
| r15 | 5. Ownership | pass | Gives a useful storage answer; leaves PostgreSQL process/page details, vacuum age and WAL operations to r31/r32/r36. |
| r18 | 1. Correctness | pass | WAL-before-data and durable acknowledgement are distinct; uncommitted replay remains invisible; checkpoint redo, full-page images, async commit and fsync risks are correctly separated. |
| r18 | 2. Evidence | pass | Native restart retains all103 effects and excludes unfinished scratch insert. Process restart is not represented as a power or disk-loss test. |
| r18 | 3. Coverage | pass | Covers missing reply, storage flush contract, group commit, checkpoint cost, cold recovery and committed mistakes. |
| r18 | 4. Depth, both ways | pass | Explains the recoverability argument without becoming a settings catalogue. No material missing or excessive depth found. |
| r18 | 5. Ownership | pass | Native WAL controls remain in r36; backup history and remote durability remain in r19/r20. |
| r19 | 1. Correctness | pass | Logical versus physical bases, continuous WAL, dependency retention, timeline/target boundaries and closed-history reconciliation are sound. |
| r19 | 2. Evidence | pass | Named pre-mistake target, exact excluded107 history, fence race and serial idempotent replay match the verifier/results. External effects are explicitly absent. |
| r19 | 3. Coverage | pass | Includes credentials/keys/failure domain, RPO/RTO route, target inclusion, in-flight/uncertain requests, stock effects and provider authority. |
| r19 | 4. Depth, both ways | pass | The detailed107 example earns its place by proving why startup alone is insufficient. Native command mechanics are delegated. |
| r19 | 5. Ownership | pass | Owns the general recovery/acceptance contract; r37/r50 own engine procedures and r21 owns cross-server authority. |
| r20 | 1. Correctness | pass | Receipt, durable flush and replay differ; synchronous acknowledgement depends on configured candidates; progress must precede a fresh snapshot on the right history. |
| r20 | 2. Evidence | pass | Paused receive/replay positions, fresh1/old0 visibility and complete stock effects match native records. Figure positions0–2 are illustrative. |
| r20 | 3. Coverage | pass | Gives read contracts, bounded barrier fallback, history identity, lag interpretation, query/recovery conflict and slot-retention trade-offs. |
| r20 | 4. Depth, both ways | pass | Enough for routing judgement, without product setup or distributed timestamp internals. |
| r20 | 5. Ownership | pass | Promotion, native physical setup and common distributed snapshots remain r21/r38/r28 responsibilities. |
| r21 | 1. Correctness | pass | Timeout is suspicion; routing is not fencing; promotion does not merge branches; synchronous candidate choice and rewind/reseed boundaries are sound. |
| r21 | 2. Evidence | pass | Dual-writer scratch counterexample and separate known-tail103 loss/reconciliation/rejoin match the verifier. Local process fence is honestly bounded. |
| r21 | 3. Coverage | pass | Includes candidate history/loss uncertainty, stale connections, uncertain requests, complete effects, traffic acceptance and restoration of redundancy. |
| r21 | 4. Depth, both ways | pass | Mechanism detail supports the authority decision; production fencing integration is appropriately a test obligation rather than an invented guarantee. |
| r21 | 5. Ownership | pass | General transfer is useful independently, with commands/rejoin prerequisites and geographic voting left to r38/r29. |

## Evidence and applicability

All manifest-listed bytes independently hashed with no mismatch. Independently compared recorded source hashes for each article, component and native verifier to this packet; all applicable hashes match. Imported core and shared stepper dependencies are frozen in the manifest. The review's audit is [hash-applicability.json](../practitioner-working-v01/hash-applicability.json). Metadata/writer-record hash entries were not treated as quality inputs or read as author records.

The native records apply to PostgreSQL18.6 Homebrew, arm64 macOS, private generated directories/Unix sockets, TCP disabled and inherited `PG*` connection settings removed. The verifiers inspect the owned data directory before setup and after relevant restart, use only generated stores and clean them in `finally`. Commands and raw query observations were compared to their asserted acceptance, rather than treating a success flag as a verdict:

- r15: `pgstattuple`1live/1dead while the report retains20.00;1/0 after release. Heap bytes4096000 before deletion and ordinary vacuum;2048000 after compacting rewrite.
- r18: `pg_ctl -m immediate` restart;103 pending, two original lines, P3=10/P7=0, unfinished normal insert absent.
- r19: `pg_basebackup -X stream`, saved WAL, named `r19_before_bad`; mistake XID765 excluded,103 restored,107 absent. Waiting gate racer rejected; `purchase-edda-107` created then existing; final P3=9.
- r20: target0/300DC58, durable receive at target while replay0/3000000 and103 absent; after replay, fresh snapshot1, held snapshot0, stock10/0.
- r21: separate scratch dual writers; candidate stopped before103, source tail0/500BC08 versus candidate0/5000000, source endpoint verified stopped, promoted candidate initially lacks103; complete reconciliation repeated once; former primary reseeded and in recovery.

Current rendered control challenges covered all storage states, all three four-step crash cuts (before commit, durable before reply, after reply), restore reconciliation final states, progress through replay, and both route-only/enforced-fence paths. The latter finishes with the old established connection accepted or refused respectively. Figures and prose agree about the boundaries.

No fresh native rerun was necessary: exact verifiers/data and claimed outputs remain applicable, and no unresolved technical hypothesis required a new experiment. These are reused author observations subjected to independent source/claim scrutiny, not reviewer-executed native observations.

## Primary sources checked

- [PostgreSQL18 HOT](https://www.postgresql.org/docs/18/storage-hot.html), [page layout](https://www.postgresql.org/docs/18/storage-page-layout.html), [routine vacuuming](https://www.postgresql.org/docs/18/routine-vacuuming.html): physical versions, page identity, HOT prerequisites and reuse/rewrite costs.
- [MySQL8.4 multi-versioning](https://dev.mysql.com/doc/refman/8.4/en/innodb-multi-versioning.html): old values reconstructed from update undo, retained consistent-read history and purge.
- [PostgreSQL18 WAL](https://www.postgresql.org/docs/18/wal-intro.html), [asynchronous commit](https://www.postgresql.org/docs/18/wal-async-commit.html), [WAL settings](https://www.postgresql.org/docs/18/runtime-config-wal.html): durable ordering, acknowledgement levels, consistency and recovery targets.
- [Continuous archiving/PITR](https://www.postgresql.org/docs/18/continuous-archiving.html): physical base/WAL history and timeline dependencies.
- [Log-shipping standbys](https://www.postgresql.org/docs/18/warm-standby.html), [administration/recovery functions](https://www.postgresql.org/docs/18/functions-admin.html), [failover](https://www.postgresql.org/docs/18/warm-standby-failover.html): receipt/flush/replay, synchronous selection, old-primary exclusion and redundancy.

## Findings

None. No practitioner finding number allocated.

## Limits

No production workload, external provider, lost-host recovery, power interruption, torn-page injection, regional network or independent physical storage boundary was independently executed. The records themselves make those exclusions; multiple local directories/processes do not prove those failures. No RPO/RTO or production capacity result is accepted from a harness elapsed time. No download offered in these five articles. No build, source edit or publication was performed. This report does not certify teaching, editorial or visual quality, final completion, or cross-corpus ownership.
