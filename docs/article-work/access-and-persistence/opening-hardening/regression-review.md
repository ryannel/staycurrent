# Opening review

Read: `sample-a.txt` and `sample-b.txt`, with the supplied review and style guidance. Audience: readers who know tables and simple `SELECT`/`WHERE`, but not indexes. This is a text review of the supplied openings; no following section, rendering, article history or external source was inspected. Both samples arrived in one tool result, so this is an independent assessment of each text, not a staged blind-reader experiment.

## Sample A

**Teaching judgement: the opening supplies a useful starting model.** “Stores values from selected columns” establishes what the index contains; “references to the table rows” connects those entries to the data the reader already knows. The customer example then explains why the extra structure helps: entries for one customer sit together even when the corresponding orders do not. Reading from the first matching entry through the following matches gives the reader an operation to picture, beyond the claim that indexes make lookups fast.

The last paragraph develops that model. Customer grouping does not also mean date ordering, and maintaining an additional arrangement costs storage and work when orders change. These are consequences of the explanation, rather than a list of future topics.

**Questions in reading order:** How does the database find the first matching entry? That remains open, but the reader can already explain why it can then read a group of matches without inspecting unrelated orders. How does adding the date arrange entries within that group? The text promises a capability without showing that detail. Both are useful questions for the next section; neither prevents understanding the mechanism already supplied. I supplied tree-search details from expertise and have not counted them as taught.

**Writing judgement:** The movement from definition to example to consequences is natural. “Even when those orders are scattered through the table” earns its place: it makes clear why the separate arrangement matters. The opening is compact without becoming an itinerary.

**Repair:** No substantial opening repair needed. If the next section immediately asks readers to reason about a combined index, clarify that the date orders entries within each customer's group before that exercise. The opening alone does not establish column-order rules.

## Sample B

**Teaching judgement: repair required for this audience.** The first paragraph establishes a recognisable request and the gap between expressing it in SQL and executing it. At “makes them easier to find,” however, the reader has only a general claim about an extra structure. Nothing yet explains how selected values are arranged, how an entry leads to an order, or why this avoids checking the whole table. “We'll start with an index” announces the lesson without supplying that missing connection.

**Questions in reading order:** What makes the stored values easier to find? Unresolved. How does finding a customer ID retrieve that customer's orders? Unresolved. Why will adding columns let PostgreSQL read in the desired order? Also unresolved. Those answers require index knowledge the stated audience does not have. “B-tree” and “row versions” introduce further questions without helping answer the earlier ones.

**Writing judgement:** The shop and ten-order request give the explanation a useful purpose. “The database still has to find the records” is an effective transition. The latter half loses momentum through two successive “We'll” announcements and an ending about database differences whose relevance has not been established.

**Repair:** Preserve the history-screen example and maintenance cost. Before announcing the combined index, show customer-ID entries grouped together, with references leading to the corresponding orders. Then explain what date ordering within that group would add. Also repair the proposed scan: “discard the old ones” leaves unstated how the database identifies the newest ten; describe collecting matching orders, ordering them by date, and taking ten. Introduce the PostgreSQL version and B-tree name where their details become useful, and defer row visibility until the explanation needs it.

## Comparison

A better prepares this audience to follow an index example because it teaches a concrete relationship between index entries and table rows. B provides the stronger specific task, but much of its index explanation remains a promise. A useful revision of B would retain that task and supply the missing arrangement and lookup mechanism; it need not adopt A's sentence order or remove the scenario. Neither opening alone supports practical index design, and neither needs to teach the entire subject before the first section.
