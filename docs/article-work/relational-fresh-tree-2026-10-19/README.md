# Relational planning run, 19 October 2026

Planning only, from a fresh [commission](commission.md). The user will review the
complete tree before any articles are written.

## Stopped run

Stopped at the user's request after the expertise-target issue was identified.
The snapshot contains 28 article nodes: nine expanded after local reviews and
19 deeper stubs. Other saved drafts and reviews remain as evidence, with their
original assignment contexts. Those passes do not establish that the proposed
depth fits the corrected global target.

This run is not an input to the fresh fan-out run in
`../relational-fanout-2026-10-19/`. It will not be resumed.

The root breakdown worker received only the commission and current skill paths.
It plans the root's headings and contextual child stubs, and manages independent
practitioner and adversarial-editor reviews before returning. Each child then
receives a fresh breakdown worker with its own scope and relevant tree context.

The canonical proposal is at
[`docs/coverage/relational-2026-10-19.yaml`](../../coverage/relational-2026-10-19.yaml).
Previous coverage maps and the published corpus are not inputs to this structure.

After all stubs are expanded, independent whole-tree reviewers will check:

- completeness and depth;
- structure, overlap and adversarial consolidation;
- teaching and flow against the three fixed examples.

The orchestrator reconciles findings in the shared tree and commissions affected
breakdowns and rechecks. Review completion returns a proposal for discussion;
it does not start article writing or change publication status.

## Progress

[`work-index.json`](work-index.json) records assignments and expansion state.
Only reviewed worker results are merged into the canonical proposal; unresolved
children remain stubs until their own reviewed breakdowns return.

The root's practitioner review added analytical/mixed workloads, bulk movement
and database-resident behaviour to the existing branch briefs. Adversarial
review folded system evaluation into the root, brought task entrances forward,
removed a redundant heading and bounded the introductory mechanism previews.
Seven child articles remain at this level. Both root rechecks passed; see
[`root/repair-record.md`](root/repair-record.md).

Data design passed both reviews after folding a redundant enforcement child into
the parent and replacing a recap with a transfer exercise. Its deeper stubs cover
normalisation and temporal modelling; see
[`a01-designing-relational-data/repairs.md`](a01-designing-relational-data/repairs.md).

SQL passed both reviews with two descendants: composing queries and changing
data. Repairs clarified constraint timing and expression safety, restored
prerequisite order, bounded the parent introductions and assigned detailed
trigger-result behaviour to one owner. See
[`a02-working-with-sql/repair.md`](a02-working-with-sql/repair.md).

Transactions passed both reviews with one child for complete multi-row invariant
protocols. The practitioner repair supplied a concrete counterexample and tests
of its serialisable repair; editorial recheck preserved a bounded parent and a
distinct protocol/transfer exercise in the child. See
[`a03-reasoning-about-transactions/repairs.md`](a03-reasoning-about-transactions/repairs.md).

Performance passed both reviews with five child stubs. Editorial repairs moved
one completed investigation before the mechanism tour, folded its repeated
closing method into that arc and assigned each shared mechanism one explanatory
home. The five deeper jobs survived specific fold/merge challenges. See
[`a04-understanding-and-improving-database-work/repair-record.md`](a04-understanding-and-improving-database-work/repair-record.md).

Application engineering passed both reviews with five child stubs. The
practitioner repair made inherited session state and pooling-mode assumptions
explicit; adversarial review accepted the task boundaries without another
required cut or expansion. See
[`a05-building-applications-with-a-relational-database/repairs.md`](a05-building-applications-with-a-relational-database/repairs.md).

Operations passed both reviews with security and recovery children. Repairs made
recovery-path degradation observable, tied it to live recovery preconditions and
used one evolving service evidence record to consolidate repeated procedures.
See [`a06-operating-and-recovering-a-relational-service/repair-record.md`](a06-operating-and-recovering-a-relational-service/repair-record.md).

Distribution passed both reviews with replication/failover, sharding and
integrated distributed-SQL children. Repairs tightened membership and writer
authority assumptions, made migration detail single-owned and reused one
guarantee worksheet across the parent and deeper cases. See
[`a07-relational-data-across-servers/repairs.md`](a07-relational-data-across-servers/repairs.md).

At the first-level checkpoint, the root and all seven immediate child articles
were reviewed. The proposal contained 28 article nodes, with 20 deeper stubs
awaiting their own reviewed breakdowns. This was an expansion checkpoint, not
the finished tree or the whole-tree review outcome.

Normalisation is the first fully reviewed deeper article: six main headings,
one method subsection and no further children. Repairs corrected the formal
1NF example, moved its assumptions before key calculations, merged a repeated
definition and reused the existing synthesis counterexample. Both independent
reviews and final technical/editorial rechecks passed; see
[`a08-normalising-relational-schemas/repairs.yaml`](a08-normalising-relational-schemas/repairs.yaml).

Workers with saved drafts may be suspended while queued for review, then resume
their own review/repair loops. This releases capacity for independent reviewers;
it does not skip an article's reviews or merge an unreviewed draft.
