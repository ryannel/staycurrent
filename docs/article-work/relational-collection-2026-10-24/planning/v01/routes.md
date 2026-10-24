# Relational reading routes · provisional

The canonical tree is `docs/coverage/relational-2026-10-24.yaml`. Its prerequisite IDs name entry **understanding**, not a requirement to finish every linked page. Readers who can already explain those ideas can enter at the task they face. Tree parentage introduces deeper reading; it is not a linear syllabus. The introduction is preserved and still offers its existing entrances.

IDs below resolve to title, slug and commissioning key in `articles.json`. Every implementation path assumes the relevant general mechanism; native articles recap only the concepts necessary to follow their experiment. Product documentation, versions and native outcomes must be pinned by the writer. No reading path implies that a conceptual model or local process drill establishes production performance.

## The first question

| Question after the introduction (RL76) | First article | Understanding developed before branching |
| --- | --- | --- |
| What facts should the tables hold? | RL77 · Relations, keys and normalisation | Row meaning, identity, dependencies and agreed versus current prices. Continue RL78 for value meanings and RL79 for rules. |
| Why is this report wrong? | RL81 · Joins and the meaning of a result row | Matching, multiplication, missing rows and one clear result grain. Consult RL78 for NULL and equality. |
| Can two purchases both be correct? | RL90 · Transactions and isolation | Atomic boundaries, snapshots and one-row versus multi-row invariants. Continue RL91 for lock scope or RL93 for retry identity. |
| Why is a correct query expensive? | RL86 · Indexes and access paths | Access work, key order and write costs. RL77/RL81 supply identities and result meaning first. |
| What happens when the server crashes? | RL95 · Write-ahead logs and crash recovery | Durable log versus data pages. RL90/RL92 supply transactions and physical versions first. |

## Task paths

These are useful routes, with a stopping point when the task is answered. Follow prerequisite links for missing understanding rather than reading unrelated product branches.

| Task | Entry understanding | Main route | Natural stop or branch |
| --- | --- | --- | --- |
| Design shared shop data | Introductory tables, keys and purchase (RL76). | RL77 → RL78 → RL79 → RL80 | Stop with row meanings, forbidden states and history choices. For runtime authority, first take application ownership in RL85, then RL104. |
| Produce a correct report or export | Keys and value/NULL semantics (RL77–RL78); the introduction’s SQL. | RL81 → RL82; transaction snapshots (RL90) before RL83 | Stop with a defined grain, total order and list/export contract. Query cost is RL86 → RL87. |
| Implement safe checkout | Introductory purchase; keys, missing values and rules (RL77–RL79); result grain (RL81). | RL90 → RL85 → RL84 → RL93 → RL94 | Stop with conditional writes, connection ownership, one request identity and an explicit external-effect boundary. Add RL91 when lock scope or contention matters. |
| Run a repeatable import | Constraints (RL79), transaction boundaries (RL90), application transaction ownership (RL85). | RL84; RL93 for ambiguous batch commits | Stop with a conflict/version policy, rejected-row evidence and replay reconciliation. Live schema copies belong to RL100. |
| Diagnose slow service | Correct result grain (RL81–RL82), basic transaction/lock behaviour (RL90–RL91) and application pools (RL85). | RL86 → RL87; RL92 for version retention → RL102 → RL103 | Stop when a causal diagnosis and bounded intervention are supported. Use native RL113/RL120 or RL126/RL128 for the chosen engine. |
| Depend on recoverable data | Transaction atomicity (RL90), versions (RL92), history meaning (RL80). | RL95 → RL96 | Stop after an isolated restore acceptance and reconciliation design. Use RL115 → RL116 for PostgreSQL or RL123 → RL124 → RL129 for CockroachDB. |
| Add read copies or transfer authority | General WAL and commit boundary (RL95), application routing (RL85). | RL97 → RL98 | Stop with a freshness contract, acknowledged-loss budget, fence and former-primary return plan. Native physical standby work is RL115 → RL117. |
| Change a live schema | Keys/constraints (RL79), application ownership (RL85), bounded writes/imports (RL84). | RL100 → RL119 or RL130 | Stop after compatibility, convergence and acceptance are demonstrated. For binary/engine changes use RL122, RL131 or RL132 instead. |
| Decide whether to distribute | Correct queries/indexes (RL81/RL86), transactions (RL90), replicas (RL97), measured capacity (RL102). | RL105 → RL106 → RL107 → RL108 → RL109 | Stop with a partition key, invariant scope, read contract, failure budget and movement obligations. A hot single stock row is not made independent by adding nodes. |
| Retain or delete dated data | Time semantics and history (RL78/RL80), indexes (RL86). | RL89 | Stop with a useful partition boundary and explicit key/reference and retention consequences. Distribution is a separate decision in RL105. |
| Secure shop boundaries | Row/reference constraints (RL79), application identity and pool ownership (RL85). | RL104 → RL121 or RL128 | Stop after allowed and denied operations are verified as runtime identities. Shop integrity, authentication and row visibility remain distinct. |

## PostgreSQL practitioner paths

The PostgreSQL starting implementation is version 18; the integration owner reports 18.6 locally available. This is an available test tool, not proof that any article’s experiment ran. Native articles pin their own server, extension and configuration evidence.

| Task | Prerequisite understanding | Implementation route |
| --- | --- | --- |
| Explain and maintain a running server | General indexes, versions and WAL (RL86/RL92/RL95). | RL110 → RL111; use RL120 after general diagnosis (RL103) and native plans (RL113). |
| Repair query work | General plans and typed values (RL87/RL78), plus PostgreSQL architecture (RL110). | RL112 → RL113; return to RL120 if time is spent waiting rather than executing. |
| Choose richer representations and retrieval | Row design and values (RL77/RL78), native index/operator contracts (RL112). | RL114 for JSON; specialist-full-text-search for lexical matches; specialist-vector-search for embeddings and retrieval recall; specialist-extensions for ranges, spatial predicates and lifecycle. These are four distinct questions. |
| Own recovery and replication | General recovery and authority (RL95–RL98), architecture (RL110). | RL115 → RL116 for restore; RL115 → RL117 → RL118 for physical versus logical copies. |
| Change, secure and upgrade | General compatible migration (RL100), privilege boundaries (RL104), recovery/failover and application semantics. | RL119 → RL122 for upgrade/move; RL121 for roles and privileged code. RL122 also needs RL116/RL118 so the route is genuinely recoverable. |
| Place work across PostgreSQL servers | General sharding/atomic commit (RL105/RL106), native architecture (RL110). | specialist-sharding. Choose application shards, Citus or foreign tables deliberately; RL89 is the separate one-service partition lifecycle. |

## CockroachDB practitioner paths

Begin with RL123 after the general sharding, replicas and index mechanisms. The integration owner has verified a 25.4.17 binary; writers must still pin tested settings and official versioned documentation. The inventory’s earlier exact patch transition is a scope clue, not a recommendation or claim about the newest release.

| Task | Prerequisite understanding | Implementation route |
| --- | --- | --- |
| Locate work and commit purchases | General distributed commit (RL106), request identity (RL93), range/key model (RL123). | RL124; then RL125 after distributed snapshots (RL107). |
| Reduce expensive or hot work | General plans (RL87), indexes (RL86), ranges (RL123). | RL126; add RL124 when retries expose contention rather than missing access paths. |
| Place data across regions | General placement and distributed reads (RL108/RL107), ranges and read contracts (RL123/RL125). | RL127. Local process failure demonstrates only its actual failure boundary. |
| Operate and recover | General access, rebalancing and restore (RL104/RL109/RL96), ranges and transactions (RL123/RL124). | RL128 for security and node lifecycle; RL129 for backup, restore and booking reconciliation. |
| Change schema or software | General compatible migration and cluster change (RL100/RL109), ranges (RL123). | RL130 for schema jobs; RL128 → RL129 → RL131 for a recoverable binary rollout and finalisation boundary. |
| Move an existing SQL application | Application semantics and live compatibility (RL85/RL100), request identity (RL93), native transactions (RL124). | RL132. Do the tested compatibility rewrite before the consistent copy and write handover. |

## Coverage and boundaries

The routes reach all 58 current destinations: one preserved introduction, 30 general/distributed articles, 13 PostgreSQL implementation articles, ten CockroachDB articles and four PostgreSQL specialists. No merge is proposed. Mechanism and implementation remain separate because a conceptual explanation does not supply the operational evidence a practitioner needs, while native details should not be prerequisites for understanding the general mechanism.

The browser SQL sandbox and existing practice guide remain optional familiarisation tools. Their models, commands and observed outcomes do not automatically validate a newly written chapter. Rebuilding those applications, other database families, product procurement and production topology selection are outside this commission.
