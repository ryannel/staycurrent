# Pagination and consistent exports

Choose a continuation contract for a changing list and a snapshot contract for an export.

## What the reader should understand

- Build a keyset cursor that preserves ties
- Explain omissions, duplicates and retention costs under concurrent changes

## Starting knowledge

Ordered results and transaction snapshot basics.

This article contributes to the collection’s newcomer-to-practitioner journey. Teach its subject properly; neighbouring scopes below are boundaries and optional further reading, not a checklist of introductory coverage.

## Neighbouring ownership

- Time, snapshots and distributed reads: Owns distributed snapshots.
- Connections, overload and capacity: Owns resource budgets.

## Prerequisite context

- Aggregates, windows and ordered results: planned starting knowledge: Derive totals without changing the intended grain; Select deterministic windows, rankings and frames. Its finished draft is not yet available; do not infer wording from old versions.
- Transactions and isolation: supplied complete draft source (r13.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/transaction-boundaries/. This is entry context, not an independent review verdict.

The supplied introduction establishes common entrance knowledge; its rendered context is http://127.0.0.1:4368/review/relational-collection/. The three fixed references remain the prose and teaching standard.

## Output

Body fragment: src/articles/relational-collection/r07.astro. Supporting components: src/components/relational-collection/r07/. The orchestrator supplies shell, navigation, contents and final source disclosure. Choose the final title and description in metadata.json. Use public collection article URLs in body links; the preview shell remaps ready drafts.
