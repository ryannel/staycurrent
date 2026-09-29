# Databases — Changelog

## v1 — 2026-09-29

The founding cut. This article maps the database landscape as it stands in September 2026: what is out there, how each kind of engine works underneath, which problem it solves, what it gives up, and where it stops being the right choice.

It opens with a way to read any engine as four choices, storage layout, concurrency, replication and partitioning, and query surface, then covers the families in turn: the general-purpose relational engines, the managed Postgres tier that rebuilds the storage layer underneath, distributed SQL, document stores, wide-column and key-value stores, in-memory stores, the analytical engines and the lakehouse, and search, vector, time-series, graph, and embedded engines. It closes with a procedure for choosing by access pattern, four worked cases, and the year's movements: Postgres consolidating as the vendors buy their way in, the licence wave and its foundation-backed forks, storage moving to object storage, vector search becoming a feature, and Iceberg winning the table-format contest.

The stance: use Postgres unless you have a specific reason not to, and in 2026 there are three good ones. You need writes in several regions at once, reads in under a millisecond, or vector search over billions of rows.
