# Transactions and isolation

Choose transactions and isolation from the invariant the writers must preserve.

## What the reader should understand

- Distinguish atomicity, snapshots and serial outcomes
- Choose a sound protocol for one-row and multi-row limits

## Starting knowledge

Introduction’s purchase and last-mug race.

This article contributes to the collection’s newcomer-to-practitioner journey. Teach its subject properly; neighbouring scopes below are boundaries and optional further reading, not a checklist of introductory coverage.

## Neighbouring ownership

- Locks, contention and deadlocks: Owns complete lock protocols, including isolation/snapshot preconditions and waits.
- Retries when a commit reply is missing: Owns retries and uncertain replies.
- Transactions across partitions: Owns atomicity across partitions.

## Prerequisite context

- Relational databases: supplied complete draft source (r00.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/. This is entry context, not an independent review verdict.

The supplied introduction establishes common entrance knowledge; its rendered context is http://127.0.0.1:4368/review/relational-collection/. The three fixed references remain the prose and teaching standard.

## Output

Body fragment: src/articles/relational-collection/r13.astro. Supporting components: src/components/relational-collection/r13/. The orchestrator supplies shell, navigation, contents and final source disclosure. Choose the final title and description in metadata.json. Use public collection article URLs in body links; the preview shell remaps ready drafts.
