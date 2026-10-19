# b10 — independent practitioner review

Reviewed 20 October 2026 using `staycurrent-review`, practitioner perspective.
Initial full review of a39 against the original relational-practice goal, actual
a07/a06/a04 articles and supplied family scopes. Read the complete snapshot,
component/model, native harness, source ledger including its structured command
results and recovery logs, and writer handoff. No other perspective's report,
teaching-reference articles or old relational corpus was read.

| ID | Practitioner verdict | Required repairs | Optional advice |
| --- | --- | --- | --- |
| a39 | Repair | a39-P1: missing-WAL model narration | None |

## Required repair

### a39-P1 — Make the missing-history narration preserve the failed recovery outcome

Location: `src/components/relational-next/a39/model.ts`, history scene,
**Named restore point** and **Later good order commits** frames.

With **Target archive lacks later WAL** selected, the right panel correctly shows
`STOP · target not reached`. At the final step, however, its narration still says:
“The earlier copy recovers 101 but lacks legitimate later order 104.” That claims
a recovered earlier copy in the case where the target was never established.
The named-marker narration likewise describes the targeted restore as staying at
the marker, without qualifying the failed-history case. I reproduced both source
branches and the contradictory final display in fixed preview 4437.

Make these narrations conditional on the archive assumption. The complete case
should retain the present explanation. The missing-WAL case should say that the
source marker exists but this restore cannot reach or verify it, no earlier copy
is accepted, and the full-replay comparison does not repair that missing evidence.
Keep the later-work trade-off as a conditional consequence of a successfully
verified earlier restore. No SQL, native-evidence or article-prose change is
required for this finding.

Acceptance: at every history step after the gap, the failed path's narration and
panels agree that the intended earlier state is unproved. In particular, its final
frame must not assert that 101 was recovered. Recheck both assumptions at the same
steps. Retain the unaffected native, prose, other-model and family passes below.

## Correctness and useful depth retained

Apart from a39-P1, the article supplies the restoration depth the parent delegates.
Named loss cases preserve the parent's different mistake-repair and total-location
loss contracts. The seven-day discovery window creates a base-plus-history
retention obligation, not merely a seven-day file-age rule. Access, keys,
configuration, administrative authority and dependent services remain part of
recoverability. Replication is not confused with recovery from a committed mistake.

Logical export, physical copy and PITR are correctly distinguished. Single-database
snapshot scope and separately captured globals are explicit; logical exports cannot
be advanced with physical WAL. Physical compatibility, tablespaces, libraries,
multi-volume snapshot coordination and incremental dependencies are treated as
requirements to verify. The worked physical path is executable while unexecuted
logical/cloud paths remain identified as such.

The commit-before-marker boundary is correct. Separate harness SQL calls commit
order 103 and its item before creating the restore point, matching the article's
explicit transaction sequence. Target identifiers, inclusion semantics, transaction
ID versus commit order, timeline selection, pause/hot-standby requirements and
target failure are accurately qualified. Waiting for recovery completion or the
verified target pause avoids treating connection readiness as success.

The full and earlier copies expose the real choice: restoring 101 by returning the
whole service to the marker also excludes legitimate 104. Selective repair keeps
the current state, follows dependent facts and requires guarded writes and domain
reconciliation. Identifier reuse is a stop condition. Neither checksums nor equal
row counts establish business correctness. Current erasure/retirement rules and
new history after cutover also constrain return and fallback.

The acceptance gates include objects, permissions, real application connections,
representative workflow, exclusive write authority, external effects and preserved
recovery options. The local subsecond observations are explicitly narrower than
production recovery time. The 49/69-minute examples are labelled planning models.
No additional branch or consolidation is needed: a07 retains incident authority,
a38 promotion/fencing, a30 guarded correction, a23 external reconciliation, and
the move branch controlled relocation.

## Independent native execution

After inspecting the harness, ran the unmodified script with pinned native
PostgreSQL 18.6 tools and a new evidence path:

```sh
python3 src/components/relational-next/a39/rehearse.py \
  --pg-bin /opt/homebrew/Cellar/postgresql@18/18.6_1/bin \
  --evidence /private/tmp/rel3-practitioner-b10-1792449900.json
```

It created only fresh own clusters under `rel3-a39-nm8qaeik`, with fresh loopback
ports, and never contacted shared port 57319. Independent results:

- `pg_verifybackup` returned zero and reported the base successfully verified.
- Full replay produced exactly orders 102/103/104 and three item lines, with
  recovery completed. Exact grouping/quantity assertions and zero orphan items
  passed.
- Named recovery produced exactly 101/102/103 and four item lines. Order 101 had
  two lines and three units. Recovery and replay-paused checks were true. The
  server log explicitly stopped at `before_bad_delete` and paused on timeline 1.
- The cleanly stopped target's checksum check returned zero: 1,254 files,
  3,884 blocks, zero bad checksums.
- Removing segment `000000010000000000000003` from an independent archive copy
  caused failed startup and `recovery ended before configured recovery target was
  reached`. The log first recorded brief read-only readiness, reproducing the
  article's warning.
- Full/target copy-through-query intervals were 0.470/0.500 seconds here. These
  fixture observations establish no service RTO.

Inspected the independent JSON and target/failure logs. Cleanup stopped the own
source and restore servers; independently confirmed the recorded temporary root
no longer exists. The new evidence file remains in `/private/tmp`; no retained
writer evidence was overwritten. The harness's fresh local trust role is confined
to its disposable environment and is not offered as a production access design.

## Working models and primary checks

Independently enumerated all 34 frames across four scenes and both assumptions.
Panel outcomes pass: history gap blocks its target, retained base coverage matters,
budget arithmetic totals 49/69, and identifier conflict produces no-go. The missing
history narration is the specific exception in a39-P1. In an own Chrome tab on
fixed preview 4437, stepped every scene under both assumptions and checked all
eight final comparisons; changing assumptions preserves the step. Browser values
match the model, including the recorded contradiction. Layout/playback acceptance
remains with the teaching perspective.

Primary verification included PostgreSQL 18
[logical export scope](https://www.postgresql.org/docs/18/app-pgdump.html),
[globals](https://www.postgresql.org/docs/18/app-pg-dumpall.html),
[filesystem snapshots](https://www.postgresql.org/docs/18/backup-file.html),
[continuous archiving](https://www.postgresql.org/docs/18/continuous-archiving.html),
[target settings](https://www.postgresql.org/docs/18/runtime-config-wal.html#RUNTIME-CONFIG-WAL-RECOVERY-TARGET),
[manifest verification](https://www.postgresql.org/docs/18/app-pgverifybackup.html)
and [stopped-cluster checksums](https://www.postgresql.org/docs/18/app-pgchecksums.html).
Amazon RDS's [PITR contract](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIT.html)
supports the new-instance, configuration-selection and background-loading example;
no RDS execution is inferred from the local drill.

## Scope and handoff

The snapshot matches the rendered source and all three manifest hashes are
unchanged. No article/component edits, shared-server changes, build or commit were
performed. The own browser tab is closed and preview 4437 is released. Recheck
only a39-P1's conditional narration and its agreement with both model paths;
retain all unaffected technical/native checks.
