# Technical source record · 25 October 2026

Primary sources checked externally, using versioned v26.2 documentation rather than assuming current stable behaviour. Documents sometimes retain generic historical subsections; the article follows their explicit leader-leases/current-version contract and makes no benchmark claims.

- https://www.cockroachlabs.com/docs/v26.2/architecture/sql-layer — gateway connection, planning and distributed SQL execution, PostgreSQL protocol. Article SQL lookup is separately verified natively.
- https://www.cockroachlabs.com/docs/v26.2/architecture/distribution-layer — ordered map, range boundaries/descriptors, cached routing and refresh; ranges do not equal tables/indexes.
- https://www.cockroachlabs.com/blog/sql-in-cockroachdb-mapping-table-data-to-key-value-storage/ — primary/secondary key representation and primary-key locator. Human-readable figure labels are explicitly schematic; no physical byte encoding claimed.
- https://www.cockroachlabs.com/docs/v26.2/column-families — default family and grouped KV values. Native SHOW CREATE confirms the example schema but omits the default family; the default-family explanation is documented rather than a physical-KV inspection.
- https://www.cockroachlabs.com/docs/v26.2/indexes — index storage and STORING/covering alternative. No claimed optimiser choice for the three-row figure.
- https://www.cockroachlabs.com/docs/v26.2/online-schema-changes — existing-row backfill and ongoing writes, resource costs. Parent establishes why work exists; child owns schema-job handling.
- https://www.cockroachlabs.com/docs/v26.2/architecture/replication-layer — per-range Raft group, voters/non-voters, leaseholder, co-location except transfer. No published failover timings adopted.
- Kettaneh et al., SIGMOD Companion2026, https://assets.ctfassets.net/00voh0j35590/2EHUM3hbvPrvrYle4IAB5c/f5ad2be3b27726d04715e40785dd086c/leader-leases-paper-2.pdf — sections2–3, stronger leadership and leases, per-group operation and cross-group transaction distinction. PaperCC-BY4.0. The figure is independently drawn from protocol concepts; not copied artwork.
- https://www.cockroachlabs.com/blog/distributed-database-leader-leases/ — authors' explanation of leaseholder/leader alignment and range groups. Performance claims omitted.
- https://www.cockroachlabs.com/docs/v26.2/architecture/storage-layer — store, Pebble, immutable sorted files, flush and compaction. The model omits caches, level counts and separated values.
- https://www.cockroachlabs.com/blog/value-separation-pebble-optimization/ — sorted runs, rewrite work and value-separation qualification. No absolute claim that all values remain inside every SST.
- https://www.cockroachlabs.com/blog/write-ahead-log-failover/ — local WAL/memtable recovery role, distinct from replicated Raft ordering.
- https://www.cockroachlabs.com/docs/v26.2/architecture/transaction-layer — MVCC, current/historical read contract, retained/safe history, transaction outcome separate from range command replication. Intents/retries deliberately delegated to child.
- https://www.cockroachlabs.com/docs/v26.2/load-based-splitting — load eligibility needs beneficial key separation; not guaranteed by a threshold alone.
- https://www.cockroachlabs.com/docs/v26.2/understand-hotspots — row hotspot and advancing edge; no observed traffic attributed to native fixture.
- https://www.cockroachlabs.com/docs/v26.2/show-ranges — actual node IDs, interval fields, lease holder and voter/non-voter fields; listing is placement evidence, not workload/health acceptance.
- https://www.cockroachlabs.com/docs/v26.2/upgrade-cockroach-version — binary versus major-version finalisation; automatic finalisation default and closed downgrade boundary. No rollout instructions in parent.

Local facts and arithmetic are supplied shop facts, not borrowed measurements. No external text quoted verbatim beyond product/technical names. Native provenance, guards, raw results and verifier are retained alongside this file. Attempts01 and02 timed out at CREATE INDEX after30s and90s and are archived honestly, without claiming later statements ran. The narrowed successful verifier inspects only the primary index and then observes the manual split and price update.
