---
name: staycurrent-breakdown
description: Plan one article from its topic and brief as a heading outline, with stubs for the deeper articles it introduces.
---

A breakdown decides what one article teaches and which deeper subjects it hands on to nested articles. The aim is the commission's: take an intelligent newcomer to expert practitioner in the commissioned subject, in the least reader time and effort. This article contributes its share of that goal; it does not set a new goal of specialist mastery in its own topic.

Start from what a practitioner needs, not from existing pages. Work out the decisions, failure cases and practical judgement this article must give the reader, checking consequential points against primary sources and standard texts, and record them in the brief as its intended outcomes. Then read any existing articles and the surrounding plan. They can supply material and show what neighbours already teach, but they do not set the scope.

The subject sets the depth. A shallow subject may be taught fastest as a short catalogue of examples, common cases and corner cases; a deep one may need its mechanism opened up. Never pad or trim a section to match its neighbours.

Return the article's `title`, `brief` and a recursive `heading` list. Place each `nested_article` under the heading that introduces it, with only that child's `topic`, `title` and `brief`; its own headings come from a separate breakdown. Keep a subject as a section wherever that serves the reader better than another page to open.

Titles and headings are for readers, so write them as they would appear on the page. Teaching instructions and intended outcomes belong in the briefs. Where a section's idea is hard to hold in the head, such as changing state, data spread across tables or a sequence of events, its brief names the example, figure or table that will show it, so teaching review can check the plan before anything is built. The writer polishes the final wording, so aim for clear rather than final.

```yaml
topic: Relational indexes
title: Indexes
brief: Explain how indexes work and what they cost.
heading:
  - title: How an index finds a row
    brief: Follow one lookup from key to table page, counting the pages read.
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

When the orchestrator manages review, return the YAML as a draft. Otherwise review it with [staycurrent-review](../staycurrent-review/SKILL.md) in breakdown mode, repair the findings and return the reviewed YAML.
