# Query execution — independent reader review

Reviewed articles/query-execution/v01 at `http://127.0.0.1:4606/review/relational-rebuild/query-execution/`. All eight current files matched `review-source.json`. Scope: first blind editorial/teaching reading and actual rendered review. Initial observations are preserved in `initial-notes.md`, written before consulting the v01 plan, example facts or neighbouring ownership.

## Judgement

No critical or medium editorial, teaching or rendered finding. The article meets its bounded teaching promise for an application engineer learning physical query work. The coordinator retains acceptance authority and the independent technical review remains necessary.

The explanation follows one report rather than introducing disconnected tuning advice. Figure 1 makes the three-order → two-order → three-line → two-group route inspectable, including both occurrences for order 101 and the final 40.00/39.50 order. Figure 2 contrasts actual conceptual traces: indexed inner lookup; build then probe, including rejection of 103; ordered matching groups and exhaustion before the remaining 103 lines. The measured section then connects the small per-loop count to 20,158 repetitions. The before/after comparison removes an identified repeated aggregate rather than merely naming a different join. The workload table demonstrates a regression for customer 1001, so the concluding decision is appropriately limited to the broad report.

The references develop a mechanism visually, interpret a concrete outcome and qualify a measurement. Comparable evidence here is the explicit grain transition, repeated-work figure and partial-total boundary. The Indexes scan/planner sections and finished scan figure, Storage buffer-pool passage and finished buffer figure, and Sequence diagrams scope/readability passages provided bounded calibration. Query execution is less spatially explicit about the hash table itself, but its labelled build/probe states provide the needed first understanding.

The prose is plain and connected. Headings such as Join methods, Nested-loop joins, Hash joins and How the planner estimates the work name established subjects. Qualifications explain a consequence where it arises: a cached scan still tests rows; LIMIT does not necessarily reduce input; HAVING preserves exclusion of empty orders; accurate estimates can still describe expensive required work. The October/full-year changes are stated, and the three separate illustrative models are labelled distinctly from measured execution.

## Optional low-priority improvements

1. **Figure 2, hash build state.** The left column remains the eligible-order list while the explanatory sentence says to build a hash table. Showing the stored-key lookup structure would make the construction more directly visible, as the reference buffer drawing gives memory its own labelled region. Current labels and explanations are sufficient; this is an opportunity to reduce reliance on prose, not a substantive gap.
2. **Reading a measured plan, consecutive LATERAL SQL blocks.** The complete statement appears once to explain LATERAL and again with only EXPLAIN added. The second full copy adds scrolling without new query logic. A shorter measurement instruction could preserve the lesson. This is editorial economy, not a correctness or comprehension blocker.

## Plan, facts and ownership check after the blind notes

The v01 plan promises operators, repeated work, estimates, spills, data movement, a measured repair and workload testing. Those are covered. Index/partition design, storage internals, detailed native counters and incident triage are introduced far enough to explain their relationship, then handed to their named owners. Aggregation and join meaning remain with the prerequisite articles rather than being retaught. Core October values, exclusion of 103 and Edda, exact agreed line values and absence of payments agree with the supplied facts. The generated reporting history and extra no-lines check are kept separate from core stock history.

## Rendered coverage and limits

Inspected actual controls for row-flow stages 2–5; nested-loop initial/lookup; hash build, probes and rejection; merge initial, match, exhaustion and finish. Inspected the finished static figures and repair/parameter tables, representative 375 × 812 light/dark layouts and 1280 × 720 layouts. No document overflow at 375; table cells wrap usefully; changing output, explanation and controls remain readable together in the stacked phone layout. The approximately 740 px desktop figures can be positioned so changing output and controls fit together; automation initially centred Next and clipped the upper drawing, which is not treated as a layout defect.

Retained the assigned mechanical coverage of all player states, all three methods, keyboard/disclosures, both themes at 1280/375, no overflow and measured contrast rather than repeating exhaustive tests. Screenshots are selected-state evidence; the hidden browser is not reliable playback-timing evidence. No timing claim was inferred from those screenshots, and this reader did not rerun database experiments or perform the independent primary-source technical audit.

Browser viewport controls affected the most recently created tab; the article was therefore checked in a second owned tab at phone size. Review players were reset without playback, join selection restored to nested loop, and the theme restored to System. Final active viewport was verified as 1280 × 720. Owned tabs were closed before releasing the viewport/theme lease. No article edits, commits or publication.
