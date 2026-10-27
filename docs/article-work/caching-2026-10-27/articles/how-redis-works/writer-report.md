# Writer report: article 7, How Redis works

Draft at `src/articles/caching/how-redis-works.astro`, figures in
`src/components/caching/how-redis-works/`. Preview with
`CACHING_DRAFT_PREVIEW=1 pnpm dev` at `/learn/databases/caching/how-redis-works/`.
Nothing is committed. The entry in `caching-collection.ts` is still `planned`.

## Size

About 5,100 words of prose (excluding the figures' text alternatives and the
Sources), which the layout shows as a 21-minute read. Ten `h2` sections plus
Sources. Nine figures, about one every 550 words.

## Figures

| # | Figure | Kind | Numbers |
| --- | --- | --- | --- |
| 1 | One thread, many clients (clients slider) | live, scene plus main-thread timeline | model, costs calibrated to the measured 7.55 µs per GET |
| 2 | One slow command stops everyone (key-count slider, Run KEYS) | live, timeline plus PING chart | model, with the measured KEYS cost (99.4 ms per million keys) |
| 3 | Walking a million keys: KEYS or SCAN (six-way choice) | static timeline plus readouts | readouts measured; PING positions illustrative |
| 4 | Freeing a big key: DEL, UNLINK, expiry (choice, Run) | live, two lanes plus PING chart | model, with the measured 195 ms free |
| 5 | A GET with I/O threads enabled | stepped sequence | from iothread.c and redis.conf |
| 6 | What one key costs (value-size slider, TTL choice) | static bar plus readouts | measured |
| 7 | Packed or hashed (fields slider, value-size choice) | schematic plus measured chart | chart measured |
| 8 | Deleted keys, resident pages (delete and add sliders) | static page grid | illustrative allocator, checked against measured ratio 2.03 |
| 9 | One stall, five tools (tool choice) | schematic timeline plus real tool output | outputs measured |

Pure logic sits in `eventloop-model.mjs`, `mainthread-model.mjs`,
`scan-model.mjs`, `pages-model.mjs` and the generated `measured.mjs`. The
tests in `models.test.mjs` (10, all passing) check that the numbers the prose
quotes come out of the models.

Checks: I screenshotted every figure in light and dark at 1280 px and 375 px.
A Playwright script (`scratchpad/pw/a7-controls.cjs`) exercised every slider,
choice, Run button, Step, Back and Next at 1280 px light, 375 px dark and
375 px light, and logged the readouts. There were no page errors and no
horizontal overflow. Screenshots are in `screens/` and `screens/controls/`.

Three fixes came out of the screenshots:
- The params slot was dropped inside an expression, so I wrapped it in a Fragment.
- PINGs were drawn as an open loop when redis-cli runs a closed loop.
- Labels overflowed at 375 px.

`pnpm build` passed, but it excludes drafts. I also built with
`CACHING_DRAFT_PREVIEW=1` into a scratch output directory and ran the
site-check rules on that build: no issues on this page.

## Evidence gathered

Everything is in `evidence/how-redis-works.txt`: Redis 8.10.3 on port 7107,
temporary dir, `--save ''`, now shut down. The file has sections A to R, an
appendix of the helper scripts, and a closing list of which article numbers are
measured, derived or illustrative.

Measured:
- **KEYS**: 99.4 ms per million keys; the PING maximum was 100.1 ms; a pattern matching nothing still took 50 ms.
- **SCAN** at COUNT 10 to 100,000: calls, wall time, server time and PING maxima.
- **Deleting a 2M-member set**: DEL blocks for 195 ms and UNLINK for 0.2 ms; expiry blocks with the lazy-free default and drops to 7–24 ms with `lazyfree-lazy-expire yes`; DEL of a 100 MB string takes 0.2 ms.
- **CPU per GET**: 7.55 µs without pipelining and 0.68 µs with `-P 16`.
- **Memory**: bytes per key from 1 B to 4 KB values, with and without a TTL; hash growth to 600 fields; every encoding threshold.
- **used_memory against RSS** through delete, refill and flush.
- **Diagnostic tools**: SLOWLOG, LATENCY, latencystats, `redis-cli --latency` during KEYS, `--intrinsic-latency`, `--bigkeys`, and the @dangerous ACL category.

Correction recorded in the evidence (section P): my first `redis-cli --latency`
runs during KEYS were invalid. With output that is not a terminal, latencyMode()
exits after 1 s (`redis-cli.c`), so those runs ended before KEYS was sent. I
repeated them under a pseudo-terminal.

## Claims I could not verify

- **I/O threads gains**: io-threads 4 against 1 on the laptop was lost in noise. The article quotes only the vendor's figures (8.0-M03 blog, 8.4.0 release notes), labelled as vendor figures.
- **Residual expiry stall**: with `lazyfree-lazy-expire yes` the stall was still 7–24 ms. I could not establish its cause, and the article says so.
- **Outlier at COUNT 10**: the slowest PING of 15.6 ms during SCAN COUNT 10 is not attributed to SCAN in the figure text, since p99 was 0.26 ms.
- **jemalloc**: all memory numbers are libc malloc on macOS. I have no jemalloc per-key overhead and no figures on how RSS behaves after deletion under jemalloc. The article says the numbers will differ on Linux and does not claim how.
- **Figure 9 app timer**: "GET took 90 ms" is schematic; the closest measured number is the probe's 100.1 ms PING.

## Coverage map: gaps and overlaps

- **Article 4 (expiration and eviction)**: this article teaches that expiry and eviction free memory on the main thread by default, using the lazy-free table. Article 4 should link here rather than repeat it. The docs say 25% and the source says 10% for the active-expiry repeat threshold; that discrepancy is left to article 4, and this article only says that many keys expiring at once keep the expiry cycle busy.
- **Article 3 (keys and values)**: this article supplies the encoding mechanism and the measured bytes per key and per hash field, and defers the strings-or-hashes decision to article 3. Article 3 should link to the "Small hashes are packed" section rather than re-derive the 512 and 64-byte limits.
- **Article 8 (clients and pipelining)**: this article derives the ~7.3 µs round-trip and ~0.2 µs command split and ends on it, so article 8 can start from that number.
- **Articles 9 and 11**: fork latency and swapping are named only, with a link to article 9. Article 11 owns capacity planning across a fleet; this article gives per-key measurement and "provision for the peak".
- **Valkey**: lazy-free defaults are `yes` in Valkey 8.0 and `no` in Redis 8.10. Any article that mentions DEL, eviction or expiry stalls should be consistent with this.

## Toolkit gaps (extended locally)

- **No thread timeline renderer.** I added `strip.mjs` (`threadStrip`: lanes, work blocks, wait bars, labelled spans and a time axis), which every main-thread figure uses. A shared version would serve articles 8, 9 and 11.
- **No clock units other than milliseconds.** `mountSim` advances in wall milliseconds and shows "s". `scaled()` in `strip.mjs` runs a microsecond model at a chosen slowdown. I hide the clock and relabel the Step button from the script, because `advance` can only be labelled in seconds or milliseconds of model time.
- **`poissonArrivals` assumes milliseconds.** A microsecond model must pass `rate / 1000`; this caused a bug that the tests caught.
- **No shared ArticleRef.** I copied the caching-patterns helper into `ArticleRef.astro`.
- **No vertical marker in `lineChart`.** I drew the "fields now" marker as a two-point series.
- **No log axis, and no Button component for params.** The Run buttons are plain `cache-button` elements in the params slot. A slot attribute inside an expression is silently dropped, so I wrapped the params in a Fragment.
- **No custom output text for sliders.** Sliders over non-linear stops (key counts, measured value sizes) overwrite the output text after `bindParams`.
