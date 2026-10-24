# Transactions across partitions

Explain atomic outcomes across partitions without confusing them with replicated agreement.

## What the reader should understand

- Distinguish replica consensus from transaction commit
- Recover a distributed decision after coordinator loss

## Starting knowledge

Transactions, crash records, sharding and write authority.

This article contributes to the collection’s newcomer-to-practitioner journey. Teach its subject properly; neighbouring scopes below are boundaries and optional further reading, not a checklist of introductory coverage.

## Neighbouring ownership

- CockroachDB transactions and retries: Owns CockroachDB intents and Parallel Commits.
- Time, snapshots and distributed reads: Owns common read snapshots.

## Prerequisite context

- Transactions and isolation: supplied complete draft source (r13.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/transaction-boundaries/. This is entry context, not an independent review verdict.
- Write-ahead logs and crash recovery: planned starting knowledge: Distinguish durable log from flushed data pages; Separate restart recovery from recovery after storage loss. Its finished draft is not yet available; do not infer wording from old versions.
- Sharding and distributed SQL: planned starting knowledge: Compare table partitioning, replicas and sharding; Derive locality, skew, fan-out and distributed coordination from the key. Its finished draft is not yet available; do not infer wording from old versions.
- Failover and fencing: planned starting knowledge: Separate suspicion of failure from authority to write; Fence, promote, reconcile and rejoin a former primary. Its finished draft is not yet available; do not infer wording from old versions.

The supplied introduction establishes common entrance knowledge; its rendered context is http://127.0.0.1:4368/review/relational-collection/. The three fixed references remain the prose and teaching standard.

## Output

Body fragment: src/articles/relational-collection/r27.astro. Supporting components: src/components/relational-collection/r27/. The orchestrator supplies shell, navigation, contents and final source disclosure. Choose the final title and description in metadata.json. Use public collection article URLs in body links; the preview shell remaps ready drafts.
