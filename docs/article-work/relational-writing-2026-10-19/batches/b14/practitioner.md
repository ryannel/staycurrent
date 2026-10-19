# b14 — independent practitioner review

Reviewed 20 October 2026 using `staycurrent-review`, practitioner perspective.
Full initial review of a16 against the original relational-practice goal, actual
a02 parent and a13/a14/a15 siblings, and the supplied family plans. Read the
complete frozen article, seven models, renderer, SQL/worksheet, native verifier,
retained observations and source ledger. No other perspective's report,
teaching-reference articles or old relational corpus was read.

| ID | Practitioner verdict | Required repairs | Optional advice |
| --- | --- | --- | --- |
| a16 | Pass | None | None |

## a16 — Calculating across related rows

**Pass.** Two small datasets support useful application and reporting decisions
without becoming a catalogue. The article preserves event or item-day detail,
defines the input grain, and warns that a window cannot repair duplicated input.
The ledger's unknown contribution is consistently distinguished from a complete
balance; subtracting event amounts compares event sizes rather than balance
changes. The actual parent already supplies a complete first partition-total
case and staging notation, so this deeper treatment has a sound entry point.

Input, partition, calculation order and presentation order are distinct. The
article correctly places windows after input filtering/grouping, preserves ties
for business ranking, and adds a unique identifier only where a repeatable row
selection is intended. A larger ID is a chosen tie rule, not proof of causality.
Rank versus dense rank and fixed counts produce the stated identities at both
cutoffs. Nullable descending keys have an explicit policy. These distinctions
agree with PostgreSQL's [window tutorial](https://www.postgresql.org/docs/18/tutorial-window.html)
and [sorting rules](https://www.postgresql.org/docs/18/queries-order.html).

Filtering illustrates two different questions rather than a generic rule to move
conditions outside. Latest-then-positive keeps event 6; latest-among-positive
keeps 3 and 6. A report date restriction can remove needed history, while selecting
an entire account preserves its partition. Whole-shop shares retain the complete
110 denominator before the winners are filtered. Zero totals remain undefined;
missing amounts require an explicit completeness policy. Mathematical share
invariants and the displayed 99.99% rounded sum are correctly separated.

The ordered default frame includes peers, while the explicit ROWS calculation
uses a complete timestamp/ID sequence. Merely switching to ROWS with tied ordering
would not establish an event sequence. The moving calculation distinguishes the
last three recorded rows from an inclusive date-distance interval, including the
2 January lower boundary at 4 January. Missing dates are not invented, nor treated
as confirmed zero automatically. The chosen date/interval syntax and one-ordering
restriction match PostgreSQL's [frame specification](https://www.postgresql.org/docs/18/sql-expressions.html#SYNTAX-WINDOW-FUNCTIONS).

LAG carries a non-null event identity to separate absence from a present NULL.
Its third argument defaults only an absent row, and a frame does not change it
into a previous-non-null search. Previous recorded row versus previous calendar
day remains an explicit choice. PostgreSQL's [function reference](https://www.postgresql.org/docs/18/functions-window.html)
supports these semantics and the stated lack of IGNORE NULLS. BigQuery's
[QUALIFY documentation](https://docs.cloud.google.com/bigquery/docs/reference/standard-sql/query-syntax#qualify_clause)
supports the documentation-only dialect comparison; no other engine is claimed
as executed.

The closing exercise composes three different partitions/calculations before
filtering: tied sellers, complete shop-day denominator and preserved moving
history. Its North A/B and singleton South results are correct. Identities,
intermediate values and awkward boundaries establish more than a row-count test.
Reverse insertion order is useful evidence but is explicitly not presented as a
proof that incomplete ordering is reliable.

This article owns ranking, frames, previous-row semantics and their filtering
boundaries. a14 retains input joins/grouping, a13 arithmetic/null/time policy,
a15 general composition, a17 changes, and a05 performance diagnosis. Existing
links provide those details without prerequisite detours. No scope repair or
additional child is needed.

## Independent native and model checks

Inspected the verifier before execution. Ran a temporary copy with absolute
imports of the frozen SQL/model, a fresh unique reviewer database name, and all
output files redirected to a temporary directory. Native PostgreSQL 18.6 passed
all 17 result sets in original and reversed insertion order, with explicit
expected assertions and native/model comparisons. This independently reproduced:

- Six retained ledger events with account totals 25/7; latest events 5 and 6;
  North positions 1,2,3,4, ranks 1,1,3,4 and dense ranks 1,1,2,3.
- Complete denominators 110/0, rounded percentages 36.36/36.36/18.18/9.09/NULL,
  ordered denominators 40/80/100/110 and rounded share sum 99.99.
- Event totals 10/10/30/25/25 versus peer totals 10/30/30/25/25; last-three-row
  totals 10/30/70/110 versus date totals 10/30/60/90.
- Preserved-history totals 25/25 versus prematurely filtered −5/−5; both
  latest/positive policies; predecessor identity, NULL/default and change values;
  cumulative missing counts; previous recorded date and the final combined report.

Wrote and executed an additional independent boundary script in another fresh
own database. It confirms that timestamp-only latest rank retains 4,5,6; LAG
still returns 0/10/NULL/20/−5 under a current-row-only frame; an actual generated
calendar joined to the sales fixture and explicitly zero-filled gives a final
three-date mean of 30; and an offset RANGE with two ordering expressions raises
the expected windowing error. This tests the actual preparation procedure rather
than only recomputing its arithmetic constants.

Both own databases were dropped in cleanup. Reviewer scripts/output remain at
`/var/folders/dh/062x03k90yxbfxg__1yd_h000000gn/T/rel3-prac-a16-ntfmptxi/`.
The shared server/configuration and retained writer evidence were not changed.

All 78 model states pass table-shape/render checks and the relevant native-value
comparisons. In an own Chrome tab at fixed 4439, advanced all seven figures and
selected all eighteen choices at their final step. Each choice preserves the
inspection step; displayed identities, denominators, ranks and values agree.
Also checked event 2 under both running frames, the included 2 January interval
boundary, and absent versus present-NULL predecessor states under both defaults.
Contributing rows, rules, narration and results agree; the LAG panel was visually
inspected. The figures explicitly identify their logical-model status.

## Scope and handoff

The snapshot equals its rendered article source and all four manifest component
hashes match. No article/component edits, builds, Git operations, retained output
overwrites or shared-server changes were made. No worksheet link was clicked;
root owns the download-byte check. The own tab is closed and preview 4439 is
released. Prior untouched article passes remain retained. a16 passes the
practitioner gate; no repair recheck is requested.
