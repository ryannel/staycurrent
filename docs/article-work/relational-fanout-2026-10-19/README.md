# Relational planning with batched review

Fresh run using the corrected depth target and fan-out workflow. The
[commission](commission.md) is its only curriculum input; the earlier stopped
proposal is not reused. Planning ends before article writing.

The orchestrator fills available slots with independent builders. Builders
return drafts and finish their turns. Two separate review perspectives cover
each ready batch, with findings and repairs tracked per article. Only accepted
child briefs enter the expansion queue. Three fresh perspectives review the
complete tree after every stub is expanded.

`run-state.json` records queue, batch and review state. `nodes/` holds assignments
and builder results; `batches/` preserves review inputs and findings. The
canonical proposal is `../../coverage/relational-fanout-2026-10-19.yaml`.

The expert-practitioner target remains relational databases throughout the run.
Depth and separate pages must earn their value against that original goal and
the reader's time and effort.

## First-level review

The root and eight branch plans passed both perspectives. The editor folded a
separate incident destination into the operations parent, preserving its decision
method and links to procedure owners. Repairs also removed a modelling-pattern
tour and clarified query-composition, lock/isolation and constraint-deployment
ownership. Both perspectives rechecked the changes. The accepted first-level
structure contains 40 article nodes; its deeper stubs remain provisional until
expanded and reviewed.

## Worker handoff

Each fresh builder is asked to apply `staycurrent-breakdown` to its node context,
read the original commission and relevant parent boundary notes, save draft YAML
to the specified output, and change no other files. The context contains the
original subject and expertise goal, its own assignment, parent introduction and
neighbouring briefs. Reviewer handoffs name one independent perspective, an
immutable batch manifest and a findings destination; reviewers do not read the
other perspective’s report or spawn a review team.

## Complete expansion checkpoint

The full proposal contains 39 articles: one introduction, eight main guides and
30 deeper articles. Every active article passed both local perspectives; no
stubs or fourth article level remain. The PostgreSQL candidate checks were folded
into the choosing guide after expansion exposed their duplication of the common
worked implementation. The former a33 draft is preserved with folded status.
Three fresh reviewers are assessing the immutable complete-tree snapshot under
`whole-tree/round-1/`. No articles have been written.

The site build passed, including all 13 structural checks over 103 pages. That
checks the existing publication, not the educational quality of the proposal.
