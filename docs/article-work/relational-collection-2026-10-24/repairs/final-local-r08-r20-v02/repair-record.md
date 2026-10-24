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
