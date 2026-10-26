# Proposed availability handoff correction — 26 October 2026

Private proposal only. Main source was read and remains unchanged by this task. Patched copies are under `src/articles/relational-rebuild/`; `availability.patch` contains the same 12 line-local changes. Original snapshots are under `original/` and their SHA-256 values are in `verification.json`.

Applied `staycurrent-revise` and `staycurrent-continuity`. Read all four complete articles in bounded chunks, including their captions, SQL, controls, source notes and styles, and recovered the clipped example-record output. Checked the affected registry briefs and destination metadata against `collection.json` and the source-link handling in `src/lib/relational-rebuild.ts`.

## Changed locations

| Proposed source location | Finished reading handoff |
| --- | --- |
| `data-modelling.astro:132` | [Normalisation and decomposition](/learn/databases/relational/normalisation/) |
| `data-modelling.astro:148` | [Normalisation and decomposition](/learn/databases/relational/normalisation/) |
| `data-modelling.astro:221` | [Modelling hierarchies](/learn/databases/relational/hierarchies/) |
| `data-modelling.astro:264` | [Normalisation and decomposition](/learn/databases/relational/normalisation/) |
| `application-sql.astro:189` | [Transactions and isolation](/learn/databases/relational/transaction-boundaries/) |
| `application-sql.astro:206` | [Connections, overload and capacity](/learn/databases/relational/connections-and-capacity/) |
| `application-sql.astro:231` | [Retries and uncertain commit outcomes](/learn/databases/relational/conflicts-and-retries/) |
| `application-sql.astro:237` | [Outboxes and database-backed jobs](/learn/databases/relational/outboxes-and-jobs/) |
| `application-sql.astro:243` | [Database access and least privilege](/learn/databases/relational/access-control/) |
| `history.astro:121` | [Backup, restore and reconciliation](/learn/databases/relational/backup-and-restore/) |
| `transactions.astro:51` | [Storage and durability](/learn/databases/relational/storage-and-durability/) |
| `transactions.astro:157` | [Retries and uncertain commit outcomes](/learn/databases/relational/conflicts-and-retries/) |

All nine distinct destinations exist and have `reviewed` registry state. Links use each destination's current canonical slug and metadata title. Source links retain the established `/learn/databases/relational/` form; `relationalRebuildLinks` rebases them to this commission's review routes. The proposal makes no publication-state change.

## Continuity and retained evidence

The repair removes only stale availability language and makes the existing handoffs clickable in the present tense. Surrounding reasoning and later uses remain coherent: modelling still delegates formal methods and hierarchy maintenance; application SQL still delegates isolation, capacity, request recovery, worker delivery and access design; history still delegates recovery procedure; transactions still distinguishes row-version storage from snapshots and request recovery from isolation.

The shop facts, schema, IDs, money, chronology, scenario independence and illustrative-versus-observed qualifications are unchanged. Article structure, imports, code, figures, controls, styles, downloads and source/evidence notes are unchanged. No operational use of planned was changed. Native evidence retains its original applicability because no native example or verifier changed.

A focused static comparison confirmed exactly 4/5/1/2 changed lines, one intended handoff per line, complete preservation of frontmatter/styles/component invocations, and exact registry-owned destinations. The original snapshots still matched main source at the check. No build, server, browser, collection review or additional agent was used. Coordinator application and scoped confirmation follow the active article-review lease; no new article or collection review is required by this correction.
