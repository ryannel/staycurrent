# DynamoDB — Changelog

## v1 — 2026-09-29

The founding cut. This piece is the deep dive behind the DynamoDB paragraph in the databases overview, written so that a Staff+ engineer can explain the service in a system-design interview: how it works underneath, how it scales, what it promises under failure, how it is indexed, what it costs, where it breaks, and what to do about it.

It covers the architecture from the 2022 USENIX ATC paper (request routers, MemDS, partitions as three-zone Multi-Paxos groups, leader leases, storage and log replicas, global admission control, split for heat), the data model and the three index types including the August 2026 vector index, transactions and their exact isolation rules, in-region replication and the two global-table modes including multi-Region strong consistency, partition limits and write sharding, on-demand versus provisioned capacity with the November 2024 prices, backups, streams, TTL, the documented limits, and twelve interview questions with a worked sessions-store sizing. It closes with the changes from November 2024 to September 2026, including the October 2025 us-east-1 DNS event.
