# Row-lock timeline

`src/components/explainers/RelationalLockTimeline.astro` supports the introduction’s stock-check example. Its question is why buyer 2 cannot make a purchase decision until buyer 1 finishes.

The two columns are transaction lanes. Reading downward, buyer 1 locks and checks the row, buyer 2 requests that same lock, and the continuous hatched waiting span lasts through buyer 1’s update and commit. Buyer 2 then acquires the lock, reads zero stock, and declines the purchase. The horizontal dashed boundary separates the commit from the later check. Arrowheads indicate sequence; spacing does not represent measured elapsed time.

The diagram assumes PostgreSQL’s default Read Committed behaviour and a locking read before the stock decision. It depicts one successful first transaction and one waiting second transaction, rather than the full range of failures or lock modes. Its caption states this scope.

Labels are HTML text at 13px or larger and retain two lanes on narrow screens. Graphite rules, a muted amber waiting span, and a teal acquisition label use the existing theme-aware paper tokens. There are no controls or button-shaped events. A chronological, screen-reader-accessible list supplies the full sequence without requiring table navigation; the duplicate visual table is hidden from assistive technology.

The component is standalone and has not been added to the article. Integration and rendered review at desktop and 390px, in both themes, remain with the coordinator. No shared styles or article prose were changed.
