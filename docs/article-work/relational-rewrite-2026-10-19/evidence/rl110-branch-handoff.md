# PostgreSQL branch handoff: RL110–RL122

19 October 2026. All thirteen commissioned drafts are written, totalling 23,394
words. Every page remains `status: drafting`. No live page, navigation, layout,
shared model or coverage map was changed. No commit or push was made.

## Files and authoring work

- `src/drafts/relational/rl110.md` through `rl122.md`: complete first drafts.
- `briefs/rl110.md` through `rl122.md`: ability accounts saved before reading
  coverage cards or previous article prose, followed by final-card reconciliation.
- `evidence/rl110-native.py`: executable shared PostgreSQL fixture and all native
  investigations. Python 3 standard library; no driver installation required.
- `evidence/rl110-native-all-observed.json`: final complete successful execution,
  literal SQL, commands, stdout, stderr, selected file hashes and server logs.
- `evidence/rlNN-observed.json`: per-page extracts with canonical event indexes.
- `evidence/rlNN-verification.md`: observations, reset and environment boundaries.
- `evidence/rl110-harness-notes.md`: resolved harness failures and cleanup record.
- `evidence/rl110-local-audit.json`: local metadata/link/figure audit.

The three house articles and their figure explanations/models were read in source.
The existing architecture, row-version, index, plan, JSON and recovery material was
assessed rather than mechanically carried forward. The drafts retain the deep
physical/visibility distinction, candidate arithmetic and changed-condition
examples. New native execution supplies the commissioned workshop records.

## Executed native evidence

All execution uses `/opt/homebrew/bin/postgres`, reporting PostgreSQL 18.6
(Homebrew), aarch64 Apple Darwin. `python3 rl110-native.py all` passed. Isolated
servers use unique `/private/tmp/staycurrent-rl110-*` directories and ports
56810–56815. Every owned server stops in `finally`; the successful final run removed
its data. Failed development roots were verified to have no postmaster PID files
and removed. The default service was untouched.

The canonical final run includes:

- RL110: independent clients and old snapshot; HOT tuple flags and retained
  primary-key reference to (0,1), then indexed-note non-HOT replacement and new
  reference to (0,3). Historical agreed price remains 20.00.
- RL111: 5,000 dead versions retained by a snapshot, then removed after release;
  refill without heap growth; freeze evidence; a held reader blocking VACUUM FULL,
  followed by a successful smaller rewrite.
- RL112: native B-tree/index-only visibility variation, GIN containment, GiST range
  overlap, BRIN ordered versus scattered placement. The scattered plan still used
  BRIN, but examined 1,724 lossy blocks versus eight. No old sequential-plan claim
  was inherited.
- RL113: custom/generic prepared plans over tenant skew, extended statistics
  correcting 100 estimated rows to 1,000, and external-sort/memory variation.
  The warm generic large-tenant execution was faster in the captured comparison;
  the article explicitly declines to invent a measured speedup from custom plans.
- RL114: json/jsonb duplicate and null behaviour, GIN containment versus extracted
  expression and its B-tree, same-member array predicate, rejected type, TOAST
  size and measured WAL advancement for one small field change.
- RL115: unchanged checkpointed heap-file SHA256 despite a committed change and
  an unfinished change; flushed WAL covers the unfinished update. Immediate
  stop/restart preserves only the committed visible result; unlogged contents
  reset. Native checkpoint and redo logs are read together.
- RL116: pg_basebackup, pg_verifybackup, independently retained archive retrieval,
  named recovery target and actual paused state, promotion/new timeline, restored
  o81 and conflict-checked reconciliation of valid later o82/r82 at its agreed
  25.00. A second disposable restore lacks required WAL and fails at the required
  checkpoint record; the good backup/archive remain intact.
- RL117: independent physical source and standby; replay pause while receipt and
  flush progress; stale then caught-up query; required unavailable standby makes a
  real SyncRep wait; restart releases it; slot retention; actual stop of the old
  writer before promotion; target accepts o84 and checkpoint reports timeline 2.
- RL118: independently initialised logical publisher/subscriber; t4-only initial
  copy, confirmed status, insert during outage/restart and delete; publisher-first
  DDL breaks apply, subscriber DDL repairs it; explicit replicated identity value
  leaves the local sequence unadvanced; absent replica identity rejects UPDATE,
  then a tenant-aware primary key repairs it.
- RL119: blocked ALTER with lock timeout, retry after release; failed concurrent
  unique index with invalid/not-ready flags, drop/data repair/rebuild to valid and
  ready; old/new caller forms, bounded mismatch batch and validated equality;
  independent legacy/modern clients then both commit with zero mismatches.
- RL120: actual blocker/waiter, cancellation and client error, blocker rollback;
  six named simultaneous sessions plus an operator, one cancelled and all later
  released; native spill variation. The test measures slots, not saturation.
- RL121: fresh runtime logins with allowed and denied operations; caller-controlled
  tenant context intentionally shown to be mutable; a fixed tenant credential
  cannot cross the boundary by changing that setting; owner/FORCE/BYPASS cases;
  actual temporary-table substitution returns attacker under an unsafe definer and
  trusted after search-path repair.
- RL122: complete PostgreSQL 18.6→18.6 dump/restore migration with btree_gist 1.8;
  normal source login denied after the bounded connection fence; target data,
  identity sequence, duplicate request and negative-price rejection tested. Target
  accepts o83; old source remains at two orders, exposing rollback divergence.

## Component embedding and rendering

Only existing namespaces already supported by the coordinator's marker renderer:

- RL110: `storage/StepFigure`, `scene=pool-scan`, Figure 2.
- RL112: `indexes/CoveringFigure`, Figure 1, update and scale enabled.
- RL115: `storage/StepFigure`, `scene=wal-commit`, Figure 1; and
  `scene=checkpoint-sizing`, Figure 2.

Other figures are semantic HTML with .relational-figure/.flow/.state-grid. Stepped
figures use the coordinator's data-step attributes, accessible button names and
an output. Their complete sequence remains readable without JavaScript. There are
no inline scripts in the Markdown. The pool and sizing figures are explicitly
models, not newly recorded server performance.

The local audit checked all thirteen metadata blocks, closed fences, source
sections, caption prefixes, sibling registry destinations and evidence links; no
local missing destinations were found. The coordinator owns whole-collection
build, light/dark/phone rendering, interaction checks and independent review.

## Scope and unresolved environment boundaries

These are stated boundaries, not fabricated completed tests:

- Only PostgreSQL 18.6 is installed. The migration is real, but it is same-version
  dump/restore. No major-version pg_upgrade, minor package replacement or changed
  collation execution is claimed. The article explains the additional procedures
  and preserves the bounded rehearsal as evidence.
- Independent servers share one machine and local storage. Their behaviour does
  not establish machine-loss availability, external fencing, endpoint routing,
  network partition behaviour or storage power-loss honesty.
- The WAL drill is an immediate server stop, not an OS crash or torn device write.
  The checkpoint-sizing rates are explicit model inputs, not this small drill's
  measured throughput.
- No external transaction pooler ran. Pool-state and tenant-context rules are a
  deployment contract to test against the selected pool and driver.
- The lab's local trust and superuser setup is disposable. It is not a deployed
  authentication policy. Runtime privilege tests do use separate normal logins.
- The restore relation is deliberately small. Payment providers, booking capacity,
  messages and other external effects require additional application acceptance.
- The DDL test exercises old/new forms and concurrent clients after the maintained
  invariant is installed; it is not a long-running production-load or every-race
  stress test of a migration framework.
- btree_gist is the tested extension. No third-party extension or hosted-provider
  compatibility is established.

No coverage move is required. RL110 remains the common native setup home, RL111
owns maintenance, RL115 owns WAL/settings, RL116 owns target recovery, RL117 and
RL118 keep distinct replication contracts, RL119 owns exact DDL behaviour and
RL122 owns installation transfer. Shared FD homes remain planned; no absent
external article is used to discharge a local prerequisite.

Independent review and repairs are the next stage. These drafts are not labelled
ready and do not authorise publication.
