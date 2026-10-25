# Query-results plan · 25 October 2026

First plan for coordinator integration and the commissioned collection review. No
article prose, implementation, delegation, review, publication or commits were
performed. All local reads and writes stayed within this assigned directory.

## Inputs and reference exposure

Read `input/assignment.txt`, `input/commission.md`, `input/shop-example.md` and
`input/scope-inventory.json`. Read the supplied breakdown, write, figures and
continuity skills. The inventory was coverage context; no old article bodies,
old outlines, earlier experiments or review feedback were read.

Used `scripts/read-writing-reference.py` to read every complete bounded text
part separately, with every END marker present: sequences 1–6, indexes 1–7,
storage 1–6. The script validated the supplied source/text hashes. No parts were
clipped. The full texts supply the comparison for explanation, headings and
child placement, not just an opening style sample.

Studied finished drawings at the coordinator's reference preview through one
owned background IAB tab, without changing viewport or theme. Sequence diagrams:
Figure 1's complete labelled booking and Figure 2's waiting/activation states.
Indexes: Figure 7's composite-key versus customer-only comparison, including
initial and completed states, row links, counters and the alternate selection.
Storage: Figure 5's memory/disk lanes at the initial state, update, commit reply
and later page write. Closed the owned tab afterwards; no user tabs were used.

The relevant teaching pattern is a familiar example changed one thing at a
time, with the reader directed to the decisive relationship in the drawing,
then the prose deriving its consequence. Here the decisive things to make
visible are which input rows match, what survives an absent match, the four
line/payment combinations, and the independently summarised rows that remove
the multiplication. The plan leaves visual form and paragraph development to
the fresh writer.

## Practical outcome and scope

The reader can build a query and account for each result row, rather than merely
recognise join names. The still-due report is the cumulative worked outcome;
EXISTS/NOT EXISTS provides the alternative when only presence matters. Retain
identities while constructing examples so repeated displayed values cannot be
mistaken for repeated facts.

No modelling prerequisite is assumed. Re-establish only the row meanings and
key guarantees needed to reason about these queries; schema design,
normalisation and enforcement methods stay with their owners. Explicit `ON`
conditions, aliases and selected columns belong inside worked construction,
not a detached syntax catalogue. INNER and LEFT joins deserve full worked
examples. RIGHT/FULL/CROSS can be oriented where they answer a reader question;
they do not require symmetrical tutorials or separate pages. Distinguish the
meaning of a query from its physical execution; do not imply the drawings are
traces of a particular join algorithm.

Coordinator accepted the narrow GROUP BY/SUM treatment here on 25 October:
this article owns the complete per-order report, while the aggregates/windows
neighbour owns general grouping, HAVING/FILTER, broader count/empty-input
questions, windows and ordering. The stub records that shared boundary. Its
final title and location should be aligned with the canonical tree.

Coordinator also accepted a compact set-operations section here: joins attach
matching columns; UNION ALL/UNION combine compatible rows with deliberate
multiplicity. Orient INTERSECT/EXCEPT through the same small case. No extra
child is warranted. Pagination/exports, application parameters and result
mapping, writes, value representations and NULL's full truth tables,
constraints, indexes and plans remain with the supplied neighbours. The article
still explains the NULL/IS NULL/COALESCE behaviour its own examples require.

## Example decisions and proposed extensions

Use the supplied starting state unchanged for the main walkthrough. In prose,
`order_items` rows are order lines. Amounts have no assigned currency. Use
recorded `order_items.unit_price`, not today's `products.price`, for line value.

Hand-derived expectations from those invented facts, not observed execution:

- Orders joined to their customers: three rows. Attach lines: five rows, with
  order 101 twice, 102 once and 103 twice.
- Orders LEFT JOIN payments: four rows, with 101 paired with 501 and 502,
  102 with 503, and 103 with a null-extended payment side.
- Qualifying card payments in ON keep all three orders; applying
  `payment.method = 'card'` in WHERE removes 103. The null extension means no
  matching payment under that join condition, not an unknown stored method.
- Customers with orders: Mina and Tariq once each under EXISTS; no orders:
  Edda under NOT EXISTS. A plain customer/order join shows Mina twice.
- Order 101 has two lines and two payments. Its four combinations sum line
  value to 79.00 and payments to 79.00. The erroneous balance remains zero,
  so checking only the final difference on this data misses the bug.
- Separate summaries give line values 39.50, 40.00 and 29.00, and payment
  summaries 39.50 and 40.00. The final report keeps all three orders and gives
  balances 0.00, 0.00 and 29.00; the positive-balance result is order 103.
- For set operations, paid orders contribute customer IDs 1 and 2; pending
  orders contribute 1. Combining their projected customer rows with UNION ALL
  retains three occurrences, while UNION deliberately returns customers 1 and
  2 once each. INTERSECT identifies 1; paid EXCEPT pending identifies 2.

Define the report as recorded line value minus recorded payments. If it is to
include every order, the writer should use left joins to both summaries and
state the report's policy that no recorded lines contribute zero value and no
recorded payments contribute zero payment. The supplied constraints do not
promise at least one line per order. Do not silently assume such a guarantee,
substitute zero for arbitrary unknown values, or extend this simple balance
into tax, shipping, refunds or settlement accounting. A negative balance should
not be clamped away without a domain decision. Filtering positive balances can
use an outer query over the named report, so a SELECT alias is not incorrectly
used in that same query's WHERE.

Proposed later scenario: payment 504 pays 10.00 by card towards order 103,
leaving its status pending and its lines unchanged. Its due amount becomes
19.00; NOT EXISTS(payments) no longer finds it. This distinguishes no payment
from not fully paid. This is a later scenario, not a correction to the starting
facts; coordinator should add it to the shared example before reuse.

Optional counterexample if the writer needs to demonstrate why SUM(DISTINCT)
is not a repair: split order 102's existing quantity-two mug line into two
numbered quantity-one mug lines at 20.00. Keep payment 503 at 40.00. The
purchase is still worth 40.00, while distinct line amounts total 20.00. This
satisfies the supplied schema and needs no new people or products. Record this
as a separate illustrative variant if used; it is not needed for the main
outcome and is not yet an agreed shared extension.

A left-join absence test may be compared with NOT EXISTS using a non-null key
such as payment_id. Do not test a nullable descriptive column as proof that no
row matched. NOT IN is not generally interchangeable in the presence of NULL;
the supplied payment order_id is non-null, so do not invent NULL rows there.
Its broader truth-table treatment belongs with values.

## Primary sources checked

Checked on 25 October 2026 against PostgreSQL 18 documentation. These are
semantic sources; no PostgreSQL system was run for this planning assignment.
The writer must obtain execution evidence for listings or outputs presented as
observations, following the supplied figures/database-verification workflow.

- [Table Expressions](https://www.postgresql.org/docs/18/queries-table-expressions.html),
  §§7.2.1–7.2.3: each satisfying pair contributes an inner-join row; LEFT adds
  null-extended unmatched rows; ON and WHERE have different outer-join
  consequences. Also checked aliases, derived tables and grouping into summary
  rows. This supports the construction and hand-derived combination counts.
- [SELECT](https://www.postgresql.org/docs/18/sql-select.html): SELECT ALL retains
  repeated candidate rows; DISTINCT compares selected rows. Checked query-level
  filtering and output naming rather than treating DISTINCT as a generic repair.
- [Subquery Expressions](https://www.postgresql.org/docs/18/functions-subquery.html),
  §9.24: EXISTS tests the presence of rows without multiplying the outer rows;
  NOT IN has a NULL-sensitive result. Do not claim a fixed physical evaluation
  strategy or exact amount of work for the existence test.
- [Aggregate Functions](https://www.postgresql.org/docs/18/functions-aggregate.html),
  §9.21: SUM combines non-null input values and returns NULL for no input;
  count(*) and count(expression) differ. Only the SUM handling needed for this
  report is assigned here.
- [Conditional Expressions](https://www.postgresql.org/docs/18/functions-conditional.html),
  §9.18.2: COALESCE chooses the first non-null argument. The decision that an
  absent payment summary means zero is supplied by the report's meaning.
- [WITH Queries](https://www.postgresql.org/docs/18/queries-with.html),
  §7.8.1: a named auxiliary query can make a larger query comprehensible.
  Do not imply WITH alone prevents duplication or forces a materialised
  intermediate table; the summary's row meaning provides the guarantee here.
- [Combining Queries](https://www.postgresql.org/docs/18/queries-union.html),
  §7.4: inputs need compatible column counts/types; UNION removes repeated
  result rows while ALL retains them; INTERSECT and EXCEPT express intersection
  and difference. Their output order is not a concatenation promise.
- [Sorting Rows](https://www.postgresql.org/docs/18/queries-order.html),
  §7.5: results without ORDER BY have unspecified order. Use simple explicit
  order keys for readable displayed outputs; defer ranking and pagination.
- [Constraints](https://www.postgresql.org/docs/18/ddl-constraints.html),
  §5.5: primary/unique keys and references inform the maximum matches possible.
  A foreign key does not make its referencing column unique or promise that a
  parent has children. The provided schema is the authority for this example.

## Continuity pass and integration questions

Read the entire plan from the assigned reader entry, including the child stub.
The sequence establishes matching before missing matches, tests existence
before arithmetic summaries and completes the report without depending on its
child. Every mandatory number uses the shared starting facts; proposed scenario
changes are explicit. Row identity, displayed values, matching cardinality and
amounts remain distinct throughout.

No unresolved boundary prevents writing. Align the neighbour stub with the
architect's final title/placement and approve or decline the later partial
payment scenario centrally. The optional equal-line-value variant can remain
unused. Root owns the single provisional-tree review and subsequent writing,
preview and article review.
