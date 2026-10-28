# Polish after final review 2

Applied all 10 minor fixes and the suggested cuts. Not committed.

## Minor fixes

1. Load time: the snapshot section now gives about 0.55 s per million 100-byte keys on a quiet laptop and 2 to 5 seconds when it was heavily loaded, says it depends on hardware and value sizes, and gives "hundreds of milliseconds to seconds per million keys; measure yours". The closing bullet that repeated the "seconds per million keys" rule is gone. The 0.55 s run (the reviewer's) is recorded in evidence/replication-and-persistence.txt (E1G) and noted in Sources.
2. Figure 11: prose says "Counted in seconds above capacity, a replica promoted after 6 seconds is better, though the overload is deeper while it lasts: 2,000 reads a second, against the empty restart's peak of about 1,330". "Never worse than" is now "never meaningfully longer above capacity than". The figure's text alternative and its live verdict now name the metric ("the time above capacity is shorter than / longer than / about the same as with restarting empty at once").
3. Opening: the shop's cache runs with persistence off (`save ""`), as many caches do. The introduction also says Redis turns snapshots on by default but the measurement servers ran with persistence off unless a section says it turned it on.
4. Added a paragraph after the FAILOVER paragraph: `SHUTDOWN SAVE` for a single server before planned work, with its costs.
5. Figure 7: y axis domain raised from 0-14 to 0-24 so the failed-request line is no longer clipped.
6. Figure 4: the "Acknowledged, not on disk" readout and the lost count now count only acknowledged writes (new `ackedInCache` in aof-model.mjs; models.test.mjs updated to match).
7. Figure 5: legend now includes "Read" for the grey dots.
8. Full-sync buffering: now "on the replica since Redis 8.0 and then on the primary, up to `replica-full-sync-buffer-limit` and `client-output-buffer-limit replica` (256 MB each by default)".
9. Transparent huge pages: leads with the mechanism; Redis 6.2+ disables them for its own process (`disable-thp yes`); older versions or setting off: disable in the kernel.
10. Figure 9: the partition branch's first step ends "(This version follows the Sentinel documentation's example; I did not run it.)" and the caption now puts the partition sentence next to a statement that only the crash version's replies were observed.

## Cuts (about 330 words)

- The seven-bullet "you can now" list is replaced by two sentences (two questions to ask of any setup); the shop's resolution and forward link stay.
- The `everysec` slow-disk caveat is out of Figure 4's crash message and text alternative and the closing bullet; it stays once in the prose and once in the caption.
- Full synchronisation: dropped the 5-second diskless delay and the second connection since 8.0 (the 8.0 point now appears with the buffer limits).

## Checks

- `node --test src/components/caching/replication-and-persistence/*.test.mjs`: 11 pass.
- Rendered page re-read for every edited section; Figures 4, 5, 7 and 11 checked at desktop and 375 px (Figure 4 also with power cut under `no`: readouts 35 acknowledged, 0 left on disk, 35 lost). polish-screens deleted; dev server stopped.
- src/components/caching/shared/ untouched.
