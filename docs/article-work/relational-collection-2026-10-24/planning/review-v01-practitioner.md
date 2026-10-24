# Practitioner review · tree · complete relational collection · plan-v01

Inputs read: the frozen `v01/manifest.json`, `commission.md`, complete `tree.yaml` (six bounded sections), complete `example.md`, `routes.md` and `planner-sources.md`. Applied `.agents/skills/staycurrent-review/SKILL.md` and only its practitioner perspective. No article drafts, earlier reviews, history, other new reports or generated packet index were read. The accepted introduction itself was withheld; its starting understanding is assessed from the supplied root brief, routes and clean example.

Highest severity: **medium**.

This is initial independent whole-plan coverage, not the required later fresh complete review or approval of written/native implementations.

## Snapshot verification

Independently calculated SHA-256 values match the manifest for all five permitted content inputs:

| Input | SHA-256 |
| --- | --- |
| tree.yaml | `03e6da014d6ac36bea44aba2a481a353684ef804b4fefa091d62adac3d021b05` |
| example.md | `585c2c012f454239788058686ad5ce1474cb781b189bb9c6d919317e4200a0f3` |
| routes.md | `194654cbf3d7cb8d2bf5e3bfdc5e2a90befa771f6696aab64df2abc8841a5f10` |
| commission.md | `ad5c6537dfa1677737fd23bae0c3c7d1ee9a360b59450db64b30a89a1803e3b8` |
| planner-sources.md | `277aaeb794235f86ff85af105575b63c5abb590baafa03a8c6268bab6928bee1` |

`articles.json` is listed by the manifest but outside this assignment's permitted inputs; I did not read or hash it. The manifest is the supplied attestation, not an independently authenticated signature.

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Correctness | finding | Broad mechanism/product distinctions agree with the primary sources below. Practitioner-1 identifies a missing condition for the guard-row protocol; practitioner-2 identifies an incomplete reconciliation handover. |
| 2. Evidence | pass | Core states, proposed extensions, conceptual schedules and native observations are explicitly distinguished. Installed binaries are availability metadata. No unrun database command or measured performance is presented as observed. |
| 3. Coverage | finding | All 58 destinations have useful outcomes and boundaries. The awkward snapshot/lock case, final recovery convergence and native CockroachDB tenant acceptance need explicit coverage (practitioner-1–3). |
| 4. Depth, both ways | finding | Mechanisms generally reach decisions and failure cases rather than lists of names. Missing depth is localised in practitioner-1–3. No whole destination or proposed mechanism is demonstrably unnecessary relative to the retained commission. |
| 5. Ownership | pass | 58 unique IDs, slugs and stable keys; no missing prerequisite/neighbour references or prerequisite cycles. General mechanisms and native practice have distinct owners. The CockroachDB tenant implementation owner needs a stronger acceptance outcome, not another destination. |

## Complete route and ownership assessment

I read each destination's entry, outcomes, boundaries and headings. The independent structural check counted one root, 30 general/distributed articles, 13 PostgreSQL implementation articles, ten CockroachDB implementation articles and four PostgreSQL specialists. The ownership check goes beyond the unique IDs:

| Destinations | Practitioner contribution and boundary |
| --- | --- |
| RL76; RL77–RL85; RL89 | The root establishes the shop; design, value semantics, enforcement and history have separate owners. Query grain precedes aggregation/window order and continuation/export contracts. Conditional writes/import policy and application connection ownership are distinct. Partition lifecycle answers a retention/pruning question separately from distribution. |
| RL86–RL87; RL90–RL94 | Access work and full-plan diagnosis are separated. Transaction invariant choice, lock scope, physical versions, request identity and external effects each own a different failure boundary. The guard-row snapshot condition is the main missing concurrency case. |
| RL95–RL98; RL100; RL102–RL104 | Crash ordering, restore/reconciliation, replica freshness and authority transfer are separate answers. Schema compatibility/convergence, workload admission, causal incident diagnosis and runtime authority each end in an actionable acceptance decision. RL129's final handover must remain consistent with these general obligations. |
| RL105–RL109 | Shard key/locality and invariant scope lead to cross-partition atomicity, common reads, quorum/failure placement and safe movement. The plan avoids teaching Raft agreement as transaction atomicity, dividing the last mug into fictitious regional stock, or treating another node as a cure for one hot row. |
| RL110–RL122 | PostgreSQL layout supplies the native base; vacuum, index/operator contracts, plan repair and JSON have different practical outcomes. WAL settings, verified PITR, physical promotion and logical row streams retain distinct failure promises. DDL, incident response, privilege policies and upgrade/move acceptance have named native owners. |
| RL123–RL132 | CockroachDB key/range ownership, transaction/retry protocol, read contracts, query/KV work, region configuration, operations, restore, schema jobs, upgrade and engine migration cover different decisions. Native tenant denial is weaker than its upstream promise; deferred-reference incompatibility remains a correctly disclosed unresolved experiment. |
| Four PostgreSQL specialists | Distributed PostgreSQL placement owns co-location and transfer rather than table partitions. Lexical retrieval owns linguistic matching/ranking; vector retrieval owns geometry, eligible-set exact baselines and recall; types/extensions own range/spatial meaning and operational dependencies. Parent index introductions need not become second complete specialist treatments. |

The routes allow entry by existing understanding and stopping when a task is answered. The prerequisite graph is acyclic, and cross-branch prerequisites generally correspond to real understanding needed for the promised task. A newcomer can build from row meaning to practical application correctness before following operations or distribution. Writers must retain that distinction between concept prerequisites and mandatory completion of every linked page. I found no justification to require further whole articles, formal normalisation proofs, every index method, every extension or another database family.

## Findings

### practitioner-1 · medium · RL91 “What a lock protects” / RL90 “Serializable work” / example E2

Problem: `tree.yaml:860–875` proposes locking the session guard row before checking capacity and comparing that protocol with Serializable, but does not require the guard protocol's snapshot condition to be explained. E2 (`example.md:93`) likewise permits an existing guard row. The plan explicitly handles the empty-bookings case, but a lock-only guard is not by itself a complete protocol under a transaction snapshot already established before a competing booking commits.

Effect: A reader can apply the apparent repair under PostgreSQL Repeatable Read, wait for the guard, then count bookings through an older snapshot. For example, one transaction only locks the unchanged guard and inserts its booking; a competing transaction establishes its snapshot while waiting on that guard. Once admitted, the second transaction's ordinary count can still exclude the first booking. Serialising lock acquisition has not refreshed that count. The reader cannot confidently choose between the plan's guard, conditional-counter and Serializable alternatives without supplying this condition.

Suggestion: Make RL91 own the isolation/snapshot preconditions of the complete guard protocol and have RL90's comparison respect that boundary. A repair should distinguish a fresh Read Committed check after acquiring authority, an actual conflicting guard update with whole-transaction retry where appropriate, and Serializable; require every relevant writer to use the chosen authority. Include the already-established-snapshot/waiting case in the eventual native acceptance. No particular presentation or SQL implementation is required.

Evidence: This is a source-derived counterexample, **not a native observation**. PostgreSQL documents the fixed Repeatable Read snapshot, distinguishes an actually changed row from a merely locked row, and directly warns that snapshots predating explicit lock acquisition may omit now-committed changes. [PostgreSQL 18 Transaction Isolation](https://www.postgresql.org/docs/18/transaction-iso.html), [Application-level Consistency](https://www.postgresql.org/docs/18/applevel-consistency.html), [Explicit Locking](https://www.postgresql.org/docs/18/explicit-locking.html).

### practitioner-2 · medium · RL129 “Reconciliation and handover”, tree.yaml:651–653

Problem: The native brief orders replay of B203 and external-effect checks, **then** fencing of old writes. It provides no final catch-up or acceptance after that fence. RL96's parent explanation instead says to keep the original system fenced during reconciliation. These are different recovery protocols unless an already-fenced starting state or a final convergence phase is made explicit.

Effect: A further valid booking can commit on the old authority after the recovery process has enumerated/replayed valid work and before it fences that authority. The restored service can then pass the stated B203/capacity checks while excluding this later booking. An intelligent newcomer cannot infer when the reconciliation set becomes closed or what makes its final acceptance authoritative.

Suggestion: Give RL129 one explicit handover contract: either fence before final enumeration/reconciliation and remain fenced through acceptance, or permit preliminary live catch-up followed by a fence, final catch-up and repeated invariant/identity checks. State how in-flight and uncertain requests are resolved. Preserve the general owner RL96 and native execution owner RL129.

Evidence: The contradictory sequencing is in the supplied briefs. CockroachDB documents restoring a selected backed-up history into new objects/destinations; restore completion does not copy subsequent source-side work. The gap above is an inference about the application handover, not a claim that RESTORE itself loses backed-up rows. [CockroachDB v25.4 RESTORE](https://docs.cockroachlabs.com/docs/v25.4/restore).

### practitioner-3 · medium · RL128 “Permission boundaries” / routes.md “Secure shop boundaries”

Problem: The security task route sends CockroachDB readers from RL104 to RL128. RL104 promises testing cross-tenant reads under the trusted runtime identity; PostgreSQL RL121 develops that implementation. RL128 (`tree.yaml:1837–1839`) requires only a reporting role's allowed read and denied write, with policy support mentioned as a distinction. It does not require an actual tenant boundary, trusted tenant selection or denied cross-shop read/write test.

Effect: A reporting role can correctly have read-only access while still reading both shops. Passing the native tests as currently commissioned would not demonstrate the tenant boundary the route develops, and the reader must design and validate the crucial native enforcement/trust arrangement themselves.

Suggestion: Keep the general trust model in RL104 and make RL128 own its CockroachDB acceptance: show the chosen runtime identity and trustworthy tenant selection, exercise allowed and cross-shop denied operations, and account for the chosen mechanism's bypass limits. This need not mandate row policy over another deliberate authority design, but a table-level denied write alone is insufficient.

Evidence: The supplied routes and briefs establish the gap. The official v25.4 RLS documentation distinguishes table privileges from per-row policy, and has separate tenant-isolation verification and limitations. It establishes an available documented mechanism; it does not prove any local configuration was tested. [CockroachDB v25.4 Row-Level Security](https://docs.cockroachlabs.com/docs/v25.4/row-level-security).

## Primary-source checks beyond the findings

These are independent checks of consequential planning boundaries, not adoption of the planner's source verdicts or complete command-level verification.

| Planning area | Check and primary evidence |
| --- | --- |
| Conditional writes, isolation and cross-row checks | PostgreSQL Read Committed waits/rechecks affected rows; Repeatable Read and Serializable have different snapshot/anomaly/retry boundaries. NULL can satisfy CHECK; ordinary row checks do not enforce arbitrary cross-row rules. [Isolation](https://www.postgresql.org/docs/18/transaction-iso.html), [Constraints](https://www.postgresql.org/docs/18/ddl-constraints.html). |
| Deferred/partition constraints | PostgreSQL supports deferral for specified constraint classes, not every rule. Partitioned uniqueness has partition-key limitations. The plan correctly commissions engine-specific boundaries rather than universal global indexes. [CREATE TABLE](https://www.postgresql.org/docs/18/sql-createtable.html), [Partitioning](https://www.postgresql.org/docs/18/ddl-partitioning.html). |
| Versions and JSON | Old physical versions remain needed by snapshots; ordinary vacuum generally reuses space rather than shrinking files. Updating a JSON document still locks its row. [Vacuuming](https://www.postgresql.org/docs/18/routine-vacuuming.html), [JSON Types](https://www.postgresql.org/docs/18/datatype-json.html). |
| Recovery and streams | Physical PITR requires a suitable physical base plus needed WAL; pg_dump is not that replay base. PostgreSQL logical replication omits DDL and sequence state. [PITR](https://www.postgresql.org/docs/18/continuous-archiving.html), [Logical Replication Restrictions](https://www.postgresql.org/docs/18/logical-replication-restrictions.html). |
| Native policy authority | PostgreSQL owner, superuser and BYPASSRLS behaviour justify actual-role testing and the separate privileged-code boundary. [Row Security](https://www.postgresql.org/docs/18/ddl-rowsecurity.html). |
| Index and lexical semantics | Access method/operator class determines applicable predicates; lexical configuration and positions determine matching separately from an index existing. [Index Types](https://www.postgresql.org/docs/18/indexes-types.html), [Text Search Introduction](https://www.postgresql.org/docs/18/textsearch-intro.html). |
| CockroachDB transactions and reads | The transaction layer supports Serializable and Read Committed; intents, staging and proven writes must be distinguished from textbook two-phase commit. Closed timestamps support safe follower history; GLOBAL permits strong follower reads. [v25.4 Transaction Layer](https://docs.cockroachlabs.com/docs/v25.4/architecture/transaction-layer), [v25.4 Follower Reads](https://docs.cockroachlabs.com/docs/v25.4/follower-reads). |
| CockroachDB placement and upgrade | Table locality and survival goals are distinct. Default automatic finalisation and its irreversible compatibility boundary justify an explicitly controlled rollout experiment. [Multi-Region Overview](https://docs.cockroachlabs.com/docs/v25.4/multiregion-overview), [Upgrade](https://docs.cockroachlabs.com/docs/v25.4/upgrade-cockroach-version). |
| Distribution and approximate retrieval | Citus co-location depends on the distribution column and query scope. pgvector approximate post-filtering can reduce returned candidates; exact filtered baselines and iterative-scan limits are useful planned judgement. [Citus Distribution Column](https://docs.citusdata.com/en/stable/sharding/data_modeling.html), [pgvector Filtering](https://github.com/pgvector/pgvector#filtering). |

## Limits and unresolved execution assumptions

- No database, application or failure experiment was run. PostgreSQL 18.6 availability and the owner's CockroachDB 25.4.17 binary are not correctness evidence. Exact patches, drivers, extensions, licences, settings and rehearsals remain writing decisions.
- The deferred-reference CockroachDB migration case remains unresolved. The v25.4 [foreign-key page](https://docs.cockroachlabs.com/docs/v25.4/foreign-key) did not settle deferral; absence of a documentation mention is not proof of unsupported execution. Keep the planner's two-engine native test and alternative genuine-incompatibility branch. I do not count the disclosed uncertainty as an established false claim.
- The Citus and pgvector references inspected are moving documentation. They support the planning choices, not a frozen extension-version outcome. Writers still need pinned evidence. A failed guessed CockroachDB RLS URL was corrected through the official documentation link to `row-level-security`.
- No source here establishes production performance, independent regional failures, restore times, loss budgets or any finished article's prose/figure quality. Co-located process drills remain limited as the plan says. Model arithmetic and core history were checked as supplied facts, not discovered production data.
- No plan, example, article or skill was edited; no delegation, review arrangement, build, server, commit or publication was performed. Only this report was written.

## Actual timing

- Start: **2026-10-23 22:50:54 UTC** (**24 October 00:50:54 CEST**), first clock observation before permitted input reading.
- End: **2026-10-23 22:56:27 UTC** (**24 October 00:56:27 CEST**), report validation and unchanged-input hash check complete. Elapsed wall time: **5 minutes 33 seconds**. Times are wall-clock observations, not separate research/native-test labour claims.
