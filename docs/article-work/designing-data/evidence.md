# Designing your data: evidence and SQL verification

Originally checked 4 October 2026; current article SQL rechecked 15 October 2026.
PostgreSQL references use version 18. These articles are
drafts; verification does not authorise publication.

## Execution

`schema.sql` and `verify-sql.mjs` ran in an isolated, in-memory PGlite instance.
The original run used a temporary runtime. The project now includes PGlite 0.5.8;
the current article verifier uses that installed dependency by default. `SELECT version()` returned:

```text
PostgreSQL 18.3 (PGlite 0.5.8) on wasm32-unknown-emscripten,
compiled by emcc ... 3.1.74 ..., 32-bit
```

[PGlite's documentation](https://pglite.dev/docs/) identifies its in-memory
PostgreSQL use and single exclusive connection. This is executed PostgreSQL SQL,
not a JavaScript simulation of SQL. It is not a multi-session server test.

Reproduce from the repository root:

```sh
node docs/article-work/designing-data/verify-sql.mjs "$PWD/node_modules/@electric-sql/pglite/dist/index.js"
node docs/article-work/designing-data/verify-article-sql.mjs
```

The run passed 48 SQL cases. `sql-results.json` preserves the executed statements,
rows and rejection messages. Each failed statement runs separately in autocommit,
so the next example does not inherit an aborted transaction. Normal psql usage
can reproduce that arrangement; inside an explicit transaction an error needs
rollback or a savepoint.

`verify-article-sql.mjs` extracts SQL constants from the current modelling,
constraints and JSON article sources. The repaired verifier passed 110 statements
on 15 October. `article-sql-results.json` records the source hashes and outcomes.
It runs the alternative related-row design in its own database, then follows the
JSON example through extraction, the incomplete type rule, conversion into
`mug_details`, the hybrid query, the final indexes and the material update.

The conversion accepts JSON numbers 350 and 350.0. It rejects missing capacity,
JSON null, a numeric string, a fraction, zero, a negative number, overflow and an
object-valued capacity. After each rejected conversion, rollback preserves the
original JSON and removes the newly created details table. Successful conversion
keeps capacity 350 in the typed column and removes its duplicate from JSON. The
later `jsonb_set` changes material to stoneware while capacity remains 350.

The six-article review found that the previous verifier still expected capacity
375 and an expression index from an older article revision. Those expectations
have been replaced. The original 48-case `verify-sql.mjs` remains useful for its
individual PostgreSQL probes, but its capacity update and expression-index tests
are historical examples, not verification of the current article workflow.

The companion schema contains the same C4, P7 and P8 seed values as Constraints
(P8 costs EUR 24; O12 was placed at 09:00 UTC on 4 October), plus SchemaMap's
O13 with one P7 line and one P8 line. O12 still has one line before reader
experiments add a second line. The companion file creates tables in an empty
practice database and contains no destructive setup.

Observed outcomes:

| Case | Observed result |
| --- | --- |
| O12 line 1, P7, quantity 2, agreed unit price 18 | Line total 36.00 while catalogue price is 20.00 |
| Second O12 line 1 | Rejected: duplicate primary key (`23505`) |
| O12 line 2 for P7 | Accepted: product identity is not line identity |
| O13 line 1 | Accepted: line number is local to an order |
| Missing product P404 | Rejected: foreign key (`23503`) |
| Quantity 0 / SQL NULL | Rejected: CHECK (`23514`) / NOT NULL (`23502`) |
| NaN catalogue or agreed price | Rejected by the explicit NaN exclusion |
| CHECK-only quantity probe with SQL NULL | Accepted; `NULL > 0` yields SQL NULL |
| Duplicate assigned SKU / several unassigned SKUs | Duplicate rejected; two SQL NULL values accepted |
| Order O14 without lines | Accepted; line count remains zero |
| Delete purchased P7 or referenced C4 | RESTRICT rejects (`23001` in this runtime) |
| Delete O13 | Its lines are deleted through CASCADE |
| SET NULL on a required reference | Rejected by NOT NULL |
| Numeric capacity filter `>= 300` | Returns P7 |
| Material containment `ceramic` | Returns P7 and P8 |
| Missing capacity / explicit JSON null | `?` returns false / true; `->>` returns SQL NULL for both |
| Whole SQL NULL attributes in a diagnostic probe | `?`, both extraction operators and `jsonb_typeof` yield SQL NULL; the production column rejects it |
| Number 350 / string `"350"` | `jsonb_typeof` distinguishes them; `->>` returns text `350` for both |
| Numeric versus string containment | Does not match |
| Integer cast of `"350"` / `"350 ml"` | Accepts 350 / rejects invalid integer text |
| Object-level JSON CHECK | Rejects array and JSON null; does not constrain the type of a member |
| Explicit capacity type CHECK | Rejects a string or JSON null, permits absent capacity |
| Current capacity migration | Validated capacity moves into `mug_details`; rejected inputs leave source JSON intact after rollback |
| Current `jsonb_set` material change | Changes material to stoneware; typed capacity stays 350 |
| Current GIN and typed-capacity indexes | Created after the conversion |

Concurrency waiting, index selection, execution time and physical storage were
not tested. The index examples establish valid definitions; two catalogue rows
cannot establish a useful speedup.

## Design and normalisation

[UC Berkeley CS186: DB Design](https://cs186berkeley.net/notes/note13/)
supplies functional dependencies, candidate keys, decomposition and the
insert/update/delete anomaly motivation. Equal determinant values require equal
dependent values; matching sample rows alone do not establish the domain rule.

[Janusz Getta, University of Wollongong: Database Normalization](https://documents.uow.edu.au/~jrg/235/slides/03databasenormalization/03databasenormalization.pdf)
(Autumn 2026, slides 3, 13–17, 24–25) supplies repeating groups, partial
dependencies and a worked transitive-dependency decomposition.
[RPI CSCI4380: Normalization](https://www.cs.rpi.edu/~sibel/csci4380/fall2026/lecture_notes/lecture5.html)
gives the formal 3NF and BCNF distinction. A simplified explanation through this
shop's single chosen key should not claim that formal 3NF bans every non-key
determinant: its definition also permits a prime attribute on the dependent side.

Application of these sources to the commissioned shop is design reasoning:
`order_id → customer_id, placed_at`; `product_id → name, current_price`;
`(order_id,line_no) → product_id,quantity,unit_price`.
Agreed unit price belongs to the line. It is a different fact from the current
catalogue price, so preserving it is not redundant copying of that fact. A
delivery snapshot can similarly record what was agreed at purchase time.

## Constraints and concurrency

[PostgreSQL 18: Constraints](https://www.postgresql.org/docs/18/ddl-constraints.html)
supports CHECK's TRUE-or-NULL rule, separate NOT NULL enforcement, composite
primary keys, default UNIQUE null treatment, foreign keys and delete actions.
CASCADE implements a selected deletion policy; the article must explain that it
removes the dependent lines. SET NULL still has to satisfy other constraints.
NO ACTION is the default; RESTRICT cannot be deferred. A foreign key constrains
references in existing lines, not a requirement that every order have a line.
CHECK is intended for the inserted or updated row, not a stock calculation over
other rows. A unique or foreign-key constraint may itself enforce a relation
between rows; do not broaden the CHECK limitation to all constraints.

[PostgreSQL 18: Index Uniqueness Checks](https://www.postgresql.org/docs/18/index-unique-checks.html)
documents insertion-time conflict checks. An insertion conflicting with an
uncommitted insert waits for its outcome: commit leaves a conflict, rollback
removes it. Two application lookups that each see no matching SKU do not reserve
that absence. Their intervening writes can race. The article's interleaving is
an illustrative schedule based on this documented behaviour, not an executed
multi-session experiment.

[PostgreSQL 18: Numeric Types](https://www.postgresql.org/docs/18/datatype-numeric.html)
defines exact decimal numeric values and precision/scale, including rounding to
declared scale. PostgreSQL sorts numeric NaN above ordinary numeric values, so
`price >= 0` alone accepts it. The schema excludes NaN explicitly; the declared
precision/scale rejects infinities. Two decimal places are the chosen EUR example, not a universal
currency model. [Date/Time Types](https://www.postgresql.org/docs/18/datatype-datetime.html)
defines `timestamptz`: storage represents an instant; output uses the session time
zone. It does not retain the original input zone name.

## Tables and JSON

[PostgreSQL 18: JSON Types](https://www.postgresql.org/docs/18/datatype-json.html)
supports valid-JSON enforcement, binary jsonb, containment, GIN support and row
locking for document updates. Updating separate keys in one row still locks the
row. This is a reason to consider independent rows for independently edited
things; it is not a throughput measurement or a claim about every document
database. A whole-column GIN index can support the shown `attributes @>` filter.
It does not automatically serve the shown cast-and-range capacity query.

[PostgreSQL 18: JSON Functions and Operators](https://www.postgresql.org/docs/18/functions-json.html)
defines `->`, `->>`, `?`, `jsonb_typeof` and `jsonb_set`. Missing extraction yields
SQL NULL; JSON null is a JSON value. Text extraction collapses that distinction.
`jsonb_set` constructs an updated JSON value; it is not a promise to rewrite only
that key physically. The demonstrated single-level path avoids the function's
requirement that earlier path steps already exist.

[PostgreSQL 18: Indexes on Expressions](https://www.postgresql.org/docs/18/indexes-expressional.html)
supports the expression-index alternative discussed in the article. Its conversion
would have to work for every input admitted by validation. The displayed final
index instead uses the typed `mug_details.capacity_ml` column. The current example
validates whole-number, range and JSON-type requirements before converting the
capacity and removing it from the object. This is a choice for the catalogue's
queries and rules, rather than a requirement to move every JSON field into a column.
