# Independent first reading of the teaching aids

I read only the four rendered fixtures at `http://127.0.0.1:4325/`: relationships in light and dark themes, then the query in light and dark themes. I used CUA screenshots and their accessibility text. I did not open the article, author brief, evidence, planning documents, source files, or another review. I left the browser viewport unchanged. I loaded the house style skill and its writing references for this report.

## Separate records, connected by IDs

My first interpretation was that Ada is customer C4, her order is O12, and one line of that order contains two blue mugs, product P7. The customer and product have their own records. The order carries the customer's ID, and the order line carries both the order's ID and the product's ID. Repeating those IDs lets me follow the connections without copying Ada's name or the product name into every record.

The arrowheads made their direction clear: O12 points to C4, and the order line points to O12 and P7. The labels on the arrows repeat the IDs at both ends, so I could check each connection. I did not read the arrows as events moving through a pipeline. I read them as references between records.

I started at Ada in the upper left, then looked at the order on the right. Following the actual references required going back left, and then starting again at the lower-right order line. That is a small reading-order hesitation, not a failure to understand the picture. Starting with the lower-right record gives the most direct traversal of all three arrows, but nothing explicitly asks me to start there.

The dots in `O12 · C4` and `O12 · P7` looked like separators between IDs, rather than a mathematical operation. There are no column names on those cards, so that interpretation depends on the repeated IDs and the arrows. It works for these records. The drawing does not by itself teach primary-key terminology, foreign-key constraints, or how many records may connect to each other. Nor did I infer that an order has only one line: the image says it shows separate records, and the stack outlines suggest additional records.

The labels and content suffice to explain this particular purchase and the purpose of shared IDs. “Order lines” is the only term that a newcomer may need to work out; the quantity and product reference make its meaning inferable. Nothing looks operable. The illustration label, drawn cards, and arrows all read as a static figure.

The dark version preserved the same reading. The card edges and arrows were softer than in the light version, but remained distinguishable. Names, IDs, quantity, and headings were readable in both.

## What is in order O12?

My first interpretation was that this is a complete worked join: begin with two order lines, find each product with the same `product_id`, and return the product name alongside the quantity and unit price recorded for the purchase. The result is two blue mugs at €18 each and one bowl at €24. The mug's current catalogue price is €20, but this query preserves the €18 paid at purchase. The opening sentence and table captions make that distinction explicit.

I could account for every result cell. `Blue mug` comes from the P7 product row; `2` and `€18` come from the O12/P7 order line. `Bowl` comes from P8; `1` and `€24` come from O12/P8. There are two result rows because there are two product lines, even though the order contains three items. The phrase “All prices are euros per item” prevented me from reading €18 as the total for two mugs.

The reading order is clear: question, short instruction, products table, order-lines table, SQL, result. At the supplied viewport the example takes a scroll, and the products table is out of view when the complete query and result are visible. That slightly increases the work of checking the join, but the tiny tables and repeated names make it manageable. I did not change the viewport or assess other sizes.

For an engineer new to relational databases, the equality in the `ON` clause is concrete enough to follow: the two `product_id` values must match. The qualified names also show which table supplies each output column. I can infer what `SELECT`, `FROM`, and `JOIN` are doing from the tables and result without first knowing SQL grammar. The example does not demonstrate the effect of `WHERE`, because both displayed order lines are already O12. It also does not demonstrate reordering, because P7 and P8 appear in that order in the source tables. Those clauses are understandable from their names and values, but their effect is not made visible by this dataset.

The query looks like displayed code rather than an editor. There is no Run button, cursor, input, selectable option, or other visible control. The result's coloured left rule distinguishes it from the source tables without suggesting that it can be operated. “Worked example · SQL and result” sets the right expectation before I reach the code.

The labels and content suffice to teach this join and the distinction between catalogue and purchase prices. I would not need surrounding article prose to explain the result. The query is readable in both themes; the dark code block remains distinct from its surrounding surface, and the result rule is easy to see.

## Findings to carry forward

Both aids communicate their main concrete relationships without the article. I found no ambiguous price or result, no unexplained arrow direction, and no false expectation of interaction. Two limits are worth retaining: the first figure takes a little visual backtracking because the references run against normal reading order, and the worked query shows the join and selected columns more directly than it shows filtering or sorting. These are observations from the first reading, not claims about the author's intended scope.
