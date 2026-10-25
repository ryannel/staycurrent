# Table partitioning planning record

The accepted ownership tree is unchanged. No new child outcome needs a page;
the article can teach partition choice and retirement coherently in one reading.
The current query-execution parent already establishes monthly pruning, the
October/full-year contrast and the distinction from servers. This outline develops
the proof, design costs and integrity/lifecycle consequences rather than repeating
the parent's query-plan instruction.

## Reference exposure

Read all six Sequence diagrams, seven Indexes and six Storage and durability
bounded text parts separately using the supplied script; every END marker arrived.
Studied finished drawings in an owned temporary IAB tab on port 4584: Indexes'
selectivity/page-selection drawing, Sequence diagrams' outbox interaction, and
Storage's WAL state drawing with their surrounding prose and controls. Read the
current query-execution parent on port 4606. The tab was closed; viewport and theme
were unchanged. No main-repository files, old bodies, outlines or reviews were read.

The references suggest establishing one visible mechanism before its variants:
route one order, exclude incompatible month ranges, then expose the integrity and
retirement consequences. Make the difference between pieces excluded and work
remaining visible, as Indexes distinguishes matching rows from pages read. Leave
the drawings and prose development to the writer; the briefs identify understanding,
not a visual specification.

## Shared example decisions

Coordinator approved the following independent variation during this assignment:

- A monthly-partitioned copy of the exact generated 2026 workload, preserving core
  and generated rows, IDs and statuses. It is neither the live schema nor evidence
  that a table of this size warrants partitioning.
- A hypothetical policy has already approved retirement before 2026-02-01 00:00 UTC.
  January is wholly eligible; contrast a cutoff inside January. No retention duration
  or legal meaning is inferred. Core October orders remain unaffected.
- `order_id` remains globally meaningful. A proposed `(order_id, placed_at)`
  constraint is a comparison with a different enforced contract, not a silent
  replacement of the canonical key. Incoming references and related lines do not
  disappear when an orders partition is removed. Retained recovery copies matter.

These are approved facts for central inclusion in the canonical example record;
this worker has only recorded them here, within its assigned workspace. No extra
rows or IDs are needed. Use the generated history for distribution and evidence,
and the existing October rows to keep row meaning legible. Payments exist only for
the supplied core orders; do not invent January payments to motivate references.

## Primary sources checked, 25 October 2026

- [PostgreSQL 18, Table Partitioning](https://www.postgresql.org/docs/18/ddl-partitioning.html):
  routing and half-open ranges; pruning independent of indexes, including execution
  parameters; partition-key inclusion in unique constraints; maintenance and
  partition-count costs. Use PostgreSQL qualifications for its concrete example.
- [PostgreSQL 18, ALTER TABLE](https://www.postgresql.org/docs/18/sql-altertable.html#SQL-ALTERTABLE-DETACH-PARTITION):
  detach preserves a standalone table; referencing tables participate in locking;
  concurrent detach has restrictions and can need finalisation. Avoid promising
  instantaneous or lock-free retirement.
- [MySQL 8.4, Partitioning restrictions](https://dev.mysql.com/doc/refman/8.4/en/partitioning-limitations.html):
  partitioned InnoDB tables cannot participate in foreign keys. This is a useful
  brief portability qualification, not grounds for a multi-engine DDL catalogue.
- [CockroachDB, Table Partitioning](https://docs.cockroachlabs.com/docs/stable/partitioning):
  placement uses partitioning with replication configuration and differs from
  PostgreSQL's table pieces. Cross-machine mechanisms remain with distribution and
  CockroachDB implementation owners.

## Evidence and boundaries for the writer

The pruning and lifecycle illustrations may be explicit models. Any claim about
an observed plan, rejected duplicate/reference, routing error, detach behaviour or
time saved requires an owned native execution and retained settings/results. A
bounded PostgreSQL fixture can compare month/full-year/order-ID predicates and
constraint choices without turning this article into a deployment runbook.

Do not assume that restricting orders by time prunes `order_items`, that a sequence
enforces global uniqueness, or that a detach invokes row deletion cascades. Decide
how referenced data is handled before showing a successful removal; verify the
exact native operation if shown. Keep full migrations/backfill procedures with
schema-change, deletion-policy semantics with history, and replication, sharding,
placement and cross-shard coordination with distribution. The incoming PostgreSQL
distribution boundary explicitly leaves table pruning and lifecycle concepts here.

A continuity pass checked that the plan uses the parent's report meaning, keeps
the generated workload distinct from stock history, and preserves the existing
order/reference contract while discussing alternatives. No ownership dependency
remains unresolved. No implementation, builds, reviews or publication were done.
