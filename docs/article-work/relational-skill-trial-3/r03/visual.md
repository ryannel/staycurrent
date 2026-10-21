# Visual review · article · Relational databases and Making concurrent changes correct · 26811e2

Inputs read: rendered `/review/relational-trial-3/` and `/review/relational-trial-3/transactions/` at the coordinator's fixed version; rendered figures and tables from the Sequence diagrams, Indexes, and Storage and durability reference routes; staycurrent-review's visual perspective and staycurrent-figures at the supplied working match to 005ab6f. No article sources, models, plans, writer/repair notes, previous versions, reports, decisions or results were read. Assigned pages remained unopened until GO.

Highest severity: medium

## Checks

| Check | Result | Note |
| --- | --- | --- |
| First reading alone | pass | Item-only first pass recorded below; then read the items in their rendered article context. |
| Form fits the content | pass | Real columns and individual relation tables; marked keys and relationship arrows; joined rows expose multiplication; options compare distinct schedules. |
| Readable at a glance | pass | Captions distinguish models from native observations; labels, totals and SQL order agree. Data-table sideways scrolling is explicitly signposted and keyboard accessible. |
| Interaction | finding | All eight figure/option combinations, every step, autoplay, pause, reset, text alternatives and keyboard endpoints checked. Transaction figures require scrolling between controls and changed lanes on phones: visual-5. |
| Themes and phones | finding | Actual DOM widths 1488 and 375 px confirmed. Both themes readable, no page overflow, comparisons stack, prose tables fit, identifiers stay intact. Same phone interaction issue: visual-5. |

## First reading

### Relational databases

- Figure 1: one customer owns an order, its lines identify products, and earlier payments belong to other orders. PK/FK labels explain identity and references. The caption makes the deliberate absence of orders 101/102 from the order excerpt clear. P7 is exhausted after 103; the order itself is pending, with no payment. No uncertainty after reading the item’s own caption and text alternative.
- Positive-quantity listing: a single required positive integer column, rather than a complete table definition.
- Order-total listing: match 103 to its customer and lines, then sum quantity times agreed price into one result.
- Figure 2: a two-by-two match repeats both independent details. Four joined rows produce doubled money totals; these are result rows, not extra stored lines.
- Wrong-join/repair disclosure: the first SQL totals the multiplied join; the second totals each detail before joining. Readable in the order presented.
- Figure 3: two buyers compete for one mug. Stale calculated assignment accepts 103 and 104 with stock still zero; conditional subtraction makes Tariq wait and then refuse 104. Committed values remain distinct from pending lane work. Both options and all steps were operated.
- Complete-order listing: take both products conditionally, require each returned row, insert the order and its lines, then commit; comments identify application branches.
- Figure 4: an ordered physical path from finding P7, through an in-memory change and durable log, to later page writing. Its caption makes clear that this is not a measured timeline.
- Shortlist table: each requirement maps to evidence needed before accepting a deployment; its two prose columns remain readable.

### Making concurrent changes correct

- Starting tables: Tea tasting has one free place; Mug painting has capacity three and Tariq’s R7, leaving two. Key labels and the relation arrow explain the join.
- Figure 1: R10 succeeds, R11 duplicates Mina’s booking. Separate commits lose a place; one transaction discards the rejected request’s decrement. Both options agree with the committed tables and arithmetic.
- Unsafe-booking SQL: each session writes its earlier calculated zero and its own reservation.
- Figure 2: initially both requests read the same place. Stale overwrite accepts R8 and R9; conditional change refuses R9 after the wait. Pending lanes and committed tables are distinct. Both options were clear without surrounding prose.
- Conditional-statement and optimistic-comparison listings: the former couples the returned decrement to reservation insertion; the latter is visibly just the conditional update.
- Snapshot table: Read Committed rereads zero; Repeatable Read keeps one in its older view.
- Combined-lock/count SQL and observed-history table: the same command retains the earlier count while waiting; the separate next command sees the newly committed reservation. Each table column has one purpose.
- Figure 3 and departure listing: both instructors count two and alter different rows. Repeatable Read permits both departures; Serializable rejects Ravi, then a new full decision counts one and keeps him available. The fifth Serializable step makes the repair visible.
- Expanded schema/fixture: short grouped definitions followed by starting inserts; long lines scroll within their listing.
- Native-results table and final audit SQL: forced cases map to observed outcomes; the query independently checks counter-plus-reservation equality. Clear distinction between explanatory models and reported execution.

## Findings

### visual-5 · medium · Making concurrent changes correct · Figures 1–3 at phone width

Problem: The request lanes, committed tables and playback controls are separated vertically enough that operating Next from the bottom hides the lanes whose text changes. At 375 × 900, Figure 2’s control row is roughly 770 px below its top; the two lane updates begin around 210 and 310 px. In a final-step viewport reached by Next, both request lanes are above the screen, while the committed tables, explanation and controls remain visible. Figure 1 is taller still. See `visual-transactions-phone-light.png`; `visual-transactions-desktop.png` also shows the generous separation between the parts.

Effect: Following the chosen schedule requires scrolling up to find what each request did and back down to advance, or relying on the explanatory sentence in place of seeing the lane change. The comparison costs more effort precisely on the narrow layout.

Suggestion: Reduce the large vertical gaps between the committed tables and their relationship, and keep a playback control near the changing request lanes on narrow screens (for example, a compact sticky control row within the figure). Preserve the separate real-column tables and committed/pending distinction.

## Limits

Chrome used a dedicated review session. Autoplay was run for every option, with independent figures playing concurrently while static material was inspected; some playback therefore ran in a background tab. Timing was checked from the rendered hold-bar transition durations, including 3.5 s for the introduction’s short initial state, 5.295 s for its next conditional state, and 4.305/4.845/5.070 s for the transaction figures’ initial states. Manual keyboard stepping additionally checked every intermediate and final state. Pause remained available; Back and Next retained focus with `aria-disabled=true` at their respective endpoints. These were interface checks, not a new database execution or a timing claim about PostgreSQL.

Computed rendered-text foreground/background contrast was checked across the articles in both themes, including captions, code, table values, controls and expanded details. Minimum sampled ratios were 6.03:1 in light and 6.15:1 in dark (transaction dark minimum 6.83:1), exceeding 4.5:1. No NULL or dimmed data rows occur in the assigned examples. Actual 375 px page scroll width remained 375 px. Narrow data and code overflow was contained in labelled scrolling regions, rather than the page.

Evidence: `visual-introduction-desktop.png`, `visual-transactions-desktop.png`, both phone previews, and the two `visual-*-states.json` records. All started playback was stopped or completed; both created tabs were closed; viewport override reset; theme restored to System. No source edits, native runs, builds, commits or pushes.

Timing: 20:05:57–20:14:44 UTC, 8 minutes 47 seconds including preparation, the coordinator wait, full two-page review, evidence, report and cleanup. Phase allocation is approximate: about one minute preparation, two minutes waiting, about six minutes review/report/cleanup; separate phase stopwatches were not taken.
