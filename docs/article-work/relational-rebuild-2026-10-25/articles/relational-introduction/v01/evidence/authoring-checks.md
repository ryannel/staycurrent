# Authoring checks · introduction

First complete source: article.astro, article.meta.json, ShopFigure.astro and model.mjs. Root owns compilation and the browser lease.

- Complete bounded reference reading retained from preparation; comparable drawings revisited in the browser.
- Full authoring reread and continuity pass completed after the first source. Scenario bookkeeping is in example-facts.md.
- Corrected the copy-versus-portion drawing to show both stock quantities explicitly in each copy; a single generic stock number could have implied the wrong tea stock.
- Enumerated all 47 model states: each renders complete HTML and an explicit step explanation. SQL checks passed in PGlite 0.5.8 / PostgreSQL 18.3; database-results.json records exact outputs and limits. Kept the concurrent schedule illustrative, with the Read Committed contract checked against primary documentation. No claim of observed concurrent waiting, native execution or crash recovery.
- Reconciled all 21 contextual destinations with input/routes.json. Approximate article source prose is 3,487 words before interactive step explanations.
- Clarified the race footer so an intermediate uncommitted write is not presented as a globally visible stock value.
- Root confirmed successful isolated compilation before browser work. Requested final compilation after the CSS correction; root owns the result and freeze.
- Enumerated all 47 rendered states/options on desktop and exercised every Play/Pause, Back, Next, Reset and text alternative. Automatic playback reached its endpoint and returned Replay.
- Inspected every figure at desktop and 375 px across light/dark checks; source prose and the static application diagram were also inspected. Mobile tables were corrected to wrap cell text with tighter horizontal padding: all five query-result columns now fit a 315 px region, with matching clientWidth/scrollWidth. Page scrollWidth stayed 375 px.
- Rechecked mobile Enter/Space playback, reset and back controls on all seven steppers. Tab reached the first-step Back button; Space kept its step and focus. Native keyboard Up/Down/Return changed the comparison. All buttons measured at least 42 px high. Text alternatives expand and close.
- Computed DOM text contrast over effective backgrounds: lowest checked text ratio 6.05:1 in light, 6.15:1 in dark. Critical highlights and focus use the site's theme-aware teal/accent. No browser console errors. Reduced-motion handling is inherited from the supplied player/global styles; no simulated preference test was performed.
- Sources were closed initially and at cleanup. Restored the original default 1280×720 viewport and System theme, reset every player (0 playing), closed the owned draft tab and released the browser lease.
- Saved representative visual evidence: desktop-recovery.jpg and mobile-query.jpg. Exact source, verifier, result and input hashes are in source-hashes.json.
- No installation, build, server, commit or publication performed by this worker. No other workspace read.
