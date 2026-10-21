# Practitioner review · article · a00 "Relational databases" and a03 "Making concurrent changes correct" (relational-trial-2) · b5586b8

Inputs read: `CLAUDE.md`; the review skill and `perspectives/practitioner.md`; `src/articles/relational-trial-2/a00.astro` and `a03.astro`; every file in `src/components/relational-trial-2/a00/` and `a03/` that carries claims (`model.mjs`, `scenes.mjs`, `verify.mjs`, `verify-sqlite.py`; render and figure components only skimmed for step text); the a00 root and a03 nested brief in `docs/coverage/relational-2026-10-19.yaml`; the a00 sections and the a03 subtree (with the a18 and a19 plans) in `docs/coverage/relational-fanout-2026-10-19.yaml`, plus the a00 section briefs for the other children; the a00 and a03 registry entries and the full article list in `docs/article-work/relational-writing-2026-10-19/registry.json`; the commission; `docs/coverage/relational-example.md`; `docs/article-work/relational-skill-trial-2026-10-21/brief.md`, `a00/writer.md`, `a00/sources.md`, `a03/writer.md`, `a03/sources.md`; headings, parent references and selected passages of the finished child drafts `src/articles/relational-next/a18.astro`, `a19.astro` and `a22.astro`, and the anchor ids of a10, a17, a23, a24, a28 and a38.
Withheld and not opened: `src/articles/relational-next/a00.astro` and `a03.astro` and their component folders; everything under `src/articles/relational-trial/`, `src/components/relational-trial/`, `docs/article-work/relational-skill-trial-2026-10-20/` and `docs/article-work/relational-introduction-review-2026-10-20/`; every other review report, including the editorial and teaching reports already in this folder.
Verdict: repairs required (a00: repairs required; a03: repairs required)

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Correctness · a00 | finding | Nearly every claim checks out against PostgreSQL 18 documentation and my own runs. Two do not: the isolation paragraph explains Figure 4's oversell by the wrong cause (practitioner-1), and the choosing section sends machine-loss tolerance to a distributed database (practitioner-2). |
| 1. Correctness · a03 | finding | Every claim about the engines checks out. The one exception is the lost-reply conclusion that an absent R8 makes a repeat safe, which I reproduced as false (practitioner-3). |
| 2. Evidence · a00 | pass, optional finding | `verify.mjs` passed 214 checks on my run. I reproduced the page counts (1,268/1,271 and 6), the 230-page index, the WAL figures (2.03 against 2.73 MB) and the 23502 texts independently. The replica and the driver listing are labelled as not run. The plan listings are trimmed without saying so (practitioner-10). |
| 2. Evidence · a03 | pass, optional finding | The downloaded pair, run alone on my server, passed 235 checks, and `verify-sqlite.py` passed 3. MySQL is labelled as documented throughout. One load-test outcome is stated as fixed, but it varies by run (practitioner-11). |
| 3. Coverage · a00 | optional findings | Every section brief is met, except that the plan brief's "estimates" is missing (practitioner-7). The contract step's lock and scan go unmentioned (practitioner-8). |
| 3. Coverage · a03 | finding | The intended outcomes are all taught: analysing a two-session history, choosing a protection, abort and retry boundaries, and a deterministic test. The uncertain-commit outcome is taught with a wrong conclusion (practitioner-3). The storage flush caveat is missing (practitioner-14). |
| 4. Depth, both ways · a00 | optional findings | Too deep: the three-protocol race repeats a03's mechanism (practitioner-9). Too shallow: plan estimates (practitioner-7). Everything else sits at orientation depth. |
| 4. Depth, both ways · a03 | pass | The article is long, but every part maps to its brief. The MySQL Serializable card is at the edge of what changes the protocol, but it is short and labelled. |
| 5. Ownership · a00 | optional finding | The other sections give a usable answer and hand off cleanly. The race section owns more of a03's mechanism than it needs (practitioner-9). |
| 5. Ownership · a03 | pass | Hand-offs to a18, a19, a22, a23, a24, a28, a38 and a39 are clean. The instructors write-skew case and the Serializable repair are treated fully here and again in a19, but both plans call for it, so this is a plan question, not a page fault. |

## First reading

Not applicable (practitioner perspective).

## Findings

### practitioner-1 · required · a00, "Transactions and competing buyers", the paragraph after Figure 4 beginning "The race turns on isolation"

Problem: The paragraph explains the oversell as "Tariq’s read could not see Mina’s uncommitted change, so it saw 1." In the history Figure 4 draws (`scenes.mjs`, `raceFrames`), Mina reads, Tariq reads, and only then does Mina write. When Tariq read there was no change, committed or not, so isolation hid nothing. He saw 1 because 1 was true. The oversell happens later: at Read Committed nothing makes Tariq's write depend on the value he read, so after waiting it overwrites with a value calculated from that read.
Effect: The reader learns that the failure is about visibility. They are led to think the cure is to see more, or sooner. That is the wrong model of the central concurrency failure the root introduces. It also sets the reader up badly for a03, whose whole argument is that "the protection must cover the decision as well as the write".
Suggestion: Say that both reads happened before either write. At Read Committed a later write does not check that what the transaction read still holds, so Tariq's update waits, then overwrites. Keep the definition of Read Committed, and keep the remark that an uncommitted change would also have been invisible, if you want it, as a second point rather than the cause.

### practitioner-2 · required · a00, "Choosing a database and a reading route", third paragraph and the route table's last row

Problem: "Must writes continue when a whole machine or region is lost, which points towards a distributed system such as CockroachDB". Losing one machine is the case that Figure 6, on the same page, answers with "Promote a replica: fits". An ordinary single-writer service with a standby, managed or self-run, covers it. The route table repeats the push: read the CockroachDB article "if writes must span machines or regions". The plan for this section (fanout, "Choosing a database and a reading route") says to take the CockroachDB article "only after a concrete distributed requirement survives comparison with a simpler service".
Effect: A newcomer is sent to evaluate a distributed SQL system, with its latency, cost and operating burden, for a requirement that a primary and a standby already meet. The page also contradicts its own recovery figure.
Suggestion: Make machine loss a standby or failover requirement. Reserve the distributed route for the requirements a single writer cannot meet, such as accepting writes through the loss of a whole region with no committed loss, or more write capacity than one server. Point both through the simpler service first, as the plan says.

### practitioner-3 · required · a03, "Losing the reply does not prove rollback", paragraph after Figure 4 (and the "Never committed; service looks up R8" option's step text)

Problem: "If R8 exists, the first attempt committed. If not, repeating the whole booking is safe." A missing R8 shows only that the first attempt has not committed yet. That attempt may still be running: the server may already have received the COMMIT, or the session may still be open because the server has not yet noticed the broken connection. The booking in the article's own listing takes the place before inserting R8. So a repeat that runs during that window waits for the place's row lock. If the first attempt then commits, the repeat finds the class full and tells Mina so while R8 holds her booking. That is the misreport the figure's first option warns against. The primary key prevents double booking, but it does not prevent this, because the repeat never reaches its insert. The child that owns the procedure says the opposite of the article. a22 states that "a missing primary row is also inconclusive while A may still be in flight". It tells the reader not to treat "lookup returned nothing" as permission.
Reproduction: PostgreSQL 18.6 (Homebrew), disposable cluster on 127.0.0.1:57621, with the a03 schema and seed from `model.mjs`. I set `synchronous_standby_names = 'ghost'` only to hold session A's COMMIT in flight long enough to observe. Session A ran `BEGIN; <take 21>; INSERT R8; COMMIT;` and waited at commit (`wait_event = SyncRep`). Session B looked up R8 and got 0 rows. B2 then ran the same take, which waited on a `Lock`. A's backend was then terminated to stand in for the lost connection; its WARNING reported "The transaction has already committed locally". B2's take returned no row (`UPDATE 0`, "class full"). The final rows were class 21 with remaining 0 and R7 and R8 committed. Script: `scratchpad/r01-practitioner/inflight.mjs` (temporary).
Effect: The section that owns the difference between a known abort and an uncertain result presents an absent row as proof of a known abort. A reader who builds recovery from this paragraph will misreport bookings. The rule they leave with is also one the next article in their route contradicts.
Suggestion: State that a missing R8 means "not committed yet". Then say the repeat is safe only when it collides with the first attempt: for example, claim the request id first so that a repeat waits on R8's key, or confirm that the first session has ended. Hand the bounded wait and the procedure to a22, as the paragraph already does.

### practitioner-4 · optional · a00, "From a request to a committed order", Figure 5 "Breaks before COMMIT", step "Ask before acting again"

Problem: The step says "It is not there, so nothing happened and running the whole transaction again is safe." This is the same overstatement as practitioner-3. `placeOrder103` also takes the mug before inserting order 103, so a repeat during the window reports "sold out". The prose before the figure is more careful ("asks whether order 103 exists before deciding to retry").
Effect: At root level the cost is smaller, but the figure teaches the rule a22 later reverses.
Suggestion: Soften the step to "not committed so far". Add half a sentence pointing to the applications article for how to repeat safely.

### practitioner-5 · optional · a00, "Transactions and competing buyers", the contract paragraph listing engine defaults

Problem: Figure 4 offers "Repeatable Read" as one of the two protections that stop the oversell. Two paragraphs later the page says "MySQL’s InnoDB defaults to Repeatable Read". In InnoDB the Figure 4 read-then-write schedule still oversells at that level with no error, because UPDATE acts on the latest committed row (MySQL 8.4, "Consistent nonlocking reads"; a03 says this too). The general warning "the name alone does not tell you what your engine prevents" is present, but the one consequential counterexample is left for the reader to infer, and they will not.
Effect: A MySQL user who stops at the root can conclude that their default level already protects the race.
Suggestion: Add one clause where InnoDB's default is named, saying that the same read-then-write still oversells there.

### practitioner-6 · optional · a00, "Ask for a result, then check what it means", the corrected "what is still due" query (`dueRight`)

Problem: The repaired query joins orders to the per-order value with an inner `JOIN value AS v`. An order with no lines would disappear from the report, which is the very failure the figure has just taught. Section 7 later inserts exactly such an order (105, Edda, no lines).
Effect: The query offered as the model answer carries the bug class it was written to fix, and readers copy model answers.
Suggestion: Use `LEFT JOIN value` with `coalesce`. Alternatively, say that the query assumes every order has a line.

### practitioner-7 · optional · a00, "Correct SQL still has to do physical work"

Problem: The plan brief asks this section to "introduce plans, estimates and measured execution as evidence". The listings are run with `COSTS OFF`, and the prose never says that the planner chooses a plan from estimated row counts. The reader sees what each step did, but not why the database chose it, or that a wrong estimate is the usual reason a correct query takes a bad route.
Effect: The hypothesis loop the section recommends lacks its most common first check: estimated against actual rows.
Suggestion: One or two sentences, with the estimated rows shown in one plan, would be enough. The query-plans child owns the rest.

### practitioner-8 · optional · a00, "Changing a database that is in use", the staged table, row 5 "Contract"

Problem: The table says "Succeeded" for `SET NOT NULL`. On PostgreSQL 18 that statement takes an `ACCESS EXCLUSIVE` lock on `orders` and scans every row while holding it (observed: `AccessExclusiveLock` granted; documented under ALTER TABLE). The adding of the column in stage 1 also takes that lock, briefly. The section warns that a large backfill holds locks, but it presents the contract step as harmless.
Effect: A reader who copies the five stages onto a large, busy table can block every order query for the length of the scan.
Suggestion: Add half a sentence to row 5 or the paragraph below it saying that this step locks the whole table while it checks every row, and that the child article shows how to avoid a long lock.

### practitioner-9 · optional · a00, "Transactions and competing buyers", Figure 4 and the two paragraphs after it

Problem: The root runs three protocols: read-then-write, conditional update and Repeatable Read. It explains PostgreSQL's wait-and-recheck of the WHERE clause, the 40001 serialization failure with whole-transaction retry, and the defaults of four engines. a03's Figure 2 repeats the same race with the same three protocols, plus one more, on class 21. The older root brief asked for "one read-then-write history … and one repaired transaction protocol" and deferred "engine labels to the child". The reviewed fanout brief asks for less mechanism than the page gives.
Effect: A reader on the newcomer route meets the same mechanism twice at similar depth. The root spends time that belongs to a03.
Suggestion: Keep the failing history and the conditional update in the root. Reduce Repeatable Read to a sentence that says a stricter level can refuse the second write instead, and leave the recheck detail and the engine list to a03. The value perspective may weigh this differently.

### practitioner-10 · optional · a00, "Correct SQL still has to do physical work", the two plan listings and the measured-work table

Problem: The listings are presented as `EXPLAIN ANALYZE` output, but lines are removed: `Sort Method`, `Heap Blocks`, `Index Searches` and the `Planning: Buffers` block all appear in a PostgreSQL 18.6 run with these options. The table calls the indexed route "Index scan", while the plan shows a bitmap index scan with a bitmap heap scan.
Effect: The cost is small, but a reader comparing with their own output sees lines the article lacks and a different node name.
Suggestion: Say that the plans are trimmed, and name the node as the plan does, or call it "an index lookup".

### practitioner-11 · optional · a03, "Check the argument with competing sessions and failures", second paragraph

Problem: "The read-then-write code booked all 20 clients in every round." This is one run's outcome from a timing-dependent test. On my run of the same worksheet it accepted 394 of 400 attempts. It overbooked in all 20 rounds, but it did not book every client in every round. The worksheet's own check is "overbooked in some rounds".
Effect: A reader who runs the worksheet gets different numbers from those the page states as fact. That undercuts a paragraph whose point is that load results depend on timing.
Suggestion: Report it as the recorded run ("in the recorded run, all 20 every round"), or state the stable part: it overbooked in every round.

### practitioner-12 · optional · a03, Figure 3 option "Serializable, repeat the failed statement" and the paragraph under "Retrying one statement can preserve a stale decision"

Problem: In this history the statement that failed was `COMMIT`, not the update. The figure's retry repeats the write (`BEGIN; UPDATE … Ravi; COMMIT`), but the option and the prose call it "the statement that failed". Read literally, repeating the failed statement means sending COMMIT again.
Effect: A careful reader is puzzled. The real anti-pattern, replaying the writes without the reads and the decision, is slightly obscured.
Suggestion: Say "repeats only its write" or "replays the writes, not the reads".

### practitioner-13 · optional · a03, "An aborted transaction must be reconsidered as a whole", paragraph after the outcomes table

Problem: "In InnoDB a deadlock rolls back the whole transaction, but a lock-wait timeout or a duplicate key rolls back only the statement, unless `innodb_rollback_on_timeout` is set." That setting affects only lock-wait timeouts (MySQL 8.4, "InnoDB error handling"). As written it seems to cover duplicate keys too.
Effect: A reader may expect the setting to change how duplicate keys are handled.
Suggestion: Attach the "unless" to the timeout alone.

### practitioner-14 · optional · a03, "Commit has a durability boundary and a system boundary", first paragraph

Problem: The paragraph explains well what `synchronous_commit = on` means. But "reached durable storage" assumes that the storage honours flush requests. PostgreSQL's documentation (WAL reliability) warns that drives or controllers with volatile write caches can acknowledge a flush that a power loss then undoes. The plan brief asks this section to connect engine settings and "storage" to failures that can lose an acknowledged change.
Effect: A practitioner can meet this on some disks and virtualised volumes. It is the one storage condition the paragraph leaves out.
Suggestion: Add a clause: the promise holds only if the storage really writes data when told to flush. Link the operations article for testing it.

## Limits

- **PostgreSQL runs.** Everything ran on PostgreSQL 18.6 (Homebrew, aarch64-apple-darwin25.6.0) in a disposable cluster on 127.0.0.1:57621:
  - `initdb --auth=trust --locale=C`, then `pg_ctl -o "-p 57621 -c listen_addresses=127.0.0.1 -c unix_socket_directories=''"`. The cluster was stopped and its directory removed.
  - The a03 worksheet: I copied `verify.mjs` and `model.mjs` alone into a scratch folder and ran `node verify.mjs --host 127.0.0.1 --port 57621` with Node 24.16.0. All 235 checks passed, and it dropped its database.
  - a00: `A00_PG_PORT=57621 node src/components/relational-trial-2/a00/verify.mjs` reported "PASS: 214 checks" and removed its own cluster.
  - Independent psql runs on the scaled shop copy confirmed the page counts, plans, index size and WAL bytes. Separate runs confirmed the error texts and lock modes, and the in-flight commit for practitioner-3.
- **SQLite and MySQL.** `python3 -I verify-sqlite.py` passed its 3 checks on SQLite 3.54.0. MySQL and SQL Server behaviour was checked against their documentation only. No server was run.
- **Rendered pages.** I did not render the pages. I read figure step text and outcomes from `scenes.mjs` and `model.mjs`, which both articles render from. Whether the rendered controls show those steps belongs to the visual and teaching reviews.
- **Child drafts.** I read only the parts of the a18, a19 and a22 drafts needed for ownership and for practitioner-3. I did not review those drafts.
- **Out of scope.** Practitioner-3's window is real, but how often it occurs depends on commit latency and how quickly the server detects a dead connection. I staged it with a synchronous standby that does not exist. I did not measure it under ordinary load.
