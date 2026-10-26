# Primary sources and verification

Checked 26 October 2026. Pinned documentation language: PostgreSQL18 and Citus13.0.1. No claim about a later Citus version or observed Citus execution.

- https://www.postgresql.org/docs/18/ddl-partitioning.html — ordinary partitions within an instance, partition-parent storage, foreign partitions and bound responsibility. Local partition detail left to neighbouring owner.
- https://www.postgresql.org/docs/18/sql-prepare-transaction.html — durable prepared work, external transaction manager and retained locks. Distributed commit protocol left to prerequisite.
- https://docs.citusdata.com/en/v13.0/sharding/data_modeling.html — compatible hash ranges/placements, customer-local work, query fan-out and skew.
- https://docs.citusdata.com/en/v13.0/develop/api_udf.html — create_distributed_table/explicitcolocate_with; citus_move_shard_placement co-located movement/modes; rebalance background state versus completed movement. Used as documented capability, no invented Citus output.
- https://docs.citusdata.com/en/v13.0/develop/reference_ddl.html — unique/primary keys include distribution column; supported foreign-key directions; reference-table write coordination.
- https://www.postgresql.org/docs/18/postgres-fdw.html — remote filter/projection/same-serverjoin optimisation; EXPLAIN VERBOSE; connection/user mapping; per-remote Repeatable Read/Serializable and no remote prepare. Real plan inspected separately; sort was local, not included in remote SQL.
- https://www.postgresql.org/docs/18/explicit-locking.html — transaction-held row locks and SHARE conflicts with closing UPDATE. Native observation tests the particular fixture, not all possible writer paths.
- https://www.postgresql.org/docs/18/logical-replication-restrictions.html — native logical replication is only part of movement; schema/sequence/large-object scope must be addressed.

## Execution

`verify-sql.mjs` created one disposable in-memory PGlite0.5.8/PG18.3 instance, retained SQL and exact results in sql-results.json, and closed it in finally. Pair-key counterexample, duplicate pair23505, mismatchedcustomerFK23503, ID-onlyFK42830; ordinary candidate join10139.50/10329; core report customer240/customer139.50; generatedcustomer1001count84000/120000. Citus extension syntax was not executed there.

Root inspected and executed native-verifier.sh verbatim, SHA2563875afc9e23def12936aad66ffa4179d680422653940df1bb6b210e8815287ae. native-executed-verifier.sh retains exact run source; native-execution.json/identity artifacts record pinned official image digest and actual18.6 runtime. Three clusters C/S/D had separate system IDs/data directories and Unix sockets, listen_addresses empty,32MB shared_buffers, inside one network-none disposable container without ports/mounts. Native stdout/stderr, tarred per-stage outputs, cleanup and root fixture record retained.

Native checks: remote filter/projection and local sort; same-foreign-server join+sum pushed down; outputs10139.50/10329. Gate closer observed waiting Lock/transactionid while admitted client slept with shared gate lock; stable group exact row comparison,103value29/no103payment; routeUPDATE1 D epoch2; oldS explicitgateerror; D retry103; changedpayloadexpliciterror; route-alone counterexample accepts103; final gatesSfalse/Dtrue. All expected outcomes asserted. Root reports exit0 and fixture removal.

Limits: no complete cross-owner purchase, product foreign-key enforcement, real authentication or production privilege boundary, Citus runtime, failure-domain independence, controller crash recovery, WAL stream/movement, measured traffic or benchmark timing. No general failover/fencing guarantee follows from the script.
