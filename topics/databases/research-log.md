# Databases — Research Log

## 2026-09-29 — cut v1

Founding run. Four parallel research passes covered the relational and distributed SQL tier, the non-relational operational stores, the analytical engines and lakehouse formats, and the specialised stores plus the field's direction, each returning sourced facts with access dates.

Around fifty primary sources examined: vendor documentation and release notes for every engine named, the licence texts on GitHub, the Aurora and Snowflake architecture papers, the Stonebraker and Pavlo 2024 retrospective, the 2025 Stack Overflow survey, and the DB-Engines ranking. Several vendor documentation sites could not be fetched directly and were confirmed through their indexed content; those are flagged in the provenance for re-verification.

The stance was set at the founding: Postgres first, with three named exits. No lab measurements were run for this version; every figure quoted is a vendor's documented limit or price.

An editorial and accuracy pass was applied before publication. It replaced the four-questions diagram with a drawing of the three replication write paths, linked every engine in the decision table and worked examples to its deep dive, and corrected the Elastic AGPL date, the ClickHouse patch-part version, the Postgres full-text fuzziness claim, the Cassandra partition limit, the Stack Overflow population, the MySQL 9.7 community feature list, the Valkey launch interval, and the YugabyteDB default-isolation wording.
