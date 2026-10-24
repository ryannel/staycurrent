# Replicas, lag and read routing

Route reads from the freshness and failure promises each copy can meet.

## What the reader should understand

- Distinguish received, durable and replayed progress
- Design read-your-write routing and account for lag and retention

## Starting knowledge

Commit durability and application request identity.

This article contributes to the collection’s newcomer-to-practitioner journey. Teach its subject properly; neighbouring scopes below are boundaries and optional further reading, not a checklist of introductory coverage.

## Neighbouring ownership

- Failover and fencing: Owns promotion and authority.
- PostgreSQL physical replicas and promotion: Owns PostgreSQL physical replication.
- Time, snapshots and distributed reads: Owns distributed snapshots.

## Prerequisite context

- Write-ahead logs and crash recovery: planned starting knowledge: Distinguish durable log from flushed data pages; Separate restart recovery from recovery after storage loss. Its finished draft is not yet available; do not infer wording from old versions.
- SQL at the application boundary: supplied complete draft source (r09.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/application-sql/. This is entry context, not an independent review verdict.

The supplied introduction establishes common entrance knowledge; its rendered context is http://127.0.0.1:4368/review/relational-collection/. The three fixed references remain the prose and teaching standard.

## Output

Body fragment: src/articles/relational-collection/r20.astro. Supporting components: src/components/relational-collection/r20/. The orchestrator supplies shell, navigation, contents and final source disclosure. Choose the final title and description in metadata.json. Use public collection article URLs in body links; the preview shell remaps ready drafts.
