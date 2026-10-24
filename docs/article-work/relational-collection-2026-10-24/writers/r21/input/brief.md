# Failover and fencing

Transfer write authority safely while accounting for divergent or missing history.

## What the reader should understand

- Separate suspicion of failure from authority to write
- Fence, promote, reconcile and rejoin a former primary

## Starting knowledge

Replication progress and commit durability.

This article contributes to the collection’s newcomer-to-practitioner journey. Teach its subject properly; neighbouring scopes below are boundaries and optional further reading, not a checklist of introductory coverage.

## Neighbouring ownership

- PostgreSQL physical replicas and promotion: Owns PostgreSQL promotion drill.
- Regional placement and survival: Owns quorum placement.
- Backup, restore and reconciliation: Owns restore rather than promotion.

## Prerequisite context

- Replicas, lag and read routing: planned starting knowledge: Distinguish received, durable and replayed progress; Design read-your-write routing and account for lag and retention. Its finished draft is not yet available; do not infer wording from old versions.
- Write-ahead logs and crash recovery: planned starting knowledge: Distinguish durable log from flushed data pages; Separate restart recovery from recovery after storage loss. Its finished draft is not yet available; do not infer wording from old versions.

The supplied introduction establishes common entrance knowledge; its rendered context is http://127.0.0.1:4368/review/relational-collection/. The three fixed references remain the prose and teaching standard.

## Output

Body fragment: src/articles/relational-collection/r21.astro. Supporting components: src/components/relational-collection/r21/. The orchestrator supplies shell, navigation, contents and final source disclosure. Choose the final title and description in metadata.json. Use public collection article URLs in body links; the preview shell remaps ready drafts.
