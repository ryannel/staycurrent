# Upgrading a CockroachDB cluster

Rehearse CockroachDB’s binary rollout and cluster-version boundary with explicit return limits.

## What the reader should understand

- Distinguish mixed binaries from finalised compatibility
- Verify rollback eligibility, application acceptance and recovery choices

## Starting knowledge

General cluster change, CockroachDB ranges, secure operations including the prepared node-health branch, and backups.

This article contributes to the collection’s newcomer-to-practitioner journey. Teach its subject properly; neighbouring scopes below are boundaries and optional further reading, not a checklist of introductory coverage.

## Neighbouring ownership

- CockroachDB schema jobs under load: Owns schema jobs.
- Moving a SQL application to CockroachDB: Owns engine migration.

## Prerequisite context

- Rebalancing and cluster change: supplied complete draft source (r30.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/rebalancing/. This is entry context, not an independent review verdict.
- CockroachDB keys, ranges and replication: planned starting knowledge: Locate table and index data within ranges; Explain splits, leases, replica agreement and an unresolved hotspot. Its finished draft is not yet available; do not infer wording from old versions.
- Operating and securing a CockroachDB cluster: planned starting knowledge: Verify secure runtime identity, least privilege and tenant isolation; Diagnose under-replication and remove a node without losing the survival budget. Its finished draft is not yet available; do not infer wording from old versions.
- CockroachDB backup and recovery: planned starting knowledge: Validate full/incremental backup coverage and restore scope; Close source writes and reconcile booking identity, capacity and external effects. Its finished draft is not yet available; do not infer wording from old versions.

The supplied introduction establishes common entrance knowledge; its rendered context is http://127.0.0.1:4368/review/relational-collection/. The three fixed references remain the prose and teaching standard.

## Output

Body fragment: src/articles/relational-collection/r52.astro. Supporting components: src/components/relational-collection/r52/. The orchestrator supplies shell, navigation, contents and final source disclosure. Choose the final title and description in metadata.json. Use public collection article URLs in body links; the preview shell remaps ready drafts.
