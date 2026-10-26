# Primary-source claim check · 26 October2026

All sources below are official PostgreSQL18 documentation, opened via web tool. No secondary source supplies a technical claim. No direct quotations in reader prose.

| Claims | Primary source |
| --- | --- |
| Logical versus physical; single-subscription transaction consistency | https://www.postgresql.org/docs/18/logical-replication.html |
| pgoutput/apply; replica trigger role; table snapshot/catch-up/visibility/handover | https://www.postgresql.org/docs/18/logical-replication-architecture.html |
| Primary-key/default/FULL/identityless write refusal; subscriber identity | https://www.postgresql.org/docs/18/logical-replication-publication.html |
| Qualifying USING INDEX requirements and old identity logging | https://www.postgresql.org/docs/18/sql-altertable.html#SQL-ALTERTABLE-REPLICA-IDENTITY |
| Named mapping, text type conversion, target extras, normal slot/table-sync lifecycle | https://www.postgresql.org/docs/18/logical-replication-subscription.html |
| copy_data, streaming off/parallel, password_required, failover flags | https://www.postgresql.org/docs/18/sql-createsubscription.html |
| Refresh does not recopy prior tables even after filter change; pause; whole-transaction skip | https://www.postgresql.org/docs/18/sql-altersubscription.html |
| Row identity/filter restrictions, UPDATE→INSERT/DELETE, initial copy, OR composition | https://www.postgresql.org/docs/18/logical-replication-row-filter.html |
| Column identity inclusion, initial copy, future added columns, security limitation | https://www.postgresql.org/docs/18/logical-replication-col-lists.html |
| Sender/slot/origin/worker/synchronisation capacity | https://www.postgresql.org/docs/18/logical-replication-config.html |
| Replication/SELECT/CREATE/ownership/SET ROLE and publication-access limits | https://www.postgresql.org/docs/18/logical-replication-security.html |
| DDL, sequences, TRUNCATE relationships, large objects, FULL types | https://www.postgresql.org/docs/18/logical-replication-restrictions.html |
| Readiness r and copy state versus ready | https://www.postgresql.org/docs/18/catalog-pg-subscription-rel.html |
| Worker types/receipt/reported LSNs/error/conflict counters; found exact field definitions | https://www.postgresql.org/docs/18/monitoring-stats.html#MONITORING-PG-STAT-SUBSCRIPTION |
| restart/confirmed positions, WAL status, safe size, inactivity/invalidity/catalogue retention | https://www.postgresql.org/docs/18/view-pg-replication-slots.html |
| output_plugin_libraries; retention limit and idle expiry at checkpoint | https://www.postgresql.org/docs/18/runtime-config-replication.html |
| Stopping conflicts; local overwrite; missing-row skips; skip loses all transaction changes | https://www.postgresql.org/docs/18/logical-replication-conflicts.html |
| Crash redelivery, slots independent of connection, snapshot/stream boundary, failover slot configuration | https://www.postgresql.org/docs/18/logicaldecoding-explanation.html |
| Crash-safe apply progress/origins | https://www.postgresql.org/docs/18/replication-origins.html |
| Exact standby readiness: all slots present/synced/persistent/uninvalidated; async sync | https://www.postgresql.org/docs/18/logical-replication-failover.html |

Native execution supports only stated small-run observations. No production role setup, schema failure, filter execution, slot-loss, external receiver, publisher failover, independent host failure or storage-survival claim is reported as observed. Those are documented behaviour or explicitly conceptual models.
