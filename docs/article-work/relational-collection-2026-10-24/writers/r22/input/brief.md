# Live schema changes and backfills

Change a schema through compatible states while callers and existing rows keep changing.

## What the reader should understand

- Design expand, migrate and contract around real callers
- Prove a backfill converged despite races and late rows

## Starting knowledge

Constraints, application transactions and bulk changes.

This article contributes to the collection’s newcomer-to-practitioner journey. Teach its subject properly; neighbouring scopes below are boundaries and optional further reading, not a checklist of introductory coverage.

## Neighbouring ownership

- PostgreSQL schema changes under load: Owns PostgreSQL locks and index changes.
- CockroachDB schema jobs under load: Owns CockroachDB schema jobs.

## Prerequisite context

- Constraints and tenant boundaries: supplied complete draft source (r03.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/constraints/. This is entry context, not an independent review verdict.
- SQL at the application boundary: supplied complete draft source (r09.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/application-sql/. This is entry context, not an independent review verdict.
- Updates, upserts and bulk imports: supplied complete draft source (r08.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/updates-and-imports/. This is entry context, not an independent review verdict.

The supplied introduction establishes common entrance knowledge; its rendered context is http://127.0.0.1:4368/review/relational-collection/. The three fixed references remain the prose and teaching standard.

## Output

Body fragment: src/articles/relational-collection/r22.astro. Supporting components: src/components/relational-collection/r22/. The orchestrator supplies shell, navigation, contents and final source disclosure. Choose the final title and description in metadata.json. Use public collection article URLs in body links; the preview shell remaps ready drafts.
