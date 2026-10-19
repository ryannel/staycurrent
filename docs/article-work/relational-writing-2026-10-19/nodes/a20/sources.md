# a20 source and execution record

Checked 20 October 2026. Article: **Managing connections and transaction lifetimes**.

## Primary documentation

- https://node-postgres.com/features/transactions — same checked-out client; explicit BEGIN / COMMIT / ROLLBACK, no automatic transaction context supplied by pg.
- https://node-postgres.com/apis/pool — pool.query acquisition/release, connect FIFO queue, release(true), counts, idle errors/removal and pool.end.
- https://node-postgres.com/apis/client — statement/read timeout distinction, getTransactionStatus I/T/E updated from ReadyForQuery, query and client error handling. The current web API is not assumed to describe a different installed version: the installed pg 8.23.1 source and native rehearsal provide the version-specific evidence.
- https://www.postgresql.org/docs/18/protocol-flow.html — direct session command cycles; ReadyForQuery and transaction status; extended protocol Sync; implicit transaction boundaries; cursor portals.
- https://www.postgresql.org/docs/18/libpq-cancel.html — dispatch success does not establish that cancellation affected a command; command result must be observed. No C/libpq function is presented as a pg JavaScript method.
- https://www.postgresql.org/docs/18/sql-set.html — session SET survives a successful surrounding commit, transaction-local SET ends at transaction completion.
- https://www.postgresql.org/docs/18/sql-declare.html — WITHOUT HOLD transaction lifetime; WITH HOLD same-session lifetime, materialisation and close.
- https://www.postgresql.org/docs/18/functions-admin.html#FUNCTIONS-ADMIN-SIGNAL — own-session cancellation and termination used by the rehearsal admin observer, not a proposed production handler API.
- https://www.pgbouncer.org/features.html — session/transaction backend assignment, ordinary versus held cursor, temp table compatibility, protocol versus SQL preparation. The page was actually opened past its navigation to read the feature table.
- https://www.pgbouncer.org/config.html#max_prepared_statements — non-zero tracking for named protocol preparation; SQL PREPARE / EXECUTE not tracked; driver/server reset/cache compatibility must be verified. No default value is prescribed and no proxy runtime is claimed.

Installed driver source: isolated dependency at `/private/tmp/rel3-pg-driver-20261020/node_modules/pg`, package version **8.23.1**, package gitHead **0980cefebe0ae461da8883703be049fe13ca96cf**. Its pg-pool dependency is **3.14.0**. Inspected client query_timeout handling and getTransactionStatus, plus pool connect queue timeout and release paths. Normal release does not issue rollback or a SQL state reset. Read timeout can settle the non-pipelined query callback while the command remains active; the native observer checks that fact directly.

## Native rehearsal

Public source: `src/components/relational-next/a20/rehearse.mjs`, imported with `?url&no-inline` and a download filename. This is a Node worksheet, requiring an administrative URL for a disposable server and installed pg 8.23.1 (or an explicit module path). It does not silently connect to a default server.

Captured result: `native-evidence.json`. Node **24.16.0**, PostgreSQL **18.6 (Homebrew)**, pg **8.23.1**, direct TCP, **pipeline false**. Used the orchestrator's bounded shared server on 127.0.0.1:57319, an admin observer connection and only its own automatically named `rel3_a20_run<PID>` databases. Final successful capture: `rel3_a20_run4145`. All article databases from attempted and successful runs were removed in finally; no roles or cluster configuration were created or modified. Shared server left running.

Pools normally max=1, idleTimeoutMillis=0, connectionTimeoutMillis=1000. One affinity case max=2. One acquisition case has a 40 ms acquisition timeout. Session override: SET LOCAL statement_timeout=40ms in one explicit transaction; rollback restores it. Query read timeout 30 ms is passed only for its one test. Tiny waits are failure orchestration, not performance measurements.

Fifteen records cover standalone commit; actual split transaction/write on two clients; invalid BEGIN; failed transaction then rollback; state leakage and SET LOCAL restoration; late acquisition with retained cleanup owner; configured queue timeout removal; active command cancellation observed as 57014 then rollback; server statement timeout inside transaction; client read timeout while observer still sees PgSleep, then disposal; early cursor close and rollback; lost connection before rollback then disposal/replacement; idle connection removal/replacement; pool.end remains pending until held client disposed; final zero test-database sessions. The script asserts the consequential values rather than only printing them.

The cursor check counts the named order_rows cursor, not all pg_cursors rows (the inspection query can itself use a portal). Backend disappearance after client closure is observed with a bounded poll. These are test-observation details, not behaviour changes.

No HTTP application, production network, PgBouncer, pg-query-stream, lost commit reply or complete bounded shutdown coordinator was executed. The article explicitly distinguishes those acceptance obligations. The rehearsal proves the driver closure call can wait for a held lease, not that the example process implements a production shutdown deadline.

## Teaching model checks

Seven own scenes and 62 option/frame combinations in `model.mjs`; `check-model.mjs` verifies complete render fields and decisive outcomes, including the wrong-affinity surviving row, failed cleanup disposal, early-return failed transaction, forgotten late lease, SET leakage, clean cursor removal and aggregate deployment arithmetic. Models are labelled not a live database.

Playback reads all visible title/panel/result/narration text at 180 words/minute plus 3 seconds, minimum 7 seconds. Manual transport retains focus at endpoints, parameter change resets to the first step, slider updates aria-valuetext, no autostart, visibility change stops playback, reduced motion removes arrival animation. Phone panels use divs with explicit zero margins, not article section elements.

Read all three fixed reference articles, including source figure implementations for SequencePlayer, ScanFigure and storage StepFigure. Used the actual a04 parent and supplied sibling plans. Retry budgets/idempotency, generated query bounds, background claim protocol, security design, workload tuning and service capacity remain with their owners.
