# Reading effort and opportunities for better support

Review completed 4 October 2026, using the expanded sequential-reading skill.
This pass covers the six querying and transaction articles. It does not cover the
earlier design articles or the field guide. No article changes were made in this
pass.

Three fresh readers each followed two articles, receiving successive sections and
saving reactions before opening the next. They had the audience and context-free
reading guidance, without the authoring history or intended answers. Their logs
preserve both the first question and any later resolution:

- [Queries and pagination](query.md)
- [Transaction boundaries and concurrent updates](transaction.md)
- [Isolation and retries](isolation.md)

The readers used text extracted from the built pages, including SQL, results and
the aids' labels. They could not judge visual geometry or live controls from that
input. The coordinator subsequently inspected relevant rendered passages and the
pagination and concurrency models. These are expert reading observations, not
evidence that every novice will understand the articles. This was not a renewed
technical validation of the SQL or all concurrent schedules.

## What the reading revealed

The strongest findings concern the work needed to connect an explanation's parts.
The readers generally found the reasoning present, but sometimes had to retain
several values, compare results across paragraphs or reconstruct a sequence. Those
are useful reasons to improve support. They do not all call for more prose, another
interactive or a separate article.

### Queries and joins

At the two filtered left joins in **Missing matches**, the reader must remember
the dates of Ada's orders and Ben's supplied NULL while predicting the difference
between filtering in ON and filtering in WHERE. The queries are visible, but the
two outputs are left to the reader. Show those results, including a customer who
has orders but only before the cutoff. Exact result tables would serve this well.

The shipment multiplication aid makes the incorrect total inspectable. Its repair
is less visible: the reader has to retain the shapes of the two grouped results
and see why they now match once per order. Extend the existing aid to show those
two summaries and their combination. This would complete an explanation already
begun by the drawing.

A smaller opportunity is exposing product IDs on both source sides of the first
join. Preserve the opening's three different answers, O14's two counts and the
four line/shipment pairs; the readers found these helpful.

### Pagination and large results

The offset insertion and deletion passages ask the reader to picture the earlier
page, a changed sequence and the newly skipped positions. The later interactive
provides exactly that support. Consider introducing its offset view at the first
point of need and developing the comparison after keyset pagination is explained.
Moving the whole comparison earlier would introduce an untaught method; adding a
duplicate tool would create another problem.

The timestamp tie is explained, but both tied records fit on the first page. The
example therefore never makes the reader encounter an unread record with the same
time as the saved boundary. Split a tie across the page boundary, using a smaller
page or another tied record, to make the consequence of a time-only comparison
observable. This can be a revision to the existing example.

Keep the extra-row cursor explanation and the distinction between a stable order
and a fixed view of the data. Neither needs an additional diagram by default.

### Transaction boundaries

The article's central explanation and commit/rollback model worked well. Preserve
the distinction between an atomic transaction and detecting an omitted statement,
the zero-affected-rows example, and rollback versus compensating for a committed
purchase.

The payment discussion opens a larger question about a timeout or repeated reply.
A brief trace could clarify the immediate boundary; a full recovery workflow has a
separate teaching purpose. Do not turn this introduction to local transactions
into a payment integration guide.

Historical O12/EUR 18 reminders do little work here and in the concurrent-updates
opening. Consider shortening them so readers do not retain identifiers that have
no later payoff.

### Concurrent updates

The two-bin example requires remembering two initial values, two reads, two
different writes and their combined result. A small sequence table showing what
each request reads and changes would make the failure easier to inspect. A new
interactive is not necessary to achieve that.

One reader wondered why committed stock remains 1 while request A has a pending
value of 0. Live inspection found correct behaviour: the event and request labels
already identify pending work. A nearby sentence could make the relationship
more immediate, but this is a lower-priority clarity opportunity, not a bug.

The extracted text also exposed a completed fallback state alongside instructions
to advance the model. Browser inspection confirmed that the live model starts at
Step 0 and advances correctly. Do not turn that extraction artefact into a defect.

### Isolation

The shared control-row alternative near the end introduces another record, a
common lock, a wait and a fresh read in one paragraph. The reader must reconstruct
why locking that row helps a rule concerning two other rows. Show a short sequence:
A locks the control row and changes the flags; B waits; after A commits, B acquires
the lock and reads the updated flags in a subsequent Read Committed statement.
Preserve the qualification about an older Repeatable Read snapshot.

The existing price experiment and cross-row illustration already help. Exploring
the difference between BEGIN and the first snapshot-taking query is an optional
extension, not a missing prerequisite. The question about the name “serialization
failure” spanning two levels is resolved in the next article; retain that later
resolution in the review record.

### Waits, deadlocks and retries

This is the strongest opportunity for a joined-up visual trace. The reader tracks
the persistent checkout key K14, proposed orders O14 and O15, stock changing from
3 to 1, and whether an order is provisional or committed. The pseudocode eventually
assembles the process, but several SQL blocks precede it. Show a compact overview
before those fragments, then use the exact SQL to explain its steps.

Carry that trace into recovery when the original attempt may still be finishing.
An empty lookup does not settle the outcome. A repeated claim using K14 may wait;
after the original commits it reuses that order, or after rollback it can proceed.
The current missing-reply illustration shows two completed histories, but not this
pending case. A small outcome table may suffice. If interaction helps, let the
reader change whether the original attempt commits or rolls back and observe the
returned order and stock, rather than merely animate time passing.

The identity and recovery findings are related and should probably share one aid.
Keep the deadlock illustration, whole-decision retry example and distinction
between requesting cancellation and receiving confirmation. The readers found
these explanations useful as they stand.

## Where deeper questions belong

Several questions already have destinations in the planned collection:

| Question raised during reading | Existing planned coverage |
| --- | --- |
| How does the database execute this join or find a late page efficiently? | How joins work; From SQL to an execution plan; Choosing indexes for your queries |
| How do I page orders first and then fetch their lines efficiently? | Understanding database work behind a request, with a bounded worked example |
| What happens to old row versions during a long report? | Row versions, transactions, and vacuum |
| How do I locate the code paths causing waits? | Diagnosing database waits |

Two questions may merit later commissions: finishing work across a database and
another service when replies can be lost, and restarting a batch job without
losing or repeating its effects. Record these as planning candidates, not new
routes or promises of available reading. The immediate articles still need enough
local explanation to stand alone.

## Suggested next revision

Start with the checkout/recovery trace, the exact ON/WHERE outputs and the
pagination boundary example. These address specific, repeated mental work. Then
complete the grouped-join repair and add the small concurrency sequences. Re-read
those passages with their surrounding transitions before deciding whether any
remaining curiosity warrants more material.

The expanded review produced useful observations because it preserved where an
effort began and whether later material relieved it. Keep that evidence when
commissioning repairs. A final list saying “add diagrams” would lose much of the
value of the reading.

## Implemented follow-up — 4 October 2026

The user authorised the repairs after reading the findings. The six articles now
include exact ON/WHERE results, grouped intermediate join results, an offset
comparison beside its explanation, a timestamp tie that crosses the page boundary,
two-bin and shared-control-row sequences, and a checkout trace covering both a
duplicate request and recovery while an earlier attempt is still finishing.
Unused historical order/price reminders were shortened. The existing payment aid
already marks uncertain outcomes and repeated-result handling; it was retained.
The broader payment and restartable-job questions remain planning candidates.

The filter comparison adds Cara's early-only order to temporary copies of the
shop tables, so subsequent totals and existence queries retain their original
meaning. Its setup is included in the refreshed downloadable SQL. Pagination
uses O14/O15/O16 at 12:00 throughout its setup, prose, model and export figure.
O14 now demonstrates what a time-only continuation loses.

An independent reader first interpreted the new transaction figures and grouped
join figure without nearby prose, then checked their placement in the articles.
Their interpretations matched the intended explanations. Two starting conditions
were implicit in isolated views: the recovery figure's purchase of two from three
mugs, and the control-row figure's requirement to keep one product enabled. Both
are now stated in the figures themselves. The reader found the retry identity
trace's separation of proposed and stored order IDs particularly useful.

An independent technical reviewer checked result consistency, the fresh Read
Committed statement after waiting, and the Repeatable Read qualification. They
identified one missing condition: retaining the key at the caller is insufficient
if the database later deletes its key-to-purchase record. The recovery article
now explicitly requires retaining the stored key and original purchase details
for the period in which retries are accepted. That reviewer rechecked and accepted
the repair. PostgreSQL 18's
[isolation rules](https://www.postgresql.org/docs/18/transaction-iso.html) and
[uniqueness checks](https://www.postgresql.org/docs/18/index-unique-checks.html)
support these explanations.

The SQL verification script executed 27 outcomes with PostgreSQL 18.3 through
PGlite, including both cutoff results and the time-only versus pair boundary.
Downloads and observed results were regenerated. This remains a single-session
check; it does not execute the illustrated overlapping recovery schedules.

Rendered checks covered the new material at desktop and 390px phone widths,
including light and dark views. The pagination contributor exercised all four
existing interactive cases and checked their results. Dark inspection used a
temporary localhost proof serving the production build with its dark media rules
enabled, because the browser tool does not expose a colour-scheme override; no
user appearance setting was changed. One inherited section margin in the recovery
figure was removed after phone inspection. A light desktop proof is saved at
`../screenshots/checkout-trace-light.png`.

The final `pnpm build` passed with 54 pages. The corrected dark recovery figure
was checked again at desktop and phone widths; its phone view had no horizontal
page overflow. Its desktop proof is saved at
`../screenshots/checkout-recovery-dark.png`. Temporary browser and preview-server
resources were closed after inspection; the normal development server remains.
