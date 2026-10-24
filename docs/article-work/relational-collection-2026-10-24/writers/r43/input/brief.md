# Upgrading and migrating PostgreSQL

Choose and rehearse a PostgreSQL upgrade or migration with a recoverable write handover.

## What the reader should understand

- Distinguish in-place major upgrade from logical migration
- Validate compatibility, cutover and the point of no easy return

## Starting knowledge

Backups, logical replication, schema compatibility and authority fencing.

This article contributes to the collection’s newcomer-to-practitioner journey. Teach its subject properly; neighbouring scopes below are boundaries and optional further reading, not a checklist of introductory coverage.

## Neighbouring ownership

- Moving a SQL application to CockroachDB: Owns migration to CockroachDB.
- Upgrading a CockroachDB cluster: Owns CockroachDB cluster upgrades.

## Prerequisite context

- Restoring PostgreSQL to a recovery target: planned starting knowledge: Build and test a base-backup and archived-WAL chain; Verify a target and reconcile later valid effects safely. Its finished draft is not yet available; do not infer wording from old versions.
- PostgreSQL logical replication and change feeds: planned starting knowledge: Configure publication and subscriber with explicit replica identity; Account for schema, sequence, lag and cutover responsibilities. Its finished draft is not yet available; do not infer wording from old versions.
- PostgreSQL schema changes under load: planned starting knowledge: Choose native operations from their lock and rewrite behaviour; Validate backfill convergence and maintain indexes safely. Its finished draft is not yet available; do not infer wording from old versions.
- Failover and fencing: supplied complete draft source (r21.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/failover/. This is entry context, not an independent review verdict.

The supplied introduction establishes common entrance knowledge; its rendered context is http://127.0.0.1:4368/review/relational-collection/. The three fixed references remain the prose and teaching standard.

## Output

Body fragment: src/articles/relational-collection/r43.astro. Supporting components: src/components/relational-collection/r43/. The orchestrator supplies shell, navigation, contents and final source disclosure. Choose the final title and description in metadata.json. Use public collection article URLs in body links; the preview shell remaps ready drafts.
