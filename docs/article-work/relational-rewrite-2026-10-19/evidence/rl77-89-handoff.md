# RL77–RL89 author handoff

19 October 2026. Twelve complete articles are authored: RL77, RL78, RL79,
RL80, RL81, RL82, RL83, RL84, RL85, RL86, RL87 and RL89. RL88 remains retired.
All frontmatter stays `status: drafting`. This is an author handoff for independent
review, not a claim that the work is ready as a draft or authorised for publication.
No live page, navigation, layout, coverage map or other writer's article was edited.
No commit or push was made.

## Files

Articles: `src/drafts/relational/rl77.md` through `rl87.md`, plus `rl89.md`.
Every assigned page has a matching `briefs/rlNN.md` containing its prior expert
ability account and subsequent reconciliation with the final card, plus an
`evidence/rlNN-author.md` source and scope record.

Runnable batch: `evidence/rl77-89-verify.py`. Its extracted single-connection
scripts are `rl77.sql`, `rl78.sql`, `rl79.sql`, `rl80.sql`, `rl81.sql`, `rl82.sql`,
`rl84.sql`, `rl87.sql` and `rl89.sql`. Each has native output under
`rlNN-native.txt`. Two-connection pagination and export histories are in the
verifier and `rl83-native.txt`. The actual driver example is `rl85-driver.py`
with `rl85-driver.txt`; its PostgreSQL cursor failure is `rl85-native.txt`.
`rl78-sqlite.txt` records the SQLite type/collation variations.

RL86 preserves the substantial existing Indexes explanation, its eleven original
figures and measured lineage, rather than replacing it with a short overview.
`rl86-components.md` gives the exact markers and props. Figure12 adds an
inverted-posting model; new prose develops coarse-range correlation and rechecks.
`rl86-experiment.sql` retains the original temporary-table download.
`rl86-native-run.sql` and `rl86-native.txt` rerun it with native depth and WAL
variations. `rl86-alternatives.sql` and `rl86-alternatives-native.txt` execute
GIN/BRIN examples. The original PGlite 18.3 results remain explicitly labelled;
the native rerun does not silently replace their provenance.

## Native outcomes

PostgreSQL 18.6 Homebrew on Apple silicon ran in an isolated temporary cluster,
using a unique socket directory and port 56679. It never accessed the default
service. The lab was stopped and removed after execution; the commands and
observations remain in this work folder. Python 3.14.5 used SQLite 3.54.0.
No MySQL or SQL Server execution is claimed.

- RL77: a partial room update leaves contradictory booking rows; the separated
  schema updates both views through one session row; an agreed price stays 40
  while the catalogue changes to 22.
- RL78: exact decimal versus binary float equality, explicit repeated-local-time
  offsets, case comparison and NULL predicates ran. `NOT IN` returns no orders
  after NULL enters its subquery; `NOT EXISTS` still returns unpaid o82.
- RL79: check, not-null, primary-key and composite-reference failures assert
  SQLSTATE 23514/23502/23505/23503. A further valid row demonstrates 3 reserved
  against capacity 2, leaving the concurrent enforcement obligation visible.
- RL80: a receipt remains 40 versus current repricing 44; effective-date and
  recorded-date queries distinguish 20 from 22 for the corrected period.
- RL81: two lines and two payments produce four matching pairs; prior grouping
  preserves purchased 45 / paid 45 and the empty parent. Outer joins and existence
  tests return their stated rows.
- RL82: daily 90 / 10, customer 60 / 40 and tied-frame 60 / 60 versus 40 / 60 results ran,
  together with an empty-input and tied-ranking variation.
- RL83: two real connections demonstrate offset repetition, keyset continuation,
  an unseen row moving ahead of the cursor, and a Repeatable Read snapshot that
  retains six rows and the old amount while the fresh snapshot sees seven and 44.
- RL84: conditional capacity exhaustion and stale revision rejection ran. All
  six import rows receive dispositions: 1 applied, 1 stale, 1 exact repeat,
  2 contradictory, 1 malformed. Replaying candidates changes no destination rows.
- RL85: bound injection-looking text returns no rows; batching preserves o82's
  empty line list. A non-holdable PostgreSQL cursor returns o81 then fails 34000
  after commit.
- RL86: the full original access-path experiment succeeds natively. Covering
  access goes 13 → 4 → 5 local buffer accesses and 10 → 0 → 1 heap fetches. One/four-index
  inserts write 3.3 / 6.7 MB WAL. 100k / 1m / 10m depth and index-page counts reproduce
  2 / 3 / 3 levels and 276 / 2745 / 27422 pages. GIN returns 1666 two-tag matches; BRIN
  returns 1440 rows while rechecking 1520 nonmatches across 16 lossy pages.
- RL87: estimate 1 versus 40000 actual selects 40000 probes and 120723 buffer hits;
  ANALYZE selects hash join and 1565 hits. The low-memory sort spills 10584 kB.
- RL89: date pruning visits October only; ID-only lookup visits both children.
  Missing December fails; prepared December attaches; detachment preserves s7 in its
  standalone table while parent queries return s8 and s9.

These are functional observations and local work counts, not throughput
benchmarks or guarantees about other engines.

## Checks and remaining review

Normal `pnpm build` passed all 13site checks. A private preview build with
`RELATIONAL_DRAFT_PREVIEW=1` rendered all then-present drafts and reached the site
check. It failed only on not-yet-written commissioned sibling paths and figure
headings in another writer's RL90–94/RL96 files. These twelve pages had no figure,
metadata, colour, heading or structural failures; their temporary link failures
were forward links to RL100/102/103/104/105. Root was notified with the check record.

The coordinator's private shell renders all eleven retained RL86 components,
including CoveringFigure's update=true and scale=true props. Desktop dark-mode
screenshots showed the opening and composite-index figure. A 390 px dark-mode
screenshot showed the RL82 phone opening. Read-only browser DOM evaluation timed
out, so do not infer a complete control or cross-theme check from these spot
checks. Whole-collection light/dark, desktop/phone control verification remains
with the coordinator, as requested. The private development server remains on
127.0.0.1:4323 for that work (exec session 17615).

Independent fresh-reader, technical and editorial reviews have not been claimed.
Root controls that separate review stage; no reviewer subagents were spawned by
this author while the shared slots were occupied.

## Coverage reconciliation

No substantive map move is proposed. Two boundaries deserve preservation during
merge: RL84 proves batch input accounting, while RL100 owns live-backfill
completeness; RL86 owns causal inverted/coarse-range access alternatives, while
RL112 owns PostgreSQL operator classes and physical restrictions. RL82's initial
expert account considered recursive traversal and rollups, but the final card
commissions grouped/windowed summaries and ties, so those unrelated extensions
were excluded. RL89 explicitly refuses to redefine session identity merely to
satisfy a partition-key restriction.

The full existing Indexes article earns its retained depth. Existing published
index companions stay usable further reading; their existence is not used to
claim a missing commissioned sibling is complete. Shared distributed-systems
teaching remains parked.
