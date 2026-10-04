# Reader review of the relational introduction

Reviewed 4 October 2026. I read the article from top to bottom, its imported table and relationship figure, and its reader-facing navigation and collection labels. I inspected the artwork and component markup, not a rendered browser page. I used no external sources to supply answers.

There is a limit to this pass's independence. The required house-style skill directed me to `docs/writing-style.md`, which includes a section describing earlier revisions of this article. I encountered that material while loading the required writing guidance. I did not read the article's commission, previous review files, or research notes. The collection data also includes non-displayed scope fields alongside its navigation labels. This report should therefore be treated as an independent reader response with disclosed exposure, rather than a perfectly blind test.

## What I learned

I came away with a connected explanation of why tables are useful. A table gives records a consistent shape. Stable IDs let an order refer to a customer or product without making another copy of all their details. A join can use those IDs to assemble an answer, and an index can reduce the work of finding the relevant records. Constraints reject some invalid records, while a transaction makes a chosen group of changes succeed or fail together. Overlapping purchases need additional care because two individually sensible decisions can conflict.

The useful distinction running through the page is between what the application means and what the database can enforce. The database cannot decide that I should preserve an old purchase price, infer a missing operation in a transaction, or repair a stock decision made from an earlier value. I understood those limits without needing another article.

The product table is immediately legible. The relationship figure then supplies the same mug, a customer, and an order. The query's concrete answer, “Blue mug, 2,” is the point at which the references become useful rather than merely tidy organisation.

## Transfer questions

**Why retain the purchase price if the product price changes?** The current product price and the amount paid for an earlier purchase describe different facts. If an old order only found its price through the current product record, changing the catalogue price would lose the information about what that customer paid. The purchase should retain that historical amount separately. The prose gives me this answer, although the example records do not show where that amount lives.

**When might an index cost more than it helps?** Every new order requires both the table and its indexes to change, and the indexes take additional storage. If my application rarely asks for orders by customer, an index organised by customer can impose that work while offering little benefit. A report for yesterday's orders may need a different route. The page also says a direct table read can be cheaper; it does not yet teach me how to estimate the point where that becomes true, which seems reasonable for an introduction.

**Why doesn't a transaction alone necessarily prevent two buyers taking the last item?** Grouping each purchase's changes together does not itself stop both buyers from first seeing one item and deciding to buy it. The stock check must participate in the coordination. In the given locking example, buyer two waits before checking; after buyer one commits, buyer two sees zero and declines. Waiting only at the eventual write would leave buyer two's earlier decision unresolved. The page also makes clear that the precise protection depends on the transaction's isolation behaviour and engine.

## Where I hesitated

The historical-price paragraph is clear, but it arrives just after a figure that contains no price paid. I can explain the principle, yet I cannot point to the purchase-price field in the example. A small order-line field would make the distinction easier to retain.

I understand that an order line names a product and quantity within an order. With only one order line drawn, however, the reason for a separate order-lines table remains slightly abstract. An order containing both the mug and bowl would make the separate rows earn their place. This is an opportunity to improve the illustration, not a gap that prevents following the argument.

“Many engines keep multiple versions of records so a report can use a defined view” is the least concrete explanation. I do not know what makes the view defined, when it is chosen, or whether it changes while the report runs. The following sentence successfully separates that issue from reserving stock, but the first sentence asks me to accept a new mechanism without seeing it. A brief snapshot example would help if this concept stays here; a full treatment belongs in the linked article.

The lost-connection case is understandable, but arrives quickly after locks, row versions, isolation levels, and rejected transactions. It changes the question from competing buyers to uncertainty about a completed operation. I would retain the point while giving it a little more space or a concrete sentence about retrying the purchase.

## Pace and navigation

The sequence through constraints and transactions follows naturally: first connect the records, then find them, then protect their meaning, then group the changes that form a purchase. I did not feel that these were unrelated glossary entries.

The visual rhythm becomes less helpful after the relationship figure. Queries, indexes, constraints, transactions, and concurrency all rely on prose. The index section is short enough to carry this. Concurrent access is where several new concepts accumulate and I most wanted a visual pause.

The final section begins with a useful application choice, then moves through performance pressure, product names, deployment, extra capabilities, and operating responsibilities. I read its later paragraphs as a preview of the collection rather than continued explanation. That is appropriate to an overview, but it is the part I am most likely to skim.

“Planned reading” and the collection's statement that links open outlines are clear about what is available. The two links under “Where to go next” provide actual next reading and distinguish the checkout draft from the column-store explanation. Repeated planned-reading lines interrupt the main argument a little, but they also make the breadth navigable. I would keep the available next steps prominent.

## The visual I would add first

A small, static two-buyer timeline would help most. Show both buyers checking one item before either changes it; beside that, show buyer one locking and checking, buyer two waiting, buyer one committing, and buyer two checking zero. Place the lock before the check visibly. This would let the reader inspect the exact ordering on which the prose depends. It does not need a simulation to make that point.

An index illustration would be useful next: a short orders table and a separate customer-ID lookup with C4 pointing to two order rows. It would also make the difference between the customer's own ID and an index of orders by customer tangible. I would prioritise the concurrency timeline because it resolves a harder distinction.

The introduction taught me enough to answer all three transfer questions. The remaining work is chiefly to give its later explanations something concrete to look at, and to ease the rapid changes of subject within concurrent access.
