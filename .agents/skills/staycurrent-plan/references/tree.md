# Tree format

Return `topic`, `title`, `brief`, `exit_questions` and a recursive `heading` list. Under
the heading that introduces a child article, place `nested_article` with only its
`topic`, `title`, `brief` and `exit_questions`. Plan that child's headings separately.
Titles and headings face the reader: use the field's established, searchable terms
where they fit naturally. The writer polishes the final wording.

```yaml
topic: Relational indexes
title: Indexes
brief: Understand how indexed lookups reduce reads and judge their maintenance costs.
exit_questions:
  - A query reads 60 table pages through an index for one customer. When does a covering
    index cut that to two or three page reads, and what does it cost on each write?
heading:
  - title: How an index finds a row
    brief: How an indexed key leads to a row, and why this saves page reads.
  - title: Write cost and upkeep
    brief: The index work caused by each change to stored data.
    heading:
      - title: Building and removing indexes
        brief: The risks of index changes; detailed procedures belong in the child.
        nested_article:
          topic: Index maintenance
          title: Maintaining indexes
          brief: Choose and verify safe maintenance procedures.
          exit_questions:
            - ...
```

## Parent and child

Make the parent useful without its children. It develops the concept through a
sufficient example and says when the deeper treatment is needed. The child owns the full
analysis, detailed comparisons and working procedures. State the boundary in both briefs.

For a general subject taught through one implementation, plan around the subject's
decisions. Include alternatives where they change the reader's choice.
