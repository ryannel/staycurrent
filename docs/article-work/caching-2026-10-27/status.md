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
| 4 | expiration-and-eviction | | | | |
| 5 | invalidation | | | | |
| 6 | stampedes | | | | |
| 7 | how-redis-works | | | | |
| 8 | clients-and-pipelining | | | | |
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
