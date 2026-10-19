# a12 — sources and execution record

Checked 20 October 2026. Scope: relational-practice choices for snapshots,
committed changes, applicability, late corrections and lifecycle requirements.
No temporal-engine comparison or event-sourcing architecture is claimed.

## Primary sources

- [PostgreSQL 18 Range Types](https://www.postgresql.org/docs/18/rangetypes.html),
  especially inclusive/exclusive bounds, null constructor bounds, canonical date
  ranges and range exclusion constraints. Supports the `[start,end)` convention,
  unbounded effective end and non-overlap implementation in `rates.sql`.
- [PostgreSQL 18 Range Functions and Operators](https://www.postgresql.org/docs/18/functions-range.html):
  containment and overlap. The point and spanning-period results were also run.
- [PostgreSQL 18 Constraints](https://www.postgresql.org/docs/18/ddl-constraints.html):
  complete composite references, key targets, checks and deletion actions.
  The fixture's date checks, scoped version reference and referenced deletion
  were verified natively. `btree_gist` is installed only in the disposable DB.
- [PostgreSQL 18 Current Date/Time](https://www.postgresql.org/docs/18/functions-datetime.html#FUNCTIONS-DATETIME-CURRENT):
  `current_timestamp` denotes transaction start. The article does not claim a
  timestamp or sequence ID establishes a global commit order.
- [PostgreSQL 18 Partial Indexes](https://www.postgresql.org/docs/18/indexes-partial.html):
  active-set uniqueness is an explicit predicate, with detailed enforcement left
  to a10. The lifecycle fixture checks ordinary uniqueness after inactivity.
- [IBM Db2 Bitemporal Tables](https://www.ibm.com/docs/en/db2/11.1.0?topic=tables-bitemporal):
  application-period and system-period distinction and the bitemporal term.
  This is terminology/semantics evidence only; no Db2 instance was executed.
- [PostgreSQL 18 VACUUM](https://www.postgresql.org/docs/18/sql-vacuum.html),
  [Backup and Restore](https://www.postgresql.org/docs/18/backup.html), and
  [Privileges](https://www.postgresql.org/docs/18/ddl-priv.html): ordinary deletion
  is not immediate physical overwriting, copies have independent lifecycle, and
  authority to modify stored evidence is a separate control. No erasure procedure
  or jurisdictional retention rule is proposed.

The modelling choices and invented business requirements are the article's own
worked examples. No quoted source text is used.

## Native evidence

Successful run: database `rel3_a12_run2` on the orchestrator's disposable cluster,
127.0.0.1:57319, role `staycurrent`. PostgreSQL 18.6 Homebrew,
`server_version_num=180006`, aarch64-apple-darwin25.6.0, Apple clang 21.0.0,
64-bit. Session UTC; database collation/ctype C, libc provider. Observed settings:
`fsync=on`, `synchronous_commit=on`, `full_page_writes=on`, default isolation
`read committed`. The script explicitly sets UTC and changes no server settings.

`src/components/relational-next/a12/verify.sql` loads the parent a01 schema and
fixture, then this article's two rate representations. `native-results.txt`
retains the complete successful output, with whitespace normalised only.

Observed:

- No version on 31 October; version 1, €20 on 9 November; version 2, €22 on
  10 and 11 November. Spanning 9–12 November returns both versions.
- Effective 11 November, recorded cutoff 11 November 12:00 UTC: €20.
  Same effective date, cutoff at correction boundary 12 November 10:00 UTC: €22.
- Overlap rejected with 23P01; empty/reversed periods and infinite start rejected
  with 23514; conflicting effective-and-recorded assertion rejected with 23P01.
- Moving version 2's start to 12 November is accepted and leaves zero matches on
  10 November. Change rolled back: non-overlap does not imply coverage.
- Valid booking-rate reference accepted. Missing version, cross-tenant target
  (with matching numeric customer/booking identifiers) and wrong booking customer
  rejected with 23503.
- Referenced customer deletion rejected with 23001 (RESTRICT violation).
- Isolated nullable-code lifecycle shape: inactive profile still appears in an
  unfiltered count and still reserves its ordinary unique code (23505). Clearing
  that code permits a new identity to own it. This is not a migration of a01's
  required-code schema.

Initial inspection found `SHOW lc_collate` unavailable on this version; the final
script reads the database catalogue instead. An initial rejection expectation
used generic 23503 for RESTRICT; the final check uses the observed 23001. Neither
failure changed the shared server. Both article databases were removed after
retaining successful evidence; cleanup is recorded in writer.md.

Recording timestamps are supplied fixture values, not measured engine commit
times. No concurrent writer, physical erasure, backup restoration, retention
expiry or automatic temporal capture claim is inferred from these checks.

## Model evidence

Five deterministic models: agreement capture, committed status sequence,
effective boundary, late correction and lifecycle alternatives. `model-results.txt`
records 56 valid choice/step states and specific causal assertions. The models
are explicitly labelled; they execute no database. Figure source transcript
includes every alternative. Native SQL, figures and prose use the same rate
boundary and correction cutoffs.

## Root selected-account repair, 20 October 2026

At Figure 4’s final query step the effective-time card now displays the selected recorded account: the earlier assertion keeps €20 from 1 November onwards; the replacement shows the 10 November boundary and €22. The recorded card names the chosen cutoff and assertion. Results, SQL, native observations, prose and player are unchanged. Added expected-state assertions for both displayed accounts so the old answer cannot be paired with only the replacement periods.
