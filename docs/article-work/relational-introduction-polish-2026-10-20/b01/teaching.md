# Teaching review — relational introduction

Verdict: **pass**. No teaching repairs required.

Reviewed `src/articles/relational-next/a00.astro`, its three figure components and their query/model sources, against the original newcomer-to-expert relational-practitioner goal and the supplied `context.yaml`. Read the three complete reference articles, including their figure explanations and imported models: Sequence diagrams, Indexes, and Storage and durability. Used the frozen rendered introduction at `http://127.0.0.1:4438/review/relational-next/` and the reference previews on port 4337. Examined the actual main-child entrances and the planned ownership of deeper questions. This review covers teaching only; correctness and complete interaction/accessibility verification belong to the other assigned perspectives.

## Progression and reader effort

- **Opening and tables (a00 lines 20–45):** The last mug creates a reason for shared facts and grouped changes before terminology arrives. The four-row table gives a clear meaning to each kind of row. Identity, required references, a compound key, purchased price and missing shipment time each answer a concrete question about those same facts. The article avoids making the newcomer decode a full schema before understanding why it exists.
- **SQL (lines 47–59):** The first selection supplies an expected answer and explains its clauses. The larger query is the steepest increase in syntax, but Figure 1 supplies the intermediate row meanings rather than asking the reader to infer them from SQL. Explicitly starting after the customer join keeps the comparison small. The subsequent duplicate, missing-match, NULL and count discussion consistently answers what one output row represents. This is enough to recognise a plausible-but-wrong report; query construction and broader query fluency properly remain with a02.
- **Transactions and applications (lines 61–81):** Partial failure, visibility, competing buyers, conditional reservation and uncertain acknowledgement are introduced as different questions in that order. The text does not turn atomicity into an unexplained cure for concurrency. The conditional update gives a useful first resolution, including the application's obligation to inspect the result and roll back a failed reservation. Payment remains recognisably outside that resolution. The application section then builds on commit rather than introducing connection failure before the reader has something concrete to lose.
- **Performance, evolution and operation (lines 83–107):** Each section supplies a useful first decision: compare work rather than answer size; keep old data and old writers compatible; choose recovery inputs for the actual failure. Plans, percentiles, physical schema-change work and recovery objectives are orientation here, with the procedure and engine detail retained by a05–a07. Adding those details to the introduction would increase effort without improving its first working model.

## Does each model earn its attention?

| Model | Teaching value at introduction scope |
| --- | --- |
| Figure 1, rows | Yes. The visible intermediate rows turn one order into two legitimate item matches and then back into one £36 total. Switching the join preserves the same question while exposing the missing order and NULL total. |
| Figure 2, grouped changes | Yes. The request and new-reader columns make both partial commitment and the visibility boundary observable. The failure contrast teaches why grouping matters; the successful path shows when the facts become available together. |
| Figure 3, missing reply | Yes. Holding “No commit confirmation” constant while stored order state changes isolates the application’s uncertainty. It deepens the existing commit model without requiring a network-protocol lesson or a complete retry implementation. |
| Figure 4, lookup | Yes. Twelve rows on three pages make the difference between answer size and physical work countable. The index route visibly leaves two table pages alone. Its own search cost is explicitly excluded rather than silently treated as free. B-tree construction would belong in the performance branch. |
| Figure 5, live change | Yes. The three state cards keep the rule, historical row and old writer separate while the transition advances. This makes “add a required column” a compatibility problem with three conditions, without reproducing a migration runbook. The stated availability of confirmed historical values keeps the successful route comprehensible. |
| Figure 6, recovery | Yes. Changing the failure while retaining the three copies shows why a current replica answers writer loss but repeats a deletion. It supports choosing the needed earlier state; promotion and restoration mechanics remain with the operation branch. |

The added card-based comparisons are simpler than the references' mechanism drawings, but they serve simpler questions. Their value is the controlled contrast and stable identity of the facts across steps. No additional notation is required. The prose gives each comparison a question beforehand and interprets its consequence afterwards, following the reference teaching pattern. The text alternatives also let a reader obtain the comparison without completing playback.

## Fit with the children

The conclusion (lines 109–122) separates practice from a production adoption decision and makes the initial working route explicit: setup, data design, SQL, transactions, application integration. It also gives task-specific entrances for slow work, service limits, live change and selection. The performance routes are evidence-dependent alternatives; SQLite and CockroachDB are conditional candidate checks. Those choices match the supplied plans and actual main-article entrances. The introduction supplies reasons to enter those articles without making their deeper mechanisms prerequisites for understanding this page.

The full piece establishes a usable model of relational work and its boundaries. It does not attempt to establish expert operational or query skill in an introductory page, and its child routes supply the commissioned progression towards that goal.

## Browser handoff

Temporary review tab closed. No viewport or theme preference was changed.
