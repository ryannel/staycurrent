---
name: staycurrent-orchestrate
description: From a topic and brief, plan a recursive article tree, then coordinate its review, writing and repair.
---

Serve the commission's goal: take an intelligent newcomer to expert practitioner in the commissioned subject, in the least reader time and effort. Each article contributes to that goal, without setting a separate specialist target. Run only commissioned stages.

The orchestrator owns the tree, scheduling, review and integration. Every planning, writing, repair and review assignment goes to a fresh subagent and ends on return. Workers never arrange review teams; assigned reviewers perform their perspective directly. Apply [staycurrent-review](../staycurrent-review/SKILL.md) for the fixed modes, inputs, reports, severity floors and stopping policy. Resolve disagreements against the commission and record why; bring the user genuine scope or publication choices.

## Records and review inputs

Keep one canonical YAML tree under `docs/coverage/`, its [example record](../staycurrent-continuity/SKILL.md) beside it, and a work record under `docs/article-work/`. Retain the commission, piece/version/status, assignments, start/end, original review reports, findings, decisions, changed locations, verification and limitations. Keep one decision ledger and one evidence index; link unchanged records rather than copy them. Map duplicate observations to one issue while preserving each report.

Designate one preview/build owner; workers request builds from that owner. Freeze review inputs and preview only when articles, components, shared shell and applicable evidence agree. A manifest identifies the complete version, preview and dependencies. Evidence identifies relevant source, data, environment and verifier versions; reuse it only while they remain applicable. Text changes may invalidate technical meaning, layout or playback timing.

Handoffs give task, version, relevant context and evidence links within the perspective's permitted inputs. Editorial receives no plans, repair history or writer's notes. Mechanical receipts exclude author teaching notes, earlier quality verdicts and review findings; extract relevant mechanical records and provenance from mixed writing records. Dispatch ready commissioned work as slots free up, starting long visual work early; do not commission extra reviews to occupy slots. Combine each piece's findings before repair. Route shared-layout findings to their owner and check every affected article.

## Planning

Give each fresh planner its topic and brief, commission and expertise goal, parent/neighbouring briefs and example record. Apply [staycurrent-breakdown](../staycurrent-breakdown/SKILL.md), returning YAML for orchestrator-managed batched review. Settle the root's proposed example record before planning children.

Review breakdown batches in breakdown mode. Give each piece's findings and breakdown to a fresh planner, then fresh reviewers. Merge accepted breakdowns and example extensions centrally, and commission each `nested_article` stub until none remain.

Review the complete tree and commission in tree mode with fresh reviewers who have no batch-review history. Reconcile findings, return changed parts through breakdown and review, and recheck affected findings before writing. A planning-only commission returns the reviewed tree here.

## Writing and integration

Give each fresh writer its topic, title, brief and headings; children's briefs, headings, introduction points and finished articles; parent/neighbouring scopes; existing linkable articles; example record; and commission/expertise goal. Apply [staycurrent-write](../staycurrent-write/SKILL.md), returning the draft and proposed tree changes for batched article review.

Review fixed article versions with perspective-specific inputs and a rendered preview for visual review, plus isolated figure routes where available. Reconcile findings, then give the article, plan context, work record and accepted problems together to a fresh writer using [staycurrent-revise](../staycurrent-revise/SKILL.md). Even a one-phrase prose fix uses that skill. Review repairs under the review skill's policy, retaining separate reports. Merge tree/example changes centrally and update affected articles.

Review the assembled articles and tree in corpus mode with fresh reviewers. Send repairs to fresh writers and review repaired articles again. Return the tree, article locations, review outcomes and unresolved work. Keep reviewed drafts distinct from available reading; publication requires user authorisation.
