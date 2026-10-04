# Writing references

The reference is a piece of writing we can read, rather than a checklist to
satisfy. For now, the closest combination is Sam Who, Bartosz Ciechanowski,
and Julia Evans. The column-store essay is our first attempt at finding a
voice from those influences. It is still something to revise together.

## Read these alongside a draft

[Sam Who — Load Balancing](https://samwho.dev/load-balancing/)

Read the opening through “When round robin doesn't cut it.” The prose stays
with the simulation: a request arrives, a server is busy, another request
gets dropped. The explanation has someone guiding it, but the system itself
provides most of the interest.

[Bartosz Ciechanowski — Gears](https://ciechanow.ski/gears/)

Read “Disc” and “Transmission.” He gives a small observation enough room to
become an explanation, then changes the model. The transitions feel like
continuing a thought rather than starting another item in an outline.

[Julia Evans — How to teach technical concepts with cartoons](https://jvns.ca/teach-tech-with-cartoons/)

Read “personify the characters,” “show a scene,” and her discussion of the
Kubernetes cartoon. The voice is personal and unceremonious, even when the
point is technically demanding. Her concern about the missing role of etcd
is a useful example of being approachable without being vague.

These are references for our own prose, not text to reproduce or identities
to adopt. Reading the original passages matters more than the descriptions
above.

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
