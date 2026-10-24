# PostgreSQL WAL, checkpoints and durability

Relate PostgreSQL WAL and checkpoint controls to a tested durability promise.

## What the reader should understand

- Interpret WAL progress and commit settings
- Explain an isolated crash drill without extrapolating to lost storage

## Starting knowledge

General crash recovery and PostgreSQL architecture.

This article contributes to the collection’s newcomer-to-practitioner journey. Teach its subject properly; neighbouring scopes below are boundaries and optional further reading, not a checklist of introductory coverage.

## Neighbouring ownership

- Restoring PostgreSQL to a recovery target: Owns recovery from backups.
- PostgreSQL physical replicas and promotion: Owns remote acknowledgement and replay.

## Prerequisite context

- Write-ahead logs and crash recovery: supplied complete draft source (r18.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/crash-recovery/. This is entry context, not an independent review verdict.
- PostgreSQL processes, pages and row versions: supplied complete draft source (r31.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/postgresql/architecture/. This is entry context, not an independent review verdict.

The supplied introduction establishes common entrance knowledge; its rendered context is http://127.0.0.1:4368/review/relational-collection/. The three fixed references remain the prose and teaching standard.

## Output

Body fragment: src/articles/relational-collection/r36.astro. Supporting components: src/components/relational-collection/r36/. The orchestrator supplies shell, navigation, contents and final source disclosure. Choose the final title and description in metadata.json. Use public collection article URLs in body links; the preview shell remaps ready drafts.
