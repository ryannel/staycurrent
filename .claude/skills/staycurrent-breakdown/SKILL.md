---
name: staycurrent-breakdown
description: Break one topic and brief into an article's headings and contextual nested-article stubs.
---

Break down the supplied topic and brief into the current article's title, brief and recursive `heading` list, teaching only the depth this piece contributes to expert practice in the original commissioned subject, with the least reader time and effort. Place each `nested_article` under its introducing heading, returning only that child's `topic`, `title` and `brief`; leave its headings for a separate breakdown. Give each article and section a reader-facing title; put teaching instructions and intended learning outcomes in its brief. Title and heading wording remains provisional for the writer to polish. Return draft YAML when the orchestrator manages batched review; otherwise use [staycurrent-review](../staycurrent-review/SKILL.md) in breakdown mode, repair the findings and return the reviewed YAML.

```yaml
topic: Relational indexes
title: Indexes
brief: Explain how indexes work and what they cost.
heading:
  - title: Write cost and upkeep
    brief: Follow changes through the indexes.
    heading:
      - title: Building and removing indexes
        brief: Introduce the operating decisions before offering deeper reading.
        nested_article:
          topic: Index maintenance
          title: Maintaining indexes
          brief: Teach how to inspect, rebuild and remove indexes safely.
```
