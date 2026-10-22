# What the writer actually read and how it chose

## Evidence and scope

This audit uses the table_customer_opening worker's actual tool calls and returned tool text, its retained handoff, its writer record, the generated source and the selected reference. Only tool actions and observable artifacts were examined for this report; no private reasoning is reproduced. The source log is identified in reading-tool-actions.json. The worker's retrospective notes explain its stated rationale, but are not evidence of the exact time at which it internally chose a reference.

No article, figure, plan, previous experiment record or reference is changed by this audit. The current task is diagnosis and compact skill correction, without another sample or full review commission.

## Reading chronology

- 19:11:53 UTC: reads AGENTS.md and the narrow writer brief. At 19:11:59 reads write skill, README, site direction and narrow customer/order facts. At 19:12:05 reads figures and continuity skills. The tool outputs supplied the current skills; no old skill or historical draft was loaded.
- 19:12:08–19:12:28: opens Sequence diagrams in Chrome, requests the accessibility text, then a full tree. The full-tree return contains an explicit 4,343-token truncation marker. It reads a 15,000–31,000-character main-text slice and takes a screenshot at Lifelines and messages.
- 19:12:32–19:12:44: requests Indexes' whole main text (return explicitly truncated by 4,721 tokens), then a 23,000–43,000-character slice. Screenshots sample the sequential-scan region and a scroll after one Next action. This establishes some visual study, not study of every figure's complete teaching sequence.
- 19:12:42–19:13:02: opens Storage and durability. A combined call's large output is truncated/omits a text item. Subsequent separate chunks read the main text at 0–13,000, 13,000–27,000, 27,000–41,000 and 41,000 onward; it takes one Next step and a screenshot at Pages.
- 19:13:09–19:13:44: reads database verification, PostgreSQL Concepts/Table Basics/Joins and background capabilities. Looks at shared infrastructure, the first 35 lines of the Sequence source, the first 100 lines of Indexes and the existing static ClusteredFigure component. These are not full reads of all three source articles. PostgreSQL's Concepts text includes its definition of a table as a named collection of rows.
- Before drafting it announces two small native tables and says all six rows can be inspected directly. At 19:14:50 a single patch creates both the complete prose fragment and table component.
- 19:15:05 onward: rereads the Sequence opening closely and the later main-text tail. A first attempt to choose the 3 s option uses the wrong control role; the successful changed-state inspection is at 19:15:21, after the draft. The retrospective record is written at 19:16:39 and completed after final rendering checks.

The previous description of full reference study was too generous. The log shows substantial text retrieval, explicit truncations, representative visual samples and some further study after drafting. It does not establish complete study of all finished visual explanations before the design decision. It also does not establish that truncation caused the result. Storage's separate text chunks did cover its main text.

## Figure choice and failure

The writer's stated closest example is Sequence diagrams, Lifelines and messages, with its static Figure 1. It describes the analogy as vocabulary, small complete example, then a definite reading direction. It argues that six visible rows make playback unnecessary. Its final comparison repeats that structural analogy.

The reference really is static. Static versus interactive is therefore the wrong axis for this failure. Its lifelines and labelled arrows show the interaction and its direction in one view. The sample shows separate unmarked tables several paragraphs apart, with prose telling the reader to trace an identifier back to the earlier table. There is no visual treatment of rows/columns or of the matched relationship. Displaying all values makes the data available; it leaves the matching to memory, scrolling and prose. That is the observed teaching gap.

The closest-passage instruction allowed a comparison based on the section's structure. The acceptance question, whether the explanation is as easy, did not make the drawing's explanatory contribution explicit. The writer could sincerely satisfy its stated interpretation while missing the publication's visual standard. Its notes repeatedly explain why controls are unnecessary; that does not evaluate whether a static visual could make the reasoning easier.

No evidence shows continuity overriding the references, a generic table component forcing the form, broad schema facts forcing coverage, or old-draft contamination. It built its own ShopTable component from the narrow factual extract. Technical tutorials were the last substantive topic-specific reading before the patch and could have supplied a competing presentation model; this is a plausible influence, not a demonstrated cause. The model's hidden decision process cannot be recovered from this trace.

## Compact correction

The write skill now asks for complete finished-article study and following the drawings through their explanations before design. It separates the roles of primary technical sources and fixed teaching references.

The figures skill replaces closest-passage selection with one general design criterion: make the reasoning visible. It asks what the reader needs to follow, compare or test, develops that drawing with its prose, and uses reference passages that do that teaching work. This describes explanatory purpose without prescribing arrows, colours, annotations, animation or table layouts.

Existing detailed rendered/accessibility checks move verbatim into references/render-checks.md, linked from the entrypoint. They remain required for the finished page, but do not dominate the initial design guidance. No verification requirement was dropped. Continuity and the fixed references are unchanged.

This is a supported correction to the instruction and input-reading problem, not evidence of successful behavioural improvement. There is no new forward test in this commission. Merely recording a reference, opening a browser page or passing layout checks will not establish success in the next test; the actual explanation must show that its drawing teaches the intended understanding. Prior samples remain available unchanged for comparison.
