# ClickHouse — Changelog

## v1 — 2026-09-29

The founding cut. This profile explains ClickHouse as it stands in September 2026, at version 26.9 with 26.8 as the current LTS, for someone who has to design on it and defend the design in a system-design interview.

It walks through the MergeTree storage engine (parts, granules, the sparse primary index, marks, codecs), the write path from INSERT to part to background merge, the read path and why point lookups are slow, the ORDER BY key as the decision that shapes everything, partitions, skip indexes, projections and materialised views. It covers the three ways rows change (mutations, lightweight deletes, and the patch-part UPDATE introduced in 25.7), replication through Keeper with insert quorum and replica lag, Cloud's SharedMergeTree on object storage with compute-compute separation and parallel replicas, sharding with the Distributed engine and GLOBAL IN, joins, backups, upgrades, TTL and tiered storage, the sizing ratios and Cloud cost model, Kafka ingestion and ClickStack, Iceberg and Delta writes, the documented performance numbers, and where ClickHouse is the wrong choice. DuckDB and the cloud warehouses are placed against it, and ten interview questions with model answers close the piece.
