# Visual repair confirmation · article · r05, r06, r09, r13 · batch02-v02

Inputs read: [frozen v02 manifest](v02/manifest.json); current articles and isolated r05/r06 figures on the dedicated `http://127.0.0.1:4414` origin; v02 `mechanical/applicability.json`, current figure semantics, contrast and download HTTP receipts. The review/visual/figures skills and rendered-check instructions were read. Frozen source, context, previous reports and history were withheld and not inspected. This is an informed focused confirmation, not an independent whole-article or corpus review.

Highest severity: none.

## Problem results

| Accepted problem / pass condition | Result | Current observation |
| --- | --- | --- |
| r05: directly compare identities and both amounts across four joined pairs, then the one-pair totals result | Pass | Four table rows show line identity, line amount, payment identity and payment amount together. Both 4.50 contributions and both 35.00 contributions can be read down one column; 30.00 and 9.50 repeat down the other. Totals mode gives order 101, 39.50 and 39.50 in one row, and due 0.00. Inputs, selected mode, result grain, sums and explanation agree. |
| r06: show partition membership in the input and retained order rows | Pass | The input explicitly associates 101/103 with Mina and 102 with Tariq. Group mode produces Mina 68.50 and Tariq 40.00. Window mode retains order, customer and value beside the customer total, so Mina’s repeated 68.50 needs no remembered ownership fact. |
| r09: revised repeat procedure, platform/path requirements and downloads | Pass | The procedure identifies macOS/Linux, PostgreSQL tools, Unix-domain sockets, package versions, the command, and the short writable absolute temporary path without spaces. It distinguishes the checked macOS run from unchecked Linux execution. Inline command/path text wraps readably at 375 px. Both visibly labelled links have the intended download filenames and return the exact frozen bytes. |
| r13: corrected fixed-snapshot paragraph with surrounding explanation | Pass | The paragraph distinguishes BEGIN and SET LOCAL from the first query snapshot, identifies the first SELECT in this report, then explains the retained view and own changes. It sits coherently between the Read Committed comparison and the report drawing’s setup. Inline commands wrap readably at 375 px. The experiment control’s href and returned bytes also match the frozen version. |

## Checks

| Visual check, in prescribed order | Result | Applied scope / evidence |
| --- | --- | --- |
| 1. First reading alone | Pass | Read and operated r05/r06 Figure 1 on isolated routes before article prose. Initial impressions below. |
| 2. Form fits the content | Pass | r05’s common four-column table exposes the repeated contributions directly. r06 uses ordinary headed relation/result tables and names the shared customer in each retained row. Entities and amounts agree across modes and surrounding explanations. No colour decoding is required. |
| 3. Readable at a glance | Pass | Checked redesigned tables, captions, inputs, results and explanations at 1280×720 and 375×812 in Light and Dark. Phone column headings wrap without losing their association. No page overflow in any of the 16 measured figure/size/theme/mode combinations. Reviewed the affected prose and downstream uses in both articles, the r09 procedure, and r13 snapshot section. |
| 4. Interaction | Pass | Used both mode buttons in each redesigned figure; checked the changed results and explanation; Tab moves between modes, Enter and Space activate them, focus remains on the activated control, and the focus ring is visible. Opened/closed both text alternatives with the keyboard and read them. These two figures have no playback, timeline or first/last-step boundary. Download controls inspected without triggering browser save/download events. |
| 5. Themes and phones | Pass | Both redesigned figures checked in both modes at desktop/375 px in both themes. Result captions preserve the selected meaning when scrolling a phone, and result/explanation can be read together. Fresh computed-colour measurements across all 16 combinations give minimum text contrast 6.03:1 Light / 6.15:1 Dark; meaningful green accent/selection against figure background is at least 5.52:1 Light / 8.77:1 Dark. All measured text opacity is 1. Decorative table/card rules carry no exclusive information. Revised r09/r13 prose inspected in both themes and widths. |

## First reading

**r05, Two lines meet two payments.** Two identified lines and two identified payments belong to order 101. Detail mode makes each line/payment combination a row and exposes the two doubled sums. Switching to totals changes the result grain to one order and combines two independently calculated 39.50 totals. The table makes this apparent before the article supplies the join argument; no remaining uncertainty about which amounts repeat.

**r06, A total beside a group, or beside each order.** The input is three orders, with Mina owning 101 and 103 and Tariq owning 102. Grouping reduces them to two customer rows. Window mode retains three order/customer/value rows and repeats each customer’s total. Membership is visible in both the input and window result. The text alternative confirms that this illustrates a calculation rather than observed execution.

r09/r13 were intentionally read as affected prose/procedure confirmations, not a new figures-alone assessment of their unchanged figures.

## Reference calibration

Focused rendered calibration on `http://127.0.0.1:4350`:

- **Indexes**, “Index entries and row locations”, Figure 2 and its surrounding explanation: stable identities and locations remain explicit through a transformation; current explanatory text and controls stay associated. Operated Next and inspected the current state. Also inspected the headed B-tree-depth table as a concise comparative table reference.
- **Storage and durability**, old-version section and Figure 3, “Where the old version of P7 waits”: the report’s snapshot and a later query are labelled separately, with the explanation tied to visible values. Operated Next and read the immediately surrounding explanation and text alternative.

This assignment did not require a new complete three-reference reading. No Sequence-diagrams calibration or blanket reference-media sweep was needed for these local comparisons and prose changes.

## Current evidence

Evidence is retained in [visual-confirmation-v02-evidence/](visual-confirmation-v02-evidence/).

- r05: `r05-desktop-{light,dark}-{detail,totals}.png`; `r05-phone-{light,dark}-{detail,totals}.png`; `r05-phone-dark-detail-explanation.png`; `r05-phone-in-article.png`.
- r06: desktop and phone group/window screenshots in both themes; `r06-desktop-light-group-complete.png`, `r06-desktop-dark-window-complete.png`, `r06-phone-light-window-result.png`, and `r06-phone-in-article.png` show the relevant input, result and explanation. Some earlier viewport screenshots intentionally show the figure’s upper portion; use the complete/result captures for the lower rows and explanation.
- r09: desktop and actual phone procedure screenshots in Light/Dark, `r09-download-controls.json`, `download-http.json`, and the two returned files. The script response was 200 / 8424 bytes / SHA-256 `6cc72fe140da43dcef8e5bbe02cc95c420c0c7be2e0e235fa8223116a069f581`; shop data was 200 / 2879 bytes / SHA-256 `bdae3259a820ed6a81e7f3e95dabce8bcc7a03eae11ff0a1f09cbe1d2d46948c`. Both equal the manifest.
- r13: `r13-{desktop,phone}-{light,dark}-snapshot.png`; actual download href and HTTP hash in `other-download-controls.json` / `other-download-http.json`. The unchanged isolation script returned 200 / 9850 bytes and its manifest hash. r05/r06 worksheet endpoints also returned their unchanged manifest bytes; this extra endpoint check is not a new visual review of their collapsed source/download presentation.
- `current-computed-colours.json` contains fresh DOM computed-colour, opacity, actual viewport and overflow records for all 16 redesigned-figure combinations; `contrast-summary.json` records the contrast arithmetic. `keyboard.json` records the mode focus/activation checks. `r05-rendered.txt`, `r06-rendered.txt`, `r09-rendered.txt` and `r13-rendered.txt` retain the rendered reading context, not source files.
- Reference screenshots: `reference-index-entries.png` and `reference-storage-versions.png`.

## Findings

No new substantive visual defect found in the scoped repairs. No optional polish finding is needed to explain a remaining reader obstacle.

## Limits and unchanged areas

- This confirmation covers redesigned r05 Multiplication and r06 GroupWindow media, their surrounding explanations and affected downstream reasoning; r09’s repeat procedure/download presentation; r13’s fixed-snapshot paragraph and its local dependencies. It does not renew whole-article visual approval.
- No blanket control/render repeat was performed for unchanged r05 OuterFilter, r06 Frame, r09’s bound-value and connection-ownership media, or r13’s snapshot/write-skew players, tables and schedules. Their existence/text was encountered in reading context, but their earlier visual judgement is neither replaced nor newly claimed here. r03/r07 are outside this assignment.
- Native SQL/driver experiments were not rerun. Applicability permits reuse only for unchanged r05/r06/r13 runnable/data bytes; r09 has current repair mechanics. Their execution claims remain for practitioner verification. HTTP hash checks establish returned file identity, not native outcomes.
- Actual browser saving was deliberately not exercised. Actual href/download attributes were read from the current rendered page; bounded HTTP requests verified responses and hashes without download events, path waits or save prompts.
- A viewport setting while a separate reference tab was active applied to that tab, leaving the review tab at desktop width. The mismatch was detected; those two misleadingly named r09 phone captures were removed/replaced. Closing the reference tab and checking actual `innerWidth`/`innerHeight` established 375×812 on the review tab. Retained valid figure measurements and phone captures were not invalidated. No concurrent interference is asserted.
- Browser state was restored to 1280×720, then System theme and viewport reset. Only the reviewer’s own tabs were closed. No source edits, builds or delegation were performed.
