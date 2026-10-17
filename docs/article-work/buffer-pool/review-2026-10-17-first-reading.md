# Buffer pool: reviews, 17 October 2026

Two independent reviews of the first full draft, condensed. Each finding is followed by what was done about it.

## Uncued first reader

What the reader could now do: pick starting sizes for all three engines and budget the rest of memory; explain why a PostgreSQL restart is mild and a reboot or failover is not; set up pg_prewarm and InnoDB dump/load; recognise a report that floods the pool, including through an index plan; stop over-trusting one hit-rate figure.

What the reader still couldn't do: estimate their own working set; judge what read rate the storage can take; explain the 94-page ring leftover.

Passages that worked: the working-set idea stated plainly; the evidence for the second cache; "a plan change ... can change what a report does to everyone else"; the 50%-on-every-lookup example; "every pool fills up". The figure explained the clock sweep better than the prose.

Findings and repairs:

1. **94 pages after a 32-page ring.** Not explained. *Repair:* ring sizing explained from `freelist.c` and `bufmgr.c`. The ring is 256 kB plus room for asynchronous reads, capped by the per-process pin limit: the pool divided by about 174 process slots with default settings. That cap gives 32 buffers at 16 MB and 94 at 128 MB. Added to evidence.
2. **4 + 768 against 771 pages.** *Repair:* each scan makes 772 requests, the table's 771 pages plus the schema page. Stated in the text.
3. **18,093 reads against 14,815 table pages; 507 against 501 prewarmed blocks.** *Repair:* a clause each. The first is the table's pages plus nearly all 3,279 index leaves. The second is the shop's 501 pages plus six other cached pages, mostly system catalogs.
4. **Clock mechanism stated abstractly.** *Repair:* the prose now says report pages enter at count 1 and must themselves be passed once before they can be evicted, so each pass of the hand lowers the shop pages by one.
5. **P7 undefined for a reader entering directly.** *Repair:* defined as one of the shop's products.
6. **Midpoint figure.** W1's position was unstated, and the caption read as reuse. *Repair:* the intro places W1 in the young sublist, and the caption is reworded as the promotion assumption.
7. **"Restarting MySQL with O_DIRECT leaves nothing useful behind" contradicts dump/load.** *Repair:* scoped to the operating system's cache, with a pointer to the dump/load section.
8. **The long midpoint sentence.** *Repair:* split.
9. **Headings.** "The working set and the knee" and "Changed pages in the pool". *Repair:* both renamed, and the dirty-page section's opening says why it sits there.
10. **No concrete way to estimate the working set, and growing `shared_buffers` needs a restart.** *Repair:* added a usage-count method, verified in `e4.sql`/`e4.out`, the OS-cache read-time check, and InnoDB's online resize and young/not-young rates.
11. **No way to judge what the storage can serve.** *Repair:* provisioned IOPS, fio, and read latency as the better signal.
12. **PostgreSQL hit-ratio formula missing; `work_mem` jumps from 4 to 32 MB.** *Repair:* formula given next to the counters, and the 32 MB is explained as a typically raised value.

## Technical and editorial reviewer

Every measured figure was checked against the outputs; all matched except item 9. The modelled table and warm-up arithmetic check out.

1. **3.5 µs a page doesn't show an OS-cache hit.** With PostgreSQL 18's asynchronous I/O and combined reads, the time measured is waiting, about 28 I/Os, which a local NVMe drive could also serve. *Repair:* re-run with `io_method = sync` and `io_combine_limit = 8kB`, one read call per page (`e5.sql`/`e5.out`). 444 reads took 0.96–1.27 ms, 2–3 µs each, well below a drive's read latency. Also dropped "read them seconds earlier". A cold-cache contrast needed `sudo purge` and wasn't run.
2. **O_DIRECT wording contradicts dump/load.** Same as first reader 7.
3. **Autoprewarm doesn't run at promotion.** *Repair:* said so.
4. **Hash operations may use `work_mem × hash_mem_multiplier` (2.0).** *Repair:* added, and the arithmetic caveated.
5. **Huge pages need an OS reservation.** *Repair:* says that `try` falls back silently and names `shared_memory_size_in_huge_pages`.
6. **The "page requests, not queries" bullet contradicts itself at 50%.** *Repair:* reworded as a mix with cached queries. InnoDB's three requests are noted.
7. **"Bad plan can be slow at 99.9%" sits in the wrong bullet.** *Repair:* moved.
8. **Clock pass count off by one.** *Repair:* a page used once survives one pass and leaves on the next.
9. **500, not 501, shop pages survived the first scan.** *Repair:* corrected to match e2.out.
10. **PostgreSQL write-on-eviction usually lands in the OS cache.** The checkpointer's role was also misdescribed. *Repair:* both fixed.
11. **Ring dirty-page wording.** *Repair:* reworded to what PostgreSQL chooses.

Smaller points:

- **SQLite.** Cache discarded under frequent writers: added. Default is a compile-time setting: added. 64 MB × 20 is a ceiling: added.
- **PostgreSQL "too large" signal.** *Repair:* `buffers_unused` added, and the usage-count heuristic reworded.
- **InnoDB scheduled dump for crash safety.** *Repair:* added.
- **MySQL replica failover.** *Repair:* one sentence added.
- **Editorial.**
  - Trimmed the "turns it into" endings and the roadmap sentence.
  - Replaced announcements with content.
  - Moved the model and table under the knee subsection.
  - The warm-up's 16 GB is tied to the 64 GB host.
