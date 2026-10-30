# Core relational prose-independence repairs

Worker repair record, 30 October 2026. Scope: the 24 worker-owned articles in `reviews/baseline-core.md`. The coordinator owns the other eight core articles and the shared skills, checks and integration. No coordinator-owned article or skill was changed by this worker.

## Method and coverage

Applied the revised write, revise, continuity, figures and review skills, with the editorial and teaching perspectives. Read the complete explanatory prose of every assigned article before repair, then reread every complete repaired article with diagrams and animations absent. The second reading excluded full `Figure` wrappers, inline figures, captions, labels, controls, SVGs, styles and scripts. SQL, code examples and semantic result/comparison tables remain textual explanation; source-defined SQL was consulted where the extractor retained only its variable name. Clipped read output was recovered. Later local clarity repairs were reread in their surrounding context.

The repairs replace scene directions with the subject's setup, causal mechanism and outcome. Existing sound development remains. Necessary scenarios formerly supplied only by visuals now appear in prose; technical limits and unknown-outcome distinctions remain explicit. This is the worker's repair and continuity pass, ready for the coordinator's independent confirmation, not a claim that the entire collection is approved.

| Article | Repair and continuity decision | Complete repaired prose reread |
| --- | --- | --- |
| access-control | Established authentication/application/database authority separately; stated inherited tenant 10 context leaking to tenant 20 and the invalid `(10,4)` reference directly. Kept access rules distinct from integrity. | Yes |
| aggregation | Recast grouping, condition placement and window-frame comparisons around their input populations and results; removed scene tours and figure provenance from prose. Preserved five-line quantities and logical-result scope. | Yes |
| application-sql | Explained borrowed connection lifetime and the three loader strategies directly. Added rollback, discard and unknown-commit obligations beside the success path instead of delegating them to Figure 5. | Yes |
| backups | Introduced the base/consistency-WAL/A/B/C dependency before explaining the missing-B failure; stated target branches and provider lookup outcomes independently. Preserved restored 29.00 order, known 10.00 payment and 19.00 due. | Yes |
| capacity | Distinguished the two-client application queue from a database table-lock wait. Recast rollout overlap and bounded/unbounded admission assumptions directly, retaining illustrative rates and deadlines. | Yes |
| cluster-change | Stated durable-but-unapplied learner progress, isolated voter pairs and old/joint/new voting conditions. Kept majority arithmetic and catch-up capacity assumptions consistent. | Yes |
| distributed-commit | Added both order-first and stock-first partial-purchase outcomes. Recast prepare, refusal, durable decision and replicated D1/D2/D3 recovery cases as protocol reasoning. Kept native optimisations distinct from the teaching protocol. | Yes |
| distributed-snapshots | Made common timestamps, clock counterexample, TrueTime reasoning, n6/n8 follower progress and interval intersections complete in prose. Kept timestamps and log positions separate. | Yes |
| distribution | Defined logical owners versus physical copies and customer routes directly. Added the durable-majority/apply/reply sequence with Raft's current-term qualification; explained split and common-snapshot cases without controls. | Yes |
| failover | Established the surviving application connection and failed monitor path that permit split brain. Explained independent fencing, candidate histories and rehearsal outcomes directly. | Yes |
| incidents | Supplied the sequential 600/300/100 ms timing assumptions, lock holder H and borrowed/queued populations. Stated 12/8/4 GiB headroom against 6 GiB repair need and explained recovery order. Split dense timing prose after integration feedback. | Yes |
| indexes | Supplied physical-layout/search premises, selected order populations, root/leaf/page reasoning and index-only visibility limits. Recast key/payload/partial-membership maintenance without figure settings. Split the paid-order/LIMIT paragraph after integration feedback. | Yes |
| locks | Set up the competing stock updates, commit-dependent recheck, common authority protocol, stale Repeatable Read view, cycle and non-cyclic wait chain directly. Clarified the commit condition in the final reread. | Yes |
| outboxes-jobs | Explained send/commit gaps, receiver repeat contract, durable lease, empty-poll limit, generation 7→8 takeover and stale-generation rejection directly. Kept fencing distinct from equal-generation deduplication. | Yes |
| pagination | Stated inserted 203/deleted 202 offset outcomes, key continuation, moved-row effects and the paid/pending snapshot export contrast directly. Preserved sort-key assumptions. | Yes |
| partitioning | Explained monthly bounds, pruning, key identity and the mid-month retention limit without controls. Kept routing/pruning separate from business identity and deletion authority. | Yes |
| placement | Introduced voter survival cases, illustrative 40/90 ms costs, A/P/G ownership and current/historical read consequences directly. Kept geographical constraints and coordination costs distinct. | Yes |
| query-execution | Rebuilt the report operator/grain sequence in prose and supplied the measured 20,158-order versus 1,002-group comparison. Stated 2,000 lines→four partial→two final groups. Split measured-plan causal steps after integration feedback. | Yes |
| replicas | Explained received/durable/applied progress, qualified-target/wait/fallback choices, monotonic read, backlog arithmetic and surviving-candidate evidence directly. Kept replication separate from backup. | Yes |
| retry-outcomes | Stated the possible unknown-commit histories, atomic recorded result and competing A/B attempts without animation instructions. Preserved same-request/payload checks. | Yes |
| schema-change | Explained stale guards, late P11 insertion and missing-versus-incorrect acceptance directly. Made the illustrative P11-before-P3 text ordering an explicit scan assumption. | Yes |
| storage-durability | Explained shared-page cache, version retention, WAL-before-data ordering, crash outcomes, checkpoint/log-tail recovery and write amplification directly. Removed repeated cache setup during reread. | Yes |
| transactions | Explained rollback after mug allocation, commit/recheck alternatives, snapshots, write skew, possible Serializable winner and fresh-decision retry directly. Preserved order 103 and 29.00 payment limit. | Yes |
| writes | Recast assignment/delta replay and the sealed B17 interruption/resume sequence around durable source identities. Preserved importer authority, existing stock and PGlite evidence limits. | Yes |

## Example and evidence continuity

Recovered necessary illustrative premises from the actual existing models, rather than inventing values to fit a result. Inspected the incidents `RequestTime`/`Space` components; distribution, distributed-snapshots, indexes and pagination model/data files; relational-motion distributed operations/consensus models; and PostgreSQL recovery model. These establish the retained timing, queue, disk-space, tenant, log-position, index-count, pagination and backup-chain scenarios. Their numbers are illustrative model assumptions, not fresh observations of PostgreSQL or CockroachDB.

Preserved the shared shop facts: Mina/customer 1, order 103 pending for 29.00 with P7 ×1 at 20.00 and P3 ×2 at 4.50; completed purchase stock P3/P7/P9 = 10/0/4; no initial payment. Payment concurrency and recovery are explicitly separate scenarios. B17's catalogue authority changes names/prices, never existing stock or agreed line prices. Reused tenant examples remain separate from the single-shop schema. No shared-example extension was needed.

Existing downloadable SQL and measured evidence remain unchanged. In particular, query-execution evidence remains `/relational-rebuild/query-execution/report-evidence.json`; the report explains fixture-specific counts rather than generalising them into guarantees. Retained statements about prior PGlite execution describe the existing native evidence; this worker did not rerun those experiments. Native components, fixtures and downloads were not changed.

## Primary-source checks

Targeted source reading checked the consequential mechanisms exposed more fully in prose. These checks support the explanatory repair; they do not turn schematic timings or schedules into measurements.

- [PostgreSQL 18 transaction isolation](https://www.postgresql.org/docs/18/transaction-iso.html): statement/transaction snapshots, update wait/recheck, write skew and serialization retries.
- [Explicit locking](https://www.postgresql.org/docs/18/explicit-locking.html): lock lifetime, ACCESS EXCLUSIVE read blocking and deadlocks.
- [Row security](https://www.postgresql.org/docs/18/ddl-rowsecurity.html): grants versus policies, read/write checks and owner bypass.
- [WAL introduction](https://www.postgresql.org/docs/18/wal-intro.html), [warm standby](https://www.postgresql.org/docs/18/warm-standby.html), and [continuous archiving](https://www.postgresql.org/docs/18/continuous-archiving.html): durability/replay distinctions and complete recovery paths.
- [Multicolumn indexes](https://www.postgresql.org/docs/18/indexes-multicolumn.html), [index-only scans](https://www.postgresql.org/docs/18/indexes-index-only-scans.html), and [partitioning](https://www.postgresql.org/docs/18/ddl-partitioning.html): search bounds, visibility requirements and partition constraints.
- [node-postgres transactions](https://node-postgres.com/features/transactions): one client for transaction work, rollback and release.
- [Raft paper](https://raft.github.io/raft.pdf): current-term commitment and joint majority changes; [Consensus on Transaction Commit](https://lamport.azurewebsites.net/video/consensus-on-transaction-commit.pdf): atomic commitment and blocking.
- [Spanner paper](https://www.usenix.org/system/files/conference/osdi12/osdi12-final-16.pdf): uncertainty, commit wait and safe historical reads. [CockroachDB transaction layer](https://docs.cockroachlabs.com/docs/stable/architecture/transaction-layer), especially Closed timestamps and Read refreshing: closed-time promise, required applied log position, and validation of earlier reads after timestamp movement.
- [Chubby paper, section 2.4](https://storage.googleapis.com/gweb-research2023-media/pubtools/4444.pdf): increasing lock generations and receiver validation of sequencers. The example's equal-generation repeat limitation follows its explicitly stated receiver contract.
- Reused the coordinator's shared checks of PostgreSQL 18 constraints, datetime and integer division for those unchanged cross-article claims. No new claims about normalisation were introduced here.

## Verification and remaining integration work

`git diff --check` passed. Source comparison against HEAD found no changed link multiset or inline figure, SQL component, code component, script or style blocks across these 24 articles. Routes, statuses and imports remain unchanged. A prose-only scene-reference scan was used as a locator and its remaining hits inspected; none delegates explanation to a figure. It was not treated as proof of teaching quality.

No build, new database execution, browser/control test or publication was performed by this worker. The coordinator owns integrated build/site checks and the independent rendered-DOM reading with all visuals removed. Those checks may identify further local repairs without invalidating the full-read coverage above.
