# First review: caching and CockroachDB prose independence

Reviewed 30 October 2026 against the user's explicit requirement: diagrams and
animations are optional reinforcement, and removing them must leave the prose's
explanation complete. This is an independent editorial/teaching review of the
current article sources, before repairs. No article or skill was edited. All 19
assigned articles were read completely, including in-source figures, tables,
code, captions and sources; clipped reads were recovered. Imported figure
wrappers and the caching replay's labelled assumptions were consulted to locate
missing context. This is a prose review, not a browser operation/accessibility
check or a renewed technical execution audit. Line locations refer to baseline
sources; a table or code example that directly presents reference data is not
automatically treated as an optional animation.

## Overall judgement

The concern is supported. The strongest problem is not repetition alone: several
caching passages discuss numerical outcomes whose input workload exists only in
an animation. Removing the picture leaves an explanation with missing premises.
There are also many instructions to watch, switch, step or compare a particular
frame. CockroachDB articles usually establish more of their causal reasoning in
prose, but figure-only actors and omitted intermediate outcomes remain.

A repair should develop the subject and worked case in ordinary prose first,
with diagrams supporting that same explanation. Merely deleting “Figure N” or
replacing it with “this example” will not repair missing premises. The existing
qualifications separating models from native observations must survive.

## Application caching: 9 of 9 complete reads

### index.astro — repair

- **Medium, lines 17–23, 45–51, 77–95:** the introduction repeatedly describes an
  animation: “Figure 1 follows one request”, “Watch the cache-miss counts”, “Watch
  the interval”, and “Figure 5 shows the same four arrivals”. Much of the actual
  mechanism is present, but the explanation is organised around numbered runs.
  Develop miss/fill/hit, the two-server example, invalidation order and burst
  coalescing as subject explanations that remain connected without the figures.
- **Medium, lines 109–111:** “Here, the cache removes the least recently used
  card” assumes the figure establishes the example's residents and access order.
  Either give a short independent access example or explain LRU without claiming
  a particular victim has already been identified.
- **Medium, line 83:** “The successful sequence in Figure 4 contains no
  overlapping read” qualifies a depicted run, rather than explaining the
  concurrency boundary directly. Keep the important late-fill risk and state
  the assumed non-overlapping case in prose.
- No new engine claim is needed: the cache-aside and eviction sources already
  listed support the existing mechanisms. Preserve checkout authority and the
  distinction between insertion TTL and source age.

### cache-benefits.astro — substantive section rewrite

- **Medium, lines 26–29:** “Five requests found usable answers among eight
  lookups” supplies a result without supplying the request sequence or retention
  assumptions. The trace is in Figure 2. Explain the repeated/missing requests
  in prose, or replace this with a completely stated small example.
- **Medium, lines 38–46:** “these twenty requests”, “initial fixed costs”,
  “Choose nineteen hits” and “Now choose the cheaper source” refer to controls
  and values established only by Figure 3. The prose uses C=2, S=20 and W=3 to
  derive a 21.7% threshold without explicitly naming all those costs first.
  Rebuild the whole subsection around stated costs and two stated hit mixes;
  connect the mean and nearest-rank percentile calculations to those premises.
  The figure may then compare them optionally. Preserve the distinction between
  elapsed request time and accumulated source work.
- **Medium, lines 53–55:** “Watch the copies diverge” and “After A's copy expires”
  need a prose setup with independently timed local copies. Explain why expiry
  on A does not expire B's entry, rather than referring to a playback event.
- The later workload experiment and decision sections otherwise stand alone.

### cache-keys.astro — focused repair

- **Medium, lines 75–79:** “those different requests become the same bytes”
  follows the encoding figure, but the prose supplies no concrete colliding
  fields. Show two distinct tuples whose naive colon join has identical bytes,
  or explain the ambiguity without referring to a demonstrated collision. Keep
  the validated baseline identifier domain separate from this variation.
- **Low, lines 43–45:** “Each field prevents…” can work from preceding context,
  but giving the full example key in this section would remove reliance on the
  anatomy illustration and tighten continuity with the introduction.
- Permission, representation, negative caching and design tests have adequate
  prose reasoning; tables and code are explicit reference material.

### cache-memory.astro — substantive section rewrite

- **Medium, lines 14–19:** “Loading the whole catalogue would save no more work
  in Figure 1” makes the conclusion conditional on unseen requests. State the
  assumed active products and unused catalogue entries, or make the general
  working-set distinction without a figure-run assertion.
- **Medium, lines 49–71:** the retention discussion depends on the replay for
  the memory budget, entry sizes, catalogue scan, request order, policy settings
  and source costs. “Refusing the catalogue result preserves the two favourites”,
  “In this trace”, “The spoon and bowl then compete” and the default 50/94 result
  have no complete non-figure setup. The replay's removable details contain the
  assumptions: 18 sequential requests, 1 KiB cards, 3 KiB catalogue, 3 KiB default
  capacity/entry limit, source costs 2 except bowl 12 and catalogue 20, no
  concurrent fills/updates/expiry/failure. Rebuild the example in prose, and keep
  the input trace or a compact standalone table as article content if exact
  replay totals remain important. Explain each policy's changed outcome through
  those premises, not through a tour of controls.
- **Medium, lines 104–112:** the capacity comparison and policy totals reuse
  that unintroduced trace. State what is held fixed and why extra room cannot
  avoid a first read. Changing only the phrase “Figure 4's model” is insufficient.
- Native memory/refusal guidance is independently explained. Keep the exact
  illustrative/observed distinction and the source-capacity versus retention
  admission distinction.

### cache-misses.astro — repair

- **Medium, lines 13–15, 21:** fast/slow and “Share one fill” are playback cases.
  The stampede's basic order is sound in prose, but write the contrast as a
  source completion before/after later arrivals rather than an animation choice.
- **Medium, lines 38–43:** “Between 90 and 120 ms, both source reads run” assumes
  Figure 3 introduced when A's lease expires and B takes over. Establish that
  order and the two end times before deriving overlap. Keep owner-checked
  publication/release separate from cancellation of old source work.
- **Medium, lines 64–69:** the “faster case” and “200 ms run” depend on the
  figure's arrival, deadline and queue settings. Give a self-contained worked
  source-budget case: two active slots, callers' deadlines and queued remaining
  time versus execution duration, then the outcome when reads take longer.
- **Low, lines 98/102:** “recreates Figure 5” and “Keep the failures from the
  figures” point back to images instead of named workload/failure cases.
- Coalescing cleanup, waiter budgets, source accounting and cache-outage
  behaviour otherwise have substantial independent prose and should be retained.

### freshness.astro — mostly sound explanation; remove frame-led scaffolding

- **Medium, lines 65–75:** “The next drawing shows…” hands the reader to a
  figure before the late-fill sequence. The following prose does eventually
  state the essential old-read/commit/delete/late-fill order. Make that order a
  continuous worked explanation before the optional illustration, retaining the
  difference between a known ordering and a freshness guarantee.
- **Low, line 90:** “does not stop Figure 2's delayed fill” should refer to the
  explained delayed-read race. Other age, revision, outbox and dependency
  reasoning remains understandable without playing animations.
- The removal test therefore does not justify rebuilding the entire article;
  repair the narrative connections while preserving the developed argument.

### operating-caches.astro — mostly sound; focused removal of figure framing

- **Medium, lines 56–58:** “Figure 3 follows the deletion” followed by “The old
  cached value has returned” relies on the animation for the exact failure
  order. Explain that a primary accepted the delete but failed before its
  asynchronous replica received it, and the promoted copy still holds the old
  card. Preserve the explicit alternative revision/age validity decisions.
- **Low, line 87:** the operating decision “turns Figure 4” into a record. Give
  the v2 trial's illustrative traffic and source allowance as the worked record
  directly, without requiring the reader to recognise an animation run.
- Measurement, diagnosis, namespace rollback and cold recovery have strong
  independent prose. Keep the source work/outcome distinctions.

### redis.astro — substantive removal test passes; one wording improvement

- The lookup, decode, admission, optional fill, deadlines, invalidation and
  uncertain-outcome reasoning is present in prose and explicit code. Removing
  the three StoryFigure animations loses no required step or explanation.
- **Low, line 73:** “This outline of the successful path…” currently follows
  an animation and precedes code. Introduce the code's intentionally simplified
  scope directly so the sentence does not appear to refer to a removed diagram.
- Retain the documented native/client evidence and its limitations. No broad
  rewrite is supported solely by this review.

### versioned-fills.astro — focused repair

- **Medium, lines 73–77:** after “the source has changed, but the cache still
  holds the reservation”, the diagram supplies the actual old-result publication.
  “The token did exactly what we asked” then evaluates an event not stated in
  the body. Say explicitly that the old reader can publish revision 1 with its
  matching token before the delayed invalidation arrives, and why that is
  compatible with the narrower guarantee.
- Revision knowledge, reservation-before-read, atomic conditional replacement,
  missing-token refusal and restored-state dangers are independently developed.
  Keep those distinctions; this does not warrant duplicating every visual state.

## CockroachDB: 10 of 10 complete reads

### crdb-architecture.astro — repair visual narration and one missing setup

- **Medium, lines 16–18, 31–33, 48–51, 61–63:** the reader is repeatedly told to
  follow a figure, watch roles or distinguish applied price. Most underlying
  definitions are present. Establish the concrete gateway/serving-owner example
  directly and develop the read, index lookup, agreement and LSM explanations
  as connected prose rather than introductions to figure runs.
- **Medium, lines 99–101:** the “left range” and “right” after a split have no
  stated key boundary in prose. Give the keys on each side and the independent
  serving ownership, then explain why concentrating demand on P7 defeats that
  distribution. Keep model assumptions about membership and durable history.
- The purchase outcome, distinction between transaction and per-range agreement,
  local storage and native range evidence are otherwise independently explained.

### crdb-backup.astro — focused repair

- **Medium, lines 13–16:** “move the cut”, “Watch…” and “every cut shown” turn
  restore-point reasoning into playback narration. The body already supplies the
  critical price-mistake/payment history. State both recovery choices and their
  obligations directly; the diagram can then reinforce them.
- **Medium, lines 32–34 and 48:** “Remove B while keeping C” and “Having A and B”
  use figure-only names. Name the full backup and successive increments in the
  prose before explaining a missing dependency, or use descriptive names.
- **Low, line 104:** the provider comparison should be an explicit case
  distinction instead of an instruction to compare Figure 3.
- Restore scope, validation, reconciliation and retained-stock reasoning pass
  the removal test. Preserve the observed revision-history-default discrepancy
  and native drill's limits; do not smooth those away during prose repair.

### crdb-locality.astro — substantive explanation passes; framing repair

- **Medium, lines 35–39 and 122–128:** “Compare the North and West gateways” and
  “Remove West zone 1, then West region. Change…” ask the reader to operate
  illustrations. The actual homes, voters and majority arithmetic are already
  stated in body text. Explain the North/West request paths and the zone/region
  loss cases directly instead of referring to actions on controls.
- **Low, lines 51 and 152:** describe the illustrative versus observed scope
  without making “the drawing shows…” and figure numbers the only handles for
  particular placement claims.
- Row homes, remote stock/uniqueness, GLOBAL write costs, survival limitations,
  policy checks and actual acceptance cases remain coherent without diagrams.
  Broad technical restructuring is not needed for this concern alone.

### crdb-migration.astro — substantive explanation passes; framing repair

- **Medium, lines 24, 52 and 94:** “Follow the two identities”, “Step to the last
  stage and compare…” and “Figure 3 keeps…” narrate the figures. The purchase,
  request/outbox identities, consistent copy and authority-transfer obligations
  are all explained later in prose. Lead with those subject transitions and
  state the old source's stale stock/order facts directly.
- There is no evidence here of a missing migration mechanism that needs an
  article-wide rewrite. Keep source closure, retained work, reverse compatibility,
  provider uncertainty and the native/insecure-fixture evidence limitations.

### crdb-operations.astro — substantive local repair

- **Medium, lines 159–163:** after a generic three-voter explanation, “The extra
  healthy machine D” and “both B and C missing” assume Figure 3 introduced the
  original A/B/C voters, lost member and D learner. Establish that configuration
  in body text before deriving when D can vote and why copying cannot replace a
  missing old majority. It is a core membership-safety example, not mere polish.
- **Low, lines 14, 108, 199, 217:** watch/change-context instructions and figure
  descriptions interrupt otherwise independent security and maintenance prose.
  State the query/context case and verified removal sequence directly.
- TLS, roles, RLS trust, capacity accounting, drain versus decommission and final
  membership checks are already independently developed. Retain the difference
  between illustrative IDs and verified native IDs.

### crdb-performance.astro — substantive aggregation repair plus framing

- **Medium, lines 114–118:** the report result and benefits of partial aggregation
  are named, but the actual splitting/combining example lives in Figure 3. Give
  the two processors' partial contributions (Mina 4.50 and 35.00, Tariq 40.00),
  show why Mina's values must combine, and explain when reducing lines to partial
  totals lowers movement. This should read as the mechanism, not a caption tour.
- **Medium, lines 145–161:** A/B/C order labels and “The drawing makes the
  choice concrete” tie the hashing example to its visual ordering. State the
  independent same-customer keys, full-key versus customer-only bucket rule and
  read consequence in prose. Existing native counts then supply independent
  evidence rather than replacing that mechanism.
- **Low, lines 22/30:** replace figure-introduction cross-references with the
  concrete missing-status/covering-index comparison already being explained.
- Native plan interpretation and the lock-only holder/updater case have
  independently stated observations. Keep their distinct units and limits.

### crdb-reads.astro — local repair

- **Medium, lines 28–40:** the two 20.00 attempts read before either inserts,
  but the body hands the outcome to Figure 2. State explicitly that both can
  accept against 0.00 under Read Committed and commit 40.00 against a 29.00
  limit; contrast the Serializable outcome and fresh decision on retry. The
  serial-order reasoning after the figure is useful and should remain.
- **Low, lines 14/17 and 59:** direct figure-operation references can be replaced
  with the already-stated read/commit/read schedule and closed-timestamp
  evidence. The follower-read and retention mechanisms otherwise stand alone.

### crdb-schema-change.astro — focused repair

- **Medium, lines 22–24:** “Watch P7 in both structures” and “The update removes
  the current 20.00 entry” assume the drawing sets up exactly when P7 is
  backfilled and changed. State the illustrative build sequence, including the
  concurrently maintained 20.00→22.00 entry, before deriving why no update is
  lost. Preserve the caveat that the diagram omits engine stages.
- **Low, line 52:** “Follow the failed build … then watch” is unnecessary because
  the next paragraph independently reports the native rejection and correction.
- Job status, pause/cancel, backfill acceptance and native limits are fully
  developed outside animations; keep those explanations intact.

### crdb-transactions.astro — repair frame-first transitions

- **Medium, lines 40–55:** “These records answer different questions” assumes
  Figure 1 established the application request row as well as native T. Define
  both in prose first: T tracks one native attempt's status; the retained
  purchase_requests row recognises customer 1's purchase-103 across attempts.
  Preserve that the latter commits with the business changes.
- **Medium, lines 59–75:** “In Figure 2 … compare…” and “Figure 3 isolates…”
  organise Parallel Commits and read-refreshing around animation runs. The
  essential staging/listed-write evidence and refreshed-read definitions are
  present, but connect the steps and the unchanged/conflicting read cases in
  prose. Avoid making the user operate a state machine to discover the next
  causal step.
- Retry, savepoint, ambiguity and bounded-connection protocols are independently
  explained and should not be mechanically expanded from every visual state.

### crdb-upgrades.astro — substantive explanation passes; framing repair

- **Medium, lines 11–14:** “Step until all three binaries are new, then watch…”
  makes the model's nodes and held state a visual exercise. Define the
  three-node rolling example and held cluster version in prose, then explain
  what can still return and what finalisation changes.
- **Low, lines 40/42/69 and 95:** A/B/C references rely on those example labels,
  and the ending points back to “the one in Figure 1”. Once the prose setup is
  supplied, explain the distinction in its own words.
- The preparation, checkpoints, finalisation boundary, return versus restore,
  actual native incomplete-finalisation result and future-version caveats are
  independently developed. No article-wide argument failure is shown.

## Repair and evidence boundaries

These findings concern teaching and prose. Restore missing illustrative premises
from the actual figure/model source before retaining exact arithmetic; do not
invent a different trace and keep the old totals. Changed technical meaning needs
primary-source checking in the relevant cited documentation. Existing native SQL
and lab results can remain applicable if their commands, data and environment
are unchanged. Nothing in this review establishes animation operation, rendering,
new native execution or publication authorisation.
