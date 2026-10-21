# Before and after · trial a03 · d04

Before: a31b275 (the trial a03 as d03 left it). After: the d04 working tree. Neither is committed or adopted.

## Words and readability

`wc -w` on the file with markup, as earlier rounds measured: **6,112 → 6,149** (+37). Prose only, with markup, styles and expressions removed: 5,567 → 5,604 words.

Measured on the prose text (sentences split at full stops and colons; Flesch reading ease from a syllable estimate, so compare the numbers with each other, not with published scales):

| Passage | Words | Sentences | Mean sentence | Longest | Flesch | if / unless / provided / except |
| --- | --- | --- | --- | --- | --- | --- |
| Whole article, before | 5,567 | 400 | 13.9 | 99 (a list) | 61.4 | 16 |
| Whole article, after | 5,604 | 403 | 13.9 | 99 (a list) | 61.6 | 12 |
| `FOR UPDATE` passage, before (one paragraph) | 136 | 9 | 15.1 | 27 | 72.7 | 0 |
| `FOR UPDATE` passage, after (two paragraphs) | 162 | 12 | 13.5 | 21 | 77.2 | 0 |
| Vendor-tool sentences in the closing, before | 102 | 4 | 25.5 | 38 | 51.6 | 3 |
| Vendor-tool sentences in the closing, after | 0 | | | | | |
| Locking-protocol paragraph, before | 79 | 4 | 19.8 | 28 | 51.9 | 1 |
| Locking-protocol and vendor paragraphs, after | 161 | 9 | 17.9 | 31 | 57.8 | 1 |
| 23505 exception, before | 73 | 5 | 14.6 | 30 | 62.2 | 1 |
| 23505 exception, after | 79 | 4 | 19.8 | 38 | 58.3 | 0 |

So the repair removed the stacked conditions (four fewer conditionals, and the closing argument no longer stops for a writer the example lacks) at almost no cost in length. Sentence for sentence, the `FOR UPDATE` passage got easier. The 23505 rewrite removed its conditions but left one 38-word sentence, which is worse by these measures.

## What the fresh reader found

The d03 editorial reviewer had followed every round and passed the article with one optional finding. The d04 reviewer had seen nothing earlier. It returned **repairs required: 5 required and 11 optional findings** ([editorial.md](editorial.md)).

| | Required | Optional |
| --- | --- | --- |
| On passages the d04 repair touched | editorial-31 (the `FOR UPDATE` run) | editorial-33 (vendor paragraph and table cell), editorial-36 (23505), editorial-38 first bullet (the reworded "old row versions") |
| Older than d04 | editorial-29, -30, -34, -37 | editorial-32, -35, -38 to -44 |

Both target passages still read as additions to a fresh reader, though for a different reason. Before the repair, the problem was how they were written: stacked conditions and a sentence that had to be read twice. After it, the problem is whether they belong. The vendor case "answers an objection the reader never raised". The `FOR UPDATE` run is "an unseen two-session run told entirely in prose". For it, the reviewer suggested the remedy the revise skill already lists: cut it to its one point and leave the run to the locking article.

The continuity pass fixed six term problems. The reviewer found others it missed: "session" is never explained, "rule" and "invariant" both name one thing, the opening uses "schedule" and "isolation level" before they are explained, and the article uses both "serialisation failure" and "serialisation error".

## Did the new skills change the outcome?

- **staycurrent-revise improved the writing but not the judgement about what belongs.** Its "finish as a first draft" reread found a third patched passage (23505) that no review had named. Its sentence test ("more than one unless or provided") removed every stacked condition it was aimed at. But the deeper choice the skill offers, to cut a claim and move its edge cases to the article that owns them, was available for both passages and was not taken: the repair kept every fact and reshaped it. A fresh reader still saw the same two topics as asides. The skill could make that choice harder to skip, for example by asking of each repaired passage whether a newcomer reading this article would miss it if it lived only in the child article.
- **staycurrent-continuity worked as a list but inherited the writer's blind spots.** Writing the term list caught six real problems, including "locking read" used before it was named and "row versions" used before Figure 4. It missed the terms the writer did not think of as terms ("session"), and its "one name per thing" step missed "rule" against "invariant". The list is only as good as the person listing. Extracting candidate terms mechanically from the rendered text (bold, code, capitalised phrases, and words that recur), or having someone other than the writer make the list, would close part of that gap.
- **The example record would have prevented the trial's drift, but it arrives too late for the existing articles.** It now fixes names and rows for the shop and the class extension. The survey shows the problem is much wider than a19: the live draft a00 races Mina against Arun, four different examples run through the drafts, and the published collection uses another one, the workshop service, throughout.
- **The fresh-reviewer rule in staycurrent-review changed the outcome most.** Of the five required findings, three (editorial-30, -34, -37) have nothing to do with d04 and passed three earlier rounds. editorial-37 is a contradiction with the article's own schema: a lost-reply repeat "could have booked her twice", but the unique constraint forbids it. A reviewer who has followed the rounds reads a repair as a fix and stops seeing the page as a reader does, which is what that rule says.

Net: the article is slightly clearer where it was repaired and is not yet passable. It needs another revise round on the d04 editorial findings, ideally with the cut-and-move choice applied to editorial-29, -31 and -33 together, since all three concern the counter and the cases a03 hands to its children.
