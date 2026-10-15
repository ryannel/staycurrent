# Rollback tutorial: independent first reading

Read on 2026-10-15 at http://127.0.0.1:4322/learn/databases/relational/sandbox/?tutorial=rollback. This is an agent reading from the perspective of an engineer comfortable with application code but with little database practice, not an observed human novice session. I read the two context-free review references only. I did not inspect source, author notes, expected answers or other reviews. Delivery is the rendered browser accessibility tree, one live tutorial state at a time; visual inspection is noted separately. Notes are saved before advancing.

## Arrival

The page promises SQL with rows, command results or errors and no installation. The selected tutorial is “Recover from a rejected order line.” I understand that I will deliberately fail a checkout, then use rollback to finish handling it. I do not yet know whether the earlier changes survive the rejection. “Your database belongs to this browser tab” and the explicit reset boundaries make it comfortable to experiment. The Start button is clear. I leave “What runs here?” closed.

## Step 1, before running

“This fresh shop has three mugs and no O14” establishes stock and a missing object. I infer O14 is an order identifier from “checkout,” but this has not yet been explicitly stated on this direct-entry path. BEGIN is explained as grouping upcoming changes. I expect a command acknowledgement and an open transaction, not a table of rows. The editor note makes separate runs versus one batch explicit, although the transaction vocabulary is dense on first entry. I leave “What to look for” closed until after running. The initial screenshot shows the introduction and Start panel filling the viewport, with the tutorial below the fold; the accessibility reading includes that offscreen text.

Step 1 returned BEGIN and “Transaction open · changes uncommitted,” matching my prediction. Opening the optional “What to look for” afterwards confirmed that nothing changed yet. The status supplies meaning that the bare command response lacks.

## Step 2, before running

The command subtracts two from stock only if at least two are available and returns the identifier and remaining stock. I expect one row with P7 and 1, using the earlier three mugs. P7 has not been introduced as the mug identifier; the heading lets me infer that mapping. The instruction to stop and rollback on zero rows gives a concrete decision rule. I can follow this SQL using code familiarity, though RETURNING is new syntax whose role I infer from its name and the promise of a row.

Step 2 returned UPDATE 1 and the predicted P7 / 1 row. The row gives me enough evidence to continue under the stated rule. I still need to learn what happens to this reservation when the later command fails.

## Step 3, before running

The INSERT columns clarify O14 as an order identifier. C4 is a customer; no particular customer identity is needed for this exercise. The prose explains why an order record alone does not describe the purchase. I expect a successful insertion response without result rows, because there is no RETURNING clause.

Step 3 returned INSERT 0 1. The zero briefly made me ask whether no record was inserted. I opened the nearby “Reading command responses” disclosure, which explicitly resolves the zero as a legacy field and the final 1 as the inserted count. This is a successful just-in-time explanation. It also says open-transaction changes still need COMMIT.

## Step 4, before running

The value mapping and positive-quantity rule are explicit. I expect rejection of the order line. The awaited-query explanation connects SQL failure to application control flow: later COMMIT would be skipped. My unresolved question is whether the earlier reservation and order remain available to inspect or need cleanup first.

Step 4 returned a quantity-check error, with the failing row I sent. The banner and transaction status both tell me to send ROLLBACK. This makes the required recovery action clear without requiring me to decode SQLSTATE 23514. I will follow the tutorial's next step to learn the effect.

## Step 5, before running

This directly addresses my question about inspection after failure. “Ordinary read before rolling back” asks me to try SELECT available. Because the banner says rollback is required to continue, I predict another error rather than 1 or 3. Calling this an extra experiment prevents confusion about whether an application should do this routinely.

Step 5 returned “current transaction is aborted, commands ignored until end of transaction block.” That matches the prediction. Now I understand why the failed connection cannot simply continue with ordinary work.

## Step 6, before running

The catch-block analogy tells me where this command belongs in application code. “Do not add two mugs back ... the reservation never committed” answers the cleanup question concretely. I expect ROLLBACK to end the failed state and restore stock to three, with no O14 order surviving. I am deriving the order prediction from BEGIN grouping the changes rather than an explicit statement in this step.

Step 6 returned ROLLBACK and “No transaction open.” That confirms recovery of the connection; the data prediction still needs a read.

## Step 7, before running

The nested SELECT syntax takes more effort than prior commands, but each clause is labelled and the successful comparison supplies the column meanings. I expect available = 3, orders = 0, lines = 0. I did not take the successful checkout tutorial, so its supplied 1 / 1 / 1 comparison is useful without assuming that prior route.

Step 7 returned exactly 3 / 0 / 0. I then opened “What to look for,” which confirms that rollback discarded the stock reduction and order together. The tutorial has answered my original question about earlier changes surviving a rejected line.

## Findings and smallest useful repairs

No material comprehension or execution blocker appeared on the default seven-step route. All seven commands ran; the two deliberate failures were understandable and recoverable. I used the supplied commands unchanged. The strongest support is the changing transaction status, the explicit zero-row decision in the reservation step, the application catch-block analogy, and the final single-row comparison.

Minor direct-entry friction: step 1 uses O14 before naming it as an order, and step 2 relies on its heading to identify P7 as the mug. A small opening phrase such as “three mugs (P7) and no order O14” would remove that inference. Recheck that a direct entrant can identify both without opening the starting tables. This is reduced effort, not a blocker.

The INSERT 0 1 response initially raised a question, but the nearby command-response disclosure answered it immediately. Preserve that explanation. The final nested inspection query requires more SQL familiarity to adapt than to interpret; its labelled results suffice for this tutorial's recovery goal. Further curiosity would be how an application ensures rollback uses the same connection; that belongs with the linked explanation rather than requiring an expansion here.

Limits: this was an independent agent reading, not human usability evidence. It used the live accessibility tree for sequential content and one initial viewport screenshot, not a full visual or keyboard-accessibility audit. Optional expected-result disclosures were opened only after prediction and execution in steps 1 and 7; command-response help was opened when INSERT 0 1 raised a question. Other tutorial paths and edited-query variations were outside scope. No source was inspected and no code was edited.
