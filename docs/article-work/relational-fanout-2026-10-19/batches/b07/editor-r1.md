# b07 — adversarial editor, round 1

Reviewed a21–a23 and their supplied contexts against the original relational-practice commission. No context-linked or other review report was read. All three plans pass and correctly stop at sections.

## a21 — Controlling the queries your application performs

**Pass.** Hidden reads, loading shape, materialisation, implicit writes and composed authority each change a practical application decision. One bounded endpoint keeps the article coherent.

- Use explicit SQL plus one selected ORM as the worked comparison. A third parallel query-builder walkthrough adds API learning without another capability; a brief note applying the same inspection method is sufficient. The useful loss is library syntax breadth only.
- Reuse the same captured request trace for lazy reads, alternate loads and query-count tests. The joined-collection subsection should expose transferred-row multiplication, then link to SQL cardinality; it need not repeat the aggregate/double-counting lesson.
- Keep page/stream materialisation here, but retain only how the abstraction changes bounds and ownership. SQL owns page semantics and the connection article owns cleanup. Likewise, the binding/authority section should test composition of the parent's rules, not introduce injection prevention again.
- Implicit flushes and stale tracked objects earn their section because the application can otherwise misunderstand its writes. Avoid expanding into change-tracker implementation or optimistic-locking protocol design. No ORM-specific descendants are justified.

## a22 — Recovering database requests safely

**Pass.** The deadline, outcome evidence and durable operation identity belong in one article: splitting retry policy from idempotency would hide the conditions under which repeating work is safe.

- Keep the opening lost-response histories as a compact recall of the parent. Use them as the rows of the later action table rather than explain outcome uncertainty twice.
- Timeouts and retry budget should share one end-to-end timeline. Cancellation/reset mechanics already have a sibling owner; this article needs the resulting evidence and next action. The confirmed-abort example should apply the parent's whole-transaction rule, not derive another isolation schedule.
- Key scope, fingerprint, concurrent claim, retained result and expiry all earn their space: removing one would make the proposed operation contract incomplete. Keep them in the one order-placement design rather than survey idempotency architectures.
- Keep separately durable pending claims as a boundary warning unless the worked design actually needs them. Do not add a lease/takeover protocol alongside the simpler atomic claim/business/result transaction. The loss is an alternative architecture, not a missing capability in the declared design.
- Reuse the protocol's overlapping-attempt and lost-response cases in the final exercise. Faults testing resource cleanup should link to that owner's checks; these assertions should concern effects, result retention, bounded attempts and resolution.

## a23 — Connecting transactions to background work and events

**Pass.** Atomic intent, worker ownership and uncertain external outcomes are necessary to build a correct application around a relational service. The plan gives each a bounded role and avoids a messaging-specialist branch.

- Keep one order/work-record state machine across claim, repeat and recovery sections. A job and an event can be short variations of the same atomic-intent mechanism; they do not need parallel implementations.
- Stable operation identity versus attempt identity earns emphasis. Receiver idempotency should be a checked contract linked to a22, not another operation-table tutorial. Lease expiry and obsolete completion should reveal their limits without opening general fencing/distributed-lock theory.
- Keep event meaning, delay, scoped ordering and retention together as the record's contract. Omit global sequencing, broker behaviour and broad schema-evolution patterns. No required relational capability is lost.
- Use polling as the complete worked publication path. CDC should remain a bounded comparison/checklist unless an adoption decision specifically needs executed capture behaviour. A second connector environment and administration lesson would add substantial work without strengthening the outbox argument.
- The final recovery section should resolve the same retained evidence. For expired history, state the reconciliation/rebuild obligation and link its implementation; avoid another projection-rebuild or consumer-recovery course.

Retain the three destinations. Generated work, recovery of a database-backed operation and recovery of an external effect have different evidence and next actions; merging them would make those decisions harder to find. No further children are justified by this batch.
