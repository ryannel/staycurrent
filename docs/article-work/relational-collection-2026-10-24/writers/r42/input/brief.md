# PostgreSQL roles, policies and privileged code

Test PostgreSQL privilege and row-policy boundaries as the actual application roles.

## What the reader should understand

- Explain role inheritance, ownership and policy bypass
- Secure privileged routines against identity and name-resolution mistakes

## Starting knowledge

General least privilege and tenant boundaries (RL104), including application connection ownership. The needed secure deployment, SQL object names and session identity are introduced locally.

This article contributes to the collection’s newcomer-to-practitioner journey. Teach its subject properly; neighbouring scopes below are boundaries and optional further reading, not a checklist of introductory coverage.

## Neighbouring ownership

- Constraints and tenant boundaries: Owns tenant references and invariants.
- Operating and securing a CockroachDB cluster: Owns CockroachDB security configuration.

## Prerequisite context

- Database access and least privilege: supplied complete draft source (r25.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/access-control/. This is entry context, not an independent review verdict.

The supplied introduction establishes common entrance knowledge; its rendered context is http://127.0.0.1:4368/review/relational-collection/. The three fixed references remain the prose and teaching standard.

## Output

Body fragment: src/articles/relational-collection/r42.astro. Supporting components: src/components/relational-collection/r42/. The orchestrator supplies shell, navigation, contents and final source disclosure. Choose the final title and description in metadata.json. Use public collection article URLs in body links; the preview shell remaps ready drafts.
