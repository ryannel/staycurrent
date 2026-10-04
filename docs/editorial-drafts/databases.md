# Databases: choosing by the work they do

Editorial draft for `/databases/`, prepared 2026-10-02. Links point to the
existing deep dives; those essays have not yet been rewritten to this format.

> A database makes some operations cheap by organising data around them.
> Choose one by the questions your application asks, the changes it makes,
> and the guarantees it needs when requests overlap or machines fail.

A shop stores orders, displays a product catalogue, searches descriptions,
and reports yesterday's sales. All four features use data. They ask the
storage system to do different work.

Checkout changes a few related records and must keep them correct. A product
page fetches an entity and its details. Search finds useful matches without
knowing their identifiers. A sales report combines values from many orders.
Start with these operations, and the database landscape becomes easier to
understand.

For a new application with ordinary transactional needs, I'd usually begin
with a relational database. Add a specialist when a concrete query,
correctness requirement, or operating constraint justifies the extra system.
The rest of this overview explains what those reasons can look like.

## Changing a few records correctly

Suppose checkout creates an order and reserves its stock. Those changes must
succeed together. Two buyers arriving at once must not both reserve the last
item.

A transactional relational database gives you tools to express those rules:
constraints, transactions, and ways to coordinate concurrent updates. Tables
also let you ask new questions by joining records after the data was written.
That flexibility is useful when the application's questions keep changing.

The physical organisation still matters. PostgreSQL places rows in pages and
uses separate indexes to help locate them. Bringing nearby bytes into memory
has a cost, so fetching a few complete records and scanning one value from
every record are different tasks. [PostgreSQL's page layout](https://www.postgresql.org/docs/current/storage-page-layout.html)
describes the storage behind that distinction.

Indexes reduce the work of selected reads, but writes must maintain them.
Transactions preserve rules, but concurrent requests can wait or retry.
These costs are often worth paying for orders, accounts, inventory, and other
records whose relationships matter.

The [relational deep dive](/relational/) uses PostgreSQL and MySQL to explain
the choices beneath SQL, the language used to query and change those tables.
SQLite supplies a further
question: does this application need a separate database server at all?

## Reading one entity with its details

A product page may need a title, images, specifications, and several variants
together. Keeping those details in one document can align storage with the
application's usual read.

The design question becomes where to draw the document's boundary. Embed
details that belong together and change together. Reference shared entities
when copying them would create difficult updates. MongoDB's modelling guide
explains both approaches and their effects on reads and writes.
[MongoDB data modelling](https://www.mongodb.com/docs/manual/data-modeling/best-practices/)

Imagine copying a supplier's address into every product. Reading a product
is convenient, but changing that address now touches many documents. A
supplier reference avoids those copies and requires another way to assemble
the page. Neither representation removes the relationship; it changes where
the work happens.

The [document deep dive](/mongodb/) uses MongoDB to teach aggregate boundaries,
indexes, and the consequences of spreading documents across machines. The
same modelling questions arise when storing JSON documents in a relational
database: the document format does not decide where relationships belong.

## Answering predictable questions across many machines

An order-history page has a narrower question: give me this customer's most
recent orders. A partitioned store can use the customer identifier to route
the request to the machines responsible for that data.

A **partition key** selects a portion of the data. A good key spreads the
actual traffic as well as the stored records. A customer receiving a large
share of all requests can overload its portion while other machines have
capacity. DynamoDB's guidance therefore ties key design to access patterns
and the distribution of activity.
[DynamoDB partition-key design](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-partition-key-design.html)

The trade becomes visible when a new screen asks for all orders awaiting
dispatch, across every customer. The original arrangement no longer locates
the answer directly. You need another index, another representation, or a
query that visits many partitions.

The [DynamoDB deep dive](/dynamodb/) develops this relationship between questions
and keys. The [Cassandra and ScyllaDB deep dive](/cassandra/) explores a related
family through sustained writes, sorted storage files, and replica repair.
Cassandra's replication model also makes the number of replicas consulted
part of the operation's consistency choice. Those guarantees need their own
explanation; a shared label such as “NoSQL” does not establish them.
[Cassandra's distributed design](https://cassandra.apache.org/doc/latest/cassandra/architecture/dynamo.html)

## Keeping transactions when data spans machines

Partitioning creates another problem for checkout. The order and its stock
may now live on different machines. The transaction must still keep their
changes together, including when a participant fails.

Distributed SQL systems address that problem while retaining a relational
interface. Replication and transaction coordination do different jobs:
replication keeps copies of data in agreement, while a transaction may need
to coordinate changes across several replicated groups.

Spanner, for example, uses Paxos replication, with a leader and a voting
quorum for each replicated split. Placing replicas farther apart changes
which failures the system can survive and the communication needed for a
write. [Spanner replication](https://docs.cloud.google.com/spanner/docs/replication)

Consider an order whose stock sits in another region. The application still
gets SQL, but geography is now part of its latency. The
[distributed SQL deep dive](/distributed-sql/) uses Spanner and CockroachDB to
explain this coordination and the choices that keep work local where possible.

## Serving frequently used state from memory

Suppose the shop repeatedly reads the same product summary. Keeping a copy
in memory can reduce repeated work on the main database. That introduces a
new correctness question: how does the copy change when the original changes?

This is the starting point for the [Redis and Valkey deep dive](/redis/).
It follows the consequences of shared in-memory state: expiry, invalidation,
memory limits, persistence, and recovery. Counters and other data structures
extend the idea beyond cached pages.

A fast acknowledgement also needs a precise meaning. Redis normally copies
writes to replicas asynchronously. A failover can lose acknowledged writes,
and waiting for replicas does not by itself provide strong consistency.
That may be acceptable for a copy you can rebuild and unacceptable for the
only record of an order. [Redis replication](https://redis.io/docs/latest/operate/oss_and_stack/management/replication/)

## Combining values from many records

The sales dashboard asks for totals by country over a month. Fetching each
complete order brings along addresses, notes, and other values the query
does not need.

A column-oriented analytical engine groups values by column. The query can
read the needed columns, compress similar values together, and process them
in batches. Sorting the data can also let it skip regions that cannot match
the filter. These are distinct reductions in work, and the
[column-store deep dive](/clickhouse/) builds them one at a time through
ClickHouse. [ClickHouse's query design](https://clickhouse.com/docs/concepts/why-clickhouse-is-so-fast)

The same choices explain the limits. A query for one full record needs a
different access pattern. Frequent changes to individual records complicate
storage designed around large batches. Analytical engines offer ways to
handle such changes, but those mechanisms have costs of their own.

This family includes different operating models. An embedded analytical
engine, a shared query service, and a managed warehouse may all use columns.
Choosing among them also requires knowing who runs queries, how data arrives,
and who will operate the system. Column layout alone cannot answer that.

## Finding relevant records without knowing their keys

A search for “waterproof walking shoes” asks the database to interpret words
and rank matches. Looking up a known product identifier is a different job.

Search engines build indexes suited to retrieval. An inverted index maps
terms to the documents containing them; the engine combines candidates and
scores them. The [Elasticsearch and OpenSearch deep dive](/elasticsearch/)
follows a document into that index, then follows a query back out.

The extra representation needs updating. Elasticsearch makes newly indexed
content searchable through a refresh, so accepting a write and exposing it
to search are separate events. A product can therefore be saved successfully
before it appears in search results.
[Elasticsearch's near-real-time search](https://www.elastic.co/docs/manage-data/data-store/near-real-time-search)

Vector similarity and graph traversal ask further kinds of questions. They
may justify dedicated machinery or an index inside an existing database.
The useful comparison is how the system performs the required retrieval,
keeps it current, and combines it with the application's other filters.

## Comparing two products in the same family

Family names give you a starting point. To compare actual systems, keep four
questions separate:

| Question | What to inspect |
| --- | --- |
| What does the application ask for? | Records, aggregates, ranges, relationships, or ranked matches |
| How is the data arranged? | Rows or columns, ordering, indexes, and the work required to update them |
| What does a successful operation promise? | Visibility to other readers, concurrent changes, and survival after failure |
| Where does the work happen? | One process or many machines, partition placement, replication, and operational ownership |

A managed service changes who performs operational work. It may also change
the storage architecture, but the word “managed” alone tells you neither its
transaction guarantees nor its query costs.

For the shop, begin by expressing checkout's correctness rules and its main
queries. Measure the dashboard and search needs against that starting system.
If a specialist earns its place, decide how data reaches it, how stale it may
be, and how to rebuild it. Each extra database introduces a data flow that
someone must understand and maintain.

The goal is to leave with questions you can ask of a new product. Follow one
write, one read, and one failure. Then change the workload and ask which
design choice becomes expensive.

---

Draft evidence note: linked primary documentation was consulted on 2026-10-02.
The shop scenario, family grouping, and starting recommendation are editorial
synthesis. No performance measurements were made for this draft. A published
version needs its own provenance, changelog, and research-log entry.
