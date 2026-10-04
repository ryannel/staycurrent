# Blind reader review

## Figure, before reading the article

The figure shows Country and Total, each with eight values occupying eight cells, leading toward a single disk page with eight cells. My first reading is that the two fields somehow share one disk page. I cannot explain how sixteen cells fit in an eight-cell page. Perhaps the figure means one page per field, but it draws only one page.

The Country connector ends above the page and has no arrowhead; the Total connector has an arrowhead. This could mean only Total enters the page, though the similar layout suggests both fields belong to the same operation. The figure alone does not establish whether it depicts storage, a read, or a calculation.

## Reading the rendered article

I read the page at http://127.0.0.1:4325/ in the browser, including the figure caption and the experiment. I did not read article source, a brief, evidence files, author notes, or another review. I read the short house-style skill for the review's wording; I did not follow its links to article examples, which could compromise this blind reading.

I learned the intended distinction: the table still contains eight orders and four fields, but storing each field together could let a country sales report read country and total without fetching customer and delivery instructions. Changing storage should not change which orders contribute to the report. This is a useful idea, and the fixed record count makes that part easy to follow.

The explanation fails when it counts pages. Eight country cells plus eight total cells make sixteen cells. At eight cells per page, the stated model needs two pages for those fields. That would halve page reads relative to four row pages. The prose and figure instead claim one page and a 75% saving. I cannot reconcile that with the model's explicit assumptions. The figure's caption confirms that both connectors concern reads, but does not resolve the capacity problem.

The article also does not explain why a read must fetch a whole page rather than just the wanted cells within it. For a reader who knows tables but not storage, this is the missing step between putting fields together and reducing reads. It says how the column layout groups data, but does not show what shares a row page. A small drawing of both actual page arrangements would let me follow the count rather than take it on trust.

The index paragraph introduces a separate concept without connecting it to this report. It claims every query gets faster and inserts require no extra work, but gives no mechanism or limits. Nothing else in the article or experiment supports those universal claims. As a blind reader I would leave with an unexplained promise, not an understanding of when an index helps or what must happen when records change.

## Prediction if the report needs all four fields

Based on the stated cell model, all four fields across all eight orders occupy 32 cells and require four eight-cell pages in either layout. Column storage would lose its page-read saving for that report. This is my prediction from the model, not an observed experiment outcome: the interface does not let me change the report's fields. The erroneous two-fields example makes it harder to know whether that prediction agrees with the author's intended model.

## The experiment considered on its own

The component states its own scenario: eight orders, four fields per order, eight cells per page, and a report requiring country and total. Its question is whether changing storage layout changes pages read for the same report. It exposes two layout choices; it does not offer controls for selected fields, order count, page capacity, or compression. The result is a count of pages read, with an explicit caveat that this is illustrative and excludes compression, indexes, and cached pages. It supplies no timing result.

I operated both controls in the browser and observed:

| Action | Selected appearance and accessibility state | Displayed result |
| --- | --- | --- |
| Initial page | Store as rows dark; rows checked, columns unchecked | Rows: 4 pages read. |
| Click Store as columns | Store as columns dark; columns checked, rows unchecked | Columns: 4 pages read. |
| Click Store as rows | Store as rows dark; rows checked, columns unchecked | Rows: 4 pages read. |

The layout label and selected appearance change, but the number remains four. The component therefore shows equal page counts, contradicting the article's one-page claim and failing to demonstrate the two-page result implied by the component's own assumptions. The closing sentence that this proves the result above is directly contradicted by the observed output.

Both controls look operable: they have borders and a clear selected colour. Their appearance suggests a mutually exclusive pair, and selecting the other option did deselect the first. The accessibility tree calls each a checkbox, which usually suggests independent choices; this is confusing for a two-way exclusive layout setting. I did not test clicking an already-selected option, so I cannot say whether both can be deselected. A role-based browser lookup for the column checkbox did not resolve; clicking the actual accessibility target worked. I do not count that automation lookup failure as evidence that a human cannot operate the control.

The component contains no depiction of which cells or pages were read. Even if its number were corrected, it would show a result without making the mechanism inspectable. Here the unchanged number makes that absence especially consequential: I cannot tell what the model thinks changed.

## Reader outcome

I can explain the intended reason to group values by field, and predict that selecting every field removes this particular page-count advantage. I cannot trust the article's numerical demonstration. The first repairs needed are to make the stated assumptions, figure, prose, and actual control results agree, and to explain the page as the unit of reading. The index claim needs a supported explanation with limits or removal from this short lesson. These are failures of the teaching example, not minor wording preferences.
