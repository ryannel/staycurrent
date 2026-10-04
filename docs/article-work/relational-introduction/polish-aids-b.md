# Visual reading of the three aids

I inspected `aid-a-light.png`, `aid-a-dark.png`, `aid-b-light.png`, `aid-b-dark.png`, `aid-c-light.png`, and `aid-c-dark.png` at their supplied size. I did not inspect the article, source files, previous reviews, or external technical sources.

This review cannot count as fully blinded. After viewing all six images, I attempted to read only the opening reference section of `docs/writing-style.md`. The command used a curly apostrophe in its stopping condition, while the heading in the file uses a straight apostrophe. It therefore exposed the later author history. The observations below describe what is visible in the images, but a fresh reviewer should supply the independent acceptance evidence.

## Aid A

This is a complete SQL example answering what is in order O12. The introductory sentence supplies the two pieces of data: product P7 is called Blue mug, and order O12 has a line for two of them. I read the query as connecting the product and order-line records through their product IDs, keeping the requested order, and returning a name and quantity.

I expect one result row: `Blue mug | 2`. The displayed result agrees. The explanation below the code lets me connect `ON`, `WHERE`, and `SELECT` with the answer without guessing what the output should look like.

The relationship between the source records is described in prose rather than drawn. That is enough for this small example, though the image does not let me trace actual input-table cells. I do not read the code layout as a promise about the order in which an engine executes the query. There is no run button or other visible suggestion that the example is interactive.

The order identifier's initial O resembles zero at this size, especially inside the code. Repetition makes the intended identifier recoverable, so it does not prevent me following the example. SQL keywords stand apart by colour in the light image; they look much closer to ordinary code text in the dark image. The dark version remains readable, but loses some of that scanning help. The answer table is clear in both themes.

## Aid B

This shows two ways of organising information about orders: a customer-ID index at left and the orders table at right. C4 appears twice in the index, beside O12 and O14. Each of those entries has an arrow to the corresponding order row. The question, highlights, arrows, and written answer all agree: customer C4 has orders O12 and O14.

I read left to right: find C4, obtain the two order references, then follow them to the order rows. The index groups the C4 entries together, while the orders table separates those orders with another customer's order. This makes the purpose of the extra structure visible. The closing sentence also tells me that changing orders requires maintaining the index.

The exact way the database finds C4 inside the index is not depicted. Nor does the picture show a scan progressing through the orders table. I therefore read it as a picture of the index relationship and the resulting matches, rather than a measured demonstration of saved work. “Locate order” contains the same identifiers as “Order ID”; I can follow the lookup, but the image does not explain whether these values are literal stored addresses or a simplified way to identify the destination row.

The highlighted rows look selected in the explanatory sense. The “Illustration” label and absence of controls keep me from expecting to click them. Both themes preserve the arrows and the pair of matching rows. The dark highlights and arrows are particularly easy to follow; the light version is also clear. Neither version relies only on the highlight colour to communicate the match.

## Aid C

This shows two buyers competing for the last item, with time moving down two adjacent lanes. Buyer 1 acquires the row lock, checks that stock is 1, reserves the item by changing stock to 0, and commits. Buyer 2 starts while that transaction is running, requests the same lock, and waits without checking stock.

The hatched waiting interval ends at the horizontal line where Buyer 1's transaction ends. Buyer 2 then acquires the lock, checks stock and finds 0, declines the purchase, and releases the lock when its transaction ends. I expect one successful purchase, one declined purchase, and no stock left.

The downward arrows establish sequence within each lane. Alignment across the lanes makes their overlap understandable. I read the shared horizontal line as the point at which Buyer 1 releases the lock and Buyer 2 can continue. The hatch shows a duration of waiting rather than an additional action. “No stock check yet” removes the possible interpretation that Buyer 2 checked stock earlier and merely postponed writing.

The graphic provides no time scale, so the apparent lengths of the steps do not tell me how long they take. There is no cross-lane arrow for the lock release, but the aligned boundary and text make that relationship clear. The action headings are plain text, not buttons, and I see no false interactive affordance.

Both themes communicate the same sequence. The light theme makes the thin timelines and hatch somewhat quiet; they remain visible. In the dark theme, the waiting label and later acquisition label stand out more strongly. The words carry those meanings even without their colours. No labels appear cut off or collide in either screenshot.

## Overall reading

All three aids state a question or situation, show enough information to follow it, and make the result explicit. A gives a query and its returned row. B connects index entries to matching orders. C shows how waiting changes when the second stock check happens. Each is readable as a static explanation, and I see no control that appears operable but lacks an obvious action. The theme change preserves the information; the main visible difference is weaker SQL keyword distinction in A's dark version.
