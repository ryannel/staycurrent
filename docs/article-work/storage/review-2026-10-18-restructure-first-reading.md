# Storage and durability: first reading, 18 October 2026

**What I read:** the rendered page at http://localhost:4321/learn/databases/relational/storage/ on 18 October 2026, loaded in headless Chromium (playwright-core 1.62.1). I read the main text in order. For each of the ten figures I stepped through every state with Next, reading each step's narration and checking the visual state in screenshots at key steps. Where a figure has options, I tried each one. I checked that the internal links resolve but didn't read any linked page. I didn't open any source files, docs or review notes.

**Reader:** a backend engineer with three years' experience. I use PostgreSQL and MySQL through an ORM and know what transactions and COMMIT are. I've never learned how a database stores rows or survives a crash.

This is a reading in order, not an outline-first reading. The page shows its contents list after the opening, so I saw the section names before reading the sections.

---

## Before reading

The title is "Storage and durability", labelled "Deep dive, about 28 minutes", covering PostgreSQL 18 with InnoDB, SQL Server and SQLite comparisons. From that I expect to learn how rows are laid out on disk and what actually happens between my ORM calling `commit()` and the database replying. I'd expect an expert to be able to explain why commits cost what they cost, which settings trade safety for speed, and what a crash can take away.

## After the opening alone

**What it's about:** durability, the promise that a change survives a crash once COMMIT has returned. The running example is one UPDATE that changes P7's price from 20.00 to 22.00. That example arrived early, and it's small enough to keep in mind.

**What I can now explain, and which passage gave it to me:** the paragraph beginning "In most engines the answer has the same shape" gives me the whole model in four sentences. The row lives in a page, the page is changed in memory, a log record is flushed at COMMIT, the page is written later, and the log is replayed after a crash. The next useful fact comes from the line "a drive that takes 5 ms to flush, one client can commit at most 200 times a second". I could repeat that arithmetic now. It also tells me why my app's write throughput might hit a ceiling.

**Why it matters to me:** that commit ceiling, plus "tables grow and rarely shrink". I've seen a table's disk size stay high after deleting rows and didn't know why.

**Where the opening outran me:** "Some engines keep a table as a heap that indexes point into; others store the rows inside the primary-key index." I don't know what a heap means here. I noted it and moved on, and the Pages section answered it soon after. The closing line "Turning off the safeguards can corrupt the database" left me asking which safeguards. That's fine as a promise, and the final table answers it (fsync = off).

The opening is dense, but I finished it knowing the plan of the whole article. I didn't feel lost.

---

## Pages

**I expected:** what a page is and how rows sit in one.

- The first three paragraphs are clear. "To read one row, the engine reads the whole page that holds it" is the fact everything after it rests on, and it's stated plainly.
- **Figure 1 (rows filling pages).** It starts playing by itself when scrolled into view. With 100 B rows it has 154 steps, one per row. Stepping with Next is impractical, so you have to rely on Play or the slider. Watching pointers grow down and rows grow up was the most useful part, and that shows in the first five to ten rows. Switching to 2,000 B gave the clearest contrast: four fat rows per page. At that scale the line pointers are invisible, which is fine. **Variation I wanted:** a column with NULLs, since the caption says "The rows have no NULL values" and the table later mentions a null bitmap.
- A small puzzle that came back later: the 2,000 B option makes a row of about 2,028 bytes. A few paragraphs on, TOAST moves values out "once a row passes about 2 kB". So would the 2,000 B setting really stay inline? The later example deliberately uses 1,900 bytes, which suggests the author knows. A reader who notices will doubt one of the two.
- The ctid paragraph and query worked well. A real address, (12,3), that I could run myself. "A row can move within its page without its address changing" left me asking **why would a row move?** That's not answered. It's minor curiosity, not blocking.
- The index paragraphs: "PostgreSQL adds an entry to every index unless no indexed column changed and the new row version fits on the same page." The phrase "new row version" is used before row versions are taught. The opening's "a change never simply erases the old row" was just enough for me to follow it.
- **"What a row costs in each engine" table.** This is reference material. I skimmed the SQL Server and SQLite rows. I could check two figures: InnoDB's "at least 18 bytes" is 5 + 6 + 7, and 10 million rows ÷ 61 ≈ 164,000 pages ≈ 1.3 GB. I couldn't reconstruct SQL Server's 107 bytes without effort. The ten-million-row estimate is the part I'd actually use.
- **"Large values".** The table is dense again, but the paragraph after it pays off right away. SELECT * fetches a 50 kB description every time, while a price query never touches it. So does a 1,900-byte description that stays inline and makes a scan read fifteen times as many pages. That changed how I think about wide columns and about SELECT *. I wanted to know whether my ORM's default "select every column" is the thing being warned about. I believe it is, but the page doesn't connect the two.

## Buffer pool

**I expected:** the in-memory cache.

- Clear and short. The defaults (128 MB, 16,384 pages) are concrete.
- **Figure 2 (four slots).** This helped. Hit versus read is easy to say, but watching page 12 serve P7, P3 and P7 again made "a read brings in a whole page" concrete. The counters (2 shared hit, 5 shared read) line up with the EXPLAIN line quoted afterwards. **Question at the last step:** pages 31, 10 and 11 were each used once, so why is page 31 the one evicted? The narration says "a page that has been used little" and stops there. I'd have to guess at age or order. The further-reading list says a linked page covers how shared buffers chooses what to evict, so this is a fair place to link. A clause such as "the oldest of the least-used" would stop the question.
- "a recovered server can be correct and still slow until its working set is back". This is useful, and I didn't know it.

## Row versions and undo logs

**I expected:** MVCC, which I've heard named but never seen.

- The first paragraph motivates it well: a long report must still see 20.00, and a rollback must bring 20.00 back.
- **Figure 3 (PostgreSQL vs InnoDB).** This is the best figure so far. Watching both engines give the report 20.00, with the old copy waiting in a different place in each, taught me something I couldn't have got from one sentence. The R and Q markers make it easy to see who reads what. Switching engines and comparing is quick. **Variation I wanted:** a second update before the report ends. Would PostgreSQL keep three copies on the page, and would InnoDB chain two undo records? **Curiosity:** P7 was at (12,3). Does the 22.00 version get a new ctid, (12,4)? The figure shows it as a new line on the page, which implies a new address, but the earlier ctid paragraph and this one never meet.
- SQL Server and SQLite paragraphs: I skimmed these. **Where I tripped:** "In WAL mode a reader works from the log as it stood when its read began." WAL hasn't been introduced yet. I didn't know what WAL mode is at this point, and the sentence meant nothing to me until much later.
- **Table "Old versions live / What a long transaction costs / One thing to look at".** The middle column is the payoff for me. A long-running transaction makes PostgreSQL tables grow, and InnoDB can take ages to roll back. The last column gives me something to check (backend_xmin, history list length) even though I don't know those terms.
- **"Space reused, rarely returned".** This answered my opening question about tables that don't shrink. The fillfactor paragraph ties back to P7 and page 12 and to the index paragraph in Pages. That connection was satisfying: the free space is what lets the new version land on the same page without index entries.

## Dirty pages

- The definition is clear and uses page 12 in memory versus page 12 on disk.
- "the table files can contain uncommitted changes" surprised me and was important. "undone or hidden, using the old versions described above" works because the row-versions section came first.
- **Figure 4 (a database without a log).** This mostly repeats an easy sentence. That memory is lost in a power cut was said in the opening and again just before the figure. Five steps to show it cost me time without much return. The useful part is seeing that the table file still says 20.00, which sets up Figure 5. **New friction:** the figure labels each page with "page LSN 0/4F2A1C8". LSN hasn't been defined, and I didn't know what it was.
- "a page half-written when the power fails is part old and part new." I registered this as a problem the article will solve. I kept carrying it. See the torn-page note below.

## Write-ahead log

- **Figure 5 (with a log).** This helped, because the ordering is the whole point: log flushed, then the reply, then the page later. Step 1 says "The page's LSN now points past that record", and **LSN is still undefined.** It's defined in the second paragraph after the figure. So I met LSN three times as a label before learning what it is. Moving the one-sentence definition before Figure 4, or before Figure 5, would fix this.
- "Before a dirty page goes to the table file, the log up to that page's LSN must already be on disk." I accepted it, but I didn't know **why** that rule is needed. My guess: if the page hits disk with an uncommitted change and then the server crashes, there's no log to undo or hide it. The page doesn't say so. I supplied it from inference, and I'm not confident the guess is right.
- **"Who writes a dirty page" and Figure 6.** The prose was already clear: if the background writer falls behind, a query pays for a write. The figure confirms it with the same four slots from Figure 2, and that continuity is pleasant. It repeats the prose more than it adds. "Who does the writing matters more than how many pages are dirty" is a good takeaway.

## What COMMIT waits for and group commit

- The measured table is the most practically useful thing so far. I can now say: one client at about 190 commits a second, sixteen clients at about 1,570, and 10,000 rows in one transaction cost one commit. **That last row changes what I'd do.** Batch inserts in one transaction in the ORM instead of saving rows one at a time in autocommit. The page says "Batching is the application's choice". I'd have liked one more sentence saying that ORMs often commit per save.
- `synchronous_commit = off` appears in the table before it's explained, but it's flagged as coming later. That was fine.
- **Group commit explanation:** "nearly every commit arrives just as a flush starts, so each waits almost two". I had to read this twice and picture it. I didn't see why the commits would line up like that.
- **Figure 7 (commits sharing flushes).** This resolved the two-flush wait. Step 2's narration ("group A's new COMMITs have just missed it") is where it clicked. **Variations I tried:** 1 client gives 200 at 5 ms whether sharing is on or off. With 4 clients, sharing gives 400 and no sharing gives 200. With 16 clients at 0.2 ms, sharing gives 40,000 and no sharing gives 5,000. All of that made sense. **Variations I wanted but couldn't make:**
  - More clients (64, 256), to see where this stops scaling. The caption says processor time is ignored, so the model would keep climbing. I'm left not knowing what the real limit is.
  - A latency read-out. With sharing off and 16 clients, each commit must wait about 16 flushes. The figure only shows throughput, but latency is what my users feel.
- "A drive with a slow flush limits a write-heavy workload more than its raw bandwidth would suggest" is a good takeaway for picking cloud volumes.

## Log records, binary log, SQLite journal

- "Replaying a statement against whatever data happens to be there could give a different answer; replaying a page change gives the same page." This is short and clear.
- The binary log paragraph matters to me because I use MySQL. "Both logs are written at commit" left me asking how they're kept in step. That's answered much later, in the InnoDB settings part ("completes or rolls back each prepared transaction so that the two logs agree"). The delay was acceptable.
- **SQLite section:** this is a neighbouring subject for me. It's short, so the cost is low. **Apparent contradiction:** "WAL mode writes the content once instead of twice". The opening said "Every change is also written at least twice, once to the log and once to its page", and SQLite's WAL mode also copies pages back to the database file later. I think "once instead of twice" means before the commit, but as written it contradicts the opening.

## Crash recovery

- The LSN comparison paragraph is very clear: if the page is older, apply the record; otherwise skip it. Now that LSN is defined, everything earlier makes sense in hindsight.
- Checkpoints are explained well, including the trade-off between more frequent checkpoints and more page writes.
- **A sentence I couldn't parse:** "…InnoDB and SQL Server move the position forward continuously. Checkpoints, torn pages and the log sizes that trade." In the rendered page, "Checkpoints, torn pages and the log" is link text. Read aloud, the sentence has no verb I can find. Later, "Reading a restart goes through that log line by line, and Checkpoints, torn pages and the log through restart time in each engine" has the same problem. Two article titles used as sentence subjects, with a gapped verb, made me stop and re-read.
- **Figure 8 (power fails at three moments).** This was the most valuable figure. Before COMMIT: the app never sent COMMIT, so the loss is fine. Before the flush: the change is lost and the app sees a dropped connection. After the flush: the change is kept and the app also sees a dropped connection. The steps that show the page LSN 0/4F2A1C8 being older than the record, and then moving to 0/5000148, are where LSN finally became concrete for me. The text after it says the punchline plainly: "the same whether its change was kept or lost." **My immediate question:** what should my application do about that dropped connection? Retry and risk a double charge? The page gives no answer here. It answers about 40 paragraphs later, in the last section, with a link to "Handling conflicts and uncertain outcomes". I would have wanted that one-sentence pointer right here, where the question arose.
- **Unfinished transactions:** clear. "Killing the process doesn't help: the rollback starts again on startup" is practical.
- **Recovery time:** the measurement is good, and so is the caution to treat it as a ceiling. **Torn pages:** "full-page images, copies of whole pages that PostgreSQL logs the first time each page changes after a checkpoint" is the first hint of how the half-written page from the Dirty pages section gets fixed. The article never connects the two. The next section then says "Damage that is not a tear", which assumes I know what a tear is. **The held question was never answered on this page:** "a page half-written when the power fails is part old and part new — then what?" The answer is pushed to a link. I think this belongs here. The page raised the problem itself, as one of two reasons to use a log, and the mechanism takes two sentences: log a full copy of the page on its first change after a checkpoint, so replay can restore the whole page.
- "What recovery cannot repair": a good, short list.

## fsync and drive caches

- Clear. **Figure 9 (the flush path).** The contrast between "honours" and "ignores" is the point, and the end state of the second option ("nowhere / yes / COMMIT … the acknowledged commit is lost") is striking. It mostly restates the paragraph before it, but the final frame earns its place.
- "On a virtual machine or a network volume, the guarantee is whatever the provider documents." This is what I needed: I run on managed cloud volumes. I wanted to follow the link on how to test a volume. The page gave enough for me to know I should ask, but not how to check.

## Asynchronous commit

- "Because it prefers to write whole pages when busy, the longest risk window is three times that delay." I couldn't follow why "prefers whole pages" leads to "three times". I accepted the number on trust.
- **Figure 10:** its caption says it's the same model with one setting changed. It repeats an easy sentence ("the reply came before the flush"). I learned nothing from it that the paragraph didn't already give me. It could go, or it could be folded into Figure 8 as a fourth moment.
- **InnoDB table:** very clear, and this is the setting I'd actually look up on our MySQL servers. The note that value 2 survives a mysqld crash but not a power cut is a distinction I didn't know.
- **sync_binlog part:** the two failure directions are clear.
- **"Choosing what may be lost"** table: directly actionable. "Unlogged tables" appears here for the first time without explanation. The final table explains it, which is late but acceptable.
- **"What else a relaxed commit changes":** "a second transaction can read 22.00 and act on it … a crash a moment later brings back 20.00." This was a real insight. I'd have assumed asynchronous commit only risks my own transaction.

## What can lose a committed change

- The summary table gathers everything, and it's what I'd bookmark. It repeats earlier material, but this is the right place for that.
- The dropped-connection paragraph finally arrives here, with its link. See the note under Figure 8.
- The last paragraph, saying durability faithfully keeps a mistaken DELETE, is a good closing reminder.

## Where the numbers come from

- Honest and short. The macOS note (a plain flush acknowledged early, about 25,000 commits a second) is an example of the "drive that lies" problem on my own laptop. It might be worth a mention up in the fsync section.

---

## Where I was lost or holding too much in mind

1. **LSN used before it's defined.** It's a label in Figure 4 and in Figure 5 step 1, and it's defined only after Figure 5. This slowed me and was resolved later. The smallest fix is to move the one-sentence definition before Figure 4. To recheck, a new reader should be able to say what "page LSN" in Figure 4 means when they first see it.
2. **WAL mode in the SQLite row-versions paragraph,** before WAL is taught. This slowed me and was resolved later.
3. **The group commit "almost two flushes" prose** made me picture timing in my head. Figure 7 resolved it, so the order was fine, just effortful.
4. **The torn page question,** raised in the Dirty pages section and never answered on the page. This was the one place I carried a question to the end. The consequence is that I can't explain the second of the two reasons the article gives for having a log.
5. **Link titles used as sentence subjects** ("Checkpoints, torn pages and the log sizes that trade"). These stopped me twice.

## Where a figure helped and where it repeated

- **Helped most:** Figure 3 (versions in two engines), Figure 7 (group commit, with real variation), Figure 8 (three crash moments), Figure 2 (hit and read).
- **Helped a little:** Figure 5 (ordering), Figure 9 (the final frame).
- **Repeated an easy sentence:** Figure 4 (memory is lost), Figure 6 (who writes; the prose already says it), Figure 10 (asynchronous commit; the caption admits it's the same model).
- **Cost in operation:** Figure 1 has 154 steps at 100 B and starts playing by itself. The idea is visible in the first ten rows.

## Where I wanted to follow a link

- **How shared buffers chooses what to evict** (Figure 2). The page gave enough without it.
- **Torn pages** (Checkpoints, torn pages and the log). The page didn't give enough. See above.
- **Testing a volume's flush honesty.** It gave enough for me to know I should ask, not how to check.
- **Handling conflicts and uncertain outcomes.** I wanted this at Figure 8, and it arrived only at the end.
- **The buffer pool companion article,** for sizing. The page gave enough for this article.

All the internal links I checked resolve (HTTP 200).

## At the end

**What I can now predict or decide that I couldn't before:**
- Roughly how many single-row commits a second a given flush latency allows, and why many clients get more total throughput but slower individual commits.
- That batching rows into one transaction removes most of the commit cost, so I should look at how my ORM commits.
- That a long-running transaction or report bloats PostgreSQL tables and slows InnoDB rollback, and that deleting rows doesn't shrink the files.
- That wide columns kept inline slow every scan, and that SELECT * pays for out-of-line values every time.
- That a dropped connection during COMMIT is genuinely ambiguous.
- What `innodb_flush_log_at_trx_commit` = 2 versus 0 risks, and that `synchronous_commit = off` can be set per transaction for counters.
- That a cloud volume's flush guarantee is whatever the provider documents, and that my laptop's plain fsync isn't honest.

**What I'd still get wrong:**
- How a half-written (torn) page is recovered. I'd guess at "full-page images" from one passing sentence.
- Why the log must reach the disk before the page does (the WAL rule). I can state it but not justify it.
- Where group commit stops scaling in practice.
- Why PostgreSQL's asynchronous-commit window is three times the writer delay.
- Which page the buffer pool evicts when several pages have been used equally.

## Overall

This is a long article that mostly earns its length. The running P7 example holds the whole thing together. Figures 3, 7 and 8 teach things I couldn't have got from the prose. The tables comparing four engines are the main time cost for someone who only uses PostgreSQL and MySQL. I skimmed most of the SQL Server and SQLite rows. Nothing stopped me following the argument. Several things slowed it, most of all LSN arriving after its first uses. One question the page raised itself, torn pages, is left to a link. Three figures (4, 6, 10) mostly restate a sentence I already had.

### Observations versus repair ideas, in order of what's at stake

1. **Torn page left unanswered.** *Trigger:* "a page half-written … is part old and part new". *Consequence:* the second reason for a log is never explained, and "not a tear" later assumes it was. *Smallest change:* two sentences in Crash recovery or Recovery time linking full-page images to the half-written page. *Recheck:* can the reader say how recovery fixes a torn page?
2. **LSN before its definition.** *Smallest change:* define it before Figure 4. *Recheck:* the reader understands Figure 4's label on first sight.
3. **Dropped-connection consequence far from Figure 8.** *Smallest change:* one sentence after Figure 8 pointing to the retry article. *Recheck:* the reader knows where to go next at the moment they ask.
4. **Link titles as sentence subjects.** *Smallest change:* rewrite as "…, as Checkpoints, torn pages and the log explains." *Recheck:* the sentence reads aloud.
5. **SQLite "once instead of twice" against the opening's "at least twice".** *Smallest change:* say "before the commit". *Recheck:* no apparent contradiction.
6. **Figures 4, 6 and 10 repeat easy sentences.** These cost time without return. Consider dropping one or more, or folding Figure 10 into Figure 8. *Recheck:* the reader loses nothing they needed.
7. **Figure 1's 154 steps.** Consider fewer, coarser steps. The idea shows in the first ten rows.
8. **Small curiosities:** why page 31 is evicted, why a row moves within its page, whether the new version gets a new ctid, the "three times the delay" reasoning, and whether 2,000 B rows would stay inline. Each is a clause or a link, not a section.
