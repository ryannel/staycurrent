# Visual review · article · a00 Relational databases; a03 Making concurrent changes correct · 14e4f89

Inputs read: the rendered articles at `http://127.0.0.1:4333/review/relational-trial-3/` and `/review/relational-trial-3/transactions/`; rendered figures and tables at `/review/examples/sequences/`, `/review/examples/indexes/` and `/review/examples/storage/`; `.agents/skills/staycurrent-review/SKILL.md`, its visual perspective, and `.agents/skills/staycurrent-figures/SKILL.md`. No isolated routes were supplied. Article source, models, plans, registry, example record, writer/repair notes, prior reports, decisions and other perspectives were withheld and were not read.

Highest severity: low

## Checks

| Check | Result | Note |
| --- | --- | --- |
| First reading alone | pass | Inventoried figure/table/listing content separately, operated every option, then read in context; the automatic browser accessibility snapshot also exposed surrounding prose (see Limits). |
| Form fits the content | pass | Actual relation tables and marked keys, joined output rows, two-request schedules and small comparison tables fit their questions; repeated data and captions agree. |
| Readable at a glance | finding | Figure 2 in a00 uses 10.4 px cell text at 375 px, substantially smaller than its caption and neighbouring data tables. |
| Interaction | pass | All eight options across four steppers inspected throughout; Play/Pause, Back, Next and Reset work, outcomes agree with explanations, and keyboard focus remains on Back/Next at endpoints. |
| Themes and phones | finding | Both themes and 375 px checked; all page widths stay contained and comparisons stack. The a00 relationship chain breaks a connection across lines on phones. No text contrast failure found. |

## First reading

These notes describe the visual-only pass, before the subsequent context reading.

### a00 · Relational databases

- **Figure 1, five shop tables and relationship strip:** one customer owns an order with two lines; the product identity joins each line to its product. PK/FK marks are explicit. The stock values seem to represent an already accepted order, which the figure's own introductory sentence confirms. Payments refer to earlier orders rather than 103; the caption explicitly says the order table is a subset. On a phone, the `orders → order_items` link crosses a line break and requires following the chain rather than seeing a complete connection.
- **Positive-quantity listing:** a required integer must exceed zero. It is a column definition rather than a whole command, clearly named as such by the listing's accessible label.
- **Order-103 SELECT listing:** joins the order, customer and lines and totals line quantities multiplied by prices. The code is short enough to trace in displayed order.
- **Figure 2, joined rows:** four result rows repeat each of two line identities and each of two payment identities. The caption supplies the doubled £79 totals and distinguishes intermediate rows from stored lines. The columns are direct values rather than encoded descriptions. Phone text is noticeably smaller than the other examples.
- **Wrong-join and repaired-query disclosure:** the first listing totals a direct join; the second totals each detail separately before joining. The order of examples makes the comparison clear; horizontal scrolling contains long SQL lines on the phone.
- **Figure 3, stock race:** `Read, calculate, write` starts at one mug, gives both buyers the same old decision, then accepts 103 and 104 while stock says zero. `Conditional subtraction` leaves committed stock at one while Mina's change is pending, explicitly makes Tariq wait, and ends with 103 only. I initially checked whether the unchanged stock during pending work was intentional; the table's “Committed state” label, lane and caption resolve it within the figure. Both options end at the outcome without an extra duplicate step.
- **Complete order transaction listing:** sequential guarded mug and tea deductions precede order and line inserts; application row-result checks and rollback/error branches are comments at the relevant locations. It is visibly a protocol with application decisions, rather than a claim that pasting SQL alone performs the branches.
- **Figure 4, write path:** four numbered stages separate finding the product, changing memory, making the log recoverable, and later data-page writes. A static ordered form is sufficient here; the caption states omissions and avoids presenting a measured duration.
- **Shortlist evidence table:** each requirement maps to evidence to obtain, not to a claimed test result. Two columns remain legible on the phone and do not clip the article.

### a03 · Making concurrent changes correct

- **Starting classes and reservations:** class 21 is empty with one place; class 22 has capacity three, two remaining and R7 owned by customer 2. The explicit class-key connection explains the foreign key. Owner identity needs the nearby prose's customer mapping; this is a labelled fixture rather than an independent figure claiming to contain every customer row.
- **Figure 1, rejected double click:** both options first accept R10 alongside R7. Separate commits leave the second decrement at zero after R11 is rejected; one transaction retains committed one during pending work and rolls the second decrement back. Arithmetic in the explanation matches the displayed reservation rows at every step.
- **Unsafe booking SQL:** two clients have already read one; each writes the calculated zero, then inserts its own request identity. The first comment states the otherwise invisible initial read, and the B variation is beside its changed VALUES.
- **Figure 2, last-place race:** both histories read one. The stale overwrite accepts two reservations; conditional change waits, rechecks and leaves only R8. Committed tables remain separate from pending lane actions, and the final explanation says why non-negative zero is insufficient.
- **Conditional statement listing:** the update returns class identity into a named temporary result, and the insert consumes it, so no qualifying update produces no reservation. The later comparison-only listing visibly has a narrower purpose: reject a stale value; it does not show a complete booking.
- **Snapshot comparison table:** two ordinary reads return 1 then 0 at Read Committed, and 1 then 1 at Repeatable Read. The column heading fixes the competing commit between reads; the table is a compact and effective comparison.
- **Combined lock-and-count SQL and observed-history table:** the command puts the count and class lock together. The four event rows make the surprising point clear: acquiring the lock does not refresh that command's count; a separate next command obtains count two. Results are labelled observed, unlike the interactive models.
- **Figure 3, instructors:** both people count two and update different rows. Repeatable Read ends with two false values; Serializable rejects Ravi, preserves true and adds a final complete-restart decision that counts one and stays. The selected-victim qualification is present at the relevant step. The departure listing matches that full read/decide/update/commit sequence.
- **Exact-schema disclosure:** separate customer, class, reservation and instructor definitions precede inserts. Required values, checks and unique claims are visible. The long fixture is sensibly folded away and scrolls within its code box on a phone.
- **Native worksheet results table:** forced cases map to observed outcomes, including failures that the test is supposed to expose. It stays a two-column table and is readable at 375 px.
- **Final counter-check SELECT:** the query reports class identity, capacity, remaining and reservation count, plus their equality. LEFT JOIN visibly retains empty classes, and the listing follows rather than precedes the results it helps inspect.

In context, every figure is placed after its reason to exist; the text distinguishes the illustrative schedules from native observations. The three reference articles supply a stronger pictorial vocabulary where location and movement matter; these pieces mostly need actual rows and selected schedules, and their simpler tables are appropriate.

## Findings

### visual-3 · low · a00, Figure 1 relationship strip at 375 px

Problem: the chain wraps after `orders 1 → many`, placing `order_items` on the next line. The arrow and the relation it points to are separated, while a different `many → 1 products` connection immediately follows on that second line. Evidence: `visual-3-phone-relationship.png`.

Effect: the reader must reconstruct one relationship across the line break instead of seeing each connection as a unit.

Suggestion: keep each relationship as a complete small row at phone width, or draw an explicit continuation into the next line.

### visual-4 · low · a00, Figure 2 joined-result table at 375 px

Problem: the joined-result cells and headings render at 10.4 px, compared with 12.48 px in the earlier relation tables and 13.6 px in the stock-state table. The table is visibly much smaller than the figure's caption. Evidence: `visual-4-phone-table.png`.

Effect: reading the repeated identities and amounts takes more effort on a phone, although the table remains complete and has sufficient contrast.

Suggestion: retain the relation-table text size and allow a contained sideways scroll if necessary, rather than shrinking this four-column example further.

## Limits

- The IAB pane was hidden. Its screenshots can lag, so playback assessment used rendered DOM step counters and the hold-bar's actual transition durations, plus observed automatic advancement. In a00, both options reached `5 / 5` with Replay. In a03, the first options reached `4 / 4`, `5 / 5` and `4 / 4`; the second options reached `4 / 4`, `5 / 5` and `5 / 5`. Observed holds included 4.305, 4.845 and 5.070 seconds initially, and 6.690–8.040 seconds for larger changing states. Pause stopped the counter, and resume continued. This establishes the page's scheduled holds and advancement, not foreground frame smoothness.
- IAB viewport overrides left existing tabs at 1280 px. Phone checks therefore used Chrome via cua_repl, with DOM-confirmed 375 px viewport and 375 px document width for both pieces. Desktop review used the original 1280 px IAB viewport. Temporary overrides were reset during cleanup.
- Contrast was calculated from rendered computed foreground/background colours with ancestor transparency composited. Checked body text, captions, table cells, code tokens, changed values and disabled endpoint labels passed 4.5:1. Minimum sampled article text contrast: a00 6.03:1 light and 6.15:1 dark; a03 6.03:1 light and 6.83:1 dark. This was a DOM colour check, not a calibrated display measurement.
- Automatic browser accessibility snapshots included surrounding prose before the figure-only extraction. First-reading notes were made from the isolated rendered inventories and manual control states, followed by an explicit whole-piece context reading. No article implementation or previous review evidence was used.
- One table-centre click followed its performance link unintentionally. Only the resulting page header was exposed; that article was not read or used, and navigation returned to the assigned pieces.
- Representative desktop previews are `visual-a00-desktop.png` and `visual-a03-desktop.png`. Supporting phone views are `visual-a00-phone-dark.png`, `visual-a03-phone-dark.png` and `visual-a03-phone-controls.png`.
- No database execution, build, content edit, commit or push was performed. The existing preview server was reused; no process was started.

Timing: started 2026-10-21 19:49:57 UTC; ended 2026-10-21 20:00:21 UTC; duration 624 seconds (10 minutes 24 seconds). Includes report writing and cleanup. All five review tabs were closed; viewport overrides were reset. No processes were started.
