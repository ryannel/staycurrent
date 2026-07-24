# r4-replication — session timeline

Kept as the run happened, including the misses. 2026-07-24.

## 09:29 — topology built

One primary, two hot standbys, each on its own physical replication slot
(`slot_a`, `slot_b`), all `postgres:16-alpine` on a user-defined Docker network.
Two standbys rather than one because the article claims two anomalies, and the
second (monotonic reads) cannot be shown with a single replica.

**Miss, caught immediately:** `pg_basebackup -R` writes `primary_conninfo`
without an `application_name`, so both standbys registered as `walreceiver` and
were indistinguishable in `pg_stat_replication`. That is fine for experiments 2
and 3 but fatal for experiment 4, which has to name *one* standby as
synchronous. Patched `primary_conninfo` on both and restarted before any
experiment ran — `raw/01b-name-standbys.log`.

## 09:31 — experiment 2, read-your-own-writes

Worked first time. Induced the lag with `pg_wal_replay_pause()` rather than by
loading the box: a paused replica lags deterministically and the cause is not in
doubt. Sentinel row body so a missing row cannot be confused with a present one.

**Detail worth keeping that I did not expect to be so clean:** at the moment the
row was invisible on standby B, `pg_last_wal_receive_lsn()` and the primary's
`sent_lsn` were the *same* value (`0/4065890`), while `pg_last_wal_replay_lsn()`
sat behind at `0/40656B0`. The bytes were already on the replica's disk. What
had not happened was replay. "The replica hasn't got it yet" is the wrong mental
picture — it had got it, and had not applied it.

## 09:31 — experiment 3, monotonic reads (first attempt: broken timestamps)

The anomaly reproduced (2 → 1 → 2 → 1 visible comments across alternating
replicas), but the log's wall clock printed literally `09:31:42.3N`: BSD `date`
on macOS has no `%3N`. Cosmetic, but this harness ships with the article, so the
driver was fixed to use the same `perl -MTime::HiRes` route the round-3 drivers
used on this machine, and re-run. No fact-note had cited the first log.

Re-run at 09:32 gave real millisecond stamps: four refreshes at `09:32:10.579`,
`.670`, `.748`, `.830` — the whole sequence inside 251 ms.

## 09:33 — experiment 4, FIRST ATTEMPT INVALID

Preserved at `raw/04a-sync-ladder-INVALID.log`. Read it; the trap is worth
knowing.

`psql -c "ALTER SYSTEM SET synchronous_standby_names = 'sba'; SELECT
pg_reload_conf();"` sends both statements as one implicit transaction, and
`ALTER SYSTEM cannot run inside a transaction block`. The statement errored,
the setting was never applied, and **both standbys stayed `async` for the entire
ladder**. With no synchronous standby named, Postgres waits for no standby at
all, so `remote_write`, `on` and `remote_apply` were all silently measuring
local-flush latency. The three "synchronous" rungs came back at 0.217–0.303 ms —
indistinguishable from `local`, which is exactly what that means.

What caught it: the script printed `sync_state = async` two lines under its own
echoed claim that "Standby A is now sync". The script lied; the data did not.

Fixed two ways: every `ALTER SYSTEM` is now its own `-c` invocation, and step 3
carries a guard that reads `sync_state` back and aborts the run rather than
benchmark a false premise.

## 09:34 — experiment 4, valid run

Guard passed (`sync_state for sba = 'sync'`, sbb `async`). 4,500 rows landed in
`ledger` = 5 rungs × 3 runs × 300 transactions, which is the arithmetic check
that every run actually executed.

**The surprise, and the honest caveat.** The ladder does not rise evenly. Two
steps cost, two are free:

- `off` → `local` is a real jump (0.050–0.067 → 0.222–0.273 ms): the primary's
  own fsync.
- `local` → `remote_write` is *nothing* (0.222–0.273 → 0.224–0.292 ms,
  overlapping ranges).
- `remote_write` → `on` is the other real jump (→ 0.330–0.405 ms): the standby's
  flush to its own disk.
- `on` → `remote_apply` is nothing again (0.330–0.405 → 0.334–0.394 ms,
  overlapping).

So on this topology the bill is two disk flushes, not a network round trip —
because there is no real network here. Three containers on one Docker VM make
the hop nearly free, which a cross-AZ standby would not. This measurement shows
where the cost *lands* (the standby's disk, not the wire) and cannot be used to
predict what a real network adds on top. Stated that way in the fact-notes.

Within every rung, run 1 is the slowest of the three. Warmup; the spread is kept
rather than averaged away.

## 09:35 — spot-verification

Re-ran `remote_write` and `on` only, into `verify/` (never into `raw/`).
remote_write 0.272/0.227/0.227, on 0.383/0.348/0.322 — the separation reproduces
and both fall in the original run's ranges.
