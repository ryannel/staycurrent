# Writer report: 8. Redis clients: round trips, pipelining and atomic operations

## Delivered

- Article: `src/articles/caching/clients-and-pipelining.astro`. About 7,200 words of prose,
  not counting code or figure text; about 8,900 rendered words with figure captions and text
  alternatives. 18 sections, ending with "What you can now decide" (links forward to article 9)
  and "Sources and further reading".
- Figures: `src/components/caching/clients-and-pipelining/`. Pure models are in `.mjs` files,
  and `models.test.mjs` checks every number the prose quotes from them (6 tests pass, run with
  `node --test src/components/caching/clients-and-pipelining/`).
- Evidence: `docs/article-work/caching-2026-10-27/evidence/clients-and-pipelining.txt`. It has
  the environment and server command, 14 experiments with their commands and output, library
  defaults read from source at release tags, and an appendix with every script.
- Plan: `plan.md` in this folder. Screenshots: `screens/`, which holds 32 shots (8 figures × 2
  themes × 2 widths) plus `screens/controls/` showing each control's end states.

## Figures

| # | Figure | Kind | Controls |
|---|---|---|---|
| 1 | A page reading its values one at a time | Live ladder diagram | Values slider |
| 2 | Three ways to read a page's values | Live ladder plus bar chart | Method choice, values slider |
| 3 | One slow round trip in a hundred, and pages that wait for many | Wall of 100 pages | Round-trips slider, independent or bursts, redraw button |
| 4 | What a new connection costs before the first command | Steps | New or pooled connection |
| 5 | A timeout does not cancel the command | Steps | `INCR` or `SET` |
| 6 | Retries while Redis is slow | Live line chart | No retries, 3 retries, or a retry budget |
| 7 | Four clients adding 1 to one counter | Live scene | GET+SET, WATCH or INCR |
| 8 | WATCH: write only if nobody else has | Steps | None |

I checked every control with a Playwright script on the dev preview, and the readouts matched
the prose:

- Figure 1: 24 values give 24 round trips and 12.3 ms.
- Figure 2: one round trip and 0.56 ms batched, against 12.3 ms one at a time.
- Figure 3: 1%, 17 and 64 pages in 100 at 1, 24 and 100 round trips.
- Figure 6:
  - With no retries or a budget, it recovers by 25 s.
  - With 3 retries, it reaches about 4× attempts, all replies are wasted, and the queue is
    still growing at 60 s.
- Figure 7: GET+SET executes 125 increments for a value of 48; WATCH needs 7.8 round trips per
  increment; INCR needs 1.0.
- The step figures reach their final states in both choices.
- Under reduced motion nothing autoplays.

I looked at all screenshots in light and dark themes at 1280 px and 375 px. No console errors
appeared and nothing overflowed horizontally. A draft-inclusive build (`CACHING_DRAFT_PREVIEW=1
pnpm build`) passed all 13 site-check rules with the page included. I then ran a normal
`pnpm build`, which also passed, to restore `dist`.

## Evidence gathered

Measured on Redis 8.10.3, on port 7108 only, which has now been shut down. The machine had a
load average of 18–34 from other agents.

| Measurement | Result |
|---|---|
| RESP bytes on the wire | Recorded |
| Loopback round trip | 0.09 ms |
| 24 values: one at a time / pipeline / `MGET` | 2.13 / 0.13 / 0.11 ms |
| 24 values through a 1.6 ms delaying proxy | 39.3 / 1.62 / 1.62 ms |
| 1,000 values in batches of 1, 10, 100 and 1,000 | Both networks |

Behaviour observed:

- **Pages and connections.**
  - Tail: 8% of 24-GET pages hit a GET slower than the p99, against a predicted 21%. The
    slowness was correlated.
  - Connection per request: 0.10 / 0.25 / 0.35 ms.
  - `maxclients` rejection was confirmed.
- **Pipelines.**
  - Another client's commands interleave with a pipeline.
  - Errors are reported per command.
  - A 200 MB output buffer built up for a client that read nothing.
- **Timeouts.**
  - After a timeout, `INCR` counted twice while `SET` was harmless.
  - `INCR` followed by FIN ran 200 of 200 times; followed by RST, only 16 of 200.
- **Lost updates.**
  - A counter kept 861–885 of 4,000 increments.
  - A JSON sale counter kept about 430 of 2,000; a cjson script kept 2,000.
  - `WATCH` lost nothing but needed 17.6 round trips per increment.
- **Transactions and `WATCH`.**
  - `MULTI` ends in `EXECABORT` when a command cannot be queued.
  - There is no rollback for errors at run time.
  - `WATCH` aborts on a write of the same value and on expiry.
- **Scripts and functions.**
  - `NOSCRIPT` appears before loading and after a restart.
  - A script error does not undo earlier writes.
  - `BUSY` and `UNKILLABLE` were confirmed.
  - Functions are lost on a restart without persistence.
- **Redis 8.4 commands.** `IFEQ`/`IFNE`/`DIGEST`/`IFDEQ`/`DELEX`/`MSETEX` were checked,
  including `WRONGTYPE` on hashes and `MSETEX NX` being all or nothing.
- **Coordinator's request: redis-py 8.1.0 with default settings.**
  - It retried a timed-out `INCR` by itself: 102 after 640 ms.
  - A `GET` to a port with nothing listening took a median of 3.8 s to fail, or 3.6 s with
    50 ms timeouts.
  - A `GET` to a host that did not answer, with 50 ms timeouts, took 2.9–5.0 s.
  - With retries off, the same calls took 101 ms, 3 ms and 53 ms.
  - This is shorter than the coordinator's 8–10 s. The article reports my measured numbers
    and the source-verified defaults: 10 retries, backoff of random × 10 ms × 2^n capped at
    1 s, and a retry on `TimeoutError`.

## Claims I could not verify, or that are illustrative

- No real network was measured:
  - The 0.5 ms round trip in Figures 1–2 is labelled illustrative.
  - The only cross-network figure cited is Redis's documentation (about 200 µs at 1 Gbit/s).
- TCP and TLS handshakes were not captured. Figure 4 shows them from the protocols and says so.
  The TLS CPU cost is stated qualitatively.
- That eviction aborts `WATCH` comes from the documentation; I observed only the expiry case.
- `FCALL_RO` running on replicas comes from the documentation; no replica was tested.
- Figure 6 (retry model) and the burst model in Figure 3 are illustrative, and their captions
  say so.
- Lettuce and Jedis defaults were read from source but not run.
- go-redis's behaviour on timeouts (whether it retries them) was not tested, and the article
  does not claim it.

## Coverage-map gaps and overlaps

- **Article 1** already gives the 0.99^20 argument for misses. Article 8 links to it and
  applies the same arithmetic to slow round trips.
- **Article 5 (Invalidation)** already teaches `SET … IFEQ`, including how it replaces expiry,
  `DELEX` for releasing a lease, the version script and the IFEQ retry loop. Article 8 does not
  repeat them:
  - It teaches the general mechanisms instead: `MULTI`, `WATCH`, the script and function
    lifecycle, and the IFEQ family as a whole.
  - Its worked script is the JSON sale counter that article 3 promised, not the version script.
  - Figure 8 uses WATCH on article 5's version problem. That is new mechanism on a familiar
    problem.
- **Article 6 (Stampedes)** already explains releasing a lock with `DELEX`. Article 8 only
  cross-references it.
- **Article 7** taught the server-side CPU cost of pipelining. Article 8 links to it and does
  not re-derive it.
- Metastable failure is named in one sentence. Circuit breakers, falling back, shedding load,
  TLS and security are left to article 11.
- Cluster gets one paragraph (`CROSSSLOT`, hash slots) and a link to article 10.
- **Possible gap for article 9 or 11:** the client's view of failover (script cache lost, stale
  replica reads) is named in the closing paragraph only.

## Toolkit gaps (extended locally, shared toolkit not edited)

- The toolkit has no time-axis ladder diagram, because the shared sequence diagrams show order
  but not time. I added a local `ladder.mjs`.
- A sequence cannot change with a `<Choice>`. I added `switch-sequence.mjs`, a copy of the one
  in caching-patterns, so two articles now carry the same helper. It belongs in shared.
- There is no shared non-simulation button control: Figure 3's "Draw 100 new pages" uses a
  local button styled with `cache-button`.
- The step figures do not initialise their step counter until they scroll into view. Real
  readers are unaffected, but a test must scroll first.
- `fmtMs` and the readout formatting are local. A shared duration formatter would help.

Nothing was committed or pushed.
