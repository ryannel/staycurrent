# Field guide polish · 4 October 2026

The reader is choosing where to investigate next. This guide introduces the
storage problem, then connects common jobs to the designs that suit them. It is
not an implementation tutorial or a product ranking. Preserve the ambitious
opening the user helped develop, the separate object/filesystem destinations,
and the restrained technical sketches in both themes.

## Independent readings

The editorial reviewer found the opening and plain family headings effective,
but several sections named a mechanism without explaining its consequence.
The technical reviewer independently identified the missing connection between
known keys and distributing work, and the need to return to correctness and
failure in the conclusion. They found no major false claim in the existing guide.

The fresh reader received the page and context-free voice reference, without
the brief, history or expected answers. They inspected all nine illustrations.
The page updated during that reading; they then read the revised rendered prose
in full. They could follow the guide and choose a next article. They identified
the missing filesystem next step and a return link from distributed SQL that
landed at the collection rather than this guide.

## Revision and judgement

Relational data now introduces tables before giving constraints and transactions
small consequences. The document example explains nesting before discussing
shared information. Device groups explain how work spreads and why a query
across all devices becomes awkward. Search introduces both word lookup and
vectors through the query pictured in its illustration. The graph passage follows
one dependency before naming nodes and edges. Cache hit/miss behaviour now exists
in prose as well as the picture.

The ending distinguishes data models, layouts and application roles, explains
why another capability need not require another service, and returns to global
copies and the last-seat decision. Further reading gives annotated primary
sources. The filesystem section points to an external shared-filesystem example;
there is no local filesystem deep dive yet. Three incorrectly targeted return
links now lead back to the actual guide.

The existing illustrations support these explanations; adding more or introducing
an experiment would not improve the guide's current orientation job. The column
caption now describes matching entries at the same height. Small HTML labels
are enlarged on phones within this page. The subtitle was removed because the
opening already establishes the purpose without an extra summary.

The editor re-read the complete revision and requested one continuity repair:
the object-store paragraph's “That's why” no longer had a cause in the preceding
paragraph. Replaced it with the application's need to keep information about
objects. The technical reviewer rechecked the revised claims and judged them
ready as a draft. The fresh reader reported no remaining consequential prose
comprehension failure. These are review judgements, not user approval or publication.

## Evidence

Primary sources checked for this revision on 4 October 2026:

- [DynamoDB partition-key guidance](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-partition-key-design.html)
  and [core components](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html):
  keyed groups, sort keys and spreading load; reviewed by the technical agent.
- [Cassandra data modelling](https://cassandra.apache.org/doc/latest/cassandra/developing/data-modeling/intro.html):
  query-driven arrangements and partitions.
- [PostgreSQL 18 transactions](https://www.postgresql.org/docs/current/tutorial-transactions.html):
  all-or-nothing changes and rollback. The technical reviewer also checked
  [commit settings](https://www.postgresql.org/docs/current/runtime-config-wal.html#GUC-SYNCHRONOUS-COMMIT)
  and [MongoDB transactions](https://www.mongodb.com/docs/manual/core/transactions/)
  when assessing guarantees across families.
- [Elastic vector concepts](https://www.elastic.co/docs/solutions/search/vector):
  model-generated numerical representations and similarity retrieval. The mug
  query is an illustrative example, not an evaluated model result.
- [S3 storage classes](https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html):
  differing retrieval charges and access times.
- [Amazon EFS introduction](https://docs.aws.amazon.com/efs/latest/ug/whatisefs.html):
  a concrete shared filesystem and file operations, offered as further reading.

Choices such as starting the shop with a relational database are editorial
judgement about the described workload, not vendor claims or measured comparisons.

## Verification and status

Ready as a working draft. `pnpm build` passed with 54 pages. All 17 local links
in the built guide resolve, and all nine map anchors have targets. Verified an
actual map jump on the live development page.

Inspected desktop light/dark views and 390px phone fixtures generated from the
built page, preserving its markup and forcing each theme's media queries. Phone
checks covered the adjusted object, filesystem, relational, document, key and
column labels. No page-wide overflow was present. The search figure's mobile
enlargement opened, took keyboard focus, and scrolled horizontally with ArrowRight.
Existing graph/cache artwork also received the fresh reader's rendered review.
No new simulation or executable example was introduced. The local filesystem
deep dive remains future coverage; the external reference is labelled honestly.
