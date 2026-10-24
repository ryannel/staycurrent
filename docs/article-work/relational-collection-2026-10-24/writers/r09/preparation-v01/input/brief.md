# SQL at the application boundary

Keep query meaning and transaction ownership intact across the application connection.

## What the reader should understand

- Separate values from SQL structure
- Handle one request’s connection, result, error and cancellation coherently

## Starting knowledge

Basic queries and transaction boundaries.

This article contributes to the collection’s newcomer-to-practitioner journey. Teach its subject properly; neighbouring scopes below are boundaries and optional further reading, not a checklist of introductory coverage.

## Neighbouring ownership

- Retries when a commit reply is missing: Owns ambiguous commit resolution.
- Connections, overload and capacity: Owns pool sizing.
- Moving a SQL application to CockroachDB: Owns CockroachDB migration compatibility.

## Prerequisite context

- Joins and the meaning of a result row: planned starting knowledge: Predict row multiplication and missing matches; Build a correct still-due report and absence test. Its finished draft is not yet available; do not infer wording from old versions.
- Transactions and isolation: planned starting knowledge: Distinguish atomicity, snapshots and serial outcomes; Choose a sound protocol for one-row and multi-row limits. Its finished draft is not yet available; do not infer wording from old versions.

The supplied introduction establishes common entrance knowledge; its rendered context is http://127.0.0.1:4368/review/relational-collection/. The three fixed references remain the prose and teaching standard.

## Output

Body fragment: src/articles/relational-collection/r09.astro. Supporting components: src/components/relational-collection/r09/. The orchestrator supplies shell, navigation, contents and final source disclosure. Choose the final title and description in metadata.json. Use public collection article URLs in body links; the preview shell remaps ready drafts.
