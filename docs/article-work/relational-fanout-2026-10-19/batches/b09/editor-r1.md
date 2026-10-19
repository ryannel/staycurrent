# b09 — adversarial editor, round 1

Reviewed all four assigned plans and contexts against the original relational-practice commission. No context-linked or other review report was read. All four plans pass and should remain terminal articles.

## a28 — Improving performance under concurrent load

**Pass.** The sections supply a different investigation from isolated query tuning: demand, accumulated work, resource/serial competition and a workload intervention. Their depth supports practical diagnosis rather than a capacity-theory specialism.

- Keep the average relationship and waiting-client caveats inside the same measurement example. They justify interpreting the test, but do not need independent theory walkthroughs or more load-generator models.
- Use one interval of the mixed workload for resource pressure, hot-row blocking and background competition, introducing only the observations that distinguish the hypotheses. Reuse plan, storage and locking explanations instead of reteaching their mechanisms.
- Test a small evidence-driven set of changes. The three intervention subsections should be alternatives selected by diagnosis, not an obligation to demonstrate every tuning knob. The useful loss from cutting unused alternatives is breadth, not the ability to choose a justified intervention.
- The ending adds offered/admitted demand, backlog and drainage to the parent's method; it should not repeat the general benchmarking checklist. Keep admission implementation and service provisioning with their existing owners.

## a29 — Changing schemas without breaking applications

**Pass.** Lock queues, migration-runner state, staged validity, interrupted index builds and representation change each present a consequential failure/recovery decision. The operation table is an efficient substitute for a DDL catalogue.

- Keep the opening physical inventory and closing evidence record as the beginning/end of one change, rather than two general migration checklists. Application compatibility and retirement gates should be linked from the parent, not reconstructed.
- The lock-queue case and runner boundaries earn their sections. Use the same interrupted invocation to explain catalogue state versus runner history; do not create a separate tool tutorial.
- Keep concurrent index build as one reusable subprocedure needed by the larger change. The type-change walkthrough should refer back to it instead of executing a second index lesson. Staged CHECK, foreign-key and not-null differences need only the cases that alter the procedure.
- Backfill mechanics belong to a30. Here show their inputs, completion gate and how schema stages depend on them. Rehearsal and cleanup should apply the earlier procedures, without separate command-by-command branches for every table/column operation.

## a30 — Running reliable data changes

**Pass.** Complete work enumeration, guarded writes, atomic progress and semantic reconciliation justify this depth. Merely teaching batched UPDATE would miss the core application risks.

- Choose one complete enumeration protocol early. The worklist/key traversal comparison should explain that choice, not become two implementation tutorials. Keep the one-worker baseline; claims and concurrent-worker scheduling are conditional obligations, not another job-system course.
- Use the same edited address to connect stale-write protection, progress recovery and final reconciliation. The lost-acknowledgement case needs the job's replay rule, with the general outcome explanation linked to request recovery.
- The side-effect inventory and workload-budget section earn their space through decisions unique to running the job. Link their mechanism/monitoring owners instead of building trigger, external-delivery or performance tutorials.
- Keep imports/corrections as compact changes to the input/recovery contract, as proposed. Separate walkthroughs would repeat the method; omitting them loses no stated capability. The completion record should close the running backfill and feed the parent's gates.

## a31 — Moving databases with a controlled cutover

**Pass.** Copy/capture continuity, verified destination meaning and exclusive write authority are distinct from backfilling rows or promoting a replica. This article cannot be folded into either without obscuring those obligations.

- Keep the write-pause path complete and make capture conditional on the measured interruption requirement. Do not require every reader to complete two full migration implementations. Reuse one timeline to show how the pause or capture supplies the required boundary.
- Destination compatibility should test this workload, not reopen type, SQL or engine-selection curricula. One representative acceptance set and a concise inventory of uncopied state are sufficient.
- Reconciliation should apply a30's identity/meaning principles at the database move's common boundary. Avoid another general comparison-method lesson. Steady replication and restore setup remain linked operational procedures.
- Fencing and admitting destination traffic merit separate stages because destination writes change the route back. Keep that explicit gate and remove any redundant full incident/rollback checklist. The closing evidence should record actual authority and retirement permission, not repeat all rehearsal steps.

The concrete cuts above remove parallel implementations and repeated foundations. None removes a required relational-practice decision, and none justifies another specialised descendant.
