# Repair round 2: Redis clients: round trips, pipelining and atomic operations

Review addressed: `review-final-2.md` (1 blocking, 11 minor). Evidence appended to
`evidence/clients-and-pipelining.txt` under "Repair round 2". Not committed.

## B1. redis-py reports a timed-out WATCH transaction as WatchError (blocking): fixed

Reproduced on Redis 8.10.3 (port 7118) before writing. I used redis-py 8.1.0's own
`Redis.transaction()` helper, a 100 ms timeout, and a `DEBUG SLEEP` stall after WATCH and the
read. Each case ran 5 times:

- 0.15 s stall, add 1 (`HINCRBY`): n = 2 every run, no error raised, with default retries and with `Retry(NoBackoff(), 0)`.
- The same change with a marker (`SET applied:req1 1 EX 600` in the transaction, and stop if the marker exists): n = 1 every run.
- Figure 8's "write version 9 only if newer": one write every run.
- 0.5 s stall: the caller got TimeoutError and the change ran once, in every case.
- go-redis v9.23 `Watch` + `TxPipelined`, 0.15 s stall, retries on and off: ran once and returned the i/o timeout.

Article changes:
- Retry table: a new row for a `WATCH` transaction that adds 1, with a 0.15 s stall. redis-py: "Ran twice; reported success, with retries on or off". go-redis: "Ran once; reported a timeout".
- The paragraph after the table now says that with retries off every row but the last ran once. It says why the last row differs, links forward to the WATCH section, and states that in redis-py neither turning retries off nor a second client protects a `WATCH` loop.
- WATCH section: two new short paragraphs.
  - The first gives the mechanism (`WatchError` whatever the retry setting; `Redis.transaction()` re-runs it) and the measured result, including the 0.5 s case and go-redis.
  - The second says what to do. Figure 8's version check is safe. A relative change needs a marker with a request id, written in the same transaction and checked before writing (measured). For a plain counter, `HINCRBY` with retries off is simpler.
- Changed "Its weakness is contention" to "`WATCH`'s main weakness is contention", because the new paragraphs come between that sentence and the section's opening.
- "Choosing the tool", WATCH row: added "in redis-py a timeout looks like a conflict, so the loop can apply a relative change twice".

## Minor findings

1. **go-redis pool state:** fixed. The table's lead-in now says "several connections already open in the pool, as in a busy application".
2. **"the library, not your choice of commands":** fixed, with the reviewer's wording: "the library, and how it treats each kind of call, decides what is repeated".
3. **Reset example:** fixed. A retry is always safe only after a failure before the command left the client, such as a connection that could not be opened. A reset after sending is as uncertain as a timeout.
4. **"most client libraries":** fixed. The text now says "redis-py 8 and go-redis v9, two of the most widely used libraries". Figure 5's step text "as most client libraries can do automatically" became "as redis-py and go-redis do by default".
5. **Reported values:** fixed with one sentence after the table: the reply carried the doubled count.
6. **Repeated 24-value timings:** cut. The paragraph after the formula keeps only "Faster Redis would not help … fewer round trips". The proxy description moved into the table's lead-in. The paragraph after the table now says "One at a time, the reads cost 24 round trips". About 55 words saved.
7. **cjson paragraph:** cut. Its one useful fact, that `cjson` turns an empty array into an object and rounds a 17-digit id, is now one sentence in the script-costs paragraph, because it bears on whether to edit JSON inside a script. The "prefer HINCRBY" advice was already in Lost updates.
8. **Figure 4, Next at the last step:** could not reproduce, so the figure is unchanged.
   - At 1280 px, Next at 9/9 is `aria-disabled` and clicking it leaves 9/9, in both modes. Figure 4 uses the same shared stepper as Figures 5 and 8.
   - In one of my probe runs the figure reset itself to 1/9 about 5 s after reaching the end, without any click. That run followed the dev server's "Re-optimizing dependencies" start-up, and a Vite reload explains a jump to step 2 on the next Next. It did not happen again in a logged rerun.
9. **Figure 5 at 375 px:**
   - Note fixed. The "timeout: gives up" note is now "times out" in both specs, so the box clears the row number. The step text still says the library gives up. I checked the final steps of "INCR views" and the race at 375 px in light and dark, and at 1280 px.
   - Label not changed. "SET price 36" still touches B's dotted lifeline with one character. The label position comes from the shared sequence code, and shortening only B's label would make it read differently from the application's "SET price 35". The reviewer rated this cosmetic.
10. **Closing bullet:** fixed. It adds "and, in redis-py, what it reports as a `WATCH` conflict".
11. **Pool timeout in go-redis:** fixed: "remembering that go-redis's retries can repeat it up to four times". This is confirmed in `error.go` `shouldRetry`, which treats `pool.ErrPoolTimeout` as retryable.

## Checks

- I screenshotted all eight figures in light and dark at 1280 px and 375 px (`screens/`), with no console or page errors and no overflow. I looked at each figure. I exercised Figure 4's Next at the end in both modes, and stepped Figure 5's changed note to the end in both themes and both widths.
- `models.test.mjs`: 6 tests passed.
- I read the article top to bottom after the edits.
- Not run: `pnpm build` / `pnpm check`. The site check runs on a full build, and disk space is tight.
- The dev server on 4418 and Redis on 7118 are stopped. Scratch files: `r2_watch.py` and `r2go/` in the scratchpad.
