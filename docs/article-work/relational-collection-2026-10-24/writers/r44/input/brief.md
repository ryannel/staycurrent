# CockroachDB keys, ranges and replication

Trace CockroachDB SQL data through ordered keys, ranges and replicated ownership.

## What the reader should understand

- Locate table and index data within ranges
- Explain splits, leases, replica agreement and an unresolved hotspot

## Starting knowledge

General sharding, replication and index mechanics.

This article contributes to the collection’s newcomer-to-practitioner journey. Teach its subject properly; neighbouring scopes below are boundaries and optional further reading, not a checklist of introductory coverage.

## Neighbouring ownership

- CockroachDB transactions and retries: Owns transaction decisions.
- CockroachDB query work and hot ranges: Owns query work and hot ranges.
- CockroachDB table locality and region survival: Owns geographic locality.

## Prerequisite context

- Sharding and distributed SQL: supplied complete draft source (r26.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/partitioning-and-sharding/. This is entry context, not an independent review verdict.
- Replicas, lag and read routing: supplied complete draft source (r20.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/replicas-and-read-routing/. This is entry context, not an independent review verdict.
- Indexes and access paths: supplied complete draft source (r10.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/indexes/. This is entry context, not an independent review verdict.

The supplied introduction establishes common entrance knowledge; its rendered context is http://127.0.0.1:4368/review/relational-collection/. The three fixed references remain the prose and teaching standard.

## Output

Body fragment: src/articles/relational-collection/r44.astro. Supporting components: src/components/relational-collection/r44/. The orchestrator supplies shell, navigation, contents and final source disclosure. Choose the final title and description in metadata.json. Use public collection article URLs in body links; the preview shell remaps ready drafts.
