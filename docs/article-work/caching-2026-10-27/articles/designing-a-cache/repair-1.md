# Repair 1: Designing a cache: a worked example

Reviews addressed: `review-teaching-1.md`, `review-technical-1.md`, with the
orchestrator's notes. New measurements are in `evidence/designing-a-cache.txt`
under "Repair round 1" (E4 ACL file on a primary and replica, E5 model numbers).
Models are tested in `src/components/caching/designing-a-cache/models.test.mjs`
(8/8 pass). The article now has three figures; the old Figure 1 (budget) is
Figure 2 and the old Figure 2 (playground) is Figure 3.

## Teaching review: required

- **R1. Relay-lag alert contradicts the stock target.** The page alert now
  fires when the oldest unsent delete is about 3 seconds old. That leaves room
  inside the 5-second stock target. The prose, the design table and the
  checklist agree.
- **R2. "No fork with persistence off".** Corrected. A replica's full
  synchronisation forks the primary even with persistence off. This was
  observed on 8.10.3 (`total_forks` went from 0 to 1, E4), and the text links
  Redis replication, persistence and failover. The memory sizing now leaves
  room for that fork.
- **R3. "Read replicas for checkout".** Removed. Lag-tolerant reads such as
  merchants' reports can move to database replicas. Checkout keeps reading the
  primary, and the text explains why.
- **R4. The TTL cap needs its own figure.** I added a new Figure 1, "Two million
  products against one TTL". It shows the log-log popularity curve, a dashed
  line for one read per TTL and a shaded tail. It has a TTL slider (1 min to
  24 h) and an exponent switch (0.9 or 0.8). Readouts show the hit ratio, the
  products above the line and the share of reads below it. The walkthrough
  uses it to reach the 42% cap.
- **R5. Figure 2 walkthrough asks too much.** Split into six short steps. Each
  step has one action and one thing to notice. Steps that need it say Reset,
  and each step gives the shop's own numbers.
- **R6. Aphorisms.** Every named aphorism and flourish was replaced with plain
  statements, including the closing paragraph.

## Teaching review: suggested

- S1. Sensitivity on the budget figure: applied as "What if" switches for the
  popularity exponent (0.9 or 0.8) and traffic (1× or 2×). "What would change
  the design" now walks through them.
- S2. Axis rescales: applied. The axis is fixed at 0–600. Overflow is drawn as a
  chevron with its total ("1,386 →").
- S3. Memory readout exceeding the control: applied. The readout reads "X GB
  of Y GB".
- S4. Two denominators: applied. One combined "page reads that hit (need
  92.5%)" figure, over details and stock together.
- S5. Soft expiry: applied. It is now derived from `PTTL`, as in Cache
  stampedes.
- S6. Che undefined: applied, with a one-sentence definition and a DOI source.
- S7. Leases on the read path: applied. The text says that `MGET` placeholders
  count as misses, and it gives the three lease rules.
- S8. Sale repricing: applied. 380 then 1,500 misses a second. Pace the
  deletes to about 50 a second, which takes about 7 minutes.
- S9. Figure layout: applied. The incident buttons sit beside the switches, and
  the series labels say "(solid)" and "(dashed)". A dashed mark shows each
  switch change. Dots are hidden below 480 px, where they covered labels.
- S10–S14: applied. "About 35 seconds in all". The jitter sentence was fixed.
  A clause on the 2,048-byte size class was added. "Memory stops being the
  limit" replaces "the whole catalogue fits". The caption leaves the trending
  panel out.

## Technical review: required

- **R1. Figure times do not transfer.** The caption and the prose now say
  Figure 3 is at 1/100 scale and its times are the model's. Each step gives the
  shop-scale numbers from a separate fluid refill model
  (`recovery-model.mjs`): an empty restart refuses about 1.2M pages over
  2.3 h, and a key-version deploy about 470k pages over about 1 h. Decisions
  follow from these numbers. The replica is justified by the hours-long
  refill.
- **R2. ACL users not replicated.** I tested this on 8.10.3 (E4).
  `ACL SETUSER` on the primary never reached the replica. The design now loads
  one ACL file on every server, through `aclfile`, and is changed with
  `ACL LOAD` on each. The file has users for the application, the relay, the
  replica (`masteruser`), the Sentinels (`sentinel auth-user`) and an admin.
  All were tested. The application's user is refused `SCAN`, `KEYS`,
  `RANDOMKEY`, `FLUSHALL`, `CONFIG`, `CLIENT KILL` and `INFO`. Administration
  stays possible through the admin user.
- **R3. Fork.** See teaching R2.
- **R4. Alert mislabelled.** The page alert is now on the database's total load
  passing 210.
- **R5. Baskets "never lost".** The text now gives the real bound: a crash or
  failover may lose about the last second of changes, with AOF `everysec` and
  an asynchronous replica. It names WAIT/WAITAOF and min-replicas-to-write as
  ways to narrow that window.
- **R6. Stock never evicted.** Figure 2 now uses one shared-LRU characteristic
  time across both families under one `maxmemory` with `allkeys-lru`. Stock is
  evictable. The design moves from 3 GB to 3.5 GB, and its numbers are 147
  queries a second and a 95.6% page hit ratio.
- **R7. Library retries.** The design turns library retries off: redis-py
  `retry=Retry(NoBackoff(), 0)` and go-redis `MaxRetries: -1`. A timed-out
  lease or lock counts as not held by us. This is consistent with Redis
  clients, and the checklist item was updated.
- **R8. SCAN.** The application's user lists commands one by one rather than by
  category. The text explains that `+@read` includes `SCAN`, which ignores key
  patterns. The refusal was verified (E4).

## Technical review: suggested

All applied:

- S1: the LFU comparison is reported with key counts, one run each.
- S2: the departure from the TTL rule is named, plus a price-sampling job.
- S3: lease details are given.
- S4: the trending panel has a cold-start default.
- S5: pre-8.4 needs `EVAL`/`EVALSHA`, and the text says so.
- S6: rollback deletes go under both names.
- S7: the text names the size class and says to measure on the production
  build.
- S8: "most of those reads miss".
- S9: checkout's 120 queries a second are the part more memory cannot reduce.
- S10: the ceiling is 26.
- S11: failover is now 6 s.
- S12: deletes are replayed on `+switch-master`.
- S13: the label sits above the rule with a halo.
- S14: the Che source has a DOI.

## Conflicts and choices

- **Ramp versus reading the old key.** Teaching wanted the ramp kept. Technical
  R1 shows that at shop scale a two-minute ramp still refuses about 440k pages.
  It would need about 1.5 h at peak. So the playground's ramp switch is
  replaced by "a miss reads the old key first", the option Operating a cache
  names. A paced off-peak warm job is the fallback: 414k products, 81% of
  reads, about 46 min at 150 q/s.
- **3.5 GB versus 4 GB.** I kept 3.5 GB (63 queries a second spare). 4 GB is
  shown as the response to a flatter curve.
- **Traffic sensitivity.** I kept 1× and 2× and cut a 1.5× step as length
  without return.

## Toolkit gap

`lineChart` in the shared toolkit has no static horizontal-rule update, so
Figure 1 draws the TTL line as a two-point dashed series. The shared folder was
not edited.

## Checks

- `pnpm build` passes, both normally and with `CACHING_DRAFT_PREVIEW=1`.
- `pnpm test` (models) passes.
- Screens are in `screens/`: shot.cjs at desktop and phone, light and dark, plus
  `use-*` captures of each changed control. There were no console errors.
- Redis on 7112/7113 was shut down and its data deleted. The dev server on 4422
  was stopped. Nothing was committed.

## Still open

- The article grew from about 6,600 to about 8,500 words. That is mostly the
  new figure's walkthrough, the stepwise failure section and the ACL block. A
  trimming pass may be wanted.
- Should the design move to 4 GB for margin against an unmeasured exponent?
