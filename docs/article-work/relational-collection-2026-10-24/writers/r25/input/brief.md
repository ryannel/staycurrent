# Database access and least privilege

Give each identity only the database authority its task requires.

## What the reader should understand

- Derive runtime, migration and support privileges
- Test tenant boundaries against the actual trusted identity

## Starting knowledge

Schema constraints, application connection ownership and tenants.

This article contributes to the collection’s newcomer-to-practitioner journey. Teach its subject properly; neighbouring scopes below are boundaries and optional further reading, not a checklist of introductory coverage.

## Neighbouring ownership

- PostgreSQL roles, policies and privileged code: Owns PostgreSQL roles and privileged code.
- Operating and securing a CockroachDB cluster: Owns CockroachDB secure identity and native tenant-boundary acceptance.

## Prerequisite context

- Constraints and tenant boundaries: supplied complete draft source (r03.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/constraints/. This is entry context, not an independent review verdict.
- SQL at the application boundary: supplied complete draft source (r09.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/application-sql/. This is entry context, not an independent review verdict.

The supplied introduction establishes common entrance knowledge; its rendered context is http://127.0.0.1:4368/review/relational-collection/. The three fixed references remain the prose and teaching standard.

## Output

Body fragment: src/articles/relational-collection/r25.astro. Supporting components: src/components/relational-collection/r25/. The orchestrator supplies shell, navigation, contents and final source disclosure. Choose the final title and description in metadata.json. Use public collection article URLs in body links; the preview shell remaps ready drafts.
