# Databases — Changelog

## v2 — 2026-07-16

What moved is the article, not the field. This is an operator-initiated editorial cut raising the entry to the mechanics bar its own benchmark sets — Designing Data-Intensive Applications, whose second edition (Kleppmann and Riccomini, 2026) confirms that bar is current. Four sections are new: the sixty-year data-model pendulum, transactions and isolation, replication and its lag anomalies, and partitioning; an index-economics lead-in now opens the storage section, and CAP/PACELC folds into the replication section where its mechanics live. The convergence section lands the carry-forward from the 14 July no-cut run — PostgreSQL 18's async I/O and B-tree skip scan — and Stonebraker and Pavlo's 2024 retrospective, in which the instigator of the specialised-engine era reads the pendulum as swung back toward the relational core.

What it means for practice: the entry now teaches the guarantees under the engine choice, not only the choice. A reader leaves knowing the isolation level they actually run (Read Committed nearly everywhere, and the lost updates and write skew it permits), the replication lag their application must design around (read-your-own-writes, monotonic reads), and why a partition key is a one-way door — the same discipline throughout: take the cheap guarantee, measure before you exit.

**Stance:** held — every mechanism added prices the second engine higher, not lower; Postgres-first with measured exits survives its own deepening.

## v1 — 2026-07-09

Founding cut. The topic covers the engine families a practitioner chooses between — relational, document, key-value, wide-column and columnar, vector, and graph — what each makes cheap, how to choose among them by measured access pattern, the storage-layer and consistency trade-offs underneath, and the convergence trend pulling the families together. The founding stance: start on a general-purpose relational database, which in 2026 means Postgres, and leave it only when a measured access pattern forces you out. Specialised engines are escape hatches, not starting points; the named exceptions are genuine global write scale, sub-millisecond cache reads, and billion-scale vector recall.
