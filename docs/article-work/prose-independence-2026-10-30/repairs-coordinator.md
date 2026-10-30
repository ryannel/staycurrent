# Coordinator repairs and continuity

Eight general relational articles were read in full, repaired against the
independent [baseline](reviews/baseline-core-eight.md), and checked through the
rendered prose-only exports. A different reader independently confirmed these
alongside the PostgreSQL articles. The source-based preparation and rendered
confirmation keep illustration contents separate from the article's explanation.

| Article | Coherent repair |
| --- | --- |
| relational-introduction | Replaced table/transaction/index/recovery/sharding playback tours with the actual relationships and event sequences. Explicitly explained rollback after the mug change and the two crash/acknowledgement outcomes. |
| data-modelling | Supplied the actual ternary offers and each source pair behind the invented offer, the repeated-name correction, and both original order/date associations plus the unsafe/safe projection schemas. Explained line identity and agreed-price preservation directly. Preserved the user's existing discount and maintenance prose. |
| normalisation | Worked through closure, the lossy order/date split, the initial three-row chase tableau and its symbol merges, the locally valid adviser insertion that breaks the original rule, and the redundant FD reductions and resulting 3NF schemas. Kept algorithmic conditions and formal scope intact. |
| hierarchies | Established parentage and alternative shared routes, explained the concurrent two-move cycle, and connected recursive rounds, path changes, closure maintenance and nested intervals directly to their stored facts. Removed control/scene directions. |
| history | Defined A1–A4 independently with their effective and recording periods, explained the two accounts of the same instant, and developed purchase-record correction versus later amendment/refund. Stated why approved external deletion remains incomplete after its database step. |
| constraints | Supplied positive/zero/missing-quantity outcomes, numbered-line identity, the adjoining-room interval, deferred-reference completion and the concurrent payment result in prose. Preserved enforcement and concurrency boundaries. |
| values | Explained cast placement, the explicit 20.01-versus-20.00 allocation, retained instant versus displayed zone, the Stockholm 25-hour day, structured label facts and NULL-filter outcomes outside all illustration wrappers. |
| query-results | Preserved its already-complete row-grain and amount reasoning while replacing scene-led transitions. Final independent confirmation also corrected an ordinary table caption to name customer IDs rather than order IDs. |

## Sources and exact examples

The article references were retained. Consequential expansions were checked
against the primary sources already cited, rather than inferred from a drawing:

- [PostgreSQL 18 constraints](https://www.postgresql.org/docs/18/ddl-constraints.html): required values, unknown checks, keys/references and the boundary of cross-row checks.
- [Date/time types](https://www.postgresql.org/docs/18/datatype-datetime.html), [date/time operations](https://www.postgresql.org/docs/18/functions-datetime.html) and [mathematical operators](https://www.postgresql.org/docs/18/functions-math.html): retained instants, display zones, calendar versus elapsed intervals and truncating integer division.
- [Foundations of Databases, chapter 11](https://webdam.di.ens.fr/Alice/pdfs/Chapter-11.pdf), especially the chase example in section 11.2, and [Database System Concepts, chapter 7](https://www.db-book.com/slides-dir/PDF-dir/ch7.pdf), especially closure, canonical-cover reduction and 3NF synthesis: the affected formal arguments. The shop-specific symbolic trace is independently worked from its declared FDs.

Exact example premises were recovered from the existing modelling and
normalisation scene definitions and shared example, including 101 at 12 October
09:30 UTC and 103 at 20 October 10:15 UTC, both for customer 1. A direct calculation
checked the extra offer tuple, four unsafe versus two safe reconstructed order
rows, the seven-attribute closure, the chase witness and the two decimal
allocations. Python's time-zone data confirmed 25 elapsed hours between the stated
Stockholm midnights and the 23:00 endpoint after 24 elapsed hours. These are
mathematical/example checks, not new PostgreSQL execution observations.

No changes were made to the SQL listings, downloads or engine test fixtures.
Their applicable earlier evidence is retained. The source and figure examples
remain conceptual where they were conceptual before.

## Integrated confirmations

Three bounded final corrections followed the full independent rendered reads:

- `pg-distribution`: replaced an undefined querying-server label C with the
  querying server's local sort/join role; confirmed by its independent reader.
- `query-results`: corrected the textual set-operation table caption to customer
  IDs from paid and pending orders; confirmed against the surrounding query.
- `versioned-fills`: distinguished the delayed revision-1 candidate from
  replacement B's reread of revision 2; confirmed in the experiment's context.

The CockroachDB schema-change source check also exposed an existing simplification:
the current backfiller captures concurrent changes in a temporary index and merges
them later. The article now explains that mechanism. The index animation's text
alternative and caption explicitly say that its one-index view combines capture
and merge. No motion, geometry, control behaviour or outcome changed. This keeps
the optional visual honest without making the article depend on its qualification.

Density findings caused by restored premises were repaired in their own
explanations, without dropping the data needed to follow them. No page in either
commissioned collection has a density warning in the integrated checked build.

## Shared example and scope

Mina, orders 101/103, customer 1, P7/P3/P9, the agreed 29.00 line total and the
independent hypothetical scenarios retain their established meanings. The user's
pre-existing modelling discount variation remains: 29.00 of lines minus an
explicit 3.00 discount gives 26.00 due. It is not silently made part of the
unpaid-order report or the other starting scenarios. Neither the new prose nor
the diagrams redefine the collection's source of truth.

This is a correction of the two existing published collections. It adds no
article destinations, changes no publication states and removes no illustrations.
