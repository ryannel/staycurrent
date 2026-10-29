# PostgreSQL and recovery motion repair

Scope: the 20 PostgreSQL/recovery articles assigned to this branch. Replaced their stepped stories with 44 authored motion scenes. The application-caching player supplies once-through playback, Pause and Replay; retained comparisons select meaningful alternative outcomes. Each scene has separately composed 760-unit and 440-unit layouts, a settled final state, and a text alternative.

## Scene inventory

| Module | Scenes | Teaching retained |
| --- | --- | --- |
| `storage` | buffers, versions, lookup, hot, write, retention, age, wal, checkpoint, gin, brin | Buffer reuse and clock sweep; tuple visibility; heap lookup; HOT versus new index entries; WAL before commit acknowledgement; retained snapshots; freezing; insert/write/flush; checkpoint redo boundary; GIN candidates and recheck; BRIN physical ranges. |
| `recovery` | progress, routing, switching, chain, pgchain, target, payment, restore, branch, stream, copy, consumer, files, handover, fence, history | Durable versus replayed WAL; history-qualified reads; missing archive intervals; recovery targets; payment reconciliation; timeline forks; logical apply and snapshot copy; consumer crash gaps; upgrade file ownership; source fencing and required history. |
| `operations` | locks, rules, index, recovery, definer, routing, move | Lock queues; units versus validation; concurrent index readiness versus validity; owner rollback versus cancellation; trusted lookup paths; ownership routing; fenced group migration. |
| `search` | preparation, candidates, ranking, configuration, filter, hnsw, ivf, range, spatial, extension | Text preparation and positional recheck; filter before limit; stored-vector preparation; eligible vector neighbours; HNSW frontier and IVF list limits; range overlap; box candidates versus exact distance; software as a restore dependency. |

Corresponding wrappers were replaced in architecture, vacuum, indexes, WAL, backup, replication, logical replication, schema changes, operations, access, upgrades, distribution, text, vector and extensions, plus generic backups, replicas and failover. PostgreSQL plans and JSON figures are static results or directly useful parameter tools and remain intact. Also retained the vector distance calculator, vacuum space calculator, replica catch-up calculator and existing static heap/process illustrations.

The changed article sentences now invite readers to watch or compare the new drawings rather than click through steps. Existing technical sources, worked SQL and recorded database observations remain unchanged.

## Checks and repairs

- Rendered every PostgreSQL scene, all action options and every selector combination, at seven checkpoints: 595 combined desktop/phone render outputs. No undefined values or invalid numeric coordinates.
- Confirmed no old stepper imports or step-through instructions remain in the assigned component/article scope.
- Coordinator checked phone and desktop geometry across scenes, variants and still frames. Repaired long captions, off-edge labels, conflicting arrival labels, tuple text overlays and retention-note spacing. The coordinator retains the full browser geometry evidence.
- Browser spot checks used the dedicated Chrome review session at desktop and 375px: buffer reuse, HNSW and physical WAL progress. Replay initiates the existing player; physical replay reached its settled state with all four stages complete and the new read at £22. Proof: `/tmp/relational-pg-replay-desktop.png`. Layouts preserve the fine paths, coloured records and persistent outcomes. These spot checks supplement, rather than replace, the coordinator's full geometry audit.
- Corrected physical replay ordering so update U precedes commit C. Non-HOT branches retain separate old and new index entries. GIN candidates visibly retain array order for the equality comparison. The buffer clock ends on the selected replaceable slot.
- No build, server launch or publication performed in this worker. Coordinator handles integration/build and public runtime confirmation. The distributed-systems worker independently compared the new scenes with preserved models/prose. All identified regressions were repaired: later archived history remains unreplayed after a gap; the PostgreSQL backup retains its separate bundled consistency-WAL and later-archive stages; recovery finishes under controlled access before payment reconciliation. The matching-charge branch now says it is recording known evidence during that write, reserving unresolved wording for the unknown branch.

## Independent foundation semantics cross-check

Compared the new normalisation, join, snapshot, request and outbox scenes with preserved models and nearby prose. Three introduced regressions were sent to the foundation author and repaired: outbox completion timing now follows acknowledgement arrival through the relay; minimal-cover reduction is visible again before schema assembly; modelling's split explicitly selects its sequential variant so the lossless correction actually appears. Closure, chase, independent memberships, actual offers versus approval policy, join cardinalities, statement versus transaction snapshots, and retry/atomicity outcome choices retain their prior distinctions. This was a focused replacement-scene review, not a repeated article or native-database review.
