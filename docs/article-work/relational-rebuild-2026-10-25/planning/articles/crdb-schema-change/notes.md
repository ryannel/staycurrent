# Planning notes

Fresh detailed outline for `crdb-schema-change`; no new child or ownership change proposed. The accepted collection supplies the specialist depth here. No target body, old outline, feedback, other worker notes or main-repository files were read.

## Reference exposure

Read the supplied current breakdown, writing and continuity skills. Read every bounded reference part separately through `scripts/read-writing-reference.py`, with all END markers delivered: sequences 1–6, indexes 1–7, storage 1–6. In one owned Chrome tab (`📘 Schema planner references`, no IAB surface available), studied Sequence diagrams' ordering figure through its final state, Indexes' composite-index figure at its final state, and Storage's WAL figure at the commit-reply stage. Closed the tab afterwards; no viewport or theme changes.

These references lead the sequence: establish the thing changing, follow visible data through a sufficient example, change one condition for the failure, then derive operating judgement. The WAL figure's separate evidence about what the application heard and what exists in storage is particularly relevant. The writer should choose the drawings; the briefs identify what must become visible rather than prescribe layouts or controls. Do not copy the reference articles' incidental product names, prices or native addresses into the shared shop.

Read the available replacement previews, in full:

- [Live schema changes and backfills](http://127.0.0.1:4606/review/relational-rebuild/schema-changes/): owns bridge writers, stale-worker and late-row races, convergence and return boundaries. Reuse its outcome; this article supplies CockroachDB execution and acceptance evidence.
- [Inside CockroachDB](http://127.0.0.1:4606/review/relational-rebuild/cockroachdb/keys-and-ranges/): supplies ordered index keys, ranges, replicated storage and the cost of another representation. Its three-voter drawings are models, while its observed fixture is single-node v26.2.8.

## Sources checked on 26 October 2026

Use versioned v26.2 links in the eventual article. Stable documentation was initially consulted, then checked against v26.2; do not import newer stable-only catalogue interfaces.

- [Online schema changes](https://docs.cockroachlabs.com/docs/v26.2/online-schema-changes): background execution and statement-cancellation notice; extra capacity and backfill cost; DDL transaction limitations and prepared-result-shape compatibility. Its resource caveats qualify its broad introductory promises. Prefer individually committed DDL steps. A migration wrapper's rollback message does not establish all database outcomes. Avoid an absolute no-waits/no-latency-impact claim.
- [SHOW JOBS](https://docs.cockroachlabs.com/docs/v26.2/show-jobs): identity, `status`, `running_status`, fraction, terminal error and retry evidence; requested transitions, reversion and `revert-failed`; bounded job history and separate GC work. Teach selected states through the example, not an exhaustive state catalogue. Job completion and physical storage reclamation require different observations.
- [PAUSE JOB](https://docs.cockroachlabs.com/docs/v26.2/pause-job), [RESUME JOB](https://docs.cockroachlabs.com/docs/v26.2/resume-job) and [CANCEL JOB](https://docs.cockroachlabs.com/docs/v26.2/cancel-job): control an identified eligible job; observe the resulting state. Cancellation has exceptions, including DROP and rename operations. Paused index backfills can retain protected history and accumulate storage; pause is a managed intermediate state.
- [CREATE INDEX](https://docs.cockroachlabs.com/docs/v26.2/create-index) and [Unique constraint](https://docs.cockroachlabs.com/docs/v26.2/unique): a unique build checks existing duplicates and enforces future writes; NULL permits unassigned codes. `IF NOT EXISTS` checks the name, not semantic equivalence. PostgreSQL-compatible `CONCURRENTLY` is a no-op here.
- [DROP INDEX](https://docs.cockroachlabs.com/docs/v26.2/drop-index): dependency-sensitive removal and schema-job registration. Do not teach blanket CASCADE cleanup or transfer PostgreSQL's invalid-index procedure.

No database execution was performed during planning.

## Example and continuity decisions

Keep the existing price migration, initial P3/P7/P9 values 4.50/20.00/35.00 and corresponding 450/2000/3500. The separate bridge update is P7 22.00/2200; preserve post-103 stock 10/0/4, pending order 103, agreed order-line value 29.00 and no payment. Copying application values is distinct from an engine-managed index backfill. Avoid implying that adding an ordinary nullable column starts the application conversion.

For the unique-index branch, use the already authorised optional `loyalty_code`: customer 1 TEA-7, customers 2/3 NULL. Local illustrative policy: each assigned code identifies one customer; multiple NULL values mean unassigned. In an isolated failed-build branch, temporarily assign customer 2 TEA-7 as a clerical-error example. The stipulated correction restores customer 2 to NULL; it is not a general deduplication policy or a new shared starting fact. Keep this branch independent of price migration and the historical-name correction. No new business IDs are needed.

Native SQL must audit the conversion's accepted finite decimal domain and explicit integer range. CockroachDB [INT](https://docs.cockroachlabs.com/docs/v26.2/int) is normally 64-bit; do not borrow the prerequisite's PostgreSQL 32-bit type claim. Preserve the old representable domain while return remains supported. Native retry handling is owned by CockroachDB transactions and retries. Index choice and plan diagnosis belong to CockroachDB query work and hot ranges; binary/cluster-version finalisation belongs to Upgrading a CockroachDB cluster.

## Proportionate native evidence for the writer

Root owns provisioning and gives the writer an exact fresh fixture identity. Root confirmed v26.2.8, official arm64 image digest `1ad58b6a69928691e0c9289b847dcb35ac25108c6ead23fcabf47e37b9195e9a`. Do not provision or reuse another worker's database.

Two small isolated branches are sufficient for required SQL semantics: price expansion, guarded conversion, bridge update and acceptance counts; loyalty duplicate-build failure, terminal job/catalogue inspection, stipulated correction, successful new build, duplicate rejection and NULL acceptance. Retain commands, actual job IDs/errors and before/after schema and rows. Verify failure did not silently delete the offending customer data. Record which stages were observed rather than interpolate unobserved transitions.

For a visible running job, use at most one bounded index build on a technical copy of the already specified generated order fixture if root makes it available. Reuse the accepted history index shape and query, rather than designing another workload. Retain exact script/version/settings and bounded foreground operations, plus job samples and equivalent query results. Their purpose is to connect the lifecycle to native execution, not establish production throughput or latency. Any row-changing workload must remain in that labelled copy and record its expected results.

Attempt statement cancellation or pause/resume only when a matching running job can actually be identified. Confirm continuation or the resulting state if observed. Fast completion is an acceptable limit: do not enlarge fixtures or tune internal settings repeatedly merely to catch a transient state. The documented distinction and an explicitly illustrative schedule still teach the point. Do not require every retry/reversion state, force disk exhaustion, wait out GC, benchmark headroom, simulate regional failure or perform binary upgrades. Later GC and retained-history cost can remain documented mechanisms unless directly observed.

Continuity pass on the plan: prerequisites are sufficient, engine and application backfills stay distinct, examples are independent, acceptance includes ongoing writer behaviour, and cancellation does not promise business rollback or immediate space recovery. No unresolved ownership boundary. Eventual article review checks the delivered understanding; no separate planning review requested.
