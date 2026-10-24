# Retries when a commit reply is missing

Recover a purchase safely when the client cannot tell whether it committed.

## What the reader should understand

- Distinguish known aborts from an unknown commit outcome
- Reuse one request identity and reject conflicting payloads

## Starting knowledge

Transactions, unique keys and application connection ownership.

This article contributes to the collection’s newcomer-to-practitioner journey. Teach its subject properly; neighbouring scopes below are boundaries and optional further reading, not a checklist of introductory coverage.

## Neighbouring ownership

- Outboxes and database-backed jobs: Owns delivery of external work.
- CockroachDB transactions and retries: Owns CockroachDB retry mechanics.

## Prerequisite context

- Transactions and isolation: supplied complete draft source (r13.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/transaction-boundaries/. This is entry context, not an independent review verdict.
- Constraints and tenant boundaries: supplied complete draft source (r03.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/constraints/. This is entry context, not an independent review verdict.
- SQL at the application boundary: supplied complete draft source (r09.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/application-sql/. This is entry context, not an independent review verdict.

The supplied introduction establishes common entrance knowledge; its rendered context is http://127.0.0.1:4368/review/relational-collection/. The three fixed references remain the prose and teaching standard.

## Output

Body fragment: src/articles/relational-collection/r16.astro. Supporting components: src/components/relational-collection/r16/. The orchestrator supplies shell, navigation, contents and final source disclosure. Choose the final title and description in metadata.json. Use public collection article URLs in body links; the preview shell remaps ready drafts.
