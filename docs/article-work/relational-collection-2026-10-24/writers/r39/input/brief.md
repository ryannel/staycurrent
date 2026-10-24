# PostgreSQL logical replication and change feeds

Treat PostgreSQL logical replication as a selective row stream with its own identity and lifecycle.

## What the reader should understand

- Configure publication and subscriber with explicit replica identity
- Account for schema, sequence, lag and cutover responsibilities

## Starting knowledge

General replicas and PostgreSQL physical replication distinctions.

This article contributes to the collection’s newcomer-to-practitioner journey. Teach its subject properly; neighbouring scopes below are boundaries and optional further reading, not a checklist of introductory coverage.

## Neighbouring ownership

- Outboxes and database-backed jobs: Owns durable application event delivery.
- Upgrading and migrating PostgreSQL: Owns migration cutover.

## Prerequisite context

- Replicas, lag and read routing: supplied complete draft source (r20.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/replicas-and-read-routing/. This is entry context, not an independent review verdict.
- PostgreSQL physical replicas and promotion: planned starting knowledge: Distinguish standby receipt, flush and replay; Perform fenced promotion and a safe former-primary return. Its finished draft is not yet available; do not infer wording from old versions.
- Constraints and tenant boundaries: supplied complete draft source (r03.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/constraints/. This is entry context, not an independent review verdict.

The supplied introduction establishes common entrance knowledge; its rendered context is http://127.0.0.1:4368/review/relational-collection/. The three fixed references remain the prose and teaching standard.

## Output

Body fragment: src/articles/relational-collection/r39.astro. Supporting components: src/components/relational-collection/r39/. The orchestrator supplies shell, navigation, contents and final source disclosure. Choose the final title and description in metadata.json. Use public collection article URLs in body links; the preview shell remaps ready drafts.
