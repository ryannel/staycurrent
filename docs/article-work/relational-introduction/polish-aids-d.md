# Independent teaching-aid review D

Reviewed only the six supplied images, in light and dark themes. I did not read the article, implementation, intended answers, author history, or other reviews. The only prose reference read was the house style skill and lines 1–27 of `docs/writing-style.md`.

## Aid A: SQL example

This teaches how a query combines the product name with the quantity on an order line. The setup supplies the two facts needed to follow the example: P7 is a blue mug, and order O12 contains two of P7. The query matches product IDs, selects O12's lines, and returns the name and quantity. I read the result as one row: Blue mug, 2.

The sequence is clear: stated data, query, explanation of its clauses, result. A reader can check the result against the setup without finding another figure. The separate input tables are not pictured, so the join is explained mostly by prose and SQL rather than by watching rows combine. That is a limit of the example, not a contradiction or a missing fact needed to understand this result.

Nothing looks clickable. The SQL block looks like a code sample, and the result looks like a static table. The light theme distinguishes SQL keywords with colour; that distinction is much less apparent in dark mode. Both remain readable, and their meaning is the same.

## Aid B: customer index

This teaches that an index on customer ID can lead to the relevant order rows, whose totals are then read from the orders table. It also shows why one customer can appear more than once in the index. I follow the two highlighted C4 entries left to right, along arrows to O12 and O14, and read totals of €36 and €60. The answer underneath confirms that these are two separate order totals.

The two tables have different orderings, which helps explain the purpose of the extra structure: C4's entries are together in the index while its orders are separated in the main table. The arrows land at the correct rows. The caption also makes the maintenance cost visible as a tradeoff.

What remains unexplained is how the engine finds C4 in the index without scanning that structure. The picture establishes the route from a matching index entry to an order; it does not itself demonstrate the search advantage. I would not take this as evidence of a particular speedup or storage implementation. This omission does not obstruct the illustrated lookup.

Nothing strongly invites a click. The highlighted rows could resemble selected table rows in isolation, but the arrows, illustration label, and completed answer make this read as a static figure. Both themes preserve the highlights and arrows. The arrows stand out slightly more in the dark version; all values and relationships remain legible.

## Aid C: row locking

This teaches why a second buyer must wait before checking stock when both transactions need the same locked product row. There is initially one item. Time runs down two buyer columns. Buyer 1 acquires the lock, sees stock of 1, reserves the item by changing stock to 0, and commits, releasing the lock. Buyer 2 starts during that work, requests the same lock, and waits without checking stock. After the first transaction ends, Buyer 2 acquires the lock, sees 0, declines the purchase, and releases the lock.

The result is clear: only the first buyer purchases the item. The waiting interval spans the first buyer's reservation and commit. The shared horizontal boundary makes it easy to connect release on the left with acquisition on the right. The explicit “No stock check yet” label does useful work: it prevents me from reading the wait as occurring after a stale stock check.

The dashed boundary is not explicitly named, but the adjacent commit, release, transaction-ended, and acquire labels make its meaning recoverable. I did not find a blocking ambiguity. The diagram describes one successful ordering of these transactions; it does not show other transaction behaviours.

Nothing looks clickable. Bold actions are timeline labels, and the hatched strip reads as elapsed waiting time. Both themes preserve the sequence and result. The dark version makes the amber wait and green acquisition particularly clear; the light version is also readable. Colour is supported by words and hatching, so the distinction does not depend on hue alone.

## Overall judgement

All three images communicate a concrete answer without surrounding article text. B and C show their relationships spatially; A works as a compact worked SQL example. I found no broken relationship, contradictory result, clipped content, or control that appears to demand interaction. The most useful boundary to retain in surrounding prose is that B illustrates following index entries to rows, rather than explaining the index's internal search algorithm.
