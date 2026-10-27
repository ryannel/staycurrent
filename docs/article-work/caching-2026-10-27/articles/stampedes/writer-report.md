# Writer report: 6. Cache stampedes and the thundering herd

Article: `src/articles/caching/stampedes.astro`. Components and models:
`src/components/caching/stampedes/`. Plan: `articles/stampedes/plan.md`.
Evidence: `evidence/stampedes.txt` (scripts in `evidence/stampedes-scripts/`).
Screenshots: `articles/stampedes/screens/` (40: ten figures × light/dark ×
desktop/phone). Not committed.

## Word count

About 5,760 words of body prose (code blocks excluded), 330 in Sources, and
about 1,230 more in the ten "What this shows, as text" alternatives.

## Figures

1. One popular key expires. Live scene; slider: requests a second. Queries per expiry follow rate × 1 s rebuild.
2. What the database does with a stampede. Chart of a 20-connection pool; slider: rate. 100 queries, copy stored at 0.2 s, pool busy to 1.2 s, another page waits 0.32 s (0.9 s at 1,000/s).
3. Single-flight in each process. Scene; choice every request queries / single-flight. Four queries per expiry.
4. A rebuild lock, step by step. Sequence (11 steps), including the re-check and the `DELEX … IFEQ` release.
5. One rebuilder for all processes. Scene; choice single-flight / lock. One query, slowest response about 1.4–1.5 s against 1.1 s.
6. When the lock expires before the rebuild ends. Sequence; choice DEL / `DELEX … IFEQ`.
7. Serving the stale copy. Scene; choice lock / serve stale. One query, slowest 0.2 s, about 20 stale responses per expiry.
8. Each request draws its own head start. Custom live SVG timeline of XFetch; slider β. A sweep: the current cycle fills in to the left of "now", the previous one is shown faded to the right.
9. β sets the duplicates; traffic sets the head start. Chart of simulated rebuilds per expiry against β, with e^(1/β) and the paper's Theorem 7 formula; slider β, choice of 10 to 10,000 requests per rebuild time.
10. A cold start is a stampede on every key at once. Two charts (hit ratio, database queue wait) with both runs together; slider: database capacity.

Every control was exercised with a Playwright script, and the readouts were checked against the prose. Reduced motion stops autoplay. There were no console errors or page overflow at 375 px in either theme. Model tests: `node --test src/components/caching/stampedes/*.test.mjs` (10 passing).

## Evidence gathered (Redis 8.10.3, port 7106, `--save ''`, now shut down)

- **Commands (sections A–F):**
  - `SET … NX PX` returns OK and then nil.
  - `DELEX … IFEQ` returns 0 for a wrong token and 1 for the right one; the Lua compare-and-delete behaves the same.
  - In the timeline where the lock expires mid-rebuild, a plain `DEL` deleted the successor's lock and `DELEX` did not.
  - `GET`+`PTTL` work in `MULTI` and pipelined.
  - `PTTL` returns −2 and −1 for a missing key and a key without a TTL.
  - The hash layout works for XFetch.
- **Lab (G–J): real Redis, simulated 200 ms database, 500 requests a second, four connections.**
  - Cold key: no protection sent 92–115 queries, single-flight 4, the lock 1.
  - Re-check after taking the lock: without it, 2 of 30 bursts sent duplicate queries; with it, 0.
  - Warm key over 30 s (5 expiries): the lock sent 5 queries and made 480 requests wait (max 220 ms). Serve-stale sent 5 queries, served 515 stale responses, and the slowest took 16 ms.
  - XFetch over 120 s: 2.75 rebuilds per expiry across 28 expiries, with the first rebuild 1,028 ms early against 1,036 ms predicted. No request found the key missing.
- **Settled (section K): Vattani et al. stampede size.**
  - The paper's "e − 1/e ≈ 2.4" is its Theorem 7 bound evaluated at β = 1.
  - Derivation and simulation give e^(1/β): 2.72 at β = 1, the same at every rate. This held for Poisson and evenly spaced arrivals, and for both brute-force and exact sampling.
  - The paper's own Goodreads experiment agrees with e^(1/β): its Figure 7 shows about 3, and its text says β = 1.5 gives below 2.
  - Real Redis: 2.75 rebuilds per expiry.
  - The article states e^(1/β) and explains the discrepancy.

## Claims I could not verify

- Why Theorem 7's bound comes out too low. My reading is that Lemma 16 uses the smallest per-request probability in the window. The article only says "my reading … not confirmed with the authors".
- The value of about 3 at β = 1 is read off the paper's Figure 7 plot; it is not stated in the text.
- Whether Facebook's stale-on-delete and RFC 5861 behave as summarised in the article. Both are taken from the primary texts, but neither was tested.
- Lock hazards from GC pauses, failover and clock changes. These are cited from the Redis docs and Kleppmann, not reproduced.
- The full `pnpm build` failed for an unrelated reason: `src/components/caching/how-redis-works/scan-model.mjs` imports a missing `./walks.mjs`, which is another article's work in progress. Because of that, the site check was not run on this article. The dev preview rendered it without errors.

## Coverage-map gaps and overlaps

- **Article 4 (jitter):** it already owns synchronised expiry of many keys, with its figure. Article 6 gives it a short section with no figure and a decision rule only.
- **Article 2 (Figure 4):** it owns cold-start metastability. Article 6's Figure 10 reuses that scenario and changes only whether duplicate misses query, so the overlap is deliberate and kept narrow.
- **Article 5 (lease):** its lease is the same primitive as article 6's rebuild lock, and it already quotes Facebook's 17K/s → 1.3K/s figure. Article 6 refers back and repeats the numbers in one sentence. If article 5 is cut, article 6 still stands.
- **Background refresh by a scheduled worker:** the paper's "external re-computation" appears only as a table row and one decision question. No other article seems to own it, so article 11 may want it alongside warming.
- **Forward links:** article 6 links to 7, 8, 10 and 11, for command cost, atomicity and scripts, hot keys, and warming.

## Toolkit gaps (worked around locally, shared code untouched)

- **Switchable sequences:** there is no shared support for a sequence that changes with a `Choice`. `switch-sequence.mjs` is a local copy; articles 2 and 5 carry the same code.
- **Vertical markers in `lineChart`:** these are drawn as two-point series. A shared `markers` option appeared while I was working, but I did not switch to it mid-change.
- **Timeline figure:** the XFetch figure is a hand-built SVG (axis, curve, rows, bands, a "now" line). A small shared timeline primitive would help.
- **Readouts in large type:** long readout values wrap awkwardly, for example "5.2 rebuild times (formula 5.2)". A smaller secondary-readout style would help.
- **Concurrent edits:** the shared toolkit was being edited by another agent during my preview. Its hot reloads interrupted screenshot runs twice, so a retry was needed.
