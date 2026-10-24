# Technical support for v02 repair

Checked 24 October 2026. The changed r13 paragraph is supported by the supplied `input/mechanical/r13/independent-snapshot-probe.json`: `BEGIN; SET LOCAL application_name=...` followed by another session's committed update still lets the first SELECT see the newer stock 2; first SELECT before that commit retains stock 1 on the second SELECT. Both sessions verified owned data_directory and current_user; inherited PG settings removed, private Unix socket, owned cluster stopped/removed. This repair reuses that exact independent probe rather than claiming a newly executed probe.

Primary sources:

- https://www.postgresql.org/docs/18/transaction-iso.html — ordinary SELECT statement snapshots and retained Repeatable Read reads. Its broad “first non-transaction-control statement” wording is insufficient for the SET LOCAL edge; the implementation and supplied probe resolve that edge.
- https://github.com/postgres/postgres/blob/REL_18_STABLE/src/backend/tcop/pquery.c — `PlannedStmtRequiresSnapshot` explicitly exempts transaction control, LOCK, SET and SHOW; `PortalRunUtility` requests a transaction snapshot only when required. The article deliberately does not enumerate utility statements.
- https://github.com/postgres/postgres/blob/REL_18_STABLE/src/backend/utils/time/snapmgr.c — `GetTransactionSnapshot` saves the first transaction snapshot and reuses it at transaction-snapshot isolation.
- https://docs.python.org/3/library/tempfile.html — `mkdtemp(dir=...)` securely creates its private child under the selected existing parent. r09 now accepts `--tmpdir`, defaults to `/tmp`, and shows that parent in the invocation.

The r09 exact changed runnable source was rerun on macOS, PostgreSQL18.6, Python3.14.5, Psycopg3.2.12 and psycopg_pool3.3.3. Dependencies were installed from official PyPI into `/private/tmp/staycurrent-r09-repair-v02-env`, outside evidence. Command:

`/private/tmp/staycurrent-r09-repair-v02-env/bin/python src/components/relational-collection/r09/downloads/run-boundary.py --bindir /opt/homebrew/opt/postgresql@18/bin --tmpdir /tmp`

The first sandboxed attempt failed at initdb and its own finally cleanup removed its directory. The authorised escalated run passed all checks (see r09-native-v02.jsonl); all connections/server and owned cluster removed. The source continues to disable TCP, strip inherited PG variables for server tools, initialise sc_owner, pass explicit connection identity and assert owned data_directory before creating fixtures. shop.json still matches canonical core. No existing server was contacted. Linux was not executed and the article says so. No timings are performance claims.

r05/r06 retain their exact displayed SQL, downloadable experiment and canonical core hashes; `verification-reuse.json` records comparisons against the supplied source manifests. Their native results are reused only for unchanged query/data semantics. Fresh rendered checks cover the new table forms. No new native outcome or data extension is introduced by those forms.
