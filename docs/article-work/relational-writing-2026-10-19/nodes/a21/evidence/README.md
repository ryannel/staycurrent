# a21 native verification

Run on 20 October 2026. Invented shop fixture, observed execution.

## Reproduce

Requires the disposable server described in `../../../runtime.md`, or adjust the
worksheet's URL deliberately for an isolated local server. Never point this
worksheet at a production database. It creates and drops its own database.

```sh
python3 -m venv /private/tmp/rel3-a21-python
/private/tmp/rel3-a21-python/bin/pip install SQLAlchemy==2.0.44 pg8000==1.31.5
/private/tmp/rel3-a21-python/bin/python \
  docs/article-work/relational-writing-2026-10-19/nodes/a21/evidence/verify.py \
  rel3_a21_run7 > /private/tmp/a21-results.json
node src/components/relational-next/a21/verify.mjs
```

Use a fresh database suffix. Native execution used elevated permission because
the restricted shell cannot connect to the approved loopback runtime. No server
configuration or session settings were changed. The worksheet uses at most two
article connections plus one administrative connection and retains the server's
30-second statement and 5-second lock limits.

## Evidence and bounds

`native-results.json` is the final run (`rel3_a21_run6`), with versions, all
executed data statements, parameter types, cursor row counts, transaction events,
connection backend identifiers and protocol waits. Ordinary SQL row counts come
from pg8000's buffered cursor. Streaming reports `returned_rows: null`, because
initial cursor rowcount is -1, and separately records 1,200 consumed rows.

Instrumentation wraps `pg8000.core.CoreConnection.handle_messages`, a wait until
ReadyForQuery, rather than inferring network work from ORM calls. It includes
transaction begin and rollback waits, excludes previously completed connection
setup, and is specific to pg8000 1.31.5. It is not a packet capture or benchmark.
Its stream records include DECLARE, FETCH and CLOSE operations hidden behind the
one cursor-execution event. The installed SQLAlchemy pg8000 adapter was inspected
at `sqlalchemy/dialects/postgresql/pg8000.py`, ServerSideCursor methods; the driver
at `pg8000/core.py`, execute_simple, execute_unnamed and handle_messages.

Assertions cover fresh and reused relationship access, no orders, no items,
one/three/six parents, a twelve-item order, projection and ORM response equality,
joined collection uniqueness, a 501-parent batch threshold, joined-row limit
placement, raiseload, autoflush and its delay, version conflict, stale raw-update
state and expiry, cross-tenant reads/counts/children/mutation, and retained versus
discarded streaming chunks. Read cases assert absence of UPDATE/INSERT/DELETE.

The bounded entity samples are not peak process-memory measurements. These are
Python integration paths and response construction, not an HTTP stack, a
production serializer, a complete authorisation system or load testing.

Runs 1–5 were development checks. Run 1 failed in evidence formatting before
fixture creation (`dict(CursorResult)`); changing to `dict(result.all())` repaired
the harness. All of its connections closed and its database was dropped in
`finally`. Runs 2–6 passed, with run 5 adding explicit empty-page and six-parent
batched checks. Run 6 aligned Mina/order 103 with the actual parent; Jo owns the
shared-customer orders 101 and 102. Every run's own database was dropped. The temporary venv was
removed after recording the freeze; the shared JavaScript driver was untouched.
