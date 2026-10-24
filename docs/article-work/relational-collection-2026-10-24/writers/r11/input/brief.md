# Query execution and bad plans

Locate the operator and estimate that turn a valid query into excessive work.

## What the reader should understand

- Read a plan as rows flowing through operators
- Diagnose estimates, repeated work, spills and distribution costs

## Starting knowledge

Correct joins, aggregation and access paths.

This article contributes to the collection’s newcomer-to-practitioner journey. Teach its subject properly; neighbouring scopes below are boundaries and optional further reading, not a checklist of introductory coverage.

## Neighbouring ownership

- Reading and repairing PostgreSQL plans: Owns native PostgreSQL plans.
- CockroachDB query work and hot ranges: Owns native CockroachDB SQL/KV plans.
- Diagnosing a database incident: Owns initial triage that establishes whether execution work is the cause.

## Prerequisite context

- Joins and the meaning of a result row: supplied complete draft source (r05.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/query-results/. This is entry context, not an independent review verdict.
- Aggregates, windows and ordered results: supplied complete draft source (r06.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/aggregates-and-windows/. This is entry context, not an independent review verdict.
- Indexes and access paths: planned starting knowledge: Derive useful key order and selectivity from a query; Weigh read savings against writes, space and upkeep. Its finished draft is not yet available; do not infer wording from old versions.

The supplied introduction establishes common entrance knowledge; its rendered context is http://127.0.0.1:4368/review/relational-collection/. The three fixed references remain the prose and teaching standard.

## Output

Body fragment: src/articles/relational-collection/r11.astro. Supporting components: src/components/relational-collection/r11/. The orchestrator supplies shell, navigation, contents and final source disclosure. Choose the final title and description in metadata.json. Use public collection article URLs in body links; the preview shell remaps ready drafts.
