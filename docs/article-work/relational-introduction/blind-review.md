# Blind comprehension review

Reviewed the rendered page at `http://127.0.0.1:4321/learn/databases/relational/` on 4 October 2026, through its text and screenshots. I read no article source, brief, evidence file, planning document, previous version, feedback, or other review. I did not follow the further-reading links. The audience assumed here is an intelligent engineer encountering relational databases for the first time.

**Verdict: the page works as an introduction for that audience.** It explains what the technology provides, why the parts belong together, and what decisions remain with the application developer. I found no material comprehension failure. It need not become a SQL tutorial or a concurrency reference to fulfil that purpose.

What I understand from the page

A relational database stores records in tables with named fields and a declared shape. Its value extends beyond storing a collection of records: applications can ask new questions across those records, share facts without repeatedly copying them, and place rules around changes made by several programs or users.

The products table establishes rows and columns before introducing a schema. The product ID then gives a stable way to identify a record even if its name changes. That makes the next section possible: an order can refer to a customer, and an order line can refer to both an order and a product. Separating those facts avoids having to correct the same customer information in every purchase. The distinction between a current catalogue price and the price paid prevents me from taking “avoid copying” as an absolute rule.

Queries reconnect these separated facts. A join matches IDs to bring, for example, product names into the answer about an order. The application describes the answer, while the database chooses the work that produces it. Indexes belong in that account because they give the planner ways to avoid searching unrelated records. They cost storage and maintenance, so their usefulness depends on the questions asked.

The later sections explain three different parts of changing data safely. Constraints reject values or references that break declared rules. Transactions keep a chosen group of changes together if something fails. Concurrency controls govern requests whose work overlaps. The last-mug example makes clear why a transaction being internally complete does not by itself make two simultaneous purchases sensible. Locks, record versions, and isolation choices are introduced as ways the engine coordinates this work, with consequences such as waiting or rejected work that needs retrying.

The closing section brings this back to choosing a technology. Related shared records, varied questions, and changes that need coordination make relational databases useful for orders, bookings, and similar applications. Selecting that approach still leaves product, workload, and operating choices.

Where outside knowledge would enter

I did not need outside database knowledge to connect the main ideas. The article supplies the meanings of row, column, primary key, join, constraint, transaction, and lock at the point where they matter. Familiarity with applications, memory, disk, and data types is reasonable for the stated audience.

I could not write SQL, select an isolation level, or implement a safe checkout from this page alone. Those are explicit next steps rather than gaps in its introduction. “Consistent view” remains a broad description: the page does not say precisely which version a reader sees. That limit is acceptable because it does not promise a particular engine's behaviour. Document-shaped values and vector retrieval also remain unexplained; they occur only in the closing discussion of overlapping categories and are not prerequisites for the argument.

A changed situation

Suppose the blue mug's current price changes from €20 to €23 after Ada buys two. Following the article's reasoning, changing the product record should change the current catalogue price. The purchase should keep the price actually paid as a separate historical fact. A later query that joins the order line only to the current product price would therefore be insufficient to recover what Ada paid. This prediction follows from the page's distinction between shared current facts and purchase history, without needing SQL syntax.

Supporting aids

Both aids appear where I first need them. The small products table makes rows, columns, identifiers, price, and stock visible together. Its caption prevents a mistaken inference that the drawing represents disk storage. The following illustration lets me trace C4, O12, and P7 through the four kinds of record. Its arrows and repeated IDs are legible, and the caption explains that each sheet stands for a table with only one record drawn.

The amount of media suits an overview. The later sections remain readable as prose because they reuse the same shop and purchase context. A tiny join result showing “Blue mug, quantity 2” could make the query section more concrete, but it would be optional polish. An index animation or concurrency simulation is not necessary on this page; the visible next-reading section offers a deeper interactive purchase example. Available reading and planned coverage are clearly distinguished.

No required repairs. Optional additions should preserve the article's introductory scope.
