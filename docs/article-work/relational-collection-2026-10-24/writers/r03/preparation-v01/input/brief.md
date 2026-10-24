# Constraints and tenant boundaries

Turn invariants into enforceable schema boundaries and identify the rules that require a protocol.

## What the reader should understand

- Express row, identity and reference rules
- Separate tenant integrity, access control and concurrent invariants

## Starting knowledge

Keys, NULL and transactions from the introduction.

This article contributes to the collection’s newcomer-to-practitioner journey. Teach its subject properly; neighbouring scopes below are boundaries and optional further reading, not a checklist of introductory coverage.

## Neighbouring ownership

- Transactions and isolation: Owns concurrent multi-row rules.
- Database access and least privilege: Owns runtime authority.
- PostgreSQL roles, policies and privileged code: Owns PostgreSQL policy tests.

## Prerequisite context

- Relations, keys and normalisation: supplied complete draft source (r01.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/modelling/. This is entry context, not an independent review verdict.
- Values, missing data and equality: supplied complete draft source (r02.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/values/. This is entry context, not an independent review verdict.

The supplied introduction establishes common entrance knowledge; its rendered context is http://127.0.0.1:4368/review/relational-collection/. The three fixed references remain the prose and teaching standard.

## Output

Body fragment: src/articles/relational-collection/r03.astro. Supporting components: src/components/relational-collection/r03/. The orchestrator supplies shell, navigation, contents and final source disclosure. Choose the final title and description in metadata.json. Use public collection article URLs in body links; the preview shell remaps ready drafts.
