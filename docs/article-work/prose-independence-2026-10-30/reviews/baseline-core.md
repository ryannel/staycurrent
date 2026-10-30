# Core relational prose-independence baseline

Independent first editorial/teaching review, 30 October 2026. Read current article prose completely in source, including inline figure captions/labels, tables, links and code context; no articles edited and no browser/control operation or fresh technical accuracy audit claimed. The user's removable-illustration requirement overrides image-first wording in the skills. Severity below is medium unless specified: readers must use a drawing or decode scene instructions to follow the prose. Replacing a visual reference with a subject name is insufficient where its setup or outcome lives only in the figure.

## Coverage ownership

There are 32 core articles, excluding 17 PostgreSQL and ten CockroachDB articles. The coordinator owns independent full reads of `data-modelling`, `normalisation`, `hierarchies`, `history`, `constraints`, `values`, `query-results` and `relational-introduction`. This report covers the other 24; it does not claim those eight were read by this worker. Source locations refer to the unchanged baseline files.

## Findings from full reads

### access-control.astro — full read, changes needed

- Lines 14 and 55 direct the reader to inspect figure positions/options: “Read the two checks in the middle” and “Compare Tenant policy with Table grant only”. The surrounding account of authentication, scope, parameters and grants is otherwise strong and can stand alone. Replace this choreography with the actual connection/request example and its contrasted outcomes.
- Line 66 introduces pool context through “Step to Reuse without setup”; the failed path (which tenant borrows next, which stale value remains and whose rows leak) needs its own prose. Lines 68–69 explain the safe lifecycle but not that complete failed example.
- Lines 75–84 leave the concrete invalid `(10,4)` association in Figure 4 while body text refers to “Both rules”. State the tenant/order/customer mismatch directly outside the figure. Preserve the strong explanation that access and referential integrity answer different questions.

### aggregation.astro — full read, changes needed

- Lines 18, 36, 72 and 99 instruct following P3, switching conditions and comparing frames in figures. Most results already appear explicitly in nearby prose, so rewriting these scene instructions into subject-led examples is sufficient there; avoid adding another duplicate inventory.
- Line 105 calls the whole-partition result “Figure 5’s whole-partition setting”. The independent SQL/frame explanation is already complete: use it directly.
- The opening promises to keep “those five lines visible” (line 8). Frame that as the chosen example input rather than a visual arrangement. Grouping, null/empty-input reasoning, ranks, peers and window frames are substantially explained in prose; this article needs coherent recasting, not a new technical scope.

### application-sql.astro — full read, changes needed

- Lines 162 and 175 instruct watching connection ownership and following three loaders. The surrounding cursor/backpressure and N+1 discussion supplies most mechanisms and numerical outcomes. Replace the directions with the actual bounded example and resource lifetime.
- Line 205 says “Figure 5 supplies the error paths that must surround it.” This explicitly delegates necessary transaction-owner error handling to an optional figure. Make the full cleanup/uncertain-commit obligations part of the prose beside the success listing, and connect them naturally to the later error sections.
- Line 222 sends readers through figure options before explaining failures. Explain the contrasting known statement failure, unusable connection and missing commit reply in subject-led prose. Lines 224–232 already provide strong material to retain/reorder.

### backups.astro — full read, changes needed

- Lines 35–37: “Remove B and watch what happens to C” followed by “C’s files still exist”. B/C are invented interval labels explained by the visual; a reader without it cannot reconstruct the missing dependency. State the successive backup/log segments and what a gap prevents, without relying on symbolic screen labels.
- Lines 54 and 113 ask the reader to move a target or compare provider lookup options. State each chosen recovery target and external-outcome branch in the prose; preserve the clear explanation that replaying to the payment includes the earlier mistaken price.
- The article's larger recovery/reconciliation argument is already strong, including source closure, operation identity, provider outcome and post-restore readiness. Preserve that structure while removing scene-led transitions.

### capacity.astro — full read, changes needed

- Lines 25–31 send readers to a table-lock stage and then say “At first Mina… Later she…”. Spell out the pool-queue and lock-wait alternatives in prose before comparing resource occupancy; this sequence currently depends on the optional journey animation.
- The rollout paragraph at line 74 sends readers to a switch instead of simply describing old/new overlap. The following arithmetic explains the result independently and should remain.
- The overload example at line 98 is introduced as a Figure 4 control comparison. Its assumptions and results are already explicit (seven requests, two places, two waiting, 100 ms, 120/300 ms); recast as the two admission policies rather than narrating a figure. Little's Law, resource budgets, deadlines and recovery headroom otherwise stand alone.

### cluster-change.astro — full read, changes needed

- Lines 25–28 tie durable/applied progress to “Figure 1’s fifth stage”. State the receiver's durable-but-unapplied state independently, retaining the clear existing base-copy example.
- Lines 39 and 53 introduce disconnected voting pairs and membership checkpoints as figure operations. Explain the two pairs and old/joint/new rules directly; lines 49 and 55 already supply useful consequences.
- Line 75 says “Figure 4 changes replay capacity”; the fixed-rate arithmetic following it is self-contained. Use replay capacity as the subject. The article already explains learner, joint membership, survival margin and decommissioning well without needing a new scope.

### distributed-commit.astro — full read, changes needed

- Lines 16–32 put both incomplete local-commit outcomes chiefly into Figure 1, then refer to “Changing the order of the calls”. Add the actual order-first and stock-first failures to prose: accepted order with unchanged stock versus stock consumed without an order. This is essential motivation for distributed atomic commit.
- Lines 41, 49 and 51 follow a prepared/refusal animation and use “in the drawing”. Recast in terms of coordinator/participant decisions; retain explicit prepare/commit distinction and durable-decision ordering.
- Lines 61, 65–66 describe Figure 3's middle/last cases. Each failure case needs its own fully introduced assumptions and accessible decision evidence. Much of the information is present but its organisation is scene-dependent.
- Lines 81, 91–93 and 101 refer to a drawing/commit walk/message sequence. Retain the actual distinctions (participant ownership, constraints, dependent waits, optimised native protocols) without asking the illustration to define their context.

### distributed-snapshots.astro — full read, changes needed

- Lines 12 and 22–26 direct following outlined cells or “the trace”. The core snapshot and clock arithmetic is present; make it an ordinary worked example rather than instructions for reading a figure.
- Lines 32 and 36 refer to upper/lower strips for real-time and TrueTime behaviour. The numerical counterexample and protocol explanation can be stated directly; they already contain most needed facts.
- Lines 45–48 introduce log positions `n8` and `n6` and “Only the final step” without their prose setup. State the follower's actual completeness/durable/applied conditions explicitly, independently of animation progress.
- Lines 56–59 use control operations to introduce serviceable intervals and the no-overlap case. The retained examples should explain intervals, their intersection and the invalid mixed-snapshot result without those operations.

### distribution.astro — full read, changes needed

- Lines 12–15: “Read across A’s row, then down machine 1’s column” followed by “A’s three cells”. Define the ownership/copy placement as facts, then reason about it. The figure grid must not supply the meaning of the nouns used by the article.
- Lines 24–26 and 38–40 use a figure to introduce owners/underlined ranges. State the actual customer, report and purchase routes; range/hash examples need their layout assumptions in prose rather than “illustrated hash layout”.
- Lines 61–66 refer to `U` and the reply's replica states, but the first successful replicated-log sequence is carried by Figure 4. Explain proposal, durable majority, commitment/application and reply in prose, with clear assumptions; preserve Raft's current-term limitation.
- Lines 72 and 92 ask readers to switch a network split and common snapshots. The succeeding majority and snapshot reasoning is strong; replace the choreography with explicit scenarios.

### failover.astro — full read, changes needed

- Lines 11–13: “Figure 1 gives…” followed by “In the second path”. The old application connection, monitor link failure and address-only handover must be established independently in prose; otherwise split brain's concrete cause is hidden in a selectable path.
- Lines 18 and 25 tie independent power fencing and the surviving connection to Figure 1. Retain actual enforcement facts as the example, without referring readers to a figure for the path left open.
- Line 33 asks readers to select candidates and watch the promotion boundary. The subsequent A/B retained-history contrast is good and should be the direct example.
- Line 77's rehearsal calls out “Figure 1’s open connection”. Name the still-connected caller directly. Preserve the strong separation of authority, retained history, omitted work and rebuild/rejoin.

### incidents.astro — full read, changes needed

- Lines 27–30 ask watching intervals and then introduce “The 600 ms acquisition wait” that the figure supplied. State the invented interval breakdown in prose before explaining why speeding the statement cannot remove pool waiting.
- Lines 49–66 introduce three borrowers, two queued callers and H via Figure 2; H is subsequently treated as an established actor. Introduce the lock-only session and both caller populations directly, then follow diagnosis/intervention as a subject example.
- Lines 107–110 refer to an invented storage trajectory without stating its starting size/growth/repair requirement in prose; “At minute ten” and “four GiB” need that independent setup. Include the minimum arithmetic needed for the six-GiB repair decision.
- Lines 118 and 148 rely on “For Figure 2…” and an arrow chain “as a check still to make”. State intervention conditions and the expected lock-release → statement completion → client release → queue-drain chain directly. Much of the article's diagnostic reasoning and caveats can remain.

### indexes.astro — full read, changes needed

- Lines 11–15 turn B-tree/table navigation into “watch where…” followed by “Two index pages found four entries”. Explain the example's tree lookup and scattered table-fetch consequence independently; generic root/branch/leaf definitions are already good.
- Lines 26–28, 60–62 and 72–76 ask readers to change indexes/layouts and then describe results relative to the chosen option. State the three compared index keys, selected input and how many entries/table fetches each needs directly, retaining later qualification that native skip scans may differ.
- Lines 91–100 put the status update's three maintenance consequences largely inside Figure 5: unchanged key, changed included payload and entering a partial index. The surrounding prose needs that comparison explicitly. Preserve the native HOT qualification and measured evidence limits; do not mistake illustrative entry counts for observed physical writes.
- Lines 136 and 140 refer to what a “small hand trace teaches” and counts “in the drawings”. Keep provenance with figures/evidence, while the article explains ordering and observation independently.

### locks.astro — full read, changes needed

- Lines 20, 46, 80 and 112 ask watching gaps/turns or following arrows. The waiting, zero-row refusal, payment-authority protocol, stale Repeatable Read counterexample and deadlock order are already explained in prose. Recast introductions and comparisons around transactions and events rather than controls; avoid adding a second explanation of the same result.
- The A→B→C chain at lines 134–142 has its concrete ownership/request setup in a table, then says “The chain ends at C.” Tables are not diagrams under this review, but if this table is treated as an illustration, give the three holders/waiters in the prose too. Unlike an interactive figure, this is already a readable textual comparison; preserve it and make the surrounding sentence explicit.
- Preserve the important distinction between an eventual lock grant and a valid decision snapshot; this article is technically well developed and does not need broad expansion.

### outboxes-jobs.astro — full read, changes needed

- Lines 66, 80 and 101–108 refer to following paths, a drawn boundary and switching receiver modes. The introduction and lines 75–79/103–111 already explain the two atomicity gaps and receiver deduplication. Make those explanations the transition instead of narration.
- Lines 123–131 put the row-lock-to-stored-lease handover, skipped locked work and zero-row poll chiefly in Figure 4. Explain explicitly why the next poll still excludes the unexpired claim after its lock is released, and why zero rows does not prove an empty queue.
- Line 135 introduces the paused generation-7 worker and takeover as a figure exercise. State the expiry/takeover/resume scenario directly before the guarded completion write.
- Lines 147–159 leave the concrete generation-8 acceptance / generation-7 rejection / repeated-8 equality case inside Figure 6. The prose must itself make clear that a fence rejects an older authority only after learning the newer one, but equal-generation repeat still needs work-ID deduplication. Preserve the separate receiver contracts and per-resource scope qualifications.

### pagination.astro — full read, changes needed

- Lines 32–36 say “an insertion and a deletion” and then “The insertion made 201 appear twice” without stating which rows changed in prose. State the inserted 203 and deleted 202 cases, and the exact second-page shift, before drawing the position/key conclusion.
- Lines 45 and 135–139 direct following a tied or moved row. The keyset predicates and mixed/null ordering are already complete; replace the figure operations with the explicit row movement and boundary.
- Lines 155–159 tell readers to switch isolation levels and watch status, but do not state both observed status outcomes beside that comparison. State Read Committed's later paid status versus Repeatable Read's original pending status; connect it to the export promise.
- Line 184 uses “In Figure 4” as the resume counterexample. Name the earlier pending snapshot and later new transaction directly. The projection/membership/position distinction and retention costs are otherwise strong.

### partitioning.astro — full read, changes needed

- Lines 13 and 35 ask following a row, playing and changing queries. State the timestamp-boundary example and October/full-year/ID-only pruning consequences directly. The later prediction/evidence already contains exact piece counts and separate line-join work; preserve it.
- Line 68 says Figure 3 “shows the difference” between order-ID uniqueness and timestamp-pair uniqueness. Lines 70–76 already explain that difference well; use that prose as the teaching transition.
- Lines 83–85 say to change the approved retirement cutoff to 15 January “and see why the operation must stop”. Explain in prose that January's partition also contains records on/after that cutoff, so dropping the whole piece would remove ineligible records. This precise reason is missing outside the figure exercise.

### placement.astro — full read, changes needed

- Lines 25, 43 and 59 direct changing regional layouts/failures and comparing healthy/degraded routes. Most survivor counts, network assumptions and remote-owner consequences are already explicit. Replace the control directions with those ordinary hypothetical cases.
- Line 73 asks turning on the order-ID owner; introduce G as an optional design variation directly. Keep its own majority and participation in the same purchase protocol explicit.
- Lines 85, 97 and 113 lean on a figure's successful reply/local-copy state or “passing Figure 1”. Restate the required state and majority condition directly. Preserve the good distinction between structural majority survival, actual communication/resource availability and measured recovery latency.

### query-execution.astro — full read, changes needed

- Lines 31 and 38 promise following a drawing and watching grain change. State the report's possible scan/filter → line join → customer aggregation → final sort route in prose, with input/output row meanings. Later operator explanations supply the pieces, but the initial route currently belongs to Figure 1.
- Lines 58, 61 and 64 ask switching join methods and repeatedly use “In the drawing”. Explain the same eligible-order/line example directly while preserving nested-loop, hash and merge mechanisms.
- Lines 105–107 put detailed loop/result flow in Figure 3. Much measured reasoning is in prose, but make the 20,158 repeated order-total calculations and emitted line/result grain independent of the summarised plan drawing.
- Lines 130–132 leave the parallel-local-aggregation example's essential 2,000 lines versus four partial totals, then two combined customer totals, in Figure 4. Prose needs the shared customer groups and final combine obligation, not just “The local addition helps”. Keep row count separate from bytes and total work.

### replicas.astro — full read, changes needed

- Lines 26–30 direct watching C become durable and refer to “the durable step”/“order drawn”. State received, durable and applied states as the replica's concrete history; the existing distinction is strong and should remain without stage references.
- Lines 56–59 never independently walk the successful qualification/wait and fallback paths that Figure 2 is asked to show. State that a required-history wait either qualifies the actual target before taking the new snapshot or expires into primary/other-qualified-target/unavailable fallback; no old read silently meets the stronger contract.
- Lines 66 and 89 ask changing session state or write arrivals in figures. The monotonic-read and backlog arithmetic is already present, so use it directly.
- Line 102 starts from “Figure 1's durable-but-unreplayed state”. Describe A's durable C and stale applied price, and B's missing C, independently. Symbolic H/U/C bookkeeping and diagram provenance can be reduced or moved to captions where it serves only the visual.

### retry-outcomes.astro — full read, changes needed

- Lines 44–46 ask following two figure columns before saying “In the first run… In the second…”. Introduce the absent/present committed purchase cases as independent executions in prose; the starting stock and possible outcomes are otherwise explicit.
- Lines 73 and 84 ask moving the retained-result record across a boundary and switching A's commit/abort. The atomic-gap and competing-unique-key explanations at lines 75 and 86–89 already carry the meaning. Recast those sentences around the actual transaction outcomes, avoiding redundant new case lists.
- Request identity/payload, refusal versus abort, savepoint rollback, recovery and retention are thoroughly explained in prose. This article needs a coherent removal of scene-led transitions rather than disruptive technical expansion.

### schema-change.astro — full read, changes needed

- Lines 12 and 40 ask watching fields or comparing backfill rules. The compatibility bridge and stale-value race are already fully stated; make their prose the lead-in.
- Lines 65–67 ask inserting P11 through figure options. Introduce the two caller variants directly: bridge creates 8.00/800 behind the cursor, prohibited old-only creates a missing new value. Their consequences must not depend on a selected option.
- Line 81 calls “Figure 2's bad final row” and “Figure 3's old-only arrival” to explain acceptance counts. Name stale-but-present 2000 beside current 22.00, versus missing hundredths for P11, directly. Preserve the distinction between null coverage and semantic agreement, plus ongoing writer closure.

### storage-durability.astro — full read, changes needed

- Lines 15–17 ask following two page queries then say “The second query…”. State the shared-page P7/P3 example as two ordinary reads; the cache-hit mechanism is otherwise sound.
- Lines 27, 46, 71 and 76 describe comparison/control/stage operations for version storage, WAL and crash cuts. Those mechanisms are well explained in adjacent prose and can be introduced directly through the transaction and storage state.
- Lines 83–85 introduce write amplification through a Figure 6 work map. Make clear in body prose that the one logical price edit may generate recovery records, table/index-page work and later cleanup; preserve the warning that these are not additive fixed page-write counts.
- The durability promise, surviving-storage assumptions, asynchronous-commit distinction and backup/replica boundary already stand without figures. Do not replace them with a verbose transcript of the animation.

### transactions.astro — full read, changes needed

- Lines 16, 39, 56, 64, 93 and 107 direct following, switching or watching figure states. The all-or-nothing purchase, guarded update, Read Committed versus Repeatable Read, payment write skew and serializable refusal are already explained with concrete outcomes. Replace the control instructions while preserving explanatory order.
- Line 107 chooses A as a figure winner and line 119 says “In Figure 4, B's new attempt…”. State A as one possible committed request and B as a fresh-attempt refusal, without giving the diagram authority over the schedule. Keep the qualification that either transaction can lose.
- The article substantially meets prose completeness already; the shortfall is its repeated scene-led framing and cross-references, not missing transaction theory. The common-lock caveat remains important and must not be lost in simplification.

### writes.astro — full read, changes needed

- Line 60 says “Compare applying each change once with applying it twice” without naming a diagram, but it is still a control-like instruction. The next paragraph gives the replacement-versus-delta reasoning; make the example's subject and two outcomes explicit.
- Lines 93 and 121 lead the staging/import interruption through Figure 3. The article already states sealed B17, applied/rejected/pending identities, two committed chunks and unchanged stock/order agreements. Use the known interruption as a subject example directly.
- The conditional-write, affected-row, upsert-policy, validation, chunk boundary and reconciliation explanations are otherwise independently developed. Preserve their technical scope and retained evidence; do not expand a limited single-worker import into a new concurrency protocol.

## Overall judgement

All 24 worker-owned articles were fully reread; every one needs changes under the user's strict removability requirement. This does **not** mean all are missing their main explanation. `aggregation`, `locks`, `retry-outcomes`, `schema-change`, `transactions` and `writes` already contain much of the necessary reasoning and mainly require subject-led recasting plus a few concrete context repairs. `application-sql`, `backups`, `incidents`, `distributed-commit`, `distributed-snapshots`, `outboxes-jobs`, `pagination` and `query-execution` contain more consequential figure-only setup, branches or outcomes that must be restored to the article itself.

Acceptance should read the revised article body with illustration components and `<figure>` elements absent, retaining ordinary SQL/code listings and semantic data tables. An article fails if a figure's label, chosen mode, step, layout or outcome is still needed to resolve a noun, causal link or reader decision. Afterwards retain the figures as optional visual reinforcement, checking their agreement with the prose rather than using their presence as evidence that a prose gap is acceptable.
