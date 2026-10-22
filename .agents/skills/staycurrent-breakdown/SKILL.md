---
name: staycurrent-breakdown
description: Plan one article from its topic and brief as a heading outline, with stubs for the deeper articles it introduces.
---

Plan this article's contribution to the commission: take an intelligent newcomer to expert practitioner in the commissioned subject, in the least reader time and effort. A child does not set its own specialist target.

Start with practitioners' decisions, failure cases and practical judgement, checking consequential points against primary sources and standard texts. Record these intended outcomes in the brief. Then read existing articles and surrounding plans for material and neighbouring coverage; they do not set scope. Let subject depth determine length and form; keep a subject as a section when that serves the reader better than another page.

Return `topic`, `title`, `brief` and a recursive singular `heading` list. Under the heading introducing a child, place `nested_article` with only its `topic`, `title` and `brief`; commission that child's headings separately. Titles/headings are reader-facing; instructions and outcomes belong in briefs. Hard-to-picture ideas need a named example, figure or table in their brief for teaching review. Use the collection's [example record](../staycurrent-continuity/SKILL.md), proposing missing extensions; the root proposes the record. The writer polishes final wording.

```yaml
topic: Relational indexes
title: Indexes
brief: Explain how indexes work and what they cost.
heading:
  - title: How an index finds a row
    brief: Follow a lookup from key to table page, counting pages read.
  - title: Write cost and upkeep
    brief: Follow changes through the indexes.
    heading:
      - title: Building and removing indexes
        brief: Introduce operating decisions before deeper reading.
        nested_article:
          topic: Index maintenance
          title: Maintaining indexes
          brief: Teach how to inspect, rebuild and remove indexes safely.
```

For orchestrator-managed review, return draft YAML. Otherwise arrange breakdown-mode [review](../staycurrent-review/SKILL.md), repair findings and return reviewed YAML.
