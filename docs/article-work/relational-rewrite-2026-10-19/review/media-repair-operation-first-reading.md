# Operation media: blind aid-only reading

Artifact: frozen coordinator packet of rendered model-review pages, 19 October 2026. I read figure DOM and JPEG pixels, not article bodies or model source. The coordinator operates CUA because the child has no browser access; I choose changes and predict before receiving outcomes. This is aid-only comprehension evidence, not a human study or a direct browser session. Audience assumed: an engineer who knows transactions and tables but is learning these operational distinctions.

## rl90-1
Question taught: how two earlier decisions can commit too many bookings even when the counter looks plausible. Both lanes and retained reads should let me follow the causal error rather than remember it. Initial schedule shows the future muted; I must advance before the evidence exists. Remaining work: map the six schedule rows to pending rows and actual bookings below; at this tall size controls and final counter cannot fit together in a normal viewport. Prediction: stale overlap through 6 gives b17/b18/b19 but counter 2; guarded overlap through 6 gives b17/b18, rejects B after lock/recheck, counter 2. These are distinct failures/successes, worth testing.

## rl91-1
Question taught: why opposite lock order forms a cycle while shared order leaves one writer able to finish. Continuous lanes, held-resource table and explicit wait edges promise the right evidence. I can infer the cycle from rows 3–4 before moving anything. Remaining work: reconcile future shaded rows with initial empty holders. Prediction: opposite order at 4 holds A:s7/B:s8 and both wait edges; shared order at 4 cannot hold s8 for B and has only B→A, allowing A to end.

## rl92-1
Question taught: why a historical reader prevents cleanup of versions, with two engine storage representations. Price sequence is concrete. Remaining work: the PostgreSQL chain wraps after a right arrow; the InnoDB row wraps after a left arrow yet the last item appears on the next line to the left. I can reconstruct order from labels but the arrow path is ambiguous. Prediction: request cleanup with report open keeps 20.00; close report and request cleanup leaves only 26.00 in both representations.

## rl92-2
Question taught: why reclaiming dead row space need not shrink a three-page file. Before/after states retain row identities, so I can count six survivors and see twelve free slots without holding them in memory. Static aid has no controls. Counterfactual prediction: inserting a row may fill one free slot without creating a fourth page; a rewrite needs replacement space before releasing the old pages. Both follow from the displayed layout/caption. No interaction needed to teach the distinction.

## rl93-1
Question taught: which evidence survives a missing commit reply and why replay identity matters. Client and server are side by side; the client evidence does not change. Remaining work: 'authoritative identity claim' names the step rather than showing its implementation; that may be supplied by the article. Prediction: same r81 with 5000 is rejected, leaving only original o81/4000. New r82 after original commit produces a second order. The client still has the same missing reply evidence.

## rl94-1
Question taught: why an atomically saved job can still deliver twice at an external provider. Job completion and provider effect are visibly separate. Remaining work: at one attempt the duplicate risk is only promised by the caption. Prediction: second worker call with provider recognition produces one effect and records completion; without recognition the second call makes two effects.

## rl94-2
Question taught: where an epoch must be checked to prevent an expired worker causing an effect. The visible line follows caller through check to effect, and completion separately reports zero matched rows. Remaining work: assume effect authority knows current epoch (status makes this condition explicit). Prediction: completion-only mode accepts stale A's effect but still refuses completion; B with effect checks succeeds at both boundaries.

## rl96-1
Question taught: why a restored prefix loses later valid business promises. Side-by-side independent ledger and restored history make the omitted o82 visible. Remaining work: 'seats available to these accepted orders' introduces capacity without showing individual seats or bookings; acceptable bounded input, but it may take article context to say why capacity can conflict. Prediction: reconcile with two seats restores o82 once; with one seat it must report a conflict and keep only o81 rather than silently satisfy both promises.

## rl97-1
Question taught: receipt and durable receipt differ from query visibility, and a barrier needs a fresh snapshot. Ordered prefixes support this directly. Remaining work: infer the controls obey receive≥flush≥apply; input clamps should be visible when contradicting them. Prediction: set received/flushed/applied to 3 but keep an old snapshot: replica physically has all three yet this read sees none. A barrier with apply 0 should wait, not manufacture visibility.

## rl97-2
Question taught: the difference between buying retention time and eliminating an advancing backlog. Numbers, equal-scale meters and net-rate arithmetic are useful. Remaining work: translate MB/s to minutes; caption supplies 300 MB/min. Prediction: generation=consumption=20 at 30 minutes leaves the initial 2,000 MB with no exhaustion forecast, but does not catch up. At generation40/consumption10 after30 minutes backlog is 56,000 MB and budget has already exhausted.

## rl98-1
Question taught: loss of one network path does not prove the old primary cannot write. The controller/cached/new-client paths communicate the split immediately. Remaining work: 'old_primary_only' is a placeholder rather than an actual order identity; caption supplies why it matters. Prediction: fencing A refuses cached writes while B accepts new writes; the old-only history still cannot be conjured on B.

## rl100-1
Question taught: why cursor completion does not prove a continuing schema invariant. Concrete ID5 behind20 and NULL beside7000 make the error inspectable. Remaining work: maintaining future writers is shown as a condition rather than replayed future mutation. Prediction: sweep alone clears current mismatch but leaves future risk; maintained writers plus sweep clears current mismatch and establishes continuing equality.

## rl102-1
Question taught: where borrowing, lock wait and service consume one request deadline. Bar segments and exact timing table teach queue movement. Remaining work: bar scale 650ms makes default150ms total occupy little width; no drawn deadline line, though its number is stated. Prediction: hot lock and six slots finish sequentially at50/100/150/200/250/300ms; three meet150ms. All can borrow immediately, with increasing lock wait. More slots cannot make the hot lock parallel.

## rl102-2
This repeats rl97-2 exactly at aid level. Question, evidence and initial concern are the same; whether this repetition earns its place needs article context. Prediction: increase storage to24000 at30min with baseline rates: backlog11000 stays unchanged and remaining runway increases to43.3min; consumption30 instead of15 closes2000MB in200s (3.3min), so by5min retained backlog is zero.

## rl103-1
Question taught: cancelling a statement differs from ending the transaction that owns a lock. Owner and original booking are paired, and the wait edge names the direction. Remaining work: what happens to requests behind cancelled B is deliberately outside current picture; status must not imply original booking completion. Prediction: cancel B leaves A's lock but cancels original booking; rollback A releases lock and lets B proceed.

## rl104-1
Question taught: a tenant setting is authority only if the caller cannot choose another tenant. Same local order ID in two tenants makes the breach concrete. Remaining work: actual policy expression is omitted from aid; trust chain names it, likely article supplies SQL. Prediction: controlled interface fixes t4 despite requestedt9 and shows t4/4000; owner bypass shows both tenants and permits ALTER regardless of requested setting.

## rl105-1
Question taught: multi-owner transaction cost and a hot invariant are two constraints on distributing data. Owner cards show touched records; meters keep hot demand visible. Remaining work: all independent owners are abstract shares rather than concrete requests, but arithmetic is transparent. Prediction: split tables plus directory touches A/B/C/G (4groups). Six owners with70hot means A75 and eachother5; 100hot gives A100 and others0 despite six owners.

## rl106-1
Question taught: prepared work, authoritative decision and separate physical installation differ. Paired participant cards keep the business invariant visible. Remaining work: prepare/decision recovery is a named sequence; the aid alone does not explain where durable COMMIT comes from after loss before decision. Prediction: position4 with COMMIT shows logical reserved2/o81present together, P installed and Q still holding intent; position5 with authority unavailable must retain prepared intents and refuse a local timeout decision. This would teach why half-installed is not half-committed.

## rl107-1
Question taught: a common past is coherent but may be too stale for a new admission, and a frontier bounds where a read can go. The two-row version table makes the cut inspectable. Remaining work: safe-through semantics must be taught in article. Prediction: latest-per-replica produces reserved2/o81absent atP25/Q15; requesting common25 withQ15 waits rather than returning this split. Dropping retained10 makes common15 unavailable.

## rl108-1
Question taught: votes survive by geography, while a business transaction can depend on more than its seat group. Region cards make failure domains easy to count. Remaining work: initial40ms network floor has no displayed per-region RTT evidence, so the reader cannot derive it from the aid. Prediction: A2/B1 losingA has1of3 votes and cannot decide. A1/B1/C1 losingC still has2votes but a required C quota blocks the subsidised purchase. Need article context for latency derivation and election assumptions.

## rl109-1
Question taught: equal row counts cannot validate movement, joint votes require both majorities, and catch-up needs net capacity. Exact row tables are strong; I can compare identities/value/rev directly. Remaining work: this combines three independently controlled questions and does not show an actual snapshot/tail boundary handover or bounded pause; article must connect them. Prediction: replay3 with deletion applied matches exact rows; A+B fails new majority though old has2. Replay3 skipping deletion leaves extra o82; apply20/generate20 yields zero net catch-up, so initial backlog cannot drain.

All 21 aids' initial pixels and DOM have now been read before article/model/author context. No initial aid is blank or visibly clipped. Tall schedule controls require scrolling away from lower evidence, and RL92 wrapping creates the clearest unnecessary reconstruction work.

## Changed-state observations

The coordinator reloaded each default state, used the requested native controls and asserted their values before saving each JPEG and DOM. I inspected all 39 after-state JPEGs and figure DOM. Predictions above and in `cases.json` preceded these outcomes. Raw packet: `/private/tmp/staycurrent-media-review/operation/`; execution manifest: `executed.json`.

### rl90-1--stale-overlap

Prediction: Counter 2 but b17/b18/b19 commit: both earlier reads were 1.

Observed result: "Capacity rule broken: three distinct bookings passed their local checks."

### rl90-1--guarded-overlap

Prediction: A commits b18; B rechecks full capacity after waiting and does not commit b19; counter and bookings both 2.

Observed result: "Committed bookings: 2. Earlier reads remain evidence of each decision."

### rl91-1--cycle

Prediction: A holds s7, B holds s8, A→B and B→A form a deadlock.

Observed result: A → B → A. Each holds the resource needed for the other to reach COMMIT. The model stops here until an attempt is aborted.

### rl91-1--shared-order

Prediction: B waits before owning s8; A can finish; no cycle.

Observed result: A’s commit releases the lock that B has been waiting for.

### rl92-1--cleanup-blocked

Prediction: 20.00 and reconstruction history remain because R is open.

Observed result: R still reads 20.00. Committed updates do not move its snapshot.

### rl92-1--cleanup-finished

Prediction: Only current26.00 remains usable in both representations; old history reclaimable.

Observed result: No reader needs old versions in this bounded model. Their space is reusable; file size need not fall.

### rl93-1--changed-intent

Prediction: Reject reused r81 with changed amount; keep only original o81/4000.

Observed result: "Conflicting intent: reject replay"

### rl93-1--new-identity

Prediction: Original committed purchase remains and r82 creates a second order; client missing-reply evidence stays unchanged.

Observed result: Two purchase effects now exist for one customer intent. The new key removed the link to the first result.

### rl94-1--deduplicated-retry

Prediction: Two delivery calls, one effect, second worker records completion.

Observed result: 2 delivery call(s), 1 provider effect(s). The durable job and external effect are separate states.

### rl94-1--duplicate-retry

Prediction: Two calls and two provider effects; job can now be complete.

Observed result: 2 delivery call(s), 2 provider effect(s). The durable job and external effect are separate states.

### rl94-2--late-epoch-check

Prediction: Stale A effect accepted but completion still zero rows.

Observed result: The stale effect has already happened. Refusing completion cannot undo it.

### rl94-2--current-owner

Prediction: B epoch2 effect and completion succeed at both boundaries.

Observed result: Current authority can accept the effect; repeated identity still needs deduplication.

### rl96-1--restore-later-promise

Prediction: r82 reconciles once beside o81 because two seats cover both promises.

Observed result: "Retained orders: o81, o82. Both accepted orders are present. Replaying the same r82 again uses its stored identity."

### rl96-1--capacity-conflict

Prediction: Cannot reinstate both accepted promises within one seat; retain o81 and report conflict for r82.

Observed result: "r82 is still unresolved: restoring it would exceed the surviving seat budget. Reconcile by rescheduling or refund; do not invent a seat."

### rl97-1--old-snapshot

Prediction: All replica progress reaches3 but earlier snapshot cannot see o81 or later rows.

Observed result: The earlier replica snapshot still excludes o81, even if apply has now advanced.

### rl97-1--barrier-waits

Prediction: Replica with apply0 waits for o81; it must not show an applied order yet.

Observed result: Replica has not applied o81. The barrier does not treat receipt as query visibility.

### rl97-2--equal-rate

Prediction: Backlog stays2000MB, no exhaustion forecast, existing gap does not close.

Observed result: Progress matches new work. The existing 2,000 MB gap cannot shrink.

### rl97-2--exhausted-budget

Prediction: Backlog56000MB exceeds12000 budget; exhaustion already occurred.

Observed result: The retention obligation exceeds this storage budget. More disk changes the deadline; it does not change the rate gap.

### rl98-1--fenced-old-primary

Prediction: A cached write refused, B accepts; old-only history remains missing from B.

Observed result: "One writer remains. B still lacks old_primary_only: exclusive authority did not recover missing data."

### rl100-1--sweep-alone

Prediction: Current rows equal after sweep, but next writer can create mismatch.

Observed result: Current rows agree, but a new uncovered writer can reopen the gap. A sweep alone is not a maintained rule.

### rl100-1--maintained-and-swept

Prediction: Current rows equal and every continuing writer preserves equality.

Observed result: Both current rows and continuing writes satisfy the compatibility invariant. An engine-validated constraint supplies its native proof.

### rl102-1--hot-lock-six-slots

Prediction: All borrow at0; finish50/100/150/200/250/300, exactly3 within150ms; waits move into locks.

Observed result: 3 complete within the whole-request deadline. Only one request at a time performs work on s7. Extra borrowed connections can be waiting for its lock.

### rl102-1--hot-lock-one-slot

Prediction: Same sequential finish times and3 deadline successes; wait lives in pool rather than lock queue.

Observed result: 3 complete within the whole-request deadline. Only one request at a time performs work on s7. Extra borrowed connections can be waiting for its lock.

### rl102-2--more-space

Prediction: Retained11000MB unchanged,13000MB budget remains,43.3min additional runway.

Observed result: Backlog grows while the primary continues writing faster than this consumer advances.

### rl102-2--faster-consumer

Prediction: Initial2000MB clears in200seconds; by5minutes no retained backlog remains.

Observed result: The consumer can close the existing gap while continuing writes arrive.

### rl103-1--cancel-waiter

Prediction: A lock persists, B cancelled; removing wait does not complete original booking.

Observed result: Removing this waiter did not release the root lock.

### rl103-1--end-owner-transaction

Prediction: A transaction rolls back and releases s7; B proceeds.

Observed result: The owning transaction ended. Observe the original request and drain admission within its capacity budget.

### rl104-1--trusted-context

Prediction: Requestedt9 cannot replace authorisedt4; only t4/o81/4000 visible.

Observed result: The enforced context is t4; t9’s different o81 is excluded.

### rl104-1--owner-bypass

Prediction: Both t4 and t9 visible through owner bypass; owner may ALTER.

Observed result: The owner crosses a separate authority boundary and normally bypasses this row policy.

### rl105-1--split-plus-directory

Prediction: Transaction touches A/B/C/G:4 authority groups; hot demand distribution unchanged.

Observed result: 70 requests stay on the single s7 authority. The other 30 divide across 3 owners. Placement and the hot invariant are separate costs.

### rl105-1--more-owners-hot-demand

Prediction: A75 requests, fiveothers5each; all70 hot requests remain on A.

Observed result: 70 requests stay on the single s7 authority. The other 30 divide across 6 owners. Placement and the hot invariant are separate costs.

### rl106-1--staggered-commit-install

Prediction: Logical reserved2 and o81present share commit; P installed, Q intent persists until resolution.

Observed result: COMMIT is settled. A current reader reaching Q’s intent resolves or waits; it must not return a contradictory completed purchase.

### rl106-1--authority-unavailable

Prediction: Prepared intents retained, no unilateral timeout commit/abort; authority recovery required.

Observed result: Prepared is not committed. Neither participant may decide from its timeout.

### rl107-1--mixed-cuts

Prediction: P25 returns reserved2 while Q15 returns o81absent: mixed transaction cuts.

Observed result: Each value is individually valid, but together they cross the transaction boundary.

### rl107-1--frontier-blocks-common-cut

Prediction: Common25 waits forQ, rather than exposing split transaction state.

Observed result: Q cannot serve the requested common cut yet. Wait, route elsewhere or fail within budget.

### rl108-1--lose-majority-region

Prediction: Only1of3votes survive, need2, seat group and purchase unavailable.

Observed result: "Healthy A-leader network floor: 1 ms. After losing A, leader recovery and its new network path must be evaluated. Quorum availability and all transaction dependencies must both hold."

### rl108-1--quota-dependency

Prediction: Seat group retains2of3 but unavailableC quota blocks subsidised purchase.

Observed result: "Healthy A-leader network floor: 40 ms. Surviving A-leader path: 40 ms. Quorum availability and all transaction dependencies must both hold."

### rl109-1--caught-up-wrong-votes

Prediction: Exact rows match; old majority2, newmajority1, joint transition cannot proceed.

Observed result: Data has caught up at the selected boundary. These votes cannot complete a joint-stage decision. A finite backlog can close at the net rate.

### rl109-1--missing-delete-no-net-capacity

Prediction: Extrao82 makes destination different; netcatchup0 cannot drain backlog; BC still both majorities.

Observed result: Copied row count is not proof of catch-up. These votes satisfy joint membership. A pre-existing backlog never shrinks at equal rates.


Prediction differences retained: RL91 shared order at position4 has already committed A, so its earlier B→A wait is resolved. RL92 retains hatched, labelled reclaimable blocks rather than removing them; only26.00 remains current. Both are sensible visual choices. RL102 rejects requests4–6 before borrowing, contrary to my ordinary queue prediction: the closed rules reveal perfect forecast-based admission. That premise must be visible with the result. RL108 C loss leaves the C-resident quota available; that contradicts the aid premise and needs repair. RL106 unavailable authority cards match the prediction, but every future recovery/install step is painted complete at slider5; the visual sequence contradicts those cards.
