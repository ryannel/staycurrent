# Practitioner review: Operating and recovering a relational service

Verdict: **revise** — one small operational coverage repair; retain the proposed article boundaries.

Reviewed `breakdown.yaml` against this assignment's `context.yaml` and the fresh planning `commission.md`. This is a breakdown review, not a claim that an implemented runbook has passed. I did not consult the existing relational corpus or earlier plans.

## Required repair

### P2 — Observe whether the chosen failover path still satisfies the service contract

Location: **Observe the service and act before it runs out of room**, lines 83–92; connect to **Choose a recovery path for the actual failure**, lines 25–33, and the recovery child brief, lines 131–134.

The proposed dashboard tracks customer symptoms, resources and backup recoverability, but omits the health and data-loss exposure of a standby relied upon for the server-loss recovery path. The plan only explicitly checks promotion, fencing and routing preconditions when rehearsing failover. An unavailable or stalled standby can silently invalidate the service's availability or recovery-point objective while the primary remains healthy. Owning the replication mechanism in distribution does not remove operations' responsibility to detect that degraded protection and decide what to do about it.

Add a concise requirement to observe the **current readiness of the selected recovery path**, with an owner, freshness check and response when protection falls below the contract. For a service using a standby, consume distribution's verified signals for standby reachability, durable received/replayed position as appropriate to the promised guarantee, topology/synchronous state and current loss exposure. Show one degraded-protection alert while customer traffic still succeeds, with a safe response such as repairing the path, formally accepting a temporary weaker objective or restricting work when the contract requires it. Do not reproduce replication mechanics or infer a recovery-time estimate directly from a lag column. No extra heading or child is needed.

Primary-source grounding: PostgreSQL exposes replication state and positions separately from lag durations; it explicitly says reported lag durations do not predict catch-up time and can become null on an idle caught-up system. This supports requiring a contract-aware readiness signal rather than a generic “replication lag seconds” alarm. [PostgreSQL 18: The Cumulative Statistics System, pg_stat_replication](https://www.postgresql.org/docs/18/monitoring-stats.html#MONITORING-PG-STAT-REPLICATION-VIEW).

Acceptance: the observation brief explicitly includes degraded recovery-path protection, and the failover/recovery brief names those observed conditions as live preconditions, with distribution retaining ownership of their mechanisms and guarantees.

## Non-blocking drafting instruction

Location: **Schedule upkeep from debt and risk**, lines 148–157.

“Maintenance debt” and a threat to availability are sound planning language. When expanding the pinned PostgreSQL example, make the distinction between optional optimisation and mandatory protective upkeep concrete: transaction/multixact ID age, vacuum progress and blockers, and an escalation path before writes are refused. Avoid teaching vacuum as a universal disk-space release operation: ordinary vacuum and a table rewrite have different space and locking consequences. The existing brief has room for this; it needs no additional article or section.

Primary-source grounding: [PostgreSQL 18: Routine Vacuuming](https://www.postgresql.org/docs/18/routine-vacuuming.html) distinguishes ordinary vacuum from VACUUM FULL and describes protective maintenance and exhaustion behaviour.

## Coverage and judgement

The rest of the assignment is represented at suitable planning depth. In particular:

- The failure table distinguishes process crash, host loss, replicated mistakes, resource exhaustion, corruption and failure-domain loss, and avoids treating replication as a backup.
- Resource envelopes include concurrent memory multiplication, operator headroom, restart scope and recovery storage requirements.
- The security child covers ownership/default privileges, actual identity denial tests, tenant bypasses, privileged database-resident code, rotation and emergency lockout cases.
- The recovery child owns executable restoration, log/backup dependencies, independent copies, configuration and key access, later-good-write reconciliation, measured recovery and failure cases. Its distinction between a backup job, integrity check, restore and validated application behaviour is operationally important.
- The change runbook explicitly deals with newly accepted writes and version compatibility rather than implying that rollback always means restoring a pre-change image.
- Incident work preserves evidence before destructive repair and requires business reconciliation and renewed protection before closure.

The two proposed children earn their separation through substantial practical work. Provisioning, observation, routine change and incident command remain coherent in the parent. Engine diagnosis, application delivery and replication mechanisms have clear neighbouring owners.
