# Backup, restore and reconciliation: planning notes

## Inputs and reference exposure

Read the assignment, commission, article, neighbours, incoming ownership, reading links and complete supplied shop record. Applied current `staycurrent-breakdown`, its `staycurrent-write` reference procedure and the continuity guidance. This is the coordinator-managed first detailed plan, not another collection review.

Read separately with `scripts/read-writing-reference.py`, without clipping: Sequence diagrams parts 1–6; Indexes parts 1–7; Storage and durability parts 1–6. All 19 END markers were received. The helper verified the supplied source/text hashes. No old article body, plan, review or other worker's notes was read.

Studied finished drawings in one owned IAB tab on the supplied :4584 reference routes, without changing theme or viewport: Storage figure 8's memory/storage lanes and commit cuts; Sequences figure 4's purchase/worker boundary; Indexes figure 2's source rows, sorted entries and highlighted correspondence. Stepped the figures and read their changing explanations. The same owned tab was used for the assigned neighbouring reading and closed afterwards.

Teaching carried into the plan: one shop loss develops into a recovery problem; each stage changes the reader's question; concepts are established before trade-offs and practical judgement. Needed visual understanding is the history actually covered, the effect of a gap, the chosen prefix versus valid omitted work, and the mismatch between restored database state and surviving external effect. The writer chooses drawings and prose. No figure design or implementation is prescribed.

After the references, read the supplied new complete parent preview at `http://127.0.0.1:4646/review/article/`, especially its checkpoint/history distinction and final recovery-choice handoff. Read the finished request-identity explanation at `http://127.0.0.1:4606/review/relational-rebuild/conflicts-and-retries/`, especially atomic retained results, current-authority recovery and the limits of duplicate protection. The parent has already established that physical versions are not retained business history, a checkpoint is not a backup, a replica can copy 2.20, and an earlier target drops valid later work. A brief opening reminder is sufficient.

## Ownership and prerequisites

No new article or changed ownership proposed; no `nested_article` stubs are needed. Accepted deeper owners already exist elsewhere in the tree:

- History, correction and deletion: business correction, effective/recorded time, retention and deletion policy.
- Failover and fencing: promotion of an existing live copy, authority transfer and detailed fencing/rejoin protocols. This article still owns closing source writes and the later-work set during restoration.
- Restoring PostgreSQL to a recovery target: supported base-backup/WAL preparation, commands, target inclusivity/timeline details, native verification and a working restore drill.
- CockroachDB backup and recovery: native full/incremental coverage, revision-history and restore-scope rules, and the capacity-aware later-booking procedure.
- Retries and uncertain commit outcomes: request-key protocol and known abort versus uncertain outcome. This article adds the consequence of restoring away its retained evidence.
- Outboxes and database-backed jobs: normal delivery/lease/retry implementation and receiver contracts. This article owns checking effects that survive a database rewind.

Logical/physical and full/incremental are different axes. The generic article should explain the choice with bounded engine-labelled examples, without claiming that every physical backup accepts WAL or that every incremental backup offers arbitrary PITR. Native owners retain procedures. The plan's stock/capacity sentence is a transfer of judgement, not a second booking experiment.

## Example agreed centrally

The coordinator approved this recovery branch and confirmed they will add it to the shared facts:

1. Begin a separate recovery branch at the post-103 facts: P7 price 20.00; stock P3/P7/P9 = 10/0/4; order 103 pending, agreed line total 29.00, no payment. Keep 101/102 and payments 501–503 unchanged.
2. Reuse the separate mistaken committed P7 price 2.20 variation. It changes no agreed line price, stock or payment.
3. After that mistake, reuse the existing partial-payment variation: payment 504, order 103, 10.00, card. Order 103 stays pending and balance is 19.00. Add an explicitly hypothetical provider operation `order-103-part-payment-1`, immutably mapped to that order and amount, with independently retained, queryable completion evidence. The provider's operation identity is distinct from both database payment ID 504 and purchase key `purchase-103`.
4. A suitable backup and saved history reach a verified point before the mistake. This target contains the starting post-103 facts and no 504. The source's later payment and its external charge are outside that restored database history.
5. Preserve source evidence and close source writes/dispatch before final enumeration. Reconcile the established 10.00 charge into the recovered order as payment 504 with its original mapping and a repeat-safe repair outcome. Do not call the charge endpoint again. A repeat leaves one 10.00 payment, balance 19.00 and stock 10/0/4.
6. Compare an unresolved provider outcome as a separate branch: no trustworthy result means hold and investigate under the actual provider contract. Neither a missing restored row nor a timed-out call establishes no charge.

This is an illustrative recovery extension, not a native trace. It combines two previously independent variations only within this labelled branch. No exact timestamp, transaction ID, LSN, measured restore duration or production provider is implied. The target deliberately returns catalogue price 20.00; deciding later to set 22.00 is a separate authorised business correction. Do not reprice the 29.00 order. Do not make ordinary email queryable or deduplicating by analogy.

The approved partial-payment example is sufficient. No extra acknowledgement-delivery variation or new purchase is needed.

## Primary-source checks

Checked 25 October 2026. These are documented capabilities; no database or provider execution was commissioned.

- [NIST RPO](https://csrc.nist.gov/glossary/term/recovery_point_objective) and [RTO](https://csrc.nist.gov/glossary/term/recovery_time_objective), plus [AWS recovery objectives](https://docs.aws.amazon.com/wellarchitected/2024-06-27/framework/rel_planning_for_recovery_objective_defined_recovery.html): distinguish acceptable recoverable point/data-loss window from acceptable service interruption. Business needs set objectives; an achieved point and elapsed rehearsal establish evidence. Earlier corruption recovery may deliberately omit more work than the ordinary latest-backup lag.
- [PostgreSQL 18 continuous archiving](https://www.postgresql.org/docs/18/continuous-archiving.html): base copy plus a complete required WAL sequence; dumps are not WAL bases; targets must follow the base backup's completion. Archiving lag matters, and archived WAL omits manually edited configuration. Recovery can branch history; source evidence must be preserved. These support coverage/target reasoning; exact operations stay native.
- [PostgreSQL 18 recovery targets](https://www.postgresql.org/docs/18/runtime-config-wal.html#RUNTIME-CONFIG-WAL-RECOVERY-TARGET): target kind, inclusive/exclusive stopping and timeline are distinct choices. Transaction identifiers do not order commit completion; a configured target not reached is an error. Hence the generic plan requires verifying actual recovered facts, not trusting a plausible clock string.
- [PostgreSQL 18 pg_verifybackup](https://www.postgresql.org/docs/18/app-pgverifybackup.html): manifests, file checks and required-WAL parsing catch important defects, but do not replace test restores and checking correct data. Backup validity and application readiness remain separate evidence.
- [PostgreSQL 18 file backup](https://www.postgresql.org/docs/18/backup-file.html) and [SQL dump](https://www.postgresql.org/docs/18/backup-dump.html): copying a live directory arbitrarily is insufficient; supported consistent snapshots include required WAL and coordinated volumes. Dumps have different scope and compatibility. A single-database dump omits cluster-wide roles/tablespaces; separate database snapshots need not be synchronised.
- [CockroachDB full/incremental](https://docs.cockroachlabs.com/docs/stable/take-full-and-incremental-backups), [revision-history/PITR](https://docs.cockroachlabs.com/docs/stable/take-backups-with-revision-history-and-restore-from-a-point-in-time) and [validation](https://docs.cockroachlabs.com/docs/stable/backup-validation): increments depend on earlier backups; arbitrary point selection requires captured revision coverage. File presence, schema validation and data verification differ from complete restore. These prevent PostgreSQL's physical-WAL model from becoming an engine-independent claim.
- [Stripe idempotent requests](https://docs.stripe.com/api/idempotent_requests): an actual receiver contract has scope, payload comparison, retained outcomes and expiry; API v1 keys can be pruned after at least 24 hours, after which reuse can execute anew. This is evidence against assuming permanent duplicate protection, not a proposal to name Stripe in the shop or teach its API. Keep the worked receiver contract explicit and hypothetical.

Closing source admission/dispatch, accounting for in-flight outcomes, retaining a finite candidate set, atomic repair/result recording and checking business invariants are the plan's recovery reasoning from those guarantees and the accepted ownership. They are not asserted as one vendor's automatic restore feature. Source evidence can be incomplete: if the original history is gone, state what cannot be established rather than promising lossless reconstruction.

## Continuity and delivery check

Read the outline from the parent's endpoint: establish recovery need → usable history → target → proof → closed source → later database work → external outcomes → readiness. Each term needed for reconciliation is supplied before its use. The YAML confines itself to intended understanding and essential facts, with research and secondary qualifications here. No page, server, build, implementation, article prose, commit or publication was produced. The scenario has central agreement; no ownership dependency remains unresolved.
