# CockroachDB table locality and region survival

Configure CockroachDB table locality and survival goals from actual access and failure requirements.

## What the reader should understand

- Match regional-by-table, regional-by-row and GLOBAL tables to requests
- Verify placement and survival without inventing regional timing evidence

## Starting knowledge

General regional placement, CockroachDB ranges and read contracts.

This article contributes to the collection’s newcomer-to-practitioner journey. Teach its subject properly; neighbouring scopes below are boundaries and optional further reading, not a checklist of introductory coverage.

## Neighbouring ownership

- Operating and securing a CockroachDB cluster: Owns cluster operational response.
- CockroachDB query work and hot ranges: Owns query work.

## Prerequisite context

- Regional placement and survival: supplied complete draft source (r29.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/regional-placement/. This is entry context, not an independent review verdict.
- CockroachDB keys, ranges and replication: planned starting knowledge: Locate table and index data within ranges; Explain splits, leases, replica agreement and an unresolved hotspot. Its finished draft is not yet available; do not infer wording from old versions.
- CockroachDB isolation and follower reads: planned starting knowledge: Distinguish Serializable, Read Committed and historical observation; Explain safe follower reads and their retention/freshness limits. Its finished draft is not yet available; do not infer wording from old versions.

The supplied introduction establishes common entrance knowledge; its rendered context is http://127.0.0.1:4368/review/relational-collection/. The three fixed references remain the prose and teaching standard.

## Output

Body fragment: src/articles/relational-collection/r48.astro. Supporting components: src/components/relational-collection/r48/. The orchestrator supplies shell, navigation, contents and final source disclosure. Choose the final title and description in metadata.json. Use public collection article URLs in body links; the preview shell remaps ready drafts.
