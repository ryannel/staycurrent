# Evidence for the databases article

Every measured claim in the article was produced by one of the labs below, on
this machine, on 2026-07-24. Nothing here is a benchmark result borrowed from a
vendor, and nothing here is a field anecdote. Each lab ships the scripts that
produced it, the raw logs those scripts wrote, and a record of what the lab does
*not* establish.

## The labs

| Directory | What it measures | Article section |
|---|---|---|
| `r4-replication/` | read-your-own-writes and monotonic-read anomalies against real streaming replicas; the per-commit cost of each `synchronous_commit` setting | Replication |
| `r4-partitioning/` | partition pruning in real plans; `DETACH PARTITION` against `DELETE`; how a time-ordered stream lands under range against hash | Partitioning |
| `t1-isolation-rerun/` | a lost update at Read Committed, write skew at Serializable, and the SQLSTATE of a serialization failure | Transactions |

## How each lab is laid out

- `environment.txt` — the machine, the image digest, the server version, and the
  settings, captured as verbatim command output.
- `setup.sh` and `driver-*.sh` — everything that ran, in the order it ran. These
  are the actual scripts, not cleaned-up reconstructions.
- `raw/` — the logs those scripts wrote. **Immutable.** Nothing re-runs into
  `raw/`; verification runs write to `verify/`.
- `raw/00-timeline.md` — what happened as it happened, including the mistakes.
- `fact-notes.md` — the distilled findings, every number traceable to a named raw
  file, with the caveats attached and a closing list of what the lab does not
  show.

## Re-running

Each lab needs Docker and the `postgres:16-alpine` image. Run `setup.sh` first,
then the drivers in numeric order:

```bash
cd r4-replication && bash setup.sh 2>&1 | tee raw/01-setup.log
```

Re-running rebuilds containers from scratch — the setup scripts remove any
previous attempt rather than reuse a half-built one. Point `LOGDIR` at a fresh
directory if you want to keep the committed logs intact.

## Two things worth reading even if you never run any of it

`r4-partitioning/raw/00-timeline.md` records a measurement that came out 119×
too favourable to partitioning because a table had not been vacuumed, and how the
control run reversed the conclusion.

`r4-replication/raw/04a-sync-ladder-INVALID.log` is a preserved failed run: an
`ALTER SYSTEM` that silently never applied, so a "synchronous replication"
benchmark spent its whole life measuring asynchronous commits. It is kept because
the trap is easy to fall into and invisible in the results.
