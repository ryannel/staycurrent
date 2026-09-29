# Redis and Valkey — Research Log

## 2026-09-29 — cut v1

Founding run for the profile, building on the in-memory section of the databases overview researched the same day.

Examined: the Valkey documentation on replication, persistence, the cluster specification and tutorial, atomic slot migration, Sentinel, eviction, expiry, memory optimisation, transactions, scripting, functions, streams, pub/sub, distributed locks, pipelining, benchmarking, clients, client-side caching and the INFO fields, all read from the valkey-doc GitHub source; the Redis documentation on replication, scaling, latency, memory optimisation, hashes, JSON and vector sets, read from the redis/docs GitHub source; the shipped `redis.conf` and `valkey.conf` for every default quoted; the 00-RELEASENOTES files on the Redis 7.4, 8.0, 8.2, 8.4, 8.6, 8.8 and 8.10 branches and the Valkey 8.0, 9.0, 9.1 and 9.2 branches for release dates and headline features; Redis's LICENSE.txt; the valkey-search and valkey-json repositories; the Memcached man page, protocol and storage documents and the 1.6.45 release notes; the Dragonfly README, licence and 2.0.0 release; and the AWS Price List API for ElastiCache in us-east-1, published 14 September 2026, which supplied every ElastiCache figure.

Confirmed from indexed content rather than fetched, because the domains are blocked by this environment's proxy: the two Redis licence blog posts (March 2024 and the AGPLv3 post), the three Linux Foundation press releases on Valkey's launch, 9.0 and 9.1, the Valkey million-RPS benchmark post, and the AWS announcement of Valkey 9.1 on ElastiCache. Martin Kleppmann's distributed-locking post could not be fetched or found through search and is summarised from prior knowledge; it should be re-read at the next run. The Memorystore, Redis Cloud and Upstash pricing pages could not be fetched, so the article describes their pricing shape without figures.

No lab measurements were run. Every throughput and latency number is the vendor's own documented figure, and the capacity examples are arithmetic on those figures.
