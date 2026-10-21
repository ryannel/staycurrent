# Editorial review · article · Relational databases; Making concurrent changes correct · 26811e2

Inputs read: Both finished pieces in full at `http://127.0.0.1:4333/review/relational-trial-3/` and `/review/relational-trial-3/transactions/`, including captions, tables, listings, expanded disclosures and every scripted step in both options of their interactive figures. Intended audience: intelligent engineers new to relational databases, progressing towards expert practice with minimum reader effort. All three reference articles read in full as rendered at `/review/examples/sequences/`, `/review/examples/indexes/` and `/review/examples/storage/`, including their rendered figures, captions and controls. Review skill and editorial perspective read from the working files specified to match 005ab6f. Withheld: article source, plans, registry, writing and repair notes, prior versions, reports, decisions, results and other perspectives.

Highest severity: medium

## Checks

| Check | Result | Note |
| --- | --- | --- |
| Titles and headings | pass | Both titles and the section headings identify concrete questions or actions in familiar language. |
| Plain sentences | finding | A shortlist fragment and the phrase “correct logic alone” require interpretation. |
| Terms | finding | “Fixture” and “payload matching” arrive without explanations for this audience. |
| Openings | finding | “Restart the decision” opens with an instruction before explaining why the earlier decision must be reconsidered. |
| Reader-facing text only | pass | Provenance and model limitations explain the status of evidence; no editing history appears in the articles. |
| Captions and labels | pass | Captions identify states, omitted work and model boundaries; controls clearly name the alternatives they change. |
| One piece | finding | A rollback caveat interrupts the booking argument, reading-order advice conflicts, and one identity reminder reads as an inserted correction. |

## Findings

### editorial-8 · medium · Making concurrent changes correct · “Keep ownership and the counter together”, final paragraph

Problem: After explaining why rolling back only the failed insert would preserve a bad decrement, the paragraph switches to “Here R10 and R11 are supplied identifiers and the tables already exist” and then to number generation, table-definition changes and PostgreSQL sequences. None of those operations occurs in the booking just explained. This passage reads as a later patch to qualify rollback.

Effect: The newcomer must leave the ownership-and-counter argument to consider two new categories of operation, then return to booking constraints without using either category.

Suggestion: Keep the booking argument continuous. Place the exceptional rollback rules in an optional, clearly motivated note beside the runnable fixture or a later discussion of generated identifiers.

### editorial-9 · medium · Relational databases · “Find your next question” and “Read the collection”

Problem: The opening navigation says that branches provide direct entrances and “the walkthrough is not a prerequisite for every investigation”. The closing navigation says “Start with this introduction. Then read each longer article before the shorter articles that follow from it.” That unqualified sequence withdraws the earlier permission to enter by task.

Effect: A reader using the collection for a particular incident must decide which reading instruction to trust and whether the earlier shortcut omitted required knowledge.

Suggestion: Make the closing sequence explicitly the recommended first-learning path, while retaining the task-based entrances already offered above.

### editorial-10 · medium · Both pieces · SQL hand-off and uncertain-outcome discussion

Problem: Relational databases describes the linked SQL article’s “own resettable fixture” without explaining fixture. Making concurrent changes correct says the request key needs a protocol around “pending work, payload matching and retained results”; payload has not been introduced. The latter phrase compresses an otherwise concrete explanation back into specialist vocabulary.

Effect: A newcomer must supply the meaning of the prepared test data and of matching a repeated request’s contents, despite the surrounding examples providing ordinary words for both.

Suggestion: Say “resettable example database” or briefly define fixture; replace or explain payload matching as checking that the repeated request names the same customer, class and action.

### editorial-11 · low · Relational databases · “Choose a system you can test”, Distributed relational service entry

Problem: “Keep conditional on a demonstrated need to spread ownership or survive a specified wider failure while working” has no explicit object for “keep conditional”, and “while working” leaves the reader to infer that the service must remain available during the failure.

Effect: The reader has to reconstruct the recommendation before comparing it with the two plainly stated deployment options.

Suggestion: State the candidate and requirement directly: shortlist a distributed service when the shop has demonstrated a need to divide write ownership or continue serving during a specified wider failure.

### editorial-12 · low · Making concurrent changes correct · “Protect a decision spanning several rows”, complete-repair paragraph

Problem: “That is the complete repair: correct logic alone, all relevant writers under Serializable, and fresh reads and decisions after abort.” Here “correct logic alone” appears to mean logic that is correct when executed alone, but can initially read as saying that correct logic is sufficient by itself.

Effect: A brief ambiguity lands on the sentence meant to consolidate the protection’s requirements.

Suggestion: Say “logic that preserves the rule when run alone”, or otherwise make the intended serial baseline explicit.

### editorial-13 · low · Making concurrent changes correct · “Restart the decision”, opening

Problem: The subsection begins “For a known deadlock or serialisation abort, roll back and reconsider the whole transaction: reads, calculations, decisions and writes.” It gives the instruction before stating why the earlier decision can no longer be reused; the next sentence instead explains the failed-transaction state.

Effect: A reader gets the recipe before the reason that distinguishes whole-decision restart from merely clearing the error.

Suggestion: Open with the consequence of the competing work for the earlier reads and decision, then give the rollback-and-restart instruction.

### editorial-14 · low · Relational databases · “Complete the application request”, third paragraph

Problem: “Keep Tariq’s losing 104 distinct from Mina’s repeated 103” interrupts the application’s retry argument with an instruction about remembering the example. Tariq has not appeared in this section, and the surrounding sentences already explain why a new identifier would create another order. This sentence reads as an inserted correction to a confusion the prose has not raised.

Effect: The reader briefly returns to the earlier stock race instead of following the single uncertain request.

Suggestion: Remove the reminder, or connect the distinction to an actual decision the retry protocol must make at this point.

## Limits

This was an editorial review, not independent technical verification. No native worksheet, database experiment, build or test was run. Reference figures were read in their rendered default states with their full surrounding explanations; their alternative animations were not exhaustively played. Both commissioned pieces’ figure alternatives were stepped through in full, without timed playback. No screenshots or auxiliary evidence files were needed. The created Chrome tab was closed and the browser runtime reset; the shared preview was left running.

UTC start: 2026-10-21 20:09:22. UTC end, including report and cleanup: 2026-10-21 20:13:16 (3 minutes 54 seconds).
