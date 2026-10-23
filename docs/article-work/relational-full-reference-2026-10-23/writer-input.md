# Relational databases · complete fresh introduction

Use the current staycurrent-write skill to write the **complete Relational databases introduction**, for an intelligent engineer who has not used a relational database. This is the entrance to a collection taking them towards expert practice. The fixed references lead the writing and teaching.

The reader outcomes and neighbouring child scopes are in reader-outcomes.json. They describe what the complete introduction should achieve, not a required heading order, wording, illustration, code listing or article length. The introduction must give a useful explanation in its own right and help the reader choose where to go deeper. Reshape the teaching to the references' standard.

The shared factual context is example-facts.md, extracted from the canonical shop record. Select what the explanation needs. Ask the coordinator for further facts or propose an extension if necessary. Do not open the larger record's historical discrepancy catalogue. child-reading.json lists relevant finished reading and its scopes for links; those articles use several running examples, and this commission does not rewrite them. Use their metadata for navigation, with the fixed references leading the new explanation.

Study the three finished reference articles, including how their figures work:

- http://127.0.0.1:4350/review/examples/sequences/
- http://127.0.0.1:4350/review/examples/indexes/
- http://127.0.0.1:4350/review/examples/storage/

Create an Astro body fragment at src/articles/relational-full-reference/introduction.astro without a page shell or h1. Supporting components, shared data and any verification belong under src/components/relational-full-reference/. The coordinator owns routes, builds and preview. Request a preview when the complete source is ready, then inspect your rendered work. Record actual times, sources, checks and limits in writer-record.md and supporting evidence within this work directory. The coordinator will arrange article review; do not arrange reviewers or delegate work yourself.

Use primary technical sources for consequential claims. Keep conceptual illustrations and observed execution distinct. If verification needs a native database, use an owned disposable instance on port 56823 under the figures skill's database-verification guidance, and clean it up. A conceptual illustration need not pretend to be an observed engine run.

This is fresh writing. Permitted context is this brief, its reader outcomes/example facts/child-reading metadata, current skills, AGENTS.md/README.md/docs/site-direction.md, the three fixed references, shared implementation infrastructure and primary technical sources. Do not read old introductions or sample drafts, trial components, feedback, historical skills, other experiment records, or other agents' history/status. Do not modify shared site files or existing articles. Do not build, serve, commit, push, publish or create reviewers/subagents. The coordinator owns integration and delivery. No publication is commissioned.
