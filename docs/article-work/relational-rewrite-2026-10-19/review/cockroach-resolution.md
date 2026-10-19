# CockroachDB review and repair

19 October 2026. Scope: RL123–RL132, read in their collection order for an intelligent application engineer new to CockroachDB. The uncued observations remain in [cockroach-first-reading.md](cockroach-first-reading.md). Afterwards I read the full review/style skills, ten briefs, relevant coverage-map cards and native records, then checked consequential mechanisms against primary documentation. This agent did not execute a new CockroachDB workload. The coordinator owns native supplements, build checks and rendered QA.

## Findings and resolutions

| Page | Understanding at stake | Evidence and smallest repair | Recheck |
| --- | --- | --- | --- |
| RL123 | Locate a key in actual output; process count does not establish replica health | The recorded range 81 spans primary keys 2500 to 5000, with leaseholder 1 and one voter in the early observation. Added that compact output, inclusive/exclusive bounds and the explicit convergence limit. Added the runnable worksheet bundle and setup notes because a lone downloaded Python script needs sibling modules. | Event 2501 belongs to 81; event 5000 does not. A reader cannot infer node-loss tolerance from this early snapshot. |
| RL123 | Separate coordination jobs without inventing a different default lease implementation | The 25.4 replication documentation says leader leases normally colocate leaseholder and Raft leader. Replaced vague version hedging with that fact while retaining the different jobs and per-range scope. | Both jobs can be on one replica without that node owning the whole database. |
| RL124 | Keep the conflicting actors stable | Original prose made B commit first while the table and native record made A commit first. Aligned prose with the table; added native A acceptance, B's 40001, fresh read of zero and absent B order. Clarified current database, existing schema and one-place reset state. | Trace B's old read through rejection to recomputation without swapping names or resetting accepted capacity. |
| RL125 | Historical content does not establish current permission | Original wording could imply that historical privileges themselves were replayed. Replaced it with the application's current-authorisation obligation. Added the documented single-row/no-index-join shape beside the actual bounded-staleness error. | A report can show old content while enforcing current revocation. A successful point read does not establish a supported scan. |
| RL126 | Index work can span several physical ranges | Figure 1's singular range labels could imply one range per index. Changed them to secondary-index spans and primary-index spans. | The index join still has a two-stage dependency if either side has several ranges. |
| RL127 | Make an explicit row home adaptable; distinguish it from replica confinement | Added an illustrative explicit crdb_region insert, separate from the recorded t4 drill. Added that row home does not locate every replica, backup or export, and that access/reference/geographic obligations need their own checks. | Inserting through another gateway does not override the supplied us home. The survival policy still places copies elsewhere. |
| RL128 | Interpret connection context and repair an actual failed membership change | Added workshop context and the actual --wait=all replica-transfer condition. The later trust supplement executes the map's failed-secure-join branch and repairs it; the new client-identity example distinguishes replacement from retirement. | Unknown CA leaves three members; intended CA permits four and a query through the new member. NOLOGIN denies both old/replacement certificates on new connections; v2 retains read-only access. |
| RL129 | Recovering a row is not proof of a valid new booking | The old canonical chain inserts r82 without a capacity decrement after the retry fixture exhausted s7. Rebased the article onto the separately executed smaller reservation fixture: guarded capacity/order acceptance, incremental, latest and earlier restores, then coupled request-keyed replay. The old marker is now only a source note. | Latest has r80/r82 and capacity 1; earlier has r80/capacity 2; first replay returns to two orders/capacity 1; repeated replay verifies the existing facts and leaves capacity 1. |
| RL130 | Requesting a job transition differs from reaching it | No mechanism repair required. Main evidence has the premature resume failure; the separate resume record succeeds after paused, and the main record later reaches succeeded with the changed row in the new index. | Retained the failed request, separate successful control and new-caller result. |
| RL131 | Preserve a real return gate without responding to an unseen debate | Removed the paragraph saying no licensing blocker should be inferred. The environment scope and actual successful finalisation already establish the relevant observation. Retained the low-memory failure, 256 MiB successful run and old-binary storage rejection. | The text follows binary version, logical version, then closed return; it does not imply a memory failure was a licensing failure. |
| RL132 | Keep the source-fence result from swallowing subsequent teaching | The closing Markdown fence shared its line with prose. Put the fence and following paragraph on separate lines. | All later headings, copy SQL and the authority figure remain ordinary article content. Rendered verification belongs to the coordinator. |

## Native evidence checks

The canonical source is `evidence/cockroach-observed.json`, not the earlier synthetic per-page records. I checked the following labelled observations and their actual outputs:

- RL123 layout: split bounds and the initial one-voter state, including implicit primary-key identity in the secondary index.
- RL124 client A/B histories: both read one, A commits concurrent-A, B returns 40001 and then reads zero; final accepted state has only concurrent-A among those competing requests.
- RL125 session isolation, exact saved timestamp, current value one versus historical value two, readonly rejection 25006, unsupported bounded scan 0A000 and successful full-key bounded read.
- RL126 non-covering and covering plans: 20 to 10 decoded KV rows, two to one gRPC calls, 70 to 20 KiB reported maximum memory. Ordered versus four-bucket plans: 10 to 40 decoded rows and one to four calls. Local SQL distribution does not exclude KV access on another labelled node.
- RL127 five-voter convergence and full locality output before stopping the eu process group; the surviving gateway accepts region-r2 and returns two rows/42.00; rejoin retains them.
- RL128 authenticated booking_app read, denied UPDATE 42501, node ID 5 on listener 56909, replica count 27 to zero during decommission, and foreground 2/42.00 after removal.
- RL129 full/incremental/history restores, exact timestamp, restored identities and amounts, absence of the ordinary grant and missing-path 58P01. These canonical records establish stored-row recovery, not valid seat admission for r82.
- RL130 backfill and failed unique build 23505, absence of a public failed index, continued old callers during build/pause, pause-requested versus paused and final new-index result. `cockroach-schema-resume-observed.json` is the separately successful RESUME, not the failed early command.
- RL131 `cockroach-upgrade-observed.json` reaches logical 25.4 after mixed binaries and a successful old-binary return before finalisation. Its later old-binary attempt exits 2 with unknown Pebble format 26. The low-memory record remains separate; its retained log excerpt identifies BulkAdder memory rejection at step 008. The log excerpt is a retained coordinator observation, not an intact surviving log.
- RL132 actual deferred-write success on PostgreSQL, target 0A000 and 23503, denied source_app write, Repeatable Read snapshot, parent-first copy and target-only request with coupled capacity change. The replay result is observed; complete production fencing and live CDC are explicitly outside this fixture.

The separate destination restore record initially establishes independent cluster/store identity on the same host and shared CA/external-file directory. Missing user returns 28P01, missing SELECT returns 42501, repaired role reads the records, UPDATE remains denied and the restored check rejects negative capacity with 23514. Timing is functional tiny-fixture evidence, not a recovery-time objective.

## Primary-source checks

Checked 19 October 2026; all CockroachDB sources are pinned v25.4. These checks support the mechanisms rather than the worksheet's measured counters.

| Source | Consequential claim checked |
| --- | --- |
| [Distribution layer](https://www.cockroachlabs.com/docs/v25.4/architecture/distribution-layer) and [replication layer](https://www.cockroachlabs.com/docs/v25.4/architecture/replication-layer) | Ordered key ranges, cached metadata routing, range replication and the default leader-lease colocation. |
| [Transaction layer](https://www.cockroachlabs.com/docs/v25.4/architecture/transaction-layer) and [retry reference](https://www.cockroachlabs.com/docs/v25.4/transaction-retry-error-reference) | Provisional intents, transaction decision, STAGING plus successful writes as implicit commit, read refresh and exposed SQLSTATE40001. |
| [Follower reads](https://www.cockroachlabs.com/docs/v25.4/follower-reads) | Safe historical time, exact versus bounded staleness and bounded single-row/non-index-join restrictions. The native observed error says more than one range; documentation examples say more than one row. The article preserves the actual error and separately states the documented supported shape. |
| [Hash-sharded indexes](https://www.cockroachlabs.com/docs/v25.4/hash-sharded-indexes) | Computed shard prefix distributes sequential keys and makes ordered scans combine bucket runs. No source substitutes for a measured write-throughput result. |
| [Table localities](https://www.cockroachlabs.com/docs/v25.4/table-localities) and [survival goals](https://www.cockroachlabs.com/docs/v25.4/multiregion-survival-goals) | RBR home defaults, region prefix, GLOBAL read/write trade and three-region 2+2+1 replication. |
| [Authentication](https://www.cockroachlabs.com/docs/v25.4/authentication) and [cockroach node](https://www.cockroachlabs.com/docs/v25.4/cockroach-node) | SQL identity boundary, membership operations and wait-for-replica-transfer semantics. |
| [RESTORE](https://www.cockroachlabs.com/docs/v25.4/restore) | Dependencies, complete incremental chain, renamed inspection database and users/table grants outside a database restore's scope. |
| [Online schema changes](https://www.cockroachlabs.com/docs/v25.4/online-schema-changes) | Backfill/cleanup overlap, DDL transaction restrictions and prepared SELECT-star result-shape failure. |
| [Self-hosted upgrade](https://www.cockroachlabs.com/docs/v25.4/upgrade-cockroach-version) | Adjacent major transition, mixed binaries, preservation setting and closed major return after finalisation. Actual patch pair and storage error come from the native record. |
| [CockroachDB foreign key](https://www.cockroachlabs.com/docs/v25.4/foreign-key) and [PostgreSQL18 constraints](https://www.postgresql.org/docs/18/ddl-constraints.html) | Composite ownership references and deferred source checking; the unsupported target clause is established directly by the native 0A000 result. |

## Editorial reread and status

The first reading found that the branch's strongest teaching is concrete state followed by the mechanism's name and its changed cost: index lookup removal, five-voter survival, paused-job callers, old-binary return and source/target divergence. Repairs retain those sequences. Qualification remains beside the result when it changes an engineering inference; measured WAN performance, production memory minima and disaster independence are not claimed.

The source-only reader could not establish layout, live controls or contrast. Both loopback preview URLs remained unreachable from this agent's shell, and its IAB browser surface was unavailable. The coordinator is explicitly handling those checks. No build, shared code, evidence, map or live publication files were changed by this reviewer.


## Supplemental fault and recovery checks

The coordinator supplied two new native records after the first reading. I checked both their statements and retained results, rather than treating the coordinator's summary as sufficient evidence.

`cockroach-atomicity-observed.json` and `lab/cockroach_atomicity.py` explicitly place two singleton table ranges on the us2 and ap3 processes and wait for the relevant lease/replica observations. A TLS protocol client receives the actual COMMIT completion, suppresses it at its simulated application boundary, and kills the gateway. A fresh gateway reads both counters in one statement as 1,1. This observes loss after a known server completion; it does not establish which internal STAGING or cleanup state existed at process death. A second transaction provisionally updates the left counter, loses the right participant, times out 57014, rolls back and later reads1,1. An unrelated left health row still answers while the required participant is absent. The added RL124 section keeps these limits explicit, and does not mistake the timeout for 40001 or singleton placement for resilient replication.

The expanded `cockroach-restore-observed.json` first restores the original small full base and tests runtime identity/grants. Its measured initial restore is now 1.0211 seconds, rounded to 1.02 in the article. It then captures HLC 1792409298341886000.0000000000, atomically decrements capacity 2 to 1 and inserts r82/22, takes the incremental, and deliberately deletes r82 without returning capacity. The destination's valid_latest has r80/20,r82/22 and capacity 1; valid_earlier has r80/20 and capacity 2. The client replay first claims r82 and decrements in the same transaction, then a second attempt sees the existing request, verifies 42/22 and does not decrement. Both final states have capacity 1. The rewritten RL129 uses this one coherent chain throughout; the earlier unrelated marker no longer carries its booking argument.

RL129's first replay is deliberately client-branched. I checked the no-capacity path in the prose: it rolls back the newly inserted order. The duplicate path checks the repeated request's meaning before skipping the dependent change. The accepted application state is not inferred from totals alone. Production fencing and external effects remain explicit obligations, rather than invented native observations.

## Final editorial reread

The current source was reread in sequence after repair. RL123 now moves from two key orders into a real descriptor before routing; the one-voter caveat changes the conclusion a reader may draw and earns its place. RL124 now keeps A/B identities stable and distinguishes the separate counter fault fixture from booking capacity. The longer fault passage is justified by actual distributed outcomes; repeated internal-trace caveats were removed. RL125's time choices remain separate from authorisation and its bounded query has an explicit supported shape. RL126 retains one change and counted cost per example. RL127's added insert is explicitly an illustrative variation, so it does not invent another request in the failure drill. RL128 now supplies connection context and the decommission completion condition directly. Its added trust-failure and client-retirement sections are placed together after the original least-privilege example, so capacity moves once from the accumulated fixture's one to the fresh supplement's two and stays there. RL129 now follows one small dataset, with Figure 1 covering backup states and Figure 2 covering once-only coupled replay; its separately timed initial role check names its full-only state. RL130 retains its clear pause-requested/paused progression and failed-rule decision. RL131's removed debate paragraph makes the closing evidence lead directly to the version boundary. RL132's fence now ends before the administrator paragraph and all subsequent headings remain outside it.

No revision adds a new field or reassigns coverage. The technical explanation remains within the ten briefs and relevant map cards. Native counters and fault schedules are scoped to one host; no measured regional latency, host disaster survival or production memory threshold is implied.

| Page | Editorial/technical disposition |
| --- | --- |
| RL123 | Ready as a draft; core mechanism, native range interpretation and sequential-write consequence are supported. |
| RL124 | Ready as a draft; commit model, two-range fault boundary and whole-decision retry are distinguished. |
| RL125 | Ready as a draft; read contracts, changed capacity and retention consequences are taught. |
| RL126 | Ready as a draft; covering repair and ordered-read regression have actual counters. |
| RL127 | Ready as a draft; row homes, survival placement and observed group failure are separate. |
| RL128 | Ready as a draft; trust repair, identity replacement/retirement, authenticated grants and decommissioned foreground state are checked. |
| RL129 | Ready as a draft; a fresh uncued reread found no comprehension blocker, and its accepted-work evidence prerequisite is now explicit. |
| RL130 | Ready as a draft; native job transition, continued callers and failed-rule decision are complete. |
| RL131 | Ready as a draft; actual prefinalisation return and postfinalisation failure support the gate. |
| RL132 | Ready as a draft; offline compatibility and authority transition are bounded, with the fence repaired. |

“Ready as a draft” is this review's editorial and technical disposition. The coordinator still owns the central build and rendered/control checks, and review does not authorise publication. This reviewer changed only these ten draft articles and the two review notes.

A focused source check found balanced standalone Markdown fences and matching figure tags across all ten drafts. It specifically checks the repaired RL132 boundary; it does not replace rendering. Reviewed source SHA-256 prefixes: RL123 `607b504186f8`, RL124 `b7a020a3a1af`, RL125 `e3c9d619b4b9`, RL126 `dcf08be75548`, RL127 `a55f58143785`, RL128 `1b5ac5c1a1f1`, RL129 `132478324dbe`, RL130 `55434f5912af`, RL131 `ad5918b8b457`, RL132 `53c54c966371`.


## Trust and identity supplement

`cockroach-identity-observed.json` and `lab/cockroach_identity.py` now supply the map's actual failed-join case. The new process uses a distinct CA, and its outgoing join logs report failure to verify the cluster certificate: unknown authority. Existing node status lists three members and its session query returns capacity two. Restarting the same fresh store with intended lab certificates yields four listed members and a successful query through the fourth. This is trust repair, with no claim that the healthy decommission run tested full disks or constrained relocation.

The same fresh drill saves the initial booking_app certificate/key, issues a different replacement and observes fresh successful reads using both. This is positive evidence that replacement alone did not revoke the retained old certificate. NOLOGIN then rejects new connections from both certificates with 28000. A new booking_app_v2 identity and certificate with the same SELECT-only grants reads successfully and receives 42501 on UPDATE. Existing pooled sessions and a PKI revocation mechanism were not tested. The article preserves that boundary and does not call SQL identity retirement certificate revocation. [Pinned rotation documentation](https://www.cockroachlabs.com/docs/v25.4/rotate-certificates) was checked alongside the native result.

I reread the complete revised RL128 and RL129 source after the new sections. The former now follows trust model, least privilege, actual failed trust, then identity retirement before returning to range operation. The latter follows one reservation fixture through backup, mistake, two selected recovery states and dependent replay. Their extra depth earns its length because the failed boundary and successful repair both have actual results.


## Fresh reread of the repaired recovery article

[recovery-repaired-first-reading.md](recovery-repaired-first-reading.md) records another uncued agent reading of rewritten RL129. It found no blocking comprehension problem and traced the chain, history choice, coupled replay and role checks. Its consequential finding was the surviving evidence needed to identify later accepted work: the fixture tells the reader r82 exists, but a lost source cannot itself enumerate that obligation.

The coordinator added two paragraphs before the replay. They identify this rehearsal's retained successful request and external observation record, require surviving acceptance evidence in a real recovery, reject a sent request as proof of commitment, and route unknown outcomes through identity reconciliation. I rechecked the saved wording against the later-work instruction and native fixture. It closes the prerequisite without claiming that the lab executed a production acceptance journal. A sentence before the earlier restore also states that latest is the useful candidate for this deletion and that the older target is a changed requirement. RL129 is now ready as a draft on editorial, comprehension and technical evidence grounds, with central rendering/build checks still owned by the coordinator.
