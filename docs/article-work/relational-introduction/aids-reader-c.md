# Initial reading of the two teaching aids

I inspected only the four supplied standalone pages in the browser: relationships in light and dark themes, then the query in light and dark themes. I did not read the article, its source, commission, evidence, planning documents, or other reviews. The browser viewport stayed unchanged at its supplied size. This records the initial reading before any article context.

## Separate records, connected by IDs

The figure communicates that information about a customer, an order, a product, and an order line lives in separate records, and that repeated IDs connect them. The small stacks suggest that each table contains more records than the one shown. The person and mug make the customer and product concrete without making me decode their IDs first.

I can trace the example starting at the order line. It contains O12 and P7, with quantity 2. The P7 arrow leads to the blue mug. The O12 arrow leads to an order containing O12 and C4. That order's C4 arrow leads to Ada. I therefore read the example as Ada's order O12 including two blue mugs. The arrows point from a referring record toward the record being referred to. Their labels repeat the value that makes each connection.

I cannot conclude that this is the whole order, that Ada has only one order, or that each order contains only one product. Nor does the picture explain how the database keeps those references valid or how records are physically stored. These are boundaries of the picture rather than failures of the example.

There are two small ambiguities. The headings call the stacks tables, while their fronts look like individual cards rather than rows with named columns. A beginner may not yet know whether a table is one card or the whole stack. Also, “Order lines” is not defined: I infer that it means the entries for individual products in an order. Neither prevents tracing this example, but the figure alone does not teach the row/column structure of a table or the general meaning of an order line. The dot between IDs reads as a separator, not an operation, because the arrows identify each value separately.

Nothing appears interactive. The “Illustration” label, hand-drawn cards, and lack of controls make it read as a fixed diagram. The dark version preserves the same reading; the labels and arrowheads remain distinguishable.

## What is in order O12?

This communicates how matching product IDs brings product names into an order's result while quantities and purchase prices come from the order lines. It also shows why the result's price may differ from the current catalogue price. The introduction explicitly says prices are per item, which removes a real possible ambiguity around the quantity-two mug entry.

I trace P7 from the first order line to Blue mug in the product table. The order line supplies quantity 2 and €18, so the result is Blue mug, 2, €18. The catalogue's €20 is deliberately not carried into the result. P8 matches Bowl, with quantity 1 and €24 from the second order line. The result contains those two rows in product-ID order. Reading the SQL beside these tables makes SELECT look like the choice of output columns, JOIN/ON the matching rule, WHERE the order selection, and ORDER BY the result ordering.

The displayed values support two blue mugs bought at €18 each and one bowl at €24. I could calculate €60 for those items, but the aid neither displays nor calculates a total. I cannot infer taxes, delivery charges, the reason for the mug's price difference, or the product names at purchase time. The names visibly come from the current catalogue. There is also no basis here to conclude anything about query speed, execution steps, unmatched IDs, or whether running a query alters stored records.

The main limitation is that both source order lines already belong to O12. A beginner can read the WHERE condition, but cannot observe it removing an unrelated order. That does not prevent understanding the matching and chosen columns; it means this particular example demonstrates selection of columns more concretely than selection of orders. Both sources also happen to be in matching row order. The repeated product IDs and explicit equality make the intended matching rule clear, though the data does not test that understanding against differently ordered rows.

Nothing appears interactive. “Worked example · SQL and result” is accurate. The code block looks like a displayed snippet, and there is no run control, text cursor, or editable field. The accented result border distinguishes the answer without looking like a button. At the supplied viewport I needed to scroll to see the full query and result, so I could not compare all three tables simultaneously. This added a little memory work but did not break the trace. The light and dark versions were equally understandable; all inspected text and table rules remained readable.

## Overall judgement

Both aids communicate their immediate examples without surrounding article prose. The first establishes connections through IDs; the second makes one such connection concrete with tabular values and a result. The remaining uncertainties concern concepts outside those examples and two opportunities for stronger demonstration in the query data. I found no ambiguity that prevented understanding either example.
