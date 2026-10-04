# Relational introduction: continuity and depth review

4 October 2026. Status: **repair required** for the commissioned introduction.

This is an informed editorial review, commissioned to assess continuity, depth,
and voice for intelligent engineers new to relational databases. Inputs were the
article and the source of its two figures, the house writing guidance and its
linked author passages, the relational collection plan, the earlier planning
synthesis, the content structure, and the editorial review protocol. I received
the user's concern about isolated sections and superficial treatment. I did not
read other reviewers' reports or commission further reviewers. No article source
was edited.

Reviewed HEAD: `189ff3059cfe136634103e9c0b48a87bb2f54c23`. Article SHA-256:
`5fafe8996e2ac85aa0eb672082e550f8817fa3df60cf16f80274f023a74364c9`.
Locations below refer to that source revision. This is a source reading, including
figure labels and captions; it does not establish rendered layout, accessibility,
technical verification, or reader comprehension. No build was needed for this
review-only change.

## Overall judgement

The opening now establishes what the system is, and it should retain that job.
The article also contains enough subjects for this introduction. Its weakness is
that a subject usually receives a definition, a use, and a caution before the
article leaves it. The reader rarely sees enough of an outcome to understand why
the next mechanism is needed. Adding more subjects or small linking phrases
would make this longer without resolving that problem.

The strongest passage is the distinction between a customer's current details
and the price paid for a purchase. It gives table design an actual decision:
which changes should affect other records, and which facts should remain as
they were? But the article stops just before that decision could carry its next
explanation. The query section starts over with a definition of a query; it does
not show how the separated facts become a useful answer. The rest of the article
then has little established behaviour to build on.

The transaction-to-concurrency boundary is already reasonably motivated. Keeping
changes together does leave the question of overlapping decisions. Its weakness
is depth within concurrency: naming locks, versions, isolation, retries, and
ambiguous outcomes leaves too little room to explain what coordination changes.

## What the writing references suggest here

In [Sam Who's opening](https://samwho.dev/load-balancing/), dropping a request
gives adding a server a purpose; unequal request cost then gives the next change
a purpose. The connection is an observed consequence. Our query and index
sections need an equally identifiable consequence, though this introduction does
not need his simulation format.

In [“Disc” and “Transmission”](https://ciechanow.ski/gears/), the distinction
between angular and linear speed becomes useful when two discs touch. The later
explanation spends what the earlier passage has taught. Here, primary keys and
separation should become useful when the article produces a joined result;
maintaining that result should make rules and grouped changes useful.

[Julia Evans](https://jvns.ca/teach-tech-with-cartoons/) distinguishes naming the
participants from showing them interact. Her discussion of the missing role of
etcd also asks whether the reader has the explanation needed to understand the
system. Our four-record figure identifies participants and references well, but
the article still owes the reader an account of what a query produces from them.

These are structural lessons, not reasons to adopt the authors' mannerisms.
The draft's plain headings can stay. Its more distant sentences—“Understanding
the job of each makes the whole system easier to reason about” and “These are
reasons to investigate the workload and implementation”—tell us that the topic
matters after the explanation should already have made that apparent.

## Proposed narrative spine

Keep this an introduction to a way of managing information. Let small examples
support each idea; do not follow one order through checkout.

1. **What the database offers.** Applications keep information that outlives one
   request and is used in several ways. A relational database gives that
   information tables, a way to ask questions across them, and control over
   changes. The current first two paragraphs largely do this.
2. **What a table means.** A row describes an instance; columns establish which
   facts it contains and how those values are understood. Identity lets other
   records refer to the same thing even when its description changes.
3. **Why separate tables still form one useful body of information.** Store a
   shared fact once, refer to its identity, and recover combinations through
   queries. Show a small answer assembled from those references. Distinguish
   current shared facts from facts captured at a particular time.
4. **How the database finds that answer.** The requested result does not prescribe
   the search. The engine can inspect records or use an index suited to the
   question. Both must produce the same answer. Keeping an additional route to
   records has a storage and update cost.
5. **How changes preserve the meaning of those records.** A reference is useful
   only if the referenced record exists; declared rules protect that meaning
   across callers. Some actions change several individually valid records, so
   rules alone do not settle whether a partly completed action may remain.
   Transactions supply that grouping.
6. **What changes when requests overlap.** Grouping one action does not stop
   another action from acting on the same earlier information. Explain the
   specific effect of coordination on that decision, then introduce locks,
   consistent read views, and conflict handling at the level needed to understand
   their purposes.
7. **What this makes relational databases useful for.** The reader can now connect
   flexible questions, shared facts, and controlled changes to application
   needs. Product, storage, and deployment choices remain open. End with useful
   deeper questions and the reading that actually exists.

This allows the existing subject headings and roughly the existing order. The
repair is chiefly inside and across passages, not a new table of contents.

## Prioritised passage repairs

### 1. Make separation and recombination one explanation

**Location:** relationships, lines 31–35; queries, lines 40–42.
**Severity:** material comprehension gap, highest priority.

The text says references preserve one customer record and that joins match IDs.
It never shows the useful answer those operations produce. The figure has Ada,
O12, P7, and quantity 2, but there is no result containing the product name and
quantity together. Readers must import their own understanding of a join.

After explaining why the facts live separately, establish the question “which
products and quantities belong to order O12?” Match its line's P7 to the product
P7 and show the answer `Blue mug | 2` in a small result table. Explain which
record supplied each value and that the answer is assembled from the stored
records rather than requiring a new stored copy for this particular question.
Then return to current versus historical facts: a query needing the price paid
must take that value from the purchase record, rather than substituting today's
catalogue price. Supply the historical value if it appears in the result.

This earns the wider claim that the same data can answer several questions.
Explain this much here. Leave join syntax, missing matches, row multiplication,
aggregation mechanics, and normalization theory to their planned articles.

### 2. Connect valid records to complete changes

**Location:** end of indexes through transactions, lines 49–64.
**Severity:** material continuity and comprehension gap.

The article finishes index maintenance, abruptly introduces constraints, and then
introduces transactions through another purchase example. The missing distinction
is between a state satisfying declared rules and an application action being
complete. A valid order header with no lines might satisfy all the stated rules
while still being an unwanted half-finished action.

Open constraints by returning to the references used by the query: an order with
a nonexistent customer would undermine that representation. Explain what the
foreign key rejects, then widen to other declared rules and multiple writers.
At the transaction boundary, state why those rules can still allow an incomplete
action. A small before/partial/committed comparison can make the grouping visible;
prose is sufficient if the retained and discarded changes are explicit.

The introduction needs this distinction and a concrete rollback consequence.
Defer constraint catalogues, deletion policies, transaction APIs, and recovery
mechanisms. The email/payment boundary is useful after the positive promise is
clear; it should not consume the explanation's payoff.

### 3. Show what concurrency control changes in a decision

**Location:** concurrent access, lines 69–72.
**Severity:** material comprehension gap.

The two requests see the same stock, but the paragraph about locks says only
that another writer waits. A newcomer may conclude that serialising the eventual
writes automatically repairs decisions already made from stale reads. The text
does not establish why it would, and later qualifications do not fill that gap.

Explain one coordinated decision at a high level: protect the stock check and
change together, so a competing request cannot successfully proceed using the
same availability. If a lock is the chosen illustration, make the order explicit:
the second request waits before relying on its stock check and evaluates the
state after the first finishes. Do not imply that adding a lock only at the final
write repairs every earlier decision. Identify this as one approach whose exact
operations depend on the engine, with technical sourcing during revision.

Give versions their own purpose: a reader can use a defined view while changes
are underway, but a coherent read view alone does not settle competing decisions.
Name isolation once that problem is established. This introduction needs one
intelligible coordination consequence, not a runnable checkout exercise. Leave
isolation levels, lock modes, deadlocks, and retry design to the focused article.
The lost-connection distinction may remain briefly as an onward question; do not
expand it into a second failure lesson here.

### 4. Give indexes an actual search and a maintained value

**Location:** query plan and indexes, lines 42–49.
**Severity:** material depth gap, below the correctness gaps above.

The definition “organises values” leaves the reader to imagine almost everything
that makes the index useful. Customer ID, order date, and broad table scans arrive
as three unrelated examples. The text has asserted both the saving and the cost
without making either inspectable.

Use one question, such as finding one customer's orders. State that an index on
the orders' customer ID groups or organises those values with a route to their
records, so the engine can find the matching orders without examining every
unrelated order. Distinguish that index from the customer table's own primary key.
When a new order is inserted, the additional structure must also learn about it.
The returned orders are unchanged; the work to locate them differs. No exact
read count is necessary.

Explain that amount here. Defer B-trees, composite ordering, covering indexes,
selectivity estimates, and interpreting plans. A link to an index introduction
can deepen an already understood tradeoff; it cannot supply the missing local
mechanism.

### 5. Keep the opening and table section on representation

**Location:** introduction paragraph 3 and tables, lines 18–26.
**Severity:** material continuity gap with a smaller optional wording repair.

The opening's catalogue names all the later mechanisms before they have jobs.
Then the table section moves from identity into pages and memory, only to move
back to relationships. The engine paragraph answers a real category distinction,
but its storage details have no use in the next explanation.

Remove or substantially shorten the catalogue. Let the product table do one more
piece of teaching: P7 continues to identify the same product when its name or
price changes. That makes the next section's references immediately useful.
Give schema one concrete consequence of a declared type or required field;
avoid introducing precision and missing-value theory here.

Keep the distinction between the table we design and the engine's physical
storage near this first table, in one or two sentences. Move pages and caching
out of this introductory stretch. They belong in storage or execution teaching,
where a read can give them a purpose. The family introduction does not require
those internals to distinguish model from implementation.

### 6. Let fit follow from the costs already explained

**Location:** when to use, lines 77–80.
**Severity:** medium; partly dependent on repairs above.

The first paragraph recaps the opening; the second lists several difficulties;
the final paragraphs list products and overlapping capabilities. They are useful
orientation, but currently read like one more inventory.

Retain the product/deployment distinction. Develop two previously earned
consequences: adding indexes for several kinds of lookup increases work on
changes; requests concentrating on the same records can wait on coordination.
Then the broad fit follows from both benefits and costs. A reporting workload
can lead naturally to the existing column-store reading without implying that
relational databases exclude column storage. Schema evolution, search, document
values, and vectors can remain short signs of further choices, or move into the
onward map; none needs an explanatory detour here.

Product rankings, capacity claims, migration guidance, and resource benchmarks
belong in the planned comparison or focused articles. The closing should leave
the reader able to explain what they are choosing before asking which product
to use.

## Completion condition for the revision

A fresh reader should be able to explain how an answer combines separated facts,
why an index can change the work without changing that answer, why individually
valid rows can still form an incomplete action, and why two complete actions can
still interfere. They should also understand that these capabilities do not
dictate one disk layout or deployment model. Those are connected introductory
ideas. The rest of the collection can develop their implementations and awkward
cases without being required to understand this page.

## Recheck after revision

4 October 2026. The coordinator requested a recheck of the changed prose and the
new collection links. The user's later instruction explicitly requests navigable
outlines for all 35 planned articles; their presence is therefore authorised and
is not a finding against this revision. I reread the complete introduction, the
two new reading components, the collection manifest, and the outline route.
This recheck remains source-only; the coordinator is handling rendered QA.

Rechecked article SHA-256:
`8b6f8445ceb441afd2883bfa3475fa2b6d381d6b6f797656abde9fac4f06c146`.
Reading map:
`7ffde1ce2c8086b7d60faa8885a60c91f3e4dd64b8c0e8943dbb8fd5fb180d2b`.
Section reading links:
`b44e9a316e7bda0e0b9cbc942acece9256eeff1cfcb853a8ff99fe3526fb4d06`.
Collection manifest:
`88173ed3965a195cf39dbccca82d3eed894feb2c73ead380e29fa3935f2d56aa`.
Outline route:
`0bbd07b46d672e5ada601823dffde0d7b9debc3cdb51639378f91f478cf051af`.

**The six material flow and depth findings above are resolved.** This judgement
concerns the editorial remit; it is not a technical or rendered acceptance of
the whole implementation.

| Original repair | Evidence in the revised passage | Disposition |
| --- | --- | --- |
| Separation and recombination | The query now starts from the need to recover an order from separate facts, names O12 and P7, identifies where the quantity and product name come from, and produces “Blue mug, 2.” It then changes the question while keeping the same records. | Resolved. The tiny result is clear in prose; a separate table is unnecessary here. The historical-price distinction is still adequately explained in the preceding section and need not become another worked result. |
| Valid records and complete changes | The constraints section now ends with a valid order missing all its lines. Transactions begins with that unfinished purchase and explains exactly which order, lines, and stock changes rollback discards. | Resolved. The boundary between declared validity and complete application work now motivates the transaction. |
| Coordination of the decision | The lock example explicitly puts locking before the stock check, holds it through the transaction, then tells us what the waiting request sees after the first purchase commits. A following paragraph explains why delaying only the write is insufficient. Versions then answer a separate read-view question. | Resolved editorially. The PostgreSQL behaviour is explicitly bounded and sourced; technical verification belongs to the technical review. |
| Index search and maintenance | The customer C4 question distinguishes a full scan from a route through indexed customer IDs to orders. It distinguishes this index from the customer primary key and explains the insertion work needed to keep the route current. | Resolved. The benefit and cost are now both consequences of the described mechanism. |
| Representation before storage | The mechanism catalogue is removed. Types gain concrete meaning; the storage distinction stays brief; the next section opens by using stable identity outside the products table. | Resolved. The concepts learned in the table section now do work in the relationships section. |
| Fit from established costs | The costs paragraph now returns to index maintenance, competing stock updates, and resources consumed by reports. Existing-engine capabilities and the cost of another copy are explained. | Resolved, with one small ordering issue below. |

The introduction now carries an argument through the headings. It remains a
general explanation of the relational approach. The stock example takes up only
the space needed to establish coordination and does not turn the article into
a checkout walkthrough. Durability adds a short new consequence of committing;
it does not open an internals detour.

### Collection links and remaining observations

The main collection map comes after the article and the two available next
readings. Its eight groups are closed `details` elements by default. The overview
labels the destinations as planned outlines; each destination repeats that the
article is unwritten. This is a clear source-level distinction between future
coverage and available teaching.

The small section-end links are related to the explanation just completed and
contain no prerequisites the reader must follow to understand the next section.
Their placement and smaller type make them plausible optional exits. There are
several long titles in some rows, particularly queries, so a rendered mobile
check should confirm that these do not visually outweigh the prose or create
large repeated breaks. This is a QA question, not an observed layout failure.

One minor continuity repair remains in the fit section. “Before adding that
system” follows the paragraph naming PostgreSQL, MySQL, SQL Server, and SQLite,
while its actual antecedent is the earlier “a separate system for some work.”
Move the existing-engine paragraph directly after the workload-cost paragraph,
or change the opening to “Before adding another system, find out what the
existing engine can do.” This is a local antecedent issue, not a material gap in
the explanation.

The constraints opening, “Finding records efficiently is only useful if the
records mean what we expect,” is still a fairly broad transition. The next two
sentences immediately anchor it in the P7 reference and missing product name,
so it no longer conceals a missing conceptual link. Removing that first sentence
would be an optional tightening, not a condition of acceptance.

No new material editorial issue emerged in this recheck. Keep the rechecked
claims, concrete results, and rollback/coordination consequences together during
any final polish. A fresh comprehension pass and the coordinator's technical and
rendered checks remain separate evidence for readiness of the complete draft.
