# MongoDB — Changelog

## v1 — 2026-09-29

The founding cut. This is the deep dive on MongoDB as it stands in September 2026, written so that a Staff+ engineer can get through a system-design interview on it: how BSON documents sit in WiredTiger's B-trees and cache, what a write passes through before it is durable and what each write concern actually waits for, how a replica set elects a primary with its Raft-derived protocol and what a rollback discards, how a sharded cluster splits ranges and moves them, and how to choose a shard key and change it later.

It covers the index types and the ESR rule, covered queries, index build behaviour, embedding versus referencing with the bucket and outlier patterns, time-series collections, change streams, multi-document transactions and their limits, read concern and causal sessions, the separate `mongot` process behind search and vector search and its arrival in 8.2 for self-managed servers, Queryable Encryption, backups and point-in-time recovery, the signals to monitor, capacity maths, Atlas pricing, the SSPL and the FerretDB case, and the 8.0, 8.2 and 8.3 releases. It closes with eleven interview questions, including a shard-key design, what `w:"majority"` guarantees, and why a primary-secondary-arbiter set stalls when its secondary is lost.
