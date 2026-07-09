# Databases — Changelog

## v1 — 2026-07-09

Founding cut. The topic covers the engine families a practitioner chooses between — relational, document, key-value, wide-column and columnar, vector, and graph — what each makes cheap, how to choose among them by measured access pattern, the storage-layer and consistency trade-offs underneath, and the convergence trend pulling the families together. The founding stance: start on a general-purpose relational database, which in 2026 means Postgres, and leave it only when a measured access pattern forces you out. Specialised engines are escape hatches, not starting points; the named exceptions are genuine global write scale, sub-millisecond cache reads, and billion-scale vector recall.
