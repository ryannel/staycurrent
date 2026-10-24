# Reading and repairing PostgreSQL plans

Repair a PostgreSQL plan using measured cardinality, work and workload stability.

## What the reader should understand

- Interpret EXPLAIN ANALYZE without mistaking its counters
- Test statistics, access paths and prepared-plan repairs under skew

## Starting knowledge

General execution plans and PostgreSQL storage/index methods.

This article contributes to the collection’s newcomer-to-practitioner journey. Teach its subject properly; neighbouring scopes below are boundaries and optional further reading, not a checklist of introductory coverage.

## Neighbouring ownership

- Operating and diagnosing PostgreSQL: Owns waiting and service diagnosis.
- CockroachDB query work and hot ranges: Owns CockroachDB SQL/KV execution.

## Prerequisite context

- Query execution and bad plans: supplied complete draft source (r11.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/query-execution/. This is entry context, not an independent review verdict.
- PostgreSQL processes, pages and row versions: planned starting knowledge: Trace a connection through buffers, heap tuples and indexes; Explain tuple visibility, HOT updates and their physical limits. Its finished draft is not yet available; do not infer wording from old versions.
- PostgreSQL index methods and operators: planned starting knowledge: Match operators and data organisation to an index; Verify candidates, rechecks and write costs in native plans. Its finished draft is not yet available; do not infer wording from old versions.

The supplied introduction establishes common entrance knowledge; its rendered context is http://127.0.0.1:4368/review/relational-collection/. The three fixed references remain the prose and teaching standard.

## Output

Body fragment: src/articles/relational-collection/r34.astro. Supporting components: src/components/relational-collection/r34/. The orchestrator supplies shell, navigation, contents and final source disclosure. Choose the final title and description in metadata.json. Use public collection article URLs in body links; the preview shell remaps ready drafts.
