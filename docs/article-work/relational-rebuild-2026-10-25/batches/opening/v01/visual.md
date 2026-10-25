# Opening batch v01 — independent visual teaching review

Reviewed the integrated introduction, modelling and query-results drafts at `127.0.0.1:4606/review/relational-rebuild/`, using the v01 review-source manifest. The coordinator subsequently reported a DEV download-link trailing-slash correction; it does not affect the inspected illustrations. No production edits or delegation.

## Findings

No critical or medium visual teaching findings.

**Low / optional — query-results, Figure 2 caption.** “Each small box is a result row” describes the all-payments and ON modes, but WHERE mode also displays a dashed box labelled “No result row / NULL fails the WHERE test” beneath order 103. The explicit label and explanation make the disappearance understandable, so this did not prevent learning. Qualifying the caption would remove the small inconsistency between the placeholder and the definition of a box.

## Illustration-first reading and reference comparison

Before reading the bodies, I followed the figure labels, captions, step explanations and controls as a sequence. The introduction supports explaining separate customer/order/line/product facts; matched pairs becoming result rows; successful purchase versus rollback; atomicity being insufficient for the two-buyer decision; an index finding the same answer through less searching; durable commit being separate from its reply; and copying versus dividing data. The captions consistently identify invented models and their scope. The visible stock and order outcomes support the explanations.

Modelling supports choosing the meaning of a row, distinguishing a line occurrence from a product-per-order rule, reading participation in both directions, preserving three-way offers, moving repeated facts to their determinants, testing a split by reconstructed associations, separating independent memberships, preserving the agreed price, and recognising subtype and hierarchy choices. The tiny tables make the counterexamples traceable without supplying a missing business rule. Deeper procedures remain outside these overview figures as intended.

The query sequence supports predicting one versus multiple matches, seeing why a missing-payment order survives ON filtering but disappears after WHERE, deriving all four line/payment pairs, and independently summarising both sides to restore one row per order. The matrix in Figure 3 makes the repeated contributions especially direct. Figure 4 explicitly distinguishes no payment group from its zero reporting policy. The surrounding SQL and prose supply EXISTS, set operations and the final positive-balance filter; the central report construction does not depend on guessing those connections.

Calibrated against finished reference renderings: Sequence diagrams’ initial booking and labelled participant/message relationships; Indexes’ index-building figure and adjacent explanation; Storage and durability’s write-ahead-log figure and adjacent explanation. The replacement figures use less physical detail at this introduction level while retaining named facts, explicit transitions and visible outcomes. I then checked the figures in their surrounding explanations; their captions and adjoining text agree about starting data, scope and conclusions.

## Coverage and limits

Inspected every figure’s desktop rendering: introduction 8, modelling 11, query-results 4. Followed modelling’s six stepped figures through all 19 states, checking current displayed content. Sampled current introduction and query controls/states and reused the supplied mechanical coverage of introduction’s 47 states/options and query’s four figures/options rather than repeating identical player timing checks. The changed query panel headings render as clear labels.

Used 1280 × 720 desktop and 375 × 812 phone viewports, with light and dark appearances. Phone checks concentrated on line-key comparison, modelling repaired splits and independent tables, introduction’s concurrent purchase, and query matching/missing-row/multiplication layouts. All 11 modelling figures’ current phone bounds fit their 343 px content width without horizontal overflow. Several stacked figures require ordinary vertical scrolling; the current explanation remains adjacent to the controls, and small-table comparisons retain readable labels. Sampled text colours, missing-row markers and disabled controls were legible in both themes; this was not an exhaustive numerical contrast audit of every state.

Keyboard activation of modelling’s final Next step retained focus on the now aria-disabled Next control. No control/output disagreement was observed. Continuous playback timing was not independently assessed: subagent IAB is hidden and can throttle rendering. The supplied applicable timing observations were reused. Reference index playback was paused; all owned tabs were closed. Verified restoration to 1280 × 720 and System theme, with no manuscript player running. User tabs were preserved.
