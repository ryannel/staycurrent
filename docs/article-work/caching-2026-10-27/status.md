# Status and continuation notes

Read this first after any context reset. It records where the commission stands
and what the orchestrator does next.

## Process per article

1. Fresh writer (default model) reads `brief.md`, both reference essays, the
   plan entry and the research dossier, then plans, writes, builds figures,
   gathers evidence and checks figures in a browser. Writes
   `articles/<slug>/writer-report.md`.
2. Two fresh reviewers in parallel, neither told about the other:
   - Teaching and writing review against the references and `brief.md`,
     reading the rendered page and using the figures.
   - Technical review against primary sources and a local Redis.
   Each writes `articles/<slug>/review-<kind>-<round>.md`.
3. Orchestrator merges findings; a fresh repair agent fixes them.
4. If repairs were substantial, a fresh reviewer re-reads the whole article.
5. Orchestrator checks screenshots, runs `pnpm build`, flips the entry to
   `published`, commits only this commission's files and pushes.

Never `git add -A`: the working tree holds unrelated user changes to the
relational collection. Stage explicit paths only.

## Prompt templates

`prompts/writer.md`, `prompts/review-teaching.md`, `prompts/review-technical.md`
and `prompts/repair.md`. Launch each agent with a short message telling it to
read its template and listing the variable values, so every round uses the same
instructions. Values per article: FILE and COMPONENT_DIR and SLUG_DIR are the
slug, or `introduction` for article 1; URL_SLUG is `<slug>/` or empty;
DOSSIER is the research group file (A: 1–3, B: 4, C: 5–6, D: 7–8, E: 9–10,
F: 11–12); PUBLISHED_CONTEXT tells the writer which earlier articles are
published and asks them to read those it builds on.

## Ports

Dev servers: writers use 4400 + article number; reviewers 4450 + article number.
Redis: 7100 + article number for writers, 7150 + article number for reviewers.

## State

| # | Slug | Research | Draft | Review | Published |
| --- | --- | --- | --- | --- | --- |
| 1 | (introduction) | A | done | final: publish | 3e3c4eca |
| 2 | caching-patterns | A | done | final: publish | 3e3c4eca |
| 3 | keys-and-values | A | done | final: publish | 3e3c4eca |
| 4 | expiration-and-eviction | B | done | final: fixed, verified | 7e348bea |
| 5 | invalidation | C | done | final: fixed, verified | c3b6a969 |
| 6 | stampedes | C | done | final: publish | c07149d8 |
| 7 | how-redis-works | D | done | final: publish | a09369a4 |
| 8 | clients-and-pipelining | D | done | final: fixed | 410cc517 |
| 9 | replication-and-persistence | | | | |
| 10 | cluster-and-hot-keys | | | | |
| 11 | operating-a-cache | | | | |
| 12 | designing-a-cache | | | | |

Scaffold and shared figure toolkit: built 2026-10-27, see toolkit-report.md. Not committed yet; commit with the first published article.

## Log

- 2026-10-27: writers started for articles 1, 2 and 7 (research groups A, C,
  D, E, F done; B pending). Toolkit decisions: draft figure scripts may appear
  as unlinked bundles in normal builds (accepted, as for reference articles);
  toolkit tests stay out of `pnpm test`.
- 2026-10-27: commission, brief and plan written. Redis 8.10.3 installed with
  Homebrew; Playwright 1.60 installed in the session scratchpad for screenshots.
- 2026-10-27: all six research dossiers done. `evidence/research-B.txt` contains
  some lines appended by researcher F after a shared helper script collided;
  B re-ran its figures cleanly. Researcher C could not reconcile Vattani's
  expected stampede size (e−1/e) with its own derivation (e): article 6's
  writer and reviewer must settle it from the paper. Map changes recorded at
  the end of plan.md.
- 2026-10-27: writers started for articles 3 and 4. Five writers now running
  (1, 2, 3, 4, 7).
- 2026-10-27: article 2 drafted (5,240 words, six figures); round-1 teaching
  and technical reviews started. Writer for article 5 started.
- 2026-10-27: article 1 drafted (4,100 words, ten figures); round-1 reviews
  started. Article 2 round 1: teaching 7 required/17 suggested, technical
  3 required/9 suggested; repair 1 started.
- Publication rule: drafts are uncommitted, so a half-written draft can break a
  local `pnpm build`. Before each push, build the commit in a clean temporary
  worktree (`git worktree add`), which contains only committed files, as CI does.
- 2026-10-27: article 1 teaching review: 6 required/16 suggested (in-text
  article references link to #collection; licensing belongs to article 11).
  Promoted `ArticleRef` to `shared/` and added it to brief.md. Article 3
  drafted (5,800 words, seven figures); round-1 reviews started. Writer for
  article 6 started.
- 2026-10-27: article 1 technical review: 3 required/10 suggested. Key
  finding for article 4 too: replaying traffic faster than one request per
  LRU clock tick (1 s resolution) makes Redis LRU look like random eviction;
  raising maxmemory-samples did not help. Article 4's reviewers must check any
  measured LRU comparison for this. Repair 1 of article 1 started.
- 2026-10-27: article 4 drafted (6,000 words, nine figures); round-1 reviews
  started, technical reviewer told to check the LRU clock artefact. Holding
  article 8's writer until article 7's finishes, to keep machine load down.
- 2026-10-27: article 7 drafted (5,100 words, nine figures, four static);
  round-1 reviews started. Writer for article 8 started.
- 2026-10-27: article 3 round 1: teaching 2 required/17 suggested (second half
  reads as a reference guide; strays into article 7), technical 3 required/9
  suggested (HSETEX rule; versioned keys need invalidation under every live
  version). Repair 1 started with instructions to cut and add figures; needs a
  fresh re-review afterwards.
- 2026-10-27: article 2 repair 1 done (Figure 4 rebuilt); fresh final review
  (prompts/review-final.md) started. Publish order: the introduction first,
  because the breadcrumb and collection home live at its URL.
- 2026-10-27: article 1 repair 1 done (figures renumbered); final review
  started. Toolkit extension agent started (additive only). Article 4 round 1:
  teaching 5 required/19 suggested, technical 6 required/9 suggested
  (measurements replayed too fast for the LRU clock and LFU decay; expiry
  speed overstated). Repair 1 started; will need a final review.
- Lesson for later writers and reviewers: time-based Redis mechanisms (LRU
  clock, LFU decay, active expiry, replication timeouts) must be measured at
  realistic rates or across rates.
- 2026-10-27: article 2 final review: publish, 0 blocking, 8 minor; minor
  polish started (sonnet). Article 7 teaching review: 8 required/15
  suggested (Figure 3 misleading, Figure 1 readouts lag). Waiting for its
  technical review.
- 2026-10-27: article 2 polished and ready to publish after the introduction.
  Article 7 technical review: 4 required/13 suggested (embstr rule for 8.x
  depends on cache-line size; Figure 3 probe artefact; fork pause scale).
  Repair 1 started; will need a final review.
- 2026-10-27: article 5 drafted (7,000 words, nine figures); round-1 reviews
  started.
- 2026-10-27: article 3 repair 1 done (8 figures, second half figure-led);
  final review started. Article 7 should mention the Valkey lazy-free default
  and the compact-hash/field-TTL interaction (handed over from article 3).
- 2026-10-27: introduction final review: 1 blocking (redis-py default retries
  made fail-open take 8–10 s); fixed and measured (<1 ms Redis stopped, about
  100 ms unroutable). Introduction and article 2 marked published in
  caching-collection.ts; field guide and homepage links added. Publishing waits
  for the toolkit extension agent to finish, since it is editing shared files.
  Screenshots are git-ignored in this folder (71 MB); text records are committed.
- Article 5 technical review: 5 required/19 suggested (failover can lose
  acknowledged deletes; tag-set race; generation lookup).
- 2026-10-27: article 3 final review: publish, 0 blocking, 9 minor; polish
  started. Collection-wide accessibility issue raised: grey request dots and
  green hit dots differ weakly under red–green colour-vision deficiency
  (ΔE 16–18). Once the toolkit extension agent finishes, a fresh agent should
  make the request/hit/miss glyphs differ in shape or lightness in shared
  tokens and scene rendering, then re-check every article's figures.
- Article 6 drafted (5,760 words, ten figures; XFetch expected recomputations
  e^(1/β)); round-1 reviews started.
- 2026-10-27: article 3 polished and marked published (push pending with 1
  and 2). Article 5 teaching review: 7 required/16 suggested; repair 1 started
  (cut 1,000–1,300 words; failover-lost deletes; tag-set race; monotonic
  reads). Needs a final review after.
- 2026-10-27: articles 1–3, scaffold and toolkit committed (3e3c4eca), built
  in a clean worktree (site check all OK, three caching pages only) and pushed.
  Toolkit extension done. Colour-blind-safe glyph agent started on shared files.
- 2026-10-27: articles 1–3 live (production check: 24 figures, no errors).
  Article 6 teaching review: 5 required/15 suggested (missing delete-on-write
  trigger; Figure 8 overlapping rebuilds). Article 8 drafted (7,200 words,
  eight figures); round-1 reviews started. Writer for article 9 started.
- 2026-10-27: colour-vision fix in shared toolkit: pending request is a smaller
  grey dot (0.65 of a hit's radius), hit tokens darker/lighter, stacked
  histogram second series hollow. Introduction prose updated. Article 8's
  ladder.mjs draws equal-size client/hit dots: fix in its repair. Article 7
  repair done; final review started.
- 2026-10-27: article 4 repair 1 done except the real-pace P1 check (about an
  hour at 400 requests a second); repair agent resumed to finish it. Article 8
  teaching review: 6 required/14 suggested (compare-and-set example lacks code;
  Figure 3 hides slow rows; missing ArticleRefs). Waiting for its technical
  review. Writer for article 10 started (ports 7110, 7195–7199, dev 4410).
- 2026-10-27: article 5 repair 1 done (12 required fixed; prose 6,713 → 6,013
  words; failover-lost deletes and atomic tag-set script added). Final review
  started (dev 4475, Redis 7175), asked to judge length directly.
- 2026-10-28: article 8 technical review: 4 required/12 suggested (library
  default retries double-apply scripts, MULTI and pipelines; retried SET can
  overwrite a newer write; pool-exhaustion waits; cjson). Repair 1 started
  (dev 4418, Redis 7118); needs a final review after.
- 2026-10-28: article 7 final review: publish, 0 blocking, 10 minor (Figure 1
  one-client rate disagrees with prose). Polish started (sonnet, dev 4427),
  including the Valkey lazy-free and compact-hash/field-TTL notes.
- 2026-10-28: article 5 final review: 3 blocking (Figure 1 lost-delete toggle
  contradicts prose; monotonic-reads claim wrong; EXPIRE GT never sets a TTL
  on a new tag set), 12 minor, 350–450 words cuttable. Repair 2 started (dev
  4415, Redis 7115); orchestrator to verify the three blocking fixes before
  publishing.
- 2026-10-28: the disk filled (ENOSPC; the machine had 484 MB free, almost all
  usage outside this commission). Article 7's polish and article 6's repair
  stopped early. Freed space by stopping three orphan dev servers (4399 ×2,
  4400) and deleting finished agents' scratchpad folders and published
  articles' review screenshots; 15 GiB free afterwards. Article 6 repair-1.md
  saved by the orchestrator from the agent's report, and its last cosmetic
  edit made. Article 7 polish resumed. Agents must stop their dev servers;
  check `pgrep -fl "pnpm dev"` for orphans at each publication.
- 2026-10-28: article 4 repair 1 complete: paced real-server check (400 a
  second, about 5 requests a minute per cached key) matched the model within
  0.6 points (LRU 17.7%, LFU 22.5%, LFU decay 10 27.1%). Final reviews of
  articles 4 (dev 4474, Redis 7174) and 6 (dev 4476, Redis 7176) started.
- 2026-10-28: article 7 polished (Figure 1 rate fixed at its cause in the
  model; Valkey lazy-free and listpackex field-expiry notes; 375 px badge
  shortened by the orchestrator) and marked published. Article 8 repair 1 done
  (retry table measured; IFEQ and Lua compare-and-set listings run on 8.10.3);
  final review started (dev 4478, Redis 7178).
- 2026-10-28: article 7 published (a09369a4), built in a clean worktree, live
  with 9 figures and no errors. Writer for article 11 started (Redis 7111,
  7181–7184, dev 4421).
- 2026-10-28: article 9 drafted (6,800 words, 11 figures; failover lost an
  acknowledged delete; restored snapshot resurrects a deleted value; detection
  31 s at Sentinel defaults). Round-1 teaching (dev 4459) and technical (dev
  4469, Redis 7159, 7185–7189, 26185–26189) reviews started.
- 2026-10-28: article 5 repair 2 done; orchestrator verified the three
  blocking fixes (Figure 1 with deletes lost: stale copy ends at expiry;
  monotonic reads now per-client version only; EXPIRE NX then GT checked on
  8.10.3) and marked it published. Article 4 final review: 2 blocking (Figure
  1 readouts carry over the previous TTL's copy; a model result reported as
  Redis), 8 minor; repair 2 started (dev 4414, Redis 7114).
- 2026-10-28: article 5 live (9 figures, no errors).
- 2026-10-28: article 6 final review: publish, 0 blocking, 10 minor, about 350 words cuttable. Polish started (sonnet, dev 4426).
- 2026-10-28: article 6 polished (10 minor fixes, about 350 words cut) and
  marked published. Shared sequence.mjs: notes now clear the step-number
  gutter at phone width (raised by two reviewers of article 6; affects all
  stepped figures, only moving left-edge notes right). Article 9 teaching
  review: 4 required/22 suggested (replica reads stale through primary loss by
  default; Figure 7 internal name; Figure 10 contradicts itself; Figure 2
  shared pages before a child exists). Waiting for its technical review.
- 2026-10-28: article 6 published (c07149d8), live with 10 figures, no errors.
  Article 8 final review: 1 blocking (redis-py reports a timed-out watched
  transaction as WatchError even with retries off, so WATCH loops re-run it),
  11 minor; repair 2 started (dev 4418, Redis 7118). Article 9 technical
  review: 3 required/9 suggested (Figure 11 verdict is a model result that
  reverses below about 380 reads/s capacity; everysec can lose acknowledged
  writes; MISCONF needs save points). Repair 1 started (dev 4419, Redis 7119).
- 2026-10-28: article 4 repair 2 done (Figure 1 drops the copy on a TTL change
  and counts from the next miss; model results labelled with pace; expiry
  cycle detail halved). Orchestrator changed "half a minute" to "a minute" in
  the Figure 1 instructions. Dev servers hot-reload pages while other agents
  edit, so figure checks before publishing use the clean-worktree build served
  statically. Article 10 drafted (6,860 words, 9 figures; toolkit gaps: text
  input, column chart, Choice-driven sequence, grid legend); round-1 teaching
  (dev 4460) and technical (dev 4470, Redis 7160–7166) reviews started.
- 2026-10-28: article 4 published (7e348bea), Figure 1 checked on the static
  build (30 s: 97%/97%, 19%/37%), live with 9 figures, no errors. Article 8
  repair 2 done (redis-py WATCH timeout reported as conflict reproduced 5/5;
  request-id marker remedy measured); marked published.
- 2026-10-28: article 8 live (410cc517, 8 figures, no errors).
- 2026-10-28: writer for article 12 started (Redis 7112, dev 4422).
- 2026-10-28: article 11 drafted (7,150 words, 5 figures; FLUSHALL blocking
  differs inside MULTI since 7.4; per-shard monitoring not covered). Round-1
  teaching (dev 4461) and technical (dev 4471, Redis 7167–7169) reviews
  started; teaching reviewer asked to judge figure density.
- 2026-10-28: article 10 teaching review: 3 required/16 suggested (Figure 1 hash ring bunches keys with FNV-1a on near-identical strings; Figure 5 prose contradicts the figure; Zipf s claim contradicts the introduction). Waiting for its technical review.
- 2026-10-28: article 9 repair 1 done (Figure 11 capacity slider shows the reversal near 380 reads/s; replica-serve-stale-data measured; durability claims corrected). Final review started (dev 4479, Redis 7175–7179).
- 2026-10-28: article 10 technical review: 5 required/16 suggested (ring hash skew; resharding table mixes windows; OPTIN covers only the next command; split counter under one hash tag relieves nothing; near caches need RESP3 and 7.4+). Repair 1 started (dev 4420, Redis 7120, 7195–7199).
- 2026-10-28: shared chart.mjs fix (b4eba068): line charts now clip at the
  plot edge instead of clamping out-of-range points, which bent lines (found
  by article 11's teaching review: a load line crossed capacity at 1,500 not
  300). All 8 published pages re-checked on a clean static build, no errors;
  article 4's off-scale spikes still draw correctly. Article 11 round 1:
  teaching 7 required/13 suggested (density; per-shard monitoring), technical
  4 required/13 suggested (client output buffers count against maxmemory;
  ACL breaks normal clients; libc fragmentation; CONFIG SET dir protected).
  Repair 1 started (dev 4421, Redis 7111, 7181–7184).
- 2026-10-28: article 9 final review: publish, 0 blocking, 10 minor (load-time figure from an overloaded laptop; Figure 11 wording), 300–350 words cuttable. Polish started (sonnet, dev 4429).
- 2026-10-28: article 10 repair 1 done (ring uses fmix32 over FNV-1a, 18% moved 4→5; new stepped atomic-migration figure; OPTIN, hash tags, RESP3 7.4+ fixed). Final review started (dev 4480, Redis 7190–7196), asked to judge the missing live hot-node simulation.
- 2026-10-28: article 9 polished (load time given as a range with conditions; Figure 11 wording names its metric; persistence-off stated; about 330 words cut) and marked published.
