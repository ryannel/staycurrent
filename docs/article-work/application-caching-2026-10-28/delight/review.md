# Scoped design and implementation review

28 October 2026. All six introduction figures have been rebuilt from the three designers’ alternatives. This is a working visual exploration for the user, not approval to convert other articles or publish the collection.

## Teaching and continuity

The designers independently cross-checked one another’s pairs. `crosscheck-identity-change.md` and `crosscheck-burst-memory.md` retain their findings; the read/placement reader reported that source ownership, assembly-before-copy, cache reuse and process boundaries remained coherent. The coordinator reread the introduction and captions against the unchanged shared example. No new mechanism or production guarantee was introduced.

The source still owns accepted changes. App A builds the card and controls cache-aside. North’s £20/£22 and south’s £18 remain distinct. The sorter compares alternative prefilled key designs, rather than claiming an atomic migration. Invalidation stops after deletion and excludes overlapping reads. Four callers still receive four answers after one shared fill. The adjustable memory example retains P7 and displaces one, two or three of the subsequently requested cards, with the corresponding hit/miss counts. Both admission choices return the original large answer.

The default scenes require no interaction. Additional readers, a request from App A, alternate key identities and the answer-size slider each ask a small, specific follow-up question. Replay restores the full default story for action-based scenes; the memory replay preserves the chosen size. Direct interactions use shorter choreography than the initial explanation. The previous step panels and selectors are not used.

## Rendered checks and repairs

Inspected all six figures in the actual article through CUA, at desktop width and 375 px, covering dark and light appearances. The page has no horizontal overflow at 375 px. Captures under `screens/` include retained outcomes, the stale-price interval, the local-ownership variation, both key designs and all three memory sizes.

Accepted repairs are complete:

- The first source route and travelling facts now pass to the left of the App A labels and below the outcome badge.
- The process-placement extra action now asks from App A, revealing a local hit as well as a shared hit; it no longer duplicates Replay.
- The shared press has clearance above its result label, and P40’s label clears its mug.
- Meaningful paths have stronger contrast. The sorter paths exceed 3:1 even against their halo colours; the light workshop threads measure 3.80:1; the cache shortcut uses its full theme colour.
- The invalidation ending retains “was £20” inside the empty sleeve. The source/copy disagreement is also visible for several seconds before removal.
- Optional interactions respond more quickly than the default demonstration. Slider alternatives update immediately, including their image alternative and spoken unit.

Keyboard checks exercised Another reader, Pause/Resume, Replay, Ask from App A, both key choices, and the memory slider at 1, 2 and 3 KiB. A paused scene retained exactly the same progress across subsequent work. Offscreen scenes wait and finished drawings remain visible. The application-caching site check clears all 14 rules, including dense prose. The full draft build passes with the same 36 pre-existing dense-prose warnings in 16 unrelated pages.

`check-player.mjs` checks visibility, reduced motion, background suspension, completion, action variants, the range, replay and cleanup in a controlled environment. It also renders 1,212 frames across all scenes and variants, checks finite geometry and verifies unique document-wide SVG IDs. This audit passes. Browser reduced-motion preference emulation was unavailable; the actual branch is covered by the controlled audit and source inspection. There was no formal screen-reader or physical-touch-device session.

The drawings are illustrative, not service measurements. Prior Redis/adapter execution evidence and unrelated article reviews remain applicable. These records supersede the introduction’s preceding visual trial. The user’s judgement of the aesthetic direction remains open.
