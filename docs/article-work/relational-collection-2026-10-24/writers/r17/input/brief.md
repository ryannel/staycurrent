# Outboxes and database-backed jobs

Commit a durable intention, then deliver and claim work despite duplicate execution and worker loss.

## What the reader should understand

- Explain what an outbox makes atomic
- Design deduplication, leases and fencing for recoverable workers

## Starting knowledge

Transactions, uncertain outcomes and lock/claim reasoning from RL91 before recoverable worker protocols.

This article contributes to the collection’s newcomer-to-practitioner journey. Teach its subject properly; neighbouring scopes below are boundaries and optional further reading, not a checklist of introductory coverage.

## Neighbouring ownership

- PostgreSQL logical replication and change feeds: Owns PostgreSQL change streams.
- Failover and fencing: Owns primary authority fencing.

## Prerequisite context

- Transactions and isolation: entry knowledge is the distinction between atomicity, snapshots and serial outcomes, and choosing sound protocols for one-row and multi-row limits. No finished prerequisite prose is supplied here; establish the exact engine semantics you use from primary sources.
- Retries when a commit reply is missing: planned starting knowledge: Distinguish known aborts from an unknown commit outcome; Reuse one request identity and reject conflicting payloads. Its finished draft is not yet available; do not infer wording from old versions.
- Locks, contention and deadlocks: planned starting knowledge: Choose a lockable authority with a sound isolation and snapshot protocol; Diagnose and bound contention and deadlocks. Its finished draft is not yet available; do not infer wording from old versions.

The supplied introduction establishes common entrance knowledge; its rendered context is http://127.0.0.1:4368/review/relational-collection/. The three fixed references remain the prose and teaching standard.

## Output

Body fragment: src/articles/relational-collection/r17.astro. Supporting components: src/components/relational-collection/r17/. The orchestrator supplies shell, navigation, contents and final source disclosure. Choose the final title and description in metadata.json. Use public collection article URLs in body links; the preview shell remaps ready drafts.
