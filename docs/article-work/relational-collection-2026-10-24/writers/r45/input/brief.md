# CockroachDB transactions and retries

Use CockroachDB’s transaction protocol and client error contract to execute one logical purchase safely.

## What the reader should understand

- Relate intents and transaction state to atomic visibility
- Handle native retry and ambiguous-result paths without repeating external work

## Starting knowledge

General distributed commit, request identity and CockroachDB ranges.

This article contributes to the collection’s newcomer-to-practitioner journey. Teach its subject properly; neighbouring scopes below are boundaries and optional further reading, not a checklist of introductory coverage.

## Neighbouring ownership

- CockroachDB isolation and follower reads: Owns isolation/read contracts.
- Outboxes and database-backed jobs: Owns outboxes and effects.

## Prerequisite context

- Transactions across partitions: supplied complete draft source (r27.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/distributed-transactions/. This is entry context, not an independent review verdict.
- Retries when a commit reply is missing: supplied complete draft source (r16.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/conflicts-and-retries/. This is entry context, not an independent review verdict.
- CockroachDB keys, ranges and replication: planned starting knowledge: Locate table and index data within ranges; Explain splits, leases, replica agreement and an unresolved hotspot. Its finished draft is not yet available; do not infer wording from old versions.

The supplied introduction establishes common entrance knowledge; its rendered context is http://127.0.0.1:4368/review/relational-collection/. The three fixed references remain the prose and teaching standard.

## Output

Body fragment: src/articles/relational-collection/r45.astro. Supporting components: src/components/relational-collection/r45/. The orchestrator supplies shell, navigation, contents and final source disclosure. Choose the final title and description in metadata.json. Use public collection article URLs in body links; the preview shell remaps ready drafts.
