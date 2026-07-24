# Fact-notes: replication lag and the cost of synchronous commit (r4-replication)

Environment: PostgreSQL 16.14 (`postgres:16-alpine`, image
`sha256:e013e867e712fec275706a6c51c966f0bb0c93cfa8f51000f85a15f9865a28cb`), three
containers — primary `r4-repl-primary` plus two hot standbys `r4-repl-sba` and
`r4-repl-sbb` — on one Docker network, Docker 29.4.3, arm64 Mac, macOS 26.5.1.
All values below are copied exactly as printed in the raw logs.

**General caveat for every millisecond figure in this lab:** three Postgres
containers share one Docker VM on a laptop, on default configuration and a
virtualised filesystem. There is no real network between primary and standby.
Row visibility, LSN positions, byte lag and the ordering of the results are the
reliable part; absolute milliseconds are not, and the network component of any
figure here is close to zero in a way a cross-AZ standby's would not be.

---

1. **Read-your-own-writes reproduced, with a control.** Standby B's WAL replay
   was paused with `pg_wal_replay_pause()` (`pg_is_wal_replay_paused()` returned
   `t`). A row was then inserted and committed on the primary
   (`INSERT 0 1`, `id | author | body` = `1 | user7 | sentinel-9f4c22 — posted
   by user 7`). Read back immediately: standby B returned `(0 rows)`, standby A
   — streaming, same moment, same query — returned the row. Resuming replay made
   the row appear on B. Raw: `raw/02-ryow.log`.

   Verbatim, the anomaly and its control (show-the-artifact excerpt):

   ```
   $ psql@sbb -c "SELECT id, author, body FROM comments;"
    id | author | body
   ----+--------+------
   (0 rows)

   $ psql@sba -c "SELECT id, author, body FROM comments;"
    id | author |                body
   ----+--------+------------------------------------
     1 | user7  | sentinel-9f4c22 — posted by user 7
   (1 row)
   ```

2. **The lagging replica already had the bytes; it had not replayed them.** At
   the moment standby B could not see the row, its received LSN equalled the
   primary's `sent_lsn`, and only `replay_lsn` was behind — 480 bytes behind.
   Raw: `raw/02-ryow.log`.

   ```
    application_name |   state   | sent_lsn  | replay_lsn | replay_lag_bytes
   ------------------+-----------+-----------+------------+------------------
    sba              | streaming | 0/4065890 | 0/4065890  |                0
    sbb              | streaming | 0/4065890 | 0/40656B0  |              480
   ```

   Interpretation, not measured: "the replica hasn't received it yet" is the
   wrong picture of this failure — on this run the data was on the replica's
   disk and unapplied. Whether that is the common shape in production is not
   something this lab can say.

3. **Monotonic reads violated inside 251 milliseconds.** With standby B held at
   a fixed replay point and standby A streaming, four reads from one user
   round-robined across the two replicas returned `visible_comments` of 2, 1, 2,
   1 at wall clocks `09:32:10.579`, `09:32:10.670`, `09:32:10.748` and
   `09:32:10.830`. Replay lag at that moment: sba 0 bytes, sbb 208 bytes. Both
   converged to 2 after resume. Raw: `raw/03-monotonic.log`.

   Note on convention: `visible_comments` is `count(*)` over the whole table as
   each replica saw it at that instant, not a per-session or per-user count.

4. **The synchronous_commit ladder — all fifteen runs, spread kept.** pgbench,
   single client, 300 transactions per run, three runs per rung, standby A named
   as the sole synchronous standby (`sync_state` read back as `sync` before any
   run; standby B stayed `async` throughout and was never waited on). The
   arithmetic check: 4,500 rows landed = 5 rungs × 3 runs × 300.
   Raw: `raw/04-sync-ladder.log`.

   | `synchronous_commit` | who the primary waits for | run 1 | run 2 | run 3 | range |
   |---|---|---|---|---|---|
   | `off` | nobody — not even its own flush | 0.050 ms | 0.067 ms | 0.062 ms | 0.050–0.067 ms |
   | `local` | the primary's own disk | 0.273 ms | 0.243 ms | 0.222 ms | 0.222–0.273 ms |
   | `remote_write` | the standby's OS | 0.292 ms | 0.233 ms | 0.224 ms | 0.224–0.292 ms |
   | `on` | the standby's disk | 0.405 ms | 0.338 ms | 0.330 ms | 0.330–0.405 ms |
   | `remote_apply` | the standby, replayed | 0.394 ms | 0.340 ms | 0.334 ms | 0.334–0.394 ms |

   Caveat: run 1 is the slowest of the three in every rung — warmup. Ranges above
   are min–max of the three logged runs, not means.

5. **The ladder has two steps, not four.** Two adjacent pairs separate cleanly
   and two overlap entirely:

   - `off` → `local`: 0.050–0.067 → 0.222–0.273 ms. Separates.
   - `local` → `remote_write`: 0.222–0.273 → 0.224–0.292 ms. Ranges overlap;
     no separation measured.
   - `remote_write` → `on`: 0.224–0.292 → 0.330–0.405 ms. Separates.
   - `on` → `remote_apply`: 0.330–0.405 → 0.334–0.394 ms. Ranges overlap; no
     separation measured.

   Interpretation, not measured: the two costs that showed up are two disk
   flushes — the primary's, then the standby's — and the two that did not are
   the ones that would have been paid on the wire and in replay. **This is a
   topology artifact and must be labelled as one:** with all three containers on
   one Docker VM there is no real network, so this run cannot price the network
   round trip the way a cross-AZ standby would. What it does show is that the
   standby's *flush* is a distinct, measurable cost on top of the primary's own,
   and that `remote_apply` was not measurably dearer than `on` here.

6. **Verification (separate run, not in `raw/`).** `remote_write` and `on` were
   re-run three times each after the fact: remote_write `0.272`, `0.227`,
   `0.227` ms; on `0.383`, `0.348`, `0.322` ms. Both fall inside the original
   run's ranges and the separation reproduces. Raw:
   `verify/verify-04-sync-ladder.log`.

7. **A defect worth publishing (from the invalid first attempt).**
   `psql -c "ALTER SYSTEM SET synchronous_standby_names = 'sba'; SELECT
   pg_reload_conf();"` fails with `ERROR: ALTER SYSTEM cannot run inside a
   transaction block`, because `-c` sends both statements as one implicit
   transaction. The setting is silently never applied. A ladder run under that
   mistake reports `remote_write`, `on` and `remote_apply` at 0.217–0.303 ms —
   indistinguishable from `local`, because with no synchronous standby named the
   primary waits for no standby at all. Preserved in full at
   `raw/04a-sync-ladder-INVALID.log`; the corrected driver runs each
   `ALTER SYSTEM` as its own invocation and asserts `sync_state = 'sync'` before
   benchmarking.

   From the docs, not measured in this run: `synchronous_commit` settings above
   `local` have no effect unless `synchronous_standby_names` is non-empty.

---

## What this lab does NOT establish

- It cannot test the article's "a healthy follower typically under a second
  behind." That is a claim about production systems in the world; every lag
  figure here was deliberately induced with `pg_wal_replay_pause()` and means
  nothing about typical lag.
- It says nothing about failover, split brain, or promotion — no failover was
  performed.
- The `80ms` and `3s` lag figures in the article's current replication diagram
  are illustrative, not measured. This lab's measured equivalents are byte lags
  (480 and 208 bytes) under deliberately paused replay, which is a different
  quantity and should not be substituted for them without saying so.
