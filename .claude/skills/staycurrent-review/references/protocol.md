# Review through independent understanding

This reference is for coordinators and informed reviewers. A blind reader should
receive the artifact and audience, with the separate context-free voice reference.
The useful question is what the reader understood before we explained our intention.

## What different perspectives reveal

An editor can notice that individually clear sections never become one piece of
writing. A technical reviewer can find a guarantee that is broader than its evidence.
A fresh reader can expose a prerequisite the experts unconsciously supplied.
Choose complementary perspectives and preserve their first readings before sharing
findings. For a substantial article, independent subagents help the author see
beyond their own explanation; the right mix depends on the work.

The relational introduction needed all of these perspectives. Its early join
paragraph named matching IDs without showing the answer. Later, “each query gets
a view” obscured the difference between ordinary and locking reads. Both passages
sounded reasonable until someone followed their consequences. The repairs were a
specific result and a precise qualification, not more terminology.

Use the human writing references and the article's reader outcome when editing.
Pay attention to headings and supporting copy as well as body text. Ask whether a
passage earns its space and whether its thought continues across a section boundary.
A review suggesting more depth should name the understanding that is missing.

Technical review follows the claims that carry the argument back to primary
evidence. Consider what the prose and pictures imply, including engine conditions
or guarantees that may be easy to overread. Annotated sources are useful to readers;
a long list of links is not evidence that the claims were checked.

## Read teaching aids before explaining them

Show new or meaningfully revised aids without the surrounding article or external
caption. Keep the labels, example inputs, code comments and controls that belong to
the aid itself. Ask what it seems to teach, what follows what, what outcome the
reader expects and what appears operable. For an experiment, distinguish the first
impression from understanding after using it.

The relational work used three independent readings per aid in response to the
user's request. Multiple uncued readings are useful for exposing different
interpretations; the point is demonstrated understanding, not accumulating approvals.
Choose review effort to suit the aid's novelty and ambiguity, honouring any explicit
review request. One set of readers can examine several independent aids, while a
figure that reveals another's lesson may call for separate readers.

If a reading misses the intended idea, keep the original response. Then explain
the purpose and ask how the aid could change, or whether another medium would
serve better. Use fresh readers to discover whether a meaningful revision works on
first encounter. An informed collaborator is valuable for repair but no longer
supplies an uncued interpretation. Persistent confusion is a reason to rethink the
explanation, not merely edit the caption again.

Our first index figure asked for order IDs, then drew arrows to the table. A reader
noticed that the index already contained those IDs. Asking for order totals made
the lookup earn its place because those values existed only in the table. The
repair changed what was being explained; fresh readings then followed the intended
route. A prettier arrow would not have solved that problem.

## Protect a genuinely fresh reading

With the collaboration tool, the default subagent fork inherits the conversation.
Start a blind assignment with `fork_turns="none"` and supply its reader artifact
explicitly. Calling a role “blind” cannot undo context the model already received.

Keep author rationale, intended answers and earlier findings out of blind inputs.
In the relational review, even mandatory style guidance leaked context: its worked
examples described this very article's failures. The separate
`staycurrent-style/references/blind-review-voice.md` now gives these reviewers
house context without case histories. If context leaks, acknowledge it and use
that review for informed advice rather than calling it blind evidence.

Once the independent media reading is recorded, the same unbriefed reader can read
the assembled article. Invite an account of what they learned and a prediction
about a related situation. Ask what in the article supports that prediction; an
expert model's prior knowledge can otherwise conceal a missing explanation.
The relational reader could explain why a historical purchase price should survive
a catalogue change. That mattered more than asking the author to add another
section explicitly answering the test.

## Follow the learning across pages

Begin with the [sequential first reading](first-reading.md) when reviewing a teaching
article. In the querying batch, a retrospective review found the concepts present
and the sequence sensible, but the user still could not see why pagination led to
ordering. Recording “why do we need an order?” at that point exposes something an
expert's eventual understanding can conceal. Preserve when a question arose and
when its answer arrived; the gap is not necessarily at the start of an article.

The subsequent sequential pass found that the transaction-boundary article used
“acquired locks” to explain the cost of waiting for payment. The next article gave
a good definition, but it arrived after the reader needed it. A local explanation
of who waits supplied the missing reason. The concurrency article had a different
gap: the reader understood how a locking read worked, yet could not see when to
choose it over the simpler conditional update. A short partial-fulfilment example
gave application code a concrete decision to make from the locked record. These
repairs supplied different kinds of understanding; neither called for another
general introduction.

The same logs recorded questions worth leaving alone. A reader wondered whether a
transaction could see its own writes; the next section answered that question at
the point the article moved from reports to writes. Do not move every answer to
its earliest conceivable mention. The useful distinction is whether the reader can
follow the present thought while the question remains open.

The design series later passed reviews while its examples used integer, decimal
and timestamp columns without adequately teaching data types. Types appeared in
the brief and the prose, which made the coverage look complete. Correct examples
and successful execution did not establish that a newcomer could choose between
them. An uncued model still brings expert knowledge; lack of author context does
not make it a novice.

For a learning sequence, a useful assignment is: “Follow the reader through the
actual pages. Choose a consequential decision or prediction the writing invites,
and explain how the reader could reach it from those passages. Identify any step
you supplied from your own knowledge. Distinguish a missing local explanation
from depth that reasonably belongs elsewhere.” Treat the answer as evidence to
inspect, not a simulated learner test that proves comprehension. Cross-page
connections deserve attention too: our normalisation and JSON explanations each
made sense alone but left readers to reconcile their different uses of nesting.

The subsequent audit found several forms of missing explanation worth recognising
in other subjects:

- **Interpreting the example:** Constraints explained what each rule did, but its
  positional INSERT values assumed readers could map values to declared columns.
  The SQL could execute correctly while remaining unreadable to its audience.
- **Reconciling two lessons:** Normalisation separated purchase lines into rows;
  the JSON article later bundled product details inside a column. The reader needed
  to understand why those choices differed: independent identities, references and
  rules versus a descriptive bundle, with different access and validation costs.
- **Following the cause:** A warning said that replacing an old JSON object could
  lose another writer's changes. The text also taught row locks. Showing two early
  reads followed by sequential writes would explain why those statements coexist;
  repeating the warning would not supply that missing step.
- **Reaching a usable result:** A JSON number check still allowed fractions that
  broke the example's integer query. The article acknowledged this accurately but
  left the reader to complete the design. One compatible validation/query path or
  a worked choice of a typed column could finish the lesson. Similarly, repeatedly
  recommending conditional rules is weaker than showing one valid combination and
  why an invalid or missing value fails it.

These are examples of gaps, not required topics or a standard article structure.
Judge whether a reader lacks a necessary step, would benefit from an optional
practice link, or can reasonably leave deeper work to another article. The desired
result is a connected explanation that supports the promised decisions, without
turning every introduction into an exhaustive course. A table of contents or a
future article title cannot establish that a prerequisite has already been taught.

## Inspect the experience as well as the argument

A screenshot can reveal labels and relationships, but it cannot establish keyboard
operation or model correctness. Inspect the rendered page in the conditions it
needs to support: both themes, narrow and wide screens, meaningful control states
and accessible alternatives. Follow the interaction far enough to see its
consequences, including failures or boundaries that matter to its lesson.

Use real execution where a runnable example's result matters, and distinguish it
from semantic review. The relational SQL was executed in SQLite; the locking
timeline was checked against PostgreSQL documentation, not demonstrated by a
concurrent-engine test. Preserve that distinction in the record. Use `pnpm build`
for implemented site changes, alongside the relevant behaviour checks.

## Make the findings useful

Keep the artifact or revision identifiable and record the evidence behind important
findings. The author should be able to tell what failed, why it matters and whether
the proposed repair addresses it. A short narrative or table can both work; choose
what makes the decisions easiest to understand.

Resolve consequential findings, including by rejecting a suggestion with a sound
reason. Recheck the affected explanation and connected behaviour. Read the final
piece as a whole: individually successful aids can still leave a difficult passage
unsupported, or interrupt a thought that was already clear.

The handoff should distinguish a draft that is ready from one needing repair or
blocked on specific missing evidence. Record what remains unverified. Reviews reduce
the human burden of routine editing; they do not establish perfection or publication
permission.
