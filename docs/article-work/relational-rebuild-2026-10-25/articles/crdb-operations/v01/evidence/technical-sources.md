# Technical sources and evidence

Primary documentation checked 26 October 2026, pinned v26.2 paths (Cockroach Labs redirects www.cockroachlabs.com/docs to docs.cockroachlabs.com/docs). No PostgreSQL/PGlite result used to establish CockroachDB behaviour.

| Source | Consequential claim checked |
| --- | --- |
| https://www.cockroachlabs.com/docs/v26.2/security-reference/transport-layer-security and /connection-parameters | Server trust/name verification; node vs client identity; TLS connection parameters |
| https://www.cockroachlabs.com/docs/v26.2/create-role and /grant | NOLOGIN groups, membership, BYPASSRLS and grantable authority |
| https://www.cockroachlabs.com/docs/v26.2/show-grants and /show-roles | FOR resolves inherited grants; object form without FOR lists direct grants; options/membership |
| https://www.cockroachlabs.com/docs/v26.2/show-default-privileges | Future-object audit; shown as documented syntax, not claimed executed |
| https://www.cockroachlabs.com/docs/v26.2/row-level-security and /create-policy | Ordinary privileges remain required; USING/WITH CHECK; policy combination; FORCE, exceptions and non-ordinary access paths |
| https://www.cockroachlabs.com/docs/v26.2/create-view | Default owner privileges and RLS evaluation; security_invoker alternative |
| https://www.cockroachlabs.com/docs/v26.2/set-vars | SET LOCAL lifetime and session baseline; native output independently checked |
| https://www.cockroachlabs.com/docs/v26.2/cockroach-node | CLI addresses/target IDs, timestamps, counts, flags and response fields |
| https://www.cockroachlabs.com/docs/v26.2/show-ranges and /show-zone-configurations | Current ownership snapshot, voting/nonvoting/learner lists and effective inherited replication configuration |
| https://www.cockroachlabs.com/docs/v26.2/metrics | ranges.unavailable is fewer live replicas than quorum; ranges.underreplicated fewer live replicas than target |
| https://www.cockroachlabs.com/docs/v26.2/cluster-setup-troubleshooting | Problem ranges → range report/allocator; blocked evacuation diagnostics |
| https://www.cockroachlabs.com/docs/v26.2/node-shutdown | Temporary drain vs permanent removal; pre-flight excludes free disk; final membership; recommission only while decommissioning |

## Native scope

Root owns all provisioning/execution/cleanup. input/engine-runtime.json records official v26.2.8, pinned digest1ad58b6a69928691e0c9289b847dcb35ac25108c6ead23fcabf47e37b9195e9a. input/native-runtime.json supplies guarded UUID64c14368-e7cf-4fb1-8a00-b4b13c1fa30e, DBsc_crdb_operations, markerstaycurrent-crdb-operations-20261025, exact container ID, TLS and resource limits. Four isolated processes/shared host; no independent failure domains, region latency or production capacity. Root native wrappers retain exact commands/stdin, assertions, hashes, exits and output; no private keys supplied to this writer.

- native-security-01: actual shop_runtime/shop_migrate/shop_support certificate logins. Writer inspected every case's stdout/stderr, not only exit summaries. Customer1–3 reads/Rowan exclusion, context20 exposure, commit/rollback clearing, retained baseline20 counterexample; support exact fields/no base/payment/write/schema paths; runtime no GRANT/role escape; FORCE ordinary-owner, admin and BYPASSRLS cases; FK23503 for(10,4); stored rows unchanged. DML/SET LOCAL observations valid. Original DDL counterexamples auto-committed and did NOT roll back: preserved as a discovered limitation, not silently accepted.
- native-security-supplement-01: explicit restore ENABLE/FORCE, native public CREATE revocation and runtime denial, owner NO FORCE and runtime disabled-policy counterexamples with real local tenant10, explicit restoration/fresh runtime/support/migration reads and no-context0. SHOW CREATE confirms final policy and audit confirms no PUBLIC CREATE. Failed CLI --set experiment retained and not treated as SQL success.
- native-operations-01: hostname mismatch x509127.0.0.2 vs127.0.0.1; unrelated trust CA unknown-authority failure; mismatched support client certificate cannot authenticate runtime(SQLSTATE28000). Separate certificate-based native identity connections in security run supply positive result. The standalone tls-verified command's stdout is empty; no identity row is inferred from that file. SQL SET autocommit_before_ddl=false permits isolated migration CREATE/ROLLBACK, independently checked absent table. Unsupported-internals refusal retained, not cited as a zero metric.
- native-membership-01: target node ID2 maps to process4/port26260; all baseline status health counts0; selected range83 covers orders with voters{1,2,3}, lease1, no nonvoters/learners; effective default num_replicas3. Root's explicitly enabled diagnostic-only internal metrics sample0 underreplicated/0 unavailable is node sample, not a new recommended unsupported SQL interface. Strict4→3 dry-run ready; drain completes while replicas remain; decommission43→0 progress still decommissioning; subsequent status membership decommissioned/gossiped0. Range83 then voters{1,3,4}, lease1. Three remaining node status snapshots show0 unavailable/underreplicated. Genuine runtime order read returns101/102paid,103pending. Strict3→2 dry-run allocation error,59blocking ranges, no actual second removal. Exact owned fixture removed, cleanup0.

No outage injection performed. Figure3 remains a documented quorum model. No recommission test, capacity benchmark, real pool/sign-in check, external routing test or disaster-recovery drill claimed. SHOW GRANTS ON ROLE and SHOW DEFAULT PRIVILEGES remain primary-documentation-based visible examples; not separately executed before fixture cleanup. Reader downloads not offered; private verifier files are evidence, not a supported production runner.
