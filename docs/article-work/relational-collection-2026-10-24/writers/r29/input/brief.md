# Regional placement and survival

Place data and voting replicas against a stated latency and survival budget.

## What the reader should understand

- Derive quorum survival from failure domains
- Trace remote coordination introduced by local data and global invariants

## Starting knowledge

Replicas, authority, sharding and distributed commit.

This article contributes to the collection’s newcomer-to-practitioner journey. Teach its subject properly; neighbouring scopes below are boundaries and optional further reading, not a checklist of introductory coverage.

## Neighbouring ownership

- CockroachDB table locality and region survival: Owns CockroachDB locality settings.
- Rebalancing and cluster change: Owns topology change.

## Prerequisite context

- Replicas, lag and read routing: planned starting knowledge: Distinguish received, durable and replayed progress; Design read-your-write routing and account for lag and retention. Its finished draft is not yet available; do not infer wording from old versions.
- Failover and fencing: planned starting knowledge: Separate suspicion of failure from authority to write; Fence, promote, reconcile and rejoin a former primary. Its finished draft is not yet available; do not infer wording from old versions.
- Sharding and distributed SQL: planned starting knowledge: Compare table partitioning, replicas and sharding; Derive locality, skew, fan-out and distributed coordination from the key. Its finished draft is not yet available; do not infer wording from old versions.
- Transactions across partitions: planned starting knowledge: Distinguish replica consensus from transaction commit; Recover a distributed decision after coordinator loss. Its finished draft is not yet available; do not infer wording from old versions.

The supplied introduction establishes common entrance knowledge; its rendered context is http://127.0.0.1:4368/review/relational-collection/. The three fixed references remain the prose and teaching standard.

## Output

Body fragment: src/articles/relational-collection/r29.astro. Supporting components: src/components/relational-collection/r29/. The orchestrator supplies shell, navigation, contents and final source disclosure. Choose the final title and description in metadata.json. Use public collection article URLs in body links; the preview shell remaps ready drafts.
