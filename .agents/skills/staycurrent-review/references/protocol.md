# What independent review has found

This reference is for coordinators and informed reviewers; it describes past articles
and what their reviews revealed. Keep it away from an uncued reader, who works from the
artifact, the audience and the context-free voice reference.

## Different perspectives, different failures

The relational introduction needed every perspective. Its early join paragraph named
matching IDs without showing the answer they produce. Later, "each query gets a view"
hid the difference between ordinary and locking reads. Both passages sounded reasonable
until someone followed their consequences, and the repairs were a specific result and a
precise qualification rather than more terminology. A review asking for more depth
should name the understanding that is missing; one asking for less should name what the
reader would lose.

## Read teaching aids before explaining them

Show a new or meaningfully revised aid without the surrounding article or external
caption, keeping the labels, inputs, code comments and controls that belong to it. Ask
what it seems to teach, what follows what, what outcome the reader expects and what
looks operable. For an experiment, separate the first impression from understanding
after using it. The relational work used three readings per aid at the user's request;
choose the effort to suit the aid's novelty and ambiguity.

Before operating it, record a prediction for one available variation from the
visible inputs and represented state. Then operate it and identify what changed,
what persisted and how the display explains the result. Choose another case that
could plausibly change the decision: a boundary, another event order, a failed
step or a different input. A designer may supply scope and setup but must keep
expected answers out of the independent first reading. If a fixed history has no
useful parameter, judge its spatial and temporal representation instead; do not
invent a requirement for free-form simulation.

Then read the aid in the article. Check whether its records and controls arrive
when the thought needs them and continue to support the later consequences. Ask
where a newcomer is still mentally drawing the mechanism. Review the absence of
an aid where it matters, not only the quality of what the author supplied. Native
worksheets and reliable code do not answer that question on their own.

If a reading misses the intended idea, keep the original response, then explain the
purpose and ask how the aid could change, or whether another medium would serve better.
Our first index figure asked for order IDs, then drew arrows to the table, and a reader
noticed the index already held those IDs. Asking for order totals, which existed only in
the table, made the lookup earn its place. The repair changed what was being explained;
a prettier arrow would not have helped. Once a reader knows the intention they are an
informed collaborator, so use a fresh reader to test a meaningful revision.

## Keep the fresh reading fresh

Calling a role "blind" can't undo context an agent has already received, so start the
reader without this conversation (with Codex's collaboration tool, `fork_turns="none"`)
and supply its inputs explicitly. In the relational review even the style guidance
leaked context, because its worked examples described that very article's failures;
`staycurrent-style/references/blind-review-voice.md` exists for that reason. If context
leaks, say so and treat that review as informed advice.

Once the independent reading is recorded, the same reader can say what they learned and
predict a related situation. Ask what in the article supports the prediction, since an
expert model's own knowledge can hide a missing explanation. The relational reader could
explain why a historical purchase price should survive a catalogue change, which showed
more than asking the author to add a section answering the test.

## Follow the learning across pages

In the querying batch, a retrospective review found the concepts present and the order
sensible, but the user still couldn't see why pagination led to ordering. Recording "why
do we need an order?" at the moment it arose exposed what an expert's eventual
understanding concealed. The next sequential pass found the transaction-boundary article
using "acquired locks" to explain the cost of waiting for payment, a term defined well
but one article later. A local explanation of who waits supplied the reason. The
concurrency article's reader understood how a locking read worked but not when to choose
it over a conditional update, and a short partial-fulfilment example gave the
application a concrete decision to make.

The same logs recorded questions worth leaving alone. A reader wondered whether a
transaction could see its own writes, and the next section answered it exactly when the
article moved from reports to writes. Don't move every answer to its earliest possible
mention; the question is whether the reader can follow the present thought while it
stays open.

The design series passed reviews while its examples used integer, decimal and timestamp
columns without teaching data types. Types appeared in the brief and the prose, which
made the coverage look complete; an uncued model still brings expert knowledge. A later
audit found other gaps worth recognising in any subject:

- **Interpreting the example:** positional INSERT values assumed readers could map
  values to declared columns. The SQL ran correctly and was still unreadable to its
  audience.
- **Reconciling two lessons:** normalisation separated purchase lines into rows, then
  the JSON article bundled product details into a column. The reader needed to know why
  those choices differed.
- **Following the cause:** a warning that replacing a JSON object could lose another
  writer's change sat beside teaching about row locks. Showing two early reads followed
  by sequential writes explained why both statements hold; repeating the warning
  wouldn't have.
- **Reaching a usable result:** a JSON number check still allowed fractions that broke
  the example's integer query. The article said so accurately, but left the reader to
  finish the design.

A useful assignment for a sequence is: "Follow the reader through the actual pages.
Choose a consequential decision or prediction the writing invites, and explain how the
reader could reach it from those passages. Identify any step you supplied from your own
knowledge." Treat the answer as evidence to inspect, not proof of comprehension.

## Inspect the experience as well as the argument

A screenshot shows labels and relationships but not keyboard operation or model
correctness. Inspect both themes, narrow and wide screens, meaningful control states and
accessible alternatives, and follow an interaction far enough to see its consequences.
Distinguish real execution from semantic review in the record: the relational SQL was
run in SQLite, while the locking timeline was checked against PostgreSQL documentation
rather than a concurrent test.

For downloadable practice, check the delivered file and the way a reader is told to run
it. Our pagination script's setup and rollback boundaries changed when its statements
were sent as one server request. Follow the actual download links and client route from
a fresh database, and distinguish host files, container files, databases and sessions:
temporary tables vanish on reconnect, and a complete script may finish an example before
the reader starts following its snippets. Make transaction starts and successful ends
visible, and record installation prerequisites separately from the steps you tested.
