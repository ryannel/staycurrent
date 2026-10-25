# Technical sources and observation limits · 25 October 2026

Primary documentation consulted externally through web reads (PostgreSQL18 throughout):

| Claims | Primary source | Check |
| --- | --- | --- |
| Strong types, string-literal inference, casts | [Type conversion](https://www.postgresql.org/docs/18/typeconv-overview.html), [Value expressions4.2.9](https://www.postgresql.org/docs/18/sql-expressions.html#SQL-SYNTAX-TYPE-CASTS) | Explicit/implicit distinction checked against docs; displayed cast expression executed. |
| Exact decimal, finite precision/scale/range, storage rounding, approximate float | [Numeric types8.1](https://www.postgresql.org/docs/18/datatype-numeric.html) | 20.005→20.01; rounded overflow rejected22003; numeric versus float comparison observed. Finite range explicitly qualified. |
| Integer division, mixed numeric inputs, rounding calculation | [Math operators9.3](https://www.postgresql.org/docs/18/functions-math.html) | Cast before/after, decimal literal, allocation and scaled-integer remainder observed. |
| Timestamp types, UTC storage, no retained zone, offset ignored by timestamp | [Date/time types8.5](https://www.postgresql.org/docs/18/datatype-datetime.html) | Same-instant equality; two explicit zone displays; ignored-offset timestamp fields observed. |
| AT TIME ZONE, mixed timestamp comparison, calendar versus elapsed arithmetic | [Date/time functions9.9](https://www.postgresql.org/docs/18/functions-datetime.html) | Stockholm25h day and same-day23:00 endpoint observed. Date-boundary cast changes observed under controlled session zones. |
| Repeated/missing local times and engine resolution | [Invalid/ambiguous timestampsB.2](https://www.postgresql.org/docs/18/datetime-invalid-input.html) | Documented resolution, not claimed UI validation procedure. Two explicit offsets at Stockholm02:30 observed as distinct instants. |
| Text lengths and trailing spaces | [Character types8.3](https://www.postgresql.org/docs/18/datatype-character.html) | text versus char trailing-space comparison observed. |
| C byte order; deterministic/nondeterministic comparisons | [Collation23.2](https://www.postgresql.org/docs/18/collation.html) | C comparison inputs observed. ICU options documented only, not executed; no blanket claim that locale implies case insensitivity. |
| UUID representation, generation versus constraints | [UUID8.12](https://www.postgresql.org/docs/18/datatype-uuid.html), [Identity5.3](https://www.postgresql.org/docs/18/ddl-identity-columns.html), [Sequences9.17](https://www.postgresql.org/docs/18/functions-sequence.html) | Identity without uniqueness accepts manually repeated values. No concurrency schedule claimed observed. |
| UUID design, possession not authorisation | [RFC9562§6,§8](https://www.rfc-editor.org/rfc/rfc9562.html) | Primary standards text checked. |
| Structured SQL values, JSON syntax insufficient for business rules | [JSON8.14](https://www.postgresql.org/docs/18/datatype-json.html), [Value expressions4.2](https://www.postgresql.org/docs/18/sql-expressions.html) | Both good and business-invalid JSON examples accepted as JSONB. |
| Three-valued logic | [Logical operators9.1](https://www.postgresql.org/docs/18/functions-logical.html) | Full3×3 AND/OR plus NOT table observed. |
| Ordinary/null-safe comparison and missingness | [Comparisons9.2](https://www.postgresql.org/docs/18/functions-comparison.html) | NULL equality and IS NOT DISTINCT FROM observed; five filters compared to shared model. |
| WHERE keeps true only | [Table expressions7.2.2](https://www.postgresql.org/docs/18/queries-table-expressions.html#QUERIES-WHERE) | Every interactive filter’s predicate values and kept IDs independently queried. |
| IN/NOT IN with NULL list members | [Row/array comparisons9.25.1–2](https://www.postgresql.org/docs/18/functions-comparisons.html) | false OR unknown and a successful membership with NULL observed. |
| COALESCE fallback and common result type | [Conditional expressions9.18.2](https://www.postgresql.org/docs/18/functions-conditional.html) | Display-label versus numeric-zero outputs observed. |
| UNIQUE NULL defaults, NULLS NOT DISTINCT, CHECK accepts unknown, NOT NULL | [Constraints5.5](https://www.postgresql.org/docs/18/ddl-constraints.html) | Default accepts two NULLs, known duplicate rejected23505; strict null rule rejects secondNULL23505; CHECK accepts NULL/rejects0; NOT NULL rejectsNULL23502. |
| DISTINCT collapses NULLs; sort placement | [Select lists7.3.3](https://www.postgresql.org/docs/18/queries-select-lists.html#QUERIES-DISTINCT), [Sorting7.5](https://www.postgresql.org/docs/18/queries-order.html) | DISTINCT returns TEA-7 and oneNULL; explicit ascending NULLS LAST order=P3,P9,P7. |

Execution: owned in-memory PGlite0.5.8, actual version string PostgreSQL18.3, wasm32-unknown-emscripten. No inherited/default external database connection; connection is a freshly constructed local PGlite instance. Database locale C/C.UTF-8; initial zone recorded then overridden explicitly before relevant tests. Instance closed in finally on every completed verifier run. `verify-values.mjs` records exact SQL, outputs, expected failures and every displayed Sql block unchanged in `sql-results.json`.

No native PostgreSQL server, native initdb attempt, ICU collation run, concurrency execution, benchmark or timing claim. The three-stage filter is conceptual result reasoning, not an observed physical plan. No reader download is promised. Code and source hashes are in source-hashes.json.
