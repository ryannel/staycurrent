# A new prototype: do the work once

28 October 2026. The user rejected the route studies as a cosmetic response to
the reference articles and requested a full rethink. This is a new isolated
prototype, not another revision to the route map or a collection-wide rollout.

## What was actually studied

In the browser, the coordinator played the first and overloaded single-server
simulations in [Sam Rose's Load Balancing](https://samwho.dev/load-balancing/).
The processing request contains a visibly consumed sector: work has duration
inside an object. The repeated experiment changes one condition. Stable position
and repeated input make the behavioural difference legible without renaming
everything. Our corresponding choices are a database-read dial, an identical
request schedule and retained work counters for the two scenarios.

The coordinator also opened the watch with its slider and manipulated the
escapement in [Mechanical Watch](https://ciechanow.ski/mechanical-watch/).
The fork's position physically permits or stops the wheel; colour preserves the
identity of parts as the assembly is opened. It is possible to inspect a small
mechanism without operating the whole watch. Our corresponding choice is to open
the application's work: copied source fields assemble into a visible product
card. No decorative cogs, fictional printing machinery or extra numbered steps.
This is a transfer of explanatory techniques, not a claim to match the reference's
craftsmanship or a copy of its artwork.

The preserved Storage and durability reference's dirty-crash/WAL pair was reread
for its controlled contrast: keep the inputs stable, change the mechanism, and
show the consequence. The current prototype uses that comparison structure.

## Scene and meaning

Both scenarios receive five sequential requests for north's P7 blue mug in English
and GBP, at £20. All requests fit within one cache lifetime; the source does not
change. Browser answers are identical. Left: five database reads and five card
builds. Right: first check misses, one source read and build, then a copy is kept
in Redis; four later checks reuse it. The database row and cached card stay put
when copied. Redis is visibly separate from the shop server's work area and is
one possible implementation. The mug illustration stands for the product; the
cached data is its display name and price, not an image of a card.

An independent conceptual reader flagged the empty first lookup, retaining both
source and cached copies, and not enclosing Redis inside the server. These were
incorporated before the rendered review. Timings are invented choreography, not
relative latency claims. The frame model uses seconds to make the beats explicit;
it is neither a Redis emulator nor a performance model.

The new page is `/review/application-caching/rethink/`, gated by the existing
`APPLICATION_CACHING_DRAFT_PREVIEW=1` flag. Normal reading/navigation is unchanged.
Existing rejected studies are retained for comparison and recovery.

## Implementation and checks

New artwork and paced scene; existing finite-animation player retained for
visibility, background suspension, pause/replay, reduced motion and cleanup.
The two scenarios share one clock. Below 600 px they stack in the same order;
the timing remains shared, so this is the same experiment on phones.

`node src/components/application-caching/rethink/check.mjs` checks the first miss,
fill ordering, four hits, identical five-answer totals and 441 finite frames.
The previous player checks remain applicable because the player is unchanged.

Redis's R mark comes from Simple Icons, `icons/redis.svg` (CC0), rendered with site
ink tokens. Other drawing is original SVG and all colours use site tokens.

Rendered review and final validation are recorded below when complete. Aesthetic
selection remains the user's judgement; passing checks does not select a style.

### Independent rendered reading

`rethink_reader` used a separate Chrome tab (IAB unavailable to that worker),
replayed the scene and watched first-miss and later-hit behaviour. Observed both
source rows active after the first miss; later saw separate name/price pieces
assembling on the left while the right had already supplied the next answer.
Confirmed the saved card remains and final answers match, at 5 reads/builds versus
1. Reported medium label overlap under the Redis card and low dark-mode guide
contrast. Label baseline moved from 244 to 254; guides now use text-secondary
rather than the faint rule token. Coordinator confirms those bounded repairs.

Initial rendered pass also found inherited article `max-width:100%` clipping the
intended 900 px figure and generic section margins adding excess space inside the
scene. Both are locally overridden. No shared article CSS or animation player was
changed.

### Delivery checks

Coordinator confirmed the label clearance and stronger guides in the final 900 px
wide desktop rendering. Checked 1280 × 720 and 375 × 900, light and dark; no
horizontal overflow. Both scenarios fit in a 753 px stage on the tested phone,
with the same shared clock. Saved screenshots show both final states and a paused
working frame: third source read/second build on the uncached side while a cached
copy is already returning on the other side. Keyboard replay, pause and resume
worked; progress remained at 0.5072 while paused. Original System theme and normal
viewport were restored. Reduced-motion behaviour reuses the unchanged player's
previous controlled checks; no new browser-level reduced-motion emulation was used.

Final draft `pnpm build` passes all error rules. The same 36 unrelated dense-prose
warnings in 16 pages remain. Frame/sequence checks pass. A separate normal Astro
build to `/private/tmp/staycurrent-rethink-normal` succeeded and its new preview
route is absent. Work remains a draft prototype, with aesthetic selection open.
