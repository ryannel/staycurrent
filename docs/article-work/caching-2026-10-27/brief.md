# Writing and teaching brief: application caching with Redis

Read this file, then the two reference essays, immediately before you plan or
revise an article. The point of reading them again is to have the standard in
recent memory while you write, rather than a summary of it.

- Bartosz Ciechanowski, [Gears](https://ciechanow.ski/gears/)
- Sam Rose, [Load Balancing](https://samwho.dev/load-balancing/)

Read the full text of both (`get_page_text` in a browser, or fetch the HTML).
Then open at least three of their demonstrations in a browser and use them, so
you know what the reader experiences, not only what the prose says. Do not copy
their text, structure or artwork. They are the bar for depth, teaching and
voice, not a template.

## The reader and the goal

The reader is an intelligent software engineer who has built applications that
talk to a database, but has never designed or run a cache. The collection's job
is to take them to expert practitioner: someone who can decide whether and what
to cache, design the read and write paths, choose expiry and eviction settings,
explain and prevent the classic failures, and operate Redis in production.

Optimise for useful understanding per minute of the reader's time. The subject
sets the depth. Go under the hood where the mechanism changes what a practitioner
decides (for example, how Redis approximates LRU explains why `maxmemory-samples`
matters). Stop where further detail would not change a decision. Do not pad an
article to match its neighbours, and do not trim a deep subject to match them.

## What the reference essays do, and why it works

These observations are what to imitate. Each comes with the reason it helps the
reader.

1. **A demonstration follows almost every idea.** In Gears, a new concept is
   introduced in a paragraph and the reader immediately sees it in motion,
   often with one slider. Load Balancing introduces each algorithm with a live
   simulation before any analysis. The reader forms the intuition by watching,
   so the following prose confirms something they already half-know. Expect a
   figure every few hundred words in the explanatory parts.
2. **Each demonstration isolates one variable.** The first Load Balancing
   simulation has one client, one server and a speed slider. The next changes
   only the request rate. Then only request cost varies. Gears holds the driving
   disc fixed and varies only the ratio of radii. Because one thing changes, the
   reader can attribute the effect to it. A figure that exposes every knob at
   once belongs at the end, as a playground, after the reader knows what each
   knob does.
3. **The prose tells the reader what to look for.** "Notice how...", "Watch
   this for a little while...", "If you pick a server that's strong, then make
   it weak, you should notice...". The text and the figure are one explanation;
   neither is decoration for the other.
4. **Start from something the reader already knows.** Gears begins with a desk
   fan and a wrench before angular velocity and torque. Load Balancing begins
   with one server dropping requests before naming round robin. Begin each
   article with a concrete situation the reader recognises from building
   applications, then name the concept once the reader can see the need for it.
5. **Terms arrive when they are needed, and are then used precisely.** Gears
   defines pitch circle, module and pressure angle exactly where the argument
   needs them, then never uses them loosely. Use the established industry term
   (cache-aside, TTL, eviction policy, cache stampede, hot key, hash slot) so
   the reader can search for it, and define it in plain words at first use.
6. **Simple derivations are shown, not asserted.** Gears derives the gear ratio
   by equating two velocities in three short steps. Where caching has a small
   piece of arithmetic that explains a behaviour (mean latency from hit ratio,
   database load from miss ratio, how jittered expiry spreads refreshes), derive
   it in a few lines and then let a figure show it.
7. **Visual vocabulary carries meaning across figures.** Load Balancing colours
   the words "request", "server" and "dropped" in the prose to match the
   simulation, so the text doubles as a legend. Shades of grey always mean server
   power. In this collection, the shared figure toolkit fixes these meanings
   across all articles; use them consistently and use the inline term
   component so prose words match figure colours.
8. **Honest about the model.** Load Balancing says its simulations ignore some
   real constraints and are set up to show particular properties. Say what a
   simulation leaves out, and keep illustrative models distinct from measured
   behaviour of a real Redis server.
9. **A plain first-person voice with momentum.** Short paragraphs, everyday
   words, one idea per paragraph, each paragraph leading into the next question.
   Occasional curiosity ("But what if I told you we could do even better?") is
   fine; showmanship is not.
10. **Surprises are earned and then explained.** Round robin has the best median
    latency but the worst tail; the article shows the chart, then explains why.
    Caching has many such results (a small cache can catch most requests; a
    longer TTL can make a stampede worse). Show the result, then explain it.

## House voice

- Plain British English. Ordinary words and short sentences. A reader should
  never need to decode a sentence.
- Every opening and every section lede states information with its reason. Do
  not open with a bare instruction or a slogan.
- Define every term at first use. Expand abbreviations (TTL: time to live).
- At most one flourish per section. No aphorisms or coined phrases standing in
  for an explanation.
- Address the reader as "you" and the author as "I" or "we", as the reference
  essays do.
- British spellings: behaviour, optimise, serialise, colour.

## Figures

The reader should be able to follow each article's main ideas from its figures
alone, with the prose making the understanding exact and connected.

- Prefer live simulations (requests moving, time passing, counters changing)
  where the idea is about behaviour over time: hit ratios, load, stampedes,
  expiry, eviction, failover. Use stepped figures (Play, Back, Next) where the
  idea is an ordered sequence: a race between two requests, a failover, a slot
  migration.
- One idea per figure; one or two controls in early figures. Controls must look
  like controls and be labelled with what they change.
- Use the shared caching figure toolkit in `src/components/caching/shared/`.
  It provides the simulation clock, play/pause/speed/reset controls, seeded
  randomness, the colour vocabulary, charts and the inline term component.
  Build article-specific figures from it in `src/components/caching/<slug>/`.
  Do not edit the shared toolkit; if it lacks something, extend it locally in
  your article's folder and report the gap.
- Refer to other articles only through `shared/ArticleRef.astro`, which links an
  article only once it is published and otherwise shows plain text.
- Each figure has a number, a title, a caption saying what is modelled and what
  is left out, and a text alternative ("What this shows, as text") that conveys
  the same result.
- Respect reduced motion: animations do not autoplay when the reader prefers
  reduced motion, and every result can be reached by stepping.
- Light and dark themes must both work, using the site's CSS variables. Check
  at 375 px width too.
- Numbers shown by a simulation are illustrative unless they come from a
  measurement you ran; say which.

## Technical accuracy

- Check every consequential claim about Redis against redis.io documentation,
  the Redis source on GitHub, or a primary paper. Record the source in the
  article's Sources section.
- When behaviour can be observed, observe it. A local Redis 8.10 server is
  installed (`/opt/homebrew/opt/redis/bin/redis-server`). Run it on a spare port
  with a temporary directory, never the default port 6379, and stop it when you
  finish. Keep the commands and output in
  `docs/article-work/caching-2026-10-27/evidence/<slug>.txt`.
- Redis has several time-based mechanisms: the LRU clock has one-second
  resolution, LFU counters decay per minute, active expiry samples a few times a
  second, and replication and failover use timeouts. A replay that sends a
  minute of traffic in a second hides all of them. Measure at realistic request
  rates and durations, or across a range of rates, and state the conditions.
  Earlier drafts drew wrong conclusions about eviction policies this way.
- This macOS build uses libc malloc, not jemalloc. Do not present its memory
  fragmentation figures as typical of Linux production servers.
- Redis and Valkey: say Redis throughout; note where Valkey or managed services
  differ only when it matters to a decision.
- Version-specific behaviour (I/O threads, client-side caching, functions,
  hash-field expiry, licensing) must name the version it applies to.

## Structure of an article

- Title and headings use established, searchable terms where they fit
  ("Cache stampede", "Write-behind caching", "Approximated LRU").
- An opening of two or three paragraphs: the situation, the question, and what
  the reader will be able to do by the end.
- Sections that build in order. Each section answers a question the previous one
  raised.
- A closing section that consolidates what the reader can now decide, and links
  forward to the next article where it continues the thread.
- A Sources and further reading section as the final `<h2>`.

## Calibration, not law

Gears is about 11,000 words with roughly forty demonstrations. Load Balancing is
about 3,000 words with about twenty simulations and charts. Articles here will
fall in that range according to what their subject needs. Use these numbers to
sense the density, not as targets.
