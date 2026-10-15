# Capacity and ownership

Commissioned by the operator’s relational-completion request on 15 October 2026.
The three articles follow the exact capacity-group scope in
`src/lib/relational-collection.ts`. They remain working drafts pending independent
review, rendered inspection and the coordinator’s publication step.

The reader can follow ordinary SQL, indexes and transactions, and may enter from
the performance article with a concrete workload limit. Each page also introduces
its own subject before using the tenant or price example.

- **Scaling a relational database** should let the reader identify what additional
  capacity an arrangement actually supplies: less work, more resources on one
  server, cached answers, query-serving copies or independent write owners. It
  follows requests and remaining shared work, then tests the choice under a node
  or region failure. It does not rank products or promise linear scaling.
- **Replication and failover** should let the reader distinguish a saved change
  from an applied change, trace the acknowledgement their application received,
  choose a read source with the required freshness and identify who may replace
  the writer. Failure detection, fencing, candidate history and ambiguous client
  outcomes stay connected. This is more than a list of replication settings.
- **Partitioning and sharding** should let the reader choose useful boundaries
  from access, maintenance and transaction needs. Real PostgreSQL partitions
  establish pruning and key scope. Tenant ownership then motivates co-location,
  global rules, hot tenants and an online movement protocol with explicit final
  admission pause, drain, replay, verification and cutover.

The main article retains explanation of each alternative rather than becoming a
directory. Its children investigate different questions: what a copy can promise,
and how a data boundary changes queries, rules and movement. The examples preserve
one €20 → €25 update and one tenant history so the reader can derive the outcomes.

Supporting media is code-native. The main page compares copied versus divided
records with labelled containers that stack on a phone. Tables show copying
stages, acknowledgements, ownership, and the before/after records of a tenant
move. SQL lessons are available when the reader wants to vary those records.
There is no generated artwork or decorative architecture diagram.

Three lessons in `src/lib/sql-lessons/capacity.ts` contain eighteen steps:
`replica-freshness` (5), `partition-pruning` (6), and `shard-cutover` (7).
Partitioning is actual engine behaviour. The other two are explicitly labelled
ordinary-table models on one connection. They cannot establish real replication,
distributed transaction atomicity, concurrent fencing, network behaviour or
physical durability. The ownership model’s sequential gate must not be offered
as a production concurrent admission protocol.
