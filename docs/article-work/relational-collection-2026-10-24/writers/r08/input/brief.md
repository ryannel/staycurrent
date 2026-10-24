# Updates, upserts and bulk imports

Make each change conditional and each imported conflict a domain decision.

## What the reader should understand

- Use affected rows to enforce a write precondition
- Stage, validate and reconcile a replayable batch

## Starting knowledge

Keys, constraints, transaction atomicity and the mug update.

This article contributes to the collection’s newcomer-to-practitioner journey. Teach its subject properly; neighbouring scopes below are boundaries and optional further reading, not a checklist of introductory coverage.

## Neighbouring ownership

- Retries when a commit reply is missing: Owns request identity after ambiguous commit.
- Live schema changes and backfills: Owns live schema backfills.

## Prerequisite context

- Constraints and tenant boundaries: supplied complete draft source (r03.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/constraints/. This is entry context, not an independent review verdict.
- Transactions and isolation: supplied complete draft source (r13.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/transaction-boundaries/. This is entry context, not an independent review verdict.

The supplied introduction establishes common entrance knowledge; its rendered context is http://127.0.0.1:4368/review/relational-collection/. The three fixed references remain the prose and teaching standard.

## Output

Body fragment: src/articles/relational-collection/r08.astro. Supporting components: src/components/relational-collection/r08/. The orchestrator supplies shell, navigation, contents and final source disclosure. Choose the final title and description in metadata.json. Use public collection article URLs in body links; the preview shell remaps ready drafts.
