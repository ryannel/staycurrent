# Sequential reading: Storage, The buffer pool, Watching storage (17 October 2026)

Uncued reader: backend engineer, MySQL at work and PostgreSQL on a newer service, new
to internals. Read the three built pages in order as text; interactive figures seen as
default step text and captions only. Full report returned to the coordinator;
consequential observations:

Contradictions
- Replay worst case: Storage says checkpoint distance is the worst-case replay;
  Watching says close to max_wal_size (nearly two intervals). Storage's sizing method
  understates by about half. Storage also lacks the trigger rule
  (max_wal_size / (1 + checkpoint_completion_target)) its "about half" depends on.
- Watching reports a 0.12 ms open_datasync flush on the same laptop Storage showed
  acknowledges flushes early, without saying it is that case.
- Two near-identical crash tests (566 MB / 3.35 s and 560 MB / 2.8 s) read as one run.

Repetition (ownership not held; Storage's opening promised to leave signals to Watching)
- Who writes dirty pages: all three. Checkpoint log line: annotated in Storage and
  Watching. Restart log: annotated twice. Log growth and retention: near-identical
  headings and content. Hit ratio and 25%/80%/O_DIRECT: all three. Old-version
  signals: Storage table and Watching section.

Storage
- Earned: commit path and measurements, group commit, choosing an interval, flush
  layers table, durability table, loss table, point-in-time recovery.
- Gaps: no passage says a checkpoint or eviction can write a page with uncommitted
  changes, so the versions section's premise arrives unsupported; "dirty" used before
  defined; the question after Figure 3 is separated from its answer by "Who writes a
  dirty page"; "two ways round the limit" sentence mismatched; full-page images
  counted before explained; MySQL decisions thin (redo capacity sizing, sync_binlog=0
  risks, flush_log_at_trx_commit=0 on process crash); no rough flush-time figures
  for server NVMe with PLP or network volumes.
- Not earned: table fill / VACUUM FULL / size functions in "Rows live in pages".

Buffer pool
- Earned: eviction figure, sizing knee, memory budget, warming and failover,
  hit-rate pitfalls ("half its requests would count as hits").
- Not earned: ring-size arithmetic paragraph; SQLite invalidation and mmap; chunk
  rounding. "Read one page per call" unexplained.

Watching storage
- Earned: every observed experiment table, the four incidents, "write=27.013 s looks
  alarming and isn't", "a run of checkpoints that recycle nothing".
- Not earned: restated hit-ratio material; duplicate checkpoint-line walkthrough.

Split: the buffer pool companion feels natural; Watching is natural in purpose, but
the boundary with Storage isn't held.
