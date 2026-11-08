# Handling cache misses: visual repairs

Commission: repair the gaps found by the 7 November figures-only review, then repeat
that review with a fresh agent. Work starts at `0c0b831d` and stays on
`codex/cache-miss-visual-repair`; publication is not part of this commission.

## Visual coverage

| Figure | Understanding and visible contribution |
| --- | --- |
| Stampede | A missing answer remains missing during the first fill; starts accumulate, and slowing the fill increases overlap. Preserve the numerical comparison. |
| Shared load | Callers join one load and leave at their own deadlines; clarify budget versus elapsed waiting. |
| Coordination | Per-process sharing leaves one load per server; choosing a fleet lease depends on duplicate cost. Show the local maps and the owner choice. |
| Lease | Permission expires without stopping work; publication and release require an owner check. Preserve the race and timeout comparison. |
| Refresh | Success replaces the observation; failure cannot extend the old hard limit. Preserve both timelines. |
| Scheduling | Random decisions by callers of one key differ from spreading refresh points across keys; neither supplies a missing value. Show selection, overlapping attempts and staggered times. |
| Admission | Different keys compete for two executing places and one waiting place; overflow and expired waits receive defined outcomes. The same gate survives cache failure. |
| Limits | Longer fills hold places longer; a start-rate limit and a connection pool permit different totals. Fleet scaling must preserve the source allowance. Compare counted work. |
| Cold recovery | A small popular set serves many requests; demand spends the fill allowance there first. Pair the existing curves with the key/request distribution and equal-budget comparison. |
| Stuck recovery | Too many attempts, slow unfinished queries and too few completed fills sustain misses. Contrast the loop with admission, bounded retries, source cancellation and a measured ramp. |

Exact wrapper code, atomic Redis commands, XFetch's derivation, connection error text,
and recorded execution details remain in the independently complete prose. New diagrams
use the existing article's example and calculations. They are illustrations, not new
measurements. Reuse the existing execution evidence where code and claims are unchanged.

## Review method

Build the isolated figures-only route from the actual article components. A new reader
receives only that fixed preview, the audience and first-visual-reading instructions.
Save its unaided account before supplying prose, goals, this coverage map and informed
checks. Confirm accepted substantive repairs; retain unaffected prose and technical
checks. Record rendering observations and limits separately from comprehension.

## Full-sequence result

The fresh reader's [unaided account](reviews/first-visual-reading.md) was saved and
hashed before the article or learning goals were supplied. Its
[informed review](reviews/informed-visual-review.md) finds no Critical or Medium
finding: the sequence explains the main mechanisms, consequential failures and choices.
The coordinator accepts that judgement on the recorded evidence, with the limitations
below. This is evidence from a separate model reader, not a human comprehension study.

| Original gap | Repair and independent evidence |
| --- | --- |
| Admission, overload and cache failure | Figures 7–8 show executing places, bounded waiting, useful-deadline checks, fallbacks, the outage allowance, slowdown and fleet scaling. The unaided reader traced each decision, including refusing P9 despite a newly free place. |
| Failed recovery and retries | Figure 10 closes the feedback loop and contrasts relief with overload. The reader explained why restored Redis can stay cold, why a timed-out caller can leave work running, how retries multiply, and what to measure before a ramp. |
| Coordination scope and cost | Figure 3 shows callers sharing within separate servers, then a fleet owner. The reader correctly connected the cost of remaining duplication to whether coordination is worthwhile. |
| Refresh scheduling | Figure 6 contrasts per-request selection for one key, jitter across different keys and an empty restart. The reader distinguished their scopes and retained the need for sharing and admission. |
| Recovery curves without a cause | Figure 9 relates the popular keys' 2% key share to roughly two thirds of requests before showing recovery. The reader explicitly identified those bars as the reason the curves became explainable. |
| “Waits” versus budget | Figure 2 now labels caller budgets. The reader correctly separated available time, actual waiting and the independent load deadline. |

## Clarification revision

The full review found only Low issues. The next revision supplies the P7 arrival-rate
estimate, replaces “maps” with “servers”, identifies the outage simulation and joined
callers, names the short-budget control accurately, narrows the empty-cache statement
to requested keys, and makes the hypothetical connection calculation explicit. It also
moves jitter's key labels above the time chips, fixing the observed phone collision.
These changes preserve the same lessons and figures. The
[technical confirmation](reviews/technical-confirmation.md) closes its two wording
findings and confirms the additional numerical clarifications.

The separate v2 build and four-figure subset are identified in
[frozen-v2.json](evidence/frozen-v2.json). A second fresh reader recorded its
[unaided account](reviews/clarification-first-reading.md) of Figures 3, 6, 7 and 8
before receiving their intended lessons. Its
[confirmation](reviews/clarification-confirmation.md) finds no Critical or Medium
finding and confirms the changed layouts at desktop and 375 px in both themes.
The whole jitter time chip clears P7, including its outline. The coordinator accepts
the confirmation; all five original Medium gaps and the budget-label finding are
closed. Unaffected v1 checks are retained.
The full v1 page remains frozen; its evidence is not silently relabelled as v2 evidence.

Two Low suggestions remain open: simplify motion in the jitter and
recovery-intervention views, and consistently place Figure 8's counted bar quantities
beside their bars, separate from derived completion rates. The second reader initially
associated the first bar with its bold completion rate, then resolved the units from
the visible row labels without prose. These are optional presentation improvements;
the recorded readings contain no substantive misunderstanding. They do not reopen the
teaching review.

## Validation and limits

- Article prose is unchanged; the source diff contains figure placements and numbering.
  Existing prose, teach-back and execution checks therefore remain applicable.
- Both preview and normal builds pass; normal builds exclude the review route and
  preserve ten text alternatives. All 24 site-check tests and the article-specific
  dense-prose check pass. Warnings on other articles are unchanged.
- Technical calculations and consequential claims received an independent focused
  check against primary sources and retained execution/simulation evidence.
- The full reader observed all 23 variants through sampled changing and settled states,
  then checked phone layouts in both themes, desktop light examples, new keyboard
  controls and all text alternatives. The expanded outage view fits at 375 px.
- Geometry measurements complement visible review; the chip collision demonstrated
  why text-only overlap checks cannot replace it. Contrast evidence is retained for
  the unchanged palette. See the review for exactly which checks were fresh or reused.
- Playback is not continuous-video evidence. Reduced-motion emulation and
  screen-reader-software testing were not performed. No collection-wide rereview
  or new native database experiment was needed for the unchanged technical execution.

The article remains on its repair branch for comparison with the published version.
