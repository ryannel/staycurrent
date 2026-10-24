# Teaching review · informed repair confirmation · r04, r08, r09, r10, r11, r12, r16, r17 · repair-set-v03

Highest severity: none

## Inputs and scope

Exact frozen input: `repair-set/v03/manifest.json`; version `repair-set-v03`, frozen `2026-10-24T04:14:48.330361+00:00`. The manifest supplied version, routes and permitted-input boundaries, not source or mechanical evidence. Complete current rendered pieces were read at these exact URLs, including all captions, code, tables, disclosures, text alternatives and final Sources outside the article body:

- r04: http://127.0.0.1:4484/review/relational-collection/data-lifecycle/
- r08: http://127.0.0.1:4484/review/relational-collection/updates-and-imports/
- r09: http://127.0.0.1:4484/review/relational-collection/application-sql/
- r10: http://127.0.0.1:4484/review/relational-collection/indexes/
- r11: http://127.0.0.1:4484/review/relational-collection/query-execution/
- r12: http://127.0.0.1:4484/review/relational-collection/partitioning/
- r16: http://127.0.0.1:4484/review/relational-collection/conflicts-and-retries/
- r17: http://127.0.0.1:4484/review/relational-collection/outboxes-and-jobs/
- Unchanged dependency context r14: http://127.0.0.1:4484/review/relational-collection/locks-and-deadlocks/

Permitted context read: this frozen set’s commission and example record, the piece briefs and own plans (including child stubs and named prerequisites/neighbours), and the shared tree’s commission/ownership rules. The repair-set example record and the later sets’ specialist-vector extension were treated as their own exact context; the shared core and recovery facts agree. The current review skill and only its teaching perspective supplied the seven checks. The accepted problems/pass conditions came from the assigned confirmation brief. No earlier drafts, peer reports, author quality notes, product source or mechanical receipts were read.

Focused reference calibration used the rendered Sequence diagrams passages on lifelines/replies, waiting and causal order (Figures 1–2), Indexes on composite key order and fetched-row work (Figure 7 and its surrounding explanation), and Storage and durability on old versions/free space, WAL/reply ordering and asynchronous commit (Figures 3–5/10 and their explanations). Actual fixed-reference drawings viewed: Sequence diagrams Figure 1, Indexes Figure 7, Storage and durability Figure 3. Exact reference URLs: http://127.0.0.1:4350/review/examples/sequences/, http://127.0.0.1:4350/review/examples/indexes/, http://127.0.0.1:4350/review/examples/storage/. This was proportionate calibration for informed confirmation, not a fresh full-reference article review.

Current actual 1280×720 views: r10 Figure 1 (all four states), Figure 2 (customer 4, history 3, date-first 4 states), and r12 Figure 1 (all four queries × five states). Complete current alternatives supplied the remaining figure paths, including r04’s six two-time answers, r08’s replay policies, r09’s four ownership paths, r11’s three algorithms, r12’s detach sequence and r16/r17’s failure histories. r14 was read in full as unchanged lock/snapshot dependency context.

This report is a focused informed confirmation. All seven teaching checks were applied to each named addition/restructured passage or figure, its current complete surrounds and affected downstream explanation. Reading complete current articles supplied context; it does not give independent initial, blind final or corpus credit. The local repairs did not invalidate the overall article order or require a wider collection reassessment.

## Accepted problem results

| Problem / named addition | Result | Evidence and placement judgement |
| --- | --- | --- |
| r04/r08/r09 · setup and inherited PG settings | Pass | Each repeat section teaches tools, supported macOS/Linux scope, binary-path substitution, disposable environment and temporary-directory assumptions before invocation. It explicitly limits observed execution to macOS and explains clearing inherited PG settings in the actual process and child tools. The setup belongs at the optional experiment boundary; it does not interrupt the main explanation. This confirms the teaching, not the implementation. |
| r10 · customer-only entries and fetched information | Pass | Figure 1 stores customer_id plus a locator; the order ID appears in the referenced table. Across Figure 2’s three routes, dates/IDs/status become known from the key or table at the stated point. Customer-only reads/fetches 3 and sorts; history reads/fetches 2; date-first reads 3 but fetches only 2. The displayed source-of-information separation supports the later covering-index section. |
| r10 · tie and total order | Pass | The prose identifies 105 as Mina’s and 106 as Edda’s, at the same global time. It explicitly says Mina’s displayed qualifying rows do not tie. The future same-customer tie explains order_id without falsely using 105/106 for it. The date-first step visibly places 106 before 105 and rejects customer 3 before a row fetch. |
| r11 · estimated versus actual rows beneath early termination | Pass | The LIMIT 1 counterexample comes before the first-wrong-count method. That method now applies to nodes consumed to completion; the closing diagnostic procedure also requires checking consumption. The reader is prepared to distinguish an unconsumed estimate from a cardinality error. |
| r12 · predicate/map/focus/result relation | Pass | All 20 current scripted states were read. The selected predicate persists while September/October/November acquire waiting/read/skip status. Direct October returns E2/E3 from one partition; cross-boundary returns E3/E4 from two; endpoint-only reads three for E1/E2/E4; wrapped date reads three for E2/E3. The complete alternative and compact focus contract preserve why a partition remains without asserting every row qualifies. |
| r16/r17 · local example ownership language | Pass | The introductions tell the reader what the local request/outbox relation represents and what fields this protocol adds. The unchanged examples then use those meanings. The replacements belong in the introductions and read naturally. |
| r17 · uncertain claim and token equality | Pass | External work follows an acknowledged claim commit. Missing claim replies retire the provisional token for calls, renewal and completion; ordinary polling handles either committed or aborted history. The rolled-back A=1/B=1 example explains why later equality is insufficient. Completion and release uncertainty also return to the stated abandonment/polling rule. |
| r17 · expiry after waiting; dependent receiver/inbox/fencing reasoning | Pass | The lock-first Read Committed transaction precedes the separate guarded update. The prose explains the unchanged-row-lock counterexample and qualifies the deadline as a post-lock check, not a commit-time or physical-execution promise. Renewal/completion/release use the same ownership rule. Existing in-flight requests remain beyond local recall. The later receiver identity, atomic inbox, resource-scoped fencing and unresolved external-result sections remain consistent and supply the required boundary reasoning. |

## Checks by piece

### r04

| Check | Result | Note |
| --- | --- | --- |
| Starting point | pass | The repeat section names Python, PostgreSQL 18, btree_gist, ordinary-user execution and writable /tmp before invocation. |
| Order | pass | The history and deletion argument completes before optional repeat instructions. |
| Examples | pass | The same agreed 20.00 and corrected catalogue history carry through the drill boundaries. |
| Showing | pass | The two-time table and figure distinguish effective and recorded views; the setup names the checks it repeats. |
| Judgement | pass | A reader can identify the supported platform path and distinguish it from observed macOS execution. |
| Gradual exposure | pass | Temporal-policy decisions remain here; partition retention, outbox delivery and restore procedure retain their owners. |
| Placement of additions | pass | Platform/path/environment additions improve repeatability and belong in Repeat the history and policy drills; they do not interrupt the history argument. |

### r08

| Check | Result | Note |
| --- | --- | --- |
| Starting point | pass | The repeat section supplies tools, writable parent, ordinary-user requirement, dependencies and binary-directory substitution. |
| Order | pass | Conditional writes precede versions, staging, guarded publication and optional rerun. |
| Examples | pass | Version 2/3 and contradictory replay remain distinct from the shop agreement and stock. |
| Showing | pass | The feed sequence, input table and receipt show which observations and changes survive; the setup ties back to them. |
| Judgement | pass | The supported path and macOS-only observation are distinguishable. |
| Gradual exposure | pass | Request uncertainty and live backfill remain explicit handoffs, rather than added import prerequisites. |
| Placement of additions | pass | The setup/environment addition belongs beside the runnable import and improves usability without fragmenting the publication protocol. |

### r09

| Check | Result | Note |
| --- | --- | --- |
| Starting point | pass | The driver and session are explained before ownership; setup names installed tools, socket/path limits and packages. |
| Order | pass | Values, results, transaction ownership and cleanup build before the optional driver rerun. |
| Examples | pass | The scratch helper counterexample and rewound purchase are labelled, so they do not alter the core history. |
| Showing | pass | The ownership alternatives preserve success, refusal, cancellation and lost-connection outcomes. |
| Judgement | pass | The reader can run the intended local check and distinguish cancellation cleanup from an uncertain commit. |
| Gradual exposure | pass | Pool sizing and commit resolution remain with their owning articles. |
| Placement of additions | pass | Unix/socket/path and inherited-environment details belong in Repeat the driver checks and prepare the invocation at its point of use. |

### r10

| Check | Result | Note |
| --- | --- | --- |
| Starting point | pass | Heap, pages, key and TID are introduced before following the locator; the caption says the order ID comes from the table. |
| Order | pass | Figure 1 establishes stored key versus fetched row before Figure 2 counts the different searches. |
| Examples | pass | 101/103/105 remain Mina’s rows; Edda’s 106 supplies a global tie, while the future same-customer tie is stated separately. |
| Showing | pass | The key/locator and fetched-row separation, plus the complete three-route alternative, show where dates, IDs and status become known. |
| Judgement | pass | Entries traversed, table fetches and sorting lead directly to the useful key-order decision. |
| Gradual exposure | pass | Native counts and index-only visibility follow the conceptual choice; full plan reading remains with r11. |
| Placement of additions | pass | Both restructured figures belong here. The tie qualification sits beside the total-order requirement and improves it without changing the displayed customer. |

### r11

| Check | Result | Note |
| --- | --- | --- |
| Starting point | pass | Parent-driven consumption and Limit are explained before estimate diagnosis. |
| Order | pass | The LIMIT 1 qualification precedes the leaf-to-root comparison and is repeated in the final testable procedure. |
| Examples | pass | A scan estimated at 100,000 but stopped at one supplies the awkward counterexample before the fully consumed correlated fixture. |
| Showing | pass | Operator tree, route alternative and measured row table keep result rows distinct from work performed. |
| Judgement | pass | The reader must check complete consumption before deciding to refresh statistics or change a cause. |
| Gradual exposure | pass | Detailed PostgreSQL diagnosis remains a handoff; this local qualification supplies the minimum prerequisite. |
| Placement of additions | pass | The early-termination addition repairs the diagnostic rule at the exact point it is needed and belongs in this owner. |

### r12

| Check | Result | Note |
| --- | --- | --- |
| Starting point | pass | Typed half-open partition bounds precede the pruning proof; direct bounds and expression predicates are distinguished. |
| Order | pass | The persistent query, map and focus comparison link the predicate to each partition before final output. |
| Examples | pass | E1–E4 show exact boundaries, cross-month output, an endpoint-only query and an equivalent expression without pruning. |
| Showing | pass | The complete four-query alternative gives retained/scanned ranges and result IDs; the map/focus presentation preserves that relation. |
| Judgement | pass | The reader can derive why each partition can be skipped or must remain, without treating qualification as pruning. |
| Gradual exposure | pass | Local index choice, identity limits and lifecycle follow; cross-server ownership remains a later handoff. |
| Placement of additions | pass | The compact comparison belongs beside the pruning proof and strengthens it; the focus is still qualified by the selected query. |

### r16

| Check | Result | Note |
| --- | --- | --- |
| Starting point | pass | The local purchase_requests introduction states what a row means before its declaration. |
| Order | pass | Request identity precedes atomic recording and uncertain-outcome resolution. |
| Examples | pass | The committed and aborted histories use one request and complete stock vector. |
| Showing | pass | Both failure histories and the complete resolution alternative distinguish caller knowledge from database state. |
| Judgement | pass | The reader can choose replay, refusal or bounded unresolved handling without treating absence as ownership. |
| Gradual exposure | pass | External delivery and recovery are handed to their owners after the request protocol. |
| Placement of additions | pass | The reader-facing local-example wording fits the table introduction and scratch scope naturally. |

### r17

| Check | Result | Note |
| --- | --- | --- |
| Starting point | pass | The opening explicitly requires retry and lock reasoning; local field meanings and database clock precede claims. |
| Order | pass | Acknowledged claim, discarded uncertain token, lock-first expiry test and completion are taught before receiver/inbox/fencing boundaries. |
| Examples | pass | The rolled-back token-1/current-token-1 counterexample explains why equality cannot recover an attempted claim; A/B recovery preserves the effect ID. |
| Showing | pass | The transaction boundary and five-stage failure history show both durable intention and paused-worker recovery; code makes the post-lock test visible. |
| Judgement | pass | The reader can abandon uncertain claim/renew/complete/release outcomes, return to ordinary polling, and distinguish database authority from an in-flight external call. |
| Gradual exposure | pass | Receiver deduplication, inbox atomicity and resource-wide fencing keep distinct jobs; primary fencing and logical streams retain their owners. |
| Placement of additions | pass | The uncertainty and expiry additions improve the actual claim protocol and sit before their dependent actions. The local field introduction belongs here; the caveats integrate with the later receiver/fencing account. |

## Findings

No new substantive or optional teaching finding. Every named addition improves the explanation or its usability, belongs with its existing owner, and sits where the dependent argument needs it. No addition required relocation.

## Applicability and limits

The unchanged explanations and downstream uses were read in their current frozen form. No earlier quality verdict was reused. Complete text alternatives were used as permitted state readings; the affected current live states named above were also read directly. Technical truth, native verifier provenance, file saving and production behaviour were not independently certified by this teaching perspective. No download event/path/save API was used.

Actual views used the existing 1280×720 viewport with System selected (resolved dark). No viewport or theme changes were made. Phone sizes, both-theme pixels, contrast and complete control certification belong to the separately commissioned visual confirmation; this report does not claim that coverage. The complete labelled alternatives were sufficient to judge the teaching relationship and placement, so that separate visual scope leaves no missing teaching check here.

The one owned browser tab was closed, and changed figure controls were restored to their initial choice/step before navigation. No product edits, builds, commits, pushes or publication were performed.
