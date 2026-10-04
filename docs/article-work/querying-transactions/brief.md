# Querying data, transactions and concurrency

Commissioned 4 October 2026. Six connected working drafts extend the relational
collection. The user requested a review of the sections before writing, applying
the lessons from Designing your data. This is authoring, not publication.

## The reading sequence

An independent planning review retained six articles. Their jobs are different:

1. **Queries and joins:** understand what each result row represents, from selecting
   records through joins, missing matches and aggregation. Query meaning comes
   before execution strategies or index selection.
2. **Pagination and large results:** establish an unambiguous order, then compare
   positional pages with continuing from a key. Distinguish live browsing from a
   fixed export and restartable processing. Explain changing views locally before
   linking to isolation; keyset traversal does not freeze the data.
3. **What belongs in one transaction?** Establish commit, rollback and atomicity,
   then derive a transaction boundary from related changes. Explain where a local
   transaction stops when payment involves another service.
4. **When two requests change the same data:** follow an overlapping read/decision/
   write, then guarded updates and locking reads. Checking the result and making
   the decision after coordination are part of the mechanism.
5. **Isolation and snapshots:** compare statement and transaction views, then
   explain why a stable view alone cannot preserve every multirow rule. Identify
   PostgreSQL behaviour rather than universalising isolation-level names.
6. **Handling waits, deadlocks, and retries:** separate waiting, known rollback and
   uncertain commit. Explain complete-transaction retries and stable operation
   identities without promising exactly-once external effects.

The first article has the broadest scope. Its organising question is what one
output row means and how it was produced, not a catalogue of SQL features. Concepts
and syntax receive enough local explanation for the reader to follow the examples.
Each article should offer a complete argument before its illustrations or tools
are used. A correct warning should lead to a workable choice where the article
promises practical guidance.

## Shared records and boundaries

Continue the shop from `../designing-data/schema.sql`: C4/Ada, P7/Blue mug, P8/Bowl,
O12 with two mugs at EUR 18 each, O13 with a EUR 20 mug and EUR 24 bowl. Keep the
distinction between purchase price and current catalogue price. The order-line
identity remains `(order_id, line_no)`.

Introduce additional rows and tables explicitly. Transaction examples add
`stock(product_id, available)`, a product reference and nonnegative integer stock.
New checkouts use O14/O15 rather than rewriting historical O12. A new multirow
example can be clearer than stretching stock into every isolation problem.

Use PostgreSQL 18 as the stated implementation for executable examples. Sources,
observed SQL behaviour and schematic browser models are distinct evidence. Single-
session PGlite execution cannot demonstrate blocking between PostgreSQL sessions.

## Production and review

Three authors own pairs of related articles; the coordinator owns metadata,
navigation, integration and independent review. Each author may create uniquely
named components and evidence files. This allows development in parallel while
keeping the examples and page boundaries shared.

Use the established restrained technical sketch in light and dark. Exact row
relationships, schedules and counts favour code-native drawings. An interaction
should let a reader change a meaningful condition, with its own setup, control
labels, result and limitations. Static media must not look operable.

Review the assembled reading sequence for prerequisites, causal steps, apparent
contradictions, code interpretation and usable outcomes. Independent readers need
actual public artifacts rather than the intended answer. Verify consequential
SQL, exercise controls, inspect narrow and wide renders in both themes, and build
the site. Preserve unresolved limitations in the review notes.
