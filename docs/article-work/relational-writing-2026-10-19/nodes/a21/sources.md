# a21 sources and observed evidence

Checked 20 October 2026. Read AGENTS.md, README.md, current site direction,
commission/runtime, complete a21 context and actual a04 parent. Read the three
fixed reference articles in full including figure specifications and inspected
the shared sequence/index/storage player implementations for their teaching and
control conventions. No historical skills were loaded.

## Primary sources

| Claim or decision | Source and check |
| --- | --- |
| Lazy relationship access, identity reuse, eager shapes, joined uniqueness, limited parent wrapping, 500-key select-IN batches, raiseload limits | [SQLAlchemy 2.0 relationship loading](https://docs.sqlalchemy.org/en/20/orm/queryguide/relationships.html); native pinned-version checks below |
| Autoflush, autobegin, commit versus flush, rollback expiration | [Session basics](https://docs.sqlalchemy.org/en/20/orm/session_basics.html); native writer/observer comparison and no-autoflush run |
| Clean entity weak references, externally retained lists, expiration | [State management](https://docs.sqlalchemy.org/en/20/orm/session_state_management.html); sampled identity-map results in stream runs, raw-update expiry check |
| yield_per, partitions, unique/collection eager incompatibility, loader criteria and aliases | [ORM querying API](https://docs.sqlalchemy.org/en/20/orm/queryguide/api.html) |
| Server-side cursor support and buffering | [PostgreSQL pg8000 dialect](https://docs.sqlalchemy.org/en/20/dialects/postgresql.html#pg8000), [Core connection streaming](https://docs.sqlalchemy.org/en/20/core/connections.html#using-server-side-cursors-a-k-a-stream-results); native protocol DECLARE/FETCH evidence |
| Configured optimistic version predicate and stale flush rejection | [Version counters](https://docs.sqlalchemy.org/en/20/orm/versioning.html); native two-Session assertion |
| Synchronisation is API-specific; raw paths can leave loaded state stale | [ORM data changes](https://docs.sqlalchemy.org/en/20/orm/queryguide/dml.html), [state management](https://docs.sqlalchemy.org/en/20/orm/session_state_management.html); native raw update/expire check |
| Execution hooks observe cursor operations, separately from transaction events | [Core events](https://docs.sqlalchemy.org/en/20/core/events.html); worksheet hooks retained |
| Driver protocol waits differ from SQL statement counts; parameter protocol limit | [pg8000 1.31.5 versioned package](https://pypi.org/project/pg8000/1.31.5/), its protocol theory and parameter-limit sections; installed core.py execute_simple/execute_unnamed/handle_messages source inspected before removal |
| Parameter limit 65,535 | [PostgreSQL 18 limits](https://www.postgresql.org/docs/18/limits.html); documented, not maximum-sized native execution |
| Several selects at Read Committed need not share a snapshot | [PostgreSQL 18 transaction isolation](https://www.postgresql.org/docs/18/transaction-iso.html); reused the owning isolation article rather than adding another derivation |

The 2.0 online manual identifies itself as 2.0.55 on this check date. We pin
2.0.44 for repeatable observations; the article states that distinction. This is
an illustrative library selection, not a current-version recommendation.

## Native runs

See `evidence/README.md`, `requirements.txt`, `verify.py` and
`native-results.json`. Final run: rel3_a21_run6, Python 3.14.5, SQLAlchemy 2.0.44,
pg8000 1.31.5, PostgreSQL 18.6 Homebrew. No session setting overrides. All article
sessions closed, every own database dropped, temporary venv removed. No shared
server change, shared JavaScript dependency change or concurrent fixture access.

Important observed outcomes:

- Fresh lazy one/three/six-order paths: 3/6/10 selects. Re-reading loaded
  relationships added no selects. Shared customer reuse reduces the naive
  per-parent customer count but does not remove collection N+1.
- Projection, joined entities and select-IN produced identical ordered response
  values for three orders. Returned rows 6/6/10; retained tracked entities
  0/10/10, with result mappings and response objects accounted for separately.
- Two joined collections returned 17 SQL rows for three orders while reconstructing
  the correct five items and six parcels. The isolated 3×4 and 12×4 model expands
  one order, and labels it as a model.
- Explicit joined LIMIT 3 returned only parents 101 and 102. joinedload after a
  limited parent select generated a subquery wrapper and preserved all three.
- Empty page returned no parents; itemless order retained an empty collection;
  six-parent bounded load included the twelve-item order within three selects.
- 501-parent select-IN loader split item keys 500+1; protocol maximum not tested.
- Default autoflush sent UPDATE before ORM SELECT on the owning backend; separate
  observer retained paid status; rollback discarded update. no_autoflush delayed
  that write. Configured version conflict raised StaleDataError. Raw UPDATE left
  a loaded object stale until expiry/reload.
- Scoped customer read/count/child/mutation denied tenant 8 order 800; mixed
  identifiers returned only authorised order 101's items.
- Export consumed 1,200 rows using DECLARE/FETCH/CLOSE. With chunks released, 100
  entities remained at sampled boundaries; retaining chunks ended with 1,200.
  This does not measure total or peak process memory.
- Six lazy SELECTs used 22 protocol ready-response waits including begin and
  rollback; one joined SELECT used 7. These are pinned driver synchronisation
  observations, not packet counts, latency, or general ORM/network equivalence.

## Verification and boundaries

Astro compiler 2.13.1 transformed the owned article/component with no diagnostics;
the extracted component script transpiled with TypeScript 5.9.3 without diagnostics
(`evidence/compile.json`). `node src/components/relational-next/a21/verify.mjs`
passed 42 illustrative model states and native result invariants. The response
listing matches the native response JSON. Prescribed heading anchors and every
relational registry path/anchor were checked. Own-file whitespace check passed.

Root owns the shared build, exact site integration and independent browser
reviews. No full build or immutable review snapshot was changed by this worker.
The final rendered phone/theme/control checks remain a central review task;
this worker does not claim those checks have run.
