# CockroachDB — Research Log

## 2026-09-29 — cut v1

Founding run for the technology deep dive. The cockroachlabs.com domain is blocked by this environment's proxy, so every documentation page was read from the source of the docs site in the `cockroachdb/docs` GitHub repository (the v26.2 tree and its includes), and the cluster-setting defaults from the generated `settings.html` on the `release-26.2` branch of `cockroachdb/cockroach`. Release dates come from the docs repository's `releases.yml`. Those are the primary sources, read in full rather than confirmed from indexed content.

Examined: the five architecture-layer pages, the life-of-a-transaction walkthrough, the transaction retry error reference, the read committed page, follower reads, hash-sharded indexes, the hotspots guide, replication zones, multi-region overview, survival goals, table localities, global tables, the multi-region configuration guide, the cost-based optimiser page for locality-optimised search, recommended production settings, common issues to monitor, monitoring and alerting, backups and restore, disaster recovery, physical cluster replication, upgrade includes, changefeed pages, the index type pages, the licensing FAQ include, the v26.2.0 release notes include, the Cloud planning and cost pages, and the request-unit include.

YugabyteDB facts come from the docs source in the `yugabyte/yugabyte-db` repository (isolation levels, read committed, DocDB, replication, sharding, the v2026.1 release notes). TiDB facts come from the `pingcap/docs` repository (architecture, storage, TiFlash, isolation, limitations, the 8.5.0 notes and release timeline) and the TiKV and TiDB licence files.

Confirmed only from indexed content, not fetched, because the domains are blocked: the Aurora DSQL quotas, GA date, pricing, and August 2026 foreign-key announcement (aws.amazon.com and docs.aws.amazon.com); the CockroachDB Cloud per-vCPU rates and the reported September 2026 plan changes (cockroachlabs.com/pricing); and the interleaved-table removal in v21.2, whose release notes are no longer in the docs repository (the generated grammar on the `release-21.2` branch still contains `INTERLEAVE IN PARENT` and the `release-22.1` branch does not). The founding date and the 2019 Business Source License move are from general knowledge and are marked as synthesis in the provenance.

No lab measurements were run for this version. Every figure quoted is a vendor's documented default, limit, or test result.
