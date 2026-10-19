# CockroachDB RL126–RL132 author handoff

19 October 2026. Seven complete replacement drafts are authored at
`src/drafts/relational/rl126.md` through `rl132.md`. Each remains `status: drafting`
for independent review. No live page, shared component, map, native script or
observation JSON was edited. No commit or push was made.

Each matching brief has this author's independent ability account, saved before
reading its card or existing prose, and a reconciliation with the final commission.
Each `evidence/rlNN-author.md` records the consequential native observations,
primary sources, reproduction ownership and limits.

## The explanations

- RL126 follows the actual noncovering/covering lookup, distinguishes local SQL
  distribution from remote KV work, and adds the measured four-bucket ordered-read
  regression. Its figures show the dependent lookup and lost chronological run.
- RL127 configures native regional-by-row and GLOBAL data, keeps the repaired
  current-database dependency, waits for five voters, and follows an accepted
  booking through eu-labelled process loss and rejoin. The voter figure is
  explicitly an illustrative allowed layout, not a fixed placement measurement.
- RL128 connects TLS trust, authenticated client identity and SQL permission;
  follows a real permitted read and denied write; uses supported range/node
  evidence; and completes node removal with actual replica and foreground checks.
- RL129 follows full, incremental and revision-history recovery, including an
  earlier-time restore that succeeds while missing valid r82, its reconciliation,
  a latest restore, missing application grants and a missing backup collection.
- RL130 follows a stored computed column, a wrong unique-index rule, and a real
  concurrent index job. The pause-requested/paused distinction and rejected early
  resume lead to a successful later resume and a query through the published
  index, including writes accepted while the job was interrupted.
- RL131 separates node binaries from logical cluster version, preserves and tests
  a supported prefinalisation return, finalises the repaired run and observes the
  old binary reject the newer store. The retained BulkAdder error supplies the
  actual reason the smaller-memory run failed to finish.
- RL132 ports the source's deferred-reference write, preserves the invariant by
  changing statement order, fences the real source_app identity, copies one
  PostgreSQL snapshot and follows target-only r82 into explicit reconciliation.
  The bounded offline window is deliberate; no live CDC pipeline is claimed.

## Native evidence read and incorporated

Root executed and owns these records. This author read the actual commands,
outputs, failures and resulting states rather than running another environment:

- `cockroach-observed.json`: canonical completed 25.4.17 run, including query,
  schema, backup, regional, decommission and source-to-target migration cases.
- `cockroach-schema-resume-observed.json`: successful separate RESUME after the
  job reached paused; the canonical run records its subsequent success.
- `cockroach-upgrade-observed.json`: successful 25.3.7 to 25.4.17 transition,
  prefinalisation return, final logical version and old-binary exit.
- `cockroach-low-memory-upgrade-observed.json` and
  `cockroach-low-memory-log-excerpt.txt`: exact memory configuration, incomplete
  version state and preserved internal backfill/BulkAdder error provenance.
- `lab/cockroach_lab.py`, `lab/cockroach_scenarios.py` and
  `lab/cockroach_extra.py`: executable schedules, fixture setup and cleanup.

Observed query work: covering reduces 20 KV rows / 2 calls to 10 / 1. A different
newest-ten read changes from 10 / 1 to 40 / 4 after four-way hash sharding;
reported maximum memory changes from 20 KiB to 110 KiB. No write-throughput
improvement is claimed from that comparison.

Observed schema work: the recorded concurrent fixture has 200,000 starting rows
and 200,001 after an old caller inserts during interruption. The later worksheet
uses a smaller 50,000-row parameter to bound runtime; its scale must not silently
replace the observed count. Fixed job IDs in prose belong to the recorded run.

Observed membership: the listener on port 56909 maps to actual node ID 5.
Decommission reduces its reported replicas from 27 to zero; stopping it leaves
the regional application at two bookings / €42 and no booking replicas on that
member. The eu process-group outage also accepts a new booking and preserves
both records after rejoin.

Observed recovery: latest restore includes r80, concurrent-A and r82; the
saved earlier HLC omits r82, and replay adds it back. A root query succeeds while
the restored session grants list root/admin, so application-role acceptance is
kept as a separate obligation. All restores used different database names on
the same cluster. No independent-host restore is claimed.

Observed migration: source child-first deferred write succeeds; target deferred
syntax fails 0A000; immediate child-first write fails 23503. The actual source
application write is denied after mutation grants are revoked. The copied target
has one order / €20, then accepts r82 and reaches two / €42. The source remains
one / €20 until explicit reconciliation reaches two / €42. The source's recorded
encoding is SQL_ASCII and its values are ASCII; arbitrary Unicode/collation
migration and arbitrary decimal parser round-trips remain untested.

## Verification and boundaries

`pnpm build` passes all 13 site checks. The normal build intentionally excludes
private review routes. Root owns the final private preview build, browser/control
checks and independent fresh-reader/technical/editorial reviews for the assembled
collection. This author has not described those as completed.

All CockroachDB nodes run on one macOS ARM64 host. Region labels, stopped
processes and loopback timings are not independent geographic failure domains,
WAN measurements, production capacity guidance or power-loss durability tests.
The major upgrade actually finalised in the available experimental mode; no
unobserved licensing blocker or deployment recommendation is asserted.

No map move is proposed. Keep the existing boundaries: RL123 owns key/range
construction, RL124 retries, RL125 read freshness, RL126 work/key tradeoffs,
RL127 placement/survival, RL128 steady membership and identity, RL129 recovery,
RL130 DDL jobs, RL131 binary/logical upgrade gates and RL132 application-contract
migration. Shared distributed-systems teaching remains parked.
