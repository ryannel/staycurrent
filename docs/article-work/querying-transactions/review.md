# Querying and transactions: integrated review

4 October 2026. All six articles are available as working drafts. This record
describes the reviewed explanation and its limits; it does not authorise publication.

## Structure and learning

The planning review retained two query articles and four transaction articles.
The sequence follows result meaning, reading results in pieces, atomic changes,
overlapping updates, isolation, and recovery. Index design and query plans remain
in their own collection destinations. The pages use the existing shop, with fresh
practice databases explicitly required where examples change its state.

Authors worked in three pairs. Independent technical, fresh-reader/editorial, and
isolated-media reviewers then assessed the assembled set. The fresh reader received
the pages without the commission's intended answers. The media reviewer interpreted
the aids without their surrounding article prose. These readings complement the
rendered checks below; they do not reproduce a novice's experience.

Consequential findings and repairs:

- SQL correctness did not establish code accessibility. Added explanations of
  INSERT's column/value correspondence, export transaction commands, boolean
  predicates and IN where the reader first needs them.
- The isolated query drawing needed the product names, quantities and prices
  required to derive its three answers. Those are now shown in the source records.
- The export comparison needed a deterministic ID tie-breaker and a caption
  distinguishing fresh page requests from reads within one retained snapshot.
- The concurrent-decision sketch needed its one-mug starting situation locally.
- The isolation experiment's original bracket could place the writer inside the
  report transaction. Its timeline now names two separate transactions and labels
  report statements and writer work explicitly.
- A common control-row lock is not a universal repair for write skew. The proposed
  protocol now specifies Read Committed, acquiring the common lock before a later
  statement reads the flags, and explains why it would not refresh Repeatable Read.
  The independent technical reviewer checked this repair.
- Retrying an operation requires its identity to survive incoming request retries
  and process restarts. The final article now makes that lifetime explicit and
  separates known rollback from an unknown commit outcome.

No unresolved material issue was reported in the final technical and reader
reviews. The articles and aids remain revisable after human reading.

## Execution and browser evidence

The three verification scripts extract the SQL displayed in the article source.
Authors executed it using PostgreSQL 18.3 through PGlite 0.5.8. The query suite
records 26 results, the boundary/concurrent suite checks seven branches, and the
isolation/retry suite records 21 checks. An independent technical reviewer also
executed the retry claim, duplicate recovery and insufficient-stock branches.
The individual evidence files give sources, assertions and observed outputs.

These are single-session SQL checks. They do not execute simultaneous clients,
deadlock detection, network failures or payment calls. Overlapping schedules are
reasoned from the linked PostgreSQL 18 documentation and presented as models.

Root exercised all four pagination changes and compared both result lists; all
three concurrent-update methods with commit and rollback; and both isolation
levels through each event. Keyboard stepping, restarting and reset worked. The
isolation model returned 20 then 22 at Read Committed and 20 twice at Repeatable
Read. No browser console errors were observed during the final check.

Rendered inspection covered the house sketches and interactive controls in light
and dark, desktop and phone layouts. All six pages fit a 320px viewport in both
themes without document or figure overflow; SQL regions retain their own scrolling.
Phone inspection included the query diagram and all three interactive aids.
Theme proofs used temporary copies of the built pages with CSS theme predicates
forced for inspection, without changing the user's theme preference.

The final build generated 54 pages and the feed successfully. All 80 local links
in the six articles resolved, including their fragment destinations and downloads.
Collection navigation identifies these six pages as working drafts, preserves the
planned status of unwritten groups, and links the four transaction articles in order.

One rendered proof is saved at `screenshots/query-join-dark.png`.

## Follow-up: the openings still assumed too much

The user subsequently found that the articles jumped into their subjects despite
the earlier reviews. Pagination supplied a specific failure: ordering appeared as
the first task without explaining why reading a result in pieces requires a
sequence. The prior review outcome did not establish that the introductions worked.

Revised all six openings to develop the need for their subject before applying
the mechanism. Pagination now connects manageable pieces to before/after, an
explicit SQL order, and resolving ties. Moved the query illustration after its
records are introduced. Isolation now motivates retaining versions before naming
snapshots and introduces the price-change schedule locally. Transaction and retry
introductions establish incomplete operations and uncertain replies before the
shop walkthrough. SQL literals and interactive behaviour are unchanged.

A fresh independent reader reviewed the causal sequence across the revised pages
and reported no consequential omission. This is evidence of another reading, not
a substitute for the user's judgement of the revision.

## Sequential question-log review

At the user's suggestion, three new independent readers followed all six built
articles in pairs, one section at a time. They recorded questions before receiving
the next section, then appended later resolutions. Inputs included rendered text,
code and the teaching aids' own labels, without author history or intended answers.
The original logs are in `reader-questions/`. This was a comprehension pass; plain
text did not establish rendered media clarity or interactive behaviour.

The findings resulted in these local repairs:

- Show the order times before asking the reader to predict the time-filter result.
- Use singular “join” in the multiplication drawing, matching the displayed SQL.
- Explain what the client does with an opaque token, and announce the export's
  change to all customers and ascending order before its SQL.
- Explain what the stock row lock does where transaction boundaries first uses it
  as a reason to avoid waiting for payment. Replace vague “protected information”
  advice with the concrete distinction between request validation and availability.
- Motivate locking reads with an application deciding a permitted partial purchase,
  while acknowledging that the same decision could also be expressed in SQL.
- State the result of the specific Repeatable Read changed-row schedule, and make
  the hypothetical serial order explicitly non-overlapping.
- Distinguish a local deadline and cancellation dispatch from confirmed database
  cancellation, then explain rollback, broken connections and uncertain commit.

The last two technical repairs were checked against PostgreSQL 18's
[Repeatable Read rules](https://www.postgresql.org/docs/18/transaction-iso.html#XACT-REPEATABLE-READ)
and [query cancellation](https://www.postgresql.org/docs/18/libpq-cancel.html).
The supplied shop SQL confirms the newly stated times. SQL literals and interactive
models were unchanged. Each original reader checked the repaired passages as an
informed reviewer and reported its questions resolved without new issues.

Other questions remained appropriately deferred: own writes are explained when the
isolation article turns from reports to writes; recovery while an earlier claim
is still finishing is answered by the later uniqueness protocol. Those findings
did not justify adding background to the openings.

The authoring and review skills now commission this sequential reading and route
to a context-free first-reading reference. The protocol keeps the actual examples
for coordinators. This replaces a vague fresh-reader verdict with inspectable
observations; it is not a claim that expert agents can simulate every newcomer.

After these repairs, `pnpm build` passed with 54 pages. The changed authoring and
review skills passed the skill validator in both locations; their mirrored files
match and local reference links resolve. A browser check confirmed the new locking-read
motivation above its SQL, saved as `screenshots/locking-read-motivation.png`.

## Reading effort and further-learning review — 4 October 2026

Three fresh readers ran the expanded sequential-reading guidance across all six
articles. Their findings and original logs are preserved in
[reading-opportunities/review.md](reading-opportunities/review.md). The strongest
opportunities concern comparing exact join results, placing pagination support
where the mental work begins, and tracing checkout identity through uncertain
recovery. Browser spot checks distinguished presentation opportunities from a
text-extraction artefact in the concurrency model. This pass changed review
documents only; article revisions remain recommendations.

The user subsequently authorised those revisions. Implementation and independent
review outcomes are recorded in the linked report's **Implemented follow-up**.
The article repairs, refreshed SQL downloads and 27 verified query outcomes are
complete; the final build passed with 54 pages. Light/dark and phone/desktop
inspection covered the new aids, and all four pagination interaction cases were
checked. These remain working drafts.
