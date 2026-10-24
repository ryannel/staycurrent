# Write-ahead logs and crash recovery

Explain the ordering that makes a committed change recoverable after a crash.

## What the reader should understand

- Distinguish durable log from flushed data pages
- Separate restart recovery from recovery after storage loss

## Starting knowledge

Atomic transactions, row versions and storage pages.

This article contributes to the collection’s newcomer-to-practitioner journey. Teach its subject properly; neighbouring scopes below are boundaries and optional further reading, not a checklist of introductory coverage.

## Neighbouring ownership

- PostgreSQL WAL, checkpoints and durability: Owns PostgreSQL checkpoints and WAL settings.
- Backup, restore and reconciliation: Owns backups.
- Replicas, lag and read routing: Owns remote copies.

## Prerequisite context

- Transactions and isolation: starting knowledge: Distinguish atomicity, snapshots and serial outcomes; Choose a sound protocol for one-row and multi-row limits. Use these understandings as entry context; no article draft is supplied.
- Row versions, storage and cleanup: planned starting knowledge: Explain old-snapshot visibility without in-place overwrite assumptions; Distinguish reusable space, file shrinkage and write amplification. Its finished draft is not yet available; do not infer wording from old versions.

The supplied introduction establishes common entrance knowledge; its rendered context is http://127.0.0.1:4368/review/relational-collection/. The three fixed references remain the prose and teaching standard.

## Output

Body fragment: src/articles/relational-collection/r18.astro. Supporting components: src/components/relational-collection/r18/. The orchestrator supplies shell, navigation, contents and final source disclosure. Choose the final title and description in metadata.json. Use public collection article URLs in body links; the preview shell remaps ready drafts.
