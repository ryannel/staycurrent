# Assembled editorial reread

15 October 2026. Read the continuous rendered text of all six revised articles
from the rebuilt preview on port 4330, with optional disclosures closed.
The main text, code, captions, tables and onward reading were read together.
The worksheet contents and native observations were examined separately in
the technical reviews. No independent fresh-reader notes were consulted.

This is a flow and explanation review, not a replacement for root's browser
layout and interaction checks. Captured temporary text lives outside the
repository in `/private/tmp/relational-depth-editorial/`.

## Independent reread: recovery, migration and isolation

**Accepted. No remaining material editorial finding.**

`backup-and-restore` now gives the recovery choices consequences that can be
followed through actual records. The logical restore and physical recovery
experiments are separated, and the later return to the logical drill is
explicit. The good request excluded by stopping before the destructive
transaction makes the reconciliation cost visible. The missing-WAL case
explains why verifying the base backup cannot establish recoverability to
every later point. The revised RPO paragraph uses known recovery points:
10:03 is two minutes behind 10:05, while 09:58 is seven minutes behind it.
A missing 10:04 purchase alone is correctly insufficient to locate the
recovery point. The previously identified ambiguity is resolved.

`schema-changes` preserves the application compatibility story while filling
the gap between a safe-looking batch and its concurrent execution. The bad
cached-value write gives the trigger requirement a concrete purpose; the two
correct interleavings then show why the repair works in either order. The
DDL queue follows the later ordinary reader, so the timeout has a visible
benefit beyond limiting the migration's own wait. The article now explicitly
pauses before COMMIT for the failed-transaction demonstration. The section
sequence still arrives naturally at validation and application cutover.
An optional small polish would call the later “Deploy B” application release
B, because A/B have also named database connections in the intervening
experiments. Its paragraph already makes the intended meaning recoverable;
this is not a blocker.

`isolation` remains understandable with its command scheduling disclosures
closed. Each practical result returns to the meaning of the snapshot or
retry boundary. The Serializable error is distinguished from a successful
decision returning zero rows; the retry retains the other committed change.
The unchanged control-row counterexample earns its space by changing the
isolation condition and deriving a different result, rather than adding
another warning. Existing diagrams and the schedule table provide enough
support without a new illustration.

## Author self-reread: access, comparison and a second system

These are self-reviews of my own changes. Independent technical review of
these articles is recorded by the foundations reviewer in
`choices-technical.md`.

**Accepted on self-reread. No further expansion needed.**

`access-control` moves from the role's allowed operation through a real denied
column and invisible tenant before introducing policy composition. The new
fixture and reset are explicit, avoiding an accidental continuation of the
earlier packed order. The OR/AND table explains all three orders, and the
restrictive-only result distinguishes restriction from permission. The
return to future-object grants and audit identity stays within the article's
existing purpose. The rendered table remains a teaching aid, not an extra
summary readers must reconcile against different row values.

`product-comparison` introduces the exact two-read schedule before the engine
results. The prose distinguishes view lifetime from reader/writer
interactions, then uses the SQLite failed write to show why a consistent read
does not promise a subsequent write. Observed PostgreSQL/SQLite results and
documented MySQL/SQL Server expectations remain visibly distinct. The next
section on input acceptance follows the same method of testing application
meaning. The new detail supports product choice without turning the page
into an engine catalogue or claiming an unperformed comparison benchmark.

`adding-another-system` introduces the obligation and duplicate-safe update
before tracing a complete delivery. That repetition is useful: the earlier
section derives the destination rule, while the new section attaches it to
the source transaction, worker and acknowledgement. The diagram labels
which stage commits where. The browser model's single database and deliberate
pauses are explicit. Equal-version success, absent response, a missing source
target and an older replay have distinct outcomes. The final rebuild section
then extends an already-understood copy contract instead of introducing
freshness and ordering for the first time.

The final paragraphs of all six articles return to concrete operational or
application decisions. No repeated conclusion, unearned capacity claim or
additional checklist is needed to make the repaired material feel complete.

## Final reader clarifications: independent check, 16 October

**Accepted; no further repair requested.** Read the four changed passages in
source and their full surrounding sections in the latest rendered preview on
port 4330. All four pages returned HTTP 200 and contained the final additions.
This review covers root's new paragraphs, including the comparison addition
to the article I had previously worked on; I did not author these additions.

- Schema validation now explains why `IS DISTINCT FROM` finds a missing copy
  while ordinary `<>` can leave it out of a WHERE result. Its treatment of
  one NULL, two NULLs and equal non-null values agrees with PostgreSQL 18's
  comparison reference. The existing following constraint section correctly
  separates equality of the two representations from requiring a value.
- Recovery validation explains the matching condition in `JOIN USING`, then
  follows a preserved receipt to its null-extended order fields and the
  missing/mismatched filter. It does not claim USING and ON produce identical
  `SELECT *` column layouts: the comparison concerns matching, and this query
  explicitly selects its fields. The explanation leads directly to req-b's
  expected €8 and missing recovered amount.
- Lifecycle replay distinguishes the DELETE target from the matching ledger.
  The displayed statements target notes first and customers second; neither
  targets the ledger. They remove any matching dependants, which is safe even
  though this fixture's restored snapshot restores only the profile and its
  old note remains absent. The following zero-row check and repeated replay
  retain their meaning.
- Product comparison now derives affinity from visible stored values rather
  than leaving the term undefined. The SQLite 3.54.0 observation file records
  12/integer and many/text in the ordinary table, 12/integer in the strict
  table, and datatype error 3091 for many. SQLite's affinity and STRICT
  references support both conversion and rejection. MySQL 8.4's SQL-mode
  reference explicitly gives the ordinary abc-to-integer example: non-strict
  mode stores 0 with a warning, while strict mode errors. The article labels
  this documentary example as unexecuted. The progression into PostgreSQL's
  numeric rounding example now sustains the same concrete input/output test.

Primary references checked: PostgreSQL 18
[comparison](https://www.postgresql.org/docs/18/functions-comparison.html),
[joins](https://www.postgresql.org/docs/18/queries-table-expressions.html#QUERIES-JOIN)
and [DELETE](https://www.postgresql.org/docs/18/sql-delete.html);
SQLite [affinity](https://www.sqlite.org/datatype3.html) and
[STRICT tables](https://www.sqlite.org/stricttables.html); MySQL 8.4
[SQL modes](https://dev.mysql.com/doc/refman/8.4/en/sql-mode.html).
These small bridges resolve local syntax and terminology gaps without
interrupting the articles' operational reasoning or broadening their scope.
