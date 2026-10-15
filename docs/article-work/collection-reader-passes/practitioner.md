# Application practitioner reading

Frozen afbf6f7, browser at 4324 (overview initially 4322, identical baseline). Audience: ordinary application engineer learning relational reasoning. Read assembled DOM in h2-bounded chunks, sentence by sentence, with screenshot inspection of every figure. Collapsed disclosures excluded, then opened separately where useful. This is an agent application pass, not observed novice performance. No author history or other review records consulted.

## Sequential notes

### 1. Overview

Chunks 0–3: I can map product input to columns, identify P7 across changes, and follow O12/P7 to Blue mug, 2. The schema/engine separation is explicit. Question at customer-detail reuse: what about the historical purchase? Resolved immediately by price-paid example. I supplied ordinary code knowledge of field access for qualified SQL names; ON/WHERE/SELECT explanation makes the SQL usable. Can adapt WHERE to O13 and understand why a missing product would lose the join result. Figures 0–2 inspected: readable table, reference arrows, code and output; all reinforce prose.

Chunks 4–7: Can predict adding C4 order requires index maintenance and returns a third order. Foreign-key and required-value distinction supports avoiding nullable references. Transactions identify application as executor and rollback owner. Lock sequence makes protection of the *decision* transferable. If stock were two, second buyer would see one and succeed; if first rolled back, second sees one. I supply the application-code branching, but the text explicitly names checking and declining, appropriate for overview. Question: what executes the stock decrement? Concrete SQL is deferred to concurrency collection, acceptable here. Read Committed distinction between ordinary reads and locking reads is clear.

Method limit: initial capture inadvertently exposed text of overview figures 3 and 4 before chunks 4–7. No later-page content exposed. This limits a blind-first encounter claim for those two figures.

Chunks 8–12: Distinguishes scaling read copies from dividing ownership, without claiming to teach implementation. Costs derive from capabilities already explained. Working/planned navigation honest. Figures 3–4 pixels inspected: arrows clearly map repeated C4 entries; lock timeline makes waiting and updated stock visible. No interactive media in overview; navigation disclosures are not explanatory controls. Overview supports choosing further reading, not configuring a database, as promised.

### 2. Designing your data

Chunks 0–2: Schema/data figure supports translating a type definition into records. Normalisation example makes customer-name correction one write while IDs repeat. Could adapt to supplier addresses. Composite order-line key is motivated by same-product/different-price entries; this is more useful than terminology alone. Questions raised before next section: how do I decide remaining fields belong to the chosen identity; how will duplicate product lines affect stock? First explicitly promised next; second retained for later transaction application.

Chunks 3–5: dependency direction explained with a counterexample (customer does not determine order). Can apply to invoice/invoice-line. Normal-form figures 2–5 inspected: keys underline and field moves explain actual operations; third-form figure is tall but connects €18 retained with €20 current. Lossless split figure 6 shows four matches when line_no removed, allowing me to predict three products × three prices = nine matches. Strong transfer test. Reconstructing P8/O13/C4 explicitly traces the foreign keys. No missing prerequisite for this step. The long normalisation chunk was delivered as one h2 section containing three h3 subsections; read those subsections in sequence, but observations recorded after the entire h2.

Chunks 6–8: Question about historical names explicitly answered: IDs do not freeze referenced fields. Can decide which shipping-address value to keep. Extra split warning now has a concrete operation cost, with denormalisation ownership clear. Type section supports adapting quantity to fractional fabric and preserving leading-zero identifiers. NUMERIC input rounding is explicitly shown before enforcement; retain question whether a positive-but-subcent input becomes forbidden zero. Text extraction accidentally included non-rendered script/noscript content for the interactive section; ignored as reader evidence and extraction corrected thereafter.

Chunks 9–12: SQL definitions tie each proposed value to rule and owner. Free zero-price items settle the subcent-positive question, though negative subcent rounding remains a possible input-policy question for constraints. Insert maps values explicitly; branch distinction (database rejection vs application validation) is clear. JSON overview explicitly admits no guarantee every mug gets details, preventing false assurance. Receipt reset is explicit and important: the earlier added line would otherwise alter expected result. Predicted Sea-blue mug / 2 / 18 / 36, original name unavailable, before opening answer; matched.

Media checks: nine static figures inspected. Both custom-element experiments exercised and pixels inspected. Name-copy update leaves O13 outdated, reference layout makes one correction visible to both, catalogue update preserves EUR 36 purchase. All six rule proposals tested with intended rules; missing quantity accepted when NOT NULL removed while CHECK remains. Screenshot makes accepted unknown quantity clear. Controls are integrated with preceding SQL. No material design-page application gap found; the duplicate-product stock question is carried forward.

### 3. Constraints in depth

Chunks 0–3: Shared-writer figure pixels inspected; arrows converge at one database rule, with acceptance only for that rule explicitly qualified. Distinct business-valid vs merely typed and scope of uniqueness reinforced. Error execution advice (separate statements outside transaction) supports actually running probes. CHECK unknown explanation gives enough to predict quantity=NULL accepted, and NOT NULL rejects it. Type-before-CHECK paragraph addresses represented amount, but does not decide an incoming negative subcent price policy; this is a boundary stated rather than silently hidden.

Chunks 4–8: Can map each insert to accepted/rejected result without external SQL knowledge. Composite-reference example explicitly handles changed state after earlier successful insert. Case-insensitive SKU policy is deliberately not implemented; reasonable onward choice, but a worked expression would be optional depth. Deletion figure distinguishes deleting a reference from deleting its target. Concurrency figure distinguishes observation from reservation and explains both commit/rollback outcomes. Can adapt to two username registrations. Wider-operation boundary explicitly identifies application responsibility. All three figures inspected; quantity demo tested all four inputs with/without NOT NULL, pixels inspected, outcomes match prose. No material application blocker.

### 4. Tables and JSON

Chunks 0–3: Nested-value figure makes path vs row distinction visible; three-layout figure separates row boundaries and constraints without implying storage sizes. Can choose an independent supplier-offer row for identity/reference/update reasons, vs material JSON. Conditional product-kind integrity is openly unresolved rather than promised. Incoming fractional capacity is explicitly deferred; record question: will final writer reject 350.5 before integer conversion? Generic triples discussion sufficient for deciding whether to investigate, not implementation.

Chunks 4–6: Fresh-state instruction prevents duplicate mug_details creation. NULL/type sample table supports predicting the 350/string ambiguity. Query intentionally fails for permitted fractional number; passage names this defect before recommending final design. Final nested CASE completes it with guarded type conversion, range, integrality, rollback, and single authority. This resolves the earlier input-policy question with enough detail to adapt 12.5 mm vs whole millilitres. Future application writer is named, though parameter binding presumed ordinary application knowledge. No need to demand a production migration framework.

Chunks 7–10: Separate independent stale-object example reset is explicit. I can trace material/finish and apply jsonb_set to another key because all arguments are explained. Row boundary illustration correctly limits independence to the row lock conflict, preserving other transaction interactions. Index paragraph offers routes without unmeasured speed claims. All four figures inspected and all five JSON demo states exercised; final SQL NULL screenshot inspected. No application blocker. One useful optional extension: ask reader to predict concurrent edits to the *same* JSON key; current explanation already supports last write wins, but does not test it.

### 5. Querying your data

Chunks 0–3: Result-grain figure lets me predict whether repeated O13 is expected. Input→SQL→rows trace explicit; parameter binding names application boundary. Keys explain exact join multiplicity. First mild interruption: O14 appears in left-join result before its introduction; next sentence explains it is an empty real header. This is resolved locally, not a blocker, but moving its introduction beside C5 would make predicting that first result possible. Cara example importantly handles a non-missing but non-qualifying order; I can predict moving ON filter to WHERE drops Cara, not synthesises a new null row.

Chunks 4–7: Can predict NULL vs zero vs count(*) for empty header because left-join placeholder explained first. HAVING/WHERE numerical difference concrete. Fanout figure and grouped-results figure pixels inspected, make €88 failure and €44 repair traceable. Prediction before opening exercise: 3×3=9 pairs, 3×64=192 amount, proper 64/3 summaries, DISTINCT only 44 and wrong. EXISTS follows outer-order grain; can adapt to “has any bowl” without accidental duplication. Strong application teaching.

Chunks 8–11: Read plan tree from leaves; 1.5×2 average explanation makes fractional count comprehensible. Diagram 3 inspected and aligns two input branches to result. Model explicitly differs from early-stopping actual plan, so full-scan count does not contradict it. Exercised 200 products/6 lines both strategies, then one line; lookup build remained 200 with one probe. Captured screenshot covers section and inspected controls/result. Prediction answer matches 9/192/64/3/44. Performance procedure is actionable (find cardinality divergence) without pretending to prescribe indexes from labels alone. Minor opportunity: a second tiny plan with an estimate mismatch would let learner practise last recommendation, but current scope supports initial inspection.

### 6. Pagination and large results

Chunks 0–3: Clear fresh example prevents O14 continuity confusion. Can trace offset insertion duplicate and deletion omission. Keyset pair's less-than explained from descending sort; equal-time tie case gives enough to adapt to ascending. Saved boundary survives deletion explicitly. Before demo move-O14 option: predict keyset misses moved unread row because it crosses saved boundary; need later qualification of “live” guarantees.

Chunks 4–6: Client/server token ownership explicit and complete timestamp retained. Extra-row flag uses last displayed boundary: practical trap handled. Index explains order of keys rather than prescribing magic speed. Order grain vs line grain ties back to previous article. Live-list caveat resolves O14 prediction and explains why high-water cutoff does not freeze versions. Mixed sort directions deliberately excluded; further worked case useful only if expanded scope promised.

Chunks 7–9: Export SQL connection ownership, loop termination, close/commit and connection-loss outcome explained. Return to original five orders stated. Figure 0 inspected; changed ascending direction explicit. Batches distinguish checkpoint from effect before onward article. Demo all four change states exercised, screenshot inspected; moved O14 absent keyset as predicted. Optional two-orders/all-lines disclosure read: one-statement CTE closes view boundary and assigns grouping to application. This is particularly useful practical completion. Page meets its stated outcomes.

### 7. Transactions and concurrency

Chunks 0–3: Fresh O14/three-stock setup explicit; prior purchases accounted. Figure 0 inspected, alternatives and boundary clear. Actual handler introduces driver, pool, await, connection, SQL vs JS, zero-row success and open transaction across branching. This resolves the overview's executor question comprehensively. Can adapt quantity 2→3 and predict available zero/one returned row; quantity 4 gives zero rows and application rollback. Not silently supplying ORM semantics. Repeated P7 lines remain a cart-scope question for later section.

Chunks 4–7: Error handling explicitly follows runtime transfer to catch, failed transaction, rollback rather than compensating increment; unknown COMMIT flagged separately before simplification can mislead. Unsafe branch isolates stale computation despite row locks. Guarded and locking alternatives expose decision placement and result handling. Can adapt to two available units and predict second success after first commits one. Partial fulfilment motivates longer decision but code intentionally remains one-mug comparison; adequate if caller carries chosen quantity consistently as text says. Figure 1 inspected; contrasts *when* B learns zero, not lock/no-lock. Missing row lock caveat prevents extension to absence checks.

Chunks 8–10: Statement vs transaction views tied to handler calls; snapshot not copied table. Featured-product rule supplies counterfactual serial orders, so RR failure understandable rather than just named write skew. Figure 2 inspected. Cart rollback paragraph supports multiple products, but repeated-product lines not worked explicitly. I can derive safe sequential guarded reservations per line inside one transaction, or sum per product first and preserve separate prices; this derivation uses already taught own-write visibility and quantity matching, so not a missing prerequisite. Consistent lock order and whole-attempt retry explain what survives (intent) vs resets (reads/calculations). Pseudocode expressly labelled, so named helper functions do not masquerade as ready-to-run code.

Chunks 11–14: Unknown outcome has two histories, stable identity before reservation, same-request check and subsequent fresh-view read. Payment figure 3 inspected; later transaction is not rollback and timeout is unresolved. Outbox closes commit-before-request crash gap conceptually. Complete attempt optional function read: narrow confirmed-rejection adapter contract and excluded unknown codes supplied; finally release/discard explicit. This is teaching code with clearly named remaining HTTP/recovery responsibilities, not an unfinished claimed production handler.

Two demos exercised all 6 concurrency method/ending combinations and 4 recovery history/key combinations to final step. Pixels of final states inspected. Unsafe+commit records two purchases at stock zero; guarded/locked preserve one; rollback lets B buy. Lost reply+new key duplicates when first committed; same key avoids duplicate in both histories. Both media teach changing consequences rather than only labels. All four static figures inspected. No material application blocker found on this main page.

### 8. Isolation and snapshots

Chunks 0–3: Builds on main article without assuming the labels answer questions. Two-connection ordering plus reset instructions supports reproducing schedule. Separate own-write example rolls back, preserving original price. Can predict first query after writer commit sees 22 even if BEGIN preceded commit, because snapshot established at query, not BEGIN. This is a useful changed-event-order test. Locking/update failure distinction named; no unsupported inference supplied.

Chunks 4–7: Same-row guarded update vs cross-row EXISTS predicate explicitly contrasted. This prevents overgeneralising previous stock solution to all atomic statements. Common-control-row example ties later statement to fresh view; warns RR lock does not refresh snapshot. Both figures inspected, readable and correctly ordered. Isolation demo both levels stepped through all events; final pixels inspected. Can choose report consistency vs coordinated decision with concrete reasons. No material blocker.

### 9. Handling conflicts and uncertain outcomes

Chunks 0–3: Wait != reservation and deadline != cancellation confirmed; specific driver cleanup responsibility. Deadlock diagram inspected, arrows make dependency cycle readable and no victim prediction. Sorted acquisition example ends rollback intentionally, so it cannot be mistaken for completed checkout. Pseudocode bounds retries and total time, waits outside connection, carries identity. Can adapt to third product and identify why consistent full order matters. No missing operational branch at this point.

Chunks 4–5: Two-histories figure inspected; what database did separated from application evidence. Stable key figure inspected; committed state snapshots not duplicate storage. Branch SQL explicitly says hold same connection, returned/no-row decisions, skip reservation on replay, reject changed request, end both branches. Local statement “Commit makes ... durable together” relies on overview's earlier durability-settings qualification; acceptable on complete-route reading, but direct entrant might read absolute durability. Larger-cart canonical request comparison names actual unfinished extension rather than pretending one-line equality covers it. Code placeholders labelled pseudocode.

Chunks 6–8: Empty recovery lookup is explicitly not absence proof; pending-claim figure 3 inspected. Fresh Read Committed statement is causally tied to post-wait visibility. Retention and authoritative-state requirements clear. Prediction before opening final answer: preserve K14, claim again to coordinate pending first attempt; known 40P01 permits fresh complete retry after cleanup, retaining intent and key. Summary table matches preceding procedure. All four figures inspected. No interactive model on this page.

Final exercise answer matched prediction. Optional practice disclosure inspected after the article: explicitly fresh database, initial P7=3/P8=2, operation key nullable for historical orders. No claim that I executed PostgreSQL SQL or two-session schedules: this pass tested application reasoning and browser media. External source verification, mobile layout, accessibility, and database concurrency execution were not part of this pass.

## Coverage and supported application outcomes

| Page | Read sections | Static figures inspected | Interactive media exercised |
| --- | --- | --- | --- |
| Overview | Intro through sources, chunks 0–12 | 5 | None |
| Designing your data | Intro through sources, chunks 0–12 | 9 | Fact correction; six rule proposals and missing-value toggle |
| Constraints | Intro through sources, chunks 0–8 | 3 | Four quantities × required/optional |
| Tables and JSON | Intro through sources, chunks 0–10 | 4 | All five representation states |
| Querying your data | Intro through sources, chunks 0–11 | 4 | Catalogue/receipt sizes and both lookup strategies |
| Pagination | Intro through sources, chunks 0–9 | 1 | All four changes between reads |
| Transactions | Intro through sources, chunks 0–14 | 4 | All six concurrency combinations; all four lost-reply combinations |
| Isolation | Intro through sources, chunks 0–7 | 2 | Both levels through all events |
| Conflicts and retries | Intro through sources, chunks 0–8 | 4 | None |

Screenshots are in `practitioner/` beside this record. Thirty-six static figures and nine interactive aids were inspected in pixels. Interactive states were changed through Playwright controls. Routine navigation disclosures were excluded from media counts. Optional article material inspected: modelling prediction answer; query fanout prediction answer; pagination complete-orders disclosure; whole transaction-attempt function; final recovery prediction and practice setup. Other collapsed setup/reference material was not counted as default-visible teaching.

This route enables an application engineer to choose row identities and dependencies, retain historical purchase facts, map typed inputs and constraints to accepted writes, migrate a known JSON capacity under an explicit input policy, predict join multiplicity and null aggregates, page order headers without truncating lines, distinguish live continuation from fixed exports, branch on actual database results, protect stock decisions, and classify known rejection versus uncertain completion. These conclusions are supported by changed-input predictions in the sequential notes, not recognition of terminology.

## Prioritised findings

No material application-comprehension blocker was found on this nine-page route. There is no justified major repair recommendation from this perspective. The figures and explicit application/database exchanges should be preserved.

1. **Low priority — introduce O14 before asking the reader to interpret its first query result.** On `/query-results/`, “Our added customer C5, Ben, has no orders” prepares one new record, but the displayed result also contains C4/Ada/O14. Only afterwards: “O14 is different: it is a real order header belonging to Ada, though it has no lines yet.” A reader can accept the explanation, but cannot independently predict the first left-join output from the default-visible setup. Move the O14 sentence alongside Ben’s introduction. Recheck by asking for all rows before exposing the output. This is a small sequencing repair, not a failure of the later NULL or grouping explanations.

2. **Optional practice depth — carry a permitted repeated-product cart through reservation.** The design explicitly says “Our shop permits separate lines for the same product, perhaps at different agreed prices.” Transactions later says “A cart containing a mug and a bowl can reserve each stock row with a guarded update inside one transaction.” The route contains enough facts to derive either sequential per-line reservations or a per-product quantity sum, but it does not test that transfer. An optional prediction could supply two P7 lines at different prices whose combined quantity exceeds stock and ask what rolls back. Preserve separate line prices while checking the combined stock effect. This would reduce application effort; it is not required to understand the one-line checkout and should not trigger a production-cart implementation.

3. **Optional performance practice — show one estimate mismatch.** `/query-results/` recommends “compare estimated rows with observed rows at the operation where they begin to diverge,” while the displayed plan intentionally hides costs and only supplies actual rows. The advice is sound; a learner has not practised locating the mismatch. A compact paired estimate/actual excerpt could test the next step. This belongs in further depth if the present article should stay focused.

The direct-entry durability wording noted above is not a route-level finding: earlier pages explicitly qualify durability by settings and storage. No recommendation to repeat the whole qualification throughout the collection.

## Skill improvements suggested by this pass

- For review of worked query results, record the complete default-visible input roster before exposing the first output. O14 shows why checking individual SQL clauses alone can miss a small prediction gap. The existing first-reading guidance asks for input→operation→result; a concrete roster checkpoint would make it easier to apply.
- Keep one cross-page variation ledger containing *permitted* cases, not just invalid data. Repeated product lines are an example: design admission should be carried into quantity handling and request-identity comparison, with an explicit distinction between a derivable extension and a missing explanation. This avoids demanding a production implementation while still testing transfer.
- Keep rendered-reading extraction clean: exclude script, style and no-JavaScript fallback before delivery, and split long h2 sections at h3 boundaries. The initial extraction limits here are disclosed above. Tools should make those boundaries reliable rather than expecting the reviewer to reconstruct them after seeing later text.

These are refinements to review execution, not a recommendation for more reviewers or a fixed finding quota. The main teaching strengths were concrete values, explicit branch ownership, state resets, and completed intermediate examples; future reviews should preserve those when repairing small local issues.

## Local repair after independent reading

Moved O14’s setup into the opening of “Missing matches” in `query-results.astro`, before the SQL and first left-join output. Ben’s introduction remains beside it; the next paragraph explains why a left join retains Ben. Tightened the post-result contrast to avoid repeating the setup. SQL, records and displayed results are unchanged. No build or commit performed, as requested by the coordinator.

## Optional transfer exercise added after review

Added “Two lines, the same stock” as a compact Prediction in `transaction-boundaries.astro`, after the opening cart paragraph in `#wider-rules`. It tests a design-permitted case: two separately priced P7 lines, each requesting two mugs, against three available. This is meaningful optional transfer practice, not a repair of a baseline comprehension blocker.

A focused temporary PGlite script loaded the shared shop schema, created P7 stock at three, began O14, reserved and inserted its first line, attempted the second reservation, and rolled back on its empty result. PostgreSQL 18.3/PGlite 0.5.8 assertions passed: first result `{available: 1}`, second `[]`, then stock three with no O14 or O14 lines. Evidence: `practitioner-repeated-product-evidence.json`. No article build or commit performed.

## Constraints opening refinement

Reassessed the child opening after the complete-route pass. The earlier opening was comprehensible but repeated the parent’s type/constraint/enforcement introduction before exposing a reason to continue. Revised only the opening: two catalogue-code checks can both pass before insertion; a concise definition follows, then the order-line context and unchanged shared-writer illustration. The final paragraph now points to the child’s concrete optional-code and deletion questions. Type limits, application validation, insertion/update/deletion coverage, and PostgreSQL scope remain. This is a route-level improvement in emphasis, not a newly discovered baseline comprehension blocker.

Composite-reference section recommendation (not edited): it is understandable as written, because its final sentence explicitly says the earlier accepted insert creates `(O12, 2)`. However, the reader first encounters “O12 has only line 1” after reading that successful insert; the reset arrives only at the paragraph’s end. Move the state boundary before the counterexample: “Return to the initial records, before the accepted insert above: O12 has only line 1, while O13 has lines 1 and 2.” Then explain why separately finding O12 and line 2 is insufficient. The late sentence can shorten to “The earlier insert creates that missing pair.” This removes a small backtracking requirement without changing SQL or examples.

Validation: `pnpm exec astro build --outDir /private/tmp/staycurrent-practitioner-repair` passed (56 pages; existing PGlite bundler warnings). Served this separate build on port 4326 and inspected the opening screenshot at `/private/tmp/constraints-repaired-opening.png`. Four paragraphs surround the unchanged illustration; catalogue-code conflict leads, definition and line context precede the figure, and optional/deletion questions lead into the body. No clipping or layout regression observed at 1280px. Frozen review server 4324 was untouched.

## Recheck of optional SQL disclosures

Reviewed the coordinator’s current changes to Designing your data and Tables and JSON against their diff, then read the rendered sections with disclosures closed and open. The shortened UNIQUE recap retains the actual optional-code policy and sends enforcement depth to its child; the NaN operator/cast gloss is sufficient. Moving the long nested CASE behind a disclosure preserves the complete acceptance policy and the final hybrid query on the main path.

Repaired four small continuity/context gaps in the affected sections only:

- The design page’s visible JSON example now states P7’s material/finish values and calls the visible promise an object rule; ALTER TABLE mechanics live with its SQL. The disclosure says to begin from the four-table practice setup before attributes exists.
- The design page now supplies P7=350 ml and the match/filter operation before the closed details-table disclosure, so “The result is Blue mug, 350” follows visible inputs rather than hidden SQL.
- The details-table disclosure states its P7/existing-table prerequisites and explains that its SQL does not depend on opening the JSON-column disclosure.
- The child conversion disclosure links to the exact JSON setup, requires no existing mug-details table, and keeps one-connection/error/rollback instructions. A visible sentence explicitly makes the final query depend on completing the conversion.

Isolated build to `/private/tmp/staycurrent-practitioner-repair` passed. Inspected closed-section screenshots and all three opened SQL disclosures at 1280px; no clipping or layout regression found. The long child SQL is readable when deliberately opened, while the visible policy remains complete when closed. Screenshots: `/private/tmp/modelling-closed.png`, `/private/tmp/modelling-open-0.png`, `/private/tmp/modelling-open-1.png`, `/private/tmp/tables-and-documents-closed.png`, `/private/tmp/tables-and-documents-open-0.png`. SQL itself was not changed in this recheck; no new execution claim. No commit.
