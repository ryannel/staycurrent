# Databases — Changelog

## v4 — 2026-07-24

What moved is the evidence, not the position. Three sections — transactions, replication, partitioning — previously argued entirely from the documentation and the literature. They now rest on experiments run for this cut on PostgreSQL 16.14 in Docker on a laptop, and the harness that produced them is published beside the article at `topics/databases/evidence/`: the driver scripts, the immutable raw logs, the environment records, and per-lab notes stating what each lab does *not* establish. Every measured figure in the article traces to a named log in that directory.

Three things the labs showed that the sources do not. The `synchronous_commit` ladder separates at two rungs rather than four: `off`→`local` and `remote_write`→`on` each cost, while `local`→`remote_write` and `on`→`remote_apply` overlap outright — the bill is two disk flushes, and the article says plainly that this topology has no real network between primary and standby and therefore cannot price the round trip. Retiring a month of data by `DETACH PARTITION` ran 1.884–2.312 ms against 104.757–124.934 ms for the equivalent `DELETE`, with the deleted table still at its full 208 MB after a `VACUUM` cleared 591,839 dead tuples. And a vacuumed *unpartitioned* twin beat the partitioned table on a pruned one-month count, 564 buffers against 1,699 — one query shape, reported as one query shape, and it sharpens the section's standing verdict rather than upsetting it.

Two sections also now show the artifact they teach. The transactions section named SQLSTATE `40001` for two versions without printing it; the error transcript is now on the page, next to a lost update whose withdrawal amounts are deliberately unequal so the wrong balance cannot be mistaken for a right one. The partitioning section taught plan-reading without a plan; the `EXPLAIN` output naming one partition of twelve is now there to read.

One claim is withdrawn rather than measured. The previous text said a healthy follower runs "typically under a second behind" — a claim about production systems in the world, which a laptop cannot test and should not sit unlabelled beside figures that were induced deliberately with `pg_wal_replay_pause()`. It can return with its own citation. The failover, two-phase-commit, secondary-index, and non-Postgres engine claims were not measured either, and the article now marks them as the documentation's rather than the lab's.

What it means for practice: the guidance has not changed, so yesterday's decisions stand. What changed is that the expensive ones are now priced. A reader deciding whether to run a synchronous standby, whether to partition, or whether to reach for `SERIALIZABLE` can see the numbers, see the machine they came from, and re-run the experiment against their own hardware — which is the only way any of these figures should be used.

**Stance:** held — the measurements priced the mechanics and moved none of them; the one result that surprised me, an unpartitioned table winning a pruned scan, argues for the existing verdict that partitioning is the last rung of a ladder rather than against it.

## v3 — 2026-07-17

What moved is the voice, not the claims. This is an operator-initiated editorial cut: the article re-edited sentence by sentence under staycurrent-style, the house writing skill built and evaluated this week on the writers this publication learns from (Kleppmann, Ousterhout, and ByteByteGo). Every claim, number, table, and diagram carries over from v2 unchanged; the whole edit moved the word count by nineteen words in four and a half thousand. What changed is rhythm. Long dash-interrupted sentences became short plain ones: average sentence length fell from 22 words to 19, sentences over thirty words halved from 20 percent to 11, and em-dash density fell from 1.2 per hundred words to 0.4, which is the range the publication's anchor authors measure at.

What it means for practice: nothing about databases moved, so yesterday's guidance is today's guidance. What it means for reading: the article now sounds the way the next ten versions will sound. The same argument, easier to follow, for a broader audience. If v2 sat half-read, v3 is the version to finish.

**Stance:** held — a voice edit by definition: the position carried over verbatim, re-argued in plainer sentences.

## v2 — 2026-07-16

What moved is the article, not the field. This is an operator-initiated editorial cut raising the entry to the mechanics bar its own benchmark sets — Designing Data-Intensive Applications, whose second edition (Kleppmann and Riccomini, 2026) confirms that bar is current. Four sections are new: the sixty-year data-model pendulum, transactions and isolation, replication and its lag anomalies, and partitioning; an index-economics lead-in now opens the storage section, and CAP/PACELC folds into the replication section where its mechanics live. The convergence section lands the carry-forward from the 14 July no-cut run — PostgreSQL 18's async I/O and B-tree skip scan — and Stonebraker and Pavlo's 2024 retrospective, in which the instigator of the specialised-engine era reads the pendulum as swung back toward the relational core.

What it means for practice: the entry now teaches the guarantees under the engine choice, not only the choice. A reader leaves knowing the isolation level they actually run (Read Committed nearly everywhere, and the lost updates and write skew it permits), the replication lag their application must design around (read-your-own-writes, monotonic reads), and why a partition key is a one-way door — the same discipline throughout: take the cheap guarantee, measure before you exit.

**Stance:** held — every mechanism added prices the second engine higher, not lower; Postgres-first with measured exits survives its own deepening.

## v1 — 2026-07-09

Founding cut. The topic covers the engine families a practitioner chooses between — relational, document, key-value, wide-column and columnar, vector, and graph — what each makes cheap, how to choose among them by measured access pattern, the storage-layer and consistency trade-offs underneath, and the convergence trend pulling the families together. The founding stance: start on a general-purpose relational database, which in 2026 means Postgres, and leave it only when a measured access pattern forces you out. Specialised engines are escape hatches, not starting points; the named exceptions are genuine global write scale, sub-millisecond cache reads, and billion-scale vector recall.
