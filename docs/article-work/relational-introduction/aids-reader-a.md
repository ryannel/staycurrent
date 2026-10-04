# Independent aid reading — reader A

I inspected only the four supplied standalone browser pages, without the article, brief, evidence, source files, or intended teaching claims. I used the normal browser viewport. These observations record my reading before receiving any account of the purpose.

## Relationship illustration: first reading

The illustration shows four kinds of records, each kept in its own table. Records connect through repeated identifiers. The order marked O12 contains C4, which leads to Ada's customer record. The order line contains O12 and P7: O12 leads to that order, and P7 leads to the blue mug. Quantity 2 belongs to that order line. I therefore read the example as Ada ordering two blue mugs in order O12.

The arrows point from a record containing another record's identifier toward the record it refers to. The labels on the arrows match the repeated identifiers, so I can follow the relationships without knowing database notation. The stacked cards suggest more records exist in each table. No part looks clickable; the heading explicitly calls it an illustration.

The main uncertainty is the distinction between the card and the table. Each area is labelled as a table but shows one card, so an unfamiliar reader could initially take the card as the whole table. The stacks make the intended reading plausible. The dotted pairs, O12 · C4 and O12 · P7, are compact but do not name the fields; a little inference is required to distinguish the record's own identifier from the identifiers it holds. I can reconstruct this example without surrounding text, but I would still need prose to learn why orders and order lines are separate, or what rules make these references reliable.

The dark version conveys the same relationships. Text and arrows remain readable. Its subtler card edges do not obscure which records the arrows connect.

## Query aid: first reading

This is a worked example of combining information from two tables to answer what is in one order. The products table knows the product names and current prices. The order lines hold the items bought, their quantities, and the prices recorded at purchase. Matching product_id lets the result show names beside the purchase facts.

For the first line, O12 / P7 / 2 / €18, I find P7 in Products and obtain Blue mug. The result is Blue mug / 2 / €18. I do not replace €18 with the catalogue's €20. The second line matches P8 to Bowl and produces Bowl / 1 / €24. The setup explicitly says all prices are per item, so I read €18 as the price of each mug, not the total for the two mugs.

The SQL is readable as an engineer even without prior SQL experience: SELECT names the three output fields, the equality after ON explains the matching rule, WHERE specifies O12, and ORDER BY uses the product identifier. The labels distinguish source data, query, and output. No element looks clickable, editable, or runnable; the treatment agrees with “worked example.”

The result and source tables require a short scroll at the supplied viewport. This is manageable with two source rows. There is no visible example from another order, so the WHERE clause's filtering effect is stated in code and its label but cannot be observed as an excluded row. This limits what the example demonstrates, rather than making the answer ambiguous. I can understand the result without surrounding prose. I would need more explanation for broader SQL behaviour, such as what happens when an identifier has no match; the aid makes no claim to teach that.

The dark version preserves readable labels, code, and results. The green result border still distinguishes output from the source tables and SQL.

## Findings

No material error prevented me from interpreting either aid. The relationship illustration supports tracing references between separate records; the query aid supports reconstructing a joined result while preserving the price paid. Neither independently explains the wider role of a relational database.

Optional clarification: the relationship illustration could make the one-card-per-record convention explicit if nearby prose has not already established it. Optional extension: if filtering itself is an intended teaching claim, the query source data needs a row from another order so the reader can see one excluded. These are scope-dependent improvements, not errors in the displayed examples.

The coordinator's message about revised article scope arrived after both initial interpretations above had been recorded. I then completed only the remaining dark-query appearance check. This report makes no judgement about the article or whether either aid belongs in its revised structure.
