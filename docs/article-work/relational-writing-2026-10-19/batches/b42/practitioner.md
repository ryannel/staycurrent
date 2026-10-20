# b42 practitioner repair recheck — a35

20 October 2026. **Pass: the sole required b40 practitioner finding is resolved. No required findings remain.**

Scope is the Figure 1 admission narration repair in frozen `http://127.0.0.1:4438/review/relational-next/security/`, as described in this batch's manifest. Retain the complete correctness, coverage, ownership, 58-state model and 36-case native review recorded in [b40/practitioner.md](../b40/practitioner.md), with [its successful independent native evidence](../b40/practitioner-native-run2.json). The optional worksheet cleanup and Figure 2 naming improvements remain optional; this recheck does not broaden the repair.

## Change isolation

Ran the supplied b40 `repair-check.mjs`: only the admission `explanation.textContent` assignment changed; all panels, gates, other scenes, controls and styles remain byte-identical. Independently compared the b40 and b42 article snapshots: identical. Current component SHA-256 `57451f979c285a05031da65694ee9b0a14c4c8a0582c9917b02802ae4aeee018` and unchanged worksheet SHA-256 `bbaaf949a79cbb13a7a01ed3231cb22b1cbfc7f661470b8749319be3efd0bbdf` agree with the b42 manifest.

## Rendered verification

Used documented CUA controls in a new own Chrome tab. The in-app browser was unavailable; the Chrome DOM surface worked without requiring native-app access. Read the rendered state panels and narration after each action. No source edits, native rerun, build, Git operation or download interaction.

Checked **all 12 admission choice/step states**:

| Choice | Start | Reach listener | Authenticate | Check SQL |
| --- | --- | --- | --- | --- |
| Allowed route | Route/login/object gates introduced | Listener reached, identity still to establish | Reporter established, no additional table authority | Approved view succeeds; raw-table request denied |
| Wrong password | Gates introduced | Listener reached, identity still to establish | Password rejected; no reporter session; neither SQL request can run | No SQL session established; neither query sent |
| Forbidden route | Gates introduced | Blocked before listener; authentication never attempted | Authentication never reached; no reporter session or runnable SQL | Route remains blocked; no authentication or SQL session; neither query sent |

Every narration now agrees with its panel. The previous erroneous success narration is absent from both rejected branches. The formerly generic reach-listener narration now also describes the chosen route accurately. No empty or undefined text observed.

Separately held the player paused at **3/4** and then **4/4**, changing choices in the sequence allowed → wrong password → forbidden route → allowed → forbidden route → wrong password at each step. All twelve selector changes recalculated the narration and both panels immediately, retained the selected step and kept the control labelled Play. Returning to allowed restored the correct success/projection-versus-raw-query explanation; either rejection restored the matching no-session explanation. No stale narration remained.

## Release

Own review tab closed. No native resources were created and no shared service or dependency was touched. **4438 is released by this reviewer.** The owner may retire the frozen preview when the other reviewer also releases it.
