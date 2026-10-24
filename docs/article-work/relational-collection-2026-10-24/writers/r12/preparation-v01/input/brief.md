# Table partitioning and data lifecycle

Use table partitions for a useful pruning or lifecycle boundary without assuming they distribute work.

## What the reader should understand

- Derive pruning from partition predicates
- Account for uniqueness, references and safe retention

## Starting knowledge

Typed time, indexes and history requirements.

This article contributes to the collection’s newcomer-to-practitioner journey. Teach its subject properly; neighbouring scopes below are boundaries and optional further reading, not a checklist of introductory coverage.

## Neighbouring ownership

- Sharding and distributed SQL: Owns cross-node sharding.
- Live schema changes and backfills: Owns live change protocols.

## Prerequisite context

- Values, missing data and equality: supplied complete draft source (r02.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/values/. This is entry context, not an independent review verdict.
- History, correction and deletion: planned starting knowledge: Distinguish effective time from recorded time; Trace a correction or deletion through dependent and external records. Its finished draft is not yet available; do not infer wording from old versions.
- Indexes and access paths: planned starting knowledge: Derive useful key order and selectivity from a query; Weigh read savings against writes, space and upkeep. Its finished draft is not yet available; do not infer wording from old versions.

The supplied introduction establishes common entrance knowledge; its rendered context is http://127.0.0.1:4368/review/relational-collection/. The three fixed references remain the prose and teaching standard.

## Output

Body fragment: src/articles/relational-collection/r12.astro. Supporting components: src/components/relational-collection/r12/. The orchestrator supplies shell, navigation, contents and final source disclosure. Choose the final title and description in metadata.json. Use public collection article URLs in body links; the preview shell remaps ready drafts.
