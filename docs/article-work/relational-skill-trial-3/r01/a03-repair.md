# a03 · round 1 repair record

Fresh reviser assignment for **Making concurrent changes correct**, applying `staycurrent-revise`, `staycurrent-write`, `staycurrent-figures` and `staycurrent-continuity` at `005ab6f`. The orchestrator manages independent review. No subagent, commit or push.

Recorded start: **2026-10-21 19:34:57 UTC**. End and measured duration are recorded below after completion of all checks. The start is the first explicit clock reading in this assignment.

## Inputs and scope

Before findings: read the whole trial-3 a03 and its current model, figure component, model check and native script; README and site direction; the three preserved reference articles in full including figure declarations, captions, controls and narrative; a03's coverage-tree plan, parent entry and children, registry relationships; canonical example record; a03-writing and a03 native evidence. Read the finished a18 and a19 handoffs. Their older names were not copied: the canonical record controls the class/customer/instructor identities here. Historical references within that record were context only and no permission to open earlier articles or trials.

Then read round-1 decisions and the relevant teaching-2, editorial-2, visual-1 and editorial-3 reports. No trial-3 run/results or previous trial article, component, work record or review was read. All changes are confined to a03, its components and this repair/evidence record. No shared-example change was needed.

## Finding → repair

| Accepted finding | Repair | Evidence |
| --- | --- | --- |
| editorial-2 / visual-1, critical (one defect) | Fixed Figure 1 lane headings explicitly name R10 and R11. After R10 commits its lane remains on that outcome; R11's decrement, rejected insert and rollback all stay in its own lane. Initial waiting and ready states also have clear request attribution. | Model assertions check stable first-request ownership and second-request failure; all eight rendered states checked, with keyboard Next. `a03-repair-browser.json`; `a03-repair-lanes-phone-light.png`. |
| teaching-2, medium | Added a compact two-read comparison after the Repeatable Read explanation. Added the exact combined locking/count query and a four-event worked history within the existing coordination-row section: starting snapshot, lock wait, Mina's commit, retained count, fresh next-command count. It states the selected native observation, without expanding lock modes or the complete child protocol. | Native script imports the displayed SQL and adversarially asserts combined `22|1` after an observed Lock wait, then fresh count `2`; no R14 insertion follows. Existing weaker-isolation read checks assert 1→0 and 1→1. |
| editorial-3, low (a03 portion) | Replaced “owns that protocol” with the explanation available to the reader: recognise the same request and recover its result. | Complete source/rendered reread. |

## Every new or restructured reader-facing passage

These are the complete additions/changes for the next teaching placement review, without needing report history:

1. **Figure 1 fixed headings**: “Mina’s first request · R10” and “Mina’s second request · R11”. Model step 1 now gives the second request “Waiting for R10 to finish”; step 2 “Ready to attempt R11”; steps 3–4 move all second-request work into that lane. First-request text remains “R10 committed”. Step 4 explanation explicitly names the duplicate-customer rule before the existing invariant outcome.
2. **“A view is not ownership”**, final sentence of the Repeatable Read paragraph: leads into the worksheet's identical reads at both settings.
3. **New three-column, two-row table**, caption “Read Tea tasting’s remaining places, let Mina commit R8, then read again”: names the setting, first query's snapshot/value and second query's snapshot/value. Read Committed has a new view 1→0; Repeatable Read keeps its original view 1→1.
4. **New two-sentence interpretation immediately after that table**: the actual database has zero remaining places in both runs; the repeatable view describes the earlier state and does not reserve the place.
5. **“Lock the fact on which every writer can meet”**, replacement of its final two coordination-row sentences: introduces the capacity-2 history with R7, Mina's lock/uncommitted R13 and Edda's combined query. The pre-existing coordination-row definition and separate-command instruction remain.
6. **New SQL listing**, label “Edda asks for the class lock and reservation count in one command”, sourced from model export `combinedCount`. Wrapped the subquery onto separate lines after phone inspection; SQL meaning unchanged.
7. **New two-column, four-event table**, caption “Observed on PostgreSQL 18.6 at Read Committed”: command starts with R7/count1; waits without refreshing snapshot; Mina commits R13 and Edda acquires class22 but returns count1; separate next command sees R7+R13/count2 and declines R14.
8. **New two-sentence interpretation after that history**: the lock determines who can change next; the new command supplies the view; acquiring the lock did not refresh its waiting command's count.
9. **“A missing reply leaves an unknown outcome”**, linked-reading sentence: “Recovering database requests safely explains how to recognise the same request and recover its result.”

No other passage or section was rebuilt. The full article, contents, captions, labels, controls, text alternatives, SQL and sources were reread after repair against the three references. The added tables supply the missing state the reader otherwise has to animate, and the complete counted-reservation procedure still belongs at the existing child link.

## Native/model/download checks

All native invocations used a newly created disposable PostgreSQL **18.6** cluster and database `a03_trial`, unique ports, and the script's `finally` cleanup. No existing application database was contacted. The transcripts include version/settings, exact commands, outputs, observer-established Lock waits and successful `pg_ctl ... -m fast -w stop`. All three temporary cluster directories were removed.

- **56320**, current source script: passed every assertion, including the newly added combined-command history; transcript `a03-repair-native-56320.json`.
- **56321**, initially refreshed archive extracted to `/tmp/staycurrent-a03-r01-bundle`: passed. Transcript `a03-repair-bundle-native-56321.json`.
- Phone inspection then showed a long line in the newly displayed query. Only its whitespace was wrapped, the archive was refreshed again, and its final extracted script was run on **56322** at `/tmp/staycurrent-a03-r01-bundle-final`: passed. Transcript `a03-repair-bundle-native-56322.json`. This is the final native evidence.

The final archive's `example.mjs`, `a03/model.mjs` and `a03/verify.py` were byte-compared with the current sources. The extracted final worksheet executes with its required relative import intact. Native execution command for that final bundle: `python3 /tmp/staycurrent-a03-r01-bundle-final/a03/verify.py 56322 > docs/article-work/relational-skill-trial-3/r01/a03-repair-bundle-native-56322.json`.

All pre-existing hostile schedules passed too: stale overwrite counterexample, conditional decrement protection, split/whole duplicate-click boundary, forced-error rollback/failed state, concurrent uniqueness, optimistic comparison, Read Committed/Repeatable Read visibility, write skew/Serializable complete retry, returned-row locking failure, separate-command class coordination, deadlock and 20-client load (one accepted, nineteen declined). The new case asserts the exact newly displayed query; it does not infer same-command behaviour from the older separate-command case.

`node src/components/relational-trial-3/a03/check-model.mjs`: pass after final model change (`a03-repair-model.log`). `git diff --check` for assigned source paths: pass. `pnpm check`: all 13 rules pass (`a03-repair-check.log`). A concurrent `pnpm build` failed with a missing generated `dist/pages/learn/databases/distributed-sql.astro.mjs`, logged in `a03-repair-build.log`. Coordinator instructed no retry and will run the sole final integration build after both revisers return; no successful build is claimed here.

Primary documentation rechecked: PostgreSQL 18 [Transaction isolation](https://www.postgresql.org/docs/18/transaction-iso.html), especially per-command snapshots and the locking/update target-row exception, and [Explicit locking](https://www.postgresql.org/docs/18/explicit-locking.html), including lock lifetime. Existing source links remain sufficient. The new count is a selected native observation; the figures remain labelled illustrative models. No MySQL, SQLite or crash test was run.

## Rendered checks

Reused the supplied preview at port4333. Created one IAB tab with options omitted. A foreground attempt returned **“IAB visibility is not supported in a subagent thread”**. Checks therefore use rendered DOM, actual screenshots and page-timer evidence; no smooth foreground animation review is claimed.

First reading before prose: the corrected Figure 1 visibly has two sequential attempts by the same customer; its first accepted booking remains in the first lane, and the second decrement belongs to R11. The new comparison table shows two different snapshot lifetimes without extra controls. The lock-wait table has an explicit timeline and count, so it reads as a history rather than a protocol checklist.

All six figure options reached their expected endpoints using keyboard Enter on Next. Every Figure 1 step in both options was inspected; both options also completed automatic playback to 4/4 Replay. Initial hold was 4,305ms, consistent with changing text. Back and Play/Pause were exercised; pausing retained step3/4 with Play available. Text alternatives for all three figures were opened and read against their models. The figure captions and boundary notes continue to identify models separately from native observations.

At **375px** in light/dark and **1280px** in light/dark: both added tables fit their article column with no internal overflow (343px phone, 640px desktop), and document width equals viewport width. Phone Figure 1 lanes stack, retain complete labels and have no text overflow. Screenshot evidence: `a03-repair-lanes-phone-light.png`, `a03-repair-history-phone-light.png`, `a03-repair-history-phone-dark.png`; control and state evidence in `a03-repair-browser.json`. The first screenshot after an HMR/reload was stale; it was not used to infer geometry or playback, and the final captures followed current rendered-state checks. No CSS or colour tokens changed. Temporary viewport override reset; created tab closed; preview server left running.

Final source count: **4,140 words** (`wc -w`; initial writing record 3,917, change +223). Rendered article text: **4,506 words** at checked states, including draft chrome and dynamic figure text; closed disclosures do not contribute; this is not directly comparable with the source metric.

## Complete continuity term ledger

Read in order, including contents, all figure steps/options, captions, code and further reading. Prerequisite is explicitly the linked Relational databases introduction. No new example extension, identity or terminology repair was required beyond the assigned changes. The added uses of snapshot, command, row lock and reservation appear after their explanation.

| Term / notation | First reader use | Explanation at or before use |
| --- | --- | --- |
| Transaction, commit, rollback | Opening paragraph2 | “groups database work into a change that commits together or is rolled back (discarded) together”; exact commands below. |
| Tables, rows, keys, SQL, query, stock | Introduction / starting rows | Explicit prerequisite link; shop-to-class mapping then PK/FK reminder. |
| Reservation, remaining, capacity | Opening / introduction | Reservation records who took a place; remaining maps to product stock; invariant and starting rows specify quantities. |
| Invariant | First section opening | “a rule that every accepted state must satisfy”, immediately followed by equation. |
| Primary key / PK; foreign key / FK | Before starting tables | Identifies a row / refers to a row in another table. |
| owner_id, request_id, class_id | Starting relations | Real column names with key markings and Mina1/Tariq2/Edda3 mapping; R7–R14 remain canonical. |
| BEGIN, COMMIT, ROLLBACK | Boundary paragraph | Opens transaction / accepts work / discards work before figures/listings use them. |
| Statement / command | Same boundary paragraph | One SQL command; standalone implicit commit explained. |
| Committed / pending state; decrement | Boundary / Figure1 | Accepted work distinguished from pending work in labelled tables/lanes; booking reduces remaining. |
| Schedule | Figure1 caption then Figure2 lead-in | Caption uses the ordinary word for a selected sequence; formal lead-in defines chosen cross-transaction order before Figure2. |
| Atomicity | After Figure1 | Names the demonstrated all-or-nothing property. |
| Savepoint | Next paragraph | Place inside a transaction for partial rollback, explicitly not a separate commit. |
| Sequence | Same paragraph | “number-generating sequences” gives purpose; rollback exception stated. |
| Constraint, CHECK, UNIQUE | Rules paragraph | Database-checked rule; bounds and one-booking-per-customer meanings supplied with syntax. |
| Non-null column | Constraint paragraph | Uses the linked introduction's table/value vocabulary; required counter values underpin its CHECK. |
| ACID, consistency, isolation, durability | End of rules section | Acronym expanded and each promise glossed; consistency tied to supplied rules. |
| Read Committed | Tea tasting race lead-in | Ordinary queries see committed data as each command begins. |
| Lost update | Following Figure2 | Stale calculated value replaces current value without accounting for Mina's change. |
| Serial execution / order | Next paragraph | Running transactions one at a time; second reads0 and declines. |
| WITH taken; RETURNING; conditional change | Protected listing lead-in | Names update's returned rows, insert consumes them; one/zero/error interpretation immediately follows. |
| Optimistic comparison | Before partial listing | Changes only if row retains value used for decision; zero means reread/reconsider. |
| Version column | Following partial listing | Incrementing value to compare instead of field that can change away and back. |
| Row version; snapshot; MVCC | Read/lock section first paragraph | Before/after values; selects visible versions; expanded name multiversion concurrency control. |
| Nonrepeatable read; phantom; dirty read | Next paragraph | Changed reread / changed matching set / uncommitted work, each defined in its first sentence. |
| Repeatable Read | Next paragraph, before comparison table | Snapshot fixed by first data query/change, own work visible; table uses this explanation. |
| New/original/same snapshot | New two-read table | Plain references to the just-defined snapshot lifetime; concrete values show what changes. |
| Row lock; locking reader; FOR UPDATE | Following table | Holds conflicting writers/locking readers back from selected row; ordinary reads can use a permitted version; lifetime explicit. |
| Coordination row | Counted-reservations section | Stable row every writer agrees to lock before deciding; class22 exists even with no reservations. |
| Combined command / fresh next command | New listing/history | Exact SELECT shown; starting view/wait/commit/result/new command each visible; no hidden new mechanism. |
| AS reserved / count(*) | New SQL | Count of reservation rows given in lead-in and table; alias names that output. |
| Serialisability; Serializable | Before Figure3 | Equivalent effect to some one-at-a-time order; PostgreSQL setting named. |
| Write skew | After Figure3 | Two decisions share facts but change different rows, evading same-row conflict. |
| Serialisation failure; SQLSTATE;40001 | Figure3 / its following text | Rejected COMMIT displayed; paragraph names failure/error-code notation and restart consequence. |
| Predicate | Same paragraph | Conditions selecting rows, whose results future rows may change. |
| Range locking / gaps | InnoDB comparison | Protects gaps between keys; documented comparison only. |
| Rollback journal; WAL / write-ahead log | SQLite comparison | Saves old contents; WAL name expanded, snapshot-reader behaviour stated. |
| SQLITE_BUSY_SNAPSHOT; BEGIN IMMEDIATE | Same comparison | Old-snapshot write upgrade can fail; restart decision; seek writer ownership at start. |
| Deadlock;40P01 | Waiting section | Cycle of waits then concrete two-class cycle; one victim aborted. |
| Failed transaction;25P02 | Restart section | Ordinary statements refused until rollback after error; full rollback recipe. |
| Lock timeout; deadline; contention; retry delay | Same section | Protection not acquired in time; limited attempts/time; increasing randomised delay in plain language. |
| NOWAIT; SKIP LOCKED | Short-transaction paragraph | Refuse conflicting lock / omit locked rows; omission cannot establish absence/fullness. |
| Unknown commit outcome; request identity | Missing-reply section | Lost COMMIT reply does not prove rollback; retain identity and check durable result and payload. |
| Idempotent operation | Next paragraph | Same logical request repeated without repeating its effect; application protocol and recovery link. |
| Durable result / authoritative database | Missing-reply section | Persisted result queried through deciding database; pending-original caveat supplied. |
| Durability; flush; synchronous_commit | COMMIT section | Survival promise; recoverable log reaches durable storage; off acknowledges before durability. |
| Replica; backup; recovery | COMMIT boundary / source links | Plain limits on replacement server/copy; linked owners take detailed procedures. |
| Transactional outbox; worker | External-effect section | Table of jobs committed with booking; separate process delivers later; repeat-delivery window stated. |
| Session; observer; native worksheet | Verification section | Independent clients pause/release in stated order; third connection establishes real server wait; download contains exact fixture. |

One name per thing: protection labels match prose; R10 is first click and R11 second click in every step. Mina/Tariq/Edda are customers, Lena/Ravi instructors. Core classes remain21 Tea tasting capacity1/remaining1 and22 Mug painting capacity3/remaining2 with R7. Count variation explicitly lowers22 to capacity2; R13 Mina and R14 Edda never swap. Each experiment resets; refused R9/R11 does not later become accepted in that experiment. New report table and new lock history are separate runs, declared through their starting state and variation. Ownership/counter equality is deliberately replaced by count≤capacity only in the stated counter-free variation.

## Completion and freeze

Recorded completion: **2026-10-21 19:43:16 UTC**. Elapsed from the recorded start: **8 minutes 19 seconds (499 seconds)**. Repair, final model/native/package verification, rendered checks, full reread, complete continuity ledger and placement inventory are complete. Coordinator owns the final integration build and independent next review. No publication, commit or push performed.

**FREEZE:** article and component sources are final at this return. This record and all evidence were finished before declaring freeze to the coordinator. No article/component edits follow that declaration.
