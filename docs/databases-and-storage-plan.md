# Databases and storage: revised depth and page plan

18 October 2026. **Revised proposal for discussion.** This replaces the first
field plan at revision 1eac226. The user asked for each collection to be derived
independently, including relational, before returning to the page structure.
This commission remains planning: no article rewrite or publication is authorised.

## What changed in the method

Nine fresh practitioner contexts derived their own expert tasks, decomposed them
into teachable units, saved that breakdown, and only then assigned pages. They
did not read the existing article inventories, the previous field plan or one
another's outlines. The original abilities and proposals remain available in
[the derivation record](planning/databases-depth-2026-10-18/README.md).

Three independent reviewers first recorded their own practitioner abilities, then
challenged the proposals for missing understanding and unnecessary reading cost.
A separate reader saw only titles/groupings and the audience. Their first readings,
disagreements and repairs are retained. This is evidence for a better planning
decision, not proof that unwritten articles teach well.

The existing site was reconciled afterwards as reusable work. No collection's
count, product branch or page boundary was protected because it already existed.
The three house references remain teaching calibrations: worked cases for
Sequence diagrams, measured access work for Indexes, and a causal mechanism/failure
chain for Storage and durability. Their shapes are not a template for every topic.

## The resulting structure

Start with the [page tree](databases-and-storage-page-tree.md) to scan titles,
or the [field map](coverage/databases-and-storage.md) for shared ownership and
explicit limits. Every linked collection map gives the ability-to-section homes,
entry needs, proposed teaching forms, necessary changed/failure cases and split/
keep reasoning. The original derivations show how those boundaries were reached.

| Collection | Family/shared pages | Implementation pages | Total | Selected implementation depth |
| --- | ---: | ---: | ---: | --- |
| [Field guide and shared decisions](coverage/databases-and-storage.md) | 7 | 0 | 7 | — |
| [Relational databases](coverage/relational.md) | 31 | 23 | 54 | PostgreSQL 13; CockroachDB 10 |
| [Document databases](coverage/documents.md) | 9 | 14 | 23 | MongoDB 14 |
| [Key-value and wide-column stores](coverage/key-value-and-wide-column.md) | 7 | 30 | 37 | DynamoDB 13; Cassandra 17; Redis links to the in-memory branch |
| [Analytics and time series](coverage/analytics.md) | 28 | 18 | 46 | ClickHouse 10; Iceberg stack 3; Timescale 3; DuckDB 2 |
| [Search and vector retrieval](coverage/search.md) | 28 | 12 | 40 | Elasticsearch 12 |
| [Graph databases](coverage/graphs.md) | 18 | 14 | 32 | Neo4j 9; Jena TDB2/Fuseki 5 |
| [Caches and in-memory stores](coverage/caching.md) | 10 | 7 | 17 | Redis 7, shared with authoritative keyed use |
| [Object storage](coverage/object-storage.md) | 16 | 11 | 27 | Amazon S3 11 |
| [Filesystems and block storage](coverage/files-and-block-storage.md) | 19 | 11 | 30 | Linux XFS/LVM/LUKS 7; EBS 2; Linux NFS 2 |
| **Total** | **173** | **140** | **313** | Initial branches are optional reader paths |

These are distinct proposed investigations, not a quota, a mandatory reading
sequence or a promise that every article will be long. Product pages are counted
separately so that a general introduction cannot conceal all of a product's
mechanisms in one nominal chapter. The totals include the seven shared pages.
Existing tools, compatibility aliases, retained references and the dated vector
assessment are separate.

Relational now has 31 family-level investigations, including its distributed
path, and two native branches. Its 54 pages were re-derived rather than inherited.
MongoDB's fourteen native investigations can now be compared with PostgreSQL's
thirteen on the actual work they teach; neither count establishes completeness.
The general document route is shorter because it teaches common document choices,
while non-portable execution, replica and client contracts have explicit native
homes. Other families follow their own ability chains rather than that division
being imposed on them.

## The substantial decisions

**Relational starts again from facts and behaviour.** Result meaning, concurrent
invariants, execution, crash recovery, promotion, change and distribution are
distinct journeys. PostgreSQL and CockroachDB are proposed coherent native
branches. Native PostgreSQL concurrency is explicitly assigned to the general
reservation/locking/retry investigations with actual engine labels and exercises.
CockroachDB schema jobs, upgrades and SQL migration now have separate state
machines after review. SQL Server, MySQL and SQLite remain credible conditional
comparisons; they are not nominal one-page promises of operator expertise.

**Documents reaches the mechanism and client boundary.** The MongoDB branch
separates local storage, nested indexes, pipeline execution, transaction retry,
surviving replica history, client observation, shard-key choice, active reshaping,
streams, migration, recovery, diagnosis and secure maintenance. The general route
still decides the document boundary, query meaning and application invariant.

**Keyed and wide-column work have separate entrances.** DynamoDB and Cassandra
get substantial branches because their access, mutation, replication and
maintenance obligations differ. Cassandra repair coverage, compaction cost,
tombstone safety and useful restore each have a real investigation. Its duplicate
query tables now require native interrupted-write and repair evidence. Bigtable
has meaningful selection contrasts; full operation is an explicit possible branch.

**Analytics contains several different jobs.** Analytical grain and aggregate
meaning precede performance. Column layout, execution, corrections, source-copy
completeness, shared table formats, time-series measurements and continuously
maintained results each have their own outcomes. ClickHouse is the full serving
branch, alongside bounded Iceberg, Timescale and DuckDB paths. Managed warehouse
and maintained-SQL service operation remain explicit alternatives, not expertise
claimed by a comparison. Time-series selection compares real competing designs.

**Search is judged at the result and at the storage boundary.** Lexical matching,
representation, exact/approximate access, filtering, fusion and reranking retain
separate errors and tests. Source versions, deletion, permission, index generations
and partial failures survive the path to a displayed result. Elasticsearch has a
twelve-investigation native branch. Dense-vector basics are the first vector
route; learned sparse and late interaction are optional selection-level contrasts.

**Graphs includes two models with different answers.** Property-graph paths,
multiplicity, expansion and analytics have a substantial route. RDF identity,
entailment/validation, SPARQL and federation have another, with Jena native work
beside Neo4j. This broadens the previous plan's RDF boundary deliberately. No
property-graph reader must finish RDF first; no RDF reader is told that Neo4j
syntax supplies equivalent semantics.

**In-memory state is not automatically disposable.** Cache validity, overload and
admission have their own explanations. Accepted state additionally needs atomic
operations, a stated survival contract and useful recovery. There is one Redis
implementation branch for both roles. Review added permission revocation and the
case where an operation survives but its deduplication evidence does not.

**Object storage is derived from application protocols.** Names and bytes,
integrity, uncertain requests, complete releases, upload acceptance, authority,
delivery, events, retention and recovery are independently bounded questions.
S3 gets eleven focused native investigations. Tables and vectors are recognised
as different resources; their general teaching stays in analytics and retrieval.
Self-hosted object-cluster operation would need a separate product derivation.

**Files and volumes follow the real layers.** Application-safe persistence,
filesystem structural recovery, device failure, concurrency, sharing, measurement,
integrity and application restore are different obligations. A Linux
XFS/LVM/LUKS path, EBS and NFS make the mechanisms executable. The build/mount path
is explicit. Windows/SMB, full OpenZFS, clustered storage and firmware expertise
are not supplied by the comparison.

## Shared homes and reading cost

Evaluation, a generic source-to-copy handover and whole-store authority cutover
each have one full shared home. Their repeated relational and keyed destinations
have been removed. Analytical semantic reconciliation, search-generation
compatibility and graph endpoint/deletion repair remain in their collections:
they finish different application decisions. The field map names the exact joins.

B-trees, logs, compaction and snapshots are taught where a collection's decision
needs the mechanism. There is no new foundations course that every reader must
complete. A brief local explanation makes each direct entrance usable. The maps
distinguish that reminder or application from a second full tutorial.

The reviewers retained several potentially large but coherent investigations:
MongoDB's local storage path, cache persistence versus replica failure, object
publication versus upload acceptance, and filesystem recovery versus application
persistence. They also preserved a real disagreement about Cassandra backup and
restore: separate pages remain because file-set completeness and timestamp-aware
application reconciliation can each need a full investigation. Briefs must test
that boundary again with the actual explanation, rather than deleting its final
consequence to make a shorter page.

## Entrances we should test together

The page tree has a small task directory before the full inventory. Newcomers get
an introduction; selectors get a conditional comparison; incident readers enter
the relevant state history or diagnostic case. The collection maps hold fuller
paths. The tree's IDs are discussion references, not a sequence or public routes.

Look first at whether the core family routes lead to the understanding we want.
Then inspect one native branch to test whether the actual commands, observations,
failure states and recovery decisions have room. Product breadth is a separate
choice from how deeply a selected implementation is taught.

## Existing reading and what this plan changes

[Existing-reading reconciliation](planning/databases-depth-2026-10-18/existing-reading-reconciliation.md)
records candidate reuse, splits/merges and explicit retained-reference status.
It does not certify the old prose against the new outcomes. Current URLs,
publication metadata and available-reading navigation stay intact during planning.
The detailed previous Indexes/Storage allocation is preserved for article-work
provenance, rather than allowed to dictate the new relational collection.

Keep the current column-store essay route as the candidate home for column-layout
teaching, with the surrounding analytics structure derived independently.
Existing PostgreSQL search/vector/extension and S3 specialised-resource reading
remains available while its future place is assessed. A comparison, source link
or existing experiment does not silently discharge the new teaching obligation.

## Decisions for our discussion

1. **Initial implementations.** Are these the right concrete systems for each
   route? PostgreSQL/CockroachDB, MongoDB, DynamoDB/Cassandra, ClickHouse plus
   Iceberg/Timescale/DuckDB, Elasticsearch, Neo4j/Jena, Redis, S3 and the Linux
   storage stack are proposed learning choices, not long-term vendor commitments.
2. **Specialist breadth.** RDF now receives actual depth. Time-series and
   continuously maintained results also have substantive routes. Full GIS,
   scientific-array storage, broad offline synchronisation and other specialist
   curricula have explicit limits. We should decide whether any limit cuts out
   a reader we intend to serve.
3. **Production scope.** The map is the whole proposed route; it is not a single
   writing batch. After our discussion, choose connected reader journeys whose
   prerequisites and native resources can actually be completed together.

Native version/edition/service access is not settled by a page title. CockroachDB
multi-node exercises, Neo4j features, Elasticsearch inference/security, the Iceberg
catalogue, Timescale APIs and the precise Linux/cloud stack need a reproducible
choice before their later briefs promise execution. A model can expose states;
it cannot stand in for an unrun product failure or restore.

The revised plan is ready for us to examine. No article has been rewritten and
no new reading has been published through this work.
