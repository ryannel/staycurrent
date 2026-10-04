# Final editorial recheck

Reviewed 4 October 2026 after the prose revisions and insertion of the join, index, and lock aids. I read the complete current article source and the full rendered accessibility text at `http://127.0.0.1:4325/article-light.html` and its dark companion through CUA. I inspected desktop screenshots of the opening, query example, index figure, concurrency passage and its transitions, and final suitability section. This pass did not repeat phone layout or technical verification. I made no code edits.

I judged the writing against the original passages already read in [Sam Who’s Load Balancing](https://samwho.dev/load-balancing/), [Bartosz Ciechanowski’s Gears](https://ciechanow.ski/gears/), and [Julia Evans’s cartoon essay](https://jvns.ca/teach-tech-with-cartoons/). I authored the lock timeline, so this report does not independently accept that component. Its placement in the article is within this editorial review; its independent acceptance belongs to the other reviewers.

No material editorial issues remain. The article establishes what this database family offers without attempting to teach the whole collection. The plain section headings suit that job. The prose has a recognisable situation to return to, but it can also move from purchases to reporting without pretending these are steps in one checkout tutorial.

The earlier findings are resolved:

- The opening now gives the shared records concrete uses and makes simultaneous change relevant.
- The index paragraph explains the useful ordering, and the diagram follows both C4 entries into their order records. It supplies an answer rather than merely naming an access path.
- The incomplete order ends the constraints section, and transactions immediately explain the missing protection.
- The durability paragraph describes a recovery mechanism. The payment example explains a transaction boundary without another abstract warning.
- Versioned reading now has a concrete consequence and a named PostgreSQL example. The closing conflict paragraph stays with waiting and rejected transactions, so the article no longer detours into ambiguous connection loss.
- The suitability section finishes its reasoning about adding another system before introducing products and the wider collection.

The new aids sit after the prose has established the relevant question. The SQL example makes the same join inspectable and shows its result; it does not turn the section into a syntax lesson. The index figure precedes the maintenance cost, so the reader first sees the extra information the database must keep. The lock timeline follows the complete explanation of the waiting buyer; the next paragraph then discusses why protecting the check matters. Each insertion has a reason at that point in the text.

There is one optional, low-severity rhythm improvement. In **Concurrent access**, split the long paragraph beginning “A report has a different need” immediately before “Reading an earlier version does not reserve an item.” The first paragraph would explain visibility and the second would return to the purchasing decision. The current paragraph is understandable; this is not a missing explanation or an acceptance blocker. Preserve the substance.

The remaining qualifications earn their space. Historical prices affect table design; SQLite enforcement affects the rule just introduced; the persistent-storage boundary affects the meaning of durability; the payment example limits what rollback can do. Figure captions appropriately identify the examples’ scope. I would not remove these simply to make the prose sound more confident. No further caveat removal is needed for this editorial pass.

The layout and reading map remain as requested. Editorial outcome: the revised introduction is suitable as a working draft. This is neither technical acceptance nor publication authorisation.
