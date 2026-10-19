# Practitioner recheck: Operating and recovering a relational service

Verdict: **pass**.

Rechecked the saved `breakdown.yaml` and `repair-record.md` against the required finding in `practitioner-review.md`, including the practical effects of the editor's consolidation. This remains a planning verdict; no implemented procedure or service guarantee has been validated.

## Required finding resolved

**Observe the service and act before it runs out of room** now explicitly requires current recovery-path readiness, consuming distribution's signals for standby availability, appropriate durable receive/replay position, topology and synchronous state, observation freshness and current data-loss exposure. It includes an owned degraded-protection alert while traffic still succeeds and a decision among repair, explicit temporary risk acceptance and contract-required work restriction. It also rejects deriving recovery or catch-up time from lag duration.

**Choose a recovery path for the actual failure** and the **Proving relational recovery** child now make observed readiness a live gate before recovery action. This closes the operational ownership gap without duplicating distribution's mechanisms.

The optional maintenance advice was also incorporated into **Schedule upkeep from debt and risk**: protective transaction/multixact age upkeep, progress and blockers, early escalation, and the space/locking distinction between ordinary vacuum and table rewrites are explicit.

## Consolidation regression check

No practitioner coverage regression found. The common procedure record preserves verified identity, authority, dependencies, evidence, stop conditions, recovery and acceptance across the shorter variations. The upgrade variation still addresses compatibility, restore evidence, workload/resources, interruption and newly accepted writes. The storage-pressure variation retains recoverability, bounded remedies and escalation. Corruption/domain loss remain recovery branches with differing dependencies and validation, while the parent retains incident command and evidence preservation. The security child still requires least-privilege, tenant denial, privileged-code, operational-export and rotation/lockout verification.

The evolving service record strengthens practical verification: objective values and accepted reservation markers connect provisioning, observation, failed recovery drills and restored business state, while explicitly separating illustrative inputs, modelled results and observed execution.

Remaining unresolved findings: **none**. No new section or child is needed.
