# Collection planner record · 24 October 2026

Status: provisional plan returned for orchestrator-managed independent review. This is planning and ordinary continuity checking, not a review judgement, native execution record or publication authority.

## Inputs and boundaries

Read the current commission, decisions, input inventory and clean core example, the current breakdown and continuity skills, README and site direction. Read the accepted introduction source to establish starting understanding and existing links. Did not read old article drafts, historical reviews or earlier large trees. The introduction remains unchanged. The integration owner subsequently confirmed its current reader-facing title, **Relational databases**, and the stable key `r00`; remaining inventory-order keys are `r01`–`r57`.

No delegation, independent review, article prose change, public route change, skill change, build, preview, commit or publication was performed by this planner. New files are limited to the canonical tree, its example record and this commission’s planning companions. A temporary generator outside the repository assembled and checked the YAML; it is not a second source of editorial authority.

Input SHA-256 values at handover preparation:

| Input | SHA-256 |
| --- | --- |
| commission.md | `ad5c6537dfa1677737fd23bae0c3c7d1ee9a360b59450db64b30a89a1803e3b8` |
| decisions.md | `02ea524854c41da35376944564606f35caefbde9df760223c58ed0f5fc522d11` |
| input/inventory.json | `442acfdb3df48af96199fb57efccb84771fb1e365c8451b097528c09d5fb767b` |
| input/core-example.md | `ffae9e988d2b45c1aa159304ec918e9371faf0ba11636b03457135a76f14a0b3` |
| accepted introduction source | `08f2f667d25ea1a4d8323b0a0ea2da9021a3d74c9ce8cd43c8388602daa563ac` |

## Planning decisions

Retain all 58 destinations: one accepted introduction, 30 general/distributed articles, 13 PostgreSQL implementation articles, ten CockroachDB articles and four PostgreSQL specialists. Propose no merge. General chapters develop a reusable mechanism and decision; implementation chapters develop tested native practice. This boundary justifies separate articles more concretely than product-specific retellings of the same conceptual explanation.

Every destination has its stable key, inventory ID and slug, purpose, two outcomes, entry understanding, prerequisite IDs, owning neighbours and a singular `heading` list. Every non-root article has four provisional subject headings. Headings name subjects; teaching briefs carry outcomes, failure cases and hard-to-picture examples. They do not prescribe a writer’s exact illustration or interaction. The accepted root’s eight h2 headings are preserved in the plan. Root child carriers annotate the collection tree; they are not proposed source additions.

The recursive ownership tree contains every destination once. Prerequisites form a separate acyclic graph: a child may require a concept from another branch, and an experienced reader may already know it. `articles.json` is a generated metadata/packet index of this same tree, without duplicate heading prose. The YAML remains canonical.

The clean shop rows are copied intact into the example record. Proposed additions are separated and labelled E1–E7: tenant-scoped shops, class/room facts, later price history and minor units, request/effect identity, regions/quota, isolated recovery histories and specialist catalogue data. The original race remains engine/protocol specific. No generic Repeatable Read outcome is inherited. Core order 104 never commits in the protected example; class bookings have different IDs and staff have different names. Tied-order IDs 105/106 and later valid recovery order 107 are distinct. Regional voting diagrams and local process drills remain explicitly bounded models or observations.

## Consequential source checks

Checked official primary sources through browsing during this assignment, 23 October UTC / 24 October in Stockholm. These checks establish planning boundaries, not complete implementation instructions or current release recommendations. Source pages labelled `stable` are moving references; CockroachDB writing should use the corresponding pinned version and a fresh native check. PostgreSQL documentation was explicitly version 18. Extension writers must pin a tag/version rather than relying on a moving repository branch.

| Planning consequence | Primary source checked |
| --- | --- |
| The introductory conditional update has PostgreSQL Read Committed wait/recheck semantics. Serializable can require full-transaction retries; isolation names are not sufficient descriptions of arbitrary engines. | [PostgreSQL 18 Transaction Isolation](https://www.postgresql.org/docs/18/transaction-iso.html) |
| Row checks, NULL, uniqueness and references have distinct enforcement boundaries; cross-row business rules need an appropriate supported mechanism. | [PostgreSQL 18 Constraints](https://www.postgresql.org/docs/18/ddl-constraints.html) |
| Deferred checking and exclusion constraints belong to native semantics and compatibility checks. | [PostgreSQL 18 CREATE TABLE](https://www.postgresql.org/docs/18/sql-createtable.html) |
| Partition lifecycle deserves its own page; partitioning has pruning and constraint consequences and does not by itself describe cross-node placement. | [PostgreSQL 18 Table Partitioning](https://www.postgresql.org/docs/18/ddl-partitioning.html) |
| Retained versions, reusable space, visibility and transaction-age safety justify both the general cleanup explanation and native vacuum practice. | [PostgreSQL 18 Routine Vacuuming](https://www.postgresql.org/docs/18/routine-vacuuming.html) |
| Physical recovery requires a suitable base and uninterrupted needed WAL; a logical dump is not a physical WAL replay base. Restore and reconciliation remain separate work. | [PostgreSQL 18 Continuous Archiving and PITR](https://www.postgresql.org/docs/18/continuous-archiving.html) |
| Logical row replication does not transfer all schema and sequence state. It cannot stand in for a complete migration protocol. | [PostgreSQL 18 Logical Replication Restrictions](https://www.postgresql.org/docs/18/logical-replication-restrictions.html) |
| Row policy, ownership and bypass must be tested under the actual role. Integrity constraints are not an access policy. | [PostgreSQL 18 Row Security Policies](https://www.postgresql.org/docs/18/ddl-rowsecurity.html) |
| Query operators, operator classes and physical organisation matter when choosing B-tree, GIN, GiST or BRIN; a list of method names is insufficient. | [PostgreSQL 18 Index Types](https://www.postgresql.org/docs/18/indexes-types.html) |
| Text configuration, lexemes and positions establish matching semantics separately from indexing and ranking. | [PostgreSQL 18 Full Text Search Introduction](https://www.postgresql.org/docs/18/textsearch-intro.html) |
| CockroachDB combines provisional writes and transaction state with Parallel Commits; its native chapter must distinguish the implementation from the general two-phase-commit teaching protocol. | [CockroachDB v25.4 Transaction Layer](https://docs.cockroachlabs.com/docs/v25.4/architecture/transaction-layer) |
| The same versioned transaction chapter documents Serializable and Read Committed snapshot/retry differences and closed timestamps. Do not teach Serializable as its sole supported isolation level. | [CockroachDB v25.4 Transaction Layer](https://docs.cockroachlabs.com/docs/v25.4/architecture/transaction-layer) |
| Historical follower reads have a consistent past view; GLOBAL tables also support strong follower reads. Avoid treating every follower read as stale. | [CockroachDB Follower Reads](https://docs.cockroachlabs.com/docs/stable/follower-reads) |
| Region, table locality and survival goal are separate choices; serving locality does not remove coordination for a wider invariant. | [CockroachDB v25.4 Multi-Region Overview](https://docs.cockroachlabs.com/docs/v25.4/multiregion-overview) |
| Replica catch-up uses a snapshot and later log; voting agreement and lease authority matter. Leader leases mean leaseholder and Raft leader are normally co-located on this version, though the concepts remain distinct. | [CockroachDB v25.4 Replication Layer](https://docs.cockroachlabs.com/docs/v25.4/architecture/replication-layer) |
| Binary rollout and finalisation are different boundaries. Automatic finalisation is normally enabled; a permitted old-binary return must be rehearsed before that boundary. | [CockroachDB v25.4 Upgrade](https://docs.cockroachlabs.com/docs/v25.4/upgrade-cockroach-version) |
| SQL wire compatibility does not establish semantic compatibility. CREATE DOMAIN and PostgreSQL ranges are documented differences; the inherited deferred-reference case still needs a native check. | [CockroachDB v25.4 PostgreSQL Compatibility](https://docs.cockroachlabs.com/docs/v25.4/postgresql-compatibility), [Foreign Key Constraints](https://docs.cockroachlabs.com/docs/v25.4/foreign-key) |
| Distribution key choice determines co-location and fan-out; a shop-scoped schema variant is a useful extension for comparing Citus and application sharding. | [Citus Choosing Distribution Column](https://docs.citusdata.com/en/stable/sharding/data_modeling.html) |
| Approximate vector access can lose filtered candidates; iterative scans and alternative filtered paths must be measured against an exact eligible-set baseline. Embedding relevance is a separate evaluation. | [pgvector project documentation](https://github.com/pgvector/pgvector#filtering) |
| Comparing bounded clock uncertainty with HLCs is useful context for distributed reads, without commissioning a Spanner product branch or implying clocks alone supply atomic commit. | [Google Spanner TrueTime and External Consistency](https://docs.cloud.google.com/spanner/docs/true-time-external-consistency) |

An initial PostgreSQL row-security URL returned 404 and was corrected to `ddl-rowsecurity.html`. A v25.4 known-limitations URL was inaccessible. The Spanner paper landing page was opened, but the full paper was not read; the official TrueTime explanation above supplies the planning check. Some vendor documentation strips inline links/terms in the fetched view; that is not native behavioural evidence.

## Unresolved material decisions

1. **Accept the example extensions.** They are central proposals, not retroactive core facts. Integration should settle them before writers depend on them. No need to force every article into the full tenant/class/region variant.
2. **Pin implementation rehearsals.** The integration owner reports PostgreSQL 18.6 and a verified CockroachDB 25.4.17 binary. This planner did not execute them. Upgrade writers must choose supported source and target patches, extension versions and licence/edition prerequisites, including automatic-finalisation control, before writing native outcomes. The inventory’s exact old transition is not a current-release claim.
3. **Verify the inherited deferred-reference migration case.** The fetched v25.4 compatibility and foreign-key documentation does not settle deferrable support. Vendor comparison search results make broad support claims that conflict with the inherited assumption. Do not assert unsupported deferred constraints from historical drafts. Natively test the intended transaction on both pinned engines; if it works on both, teach a documented genuine incompatibility while retaining the application-contract, consistent-copy and fenced-return scope. This is an example decision, not a reason to remove RL132.
4. **Bound native experiment promises.** Each implementation writer must decide which failures can actually be reproduced within owned disposable tools. Co-located processes cannot establish regional latency or independent failure behaviour. A mechanism explanation can remain useful if its unexecuted parts are stated honestly, but native claims need recorded evidence.
5. **Keep the shared example minimal.** Product-description corpora, generated skew, vectors, spatial coordinates and detailed schemas are intentionally local until an explanation needs shared facts. Any further cross-article fact must be centrally recorded; do not inherit old workshop datasets.

## Ordinary continuity and mechanical checks

Reread the plan’s entry/outcome progression and the complete example record. Distinguish core snapshots, later history and isolated recovery states before use. Confirmed root introduction is preserved, original prices/totals and race ownership agree, class staff/customer roles are distinct, and proposed recovery identities do not collide with pagination rows.

Parsed the YAML, recursively counted exactly 58 unique destination IDs/slugs/keys, compared them with the inventory, confirmed the group totals, checked all neighbour and prerequisite references, and traversed the prerequisite graph for cycles. Checked that every non-root node has a non-empty brief, entry, two outcomes and four singular heading entries. Regenerated the 58-row packet JSON from the canonical tree and checked metadata equality. No site tests or native database experiments were needed or run for this planning-only assignment. These are mechanical/author checks; independent planning reviews remain the orchestrator’s next step.

## Actual timing

Clock observations, not estimated labour:

- 2026-10-23 **22:35:21 UTC** (24 October **00:35:21 CEST**): first clock read; input reading began.
- **22:36:16 UTC**: initial input, inventory and primary-source boundary checks complete; article plan assembly in progress.
- **22:44:01 UTC**: first complete 58-destination YAML written and uniqueness/reference/acyclicity checks passed.
- **22:47:32 UTC**: routes and example written; migration-compatibility uncertainty being checked.

The completion timestamp and final artefact hashes are appended after final local validation. No separate independent review time is claimed.

- **22:49:50 UTC** (24 October **00:49:50 CEST**): final local validation passed; handover prepared. Elapsed wall time from first observation: **14 minutes 29 seconds**. This includes reading, browsing, authoring and checking; it is not a claim of separate measured research/review durations.

Final content hashes at that validation:

| Artefact | SHA-256 |
| --- | --- |
| canonical tree | `03e6da014d6ac36bea44aba2a481a353684ef804b4fefa091d62adac3d021b05` |
| example record | `585c2c012f454239788058686ad5ce1474cb781b189bb9c6d919317e4200a0f3` |
| routes | `194654cbf3d7cb8d2bf5e3bfdc5e2a90befa771f6696aab64df2abc8841a5f10` |
| packet metadata | `f68345c43277d9eefff82b7f524ff7781f310e92105a55240c775f19310a3cca` |
