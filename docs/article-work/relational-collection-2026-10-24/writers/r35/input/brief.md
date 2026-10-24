# PostgreSQL JSON and structured alternatives

Use PostgreSQL JSONB where it fits the facts, validation and update boundary.

## What the reader should understand

- Choose columns, related rows and JSON documents deliberately
- Match JSON operators and indexes while preserving data rules

## Starting knowledge

Row meaning, values and PostgreSQL index contracts.

This article contributes to the collection’s newcomer-to-practitioner journey. Teach its subject properly; neighbouring scopes below are boundaries and optional further reading, not a checklist of introductory coverage.

## Neighbouring ownership

- Constraints and tenant boundaries: Owns relational enforcement.
- Live schema changes and backfills: Owns live schema evolution.
- Full-text search in PostgreSQL: Owns text retrieval.

## Prerequisite context

- Relations, keys and normalisation: supplied complete draft source (r01.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/modelling/. This is entry context, not an independent review verdict.
- Values, missing data and equality: supplied complete draft source (r02.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/values/. This is entry context, not an independent review verdict.
- PostgreSQL index methods and operators: planned starting knowledge: Match operators and data organisation to an index; Verify candidates, rechecks and write costs in native plans. Its finished draft is not yet available; do not infer wording from old versions.

The supplied introduction establishes common entrance knowledge; its rendered context is http://127.0.0.1:4368/review/relational-collection/. The three fixed references remain the prose and teaching standard.

## Output

Body fragment: src/articles/relational-collection/r35.astro. Supporting components: src/components/relational-collection/r35/. The orchestrator supplies shell, navigation, contents and final source disclosure. Choose the final title and description in metadata.json. Use public collection article URLs in body links; the preview shell remaps ready drafts.
