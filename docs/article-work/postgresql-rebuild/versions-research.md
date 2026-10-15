# Row versions: evidence and limits

Checked against PostgreSQL 18 documentation on 15 October 2026. The article uses
original experiments on PostgreSQL 18.6, recorded in `versions-observed.json`,
rather than treating a browser SQL response as a server concurrency test.

| Claim or teaching step | Primary reference / direct evidence |
| --- | --- |
| Heap item identifiers, tuple headers, indirection | https://www.postgresql.org/docs/18/storage-page-layout.html |
| ctid is a version location; xmin/xmax interpretation | https://www.postgresql.org/docs/18/ddl-system-columns.html |
| Snapshot boundaries and active-ID membership functions | https://www.postgresql.org/docs/18/functions-info.html#FUNCTIONS-PG-SNAPSHOT |
| Repeatable Read snapshot lifetime; Serializable dependency detection | https://www.postgresql.org/docs/18/transaction-iso.html |
| HOT page room and index-column eligibility | https://www.postgresql.org/docs/18/storage-hot.html |
| Physical page and index inspection | https://www.postgresql.org/docs/18/pageinspect.html |
| Visibility map's two bits | https://www.postgresql.org/docs/18/storage-vm.html |
| Covering access still needs visibility information | https://www.postgresql.org/docs/18/indexes-index-only-scans.html |
| Finite IDs and circular ordering | https://www.postgresql.org/docs/18/transaction-id.html |
| Freezing, space reuse and maintenance | https://www.postgresql.org/docs/18/routine-vacuuming.html |
| Autovacuum thresholds and cost controls | https://www.postgresql.org/docs/18/runtime-config-vacuum.html |
| Activity and table counters | https://www.postgresql.org/docs/18/monitoring-stats.html |
| Row-lock modes and conflicts | https://www.postgresql.org/docs/18/explicit-locking.html |

The observed snapshot was 784:786:784: creator 783 committed, updater 784 was held
active while observer 785 allocated and committed an ID. The report began after
that activity but before 784 committed. Keeping the real IDs makes the diagram,
source evidence and snapshot lesson agree; rerunning the server script naturally
allocates different IDs. These are not fixed server identifiers.

Three real connections observed the report's retained 3 and a newer reader's 1.
The old tuple stayed after a vacuum with the report open. After it committed,
vacuum left a redirect at slot 1 and a surviving normal tuple at slot 2. The B-tree
reference stayed (0,1). Including available in another index prevented HOT in the
otherwise comparable fixture. A KEY SHARE lock produced nonzero xmax while a
plain reader still saw the row. Vacuum freeze preserved the numerical xmin while
setting the frozen flags; the visibility map changed from all-visible only to
all-visible and all-frozen.

The script disables autovacuum only on its disposable fixture tables to keep page
inspection states stable. It does not change a cluster setting. The reader-facing
example leaves normal maintenance enabled and describes eligibility rather than
promising a particular background-maintenance schedule.

The explicit-snapshot browser lesson deliberately tests membership, not commit
status or concurrent transactions. Its derived tuple selection is labelled a
bounded teaching expression, with excluded cases named. `pg-visibility` remains
the complementary seven-step actual update/vacuum/index-only lesson.

The terminal two-doctor result is a consequence of the storage/isolation distinction,
not a second full treatment of the family's isolation article. Repeatable Read
allowed both distinct-row updates; Serializable rejected one commit with 40001.
