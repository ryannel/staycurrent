# Final local v02 author repair record

Preparation and actual fixed-reference study: [preparation.md](preparation.md). Accepted scope: `input/accepted.md`. Original provenance/applicability: `input/mechanical-applicability.md`, `input/mechanical/applicability.md` and per-key records. This is author repair/verification, not independent review.

## r20 — F4 — complete and frozen

Changed only `src/components/relational-collection/r20/Progress.astro`, fourth full-text progress state. It now names a replica process crash and makes the storage flush contract a condition, while retaining replay 0 and the fresh query's absence of order 103. The visible fourth-state message already says replay is still behind; no mechanism, state transition or stronger native failure claim changed.

After edit, reread complete r20 and complete Progress component, including caption, all controls/messages/alternative and final Sources. Continuity: separate pre-103 replication history, order/line/stock atomicity, conceptual 0/1/2, flush versus replay, fresh versus retained snapshot and documented storage condition agree. No wider restructuring or dependencies changed.

Evidence reused: `input/mechanical/r20/native-result.json` and its execution provenance/native commands/source/dependency hashes. They show paused durable receive versus replay, absent 103 before replay and old/fresh snapshot difference afterwards. They do not test an independent storage failure or power loss; no new execution claimed. PostgreSQL 18 [WAL reliability](https://www.postgresql.org/docs/18/wal-reliability.html) supports the flush-contract condition; the article's original primary-source links remain relevant. Root to check the changed alternative in the immutable preview.

Frozen SHA-256:

- r20 article (unchanged): `89bb704386ae4ed90135ad14637360530aabb07817a51e99c8a164f39281cf9b`
- Progress.astro: `0ff8dd289857e55b5dbb2cffc0fff83146a9780ff8d79d9c99ab81fc134137a7`

## r08 — F2 — complete and frozen

Reworked only the introductory explanation of `publish-the-batch-and-its-receipt-together`: define a snapshot and Read Committed's per-statement view, follow batch-b waiting for batch-a and reading its committed version/ledger state in later commands, then prepare the fixed older Repeatable Read contrast and link its owner. Guard, comparison SQL, receipt/staging logic and native schedule claims are unchanged. No new table, figure or protocol.

Reread the affected section before edit, then the complete resulting article and complete VersionFlow states/controls/caption/alternative/Sources; reread the final changed paragraph after a wording refinement. Continuity: same single source, source versions 1/2/3, exact prices 20/25/24, all writers' guard, separate guard/comparison statements, atomic ledger/current/receipt and unchanged stock/line prices agree. No unrelated section or overall argument was restructured.

Primary check: PostgreSQL 18 [Transaction Isolation](https://www.postgresql.org/docs/18/transaction-iso.html), Read Committed and Repeatable Read sections: statement-start snapshot versus retained transaction view, own writes, waiting and later statements. Existing native evidence is applicable to the unchanged protocol: `input/mechanical/r04-r08-r09-exact/exact-runs.json`, r08 clean and inherited-PGOPTIONS read-only runs, plus their stdout/environment/hashes. Exact current download remains `5ac05788f61451cec4f767582e1e02b28fea4e4f480bb21224d60e0178a9724d`; VersionFlow remains `f9084ff3483e51dcc08b8fa5ecf8601b430f5ed6c968e92b9374ff1d285ece74`. No new native run claimed or required for this prepared explanation. Root to inspect the expanded local passage in preview.

r08 frozen article SHA-256: `eb65b93d703a4cbbc06ce747b927d80900e8dc340b3a32bed7b970c134207472`.

## r42 — F3 — complete and frozen

Declared the enabled-but-not-forced earlier configuration before either unsafe-helper case; carried that state into the second case and figure note/text alternative. Explicitly distinguished normal owner bypass from definer execution under FORCE, then tied the limited helper's prices to the actual later check after enabled+FORCE restoration. No native state was changed and no new experiment was invented.

Read the complete supplied `access-drill.py` and native results: enable/policies precede unsafe_scope/unsafe_lookup, which precede restricted helper construction and its successful calls; later FORCE controls yield owner 0, administrator/bypass 4, then disabled owner 4; after enabled+FORCE restoration both restricted helper prices are checked again. Exact current download hash equals the supplied served hash: `5e0c320215b9c4fd8d7ec07e58f4df0d08567fcd3b2e5c4429853a9d7a095eb4`. Reuse `input/mechanical/r42/native-results.json`, `original-source-hashes.json` and `download-check.json` with their local SQL/identity limits. No ceremonial rerun of unchanged code.

Fresh technical source confirmation: PostgreSQL 18 [Row Security Policies](https://www.postgresql.org/docs/18/ddl-rowsecurity.html) for owner/FORCE/default-deny and [Writing SECURITY DEFINER Functions Safely](https://www.postgresql.org/docs/18/sql-createfunction.html#SQL-CREATEFUNCTION-SECURITY) for execution authority and temporary-object lookup. The latter shows why wrong-object lookup is distinct from the intended table's policy; the repair does not credit FORCE with preventing name shadowing.

Reread complete repaired r42 and NameLookup, all captions, both five-state branches, alternatives, code, acceptance table and final Sources. Continuity audit: runtime/session/effective identities, grants and owner state agree; 18.00/999/20.00 have distinct sources; the real catalogue never changes; the safe role remains non-owner without bypass. Only the declared configuration passages/note/alternative changed; no section order or broader argument/dependency changed. Root to check the note and complete alternative in preview.

Frozen SHA-256: article `ced577f8fa2a147ebf699bbde07165abfa96c472175dbe6ac26939de1b11aca4`; NameLookup `d5c97f61be9a7dd1ce87a32e59002c05ed705461d02d0d61909ffd364dd52519`.

## r34 — F5 — complete and frozen

Condensed only the general opening of `read-the-counters-at-their-scope`: replaced repeated per-node/Limit/per-loop instruction and its three-row arithmetic table with a short reminder linked to the read-only r11 owner; removed the second repeated inclusive-time reminder. Retained native shared/local/temp categories and parallel-worker scope, settings/capture explanation, and every correlation, cast, custom/generic partial-index, visibility and skew distinction. The unchanged still-sequential statistics result continues to prepare knowledge versus access path.

Reread complete repaired r34 and complete Prepared, including all options/values, captions/alternative, code and final Sources. Continuity: synthetic 99,000/1,000 fixture is separate from core history; 10→977 estimate, cast-column 500→960, 2,048 versus 25 local accesses, 3-access partial routes and IDs 99001–99010 are unchanged. No r11 edit, new calculation, wider restructuring or changed native claim. Primary [Using EXPLAIN](https://www.postgresql.org/docs/18/using-explain.html) rechecked for node scope; original `input/mechanical/r34/` environment, native, verifier, download and hashes remain applicable to unchanged SQL/data. Root to inspect the shortened transition in preview; no native rerun needed.

The Sources description was also aligned with the removed arithmetic table: it now calls only the retained proof diagram explanatory. Prepared hash remains `1fc818c6a8433e471bf5222cafe024d5f98c3c0092bcba11cb3272699791c628`, worksheet `1dd7746217f4edf4b981a00fb365610dcd3459ea8a0de8a38e90e39e3e39767c`.

r34 frozen article SHA-256: `bec40a4d7ebbc01f52a81080433bbe10614267379cd058c119211949ec0198ee`.

## r54 — F1 downstream — complete and frozen

Expanded only the existing UNION ALL/Append paragraph into a short local recap and observed-plan paragraph. Appended compatible contributions are distinguished from matching pairs/duplicate removal; the scoped shop identity stays visible; the new owner link targets r05 `#appending-results`. No FDW SQL, result, component, Citus claim, snapshot or movement protocol changed.

Reread complete repaired r54 and complete Snapshots/OwnershipMove, including all six states, tables, captions, controls, alternatives, code, plan excerpt and Sources. Continuity: tenant variant remains explicit, receipt uses captured prices, two P7s are separate identities, the two scans feed Append, scratch snapshots are not a shared instant, fence/epoch/revision/journal remain separate. The only new dependency is r05's new section; integrate that target before treating the link as complete.

Primary [Combining Queries](https://www.postgresql.org/docs/18/queries-union.html) checked for UNION ALL compatibility/preservation. `input/mechanical/r54/native-results.json` explicitly records Sort→Append→two foreign scans, with shop IDs in outputs, and remains applicable with `source-hashes.json`/`download-check.json` to the unchanged native mechanisms. No two-instance rerun needed or claimed. Root to inspect the new local handoff in preview.

Frozen SHA-256: article `06659d719ec15c8e0dcd1b2938628d4769f03d70262187db4f6f78aa621fd6c7`; unchanged Snapshots `5698306208754ab9f3518c7985bfbf06a220a4061dd9e4208f4173ff91162740`; unchanged OwnershipMove `afa836af9607d7682d316803ed9efef715b95a22aef2100bd5243732af89a308`; unchanged download `5760c15b938865258def185bc298681d4df4eddda2a2867ab6ef270a91748ed8`.

## r05 — F1 owner — source-author-complete and frozen; exact native verification pending

Added `appending-results` after the existence/absence explanation: paid and pending order lists append existing customer IDs as 1,1,2; replacing UNION ALL with UNION gives 1,2; retaining customer+order identity keeps the distinct three pairs. A compact comparison table shows actual expected output rows and the prose explains compatibility, identity/projection and final ordering. Added a closing reminder and primary Combining Queries source. The still-due report and all existing joins/absence examples remain unchanged. Added these exact query forms and explicit result-array assertions to the reader SQL before its synthetic empty-order case.

After edits, reread complete r05, both complete Multiplication/OuterFilter components and entire modified SQL download, including all captions, changing messages, controls, alternatives and Sources. Continuity: uses only existing core orders/status/customer IDs, no new shared rows/history; Mina's two orders contribute repeated ID1, Tariq's one contributes2, Edda contributes none; order identity changes the projected-row comparison without inventing a new entity. Report values/payments and historical agreed prices remain unchanged. The added section, closing reminder, Sources link and new SQL checks are the entire changed scope. r54 handoff is the only downstream dependency.

The worked comparison follows the actual fixed-reference calibration: retain small visible inputs, compare outcomes and then explain the changed rule. No new interactive mechanism or decorative drawing was needed. Root will inspect the new SQL/table and surrounding passage in an immutable preview.

Primary PostgreSQL18 [Combining Queries](https://www.postgresql.org/docs/18/queries-union.html) checked for append/duplicate semantics, positional column/type compatibility and lack of guaranteed output order. New execution evidence must establish the changed SQL; historical r05 evidence alone is not used to claim that. The exact complete reader download was attempted on the granted private PG18.6 instance, but initdb failed before SQL due sandbox permission and then host SysV resource exhaustion. Details/cleanup limits: `evidence/r05-native-attempts.md`; source-based fallback assessment: `evidence/single-user-research.md`. No unowned IPC, existing cluster or global setting was changed. Root arranging an isolated hosted exact-psql run remains necessary.

Frozen source hashes: article `8ba466f8ad9dcac14a126563ac48fcceb5f610ceac8f220adb5d7b59897be374`; reader SQL now `fa039073a34bf6544894c457ce523f934b65dcbbf8e635168cf90bc28aedc57c`. Root explicitly requested this source freeze for draft integration and an exact hosted psql check. This is not yet a clean native verification claim.

Root's first hosted run `40082087202` executed the prior exact SQL hash `523cb8d7e39a626ac006f1794ea035949e960ae58f6ecbe10ba860cfa0e533fe` on official PostgreSQL18.6-bookworm and produced the expected SQL results/assertions, but its raw transcript exposed an unterminated string at the newly added unquoted apostrophe in a `\echo` line. Its green exit status is not clean verification. On root's concrete author-QA instruction, changed only that display message to `Including order identity keeps all three distinct rows`, removing the quote. Reread the entire exact resulting SQL file: all declarations, queries, assertions, rollback and messages are coherent; article/result/table/figure bytes remain unchanged. Root will rerun exact new bytes with stderr lexical-error detection.

## Scope and verification status

`evidence/source-scope-audit.json` compares the supplied 297-file current-source hash manifest: exactly eight expected source files differ and none are missing. This does not substitute for root's separate protected-file manifest. No metadata, tree, core fact, r11 or shared shell/style/script changed. No build, server preview, commit, push or independent review was performed by this writer. All six source units are frozen; r05's exact new execution remains outstanding.

Root reported integration/push of r08/r20/r34/r42 at `9df55d2d`, with ordinary desktop/phone, light/dark rendered author checks passing, including r42's condition and expanded alternative; no source change was requested. Those are root's current rendered observations, not additional firsthand browser checks by this writer. Root will integrate frozen r05/r54 for the remaining immutable-preview and hosted execution checks. The same author assignment remains active until actual results are supplied and assessed.

## r05/r54 ordinary author rendered checks

Inspected root's immutable all-six build at port4558 in one own Chrome1 tab315244730/session preparationWriter-author-v02. Actual default viewport was1488×917, System selected/resolveddark before and after; no viewport, theme, global setting or another tab changed. Read the actual r05 new section, SQL, two-column comparison table, identity/compatibility explanation and its closing transition; no clipping, overlap or incorrect displayed rows. Read r54's actual recap/owner handoff and observed Append paragraph within the FDW section; no local rendering issue. Followed actual collection navigation to discover r54's route, verified ownerhref `/review/relational-collection/query-results/#appending-results`, activated it by keyboard and observed the correct r05 heading/anchor destination. Source bytes were not changed for rendering. No figure controls were touched; transient own navigation disclosures were discarded with navigation. Explicitly closed own tab/released after check. Screenshots inspected in CUA output, no durable files saved. This covers actual default desktop/Systemdark only; root owns other view/theme checks.
