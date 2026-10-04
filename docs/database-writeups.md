# Database writeups

Historical planning notes. On 2 October 2026 the operator chose to remove the old
article library and keep the Explore pages as the reference work. The legacy
article paths below are no longer live; use [the site direction](site-direction.md)
for the current plan.

The database overview should teach the major design choices. Each linked
essay should explain a family through representative products, with enough
detail to predict how the design behaves under a new workload.

The current nine articles already contain useful research. Their main weakness
is the order of explanation: most introduce product history and a complete
architecture before giving the reader a problem that requires those parts.
The overview repeats much of their product coverage. Its opening names only
three reasons to leave Postgres, while its later sections describe several
other workloads that can justify a specialist.

## The proposed reading map

These groups organise the reading experience. They overlap: distribution,
memory residency, storage layout, and data model are separate design choices.
Existing URLs can continue to identify the same subject as titles and prose
become more explicit about the family they teach.

| Reading | Representative systems | Teaching sequence |
| --- | --- | --- |
| Overview: choosing a database by the work it must do | Examples from the essays below | One application with different questions → major families → shared design dimensions → conditional choices |
| Relational databases: keeping changing records correct | PostgreSQL and MySQL, with SQLite as an embedded contrast | One order → pages and indexes → two writers → transactions and row versions → recovery → replicas and their limits |
| Document databases: choosing what belongs together | MongoDB | One catalogue page → embedded document → duplicated data → shared updates and transactions → indexes → sharding and hot aggregates |
| Partitioned key-value access: designing around the question | DynamoDB | One customer's orders → partition and sort keys → a second query → secondary indexes and duplication → skew → guarantees across replicas |
| Wide-column stores: writing across many machines | Cassandra and ScyllaDB | Event history by device → buffered writes and sorted files → compaction → replicas → stale versions, repair, and deletes → partition boundaries |
| In-memory stores: serving shared state quickly | Redis and Valkey | A repeated lookup → cached copy → expiry and invalidation → concurrent commands → memory limits → persistence and failover |
| Distributed SQL: keeping transactions correct across machines | Spanner and CockroachDB | One transactional database → partitioned data → replicated partitions → a transaction across partitions → coordination and failure → regional placement |
| Column stores: answering questions over many events | ClickHouse, compared with DuckDB and warehouses | One dashboard query → column layout → compression → sorting and sparse indexes → immutable parts and merging → rollups → replication and sharding |
| Search engines: finding and ranking relevant records | Elasticsearch and OpenSearch | A text query → tokenisation and inverted lists → scoring → segments and refresh → updates → shards and replicas → specialised retrieval |

DynamoDB and Cassandra sit beside each other in the overview's partitioned
access family. Separate deep dives earn their place through the different
decisions they teach. Neither product's implementation or consistency model
should be inferred from the other's.

Graph traversal, vector similarity, and time-series retention can appear as
boundaries or extensions where they affect the choice. They do not each need
an article simply to fill out a taxonomy. A dedicated article earns its place
when there is a substantial mechanism and workload to teach.

## Working visual prototypes

The operator's correction on 2026-10-02 sets the format: deeply visual essays
with working tools readers can manipulate. The Markdown drafts below are
research and narrative material, not the finished experience.

- `/explore/databases/`: an interactive map from application jobs to design
  families, mechanisms, and costs.
- `/explore/column-stores/`: the first visual pilot, with an original imagegen
  illustration and four working models: page reads, block exclusion, part
  merging, and replica acknowledgement and failure.

The new routes are local, uncommitted prototypes and carry `noindex`. They do
not replace published topic versions. Only the column-store deep dive has
the new treatment so far. The other deep dives need their own visual scenes
and interactions, rather than copies of the column-store controls.

## Earlier prose drafts

- [Database overview](editorial-drafts/databases.md): a shorter map organised
  around workloads and design decisions.
- [Column stores through ClickHouse](editorial-drafts/column-stores.md): a
  complete pilot essay using one events dashboard, with static visual stages.

These are editorial drafts outside the site's content collection. They do not
change a published topic's version or research date. The remaining deep dives
have teaching outlines above; their prose has not yet been rewritten.

After reviewing the pilot, apply the same approach to the other essays and
prepare each revised topic's version, changelog, research log, and provenance
together. Keep the existing frozen versions. The research skill governs the
operator's publication decision.
