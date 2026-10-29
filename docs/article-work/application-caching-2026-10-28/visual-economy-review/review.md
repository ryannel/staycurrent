# Application caching: visual teaching economy

29 October 2026. Review of article revision `09f2f8f3`, using the lightly revised `staycurrent-review` skill. This is a review delivery, not a repair or publication approval.

## Skill change

The main skill now asks the reviewer to judge what the visual form contributes before checking its implementation. The visual perspective asks for a reason the form helps, identifies repeated actors, structure, labels and controls that add effort without understanding, and recommends simpler forms when they preserve the explanation. It explicitly retains motion where movement teaches. No additional review round or checklist was introduced. The skill validator passes.

## Findings to repair

Three substantive findings remain open:

1. **Medium — Cache memory, Figure 1, “The working set fits”.** The lesson is the difference between a large catalogue and the small set worth retaining, but the visual repeats the familiar request route and hit totals. Its database is an empty cylinder, so the new size/subset relationship comes from prose. Make the catalogue and resident subset directly comparable; retain only the request movement needed to explain how that subset forms.
2. **Medium — Cache memory, Figure 4, retention replay.** The current-request line overlaps the cache-budget label. Confirmed in the live desktop article, as well as intermediate and final review frames. Separate the status from the stable cache heading. Keep the capacity strip, useful counters and controls.
3. **Medium — Handling cache misses, Figure 5, source admission.** The figure shows a route, queue and execution slots, but omits the time boundary explaining its refusals. The fast case announces that queued work cannot finish without showing the 50 ms remaining versus 100 ms needed. Connect the queue to execution lanes and show the shared 150 ms deadline, including work occupying slots after callers time out. Redis Figure 3 already offers a useful local example of making remaining time visible.

These findings concern the reader's understanding or legibility, not incorrect simulation arithmetic. Repair them locally and confirm their surrounding explanation and relevant variants. They do not require another collection-wide review.

## Optional simplifications

- **Benefits Figure 2:** preserve a hit/miss mark for each completed request, so the total remains inspectable without replaying the route.
- **Keys Figure 4:** show the unchanged key context once and retain concise before/after values. Live playback confirms that the final frame replaces the earlier source revision, leaving the reader to remember that first change.
- **Misses Figure 4:** consider aligned answer-lifetime and refresh tracks instead of another full network. The existing request movement does help show serving during refresh, so this is a trade-off, not a requirement to remove every actor.
- **Versioned fills Figure 1:** tighten the paired cache outcomes under one common delayed-fill setup, preserving the visible accept/refuse distinction and unsafe-rule warning.

## What should stay

The review did not find a reason to replace the visual language or make everything static. The percentile and source-speed alternatives change useful conclusions. Age versus insertion lifetime, reads surviving caller deadlines, leases ending before work, stale fills and invalidation races benefit from aligned timing or causal movement. The memory replay's controls make retention choices inspectable once its label collision is fixed. The revised absence table already expresses its three outcomes economically.

The coordinator additionally reviewed the Redis and operations figures in their article context. Redis's optional-fill comparison uses the familiar route to show a new boundary: the caller keeps the source answer even when the copy is rejected. Its deadline diagram exposes the time left for an optional fill directly. The operations latency bars make equal total waits with different causes comparable; the failover sequence needs separate surviving copies to explain the returned old value; the rollout bars put demand beside a common source allowance. Their parallel tables and code serve distinct decision or implementation purposes. No additional substantive design finding from these two articles. Growing the comparison bars is not necessary to understand their finished states, but that alone does not justify a redesign.

## Coverage and evidence limits

All numbered visuals across the eight deeper articles were inspected in their surrounding explanations. Two independent readers covered six articles; the coordinator covered Redis and operations, checked the established introduction for continuity, and confirmed the memory collision, key-version transition and fast source-admission outcome in the live article. The approved introductory design was not reopened as a fresh full review.

Independent readers calibrated against rendered Storage and durability reference figures. Their hidden browser tabs did not advance animations reliably. We therefore also used clearly labelled temporary snapshots at initial, intermediate and settled fractions, generated with the actual scene renderers inside the built articles with their native styles, prose and captions. Meaningful alternative endpoints were included. These are rendered-state evidence, not certification of playback pacing. The coordinator's live checks supplement them but do not establish every transition or alternative's timing.

This pass judges visual teaching economy at desktop width. Earlier functional, phone and theme checks remain separate evidence; they do not establish good design and were not repeated as a substitute for this judgement. Product files were not changed. Three substantive findings remain unresolved, so this report is not a clean visual sign-off.

Detailed independent findings and coverage:

- [Choice, keys and memory](choice-memory.md)
- [Freshness, versioned fills and misses](freshness-misses.md)
