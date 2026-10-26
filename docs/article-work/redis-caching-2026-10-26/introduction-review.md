# Article 1: Keeping a copy of the answer

Self-review, 26 October 2026. This was written and checked by the same agent; no
independent review is claimed.

## Teaching judgement

The opening introduces a repeated piece of application work before naming caching.
The first figure makes the application-owned miss/fill/hit paths visible. The next
three figures vary request identity, the cost of the two paths, and time since a
copy was filled. These are different causal arguments, not four decorative views
of the same architecture.

The Gears benchmark is used for visible mechanisms, local controls, continuity of
objects and derivation after observation. The request animation retains the same
four actors when switching to a hit; the source remains idle. Reuse is visible as
reads turning into hits. The latency comparison originally changed only a number
when hit rate changed; the review added an average-duration bar with weighted
source/fill segments. The freshness figure exposes the two different prices and
then an empty cache, without falsely animating a refresh.

The prose explains each control before use and interprets the resulting change
afterwards. The mean equation follows the measured-looking but explicitly invented
path lengths. Reuse, latency and correctness are kept distinct. The ending opens
the next article's key-identity problem. Deep concurrency, failure and operating
questions have explicit later owners rather than compressed pseudo-solutions.

Limit: this introduction does not teach a production cache implementation on its
own. Its native exercise teaches the Redis conversation; application integration,
overload controls and consistency protocols are later articles in the commission.

## Evidence and checks

- Primary GET, SET, EXPIRE, TTL, DEL and Redis data-store documentation checked;
  Microsoft cache-aside documentation used for the pattern's ownership and scope.
- `first-copy-native.sh` ran successfully using the official Redis 8.2.2 image.
  Exact image digest and observed results are in `first-copy-native.txt`.
  The disposable instance published no ports and was stopped after the checks.
- Four model tests pass: explicit request identities, enumerated versus calculated
  costs, expiry/deletion boundaries, and source access only on the miss path.
- Browser checked at desktop 1280 px, mobile 390 px and narrow mobile 320 px.
  Both dark and light themes inspected. No page overflow at 390 or 320 px and no
  console errors in the inspected run. Screenshots are in `screenshots/`.
- Controls exercised: first/later request, scrub to completed miss and hit, full
  request animation to completion, four/24 distinct products at 24 requests,
  zero/100% hits, 1/20 ms source durations, 5-second stale state, 10-second expiry,
  optional deletion at 5 seconds, and keyboard Home/End/ArrowRight on sliders.
- Play is opt-in, scrub/reset are available, offscreen/hidden animations stop.
  SVG mechanisms have text descriptions; controls have labels; result text is
  announced politely. The prose and captions remain available without JavaScript.
- `pnpm test`: all 23 site-check tests passed. Final `pnpm build`: all 13 site
  rules passed after the accessibility adjustment, building 131 pages.

Publication is authorised by the 26 October commission. Only this article is
available; the remaining thirteen collection entries remain unpublished.
