---
name: staycurrent-review
description: Independently review and repair Stay Current articles for factual support, explanatory and writing quality, and the meaning and behaviour of their media. Use for substantive editorial review, sequential read-throughs of articles or collections, or before marking an agent-produced article ready as a draft.
---

# Discover what the page actually teaches

The aim is a trustworthy, coherent explanation an unfamiliar reader can follow.
Review should reveal where the page fails that reader and help the author repair
it. A count of checks, reviewers or revisions cannot establish quality.

For depth reviews, distinguish a missing mechanism, a missing consequence and an
already complete explanation. Preserve the last of these. For practical collections,
review the lesson and the article together: does the experiment expose the actual
decision the article teaches, and can the reader interpret its result? The authoring
skill's [depth and experiments reference](../staycurrent-authoring/references/depth-and-experiments.md)
records examples from the relational review. It is coordinator context, not material
to give an uncued reader before their first interpretation.

For a read-through commission, use [first-reading guidance](references/first-reading.md)
to establish the actual reading order and preserve questions before diagnosing them.
Keep the requested scope: a reading log and improvement plan do not require article
rewrites. Assess available reading separately from redirects and planned outlines.
The handoff should say what was read, which practical outcomes are supported, and
which repairs would enable a missing step.

**For an assigned blind or isolated-media reading:** use only the supplied reader
artifact, audience and the style skill's
[context-free voice reference](../staycurrent-style/references/blind-review-voice.md).
For a sequential article reading, also use [first-reading guidance](references/first-reading.md),
which contains no article history or expected answers.
The rest of this skill and its case histories are guidance for the coordinator and
informed reviewers. Record the interpretation before receiving intended answers.
An assigned reviewer returns that perspective rather than launching another team.

## Choose useful independent perspectives

For substantive work, commission independent subagents. Technical, editorial and
fresh-reader perspectives have exposed different failures; media design or
accessibility expertise may add more for a particular page. Choose the assignments
to suit the uncertainty. A contributor's self-check can help, but it cannot supply
an independent reading of their own work.

Give informed reviewers the reader outcome and relevant evidence. Give a blind
reader the finished artifact without author history, expected answers or other
findings. Use `staycurrent-style` for editorial judgement and
`staycurrent-research` for source-based claims. The
[review examples](references/protocol.md) describe what these perspectives found
in practice and how to preserve an uncued interpretation of teaching aids.

Give the editorial reviewer an explicit writing judgement alongside the
comprehension judgement. A reader can understand every sentence and still find
the piece laboured. Ask for passages that work and passages that strain, with their
surrounding context and a concrete account of the difference. Read paragraphs and
section transitions in sequence: repeated framing or conclusions
may be conspicuous across a page while seeming harmless in isolation. Prior review
approval and technical completeness do not establish that the prose reads well.

Before seeing the outline, have the informed reviewer state the coverage they would
expect from the subject, audience, title and opening promise. Compare this with the
commission's scope; challenge a mismatch rather than letting a narrow brief excuse
an overbroad article. Preserve these initial expectations before the existing draft
can define what counts as complete.

A general article can be accurate about its example product and still misteach
its subject. Repeated reviews of the relational Storage and Indexes articles checked
PostgreSQL behaviour carefully and never asked whether InnoDB or SQLite would
behave the same; the user noticed that the general articles were PostgreSQL
articles. When the collection is broader than the example, ask a reviewer who
knows another engine which explanations would mislead its users, and whether
product-only detail has a better home in that product's series.

Also ask what someone new to the subject learns from the opening alone: what the
thing is, what it is for, and when they would reach for it. In October 2026 nine
reviewers passed an Indexes deep dive whose opening defined a B-tree index by its
contents and moved straight to page counts; the user noticed on first reading that
it never said what an index is for. Each reviewer had a reason to accept it. The
first sentence did name and define the term, which is what they were checking. The
fresh reader was cast as a backend engineer who already knew what indexes are for,
so the gap was invisible to them. And the coordinator's triage had cut the
motivating example as a spoiler. A subject's purpose is not a spoiler; the
article's findings are. Cast at least one reader as new to the subject, give them
the opening before the rest, and treat a missing purpose as a structural finding,
even in an article labelled a deep dive. Share any resulting suspected gaps with an
uncued reader only after that reader has returned their own observations.

Before the detailed reading, extract the assembled article's heading tree, preserving
levels and order. Read it as a map: what subjects can this audience recognise, how
do they develop, and where would someone return to find a particular explanation?
Compare that tree with the contents navigation. Include component-generated headings,
but identify figure labels and closed optional exercises so they are not mistaken
for the main argument. Look for a flat sequence that hides a worked example or
comparison, vague directions that conceal the subject, and headings whose scope
does not contain their children. Familiar technical names can make useful landmarks.
If the map does not give a useful overview or support navigation, record a structural
repair before judging the article ready; correct examples do not compensate for it.

Also compare the addition with equivalent sections and collection entrances on
the surrounding site. A page can read well in isolation while introducing an
inconsistent name or reading path. Check whether headings, section roles and onward
links give equivalent destinations equivalent treatment, and whether choice labels
answer the page's framing question. Verify what the linked pages actually offer:
similar wording must not conceal different roles or imply that planned reading is
available. The style skill's object-storage and relational link example illustrates
this comparison. Record a mismatch with its neighbouring example and the reader
expectation it disrupts; repair incidental drift while retaining differences that
serve the subject. For an uncued reader, preserve the first reading before supplying
these comparisons or prior editorial findings.

Use the tree to assess technical completeness as well as navigation: given this
article's subject and promise, what important explanation would you expect to find
that has no apparent place? Test the expectation against the actual body and, where
relevant, technical sources. Heading presence is not evidence of depth, and heading
absence is not evidence that the teaching is missing. Distinguish an explanation
that is complete but hard to find, a named topic without enough reasoning, an absent
essential explanation, and a deliberate boundary with adequate orientation and
onward reading. Look especially for omissions that leave a recommendation,
mechanism or practical outcome unsupported; a correct happy path can still leave
the promised task unfinished.

Build that expectation as a tree, the way the authoring skill does: the subtopics a
working engineer needs from the subject, then the parts each of those needs, before
reading the article's own outline. Then judge every part by the attention it gets.
Does the reader come away able to use it, or is it named, thin or missing? Uneven
length between sections is not itself a finding. Uneven attention is: a topic that
deserves subsections and a figure but gets a paragraph, or a deep section whose
neighbours were left thin. In October 2026 a coordinator cut a full point-in-time
recovery section back to match its neighbours; the user wanted the neighbours
brought up to its standard instead.

For each consequential coverage finding, record the expected understanding, why
this article owes it to the reader, the passage or verified destination checked,
and the smallest sufficient repair. This might be a paragraph, a clearer heading,
a new section, a substantive linked article or an honestly narrower promise.
If the commission requires that coverage, complete it; narrowing the title must not
quietly reduce the requested work. Verify a linked article's relevant explanation
rather than accepting its title; a planned page cannot discharge a current teaching obligation. Resolve essential
gaps before readiness and record useful extensions separately. Do not turn the
check into a topic inventory, section quota or requirement to cover the whole field.
Keep coverage findings distinct from factual correctness and heading usability in
the review record so success in one cannot stand in for the others.

Then read the transitions and sections against that map. A new parent heading can
group examples, but its opening must explain what they investigate and how they
connect to what came before. Check when the reader moves from explanation into a
worked case, from one outcome to another, or into a new example. Do not automatically
add a preface to every section or impose a fixed hierarchy: repair the relationships
the actual argument needs. Preserve a concise heading tree and any consequential
navigation or transition findings in the review record.

Review the relationship between each heading and its section. Before reading a
section, state what its heading leads this audience
to expect, using only the preceding context. Afterwards, compare that expectation
with what the section actually explains. Check whether the opening establishes the
named subject and whether the section develops it. Being able to invent a connection
after reading is not evidence that the heading helped the reader find or anticipate
the explanation. An unclear referent or a misleading label is an editorial finding
even when the body is understandable. Record the mismatch and a concrete alternative;
retain headings that already work. This is a semantic judgment, not a word-matching
test or a requirement that every heading use the same grammatical form. After body
repairs, revisit affected headings and contents labels; after heading repairs, reread
their openings. The transaction example in `docs/writing-style.md` records the
specific failure behind this guidance.

The opening deserves attention in its own right. A reader's account of what they
understand at that point can reveal a gap that disappears when an expert considers
the finished article. Useful evidence distinguishes what the passage has explained
from what it has made interesting or promised to explain. The first section then
shows whether that beginning prepared the reader for the next thought.

The Indexes example in `docs/writing-style.md` records why this distinction mattered:
the customer story was easy to follow, yet the user still lacked an introduction to
the subject. The successful direction explained what the index held and how its
arrangement helped find orders. When similar feedback recurs, consider the brief's
picture of the reader as well as the sentences. More polish may leave the same
assumption intact.

Ask for consequences, not a checklist of preferences. Where did understanding fail?
What unsupported promise could lead someone to a wrong decision? What does the
reader now understand well enough to apply elsewhere? Judge the article's own job,
not everything that might eventually belong in its collection.

For substantive teaching articles, include an independent top-to-bottom reading
that records questions at the point they arise, before an overall verdict. Give
this reader the audience and finished artifact without the author's intended
answers. [First-reading guidance](references/first-reading.md) describes how to
preserve those observations and distinguish productive curiosity from a gap that
prevents following the argument. It also captures mental work that a teaching aid
could ease and deeper questions that may deserve onward reading. This can be the fresh-reader assignment rather
than an additional reviewer. Later explanations should resolve recorded questions,
not erase the evidence that readers needed an answer earlier.

For a series, follow the learning across the actual pages as well as reviewing each
piece. Keep one sequential reader across the journey; independent reviews of separate
pages do not reveal what that reader has learned when they arrive. Track introduced
concepts and deliberate changes of example, including what is only available in an
optional disclosure. A blind agent still has expert knowledge and may silently
complete an omitted explanation. Ask how a reader could reach a consequential conclusion from specific
passages, and what knowledge the reviewer supplied themselves. The
[learning-sequence examples](references/protocol.md#follow-the-learning-across-pages)
show gaps in prerequisites, code interpretation, apparent exceptions and unfinished
examples. Use these as prompts for judgement, not a demand to cover every related
topic or a claim that agent review reproduces a novice's experience.

For operational examples, ask the reader to locate the code in a running system
before interpreting its result. Who sends this statement, on which connection or
process, and who decides what to send next? Trace one successful response and one
consequential alternative. An expert can understand an isolated fragment while
silently supplying its caller, transaction or error handler. Record that supplied
context rather than treating executable syntax as evidence of a complete explanation.

When a main article and its supporting pieces show full and abridged versions of
an operation, trace the same consequential outcomes through both. Shortening a
condition or removing a branch can silently weaken the promise even when each
version looks reasonable in isolation. The repair may be a better helper contract
or a clearer handoff, rather than another complete implementation.

## Turn findings into a better explanation

Keep enough of each independent reading to understand what the reviewer actually
saw. Preserve disagreement between understanding a passage, adapting its example,
and judging its technical completeness. Agreement is not a condition for a useful
finding. For media, first ask what the aid communicates on its own. If that differs
from its purpose, reveal the intention and invite ideas for improving, replacing
or removing it. A fresh reading of a meaningful revision tells us more than an
informed reviewer now recognising the intended answer.

Use evidence and editorial judgement to resolve findings. A misreading may expose
the explanation, an inaccurate assumption, or both. Preserve useful disagreement.
Repeated difficulty is a reason to reconsider the approach; it is not a signal to
keep polishing wording until a review count has been reached.

Recheck what changed and anything that depends on it. The scope of that recheck
should follow the repair: a new narrative needs another reader, while a contrast
adjustment may need a rendered inspection. Actual browser and example checks
complement agent comprehension; neither substitutes for the other.

After substantive repairs, have the editorial reviewer reread the assembled piece
for flow and voice, including changed captions and supporting copy. Checking each
finding as resolved can miss new repetition or qualifications added by several
reviewers. If an edit improves the voice by removing detail, verify that it has not
removed a condition the reader needs. Record the writing judgement separately from
technical and comprehension findings, with passage evidence and remaining doubts;
a count of edits or a declaration that it sounds human is not evidence.

Leave a concise record in the article's existing review notes: consequential
findings, decisions, evidence, the revision checked and remaining uncertainty.
`ready as a draft`, `repair required`, and `blocked` are useful handoff labels,
with an explanation of what they mean for this piece. Unresolved material problems
remain visible. Passing review is evidence of work done, not a guarantee of quality
or permission to publish.
