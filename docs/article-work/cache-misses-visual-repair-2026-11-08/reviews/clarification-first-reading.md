# Unaided first visual reading: Figures 3, 6, 7 and 8

Recorded on 8 November 2026 before receiving informed inputs. Audience assumed: a curious, intelligent engineer who may be new to application caching. I read only the first-visual-reading lens and the supplied figures-only preview; I did not open the article, source, goals, previous reviews or long text alternatives.

## Conditions

I opened a new Chrome session at `http://127.0.0.1:4330/review/figures/cache-misses-confirmation/`, titled “Handling cache misses — Figures-only preview”. That served preview identifies the build inspected; I did not independently inspect a commit or build identifier. The captured browser content viewport was 1488 × 917 pixels, with the system theme displaying dark colours. I used the visible figure labels, captions and controls, with accessibility state to locate controls. I left viewport and motion settings unchanged.

I watched all eleven variants: both Figure 3 views; XFetch, jitter and empty cache in Figure 6; cache misses, too little time and Redis unavailable in Figure 7; and 20 ms, 200 ms and 30 servers in Figure 8. Each was brought into view before playback. I observed opening, intermediate and settled screenshots, replaying the initially selected views. This samples transitions rather than recording every animation frame. The outage view exceeded the viewport, so I watched its upper sequence before scrolling to its lower quantities and caption. I did not inspect mobile, light theme or reduced-motion behaviour.

## Figure 3

The setup is one missing list requested through 20 servers. Two list boxes feed each illustrated server, yet each server produces only “1 query”. The label “Each server shares only its own callers” explains that reduction. Separate gold query bars appear under A, B and Server 20, followed by “20 servers can still start 20 copies”. Thus local sharing removes repeated work within each server but leaves duplication between servers.

Selecting the lease leaves the query under A; B and Server 20 instead say “lease held by A”. A connecting line and “One owner fills; other servers reuse” establish the changed scope. The caption supplies important qualifications: waiting servers retain deadlines and fallbacks, and expiry can permit overlap. Those behaviours are stated, not enacted in the drawing. I cannot infer the lease protocol or freshness guarantees from the connecting line.

The cost comparison makes coordination a judgement about saved work: P7 has roughly five 20 ms copies, totalling 100 ms, while the list can consume 3,000 ms. The proportional bars make that contrast immediate. I initially did not know what P7 represented; later figures call these identifiers cards. Understanding requests per second multiplied by duration as overlapping copies uses ordinary concurrency knowledge. “Ownership alone does not make data current” is a clear limit, although no stale-data event is shown.

## Figure 6

XFetch shows one popular list expiring at 30 seconds. “Each request draws its own refresh decision” and the rising probability curve establish a decision that becomes more likely near expiry, rather than a fixed early-refresh appointment. The 0.13% at 29 seconds and 100% at expiry labels anchor the curve without requiring a vertical scale.

Below, two separately labelled 150 ms fills grow along a shared, more detailed time axis. Their horizontal overlap demonstrates that two selected requests can both start work. Coalescing or a lease is named as a way to reduce this. The separate axes are legible, but I had to read their tick labels to avoid treating the lower view as the same time window. The caption's 0.7 seconds early and 2.8 attempts are simulation summaries; two illustrated requests do not themselves establish those averages. Likewise, avoiding refresh of unused keys follows from the per-request rule and caption, rather than an unused-key example.

Jitter changes the setup to different keys with the same 30-second hard limit. Refresh markers appear at 23, 25 and 26 seconds. Crucially, the text says each key waits for a request after its point, so I read these as eligibility thresholds, not guaranteed executions. The warning that several P7 callers can still trigger together keeps cross-key spreading distinct from sharing one key's work.

The empty-cache view is particularly direct: Redis has restarted; P7–P9 are missing; neither values nor refresh times remain. The resulting “source admission” box explains why early refresh cannot solve this starting condition. It prepares the next figure without implying that jitter fills an empty cache.

## Figure 7

Four different cards cannot share one answer. Two execution places and one waiting place make the allowance concrete. P7 and P8 occupy execution places; P9 waits; P10 encounters a full queue and falls back. When P7 returns, the arrow from waiting to execution and the replacement with P9 show what releases and consumes a place.

The time variants make admission conditional on usefulness as well as space. With 100 ms left and a 20 ms fill, P9 may start after the deadline check. With 8 ms left, the execution place becomes free but P9 is refused without a query. That contrast is strong: spare capacity alone is insufficient. The fallback text also closes an easy loophole by saying fallback starts no additional source read. Older data is permitted only within its hard limit; otherwise available fields or HTTP 503 are offered.

The outage variant retains the same admission structure after a Redis timeout. The displayed 150 − 10 = 140 ms establishes time already spent. P9 subsequently has 100 ms left; I supplied the inference that waiting or other elapsed work consumed the difference, since no clock traces it.

The fleet calculation gives 40 places and about 2,000 fills per second, far below 20,000 requests per second. “12% full cards, incl. joined” and the caption about popular-key sharing explain why successful callers are not identical to independent fills. I reread that qualifier. The exact 17,700 loads and 12% are reported simulation results, not derivable from the small four-card animation.

## Figure 8 and the sequence

The fast/slow variants distinguish counts clearly once their row labels are read: 40 executing places allow 2,000 completions per second at 20 ms, but only 200 at 200 ms. A fixed 2,000 starts per second instead changes work in progress from 40 to 400. Potential connections remain 1,000.

I initially associated each bar with the bold number beneath it. The first row required rereading: its tiny bar represents 40 executing places, while the bold result is a completion rate. The labels resolve this, but the bars alone do not identify their units. The separate 1,200-miss example adds another calculation; its “if no database limit intervened” wording keeps it explicitly conditional.

The fleet variant is immediately readable: 20 × 2 gives 40; 30 × 2 gives an excessive 60; redistributed places restore 40. Matching first and third bar lengths reinforce preservation of the allowance.

Together these visuals let me predict where duplicate work remains, why early refresh can overlap, why an empty cache needs bounded fills, why a waiting request may be refused, and why slower work or more application servers can defeat an apparently adequate limit. They do not tell me how to measure the safe source allowance, implement leases or select fallback data. Those remain questions, not missing conclusions I can invent from the drawings.
