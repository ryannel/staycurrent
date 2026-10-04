# Building the database field

Historical implementation plan, 2 October 2026. New commissions follow
[the coverage structure](content-structure.md) and the authoring/review skills.
The role and model assignments below describe that earlier run, not standing
instructions for future work.

Working plan, 2 October 2026. The operator requested creation and independent
review of a complete first pass, using the Explore work as the teaching reference.
All new content remains locally reviewable, marked as working drafts. No deployment
or publication-feed entries are implied by writing the pages.

## Reading structure

The field page gives orientation by application job, followed by a small set of
shared design questions and links into explanations. It should support a reader
who wants to make a choice without requiring them to finish all the deep dives.

| Explanation | Running problem | Mechanism to make visible |
| --- | --- | --- |
| Relational | Two buyers, one item | Indexed access, concurrent changes, transactions and recovery |
| Documents | A product and its shared details | Embedding, references, duplication and update boundaries |
| Partitioned access | An account's event history | Partition/sort keys, alternate queries and hot keys |
| Distributed SQL | Related changes on different machines | Replicated ranges versus cross-range atomicity |
| Caching | A frequently read price changes | Reuse, invalidation, staleness and rebuilding |
| Column stores | Page-view counts | Existing Explore essay: layout, exclusion, merging and replication |
| Search | Finding products from a query | Inverted lists, ranking and visibility of changes |
| Graphs | Following relationships across several hops | Adjacency, traversal, cycles and branching cost |
| Object storage | Publishing a catalogue export | Keys, whole objects and a consistent multi-object publication |

These overlap intentionally: data model, access path, layout, distribution and
hosting are independent choices. The map must explain that an application can
combine mechanisms, without suggesting that every small application needs eight
separate systems. Files/block devices provide context inside the storage essay;
vector retrieval is connected to search. Graph traversal has its own explanation
at the operator’s request. Time-series specialisation gets honest boundary
guidance in the overview rather than an empty taxonomy page.

A current assessment of vector retrieval in Postgres supplies the third reading
need. It distinguishes documented capabilities from workload evidence, includes
an exact-reference query and evaluation plan, and makes no performance or blanket
production-readiness claim. It remains a draft alongside the explanations.

## Creation and review

Three Sol agents at high reasoning create paired essays in isolated file scopes.
Root owns the reading structure, object-storage explanation, shared navigation,
and final integration. Authors use primary sources and write useful model tests.
The prose must carry the explanation without the graphics. Each experiment has
its own setup, question, instructions, output interpretation, reset where needed,
and limitations. Its result is useful before the reader presses a button.

After creation, authors review another author's work. A fresh reviewer receives
only the pages and a reader task for a blind clarity review. Root verifies the
actual browser presentation, themes, mobile layout, keyboard controls, links,
and state transitions. Findings are fixed before the final handoff. Record what
was and was not verified; do not call a source review a measured benchmark.

The first implementation and review pass is recorded in
[the database review log](database-review-2026-10-02.md).
