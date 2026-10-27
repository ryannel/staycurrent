# Repair 2 (pre-publication): Cache invalidation

28 October 2026. Addresses `review-final-2.md` (3 blocking, 12 minor, length).
Evidence appended to `evidence/invalidation.txt` under "Repair 2". Screens in
`screens/` (all nine figures, both themes, 1280 and 375 px) and `screens/use/`
(Figure 1 exercised at 0.25×, 1× and 4×).

## Blocking

**B1. Figure 1's lost delete.** Took option (a). The one-shot button is now a
labelled choice, "Deletes: Arrive / Are lost", which drops every delete while
on. Whether a delete is lost is decided when it is due to land, so switching
either way also applies to a delete already in flight. The model also now
shares one fill among reads that miss during it: without that, a second
concurrent `SET` could restart the TTL with an already-stale value and let a
stretch run up to 150 ms past 15 s (seen once in node checks). The caption says
so. The model records what ended each stale stretch.
- Node: 8 seeds × delays 0/400/3000 ms × 120 s with deletes lost: every stretch
  ended by expiry, none by a delete; the longest was 11.9–15.0 s. 199 seeds × 10
  min: the longest was exactly 15,000 ms. New unit test asserts this and that
  switching back lets deletes end stretches again (8/8 tests pass).
- Browser (Playwright, HMR socket stubbed so concurrent edits elsewhere could
  not reload the page): at 0.25×, 1× and 4×, each stale band ends at a
  dashed-ring expiry mark (`use/use-f1-lost-1x-11.png`, `-max-11.png`). Longest
  readout 8.9–11.9 s. Status line and "Arrive" message correct.
- Prose, status line and text alternative now say the same thing. The prose also
  adds one sentence from option (b): in production the next change's delete
  often clears a single lost delete sooner, and the TTL ends it when no change
  comes.

**B2. Monotonic reads.** Removed the false sentence. The Choosing bullet now
says that fills on the primary remove only the replica cause, not stale sets or
lost deletes, and that only a version the client carries rules all of them out
for the keys it carries. The read-your-writes paragraph now says where it
introduces the carried version: kept as a high-water mark from reads and writes,
it gives monotonic reads of those keys, and it suits a few keys. The table row
says the same.

**B3. Tag-set TTL.** Replaced with: set the TTL in the same script or `MULTI` as
the `SADD`. With equal TTLs, a plain `EXPIRE` is enough. With different TTLs,
use `EXPIRE … NX` then `EXPIRE … GT`, and the text says why `GT` alone fails.
Verified on 8.10.3:
- `GT` alone leaves TTL −1;
- `NX` then `GT` gives 300; a shorter later TTL does not shorten it, and a
  longer one lengthens it;
- the same in a fill script (120 → 120 → 600) and in `MULTI`.

The Sources measured-behaviour list now includes this.

## Minor

1. Bounded-staleness bullet: re-checked against the new figure. It still holds
   (copy fresh when stored, stale ≤ TTL). No change.
2. `DEL` timing: changed to "between tens and hundreds of milliseconds across
   runs". My run gave 80–96 ms for 1M members of 8–58 bytes. The writer measured
   41–69 ms and the reviewer 460–530 ms. Member size did not explain it, so I
   did not claim that it does.
3. Facebook hold-off: the parenthetical is cut, and so is "section 4.3" in
   Sources.
4. and 11. `IFEQ` expiry: now "like any `SET` it replaces the key's expiry".
   The `KEEPTTL` note is folded into the same sentence.
5. Generation restart: `TIME` in microseconds, with the reason, plus the option
   of a non-evicting Redis. Verified the `TIME` script, `SET … NX` and `INCR` on
   8.10.3.
6. Sizing rule: "for every page it can serve, Redis holds about TTL ÷ time
   between changes unreachable copies". That is about three here and about sixty
   for a 1 h TTL with changes every minute. Checked against the fan-out model:
   2.7–3.0 unreachable copies per servable page.
7. "Immune to the stale-set race, as long as fills read the primary", plus the
   replica case in one sentence.
8. Table/questions overlap: the four questions are now three short bullets on
   what the table cannot say (replicas, replay after failover, the writer's own
   read path).
9. Figure 3: added "Reset to defaults". Exercised it: after changing all three
   controls it restores 73 / 0.077% / 0.083% / 2.9 min.
10. Figure 6 labels: now "plain SET / if newer / if newer, evicted / if newer,
    tombstone". At 375 px they wrap 3+1, not 2+1+1. The prose and text
    alternative were updated to match.
12. Lease code: added a comment saying a crashed lease holder sends every
    reader to the database until the lease expires.

## Length

Cuts:
- the hold-off aside (~45 words);
- the `IFEQ` retry paragraph, down to one sentence that keeps "version inside
  the value" (~35);
- Rails, down to the idea plus its limit (~50), with `touch: true` dropped from
  Sources;
- the Choosing questions, down to three bullets (~110);
- Facebook's per-key remote marker (~35). It is multi-region detail, which is
  out of scope per the plan.

That is about 275 words cut. The blocking and minor fixes added about 250, so
the article is roughly the same length, not 350–450 words shorter. I found
nothing else whose removal would leave a reader's decisions unchanged.

## Not done

- `pnpm build` / `pnpm check` were not run. Other agents were editing in the
  same tree, so the orchestrator should run them before publishing. The dev
  page rendered with no console or page errors and no horizontal overflow.
- The disk filled up briefly mid-session (ENOSPC). It recovered without my
  deleting anything.
