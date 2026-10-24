# r13 rendered author checks

Page: http://127.0.0.1:4368/review/relational-collection/transaction-boundaries/

## Completed by the writer

Desktop 1280 × 720, System resolving to dark, before any settings changes:

- Initial article layout and both explanatory figures rendered in the article context.
- Snapshot final states visually inspected at Read Committed and Repeatable Read. Current committed stock 0 remains separate from Read 1/Read 2 results. RC places Read 2 on the later view; RR places both read chips on the older view.
- Instructor final Repeatable Read zero-cover state visually inspected; read facts, own-row committed writes and current shared duty rows remain distinct and legible.
- Every state in every option traversed: snapshots RC and RR, four states each; instructors RR and Serializable, six states each. Explanation and counter text returned for all 20 states.
- Initial Back and final Next reported aria-disabled=true. Buttons retain their DOM presence; disabled-end activation was not forced.
- Play becomes Pause. Enter on Next advances and stops playback. Replay starts from first state; Pause stops it. Next, Back via Enter and Reset via Enter returned expected counters. Both mode buttons worked and preserved current step for comparison.
- Full article entrance/flow and continuity reread completed. The root-owned structural check reports no relevant issues in `structure-check.json`.

No viewport/theme settings were changed by this writer. Reference tabs were closed after their study. The own preview tab was IAB tab 4.

## Browser transport interruption

A call at 23:50:45 UTC attempted waitForEvent('download'), clicked the experiment link and awaited downloaded.path(). It did not return, so root interrupted after more than 22 minutes. This was a tool transport failure, not evidence of a defective file. No viewport/theme QA action happened during that wait. The author will not repeat unbounded download-event/path waits.

After resumption the REPL had reset and rebinding the known IAB preview URL returned “Browser is not available: iab”. A single recovery inventory showed only Chrome; no Chrome tab was created and no user tab was interacted with. Root confirmed its own IAB access remained available, requested no more recovery, accepted transfer of the remaining author checks, and queued them after other active leases. No settings needed restoration from this writer. Root may close stale writer tab 4 if still present; the writer's binding is unavailable.

## Exact remaining owner checks

- 375 px layout in light and dark.
- Desktop light theme.
- Visual inspection of Serializable rejection and fresh retry drawing states.
- Keyboard focus retention/tab order in phone layout.
- Text alternative details open/close.
- Automatic timed advance (manual playback start/pause was checked).
- Reduced-motion behaviour was not emulated; shared stepper's source handles its hold bar, and no extra animation was added.

Root will complete missing author rendered QA and append its receipt before freezing the first article return. The writer does not claim these unchecked cases have passed.

## Download

The served file was instead checked with a bounded, read-only localhost HTTP request (10-second timeout). HTTP 200, attachment filename run-isolation.py, text/plain UTF-8 and nosniff. Exact 9,850 bytes match the final executed worksheet. SHA256 c38f5a137ef311a7813ed133b36e52c19e8751bf961c45229b302d9180654d0d. Full receipt: download-check.json.
