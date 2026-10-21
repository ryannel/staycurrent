---
name: staycurrent-orchestrate
description: From a topic and brief, plan a recursive article tree, then coordinate its review, writing and repair.
---

An orchestrated commission turns one topic and brief into a reviewed tree of articles and, when commissioned, the written articles. The goal throughout is the commission's: take an intelligent newcomer to expert practitioner in the commissioned subject, in the least reader time and effort. Every article serves that one goal; a nested article does not set its own expertise target. Run only the stages the commission asks for.

The orchestrator owns the tree, the schedule, review and integration. Workers (planners, writers and reviewers) complete one assignment and return, and every assignment goes to a fresh subagent, including repairs and later review rounds. A worker who has seen earlier rounds carries their blind spots forward; everything a fresh one needs is in the plan, the work record and the piece itself. Keeping review with the orchestrator means workers never wait for review capacity and reviewers can compare pieces across a batch, so workers never start review teams of their own; an assigned reviewer performs its perspective directly.

When perspectives disagree, for example completeness against value, decide against the commission's goal and record the reason. Bring the user genuine choices of scope or publication, not routine review decisions.

[staycurrent-review](../staycurrent-review/SKILL.md) fixes which perspectives run at each stage, what each reviewer receives and the shape of its report. Follow it as written rather than choosing perspectives per run, so that reviews stay comparable across commissions.

## Keep the record

Keep one canonical YAML tree under `docs/coverage/`, the collection's example record beside it ([staycurrent-continuity](../staycurrent-continuity/SKILL.md)), and a work record under `docs/article-work/` with the commission and each piece's draft and review status. Keep original review reports, one decision ledger and one evidence index; link to them instead of copying inventories or unchanged decisions into handoffs. Record assignment, version, start/end, findings, decisions, changed locations, verification and limitations. Map duplicate observations to one issue while retaining each perspective's report.

## Prepare and schedule review

Name one owner for both the preview and builds; the coordinator can own them. Workers request a build from that owner rather than run concurrent builds into the same output directory. Freeze review inputs only when articles, components, shared shell and applicable evidence agree. Identify the complete input version, preview and dependencies in a manifest, and keep that preview unchanged during its reviews. Include relevant source, data, environment and verifier versions with evidence; reuse it only while those remain applicable. Text changes can invalidate layout, playback timing or technical meaning.

Handoffs state the task, version, relevant context and evidence links, restricted to the perspective's permitted inputs. Editorial receives no plans, repair history or writer's notes. Dispatch ready commissioned perspectives as slots free up; start long visual/browser work early. Do not commission extra reviews simply to fill slots. Combine a piece's findings before repair. Route shared-layout findings to their owner and check every affected article.

## Plan the tree

Start from the commission's topic and brief, and give ready assignments to fresh planners as slots free up. Give each planner:

- its topic and brief;
- the commission's topic, brief and expertise goal;
- relevant parent and neighbouring briefs;
- the example record. For the root breakdown, ask for a proposed record and settle it before planning any child.

> Apply [staycurrent-breakdown](../staycurrent-breakdown/SKILL.md) to this assignment and context. Return the YAML breakdown for orchestrator-managed batched review.

Review returned breakdowns in batches in breakdown mode. Give the findings for each article, with its breakdown, to a fresh planner, then review the changed breakdown again with fresh reviewers. Use free slots for ready planning or commissioned review.

Merge accepted breakdowns into the tree, and accepted example extensions into the record, and queue each `nested_article` stub for its own breakdown. Repeat until no stubs remain.

## Review the tree

Give the complete tree and the commission to fresh reviewers in tree mode. Fresh reviewers see the tree as a whole, without the history of individual batches. Reconcile findings across the tree, send changed parts back through breakdown and review, and recheck the affected findings before writing starts. A planning-only commission ends here: return the reviewed tree.

## Write the articles

Give each article to a fresh writer with:

- its topic, title, brief and headings;
- its children's briefs and planned headings, where each is introduced, and any finished child articles;
- parent and neighbouring scopes;
- existing articles it can link to;
- the example record;
- the commission's topic, brief and expertise goal.

> Apply [staycurrent-write](../staycurrent-write/SKILL.md) to this article plan and context. Return the article for orchestrator-managed batched review, with any proposed tree changes.

Review written articles in batches in article mode, giving each reviewer only the inputs its perspective file lists. Visual reviewers need a rendered preview of the fixed version, with isolated figure routes where you can provide them. Reconcile the findings and give them together to a fresh writer, with the article, its plan context and its work record, as problems to solve rather than wording to insert:

> Apply [staycurrent-revise](../staycurrent-revise/SKILL.md) to this article and these accepted findings. Return the repaired article and its work record.

Send even a one-phrase fix back through that skill rather than making it yourself: a phrase changed in isolation is how patches accumulate. After repair, review again with fresh reviewers as [staycurrent-review](../staycurrent-review/SKILL.md) describes, which also sets the acceptance rule that decides which findings require repair and when review ends. Keep each perspective's report separate. Merge proposed tree and example changes centrally and update the articles they affect.

## Review the corpus

Give the assembled articles and tree to fresh reviewers in corpus mode. Send findings to fresh writers for repair and review the repaired articles again with fresh reviewers. Return the tree, article locations, review outcomes and any unresolved work.

Reviewed drafts are not published reading. Keep them distinct from available articles; publication needs the user's authorisation.
