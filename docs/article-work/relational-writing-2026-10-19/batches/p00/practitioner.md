# Pilot p00: independent practitioner review

Reviewed 19 October 2026 using `staycurrent-review`, assigned practitioner
perspective only. No teaching review, fixed teaching-reference articles or old
relational corpus was read. No article or component was edited.

## a14 — Joining and summarising data

**Verdict: repair.** The main report is correct and the assigned relational-practice
depth is present. Two local corrections below should be repaired before acceptance;
neither calls for a new section or article.

### Required repairs

1. **a14-P1 — Make the advertised self-join use one source twice.**
   Snapshot `a14.astro:77–80`; owned `queries.mjs:151–155`.
   The prose says both references name the same table, but the executable example
   joins two independently written `VALUES` sources, with different column sets.
   Its answers are correct, but it does not demonstrate the mechanism it claims
   to demonstrate: one employee relation serving two roles. Define the two
   employees once in an `employees(employee_id, name, manager_id)` CTE, then use
   `FROM employees AS e LEFT JOIN employees AS m`. Retain the existing result and
   explanation of the missing manager. I independently executed that replacement
   shape and obtained the same `(Mina, NULL), (Tariq, Mina)` rows. PostgreSQL's
   [table-alias documentation](https://www.postgresql.org/docs/18/queries-table-expressions.html#QUERIES-TABLE-ALIASES)
   illustrates this same-source/two-alias mechanism.

2. **a14-P2 — Qualify the grouping-column rule.**
   Snapshot `a14.astro:104`: “Every added grouping column changes what one result
   row represents” is too absolute. Adding a column already determined by the
   existing grouped key does not split the groups; this very example groups by
   both customer ID and its dependent name. Say that an added grouping column
   *can split a group when its values vary within it*, and retain the concrete
   status example. I independently ran the displayed query grouped by customer
   ID alone and by ID plus name: both return `(1, Mina, 2)`. The following
   paragraph's dependency allowance is correct and should remain. See
   [PostgreSQL GROUP BY](https://www.postgresql.org/docs/18/sql-select.html#SQL-GROUPBY).

### Optional advice

- `verify.mjs:59–61`: the asserted wrong Mina totals are useful evidence, but the
  subsequent full-result negative comparison against `expectedReport` also
  differs in column shape: `queries.wrong` has three columns and the expectation
  has five. For a stronger regression check, give the intentionally wrong report
  the final report's projection and assert a value difference, or compare the
  shared ID/value columns. The existing explicit `(100, 60)` assertion already
  establishes the numerical failure, so this is not a blocker.
- Snapshot `a14.astro:179` slightly overstates the second negative check: the
  verifier compares the ON/WHERE customer-order pair results, rather than a
  mutated final report against the five-column expected report. Wording such as
  “the ON/WHERE comparison exposed the dropped customers” would describe the
  actual check exactly. Its consequence is independently established.

### Correctness and practical judgement

The report contract is precise: January orders and receipts are independent
activity totals; all customers appear; missing activity means zero; an existing
incompletely valued order makes the complete order total unknown. The SQL
preserves all four rules. The non-null subtotal key correctly distinguishes
absence from an unknown present subtotal, including an order with no lines.

The examples cover the assigned traps without turning into a syntax catalogue:
pair multiplicity and incomplete composite predicates; ON versus WHERE and the
insufficient `OR key IS NULL` repair; identity versus duplicate display names;
four distinct counts; global empty input versus no groups; status totals and
unknown-value guards; independent pre-aggregation; and why value DISTINCT cannot
repair identity duplication. Intermediate uniqueness and independent totals make
the final row-count claim structural rather than an accident of the fixture.

The model captions distinguish logical teaching stages from physical execution,
and the native evidence does not make a performance claim. The known-value
subtotal 90 is explicitly separated from the unknown complete total. This is
useful practitioner depth for the original relational goal.

### Parent, sibling and child boundaries

The entrance names the parent's basic join/grouping prerequisite and specifically
links its `#checkable-stages` section before any worked query. CTE notation is
used rather than retaught. The short EXISTS example explains its cardinality
purpose and hands membership detail to a15. Expression/three-valued-logic detail
stays with a13, retained-detail calculations with a16, and physical execution and
cost with a05. There are no children. The self-join repair needs no hierarchy
lesson; no further reporting or join-specialist branch is justified.

The parent and siblings are still marked planned in the live pilot wrapper, so
this review assesses the supplied plans and the article's prerequisite contract;
it does not certify the eventual parent prose or assembled reading path.

### Independent evidence

- Read the original planning commission, writing commission, a14 context and
  supplied parent/sibling section plans, completed article snapshot, sources and
  handoff, runtime record, and all four owned component/model/SQL/verifier files.
- SHA-256 of all four owned files matched the manifest at review time.
- Independently ran `node src/components/relational-next/a14/verify.mjs`:
  all assertions passed on PGlite 0.5.8 / PostgreSQL 18.3.
- Independently ran the same verifier with `--native` in the documented
  disposable loopback cluster: all assertions passed on native PostgreSQL 18.6
  (Homebrew). The verifier created and dropped its own uniquely named database.
  Both runs returned the five expected customer rows, independent order facts
  `(4, 3, 90)`, payment total 45 and wrong Mina totals `(100, 60)`.
- Additional independently composed PGlite probes added a null line alongside
  known lines and a known paid order alongside Sol's unknown order. Both complete
  order totals and conditional paid totals correctly remained unknown. Also
  executed the dependent-group-column comparison and same-source self-join
  described above.
- Opened the live article at
  `http://127.0.0.1:4337/review/relational-next/joins-and-aggregation/` and manually
  advanced every model mode: key matches 4 rows / 3 customers; cross matches 20 /
  5; ON preserves 5 customers in 6 rows; WHERE retains 3 in 4; detail multiplication
  ends at 100/60; independent totals end at 50/30. Inspected the rendered final
  repaired-total figure. These displayed outcomes agree with SQL. Playback timing,
  mobile layout and style-reference fidelity belong to the independent teaching
  review and are not certified here.
- Checked consequential semantics against primary documentation:
  [PostgreSQL table expressions](https://www.postgresql.org/docs/18/queries-table-expressions.html)
  for pairs, preservation and ON/WHERE;
  [aggregates](https://www.postgresql.org/docs/18/functions-aggregate.html) for
  non-null inputs and empty totals;
  [aggregate expressions](https://www.postgresql.org/docs/18/sql-expressions.html#SYNTAX-AGGREGATES)
  for DISTINCT and FILTER;
  [SELECT](https://www.postgresql.org/docs/18/sql-select.html#SQL-GROUPBY) for
  dependencies and grouping; and
  [SQLite SELECT](https://www.sqlite.org/lang_select.html#bare_columns_in_an_aggregate_query)
  for the documented bare-column allowance. SQLite remains documentation-only.

Recheck only the two required prose/query repairs and their affected self-join
assertion; unchanged report logic and engine results need no repeat review.
