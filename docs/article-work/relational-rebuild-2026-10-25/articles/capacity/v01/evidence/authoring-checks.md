# Authoring checks

First complete source ready for the coordinator's independent first review. No independent review, build, install, server launch, git action or publication performed by this writer.

## Author reread and model checks

Reread complete source and rendered reading against the fixed-reference approach, including headings/captions/controls. Four drawings carry the main distinctions: queued versus borrowed versus executing/waiting; stable mean occupancy; one aggregate pool budget; overload as an explicit partition of arrivals. Short qualifications prevent treating the illustrations as measured performance. Resources, work classes, headroom and validation develop those distinctions without duplicating diagnosis or native procedures.

`node evidence/verify.mjs` passed on final article source. It extracts the actual displayed SQL, executes it in PGlite, asserts 103 pending then 101 paid, confirms all three starting orders remain, checks all canonical neighbour links against the packet and checks rate/budget/backlog arithmetic. It also checks population conservation at every stage of both seven-request overload branches, running <=2 and bounded queued <=2. See verification.json and verification-console.json. This is a model check, not server load evidence.

## Rendered author checks

Owned source preview: http://127.0.0.1:4658/review/article/. Inspected every drawing at 1280×720 and 375×720, Light and Dark. Mobile article width/scrollWidth 375/375; all four figures width/scrollWidth 343/343. No figure overflow, clipped labels or unusable control layout found. Tables and SQL retain their supplied contained scrolling. Long mobile figures naturally require vertical scrolling. Text alternatives are present for the stepped figures; their complete source state sequences agree with the drawings. Occupancy equations and budget equations provide textual equivalents.

Exercised Figure 1 all six stages, Back, Next, Reset, Play/Pause and keyboard Enter; Figure 4 all five stages in both options, Replay/Pause, Back/Next/Reset and keyboard Enter. Native select keyboard Space→ArrowUp→Enter changed the overload policy and the counters/explanation followed it. Checked 4/6/10 instance budget options and displayed 68/92/140 totals. Saved ui-control-states.json contains 17 captured states (six journey, ten overload, one intermediate budget); initial/final budget options also appear in screenshots and observed page state. Browser warnings/errors: none returned. The attempted Back click at the first stage was correctly unavailable (aria-disabled); subsequent keyboard Back was checked from the next stage.

Both theme text/graphics contrast calculated from actual computed CSS in ui-colours.json; numeric results in contrast.json. Main text 13.73:1 light / 10.89:1 dark; secondary text 6.05/6.15; active chip text 13.22/10.12; meaningful active outlines/squares 5.52/8.77. The unfilled occupancy-square outlines are decorative common-scale placeholders; the counts/equations carry their meaning. Layout panel rules do not carry data. Sources start closed at the absolute bottom, with no figure-label headings in the contents.

Screenshot samples: desktop-light-journey.png, desktop-light-overload.png, mobile-light-overload.png, mobile-dark-overload.png. Additional views were inspected in the browser without retaining duplicate screenshots. Controls stopped and reset; private preview restored to System theme and 1280×720. Main/reference origins' themes were not changed. Owned browser tabs closed after checks.

## Compilation and limits

Coordinator owns compilation. Initial compilation succeeded but source changed during that run, so it was not a stable freeze receipt. Final stable compilation passed with source unchanged, confirmed by the coordinator after the last source edits. Source hashes are recorded in source-hashes.json, including the packet, current skills, shared example, article, component/CSS, shared stepper and SQL verifier. No edits after that stable request. No full assistive-technology/screen-reader run or real load test was performed. All performance rates remain explicit assumptions; independently reviewed quality remains pending.
