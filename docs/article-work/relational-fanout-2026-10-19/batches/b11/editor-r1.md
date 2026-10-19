# b11 — adversarial editor, round 1

Full breakdown review of a35–a38 against the original relational-practice goal; consolidation-only recheck of a08 against my b10 a33-fold finding. Reviewed assigned plans and contexts; no other review report was read.

## a08 — Choosing a relational database — repair recheck

**Pass.** The separate PostgreSQL child has been removed. Its useful output is preserved as a compact server-candidate record, with service restrictions and owners in the shared responsibility table, common evidence reused where applicable, and candidate-specific gaps/settings in the adoption record. This implements the requested consolidation without losing the starting configuration or acceptance gates. Unchanged scope was not reviewed again.

## a35 — Securing a relational service

**Pass.** Reachability, effective authority, protected copies, rotation, negative tests, audit/emergency access and compromise response each change a database operating decision. Keep one service and access map; no general-security descendants are justified.

- The opening and accepted/rejected connection examples should use that same map. Omit networking/authentication alternatives that do not alter its actual boundary.
- Ownership/default privileges and privileged routines earn attention because grants alone can misdescribe effective power. Retain one new-object example; avoid a general role or privileged-execution catalogue. Application authorisation stays with integration.
- Use one detailed credential rotation. Certificate/trust-root changes need only the additional consumer/reconnection and trust checks unless the worked deployment actually requires a full second procedure. The loss is an alternative walkthrough, not the rotation method.
- Reuse the initial positive/negative tests after rotation and compromise. Audit/emergency access should be one controlled evidence/access plan, not another incident framework. Keep key recovery as an input to the restore owner's rehearsal rather than teach restoration here.

## a36 — Monitoring and sizing a relational service

**Pass.** The dashboard and capacity worksheet supply operational decisions distinct from query tuning: detection, time to limits, resource headroom and failure/maintenance allowance. No monitoring-product or sizing-theory branch is needed.

- Fold “Measure outcomes at the right boundary” into the opening example. Briefly reuse performance/integration's definitions of completed work, queueing and unknown outcomes; do not derive them again.
- Rates/distributions and operating-constraint signals should share one dashboard interval. Keep the signal list a selection for the actual workload rather than a tour of every engine metric.
- Space budgeting and degraded/maintenance capacity are different useful calculations; retain them in one worksheet. Keep provider quotas and provisioning lead time attached to the choices they constrain.
- “Check the envelope” should reuse the established load/failover/restore evidence and state only what this capacity budget adds. The concluding intervention applies that evidence; it must not become another full performance diagnosis or incident procedure.
- Alerting earns a section through an owner, action and response deadline. Omit a wider observability/SLO-method catalogue. Useful loss: infrastructure-specialist breadth, not the ability to detect and act on database pressure.

## a37 — Maintaining and upgrading a relational service

**Pass.** Upkeep progress and an engine upgrade require concrete operator judgement that physical-storage or live-schema articles do not replace. Keeping them together is justified by the shared controlled-change method.

- The four recurring duties should remain a compact evidence-to-action table. Link retained-version, statistics and file-layout mechanisms; do not retell the performance articles or supply every maintenance command as a separate procedure.
- Use one diagnosed upkeep action to establish budgets and stop conditions. The upgrade should then reuse that format rather than introduce a second change-management checklist.
- Compatibility, rehearsal, execution gates and service validation each earn their stage. Keep one supported version transition and method as the full runbook; alternatives need only the differences that change interruption or recovery. Do not add a product/version-pair catalogue.
- Reuse move, promotion and restore procedures at their boundaries. Preserve the meaningful point where old binaries/recovery options cease to be usable and how accepted writes affect return; do not repeat those owners' full mechanics.

## a38 — Operating replicas and partitioned data

**Pass.** Acknowledgement versus replay, read routing, exclusive promotion authority and safe member return are essential operational distinctions. Distributed ownership introduces different obligations but remains bounded to placement decisions; no specialist replication or sharding branches are justified.

- Reuse one committed-change timeline for stream progress, acknowledgement and the read-after-write example. Physical/logical replication need a capability comparison, not two complete setup tutorials.
- The promotion runbook should be the sole owner of its detailed steps. Reconnection and member return should complete that same failure case, reusing integration and restoration mechanics.
- Mark distributing ownership as conditional on an unmet requirement. Readers operating one writer and replicas should be able to finish their topology decision without completing a sharding course. Retain one key-to-routing/constraint/transaction path; movement needs its authority/boundary obligations and a link to a31, not another resharding implementation.
- Keep managed/distributed hosting as a responsibility-and-guarantee comparison applied to the existing runbook. Do not add parallel provider walkthroughs or duplicate a34's CockroachDB adoption tests. The closing rehearsal should test only failures required by the selected topology.

All new plans pass. The suggested cuts remove repeated foundations and parallel procedures; their distinctive operating decisions remain. No further descendants are warranted by this batch.
