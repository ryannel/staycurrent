# a06 — source and example evidence

Checked 19 October 2026 for **Changing a live database**. The worked engine is
PostgreSQL 18; observed native fixture version is PostgreSQL 18.6 Homebrew,
aarch64-apple-darwin25.6.0. No migration tool is prescribed here: the child
schema-change article pins its runnable procedure and runner version.

## Primary sources and claims

| Source | What it establishes in this article |
| --- | --- |
| [PostgreSQL 18 ALTER TABLE](https://www.postgresql.org/docs/18/sql-altertable.html), Description and Notes | Default lock is ACCESS EXCLUSIVE unless specified otherwise; ordinary nullable text additions without defaults do not rewrite the table; type changes normally rewrite with documented exceptions; constraint validation can scan. The article deliberately does not give a copy-and-run DDL procedure. |
| [PostgreSQL 18 CREATE INDEX](https://www.postgresql.org/docs/18/sql-createindex.html), Building Indexes Concurrently | Concurrent builds allow writes but require extra scans/waits and resources, can leave invalid indexes, and cannot run in a transaction block. |
| [PostgreSQL 18 Read Committed](https://www.postgresql.org/docs/18/transaction-iso.html#XACT-READ-COMMITTED) | An UPDATE waiting behind a changed target row rechecks its WHERE condition against the committed version. This supports the article's simple row-and-version guard, with every source writer advancing the version. |
| [PostgreSQL 18 logical replication restrictions](https://www.postgresql.org/docs/18/logical-replication-restrictions.html) | DDL/schema and sequence state are not replicated by built-in logical replication. Copied row values alone do not establish cutover readiness. |
| [PostgreSQL 18 continuous archiving](https://www.postgresql.org/docs/18/continuous-archiving.html) | PITR uses a base backup and archived WAL and can stop at a chosen earlier point. The operational restore procedure belongs to a07 and its children. |
| [PostgreSQL 18 routine vacuuming](https://www.postgresql.org/docs/18/routine-vacuuming.html#VACUUM-FOR-SPACE-RECOVERY) | Old deleted versions can remain while transactions need them; ordinary vacuum generally frees space for reuse internally, with tail-truncation exceptions, while VACUUM FULL writes a new file. No timing or erasure guarantee is inferred. |

All six official pages were opened through the web tool; relevant Notes,
concurrent-index failure paragraphs, Read Committed recheck paragraph, logical
replication restrictions and vacuum space section were inspected. General
compatibility, authority, reconciliation and retirement gates are derived
protocol reasoning, not claims that PostgreSQL supplies those protocols.

## Reference reading

Read the complete fixed `sequences.astro`, `indexes.astro` and `storage.astro`
reference articles. Also read all their figure text from the running reference
pages on dev4337, including alternative-schedule descriptions, controls and
captions. Followed their pattern of a concrete question before each figure,
predict/change/replay instruction, then an explanation of the observed result.

## Native fixture

Used the already-running shared disposable runtime without restarting,
reconfiguring or stopping it. Created only `rel3_a06_run1`, via pinned binary:

```sh
/opt/homebrew/Cellar/postgresql@18/18.6_1/bin/createdb \
  -h 127.0.0.1 -p 57319 -U staycurrent rel3_a06_run1
```

Ran the following with pinned `psql --no-psqlrc`, `ON_ERROR_STOP=1`, connected to
`postgresql://staycurrent@127.0.0.1:57319/rel3_a06_run1`. Native commands used the
runtime's already documented elevated execution context; no server settings or
session overrides were changed. `SHOW default_transaction_isolation` returned
`read committed`. These statements assume a fresh a06-only database.

```sql
CREATE TABLE orders (
  order_id integer PRIMARY KEY,
  delivery_text text NOT NULL,
  source_version integer NOT NULL
);
INSERT INTO orders VALUES
  (101, '8 Ash Road, York, YO1 1AA', 7),
  (102, '4 Elm Road, York, YO1 2BB', 1),
  (103, 'The old cottage, near York', 1);
ALTER TABLE orders
  ADD COLUMN address_line text,
  ADD COLUMN town text,
  ADD COLUMN postcode text,
  ADD COLUMN converted_from_version integer,
  ADD COLUMN conversion_state text NOT NULL DEFAULT 'pending';
SELECT count(*) FILTER (WHERE conversion_state = 'pending') AS pending
FROM orders;
-- observed: 3

BEGIN;
UPDATE orders SET
  delivery_text = '12 Birch Road, York, YO1 1AA', source_version = 8,
  address_line = '12 Birch Road', town = 'York', postcode = 'YO1 1AA',
  converted_from_version = 8, conversion_state = 'current'
WHERE order_id = 101;
COMMIT;
UPDATE orders SET
  address_line = '8 Ash Road', town = 'York', postcode = 'YO1 1AA',
  converted_from_version = 7, conversion_state = 'current'
WHERE order_id = 101 AND source_version = 7 RETURNING order_id;
-- observed: UPDATE 0, no returned rows
SELECT order_id, source_version, address_line, converted_from_version
FROM orders WHERE order_id = 101;
-- observed: 101 | 8 | 12 Birch Road | 8

UPDATE orders SET
  address_line = '4 Elm Road', town = 'York', postcode = 'YO1 2BB',
  converted_from_version = 1, conversion_state = 'current'
WHERE order_id = 102 AND source_version = 1;
UPDATE orders SET conversion_state = 'review'
WHERE order_id = 103 AND source_version = 1;
SELECT
  count(*) FILTER (WHERE conversion_state = 'current'
    AND converted_from_version = source_version) AS current,
  count(*) FILTER (WHERE conversion_state = 'review') AS review
FROM orders;
-- observed: 2 current, 1 review

BEGIN;
UPDATE orders SET
  delivery_text = '7 Oak Lane, York, YO1 3CC', source_version = 2,
  address_line = '7 Oak Lane', town = 'York', postcode = 'YO1 3CC',
  converted_from_version = 2, conversion_state = 'current'
WHERE order_id = 103;
COMMIT;
SELECT count(*) FILTER (
  WHERE conversion_state <> 'current'
     OR converted_from_version IS DISTINCT FROM source_version
) AS unresolved FROM orders;
-- observed: 0

BEGIN;
UPDATE orders SET address_line = '8 Ash Road', converted_from_version = 7
WHERE order_id = 101;
SELECT order_id, delivery_text, address_line,
       converted_from_version, source_version
FROM orders WHERE converted_from_version IS DISTINCT FROM source_version;
-- observed: 101 | 12 Birch Road, York, YO1 1AA | 8 Ash Road | 7 | 8
ROLLBACK;
```

The fixture is a small sequential check of the stale-version condition and
accounted-for states. It is not a parser, a production job, a measured
concurrency/lock-wait experiment or a cutover rehearsal. Customer confirmation
is explicitly supplied for the ambiguous address. The version/count check is
only one reconciliation check; it does not prove semantic equivalence.

## Deterministic figure checks

`node src/components/relational-next/a06/verify.mjs` passed: all 29 combinations
of scene, mode and step have well-formed rows; initial and terminal bounds hold;
the ambiguous row blocks reading; retirement preserves the new address;
the guarded race retains the newer value while blind writing creates a stale
value; a fenced source has no destination-only order; routing-only cutover can
create conflicting order 103 states in the two stores.

No throughput, elapsed migration time, replica lag or lock duration is presented
as a measurement. The example one-second lock budget is labelled invented.

## Browser check

On root-promoted dev4337 `/review/relational-next/live-changes/`, verified all
three figures render, manual progression updates the comparison and stage gate,
and mode changes at the same race/cutover step expose the different outcome.
Dark-theme screenshots were visually inspected at the normal 1280×720 viewport.
Found and repaired dynamic-row scoped CSS (rows created by the player now use
parent-scoped `:global` selectors, so identifiers, values and notes retain their
layout after stepping). Rechecked the repaired race and move screenshots.

Optional Play was exercised in Figure 1: after its narration-aware hold the
counter advanced from `1 / 7` to `2 / 7`; Pause kept `2 / 7`, and Reset returned
`1 / 7`. The temporary browser tab was closed after checks.

Keyboard Enter on Next at the penultimate race step reached the final step while
the same Next element retained focus (`document.activeElement === button` true,
`aria-disabled=true`, counter `5 / 5`). Browser automation correctly refuses a
second action on an aria-disabled control; no native `disabled` attribute or
element replacement is used for transport buttons. Root owns the fixed-preview
phone checks and independent review.
