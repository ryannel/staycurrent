---
name: staycurrent-breakdown
description: Plan one commissioned article's heading outline and contextual child-article stubs from its topic and brief.
---

Plan this article's contribution to the commission: take an intelligent newcomer to expert practitioner in the commissioned subject, in the least reader time and effort. A child does not set its own specialist target.

Before outlining, study the three fixed references using [staycurrent-write's reference-reading procedure](../staycurrent-write/SKILL.md). Let their teaching shape what this article develops, its explanatory sequence and the placement of deeper child articles.

Start with practitioners' decisions, failure cases and practical judgement, checking consequential points against primary sources and standard texts. Record these intended outcomes in the brief. Then read existing articles and surrounding plans for material and neighbouring coverage; they do not set scope. Let subject depth determine length and form; keep a subject as a section when that serves the reader better than another page.

Keep briefs short: state the reader's intended understanding or judgement and any essential example facts or scope boundary. Put supporting research and secondary cases in context notes. Leave paragraph development and visual design to the reference-led writer; identify only what needs making visible.

For a general subject taught through one implementation, plan around the subject's decisions; include alternatives where they change the reader's choice.

Make the parent useful without reading its children. For a distinct deeper outcome, give the child ownership of the full formal analysis, detailed comparisons or working procedures. The parent develops the concept through a sufficient example and explains when that deeper work is needed. State the boundary in both briefs; do not require the child's treatment in the parent.

Return `topic`, `title`, `brief` and a recursive singular `heading` list. Under the heading introducing a child, place `nested_article` with only its `topic`, `title` and `brief`; commission that child's headings separately. Titles/headings are reader-facing. Prefer established, searchable industry terms where they fit naturally. Use the collection's [example record](../staycurrent-continuity/SKILL.md), proposing missing extensions; the root proposes the record. The writer polishes final wording.

```yaml
topic: Relational indexes
title: Indexes
brief: Understand how indexed lookups reduce reads and judge their maintenance costs.
heading:
  - title: How an index finds a row
    brief: Understand how an indexed key leads to a row and why this can save page reads.
  - title: Write cost and upkeep
    brief: Understand the index work caused by changes to stored data.
    heading:
      - title: Building and removing indexes
        brief: Recognise the risks of index changes; detailed operating procedures belong in the child.
        nested_article:
          topic: Index maintenance
          title: Maintaining indexes
          brief: Choose and verify safe maintenance procedures; the parent explains their purpose and risks.
```

For orchestrator-managed review or an explicitly requested outline-only draft, return draft YAML. Otherwise arrange breakdown-mode [review](../staycurrent-review/SKILL.md), repair findings and return reviewed YAML. Keep any unresolved scope or example dependency with the result.
