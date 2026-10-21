# Editorial review · article · a00 Relational databases; a03 Making concurrent changes correct · 14e4f89

Inputs read: both finished articles as rendered at `http://127.0.0.1:4333/review/relational-trial-3/` and `/review/relational-trial-3/transactions/`, including their tables, listings, captions, controls and expanded figure descriptions; the intended audience of intelligent engineers new to relational databases, progressing towards expert practice with minimum reader time and effort; all three complete rendered reference articles at `/review/examples/sequences/`, `/review/examples/indexes/` and `/review/examples/storage/`, including figure descriptions, labels, controls and the sequence reference's optional Mermaid listings. Applied the review skill and editorial perspective supplied for skill version `005ab6f`. The checkout reported HEAD `14e4f89b5beb91a4fe19631f10ac1c3c5bc14040`. Withheld: plans, registry, example records, writer and repair notes, earlier versions, earlier reviews and decisions, and other perspectives. No article source files were read.

Highest severity: medium

## Checks

| Check | Result | Note |
| --- | --- | --- |
| Titles and headings | pass | Both titles and the complete heading sequences name recognisable subjects or decisions; the detailed headings retain their connection to the shop. |
| Plain sentences | finding | Most prose is direct; a00's distributed candidate and one evidence-table cell compress their meaning into awkward shorthand (editorial-6 and editorial-7). |
| Terms | finding | Core database terms receive useful first-use explanations; the application-library wording in the final evaluation table needs a plainer statement of the check (editorial-7). |
| Openings | pass | Sections establish the situation or mechanism before asking the reader to act; the brief instructions to return to an example are followed immediately by its relevant facts. |
| Reader-facing text only | pass | No planning instructions, editing history or repair notes appear in the reviewed article bodies. Model and native-run qualifications explain the evidence available to the reader. |
| Captions and labels | pass | Captions identify data, assumptions and model boundaries; the control options identify the alternatives being compared. |
| One piece | finding | a03's detour from savepoints into number generation and table-definition commands interrupts the booking argument (editorial-5). |

## Findings

### editorial-5 · medium · a03, “Keep ownership and the counter together”, final two sentences

Problem: After explaining why rolling back only the failed insert would retain an incorrect decrement, the paragraph changes subject: “Transactional behaviour also has exceptions: PostgreSQL’s number-generating sequences do not give back consumed numbers on rollback. Check commands that change table definitions and number generation against the engine rather than treating all effects as ordinary rows.” Neither number generation nor changing table definitions participates in this booking example. The paragraph introduces both, gives the reader no example of the latter, and then leaves them behind. This passage reads as an added qualification to the atomicity explanation rather than the next part of it.

Effect: A newcomer must interrupt the ownership-and-counter argument to work out whether the displayed reservation identifiers are affected and which of the commands just discussed might be exceptions. The warning leaves that work unresolved before the next subsection begins.

Suggestion: Keep this paragraph on the complete booking change. Put exceptions beside an example that actually uses them, or give a compact, clearly bounded explanation of why the sequence exception does not change the booking's row-level guarantee and omit the unexplained table-definition warning here.

### editorial-6 · low · a00, “Choose a system you can test”, “Distributed relational service” description

Problem: “Keep conditional on a demonstrated need to spread ownership or survive a specified wider failure while working” omits the thing being kept conditional. The closing “while working” also makes the reader reconstruct whether the service, its owners or the evaluation is meant to keep working. The neighbouring candidate descriptions use complete sentences with concrete subjects.

Effect: The reader pauses to turn this shorthand into the intended shortlist decision at the point where the three deployment shapes should be easiest to compare.

Suggestion: Name the candidate and the required continued service explicitly, using the same complete-sentence form as the other two descriptions.

### editorial-7 · low · a00, “What would make this shortlist defensible?”, “Specialist features and ecosystem” row

Problem: The evidence cell asks the reader to check “application-library value conversions”. This compact noun phrase supplies neither the direction of conversion nor an example of the values whose preservation matters. Earlier prose has carefully introduced database vocabulary in ordinary language; this cell abruptly requires the reader to unpack an implementation concern themselves.

Effect: A reader can recognise that some compatibility check is needed but cannot readily tell what they should verify in their prototype.

Suggestion: Say that the application's database library must preserve required values when sending and reading them, with one short example if needed, such as exact prices or timestamps.

## Limits

This is an editorial review of the full pieces, not an independent technical verification or a visual-accessibility audit. Figure captions, labels, controls and rendered text alternatives were read; every playback state was not exercised. The browser was created without visibility options because those options are unsupported for this subagent. A supplementary reference-source disclosure attempt and the first tab-recovery attempt timed out; recovery succeeded and the optional rendered Mermaid listings were subsequently read. No source-file fallback was used. The single temporary tab was closed; no processes were started. No article changes, build, commit or push were performed.

Timing: started 2026-10-21 19:49:43 UTC; ended 2026-10-21 19:55:59 UTC; elapsed 6 minutes 16 seconds (376 seconds), including report writing and browser cleanup.
