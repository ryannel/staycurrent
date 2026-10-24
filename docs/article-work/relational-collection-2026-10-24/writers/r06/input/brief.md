# Aggregates, windows and ordered results

Choose grouped and per-row calculations with explicit ordering and peer semantics.

## What the reader should understand

- Derive totals without changing the intended grain
- Select deterministic windows, rankings and frames

## Starting knowledge

Correct joins and result grain.

This article contributes to the collection’s newcomer-to-practitioner journey. Teach its subject properly; neighbouring scopes below are boundaries and optional further reading, not a checklist of introductory coverage.

## Neighbouring ownership

- Pagination and consistent exports: Owns continuation and export snapshots.
- Query execution and bad plans: Owns memory and sorting costs.

## Prerequisite context

- Joins and the meaning of a result row: planned starting knowledge: Predict row multiplication and missing matches; Build a correct still-due report and absence test. Its finished draft is not yet available; do not infer wording from old versions.

The supplied introduction establishes common entrance knowledge; its rendered context is http://127.0.0.1:4368/review/relational-collection/. The three fixed references remain the prose and teaching standard.

## Output

Body fragment: src/articles/relational-collection/r06.astro. Supporting components: src/components/relational-collection/r06/. The orchestrator supplies shell, navigation, contents and final source disclosure. Choose the final title and description in metadata.json. Use public collection article URLs in body links; the preview shell remaps ready drafts.
