# Teaching review, round 1: Application caching with Redis (introduction)

Reviewer: independent editor, 27 October 2026. Source read:
`src/articles/caching/introduction.astro` and `src/components/caching/introduction/`.
Rendered at `http://localhost:4451/learn/databases/caching/` with
`CACHING_DRAFT_PREVIEW=1`. Standard refreshed first: the brief, the full text of
Gears and Load Balancing, and four of their demonstrations (Gears' linear-velocity
disc and radius-ratio discs; Load Balancing's 1 rps and 3 rps single-server
simulations, played until requests dropped).

What I did with the article: I read it top to bottom and used every figure. I
stepped Figures 1, 3, 7 and 10 with their Step buttons and played them at 1×. I
moved every slider and clicked every option by mouse on its visible label. I
stepped both sequence figures to the end and opened the text alternatives. I
checked reduced motion. Screenshots in light and dark themes at desktop width and
375 px are in `review-screens/` (40 files), plus extra state captures I took while
testing. No console or page errors appeared, and there was no horizontal overflow
at 375 px. (The dev server reloaded the page a few times during testing because
of file changes elsewhere in the repository. That is not an article defect.)

**Verdict: publishable after required fixes.** 6 required, 16 suggested.

The article does its main job well. It opens on a situation every application
developer recognises. Figure 1 makes the waste visible before the word "cache"
appears. The quantitative core (Figures 4 and 5: 95% → 99% means five times fewer
database reads; p99 stays a miss until fewer than 1% of requests miss) is the
strongest teaching in the collection so far, and it is shown before it is
explained, as Load Balancing does. It closes with three questions and a map,
which give a sound mental model for what follows. The required fixes are small:
a mislabelled set of links, an overlap with article 11, and three places where the
prose and the figure disagree.

---

## The commission's four specific questions

**(a) First page: does it make a newcomer want to continue, and give a sound
mental model?** Yes, mostly. The opening paragraphs are informational and say
what the reader will be able to do. The figures-first rhythm of the first half is
right for a first page. The closing "three questions" (how stale, what happens
without the cache, how much memory) are a good model of the whole collection.
The weak stretch is the second half. After the skew section, two structural
sections ("Where Redis sits", "What Redis is") interrupt the line from "what a
cache buys" to "what a cache costs". "What Redis is" also arrives after Redis has
been used for six sections (see S1).

**(b) Licensing material.** It should shrink to one sentence (R2). The coverage
map gives the licensing history to article 11. The paragraph here is three
sentences plus a source bullet. The reader needs to know only why the collection
says "Redis" and that Valkey behaves the same for caching.

**(c) Choice controls respond to a mouse click on their visible label.** Pass.
In Figure 4 (0%, 90%, 99%, 99.9%, 95%), Figure 5 (80%, 98%, 99.5%) and Figure 10
(Down, Running), a real mouse click at the centre of each visible segment
checked the radio button and updated the readouts and chart. The arrow keys also
move the selection (95% → ArrowRight → 99.9%). The transparent input is placed
over its own label, so a click on the visible text lands on the input itself.

**(d) Links to unpublished articles do not render as links.** Fails in the body
(R1), passes in the navigation. No body link points to an unpublished article's
URL. However, all 14 in-text references ("Article 3", "article 4", "Article 11"
and so on) render as ordinary links to `#collection`. A reader who clicks
"Article 3" expects article 3 and lands on a plain-text list. The articles
switcher behaves correctly: planned entries render as `<span class="planned-title">`
with "· planned" in normal builds, and only drafts link under preview.

---

## Required

**R1. In-text article references are links that do not go to the article.**
*Location:* every "Article N" / "article N" in the body (14 anchors, all
`href="#collection"`), for example "<a href="#collection">Article 3</a> is about
choosing keys." *Problem:* they look like cross-article links. When articles are
published, these anchors will still point at the map unless someone edits them by
hand. *Fix:* add a small local component (for example `ArticleRef n={3}`) that
reads `cachingCollection`. It renders `<a href={cachingHref(slug)}>` when that
entry is `published`, and plain text otherwise. Use it for every reference. Render
the closing map (`ol.intro-map`) from the same data, so published entries link
automatically (S16).

**R2. Licensing history belongs to article 11; reduce it to one sentence.**
*Location:* "What Redis is", last paragraph ("Redis also has a history worth
knowing about. Versions up to 7.2 were released under the BSD licence; from 7.4
the licence changed …"), and the "Redis licensing" source bullet. *Fix:* replace
both with one sentence, for example: "Valkey, a fork of Redis 7.2 started in
2024 after a licence change, behaves the same for everything in this collection,
so I say Redis throughout; article 11 covers the licences when choosing a
service." Keep the Valkey link and move the licensing sources to article 11.

**R3. The Figure 7 prose overstates what the cache holds.** *Location:* "With room
for 250 keys, Redis holds most of the products inside the outline, but not all of
them". *Evidence:* the figure's own text alternative (canvas aria-label) reports
"128 of the 250 most popular are held" at 40 s, and "10 of the 25 most popular"
at 25 keys. The screenshot shows a nearly full first row and a half-empty second
and third row. *Fix:* "Redis holds nearly all of the most popular hundred
products, but only about half of the 250 inside the outline". Apply the same
correction to the text alternative ("holds most of the popular products inside
the dashed outline").

**R4. The Figure 3 instruction asks for 30 clicks.** *Location:* "If you let it
run for a few simulated minutes (press **Step 10 s** about 30 times to skip
ahead), the hit ratio … settles at around three in four." *Problem:* the
article's main result for this figure is reachable only by 30 button presses or
five minutes of watching, and the brief requires that every result be reachable by
stepping. *Fix:* set `advance={60000}` (Step 60 s) and say "press Step 60 s five
times". Alternatively, add a second step size. I confirmed the numbers: 54% at
30 s and 73% over the last 100 at 300 s, matching the prose.

**R5. Colour vocabulary: "write" means two things, and the legend names an idea
the article never uses.** *Location:* the legends of Figures 2, 3 and 9 read
"Write or invalidation". The prose defines "a write to Redis is a teal square".
In Figure 9, the staff member's `UPDATE £29` to the database and the "Staff" lane
are also teal. *Problem:* the brief makes colour a fixed vocabulary. Here teal
means both "store in Redis" and "change the database", and "invalidation" is
undefined on this page. *Fix:* pass `legend={[…, { kind: 'write', label: 'Write
to Redis' }]}` in these three figures. In Figure 9, draw the staff lane and the
UPDATE arrow in the database or neutral kind, so that teal appears only on the
`SET … EX 60` arrow.

**R6. Figure 10's readouts disagree with its caption and prose on arrival.**
*Location:* the caption says "giving a hit ratio near 95%" and the prose says
"With Redis running, the database serves about 5 reads a second … The size of the
jump is … 20 times at 95%". *Evidence:* on first view (t = 121 s) the readouts
show 98–99% and 1–2 reads a second. Over the next 20 s they show 90–95% and 6–9
reads. The visible chart from 80 to 120 s is a decaying wave. This is a
synchronised-expiry artefact of the 120-second prerun: every key filled at t ≈ 0
expires at about 60 s and again at about 120 s. Down then gives 87–108 reads, so
the jump the reader sees is about 12–15 times, not 20. *Fix:* warm the model
with staggered expiry times (random remaining TTL at the end of the prerun, or
jitter on the prerun fills). Then check that the steady state matches "near 95%"
and "about 5". If the model cannot be changed, say "about 5 to 10 reads a second"
and give the jump as a range.

---

## Suggested

### Teaching and structure

**S1. Move Redis forward and keep the costs together.** "What Redis is" comes
eighth of ten sections, after Redis has been used since section 2 ("I will say
more about Redis itself later"). "Where Redis sits" and "What Redis is" sit
between the skew argument and the costs, which breaks the line from "what it
buys" to "what it costs". Put a trimmed "What Redis is" (the first three
paragraphs) and Figure 8 right after Figure 1, before cache-aside, so the reader
meets the thing before using it. Move the `maxmemory 0` / `noeviction` paragraph
into "Memory is not free", where it answers the question that section raises.

**S2. Figure 6 hides the region the prose discusses.** The x-axis is linear from
0 to 100%, so the top-1% and top-10% points that the readouts and the prose
discuss sit in the first few pixels; at s = 1 the curve looks like a vertical
line and then a plateau. The plan called for markers at 1% and 10%. Add those two
markers, with drop lines and labelled values, or use a log x-axis (the writer
reports that the toolkit lacks one; a local axis is acceptable).

**S3. Derive the break-even, as Gears derives the gear ratio.** "the cache helps
only if h is above (L<sub>c</sub> + L<sub>c</sub>) / (L<sub>d</sub> + L<sub>c</sub>)"
is asserted, and it is written oddly. Show the three lines: L<sub>c</sub> +
(1 − h)(L<sub>d</sub> + L<sub>c</sub>) < L<sub>d</sub>, so 1 − h <
(L<sub>d</sub> − L<sub>c</sub>)/(L<sub>d</sub> + L<sub>c</sub>), so h >
2L<sub>c</sub>/(L<sub>d</sub> + L<sub>c</sub>) ≈ 9.5%.

**S4. Quantify the many-lookups point.** "if it needs 20 answers, it is slow
whenever any of them misses" is the most practitioner-relevant sentence in the
tail section. One line of arithmetic makes it land: at 95%, only 0.95<sup>20</sup>
≈ 36% of such pages hit on every lookup.

**S5. Trim the metastable-failure explanation.** Article 11 owns metastable failure
and recovery. Keep Figure 10 and the 1/(1 − h) jump. Reduce "Bronson and
colleagues describe how that can trap a system … They call this a metastable
failure" to one sentence that names the risk and links to article 11.

**S6. Cut the second TTL fact in the read-path section.** "On a test server, a
`SET` without `EX` left the key with a TTL of −1, meaning none; a plain `SET` over
an existing key also removes the TTL it had." The crash-between-commands reason
is enough here. The TTL-removal behaviour (and `KEEPTTL`) belongs to article 4.

**S7. Define "eviction" at first use.** The word first appears in "its
`allkeys-lru` eviction setting" and then as "eviction policy", without a
definition. Define it in the Figure 7 paragraph: "removing a key to make room is
called eviction".

**S8. Figure 1's "barely moves" is partly an artefact.** With only 50 products,
"Different products asked for" is capped at 50: 43 at three visitors a second,
49 at six. Either say that the catalogue is small, or point the reader at the
database's queries-per-second label, which shows the doubling directly (181 →
355 queries in 60 s). The six-bar chart is also tall for what it shows. Put each
label beside its bar to halve its height.

### Figures as artefacts

**S9. Figure 9: show the database query after the miss, and consider a timeline.**
After step 5 (`GET`, miss) the next arrow is `£29` from the database, with no
request to the database and no nil reply. Figure 2 draws both, so the two figures
disagree. More broadly, the idea is about time ("for 40 seconds every visitor saw
the old price"), but a sequence diagram has no time axis. A short timeline would
show the stale window as a band bounded by the TTL, as a Load Balancing chart
would.

**S10. Figure 10: mark when Redis was down.** The chart does not show the
interval. Shade it, so the reader can tell the outage from the cold-cache
recovery after it. The recovery is the point of the prose's "Then notice what
happens when Redis comes back".

**S11. Figure 7 legend does not match the grid.** The legend uses circles, and
"Not held" is a dark grey dot. The grid uses squares, and "not held" cells are
pale beige in light mode. Use square markers in the grid's colours.

**S12. Phone-width details.** In Figure 9 at 375 px, "Application" fills its
lane box edge to edge. In Figure 2 at 375 px, step number 5 is clipped by the
"next visitor" note. Both are minor. They may belong to the shared sequence
renderer; if so, report them as toolkit gaps.

**S13. Figure 7's text alternative prints "Redis holds 1000 of them".** Format
the number with `toLocaleString('en-GB')`, as the readouts do.

### Writing

**S14. Flourishes and compressed lines.** Each is small, but together they work
against the house voice:
- "Mean latency tells a quieter story." Replace with the fact: "Mean latency
  improves much less."
- "The hit ratio rises by only four points, which sounds like polishing, but the
  database reads fall from 50 to 10". Cut "which sounds like polishing".
- "A cache is a copy, and a copy has costs." An aphorism standing in for a lede.
  Use, for example: "A cache adds three costs: answers can be out of date, the
  database comes to depend on it, and it uses memory."
- "it was a hit, it was fast, and it was wrong." Keep at most one such line per
  section. This one is the section's flourish, so the others should go.
- "Redis also has a history worth knowing about." This goes with R2.
- "Until then, your p99 is the speed of your database." Acceptable as the
  section's one compressed line. Consider "until then, p99 latency is set by the
  database".

**S15. Searchable headings.** "The mean hides the misses" →
"Tail latency: the mean hides the misses". "Why a small cache can catch most
requests" → "Popularity skew and the working set". "The same answers, again and
again" can stay as the opener.

**S16. Render the closing map from `cachingCollection`.** This is the same fix
as R1. It keeps the map's titles and descriptions in step with the switcher and
the plan, and lets published entries link automatically.

---

## Depth

The article covers every subject the map gives it: why applications cache,
cache-aside with `GET` / `SET … EX`, hit and miss ratio, mean latency and
database load derived and simulated, the miss-ratio argument, skew with its
exponent and Breslau's measured range, the working set, the three costs posed as
questions, the cache layers, what Redis is, and the map. The Zipf numbers check
out: H(1000)/H(100000) = 0.62 and H(10000)/H(100000) = 0.81 at s = 1, and 18% /
38% at s = 0.64 / 0.83. These agree with `research/group-A.md` and
`evidence/introduction.txt`, including Breslau's quoted 20–35% and 25–40% figures.
The measured Redis numbers (0.095 ms median, keyspace counters, 46.7% / 70.5%
under LRU) are in the evidence file and are labelled as measurements.

A practitioner would still want two things, and both are short: the break-even
derivation (S3) and the many-lookups arithmetic (S4).

It strays into other articles' subjects in four places: licensing (R2, article
11), metastable failure (S5, article 11), the TTL-removal detail (S6, article 4)
and the `maxmemory` defaults (one paragraph; acceptable as a warning that links
to article 4). The `keyspace_hits` paragraph touches monitoring (article 11), but
it earns its place because it is about what "hit ratio" means.

At about 4,100 words of prose with ten figures, the density is right for a first
page: roughly one figure every 400 words, between Load Balancing and Gears.

## Beside the references

Would it sit naturally beside Gears and Load Balancing? The first half would.
Figures 1, 3, 4 and 5 isolate one variable each, the prose says what to look for
("count the rings", "notice where the markers fall"), and the surprises (5× from
four points of hit ratio; p99 stuck in the misses at 98%) are shown first and
then explained, as Load Balancing does with round robin's tail.

**Single biggest gap:** the second half loses that rhythm. Two structural
sections interrupt the argument. Then the costs, the part that sets up the whole
collection, are taught with a sequence diagram that cannot show time (Figure 9)
and an outage chart whose arrival state contradicts its caption (R6) and which
does not mark the outage (S10). Moving the Redis sections forward (S1) and
making Figures 9 and 10 as clear as Figure 4 would bring the whole article to
the level of its first half.
