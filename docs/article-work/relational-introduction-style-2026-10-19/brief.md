# Relational introduction rewrite

19 October 2026. The user rejected the published collection's writing style and
requested a fresh agent to read the three chosen example articles and rewrite
`/learn/databases/relational/`. They authorised publication once done.

The first agent was stopped after the user rejected the coordinator's detailed
prompt. Its unpublished draft was set aside; the target was restored to the
published version before a new agent started without inherited conversation.

The new agent received exactly:

> Read the three example articles in /private/tmp/staycurrent-relational-style/references/ and use only those as the reference writing and teaching style. Then rewrite /learn/databases/relational/ (src/articles/relational/rl76.md).

The supplied references are Sequence diagrams, Indexes, and Storage and durability,
pinned to `edde22d` before the collection publication replaced the two relational
sources. Their paths at that commit are
`src/pages/learn/drawing-systems/sequences.astro` and
`src/pages/learn/databases/relational/{indexes,storage}.astro`.
