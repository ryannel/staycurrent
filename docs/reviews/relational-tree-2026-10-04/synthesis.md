# Review of the proposed relational tree

4 October 2026. Scope: the [proposed tree](proposal.md), not the quality or technical
accuracy of unwritten articles. Findings below are recommendations for refining the
plan; the site and article destinations have not been changed.

## Independent inputs

- [Blind reader](blind.md): the proposal and audience only, without discussion history,
  planning documents, expected conclusions, or other reviews. The reviewer selected
  its own three reader questions and traced routes through the tree.
- [Commissioning editor](editor.md): proposal, site purpose, entry context, and house
  planning/writing references; no other findings.
- [Database practitioner](practitioner.md): proposal, audience, transferable-learning
  goal, scope boundaries, and house writing instructions; no other findings.
- [Learning-design reviewer](learning.md): proposal, audience, entry context, and
  transferable-learning goal; no other findings or discussion history.

## Recommendations after the four readings

Keep the broad coverage as a planning map. The blind reader could locate modelling,
concurrent purchasing, and reporting questions, and could distinguish index mechanism
from index selection. There is no evidence that all those articles should be merged.
There is evidence that the map needs clearer entry routes and ownership boundaries.

| Finding | Proposed disposition |
| --- | --- |
| A complete tree can look like a compulsory reading sequence, with storage internals before a first query | Show short routes from the introduction for learning the approach, making a product choice, and diagnosing a problem. Retain direct entry to focused articles. |
| General, practical, and PostgreSQL articles may repeat the same explanation | Give each commission a distinct reader outcome. Keep mechanism and application separate when each has a useful argument; merge or defer a PostgreSQL overview/query tour if both follow the same path without a new payoff. |
| “Waiting, deadlocks, and retries” and “When the database is waiting” have ambiguous entrances | Distinguish handling transaction outcomes from diagnosing a stall. Link them where diagnosis becomes action. |
| An application may not know whether a write completed | Assign this explicitly to safe retry behaviour, including effects beyond the database transaction. It is necessary application correctness, not a new distributed-systems curriculum. |
| The generic engine branch could silently equate relational databases with one physical design | Identify the architecture used in each example and distinguish model, interface, storage, and deployment near the introduction. |
| Value meaning has no clear owner | Put relevant types, precision, units, and time in modelling briefs, through bounded examples rather than a datatype catalogue. |
| Some proposed leaves have collection-sized scope | Narrow query correctness to an actual surprising result; separate access and retention outcomes in the plan; commission maintenance or extensions around a concrete problem. Do not immediately multiply pages. |
| Subjects are clearer than the ideas readers should transfer | Connect early briefs to concrete understanding: storing one shared fact changes update work; the same query can have several execution strategies; avoiding read work adds maintenance; overlapping requests can break a rule. Show one consequence before linking to deeper reading. |
| “Introduce prerequisites briefly” leaves the actual dependency untested | Specify the small setup each early article needs. Show which rows belong in a join result before explaining competing join algorithms. Keep this in editorial notes rather than requiring a prerequisites panel. |

The introduction should deliver a connected explanation of stored facts, one useful
query, and related changes, with a small onward map. Repeating the field guide or
listing every later subsystem would not justify the page.

## Disagreements to resolve through commissioning

The editor favours combining mechanism and index choice initially; the blind reader
already understands that distinction. Keep both outcomes in the map and decide the
article boundary from the first concrete example, not reviewer voting.

Suggested first production groups differ. The editor prioritises introduction,
concurrency, and PostgreSQL row versions; the practitioner and blind reader prefer
modelling, query meaning, and transactions. Those are different useful journeys.
Do not treat any one list as an agreed replacement for the proposed production slice.

The learning reviewer proposes orientation plus modelling, query correctness,
constraints, concurrency, and indexing. Its strongest addition is the connection
between these ideas, not a reason to commission six pages at once. The coordinator's
recommendation is to finish the introduction's brief, then develop one complete
mechanism-and-consequence article to test the teaching approach. Keep the larger tree
as coverage and decide later splits from the examples. This preserves practical use
and the user's emphasis on transferable underlying design decisions.

Do not adopt a compulsory printed transfer exercise from the learning review. The
existing review process can test transfer independently; the article needs a visible
prompt only when it improves the reading experience. Keep product comparison as an
independent route rather than making completion of fundamentals a prerequisite.

## Reusable planning lesson

The planning skill now asks a reviewer to route concrete questions through neighbouring
titles and explain each article's different payoff. The index mechanism/selection
pair was distinguishable to the blind reader; the two waiting titles were not. That
is better evidence for a boundary decision than treating all apparent topic overlap
as duplication. Review the understanding that travels between articles as well as
their subject coverage.

## Limits

These are agent reviews of a content plan. They do not establish comprehension of
finished articles, usability of a rendered navigation, current product accuracy,
or teaching-aid quality. No article production or publication follows from this review.
