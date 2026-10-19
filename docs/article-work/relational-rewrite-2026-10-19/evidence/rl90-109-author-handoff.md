# Author handoff: RL90–109

19 October 2026. All 18 assigned pages are authored under `src/drafts/relational/`, excluding retired RL99 and RL101. Each retains `status: drafting`; none is self-marked ready. No live page, map, navigation or shared code was edited, and no commit/push was made.

## Delivered

The concurrency and recovery arguments use the commissioned workshop, tenant-scoped identities and historical agreed prices. Local schema/notation is supplied for direct entrants. Briefs contain ability accounts saved before assigned cards/prose, reconciliation, argument choices, neighbour boundaries and verification limits. RL95 reuses four actual house storage models through the coordinator's preview-component slots; other pages use semantic tables, causal state figures and stepped histories with readable no-JavaScript states.

## Commands and evidence

- Native: `node docs/article-work/relational-rewrite-2026-10-19/evidence/rl90-104-native.mjs` — final exit 0. PostgreSQL 18.6 disposable private clusters, ports 56641–56644 and proxy56649, unique tmpdir and finally cleanup. See rl90-104-run-notes.md for environment and verification discoveries.
- Models: `node docs/article-work/relational-rewrite-2026-10-19/evidence/rl105-109-models.mjs` — exit 0. Routing, one recoverable transaction outcome/read resolution, safe snapshot, region-majority and copy/tail/membership assertions. These are explicit teaching models.
- Metadata check: all 18 files have commissioned titles/IDs, drafting status, no Markdown layout, sources section, no heading inside a figure, Figure N captions and valid commissioned sibling IDs.
- One `pnpm build` completed successfully at 13:11 CEST before the coordinator centralised build/renderer QA. All 13 site-check rules passed. Later small author edits and final observations require the coordinator's final build; no second build was started.

Per-page `rlNN-evidence.md` and `rlNN-native-observed.json` or `rlNN-model-observed.json` provide scoped evidence and source trails. Primary product documentation was browsed on 19 October 2026: PostgreSQL18, InnoDB/MySQL8.4, SQLite, SQLServer17 documentation, plus Citus13, Cockroach stable and Spanner. Product contrasts are labelled separately from native PostgreSQL observations.

## Consequences completed

- RL90: stale counter hides 3 bookings; atomic contender waits/rechecks to zero; Repeatable Read permits 3, Serializable rejects B40001 and its fresh decision sees 2.
- RL91: both absent-row FOR UPDATE reads return empty; unique insert rejects23505; existing-parent lock sees full capacity; actual wait graph and deadlock40P01 with survivor completion.
- RL92: 5,000 obsolete versions persist while an old reader remains, then cleanup removes them without shrinking851,968-byte file.
- RL93: real PostgreSQL protocol proxy discards CommandComplete(COMMIT). Client disconnects, independent observer finds o81; matching replay returns stored result and changed payload is rejected.
- RL94: rollback/commit prove order and outbox intent move together. Native SKIP LOCKED skips j82 then claims it later. Epoch1 stale worker reaches actual SQL effect authority and produces zero effects; epoch2 produces one, repeated epoch2 no duplicate.
- RL95: immediate native process stop causes recovery; acknowledged row survives. No power-cut claim.
- RL96: real base+archive restore pauses at target; missing archive causes target failure. Restored o81 omits later valid o82, then r82 reconciliation inserts o82 once and repeats without duplication. External acceptance is a provided fixture.
- RL97: paused native standby received the commit token without applying it; stale query remains old, then resumed replay barrier/new query includes it.
- RL98: standby stopped before acknowledged old-only write; confirmed primary process stop fences cached COMMIT before promotion. Promoted B lacks old-only history; old A is rewound/rejoined read-only and actual INSERT is refused25006.
- RL100: blocked ALTER times out55P03; late ID5 is missed by cursor>20; locked remaining row makes batch empty then later batch repairs it. Trigger-maintained later writers, full equality scan and validated CHECK establish completion.
- RL102/103: actual hot-row contention does not gain throughput from extra clients; actual root idle transaction is identified; cancel request leaves waiter pending, rollback releases it to successful completion.
- RL104: separate runtime login exercises both allowed t4 read and four denials. Article explicitly says caller-controlled tenant context is not protection against arbitrary malicious SQL.

## Map and remaining work

No new article or ownership move is proposed. Preserve cross-links between RL93's identity retention and RL96's history loss/reconciliation; RL94's effect-authority exclusion and RL98's database writer exclusion; RL105–109's explicit generic mechanisms and product implementation homes. The map's current allocation fits the written depth.

Root owns independent review, repair orchestration, full rendered light/dark/phone QA and final build. This author attempted IAB preview access, but IAB was unavailable and no tab was created; no rendered-QA claim is made. The coordinator explicitly took that QA ownership before handoff.

Native distributed-cluster evidence remains in root's Cockroach branch. RL105–109 do not pretend generic models prove engine guarantees, region survival, physical clock bounds or live rebalance/upgrade behaviour. Their implementation continuations are RL123–128/RL131. No InnoDB, SQLServer, SQLite, Spanner or cloud service was executed by this author. No power-loss, external email/payment, password/TLS or automatic failover-controller validation is claimed.

No authoring blocker remains within the assigned scope. Reviewers should independently challenge the arguments and isolated media before any ready-as-draft decision.
