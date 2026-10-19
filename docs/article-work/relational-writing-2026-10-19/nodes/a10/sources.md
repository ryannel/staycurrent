# a10 source and execution record

Checked 19–20 October 2026. The article uses the actual a01 parent and its class
booking policy; room reservations are a distinct extension. The a09, a11 and a12
plans, transaction branch and live-change ownership inform the scope boundaries.
All three fixed reference articles were read in full, including the figure
components used in their explanations.

## Primary documentation

- PostgreSQL 18 [Constraints](https://www.postgresql.org/docs/18/ddl-constraints.html):
  named row checks, required values, full composite references, reference actions,
  cross-row CHECK limitation and exclusion semantics.
- [Unique indexes](https://www.postgresql.org/docs/18/indexes-unique.html): ordinary
  NULL-distinct behaviour and NULLS NOT DISTINCT. The article tests both instead
  of generalising a NULL policy to every engine.
- [Partial indexes](https://www.postgresql.org/docs/18/indexes-partial.html): a
  unique index over only the current rows. The predicate is stored state, not now().
- [CREATE TABLE](https://www.postgresql.org/docs/18/sql-createtable.html): eligible
  foreign-key targets, MATCH SIMPLE/FULL and unimplemented MATCH PARTIAL,
  deferrability, immediate uniqueness, reference actions, selective SET NULL,
  PostgreSQL 18 WITHOUT OVERLAPS.
- [SET CONSTRAINTS](https://www.postgresql.org/docs/18/sql-set-constraints.html):
  transaction-local timing and retroactive checking when changed to IMMEDIATE.
- [Range types](https://www.postgresql.org/docs/18/rangetypes.html): half-open
  timestamp ranges, adjacency, overlap and exclusion.
- [btree_gist](https://www.postgresql.org/docs/18/btree-gist.html): integer equality
  operator classes in a GiST exclusion constraint.
- [Date/time functions](https://www.postgresql.org/docs/18/functions-datetime.html):
  isfinite(timestamp) validation of the interval bounds.

## Native evidence

Runtime: native PostgreSQL 18.6 (Homebrew), aarch64, server_version_num 180006,
127.0.0.1:57319, role staycurrent. Database rel3_a10_run3, C locale, UTF8, UTC.
No server configuration or session settings changed. Earlier run1 and run2 were
discarded after correcting expected SQLSTATE codes: RESTRICT reports 23001 for
the tested referenced-key update and referenced deletion. This is not 23503.
Only the article's own fresh databases were used and all were removed on handoff.

The owned component directory retains schema.sql, fixture.sql, current.sql,
overlap.sql, lead.sql, experiment.sql, supplement.sql and matrix.sql. Run the
experiment first, then supplement and matrix in the same fresh disposable database.
experiment.sql uses relative psql includes. The failure helper checks exact
SQLSTATE and aborts on unexpected success or a different failure. supplement.sql
deliberately permits one expected COMMIT error, then asserts that the invalid row
did not survive. Native output is in native-results.txt beside this record.

Cases cover:

- Required state and endpoints, permitted state, equal/reversed/missing/infinite
  interval bounds; default state when omitted.
- A new generated row ID still failing the business key; same external reference
  accepted for another tenant; ordinary nullable uniqueness versus NULLS NOT DISTINCT.
- Wrong-tenant room on insertion/update, absent customer, parent key update and
  deletion; MATCH SIMPLE partial null accepted versus MATCH FULL rejected, with
  an all-null and a valid full pair accepted.
- Cancelled duplicate accepted; reactivation and current-reference edit rejected;
  cancellation then replacement accepted inside a rolled-back test transaction;
  partial index rejected as a foreign-key target; missing current reference rejected.
- Adjacent confirmed interval accepted, another room accepted, draft overlap
  accepted, overlapping insert/confirmation/room change/bound change rejected;
  cancellation releasing occupied time; PostgreSQL 18 temporal-key adjacency and
  overlap checks as a capability cross-check.
- Required lead cycle accepted with the participant inserted; wrong-reservation
  lead, omitted target at forced check and actual COMMIT rejected; immediate first
  insert rejected; invalid final transaction leaves no reservation stored.
- A customer cascade traversing two reservations and both notes; deferred
  NO ACTION allowing delete-and-restore of a parent key; selective SET NULL
  preserving the tenant column.

These are sequential stored-state observations, not a concurrency or performance
experiment. The article hands the acceptable outcomes of competing writes to the
transactions branch. Figures are deterministic explanatory models, not SQL clients
or recorded engine schedules.

## Root teaching repair, 20 October 2026

Shared playback now counts the visible board (cards, gates, interval labels and result) plus narration at 180 words/minute, with three seconds for inspection and a six-second minimum. Hidden interval labels are excluded by innerText. Native SQL, models, prose and manual controls are unchanged.
