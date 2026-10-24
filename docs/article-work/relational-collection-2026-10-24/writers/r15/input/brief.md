# Row versions, storage and cleanup

Connect logical updates to physical versions and the work required to reclaim them.

## What the reader should understand

- Explain old-snapshot visibility without in-place overwrite assumptions
- Distinguish reusable space, file shrinkage and write amplification

## Starting knowledge

Transactions and index entries.

This article contributes to the collection’s newcomer-to-practitioner journey. Teach its subject properly; neighbouring scopes below are boundaries and optional further reading, not a checklist of introductory coverage.

## Neighbouring ownership

- PostgreSQL processes, pages and row versions: Owns PostgreSQL processes and pages.
- PostgreSQL vacuum and transaction age: Owns vacuum and age safety.
- Write-ahead logs and crash recovery: Owns crash ordering.

## Prerequisite context

- Transactions and isolation: starting knowledge: Distinguish atomicity, snapshots and serial outcomes; Choose a sound protocol for one-row and multi-row limits. Use these understandings as entry context; no article draft is supplied.
- Indexes and access paths: starting knowledge: Derive useful key order and selectivity from a query; Weigh read savings against writes, space and upkeep. Use these understandings as entry context; no article draft is supplied.

The supplied introduction establishes common entrance knowledge; its rendered context is http://127.0.0.1:4368/review/relational-collection/. The three fixed references remain the prose and teaching standard.

## Output

Body fragment: src/articles/relational-collection/r15.astro. Supporting components: src/components/relational-collection/r15/. The orchestrator supplies shell, navigation, contents and final source disclosure. Choose the final title and description in metadata.json. Use public collection article URLs in body links; the preview shell remaps ready drafts.
