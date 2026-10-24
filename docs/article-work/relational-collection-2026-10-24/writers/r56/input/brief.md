# Vector search in PostgreSQL

Evaluate PostgreSQL vector retrieval independently from the meaning assigned by an embedding model.

## What the reader should understand

- Distinguish semantic relevance from nearest-neighbour recall
- Choose exact, HNSW or IVFFlat retrieval under filters and lifecycle cost

## Starting knowledge

PostgreSQL indexes, plan measurement and filtered result semantics.

This article contributes to the collection’s newcomer-to-practitioner journey. Teach its subject properly; neighbouring scopes below are boundaries and optional further reading, not a checklist of introductory coverage.

## Neighbouring ownership

- Full-text search in PostgreSQL: Owns lexical retrieval.
- Types and extensions in PostgreSQL: Owns extension lifecycle.

## Prerequisite context

- PostgreSQL index methods and operators: supplied complete draft source (r33.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/postgresql/indexes/. This is entry context, not an independent review verdict.
- Reading and repairing PostgreSQL plans: supplied complete draft source (r34.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/postgresql/query-execution/. This is entry context, not an independent review verdict.

The supplied introduction establishes common entrance knowledge; its rendered context is http://127.0.0.1:4368/review/relational-collection/. The three fixed references remain the prose and teaching standard.

## Output

Body fragment: src/articles/relational-collection/r56.astro. Supporting components: src/components/relational-collection/r56/. The orchestrator supplies shell, navigation, contents and final source disclosure. Choose the final title and description in metadata.json. Use public collection article URLs in body links; the preview shell remaps ready drafts.
