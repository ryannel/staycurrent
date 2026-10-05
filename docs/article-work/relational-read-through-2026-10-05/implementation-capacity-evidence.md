# Capacity import guard

Checked 5 October 2026 as an independent technical assignment. The proposed
shop design keeps capacity in `mug_details.capacity_ml`; JSON describes the
product. An incoming JSON payload can still carry capacity to the import step.
It must not become a second stored authority for that fact.

## Recommended expression

Use this expression where `payload` is the incoming `jsonb` value:

```sql
CASE
  WHEN jsonb_typeof(payload -> 'capacity_ml') = 'number' THEN
    CASE
      WHEN (payload ->> 'capacity_ml')::numeric BETWEEN 1 AND 2147483647
       AND (payload ->> 'capacity_ml')::numeric =
           trunc((payload ->> 'capacity_ml')::numeric)
      THEN ((payload ->> 'capacity_ml')::numeric)::integer
      ELSE NULL
    END
  ELSE NULL
END
```

The outer `CASE` excludes strings, missing keys and JSON null before casting
extracted text to `numeric`. Within that branch the numeric casts are safe:
`jsonb` already represents JSON numbers as PostgreSQL numeric values. The inner
`CASE` checks that the value is whole and lies from 1 through 2147483647 before
the integer cast. Its `AND` joins safe numeric comparisons; correctness does not
depend on which comparison runs first. The expression returns SQL `NULL` on
rejection. Insert that result into the existing `integer NOT NULL CHECK
(capacity_ml > 0)` column so that a rejected input fails rather than disappearing
from the import. A `SELECT` of the expression alone only identifies rejection.

Use `numeric`, rather than `double precision`, for the intermediate checks so
fractional digits do not disappear through floating-point rounding. `350.0`
and `3.5e2` are both whole numbers and are accepted. If a contract instead forbids
decimal or exponent spellings, that is a separate lexical rule; it is not a
whole-number rule, and `jsonb` does not preserve the original spelling.

## Evidence

- [PostgreSQL 18 JSON functions](https://www.postgresql.org/docs/18/functions-json.html):
  extraction returns SQL null for a missing field; `jsonb_typeof` distinguishes
  numbers, strings and the JSON null type.
- [PostgreSQL 18 JSON types](https://www.postgresql.org/docs/18/datatype-json.html#DATATYPE-JSON):
  JSON numbers map to `numeric`; `jsonb` rejects numbers outside that type's
  range. NaN and infinity are not permitted JSON numeric values. Numbers that
  cannot enter `jsonb` fail before the guard.
- [PostgreSQL 18 conditional expressions](https://www.postgresql.org/docs/18/functions-conditional.html#FUNCTIONS-CASE)
  and [expression evaluation](https://www.postgresql.org/docs/18/sql-expressions.html#SYNTAX-EXPRESS-EVAL):
  `CASE` controls which value-dependent branch is evaluated. Boolean predicate
  order is not a protection for an unsafe cast. Constant expressions and
  aggregates have additional evaluation rules; this guard uses the incoming
  row value and no aggregate.
- [PostgreSQL 18 mathematical functions](https://www.postgresql.org/docs/18/functions-math.html):
  `trunc(numeric)` removes the fractional part towards zero; equality with the
  original exact numeric value establishes that it is whole.
- [PostgreSQL 18 numeric types](https://www.postgresql.org/docs/18/datatype-numeric.html#DATATYPE-INT)
  establishes the integer range. [Constraint documentation](https://www.postgresql.org/docs/18/ddl-constraints.html#DDL-CONSTRAINTS-NOT-NULL)
  establishes rejection of SQL null. A positive `CHECK` alone would allow null.
- [PostgreSQL 18 numeric conversion source](https://github.com/postgres/postgres/blob/REL_18_STABLE/src/backend/utils/adt/numeric.c):
  `numeric_int4` converts through `numericvar_to_int32`, which calls
  `numericvar_to_int64`; that routine rounds to zero decimal places before its
  integer range check. The local probe independently observes this behaviour.

## Executed probe

Run from the repository root:

```sh
node docs/article-work/relational-read-through-2026-10-05/implementation-capacity-probe.mjs
```

The existing runtime is
`/private/tmp/staycurrent-design-sql/node_modules/@electric-sql/pglite/dist/index.js`.
`PGLITE_MODULE` can override that path. No project dependencies were installed or
changed. The recorded environment is PGlite 0.5.8, reporting PostgreSQL 18.3.

`implementation-capacity-probe.mjs` and `implementation-capacity-results.json`
preserve executable statements, inputs and observed outcomes. All 28 guard cases
and their corresponding insertions passed. Six whole-number cases were accepted;
22 rejected cases returned SQL null and failed insertion with SQLSTATE `23502`.
They include missing/null/string/fraction/zero/negative/out-of-range values,
incorrect JSON types, and a SQL null document. Boundary cases include the largest
integer, a fraction just above it, a large valid numeric value, and a fraction
with many decimal places.

The contrast probe observed `350.1::numeric::integer = 350`,
`350.5::numeric::integer = 351`, and `-350.5::numeric::integer = -351`.
Inserting the numeric value `350.5` directly into the typed column stored `351`.
The column guarantees a stored integer, but it does not by itself reject every
fractional numeric input before conversion. The guard supplies that import rule.
A direct zero failed the positive-value check with SQLSTATE `23514`.

This execution uses one in-memory connection. It establishes conversion and
constraint outcomes; it makes no claim about concurrent imports or performance.
