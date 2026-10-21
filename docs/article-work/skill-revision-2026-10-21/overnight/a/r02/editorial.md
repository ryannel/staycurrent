# Editorial review · article · a00 and a03 · A-r01

Started UTC: 2026-10-21 20:57:10
Completed UTC: 2026-10-21 21:00:25

Inputs read: the candidate-A `staycurrent-review/SKILL.md` and `perspectives/editorial.md` from `/private/tmp/staycurrent-skills-night-a-repair`; the complete rendered [a00, Relational databases](http://127.0.0.1:4341/review/relational-trial-3/) and [a03, Making concurrent changes correct](http://127.0.0.1:4341/review/relational-trial-3/transactions/), including their expandable text and code, and every step in both options of their scripted figures; the complete rendered reference articles [Sequence diagrams](http://127.0.0.1:4341/review/examples/sequences/), [Indexes](http://127.0.0.1:4341/review/examples/indexes/) and [Storage and durability](http://127.0.0.1:4341/review/examples/storage/). Intended audience: an intelligent newcomer progressing towards expert practice. Plans, earlier reports, repair narratives, author notes and coordinator opinions were withheld and were not read. This is a fresh whole-article review, not a check of particular repairs.

Highest severity: medium

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Titles and headings | pass | The titles identify the subject; section headings generally name a recognisable question or action grounded in the examples. |
| 2. Plain sentences | finding | Most sentences are direct; a03 compresses predicate tracking, and one a00 candidate description needs decoding (editorial-7, editorial-9). |
| 3. Terms | finding | Core database terms are usually introduced when needed; a03 repeatedly relies on an unidentified “native worksheet” before explaining the artefact (editorial-6). |
| 4. Openings | pass | Explanatory sections establish a fact or problem before asking the reader to act; navigation and practical instructions have an evident purpose. |
| 5. Reader-facing text only | pass | No planning instructions, editing history or author notes appear; evidence descriptions are relevant to the reader, although the worksheet needs introducing. |
| 6. Captions and labels | pass | Captions identify examples and model limits; the figure options and step text explain what changes and distinguish pending work from committed state. |
| 7. One piece | finding | Both pieces sustain their examples, but a00 briefly inserts an unrelated access-control statement into its recovery argument (editorial-8); a03's recurring worksheet references also interrupt the explanation (editorial-6). |

## Findings

### editorial-6 · medium · a03, “Change the current row only while a place remains” through “Lock the fact on which every writer can meet”

Problem: The article starts referring to “the native worksheet” as though the reader already knows what it is. The first reference is “This behaviour was observed in the native worksheet”; the uniqueness example adds “In our worksheet it did.” The counting example then depends on “the worksheet’s stated variation”. Only near the end does the reader learn that the worksheet is a downloadable bundle with an executable test script, fixture and SQL.

Effect: A newcomer has to hold an unidentified artefact in mind, guess whether “worksheet” means a document, an interactive exercise or an executable experiment, and accept a reference to its “stated variation” without having encountered that statement. The concrete explanation briefly becomes a report about work performed elsewhere.

Suggestion: Introduce the downloadable experiment at its first mention, with a concise description and a link to the running instructions. State the changed starting conditions directly in the counting example. Keep later evidence references short and subordinate to the explanation.

Evidence: [Conditional change section](http://127.0.0.1:4341/review/relational-trial-3/transactions/#choose-protection-for-the-invariant-you-actually-have), [counted-reservation section](http://127.0.0.1:4341/review/relational-trial-3/transactions/#coordinate-decisions-that-span-several-rows), and the eventual bundle introduction in [Test the schedule that could break the rule](http://127.0.0.1:4341/review/relational-trial-3/transactions/#check-the-argument-with-competing-sessions-and-failures).

### editorial-7 · medium · a03, “Protect a decision spanning several rows”, paragraph introducing serialisation failures

Problem: “Its tracking covers predicates, the conditions selecting rows, whose results future rows might change; it detects dangerous combinations rather than making every matching insertion wait” compresses a definition, the effect of future rows, the detection mechanism and a locking comparison into one sentence. “Whose results future rows might change” is particularly difficult to attach on first reading, while “dangerous combinations” does not say which combination the reader should picture.

Effect: Just after learning write skew and the serialisation-failure code, the reader must stop the instructor example and unpack another abstract mechanism. The sentence demands more background knowledge than the surrounding explanation has supplied.

Suggestion: Separate the definition from the consequence. Relate the selecting condition to the instructor count the reader has just seen, then explain in a separate sentence that dependency checking can reject a transaction rather than blocking each matching insertion. Keep only the mechanism needed for this argument; the linked isolation article can develop the rest.

Evidence: [Protect a decision spanning several rows](http://127.0.0.1:4341/review/relational-trial-3/transactions/#a-repeatable-view-does-not-by-itself-prove-the-rule), immediately after the write-skew explanation and before Lena’s Serializable listing.

### editorial-8 · low · a00, “Recover the right state”, final paragraph

Problem: “Access control limits who can read or change data; the operating owner also needs to detect failures and respond” interrupts an argument about restoring the right orders and assigning recovery responsibility. It introduces security and detection without connecting either to the restore example, then immediately returns to managed backups and checking recovered facts.

Effect: The sentence reads like an extra coverage reminder. The reader briefly has to infer why these two responsibilities have appeared here.

Suggestion: Connect permissions and detection to this recovery procedure with a concrete consequence, or place the broader operating responsibilities in the description of the linked operations article.

Evidence: [Recover the right state](http://127.0.0.1:4341/review/relational-trial-3/#recover-the-right-state), between the restore-rehearsal paragraph and the managed-service responsibilities.

### editorial-9 · low · a00, “Choose a system you can test”, distributed relational service description

Problem: “Keep conditional on a demonstrated need to spread ownership or survive a specified wider failure while working” leaves the object of “keep conditional” implicit and ends with the awkward “while working”. The surrounding SQLite and PostgreSQL entries describe what their arrangements do more plainly.

Effect: The reader has to reconstruct that this candidate belongs on the shortlist only if specified requirements justify it, and that “while working” means continuing to serve through the failure.

Suggestion: Name the candidate and the service requirement directly: explain when a distributed service should enter the comparison and what it must continue doing during the specified failure.

Evidence: [Choose a system you can test](http://127.0.0.1:4341/review/relational-trial-3/#choose-a-system-you-can-test), under “Distributed relational service”.

## Limits

This is the editorial perspective only. It does not independently establish database correctness, the reproducibility of the downloadable experiment, deployment behaviour or production suitability. No sources outside the prescribed editorial inputs were consulted; no earlier report was used. The reference articles were read as editorial standards, not reviewed for findings. Candidate figure wording was read through every option and step, but this was not a visual, accessibility or responsive-layout audit. Findings describe their effect on a first-time reader; references to a passage reading as an insertion do not claim knowledge of its editing history. No article, build or server was changed.
