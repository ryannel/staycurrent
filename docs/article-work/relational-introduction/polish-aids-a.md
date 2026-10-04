# Isolated aid reading A

This reading used the six supplied screenshots. I did not open the article, implementation, or another review, and did not research the subject. It is **not a fully blind review**: while loading the required style reference, a truncation command failed to stop at the requested heading because it matched a curly apostrophe instead of the file's straight apostrophe. The returned text included the later author-history passages. That exposure must be considered when using these notes; a separate reader should provide independent acceptance.

## Aid A, light

I read this as a worked SQL query answering what is in one order. The setup supplies two pieces of information: P7 is a blue mug, and order O12 has a line for two of P7. The query connects the product ID in those two places, keeps the requested order, and returns the name and quantity. The expected answer is one row, `Blue mug | 2`, which appears directly below the explanation.

The reading order is straightforward: question, stated data, query, explanation, result. The source data is described in prose rather than shown as tables, so I have to hold P7 in memory while reading the join. That is manageable for this one-line example. The explanation names what ON, WHERE, and SELECT do without suggesting that SQL must execute in that textual order.

Nothing looks clickable. The shaded code panel looks like a quotation of code, not an editor; there is no run control or editable-field treatment. The result table looks like an already obtained answer. At this scale, the order ID's capital O resembles a zero, but that does not prevent matching it across the aid.

## Aid A, dark

I read the same relationship and expect the same single result. The panel and result remain legible, and neither gains a false control affordance. The SQL keyword colour is much less distinct than in light mode, so the code reads more as a single block. The clause explanation still does the necessary work. This is a loss of emphasis rather than a change of meaning.

## Aid B, light

I read this as a lookup from a customer-sorted index into an orders table. The two C4 entries sit together on the left, each paired with a different order. Their arrows lead right to the corresponding highlighted orders. The expected answer is O12 and O14; the written answer confirms it. Repeated C4 entries mean that one customer has multiple orders, not that the index contains an accidental duplicate.

The left table's increasing customer IDs explain why looking up the customer could be convenient. The diagram does not show how the engine finds C4 within that index. On its own, it establishes the route from a found index entry to an order more strongly than it establishes the work saved in finding the entry.

The main ambiguity is that the left table already prints the requested order IDs. For this question, I can answer entirely from the index, before following either arrow. I would therefore read the rightward arrows as showing where the orders live, not as demonstrating a necessary next step to obtain these two IDs. The heading “Locate order” also leaves the physical nature of that locator unspecified, which seems acceptable at this level but does not teach how locating works.

Nothing looks clickable. The continuous row shading, thin rules, and hand-drawn arrows read as annotation. There are no raised boxes or isolated control shapes.

## Aid B, dark

The grouping and arrow direction stay clear. The green rows contrast more strongly with the surrounding surface, while the arrows remain easy to follow. I reach the same answer and retain the same uncertainty about why the illustrated question needs the right-hand table. Nothing newly resembles a control.

## Aid C, light

I read this as two transactions sharing a downward timeline. Both want the one remaining item. Buyer 1 obtains the lock, checks that stock is one, changes stock to zero, then commits and releases the lock. Buyer 2 requests the same lock and waits through that work. After the horizontal boundary, Buyer 2 acquires the lock, sees zero stock, and declines the purchase. I expect one successful purchase and one declined purchase, with stock remaining zero.

The hatched interval makes the waiting period visible without making it a separate action button. “No stock check yet” is decisive: I understand that Buyer 2 has deferred the decision, not merely the write. The horizontal alignment and dotted boundary connect Buyer 1's release to Buyer 2's acquisition. A cross-column arrow is unnecessary for that reading.

Nothing looks clickable. Bold verbs are event labels beside timeline lines. The teal acquisition label is part of the sequence rather than a link. I understand this as one illustrated sequence; the screenshot alone does not establish which database operations automatically take such a lock or make every reader wait. Buyer 1's transaction start is implicit, whereas Buyer 2's is explicit, but that omission does not obscure the pictured outcome.

## Aid C, dark

The sequence and outcome are unchanged. The gold waiting interval and teal acquisition label remain distinct, and the fine timeline arrows are visible. The dotted release boundary is quieter than the text, but still connects the two columns. There are no theme-specific misleading affordances.

Across the six images, I can read the intended answer without operating anything. A supplies an actual query result, B supplies a relationship with two matching rows, and C supplies a decision that changes after waiting. The most material question raised by the screenshots is B's choice of requested output: the index itself already contains that answer.
