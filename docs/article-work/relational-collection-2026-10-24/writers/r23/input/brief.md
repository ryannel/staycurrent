# Connections, overload and capacity

Budget admitted work and recovery headroom around the resource that actually limits the service.

## What the reader should understand

- Distinguish connections, active work and queued requests
- Choose bounded overload behaviour and capacity evidence

## Starting knowledge

Application pools and basic transaction boundaries; deeper query, lock and version mechanisms are preparation for the capacity branch that uses them.

This article contributes to the collection’s newcomer-to-practitioner journey. Teach its subject properly; neighbouring scopes below are boundaries and optional further reading, not a checklist of introductory coverage.

## Neighbouring ownership

- Diagnosing a database incident: Owns initial triage and investigation before selecting a capacity branch.
- Operating and diagnosing PostgreSQL: Owns PostgreSQL observability.
- Sharding and distributed SQL: Owns whether distribution helps.
- Query execution and bad plans: Supplies execution-work reasoning before query-specific capacity changes.
- Locks, contention and deadlocks: Supplies contention reasoning for a hot-row bottleneck.
- Row versions, storage and cleanup: Supplies retained-version reasoning before history/headroom changes.

## Prerequisite context

- SQL at the application boundary: supplied complete draft source (r09.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/application-sql/. This is entry context, not an independent review verdict.
- Transactions and isolation: supplied complete draft source (r13.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/transaction-boundaries/. This is entry context, not an independent review verdict.

The supplied introduction establishes common entrance knowledge; its rendered context is http://127.0.0.1:4368/review/relational-collection/. The three fixed references remain the prose and teaching standard.

## Output

Body fragment: src/articles/relational-collection/r23.astro. Supporting components: src/components/relational-collection/r23/. The orchestrator supplies shell, navigation, contents and final source disclosure. Choose the final title and description in metadata.json. Use public collection article URLs in body links; the preview shell remaps ready drafts.
