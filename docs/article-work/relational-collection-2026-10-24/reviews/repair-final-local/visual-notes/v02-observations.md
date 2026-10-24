# v02 focused visual observations

Reviewer: fresh informed visual confirmation subagent `collection_final_local_visual_v02`, 24 October 2026. Browser: CUA only, own background IAB3 tab 1; current preview origin `http://127.0.0.1:4560`. No other browser surface used. Manifest SHA-256 checked as `1aef05969d6a80c22dbf2c11b43ab6c9900364d373f06ad40318ba25d7b1f1db`, 171 inputs.

## Size/theme observations

- Actual DOM viewport verified at 1280×720 and 375×812. Explicit Light/Dark selected through the site's theme radios. r05, r20 and r42 viewed in both sizes and themes.
- At 375×812 the page's measured width was 375 for r05/r20/r42. r42 figure width and scroll width were both 343. Its two source tables stack, preserving headings and values. r20 tracks stack label-over-position cells and retain the fresh-query answer, changing explanation and controls in reading order.
- r05 append code has client width 343 and scroll width 466 on the phone. Its region is focusable (`PRE`, `tabindex=0`); a real held Right key moved `scrollLeft` from 0 to 40. The overflow belongs to that code region, not the page. The two-result comparison fits without horizontal scrolling.
- Current screenshots inspected in the CUA output covered the figures, result/control areas, expanded alternatives and r08/r34/r54 changed paragraphs. No screenshot files were exported.

## Controls and state meaning

- r20: all five states traversed with Next; first state also restored by Reset. State four has durable replica positions through 2, replay 0 and no order 103. State five has replay through 2 and order present. Expanded the five-item alternative; its new fourth item contains the process-crash/flush qualification. Used Play, Pause and Replay. Next retained focus at 5/5 with `aria-disabled=true`; Back retained focus at 1/5 with `aria-disabled=true` after native keyboard activation. Native key input was used because the semantic press helper waits on the intentionally unavailable endpoint action.
- r20 page-clock playback samples (milliseconds since Unix epoch): 1792834811884–1792834816116 state 1; 1792834817529–1792834823183 state 2; 1792834824595–1792834830248 state 3; 1792834831659–1792834833065 state 4; 1792834841594 state 5. Sampling at about 1.4 seconds gives approximately seven-second holds; it is not subsecond measurement. A separate Replay followed by Pause returned a stable, manually navigable first state.
- r42: all five unsafe states and all five safe states traversed. Changing the branch at 5/5 retains the step and immediately changes the returned answer to its corresponding final answer; Reset returns that selected branch to 1/5. Unsafe effective identity is shop_owner, with unqualified temporary-table selection and 999. Safe effective identity is catalogue_code, qualified real-table selection, session-user policy and 20.00. Original runtime_10 session identity remains fixed. Next at the final step retained keyboard focus and `aria-disabled=true`. Back/Next keyboard activation exercised. Expanded the complete text alternative. Played safe branch from 3/5, observed progression to 4/5, then actually paused.
- r42 page-clock samples: state 3 at 1792834978163, 1792834979573, 1792834980980 and 1792834982393; state 4 at 1792834986391 and 1792834987802. Hidden-tab timer scheduling makes this a coarse hold observation. All branch explanations were separately read at paused/manual states.

## Computed contrast observations

Read-only CUA DOM inspection collected computed text/background colours. Transparent ancestor backgrounds were composited before calculating sRGB relative luminance and contrast. Representative minima:

| Area | Light | Dark |
| --- | --- | --- |
| r42 muted figure notes, source descriptions and lookup labels | 6.61:1 | 6.83:1 |
| r42 alternative disclosure | 6.03:1 | 9.74:1 |
| r20 conceptual/model note | 6.61:1 | 6.83:1 |
| r20 filled progress cells | 13.73:1 | 10.89:1 |
| r05 article text scan, excluding empty decorative nodes | at least 6.03:1 | at least 6.15:1 |

Main body/result text is higher contrast. The r05 scan included unchanged media as well as the changed section; empty decorative-node text was excluded from the reported minimum. State selection has words, checkmarks or dashes as well as colour.

## Mechanical context consulted

- r42 native receipt reports PostgreSQL 18.6, original runtime logins, unsafe other-shop 18.00, temporary shadow 999, corrected 20.00/18.00, and forced owner/bypass distinctions. The frozen download hash matches the supplied original mechanical source-hash entry; no new execution claim is made here.
- r20 native receipt reports target LSN 0/300DC58, paused receive/replay 0/300DC58|0/3000000, absent order before replay, present order in a new snapshot after replay, and absent order in an old retained snapshot. Its boundary is one owned machine with replay deliberately paused, not measured network delay or a separate-storage failure.

## Cleanup

Selected System using the site control; reset viewport override; observed actual width 1280, height 720, checked theme value `system`, resolved theme `dark`. Closed own tab and notified the coordinator that the IAB3 lease was released. No Chrome/global OS settings changed.
