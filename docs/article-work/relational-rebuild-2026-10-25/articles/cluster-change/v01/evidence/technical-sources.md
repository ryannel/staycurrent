# Technical sources

Checked 25 October 2026 against external primary sources.

| Source | Consequential checks |
| --- | --- |
| [Raft extended paper](https://raft.github.io/raft.pdf), §§6–7 | Independent old/new majorities; joint agreement/elections; latest received configuration taking effect before commitment; joint commitment preceding proposal of final new entry; final entry committed under new rules; non-voting catch-up; snapshot last index/term/configuration; a newer snapshot when continuation is gone. |
| [etcd learner design](https://etcd.io/docs/v3.5/learning/design-learner/) | Empty new members, leader/network pressure, learners and catch-up before promotion. |
| [etcd runtime reconfiguration](https://etcd.io/docs/v3.5/op-guide/runtime-configuration/) | Working quorum needed to reconfigure; supported incremental changes; maintenance one member at a time. No etcd commands are prescribed. |
| [CockroachDB replication layer](https://www.cockroachlabs.com/docs/stable/architecture/replication-layer) | Snapshot-based transfer, replay, constrained placement and replica counts not necessarily equal. No engine-specific membership schedule is claimed. |
| [CockroachDB node shutdown](https://www.cockroachlabs.com/docs/stable/node-shutdown) | Distinction between draining and decommissioning; stored replicas are not evacuated merely by draining. |
| [CockroachDB setup troubleshooting](https://www.cockroachlabs.com/docs/stable/cluster-setup-troubleshooting#decommissioning-process-hangs-indefinitely) | Decommission stalls when available replacement nodes/storage are insufficient. |

The Raft text was checked at the configuration-entry and snapshot paragraphs, not inferred from generic quorum arithmetic. The copy and membership drawings remain explicit conceptual models. The figure tests implement only stated sets/counts, not election/log safety or a complete Raft implementation.

`verify.mjs` runs the exact displayed catalogue UPDATE against the complete small shared fixture in an owned disposable in-memory PGlite 0.5.8 instance. Its actual runtime reports PostgreSQL 18.3 on wasm32-unknown-emscripten; it is closed in `finally`. `verification.json` retains exact version, query, rows, arithmetic results, source hashes and limits. No native server was required or used; no transfer, replication, storage flush, distributed agreement or timing result was observed.
