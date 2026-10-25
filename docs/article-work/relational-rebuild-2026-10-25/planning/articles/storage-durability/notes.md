# Storage and durability planning notes

Prepared 25 October 2026. This is the first detailed outline for the accepted merged owner. No ownership change or additional page is proposed. The plan contains only the two accepted contextual children, replicas and backups. It is for coordinator integration and subsequent writing, without a separate planning review.

## Inputs and reference exposure

Read the supplied commission, article, neighbours, incoming ownership, reading links and refreshed shop example. Read the current breakdown skill and the write reference-reading procedure, plus continuity. No main-repository content, older article bodies, earlier plans/reviews or other workers' notes were consulted.

Read every bounded text part separately using the supplied helper and checked every END marker: sequences 1–6, indexes 1–7, storage 1–6 (19 parts). Their complete-text hashes matched the supplied manifest. The fixed reference is a teaching model, not the new article's example record or a substitute for primary-source checking.

Studied the finished articles on the assigned port 4584 in three owned IAB tabs at the existing viewport and System theme setting; made no viewport/theme overrides and closed all three tabs. Comparable drawing work inspected:

- Storage figure 3: the same P7 update, two readers, and the PostgreSQL/InnoDB storage distinction. Stepped the PostgreSQL view through update and the two-reader state; switched to InnoDB and read its corresponding state.
- Storage figure 5: the changed buffer, durable update/commit records, acknowledgement and still-old table file. Paused and stepped to the acknowledged commit state.
- Storage figure 8: durable history survives while the application's connection is lost; stepped to the recovered 22.00 endpoint.
- Indexes figure 9: separate table/index structures and a count that grows as each structure is changed. This supports accounting for amplification without pretending a SQL row is one storage write.
- Sequences figure 2: the visible reply and nested waiting, with ordering separated from elapsed time. Stepped to the database's commit reply.

These references favour one concrete change developed in stages, prose that directs attention to a visible difference, and qualifications beside the inference they protect. The plan identifies what needs understanding; the writer chooses the prose, drawings and controls afresh.

## Example and continuity decisions

The coordinator approved the following independent storage scenario and will record it centrally:

- Start from post-order-103 stock P3/P7/P9 = 10/0/4. Change `products.price` for P7 from 20.00 to 22.00. Use the real supplied column `price`, not the reference's `current_price`.
- A report explicitly establishes its snapshot before the update; a fresh query begins after commit. Do not imply BEGIN alone establishes that snapshot, or that every long transaction uses an unchanged snapshot.
- Order 103 remains pending, has no payment, retains its agreed line prices and totals 29.00. Neither stock nor other shop rows change.
- Reuse the same isolated update for dirty-page, log, acknowledgement and crash-cut explanations. No business effective/recorded dates, invented native addresses, transaction IDs or measured page/write counts are needed. Any physical layout, log progress and failure trace is a labelled model of documented behaviour.
- The independent recovery-choice variation commits an unwanted P7 price of 2.20. Keep it separate from the successful 22.00 run. Its role is to expose that restart faithfully preserves a mistake; do not prescribe restore or correction without the recovery owner's later-work analysis.

The reading path assumes rows/indexes, commit and snapshot visibility. Briefly reconnect those ideas, then explain their physical consequences. Keep MVCC retention, durability logging, replicated progress and business history distinct. No native observations have been performed for this outline, and the fixed references' benchmark numbers and crash results are not evidence about this example.

## Primary-source checks

Checked the following official sources on 25 October 2026; these support the intended mechanism and its limits, rather than observed execution. Summaries are deliberately bounded; the writer should cite the relevant sources near consequential claims and in the article's closed sources section.

- [PostgreSQL 18: Database Page Layout](https://www.postgresql.org/docs/18/storage-page-layout.html): tables and indexes use fixed-size pages, usually 8 kB, with headers, item identifiers and free space. Native offsets, tuple fields and traversal remain with Inside PostgreSQL.
- [PostgreSQL 18: TOAST](https://www.postgresql.org/docs/18/storage-toast.html): PostgreSQL tuples cannot span pages, so eligible large values can be compressed or stored out of line. Do not state a universal relational row-size rule or imply every large value has the same placement.
- [PostgreSQL 18: Resource Consumption](https://www.postgresql.org/docs/18/runtime-config-resource.html): shared buffers coexist with the operating-system cache; background writing helps keep clean buffers available. The outline commissions no cache percentage or tuning recipe.
- [PostgreSQL 18: Routine Vacuuming](https://www.postgresql.org/docs/18/routine-vacuuming.html): old versions remain while potentially visible; ordinary vacuum principally enables reuse, with a limited empty-tail exception to file shrinkage. A rewrite needs time, extra space and stronger locking. Avoid equating every free byte with pathological bloat.
- [MySQL 8.4: InnoDB Multi-Versioning](https://dev.mysql.com/doc/refman/8.4/en/innodb-multi-versioning.html): undo reconstructs earlier versions; update undo remains while an assigned snapshot can need it. This is a bounded alternative to storing versions in the heap, not a second operating guide.
- [PostgreSQL 18: Write-Ahead Logging](https://www.postgresql.org/docs/18/wal-intro.html): log must be durable before corresponding data-file changes; durable WAL allows commit without forcing all data pages. Multiple commits can share a flush.
- [PostgreSQL 18: WAL Configuration](https://www.postgresql.org/docs/18/wal-configuration.html): completed checkpoint work establishes the replay boundary; more frequent checkpoints trade shorter replay for more writes, including full-page images. Archiving and replication can retain WAL after local restart no longer needs it. Do not treat a checkpoint as an instantaneous global transaction boundary or promise a fixed outage duration.
- [PostgreSQL 18: WAL Internals](https://www.postgresql.org/docs/18/wal-internals.html): LSNs are positions, records depend on the event being logged, and startup finds its redo point through checkpoint metadata. Do not turn LSNs into transaction timestamps or depict WAL as saved SQL.
- [PostgreSQL 18: Reliability](https://www.postgresql.org/docs/18/wal-reliability.html): the durability promise depends on OS/controller/drive caches and nonvolatile storage. Killing a database process is not proof against power loss. Native flush methods and crash drills belong to the PostgreSQL durability article.
- [PostgreSQL 18: Asynchronous Commit](https://www.postgresql.org/docs/18/wal-async-commit.html): early acknowledgement can lose recent transactions while retaining database consistency; disabling fsync risks corruption. Preserve commit-order dependency guarantees: do not suggest that PostgreSQL can retain dependent database transaction B while losing prior A. External actions can nevertheless escape before a later loss.
- [MySQL 8.4: InnoDB Recovery](https://dev.mysql.com/doc/refman/8.4/en/innodb-recovery.html): distinguish crash recovery from backup-based recovery and point-in-time recovery. Undo provides a contrasting unfinished-work mechanism; no InnoDB benchmark or procedure is commissioned.
- [SQLite: Write-Ahead Logging](https://www.sqlite.org/wal.html): WAL mode appends changed pages and later checkpoints them; rollback journalling is a different supported design. Do not imply every relational engine has the depicted PostgreSQL buffer/page/redo arrangement.
- [CockroachDB: Storage Layer](https://docs.cockroachlabs.com/docs/stable/architecture/storage-layer): Pebble uses immutable SST files, a memtable/WAL and compaction; this provides the bounded LSM contrast and prevents presenting in-place page writes as universal. Native LSM, MVCC/GC and replicated commit internals remain with the CockroachDB owners.
- [PostgreSQL 18: Continuous Archiving and PITR](https://www.postgresql.org/docs/18/continuous-archiving.html): an appropriate base backup plus retained history supports restoration and an earlier recovery target. A running replica copying the same committed mistake is not retained restorable history by itself.

## Ownership and remaining writer choices

The merged parent teaches pages/buffers, retention/cleanup, write-ahead ordering, acknowledgement, restart and amplification sufficiently to make practical judgements without reading its children. It does not split these back into new general storage/WAL pages.

Use contextual links to Inside PostgreSQL for process/page traversal and HOT, PostgreSQL vacuum and transaction age for retention diagnosis and intervention, and PostgreSQL WAL, checkpoints and durability for settings, counters and crash evidence. These remain siblings/native descendants in the accepted tree, not newly nested children here. Index selection and detailed write-maintenance comparisons remain with Indexes and access paths. Retry identity and uncertain outcomes, business correction, failover authority and distributed quorum agreement retain their existing owners.

No unresolved ownership decision blocks writing. The exact visual form, any numerical model and the depth of the brief cross-engine contrast remain writer choices. If the writer adds actual experiments, new scenario facts or measured quantities, agree them centrally and retain their evidence separately. Avoid operating instructions or a broad four-engine settings matrix in this general article.
