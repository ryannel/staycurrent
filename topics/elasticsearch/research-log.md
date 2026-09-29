# Elasticsearch and OpenSearch — Research Log

## 2026-09-29 — cut v1

Founding run. Started from the search and licence notes gathered for the databases overview, then went deeper on the mechanisms: Lucene's segment structures, the translog and refresh cycle, the write and read models, quorum-based master election, shard sizing, data tiers, aggregation accuracy, pagination, vector index types on both engines, and the managed offerings.

Around fifty-five sources examined. The Elastic and OpenSearch documentation sites, the Elastic blog, opensearch.org, aws.amazon.com, docs.aws.amazon.com, lucene.apache.org, and endoflife.date were all blocked by the environment's proxy. The Elastic reference documentation was instead read from its source in the `elastic/elasticsearch` and `elastic/docs-content` GitHub repositories, and the OpenSearch documentation from `opensearch-project/documentation-website`; those are fetched primary sources and are cited by their GitHub paths. Release dates came from the GitHub release pages for both projects and the OpenSearch release notes in `opensearch-project/opensearch-build`.

Confirmed from indexed content only, because the page could not be fetched: the Elastic 9.0 and 9.4 announcement blogs, the AGPL announcement blog, the JVM settings page, the cluster coordination blog, the mapping explosion page, the dynamic field mapping page, the Elastic Serverless pricing page, the Amazon OpenSearch Service pricing page and the third-party summaries of it, the OpenSearch 3.7 and 3.8 announcement blogs, the OpenSearch breaking-changes page, the rolling upgrade pages, the Rally benchmark figures, and the Wikipedia and LWN pages on the fork and foundation history. The AWS pricing figures in particular should be re-verified against the page before the next cut.

Facts asserted from my own knowledge rather than a fetched page are listed under Synthesis in the provenance: Lucene's term dictionary and points structures, the pre-7.0 `minimum_master_nodes` default, the request cache default size, the licence tier of cross-cluster replication, and the years on GitHub tag dates that show only day and month.

No lab measurements were run for this version; every figure is a vendor's documented default, limit, price, or published benchmark.
