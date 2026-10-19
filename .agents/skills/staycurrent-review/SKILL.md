---
name: staycurrent-review
description: Independently review and repair Stay Current articles and collections. Covers what a reader actually learns, what the page costs them, factual support, writing quality and the meaning of its media. Use for substantive editorial review, sequential read-throughs, collection audits, or before marking an agent-produced article ready as a draft.
---

# Find out what the page actually teaches, and what it costs

An author can't see their own gaps, because they know what they meant. Review gives
the author independent readings of the finished page, so they can see what it actually
teaches. The measure is the one the article was written to. Does an intelligent reader,
new to the subject, come away with an expert practitioner's understanding of the parts
this article owns, and did the page spend their time well? Findings run in both
directions: something the reader needed and didn't get, and time the page took without
giving anything back. A count of reviewers, checks or revisions establishes neither.

**If you've been assigned an uncued first reading**, work only from the artifact and
audience you were given, with the [first-reading guidance](references/first-reading.md)
and the style skill's
[context-free voice reference](../staycurrent-style/references/blind-review-voice.md).
The rest of this skill describes past articles and their intended lessons, and reading
it would spoil the evidence you're there to provide. Return your own perspective rather
than launching another team.

## Choose perspectives that can surprise the author

For substantive work, commission independent subagents, chosen and scaled to the
uncertainty in front of you: a light, example-led article may need only a fresh reader
and a technical check, while a new deep dive needs more. Each of these perspectives has
caught failures the others missed:

- **A fresh reader new to the subject**, given the opening first and then the rest in
  order, recording questions as they arise. In October 2026 nine reviewers passed an
  Indexes opening that never said what an index is for. The fresh reader had been cast
  as a backend engineer who already knew, and the coordinator had withheld the
  motivating example as a spoiler. A subject's purpose is not a spoiler; the article's
  findings are.
- **A technical reviewer** who follows the claims that carry the argument back to
  primary evidence. When a general article uses one product as its example, add someone
  who knows another major product. Repeated reviews checked PostgreSQL behaviour
  carefully in the general Storage and Indexes articles and never asked whether InnoDB
  or SQLite behaved the same.
- **An editor** who gives a writing judgement as well as a comprehension one: passages
  that work and passages that strain, read in sequence with their neighbours. Every
  sentence can be clear while the piece as a whole is laboured.
- **A sequential reader for a series**, carried across the actual pages, because
  separate reviews can't show what the reader has learned by the time they arrive.

Give informed reviewers the reader outcome, the brief and the relevant evidence. Give an
uncued reader only the finished artifact and audience, with no history, expected answers
or other findings, and make sure their agent doesn't inherit this conversation. An
expert model still brings expert knowledge, so ask every reader which steps they supplied
themselves. For a read-through commission, keep its scope: a reading log and improvement
plan don't require rewrites. The [review examples](references/protocol.md) record what
each perspective found in practice, including how to read a figure or experiment before
anyone explains it.

## What to look for

Before reading the article's outline, say what an expert practitioner in its subject can
do and what this article owes the reader towards that, given its brief and its place in
the coverage map. Then judge each part both ways. Is it taught well enough to use, or only
named, thin or missing? And where does the page spend the reader's time without return:
depth the subject doesn't have, prose where an example would teach faster, or material
from a neighbouring field? In October 2026 two reviews of the sequence-diagram articles
asked only what was missing; the writers added it, and a subject the user expected to fill
one light article grew to four. Uneven length is not a finding by itself, though: a
fuller section may be the standard its neighbours should meet, as the Storage article's
point-in-time recovery section was.

Check the article against its collection's map in `docs/coverage/`. Owned parts should be
taught here, neighbouring parts linked rather than re-taught, and each link should land on
a passage that teaches what it promises; a planned page can't discharge a teaching
obligation. For a collection audit, list what an expert can do before opening the map,
then compare.

Read the opening on its own. What can a newcomer now say the subject is, what it's for and
when they'd use it? Then read the heading tree as a map: can this audience see what the
article covers and where to return for an explanation? Before each section, note what its
heading leads you to expect, and compare afterwards. Compare names, section roles and link
wording with equivalent pages on the site, too, since a page can read well alone and still
break the reading path around it. The style skill covers the judgement behind these.

For worked examples, trace one input to its result, and place the code in a running
system: who sends this, on which connection, and who decides what happens next? For a
practical lesson, check that the experiment exposes the decision the article teaches and
that the reader can interpret its result. Where an article and its companions show full
and shortened versions of the same operation, trace the consequential outcomes through
both. Throughout, ask for consequences rather than preferences. Where did understanding
fail? Which promise could lead someone to a wrong decision? What does the reader now
understand well enough to apply elsewhere?

## Review the teaching medium, not just the supplied artifact

Ask what the reader still has to draw, retain or simulate mentally across the
whole page, including the later cases. A correct table, working Next button or
executed worksheet does not establish that the central mechanism is visible.
Where a consequential choice is taught, change it and ask whether the aid exposes
why the outcome changes. Keep the first prediction and the observed result.
Distinguish a useful static example, a paced reveal, a visual sequence, a causal
model and native execution; none automatically substitutes for another.

For new or substantially changed models, use the [isolated-aid protocol](references/protocol.md#read-teaching-aids-before-explaining-them)
before the assembled-page reading. Check the model's important alternative and
boundary cases against its stated rules and evidence. Inspect what it actually
renders and operate its controls. A source-only review must leave rendered
meaning and interaction explicitly pending. If a central relationship remains
hidden in prose or disconnected panels, record a repair finding even if the
example is factually right. Conversely, require a control only when varying
something improves understanding; remove interaction that makes a simple example
slower. Readiness needs this judgement, not an interaction or reviewer count.

## Turn findings into a better explanation

Keep each reading intact enough to show what the reviewer actually saw, and keep
disagreements visible. For a figure or experiment, record what it communicates on its own
before revealing its purpose. For each consequential finding, record the understanding at
stake, why this article owes it, the passage or destination checked, and the smallest
repair that fixes it. That might be a sentence, a heading, a section, a link to an article
that really teaches it, an honestly narrower promise, or a cut. Repeated difficulty is a
reason to rethink the approach, not to keep polishing the same wording.

Recheck in proportion to the repair: a new argument needs another fresh reader, while a
contrast change needs a look at the rendered page. After substantive repairs, have the
editor reread the assembled page for flow and voice. Fixes from several reviewers can add
repetition and hedging that no single fix shows. If an edit improves the voice by removing
detail, check that it hasn't removed a condition the reader needs.

Leave a concise record in the article's review notes: consequential findings, decisions,
evidence, the revision checked and what remains uncertain. Label the draft `ready as a
draft`, `repair required` or `blocked`, and say what the label means for this piece.
Passing review is evidence of work done; it doesn't guarantee quality or authorise
publication.
