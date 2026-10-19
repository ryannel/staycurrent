# RL119 index lifecycle supplement

19 October 2026. New bounded commission after the first PostgreSQL branch handoff.
The article remains drafting. Independent review and whole-collection rendering
belong to the coordinator.

## Files and reproduction

- Article: `src/drafts/relational/rl119.md`.
- Ability account and reconciliation: `briefs/rl119.md`, appended lifecycle sections.
- Runner: `evidence/rl119-lifecycle.py`.
- Final native transcript: `evidence/rl119-lifecycle-observed.json`.

Run `python3 rl119-lifecycle.py` from the evidence directory. The script needs
Python 3's standard library and PostgreSQL 18.6 under `/opt/homebrew/bin`. It
checks the server version, initialises one unique
`/private/tmp/staycurrent-rl119-lifecycle-*` cluster and uses port 56919 with an
owned Unix socket directory. It never issues default-service commands.

Both complete executions passed. The final captured execution uses PostgreSQL
18.6 (Homebrew) on the same Apple-silicon macOS host as the original branch labs.
Every intentional SQL rejection must return a nonzero psql status. The transcript
records commands, literal SQL, replies, errors, plans, physical statistics, usage
snapshots, activity samples and the server log. The second run adds visibility
and failed-rebuild variations. Its final directory was
`/private/tmp/staycurrent-rl119-lifecycle-hqehfqks`; pg_ctl stopped the server
successfully and the script removed the directory.

The runner stops only its owned directory in `finally`. A failed run or failed
shutdown retains the directory and records success=false, preserving diagnosis
and preventing deletion of a still-running server's data. The final transcript's
shutdown returned zero. No earlier canonical branch evidence was edited.

## Fixture and expected facts

`lifecycle_orders` has tenant/id primary identity, tenant/request uniqueness and
a tenant/customer foreign key. The generated t4 workload has 250,000 rows over
1,009 customers; another tenant supplies a row with the same local identifiers.
The retained order t4/81/r81/customer42 has price 20.00 and status paid. Its t5
counterpart has price 90.00. These accepted historical facts must not change.

The history index is `(tenant,customer,placed_at DESC,id DESC) INCLUDE(price)`.
The short customer index is `(tenant,customer)`. A large note-pattern index has no
search duty in the defined application. A separate increasing-ID table demonstrates
emptied-page reuse. Autovacuum is disabled on the experimental tables so manual
maintenance establishes the recorded schedule.

## Observed results

### Sparse index and equivalent baseline

Deleting t4 IDs not divisible by ten, except preserving 81, leaves 25,002 total
rows. Vacuum removes dead entries. Physical inspection shows:

| State | Bytes | Leaf pages | Density | Deleted pages |
| --- | ---: | ---: | ---: | ---: |
| Full-load history index | 12,427,264 | 1,507 | 89.88% | 0 |
| Survivors after vacuum | 12,427,264 | 1,507 | 9.30% | 0 |
| Identical index on fresh survivor copy | 1,253,376 | 151 | 89.71% | 0 |
| Concurrently rebuilt history index | 1,261,568 | 152 | 89.47% | 0 |

The untouched baseline and concurrently maintained rebuilt index need not have
identical bytes: writers make versions while the new structure is maintained.

### Empty page reuse

The increasing-ID primary key initially occupied 5,627,904 bytes, with 683 leaves
at 90.05% density. Removing the oldest 225,000 left 69 leaves at 89.13% and 615
deleted pages, with the same file size. After a finished transaction advances the
boundary and another vacuum pass, inserting 225,000 later IDs produces 5,636,096
bytes: one extra 8 KiB page, rather than another full index-sized allocation.

This demonstrates actual reuse after the relevant boundary advances. It does not
promise that every first vacuum makes every emptied page immediately reusable.

### Concurrent rebuild and checks

`REINDEX INDEX CONCURRENTLY lifecycle_history` completed with both validity flags
true. The operator sampled native progress phases including `waiting for old
snapshots`. While the operation was active, a separate ordinary caller made 100
note updates and committed 100 progress records. The old Repeatable Read reader
then completed and the rebuild finished. Activity and progress samples are retained.

The rebuild interval generated 1,352,336 WAL bytes, including caller work and its
progress records. This is deliberately not labelled an exact REINDEX attribution.
The rebuild session used maintenance_work_mem=1MB and zero parallel maintenance
workers. The log records sort temporary files. No physical replica ran in this
supplement; replica/WAL budget teaching is a documented responsibility, not a
measured replay capacity.

The range request still returns 5,048.50 over 247 rows and uses lifecycle_history.
Its recorded execution accesses changed from 19 shared buffers/zero heap fetches
to eight/100 immediately after the rebuild. A following vacuum produced seven/one.
The changed visibility is disclosed; these are not isolated device reads or a
storage latency benchmark. The ten newest customer records remain byte-for-byte
identical in the parsed results. `bt_index_check(...,heapallindexed=>true)` returns
without error. That is a selected consistency check, not proof of all invariants
or all possible corruption.

### Failed-copy recovery and restrictions

With an old snapshot retained, `SET statement_timeout='700ms'; REINDEX INDEX
CONCURRENTLY lifecycle_history` fails. The original is valid/ready; its new
`lifecycle_history_ccnew` copy is invalid/ready. Once the old reader ends, dropping
only that invalid copy concurrently succeeds. The original remains valid/ready.

`BEGIN; REINDEX INDEX CONCURRENTLY lifecycle_history` is explicitly rejected as
unsupported within a transaction block. The article's exclusion-index, system
catalog and other restrictions come from the pinned PostgreSQL 18 documentation.
No exclusion-index concurrent rebuild was run here.

### Removal, identity and acceptance

The native experiment builds `lifecycle_replacement` concurrently with the same
ordered keys and INCLUDE(price,status). The defined newest-order request uses
its Index Only Scan, returning ten rows with zero heap fetches after maintenance.
It occupies 1,482,752 bytes.

The isolated fixture deliberately resets its own statistics, captures stats_reset
and exercises five requests plus EXPLAIN ANALYZE. The replacement records six
scans. The note, short-customer, primary and unique-request indexes all record
zero during this small interval. The database reset marker is unchanged at the
end. This proves only this bounded workload; it is not a production representative
window or a test of every reset/recreate event. The article additionally directs
operators to retain index OIDs and account for per-index resets and replacement.

An attempted concurrent primary-key index drop is denied because its constraint
requires it. The note index is then dropped concurrently while ordinary callers
make and commit another 100 updates/progress records. The short customer index
also drops concurrently after its replacement's prefix and foreign-key duty are
checked. The price-only history index remains; the narrow interval does not prove
its cheaper queries dispensable.

After removal, the ordered request still returns exactly the earlier ten records.
An equivalent customer-existence lookup uses lifecycle_replacement. A referenced
customer deletion is denied by the foreign key. A duplicate request and duplicate
order are each denied by their original constraints. The t4 and t5 order81 facts
remain 20.00 and 90.00 respectively. Index definitions and catalogue/constraint
observations are retained in the transcript for reconstruction and review.

## Claim boundaries

- One isolated server, local storage, modest generated data and bounded traffic.
  No production-load, replica replay, failover or archive capacity test ran.
- Continued caller progress was sampled during the actual rebuild and drop. It
  does not prove unchanged latency or that concurrent DDL never waits/blocks.
- The scripted usage interval is seconds and intentionally covers only its named
  requests. Rare jobs, real replicas, per-index resets and missed callers need the
  longer representative observation taught in the article.
- No actual damaged index or changed collation was introduced. amcheck returned
  without error on the sound rebuilt structure. Collation/operator distinctions
  are definition-comparison obligations.
- `_ccnew` timeout cleanup was executed. `_ccold` recovery is documented, not
  manufactured as another native result.
- The existing DeletedFigure is an explicitly separate 36-order model. Its numbers
  are not presented as these native measurements.
- No whole-site build or rendered light/dark/phone review was run by this author.
  No other article, shared code, live page, coverage map or old canonical evidence
  was edited. No commit, push or publication was made.

## Sources checked

Primary PostgreSQL 18 documentation was read on 19 October 2026:

- https://www.postgresql.org/docs/18/sql-reindex.html — concurrent phases, locks,
  failure remnants, supported targets and transaction restrictions.
- https://www.postgresql.org/docs/18/routine-reindex.html — partly filled pages
  versus emptied-page reuse and the circumstances for rebuilding.
- https://www.postgresql.org/docs/18/pgstattuple.html — physical fields, scanning
  cost, privileges and page-by-page observation.
- https://www.postgresql.org/docs/18/amcheck.html — check coverage, lock and standby
  distinctions, and limits of a passing check.
- https://www.postgresql.org/docs/18/sql-dropindex.html — concurrent drop rules and
  dependency limitations.
- https://www.postgresql.org/docs/18/monitoring-stats.html — scan counters, resets
  and collection boundaries.
- https://www.postgresql.org/docs/18/progress-reporting.html — rebuild phase view.
- https://www.postgresql.org/docs/18/indexes-multicolumn.html — prefix behaviour.
- https://www.postgresql.org/docs/18/indexes-collations.html — collation-specific
  index semantics.
- https://www.postgresql.org/docs/18/ddl-constraints.html — uniqueness and
  foreign-key duties.

The old live companion `maintaining-indexes.astro`, its 17 October evidence and the
existing DeletedFigure were assessed as reusable teaching material. The new
native values above come from this supplement, not those earlier measurements.
