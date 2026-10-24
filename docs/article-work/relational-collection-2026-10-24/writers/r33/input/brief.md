# PostgreSQL index methods and operators

Choose a PostgreSQL access method and operator class from the query’s semantics.

## What the reader should understand

- Match operators and data organisation to an index
- Verify candidates, rechecks and write costs in native plans

## Starting knowledge

General index mechanics, query plans and typed values.

This article contributes to the collection’s newcomer-to-practitioner journey. Teach its subject properly; neighbouring scopes below are boundaries and optional further reading, not a checklist of introductory coverage.

## Neighbouring ownership

- Full-text search in PostgreSQL: Owns text semantics and ranking.
- Vector search in PostgreSQL: Owns approximate retrieval.
- Types and extensions in PostgreSQL: Owns range, spatial and extension lifecycle.
- PostgreSQL schema changes under load: Owns index lifecycle operations.

## Prerequisite context

- Indexes and access paths: supplied complete draft source (r10.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/indexes/. This is entry context, not an independent review verdict.
- Query execution and bad plans: supplied complete draft source (r11.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/query-execution/. This is entry context, not an independent review verdict.
- Values, missing data and equality: supplied complete draft source (r02.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/values/. This is entry context, not an independent review verdict.

The supplied introduction establishes common entrance knowledge; its rendered context is http://127.0.0.1:4368/review/relational-collection/. The three fixed references remain the prose and teaching standard.

## Output

Body fragment: src/articles/relational-collection/r33.astro. Supporting components: src/components/relational-collection/r33/. The orchestrator supplies shell, navigation, contents and final source disclosure. Choose the final title and description in metadata.json. Use public collection article URLs in body links; the preview shell remaps ready drafts.
