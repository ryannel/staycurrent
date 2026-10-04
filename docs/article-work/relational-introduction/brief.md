# Relational introduction — revised commission

User correction, 4 October 2026: introduce relational databases themselves before
worked examples. Explain what they are, how they lay out data, why that is useful,
and the problems solved by queries, indexes, constraints, transactions, concurrency
control, and locks. A coherent order walkthrough was the wrong article shape.

Destination: `/learn/databases/relational/`. The earlier detailed checkout essay
is preserved at `/learn/databases/relational/checkout/` as an existing deeper draft.
No publication/feed changes are commissioned.

Reader: intelligent engineer who may never have encountered a relational database.
No SQL knowledge required. The field guide is optional, not a prerequisite.

Outcome: describe tables/rows/columns and connections through identifiers; separate
logical tables from physical layout; explain why shared facts and flexible queries
are useful; distinguish what an index, constraint, transaction, and lock help with;
understand that the model does not settle product implementation or deployment.
A reviewer should test whether these form an intelligible overall picture, not
merely whether each paragraph is locally correct.

Structure: subject first, then its organisation and usefulness, then the purpose
and basic tradeoff of each major mechanism. Small examples illustrate the concept
just introduced. No SQL tutorial, index algorithm, isolation survey, or product
ranking. The earlier source/code example is retained only as superseded work.

Media: a small product table makes row/column structure visible. The established
light/dark technical sketch supports relationships between tables. No interactive
model is added unless it supplies understanding missing from the overview; the
existing concurrency experiment remains in deeper reading. The text stands alone.
Review sufficiency and placement of media across the whole article.

Reviews: three isolated readings per new aid; then independent editorial, technical
and fresh blind comprehension. Inspect actual rendering at desktop/phone in both
themes; check focus and semantics for actual controls/links. No screen-reader user
claim without a performed test.

## Whole-page polish, 4 October 2026

The user commissioned another top-to-bottom review for writing, explanatory depth,
and media coverage. Retain the introductory scope and planned collection. Add a
bounded SQL example, an index lookup drawing, and a locking timeline where they
reduce mental work; no new interactive model is necessary here. The existing
checkout experiment remains the deeper destination. The article must still explain
all three ideas when a reader skips the aids.
