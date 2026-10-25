---
name: staycurrent-breakdown
description: Plan one article from its topic and brief as a heading outline, with stubs for the deeper articles it introduces.
---

Plan this article's contribution to the commission: take an intelligent newcomer to expert practitioner in the commissioned subject, in the least reader time and effort. A child does not set its own specialist target.

Before outlining, study the three fixed references using [staycurrent-write's reference-reading procedure](../staycurrent-write/SKILL.md). Let their teaching shape what this article develops, its explanatory sequence and the placement of deeper child articles.

Start with practitioners' decisions, failure cases and practical judgement, checking consequential points against primary sources and standard texts. Record these intended outcomes in the brief. Then read existing articles and surrounding plans for material and neighbouring coverage; they do not set scope. Let subject depth determine length and form; keep a subject as a section when that serves the reader better than another page.

Briefs state what the reader should understand or be able to judge, with essential example facts and scope boundaries. Leave paragraph-level development and visual design to the reference-led writer. For hard-to-picture ideas, identify what needs making visible.

Make the parent complete for its own learning outcome. Introduce a child through a question the reader now understands; give it deeper reasoning or practice that serves a distinct outcome. State what the parent establishes and what the child develops in their briefs.

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
          brief: Choose and verify safe inspection, rebuild and removal procedures, building on the parent's explanation of maintenance needs.
```

For orchestrator-managed review, return draft YAML. Otherwise arrange breakdown-mode [review](../staycurrent-review/SKILL.md), repair findings and return reviewed YAML.
