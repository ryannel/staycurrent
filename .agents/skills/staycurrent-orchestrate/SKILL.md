---
name: staycurrent-orchestrate
description: From a topic and brief, plan a recursive article tree, then coordinate its review, writing and repair.
---

An orchestrated commission turns one topic and brief into a reviewed tree of articles and, when commissioned, the written articles. The goal throughout is the commission's: take an intelligent newcomer to expert practitioner in the commissioned subject, in the least reader time and effort. Every article serves that one goal; a nested article does not set its own expertise target. Run only the stages the commission asks for.

The orchestrator owns the tree, the schedule, review and integration. Workers (planners, writers and reviewers) complete one assignment and return. Keeping review with the orchestrator means workers never wait for review capacity and reviewers can compare pieces across a batch, so workers never start review teams of their own; an assigned reviewer performs its perspective directly.

When perspectives disagree, for example completeness against value, decide against the commission's goal and record the reason. Bring the user genuine choices of scope or publication, not routine review decisions.

[staycurrent-review](../staycurrent-review/SKILL.md) fixes which perspectives run at each stage, what each reviewer receives and the shape of its report. Follow it as written rather than choosing perspectives per run, so that reviews stay comparable across commissions.

## Keep the record

Keep one canonical YAML tree under `docs/coverage/` and a work record under `docs/article-work/`: the commission, each piece's draft and review status, the review reports as written, and the decision on each finding. Batching delays review; the record shows it never skipped it.

## Plan the tree

Start from the commission's topic and brief, and give ready assignments to fresh planners as slots free up. Give each planner:

- its topic and brief;
- the commission's topic, brief and expertise goal;
- relevant parent and neighbouring briefs.

> Apply [staycurrent-breakdown](../staycurrent-breakdown/SKILL.md) to this assignment and context. Return the YAML breakdown for orchestrator-managed batched review.

Review returned breakdowns in batches in breakdown mode. Return findings by article to the planner who wrote it and recheck the changed work. Fill free slots with whatever planning or review is ready rather than holding slots in reserve.

Merge accepted breakdowns into the tree and queue each `nested_article` stub for its own breakdown. Repeat until no stubs remain.

## Review the tree

Give the complete tree and the commission to fresh reviewers in tree mode. Fresh reviewers see the tree as a whole, without the history of individual batches. Reconcile findings across the tree, send changed parts back through breakdown and review, and recheck the affected findings before writing starts. A planning-only commission ends here: return the reviewed tree.

## Write the articles

Give each article to a fresh writer with:

- its topic, title, brief and headings;
- its children's briefs and planned headings, where each is introduced, and any finished child articles;
- parent and neighbouring scopes;
- existing articles it can link to;
- the commission's topic, brief and expertise goal.

> Apply [staycurrent-write](../staycurrent-write/SKILL.md) to this article plan and context. Return the article for orchestrator-managed batched review, with any proposed tree changes.

Review written articles in batches in article mode, giving each reviewer only the inputs its perspective file lists. Visual reviewers need a rendered preview of the fixed version, with isolated figure routes where you can provide them. Reconcile the findings and return them to the writer together. After repair, recheck the affected perspectives and keep each perspective's verdict separate. Merge proposed tree changes centrally and update the articles they affect.

## Review the corpus

Give the assembled articles and tree to fresh reviewers in corpus mode. Send findings to the owning writers and recheck repairs. Return the tree, article locations, review outcomes and any unresolved work.

Reviewed drafts are not published reading. Keep them distinct from available articles; publication needs the user's authorisation.
