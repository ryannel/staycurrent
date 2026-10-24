# Plan-v03 repair · security entrances

Repaired the single accepted **V002 / value-2, medium** in `accepted-v02.md`. This is an author/planner repair and continuity record, not an independent confirmation or a complete planning verdict. Applied `staycurrent-breakdown` and `staycurrent-continuity` under the coordinator’s assignment; no delegation or review was performed.

Read the complete current canonical YAML, example record, commission, route projection and 58-row article index, together with AGENTS.md, README.md, site direction, both applicable skills, `accepted-v02.md` and `confirm-v02-value.md`. Long inputs were read in bounded sections; any clipped aggregate material was recovered through smaller reads. The earlier planner/repair records were searched only for projection conventions and dependency context. Existing source and report history is preserved.

## Changed nodes and locations

The canonical file remains `docs/coverage/relational-2026-10-24.yaml`; `planning/articles.json` is regenerated from its existing nine-field metadata projection. The tree status and route heading now identify repaired plan-v03, awaiting fresh confirmations and complete planning readings.

| Node | Canonical location | Repair |
| --- | --- | --- |
| RL121 · PostgreSQL roles, policies and privileged code | Article at line 466: entry, prerequisite list, “Roles and ownership” brief | Prerequisites are now `[RL104]`, removing RL110. The entrance uses general least privilege, tenant boundaries and application connection ownership. The first heading explicitly supplies the needed secure owned deployment, connection identity, database/schema/object names and SQL session context before the existing role and privilege tests. |
| RL128 · Operating and securing a CockroachDB cluster | Article at line 1856: entry, prerequisite list, neighbours, “Secure connections”, “Range health under failure” and “Planned removal” briefs | Common/security prerequisites are now `[RL104]`, removing RL123 from that entrance. Secure deployment and SQL object/session context are supplied locally. RL123 is explicitly retained in the neighbour/entry and both health/removal headings alongside RL109; neither lifecycle section is authorised by security understanding alone. The permission-boundary brief is unchanged. |
| RL131 · Upgrading a CockroachDB cluster | Article at line 1898: entry, prerequisite list, “Before the rollout” brief | Explicitly requires RL123 alongside RL109, RL128 and RL129, and selects RL128’s prepared node-health branch. RL123 was already in its transitive prerequisite closure through RL109 and RL129/RL124; the complete conceptual preparation set is unchanged. This prevents the narrower security visit from being mistaken for upgrade health preparation. |

`planning/routes.md` now agrees in the general “Secure shop boundaries” task, PostgreSQL’s “Change, secure and upgrade” row, CockroachDB’s opening paragraph and “Operate and recover” / “Change schema or software” rows. The general incident row explicitly carries RL123/RL109 when selecting RL128’s cluster-health branch. These are entry clarifications within the accepted finding’s affected dependencies; no unrelated route or scope has been redesigned.

## Dependency implications and preserved acceptance

From the security task’s declared RL79/RL85 understanding, each explicit route remains **two openings**: RL104 → RL121, or RL104 → RL128’s security sections. The removed conceptual requirements are not supplied by pretending that reading a page is compulsory: prerequisites continue to denote understanding which readers may already have.

If a reader with exactly that entry understanding chooses to acquire every additional prerequisite concept through its owning collection page, the prior PostgreSQL closure was RL104/RL121 plus RL86/RL92/RL95/RL110 (six potential openings); it is now RL104/RL121 (two). The prior CockroachDB closure was RL104/RL128 plus RL86/RL92/RL95/RL97/RL102/RL105/RL123 (nine potential openings); it is now RL104/RL128 (two). These are conditional collection-opening counts, not compulsory full-page readings, measured labour or a claim that the final explanations have achieved a particular length.

RL121 has no direct prerequisite consumers in the current tree. Its references from RL79/RL104, RL120 and specialist-extensions still point to policy, privileges or privileged code; none relies on obtaining heap/TID/HOT/WAL understanding through security. The physical owners and their consumers remain intact: RL110/RL111, RL113, RL115 and specialist-sharding retain their own architecture preparation.

RL128’s sole direct prerequisite consumer is RL131. Its preparation is made explicit as above and its full prerequisite closure is unchanged. Other routes/references select RL128 for cluster symptoms (RL103), query/cluster health (RL126) or locality response (RL127): their health work must take the section-specific RL123/RL109 preparation. The changed incident and native routes say so. RL123’s own range preparation and RL109’s movement/survival-budget preparation are unchanged. Recovery (RL129), native transactions (RL124), schema jobs (RL130), and locality (RL127) retain their independently declared range/distribution dependencies; no required preparation was lost through a security shortcut.

All 58 IDs, slugs, stable keys, topics, titles, article briefs, outcomes, parent relationships and heading titles are preserved. Existing security acceptance remains: actual runtime identity, trusted shop selection through pooled connections, allowed shop work, denied cross-shop reads/writes, spoofing rejection, read-only reporting as a separate check, and the chosen mechanism’s bypass boundary. PostgreSQL’s role/default/sequence grants, policy bypass/forced policies, pool reset and privileged routine/name-shadowing tests remain commissioned. No mechanism is chosen for CockroachDB on the writer’s behalf, and no product capability or native success is newly asserted.

## Sources and technical limits

No technical promise, product capability, security enforcement choice or acceptance condition changed. The repair moves only the conceptual entrance and the local setup/recap needed to reach the already commissioned tests. It does not claim that a source can prove which knowledge every reader possesses. The following primary sources were checked on this assignment to ground the specific context retained locally and the lifecycle preparation retained downstream:

| Primary source | Narrow use |
| --- | --- |
| [PostgreSQL 18 · Schemas](https://www.postgresql.org/docs/18/ddl-schemas.html) | Database/schema/object names, qualified lookup and search-path trust supply the relevant logical namespace context; the security work does not use the tree’s physical tuple/page outcomes. |
| [PostgreSQL 18 · Client authentication](https://www.postgresql.org/docs/18/client-authentication.html) and [Role membership](https://www.postgresql.org/docs/18/role-membership.html) | Connection user, active SQL authority, membership and role selection ground the locally introduced session/identity context. No authentication recipe or new tested setting is asserted. |
| [CockroachDB v25.4 · TLS and PKI](https://www.cockroachlabs.com/docs/v25.4/security-reference/transport-layer-security) | Server trust, client authentication and SQL-user context support the existing secure-connection explanation without importing key-range placement. A follow-up fetch using the redirected host missed the cache; the original source reference was reopened successfully. |
| [CockroachDB v25.4 · Node shutdown](https://www.cockroachlabs.com/docs/v25.4/node-shutdown) | Draining, lease transfer, replica relocation and decommissioning retain concrete reasons for range/replica and movement preparation in RL128’s lifecycle work and RL131’s health preparation. |

These checks are not a new practitioner verdict or proof of native acceptance. No database experiment was run, and no secure production deployment, measured timing, topology survival or security test result is claimed. Writers must still pin their actual deployments, versions, settings, mechanisms and native evidence as already required. Fresh value and teaching confirmations of the repaired entrances and affected dependencies, followed by the outstanding independent complete practitioner and blind complete teaching readings, remain with the coordinator.

## Author checks and continuity

Parsed the repaired YAML, counted 58 unique IDs/slugs/keys, compared identities, parentage, topic/title/article brief/outcomes and heading titles with the saved pre-repair canonical input, resolved every prerequisite/neighbour reference and traversed the prerequisite graph for cycles. All checks passed. Regenerated `articles.json`, sorted by stable key, and checked exact equality with the same nine-field canonical projection. Only RL121, RL128 and RL131 metadata/heading briefs changed, besides the status line. The affected direct-consumer graph and security task closures were recalculated; RL131’s complete prerequisite set is unchanged.

Reread the affected entries, surrounding headings, task entrances and later uses from their declared starting understanding. The local context now precedes the identity/namespace work it supports. Tenant remains a shop, not a customer; E1’s composite tenant references remain distinct from read/write authority. No shared rows, identities, stock, bookings, history variants, regions, model assumptions or accepted example extensions changed, so the example record is byte-identical and was not edited. The result is a plan for coherent writing, not evidence from finished prose or rendered controls.

No article, skill, old draft or historic report was edited. No build, preview server, independent review, commit, push or publication was performed; the root owns integration and reviews.

First recorded clock observation: **2026-10-23 23:19:53 UTC**, after the initial file reads were dispatched. Closing integrity hashes and the final clock observation follow; the interval is recorded wall time, not measured reader effort or a claim about exclusive labour.

Final permitted-input/repair integrity check: **2026-10-23 23:24:09 UTC**. Recorded interval: **4 minutes 16 seconds**, plus any unmeasured initial reading. The exact scalar/list diff contains 13 changes: the status and the reported fields/briefs in RL121, RL128 and RL131 only. Canonical line locations above were checked against the finished file.

| File | SHA-256 |
| --- | --- |
| `docs/coverage/relational-2026-10-24.yaml` | `7cc00e203f1b4cee6d036ab8818c3f285eafe6f8a94632f4a36f9688c78f91f6` |
| `planning/articles.json` | `f7d1a4dbb650dca81c909ab9ace866e358799be180c2e38aeee728cc0c1fe949` |
| `planning/routes.md` | `baf064deb54cb9b707a1541d32797dda0f672943731687d6b641789bb20db96e` |
| `docs/coverage/relational-2026-10-24-example.md` (unchanged) | `1ccc633d95cb92b3850644f22f60c4a66f0c531a752d88cabb2e9c1ede5daa68` |
