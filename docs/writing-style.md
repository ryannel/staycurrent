# Writing references

The reference is a piece of writing we can read, rather than a checklist to
satisfy. We are building it in our own articles, anchored in a few pieces by
Sam Who and Bartosz Ciechanowski that inspired the style. The
`staycurrent-style` skill lists those pieces and what to learn from them. This
document collects passages and revisions from our own work, and the user's
responses to them, so later writers can see how the voice developed.

## An opening we're revising

An earlier revision opened with a question about counting events, then
started again with “Suppose you're building a dashboard.” The operator
pointed out that the question wasn't anchored and the second introduction
didn't resolve it. The prose sounded smoother, but still hadn't established
what an event was or why we wanted to count it.

The current version begins with a page view:

> You're building an analytics service for four online shops, A, B, C, and D.
> Whenever someone opens a page, the shop sends your service a page-view
> record. The service collects these records so it can produce reports for
> each shop.

An illustration shows the four shops sending records to the service. The
text describes a visit to the blue-mug page in shop B, and an example record
shows its six fields. The prose then continues:

> One report counts page views by country for each shop. To produce it, we
> need the shop and country from every record. The other fields don't affect
> these counts: a view from Sweden adds one to the total whether it happened
> at 09:41 or 09:42, and whichever product the visitor looked at.
>
> So the query needs two fields from every record. Does the database have to
> read the other four as well?

## Staying with an experiment

The first version moved quickly from the scan to a general claim:

> Columns help when you read a small part of many records. A request for one
> complete customer record is a different workload.

An earlier revision returned to the page-view report:

> In the row layout, the shop and country values are spread across all 12
> pages, so we end up reading everything. In the column layout, the 16 shop
> values occupy two pages and the 16 country values occupy another two.
> That's four pages instead of 12 to produce the same page-view counts.
> For this report, the column store really can leave the other four fields
> on disk.

## Explaining the awkward result

The old replica model ended one failure case with:

> The write is lost, but the writer never received success. Waiting changed
> the promise.

An earlier revision talked through the two runs:

> The write is lost in both runs. Waiting for B didn't copy it any faster.
> What changed is the answer the application received: in the first run it
> was told the write succeeded, even though the only copy was then lost.
> In the second run it never received success.
>
> Reset once more and advance time until B has v1. Now losing A leaves the
> new value available on B. Waiting for that copy adds a delay before
> success, but it lets this write survive the loss of A.

The current essay uses a newly inserted page view for this experiment.
The article explains both outcomes before the experiment. The experiment
contains its own setup and instructions, so the article does not depend on
a reader running the model to understand the comparison.

These passages are candidates for the house voice, not fixed templates.
The full [column-store essay](../src/pages/learn/databases/column-stores.astro) puts
them beside the images and experiments. Future edits can replace these
samples as we find a register that feels right.

## Headings in the relational introduction

The operator rejected the subtitle “How tables organise information, and how
a database helps us find it, connect it, and change it safely.” We removed it:
the title already names the subject, and the opening paragraph can explain it
without an intervening tagline.

The section headings had the same problem. “Queries describe the answer we
want,” “Indexes avoid searching everything,” and “Constraints give the data
rules” sounded manufactured to the operator. Our editorial review had accepted
them, so that review is not evidence that these passages match the desired voice.

The replacements were “Queries and joins,” “Indexes,” and “Constraints.”
For this introduction, they identify the subject and leave the explanation to
the paragraph. This is an example to judge in context, not a requirement that
every heading be a noun or that explanatory headings can never work.

The operator then found the sections isolated and superficial. Plainer headings
had not repaired the argument underneath them. In the subsequent review, the query
section explained that a join matches IDs but never produced an answer from them;
the lock section made a writer wait but never explained how the stock decision
changed. The revision follows P7 to “Blue mug, 2” and distinguishes locking before
the stock check from merely delaying an already-decided write. These small pieces
of reasoning connect the concepts without making the whole introduction a worked
checkout tutorial. The later whole-page polish received a positive response from
the operator and is now a useful working reference. That does not make every
sentence final, or mean every section needs a matching example or transition phrase.


## A heading that only makes sense after an explanation

On 16 October 2026, the user identified “Start with the rule” in
[Transactions and concurrency](../src/pages/learn/databases/relational/transaction-boundaries.astro)
as a heading the reviews should have caught. They contrasted it with “Commit and
rollback,” which accurately names the preceding section's explanation.

The disputed section follows a purchase through its order, order line and stock
reduction, then explains why the three changes belong in one transaction. An expert
can interpret the shop's requirement as a business rule. That retrospective
interpretation does not make “Start with the rule” a useful introduction to the
section: it leaves the reader to discover both which rule and why that is the label
for the explanation. The user found no meaningful connection to rules in the
section. The repair is “Choosing the transaction boundary,” naming the decision
the paragraphs develop. This replacement remains subject to the user's judgment.

Our guidance already asked reviewers to read headings together and in context.
The missed distinction was between anticipating the section and rationalising its
title afterwards. Reviews should preserve the expectation a heading creates, then
compare it with the actual explanation. Technical completeness and an understandable
body do not settle that question. Changing the prose merely to repeat “rule” would
not repair the original heading's lack of useful orientation.

This is not a ban on “rule,” imperative headings or implied connections. “Commit and
rollback” needs no expanded claim, and a well-grounded question or instruction can
also introduce a section. Judge what the reader can understand at that point and
whether the heading identifies the thought being developed.

## The heading tree must explain the article's organisation

The user then pointed out that the transaction article's problem extended beyond
one label. “The application handles a checkout,” “The query throws an error” and
“Two requests reach the same record” introduced scenes at the same level as the
conceptual sections, without establishing the worked sequence they belonged to.
They also rejected “Put the condition beside the change” and “Lock before making
a longer decision.” These directions concealed useful subjects: conditional updates
and locking reads. The user proposed reviewing the heading tree as an overview and
navigation aid, and stressed that nearly every heading needed scrutiny.

The revision groups the checkout handler, recording the purchase and rollback under
“A checkout transaction in practice.” Its introduction connects the chosen boundary
to the successful and rejected attempts. “Concurrent purchases” contains reading
and updating separately, conditional updates and locking reads. Later sections name
snapshots and isolation, cross-row coordination, deadlocks and retries, uncertain
commits and external payments. The detailed [structure review](article-work/transactions-concurrency-deep-dive/structure-review.md)
preserves the resulting tree and its independent readings.

The lesson is larger than replacing a vague phrase with a technical term. Locally
defensible headings can collectively hide the argument. Inspect their actual levels,
grouping and reading order, including component-generated headings, then read the
transitions between them. A parent title needs an opening that explains the purpose
of its examples. A contents list should lead into the organisation readers actually
encounter. These checks can reveal missing structure without requiring additional
technical material or making every article follow the same outline. Agent acceptance
of this revision remains evidence of a bounded check, not the user's endorsement.

The user then asked us to use the same view to assess technical completeness:
given the subject, are there sections a reader would expect that are missing?
The authoring and review skills now establish expected understanding from the title,
audience and promised outcome before the existing outline can anchor that judgment.
The assembled tree is checked against those expectations, then the body is checked
before calling something absent. A missing heading, a buried explanation and a named
but unexplained mechanism need different repairs.

This extends the structural review without making every article encyclopedic.
A consequential finding must explain why this article owes the reader that teaching
and identify the smallest sufficient repair. A separate investigation can have its
own article, but its actual explanation must be verified before a link is treated
as sufficient support. Planned coverage cannot fulfil a present promise. Technical
accuracy, completeness within scope and useful navigation remain separate judgments.

## Depth can be a missing step, rather than a missing subject

The first schema-design article later exposed another limit of our examples.
It opened with Ada buying mugs and explained an already-chosen shop schema.
Independent reviews found it coherent, but the operator expected to learn what a
relational schema and normalisation are, what a good normalised arrangement looks
like, and how to design one. The worked example had taken the place of the subject's
introduction. Being a deeper article in a collection did not mean its own subject
needed no orientation.

The subsequent rewrite starts with schema versus data and shows a normalised
arrangement before deriving it. Annotated transformations expose the decisions the
earlier text asked readers to picture: giving repeated entries rows, moving facts
that depend on part of a key, and separating facts about another record. The user
also asked for healthy designs alongside the friction of poor ones, with deliberate
duplication distinguished from arbitrary fragmentation. This revision is still a
candidate for user review. The lesson is about the reader's ability to understand
and apply the subject; it does not make concept-first openings mandatory for every
article or make shop examples the house template.

The earlier index paragraph said that it “organises those IDs with a way to locate”
the orders. A reader could still wonder whether finding C4 meant searching every
index entry instead. The revised passage gives them a reason the route helps:

> A common kind of index keeps the customer IDs in sorted order, with a way to
> locate the corresponding order records. That ordering lets the engine narrow
> its search to C4 instead of checking every customer ID. Orders for C4 are grouped
> together in the index, even if their records are scattered through the table.

This is still an introduction. It does not explain a B-tree algorithm. The added
depth is the relationship between the arrangement and the work it avoids. In a
focused internals article, stopping here would leave a different promise unfulfilled.
Judge depth against what this reader came to understand.

## Let one thought lead into another

The end of Constraints used to explain an incomplete order, then leave for SQLite
configuration details. Moving the qualification beside enforcement let the section
end with the problem that Transactions picks up:

> An order can name a real customer and still have no order lines. The rules above
> allow that, even though we have only recorded part of a purchase.

The next section starts:

> To record that purchase, the application needs to create an order, add its lines,
> and reduce the available stock. Each change could satisfy its own constraints
> while the purchase as a whole remains incomplete. If adding a line fails after
> the order has been created, we need a way to undo the unfinished work.

The connection comes from the reasoning. Adding “next” or “now let's explore” to
otherwise isolated sections would not have supplied it. This example is a useful
way to listen for continuity, not a prescription to end every section with a problem.

## Keep precision close to its purpose

The concurrency passage accumulated qualifications about locks, older versions,
isolation settings, rejected transactions and lost connections. All were defensible
subjects, but the paragraph began to feel like responses to reviewers. The revision
made an older version concrete with a price changing during a read, kept the distinction
between ordinary and locking reads, and left uncertain retry outcomes to a follow-up.

The preserved detail matters: PostgreSQL's locking read can wait and return the
updated stock value. Saying that every query sees only its starting view would
contradict the very example being taught. The judgement is which qualification the
present explanation needs, rather than how many caveats an article should contain.

Read these passages in the [complete relational introduction](../src/pages/learn/databases/relational.astro).
Its [review record](article-work/relational-introduction/review.md) preserves the
findings and repairs. An agent's claim that prose sounds natural is weak evidence
on its own; the explanation and the reader's understanding are what we can inspect.

## A definition can still start too far into the subject

The querying and transactions batch passed independent review, but the user still
felt that the articles jumped straight in. The pagination article defined pages
and batches, then introduced ordering without explaining why it was needed.
Knowing what a word means did not give the reader the reasoning behind the choice.

The revision starts with reading a history too large to fetch all at once. It then
connects splitting that history into pages to needing a sequence: “the next twenty”
requires an agreed before and after. Only then does it introduce SQL's lack of a
promised order, ORDER BY, and settling ties. The new sequence is a candidate for
the user's reading, not an approved formula for future introductions.

The same pass moved the price-change puzzle out of the isolation opening. The
opening now explains why reading while others write raises a question about which
version a report should see; the concrete price change tests that idea afterwards.
What was missing was motivation and a connection between thoughts, not simply
more introductory words. A review that recognises the correct concepts can still
miss reasoning that an expert reader supplies for themselves.

## SQL needs someone to send it

On 15 October 2026, the user questioned a checkout snippet that ended in COMMIT
without showing BEGIN. The BEGIN was in an earlier block. Adding numbered steps
and continuation comments did not settle the confusion: the user then asked
whether someone was sending commands on a live connection or writing a script in
an IDE. The article had assumed an interactive database session without explaining
that setting. Its independent reviews had supplied this context themselves.

The requested revision follows application code handling a checkout. It must show
who sends a query, who returns rows or an error, and which application branch sends
the next query. The psql exercise becomes optional and names its different setting.
This is a change in the explanation's viewpoint, not a rule to add more comments
to every SQL block. Correct statements and explicit transaction boundaries can
still leave a reader unable to place the code in a running system.

The supporting conflicts article retained a smaller version of the same problem:
one block showed a stock update followed by an insert, with a comment saying to
continue only after success. The repair separates the queries and puts the
handler's response check between them. A comment can describe a branch, but it
cannot make that branch visible in the running example. The abridged retry policy
also needed to preserve the full handler's treatment of an uncertain commit;
shortening code must not silently narrow its promise.

## Give the reader the facts before asking them to interpret a result

Two independent readers of the querying article met order O14 in a left-join
result before the main text said it was an empty order belonging to Ada. The
optional setup contained it, and the paragraph afterwards explained it. Neither
helped a reader predict the result at the point it appeared. Moving that one fact
before the query made the result something the reader could derive.

The pagination article had a related problem: after demonstrating an inserted
order, it used the original five orders for an export. The revised transition
explicitly restores that starting state. These are small changes to the reader's
working context, rather than requests for more introductory material. Follow the
identities and state changes through the actual reading path, including the path
that leaves optional setup closed.

## Let captions finish the explanation

The collection's structural editor found repeated defensive endings in captions.
The overview's locking diagram ended by saying that spacing was not a measured
duration and that the picture was not a benchmark. The revised caption keeps the
conditions that affect its meaning—locking reads at PostgreSQL Read Committed—and
ends there. The index caption still explains that totals require table lookups and
that record locators vary by engine; its additional disclaimer about not showing
index-search work was unnecessary beside the route already drawn.

This is a judgement about those figures, not a rule to remove qualifications.
A model comparing counts can invite a false speed claim, and should explain the
distinction. Ask what inference the reader might actually make from this picture.
Keep the detail that changes that inference; let the explanation end when its
work is done.

## Make further depth a reason to continue

The four-reader collection pass exposed a tension between two useful reading
paths. A main deep dive should make sense on its own, while a reader continuing
into a supporting article deserves more than the same lesson again. The editor
found that Constraints took too long to reveal its additional work after Designing
your data. Its revised opening begins with two successful availability checks that
cannot both grant ownership of a catalogue code, then gives the brief definition
and shared-writer context a direct entrant needs.

The JSON revision makes a different choice. The input policy and its outcomes stay
in the main reading path; the exact nested-CASE conversion and instructions for
running it move into a disclosure. The reader can finish the representation
decision before choosing to implement the migration. In the parent, repeated JSON
setup becomes optional while the reasons for a details row remain visible.

We retained the main articles' type reasoning, transaction mechanisms and worked
counterexamples. Removing those would weaken the commissioned deep dives merely
to make the children appear deeper. The useful editorial question is what new
investigation a supporting article offers and how soon the reader can recognise
it. The [four-reader record](article-work/collection-reader-passes/commission.md)
preserves the broader suggestions and the coordinator's more bounded decisions.


## Reading the body after changing the headings

The access-and-persistence batch repeated this problem on 15 October. The user
found its titles unlike those a human author would write, despite the completed
agent reviews. “Give the route a useful order” and “Check the choice against the
work” leaned on an extended route metaphor and vague abstractions. We revised
them to “Composite indexes” and “Testing an index,” and made a similar pass through
the other two articles and their figure titles. Read a page's headings together:
repeated claims and metaphors can sound manufactured even when each heading
describes its section accurately. These revisions are candidates for the user's
reading, not proof that the wider prose now meets their expectations.

The user then asked for the same scrutiny across the body of all three articles.
The next editorial reading found that understandable prose still repeatedly left
the example to announce a lesson or describe the author's investigation. The earlier
review had treated a coherent explanation and sound technical claims as sufficient
evidence of editorial readiness. It had not judged the cumulative voice separately.

In Indexes, the transition to the write experiment was:

> Finally, give the candidate the work it will have to live with. The downloadable
> experiment inserts another 1,000 orders, corrects 200 amounts and deletes 100 orders.
> Those mutations are deliberately visible:

The revision stays with the experiment:

> So far we have read from a fixed set of orders. The downloadable experiment also
> inserts 1,000 orders, changes 200 amounts and deletes 100 orders:

The earlier transition asked readers to interpret a metaphor and then explained
how we had presented the commands. Naming the data changes connects the read
experiment to the write experiment without that extra framing.

The query-execution draft described a result with “Those fields establish
temporary-file work.” The revision puts the output and its meaning in one sentence:

> Our run reported `Sort Method: external merge`, `Disk: 544kB`, and counts of
> temporary blocks read and written, confirming that the sort used temporary storage.

The surrounding text still says that sizes vary and that PGlite does not measure a
server's physical disk speed. Direct writing retains conditions that change what
readers can conclude. It can also keep a necessary contrast, such as the difference
between a committed transaction and a dirty page. Removing every contrast or
qualification would damage these explanations.

Other paragraphs now link the relevant claim directly to its source instead of
ending repeatedly with a sentence describing what the documentation explains.
Further-reading descriptions remain where they offer a useful next investigation.
The point is the flow across several paragraphs, not a preferred way to format links.

The repair review also caught an overcorrection: “Each page can point to many child
pages” accidentally included leaves. The revised sentence names the root and other
branching pages. Simplifying prose can change a claim, so the writing pass needs a
technical recheck of its changes as well as a continuous editorial reading.

These are revisions made in response to the user's request, not user-approved
models of natural writing. The [body editorial review](article-work/access-and-persistence/body-editorial-review.md)
records the diagnosis and rereading. The useful change to our process is to judge
writing alongside comprehension, with connected passages as evidence, and reread
the whole piece after integrating repairs. Adding a phrase blacklist, a prose score,
or another automatic approval would not establish that the writing works.


The user immediately rejected the revised Indexes opening too: it still jumped
into a customer story and did not say enough about the subject. The preceding
body review and skill changes had not resolved that. We had made sentences more
direct while preserving a commission built around the scenario, and accepted a
promise of later explanation as sufficient orientation. This repeats the earlier
schema-design lesson already recorded here; the guidance existed but was not
applied to the opening.

The next revision introduces the index's contents and row references, explains
why grouped customer entries help find scattered orders, and connects the chosen
arrangement to query needs and maintenance. The B-tree section then explains how
the database finds the matching entries. The commission now states that opening
outcome instead of prescribing a customer opening an order-history screen. The user
responded ‘That’s better’ and asked for the same approach in How a query
runs and Storage and durability. That endorses this direction: establish the subject
before asking the reader to track the example. It does not make the exact wording a
template. An invitation to keep reading is not evidence that an opening has already
introduced its subject.

The revised opening begins:

> An **index** helps a database find rows without searching the whole table. It
> stores values from selected columns in a structure that supports fast lookups.
> In PostgreSQL, it also stores references to the table rows those values came from.
>
> Consider finding one customer’s orders in a table containing orders for thousands
> of customers. Without a suitable index, the database may have to check every row
> to find the ones belonging to that customer. An index ordered by customer ID
> groups the customer’s entries together and points to their orders, even when
> those orders are scattered through the table. Once it finds the first matching
> entry, the database can read the following matching entries.

The next paragraph connects that arrangement to date ordering and maintenance.
The example now gives the reader a way to reason about an index. It still leaves
the B-tree section something to explain: how the database finds those entries.

The user's further guidance was about the skills themselves: lead with context,
goals and good examples, and trust the agent to find an approach suited to the
writing. The revisions therefore describe the reader's situation and the desired
understanding, with this passage as a reference. They leave the composition to the
author. Independent reading remains useful evidence of where that composition
helps or loses the reader; it is not a prose metric or a formula for an opening.

## Voice references, 16 October 2026

The user's words, unedited, in the order they were given. Candidate passages
from Sam Who, Bartosz Ciechanowski and Julia Evans were shown first.

> Ok same who is amazing. I love the animated explanations we need to do that.
> Bartosz is good too but not his introductions.
>
> Julia evans I don't like.

> I think you should probably read more of their writing than just those short
> snippets.

> Ok, but let's think about this now, you learnt by reading the whole article.
> isn't that what agents who are writing should do? Maybe not as many as you
> just read but maybe one from each author in full. We should maybe find a 3rd
> author? Not sure.

> Grigorik's sentenses seem to run forever, he's not easy to read.

> Can we not just bake the text from the site into the skills?

> Hmm, ok. I think what we should do is get 3 of our articles up to the right
> standard and then use those as the reference. Can we do this, let's get a
> writer to read the reference articles, etc. Then ask them to re-write 3 of our
> existing articles but following the reference style and structure. They should
> have freedom to completely re-write and re-build the piece, they don't need to
> stick to what's there today.
>
> We should also encourage them to build these interactive animations in a
> compelling and attractive style to help illustrate their points and use them
> as a real teaching tool. So they should be frequent and anchoring the text.

Asked which three articles to rewrite, the user chose Sequence diagrams,
Indexes, and Storage and durability. Asked which model should write them, they
answered:

> Opus on high reasoning.

## An opening that defined the parts, 17 October 2026

The rebuilt Indexes article opened:

> A **B-tree index**, the default kind in PostgreSQL, is a separate, sorted copy
> of one or more columns of a table. Each entry holds a value from those columns
> and the location of the row it came from.

It passed nine independent reviews. The user's words on reading the live page:

> This is the deep dive into indexes but it doesn't open with anything on what an
> index actually is or what they are for. For my understanding why did all the
> many review rounds find that acceptable?

## Published collection rejected, 19 October 2026

After publication of the relational rewrite, the user said the writing style had
“completely degraded”. They requested a fresh agent to read the three chosen
example articles and rewrite the introduction. When the coordinator added a
long staged prompt, the user corrected it:

> No, wtf. Just tell it to read the 3 example articles and use that as the
> reference writing and teaching style. Then tell it to rewrite the article.
> That's it

The first agent was stopped and a fresh agent received only that instruction,
with the article paths. The [work record](article-work/relational-introduction-style-2026-10-19/brief.md)
preserves the exact prompt and reference revision. This rewrite is a trial, not
a user-approved house reference.
