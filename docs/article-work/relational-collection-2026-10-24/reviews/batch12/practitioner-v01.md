# Practitioner review · article · r49–r53 · batch12-v01

Role: fresh independent **initial** practitioner coverage, 24 October 2026. This is neither final complete practitioner coverage nor corpus review. Highest severity: **none**.

## Inputs and method

Fixed input: [v01/manifest.json](v01/manifest.json), SHA-256 `eae2cc0238e6c0247a187cd83d2b6a2a1f91c8c8fe60c4cd08cdaa8242536229`. Every listed frozen file was checked against its manifest hash: no mismatch. Read only the current review skill/practitioner perspective, permitted commission/audience/example/extensions, complete r49–r53 briefs and plans RL128–RL132, and relevant owner/prerequisite plans RL79, RL83, RL85–RL87, RL93–RL94, RL96–RL97, RL100, RL104–RL109, RL118, RL122–RL127. Matching shared-context hashes allow those plans to be read once across the two assigned batches.

Read every piece's complete rendered prose, SQL, tables, figure captions/text alternatives, disclosures and Sources at URLs derived from the manifest, without using the live collection:

| Piece | Complete frozen URL |
| --- | --- |
| r49 | <http://127.0.0.1:4534/review/relational-collection/cockroachdb/operations/> |
| r50 | <http://127.0.0.1:4534/review/relational-collection/cockroachdb/backup-and-restore/> |
| r51 | <http://127.0.0.1:4534/review/relational-collection/cockroachdb/schema-changes/> |
| r52 | <http://127.0.0.1:4534/review/relational-collection/cockroachdb/upgrades/> |
| r53 | <http://127.0.0.1:4534/review/relational-collection/cockroachdb/migration/> |

Read [mechanical/applicability.md](v01/mechanical/applicability.md), every final native verifier and result, relevant retained failed/resource attempts as provenance, complete technical figure/component states and their frozen shared data. Repeated navigation was reused with current-item/availability differences checked. No author teaching notes, earlier quality reports, decisions, repair history or peer reports were read. Names of withheld metadata/writer records occurring inside hash provenance were not followed.

Mechanical results are **author observations**, not fresh reviewer native runs. This review checked their applicability by exact current source/fixture/verifier, version/environment, commands, returned data and acceptance assertions, then challenged consequential claims against primary documentation. No unresolved mechanism required an additional local database run. No native resources, credentials, host settings, browser viewport or theme were mutated; no build, article edit or publication occurred. This report does not independently certify cleanup from past runs beyond the supplied provenance and verifier's cleanup path.

## r49 · Operating and securing a CockroachDB cluster

| Check | Result | Note |
| --- | --- | --- |
| Correctness | pass | TLS/server identity, effective SQL authority, RLS policy semantics, replication health and drain/decommission distinction are technically sound. |
| Evidence | pass | Secure runtime denials and completed decommission have concrete receipts; the handover diagram and independent-domain limits are explicit. |
| Coverage | pass | Includes permitted and forbidden tenant work, spoofed context, role/ownership bypass, credential rotation limits, range-level diagnosis, capacity and overlapping maintenance budgets. |
| Depth, both ways | pass | Gives actionable acceptance checks without implying one per-tenant login model is universal or expanding into every operational subsystem. |
| Ownership | pass | Owns secure runtime/native removal; uses the prepared range/health branch and leaves locality, upgrades, backup and query optimisation to their owners. |

Primary challenge: checked [cockroach cert](https://docs.cockroachlabs.com/docs/v25.4/cockroach-cert), [Authorisation](https://docs.cockroachlabs.com/docs/v25.4/security-reference/authorization), [Row-level Security](https://docs.cockroachlabs.com/docs/v25.4/row-level-security), [SHOW RANGES](https://docs.cockroachlabs.com/docs/v25.4/show-ranges), [Node Shutdown](https://docs.cockroachlabs.com/docs/v25.4/node-shutdown) and [cockroach node](https://docs.cockroachlabs.com/docs/v25.4/cockroach-node). Tested reasoning against ownership/public grants, policy evaluation and backup/changefeed bypass; preflight is not treated as reserved future capacity or sufficient disk headroom.

Evidence applicability: [result.json](v01/mechanical/r49/result.json) and [run-native.py](v01/mechanical/r49/run-native.py) pin secure25.4.17 processes, private CA/node/client certificates and the two distinct tenant P7 rows. The before-policy counterexample exposes both tenants. Runtime10 afterwards sees Blue mug only; runtime20 sees Copper mug; spoofed application_name does not change authority. Cross-shop insert, disabling RLS, role assumption, deletion and schema creation are refused; permitted update affects one row and is rolled back. Mismatched client certificate fails authentication. The decommission record maps the target by address, evacuates its57 replicas, reaches decommissioned/draining with zero replicas, and leaves the inspected range voting on1/2/4. Final surviving node status shows no unavailable/under-replicated ranges. The source/hash verifier alias matches `e7ce7fa3…`; article/component hashes also match.

Bounded note: the historical verifier uses a cleared subprocess environment, fresh private TLS material and a marker; it does not preserve a separate listener-PID receipt before its first mutation. I did not rerun it or infer more ownership proof than it records. Four processes share one host. Rotation through a proxy, real pool setup, privileged backups and independent-node loss remain deployment exercises, as disclosed. The unavailable internal licence-status function returns42883; that failed probe is not treated as verified licensing status.

## r50 · CockroachDB backup and recovery

| Check | Result | Note |
| --- | --- | --- |
| Correctness | pass | Backup chain/revision history, target ordering, dependency scope and restored-state limits agree with product documentation. |
| Evidence | pass | Full/incremental jobs, missing-object failure, recorded pre-mistake HLC, isolated restore and fence/reconciliation outcomes are retained. |
| Coverage | pass | Covers scope, keys/credentials, missing files, old admissions, uncertain outcomes, replay identity/capacity, external authorities and the return boundary. |
| Depth, both ways | pass | B203 makes native target/reconciliation consequences concrete; general recovery reasoning is reused only where needed for the engine exercise. |
| Ownership | pass | Owns CockroachDB backup execution; delegates general closed-history contract, region setup and migration cutover without duplicating their full treatments. |

Primary challenge: checked [BACKUP](https://docs.cockroachlabs.com/docs/v25.4/backup), [SHOW BACKUP](https://docs.cockroachlabs.com/docs/v25.4/show-backup), [RESTORE](https://docs.cockroachlabs.com/docs/v25.4/restore) and [Licensing FAQs](https://docs.cockroachlabs.com/docs/v25.4/licensing-faqs). In particular, revision history permits targets inside supported captured history but does not restore all historical queryable versions. A file check is correctly separated from application acceptance.

Evidence applicability: [run-native.py](v01/mechanical/r50/run-native.py) and [result.json](v01/mechanical/r50/result.json) agree on25.4.17/Psycopg3.3.3, S503 capacity/remaining3, erroneous capacity30, B203 and separate source/candidate identities. Target `1792819735137311000.0000000000` follows the full backup and precedes the mistaken transaction; the increment includes the later changes. The candidate missing required `filelist.sst` object causes the expected check failure, then restoration succeeds with the object restored. The held fence's racing request is refused before final accepted-history enumeration. Restored B203/mistake are absent; controlled reconciliation/repetition leaves one B203 and remaining2, and the final capacity equation passes. The earlier capacity-exhausted restore is not counted as success. Script clears actual inherited connection settings and confines stores/backups to its temporary tree; final manifest binds the verifier and receipt.

Bounded note: two local processes and shared local backup files prove no offsite recovery, encryption-key retrieval, external provider decision, RPO/RTO or actual production runtime route. Reconciliation is controlled while the candidate remains closed. The fixture generates no external effects; that is the accurately stated external acceptance condition, not a provider lookup.

## r51 · CockroachDB schema jobs under load

| Check | Result | Note |
| --- | --- | --- |
| Correctness | pass | Stored derivation, explicit column-list compatibility, job/control states, unique enforcement and general DDL transaction limits are accurate. |
| Evidence | pass | Computed backfill, concurrent committed updates and failed/cleaned/rebuilt unique index have matching native records; resource retry is identified separately. |
| Coverage | pass | Includes stalled resources, job identity, cleanup versus physical GC, caller shape changes, semantic acceptance, duplicate policy and contraction authority. |
| Depth, both ways | pass | Chooses a useful derived-reader migration and explicitly stops short of integer-only write authority; does not imply that generated columns complete that later handover. |
| Ownership | pass | Owns CockroachDB jobs/native checks; keeps general compatibility and binary/cluster transitions with RL100/RL131. |

Primary challenge: checked [Online Schema Changes](https://docs.cockroachlabs.com/docs/v25.4/online-schema-changes), [Computed Columns](https://docs.cockroachlabs.com/docs/v25.4/computed-columns), [SHOW JOBS](https://docs.cockroachlabs.com/docs/v25.4/show-jobs) and [CREATE INDEX](https://docs.cockroachlabs.com/docs/v25.4/create-index). Challenged prepared SELECT* result-shape assumptions, revert-failed state and the no-op CONCURRENTLY keyword. The article avoids importing PostgreSQL's invalid-index recovery protocol.

Evidence applicability: [run-native.py](v01/mechanical/r51/run-native.py), [result.json](v01/mechanical/r51/result.json) and [resource-retry.txt](v01/mechanical/r51/resource-retry.txt) pin25.4.17/Psycopg3.3.3. Exact core line values yield2900 hundredths for103; assigning7 directly is refused55000. The separate50,000-row deterministic fixture records133 committed quantity updates during its DDL interval and zero price-pair mismatches. The duplicate unique build fails23505, becomes absent from SHOW INDEXES, and succeeds after explicit scratch duplicate resolution; duplicate insertion then fails and a distinct value succeeds. Retained running GC jobs correctly do not invalidate logical descriptor acceptance. BulkAdder resource logs support the earlier resource failure; only the final256MiB process-local SQL-memory run supports completion. Current article/component and manifest verifier/result hashes match.

Bounded note: this is a functional concurrent-write check, not a representative load/performance budget, and quantity updates do not test every price-edit workload. The finite fixed-scale source domain is the stated design assumption; its generated-column design does not promise exceptional-decimal handling or an integer-authoritative writer. No pause/cancel transition or physical-GC deadline is claimed as observed.

## r52 · Upgrading a CockroachDB cluster

| Check | Result | Note |
| --- | --- | --- |
| Correctness | pass | Supported predecessor route, binary versus compatibility state, finalisation policy and irreversible boundary are correctly separated. |
| Evidence | pass | Mixed binaries, same-store pre-final return, held25.3 state and actual final25.4 acceptance match the record. Post-final downgrade is expressly not attempted. |
| Coverage | pass | Includes health/headroom, dead nodes, application entry routes, request ambiguity, licence prerequisites, acceptance interval and recovery of later valid history. |
| Depth, both ways | pass | Concrete pinned rehearsal supports operational judgement without claiming all workload acceptance from a receipt and counter. |
| Ownership | pass | Uses operational/backup preparation, owns cluster compatibility, and leaves schema-job and engine-migration mechanics to their owners. |

Primary challenge: checked [Upgrade Self-hosted CockroachDB](https://docs.cockroachlabs.com/docs/v25.4/upgrade-cockroach-version), [Node Shutdown](https://docs.cockroachlabs.com/docs/v25.4/node-shutdown) and [Licensing FAQs](https://docs.cockroachlabs.com/docs/v25.4/licensing-faqs). The critical supported limit is **when finalisation begins**, not when its last status completes. `cluster.auto_upgrade.enabled=false` is the documented recommended policy; a fresh cluster's observed capability is correctly distinguished from the documented production licence requirement.

Evidence applicability: [run-native.py](v01/mechanical/r52/run-native.py), hash alias `9e6deeeb…`, and [result.json](v01/mechanical/r52/result.json) agree on actual25.3.7/25.4.17 binary identities, same owned stores, three processes, actual environment clearing, marker/rejoin checks, recorded drain completion and range inspection. The phase records show mixed tags with version25.3; all old after return; all new while still25.3; and observed finalisation25.4. Repeated receipt29.00 and scratch-counter commits support only the stated fixture acceptance. Both finalisation command success and subsequent version query are present; it is not merely an all-new-binaries inference.

Bounded note: no old binary is started after finalisation. The unavailability of that supported return route comes from the primary procedure/model, not a claimed native refusal experiment. Licence setting is empty; no entitlement or telemetry-compliant production operation follows. Checks do not establish representative retries, drivers, failover routes, load or independent-machine survival. Three-voter count alone is not complete cluster-wide health acceptance; the article appropriately requires that separately.

## r53 · Moving a SQL application to CockroachDB

| Check | Result | Note |
| --- | --- | --- |
| Correctness | pass | Protocol compatibility is separated from SQL semantics; nullable immediate FK is explicitly weaker than a non-null deferred source contract. Copy and return preserve one closed history. |
| Evidence | pass | Exact semantic probes, full-value comparisons, fence races, overlapping request outcomes and reconciled return support the bounded claims. |
| Coverage | pass | Covers types/errors, trusted-writer bridge, consistent snapshot, count-only false positive, admission races, source/target authority, replay and post-cutover return work. |
| Depth, both ways | pass | One paused-write rehearsal is sufficient to reason through a verifiable handover; CDC/MOLT and zero-downtime complexity are named as separate procedures. |
| Ownership | pass | Owns engine migration and application contract; delegates PostgreSQL-native upgrade, logical-stream mechanics, security and restore implementation. |

Primary challenge: checked [PostgreSQL Compatibility](https://docs.cockroachlabs.com/docs/v25.4/postgresql-compatibility), [CockroachDB Foreign Keys](https://docs.cockroachlabs.com/docs/v25.4/foreign-key), [Transaction Retry Error Reference](https://docs.cockroachlabs.com/docs/v25.4/transaction-retry-error-reference), [PostgreSQL18 CREATE TABLE](https://www.postgresql.org/docs/18/sql-createtable.html) and [PostgreSQL18 Transaction Isolation](https://www.postgresql.org/docs/18/transaction-iso.html). The target bridge cannot database-enforce non-null completion at commit; the article explicitly says so, assigns trust/access obligations and refuses to sell it as equivalent enforcement for arbitrary writers.

Evidence applicability: [run-native.py](v01/mechanical/r53/run-native.py), verified alias hash `818fd94f…`, and [result.json](v01/mechanical/r53/result.json) pin PostgreSQL18.6, CockroachDB25.4.17 and Psycopg3.3.3. The source actual data_directory is private; inherited PG/COCKROACH/DATABASE_URL/SQL_URL variables are cleared before drivers/subprocesses. The verifier compares all six declared business relations, normalises exact decimals and UTC instants, and excludes control/ownership markers from business equality. Source division yields2; target yields2.5; deferred DDL is accepted on PG and rejected42601 on CR. The final copy compares complete rows. An equal-count34.00 teapot mutation fails value equality and is repaired to35.00. The two overlapping target attempts return103; retained stock/rows/request outcome remain single. Both fence races are rejected, full source base equality precedes controlled return, and final full closed states/receipts/stock agree before reopening PG alone.

Bounded note: the deferred probe tests **definition acceptance**, not an executed non-null deferred purchase on PostgreSQL; the fixture's business purchase tables use the disclosed nullable bridge on both sides. Its deliberate post-tea exception runs on the PG source, while the overlapping/missing-ack purchase is on CR. I have not converted those observations into target-only abort coverage or database-only enforcement. The overlapping target record contains zero40001 retries, so it does not itself verify retry exhaustion/backoff; the article requires representative target acceptance and RL124 owns the native retry drill. No provider effects, live CDC, runtime-role/TLS deployment acceptance, zero-downtime or performance objective is inferred.

## Findings and limits

**Findings: none.** All five checks were applied separately to every piece; narrower observed coverage is recorded above rather than silently promoted to production acceptance. Exact frozen source hashes match article/figure bytes. The verifiers/results are linked by the manifest, mechanical applicability and matching commands/assertions; this review does not invent a stronger cryptographic execution attestation where the raw result lacks one. For r49/r52/r53, source-hash verifier aliases were checked against the mechanically supplied files; omitted metadata/author records were not accessed.

The five current rendered pages offer no download links, independently checked in their actual HTML. Browser file saving is unverified. Scripted state semantics were reviewed from current source; no fresh playback/viewport/theme assessment was performed, and this does not replace visual coverage. No reviewer tabs or database processes were created. Completion of this initial assignment does not establish final complete review, corpus acceptance, publication readiness or any licence entitlement.
