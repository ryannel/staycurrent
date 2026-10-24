# Time, snapshots and distributed reads

Read related partitions at a safe common history while preserving the distinction between observation and authority.

## What the reader should understand

- Explain a common distributed snapshot
- Compare clock uncertainty, logical timestamps and safe historical reads

## Starting knowledge

Isolation, replicated progress and distributed commit.

This article contributes to the collection’s newcomer-to-practitioner journey. Teach its subject properly; neighbouring scopes below are boundaries and optional further reading, not a checklist of introductory coverage.

## Neighbouring ownership

- CockroachDB isolation and follower reads: Owns CockroachDB follower-read behaviour.
- Pagination and consistent exports: Owns export lifetime.
- Regional placement and survival: Owns region placement costs.

## Prerequisite context

- Transactions and isolation: supplied complete draft source (r13.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/transaction-boundaries/. This is entry context, not an independent review verdict.
- Replicas, lag and read routing: planned starting knowledge: Distinguish received, durable and replayed progress; Design read-your-write routing and account for lag and retention. Its finished draft is not yet available; do not infer wording from old versions.
- Transactions across partitions: planned starting knowledge: Distinguish replica consensus from transaction commit; Recover a distributed decision after coordinator loss. Its finished draft is not yet available; do not infer wording from old versions.

The supplied introduction establishes common entrance knowledge; its rendered context is http://127.0.0.1:4368/review/relational-collection/. The three fixed references remain the prose and teaching standard.

## Output

Body fragment: src/articles/relational-collection/r28.astro. Supporting components: src/components/relational-collection/r28/. The orchestrator supplies shell, navigation, contents and final source disclosure. Choose the final title and description in metadata.json. Use public collection article URLs in body links; the preview shell remaps ready drafts.
