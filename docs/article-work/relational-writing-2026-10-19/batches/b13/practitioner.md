# b13 — independent practitioner review

Reviewed 20 October 2026 using `staycurrent-review`, practitioner perspective.
Full initial review of a15 against the original relational-practice goal, its
actual a02 parent and a13/a14 siblings, and the supplied family context and
remaining ownership plans. Read the complete frozen prose, five models, SQL,
renderer, verifier, retained native results and source ledger. No other
perspective's report, teaching-reference articles or old relational corpus was
read.

| ID | Practitioner verdict | Required repairs | Optional advice |
| --- | --- | --- | --- |
| a15 | Pass | None | None |

## a15 — Composing larger SQL queries

**Pass.** The article makes a query boundary's meaning, columns, row count and
multiplicity explicit before combining it with another query. This supplies
useful practical depth after the parent's staged report. It preserves the
parent's order-level receipt facts and explicitly distinguishes the join
sibling's different exercise. Expected identities and values provide something
concrete to check rather than trusting syntactically valid SQL.

Scalar examples distinguish zero rows, one value, one NULL and multiple rows.
An empty scalar result retains the outer order, while multiple receipt rows fail
the PostgreSQL statement. The stated key/reference proof for a single customer
and the aggregate alternative have different reasons for their bounds. Choosing
an arbitrary row with LIMIT would change the business question; deliberate
latest-row selection remains with the window article.

The correlation examples expose the actual lost predicate: both orders receive
the global total 65 when it is removed. A grouped derived table supplies at most
one receipt subtotal per order, whereas the raw join produces two rows for 101
and loses 102. Correlation describes dependence and meaning without promising a
physical execution count. This complements a14's join mechanics without
repeating them.

Membership handles duplicate inner keys, nullable inner and outer keys, and the
empty relation. In particular, an empty subquery makes NOT IN true even for a
NULL candidate. Ordinary equality and null-safe EXISTS implement different
policies; the explicitly non-null exclusion states which candidate population
it intends to keep. The article does not suggest a universal NOT IN rewrite or
performance ranking. These results agree with PostgreSQL's
[subquery-expression rules](https://www.postgresql.org/docs/18/functions-subquery.html).

The six set operations preserve the stated bag counts, including the NULL
whole-row duplicate class. Position/type compatibility is separated from
business meaning, and the branch-local limit example selects order rows before
its final customer deduplication. Final ordering and operator grouping are
explicit. PostgreSQL's [combination rules](https://www.postgresql.org/docs/18/queries-union.html),
SQLite's [compound SELECT rules](https://www.sqlite.org/lang_select.html#compound_select_statements),
MySQL 8.4's [set-operation support](https://dev.mysql.com/doc/refman/8.4/en/set-operations.html)
and SQL Server's [EXCEPT/INTERSECT syntax](https://learn.microsoft.com/en-us/sql/t-sql/language-elements/set-operators-except-and-intersect-transact-sql)
support the qualified portability notes. No other engine execution is implied.

The view example completes the parent's report as a named query with explicit
columns. It remains a current calculation over a fixed placement period, not a
historical January-end balance. A receipt changes its result inside the test
transaction and rollback restores the original value. Saved rows, fixed ordering,
fixed plans, access policy and production deployment are not promised. This is
consistent with PostgreSQL's [normal-view definition](https://www.postgresql.org/docs/18/sql-createview.html).

The optional recursive section provides enough detail to use and inspect a
bounded descendant query: anchor, expansion, final root exclusion, ordered paths,
missing and leaf roots, cycle guard, and visible truncation. A foreign key cannot
prevent an ancestry cycle; terminating this traversal does not repair that data.
The guard acts per path, and changing depth/path columns explain why UNION alone
cannot remove the recurring logical node. The depth bound and cycle guard are
separate controls. The resulting path order is not described as engine visit
order. These boundaries agree with PostgreSQL's
[recursive-query documentation](https://www.postgresql.org/docs/18/queries-with.html#QUERIES-WITH-RECURSIVE).
SQL Server's [CTE documentation](https://learn.microsoft.com/en-us/sql/t-sql/queries/with-common-table-expression-transact-sql)
also supports the qualified syntax and recursion-limit distinction.

The parent remains a useful ordinary report walkthrough. a13 owns expression
truth and conversions, a14 joins and grouping, a16 windows, a05 plan/cost
judgements, and the existing operational/security owners retain deployment and
access decisions. No scope repair or new child is needed.

## Independent execution and working figures

Inspected the verifier before running a temporary copy, with absolute imports of
the reviewed query/model sources and all evidence writes redirected into a
reviewer temporary directory. Created fresh own database
`rel3_prac_a15_1792450477537198000` on native PostgreSQL 18.6, executed the full
verification, and dropped that database in cleanup. The shared server and its
configuration were not changed. Retained writer evidence was not overwritten.

All original checks passed, covering the parent fixture, scalar SQLSTATE 21000,
correlated/global/raw-join results, all four membership policies, all six set
operators, the actual composed prose snippets, view values/types/mutation and
rollback, and all five traversal cases. The retained transcript's 39 calls were
also inspected; its separate-session boundary and single-call view transaction
are accurately documented.

Added two independent native checks beyond the supplied cases:

- With the ancestry cycle present and the depth cap increased to 12, traversal
  still returns exactly 2, 4, 5, 3. No path repeats an ID and no returned row is
  truncated. The path guard therefore stops the revisit independently of the
  illustrated depth-three cap.
- At depth one, Kitchen is truncated and Garden is complete. This checks that
  truncation means a blocked eligible expansion, rather than merely reaching the
  cap or having any child reference.

Independent model checks covered all 73 frames across 22 choices, with complete
panel shapes and narration. Additional explicit assertions checked empty-inner
membership truth values and INTERSECT ALL/EXCEPT ALL multiplicities. Reviewer
native output and redirected transcript remain in
`/var/folders/dh/062x03k90yxbfxg__1yd_h000000gn/T/rel3-prac-a15-ynp1q3i4/`.

In an own Chrome tab at the immutable 4438 preview, selected all 22 choices and
stepped every one to its final result. Scalar failures, nullable/empty
membership retention, duplicate counts and every hierarchy result agree with
native execution and the model contracts. Each selector resets to step one as
intended; backward navigation and reset also update the displayed state
correctly. The figures explicitly identify themselves as logical explanations,
not observed engine traces. The rendered traversal panel was visually checked.
The tab is now closed and preview 4438 is released.

## Scope and handoff

The article snapshot equals its rendered source, and all four manifest component
hashes match after review. No article/component edits, build, commit, retained
output overwrite, download-link interaction or shared-server change was made.
a15 passes the practitioner gate; no repair recheck is requested.
