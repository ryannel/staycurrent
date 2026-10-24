# PostgreSQL processes, pages and row versions

Connect PostgreSQL’s running processes and physical records to one request’s work.

## What the reader should understand

- Trace a connection through buffers, heap tuples and indexes
- Explain tuple visibility, HOT updates and their physical limits

## Starting knowledge

General row versions, indexes and WAL.

This article contributes to the collection’s newcomer-to-practitioner journey. Teach its subject properly; neighbouring scopes below are boundaries and optional further reading, not a checklist of introductory coverage.

## Neighbouring ownership

- PostgreSQL vacuum and transaction age: Owns vacuum and transaction age.
- PostgreSQL WAL, checkpoints and durability: Owns durability and checkpoints.
- Operating and diagnosing PostgreSQL: Owns operational diagnosis.

## Prerequisite context

- Row versions, storage and cleanup: supplied complete draft source (r15.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/storage/. This is entry context, not an independent review verdict.
- Indexes and access paths: supplied complete draft source (r10.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/indexes/. This is entry context, not an independent review verdict.
- Write-ahead logs and crash recovery: supplied complete draft source (r18.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/crash-recovery/. This is entry context, not an independent review verdict.

The supplied introduction establishes common entrance knowledge; its rendered context is http://127.0.0.1:4368/review/relational-collection/. The three fixed references remain the prose and teaching standard.

## Output

Body fragment: src/articles/relational-collection/r31.astro. Supporting components: src/components/relational-collection/r31/. The orchestrator supplies shell, navigation, contents and final source disclosure. Choose the final title and description in metadata.json. Use public collection article URLs in body links; the preview shell remaps ready drafts.
