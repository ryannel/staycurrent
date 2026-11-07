# Reader and visual review — fixed v1

Reviewed 7 November 2026. Audience: an intelligent engineer new to handling cache misses. The first unaided account remains unchanged in `reader-first.md`. This stage used the fixed rendered v1 at `http://127.0.0.1:4325/learn/databases/application-caching/cache-misses/`, the reader lens, voice guide and figure style. No article source, plan, exit questions, author notes or other reviews were consulted. Source repairs reported by the coordinator were not present in this preview and are not evaluated here.

## Findings

### R1 — Medium — Give the reduced-card fallback its data prerequisite

Location: “Limit the work reaching the database”, paragraph beginning “Every refusal needs a response the product can accept”.

“Otherwise return a reduced card with the name and picture but a price marked temporarily unavailable” follows failure to obtain a permitted cached answer and refusal of source admission. The article has not established where the name and picture can now be obtained. A newcomer implementing this instruction can introduce another database read at precisely the point the limiter is meant to prevent it. Make the reduced response conditional on already having those fields from an allowed source, or establish that source in the example. Keep the explicit error alternative.

### R2 — Low — Explain or remove the second XFetch formula

Location: “Refresh before the answer expires”, paragraph beginning “For the list's 400 requests a second”.

The per-request logarithmic test is explained, but the rough lead estimate `0.15 × ln(400 × 0.15)` is supplied without the step that introduces arrival rate. Readers can follow the refresh mechanism and still cannot derive this separate result. Either supply the missing probabilistic reasoning or omit the estimate and retain the clearly labelled simulation results. The 0.7-second lead and remaining duplicate attempts already support the operational conclusion.

### R3 — Low — Remove editorial history from the evidence account

Location: “Where the numbers come from”.

“Those unchanged experiments support this rewrite” refers to production history rather than the evidence the reader needs. Remove it; the adjacent account already states the execution date, versions, observations and limits.

### R4 — Low — State the connection-pool example directly

Location: “Choose connection limits separately”, opening sentence.

“A teammate suggests a connection pool of 50 on each server” invents an objection to introduce arithmetic that needs no dialogue. Start with the 50-connection pool itself. Retain the fleet total and the explanation of why an individual pool can remain unsaturated while the database is overloaded; those carry the lesson.

### R5 — Medium — Keep Figure 1's event marker out of the capacity label

Location: Figure 1, settled “Source slows to 600 ms” state, desktop and 375 px.

The vertical marker at 600 ms crosses “40 fill slots across the fleet” on desktop and “40 fill slots, fleet” on the phone. The crossing is visible in both light and dark observations. At 375 px the label occupies approximately x=230–339, y=480–498 in the inspected viewport, and the marker crosses its word “slots”. Move the label clear of the marker or render the marker behind the label's paper halo. This is a house-style overlap defect; it does not invalidate the chart's arithmetic.

No Critical finding.

## Prose assessment

Calibration revisited the actual article text of [Relativistic Baseball](https://what-if.xkcd.com/1/) (opening assumptions and causal sequence), [A Mole of Moles](https://what-if.xkcd.com/4/) (definition before calculation, improving estimates), [Glass Half Empty](https://what-if.xkcd.com/6/) (successive causes and consequences), and [Sunless Earth](https://what-if.xkcd.com/49/) (opening and ending). The useful standard here is ease of following a mechanism; their jokes and dramatic endings are not requirements for this engineering article.

The opening passes. The shop, query duration, popular list and cache lifetime give readers enough to predict the overlap problem before it is named. “Redis has no record that someone is already working on the answer” is particularly economical. The practical ending also passes: counting useful answers separately follows from the explanation and closes the same aggregate-metric trap introduced by the high hit ratio. There is no appended moral or needless general recap.

Sentences are plain and sufficiently varied. Short causal statements are connected rather than merely juxtaposed. There is no pervasive decorative metaphor or staged reveal. Keep “Cancelling a client context asks for work to stop; it does not prove that the query has stopped”, “Redis has expired A's permission, but PostgreSQL has not been told to stop A's work”, and the distinction between jitter across keys and coordination within one key. These comparisons do necessary explanatory work.

The terminology is usually introduced through behaviour first: coalescing, leases, soft/hard limits, admission, circuit breaking and metastability. Some headings favour a plain action over a searchable field term, but their adjoining introductions name the mechanism promptly; this is not an impediment to understanding. The library/API names are useful implementation pointers rather than unexplained substitutes for the explanation.

The whole article requires sustained effort. Its main cost is the accumulation of timing and percentage examples, not obscure syntax. The A/B/C deadlines and lease race justify their numbers. The several local-copy and recovery percentages are harder to retain; the comparison is more important than memorising them. R2 removes one unsupported mathematical detour without weakening the account. I do not recommend a wholesale shortening that would remove the distinction between unavailable and empty caches, or between source protection and a useful response rate.

Confidence and continuity: roughly five places distinguish illustration, simulation or sleep-based execution from production measurements (initial experiment, mean/median capacity caveat, local-copy assumptions, recovery-without-expiry caveat, closing provenance). Most change the inference the reader may safely make and earn their place. There are three substantive inline deferrals—to cache-key identity, freshness allowances and versioned fills. The local explanation supplies the boundary before linking, so these do not abandon a needed causal step. R3 is the one clear editorial seam. Repeated instructions to count actual source work are justified as each additional path—timeouts, refresh, retries, warm-up—could otherwise bypass the same limit.

The prose stands alone; the unaided reading established the mechanisms and choices before any figure was inspected. The first-reading questions about failure-entry encoding, the exact observation timestamp and weighted batch admission remain implementation boundaries, but do not prevent following the main argument. Figure 4 makes the observation-to-storage distinction more concrete; the article does not require its picture to state the age rule. R1 and R2 identify the narrower places where the supplied instruction/result needs a premise or can be removed.

## What each section contributes

| Section | Understanding lost if removed |
| --- | --- |
| Opening | A concrete reason many requests want the same answer, and a question arising from the fill interval. |
| One expiry can start many reads | The stampede mechanism, overlap estimate, positive feedback, and failure hidden by aggregate hit ratio. |
| Share the work for one key | Ownership within a process, atomic registration, rechecking Redis, shared errors and key identity. |
| Let each caller stop waiting | Independent caller/load lifetimes, permitted fallback age, and the distinction between cancellation and stopped database work. |
| Across application servers | The remaining per-instance duplication, lease races, owner checks and why source timeouts are still needed. |
| Refresh before the answer expires | Refresh while serving allowed data, failure retaining the old age, and the opportunity/limits of probabilistic early refresh. |
| Spread different keys out too | The distinction between coordinating one hot key and distributing work from many keys. |
| Limit the work reaching the database | A total executing-work allowance, short bounded queue, refusal policy, slowdown response and fleet scaling. |
| Choose connection limits separately | Why a pool per server does not automatically enforce the intended database allowance. |
| Batch different missing keys | A complementary reduction in round trips, with the warning that a batch still consumes source capacity. |
| When Redis is unavailable | Cache failure consuming the deadline, the remaining work after coalescing, local copies and circuit breaking. |
| Count every retry | Multiplication across layers and the need for a shared retry allowance, beyond per-request backoff. |
| Refill a cold cache | Popularity-aware use of scarce filling capacity and the signals for cautious traffic restoration. |
| When recovery gets stuck | The self-sustaining overload loop and the order of actions that breaks it. |
| Test the failure paths | Observable exercises and the distinction between fast responses and useful responses. |
| Where the numbers come from | The provenance and scope of illustrative, simulated and observed evidence. |
| Sources and further reading | Verifiable pointers organised by the mechanisms they support. |

## Visual and interaction checks

Completed checks are recorded below; the only confirmed visual defect is R5.

| Figure | Contribution and visual judgement |
| --- | --- |
| 1 — overlap count | Makes continuing arrivals during the fill visible, especially the fourfold increase after a slowdown. A simple line plot is appropriate. Its measure label names the plotted quantity rather than duplicating the caption. R5 is the one confirmed collision. |
| 2 — caller deadlines | Removes the need to retain six timing values mentally. The separate load row, dashed allowances and explicit result chips show why B/C can succeed after A leaves. The phone layout places row labels and result chips separately; no collision observed. |
| 3 — lease and source work | Visually separates permission duration from query duration and shows the cached answer remaining B's. The overlap highlight makes duplicate work easy to see. The source-timeout comparison earns its interaction. |
| 4 — early refresh | Shows uninterrupted permitted serving and the old hard limit remaining fixed after refresh failure. The new observation's expiry is explicitly printed. The dots represent request occurrences, not omitted values the reader needs to read. |
| 5 — recovery | Turns many percentages into an immediately interpretable comparison of recovery trajectories. The direct series labels and selected annotations are sufficient; a more elaborate simulation interface is unnecessary. |

House style generally passes: unframed paper, flat marks, generic roles, restrained colour, labelled results and one caption-title per figure. These timing/data diagrams do not need extra product icons. Identity and outcome colours are reinforced by labels and position. Result values are printed on chips where relevant, including the card price, lease tokens and cached-owner result. No decorative gradients, highlights or shadows were visible. Figure 1's event-marker collision is the exception to the no-crossing rule. The chart gridlines are faint supplementary scaffolding; the data curves and labelled limits carry the meaning.

The mobile figures are distinct layouts rather than uniformly shrunken desktop diagrams: labels move above rows, result chips move below them, tick density decreases, and controls wrap beneath the drawing. At 375 px all five figures occupy 343 px, and the page has no horizontal overflow (document scroll width 375 px). Desktop inspection used the browser's normal 1488 × 973 viewport. Phone inspection used an explicit 375 × 812 viewport.

Rendered contrast was measured from visible SVG computed colours and opacity against the actual page background, not inferred from source code. Minimum text contrast observed was 4.76:1 in light and 6.83:1 in dark. Meaning-bearing graphical colours were at least 3.85:1 in light and 4.84:1 in dark in the measured states. Supplementary gridlines were 1.64:1 and 1.83:1 respectively; they carry no exclusive information and are not counted as the meaningful-data pass. Labels have paper halos, except that the event marker is painted across the capacity label in R5. The calculation does not attempt to measure antialiased edge pixels.

Animation observations reuse the first-stage watch and the second-stage control checks. All five were observed from an initial/in-progress drawing to a stable completed frame. Both scenarios of Figures 1–4 were inspected; Figure 5 has no scenario switch. The growing count, independently ending caller rows, lease/work overlap, replacement arrival and recovering hit curve visibly cause the outcomes. Completed frames retain the useful comparisons and do not loop. Off-screen figures can pause their progression, so final-frame judgements were made after bringing each into view rather than assuming elapsed wall time had completed it.

Keyboard checks used actual Enter/Space activation, not just inspection of event handlers: all eight scenario buttons were exercised; Pause changes to Resume; Replay restarts the drawing; and the selected scenario is exposed as pressed. Visible focus is present in both themes. Tab navigation was also followed between the caller-scenario buttons and Pause, and from recovery Resume to Replay. These checks support the controls' usability without inferring interaction from implementation code.

## Evidence limits

The preview remained the fixed v1 throughout; this is not confirmation of subsequently reported repairs. Browser screenshots were inspected during the review; no broad screenshot archive or source-code audit was performed. Desktop/phone and theme checks cover the article's five figures, not the surrounding site's unrelated pages.

The exposed browser capabilities provide viewport control but no media-preference emulation. Reduced-motion behaviour was therefore **not tested** and is not inferred from the normal animation or the supplied style requirement. No screen-reader software was run; the review observed the browser's rendered accessibility state, keyboard behaviour and figure-as-text disclosures. Contrast uses computed rendered colours/compositing and the paper background, not antialiased edge-pixel measurements.


## Completed check record

| Check | Result |
| --- | --- |
| All five settled figures, desktop dark | Inspected in first stage; R5 on the slower Figure 1 variant. |
| All five settled figures, desktop light | Inspected in this stage; no further collision or clipping. |
| All five settled figures, 375 px light | Inspected in this stage; R5 on the slower Figure 1 variant. |
| All five settled figures, 375 px dark | Inspected in this stage; R5 on the slower Figure 1 variant. Both phone scenarios of Figures 1–4 were seen across this pass. |
| Scenario selection | All eight variant buttons activated using Enter or Space; pressed state and picture changed. |
| Pause, Resume, Replay | Keyboard activation checked on all five figures; names/states changed and replay restarted progress. |
| Tab navigation and focus | Verified through the caller variant controls to Pause and from recovery Resume to Replay; visible focus in both themes. |
| Figure-as-text disclosure | All five opened with Enter and closed with Space; descriptive prose became visible and all were closed afterwards. |
| Contrast | Text and meaningful data marks pass in measured light/dark states; faint supplementary guides are identified separately above. |
| Reduced motion | Not tested: unavailable media-preference emulation. |
| Cleanup | Temporary viewport override reset; original System theme restored. |

Review complete. No new finding was added after R5. The next review should be a scoped repair confirmation, especially R1's fallback prerequisite and R5's settled slower-fill marker in both themes and layouts; it need not repeat this whole reading.
