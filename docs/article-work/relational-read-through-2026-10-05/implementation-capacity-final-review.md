# Capacity and JSON write review

Reviewed the revised `tables-and-documents.astro` and new `JsonStaleWrite.astro`
on 5 October 2026. No source edits were made in this review. The reviewed file
hashes are recorded in `implementation-capacity-source-results.json`.

**Verdict: ready as a draft for this technical scope.** No material correction
is required in the capacity route or the stale-object schedule. This conclusion
does not cover the rest of the collection or authorise publication.

## What the source execution established

`implementation-capacity-source-verify.mjs` extracts the actual SQL constants
from the Astro source. The recorded output includes those statements and the
four-table practice schema verbatim. The reviewer did not substitute a revised
guard for the article's guard.

- The earlier `relatedRows` representation runs on the four-table setup. The
  article now tells readers to restart before choosing the JSON route, so its
  later `CREATE TABLE mug_details` does not collide with that alternative.
- `addJson`, `valuesQuery`, `jsonQuery`, `typeCheck`, `moveCapacity`,
  `hybridQuery`, `indexes` and `updateJson` run in the stated sequence. The
  migration puts 350 in P7's details row and leaves only material in its JSON.
  The hybrid filter returns P7, Blue mug, 350; both indexes are created. The
  later material update leaves typed capacity at 350.
- Nineteen inputs exercise the migration's copied guard. Five whole-number
  cases succeed: ordinary and decimal 350, exponent notation, and the lower
  and upper boundaries. Fourteen cases fail on target `NOT NULL` with SQLSTATE
  `23502`: missing/null/string values, fractions, zero, negative and oversized
  values, and incorrect JSON types. After explicit `ROLLBACK`, every failed
  case retains its complete original JSON object, and `mug_details` does not
  exist because its creation was also rolled back.
- A separate pass installs the article's optional number-type check and tries
  all nineteen inputs. It allows absence and JSON numbers, including invalid
  capacities such as fractions or overflow, while rejecting present non-numbers
  with `23514`. The copied earlier JSON query rejects `350.5` extracted as text
  with `22P02`. This supports the distinction the article makes between the
  intermediate type check and the finished import rule.

The migration guard handles strings and JSON null even if the optional earlier
type check was not installed. Testing those branches required that optional
check to be omitted: installing it would reject those values before they could
reach migration. The complete ordinary route was tested with the check installed.

The guard protects both conversions with `CASE`: only JSON numbers reach the
numeric cast, and only whole positive values within the chosen range reach the
integer cast. The inner `AND` joins expressions that are safe within the outer
number branch. It does not depend on predicate order to protect an unsafe cast.
The source correctly describes stored integers separately from input validation;
the preceding `implementation-capacity-probe.mjs` demonstrates why PostgreSQL's
numeric-to-integer rounding makes that distinction necessary.

## Stale-object illustration

The illustration identifies itself as a separate starting object, rather than
silently adding a finish entry to the article's runnable catalogue. Both early
reads return material ceramic and finish gloss. A then commits finish matte.
B's later replacement with its saved object commits material stoneware and finish
gloss. Using the actual article's `updateJson` expression for B instead commits
material stoneware and finish matte. Both outcomes were executed and recorded.

These are sequential schedules at Read Committed in one PGlite connection. They
demonstrate the submitted old value overwriting a committed change and the
current expression preserving the untouched key. They do not reproduce competing
PostgreSQL sessions, a blocking row lock, or a lock wait. The component explicitly
says there is no overlapping write, which keeps that boundary visible.
[PostgreSQL's JSON documentation](https://www.postgresql.org/docs/18/datatype-json.html#JSON-DESIGN)
supports the separate row-lock claim: changing a JSON value locks the containing
row.

## Coherence and limits

The example now reaches a concrete final arrangement. The alternatives locate
the same capacity fact in different places; the runnable route first exposes
the limits of permissive JSON, then validates and moves the fact. The subsequent
filter, index and update all use that final arrangement. Schema evolution calls
the earlier conversion a completed migration, and uses finish for a later key
rename. The final design names the authoritative typed capacity and its input
policy, rather than leaving the earlier cast as its ordinary query path.

One authority is a design and writer convention here. The schema does not forbid
an application from later adding a new numeric `capacity_ml` JSON key, and it
does not prove that every mug has a details row. The article explicitly limits
the latter promise and tells future writers to use the input policy. Neither
limit undermines the known-P7 migration it teaches. A production migration over
an actively written catalogue would need its own coordination plan; this article
does not claim to supply one.

Re-run with:

```sh
node docs/article-work/relational-read-through-2026-10-05/implementation-capacity-source-verify.mjs
```

Environment: the existing runtime at
`/private/tmp/staycurrent-design-sql/node_modules/@electric-sql/pglite/dist/index.js`,
PGlite 0.5.8 reporting PostgreSQL 18.3. No dependencies were changed. Index
declarations were executed, without a performance or index-selection claim.
