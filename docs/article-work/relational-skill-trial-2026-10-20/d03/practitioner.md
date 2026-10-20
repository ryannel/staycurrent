# Practitioner review · article · a00 "Relational databases" and a03 "Making concurrent changes correct" (trial versions) · 5a49e8c, round d03 (narrow recheck)

Inputs read: d02/repair-decisions.md; the "d02 repairs" sections of a00/writer.md and a03/writer.md; `git diff f786105 5a49e8c` for src/articles/relational-trial/ and src/components/relational-trial/a03/ (a03.astro, a00.astro, model.mjs, verify.mjs, ScheduleFigure.astro); the PostgreSQL 18.6 documentation installed with Homebrew (Serialization Failure Handling) for the 23505 wording. Scope as instructed: only what the d02 repairs touched. Withheld as before: the live a03 and other perspectives' reports.

Reproduction: PostgreSQL 18.6 (Homebrew, aarch64-apple-darwin25.6.0), in a fresh disposable cluster in my scratchpad (`initdb --locale=C -U staycurrent -A trust`; port 57511, `listen_addresses=127.0.0.1`, `unix_socket_directories=''`, `LC_ALL=C`). It was stopped afterwards. On a scratch copy of the a03 component folder I ran `PGPORT=57511 A03_DB=prac_a03 node verify.mjs`. It exited 0 and every check passed, including the new one, "Counting bookings FOR UPDATE: the second session waits, then overbooks". Its evidence: the second session waited on a lock (confirmed through `pg_stat_activity`), then returned only `R7`, and class 22 ended with 3 bookings for capacity 2. This agrees with my independent d02 experiment. Figure 5's two schedules and the repeated-move recheck also still pass (`UPDATE 0, ROLLBACK`). a00's changes are prose only, so I did not rerun its verify.mjs.

Verdict: pass (a00: pass; a03: pass)

## d02 findings

| Finding | Piece | Status | Note |
| --- | --- | --- | --- |
| practitioner-8 | a03 | fixed | The table row reads "Run at Serializable" for "Several rows, when every writer can be run at Serializable". It relies on conflict detection "between Serializable transactions only", and every writer must run at Serializable and be retried or rerun after 40001, with `default_transaction_isolation` on the role for a program you cannot edit. The closing argument says the same. One logic slip in the new wording is recorded as optional practitioner-13. |
| practitioner-9 | a03 | fixed | The false "neither would wait" sentence is gone. The paragraph states the observed wait-then-overbook case, and verify.mjs now checks it (reproduced above). |
| practitioner-10 | a03 | fixed | The paragraph uses `stock` and order lines. The ordering claim is now conditional and limited to "each other's stock rows", so it no longer contradicts a00's listing or the deadlock section. |
| practitioner-11 | a00 | fixed | "The last row carries a second lesson". The markup slip noted in d02 Limits is also fixed: the paragraph before "PostgreSQL 18 offers …" is now closed. |
| practitioner-12 | a03 / a18 | deferred by the coordinator | Not rechecked. It concerns a18, outside the trial. |

## Checks

| Check | Result | Note |
| --- | --- | --- |
| Correctness | finding (optional only) | The repaired Serializable row, the FOR UPDATE case and the shop paragraph are correct. The 23505 retry rule now matches the PostgreSQL documentation's example (a key chosen after inspecting the stored keys, at Serializable). Dropping 23P01 from the body is acceptable, since Sources still covers it. The closing sentence's "if neither" condition is slightly wrong (practitioner-13). a00's new definitions of pages and replication lag are correct. |
| Evidence | pass | The new FOR UPDATE claim is observed, labelled as a run ("We ran this"), checked by verify.mjs and reproduced. No unrun result is presented as observed. |
| Coverage | pass | Not affected by the repairs, except to improve. The awkward case of a locking count that waits and still overbooks is now taught. |
| Depth, both ways | pass | The additions are one paragraph and a table rewording. Nothing goes deeper than the brief, and the counted-booking protocol is still handed to a18. |
| Ownership | pass | The table still summarises a03's own choices. The FOR UPDATE example is one observed case that motivates the coordination row, not a second treatment of a18's protocol. Figure 5 against a18 is deferred (practitioner-12). |

## Findings

### practitioner-13 · optional · a03, "Check the argument with competing sessions", closing argument, vendor-tool sentences

Problem: "…points to Serializable only if two things can be arranged: it runs at Serializable … and its refused runs are retried or rerun. If neither can be arranged, no protection in the table covers that tool." The two conditions play different roles. Running at Serializable is what protects the rule. Retrying is what lets the tool's work eventually succeed. If the tool cannot be run at Serializable, nothing in the table covers it, whether or not it can be retried, but "if neither" implies that one condition alone might do. If it runs at Serializable but cannot be retried, the rule still holds and only the tool's refused runs fail. A related edge: `default_transaction_isolation` on the role is only a default. A tool that sets its own level with `SET TRANSACTION` or `BEGIN ISOLATION LEVEL` overrides it, so the setting has to be confirmed, for example from `pg_stat_activity` or the tool's logs.
Effect: A practitioner with a tool they can retry but cannot run at Serializable may read the sentence as leaving room for Serializable. The protection gap stays open.
Repair: "If it cannot be made to run at Serializable, no protection in the table covers that tool, and it must be changed or kept away from these tables. If it runs at Serializable but its refused runs cannot be retried, the rule holds, but those runs fail and must be rerun by hand. A role default is only a default: check that the tool does not set its own isolation level."

## Limits

- Narrow round: I checked only the passages and code the d02 repairs touched. Unchanged parts of both pieces stand as reported in d01 and d02.
- I did not rerun a00's verify.mjs, because its d02 changes are prose only (no model or SQL change).
- The `default_transaction_isolation` remedy and its override behaviour are checked against documentation, not run.
- I did not view the stacked "Choosing a protection" layout at 375 px. That is visual's recheck.
