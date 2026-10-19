# Practitioner review — b21

## a21 — Controlling the queries your application performs

**Verdict: PASS.** No required repairs or optional changes requested.

Reviewed the complete article snapshot, supplied context and family plans, actual a04 parent and relevant a20 sibling, five models, player implementation, model verifier, native worksheet and full retained results, source ledger and writer handoff. The article develops the parent's useful initial abstraction comparison into an accountable response contract. It gives enough practical detail to choose and verify loading, batching, paging and materialisation without becoming an ORM reference. SQL result semantics and pagination, physical execution tuning, connection cleanup and request recovery stay with their owners. Reapplying binding and authority through loaders, counts and changes is necessary rather than a duplicate security curriculum.

### Independent native verification

Installed the exact retained requirements into an isolated temporary reviewer environment and ran the inspected worksheet against fresh database `rel3_prac_a21_1792459001` on PostgreSQL 18.6, Python 3.14.5, SQLAlchemy 2.0.44 and pg8000 1.31.5. Only the temporary worksheet's accepted database-name prefix was changed. All twenty cases passed, and a separate comparison established agreement with the retained statement/wait/row counts and semantic results. Own full output: `/private/tmp/rel3-prac-a21-results.json`.

Consequential results independently reproduced:

- Fresh lazy one/three/six-order responses issued 3/6/10 selects. Warm serialisation added none; shared customer reuse did not remove the empty collection read.
- Projection, joined load and select-IN produced the same ordered response, including order 102's empty items. Row counts were 6/6/10; retained tracked entities 0/10/10. The projection's zero tracking count is correctly distinguished from response allocation.
- Two independent joined collections returned seventeen rows for the three-order page while reconstructing correct collections. A limit after the explicit item join returned only 101 and 102; the limited parent select under joinedload was wrapped before eager joins. The 501-parent load split item keys 500+1.
- Autoflush sent UPDATE before the apparent ORM read; the writer saw its uncommitted change while an independent connection saw `paid`. Rollback removed the change. Delaying autoflush did not turn the operation into a read-only contract. Configured version checking rejected the stale writer; raw SQL left the loaded object stale until expiry.
- Customer-scoped read, count, child load and mutation denied order 800 from tenant 8. Mixed identifiers exposed only authorised order 101's items.
- Streaming issued DECLARE, bounded FETCH operations and CLOSE, consumed 1,200 rows and retained 100 tracked entities at sampled boundaries versus 1,200 when chunks stayed reachable. Initial rowcount stayed unknown; samples are not peak-memory measurements.

Inspected the installed pinned pg8000 `execute_unnamed`, `execute_simple` and `handle_messages` paths and SQLAlchemy's pg8000 server-side cursor adapter and 500-key loader constant. The three-stage bound-statement path and ReadyForQuery loop support the worksheet's explicit synchronisation-wait measure. The lazy response reproduced 22 such waits and the joined response 7, including transaction completion. These are neither packets nor a universal statement-to-round-trip conversion. Cursor fetches are retained separately from ORM cursor-execution events; the article makes that instrumentation boundary explicit. The explanatory flush model isolates the writer's action rather than including the native observer probes in its counters.

The worksheet closed its sessions and dropped the reviewer database in `finally`; exit was successful. Removed the temporary dependency environment after inspection. No shared settings, dependencies or retained evidence were changed.

### Primary claims and rendered models

Checked consequential library guarantees against SQLAlchemy's [relationship loading](https://docs.sqlalchemy.org/en/20/orm/queryguide/relationships.html), [query API](https://docs.sqlalchemy.org/en/20/orm/queryguide/api.html), [Session basics](https://docs.sqlalchemy.org/en/20/orm/session_basics.html), [version counters](https://docs.sqlalchemy.org/en/20/orm/versioning.html) and [pg8000 dialect](https://docs.sqlalchemy.org/en/20/dialects/postgresql.html#pg8000), plus the [versioned pg8000 package](https://pypi.org/project/pg8000/1.31.5/) and [PostgreSQL limits](https://www.postgresql.org/docs/18/limits.html). The claims about joined uniqueness and parent wrapping, raiseload's flush exception, commit flushing despite no_autoflush, streaming restrictions and parameter limits are properly qualified. The tested release is distinguished from the later online maintenance manual. The Read Committed visibility warning agrees with the independently reviewed isolation owner; a loading strategy does not silently promise one snapshot.

The owned verifier passed all 42 model states and its native invariants. Exercised all 42 states across every comparison and both multiplication sizes in the immutable 4439 browser preview. Counts, displayed rows, object reconstruction and narration agreed throughout. Also changed item count while remaining on reconstruction: 12 rows/8 entities changed to 48 rows/17 entities, and the complete transcript updated consistently. Visually inspected the generated 48-chip state. The one-order multiplication model and shortened three-chunk export are labelled illustrations rather than substituted native observations. Page limits remain separate from child and response-size bounds.

The native evidence is appropriately bounded to Python integration and response construction, not HTTP delivery, production authorisation or a memory benchmark. Those exclusions are explicit and leave the article's practical operation contract intact. Snapshot bytes and all three manifest component hashes remained unchanged. Browser review is complete and the preview is released.
