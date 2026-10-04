# Teaching and media review

Independent review, 4 October 2026. I read the complete introduction, its two
teaching components, its reading components, the shared figure styles, the house
writing and illustration guidance, and the collection boundaries. I inspected
the light and dark sketch assets. I was given the page and a teaching/media role;
I did not read earlier review findings. This is a source and asset review, not a
browser acceptance check or an independent verification of database claims.

The introduction has a useful argument: tables give information a shape,
references avoid unnecessary copies, queries reconnect the facts, indexes change
the work, and rules and transactions govern changes. The stock example explains
why grouping changes alone cannot settle concurrent decisions. It now has enough
substance to support an introduction. Expanding every section into a practical
tutorial would obscure that job.

The remaining opportunity is to let readers inspect a few operations that the
prose currently asks them to imagine. I recommend a small SQL example and an
index drawing. A concurrency trace would also help, but it is a lower priority;
the linked checkout article already offers the deeper interactive treatment.

## Recommended changes

### Show the SQL request and the answer together

**Location:** `src/pages/learn/databases/relational.astro`, Queries and joins,
lines 43–45. **Severity:** substantive teaching improvement, not a correctness
failure.

The text explains the P7 match and gives “Blue mug, 2,” so a reader can understand
the join without a figure. But SQL remains a name for an unseen language. The
claim that it describes an answer rather than a search procedure becomes much
easier to understand when the request is visible.

Place a short actual SQL query next to a semantic result table after the prose
has explained the match. Use explicit table names so aliases do not introduce a
second decoding task:

```sql
SELECT products.name, order_lines.quantity
FROM order_lines
JOIN products
  ON products.product_id = order_lines.product_id
WHERE order_lines.order_id = 'O12';
```

The answer has columns `name` and `quantity`, with one row, `Blue mug` and `2`.
Give the example its own setup: this is the one illustrated line of O12, and the
SQL uses `product_id` and `order_id` as column names. Explain the three jobs in
one short paragraph or caption: choose the output fields, match product IDs,
and keep the lines for O12. Do not present execution order as the written order
of these clauses or imply that this is the only physical way to run the join.

Use the site's ruled SQL treatment and a plain result table. It should not be
framed as an experiment or labelled as a diagram. Keep the explanation in the
article; a reader skipping the code should still get the P7 reasoning.

### Give the index a visible extra structure

**Location:** Indexes, lines 51–53. **Severity:** substantive teaching
improvement; the present prose is accurate at its stated level.

“Organises those IDs with a way to locate the corresponding order records” asks
the newcomer to construct a data structure mentally. The earlier relationship
drawing also uses arrows between IDs and records. Without a concrete contrast,
the index can remain hard to distinguish from the customer reference itself.

Draw a small orders table containing, for example, O12/C4, O13/C8, O14/C4,
O15/C2 and O16/C9. Beside it, draw an explicitly labelled “Index on customer ID”
with C4 leading to O12 and O14. Show the rest of the index entries too, or mark
that only the C4 entry is expanded. This is an additional structure owned by the
orders table, not a route through the customers table. Highlight the same two
answer rows while making the other orders available to inspect.

A compact comparison can then show “Check every order” and “Use the customer
index.” Preserve the answer in both. A short annotation should say that looking
through the index also takes work: skipping nonmatching order records is the
point, not zero-cost access. Do not give invented timings, disk-page counts,
speedup ratios, or a universal pointer layout. Label it as a schematic lookup;
the physical locator depends on the engine.

This should be a static, code-native drawing with warm paper, thin graphite
rules, and muted teal row marks. Exact rows, labels and connections matter more
than rendered depth. No switch is needed to compare two small routes. An
interaction becomes worthwhile only if the lesson expands to vary how many rows
match, which belongs comfortably in the focused indexing article.

### Make an order with several lines explicit in one sentence

**Location:** Relationships between tables, line 34, beside `SketchRelational`.
**Severity:** minor comprehension improvement.

The sketch intentionally shows one record per table. The text says that an order
line records a product and quantity, but never makes the consequence of buying
two different products concrete. Add a sentence along the lines of: “If the
order contains a mug and a bowl, it has two order-line rows, both referring to
the same order.” This explains why the extra table exists without expanding the
four-record artwork or introducing cardinality notation.

The current sketch can remain. Its caption is honest about the sample, the
arrows point from stored references to the records they identify, and both
artwork variants preserve the composition. The query paragraph's phrase “For
the order O12 in the illustration” could become “For order O12” so its meaning
is less dependent on having viewed the plate.

## A useful optional addition

**Location:** Concurrent access, lines 76–78. **Severity:** optional visual aid,
with a clear teaching purpose.

This is the passage with the highest burden on working memory: two requests,
two reads, a lock, a commit, and a changed decision. A static pair of event
traces could show the difference between reading before the protected operation
and checking while holding the lock.

In the unprotected trace, A reads 1, B reads 1, A accepts, and B accepts. In the
protected trace, A locks and reads 1; B waits before reading; A changes stock to
0 and commits; B obtains the updated row, reads 0, and declines. Keep time
explicit and avoid showing a stale B read before the wait in the protected
trace. Caption this as the PostgreSQL behaviour already scoped in the prose,
not a universal promise at every isolation level. Distinguish an application's
acceptance decision from a database acknowledgement if either is labelled.

Do not add this merely to distribute pictures evenly. The prose already explains
the important consequence. If used, the trace should earn its space by keeping
the check and the wait visibly ordered. A replay button alone adds little; the
existing checkout article is the better place to vary requests and execution.

## Keep the remaining scope restrained

- The opening explains what the system is and why applications need it. Another
  opening illustration would repeat the products table or relationship sketch.
- The table example makes rows and columns concrete and distinguishes the
  logical table from disk layout. It does not need a generated replacement.
- The current-price versus purchase-price paragraph supplies a valuable boundary
  to the advice about avoiding copies. It needs no historical-price diagram at
  this introductory depth.
- Constraints already have a concrete missing-product failure and explain what
  the declared rules do not guarantee. A DDL example would require extra syntax
  without resolving a missing part of the present argument.
- Transactions already trace the unfinished order and explain what rollback
  removes. A transaction illustration is less useful than the concurrency trace.
  Do not add recovery internals or every ACID term to make this look complete.
- The paragraph about record versions gives the reader an orientation, not an
  MVCC model. A versions diagram would require a particular visibility rule and
  substantially expand the scope. Leave that mechanism to the planned reading.
- The choice section connects costs to mechanisms introduced earlier. Product
  logos, a feature matrix, or an architecture cutaway would distract from those
  conditions. No extra media is needed there.

## Checks for the assembled revision

The HTML labels are essential to the relational artwork; the unlabelled images
are not the finished figure. Inspect those labels at phone width in both themes.
The minimum label size is 10px in the current source, which makes small-screen
legibility worth checking rather than assuming. This review did not establish a
rendered failure. Keep meaningful edges and arrows intact despite the artwork's
negative top margin and clipping wrapper.

For any additions, verify the page at rest, at narrow width, and with keyboard
focus. Static rows and annotations should not resemble controls. SQL should wrap
or scroll without forcing the page wider, and a result table should preserve
column headers. A two-route index drawing must remain understandable when its
panels stack. Check the real combined page in light and dark mode, not just the
new component in isolation. None of these observations imply publication
approval.
