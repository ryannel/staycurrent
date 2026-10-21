# Editorial review · article · Relational databases; Making concurrent changes correct · ArticleversionA-r02

Review started: 2026-10-21 21:10:57 UTC  
Review completed: 2026-10-21 21:14:39 UTC

Inputs read:

- The assigned review instructions at `/private/tmp/staycurrent-skills-night-a-repair/.agents/skills/staycurrent-review/SKILL.md` and its `perspectives/editorial.md`.
- [Relational databases](http://127.0.0.1:4341/review/relational-trial-3/), in full: introduction, navigation, body, captions, labels, expanded text alternatives and query listings, sources and collection navigation. Read all five steps in each stock-change option.
- [Making concurrent changes correct](http://127.0.0.1:4341/review/relational-trial-3/transactions/), in full: introduction, navigation, body, captions, labels, expanded text alternatives, listings and complete starting schema, sources and onward navigation. Read every step in both options of each of its three scripted figures, including the fifth Serializable step.
- All three fixed rendered references in full: [Sequence diagrams](http://127.0.0.1:4341/review/examples/sequences/), [Indexes](http://127.0.0.1:4341/review/examples/indexes/) and [Storage and durability](http://127.0.0.1:4341/review/examples/storage/). Also expanded and read the sequence reference's message alternatives and Mermaid listings.
- Intended audience: an intelligent newcomer progressing towards expert practice.

The assigned version and preview were treated as fixed. No plans, commission notes, earlier versions, reviews, findings, decisions, repair narratives, author notes, proposals or coordinator opinions were read. The main workspace served only as the report destination. This is the full editorial review of candidate A, not a focused repair check.

Highest severity: medium

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Titles and headings | pass | The article titles and section headings locate the reader in recognisable questions and actions; the shop examples keep the more figurative headings intelligible. |
| 2. Plain sentences | finding | Most sentences directly explain a fact or consequence; “an honest allowance for subsequent change” leaves the reader to translate the instruction (editorial-12). |
| 3. Terms | finding | Core database terms are generally introduced before use, but testing and request vocabulary slips through untranslated (editorial-10). |
| 4. Openings | pass | Explanatory sections open with a fact, problem or concrete variation that motivates what follows. The introduction's task navigation is appropriately instructional. |
| 5. Reader-facing text only | finding | Two linked-article handoffs use ownership language that sounds like an allocation of writing responsibilities (editorial-13). The evidence and model limitations otherwise help readers interpret the examples. |
| 6. Captions and labels | pass | Captions identify the displayed state and distinguish models from execution; labels identify the alternatives. The scripted step text consistently distinguishes pending work from committed tables. |
| 7. One piece | finding | The main explanations build coherently, with no pervasive generic or AI-sounding voice. One paragraph interrupts the first atomicity explanation with a succession of unrelated exceptions (editorial-11). |

## Findings

### editorial-10 · medium · Both articles · unexplained testing and request vocabulary

Problem: The introduction says that Working with SQL develops its report “in its own resettable fixture”, without explaining a fixture. The transaction article later offers a bundle containing “the shared fixture” and refers to an application protocol around “pending work, payload matching and retained results”. The earlier sentence about checking the owner and requested action is concrete; “payload matching” replaces that description with an unexplained specialist label.

Effect: A newcomer who has followed the definitions of tables, keys, snapshots and transactions must now supply meanings from software-testing and request-processing practice. In the introduction, “resettable fixture” also obscures what the linked article actually lets them do.

Suggestion: Say that the SQL article starts with example tables and rows the reader can reset. Introduce “fixture” only if the name will be useful later. Keep the request explanation in terms of checking that a repeated request contains the same customer and requested action, or define the request's payload before using that word.

Evidence: [Relational databases, “Ask for an answer and check its shape”](http://127.0.0.1:4341/review/relational-trial-3/#ask-for-an-answer-and-check-its-shape); [transaction article, “A missing reply leaves an unknown outcome”](http://127.0.0.1:4341/review/relational-trial-3/transactions/#losing-the-reply-does-not-prove-rollback) and [worksheet instructions](http://127.0.0.1:4341/review/relational-trial-3/transactions/#check-the-argument-with-competing-sessions-and-failures). These terms have no preceding definition in the rendered articles.

### editorial-11 · medium · Making concurrent changes correct · final paragraph of “Keep ownership and the counter together”

Problem: The paragraph beginning “Rollback here restores transactional table changes” moves from restoring a failed booking to PostgreSQL's number-generating sequences, gaps in identifiers, schema-changing commands, and MySQL's implicit commit for ALTER TABLE. Neither allocating sequence numbers nor changing the schema is part of the booking just shown. This passage reads as a later collection of exceptions to the rollback explanation.

Effect: The reader has just seen why the counter and reservation belong in one transaction and is about to learn the constraints that reject the duplicate booking. Instead, they must set that problem aside, process two new kinds of operation and another engine, then recover the original thread. The specific lessons are useful, but their placement makes the section feel assembled around qualifications.

Suggestion: Keep this point in the main flow to what rollback means for the booking's two table changes. Put the sequence-number exception with generated identifiers, and the schema-command exception with engine-specific transaction boundaries, or give those exceptions a clearly motivated optional note after the booking argument is complete.

Evidence: [“Keep ownership and the counter together”](http://127.0.0.1:4341/review/relational-trial-3/transactions/#put-the-complete-change-inside-a-boundary), between the savepoint explanation and “Give the database the rules it can enforce”. The preceding example uses explicit R10 and R11 identifiers and performs no schema change. The reference articles generally introduce a variation by stating the concrete question it changes before asking the reader to follow it.

### editorial-12 · low · Making concurrent changes correct · interpreting the conditional statement's result

Problem: “If the application needs to distinguish those reasons, it needs a separate read and an honest allowance for subsequent change” is an abstract instruction. “Honest allowance” does not tell the reader what they should say or assume after that read.

Effect: The reader must infer that a later query reports the state at a later moment and cannot necessarily explain why the earlier update returned no row. The surrounding explanation is concrete enough that this phrase is a noticeable change in register.

Suggestion: State that limitation directly, using the class example: a later read can show whether the class exists or has places now, but another transaction may have changed it since the failed attempt.

Evidence: [“Change the current row only while a place remains”](http://127.0.0.1:4341/review/relational-trial-3/transactions/#express-a-change-and-its-condition-together), first paragraph after the decrement-and-insert listing.

### editorial-13 · low · Both articles · linked-article handoffs

Problem: “Changing a live database owns that compatibility sequence and its interruption plan” and “Recovering database requests safely owns that protocol” describe the linked articles as owners of work. This sounds like an editorial assignment rather than telling the reader what they will learn there.

Effect: The reader briefly encounters the organisation of the writing project instead of a direct account of the linked explanation. “Owns” also sits awkwardly alongside the articles' real operating and application owners, who are people responsible for the service.

Suggestion: Use a reader-facing verb such as “explains” or “works through”, followed by the concrete task the linked article covers.

Evidence: [Relational databases, “Complete the application request”](http://127.0.0.1:4341/review/relational-trial-3/#complete-the-application-request); [transaction article, “A missing reply leaves an unknown outcome”](http://127.0.0.1:4341/review/relational-trial-3/transactions/#losing-the-reply-does-not-prove-rollback).

## Limits

- This is an editorial reading, not a technical verification, execution audit or visual review. I did not run the worksheet, inspect implementation source, validate external primary sources or test deployment claims. References to native observations were judged as words the reader encounters, not independently established results.
- All current candidate figure alternatives and all their scripted steps were read through the rendered controls. Reference articles were read in full with their rendered prose, captions, labels and listings; their many interactive combinations were not exhaustively replayed as a controls test.
- Judgements that a passage reads as a patch concern its effect in the current article. No claim is made about when or why it was written.
- No article edits, builds, servers, subagents, commits or pushes were performed.
