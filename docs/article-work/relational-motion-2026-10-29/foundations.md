# Foundations motion redesign

Implemented 54 scene definitions across the 18 assigned foundation articles. Indexes and query execution were implemented by the coordinator and independently checked here; they add six definitions to the foundations directory.

The new figures use the caching player's once-on-entry animation, Pause/Replay, coloured travelling balls, ordinary application/server/database roles, and open paths. Each scene supplies separate 440-unit and 760-unit SVG layouts. Meaningful comparisons remain buttons or native selects. Static value tables, diagrams and calculators remain where motion would not improve the explanation.

## Implemented inventory

| Article | Module / scenes | Mechanism retained |
| --- | --- | --- |
| Relational introduction | introduction: tables, join, purchase, race, index, recovery, placement | Connected facts, joining agreed line prices, one purchase outcome, guarded stock, selective lookup, log recovery and remote ownership |
| Data modelling | modelling: grain, offers, dependencies, split, price | Line/payment multiplication, ternary facts, one home for a name, lossless associations and historical price |
| Normalisation | normalisation: closure, loss, chase, advice, synthesis, mvd, jd | Closure choices, spurious rows, chase witness, dependency preservation, minimal-cover reductions, independent combinations and join dependencies |
| Hierarchies | hierarchies: recursion, race | Working generations and competing moves with the topology-lock alternative |
| Values | queries: filter | Five existing three-valued predicates over the original measurements |
| Constraints | constraints: timing, payments | Constraint checking points and competing aggregate-payment decisions |
| History | maintenance: deletion | Independent outcomes for profile, prior versions, invoice, search and backup copies |
| Query results | queries: join | Matching order keys and the resulting line rows |
| Aggregation | queries: group, frame | Group accumulation and the original three window-frame alternatives |
| Pagination | pagination: offset, keyset, snapshots | Insert/delete/edit effects on ordering and page snapshots |
| Writes | maintenance: guard, batch | Guarded update and resumable B17 outcomes |
| Application SQL | requests: loading, lifecycle | N+1/batch/join comparison and connection ownership through outcomes |
| Transactions | transactions: purchase, stock, snapshots, payments | Atomic purchase/rollback, guarded stock, statement/transaction snapshots and aggregate decision races |
| Locks | locks: lock-lifetime, payment-authority, decision-snapshot, product-deadlock | Transaction-scoped locks, authority rows, snapshot timing and lock ordering |
| Retry outcomes | requests: uncertainty, atomicity, competition | Ambiguous commit reply, work/result atomicity and same-key competitors |
| Outboxes and jobs | requests: delivery, lease | External acceptance versus completion recording; stale lease claims |
| Partitioning | maintenance: prune, retire | Bound-based pruning and whole-partition retention decisions |
| Storage and durability | storage: buffers, versions, wal, crash | Page reuse, PostgreSQL/InnoDB old versions, WAL ordering and crash recovery variants |

## Continuity and repair checks

- Replaced stale manual-step instructions in nine articles. Preserved the pre-existing data-modelling totals additions; changed only its figure-interaction sentence.
- Preserved useful static branches in the shared Astro components. Their legacy scripts only initialise roots remaining in those branches; none mount the old stepper on a new motion figure.
- Restored existing value-filter, join, pagination and deletion anchors. Corrected deletion's article figure number to 5.
- Directly rendered all 60 foundations definitions (including the coordinator's six), all defined choices and variants, at seven checkpoints: 917 scene renders with no exception, NaN or undefined output.
- Browser spot checks: introductory connected-facts drawing at desktop; loading, chase and synthesis at a 375 px viewport. Loading advances through partial results; synthesis visibly removes redundant rules before assigning schemas. Temporary viewport override reset afterward.
- Coordinator performed the wider dark/light and phone/desktop geometry sweep. Findings repaired here: long pagination and delivery labels; batch outcome heading extending beyond the desktop SVG; safe line wrapping for compact notes.
- Independent review by the PostgreSQL worker caught three semantic regressions, now repaired: delivery completion must arrive through the relay before the outbox says Done; synthesis must visibly remove the two redundant written rules; modelling's split scene must actually reach its safe final association. The delivery stop-after-completion branch now stops only after completion is recorded.
- Independent check of the coordinator's indexes/execution scenes against preserved models found no concrete mismatch in lookup/page counts, visibility variants, join outputs, grouping totals or merge stopping behaviour.
- Independent source check of the distributed replacements found one misleading attempted-value display: a duplicate loyalty-code attempt appeared to reject stored NULL. The distributed worker repaired it to show the proposed TEA-7 separately. No other concrete protocol-state or preserved-variant regression identified in that scoped pass.

The coordinator owns integrated build, public-page runtime validation and publication. No build, commit, push or server start was performed by this worker.
