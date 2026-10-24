# Teaching confirmation · article · r05, r06, r09, r13 · batch02-v02

Inputs read: the fresh focused assignment; current `staycurrent-review/SKILL.md` and teaching perspective; [v02 manifest](v02/manifest.json) for identity/input metadata only; v02 context commission, canonical example and the four affected briefs. Read the complete rendered r05, r06, r09 and r13 articles at `http://127.0.0.1:4414/review/relational-collection/`, including the changed figures' states/text alternatives and the surrounding and later explanations. Also read the rendered r14 locking explanation to follow the snapshot dependency into its owner. No source, mechanical records, earlier reports, history or writer notes were read.

Highest severity: none

Scope: informed, focused teaching repair confirmation. This is not a fresh complete article/corpus review or a technical/visual certification. The four coordinator-named areas pass the affected teaching checks; no new substantive finding arose.

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | pass within scope | r05 establishes line/payment identities and grain before the comparison; r06 names grouping and partitioning before the toggle; r09 states the environment prerequisites before the command; r13 defines a snapshot before qualifying its establishment. |
| 2. Order | pass within scope | Each repair arrives at the point the reader needs the distinction. The two figures precede SQL that relies on the shown result meaning; setup stays in the final repeat procedure; the snapshot qualification precedes the repeated-read schedule. |
| 3. Examples | pass within scope | The existing shop identities carry the comparison: order 101's two lines and two payments, Mina's separated orders 101/103 around Tariq's 102, and P7 before/after checkout. No extra example must be learned to understand these repairs. |
| 4. Showing | pass within scope | r05 exposes all four pairs under four column headings, then one pair of totals. r06 exposes customer membership beside both input and retained orders. r13's two read paths and explanatory text show what fixes and retains the view. |
| 5. Judgement | pass within scope | Readers can explain why totals must precede combining, when to keep orders with a window, whether the repeat procedure fits their environment, and when a report's fixed view begins. |
| 6. Gradual exposure | pass within scope | r05/r06 teach logical result meaning without requiring execution mechanics. r09's setup remains optional practical repetition. r13 answers snapshot timing locally, then hands full lock/snapshot protocols to r14. |
| 7. Placement of additions | pass | All four additions improve their existing explanation and belong with that owner. None reads as an attached catalogue or a digression. Detailed placement and dependency judgements follow. |

## Changed-area results

### r05 · Two independent collections · Multiplication figure — pass

The paragraph first explains that payments belong to the order rather than particular lines, then asks the reader to inspect the four pairs. The figure's headed relation makes the entire pairing rule inspectable: line 1 appears with 501 and 502, then line 2 appears with 501 and 502, with both amounts visible on each row. Reading either amount column demonstrates repetition directly. The reader no longer has to reconstruct a relation from disconnected pieces before comparing the two sums.

Switching to **Total each side first** gives one order row with line total 39.50 and payment total 39.50, while the explanation identifies the one-to-one pairing. This is the right position for the intervention: it makes the failure and the repair concrete before the incorrect SQL and the later CTE solution. The text alternative states the two matching payments for each line and the one joined totals row, and distinguishes result meaning from an execution plan.

The later warnings that `GROUP BY` sums received rows, equal amounts are not equal identities, and a plausible zero balance can hide doubled contributions all follow from visible evidence. The complete still-due report then extends the same judgement to missing payments. Nothing in the local change invalidates those later uses.

Applied checks: 1–7, especially 3–5 and 7.

### r06 · Keep the orders · GroupWindow figure and text alternative — pass

Before the figure, the article contrasts one row per customer with one row per order, introduces `OVER` and explains the role of `PARTITION BY customer_id`. The input now shows Mina beside 101 and 103 and Tariq beside 102. The window result retains those customer names, order identities and individual values while adding the customer total. Membership is visible even though Tariq's row sits between Mina's rows; the reader need not remember or infer which order belongs in which partition.

The grouped state makes the collapse from three orders to two customers visible. The window state preserves three rows and repeats Mina's 68.50 beside both of hers. Its note explicitly says that repeated total is not another sale. The text alternative carries the same identities and comparison. These additions belong inside this figure because membership and retained grain are the present teaching problem.

The subsequent SQL, warning against summing repeated customer totals, definition of a partition, and filtering-before/after-window example now have a direct demonstration behind them. Later `LAG` and latest-order examples continue to use the same per-customer distinction; the separate time-tie example introduces its own extension clearly. No wider reordering is needed.

Applied checks: 1–7, especially 1, 4, 5 and 7.

### r09 · Repeat the driver checks · environment/setup procedure — pass

The revised procedure tells the reader to put the two downloads together, identifies macOS/Linux and Unix-domain sockets as the target environment, names the required PostgreSQL tools, gives the pinned Python packages, and shows where the PostgreSQL binary directory and temporary parent enter the run command. The following sentence explains the writable, short absolute temporary path and the socket-path reason. Those are actionable prerequisites for the promised local repetition, rather than unexplained conditions encountered only after an attempt.

The platform qualification also separates the declared target from the recorded macOS run and explicitly says Linux was not checked. The procedure's final inventory maps repetition back to the article's binding, result, transaction, refusal, timeout, cancellation and pool examples. It does not suggest that this local exercise establishes production performance.

The addition belongs here, after the conceptual explanation has given the checks a purpose. Moving the platform and temporary-path details earlier would interrupt the connection/transaction argument; omitting them here would leave the repeat procedure under-specified. For an engineer able to use the stated installed tools and a disposable Python environment, the rendered instructions provide a coherent procedure. Actual execution and runner support are outside this perspective.

Applied checks: 1–7; check 4 through the article's worked driver examples and declared repeat checks, rather than a new setup figure.

### r13 · What a snapshot keeps · fixed-view qualification — pass

The paragraph first defines a snapshot and contrasts Read Committed's two possible statement views. It then says Repeatable Read fixes the view when it first needs a query snapshot, immediately instantiates that as the report's first `SELECT`, and gives a specific non-establishing setting between `BEGIN` and the first read. The concrete consequence—a commit in that gap can still enter the view—does the explanatory work. The reader is not required to know an unintroduced classification of utility commands.

The qualification belongs at precisely this boundary: after the statement-snapshot explanation and before the repeated-read drawing. The drawing's text paths say that the first query establishes the Repeatable Read view, and the following prose explains why a multi-query report can use that view without reserving stock. The repair therefore sharpens the intended distinction between stable reading and protected purchasing.

Later write-skew/Serializable explanations and the protection table remain coherent. The hand-off to r14 explicitly says waiting does not refresh an existing Repeatable Read snapshot. Reading r14's guard/count explanation confirms that it takes snapshot establishment as an explicit scenario precondition and owns the deeper choice between a fresh Read Committed statement, changed guard plus retry, and Serializable. The local qualification prepares that dependency without duplicating the lock protocol.

Applied checks: 1–7, especially 1, 2, 5–7.

## Reference calibration

Consulted relevant complete rendered passages and figure explanations, rather than automatically rereading all three fixed references in full:

- **Indexes**, “Sequential scan” through “Index entries and row locations”, including Figures 1–2: identities and the facts being counted remain visible while the representation changes, with prose directing the reader's comparison. This calibrates the reduced reconstruction effort in r05/r06. “Where the numbers come from” provides the bounded repeat/provenance comparison for r09.
- **Storage and durability**, “Row versions and undo logs”, including Figure 3, its complete state alternative, engine comparison and long-transaction consequence: a specific report/read and one changed product carry the snapshot distinction before internals are deepened. This calibrates r13's concrete qualification and its hand-off of physical detail.
- **Sequence diagrams**, “Lifelines and messages”, “Replies and activation bars” and “Synchronous and asynchronous messages”, with their complete figure explanations: the reader is told what to watch, one variable is changed, then the practical consequence is drawn. This calibrates the placement and explanatory burden of the revised figure comparisons, without treating diagrams as measurements.

These reference comparisons concern teaching arrangement and explicit comparison, not visual equivalence or technical verification.

## Findings

None in the focused scope. No concrete reader stall, misleading inference, unearned prerequisite or misplaced addition remains in the four named areas.

## Limits and unchanged areas

No source edits, builds, delegation, database execution, download events or mechanical verification were performed. The sole written output is this report. Viewport and theme were not changed. The temporary browser tab was closed before return.

The complete four articles were read to assess the repairs in context and later uses, but unchanged passages/figures were not independently re-certified against every teaching check. In particular, r05 outer-join/absence mechanics, r06 frame/ranking mechanics, r09 driver correctness and all cancellation states, and r13 isolation/locking correctness remain outside this focused confirmation. r03, r07 and the remaining collection were not re-reviewed. The r14 reading checked the affected snapshot hand-off, not a full independent review. No change found here required widening to a fresh whole-article teaching judgement or a collection-wide pass.
