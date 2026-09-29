# Cassandra and ScyllaDB — Changelog

## v1 — 2026-09-29

The founding cut. This piece profiles Apache Cassandra as it stands at 5.0.9 in September 2026, with ScyllaDB covered alongside as the C++ reimplementation and its differences called out where they change the answer.

It covers the Dynamo and Bigtable heritage; the ring, Murmur3, vnodes, gossip, and ScyllaDB's Raft-managed tablets; the commit log, memtable, and SSTable write path and the bloom-filter, cache, and read-repair read path; the four compaction strategies and ScyllaDB's ICS; tombstones and why repair is mandatory; hints and Merkle-tree repair; the consistency levels and W + R > RF; last-write-wins, lightweight transactions, batches, counters, and Accord's status in the 6.0 alphas; query-first modelling, partition sizing, the three index generations, vector search through SAI, and the materialised view caveats; multi-datacentre deployment and what a datacentre loss costs; scaling out with vnodes and tablets and the hot-partition problem; backups, upgrades, monitoring signals, and capacity maths; the managed offerings and their pricing; and twelve interview questions with worked answers.
