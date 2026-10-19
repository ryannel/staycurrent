---
name: staycurrent-orchestrate
description: Build recursive article trees and coordinate their review, writing and repair from a topic and brief.
---

Take an intelligent newcomer to expert practitioner, optimising useful understanding against reader time and effort. Run the planning and writing stages the user commissioned.

## Build the tree

Keep one canonical YAML tree under `docs/coverage/` and a work record under `docs/article-work/`. Give a fresh subagent the topic, brief, original goal and relevant parent and neighbouring briefs:

> Apply [staycurrent-breakdown](../staycurrent-breakdown/SKILL.md) to this topic and brief within the supplied context. Return the reviewed YAML breakdown and any unresolved findings.

Merge the returned article and its headings. For every `nested_article` stub, give its topic, title and brief to another breakdown subagent; replace the stub with that agent's reviewed result. Continue recursively until every article has its own heading tree. A worker plans only its assigned article, never its children's headings; stop splitting where sections teach the subject more effectively than another page.

## Review the whole tree

Use [staycurrent-review](../staycurrent-review/SKILL.md) in tree mode with the complete tree and original brief. Its three independent perspectives check completeness and depth, structure and overlap, and teaching and flow against the three examples. Reconcile their findings across the tree; send new or changed article scopes through breakdown, then recheck the affected findings before writing.

## Write the articles

Assign every article, including parent introductions, to a fresh writer. Supply its topic, title, brief and own headings; its nested articles' topics, titles, briefs and link locations; relevant parent and neighbouring briefs; and the known article destinations:

> Apply [staycurrent-write](../staycurrent-write/SKILL.md) to this article plan and context. Return the reviewed article, review results and any proposed tree changes.

The writer manages its practitioner and writing/teaching reviews and repairs. Merge proposed tree changes centrally and reconcile affected articles. Each parent introduces a deeper subject where it arises and links to its dedicated article; derive the bottom reading list from those same nested articles.

## Review the written corpus

Use the review skill in corpus mode on the assembled articles and the tree. Check what the writing actually teaches and how the articles connect, send findings to their owners, and recheck the repairs. Return the finished tree, article locations, review outcomes and any unresolved work.

Use fresh workers without inherited conversation history and pass the relevant assignment and skill paths. Schedule parallel work within the available capacity, leaving room for workers' own reviewers. An assigned reviewer returns its perspective directly rather than commissioning another review team.
