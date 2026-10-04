# Designing your data: review and handoff

4 October 2026. Status: **ready as working drafts**. The three articles are linked
from the relational collection and marked as drafts, with noindex metadata. This
work did not publish an update or change the feed.

## The sequence

`modelling` combines schema modelling and normalisation into one explanation:
identify facts and relationships, follow changes, then separate shared facts from
purchase history. `constraints` turns that design into enforceable rules and
shows their limits. `tables-and-documents` asks where varying product details
belong, following the consequences through queries, validation, indexes, concurrent
writes and migration. The old normalisation route redirects to the relevant
section of modelling.

One writer developed the sequence in order. Media and SQL research proceeded
alongside it using the shared example. Independent technical, fresh-reader and
editorial reviews followed. The editor reviewed all three completed articles and
rechecked the final prose repairs.

## Independent readings

The technical findings and execution boundary are in `review-technical.md`, with
primary-source research in `evidence.md`. Repairs addressed a misleading 1NF
example, PostgreSQL numeric NaN, and the difference between accepting a JSON
number and successfully casting its extracted text to an integer. The final
timeline calls a SKU a catalogue-product identifier.

The fresh reviewer first saw all six aids without the surrounding articles or
author intent. They identified the schema references, copied versus shared names,
historical prices, CHECK/NOT NULL distinction, unique-insert waiting sequence,
JSON extraction distinctions, and row boundaries correctly. They exercised all
three labs before reading the assembled sequence. No substantive comprehension
repair was requested. Their isolated schema wrapper clipped at the left; they
verified that the assembled article showed the entire diagram. This was a review
fixture issue, not a shipped-page defect.

The editor found two connections worth tightening, recorded in `review-editor.md`:
explain how JSON relates to the earlier normalisation discussion, and preserve
the distinction between an agreed price and evidence of payment. Both were
repaired and rechecked. The editor found no structural or depth blocker and
recommended preserving the developed causal explanations.

## Implementation and browser checks

- Final `pnpm build` passed: 54 pages, including the feed and redirect.
- The SQL evidence contains 48 asserted cases, plus 34 statements extracted from
  the article sources and four focused JSON probes. The source runner passed
  again after the final editorial repairs and recorded fresh source hashes.
- All 39 local links in the three built articles resolve, including their section
  anchors. The collection disclosure and first article link were exercised in
  the browser. The shared SQL download is exposed in the article.
- The copied-name lab was exercised through both corrections, the shared-record
  arrangement, reset, and the catalogue-price change. The historical total stays
  EUR 36. The CHECK lab's four values were checked both with and without NOT NULL.
  All five JSON representations were exercised and their visible outputs checked.
- Built-page fixtures exercised both light and dark CSS at a 320px viewport for
  every article; none produced document-wide horizontal overflow. Further 390px
  views and desktop screenshots checked the media. Desktop schema references,
  concurrent-write sequence and three row arrangements were inspected visually.
- Script-free fixtures retained initial results and explanatory fallbacks while
  hiding inactive controls. These fixtures strip scripts and expose noscript
  content; they are a fallback render check, not a screen-reader audit.
- The browser pass found nested SQL scrolling: the labelled region could receive
  focus while its child owned the overflow. The child now allows overflow into
  the labelled region. A keyboard ArrowRight moved that region from scrollLeft
  0 to 40 at 320px, and the repaired build passed.

Screenshots are in `screenshots/`. The temporary fixture server was used only for
review; the site's normal development server remains the reading destination.

## Limits

SQL was executed in PGlite 0.5.8, reporting PostgreSQL 18.3, with one connection.
The concurrent insert schedule is supported by PostgreSQL documentation; no
multi-session execution or performance benchmark is claimed. Browser inspection
covered keyboard controls, rendered outputs and responsive layouts, but is not a
complete assistive-technology audit. Review establishes readiness for a draft,
not a guarantee or permission to publish.

## Companion revision after the schema-design rewrite

The user asked to carry the modelling article's lessons into Constraints and
Tables and JSON. Both now introduce their subjects before developing the shop
examples. Constraints explains why types alone are insufficient, how to choose
the scope of a rule, and the friction caused by either missing or inappropriate
constraints. The full runnable schema remains available in a disclosure, after
the reader has met the kinds of rule it declares.

Tables and JSON introduces objects, arrays, nesting and the distinction between
an object key and a primary key. It connects these choices to normalisation before
comparing columns, embedded values and related rows. Existing depth on nulls,
validation, indexing, updates and migration remains. SQL constants and the two
interactive models retain their previous behaviour.

Four new diagrams show shared enforcement, deletion effects, JSON nesting and
the row boundaries of competing updates. The existing capacity comparison and
unique-insert timeline now use the shared restrained-sketch components. A first
deletion draft merely put explanatory prose into sheets; it was replaced with
actual order, line and product records, showing which disappear and which remain.

Independent editorial review found the new introductions and progression clear.
Its consequential recommendation was to explain commit and rollback before the
concurrent-insert sequence; a short transaction definition now does that. A blind
reviewer read all six standalone figures in both themes and correctly described
their relationships. Their one visual finding was a connector that appeared to
include only two of three writers. The connector now follows the complete group,
and its label sits below the drawing. The final repair was inspected in-browser.

PostgreSQL 18's [JSON design guidance](https://www.postgresql.org/docs/18/datatype-json.html#JSON-DOC-DESIGN)
supports the whole-row locking explanation; the diagram explicitly limits the
benefit of separate rows to this conflict. The [uniqueness documentation](https://www.postgresql.org/docs/18/index-unique-checks.html)
supports the waiting sequence. Existing SQL examples passed all 38 source and
focused checks again; concurrency was not executed in multiple sessions.

The final build produced 54 pages. All 25 internal links in the two articles
resolved, with no duplicate IDs. All five JSON cases and all eight combinations
of quantity and NOT NULL were exercised through the live controls. Both articles
were inspected in light and dark at 320px without page-wide overflow, and the
desktop figures were inspected at 1280px. The final proofs are
`screenshots/constraints-sketch-light.png` and `screenshots/json-writes-sketch-dark.png`.
These remain working drafts for user review, not accepted benchmark articles.
