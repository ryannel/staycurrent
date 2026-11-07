# First visual reading: Handling cache misses

## Inputs and observation conditions

Read only the assigned first-visual-reading lens, the title/audience in the assignment, and the isolated preview at http://127.0.0.1:4326/review/figures/cache-misses/. This is the fixed isolated build supplied by the coordinator; I did not independently inspect its source revision. A new Chrome tab/session was created for this reading. The observed screenshot viewport is 1488 × 973 pixels. System theme rendered dark. No viewport override was applied.

I have not read the article body, long alternatives, code, author notes, goals, plans, previous reviews or outside sources. The initial accessibility state exposed all five visible captions and control labels at once; neighbouring figures were sometimes partly visible during scrolling. Those are within the supplied figures-only inputs, but the reading was not blind to later captions. Each figure was brought into view and its controls used. These are accounts of visible animation states and changes, not deductions from implementation.

## Figure 1 — account recorded before studying the later figures

An entry has expired, and requests arrive at 400 a second. The rising line counts list computations started; when the first fill arrives, the line becomes horizontal. With a 150 ms computation, the marker settles at 60 computations. Switching to the 600 ms source makes the line continue rising, finally settling at 240. The changing line and the first-fill marker make the time window tangible. The caption supplies the multiplication, and the graph lets me predict that a longer first fill admits proportionately more starts at this arrival rate.

A dashed line labelled “40 fill slots across the fleet” sits below both results. I understand that these scenarios demand more work than that capacity, but I cannot tell from this drawing what actually happens to the excess. Does it wait, get refused, or change the time of the first fill? The graph counts starts while the reference line names slots, so relating those quantities requires an assumption about how long started computations occupy a slot. I supplied the idea that the first successful fill prevents later requests starting duplicate work from general cache knowledge; the horizontal line illustrates that consequence but does not draw the requests or the cache check.

I saw the initial growing segment, progression, the first-fill change and the labelled plateau in both variants. Replay was useful because the first view was already part-way through the default animation. The slower variant made the continued accumulation especially apparent.

## Figure 2 — account recorded before studying the later figures

Three callers arrive at different times and share one load of P7’s card. With the load’s own 120 ms budget, caller A reaches its 50 ms endpoint and errors. The load continues, fills at approximately 100 ms, and B and C receive the same “GBP 20.00 card” at that time. Their dotted lines extend to later deadlines. Switching to “Load tied to caller A” changes the outcome: A, B and C all error at A’s endpoint, and the shared load is cancelled there. The common horizontal time axis makes the coincident outcomes clear.

This teaches me to distinguish the time a caller will wait from the lifetime allowed for work shared with other callers. In this example, giving the load its own budget allows later callers to benefit after A leaves. I supplied from prior knowledge that a caller is an incoming operation/request and that “filled” means storing the result in a cache. The figure itself shows one shared lane and equal returned card labels, but does not show how callers join that work or where that sharing is coordinated.

I initially read “waits 150 ms” as an elapsed wait, then the shorter solid bars, dotted continuation and caption made me read it as a maximum allowance. I checked the caption again to settle that. The label “P7’s card” supplies a concrete object without explaining what it is; that did not prevent reading the deadline comparison. I replayed the independent-budget case and watched the caller-owned alternative from short initial bars to cancellation and settled error labels. The comparison of the same lanes under the two controls was useful.

## Figure 3 — account recorded before studying the later figures

Server A begins with a short “lease tokA” bar and a longer computation bar. In “Lease only”, the lease stops around 200 ms while A’s computation continues. B, initially serving the older list, then gets “tokB” and computes while A is still running. The highlighted overlap and “2 computations” label establish that both are doing work. B publishes and releases around 360 ms, and the cached-list lane switches from the older list to B’s list. A carries on much longer, then “publish and release refused” appears; the cache stays on B’s list.

The source-timeout variant instead stops A before 200 ms with “cancelled, lease released”. B later publishes the new cached list, with no visible overlap and no “2 computations” label. Together with the caption, this shows that permission expiring and computation stopping are separate events. It supports choosing a source timeout when the aim is to stop lingering work, rather than assuming a lease alone does that.

I infer from the labels that tokA and tokB identify different ownership, and that A is refused because its permission has expired. The drawing does not show the comparison or operation that enforces refusal. Reading the thick gold bar as query/computation uses the caption and the overlap label; there is no separate legend. The older-list lane newly shows that callers can keep receiving an older value while a new one is made. This was not shown in Figure 1, whose setup was an expired entry.

I replayed the lease-only animation after bringing the full figure into view, observing the beginning, overlap, B’s publication, continued A work and A’s refused final action. I then watched the source-timeout variant from its beginning through A’s cancellation, B’s publication and the completed cache-lane change. Some of this figure had animated in the edge of the viewport while reading Figure 2; the full replay is the basis for this account.

## Figure 4 — account recorded before studying the last figure

Requests initially receive the older list, whose bar ends at the hard limit of 30 seconds. A refresh reads at 29.3 seconds. In the successful variant, “new list stored” appears, the new-list bar starts before 29.5 seconds, and subsequent request dots change to its colour before the old hard limit. Its label eventually says “until 59.3 s”. Thus an early refresh can replace the old value without a gap, and the new limit is 30 seconds after the marked read time, not after the visibly later storage point. That latter relationship comes from comparing the two numbers; no separate rule names it.

In the failed variant there is no new-list bar. Requests continue receiving the old list until 30 seconds, then turn to the colour labelled “miss”. The old bar and vertical limit do not move. This makes the caption’s claim—that failure does not extend the old limit—directly visible. I can predict that a failed refresh before expiry need not immediately cause misses, but it leaves a coming deadline to meet.

I brought the figure fully into view and replayed success, watching the initial old-value requests, refresh/store change, new requests and final lifetime label. I switched to failure and observed its initial state, refresh, failure, crossing of the hard limit and settled miss labels. Some labels appear only late, so the final state is necessary to confirm what the dot colours mean. The times and vertical limit gave me a clear comparison without another replay. Figure 3 had already introduced serving an older list; this figure adds a limit to that behaviour. The figure does not tell me why 29.3 seconds is chosen or whether the missed requests then wait, fail or receive a fallback.

## Figure 5 — first account

Redis has restarted empty. With fills held at 2,000 a second, the graph compares the proportion of requests served from cache over 20 seconds. The demand-fill curve rises sharply, reaches the labelled 61% after one second, then gains more gradually towards the dashed normal hit ratio of 94%. The “prewarm all 50,000” line rises steadily: its marker says 20% after five seconds and it remains below the demand curve at the end. I replayed it with the full graph in view and saw the lines begin near zero, grow through intermediate states and reach their settled ends. There is one offered comparison, with no variant switch.

The comparison lets me choose demand fills for faster early recovery in this example. The caption distinguishes a simulation from an expectation and says the prewarming order is independent of popularity. I supplied the causal link that demand preferentially fills items people actually ask for, whereas a catalogue sweep spends fills on items that may be less requested. The drawing shows the performance difference; it does not show item popularity, requests selecting items or the distribution that produces this particular curve. “Normal hit ratio, 94%” reads as this example’s baseline, not a universal target. I cannot tell how many requests are failing or how much source load remains from this chart of cache hits alone.

## What the sequence taught me

After an entry expires, work can accumulate until the first replacement arrives; a slower source enlarges that interval. Several callers can share one replacement computation, but their waiting deadlines need not control its whole lifetime. Across servers, a lease can limit who may publish while work continues beyond the lease, so stopping work requires its own bound. An older cached value can bridge a refresh, subject to its hard limit: success supplies a new value before that limit, while failure does not buy the old one more time. If the cache starts empty, the order in which limited fills are spent can strongly affect how quickly requests return to being served from cache.

I can now predict the direction of those changes and choose among the alternatives actually shown: a separate load budget for shared callers, a source timeout to curtail lingering computation, an early refresh that respects the old hard limit, and demand fills for the illustrated recovery workload. The sequence gives several useful distinctions, rather than one complete operational procedure. I still cannot implement the coordination or choose numerical budgets from it. In particular, I do not know what happens when the 40 fill slots are exhausted, how the shared-load mechanism and server lease relate, or what callers receive after a hard-limit miss. The figures do not demonstrate that every type of cached object may safely be served old; I would not infer that rule from the list example.

## Playback record and limits

Observed all offered variants: Figure 1 at 150 ms and 600 ms; Figure 2 with an independent load budget and tied to caller A; Figure 3 lease only and with source timeout; Figure 4 refresh success and failure; Figure 5’s combined demand/prewarm comparison. Replay was used for every default animation after bringing its full figure into view. Observations comprise successive rendered screenshots of beginnings, changes and settled results, not continuous video. No animation was judged from code or only from its final still. Pause was available during playback; I used Replay and variant controls, not Pause. No mobile, light-theme or reduced-motion review was attempted in this first-reading stage.

This account was saved before receiving any informed-review inputs. It contains observations and limits, not proposed repairs.
