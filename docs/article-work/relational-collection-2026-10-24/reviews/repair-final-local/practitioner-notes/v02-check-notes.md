# Practitioner confirmation notes · repair-final-local-v02

These are this checker's observations, not author notes or a new native run.

## Identity and input boundary

- Manifest SHA-256: `1aef05969d6a80c22dbf2c11b43ab6c9900364d373f06ad40318ba25d7b1f1db`; all 171 input files exist and match their recorded SHA-256.
- Read the six frozen articles, their relevant components/downloads, commission, six briefs, mechanical applicability and the relevant native records. Read no peer reports or earlier quality verdicts.
- Owner context only: final-corpus/v02 frozen r11 SHA-256 `ad58cb1e813383a0221029911609a6ed5d8c03e767e617b46bf4823cb3559556`; r13 `7f27b1bfec892e53f25cc3be76693e9abfe2cf189322fee4a8e8884a8be451c4`. Both match that packet's manifest (`f04b100a8b0cf47d2eae95f55037f3045b97abfe016188de697e7b324b29b21b`). Used the finished owner explanations, not their review history.
- Current downloads were fetched from the actual download hrefs extracted from the five served article pages: all seven returned HTTP 200 with frozen bytes. See [download check](v02-download-check.json). An initial hand-constructed trailing-slash download URL returned 404; that URL is not the served href. Ordinary sandbox networking was unavailable; the authorised read-only retry succeeded.

## Current rendered observations

Used the current 4560 preview in the in-app browser, with DOM/accessibility reads and actual controls. Screenshot inspection covered the r05 appended-results passage/table, r42 surrounding setup/note, and r20 expanded alternative. This is practitioner inspection, not a complete visual perspective.

### r05

Read the rendered appended-results section, table, identity projection, compatibility/order paragraph and concluding question checks. The displayed table says UNION ALL `1, 1, 2` and UNION `1, 2`. The identity paragraph gives `(1,101), (1,103), (2,102)`. The table agrees with both the preceding branch accounting and the exact hosted output. Physical sequence is not promised; the example has a final ORDER BY.

### r08

Read the rendered guard section through the receipt and overlapping-publisher observations. Snapshot, statement view and retained Repeatable Read are explained before the recipe. The guard is a separate SELECT FOR UPDATE command. In `apply_batch`, line 41 takes the guard, line 43 reads batch identity, line 54 reads each remembered version, and lines 61–70 write observations/current prices/receipt. All remain inside the Read Committed transaction. Raw staging/validation precede the guard but do not read the persistent version state. The two worker threads call this same function. Setup/reset and the explicitly unsafe scratch upsert are not represented as competing guarded publishers.

### r20 controls

Stepped through all five current states using Next; expanded the complete text.

| State | Primary / received / durable / replay | Query | Live distinction |
| --- | --- | --- | --- |
| 1 | 0 / 0 / 0 / 0 | No 103 | Earlier consistent replica state |
| 2 | 2 / 0 / 0 / 0 | No 103 | Asynchronous primary success |
| 3 | 2 / 2 / 0 / 0 | No 103 | Arrival does not establish durable storage or query visibility |
| 4 | 2 / 2 / 2 / 0 | No 103 | Flushed commit, replay still behind |
| 5 | 2 / 2 / 2 / 2 | 103 present | New snapshot sees purchase; retained snapshot can remain old |

Expanded state 4 explicitly names a replica process crash, conditions survival on storage honouring the flush contract, and keeps replay 0/no 103. The caption distinguishes conceptual positions from native durable-receive/replay observations. No storage-failure execution is claimed.

### r34

Read the current rendered counter reminder and categories, and inspected the owner href `/review/relational-collection/query-execution/`. The full current source preserves the statistics, expression, typed-parameter, partial-index, generic/custom, Limit and worker-scope reasoning. Its native worksheet/Prepared component match executed identities. No changed diagram mechanics require a new native run.

### r42 controls

Stepped both modes through all five current states, resetting each mode first, then expanded the full alternative. The fixed note always says enabled row security without FORCE.

| Step | Unqualified owner lookup | Qualified, limited lookup |
| --- | --- | --- |
| 1 | runtime_10; counterfeit row and permission grant prepared; neither relation read | runtime_10; cannot become either privileged role |
| 2 | effective shop_owner; original session unchanged | effective catalogue_code; session_user remains runtime_10 |
| 3 | temporary relation selected; real table not reached | shop.products selected; temporary relation not referenced |
| 4 | forged relation readable under helper authority; real-table policy does not decide it | policy maps original session to shop 10; role has no ownership/bypass |
| 5 | 999 from temporary price field; real price stays 20.00 | 20.00 from real table; temporary row/setting cannot redirect it |

The full alternative agrees, including the later repeat after FORCE restoration. In the unchanged native script, ENABLE/policies are at 119–124, unsafe results at 141/144, restricted results at 160–164, first FORCE at 174, owner disable at 179, restoration at 181 and repeated restricted prices at 182–183. The article deliberately groups owner controls earlier, then explicitly returns to the earlier test configuration before both unsafe cases. It does not claim a new chronological native run.

### r54

Read the current rendered remote-work section through the diagnostics paragraph. The recap describes contributions, compatible rows and retained identity before naming observed Append. The href is `/review/relational-collection/query-results/#appending-results`; its destination heading and content were inspected in r05. A browser attempt to click the off-screen link timed out without navigation; the href/destination content were separately verified, so no successful-click claim is made.

## Applicable native evidence

- r05: exact current SQL `fa039073a34bf6544894c457ce523f934b65dcbbf8e635168cf90bc28aedc57c`; actual hosted run `40082315960`, PostgreSQL/psql 18.6 Linux, unique `sc_40082315960` database. Read the raw transcript and verifier, not just the result summary. SQL/verifier hashes printed at raw lines 219–220; same-session endpoint/version proof 222–225; three new outputs 284–305; assertions, completion marker and rollback 307–312; container/network cleanup recorded. Verifier `ef859218b5164e3e8c81dc81a2ed21c2a45daf5ac874d4f2f829c8c5bf77ffc1` rejects diagnostic errors in addition to pipe failure. No current macOS execution is inferred.
- r08: exact unchanged executable `5ac05788…24d`, shop/feed and VersionFlow hashes match current input. Read current function plus exact-run verifier/provenance and clean/read-only-environment records. Existing PostgreSQL 18.6 macOS/Psycopg 3.2.12 results cover rollback, replay, stale payload, contradictory old payload and two guarded workers. The observed overlap has two lock waiters and final version 3/24.00; it does not observe every possible schedule or run a Repeatable Read variant.
- r20: read native.py, commands, result and dependency identities. Actual paused durable receive `0/300DC58`, replay `0/3000000`, zero 103; resumed replay gives fresh count 1/old count 0 and P3 10/P7 0. This is a local macOS PG18.6 replay/snapshot observation, not a crash or storage test.
- r34: unchanged worksheet `1dd77462…67c`, Prepared `1fc818c6…628`, verifier `821144ab…421`. Read native.txt, environment and verifier. Correlation estimate 10→977 for 1,000 actual remains Seq Scan. Expression estimate 500→960 remains Seq Scan/2,048 local accesses; integer equality uses Index Scan/25. Generic general statement scans/sorts; custom pending and generic fixed-pending use partial Index Only Scan, three local accesses, ten heap fetches. Returned IDs 99001–99010. No automatic choice or latency conclusion follows.
- r42: current exact download `5e0c3202…5eb4` matches original executed script identity. Read its code and native-results; actual unsafe values 18.00/999, safe values 20.00/18.00, owner controls 4→0→4 and final catalogue are consistent with the repaired explanation.
- r54: current exact drill `5760c15b…ed8` and both figures match executed identities. Read the relevant current verifier commands and native-results: global plan is Sort→Append→two Foreign Scans, both Remote SQL filters P7; explicit assertion checks `10 Blue mug`, `20 Copper mug`. Nearby snapshot and fenced-transfer boundaries retain their bounded meaning. No Citus execution is claimed.

## Primary sources checked on 24 October 2026

- [Combining Queries](https://www.postgresql.org/docs/18/queries-union.html): compatibility, duplicate removal and order.
- [Transaction Isolation](https://www.postgresql.org/docs/18/transaction-iso.html): statement snapshots, own changes, locking recheck and retained Repeatable Read.
- [Row Security Policies](https://www.postgresql.org/docs/18/ddl-rowsecurity.html), [CREATE FUNCTION safety](https://www.postgresql.org/docs/18/sql-createfunction.html#SQL-CREATEFUNCTION-SECURITY), [search_path](https://www.postgresql.org/docs/18/runtime-config-client.html#GUC-SEARCH-PATH): owner/FORCE, definer authority and temporary relation resolution.
- [WAL settings](https://www.postgresql.org/docs/18/runtime-config-wal.html#GUC-SYNCHRONOUS-COMMIT), [Reliability](https://www.postgresql.org/docs/18/wal-reliability.html), [Recovery control functions](https://www.postgresql.org/docs/18/functions-admin.html#FUNCTIONS-RECOVERY-CONTROL): flush/storage limits and durable-receive versus replay functions.
- [Using EXPLAIN](https://www.postgresql.org/docs/18/using-explain.html), [EXPLAIN](https://www.postgresql.org/docs/18/sql-explain.html), [Parallel plans](https://www.postgresql.org/docs/18/parallel-plans.html): partial consumption, counter scope/categories, settings and worker detail.
- [Planner statistics](https://www.postgresql.org/docs/18/planner-stats.html), [CREATE STATISTICS](https://www.postgresql.org/docs/18/sql-createstatistics.html), [Partial indexes](https://www.postgresql.org/docs/18/indexes-partial.html), [PREPARE](https://www.postgresql.org/docs/18/sql-prepare.html): correlation/expression knowledge, join-estimation limit and parameter-dependent predicate proof.
- [postgres_fdw](https://www.postgresql.org/docs/18/postgres-fdw.html): remote planning/SQL and remote transaction snapshot scope.

No new database execution was needed or performed. The host SysV resource limit was respected; no IPC removal or global setting change was attempted.
