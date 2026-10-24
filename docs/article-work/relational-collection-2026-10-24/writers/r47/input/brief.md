# CockroachDB query work and hot ranges

Reduce CockroachDB SQL and KV work without hiding a contention bottleneck.

## What the reader should understand

- Locate lookups, fan-out, network work and contention
- Weigh covering or distributed keys against write and ordering cost

## Starting knowledge

General plans, CockroachDB ranges and index contracts.

This article contributes to the collection’s newcomer-to-practitioner journey. Teach its subject properly; neighbouring scopes below are boundaries and optional further reading, not a checklist of introductory coverage.

## Neighbouring ownership

- CockroachDB transactions and retries: Owns correctness and retry protocol.
- CockroachDB table locality and region survival: Owns locality.
- Operating and securing a CockroachDB cluster: Owns cluster health.

## Prerequisite context

- Query execution and bad plans: supplied complete draft source (r11.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/query-execution/. This is entry context, not an independent review verdict.
- CockroachDB keys, ranges and replication: planned starting knowledge: Locate table and index data within ranges; Explain splits, leases, replica agreement and an unresolved hotspot. Its finished draft is not yet available; do not infer wording from old versions.
- Indexes and access paths: supplied complete draft source (r10.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/indexes/. This is entry context, not an independent review verdict.

The supplied introduction establishes common entrance knowledge; its rendered context is http://127.0.0.1:4368/review/relational-collection/. The three fixed references remain the prose and teaching standard.

## Output

Body fragment: src/articles/relational-collection/r47.astro. Supporting components: src/components/relational-collection/r47/. The orchestrator supplies shell, navigation, contents and final source disclosure. Choose the final title and description in metadata.json. Use public collection article URLs in body links; the preview shell remaps ready drafts.
