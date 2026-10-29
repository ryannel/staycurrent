---
name: staycurrent-write
description: Write or substantially revise an article by imitating the three fixed reference articles in its writing and teaching.
---

Read the complete reference text with `python3 scripts/read-writing-reference.py`: it lists numbered, bounded parts. Read each part separately, checking its END marker; recover any clipped output before designing. Study [Sequence diagrams](../../../src/reference-articles/sequences.astro), [Indexes](../../../src/reference-articles/indexes.astro) and [Storage and durability](../../../src/reference-articles/storage.astro) as finished articles, following their drawings through the explanations. When developing a difficult explanation, return to the reference passage and finished figure that does comparable teaching work. Adapt how it builds understanding, directing attention through the prose and drawing together. Write an article that could sit beside them and feel written by the same author, starting from what this reader already understands.

Use the plan to understand this article’s contribution, intended reader understanding and neighbouring scopes. Teach its own outcome completely while preserving the stated parent–child boundaries. Let each section develop a subject or question the reader now has reason to understand. Reshape the explanatory order and presentation; propose scope changes centrally. Where a child owns deeper treatment, establish the concept through an accurate example and explain when that treatment is needed. Keep the child’s full definitions, tests and methods there. Follow the references in how they name articles and sections. Prefer established, searchable industry terms where they fit naturally. Follow the collection's [example record and continuity](../staycurrent-continuity/SKILL.md); propose extensions centrally.

Let the illustrations carry the article's central explanation. Use prose to explain why it happens, what follows and where the model stops applying, rather than narrating visible movements or inventorying objects and numbers. Name an example detail only when the reader needs to reason about it. Use [staycurrent-figures](../staycurrent-figures/SKILL.md) for figures, tables, code and interactive tools. Coordinate rendered checks with the designated preview/build owner.

Check consequential claims against primary sources; list them under Sources and further reading. Keep qualifications that prevent a mistaken reader inference or action, including whether results are illustrative or observed. Keep production bookkeeping and verification evidence with the work.

When an implementation illustrates a broader subject, present it as one of several choices and distinguish general principles from its specific behaviour and guarantees.

Reread the finished piece against the references, including captions and controls, and run the continuity pass.

Then run `pnpm check -- --rule=dense-prose --page=<article path>` on a build that includes the article. It points at sentences and paragraphs that carry more at once than good human-written explainers do. Reread each one in place and rewrite it if a reader would have to read it twice, keeping what they need. The counts show where to look; they don't decide when the writing is done.

Return the article for the commissioned review; standalone complete articles arrange [article review](../staycurrent-review/SKILL.md).
