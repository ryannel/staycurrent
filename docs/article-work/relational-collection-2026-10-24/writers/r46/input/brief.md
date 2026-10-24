# CockroachDB isolation and follower reads

Choose CockroachDB current and historical reads from the decision they must support.

## What the reader should understand

- Distinguish Serializable, Read Committed and historical observation
- Explain safe follower reads and their retention/freshness limits

## Starting knowledge

General snapshots, distributed time and CockroachDB transactions.

This article contributes to the collection’s newcomer-to-practitioner journey. Teach its subject properly; neighbouring scopes below are boundaries and optional further reading, not a checklist of introductory coverage.

## Neighbouring ownership

- CockroachDB table locality and region survival: Owns GLOBAL and regional table placement.
- Pagination and consistent exports: Owns export lifetime.

## Prerequisite context

- Time, snapshots and distributed reads: supplied complete draft source (r28.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/distributed-reads/. This is entry context, not an independent review verdict.
- CockroachDB transactions and retries: planned starting knowledge: Relate intents and transaction state to atomic visibility; Handle native retry and ambiguous-result paths without repeating external work. Its finished draft is not yet available; do not infer wording from old versions.

The supplied introduction establishes common entrance knowledge; its rendered context is http://127.0.0.1:4368/review/relational-collection/. The three fixed references remain the prose and teaching standard.

## Output

Body fragment: src/articles/relational-collection/r46.astro. Supporting components: src/components/relational-collection/r46/. The orchestrator supplies shell, navigation, contents and final source disclosure. Choose the final title and description in metadata.json. Use public collection article URLs in body links; the preview shell remaps ready drafts.
