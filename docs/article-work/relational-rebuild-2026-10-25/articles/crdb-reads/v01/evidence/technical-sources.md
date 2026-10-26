# Technical sources · checked26October2026

Primary CockroachDB v26.2 documentation was opened through web browsing; no secondary source supports a consequential claim.

- https://docs.cockroachlabs.com/docs/v26.2/read-committed — default/effective level, enabled setting, per-statement snapshots, PostgreSQL distinction, anomalies, abort/streaming limits.
- https://docs.cockroachlabs.com/docs/v26.2/transactions — Serializable default, complete transaction scope.
- https://docs.cockroachlabs.com/docs/v26.2/architecture/transaction-layer — per-transaction/per-statement read snapshots, read refreshing, closed timestamp promise tied to required applied Raft position. Read-snapshots/closed-timestamps passages were reopened while designing Figure3.
- https://docs.cockroachlabs.com/docs/v26.2/as-of-system-time — chosen committed past, read-only restrictions, relative timestamp recomputation, exact/minimum/maximum forms.
- https://docs.cockroachlabs.com/docs/v26.2/follower-reads — exact vs bounded, probability not local-service guarantee, long-running intents, nearest_only, documented implicit single-statement/single-row/no-index-join limits, executed follower annotation. Full relevant limitations and verification passages read.
- https://docs.cockroachlabs.com/docs/v26.2/global-tables — strong current follower reads and increased write cost; deeper locality policy remains neighbour-owned.
- https://docs.cockroachlabs.com/docs/v26.2/configure-replication-zones and https://docs.cockroachlabs.com/docs/v26.2/show-zone-configurations — zone inheritance, gc.ttlseconds, effective target, storage/retention context.
- https://docs.cockroachlabs.com/docs/v26.2/explain-analyze — historical, SQL/KV nodes, regions and used follower read fields.

## Observed SQL

Root supplied pinned official v26.2.8 image digest and verified fixture identity. First run evidence: root-fixture.json, root-connection.json, native-results.json, native-execution.json and server/cleanup records. Native source `verify-native-v1.mjs` SHA256a9cc8b8cc6a45f9130f0c60eec7f18c4fdab98dd9680e488950a84f891ea1bd7. The file was briefly extended for the later snippet, then reconstructed by exactly reversing those two additions; SHA confirmed identical to executed before/after hash. `verify-native.mjs` now also has those exact original bytes. The intermediate extended version8a602419… was never executed and is not evidence.

Observed: defaultSER; SER20/20, RC20/22; paymentsRC40.00 vs SER20.00 with attempt60240001; fixed earlier history20.00, stock10/0/4; historical UPDATE25006; freshcurrent22.00. Exact, bounded, minimum and nearest-only syntax returned22.00. Convenience age was4.199987s in that run, not a universal setting claimed by the article. Bounded multirow/explicit transaction attempts failed0A000; actual multirow error wording says more than one range, whereas docs retain conservative single-row limits. Article states documented path rather than inferring expanded support from an error message. Effective config inherited RANGEdefault gc.ttlseconds14400, num_replicas1. Executed bounded plan historical/local/n1SQL/n1KV and no used-follower annotation.

History-only supplement: verify-history-supplement.mjs / history-verifier.mjs SHA256b929555e00a00c35e17901a90ea80ef6d288f5eae8fef94bf8bb5bd48f2f20ab; root-history-fixture/connection, history-execution/results/server-tail/cleanup. Exact article multi-statement AS OF follower_read_timestamp snippet returned P7old20.00 and both agreed103lines; fresh current query returned22.00. This supplements rather than reruns unaffected checks.

Limits: single-node native correctness only. No actual follower/leaseholder path, multi-range distributed execution, region, latency, availability, failure recovery or GC-threshold rejection was measured. Min-history lookup did not demonstrate a trusted postcommit dependency. Closure drawings and schedules are labelled conceptual. No runnable download is promised. Both owned fixtures were removed by root.
