# Sentence mechanics — the line-editing canon

Load this when line-editing: prose that is correct but flabby, a paragraph that
reads twice as long as its content. Each mechanic below is the smallest version
of its source's teaching, with rewrites in this publication's own subject
matter. Apply them in order — structure first, then trimming — and stop at the
clearest version, not the shortest. Trimming never licenses packing three ideas
into one line; if a cut makes the sentence denser instead of plainer, undo it.

## Williams: characters as subjects, actions as verbs

*Style: Lessons in Clarity and Grace.* A sentence reads clearly when the actor
is the grammatical subject and the action is the verb — not a nominalization
(the noun form of a verb: "perform an evaluation" for "evaluate"). Passives and
nominalizations hide who does what; un-hiding them is the single
highest-leverage edit.

Before: "Eviction of the hot working set is caused by execution of large
analytical scans on the primary."
After: "One analyst's five-year scan evicts the hot working set."

Williams's second law: old before new. Start the sentence from what the reader
already holds; end on the news. English stresses sentence endings, so the new
information lands where the emphasis already is.

Before: "A 2-3x sequential-scan improvement is what io_uring delivers, according
to the Postgres 18 benchmarks."
After: "The Postgres 18 benchmarks show io_uring delivering sequential scans
2-3x faster." (Known context — the benchmarks — first; the news carries the
stress.)

## Zinsser: strip the clutter

*On Writing Well.* Verbosity is the enemy of clarity; the clearest sentence is
the smallest one that survives. Every word defends its place: qualifiers
("very", "quite", "somewhat"), filler phrases ("when it comes to", "in terms
of", "the fact that"), and double-said ideas go first.

Before: "In terms of durability, it is worth noting that the WAL is quite
central to the way in which crash recovery is actually performed."
After: "Crash recovery replays the WAL."

One thought per sentence. A sentence carrying two ideas splits; a paragraph
carrying two points splits. Compression is deletion, not abbreviation — the
surviving words stay plain.

## Strunk & White: definite, positive, brief

*The Elements of Style.* Three rules earn their keep here: omit needless words;
make definite assertions (say what is, not what is not); put statements in
positive form.

Before: "It is not uncommon for teams to fail to notice that replication lag is
not always negligible."
After: "Replication lag surprises teams routinely."

## Fowler: the read-aloud test and the emphasis budget

Two bliki entries operate as standing checks:

- **Say Your Writing** (https://martinfowler.com/bliki/SayYourWriting.html) —
  read the passage aloud; if it does not sound like you explaining the idea to
  a colleague, rewrite until it does. Corporate boilerplate cannot survive
  being spoken.
- **Excessive Bold** (https://martinfowler.com/bliki/ExcessiveBold.html) —
  emphasis is zero-sum; bolding much means bolding nothing. The budget: a term
  at its definition, plus at most one must-survive-a-skim sentence per screen.

## The clarity pass, worked once

The mechanics compose. One paragraph, three passes:

Draft: "It should be noted that the utilization of read replicas can
potentially provide significant benefits with regard to the scalability of
read-heavy workloads, although there are some caveats that need to be taken
into consideration around consistency."

Pass 1 — actors and actions (Williams): "Read replicas scale read-heavy
workloads, but they introduce consistency caveats."

Pass 2 — clutter (Zinsser): "Read replicas scale reads; the price is
consistency."

Pass 3 — ground it (SKILL.md, numbers over adjectives): "Read replicas scale
reads; the price is lag — replicas serve stale data until the log catches up,
milliseconds normally, unbounded under load."

The paragraph shrank 60 percent and gained a fact. That trade is the norm, not
the exception.

Sources: Joseph M. Williams, *Style: Lessons in Clarity and Grace* · William
Zinsser, *On Writing Well* · Strunk & White, *The Elements of Style* · Martin
Fowler's writing tag: https://martinfowler.com/tags/writing.html
