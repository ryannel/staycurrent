# Existing reading reconciled after the new derivations

18 October 2026. This is a reuse assessment, made after the independent ability
breakdowns and proposed page boundaries. It does not shape those first derivations
or certify that existing prose meets the new obligations. All current URLs,
publication states and available-reading navigation remain unchanged.

The [source inventory](existing-routes.json) contains 68 explicit source routes:
62 teaching/reference destinations, four tools or worksheets, and two direct
redirects. The table accounts for each. Page IDs refer to the final
[page tree](../../databases-and-storage-page-tree.md), not current public routes.
A range identifies candidate reuse across those investigations; it is not a claim
that the existing article already completes them. No files are scheduled for deletion.

## Route-by-route candidates

| Existing route and source | Role | Candidate reuse or explicit boundary |
| --- | --- | --- |
| [/learn/databases/caching/](../../../src/pages/learn/databases/caching.astro) | Teaching/reference | CA-A01–CA-A04, CA-A06–CA-A08; split source-copy freshness from authoritative survival. |
| [/learn/databases/choosing/](../../../src/pages/learn/databases/choosing.astro) | Teaching/reference | FD01–FD03; rebuild orientation and separate workload/promise investigations. |
| [/learn/databases/column-stores/](../../../src/pages/learn/databases/column-stores.astro) | Teaching/reference | AN04–AN07; retain this route as the column-layout candidate. Reassess which execution/physical-design sections belong in companions. |
| [/learn/databases/distributed-sql/](../../../src/pages/learn/databases/distributed-sql.astro) | Teaching/reference | RL105–RL109; reuse mechanisms after checking the distinct transaction, read, placement and cluster-change outcomes. |
| [/learn/databases/documents/](../../../src/pages/learn/databases/documents.astro) | Teaching/reference | DC53–DC57; modelling and nested query/index/correctness investigations need distinct homes. |
| [/learn/databases/graphs/](../../../src/pages/learn/databases/graphs.astro) | Teaching/reference | GR-A01–GR-A07; assess graph meaning, traversal and cost separately. RDF/native branches are new obligations. |
| [/learn/databases/object-storage/access/](../../../src/pages/learn/databases/object-storage/access.md) | Teaching/reference | OB-A07–OB-A08, OB-S04; split application acceptance from native request permissions/finalisation. |
| [/learn/databases/object-storage/consistency/](../../../src/pages/learn/databases/object-storage/consistency.md) | Teaching/reference | OB-A05, OB-S03; general histories versus S3 conditional operations. |
| [/learn/databases/object-storage/database-records/](../../../src/pages/learn/databases/object-storage/database-records.md) | Teaching/reference | OB-A07; reuse authority/finalisation cases; full generic cutover belongs at FD05. |
| [/learn/databases/object-storage/delivery/](../../../src/pages/learn/databases/object-storage/delivery.md) | Teaching/reference | OB-A09, OB-S05; cache/delivery protocol and native CloudFront path. |
| [/learn/databases/object-storage/events/](../../../src/pages/learn/databases/object-storage/events.md) | Teaching/reference | OB-A10, OB-S06; ordered application effects and native reconciliation; shared copy handover at FD04. |
| [/learn/databases/object-storage/keys-and-layout/](../../../src/pages/learn/databases/object-storage/keys-and-layout.md) | Teaching/reference | OB-A02; names/versions/metadata need reassessment against the new example. |
| [/learn/databases/object-storage/performance-and-cost/](../../../src/pages/learn/databases/object-storage/performance-and-cost.md) | Teaching/reference | OB-A12, OB-A14, OB-S08, OB-S10; separate workload economics, diagnosis and actual native operations. |
| [/learn/databases/object-storage/practice/](../../../src/pages/learn/databases/object-storage/practice.md) | Tool or worksheet | Native S3 worksheet: evidence candidate for OB-S01–OB-S11; prior CLI-schema checking does not establish hosted execution. |
| [/learn/databases/object-storage/publication/](../../../src/pages/learn/databases/object-storage/publication.md) | Teaching/reference | OB-A06; retain byte-release publication. Transactional table semantics have their full home at AN17–AN22. |
| [/learn/databases/object-storage/recovery/](../../../src/pages/learn/databases/object-storage/recovery.md) | Teaching/reference | OB-A11, OB-A13, OB-S07, OB-S09; preservation, useful application recovery and native procedures. |
| [/learn/databases/object-storage/s3/](../../../src/pages/learn/databases/object-storage/s3.md) | Teaching/reference | OB-S01–OB-S11; the broad overview is reuse material for focused native investigations, not their substitute. |
| [/learn/databases/object-storage/sandbox/](../../../src/pages/learn/databases/object-storage/sandbox.astro) | Tool or worksheet | Local object model: reuse after checking each new obligation; it cannot establish S3 behaviour. |
| [/learn/databases/object-storage/tables/](../../../src/pages/learn/databases/object-storage/tables.md) | Teaching/reference | Retain as a specialised S3 resource reference while assessing reuse for AN17–AN22. Full S3 Tables operation is not an initial native branch. |
| [/learn/databases/object-storage/transfers/](../../../src/pages/learn/databases/object-storage/transfers.md) | Teaching/reference | OB-A03–OB-A04, OB-S02; separate transfer protocol from proof of integrity and native execution. |
| [/learn/databases/object-storage/vectors/](../../../src/pages/learn/databases/object-storage/vectors.md) | Teaching/reference | Retain as a specialised S3 resource reference; SR09–SR20 own general retrieval teaching. No full S3 Vectors operating branch is promised. |
| [/learn/databases/object-storage/](../../../src/pages/learn/databases/object-storage.astro) | Teaching/reference | OB-A01 and OB-A15; general orientation/choice separate from S3 operation. |
| [/learn/databases/partitioned/](../../../src/pages/learn/databases/partitioned.astro) | Teaching/reference | K01–K03 and W01–W04; separate keyed and ordered-partition tasks, then add native branches. |
| [/learn/databases/relational/access-control/](../../../src/pages/learn/databases/relational/access-control.astro) | Teaching/reference | RL104, RL121; portable access decisions and native PostgreSQL enforcement. |
| [/learn/databases/relational/adding-another-system/](../../../src/pages/learn/databases/relational/adding-another-system.astro) | Teaching/reference | FD04–FD06 with family-specific applications; generic evaluation/copy/cutover should no longer hide in relational. |
| [/learn/databases/relational/backup-and-restore/](../../../src/pages/learn/databases/relational/backup-and-restore.astro) | Teaching/reference | RL96, RL116; preserve recovery/reconciliation consequences and require native recovery evidence. |
| [/learn/databases/relational/buffer-pool/](../../../src/pages/learn/databases/relational/buffer-pool.astro) | Teaching/reference | RL92, RL110; assess general page/cache explanation versus PostgreSQL layout. |
| [/learn/databases/relational/checkout/](../../../src/pages/learn/databases/relational/checkout.astro) | Teaching/reference | Worked case reusable at RL79 and RL90–RL93; retain current case route until separately commissioned routing decisions. |
| [/learn/databases/relational/checkpoints-and-the-log/](../../../src/pages/learn/databases/relational/checkpoints-and-the-log.astro) | Teaching/reference | RL95, RL115; general crash mechanism versus PostgreSQL checkpoint/settings evidence. |
| [/learn/databases/relational/concurrent-updates/](../../../src/pages/learn/databases/relational/concurrent-updates.astro) | Compatibility alias | Preserve redirect and incoming links; assess its destination only when a rewrite is commissioned. |
| [/learn/databases/relational/conflicts-and-retries/](../../../src/pages/learn/databases/relational/conflicts-and-retries.astro) | Teaching/reference | RL91, RL93; waiting/deadlock and lost-commit-reply investigations have different outcomes. |
| [/learn/databases/relational/constraints/](../../../src/pages/learn/databases/relational/constraints.astro) | Teaching/reference | RL79, RL121; constraints/tenant boundaries and native privileged enforcement. |
| [/learn/databases/relational/data-lifecycle/](../../../src/pages/learn/databases/relational/data-lifecycle.astro) | Teaching/reference | RL80, RL89 and FD07; record history, partition retirement and cross-store deletion. |
| [/learn/databases/relational/indexes/](../../../src/pages/learn/databases/relational/indexes.astro) | Teaching/reference | RL86; reviewed teaching reference. Reassess its exact boundary using the preserved historical allocation. |
| [/learn/databases/relational/indexing-queries/](../../../src/pages/learn/databases/relational/indexing-queries.astro) | Teaching/reference | RL86–RL87, RL103; reuse diagnostic cases without repeating full index mechanism. |
| [/learn/databases/relational/isolation/](../../../src/pages/learn/databases/relational/isolation.astro) | Teaching/reference | RL90–RL92; isolation, locks and row storage need explicit boundaries and native concurrency cases. |
| [/learn/databases/relational/large-results/](../../../src/pages/learn/databases/relational/large-results.astro) | Teaching/reference | RL83; pagination and consistent exports. |
| [/learn/databases/relational/maintaining-indexes/](../../../src/pages/learn/databases/relational/maintaining-indexes.astro) | Teaching/reference | RL86, RL100 and RL119; design/maintenance reminder versus actual live build/change procedure. |
| [/learn/databases/relational/modelling/](../../../src/pages/learn/databases/relational/modelling.astro) | Teaching/reference | RL77–RL80; identity/dependencies, value meaning, constraints and history split by outcome. |
| [/learn/databases/relational/normalisation/](../../../src/pages/learn/databases/relational/normalisation.astro) | Compatibility alias | Preserve redirect and incoming links; assess its destination only when a rewrite is commissioned. |
| [/learn/databases/relational/partitioning-and-sharding/](../../../src/pages/learn/databases/relational/partitioning-and-sharding.astro) | Teaching/reference | RL89, RL105–RL109; local lifecycle partitioning versus distributed placement and change. |
| [/learn/databases/relational/postgresql/architecture/](../../../src/pages/learn/databases/relational/postgresql/architecture.astro) | Teaching/reference | RL110; reuse native environment/process/page evidence, assess new fixture requirements. |
| [/learn/databases/relational/postgresql/extensions/](../../../src/pages/learn/databases/relational/postgresql/extensions.astro) | Teaching/reference | Retain implementation/reference reading. Reuse relevant type/operator/enforcement evidence in RL78–RL79, RL112 and RL121. Full spatial/extension operation is outside the selected new branch. |
| [/learn/databases/relational/postgresql/full-text-search/](../../../src/pages/learn/databases/relational/postgresql/full-text-search.astro) | Teaching/reference | Retain implementation/reference reading, linked from SR02 where credible. General lexical teaching belongs to SR04–SR08; no full new PostgreSQL-search operating branch is claimed. |
| [/learn/databases/relational/postgresql/indexes/](../../../src/pages/learn/databases/relational/postgresql/indexes.astro) | Teaching/reference | RL112; actual methods/operator families and observable access. |
| [/learn/databases/relational/postgresql/json/](../../../src/pages/learn/databases/relational/postgresql/json.astro) | Teaching/reference | RL114, with DC53 comparison; general document semantics remain in the document map. |
| [/learn/databases/relational/postgresql/query-execution/](../../../src/pages/learn/databases/relational/postgresql/query-execution.astro) | Teaching/reference | RL113; actual PostgreSQL plan evidence and repair. |
| [/learn/databases/relational/postgresql/recovery/](../../../src/pages/learn/databases/relational/postgresql/recovery.astro) | Teaching/reference | RL115–RL116; durability/restart and target restore are distinct investigations. |
| [/learn/databases/relational/postgresql/replication/](../../../src/pages/learn/databases/relational/postgresql/replication.astro) | Teaching/reference | RL117–RL118; physical promotion versus logical feed/replica protocols. |
| [/learn/databases/relational/postgresql/row-versions/](../../../src/pages/learn/databases/relational/postgresql/row-versions.astro) | Teaching/reference | RL110–RL111; tuple storage versus vacuum/transaction-age operation. |
| [/learn/databases/relational/postgresql/sharding/](../../../src/pages/learn/databases/relational/postgresql/sharding.astro) | Teaching/reference | Retain distributed-PostgreSQL implementation/reference reading. RL105–RL109 own general mechanisms; the selected new full distributed native branch is CockroachDB. Do not claim this page teaches either complete branch. |
| [/learn/databases/relational/postgresql/vector-search/](../../../src/pages/learn/databases/relational/postgresql/vector-search.astro) | Teaching/reference | Retain implementation/reference reading, linked from SR02 where credible. General vector teaching belongs to SR09–SR20; no complete pgvector operating branch is claimed. |
| [/learn/databases/relational/practice/](../../../src/pages/learn/databases/relational/practice.astro) | Tool or worksheet | SQL practice entrance: reuse/reorganise only after later briefs choose their actual environment. |
| [/learn/databases/relational/product-comparison/](../../../src/pages/learn/databases/relational/product-comparison.astro) | Teaching/reference | RL76; reassess against conditions and the established SQL Server/MySQL/PostgreSQL comparison requirement. |
| [/learn/databases/relational/query-execution/](../../../src/pages/learn/databases/relational/query-execution.astro) | Teaching/reference | RL87; general execution/plan reasoning, with product-only procedure at RL113. |
| [/learn/databases/relational/query-results/](../../../src/pages/learn/databases/relational/query-results.astro) | Teaching/reference | RL78, RL81–RL82; equality/missingness, join cardinality and aggregation are independently tested meanings. |
| [/learn/databases/relational/replicas-and-failover/](../../../src/pages/learn/databases/relational/replicas-and-failover.astro) | Teaching/reference | RL97–RL98, RL117; read routing, authority/fencing and native promotion. |
| [/learn/databases/relational/reporting/](../../../src/pages/learn/databases/relational/reporting.astro) | Teaching/reference | AN01–AN03 and AN46; relational-to-analytics choice and answer meaning, with local relational reminders. |
| [/learn/databases/relational/request-cost/](../../../src/pages/learn/databases/relational/request-cost.astro) | Teaching/reference | RL85, RL102; application query/transaction boundary versus connections/overload. |
| [/learn/databases/relational/sandbox/](../../../src/pages/learn/databases/relational/sandbox.astro) | Tool or worksheet | SQL execution tool and existing lessons: reuse after checking engine limits; native sessions/files/clusters remain separate requirements. |
| [/learn/databases/relational/scaling/](../../../src/pages/learn/databases/relational/scaling.astro) | Teaching/reference | RL102, RL105–RL109, FD06; capacity, distribution and evaluation are separate decisions. |
| [/learn/databases/relational/schema-changes/](../../../src/pages/learn/databases/relational/schema-changes.astro) | Teaching/reference | RL100, RL119; general compatibility/backfill and actual PostgreSQL procedure. |
| [/learn/databases/relational/slow-queries/](../../../src/pages/learn/databases/relational/slow-queries.astro) | Teaching/reference | RL87, RL103, RL113 and RL120; general query/incident diagnosis versus native evidence. |
| [/learn/databases/relational/storage/](../../../src/pages/learn/databases/relational/storage.astro) | Teaching/reference | RL92, RL95; reviewed teaching reference. Reassess row-storage and durability boundaries; native settings belong at RL110/RL115. |
| [/learn/databases/relational/tables-and-documents/](../../../src/pages/learn/databases/relational/tables-and-documents.astro) | Teaching/reference | RL77, RL114 and DC53–DC54; general boundary choice versus native JSON execution. |
| [/learn/databases/relational/transaction-boundaries/](../../../src/pages/learn/databases/relational/transaction-boundaries.astro) | Teaching/reference | RL90–RL94; concurrent invariants, contention, unknown outcomes and database-backed work need separate teaching evidence. |
| [/learn/databases/relational/](../../../src/pages/learn/databases/relational.astro) | Teaching/reference | RL76; new entrance and task routes, rather than preserving the existing outline. |
| [/learn/databases/search/](../../../src/pages/learn/databases/search.astro) | Teaching/reference | SR01 and SR03–SR20; separate corpus, lexical/vector mechanisms, result meaning and evidence. |

## Other existing destinations

The dated [PostgreSQL vector assessment](../../../src/pages/assessments/postgres-vectors.astro)
is separate from a durable teaching route. Preserve its date and evidence limits;
reassess its conclusions if a new assessment is commissioned. It does not count as
another implementation article in this plan.

Nine additional relational compatibility paths are generated from
[the alias registry](../../../src/lib/relational-collection.ts): `choosing-indexes`,
`join-algorithms`, `commit-and-recovery`, `watching-storage`, `diagnosing-waits`,
`performance-testing`, `maintenance`, `embedded-databases`, and
`access-and-lifecycle`. Preserve them; they are not nine teaching pages.

## What is new work

The final maps, rather than the table above, specify what must be taught. Most
native branches and several family journeys have no equivalent current article.
Even an apparent one-to-one match needs a bounded brief, the required examples
and changed conditions, current product evidence, execution where promised, and
independent article review. Existing figures and lessons earn reuse through those
checks, not through having an available URL.

Full-text/vector PostgreSQL, distributed PostgreSQL and specialised S3 resources
remain real existing reading. Keeping them available does not quietly expand the
new selected native branches, and leaving a full new branch outside initial scope
does not erase useful earlier work. Any later relocation, merger or publication
change needs its own concrete proposal.
