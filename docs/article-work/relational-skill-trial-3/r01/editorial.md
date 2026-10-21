# Editorial review · article · a00 Relational databases; a03 Making concurrent changes correct · 80276a4

Inputs read: both finished articles as rendered at `http://127.0.0.1:4333/review/relational-trial-3/` and `/review/relational-trial-3/transactions/`, including captions, labels, code, expanded text alternatives and schema, and every step of both a00 interactive histories and all six a03 interactive histories. Read all three reference articles in full as rendered at `/review/examples/sequences/`, `/review/examples/indexes/` and `/review/examples/storage/`, including their figures, tables, code, captions and controls. Intended audience: intelligent engineers new to relational databases, working towards expert practice with minimum reader time and effort. Applied the editorial perspective and report instructions in `.agents/skills/staycurrent-review/SKILL.md` and `perspectives/editorial.md`. Withheld: plans, registry, example records, writer notes, work records, prior versions, earlier reports, decisions, results and other perspectives.

Highest severity: medium

Review started: 2026-10-21 19:28:11 UTC  
Review ended: 2026-10-21 19:32:39 UTC  
Duration: 4 minutes 28 seconds (268 seconds)

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Titles and headings. | pass | Both titles and the section headings identify the subject or decision in ordinary words; the class and shop examples make their action headings concrete. |
| 2. Plain sentences. | finding | Most explanations are direct; a00 occasionally describes linked articles through editorial ownership rather than saying what the reader can learn there (editorial-3). |
| 3. Terms. | finding | The principal database terms are introduced and used consistently. The final sentence of a00 Figure 1 introduces stock reservations before the walkthrough has explained reserving stock (editorial-1). |
| 4. Openings. | finding | Most sections begin with a fact or a concrete situation. Two a00 openings begin with directions before explaining their reason (editorial-4). |
| 5. Reader-facing text only. | pass | The provenance and worksheet instructions help the reader distinguish models from observations and reproduce the examples; no editing history or writer instructions appear. |
| 6. Captions and labels. | finding | Captions generally identify the data and visible state. In a03 Figure 1 the first-request lane changes to actions belonging to the second request (editorial-2). |
| 7. One piece. | finding | The main arguments are coherent. The final sentence of a00 Figure 1's caption answers an unexplained objection about additional reservations and reads as an appended qualification (editorial-1). |

## Findings

### editorial-1 · medium · a00, Figure 1 caption, final sentence

Problem: “This view omits dates and historical rows, not additional stock reservations” introduces stock reservations before the reader has learnt that accepting the pending order reserves its items. The rest of the caption has already explained that the order and line tables show only 103 while payments show earlier orders. The final sentence then defends the picture against an objection the reader has not been given a reason to raise.

Effect: A newcomer has to infer what a stock reservation is, whether it ought to be another table in this first schema picture, and why its absence matters. This interrupts the explanation of keys and relationships with an unexplained qualification about the later purchase protocol.

Suggestion: Keep this caption focused on the rows and relationships it displays. Establish any necessary assumption about other reservations when the stock-reservation protocol is introduced, using the terms defined there.

### editorial-2 · medium · a03, Figure 1, “Mina's request” and “Mina's second request” lanes, steps 3–4 in both options

Problem: The two lane headings distinguish Mina's request from her second request. The first lane initially says “Mina: ready to book R10”, then “R10 committed”. At step 3 it switches to “Second decrement committed” or “Second decrement pending”, while the second lane says “R11 not yet inserted”. At step 4, “R11 rejected: duplicate customer” is also in the first lane. The prose explicitly identifies R10 as the first booking and R11 as the second click, but the stable lane headings no longer identify whose work their text describes.

Effect: The reader must abandon the first/second-request distinction and infer that one lane has become the current operation and the other a second status field. In the illustration intended to explain transaction boundaries, the labels make it harder to track which request owns the decrement and rejection.

Suggestion: Keep R10's completed state in the first-request lane and put R11's decrement, rejection and rollback in the second-request lane. Alternatively, if the two boxes are intended to show different aspects of one current request, label those aspects explicitly.

### editorial-3 · low · a00, “Complete the application request” and a03, “A missing reply leaves an unknown outcome”

Problem: The links are followed by “Changing a live database owns that compatibility sequence and its interruption plan” in a00 and “Recovering database requests safely owns that protocol” in a03. “Owns” describes how the publication assigns subjects between articles, rather than plainly saying what the linked article explains or enables the reader to do.

Effect: The reader can infer the intended meaning, but has to translate an editorial ownership metaphor at the point where a clear next reading would suffice.

Suggestion: Describe the useful explanation or worked procedure available in each linked article directly.

### editorial-4 · low · a00, openings of “Find your next question” and “Choose a system you can test”

Problem: The sections open with “Read the walkthrough continuously for a first working model” and “Choose an engine and an arrangement for running it together”. Both begin by directing the reader. The second is especially compressed: the reason engine and deployment must be considered together emerges only from the candidate descriptions that follow.

Effect: The reader is asked to adopt the reading or evaluation procedure before being told the useful fact that makes it the right procedure. This is a small departure from the otherwise concrete, explanatory openings.

Suggestion: Lead with what the walkthrough supplies or why an engine's suitability depends on how it is run, then give the reading or evaluation instruction.

## Limits

This is an editorial review of the rendered words, not an independent validation of the technical claims, linked child articles or downloadable worksheet. Reference-article figures were read as benchmarks, including their visible diagrams, labels and accompanying explanations; their full combinations of interactive controls were not exhaustively enumerated. Both current articles' interactive histories were enumerated, including the fifth Serializable restart step. No browser panes were assumed to be visible to the user: this review used the browser's rendered text and screenshots. No prose or implementation was edited, and no server was started.
