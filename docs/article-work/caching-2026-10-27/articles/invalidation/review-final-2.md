# Final review, round 2: Cache invalidation

Reviewer: independent pre-publication reviewer, fresh to the article. 28 October 2026.

## How I reviewed it

- Re-read `brief.md` and the plan entries for articles 4–6 and 8, 10, including "Map changes after research".
- Read the full text of Gears and Load Balancing again. I used three Gears demonstrations: the ratio-of-radii discs, the spool with torque, and the slip. I also played two Load Balancing simulations: request cost variance, and dynamic weighted round robin.
- Read the rendered article at `localhost:4475` from top to bottom. I used every control in all nine figures and stepped each stepped figure through every option to the end, using Playwright. I put the screenshots in `final-screens/` (both themes, 1280 px and 375 px) and the interaction captures in `final-screens/use/`. There was no horizontal overflow and there were no console or page errors. With reduced motion set, Figures 1 and 8 do not autoplay. The node model tests (8) pass.
- Ran Redis 8.10.3 on port 7175 with a temporary directory and `--save ''`, then shut it down. I checked:
  - `SET … NX PX`, `SET … IFEQ` (no expiry left without `EX`, and `KEEPTTL` keeps the lease's), `IFEQ` on a missing key (nil, not created), and `DELEX`;
  - the article's version/tombstone Lua script (tombstone v8 refuses v7 and accepts v8, and refuses a duplicate fill and a duplicate tombstone);
  - `PUBLISH` with no subscriber (0);
  - `EXPIRE … GT` on a newly created set;
  - `DEL` and `UNLINK` of a 1,000,000-member set;
  - the `lazyfree-*` defaults (all `no`).
- Checked against primary sources:
  - the redis.io SET page: `IFEQ` since 8.4.0, does not create the key, and sets the value *and expiration*;
  - Meta's "Cache made consistent": the six-to-ten nines figure "within five minutes", the fill-versus-invalidation race, and versions lost to eviction;
  - the memcache paper's details as cited: the 64-bit lease, LL/SC, 10 s token rate, 17K→1.3K, own-cluster invalidation, mcsqueal in replica regions, remote markers and the two-second cold-cluster hold-off;
  - Terry et al.
- Re-derived the *w*·δ result and checked the figure readouts against the prose:
  - Figure 3: 73 / 0.077% / 0.083%, 6,031 at 6 s, 104 at a 1-minute TTL, about 4× at 200 ms;
  - Figure 4: 59% / 82% / 95% / 20%;
  - Figure 8: 10.3 discarded, and about 3× the keys.
- Only after forming this judgement did I skim the round-1 reviews and repair notes. Their required items are addressed. The exception is R2 (monotonic reads): the repair added a sentence that is wrong, and it appears as B2 below.

## Verdict

**Publish after the listed blocking fixes.** The article is good. It starts from a failure the reader recognises (an hour of £39 with no error logged). It derives *w*·δ in short steps and then lets the reader confirm it. It also earns a real surprise: a short TTL caps the worst case but does not lower the average. The races are shown step by step with the real Redis replies. The remedies are each placed against what they fix and what they cannot fix, and the Redis 8.4+ lease built from `SET … NX` and `SET … IFEQ` is correct and well explained. The figures are clear in both themes and at 375 px.

Three things need fixing first:

- one figure contradicts the prose at exactly the point where the reader is told what to look for;
- one piece of Redis advice, if followed as written, gives the opposite of what it promises;
- one sentence claims a consistency guarantee that the article's own definition shows is not given.

Each fix is small.

Counts: **3 blocking, 12 minor.**

## Blocking

### B1. Figure 1: "Lose the next delete" is ended by the next write's delete, not by expiry, so the reader does not see what the prose describes

The prose (line 30) says that after pressing the button "the copy now stays at the old price, and every read is stale, until it expires". The figure's status line says the same: "A copy whose delete was lost stays until it expires, 15 seconds after it was stored". The text alternative also says the copy stays stale "until the copy expires 15 seconds after it was stored".

In the model, writes come every 3–9 s and copies live 15 s. The next write's delete (which is not lost) therefore usually removes the stale copy long before it expires. When I pressed the button once, the stale stretch ended after 7.2 s at the next teal delete square on the Redis band, with no expiry marker anywhere (`final-screens/use/f1-lose.png`). The reader is told to watch for the TTL ending the stretch and sees something else end it. The lesson of the paragraph ("no stale stretch lasts longer than the copy's lifetime") is true, but this figure almost never shows it.

The fix is either of these:

- **Option (a), preferred.** Make the control a toggle, "Deletes are lost", that drops every delete while it is on. The stretch then visibly runs to the expiry marker, and the reader can switch it off to watch normal invalidation resume.
- **Option (b).** Keep the button and correct the prose, status line and text alternative to say that the copy stays stale "until the next delete that does arrive, or until it expires, whichever comes first; lose the deletes of two changes in a row and the TTL is what ends it". This is also worth saying because it is true in production: a lost delete is often repaired by the next write.

### B2. "Keeping a user's fills on the primary, or the recent-write marker, also gives that user monotonic reads" is not true

This is in the Choosing section, under "Do reads go to replicas?". The cache is shared. A user who has seen £35 can later hit a £39 that *another* reader stored from a lagging replica, or that a slow reader stored through the stale-set race. The article's own definition names exactly this case: "when an old value is stored after a fresh one was read". The marker only protects that user's reads for its ten seconds; after it expires they read the shared cache again.

Fix: say what each measure actually gives. For example: "Keeping every fill of a changing key on the primary removes the replica cause of going backwards. The marker, or a version the client carries, keeps one user from going backwards while it lasts. Only a version the client carries, checked on every read, holds after that." The third read-your-writes option, returning the version to the client, is the one that genuinely gives monotonic reads for that user if it is kept as a high-water mark rather than only for a few seconds. Say so in one sentence where it is introduced.

### B3. "Give the set a TTL … extended on each fill with `EXPIRE … GT`" leaves every new tag set without a TTL

`EXPIRE` with `GT` treats a key with no TTL as having an infinite one, so on a set just created by `SADD` it does nothing. I observed this on 8.10.3:

```
SADD tag:p42 a                → 1
EXPIRE tag:p42 300 GT         → 0
TTL tag:p42                   → -1
```

A reader who follows the sentence as written gets tag sets that never expire. Each set keeps growing with the names of expired pages, which the article itself mentions, and under a `volatile-*` eviction policy the sets are never evicted. The project's evidence (Repair-1 R5) shows the writer knew that `NX` is needed as well, but the article does not say so.

Fix: "…extended on each fill with `EXPIRE … NX` (which sets a TTL on a new set) followed by `EXPIRE … GT` (which only lengthens it)." Alternatively, if every page uses the same TTL, a plain `EXPIRE` on each fill is enough. Put both in the fill script or pipeline.

## Minor

1. **The lost-delete bullet under "Bounded staleness" and B1.** Once B1 is fixed, check that line 35's "the bound is the TTL plus however old the value already was" is still what the figure shows. It is correct as a bound.
2. **The `DEL` timing for a million-member set.** The article says "tens of milliseconds". On the same machine today I measured about 460–530 ms for `DEL` of a 1,000,000-member set of ~22-byte names, and about 10 µs for `UNLINK`. The evidence file records 41–69 ms with the writer's script. The number depends heavily on the size of the members and on the allocator; this build uses libc malloc, as the brief warns. Say "tens to hundreds of milliseconds on a laptop" or simply "a noticeable pause, from tens to hundreds of milliseconds". The conclusion (use `UNLINK`) is unchanged.
3. **The Facebook hold-off parenthetical (line 111).** It gives the reason the hold-off is limited to cold clusters as "because every read of the key goes to the database meanwhile". The paper does not give that reason, and in a cold cluster misses go to the warm cluster, not the database. Drop the "because" clause, or drop the parenthetical (see Length).
4. **"`SET … IFEQ` without an expiry option left the key with none at all."** That is ordinary `SET` behaviour: redis.io says any previous TTL is discarded on a successful `SET`, and that `IFEQ` sets "the key's value and expiration". Presenting it as an 8.10 observation makes it sound like a quirk. Say "like any `SET`, it replaces the expiry, so always pass `EX`".
5. **The generation counter restart from `TIME` in milliseconds.** This can collide if a counter was incremented faster than once a millisecond before it was lost (start T₀, 1,000 `INCR`s in 500 ms, lost, restarted at T₀ + 600 ms). That is rare, but the fix is cheap: use microseconds, or `TIME` seconds × 10⁶ + microseconds. Alternatively, keep the counter in a Redis that does not evict, which the marker paragraph already recommends for markers.
6. **"Redis typically holds three or four times as many page keys as it can serve."** This is a property of the figure's 20 s TTL and 7 s change interval, not a general fact. Give the rule that a decision needs: old generations in memory ≈ TTL ÷ time between changes. A one-hour TTL on a category that changes every minute holds about sixty copies. That turns an observation into a sizing rule in one sentence.
7. **"A generation is immune to the stale-set race."** This is true for the slow-reader race. It is not true for a reader that reads the new generation and then a lagging replica. Add "with fills from the primary", or one clause pointing to the replica paragraph.
8. **The "Choosing" table and the four questions overlap.** The table's "What it fixes" column already answers most of the questions. See Length.
9. **Figure 3 has three controls.** The prose handles this well ("try each control on its own"). Consider adding "Reset to defaults", because the dashed outline compares against defaults the reader may have moved away from.
10. **Figure 6 phone layout.** The four-option choice wraps into a ragged 2+1+1 grid at 375 px (`dark-phone-06.png`). It is readable, but the shorter labels "plain SET / if newer / if newer, after eviction / if newer, with tombstone" would wrap more evenly.
11. **The `KEEPTTL` aside.** "(`KEEPTTL` would keep the lease's two seconds)" is correct, but it is a trap only a reader trying `KEEPTTL` would hit. Fold it into the sentence from minor 4.
12. **The lease code returns `db.fetch_product` when `SET … NX` fails.** That is correct, and the stampede hand-off is clear. One more clause would help the reader who copies the code: a crashed lease holder sends every reader of that key to the database for the full `PX`. The prose says this in "Three details", so it could also go in a code comment.

## Length

The prose is about 5,000 words in the body, plus about 380 in Sources. Figure captions and text alternatives add the rest of the ~6,000.

**The length is mostly earned.** The subject has several independent failure modes (racing fills, out-of-order writers, lost deletes, fan-out, the writer's own view), and each comes with a remedy whose limits change what a practitioner chooses. The longest sections are the ones that carry decisions:

- **How often** (~700 words) is the article's best decision tool. It tells the reader which keys need more than a TTL.
- **Fan-out** (~770 words) compares three schemes, each with a trap that would cause a production bug.

Four passages spend time without changing what the reader would decide. Together they come to about 350–450 words.

1. **The Facebook hold-off parenthetical** in "Deleting twice" (line 111, ~45 words). Nothing later uses it, and its stated reason is shaky (minor 3). Cut it.
2. **The final paragraph of "Out-of-order writers"** (line 186, ~70 words: the `IFEQ` read-compare-retry alternative to the script). This is a second implementation of something the reader already has, and it does not change the choice. One sentence would do: "On 8.4+ the same check can be a read-compare-`SET … IFEQ` loop, with `SET … NX` when the key is missing."
3. **The Rails paragraph in Fan-out** (line 222, ~90 words). The versioned-key idea is worth keeping, but the `touch: true` and clock-precision details are framework trivia. Two sentences would do: the idea, plus the limit that it cannot express a new member joining a set.
4. **The overlap between the table and the four questions in "Choosing"** (~600 words together). The table is the reference. Keep it and the opening "start with the TTL, then *w*·δ" paragraph, then reduce the questions to the parts the table cannot say: replicas break leases, replay after failover, and give the writer their own read path. That is about 120 words fewer.

The Sources note on what was measured is long, but it is the article's honesty statement and I would keep it.

None of the four is blocking; together they would make the article noticeably brisker without losing a decision.
