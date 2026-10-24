# PostgreSQL physical replicas and promotion

Operate a PostgreSQL physical copy and promote it with explicit authority and loss boundaries.

## What the reader should understand

- Distinguish standby receipt, flush and replay
- Perform fenced promotion and a safe former-primary return

## Starting knowledge

General replication, failover and PostgreSQL WAL.

This article contributes to the collection’s newcomer-to-practitioner journey. Teach its subject properly; neighbouring scopes below are boundaries and optional further reading, not a checklist of introductory coverage.

## Neighbouring ownership

- PostgreSQL logical replication and change feeds: Owns logical row replication.
- Restoring PostgreSQL to a recovery target: Owns PITR.
- Operating and diagnosing PostgreSQL: Owns service observation.

## Prerequisite context

- Replicas, lag and read routing: supplied complete draft source (r20.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/replicas-and-read-routing/. This is entry context, not an independent review verdict.
- Failover and fencing: supplied complete draft source (r21.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/failover/. This is entry context, not an independent review verdict.
- PostgreSQL WAL, checkpoints and durability: planned starting knowledge: Interpret WAL progress and commit settings; Explain an isolated crash drill without extrapolating to lost storage. Its finished draft is not yet available; do not infer wording from old versions.

The supplied introduction establishes common entrance knowledge; its rendered context is http://127.0.0.1:4368/review/relational-collection/. The three fixed references remain the prose and teaching standard.

## Output

Body fragment: src/articles/relational-collection/r38.astro. Supporting components: src/components/relational-collection/r38/. The orchestrator supplies shell, navigation, contents and final source disclosure. Choose the final title and description in metadata.json. Use public collection article URLs in body links; the preview shell remaps ready drafts.
