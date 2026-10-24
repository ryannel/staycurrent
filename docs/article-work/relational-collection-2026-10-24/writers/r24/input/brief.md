# Diagnosing a database incident

Start with a slow request, select its causal branch from evidence and choose a bounded intervention.

## What the reader should understand

- Separate pool delay, lock waits and expensive execution
- Intervene without triggering a second overload

## Starting knowledge

An application request, connection/transaction ownership and basic transaction boundaries; detailed plans, lock protocols and capacity budgets are branch preparation.

This article contributes to the collection’s newcomer-to-practitioner journey. Teach its subject properly; neighbouring scopes below are boundaries and optional further reading, not a checklist of introductory coverage.

## Neighbouring ownership

- Operating and diagnosing PostgreSQL: Owns native PostgreSQL tools.
- Operating and securing a CockroachDB cluster: Owns CockroachDB cluster health.
- Live schema changes and backfills: Owns planned schema change.
- Locks, contention and deadlocks: Owns deeper lock reasoning before a lock intervention.
- Connections, overload and capacity: Owns admission and capacity budgets after a queue/saturation diagnosis.
- Query execution and bad plans: Owns plan interpretation and repair after expensive execution is established.
- Indexes and access paths: Owns access paths when the execution branch needs them.
- Row versions, storage and cleanup: Owns version-retention causes and costs.

## Prerequisite context

- SQL at the application boundary: supplied complete draft source (r09.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/application-sql/. This is entry context, not an independent review verdict.
- Transactions and isolation: supplied complete draft source (r13.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/transaction-boundaries/. This is entry context, not an independent review verdict.

The supplied introduction establishes common entrance knowledge; its rendered context is http://127.0.0.1:4368/review/relational-collection/. The three fixed references remain the prose and teaching standard.

## Output

Body fragment: src/articles/relational-collection/r24.astro. Supporting components: src/components/relational-collection/r24/. The orchestrator supplies shell, navigation, contents and final source disclosure. Choose the final title and description in metadata.json. Use public collection article URLs in body links; the preview shell remaps ready drafts.
