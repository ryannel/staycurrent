# Relational introduction review

Status: revised after operator feedback; see the continuity review below. Reviewed 4 October 2026. No publication, deployment, feed entry, or commit performed.

## Commission and correction

The first attempt made a worked order the organising structure. The operator rejected that approach: an introduction must first explain what a relational database is, how it represents information, why that representation is useful, and the problems its mechanisms address. The current page follows that revised commission. The abandoned draft and query aid are retained under `superseded/`; the earlier query execution check does not describe a current teaching aid.

The existing checkout essay is preserved at `/learn/databases/relational/checkout/`, with a link from the overview. It remains a deeper working draft and was not independently re-reviewed in this run. The field guide, reading index, and document article's checkout link now lead to the appropriate destination.

## Independent reviews

- Readers A, B, and C each interpreted the relationship sketch in isolation in light and dark, without its article or intended lesson. Their original reports are `aids-reader-*.md`. The retired query aid's findings are historical only.
- The same three readers independently interpreted the new products table before seeing the revised article or its purpose. See `table-reader-*.md`. All identified records, fields, and product identity; no material misunderstanding required an aid redesign.
- Reader A then reviewed the revised article as an editor, with the commission and original human writing references. See `editorial-review.md`. No material findings.
- Reader B checked the revised article against primary technical documentation. See `technical-review.md`. Its one material finding concerned SQLite key enforcement. The article now separates primary-key purpose from enforcement and gives the SQLite qualification. The reviewer rechecked the repair and marked the finding resolved. Row-storage and index wording were also refined.
- A separate fresh reader received only the rendered page and audience description. See `blind-review.md`. The reader reconstructed the introduction's concepts and correctly applied the distinction between current and historical prices to a changed case. No material comprehension failures.

The last edits were narrow technical qualifications, an engine definition, and table CSS. They did not change the narrative or visual meaning. No reviewer consensus is treated as publication approval.

## Implementation and presentation

`pnpm build` passed, producing 19 pages including the introduction and relocated checkout essay. Planning, authoring, and review skills passed the bundled skill validator in both `.agents` and `.claude`; their mirrored files match.

Browser checks covered the assembled page at 1280 pixels and both light/dark artwork. The new table has a semantic caption and scoped column/row headers; its scroll region accepts keyboard focus with a visible outline. An inherited block-table style was repaired so the columns use the available width.

For narrow-screen checks, the browser viewport override did not alter the observed viewport. It was reset, and the built page was instead loaded into a same-origin 390-pixel iframe. Both themes, the table, and the relationship sketch were visually inspected there. Body width and scroll width were both 390 pixels. Theme fixtures changed only media-query matching in copied build output; they did not change user or OS preferences. The sketch's labels remain small at phone width, but stay aligned, and the surrounding prose and caption explain the relationships independently.

No screen-reader session, physical-device test, or database benchmark was performed. The introduction contains no runnable SQL or interactive model requiring execution testing. Asset loading was confirmed after the lazy-loaded illustration entered view. `review-opening.png` records the final opening.

## Reusable learning

The planning skill now covers a complete collection tree, independent review of the tree from distinct perspectives, synthesis, and a bounded first commission. Planning, authoring, and review guidance also distinguish an overview that establishes the system from a focused lesson organised around an operation. This captures the operator's correction without prescribing one prose formula for every article.

## Final content hashes

- `src/pages/learn/databases/relational.astro`: `6ac6768392bbc9fc27db70e9dfc52bc47b2dabbda5ee3511b4c7d929af255143`
- `src/components/explainers/RelationalTableExample.astro`: `17611d917ea02f9aee46cf4091529b9cd75cc1f58dd687c7618fdcb4d1a673d0`
- `src/components/explainers/SketchRelational.astro`: `4214341eccc63fc8bdfdd42a69bb630f8e4101baf19fd9cd4f565d599d7e7d45`


## Continuity, depth, and linked article plan — 4 October 2026

The operator found the original approved heading style artificial, then found the
renamed sections isolated and superficial. The earlier agent acceptance above did
not establish the desired house voice. Its hashes and screenshot are historical.

Three independent reviews addressed continuity and depth: `flow-editor-review.md`,
`depth-boundaries-review.md`, and `fresh-flow-review.md`. The first two had the tree
and commission; the third saw only the article source after its preview attempt
failed. Main findings: a join needed an actual result, constraints needed a boundary
that motivated transactions, concurrency needed a resolved decision, and early
physical-storage and SQLite details interrupted the explanation. These were repaired
in prose. Index lookup and maintenance now use one question; fit develops its costs.
No illustration, runnable SQL example, or simulation was added or changed.

The editor and technical/boundary reviewer rechecked their findings. All material
findings were resolved, including the final distant-antecedent wording correction.
The technical reviewer opened PostgreSQL 18 primary sources for the changed claims.
A separate fresh reader reviewed the revised page and followed a planned query
article and the existing checkout draft. `connected-intro-fresh-review.md` records
its comprehension, transfer to changed prices and access patterns, and recognition
of planned versus available content. Optional local links to available deeper
reading remain possible polish; they are not prerequisites for understanding this
introduction. Final spacing alone was then reduced from 4rem to 2.5rem between
introductory sections and checked in the browser.

The user explicitly requested placeholders, superseding the previous default against
empty routes for this collection. All 35 leaves in eight groups now have navigable,
noindex outlines. A shared manifest owns title, scope, route, and group; the introduction
has contextual planned links and a full expandable map. Placeholders identify their
unwritten state and link back to the introduction, group, and neighbouring outlines.
No placeholder was marked as completed reading or added to the publication feed.
The checkout essay remains a separate available working draft, not evidence that
several planned articles are already complete.

Final `pnpm build` passed: 54 pages. Built-output inspection verified 37 relational
pages (introduction, checkout, 35 outlines), all noindex, with 553 local link/anchor
references resolving. Planning skill validation passed in both mirrored locations;
the updated files match. The skill records the explicit-placeholder exception and
the writing reference records the concrete continuity failure without a prose formula.

Browser checks: actual map open/close and keyboard expansion, visible keyboard focus,
following modelling and returning to its group, light/dark map views at desktop and
390px, and the shared placeholder layout at desktop and 390px. The revised query
passage and nearby reading links were inspected at desktop and narrow width. Narrow
views used same-origin iframe fixtures; theme checks used copied build media queries,
not user settings. Checked narrow documents had matching 390px client and scroll
widths. No screen-reader or physical-device session was performed. No database
execution is claimed for the prose examples. Earlier illustration reviews remain
applicable because those assets and captions are unchanged.

Current disposition: ready as a revised working draft, with the requested full plan
visible for discussion. Agent reviews are evidence of repair, not a claim that the
operator has approved the new prose. No commit, deployment, or publication occurred.

Final source hashes:

- `src/pages/learn/databases/relational.astro`: `27532fb4074df4c3033b598e68fe5a34dab02e2fa304419f5ea0620098d12af9`
- `src/lib/relational-collection.ts`: `88173ed3965a195cf39dbccca82d3eed894feb2c73ead380e29fa3935f2d56aa`
- `src/components/editorial/RelationalReadingMap.astro`: `7ffde1ce2c8086b7d60faa8885a60c91f3e4dd64b8c0e8943dbb8fd5fb180d2b`
- `src/components/editorial/RelationalFurtherReading.astro`: `b44e9a316e7bda0e0b9cbc942acece9256eeff1cfcb853a8ff99fe3526fb4d06`
- `src/pages/learn/databases/relational/[...article].astro`: `0bbd07b46d672e5ada601823dffde0d7b9debc3cdb51639378f91f478cf051af`


## Whole-page polish — 4 October 2026

Current disposition: **ready as a draft**. This supersedes earlier completion
snapshots above. The user requested independent review of writing, depth, visual
support and the complete reading experience. The introduction and collection
remain working drafts, with no publication or feed changes.

Separate initial roles reviewed editorial voice, teaching/media design, technical
accuracy and reader comprehension. The editor read the original Sam Who,
Ciechanowski and Evans references. Findings are in polish-editor.md,
polish-teaching.md, polish-technical.md and polish-blind.md. The initial reader
encountered author history through mandatory style guidance and disclosed it;
that pass is not counted as fully blind. Final comprehension is instead supplied
by polish-final-reader.md, whose reviewer first saw only isolated aids and then
the rendered article, without author rationale or earlier findings.

| Finding | Repair / disposition | Verification |
| --- | --- | --- |
| Opening repeated capabilities abstractly | Explain several uses of the same records without restarting a checkout walkthrough | Final editor and fresh reader |
| Index lookup named a route without explaining search | Describe a common ordered index, group C4 entries, show destinations | Technical sources and three fresh visual readings |
| First index picture's requested answer was already in the index | Request totals, stored only in the orders table; retain logical-locator qualification | Technical recheck and new independent D/E/F readings |
| SQL remained entirely verbal | Add a bounded query with setup, clause explanations and exact one-row result | Executed query in SQLite 3.53.1; technical review; three isolated interpretations |
| Lock ordering required too much mental tracing | Add two aligned buyer lanes and waiting span before buyer 2's check | Isolated readers identify the correct sequence; technical review |
| Versioned reads were abstract | Explain an old price during a read; distinguish PostgreSQL ordinary reads from locking reads | Technical PT4 repaired and rechecked |
| Caveats interrupted the argument | Move SQLite qualification beside enforcement; shorten constraint-to-transaction bridge; leave ambiguous retries to follow-up | Final editor and fresh comprehension |
| Later prose needed breathing room | Split the isolation paragraph; keep workload costs beside adding another system | Final rendered reading |
| Small labels / dark SQL emphasis | Increase intro relationship labels to 12px on phones; fix local syntax colours and single keyboard scroll focus | Browser checks in both themes |

The new aids are RelationalJoinExample, RelationalIndexLookup and
RelationalLockTimeline. There is no new interactive model: this introduction needs
inspectable syntax, relationships and sequence. The existing checkout draft remains
the place to experiment with competing updates. The text gives the explanations
before the aids and remains intelligible without operating anything. The reader
correctly transferred the argument to historical prices, excess indexing and two
atomic but conflicting stock decisions.

Initial isolated readings A/B accidentally received author history through a failed
style-reference boundary. They supplied useful observations but were excluded from
blind acceptance. C read the initial index drawing independently. After the index
repair, D/E/F each interpreted all three aids independently in both themes, without
article, external captions, intention or prior reviews. All identified the intended
results and read the figures as static. SQL colour differences were subsequently
fixed without changing meaning. The review and style skills now direct blind roles
to a separate context-free voice reference, avoiding the case-history leak. Both
skill validations passed; mirrored files match.

Final checks:

- `pnpm build`: 54 pages, success. An intermediate attempt to use Astro's special
  css-variables theme as a dual theme failed; it was replaced with scoped palette
  variables and the final build passed.
- Exact displayed SQL executed against a small in-memory SQLite fixture including
  unrelated product/order rows; result was Blue mug, 2. No PostgreSQL execution,
  concurrency test or performance measurement is claimed.
- Built relational routes: 37 pages and 562 local links/anchors, no missing targets.
- CUA inspected the actual main server and copied build fixtures in light/dark and
  at 390px through same-origin iframes. Diagram paths meet the intended rows;
  phone index tables stack with explicit destination IDs. The full relationship
  artwork loads in both themes and its enlarged phone labels fit their objects.
- SQL keyboard focus is visible; ArrowRight moves the code horizontally (40px
  observed) without widening the article. Checked phone document width and scroll
  width both 390px. Collection keyboard expansion and navigation to the query
  outline work. Figures have semantic tables or a chronological text equivalent;
  no physical-device or screen-reader session is claimed.
- Final fresh reader rechecked the refreshed built artwork and SQL in both themes.
  No material editorial, technical or comprehension issue remains in these reviews.

Agent review supports this draft; it does not establish operator approval or
editorial perfection. No commit, deployment or publication was performed.

Final source hashes for this pass:

- `src/pages/learn/databases/relational.astro`: `b867698d96b7eea86ab71a93790e9758d70c8eef4eb1e3391e8af448c9a55216`
- `src/components/explainers/RelationalJoinExample.astro`: `a8f87e698cfd391c044756bdbbfa78e326fb138b87272d8e8f28cadec821cb36`
- `src/components/explainers/RelationalIndexLookup.astro`: `0e70b8e299117b085ef379bb608a174de7cc4b3149f7ca84551549079e81cb36`
- `src/components/explainers/RelationalLockTimeline.astro`: `830253453c7dedcb82d295fff3e17cc94ef934bc3a068e4082187adaa2ab3314`


## Collection read-through, 5 October 2026

The [collection audit](../relational-read-through-2026-10-05/improvement-plan.md)
follows the introduction through all nine focused drafts and the supplemental
checkout. Its independent sequential reader found no core comprehension blocker.
The browser reading recommends aligning or identifying the index figure's separate
order sample and making the checkout essay's role explicit. These are proposed
continuity repairs; this pass did not revise the article or its aids.

## Implementation after the collection audit, 5 October 2026

The user authorised the improvement plan. This pass completes C4’s consistent O12/O13 index sample, optional checkout navigation, and a clearly identified independent checkout schema.
The [implementation record](../relational-read-through-2026-10-05/implementation.md)
links independent sequential/editorial readings, technical execution and browser
checks. Their material findings are resolved; the final build passes with 50 pages.
These are ready working drafts, with no publication or commit performed.
