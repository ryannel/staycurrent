# Fresh reading of the three visual aids

This reading uses only the six supplied light and dark screenshots. I did not read the article, implementation, intended interpretation, earlier reviews, or external sources. For prose guidance I read the style skill and only lines 1–27 of `docs/writing-style.md`.

## Aid A: finding the contents of an order

In `aid-a-light.png`, I read a complete worked SQL example. The setup supplies one product, P7, named Blue mug, and one order line for O12 with quantity 2. The query connects an order line to its product through matching product IDs, keeps the requested order, and returns a product name and quantity. The result is one row: Blue mug, 2.

The reading sequence is straightforward: question, example data in prose, SQL, explanation of the clauses, then the answer. The result table has the same columns as the SELECT expression. That correspondence makes the outcome easy to check without executing anything.

`aid-a-dark.png` communicates the same sequence and result. The SQL keywords lose the teal distinction visible in the light screenshot, so the code takes slightly more effort to scan. All the text remains readable at the supplied size. This is a modest difference in emphasis, not a change in meaning.

Neither image suggests that the code or result is editable. The code panel has no run button, input treatment, caret, or other invitation to act. The SQL EXAMPLE label agrees with that presentation.

The order identifier's initial capital O resembles a zero, especially in the monospaced text. A reader can follow the example despite this, since the identifier is repeated consistently. There is no missing step that prevents me from reaching the shown result. The source tables are described rather than drawn, so I must hold their small amount of data in mind while reading the join.

## Aid B: following an index to the orders

In `aid-b-light.png`, I read two related structures. The left structure groups index entries by customer ID and identifies an order for each entry. The right structure contains the orders and their totals. C4 has two highlighted entries on the left, and each arrow leads to the matching order on the right: O12 with €36 and O14 with €60.

The arrows establish a left-to-right lookup, not a chronological sequence. The left-hand rows for C4 are adjacent even though their matching orders are separated on the right. That arrangement explains why keeping another ordering of the data can help find related rows. Repeating C4 is meaningful: there are two orders to locate. The answer beneath the tables confirms both results and mentions the work needed to maintain the extra structure.

`aid-b-dark.png` preserves the same relationships. The arrows and highlighted rows remain distinct from their surroundings. The light version has a slightly softer separation between the highlighted cells and the paper, but the dark vertical strips, text, and arrow endpoints still make the match clear. Neither version depends on colour alone.

The highlighted rows could resemble selected table rows in an application, but the ILLUSTRATION label, drawn arrows, and finished answer make this read as a static explanation. I do not expect to click a customer or expand a row. There are no convincing false controls.

One possible overreading is that an index always stores the displayed order identifier as its locator. The column heading “Locate order” supports the simpler interpretation that this is the information needed to reach the order, without specifying a physical storage representation. The drawing also explains a route to the answer rather than demonstrating how much faster that route is: it does not show the work of searching the index or the work of a scan. I would not infer a numerical performance claim from it.

## Aid C: waiting for the same row

In `aid-c-light.png`, I read two buyer timelines sharing downward-running time. Buyer 1 acquires the product row's lock, finds one item, reserves it by setting stock to zero, and commits. Buyer 2 starts while that work is underway, requests the same lock, and waits. The hatched segment means that Buyer 2 has made no stock check during that interval.

The dotted line joins the end of Buyer 1's transaction to the point where Buyer 2 can proceed. Below it, Buyer 2 acquires the lock, checks the now-zero stock, declines the purchase, and ends the transaction. The expected outcome is one completed purchase and one declined purchase. The second buyer does not make a decision using the earlier stock value.

`aid-c-dark.png` gives me the same reading. The waiting segment is more subdued against the dark surface, but its hatching and explicit Waiting label preserve its meaning. The acquisition step remains visible in teal. Text hierarchy, spacing, and the termination of the first buyer's line help distinguish a completed transaction from one that continues.

I do not see any interactive affordance. The vertical arrows are timeline guides, the hatching marks elapsed waiting, and the coloured labels describe states. The phrase “Time runs down” resolves the direction before the reader reaches the events.

Buyer 1 does not have an explicit “Start transaction” entry while Buyer 2 does. This small asymmetry does not obstruct the sequence because the setup names both transactions and the first lane clearly ends at commit. The diagram shows a lock-based sequence; it does not, on its own, establish that every kind of stock read must wait. Within its stated row-locking example, the wait and the outcome are clear.

## Across the set

The three aids explain different operations: combining related rows to answer a query, locating matching rows through an index, and coordinating concurrent changes to one row. They share a restrained table-and-text treatment, but each uses a suitable structure: executable-looking SQL with a printed result, arrows between tables, and parallel timelines. I do not read the three aids as successive steps of one transaction.

Both themes preserve the outcomes and relationships. The only notable theme difference is the reduced SQL syntax distinction in Aid A's dark version. I found no unreadable essential label, ambiguous arrow destination, missing result, or strong false invitation to interact in these screenshots. This conclusion concerns their visible presentation; screenshots cannot establish actual behaviour, accessibility, or layout at other widths.
