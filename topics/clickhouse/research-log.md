# ClickHouse — Research Log

## 2026-09-29 — cut v1

Founding run. Examined the ClickHouse release list and CHANGELOG on GitHub for the 26.x releases and LTS status, the LICENSE file, and the full documentation source as checked into the ClickHouse and clickhouse-docs repositories (the reference pages for MergeTree, replication, Distributed, UPDATE and DELETE, the settings pages with their defaults, the core-concepts pages on parts, merges, partitions and primary indexes, the VLDB paper web version, the SharedMergeTree, parallel replicas, warehouses, backups, billing and tiers pages for Cloud, the sizing guide, the Kafka, Iceberg and data lake pages, and the 2025 and 2026 changelogs).

The clickhouse.com domain is blocked by this environment's proxy, so every docs page was read from the repository source rather than the rendered site; the provenance cites the public URL for each. Blog posts and a few pages could only be confirmed from indexed search content: the 25.7 and 25.8 release blogs, the 26.9 release blog, the data-loading benchmark, the parallel replicas blog, the HyperDX acquisition post, the ClickPipes billing page, and the Yandex and ClickHouse, Inc. history posts. Third-party pricing summaries were used only as a cross-check on the docs' worked billing examples.

DuckDB, Snowflake and BigQuery facts came from the analytical research notes gathered for the Databases overview on the same date. No lab measurements were run; every figure is a documented default, a docs example, or a vendor benchmark, and the capacity worked example is labelled as using assumed inputs.
