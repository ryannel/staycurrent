# Indexes planning notes · 25 October 2026

## Inputs and reference exposure

Read the supplied commission, article, neighbours, incoming ownership, reading links, shared shop record and finished-reading list. No old published body, earlier plan or review was read. Used the current breakdown skill, its write reference-reading procedure and continuity skill.

Read all bounded fixed-reference parts separately through `scripts/read-writing-reference.py`, with every END marker delivered: Sequence diagrams 1–6; Indexes 1–7; Storage and durability 1–6. Complete-text hashes: sequences `722e27d04275d6ee28dfa024951827a78b5c591dc8b5f98584af197b5884809c`; indexes `d60bf12b37f922f0ced9ec54a51b1ef6b94841a40da5f20be6dafdbf75bec8c1`; storage `2bebcdf28bacf1f5ecc2220e8d20a7c34682e052fff3ecde56ca1a56aba08c07`.

Studied owned temporary IAB reference tabs at port 4584 with existing viewport and theme settings. Comparable finished drawings inspected: Indexes Figure 7's reordered entries beside unchanged heap rows and entries/fetches/sort counters; Figure 6's scattered matches reaching every table page; Sequence diagrams Figure 2's staged action and explanatory text; Storage Figure 3's same price change and engine comparison. All owned tabs were closed. No viewport or theme override was made.

After the references, read the complete visible explanation of the new query-execution parent and the query-results neighbour at the two supplied port-4606 URLs. Parent establishes pages versus row counts, three scan choices in principle, indexed inner lookups, estimates, spills and plan measurement. Its observed repair replaces repeated per-order aggregation, not a missing-index diagnosis. Query-results establishes grain, required occurrences and explicit ORDER BY. These supply prerequisite facts; they do not lead this outline's teaching or prose.

The useful reference pattern is to establish one visible mechanism, change one relevant fact, then explain the observed difference. Here that suggests developing a customer's history through key order, filtering, ordering and covering rather than arranging a catalogue of index features. The outline identifies what needs to become visible without prescribing figure layouts or paragraph development.

## Intended decisions and failure cases

The reader should derive a candidate key and explain why each part is there; tell a bound from a residual check; distinguish early stopping from merely retaining a small top-N; recognise a covering opportunity; reject an index that touches most table pages or reads many entries for few results; and retain only a workload-justified set. Important failures are time-first traversal for a customer query, an optional status between customer and time disrupting all-status order, functions or collation changing the indexed comparison, covering being mistaken for guaranteed index-only execution, and removing a constraint or a rare-job index as supposedly unused.

Keep the leading-equalities/range rule precise. It describes a useful contiguous range, not all possible ways an engine may use the index. PostgreSQL 18 skip scans can perform repeated searches. Among columns all fixed by equality, do not teach a universal 'most selective first' rule: other query prefixes matter. Likewise a later predicate need not bound the same traversal even when a native plan calls it an index condition.

## Example decisions and central proposals

Proposed centrally to the coordinator: reuse the generated report fixture unchanged for native comparisons, with customer 1001 and customer 1002, the existing UTC dates and no generated payments. Introduce a customer-history query returning `order_id, placed_at, status`, with customer equality, a timestamp lower bound, `ORDER BY placed_at DESC, order_id DESC` and `LIMIT 10`. For the core three-order illustration, customer 1 after 1 October has 103 then 101; a smaller illustrated limit may expose stopping without inventing history. Preserve order 103 as pending and total 29.00.

Candidate shapes for the writer to investigate, not observed winners: `(customer_id)`; `(customer_id, placed_at DESC, order_id DESC)`; `(placed_at DESC, customer_id, order_id DESC)`; and the customer-history key with `INCLUDE (status)` in PostgreSQL. A paid-only variant can compare a predicate-filtered history index against a key with status before time. The latter changes what all-status history can obtain in order; placing status after time changes its filtering role. Exact measured behaviour remains an experiment, including whether the planner chooses a different route.

The existing pagination projection has 201/202 tied with 103. It can support a separately labelled global-order explanation of ties, preserving its own customer IDs and projected-only status. Do not silently turn its next-page mutations into baseline history or claim it gives customer 1 three tied orders. No new small-row or schema extension is required by this outline. If the writer needs a larger hand trace, agree its exact IDs and facts centrally before use.

Use paid-only history for the partial-index example. In the generated fixture paid orders are common within October and pending orders are common overall; the fixed reference's pending-queue rarity is not a fact about this shop. A partial index need not represent a universally rare status, and a predicate-filtered route does not answer an all-status query. No new stored `orders.total`, email address, loyalty policy or operational queue is needed. Expression teaching can contrast the existing UTC half-open timestamp range with a fixed-UTC date expression; no new field is required.

Do not borrow the fixed reference's 36 rows, customer 42, 60,000-order table, page counts or timings as observations of this collection. Model entry counts belong to the labelled small illustration. A PostgreSQL plan does not necessarily expose the exact number of B-tree entries traversed; do not turn emitted rows or a separately counted logical candidate set into an observed traversal count. Retain actual plans, result comparisons, engine version/settings, generation rules, statistics state and index definitions with any future native experiment. The planner performed no execution or build.

## Ownership and continuity

No new child article or tree change is proposed. All distinct deeper outcomes already have owners, often in a different branch; contextual links should point to those owners rather than creating duplicate nested pages.

- Query-execution retains general plan reading, estimates, join methods, spills, repair testing and the broad-report performance diagnosis. This article develops access-path design and uses only enough native evidence to demonstrate it.
- Pagination retains continuation/snapshot contracts and mutation correctness; indexes owns the ordered route supporting them.
- Constraints retains what identity, reference and uniqueness mean. This article owns their physical lookup consequences and avoids rederiving integrity rules.
- Storage-durability retains page/cache/version/log mechanisms. This article needs enough locator and write-work explanation to judge an index.
- PostgreSQL indexes retains access methods, operator classes and rechecks. PostgreSQL plans retains counter-by-counter interpretation; PostgreSQL vacuum retains version cleanup and visibility machinery. This article qualifies covering without requiring those specialist treatments.
- Schema-change and PostgreSQL schema-change retain compatible live rollout, locks, build validity, concurrent operations, rebuild and safe drop procedures. Here readers learn why to budget and investigate those operations.

Continuity pass over the outline: each concept has a prerequisite already supplied or developed earlier; the key/entry/table distinction precedes covering; ordering precedes partial-index alternatives; read savings precede write trade-offs. The proposed customer-history query uses existing columns and preserves customer/order/line grain. The reporting comparison remains paid-order line value, not payment income; its total-order LIMIT cannot be justified by an order-date index. No additional ownership decision is blocking the outline; the proposed query scenario awaits coordinator adoption before writer/native fixture work.

## Primary-source checks

Checked 25 October 2026. These are sources for consequential design claims, not evidence of this shop's execution:

- [PostgreSQL 18: Multicolumn indexes](https://www.postgresql.org/docs/18/indexes-multicolumn.html): leading equalities and the next range bound traversal; later keys can reject entries; skip scans complicate absolute prefix rules.
- [PostgreSQL 18: Indexes and ORDER BY](https://www.postgresql.org/docs/18/indexes-ordering.html): forward/backward scans, mixed directions and null placement; a matching order can permit early LIMIT stopping.
- [PostgreSQL 18: Index-only scans and covering indexes](https://www.postgresql.org/docs/18/indexes-index-only-scans.html): payload differs from search keys; coverage permits but does not guarantee avoiding heap visits; width and update rate affect the trade-off.
- [PostgreSQL 18: Partial indexes](https://www.postgresql.org/docs/18/indexes-partial.html): subset predicates, recognisable implication and planning-time limitations. Do not claim every parameterised execution fails: the relevant question is what the chosen plan can prove.
- [PostgreSQL 18: Indexes on expressions](https://www.postgresql.org/docs/18/indexes-expressional.html): stored expression results can support their matching queries and add maintenance work.
- [PostgreSQL 18: Combining multiple indexes](https://www.postgresql.org/docs/18/indexes-bitmap-scans.html): bitmap combinations and physical-order visits lose original index order; mixed workloads motivate alternatives to one wide key.
- [PostgreSQL 18: Index introduction](https://www.postgresql.org/docs/18/indexes-intro.html): query use is cost-dependent, joins/writes can benefit from searching, and index maintenance and live build costs remain real.
- [PostgreSQL 18: B-tree implementation](https://www.postgresql.org/docs/18/btree.html#BTREE-IMPLEMENTATION): leaf/internal structure and page splits; only the mechanism needed for design belongs here.
- [PostgreSQL 18: Constraints](https://www.postgresql.org/docs/18/ddl-constraints.html#DDL-CONSTRAINTS-FK): referenced and referencing lookup roles differ; PostgreSQL does not automatically index the referencing columns. Unique/primary-key indexes also carry semantic responsibilities.
- [PostgreSQL 18: Indexes and collations](https://www.postgresql.org/docs/18/indexes-collations.html): the comparison's collation must fit the indexed ordering.
- [MySQL 8.4: Clustered and secondary indexes](https://dev.mysql.com/doc/refman/8.4/en/innodb-index-types.html): an InnoDB secondary entry carries the primary key and starts a clustered-key lookup; long primary keys increase secondary width. This bounded comparison prevents PostgreSQL heap locators becoming a universal model.
