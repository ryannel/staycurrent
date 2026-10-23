# Visual review · repair confirmation · complete introduction · v2

Inputs read: [assignment](../assignments/confirm-visual-v2.txt), [confirmation scope](../confirmation-scope-v2.md), [frozen manifest](../frozen-v2.json), [mechanical receipt](../mechanical-receipt-v2.md), its two applicability/data records and `native-check.json`; AGENTS.md, README.md, site direction, staycurrent-review and its visual perspective, staycurrent-figures and its rendering/database-verification references. Current r07 article and isolated media were inspected at port 4362. No author quality notes, earlier review verdicts or unrelated trials were read.

Reference calibration: the provenance manifest and exact rendered-text passages in `reference-reading/sequences.txt` lines 1–48, `indexes.txt` lines 1–64, and `storage.txt` lines 1–65 and 151–197. Browser inspection at port 4350 covered Sequence diagrams Figure 1, Indexes Figure 2, and Storage and durability Figure 5, including their visible explanation and relevant controls. This was focused calibration, not complete rereading of all three reference articles.

Highest severity: none.

## Checks

| Check | Result | Note |
| --- | --- | --- |
| First reading alone | pass | Figures 1–4, the history SQL/result and conditional update were read on the isolated route before current article prose. Apparent meanings are recorded below. |
| Form fits the content | pass | Figure 1 marks an actual row and a complete stock column. Figure 2 uses one relation per table, genuine column headings and explicit named-value transitions. The two prices retain their different meanings. |
| Readable at a glance | pass | The changed table labels, outlines, arrows and captions are legible in both themes and widths. Figure 1 fits 375px without horizontal scrolling. Figure 2's five-column line table scrolls within a named, keyboard-focusable region. |
| Interaction | pass | Freshly exercised both five-state histories, protocol selection/reset, Next, Back, Reset, Play, Pause, Replay and the text-history disclosure. State results and explanations agree. Next and Back retain focus at 5/5 and 1/5 respectively. Native popup keyboard selection remains an explicit limit below. |
| Themes and phones | pass | Fresh visual inspection at 375×812 and desktop 1488px, light and dark, isolated and in place. Changing narrative and controls remain together on phone; no page-level horizontal overflow. Targeted current contrast checks pass. |

## First reading

- **Figure 1:** three products, one per row; the marked P7 row says Blue mug with stock 0. The shaded stock column compares counts 10/0/4. The row/column reading directions, outlined-row sentence and after-purchase caption establish what to read without requiring the later prose. No uncertainty about whether position is an identifier.
- **Figure 2:** Mina's customer 1 matches both orders; order 103 matches its two numbered lines; line 1's P7 identifies the mug. The displayed row has an offered price 20.00 and stock 0; the line records quantity 1 at 20.00. The caption identifies an accepted, unpaid order whose stock has already been taken. This does visible matching work, rather than merely presenting four tables for the reader to connect unaided.
- **History SQL and result:** the query combines order, line and product facts, restricts customer 1 and orders the answer. Four rows belong to two orders, with two pending lines for 103. The mug and tea quantities/prices agree with Figure 2. The selected columns and clause order are readable on desktop; the phone uses contained scrolling for wider material.
- **Figure 3 and conditional SQL:** two buyers can both commit orders while repeatedly writing stock 0; the alternative makes the second update wait, then recheck and return no row. The committed-order summary makes the difference visible. Each of the ten current states was read through the actual controls. The SQL visibly combines the stock condition and subtraction and returns the changed stock. The caption distinguishes a stepped illustration from reproduced PostgreSQL outcomes.
- **Figure 4:** changes begin in memory, a durable log including the commit record precedes the success reply, and page-file work can follow. A lost reply leaves the application uncertain. The figure identifies persistent storage, the ordering boundary and the conceptual limits; it does not imply equal durations.

## Confirmation of accepted problems

| Problem | Result | Confirmation and affected dependencies |
| --- | --- | --- |
| D1 · row/column before relationships | confirmed | The first table and its prompt/interpretation establish one row and one column before the relationship path. Figure 2 explicitly matches 1, 103 and P7 in named columns. Its multiple order rows and two numbered lines support the following key explanation. Current-offer versus agreed-price columns support the price paragraph and subsequent history query. The caption and text do not rely solely on colour or row position. |
| D2 · coherent example moment | confirmed for visual scope | Opening displays consistently show the accepted order: P3/P7/P9 stock 10/0/4, order 103 pending and unpaid, and its two lines. The purchase paragraph explicitly rewinds to no 103/lines and stock 1/12 before either race. Both histories and the subsequent conditional-update explanation fit that starting point; the commit and lost-reply sections continue the resulting purchase. Edda is explicitly introduced as a registered customer who need not have purchased. No missing lifecycle must be invented to interpret the media. |
| D4 · ordinary caption | confirmed | Figure 3 now says both outcomes were also reproduced in PostgreSQL 18, alongside the clear statement that the page runs no database. “Supporting native check” is absent. |
| D5 · labels and numbering | confirmed | Current captions and article references use Figures 1–4; the player group is named for Figure 3. Buyer/status labels remain visible paragraph labels. Current rendered DOM contains zero headings inside figures, on both inspected routes. |

D3 was not assigned as a visual repair. Its read-boundary/rollout paragraphs and the surrounding request/distribution passages were read for downstream consistency; this report does not supply their independent technical or editorial judgement.

## Current mechanics and accessibility evidence

- Compared every listed hash with the freeze: 42 source files, 213 rendered files and four evidence files matched. No build, source edit or native database rerun was performed.
- The supplied native evidence and applicability records support reuse for the unchanged history SQL, original fixture exports, protocols/events and verifier. The displayed history is exactly the recorded four-row result; the new after-103 display matches the previously observed protected stock 10/0/4. These records establish applicability/outcomes, not teaching quality or performance.
- Fresh keyboard Next/Back checks reached each boundary with the respective control still focused and `aria-disabled="true"`. Reset, Play and Pause also operated by keyboard. Replay restarted the protected history, and Pause stopped it. Both option values were selected through the current native select control, with a reset to state 1 observed. Both expanded text histories contain all five explanations in order.
- On the phone, the line-table region measured 309px with 382px of content. Keyboard Right scrolling settled at offset 73, exposing `unit_price` and both prices; a visible focus ring remained. Figure 1 required no horizontal scroll. The full article's phone document width was 375px, matching the viewport; desktop was 1488px.
- Current semantic inspection found captions and scoped column headers on all five changed tables, named scroll regions, figure names and a full text alternative to the animation. The matching steps and outlined-row explanation also convey their meaning in text.
- Fresh light-theme leaf-text samples across the figures had a minimum 6.05:1. Current dark secondary text against the figure paper measured 6.15:1; the identifier outline measured 8.16:1, and the stock-column boundary 5.49:1. The permitted current receipt supplies the corresponding light outline/boundary samples (4.36:1 and 5.75:1), whose frozen styling remains applicable. These are targeted computed-colour checks, not exhaustive pixel certification.
- No warning/error entries were returned for either current review tab. The reference origin retained System theme. The article origin was returned to System; the temporary narrow review tab was closed, the viewport override reset, and the surviving review tab was verified at 1488×917 before cleanup. All three tabs created for this review were closed.

## Findings

None. No `visual-1` finding is opened.

## Limits

This is informed confirmation of the specified v2 repairs, surroundings and affected dependencies, not a blind complete visual review. The unchanged recovery/choice tables and unrelated media were read only as downstream context, without a new full rendering/control matrix. No article build, publication, source editing or additional agents were used.

Browser automation occasionally timed out on a changing control; retrying through freshly observed controls established the behaviour reported above. Keyboard activation of buttons and horizontal table access was established, but full OS popup keyboard option selection was attempted without establishing a change; native select selection itself was exercised through the browser's supported selection action. This is not evidence that the popup is broken.

Playback visibly advanced and paused on the current build. Hidden-window/tool timing can throttle animation, so no new precise wall-clock dwell measurements are claimed. The receipt's identified unchanged-control timing evidence remains applicable. No screen-reader session, physical phone, zoom matrix, print or reduced-motion emulation was performed. No new engine, crash, network, latency, capacity or recovery-time results are claimed.
