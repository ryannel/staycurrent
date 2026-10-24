# Locks, contention and deadlocks

Design lock scope and ordering so waiting protects the intended decision.

## What the reader should understand

- Choose a lockable authority with a sound isolation and snapshot protocol
- Diagnose and bound contention and deadlocks

## Starting knowledge

Transaction snapshots and the class capacity rule.

This article contributes to the collection’s newcomer-to-practitioner journey. Teach its subject properly; neighbouring scopes below are boundaries and optional further reading, not a checklist of introductory coverage.

## Neighbouring ownership

- Connections, overload and capacity: Owns throughput and queue budgets.
- Diagnosing a database incident: Owns live incident response.
- Operating and diagnosing PostgreSQL: Owns PostgreSQL wait tools.

## Prerequisite context

- Transactions and isolation: entry knowledge is the distinction between atomicity, snapshots and serial outcomes, and choosing sound protocols for one-row and multi-row limits. No finished prerequisite prose is supplied here; establish the exact engine semantics you use from primary sources.
- Constraints and tenant boundaries: supplied complete draft source (r03.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/constraints/. This is entry context, not an independent review verdict.

The supplied introduction establishes common entrance knowledge; its rendered context is http://127.0.0.1:4368/review/relational-collection/. The three fixed references remain the prose and teaching standard.

## Output

Body fragment: src/articles/relational-collection/r14.astro. Supporting components: src/components/relational-collection/r14/. The orchestrator supplies shell, navigation, contents and final source disclosure. Choose the final title and description in metadata.json. Use public collection article URLs in body links; the preview shell remaps ready drafts.
