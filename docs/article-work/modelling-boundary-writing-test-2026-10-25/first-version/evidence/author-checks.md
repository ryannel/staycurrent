# Author checks — first version

This is an orchestrator-managed first complete draft, before independent review. No review skill, reviewer, feedback packet or repair round was used. No publication, commit, push, dependency install or server launch was performed by the writer.

## Reread and continuity

Reread the complete article, figure labels, stage explanations, captions and text alternatives against the reference-led teaching approach and the intended introductory starting point. Each new term is introduced at its worked example. The row-grain example precedes keys, cardinality and dependencies; the normal-form labels follow their concrete dependencies. Safe and unsafe reconstructions precede the independent-set contrast. The current/agreed price distinction precedes derived copies. The closing changes/read walk uses those established distinctions.

The final authoring reread clarified that numbered scalar columns can pass a value-level 1NF test while still imposing an arbitrary line limit. This is an authoring clarification, not a review repair. The normalisation child retains formal key derivation, definitions, tests and algorithms; the hierarchy child retains representation comparisons and maintenance procedures. Both are explicitly planned and unavailable, with no fabricated links. Existing neighbours are only linked, never read as inputs.

Continuity pass: Mina/customer 1, Edda/customer 3, product and order-line identities, all core prices, order totals and payment amounts agree with the supplied record. P9 is on only one core line. Order 103 has no payment. Figures distinguish the catalogue snapshot from the later hypothetical 22.00 price. No stock is consumed by the hypothetical repeated-line test. No currency assigned. All displayed dates are UTC in 2026. The offer triples and independent supplier/tag memberships are distinct facts; category/subtype rules remain explicitly hypothetical. No unresolved continuity dependency.

## Illustration checks

`node evidence/verify-model.mjs` passed under Node v24.16.0; exact results are in `model-results.json`. This is a pure local model calculation, not database execution. It checks core totals, separated versus multiplied payment/line sums, keyed reconstruction, two invented order–product associations, the one invented offer triple, independent-set counts and the incorrect catalogue repricing. No SQL execution, migration, benchmark or runnable download is claimed, so no database instance was started.

## Rendered checks

Used only writer-owned Chrome tabs. Reference tabs were closed before draft checking; existing user tabs were untouched. Initial browser inventory/viewport: 1488 × 973, System resolving dark. The owned draft's normal viewport subsequently reported 1488 × 917 before any explicit override; temporary responsive override was 375 × 812.

Inspected every finished figure at desktop and 375 px, in both light and dark themes. Inspected all four stages of both stepped figures and the changing table layouts; no page-level horizontal overflow at 375 px. The flattened and decomposed line tables deliberately scroll within keyboard-focusable, labelled regions. The other figures fit the narrow page. First mobile inspection led to removing an unnecessary minimum width on the line/payment comparison and adding the line-table scroll instruction. Final source was reloaded explicitly because Astro's CSS refresh did not always refresh server-rendered slot text immediately.

Exercised Play/Pause, Next, Back, Reset and Replay; observed timed progression from the initial state to the next step. Checked the first/end aria-disabled states. Keyboard Enter activated Back and Reset and opened/closed both text alternatives. Keyboard ArrowRight scrolled the wide line table (157 px observed of 175 px available). Checked source disclosure and theme choices. Shared stepper handles hold timing and reduced motion; its reduced-motion hold-bar branch is preserved. No OS reduced-motion preference was changed and an OS-level reduced-motion session was not tested.

Contrast was computed from rendered colours in both themes. Sampled text pairs across table cells, labels, captions, controls, counter, invented rows and matched rows: minimum 5.46:1 dark and 6.05:1 light. Matching outlines and control focus use theme tokens exceeding 3:1 against adjacent surfaces. Invented associations also carry words and wavy underlines; text alternatives state the marked-pair reasoning. Light table rules are decorative, not the sole carrier of an association.

Root owns build/infrastructure. Root reported one successful isolated Astro build during authoring; the final build result will be reported separately at handoff. Browser cleanup/restoration and final source hashes will be recorded before return.

Final confirmation: root reported the final isolated Astro build passed (one page, no compilation errors). The last authored prose clarification was saved before the final-build message and was confirmed in the reloaded preview. All in-page fragment targets resolve. Sources disclosure opens/closes by keyboard. Match-outline contrast measured 5.24:1 light and 7.97:1 dark.

Restoration complete: the temporary viewport override was reset, returning to the owned draft's initial normal 1488 × 917 viewport; System theme selected, resolving dark. All writer-owned reference and draft tabs are closed; the automation session lists no remaining owned tabs. No user tab or global OS preference was changed.

Final handoff version: `modelling-first-draft-v01`. `first-version.json` records the exact source file hashes. The source is ready to freeze unchanged. No further content work or independent review has been initiated.
