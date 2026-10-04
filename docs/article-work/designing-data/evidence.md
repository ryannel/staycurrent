# Designing your data: evidence and SQL verification

Checked 4 October 2026. PostgreSQL references use version 18. These articles are
drafts; verification does not authorise publication.

## Execution

`schema.sql` and `verify-sql.mjs` ran in an isolated, in-memory PGlite instance.
The runtime was installed under `/private/tmp/staycurrent-design-sql`; it is not a
site dependency. `SELECT version()` returned:

```text
PostgreSQL 18.3 (PGlite 0.5.8) on wasm32-unknown-emscripten,
compiled by emcc ... 3.1.74 ..., 32-bit
```

[PGlite's documentation](https://pglite.dev/docs/) identifies its in-memory
PostgreSQL use and single exclusive connection. This is executed PostgreSQL SQL,
not a JavaScript simulation of SQL. It is not a multi-session server test.

Reproduce from the repository root:

```sh
npm install --prefix /private/tmp/staycurrent-design-sql @electric-sql/pglite@0.5.8 --ignore-scripts --no-audit --no-fund
node docs/article-work/designing-data/verify-sql.mjs /private/tmp/staycurrent-design-sql/node_modules/@electric-sql/pglite/dist/index.js
node docs/article-work/designing-data/verify-article-sql.mjs /private/tmp/staycurrent-design-sql/node_modules/@electric-sql/pglite/dist/index.js
```

The run passed 48 SQL cases. `sql-results.json` preserves the executed statements,
rows and rejection messages. Each failed statement runs separately in autocommit,
so the next example does not inherit an aborted transaction. Normal psql usage
can reproduce that arrangement; inside an explicit transaction an error needs
rollback or a savepoint.

`verify-article-sql.mjs` also extracts the actual SQL constants from the modelling
and constraints Astro sources. It passed 34 exact article statements plus four
focused JSON contract probes, including
the receipt result, schema, seed rows, CHECK-only probe, line attempts, SKU
attempts, and the serial lookup/insert pair. `article-sql-results.json` includes
the article source hashes for that run. The JSON source constants also ran:
related details, attribute setup, value/type probe, capacity query, type check,
indexes, and `jsonb_set`. The query returns capacity 350 before the update and
375 after it. An additional accepted fractional JSON number fails the integer
query and an indexed write, showing why a number-type check alone does not
establish the integer extraction contract.

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
| `jsonb_set` capacity change | Changes capacity while preserving material |
| GIN and capacity expression indexes | Created and their definitions inspected |

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
supports indexing the capacity expression. The example must match the query's
integer extraction. A contract for capacity values is needed: malformed strings
can fail a cast during query, index creation, or subsequent indexed writes.
Promoting a frequently queried shared field to a typed column can make that
contract easier to express; it does not follow merely from using an index.
