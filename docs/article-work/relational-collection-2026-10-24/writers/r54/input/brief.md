# Where distributed PostgreSQL work runs

Choose where PostgreSQL-distributed work runs from co-location, constraint scope and movement requirements.

## What the reader should understand

- Distinguish native partitions, application shards, Citus and foreign tables
- Derive local work, skew and a safe ownership transfer

## Starting knowledge

General sharding, distributed transactions and PostgreSQL architecture.

This article contributes to the collection’s newcomer-to-practitioner journey. Teach its subject properly; neighbouring scopes below are boundaries and optional further reading, not a checklist of introductory coverage.

## Neighbouring ownership

- Table partitioning and data lifecycle: Owns native table lifecycle.
- Rebalancing and cluster change: Owns generic membership and movement.
- CockroachDB keys, ranges and replication: Owns CockroachDB ranges.

## Prerequisite context

- Sharding and distributed SQL: supplied complete draft source (r26.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/partitioning-and-sharding/. This is entry context, not an independent review verdict.
- Transactions across partitions: supplied complete draft source (r27.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/distributed-transactions/. This is entry context, not an independent review verdict.
- PostgreSQL processes, pages and row versions: supplied complete draft source (r31.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/postgresql/architecture/. This is entry context, not an independent review verdict.

The supplied introduction establishes common entrance knowledge; its rendered context is http://127.0.0.1:4368/review/relational-collection/. The three fixed references remain the prose and teaching standard.

## Output

Body fragment: src/articles/relational-collection/r54.astro. Supporting components: src/components/relational-collection/r54/. The orchestrator supplies shell, navigation, contents and final source disclosure. Choose the final title and description in metadata.json. Use public collection article URLs in body links; the preview shell remaps ready drafts.
