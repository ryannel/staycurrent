# Sharding and distributed SQL

Choose a distribution boundary from local work, invariant scope and the actual bottleneck.

## What the reader should understand

- Compare table partitioning, replicas and sharding
- Derive locality, skew, fan-out and distributed coordination from the key

## Starting knowledge

Indexes, transactions, capacity and replication.

This article contributes to the collection’s newcomer-to-practitioner journey. Teach its subject properly; neighbouring scopes below are boundaries and optional further reading, not a checklist of introductory coverage.

## Neighbouring ownership

- Table partitioning and data lifecycle: Owns table partitions on one service.
- Transactions across partitions: Owns cross-partition commit.
- Where distributed PostgreSQL work runs: Owns PostgreSQL distribution choices.
- CockroachDB keys, ranges and replication: Owns CockroachDB key routing.

## Prerequisite context

- Indexes and access paths: starting knowledge: Derive useful key order and selectivity from a query; Weigh read savings against writes, space and upkeep. These understandings are entry context; no draft is supplied.
- Transactions and isolation: supplied complete draft source (r13.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/transaction-boundaries/. This is entry context, not an independent review verdict.
- Connections, overload and capacity: planned starting knowledge: Distinguish connections, active work and queued requests; Choose bounded overload behaviour and capacity evidence. Its finished draft is not yet available; do not infer wording from old versions.
- Replicas, lag and read routing: planned starting knowledge: Distinguish received, durable and replayed progress; Design read-your-write routing and account for lag and retention. Its finished draft is not yet available; do not infer wording from old versions.

The supplied introduction establishes common entrance knowledge; its rendered context is http://127.0.0.1:4368/review/relational-collection/. The three fixed references remain the prose and teaching standard.

## Output

Body fragment: src/articles/relational-collection/r26.astro. Supporting components: src/components/relational-collection/r26/. The orchestrator supplies shell, navigation, contents and final source disclosure. Choose the final title and description in metadata.json. Use public collection article URLs in body links; the preview shell remaps ready drafts.
