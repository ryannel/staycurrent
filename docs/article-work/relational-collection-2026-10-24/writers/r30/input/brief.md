# Rebalancing and cluster change

Move replicas, data and software while continuing to preserve one authoritative history.

## What the reader should understand

- Explain catch-up and safe membership change
- Budget movement and decommissioning without using lost redundancy as capacity

## Starting knowledge

Sharding, replicated authority and regional failure budgets.

This article contributes to the collection’s newcomer-to-practitioner journey. Teach its subject properly; neighbouring scopes below are boundaries and optional further reading, not a checklist of introductory coverage.

## Neighbouring ownership

- Operating and securing a CockroachDB cluster: Owns CockroachDB node health and removal.
- Upgrading a CockroachDB cluster: Owns CockroachDB version transitions.
- Where distributed PostgreSQL work runs: Owns PostgreSQL shard movement.

## Prerequisite context

- Sharding and distributed SQL: planned starting knowledge: Compare table partitioning, replicas and sharding; Derive locality, skew, fan-out and distributed coordination from the key. Its finished draft is not yet available; do not infer wording from old versions.
- Failover and fencing: planned starting knowledge: Separate suspicion of failure from authority to write; Fence, promote, reconcile and rejoin a former primary. Its finished draft is not yet available; do not infer wording from old versions.
- Regional placement and survival: planned starting knowledge: Derive quorum survival from failure domains; Trace remote coordination introduced by local data and global invariants. Its finished draft is not yet available; do not infer wording from old versions.

The supplied introduction establishes common entrance knowledge; its rendered context is http://127.0.0.1:4368/review/relational-collection/. The three fixed references remain the prose and teaching standard.

## Output

Body fragment: src/articles/relational-collection/r30.astro. Supporting components: src/components/relational-collection/r30/. The orchestrator supplies shell, navigation, contents and final source disclosure. Choose the final title and description in metadata.json. Use public collection article URLs in body links; the preview shell remaps ready drafts.
