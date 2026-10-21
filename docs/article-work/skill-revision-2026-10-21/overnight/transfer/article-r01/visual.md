# Visual review · article batch · coordinate root and gestures · D-ARTICLE-r01

Candidate: D-02. Independent first coverage; no edits to the frozen articles or preview.

Inputs read: [fixed manifest](manifest.json), [mechanical whitelist](mechanical-inputs.json); the rendered root and gestures routes at port 4343; rendered media inventories and calibration figures from Sequence diagrams, Indexes, and Storage and durability; the frozen review skill, visual perspective, figures skill and stepped-figures reference. Mechanical records actually consulted: a00 source-version, theme-contrast-r05, final-browser-r06, download-applicability and download-browser-r05; a01 source-receipt-r02 and browser-receipt. Source hashes in those provenance records agree with the manifest. No plans, author work narratives, previous findings or other review reports were read.

UTC: first explicit clock receipt 2026-10-21 22:16:01; final observation/lease release 22:21:29. Browser inspection began before the first clock receipt. Fresh evidence is in [visual-evidence](visual-evidence/).

Highest severity: **critical** (one caption/result contradiction; coordinator to decide acceptance).

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. First reading alone | pass | Inspected the media inventory, drawings, tables, listings and controls before deliberately reading their surrounding explanations; first readings below. Browser bootstrap also returned a whole-page accessibility tree automatically. |
| 2. Form fits the content | finding | The ladder, arithmetic tables, pivot comparison, inverse trace and live mappings suit their questions. The gesture caption overstates what the selected shortcut does: visual-2. |
| 3. Readable at a glance | finding | Labelled row cards preserve root numerical comparisons on a phone. Syntax contrast and three narrow child table captions require repair: visual-1 and visual-3. |
| 4. Interaction | finding | All 12 order states, 12 recorded Card comparisons and four Pan presets were used. Direct Card and captured Pan worked, as did keyboard sliders, chosen pivot, centre reset, zoom limits and root mapping controls. The static shortcut claim disagrees with some results: visual-2. No article has timed playback or Back/Next steps; playback timing/end-step focus therefore do not apply. Range focus remained on the range at its maximum. |
| 5. Themes and phones | finding | Actual dimensions verified as 960 × 873 and 375 × 812; both article themes inspected. Document width was 375 at 375, with local code scrolling. Controls retain a nearby numerical summary. Failures are syntax colours and caption layout, rather than page overflow: visual-1 and visual-3. |

## First reading

These are apparent meanings from media and their own captions, before the deliberate in-place prose reading.

| Media | Apparent meaning / uncertainty |
| --- | --- |
| Root Figure 1, Space ladder | The same point has five named coordinate pairs. Local axes turn between Group and World; the caption explicitly prevents treating miniature scale as numerical scale or coordinates as current browser positions. |
| Root Figure 2, Point and step | The two positions receive placement offsets, while their difference cancels translation, turns direction and doubles at view scale. Real row/column headings make the comparison easy. |
| Root rotation equations and unit circle | A clockwise unit step has cosine/sine components in the depicted downward-y frame. The angle arc and component strokes agree. |
| Root Figure 3, Pivot comparison | The dashed card is the common starting shape; a different fixed cross makes the card orbit its origin or turn about its centre. The displayed centres distinguish the outcomes. |
| Root Figure 4, Two steps and an origin | One mapped origin and two mapped basis directions specify the placement. Stroke enlargement is explicitly schematic, so the drawn lengths need not be unit lengths. |
| Root equations and affine matrix | Two scalar output rules become rows of a matrix applied to a point column. The final 1 admits translation. The composition expression gives a named route whose rightmost factor starts the journey. |
| Root Figure 5, Follow the card | Intermediate point positions and accumulated six-coefficient mappings reach the same destination. Mobile row cards keep each destination with its two values. |
| Root Figure 6, Pan then zoom? | The first pan arrow remains fixed while the second grows with zoom; changing the emphasis also changes the textual answer and outlined panel. I initially needed the supplied axis note to distinguish a pan arrow from the full point route; that note resolves it. |
| Root Figure 7, Out and back | Four explicit reversals recover the original local point. A numbered trace is clearer here than animation. |
| Root four implementation listings | SVG nesting, matrix construction, painting, then guarded client-to-local input form a usable implementation order. The last listing is longer but each guard protects the same conversion. Syntax comments looked noticeably faint. |
| Root Figure 8 and downloadable editor | A live card responds to view controls and the browser can report its actual matrix and local roundtrip. The fixed arithmetic elsewhere is clearly a different kind of evidence. The standalone editor has the same controls in a simpler presentation. |
| Root Figure 9, Half-size editor | Two static calculations isolate the bridge scale while retaining the same offset. These are comparison snapshots, not a resized live screenshot. |
| Root Figure 10, Collapsed group | Distinct local points reach one client point, making recovery ambiguous. The trace deliberately avoids pretending that SVG painted a singular card. |
| Child Gesture promises table | Each operation names the retained point and the parameter that changes. |
| Child Gesture comparison | A filled anchor should reach a cross; a linking line exposes a miss. Starting state, operation and algorithm expose distinct decisions. The caption initially suggested every shortcut would miss; actual operation later showed that prediction is too broad. Upright labels, the legend and numerical output make the drawing interpretable at both widths. |
| Child four-space displacement miniatures | One movement receives different length/direction descriptions through C, V, W and G. The separate round object distinguishes moving the board from moving only Review. |
| Child element/inverse table | The chosen SVG element determines which coordinate space an inverse returns. |
| Child lifecycle table | This is a sequence of mouse-button events and the editor's completion policy, not a claim that these rows were an observed browser recording. |
| Child symptom/check table | Each visible failure points to one mapping or lifecycle decision to inspect. |
| Child handlers, connection listing and shared calculations | Collapsed complete implementation is available after the main explanation; the visible connection lists the four named SVG roles. The browser event log and current-mapping disclosures are visibly separate from recorded geometry. Long lines scroll locally; syntax contrast is weak. |

In place, the surrounding explanations account for the meanings above, including fixed versus current coordinates, the chosen pivots, finite inverse guards, current mappings after resize and the limited gesture scope. No additional missing visual explanation was found beyond the findings below.

## Findings

### visual-1 · medium · both articles, syntax-highlighted implementation listings

Problem: Several colours fall below the required 4.5:1 body-text contrast. At 13.12 px, light-theme orange parameters (`event`, `message`) are **2.983:1**, red keywords/operators **3.910:1**, and grey comments **4.116:1** against `rgb(240,237,229)`. Dark-theme comments remain `rgb(106,115,125)` against `rgb(38,35,32)`: **3.246:1**. This affects the root input implementation and the child's connection/handler calculations, including comments explaining coordinate roles and synchronous rendering.

Effect: The reader must strain to read parts of the executable example and its explanatory comments. A receipt measuring the main figure foreground does not establish the contrast of these syntax tokens.

Suggestion: Adjust the syntax palette against the actual code-panel backgrounds in each theme, then measure every used token colour at the rendered size.

Evidence: Fresh computed colours, backgrounds and sizes in [root colour evidence](visual-evidence/syntax-colours-root.json) and [child colour evidence](visual-evidence/syntax-colours-child.json), calculated with sRGB relative luminance. See [light phone code](visual-evidence/gesture-code-phone-light.jpg) and [dark desktop connection code](visual-evidence/gesture-code-desktop-dark.jpg).

### visual-2 · critical · gestures, Gesture comparison caption

Problem: The caption unconditionally says “the shortcut misses”, but **Baseline → Card → Reuse pointer-down inverse → Reveal movement** reports Grab C (480,420), target C (480,420), and Card G (40,0). The same reuse option succeeds in Half-size SVG and Turned view + half-size SVG, because their mapping does not change during the recorded move. It misses in Resize between moves. The figure therefore contradicts its own caption in selectable states.

Effect: A reader may learn the wrong condition: that storing an inverse itself produces a miss, rather than that reuse fails when the relevant mapping changes. The prose below is more precise, but the figure's standalone explanation should agree with the result in front of the reader.

Suggestion: Make the caption distinguish the divide-by-zoom shortcut from reusing an inverse across a mapping change, or make its outcome explanation follow the selected state.

Evidence: [Caption, selected reuse option and successful result together](visual-evidence/gesture-stale-baseline-caption-desktop.jpg); all twelve Card outcomes in [recorded outcomes](visual-evidence/recorded-outcomes.json). The text disclosure also agrees with the successful numerical outcome.

### visual-3 · medium · gestures, three table captions at 375 px

Problem: Captions of the row-card tables occupy their longest-word width rather than the available table width. Fresh measurements at 375 px: Gesture promises **60.49 px**, lifecycle caption **73.63 px**, Find the broken promise **53.14 px**, despite each table being **343 px** wide. The lifecycle caption becomes eleven lines and **253.34 px** tall. The adjacent two-column element-mapping table's caption correctly uses 343 px.

Effect: The reader encounters a vertical strip of isolated words and substantial empty space before reaching the rows. This is avoidable decoding and scrolling in an otherwise helpful mobile presentation.

Suggestion: Make row-card captions span the available width, or render them as normal full-width captions/headings outside the converted table layout.

Evidence: [Lifecycle caption at 375 px in light theme](visual-evidence/gesture-lifecycle-caption-phone-light.jpg). The same narrow layout was observed in dark theme; the table rows themselves fit without document overflow.

## Verification and limits

- Root: every order setting operated; both numerical orders agreed with their plots and summary. Zoom min/max retained range focus. Live numeric zoom/angle/pan inputs, centre turn, anchored zoom, half-width, reset, Check current mapping and an inside-card pointer press were used. Baseline and turned/zoomed/half-width roundtrips returned O (10,10); displayed coefficient differences were zero or small floating-point differences. The current browser's numerical positions were treated as current observations, never the fixed C snapshot.
- Child: all 12 Card and four Pan recorded comparisons operated freshly. Keyboard changed zoom by 0.25 and angle by 15°. Repeated ×1.5 requests at zoom 4 retained the chosen V target and unchanged compensation at the bound. Choose pivot and Use SVG centre were used. A direct Card drag completed; a direct Pan continued from x550 to x830 beyond the SVG's right edge x783, then released capture. The log showed trusted pointer events, capture, completion and capture loss; these are browser-driven inputs, not physical-device certification.
- Downloaded editor: served asset URL matched the whitelist applicability record and frozen source hash. Fresh desktop and actual-375 inspection/control use confirmed its centre-turn, anchored zoom, half-width and roundtrip. It offers no article theme chooser; the standalone presentation inspected was light. [Phone evidence](visual-evidence/download-editor-phone.jpg).
- Reference calibration used the rendered figure inventories and representative rendered diagrams/data layouts from all three reference articles; it was calibration, not an audit of those reference articles.
- The Mac was locked; Chrome's DOM, screenshots and browser-driven input remained usable. The first attempted browser selection timed out; Chrome then supplied the review. The viewport capability affected the newest selected tab rather than older tabs: every phone claim above uses a separately measured 375 px tab, not the setter's success response.
- The whitelisted a01 browser receipt contains a qualitative sentence about readable phone screenshots. It was encountered when checking mechanical provenance, excluded from the judgement here, and replaced by fresh screenshot/control inspection. Other author notes/earlier quality opinions were withheld.
- No native pen/touch-device, button-chord, forced-cancel, failed-capture, cross-browser or exhaustive accessibility result is claimed. No timed article playback required checking. No source, build or preview was changed. No publication action occurred.
- **Viewport/theme lease released at 2026-10-21 22:21:29 UTC.** Article theme restored to dark; the final remaining article tab was verified at 960 × 873. Temporary review tabs, including the 375 px targets, were closed and temporary viewport overrides reset.
