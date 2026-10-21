# Editorial review · article · relational trial 3 a00 and a03 · initial 80276a4

Inputs read: baseline `staycurrent-review/SKILL.md` and `perspectives/editorial.md` through `git show 80276a4`; all three reference articles in full from `/private/tmp/staycurrent-skills-night-a/src/reference-articles/`; the complete rendered introduction and transactions article on port 4340. Audience: intelligent engineers new to relational databases. Plans, previous findings/reports, work records, candidate skills and the overnight protocol were withheld. Article source was consulted only after rendered reading, to locate passages.

Highest severity: medium

Started: 2026-10-21 20:32:15 UTC. Review completed: 2026-10-21 20:36:16 UTC.

Timing: the server was initially unavailable, then returned a missing-registry SSR error. The coordinator reported the corrected restart at 20:33:47 UTC. This approximately 1 minute 32 second startup interval overlapped active reference reading; it was not all idle time. There was one explicit 10-second wait, plus failed navigation/reload overhead. Target reading began after that restart. No separately instrumented active-time total is claimed.

## Checks

| Check | Result | Note |
| --- | --- | --- |
| Titles and headings | pass | Both titles and the section sequence describe recognisable reader questions; the concrete mug/place headings work well. |
| Plain sentences | finding | Most explanations use people, rows and actions clearly; a03's “correct logic alone” compresses its meaning incorrectly, and a00's recovery close retreats into abstract nouns. |
| Terms | finding | Keys, joins, atomicity, isolation, snapshots, write skew and serialisability receive useful explanations. “Recovery acceptance” and “recovery gates” do not. |
| Openings | finding | Most sections begin with a fact or a concrete failure. The system-selection opening starts with a bare instruction; low impact. |
| Reader-facing text only | pass | No article editing history or internal reviewer instructions. Draft banners are recognisable review-shell material. Evidence qualifications tell the reader what was actually checked. |
| Captions and labels | finding | Controls name their choices and the step text distinguishes pending from committed state. Figure 1's final sentence introduces an unexplained qualification. |
| One piece | finding | The booking and instructor arguments build coherently. The sequence/DDL aside and Figure 1's final caption sentence read as appended caveats. |

Coverage: all prose, headings, tables, code labels, captions, source notes and displayed collection navigation; both parent SQL listings in the disclosure; the child schema disclosure and all figure text alternatives. Read all ten parent race states across its two options and all 27 child figure states across their six options, using Next and the selectors. Parent Figures 1, 2 and 4 were read completely as rendered. Linked companion articles were not opened.

## Findings

### editorial-1 · medium · a03, “Protect a decision spanning several rows”, a03.astro:94

Problem: “That is the complete repair: **correct logic alone**, all relevant writers under Serializable, and fresh reads and decisions after abort.” In context the intended requirement is logic that is correct *when run alone*. The actual phrase says the logic alone is the repair, immediately followed by two further requirements.

Effect: the reader must reread and supply the missing relationship at the summary of the article's central argument. The surrounding example makes the intended combination recoverable, so this is not a critical failure of the whole explanation.

Suggestion: name correctness in an isolated execution explicitly, then state that the three requirements apply together.

### editorial-2 · medium · a03, “Keep ownership and the counter together”, a03.astro:48

Problem: after explaining savepoints through the reservation counter, the paragraph abruptly adds “Transactional behaviour also has exceptions”, number-generating sequences and commands changing table definitions. Neither sequences nor table-definition changes participate in the example, and the general instruction to check them supplies no concrete consequence for this booking.

Effect: a newcomer must interrupt the rollback argument to work out whether the displayed reservation operation has just acquired an exception. The paragraph reads as a safety caveat attached after the explanation rather than part of its progression.

Suggestion: keep the savepoint explanation attached to the failed insert. If the sequence exception belongs here, show the narrow distinction with an identifier-number example and explain that a gap does not mean a reservation survived rollback; place the broader command caveat with its relevant operation.

### editorial-3 · medium · a00, “Recover the right state”, a00.astro:106

Problem: the concrete mistaken-delete and timed-restore explanation ends with “health observations”, “recovery acceptance”, “failure-specific targets” and “recovery gates”. In particular, neither “recovery acceptance” nor “recovery gates” has a stated meaning. “A managed service takes specified operating duties” does not say which duties the reader should contrast with the shop's responsibility.

Effect: the reader goes from an intelligible task—restore separately and check orders—to an abstract checklist they must translate themselves. This is a real loss of clarity at the hand-off, not a preference for shorter prose.

Suggestion: identify who checks that the restored shop is correct and decides it can resume taking orders; describe the linked article through those actions. Preserve the explicit division of responsibility, but give it an example.

### editorial-4 · medium · a00 Figure 1 caption, components/relational-trial-3/a00/Shop.astro:17

Problem: “This view omits dates and historical rows, **not additional stock reservations**.” The caption has already explained which orders are omitted. Its final contrast introduces reservations before the article explains that accepting a pending order reserves stock, and does not identify what an “additional stock reservation” would look like in these tables.

Effect: while learning keys and relationships, the reader is diverted into resolving a stock-accounting objection they have not yet been given. This final sentence reads as a later patch; the rest of the caption explains the display usefully.

Suggestion: keep the omission explanation about the rows actually shown. Explain any restriction on hidden stock commitments alongside the later reservation protocol, where its meaning and relevance are available.

### editorial-5 · low · a00, “Choose a system you can test”, a00.astro:115

Problem: “Choose an engine and an arrangement for running it together” begins with an instruction before saying why those choices belong together. “Together” also initially appears to mean running the engine and arrangement together.

Effect: a small reread; the following candidates eventually make the intended relationship clear.

Suggestion: open with the fact that the engine's guarantees depend on how it is deployed, then introduce the shop's three hosts and the comparison.

## Characteristic AI prose

The strongest passages avoid it: “Stock is non-negative, but two customers have been promised one mug”, and “Its balance is zero, accidentally correct” attach the general lesson to a visible failure. The article does not rely on inflated claims of importance or stock transitions to connect its main demonstrations.

There are local examples of the requested failure patterns. “Complete outcome-resolution protocol” (a00:93) is a compressed label where “find out whether this same order committed” would be easier. “Turns acceptable loss and interruption into an owned, rehearsed recovery procedure” (a00:29) uses an abstract transformation formula, while the later deleted-order example says much more concretely what the reader must learn. Those two substitutions are **optional phrasing improvements**, not additional material findings: their surrounding context supplies the meaning. By contrast, the recovery nouns in editorial-3 are not unpacked, and the caveats in editorial-2 and editorial-4 interrupt the argument. Editorial-1 is a specific compressed-summary failure. Repeated contrasts such as atomicity versus competing decisions and a timeout versus a known abort earn their place because the examples demonstrate the distinction; their rhetorical form alone is not a finding. No word-count or authorship inference was used.

## Limits

This was an editorial review through the rendered browser accessibility tree and DOM text, not a visual-layout or technical-correctness audit. I did not measure responsive layout, autoplay timing or verify external sources, downloads or native worksheet execution. Figure controls were stepped manually. One parent Next action timed out after changing options at the final step; the refreshed state showed that the option change retained the final step. Reset then allowed all protected-history text to be read. IAB rejected `visible: false` in this subagent; omitting that option worked. Initial connection and SSR failures were reported to the coordinator, who repaired the server prerequisites. No alternate server was started, no article was edited, and no commit or push was made.
