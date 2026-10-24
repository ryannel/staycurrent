# Practitioner confirmation supplement · r09 · batch02-v02

Inputs read: the additionally assigned [exact batch02-v02 manifest](v02/manifest.json), current r09 article/component/download and shop fixture, r09 brief and relevant collection context, current r09 native output and the r09 portion of mechanical provenance. The setup and download were freshly read at `http://127.0.0.1:4414/review/relational-collection/application-sql/`. The ten relevant manifest source/context/receipt identities checked matched. No author quality notes, peer verdicts, earlier article versions or repair history were used. The coordinator widened the active informed confirmation to this implementation family after the same inherited-environment defect was observed in r04/r08. This is a focused supplement, not a final complete or corpus review.

Highest severity: **medium**.

## Checks

All five practitioner checks were applied to the affected setup, in-process connections, pool creation, and surrounding ownership/cleanup and observation claims.

| Check | Result | Note |
| --- | --- | --- |
| Correctness | finding | Child-tool sanitisation does not clear the Python process environment used by Psycopg. |
| Evidence | pass with scope | The recorded clean macOS functional run remains supported; a new exact native challenge establishes the inherited-option failure. |
| Coverage | finding | The repeat instructions leave an undeclared environment prerequisite before any driver drill can run. |
| Depth, both ways | pass | Repairing execution setup needs no extra parameter-binding/pooling lesson. |
| Ownership | pass | This remains an application connection/result/transaction boundary article; ambiguous-commit resolution and pool sizing stay with their named neighbours. |

## Result of the widened check

The displayed command names the binary directory and a short `/tmp` parent, pins Psycopg3.2.12/pool3.3.3 and explicitly says Linux execution has not been checked. Those portability qualifications remain accurate. The script's secure temporary child, explicit private socket/port/database/role, disabled TCP, owned data-directory assertion and finally cleanup remain present.

The environment concern does apply here. `run-boundary.py:18` constructs a PG-free dictionary, but only `tool()` uses it for subprocesses. `psycopg.connect(conninfo, ...)` and later `ConnectionPool(conninfo, ...)` execute inside the unchanged Python process. No `options` argument overrides inherited PGOPTIONS, and the displayed invocation does not ask the reader to clear it. This was tested rather than inferred from a text search.

## Finding

### r09 practitioner-2 · medium · Repeat the driver checks / run-boundary.py

Canonical cause: the same **filtered child environment does not sanitise in-process Psycopg connections** issue reported as r04 practitioner-1 / r08 practitioner-1 in the [batch03 confirmation](../batch03/practitioner-confirmation-v02.md). This label preserves the r09 assignment's numbering and affected-piece traceability; it is not a fourth independent cause.

Problem: an inherited connection option still reaches the newly owned session even though PostgreSQL server-tool subprocesses get a clean dictionary. The native challenge below supplies only PGOPTIONS requesting a read-only default. The owned connection is established and its data-directory assertion passes, but its first CREATE TABLE fails before the advertised driver checks begin.

Effect: a reader with that environment follows the documented setup and receives an unexplained fixture-creation error. They must diagnose inherited deployment configuration to reach the lesson. The practical setup is therefore incomplete for the promised owned experiment. This does not invalidate the separately recorded baseline driver behaviours under its tested clean configuration.

Suggestion: apply the intended clean environment/connection-default contract to every in-process and pooled connection, or expose and verify the necessary invocation prerequisite. Keep the article's setup and mechanical provenance scoped to what is actually cleared and tested.

Primary support: PostgreSQL18 [libpq environment variables](https://www.postgresql.org/docs/18/libpq-envars.html) documents the PGOPTIONS default, while [Psycopg's connection API](https://www.psycopg.org/psycopg3/docs/api/connections.html#psycopg.Connection.connect) identifies connection strings, overrides and environment influence. The native test pins the article's exact older Psycopg version rather than assuming the current documentation's development version establishes its observed outcome.

## Native challenge and source identity

Frozen source: `v02/source/src/components/relational-collection/r09/downloads/run-boundary.py`, SHA-256 `6cc72fe140da43dcef8e5bbe02cc95c420c0c7be2e0e235fa8223116a069f581`. The actual4414 rendered href `/review/relational-collection/evidence/r09/run-boundary.py` returned status200 and 8,424 bytes with that same hash in a fresh bounded HTTP check. No browser download-event/path/save wait was used; actual saving remains unverified.

The recorded earlier temporary Python environment no longer existed. A fresh disposable environment installed `psycopg[binary]==3.2.12` and `psycopg_pool==3.3.3` from PyPI, without altering global or shared environments. The launch environment was constructed by removing every ambient PG-prefixed variable, then setting exactly:

```text
PGOPTIONS=-c default_transaction_read_only=on
```

The exact frozen file was executed with:

```text
<disposable-python> <frozen-run-boundary.py>
  --bindir /opt/homebrew/opt/postgresql@18/bin --tmpdir /tmp
```

The first controlled run at 2026-10-24T03:29:04.953262Z reproduced the failure. A second run at 03:29:39.434840Z added a Python audit hook solely to print the `tempfile.mkdtemp` root and verify its absence after the script's finally block. It used `runpy.run_path` on the unchanged file with the same arguments. This second bounded run was needed because the script does not print the endpoint path; the audit hook did not change its connection environment or source.

Raw recorded output of the audited run:

```json
{"owned_temporary_root": "/tmp/sc-r09-owned-ubevuud7"}
{"check": "environment", "result": {"server": "PostgreSQL 18.6 (Homebrew) on aarch64-apple-darwin25.6.0, compiled by Apple clang version 21.0.0 (clang-2100.3.34.2), 64-bit", "driver": "3.2.12", "pool": "3.3.3", "python": "3.14.5 (main, May 10 2026, 10:21:34) [Clang 21.0.0 (clang-2100.0.123.102)]", "transport": "owned private Unix socket; no TCP"}}
{"check": "cleanup", "result": "owned server stopped; temporary cluster removed"}
{"owned_temporary_root": "/tmp/sc-r09-owned-ubevuud7", "absent_after_script_finally": true}
```

Process exit status was1. Native stderr ended:

```text
run-boundary.py:36
admin.execute('CREATE TABLE products (product_id text PRIMARY KEY,name text NOT NULL,price numeric(8,2) NOT NULL,stock integer NOT NULL CHECK(stock>=0))')
psycopg.errors.ReadOnlySqlTransaction: cannot execute CREATE TABLE in a read-only transaction
```

Owned server data was `/tmp/sc-r09-owned-ubevuud7/data` (resolved `/private/tmp/...`); the script asserted the connected data-directory identity before the displayed environment record. Explicit connection settings selected `/tmp/sc-r09-owned-ubevuud7/sock`, port55439, database postgres and role sc_owner. Its server launch disabled TCP. The deliberate PGOPTIONS input changed only the newly owned session's default; no existing endpoint, credentials or global settings were used. The finally block stopped the server and removed the owned root; the audit hook independently confirmed absence. Both disposable Python environments were removed too (`/tmp/sc-r09-confirm-runtime-s068dy9q` and `/tmp/sc-r09-confirm-runtime-3sy2inoo`). Escalation was used for already-established sandbox PostgreSQL/socket restrictions, not to reach an existing database.

## Reuse and limits

Read current `v02/mechanical/current-repair/r09-native-v02.jsonl`: the exact clean baseline records SQL injection versus binding, identifier/Decimal handling, zero rows, implicit transactions, refusal/error rollback, timeout cleanup, cancellation and connection replacement. The current frozen source and fixture identities match its recorded version. Those results are reused only for unchanged baseline mechanisms; the new challenge specifically establishes that environment independence is not covered. It fails before pool construction, so the pool inheritance observation is source/API reasoning, not a claim of a second observed pooled failure.

The challenge is local to macOS/PostgreSQL18.6/Python3.14.5 and the pinned dependencies. No Linux, proxy, production latency, global setting change, network-fault recovery or external-provider outcome was measured. No source edits, delegation, site builds, viewport/theme changes or unassigned full review were performed. Own temporary browser tab was closed on return.
