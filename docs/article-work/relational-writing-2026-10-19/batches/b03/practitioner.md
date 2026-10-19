# b03 — independent practitioner review

Reviewed 19 October 2026 using `staycurrent-review`, practitioner perspective.
a03 is a narrow recheck of b02's a03-P1; a04 is an initial full review against
the original relational-practice goal, its supplied family plans and the
available a00–a03 drafts. No other perspective's report, teaching-reference
articles or old relational corpus was read. No content, component, retained
evidence, commit or publication state was changed.

| ID | Practitioner verdict | Required repairs | Optional advice |
| --- | --- | --- | --- |
| a03 | Pass | None; a03-P1 resolved | None new |
| a04 | Pass | None | None |

## a03 — Making concurrent changes correct

**Pass, narrow repair recheck.** The revised worksheet now describes the complete
two-class reservation protocol: each transaction decrements its own class before
inserting the same request identity; A commits, and B rolls its entire transaction
back after the duplicate rejection. The verifier asserts both class invariants,
not just the unique request count. The source notes, separate raw repair output
and composite transcript explicitly distinguish the new narrow run from the
unchanged earlier suite.

Independently ran `verify.py --only-uniqueness` in a fresh native PostgreSQL 18.6
review database. Both attempts first saw the identity absent; both guarded
updates returned zero remaining; B waited on A's insert; A committed; B received
23505 and rolled back. Final invariant rows were:

```text
place_id | capacity | remaining | reserved | agrees
21       | 1        | 0         | 1        | true
22       | 1        | 1         | 0        | true
```

The review database was removed afterwards. This resolves a03-P1 without changing
the previously accepted concurrency argument. Figure hashes are unchanged from
b02; retain its unaffected correctness, depth, working-model and family-boundary
pass. No repeat full suite or figure review was needed.

## a04 — Building applications around a relational database

**Pass.** The article gives a useful ordinary application path, then identifies
where that path needs a stronger contract. It separates database state from what
the application and user know; parameterisation from authorisation; statement
results from commit; and durable work intent from a completed external effect.
Those distinctions are concrete enough to guide implementation and diagnosis.

The pinned driver example exposes the actual representation boundary rather
than treating SQL types as automatically safe application values. It preserves
large integer and exact numeric text, demonstrates precision already lost before
binding, distinguishes calendar/wall-clock/instant meanings and identifies Date's
millisecond limit. The malicious-shaped bound value remains data. The fixed
sort-fragment allowlist correctly handles the separate identifier problem.

The checked-out-client lifetime is correct for node-postgres transactions. The
cleanup function is explicitly an application contract rather than an invented
driver method; it preserves the original failure, requires pending work to
settle, and defaults to discarding a connection whose state cannot be established.
Neither rollback nor pool disposal is presented as evidence of an uncertain
commit's outcome. Pool pressure is explained in terms of leased connection time,
including idle time during external work, with acquisition and statement timings
separated.

The authorisation section uses context-derived tenant identity and scoped reads
and writes. Its row-security caveats include table-owner and privileged-role
bypasses and testing through the actual application role. The N+1 comparison
states its serial round-trip and row-count assumptions; it does not imply that
one join is always cheaper or that a parent limit bounds joined children. The
ORM identity-map and default-autoflush examples name their framework boundary.

Known abort, business refusal and unknown outcome lead to different actions.
Stable operation identity, tenant scope, request equivalence and an atomic
outcome record are correctly connected; an absent lookup is not assumed decisive
while another transaction may still commit. The job/outbox section retains
receiver deduplication, lookup or reconciliation after an external effect whose
completion was not recorded. It does not claim atomicity with an external service.

### Independent evidence and primary sources

Read the complete snapshot, own plan, a20–a23 briefs/scopes, available family
drafts, source record, writer report, all five scene definitions, player and native
verifier. Confirmed the installed `pg` package is 8.23.1 rather than relying only
on the report's printed version.

Independently ran the owned verifier using Node 24.16.0, pg 8.23.1 and native
PostgreSQL 18.6 in a fresh review database, with the child process explicitly set
to `Europe/Stockholm` and the database at UTC. Assertions passed for:

- Exact bigint `9007199254740993` and numeric `123456789012345678.90` text;
  Number conversion instead round-tripped `9007199254740992`.
- SQL NULL, undefined-to-NULL binding, and the bound SQL-shaped label.
- Local-zone DATE/TIMESTAMP decoding, the matching instant, Date millisecond
  truncation, and the separately read six-digit database fractional seconds.
- Cross-tenant lookup returning no row, a rolled-back order remaining absent,
  a second acquisition timing out while the sole client was held, and successful
  reuse after release.

Removed only that fresh database afterwards. The native run checks the limited
driver path the article actually claims; it is not an HTTP fault-injection,
provider or ORM integration test. The article's acceptance matrix correctly asks
for those additional real-path tests without claiming they have already run.

Checked the relevant contracts against official node-postgres documentation for
[binding and identifier limits](https://node-postgres.com/features/queries),
[type conversion](https://node-postgres.com/features/types),
[transaction client affinity](https://node-postgres.com/features/transactions)
and [pool release/disposal](https://node-postgres.com/apis/pool); PostgreSQL 18
[row security](https://www.postgresql.org/docs/18/ddl-rowsecurity.html) and
[cancellation semantics](https://www.postgresql.org/docs/18/libpq-cancel.html);
and SQLAlchemy's [autoflush contract](https://docs.sqlalchemy.org/en/20/orm/session_basics.html#flushing).
These support the scoped claims made in the article.

In my own Chrome tab on fixed built preview 4437, stepped each of the five models
through its full path and switched both choices at the final step. The outcomes
agree with the scene sources and stated contracts: committed order with or
without user confirmation; exact or already-rounded identifier; released or held
pool slot; the same missing commit reply with different settled database states;
and missing fulfilment versus a discoverable job whose external effect may need
reconciliation. The figures remain explicitly illustrative, not elapsed-time or
native-fault traces.

### Depth and family boundaries

The parent orientation's Mina/order example now has an application owner, and
a03 retains the underlying transaction/invariant proof. a04 provides enough
connection ownership, value conversion, authorisation and outcome reasoning to
implement and review an ordinary request before following a deeper link. a20
retains resource/cancellation/stream mechanics; a21 retains detailed ORM loading
and unit-of-work behaviour; a22 retains request-identity implementation and retry
protocols; a23 retains worker/outbox delivery mechanics. Data representation detail
and operational policy are signposted without expanding the commission into the
parked distributed-systems programme. No extra branch or consolidation is needed
for this article's practitioner goal.

## Review scope and handoff

Both snapshots match their rendered article sources, and every owned file hash
matches the b03 manifest. Browser inspection used the fixed 4437 build. The
centrally reported full build/audit was not rerun. Presentation, keyboard, pacing
and mobile assessment remain with the independent teaching perspective. Both
articles pass this practitioner gate; no further repair recheck is requested.
