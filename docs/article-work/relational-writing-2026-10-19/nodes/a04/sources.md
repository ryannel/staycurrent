# a04 — source and execution record

Checked 19 October 2026. Staged article: `article.astro`. Native fixture and executable checks: `src/components/relational-next/a04/verify.mjs`; figure models: `scenes.mjs` in the same directory. The script imports the previously installed pg 8.23.1 from `/private/tmp/staycurrent-pg-lab/node_modules/pg/esm/index.mjs`; it does not change repository dependencies.

## Primary sources consulted

- https://node-postgres.com/features/queries — separate values and command text; `$1` syntax, unsupported identifier parameters, undefined/null input conversion, preparation naming and reuse. Used in binding and structure sections.
- https://node-postgres.com/features/types — default date/timestamp/timestamptz parsing and millisecond truncation. Exact integer/decimal defaults also verified natively below, rather than inferred from current main-branch parser source.
- https://node-postgres.com/features/transactions — explicit BEGIN/COMMIT/ROLLBACK on one checked-out client; no pool.query for multi-statement transaction ownership.
- https://node-postgres.com/apis/pool — checked-out client release, truthy destroy argument, acquisition queue, max and connectionTimeoutMillis. `/api/pool` returned 404; corrected to documented `/apis/pool`.
- https://www.postgresql.org/docs/18/ddl-rowsecurity.html — row-policy scope, owner/superuser/BYPASSRLS caveats. No row-policy execution claim is made: the native tenant case tests explicit predicates only.
- https://www.postgresql.org/docs/18/libpq-cancel.html — successful cancellation dispatch is not evidence that cancellation took effect. This is server/libpq contract evidence, not a claim that the Node driver implements that C API.
- https://www.postgresql.org/docs/18/protocol-flow.html — statement and transaction completion, session failure and open transaction rollback. The two possible missing-reply outcomes are labelled models here; a03 separately owns native withheld-commit-response evidence.
- https://docs.sqlalchemy.org/en/20/orm/session_basics.html — default autoflush, flush versus commit. No SQLAlchemy execution was performed.
- https://microservices.io/patterns/data/transactional-outbox.html — atomic change plus durable intent, relay repeat after crash. No receiver or worker execution was performed.

All technical web sources were opened directly using the browsing tool. The current pg parser source at https://github.com/brianc/node-pg-types/blob/master/lib/textParsers.js was also consulted, but is not used as proof of the pinned installed default conversion. No secondary technical sources or copied passages.

## Native observations

The restricted shell's first connection attempt returned local EPERM before connecting; the same script then ran successfully with the established local-service execution permission. Separate databases `rel3_a04_run1` and `rel3_a04_run2`; no other article database touched. Server unchanged. All clients and the pool closed. Fixture databases remain for the orchestrator’s eventual cluster cleanup.

Runtime for run2:

```json
{
  "database": "rel3_a04_run2",
  "processZone": "Europe/Stockholm",
  "node": "v24.16.0",
  "driver": "pg 8.23.1",
  "runtime": "PostgreSQL 18.6 (Homebrew) on aarch64-apple-darwin25.6.0, compiled by Apple clang version 21.0.0 (clang-2100.3.34.2), 64-bit",
  "timezone": "UTC",
  "roundtrip": {
    "id": "9007199254740993",
    "amount": "123456789012345678.90",
    "missing": null,
    "day": "2026-10-18T22:00:00.000Z",
    "wall": "2026-10-19T10:34:56.123Z",
    "instant": "2026-10-19T10:34:56.123Z",
    "label": "Mina'); DROP TABLE boundary_values; --"
  },
  "precise": {
    "day": "2026-10-19",
    "wall": "2026-10-19 12:34:56.123456",
    "instant": "2026-10-19 10:34:56.123456+00"
  },
  "rounded": "9007199254740992",
  "undefined": true,
  "crossTenant": [],
  "rollback": "No order 105",
  "exhaustion": "Second acquisition timed out while the only client was held",
  "reuse": "Next borrower executes SELECT 1",
  "models": "All five scenes have matching variant lengths and complete state tuples"
}
```

The round-trip fixture used bigint, numeric(20,2), null text, date, timestamp and timestamptz. No session override: database timezone UTC, process timezone Europe/Stockholm. Default pg parsers. Statement results asserted exact digits, date objects and truncated ISO timestamp. Explicit text casts demonstrated retained SQL precision. A JavaScript Number conversion before binding reproduced the rounded bigint. An undefined parameter became SQL null. A scoped query for tenant 7 and tenant 8's order returned zero rows. An explicit rollback removed attempted order 105. With max=1 and connectionTimeoutMillis=100, a second borrow failed while the first remained held; release restored usability.

Re-run with a new unique article database name, e.g. `A04_DATABASE=rel3_a04_run3 node src/components/relational-next/a04/verify.mjs`. This requires the same local-server execution permission as runtime.md. Do not re-use a database name: CREATE DATABASE deliberately fails instead of overwriting it.

## Models and limits

Five manually controlled comparisons: request completion/HTTP loss; exact text/rounded Number; connection held/released around network work; commit missing/reply missing; direct external call/durable work record. Each variant has complete five-field state tuples and equal step counts. Switching variants preserves the selected step; Play advances every 4.5 seconds, never auto-starts, with Back/Next/Reset and full text alternatives. No illustrative timing is a latency observation.

The query table is arithmetic for stipulated serially awaited statements and five distinct customers, not measured ORM behaviour. Counts deliberately separate SQL rows from objects. No HTTP path, ORM, cancellation, concurrency, commit fault, external effect, throughput or production capacity was exercised by a04. These appear as acceptance exercises or contextual links, never as completed tests.

## Focused validation

Astro compiler transform on the staged fragment and BoundaryPlayer.astro returned zero diagnostics. No shared build or preview mutation. Browser responsive/interaction checks follow orchestrator promotion; full build and independent review remain orchestrator-owned.
