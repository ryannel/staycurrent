# Visual review · article · a00 "Relational databases" and a03 "Making concurrent changes correct" · 6ca25b8

Inputs read: the rendered pages `/review/relational-trial-2/` (a00) and `/review/relational-trial-2/transactions/` (a03) at 6ca25b8, served by `STAYCURRENT_REFERENCE_PREVIEW=1 pnpm astro dev --port 4564` (now stopped); the reference articles' rendered figures at `/review/examples/sequences/`, `/review/examples/indexes/` and `/review/examples/storage/`; `.agents/skills/staycurrent-review/SKILL.md` and `perspectives/visual.md`; `.agents/skills/staycurrent-figures/SKILL.md`; `src/components/figures/stepper.mjs`; `docs/coverage/relational-example.md`. I read `src/components/relational-trial-2/a00/*.astro` and `a03/ScheduleFigure.astro` only to diagnose things I had already seen: where `aria-live` sits, and what the lane bar colours mean. I also read the a03 source line that builds the download links.
Withheld, not opened: the plans, the writers' work records, everything else under `docs/article-work/` (including the other r03 reports in this folder), git history, `src/articles/relational-next/`, `src/articles/relational-trial/`, `src/components/relational-trial/`, and every earlier review report.

Verdict: a00 repairs required (visual-21) · a03 pass (optional findings only)

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. First reading alone | finding | Most items stand on their own. On first reading, a00 Figure 6's fixed caption contradicted two of its three options (visual-21). a03's anomaly cards needed the prose to explain what "Yes" means (visual-25). |
| 2. Form fits the content | finding | Example data appears as one small table per relation with keys marked throughout, and a00 Figure 2 draws its keys. Rows, keys, people and request numbers match the example record in both articles. Better forms exist for a03's two grids of short values (visual-25). a03's `owner_id` cells mix a key with a name (visual-27). |
| 3. Readable at a glance | finding | Listings are short and run in the order shown. At phone width, the SQL inside a00 Figure 3 wraps to column 0 (visual-22). a00's lane cells do not mark which line is the reply (visual-23). |
| 4. Interaction | finding | All 11 stepped figures and both option figures work. Each control changes something. Pause works, and keyboard focus stays on Back and Next at the ends (`aria-disabled`). Every changing text is marked `data-live`, so holds follow the text that changed. One a03 option ends on a step that repeats the one before it (visual-26), and a03's lane colours have no key (visual-28). |
| 5. Themes and phones | pass | At 375 px and 1280 px, in light and dark themes, nothing overflows the page. Side-by-side lanes and tables fit at 375 px. Standalone listings scroll sideways. A computed contrast check of every figure, table, card and aside text, at every step of every option, found nothing below 4.5:1 except the deliberately dimmed Back and Next at the ends. Those are disabled controls. Each interactive figure has a "Read this figure as text" summary that states the outcomes. |

## First reading

Recorded before I read the surrounding prose. Captions and in-figure text were read as part of each figure.

**a00 "Relational databases"**

- **Figure 1, one order written as five separate changes (6 steps).** A single "Shop application" lane fills with five statements, one per step, over products, orders and order_items tables. Changed rows are underlined and bold. Three "Right/Wrong" chips report what the shop would answer, with a sentence saying whether the stored facts agree. Clear from the figure alone: only the first and last states agree. At first I took the outlined "Right" chips for buttons, until I saw that "Wrong" is a filled chip. The "Time runs down the table" label sits outside the figure's inset (visual-24).
- **Figure 2, the shop's tables and keys.** A schema diagram with arrows from each FK to its key, then the five tables with rows. The Order 101/102/103 buttons mark the linked rows with a bar and a "linked" badge. The figure stands alone. The diagram stacks into one column at 375 px, and its arrows still read.
- **Listing, join for order 103, and its psql output.** Clear. The output is a psql grid, as a reader meets it.
- **Table, changes refused by rules.** Three columns: change, rule, PostgreSQL error code and message. Clear.
- **Listing and output, Mina's orders.** Clear.
- **Figure 3, what is still due on each order (two options).** The listing changes with the option. "Join everything" shows the fan-out rows, with order 103's rows struck through as dropped, and ends with three "Wrong" verdicts. "Sum each, then join" shows the two intermediate results, the left join with an underlined NULL, and the corrected result. The figure stands alone and is the strongest in the article. At 375 px its SQL wraps badly (visual-22).
- **Listings, an unsafe UPDATE with RETURNING, its output, and the guarded version.** Clear. The comment line in the guarded version stands in for output, and says so.
- **Figure 4, two customers and one blue mug (two options).** Two lanes, Mina (order 103) and Tariq (order 104), over P7's stock and the mug lines. Read-then-write ends with "Wrong · Orders holding the last mug: 103 and 104". The conditional update ends with "Right · 103". Clear. I was briefly unsure whether Tariq sent his UPDATE twice: it appears in two cells, "waited for Mina" and "finished after the wait" (visual-23).
- **Listings, parameterised application code and the order transaction.** Clear and short.
- **Figure 5, where the connection breaks (three options).** The lanes are "Shop application" and "Mina sees", over the products and orders tables. The first cell reads "BEGIN; / BEGIN", which looked like a duplicate until I worked out that the second line is the server's reply (visual-23). The outcomes of the three options are clear. At 1280 px a lane cell breaks `stock >= 1` across lines.
- **Plan outputs before and after `CREATE INDEX`.** Real PostgreSQL 18 EXPLAIN text. "Rows Removed by Filter: 199001" and "shared hit=1268" against "hit=3" make the point without the prose.
- **Table, work with and without the index.** Four rows. Clear.
- **Listing, the failed NOT NULL with error 23502, and the five-stage table.** Clear. The stages are numbered, and each "What happened" cell is a short sentence.
- **Figure 6, which recovery fits which failure (three options).** Three cards: crash recovery, promote a replica and restore an earlier state. Each says whether orders 101 and 103 are present and whether it is the right tool. The right tool has a green border. The option text and the cards agree. The fixed caption does not: it says order 101 is deleted at 10:10 in every option, yet under "Server process crashes" (at 10:20) every card shows order 101 present. This was my main uncertainty on first reading (visual-21).
- **Tables: evidence to collect, what the database does and what you decide, and where to read next.** Two-column prose tables. Clear at both widths.

**a03 "Making concurrent changes correct"**

- **Starting tables: classes, reservations, instructors.** Clear and small. The `owner_id` cell reads "2 (Tariq)", a key and a name in one cell (visual-27).
- **Schema listing.** Clear, and matches the example record.
- **Figure 1, Mina's double click in class 22 (two options).** One lane, "Mina's two requests". The committed rows sit below as "as every new transaction sees them", with a rule check per class (✓ holds or ✕ broken). Clear: "each statement on its own" ends with class 22 at 0 remaining and 2 booked, against a capacity of 3. The last step shows nothing new (visual-26).
- **Figure 2, Mina and Tariq book class 21's last place (four options).** Two lanes with short statements ("write remaining = 0", "insert R8"). Waiting is a dashed gold bar. The committed rows and rule checks update on commit. Every option's outcome is clear on the board.
- **"Try a variation" aside.** A prediction with a hidden answer. Clear.
- **Figure 3, Lena and Ravi both ask to stop teaching class 21 (four options).** Same notation. The write skew under Repeatable Read is visible: the rule check turns ✕ with 0 available instructors. The other three options are clear.
- **Table, shape of the rule and the protection that fits.** Clear.
- **Listings: book with a recorded request, compare-and-set, lock a shared row.** Short, ordered, commented. At 375 px the comment lines run past the edge and need a sideways scroll.
- **Anomaly cards (five cards, three levels each) and statement cards (three cards, three situations each).** I could not tell what "Yes" answered: "Yes, it is prevented" or "Yes, it can happen". It means "can happen", which only the preceding paragraph says. The pattern across levels, which is the point, has to be assembled card by card (visual-25).
- **Table, outcomes and what the application does.** Clear at 1280 px. At 375 px it is long and narrow (about 1,400 px tall) but readable.
- **Figure 4, Mina and Tariq swap classes (two options).** The lane headers say which class rows each move has locked. The deadlock is clear: two "still waiting" cells, then "refused: deadlock (40P01)".
- **Listing, lock both classes in order.** Clear.
- **Figure 5, Mina's booking when the reply to COMMIT is lost (four options).** The lanes are "First attempt, R8" and "The service's repeat, R8". The outcomes are clear. The bar colours carry meaning (coral, teal, dashed gold) with no key, and teal marks both "class full" and "rule holds" (visual-28).
- **Engine cards (PostgreSQL, InnoDB, SQLite).** Prose cards with labelled fields and a source line on each. The right form here.
- **Table, where the confirmation email is sent.** Three rows. Clear.

## Findings

### visual-21 · required · a00 Figure 6, fixed caption against the "Server process crashes" and "Database machine is lost" options

Problem: Under the figure, whichever option is chosen, the caption says "The mistaken deletion of order 101 commits at 10:10." The default option, "Server process crashes", sets the failure at 10:20, and its crash recovery card shows "Order 101 present" as "The right tool". Promotion and restore also show order 101 present. Read together, the figure says that a 10:10 delete followed by a 10:20 crash leaves order 101 in place after crash recovery. The third option makes the opposite point: crash recovery replays the committed DELETE. The deletion belongs only to the third option, whose own line already states it. Screenshot: `visual-a00-figure6-crash-option.png`.
Effect: A reader who puts the caption and the cards together either learns that crash recovery undoes committed deletes, which is wrong, or has to work out for themselves that each option is a separate history. The figure's lesson, matching the recovery to the failure, depends on the reader not drawing that inference.
Suggestion: Keep the caption to what all three options share: who orders 101 and 103 belong to, and what a replica is. Leave the 10:10 delete in the third option's "what happened" line, where it already is. Alternatively, say plainly that each option is a separate history in which nothing else went wrong.

### visual-22 · optional · a00 Figure 3 at phone width (and one lane cell in Figure 5)

Problem: At 375 px the SQL inside Figure 3 soft-wraps to column 0. `value,`, `sum(p.amount) AS due` and `o.order_id` end up alone at the left margin, where they look like separate clauses. The standalone listings scroll sideways instead and keep their shape. At 1280 px, a00 Figure 5's lane cell breaks `stock >= 1` with `>= 1;` alone on the next line. Screenshot: `visual-a00-figure3-375-wrapped-sql.png`.
Effect: On a phone, the reader has to rebuild the query's structure, the very thing this figure compares between its two options.
Suggestion: Keep the in-figure listing unwrapped with a sideways scroll, as the standalone listings do. Or break the long lines by hand so that every wrapped line keeps its indentation.

### visual-23 · optional · a00 Figures 4 and 5, lane cells

Problem: Each lane cell holds a statement and, below it, the database's reply in a lighter weight, with nothing marking the reply as a reply. At Figure 5's first step this reads "BEGIN; / BEGIN", which looks like a duplicate. In Figure 4, Tariq's one UPDATE takes two cells ("waited for Mina", then "finished after the wait: UPDATE 1"), and the statement text is repeated in both, so it can read as two statements. Screenshots: `visual-a00-figure5-step1-labels.png`, `visual-a00-figure4-schedule.png`.
Effect: A small decoding cost on every cell for a newcomer, who does not yet know what PostgreSQL's command tags look like.
Suggestion: Mark replies, for example with a leading "→" or a "reply:" label. In the second cell of a waited statement, show only the result ("…finished: UPDATE 1"), not the statement again.

### visual-24 · optional · a00 Figures 1, 4 and 5, "Time runs down the table"

Problem: This label is a table `<caption>` that sits 9 px from the figure's edge, while all other figure content starts at the 16 px inset. It is also in a different face and size from the figure's other labels. At 375 px it nearly touches the border. Visible in `visual-a00-figure5-step1-labels.png` and `visual-a00-figure4-schedule.png`.
Effect: Cosmetic. It looks like a stray element rather than the lanes' heading.
Suggestion: Align it with the figure's inset and style it like the other figure labels, such as "Query shape" or "What happens".

### visual-25 · optional · a03 anomaly cards and statement-behaviour cards

Problem: Both card sets hold grids of short values. The anomaly cards are five anomalies across three levels of Yes, No or "Refused with 40001". The statement cards are three statements across three situations. Each is laid out as a stack of cards, so the pattern across a level (for example, which anomalies Repeatable Read still allows) has to be built card by card. At 375 px the anomaly cards run to about 1,400 px. The meaning of "Yes" ("the anomaly can happen") is given only in the preceding paragraph, not in the item. Screenshots: `visual-a03-anomaly-cards.png`, `visual-a03-statement-cards.png`.
Effect: The comparison the reader needs, between levels and between statements, is not visible at a glance, and "Yes" is ambiguous when the cards are read on their own.
Suggestion: Use two compact tables, which is how practitioners meet the anomaly grid in PostgreSQL's documentation. Make the first anomaly × level, with cells "can happen", "prevented" and "refused (40001)". The phantom definition and its Repeatable Read caveat can sit in the row label or a footnote. Make the second statement × situation. The cells are short, so neither table runs into the prose-table column limit. The engine cards should stay as cards.

### visual-26 · optional · a03 Figure 1, "Each statement on its own"

Problem: Step 6 shows exactly the board of step 5: the same lane cells, rows and rule check, with the broken rule already shown since step 4. Only the explanation changes. The figures skill asks each option to end on a step that shows the outcome, not one that repeats the step before. The lane labels are also uneven: "Take a place in class 22" for R10, then "Take a place in class 22 (R11)". Screenshots: `visual-a03-figure1-step5.png`, `visual-a03-figure1-step6.png`.
Effect: Under Play, the reader waits through a step in which nothing changes. When stepping by hand, Next seems not to work.
Suggestion: Merge the final explanation into step 5, or give step 6 a visible outcome, for example a verdict line such as "Places that exist: 3 · accounted for: 2". Label both "take a place" cells with their request.

### visual-27 · optional · a03 committed-rows tables, `owner_id`

Problem: In the starting tables and on every figure board, `owner_id` cells read "2 (Tariq)" and "1 (Mina)". The column holds an integer. The name is an annotation that the database never returns. a00 Figure 2 keeps names in a `customers` table and joins to them, which the figures skill asks for ("each column holds one kind of value"). Visible in `visual-a03-figure2-schedule.png`.
Effect: Minor. The reader learns a slightly false picture of what the row holds, in the article that most needs rows read exactly.
Suggestion: Show `owner_id` as the bare integer, and add a one-line key under the board (1 Mina, 2 Tariq, 3 Edda), or a small `customers` table under the starting tables.

### visual-28 · optional · a03 Figures 1 to 5 (with a00 Figure 4), schedule notation and lane colours

Problem: The two articles draw the same kind of two-session race in two notations. a00 Figure 4 shows real SQL in the lanes, puts uncommitted rows into the tables marked "uncommitted", and ends on a Right/Wrong verdict. a03 Figure 2, the same race on class 21, shows pseudo-statements ("write remaining = 0"), only committed rows, uncommitted state in the lane headers, and ✓/✕ rule checks. a03's lane cells also carry coloured bars with no key: dashed gold for waiting, coral for an error, teal for a refusal. Teal is also the colour of "rule holds". A 23505 refusal in Figure 1 is coral, while "no row: class full" in Figure 5 is teal, so the colours do not map to good and bad outcomes. Screenshots: `visual-a00-figure4-schedule.png`, `visual-a03-figure2-schedule.png`, `visual-a03-figure5-lane-colours.png`.
Effect: A reader arriving from a00 Figure 4 has to relearn how to read a schedule, and may misread the colours as verdicts.
Suggestion: Align the conventions across the collection where it costs little, such as caption position, how waiting is shown and how the outcome is stated. Add a one-line key for the lane bars, or keep colour for the rule checks only and say "refused" and "error" in the cell text, which a03 already does.

## Limits

- Browser: subagent panes are hidden, so I used headless Chromium (Playwright's `chrome-headless-shell` 1234), with `astro-dev-toolbar` hidden for screenshots. Every browser I started has been closed, and the dev server on port 4564 has been stopped. I checked playback timing from the page's timers, not by watching. a00 Figure 1 held its steps for 8.8 s, 16.0 s and so on. a03 Figure 2 held 3.5 s, 4.9 s, 7.5 s and 6.5 s, matching `holdFor` applied to the text that changed. I computed the hold for every step of every option from the `data-live` text, and found no changing text outside `data-live`. Pause stopped playback and kept the step.
- Keyboard: I tabbed through each stepped figure's controls and drove Next, Back and the options with Enter and Space. I did not test with a screen reader. I confirmed `aria-live="polite"` on the explanation (a03) or on its container (a00), but did not hear it announced.
- Contrast was computed from styles, blending backgrounds and the element's own opacity. It does not account for opacity on ancestors, or for colours inside SVG strokes, which I checked by eye in both themes.
- Reduced-motion behaviour was not emulated.
- I did not check technical claims against a database. Where a figure's numbers agreed with each other (for example 199,003 orders against "Rows Removed by Filter: 199001"), I noted it; correctness is the practitioner perspective's job.
- On the first page load the console reported one 404 for a resource it did not name. It did not recur when I reloaded with a response listener. No figure was affected.
