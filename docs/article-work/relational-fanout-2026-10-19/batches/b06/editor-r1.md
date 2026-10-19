# b06 — adversarial editor, round 1

Reviewed all four assigned plans and contexts against the original relational-practice goal. No context-linked or other review report was read. All four plans stop at sections; no further child articles are justified.

## a17 — Changing data with SQL

**Pass.** The target-set/postcondition approach gives the article a practical purpose beyond a statement catalogue. Insert identity, source-driven update ambiguity, dependent deletion effects, conflict outcomes and evidence of change are distinct decisions worth retaining.

- Keep the opening as a short extension of the parent's workflow, using one target-set contract throughout. The final exercise should combine those decisions rather than introduce another source dataset or general testing method.
- Reuse duplicate source keys across source-driven updates and conflict-handling inserts. Keep the latter as one outcome comparison; omit a separate MERGE walkthrough unless the fixture requires different actions for matched and unmatched rows. Cutting syntax coverage loses no declared change capability.
- Counts, returned rows, dependent effects and postconditions earn the transaction-inspection section. Teach only the extra failed-session/rollback behaviour needed for the exercise; isolation, commit uncertainty, retries and production correction procedures already have owners.

## a18 — Designing changes that coordinate with locks

**Pass.** The all-writers argument, stable coordination identity and visibility after waiting make this a useful protocol-construction article rather than a lock-mode survey.

- Keep the unprotected race as a compact recall of the parent's problem. Spend the explanation on paths that bypass coordination, missing rows and the actual protected read/change interval.
- The visibility assumption required by the PostgreSQL protocol must be stated and checked locally. Link to a19 for why engines/settings differ; do not make readers complete the entire engine comparison before they can assess this protocol.
- Keep the multi-resource move because it creates a new acquisition-order decision. Limit lock-mode and deadlock explanation to what that protocol uses; no compatibility-matrix tour or independent deadlock curriculum is needed.
- Omit the optional claim example unless it is needed to distinguish waiting/refusal from “no eligible work”. If retained, one counterexample is sufficient. The loss from omitting it is queue-specific breadth; capacity-protocol construction remains complete.
- Reuse the earlier statements in the final worksheet rather than presenting a second complete tutorial. Waiting/contending performance and retries remain linked obligations, not additional procedures here.

## a19 — Reading and testing isolation guarantees

**Pass.** The visibility, mixed-read/write and multirow-invariant cases each support a consequential application decision. Comparing only PostgreSQL and InnoDB cases that change that decision avoids a vendor curriculum.

- Use one reservation schedule for snapshot timing and the locking/concurrent-update extension. The staffing example should appear only when the first invariant cannot expose the different-row dependency; avoid rebuilding the parent's full anomaly lesson.
- Keep serialisation rejection focused on the resulting whole-transaction obligation. a18 owns protected-row selection and acquisition order; application integration owns retry machinery. No protocol or driver tutorial should grow here.
- Fold the compact real-time-order distinction into the opening contract checklist or the serialisability section if it does not require a substantial worked case. Keep its practical caution, but omit a stronger-ordering taxonomy or distributed timeline expansion. No needed understanding is lost by removing a separate theoretical stop.
- The final worksheet should assemble the existing schedules and their limited conclusions. One shared schema/seed setup can also support a18; avoid two independent introductions to concurrent-session testing. Captured cases must end in a protection/abort-handling decision, not merely a comparison table of engine observations.

## a20 — Managing connections and transaction lifetimes

**Pass.** Stateful ownership, safe reuse, proxy/session compatibility, slow consumption, bounded demand and diagnosis are ordinary application reliability requirements. Their depth serves relational practice; there is no need for a driver/protocol specialist branch.

- Use the ownership chain and resource-state diagram as the shared explanation across errors, cancellation, streaming and shutdown. Cancellation and early stream exit should specialise the same cleanup sequence rather than repeat it.
- Keep one pinned driver as the executable baseline. Proxy compatibility needs only the state distinctions that alter safe reuse; omit a feature/version matrix and additional driver walkthroughs.
- The demand and diagnosis sections should share the same occupancy trace. This article owns aggregate connection allowances and ownership defects, while performance/operations own capacity selection. Do not reproduce queueing theory or a service-monitoring course.
- Shutdown earns a final failure case, not another lifecycle introduction. Preserve the distinction between releasing/discarding resources and resolving a business outcome; request recovery should link to these mechanics rather than teach them again.

All verdicts are **pass**. The proposed cuts consolidate repeated foundations and optional breadth; none removes a commissioned practitioner capability.
