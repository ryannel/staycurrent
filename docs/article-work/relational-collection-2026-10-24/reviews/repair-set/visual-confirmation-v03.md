# Visual review · informed repair confirmation · r04/r08/r09/r10/r17 · repair-set-v03

Inputs read: [exact assignment](visual-confirmation-v03-assignment.txt), [frozen manifest](v03/manifest.json), frozen 24 October 2026 at 04:14:48 UTC; current complete rendered pieces at port 4484 and isolated `figures/r10/`; current review/visual and figures/render guidance; curated `v03/mechanical/applicability.md`, `r17/media-applicability.json`, `r17/render-checks-v03.json`, and `current-runnables-and-index/render-mechanics.json` and `contrast-token-calculation.json`. Selected mechanical identities were checked against the exact manifest. Relevant fixed rendered Indexes entry/locator drawing, Storage row-version drawing and Sequence diagrams outbox drawing were inspected at port 4350. No source, plans, earlier versions, peer reports or author quality notes were read.

Highest severity: none

This is informed confirmation of the assigned repairs, their surroundings and affected dependencies. It supplies no independent initial, final or corpus coverage. Complete current text included final Sources outside the article body, captions, code and text alternatives, plus the publication disclosure.

## Exact rendered scope

| Piece | Current route after `http://127.0.0.1:4484/review/relational-collection/` | Affected scope |
| --- | --- | --- |
| r04 | `data-lifecycle/` | Procedure, invocation, environment and download affordances |
| r08 | `updates-and-imports/` | Procedure, invocation, environment and download affordances |
| r09 | `application-sql/` | Procedure, invocation, environment and download affordances |
| r10 | `indexes/` | Figure 1, its explanation and handoff into Figure 2 |
| r17 | `outboxes-and-jobs/` | Lock-first completion SQL, authorisation/renewal/release explanation, uncertain-claim and retirement passages |

## Checks

| Check | Piece | Result | Note |
| --- | --- | --- | --- |
| 1. First reading alone | r04 | not applicable to repair | No changed media; revised setup was read in complete current context. |
| 1. First reading alone | r08 | not applicable to repair | No changed media; revised setup was read in complete current context. |
| 1. First reading alone | r09 | not applicable to repair | No changed media; revised setup was read in complete current context. |
| 1. First reading alone | r10 | pass | Figure 1 was inspected in isolation, with all four states, before article prose. |
| 1. First reading alone | r17 | not applicable to a new figure | Existing figures are unchanged; the current SQL and surrounding prose were inspected directly. |
| 2. Form fits the content | r04 | pass | Requirements, downloads, install, invocation and limits remain ordinary ordered prose with inline commands. |
| 2. Form fits the content | r08 | pass | Setup states the process/environment boundary together with the invocation. |
| 2. Form fits the content | r09 | pass | Driver versions, binary path and temporary-parent conditions stay with the command. |
| 2. Form fits the content | r10 | pass | Index boxes contain customer keys and locators; order IDs remain in the table rows reached through them. |
| 2. Form fits the content | r17 | pass | Separate SELECT FOR UPDATE and guarded UPDATE are visibly separate statements in one transaction; prose explains their sequence. |
| 3. Readable at a glance | r04 | pass | Inline code and all three download links wrap legibly; no document overflow. |
| 3. Readable at a glance | r08 | pass | Inline package/invocation text and three links remain readable at both widths. |
| 3. Readable at a glance | r09 | pass | Long invocation breaks within its available line; temporary-path advice and limits remain adjacent. |
| 3. Readable at a glance | r10 | pass | Keys, invented page/item locators and highlighted fetched rows can be followed without interpreting a business ID as a stored index field. |
| 3. Readable at a glance | r17 | pass | Current completion listing, claim ownership, post-lock check and later reply are readable together; the uncertain-token counterexample and release text remain ordinary body paragraphs. |
| 4. Interaction | r04 | pass for affected affordances | Current hrefs were checked by bounded HTTP; unchanged players qualified, not replayed. |
| 4. Interaction | r08 | pass for affected affordances | Current hrefs were checked by bounded HTTP; unchanged players qualified, not replayed. |
| 4. Interaction | r09 | pass for affected affordances | Current hrefs were checked by bounded HTTP; unchanged players qualified, not replayed. |
| 4. Interaction | r10 | pass | Actual Next/Back, Play/Pause, Reset and natural completion used. Keyboard focus remains on Back at the first endpoint and Next at the last. |
| 4. Interaction | r17 | pass | The inner PRE is focusable and actually scrolls horizontally with native keyboard arrows at phone width; focus indication remains visible. Current download serves bytes. |
| 5. Themes and phones | r04 | pass | Actual 1280×720 and 375×812, light and dark, including the procedure and links. |
| 5. Themes and phones | r08 | pass | Actual desktop/phone in both themes; no overflow or lost command text. |
| 5. Themes and phones | r09 | pass | Actual desktop/phone in both themes; the setup remains readable. |
| 5. Themes and phones | r10 | pass | Current figure was used at desktop and 375 px in light/dark; stacked rows, explanation and controls remain understandable. |
| 5. Themes and phones | r17 | pass | Actual desktop/phone in both themes; code scroll is contained and does not widen the document. |

## First reading

Before its prose, r10 Figure 1 appeared to copy customer IDs with row locations, sort those entries, then highlight two table rows obtained through the matching entries. The number at the left of a table row looked like the order ID; the index entry itself looked like a customer key and locator. The final state explicitly says the fetched rows supply orders 101 and 103. No uncertainty about an order ID being stored in a customer-only entry remained.

The SQL surrounding r17 is an informed repair reading, not a blind code first reading. It visibly locks the event first, then evaluates generation/deadline conditions in a separate statement. The neighbouring explanation distinguishes authorisation at that check from commit/reply arriving later.

## Problem results and affected dependencies

- **r10 passes.** All four Figure 1 states keep orders 101/102/103 in table rows, copy only customer 1/2/1 plus their invented locations, sort 1/1/2, and fetch both customer-1 locations. Caption and live explanation explicitly put the order IDs at the fetched-row boundary. Current complete prose then distinguishes customer-only keys from the date/ID-bearing history key. Figure 2's alternative still gives 105 then 103 through the three routes; unchanged Figure 2 mechanics are qualified below.
- **r04/r08/r09 pass their affected visual conditions.** Requirements, ordinary-user condition where present, dependencies, command, temporary storage and process/child environment explanation are visible and readable. Current links look like links and have bounded serving evidence.
- **r17 passes its affected visual conditions.** The current listing and prose present lock acquisition before expiry testing, keep the lock through commit, and explain check-before-deadline/commit-after-deadline. The earlier uncertain-claim, acknowledged ownership and retirement passages remain legible with the current SQL. Renewal and release refer back to the same visible protocol. This is a visual result, not technical certification of that protocol.

## Actual evidence and qualified reuse

Page-timer sampling of current r10 playback observed the first three explanations held for several seconds, transitions approximately 4.1, 8.5 and 14.0 seconds after the first sample, then the final state remained at 4/4 with Replay. Pause stopped playback and Reset returned 1/4. Hidden/background animation can make screenshots stale; this timing used bounded DOM sampling with the page's clock, not screenshot frame cadence. Longer single evaluations hit the browser tool's evaluation limit; smaller bounded samples recovered the complete observation.

Current rendered text colours match the qualified theme pairs: primary text on the alternate surface is at least 13.72:1 light / 10.89:1 dark; secondary text at least 6.04:1 / 6.14:1; accent at least 5.52:1 / 8.76:1. Current affected labels/captions and SQL were visually inspected; no dimmed-row opacity reduced their text contrast.

Ten actual current download hrefs returned HTTP 200 with bounded reads. The r17 file is 22,061 bytes, SHA-256 `4cbcaec4636e5370b64725f7ea22cf6df9c2b34475fd85fa40adc6659d9ce762`; the r10 SQL is 3,153 bytes, `85b6a0c20e14d2f11f3189b90765019b39f3155c7e33bc009c4893ca52695102`. The r04/r08/r09 scripts and companion data match the corresponding exact manifest download hashes.

The curated applicability qualifies unchanged r04/r08/r09 media and r10 Figure 2/native mechanics. The permitted `current-runnables-and-index/final-source-hashes.json` record was also read and its current article/component/download/dependency identities compared with the exact manifest; all corresponding identities match. Current Figure 2 component identity is `b2aace8de27770f7aa66d20f2658ea7172341ed9c641c7c0b886a7afbc00ea13`; the curated trace records entries/fetches 3/3, 2/2 and 3/2 with the same answer. r17's curated media applicability marks both inline figures and CSS byte-identical; its SQL listing is explicitly changed and was not covered by obsolete native evidence. No unchanged player was ceremonially replayed in place of the affected checks.

## Findings

None in the assigned affected scope.

## Limits

No source inspection, native database execution or browser saving was performed. HTTP bytes establish serving only. Existing qualified mechanics retain their recorded environments and limits. This focused visual confirmation does not repeat all unchanged media or supply a whole-collection judgement. After the combined assignment, all five touched origins were restored to System, the viewport was set to 1280×720 then its explicit override cleared, and the owned tab was closed. The current tab still measured 1280×720 immediately after reset; no different native size is inferred.
