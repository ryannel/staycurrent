# Operating and diagnosing PostgreSQL

Use PostgreSQL evidence to separate blocked work, excessive work and connection pressure.

## What the reader should understand

- Trace a request through pool and server waits
- Test a targeted operational intervention and its recovery cost

## Starting knowledge

General incident triage and a PostgreSQL application connection; prepare native plans or vacuum only for the selected investigation.

This article contributes to the collection’s newcomer-to-practitioner journey. Teach its subject properly; neighbouring scopes below are boundaries and optional further reading, not a checklist of introductory coverage.

## Neighbouring ownership

- PostgreSQL roles, policies and privileged code: Owns required privileges and policy.
- PostgreSQL schema changes under load: Owns planned DDL operations.
- PostgreSQL processes, pages and row versions: Owns deeper PostgreSQL process/page architecture.
- Reading and repairing PostgreSQL plans: Supplies native plan interpretation before an execution/spill repair.
- PostgreSQL vacuum and transaction age: Supplies vacuum and retained-horizon understanding before maintenance changes.
- Locks, contention and deadlocks: Supplies any missing lock/wait reasoning before a blocker intervention.

## Prerequisite context

- Diagnosing a database incident: supplied complete draft source (r24.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/slow-queries/. This is entry context, not an independent review verdict.

The supplied introduction establishes common entrance knowledge; its rendered context is http://127.0.0.1:4368/review/relational-collection/. The three fixed references remain the prose and teaching standard.

## Output

Body fragment: src/articles/relational-collection/r41.astro. Supporting components: src/components/relational-collection/r41/. The orchestrator supplies shell, navigation, contents and final source disclosure. Choose the final title and description in metadata.json. Use public collection article URLs in body links; the preview shell remaps ready drafts.
