---
name: staycurrent-orchestrate
description: Build recursive article trees and coordinate their review, writing and repair from a topic and brief.
---

Take an intelligent newcomer to expert practitioner in the original commissioned subject, optimising useful understanding against reader time and effort. Each descendant contributes to that goal; it does not set a new specialist-expertise target. Run only the stages commissioned.

## Build and review the tree

Keep one canonical YAML tree under `docs/coverage/` and a work record under `docs/article-work/`. Queue the original topic and brief, then fan out ready assignments to fresh breakdown subagents using the available worker slots. Supply each assignment's topic and brief, the original commission's topic, brief and expertise goal, and relevant parent and neighbouring briefs:

> Apply [staycurrent-breakdown](../staycurrent-breakdown/SKILL.md) to this assignment and context. Return the YAML breakdown for orchestrator-managed batched review.

Builders return their drafts and release their slots; they do not spawn reviewers or wait for review capacity. Review ready results in batches through [staycurrent-review](../staycurrent-review/SKILL.md) in breakdown mode. The three independent perspectives assess every article in the batch; return findings by article, send repairs to its builder and recheck changed work. Reuse the independent reviewer roles across batches within this commission, keeping their perspectives separate. Schedule builders and reviewers within capacity, keeping ready work moving rather than reserving idle slots.

Merge accepted article plans and queue their `nested_article` stubs for separate breakdowns. Each worker plans only its own article's headings; a new child has only topic, title and brief. Expand accepted children recursively until no stubs remain, stopping where sections serve the original goal better than another page. Mark drafts and review outcomes explicitly; batched review defers the check, never waives it.

## Review the whole tree

Give the complete tree and original commission to four fresh independent reviewers using tree mode: completeness and depth; structure, overlap and consolidation; teaching progression; and editorial wording using the three examples. Reconcile findings across the tree, send changed scopes through breakdown and review, and recheck the affected findings before writing. For a planning-only commission, return the reviewed tree here.

## Write and review the articles

Fan out fresh writers with each article's topic, title, brief and own headings; child briefs and planned headings with their contextual link locations; parent and neighbouring scopes; known destinations; and the original commission's topic, brief and expertise goal:

> Apply [staycurrent-write](../staycurrent-write/SKILL.md) to this article plan and context. Return the article for orchestrator-managed batched review, with any proposed tree changes.

Coordinate the four article-review perspectives in batches: practitioner, editorial, teaching and interaction. Give editorial reviewers of written work the piece, audience and three references, withholding planning wording, earlier approvals and the writer’s justification; give other perspectives the scope and family context their assignments need. Collect independent findings, reconcile them and return them to the writer together. Recheck affected perspectives after repair, including the editorial and teaching effects of technical corrections, and retain separate verdicts. Merge tree changes centrally and reconcile affected articles. Parents introduce deeper subjects where they arise and link in context; derive the bottom reading list from the same nested articles.

## Review the written corpus

Use corpus mode with four fresh independent perspectives on the assembled articles and tree. Send findings to their owners and recheck repairs. Return the tree, article locations, review outcomes and unresolved work. Workers in an orchestrated run never create nested review teams; an assigned reviewer performs its perspective directly.
