# CockroachDB — Changelog

## v1 — 2026-09-29

The founding cut. This piece profiles CockroachDB as it stands in September 2026, at version 26.2, at the depth a Staff+ engineer needs for a system-design deep dive.

It walks the five architectural layers and the mechanisms under them: ranges of 512 MiB with a Raft group each, leaseholders that serve reads without consensus, leader leases, Pebble's log-structured merge tree with MVCC and a four-hour garbage collection window, hybrid logical clocks with a 500 ms offset bound, and the transaction protocol of write intents, transaction records, pipelining, parallel commits, and the buffered writes that became the default in 26.2. It covers serialisable isolation and the client retry loop it demands, read committed as the trade, indexing and the hotspots that sequential keys cause, replication and what failover costs, multi-region survival goals and table localities with their write-latency price, scaling limits and node sizing, the CP behaviour under partition, backups and rolling upgrades, the November 2024 licence change, and Cloud pricing. YugabyteDB, TiDB, and Aurora DSQL each get a paragraph where they differ, and eleven interview questions close it out with the answers a strong candidate would give.
