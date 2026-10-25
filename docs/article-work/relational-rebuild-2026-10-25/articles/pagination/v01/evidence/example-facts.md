# Pagination example facts and continuity

Use `docs/coverage/relational-rebuild-2026-10-25-example.md` as starting record. Orders 101, 102 and 103 retain their core owners, times, statuses, order lines and payments. The projected-list scenario adds 201 and 202 for customer 3 at exactly 103's timestamp, both pending; line/payment facts for those additions are deliberately unused and unspecified.

Descending `(placed_at, order_id)` is 202, 201, 103, 102, 101. Page size 2 gives first page 202/201, next page 103/102; third page 101. Boundary is `(2026-10-20 10:15:00+00, 201)`.

Every mutation is independent and starts from that list:

- Insert 203 at 21 October 2026, 09:00 UTC, pending: offset returns 201/103 (repeat); keyset returns 103/102.
- Delete 202: offset returns 102/101 (omits 103); keyset returns 103/102.
- Correct unread 103 to 21 October 2026, 08:00 UTC: keyset returns 102/101, omitting 103.
- Correct already-read 202 to 19 October 2026, 12:00 UTC: keyset returns 103/202, repeating 202. Coordinator approved this extension explicitly on 25 October.
- Independently change unread 103 from pending to paid between export batches with no key change. Coordinator approved this extension explicitly on 25 October. RC sees paid; RR's first SELECT precedes the writer's change and the next read sees pending. Retained projection versus IDs test resets independently.

Mixed directions use the same rows: descending time and ascending ID gives 103, 201, 202, 102, 101. Continue after 201 with smaller time OR equal time/larger ID: 202/102. Backwards navigation from 103 in the original descending list queries ascending keys greater than 103: 201/202, reversed for display to 202/201.

Null handling uses the approved separate package-weight scenario, not changes to orders: P3=65g, P9=820g, P7=NULL/not measured. Ascending weight NULLS LAST and product ID ascending gives P3/P9/P7. Continue from measured 820/P9 by including NULL; continue from null P7 within the null group. Weights are illustrative measurements.

No new 104 or 105 scenario. The core race and separate constraint-deferral 105 are untouched. High-water and filter-membership paragraphs are conceptual descriptions of changing visibility/membership, with no further invented shared rows or observed concurrency claim. The timestamp-precision verifier compares two literals rather than adding shop facts.

Continuity pass: reread the whole piece including figures/captions/controls from the prerequisite knowledge. Define total ordering by the timestamp tie before cursor construction; derive explicit OR before row-comparison shorthand; distinguish result-row identity before line pagination; establish snapshot versus position before retention/resume and cancellation costs. Retain stored-value/volatile-input qualification. Index design and driver procedures remain with their owners. Neighbour link uses the canonical `/learn/databases/relational/query-results/` route; unavailable specialist reading is named without a promise or live link.
