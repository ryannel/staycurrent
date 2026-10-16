# Transaction article structure review

16 October 2026. The user identified a broader failure after the first heading
repair: the article moved into checkout scenes without clearly introducing their
role, and labels such as “Put the condition beside the change” and “Lock before
making a longer decision” concealed useful subjects. They requested a heading-tree
review and stressed that the whole article needed scrutiny.

## Structural repair

The original outline placed concepts, stages of one worked checkout, alternative
concurrency methods and recovery cases at the same H2 level. The contents list
suggested some groupings without expressing them in the article. It also omitted
commit/rollback and the concluding boundary review.

The article now exposes two main worked units: a checkout transaction and concurrent
purchases. Each has an introduction that establishes its purpose, caller and starting
state, followed by subordinate explanations. Established subjects such as conditional
updates, locking reads, snapshots and isolation, and deadlocks and retries now have
recognisable names. The multirow section separates individual reservations, a shared
condition and Serializable isolation. Its new introduction explains the comparison.
The payment section now contains the outbox paragraph that completes its workflow.

The main tree, extracted from rendered HTML with figure labels and closed optional
exercises distinguished, is:

```text
Transactions and concurrency
  Commit and rollback
  Choosing the transaction boundary
  A checkout transaction in practice
    The checkout handler
    Recording the purchase
    Rolling back a rejected purchase
  Concurrent purchases
    Reading and updating separately
    Conditional updates
    Locking reads
  Snapshots and isolation
  Coordinating changes across rows
    Reserving several order lines
    A condition shared by different rows
    Serializable isolation
  Deadlocks and retries
  Recovering an uncertain commit
  Payments outside the transaction
  Reviewing a transaction boundary
  Sources and further reading
```

The contents navigation includes every main heading and the checkout/concurrency
subsections. Existing fragment IDs remain at the corresponding subjects. Nested
figures use H4/H5 below H3 subsections. The experiment comparing all three stock
reservation methods is a sibling of those subsections, with an H3 title and H4
panels. Shared components preserve their existing default levels on other pages. Optional terminal instructions remain within
their disclosure. SQL, JavaScript examples and model state transitions are unchanged.

## Independent review

An informed structural reviewer independently identified the two hidden groups,
the contents mismatch and the risk of leaving embedded figure titles at H3 after
nesting the prose. Their assembled-revision check found the new grouping and bridges
coherent and all main headings represented in navigation. They suggested removing
“We’ll follow that handler,” now redundant after the parent introduction; it was
removed. We retained the short preview of competing buyers because the user had
specifically identified the unannounced change into subsequent cases.

A final bounded check confirmed that the figure titles describe their comparisons:
commit and rollback outcomes, ordinary and locking reads, stock reservation methods,
and concurrent changes to the featured display. The reviewer also checked that the
three-method experiment belongs under Concurrent purchases, alongside the methods
it compares.

A separate reader received only the main heading tree, without the body, user
feedback or earlier findings. They could locate the explanation of a rejected order
line under the checkout, the three stock-coordination alternatives under concurrent
purchases, and a lost commit reply under recovery. They identified snapshots as a
bridge whose role needed checking in the prose. This observation was returned before
they received the extracted section openings.

The subsequent opening-only pass found that those paragraphs explain the transition
from choosing the boundary to following application code, the driver/connection
context, the reset to three mugs before the rejected attempt, and the later reset
to one mug for competing handlers. The snapshot opening explicitly changes perspective
from writers to readers. The reader reported no remaining orientation issue in the
supplied openings, while correctly limiting that judgment to structure and prose
rather than claiming a full technical audit.

## Review-process repair

The style, authoring and review skills now connect local heading judgment to the
whole map. Before detailed reading, reviewers extract the actual tree, preserve levels
and distinguish component/optional headings from the main argument. They assess its
overview and usefulness for navigation, compare it with the contents list, then read
the transitions and sections against it. An inadequate map requires repair before
readiness even if the technical explanations are sound. The context-free reference
labels outline-first reading explicitly; it does not call exposure to the whole
outline an uncued encounter with each later heading. This supplies one coherent
structural check rather than a list of banned phrases or a universal article outline.

## Verification and scope

All three revised skills pass quick validation and their Claude mirrors match.
The site builds all 77 pages. Desktop/phone and light/dark checks found no page
width overflow, broken contents targets or browser exceptions. The full extracted
before/after heading trees are in `structure-browser.json`; screenshots are under
`structure-screenshots/`. Inspection included the checkout entrance, concurrency
entrance, nested figure and mobile contents.

The final DOM has no skipped heading levels. Checkout contains the handler,
recording and rejection sections; concurrency contains the unsafe read/write,
conditional update and locking-read sections. The experiment still advances after
selecting a method. The shared write-skew figure remains H3 on the isolation article.
These checks are in `structure-checks.json`. No new behavioural tests were warranted
for the unchanged database examples.

The workspace also contains an unrelated edit to the database field guide and
untracked Serena memories. They are outside this change and remain untouched.
The two independent readings support this bounded revision; they do not establish
that every heading elsewhere on the site has been reviewed or that the user has
endorsed the new wording.
