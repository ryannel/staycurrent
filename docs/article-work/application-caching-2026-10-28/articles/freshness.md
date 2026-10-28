# Freshness and invalidation — draft record

Completed the commissioned article and five figures on 28 October 2026. Status is
draft; no publication, build, preview server, independent review or commit was
performed by this writer. The coordinator owns integration, dense-prose checks
against the rendered page and rendered review.

## Inputs and reference reading

Read the write, figures and continuity skills, README, current site direction,
commission, frozen freshness plan, canonical coverage tree and shared example.
Read all 19 bounded reference parts separately using
`python3 scripts/read-writing-reference.py`, with at least 5,000 output tokens per
call and every END marker delivered: sequences 1–6, indexes 1–7, storage 1–6.
Inspected the coordinator's rendered reference captures for sequences figure 5,
indexes figure 3 and storage figure 5. The design follows their visible state,
one changed condition and adjacent explanation pattern.

## Draft and figures

- `src/articles/application-caching/freshness.astro` and `.meta.json`.
- `src/components/application-caching/freshness/` owns all five figures and styles.
- Figure 1 compares source-observation age with insertion TTL. Six option
  combinations cover delay 0/20/40 seconds and snapshot lag 0/15 seconds. It shows
  the remaining allowance and rejects a fill aged thirty seconds or more.
- Figure 2 replays the exact canonical late-fill order and allows deletion to be
  replaced by a revision 2 cache update. The shared stepper controls five states.
  A revision 1 card travels source → App A → cache, stays at App A through the
  concurrent commit and deletion, then visibly arrives last. This incorporates
  the user's nudge towards meaningful animation; reduced motion removes travel.
- Figures 3–5 draw the derived-list dependency, an outbox repair route and a
  complete authoritative-revision lookup respectively. They remain static because
  their relationships fit one view.
- Figure labels are paragraphs/divs, not headings. Phone layout stacks the cards.
  Interactive figures have text alternatives; visual position is redundant with
  the state labels and explanation. All colours use site tokens.

## Continuity pass

Reread the complete article, captions, controls and code as one reading path.
No changes to canonical example facts or new shared entities were needed.
North's P7 stays GBP 20.00/revision 1, then GBP 22.00/revision 2. The baseline key,
representation version v1, locale and currency are preserved. The under-GBP-21
list includes then excludes P7. P99 starts absent and may be created. Access
restrictions are introduced as a separate variant of the public catalogue.

The opening distinguishes age-limited display, read-your-writes and checkout.
The age section establishes the timestamp and source-snapshot assumptions before
invalidation relies on an age bound. It explicitly preserves age across cache
layers, accounts for replica lag and old transactions, and distinguishes local
monotonic time from a cross-machine time basis. Age is assessed at application
handoff to the response path, not at future browser display.

The race preserves the canonical order, including a successful deletion. Cache
publication and caller response are separate decisions. The revision-key design
retains a source lookup and reads payload/revision together on a miss; it covers
changed revisions between reads, absent source data, revision reuse and dependency
coverage. A current selector is not a promise that the source never changes later.

Optional child scope stays optional: no token or generation protocol is repeated.
The parent fully teaches expiry, invalidation repair, authoritative revision
selection and read-after-write source bypass. The misses article retains refresh
scheduling, coalescing and source admission. Checkout still requires its normal
transaction and stock checks.

## Source and execution evidence

Primary sources checked through browser retrieval on 28 October 2026:

- Redis SET/EXPIRE command documentation for insertion expiry and renewal.
- Redis keyspace notifications for Redis-only scope and disconnect loss.
- Scaling Memcache at Facebook, §3.2.1, for stale sets and invalidated fill tokens.
- Meta's Cache made consistent, linked for further reading on ordering and version
  metadata; no production figures from it are copied into this article.
- AWS Caching challenges and strategies and transactional-outbox guidance.
- PostgreSQL 18 Transaction isolation, especially Repeatable Read's earlier snapshot.

The native evidence is retained from `evidence/native-redis.json` and
`practice/cache_lab.py`: Redis 8.10.3, in-process Python source model, stale fill
with source revision 2/cache revision 1/TTL 30, and a 1.108-second delayed snapshot
rejected by a one-second local age check. This establishes neither replica
behaviour, distributed clock correctness nor a production race frequency.

`node --check` passed for age.mjs and race.mjs. No build or rendered success is
claimed. Coordinator checks still needed: desktop/375px, light/dark, every select
combination, all stepper buttons, keyboard operation, reduced motion, console
errors and dense-prose results. In particular inspect the moving revision card at
375px and the long revision keys in figure 5.
