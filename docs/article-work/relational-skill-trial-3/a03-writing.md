# a03 · initial writing record

Assignment: fresh writing of **Making concurrent changes correct**, from its plan and canonical example, under skills at `005ab6f`. Orchestrator owns all independent review. No reviewer spawned, no commit or push performed.

First recorded assignment clock: **2026-10-21 19:08:47 UTC**. Completion: **2026-10-21 19:21:34 UTC**, recorded duration **12 minutes 47 seconds**. The initial input-reading call preceded the first recorded clock by less than a minute; an exact earlier assignment-dispatch timestamp was not exposed to this worker.

## Inputs and isolation

Read README, site direction, trial-3 brief; write, figures and continuity skills; the three preserved reference articles in full, including their figure declarations, captions and narrative explanations; a03, parent and neighbouring plans in the coverage tree and registry, through `relational-next.ts`; canonical running example; finished a18, a19 and a20; shared SQL rendering and stepper. No live a00/a03, earlier trial article/component/record, earlier review, or sibling trial-3 article was opened.

The tree's depot example is superseded here by the canonical class-booking extension, which supplies the same one-row and different-row dependencies. The registry's finished a18/a19 are the actual contextual children. This draft preserves their ownership of complete counted-set locking and detailed isolation histories, while supplying a complete fixed-instructor Serializable repair itself. Connections, request recovery and external-work procedures remain with the application branch.

Finished-child discrepancies were read as required and not copied: a18 uses resources/resource_id, owner IDs 7/8, R1/R2 and class capacities 1/1; a19 uses places/staff and makes Mina/Tariq instructors. This draft follows classes/class_id, customers 1/2/3, R7–R14, capacities 1/3, and instructors Lena/Ravi from the canonical record. Proposed child repair remains outside this writing scope.

## Files and teaching choices

- `src/articles/relational-trial-3/a03.astro`: new prose, eight main sections, contextual links, selected observations and source links.
- `src/components/relational-trial-3/a03/model.mjs`: canonical class extension, schema/seed, SQL listings and all figure states. Imports/re-exports common customers from `../example.mjs`, owned by a00's writer.
- `TransactionFigure.astro`: three figures using the shared stepper and site tokens. Committed rows stay distinct from pending work. PK/FK and relation link are visible. Changes are underlined as well as bold.
- `verify.py`: native hostile schedules, an observer establishing real lock waits, strict result assertions, own disposable cluster/database and server cleanup in `finally`.
- `check-model.mjs`: canonical rows and all six option outcomes, including unsafe counterexamples.
- `worksheet.zip`: downloadable layout preserving `example.mjs`, `a03/model.mjs` and `a03/verify.py`; avoids a broken local import in a single-file download.

Figures answer three questions: whether a rejected duplicate consumes capacity; whether a stale read authorises a later decrement; whether stable snapshots protect a two-row decision. Each has a cause-changing option, visible outcome, text alternative and boundary note. None runs PostgreSQL in the browser. The initial data tables and SQL are static because further controls would add no useful cause to change.

Final source length at freeze: **3,917 words**, measured with `wc -w src/articles/relational-trial-3/a03.astro` (trial's comparison metric). Rendered body count is recorded below if obtained.

## Native execution and counterexamples

Tool path `/opt/homebrew/opt/postgresql@18/bin`. `postgres --version` returned `postgres (PostgreSQL) 18.6 (Homebrew)`. Every invocation allocated a new temporary directory, cluster, database `a03_trial` and distinct port. Trust authentication is restricted to the disposable local fixture; no existing service database is contacted.

1. `python3 src/components/relational-trial-3/a03/verify.py 56140 > docs/article-work/relational-skill-trial-3/a03-evidence/native.json`: sandbox initdb failed on `shmget` with Operation not permitted, before a server was started. initdb removed its incomplete data directory; the enclosing temporary-directory cleanup ran. Failure output retained.
2. Same command with **56141**, escalated sandbox permission, output `native-56141.json`: passed all assertions. This run preceded centralising shared customers, using the exact same customer array locally. Transcript records server version, every SQL command/output, waits and stop status.
3. Same command with **56142**, escalated sandbox permission, output `native-56142.json`: final shared-fixture version passed all assertions. `pg_ctl ... -m fast -w stop` returned `server stopped`, exit 0. Sessions and temporary directory removed. This is the final native evidence.

Each transcript includes actual initdb/pg_ctl/createdb commands, `SELECT version()`, default isolation, fsync, synchronous_commit, full_page_writes and deadlock_timeout. Sessions use 10-second statement, 5-second lock and 30-second idle-transaction timeouts. Protected bookings explicitly use Read Committed; stable-view/instructor cases explicitly select their levels. No crash/durability fault, MySQL server or SQLite server was run.

| Protection / teaching claim | Case that exposes its absence | Protected observation |
| --- | --- | --- |
| Couple ownership to decrement | Split commits; second click violates uniqueness after its decrement commits: class22 0 remaining + 2 reservations ≠ capacity3 | One transaction rolls the second decrement back: 1 + 2 = 3 |
| Put current capacity condition inside change | Both clients read1, then write0 and insert distinct R8/R9: class21 0 + 2 ≠ 1 | B's real lock wait observed; after A commits, B gets no returned reservation; 0 + 1 = 1 |
| Roll back after intermediate failure | Inject division by zero after decrement and before reservation; next SQL returns25P02 | Full rollback restores 1 remaining and no reservation |
| Uniqueness arbitrates the shared claim | Class22 has two free places, enough that capacity alone cannot reject Mina's two requests | Concurrent same-owner insertion waits; after winner commits, contender receives23505 |
| Optimistic comparison rejects stale value | Earlier stale overwrite race is the counterexample | Second comparison against remaining1 returns no rows after first changes it |
| Read contract selects snapshot lifetime | Competing commit between two reads | Read Committed 1→0; Repeatable Read 1→1 |
| Cross-row dependency needs full protection | Both count2; different instructor rows change; Repeatable Read leaves0 | Serializable rejects B commit with40001; whole restart counts1 and declines departure |
| Returned row locks do not cover future inserts | Class22 capacity2, R7 locked; R13/R14 insert; count3 | Class lock first, separate count after observed wait returns2; contender declines |
| Deadlock abort is distinct from a wait | A owns21/B owns22; each asks for the other | One40P01 victim, then25P02; both transactions rolled back |
| Conditional statement completes under bounded load | Twenty clients contend for one remaining place | One returned booking, nineteen empty results; final 0 + 1 = 1 |

The counted-lock test intentionally removes reliance on the remaining counter and asserts the reservation-count inequality, matching the article's declared variation. Its unsafe second session also exercises SKIP LOCKED without interpreting omission as absence; distinct insertion still succeeds. The stable-class case verifies the fresh count rather than presenting an unchecked move listing. No complete move algorithm is supplied in this parent, so there is no untested source-recheck/capacity-recheck claim hidden in a listing.

## Checks and browser evidence

- `node src/components/relational-trial-3/a03/check-model.mjs`: pass, canonical rows and six outcomes.
- `pnpm check`: pass, all 13 rules (145 pages at invocation).
- `pnpm build > .../a03-evidence/build.log 2>&1`: pass, 171 built pages; all 13 site rules, 147 checked pages. Final minor continuity wording edits followed this build; they change no structure, model, script or CSS.
- Native final `verify.py 56142`: pass as above.

Writer's first `cua.createBrowserTab('iab', ..., {visible:true})` was unavailable with **“IAB visibility is not supported in a subagent thread”**. Coordinator was informed and owns the final visible checks. Hidden page opened successfully via cua_repl. During HMR, early batched interactions timed out and sometimes read intermediate state; those are not counted as passes. After the page stabilised, all six option combinations reached the expected displayed end state using actual controls:

| Scene | Option | Final step | Displayed result |
| --- | --- | --- | --- |
| Atomicity | Separate commits | 4/4 | 0 + 2 ≠ 3; a place vanished |
| Atomicity | One transaction | 4/4 | Rollback restores 1 + 2 = 3 |
| Race | Read, then overwrite | 5/5 | 2 reservations for capacity1 |
| Race | Conditional change | 5/5 | R9 refused; 0 + 1 = 1 |
| Staffing | Repeatable Read | 4/4 | Both commit; zero available |
| Staffing | Serializable | 5/5 | Fresh restart counts1 and stays |

Hidden playback checked from page timers: starting Race Play changed its button to Pause, retained 1/5 while holding initial text, and set hold-bar transition to `width 4845ms linear`, matching the shared stepper's text-based hold calculation. This is timer evidence, not a claim of smooth visible animation. Coordinator final check: all six option endpoints reached by keyboard; Play/Pause exercised. Race held for 4,845 ms, then 6,780 ms while advancing 1/5 → 2/5. At 375 px in light and dark, no document overflow; controls and captions readable. The coordinator also could not bring the browser to foreground: visibility API returned false because the current chat was not foreground. These are rendered screenshot/DOM and timer checks with an explicit hidden-pane limitation, not a claim of foreground animation review.

## Continuity term ledger

Pass covers prose, contents, captions, labels, model step text, displayed SQL and source list in reading order. Complete article was reread after the draft and revised for terminology. Child titles in further reading name deeper topics after their definitions here.

| Term / notation | First appearance | Explanation or inherited reminder |
| --- | --- | --- |
| Transaction; commit; rollback | Opening paragraph2: “A transaction groups database work…” | Same sentence supplies grouping and discarded-work meaning; BEGIN/COMMIT/ROLLBACK paragraph explains exact commands before figures |
| Table, row, key, SQL, product stock, query, index | Introduction and starting tables | Explicit prerequisite link to Relational databases; article reminds what PK/FK mean before displaying the tables |
| Reservation / remaining / capacity | Opening's shop classes, then invariant | Introduction maps reservation to owner of a place; invariant equation and canonical rows give exact meaning |
| Invariant | “An invariant is a rule that every accepted state must satisfy” | Same sentence, immediately before equation |
| Primary key (PK); foreign key (FK); owner_id | Starting-row introduction | “identifies a row”; “refers to a row in another table”; customer1/2/3 mapping all precede headings/figure labels |
| BEGIN / COMMIT / ROLLBACK | Boundary paragraph | Each command explained in that sentence before displayed SQL or controls |
| Statement | “A statement is one SQL command” | Same sentence before implicit-per-statement commit explanation |
| Pending / committed state | Figure1's lanes and tables | Caption/boundary say tables show committed state, lanes pending work; transaction boundary already explained |
| Atomicity | “This all-or-nothing property is atomicity” | The preceding figure has shown both outcomes; same sentence names and explains |
| Savepoint | “marks a place within a transaction…” | Same sentence; not a separate commit; partial rollback's rule explained immediately |
| Sequence | “number-generating sequences” | Purpose included at first use; limited exception, no unintroduced sequence mechanics |
| Constraint; CHECK; UNIQUE | “A constraint is a rule…” | Same paragraph explains counter bounds and one-customer rule; PK/FK already reminded |
| ACID / consistency / isolation / durability | ACID paragraph | Expands acronym; consistency tied to supplied rules, isolation to overlapping work, durability to survival after commit |
| Read Committed | Last-place race lead-in | Ordinary queries see committed data as each command begins; precedes SQL and Figure2 option text |
| Schedule | Figure2 lead-in | Chosen order of reads/writes/commits across independent transactions |
| Lost update | Figure2 interpretation | Stale calculation replaces value without accounting for Mina's change |
| Serial execution/order | After lost update | Running transactions one at a time; second must decline |
| WITH taken / returned rows / conditional change | Protected listing lead-in | Names rows returned by update, insert consumes them; returned identifier/zero/error interpretations immediately follow |
| Optimistic comparison | Before comparison listing | Change only if row retains value decision used; listing explicitly labelled partial booking |
| Version column | Following optimistic comparison | Incrementing column compared instead of a field that might change away and back; enough to identify alternative without expanding schema |
| Isolation (full definition) | Read/lock section | Observing/interfering contract, with earlier ACID gloss already given |
| Row version; snapshot; MVCC | First read/lock paragraph | Before/after values; selects visible versions; expanded multiversion name in same paragraph |
| Nonrepeatable read; phantom; dirty read | Next read paragraph | Changed reread; changed matching set; exposed uncommitted work, each explained in its first sentence |
| Repeatable Read | Before locking paragraph | Stable snapshot established by first data query/change; own writes exception immediately stated; before Figure3 |
| Row lock; locking read; FOR UPDATE | Row-lock paragraph | Conflicting writers/readers held back from selected row; ordinary reads contrasted; lifetime given |
| Coordination row | Counted-set paragraph | Stable row all relevant writers lock before deciding; fresh-command requirement and all-writer participation follow |
| Write skew | Following Figure3 | Shared-fact decisions change different rows; failure visible already; not used in controls before explanation |
| Serialisability; Serializable | Figure3 lead-in | Equivalent one-at-a-time effect; engine setting named before its first control/instruction |
| Serialisation failure; SQLSTATE40001 | Figure3 rejection text then interpretation | Figure says COMMIT rejected40001; following paragraph names failure and error-code notation, then restart traced |
| Predicate | Serializable mechanism paragraph | “conditions selecting rows”; explains future-row dependency in same sentence |
| Range locking / gap | InnoDB card | Protecting gaps between keys; documentation-only boundary explicit |
| Rollback journal / WAL | SQLite card | Journal saves old contents; WAL expanded to write-ahead log; reader/writer consequence stated |
| SQLITE_BUSY_SNAPSHOT; BEGIN IMMEDIATE | SQLite card | Old-view write upgrade refusal and seeking writer ownership at start; actual restart decision explained |
| Deadlock;40P01 | Waiting section | Cycle of waits before example; database victim abort and code explained next |
|25P02; failed transaction | Restart section | More SQL refused until rollback; worksheet checks actual error scope |
| Lock timeout; contention; deadline/backoff | Restart section | Wait fails before acquisition; retries bounded by request time/count; increasing randomised delay explained in plain words |
| NOWAIT; SKIP LOCKED | Short-transaction paragraph | Refuse conflicting lock / omit locked rows; omissions not interpreted as missing/full |
| Idempotent operation | Uncertain-outcome section | Repeating same logical request does not repeat effect; identity alone insufficient, link to owner |
| Durable result / authoritative database | Missing-reply paragraph | Read persisted booking through the database deciding the outcome; payload matching and pending-original caveat explicit |
| Write-ahead log; flush; synchronous_commit | Commit section | Recoverable record reaching durable storage; storage must honour flush; off means acknowledged work can be lost |
| Transactional outbox; worker | External-effect section | Table of jobs recorded with booking, later delivery by separate worker; repeated-delivery window explained |
| Session / barrier / observer | Final worksheet section and download | Independent session roles established by concurrent schedule; explicit pause/read/release method; third connection checks server wait |

One name per thing checked: Mina/Tariq/Edda remain customers; Lena/Ravi remain instructors. Class21/22 and every R-number follow the canonical record. Figurative races reset independently and say so; refused R9 does not become accepted later. Figure1's unsafe R11 is always refused; only its earlier separately committed decrement survives. Counter-free variation explicitly changes the invariant being checked and states capacity2.

## Proposed record and plan changes

No new people, schema columns, request identities or example extensions needed. Propose aligning the already written children with canonical names/rows in a separate authorised repair. Plan headings were polished for the final learning path; registry relationships unchanged. If the orchestrator updates headings, the eight main headings in the article's local contents list are authoritative for this draft.

## Completion

Coordinator reports no additional defect from the final rendered checks, subject to the visibility limitation above. The draft is ready for its first independent review round. No changes outside the assigned paths; common example module was authored by the a00 writer. No commit or push performed.
