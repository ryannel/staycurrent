# Evidence for the index explanation

Access date for all sources: 2026-10-04. Documentation was read through the web tool. No database commands, benchmarks, failure tests, or query-plan experiments were run.

| Claim | Primary source and location | Boundary |
| --- | --- | --- |
| A full scan checks rows; an ordered additional index can locate matches and then retrieve full records. | [SQLite Query Planning](https://www.sqlite.org/queryplanner.html), §§1.1, 1.3–1.4; particularly the paragraphs around figures 4–6. | Documented SQLite rowid-table behaviour in an unversioned live manual. Draft uses an explicitly simplified record-reference model, not a claim that every engine stores rowids. |
| Tree navigation can skip sections; PostgreSQL leaf entries refer to table rows, and page splits create additional work. | [PostgreSQL 18 B-Tree Indexes](https://www.postgresql.org/docs/18/btree.html#BTREE-STRUCTURE), §65.1.4.1, first four paragraphs. | Core PostgreSQL 18. No extension, edition, or hosting assumption. Used only for the labelled PostgreSQL example; no measured page counts. |
| Index maintenance accompanies data changes; planners may choose a scan; an index can also help locate rows for UPDATE/DELETE. | [PostgreSQL 18 index introduction](https://www.postgresql.org/docs/18/indexes-intro.html), paragraphs beginning “Once an index is created,” “Indexes can also benefit,” and “After an index is created.” | Documentation, not observation. Additional maintenance does not imply every write statement has higher total latency. |
| Index algorithms differ; the ordered model does not describe every index. | [PostgreSQL 18 Index Types](https://www.postgresql.org/docs/18/indexes-types.html), introductory paragraph and §§11.2.1–11.2.2. | Supports the boundary, not a product comparison. |

The four orders, inserted fifth order, lookup results, and proposed arrows are original illustrative data. The transfer case is editorial inference: an ordinary full delivery-date index still needs an entry for each insert even if no reads use it. The workload contrast follows from maintaining an extra access path; it is not a performance recommendation or threshold.

The diagram proposal is a logical view. It omits physical pages, transaction visibility, logging, caching, duplicate-key compression, and engine-specific references. Its arrows must not imply that PostgreSQL stores order IDs as physical row addresses. The tiny dataset establishes identity and maintenance, not a speedup ratio. The prose explicitly avoids treating the example as a benchmark.

Writing references read: Sam Who’s [Load Balancing](https://samwho.dev/load-balancing/) opening through the round-robin discussion; Bartosz Ciechanowski’s [Gears](https://ciechanow.ski/gears/) Disc/Transmission passages; Julia Evans’s [cartoon teaching discussion](https://jvns.ca/teach-tech-with-cartoons/) scenes and the missing-etcd example. They informed pacing and visual judgement, not technical claims or borrowed prose.

Unverified: independent factual, writing, and blind comprehension review; any eventual visual's meaning and layout. Rendering, theme, keyboard, interaction, and build checks are not applicable to the requested prose-only trial. Overall review readiness has not been assessed.
