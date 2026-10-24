# Visual confirmation · articles r01/r02 · batch01-v02

Inputs: [frozen manifest](v02/manifest.json); current rendered articles and isolated figures at port 4372; permitted mechanical receipts. Calibration: rendered Indexes figure 1 and its scan passage, and Storage and durability figure 3 and its P7 comparison passage at port 4350. Read the current review skill, visual perspective and figures/render checks. No article source, plan, author notes or earlier review reports were read.

Highest severity: none.

This is an informed repair confirmation, not an independent first reading or complete article review. Scope widened across r01 Anomalies and Prices, their changed labels and surrounding passages, and r02 NullFilter plus the Instant caption and surrounding passages.

## Checks applied

| Visual check | Result | Current observation |
| --- | --- | --- |
| 1. First reading alone | pass within confirmation scope | Inspected isolated figures before article prose; observations below. |
| 2. Form fits the content | pass | Comparison retains real table headings, customer/order IDs and their connecting label. Prices identifies the product and order line separately. NullFilter visibly separates stored note, predicate truth and WHERE decision. |
| 3. Readable at a glance | pass | Changed panel labels remain prominent, ordinary figure labels. Prices and Instant labels/captions wrap clearly on phones. No horizontal page overflow observed at either tested width. |
| 4. Interaction | pass | Used all three r01 choices and all six r02 predicates; summaries, truth rows and text alternatives agree. Tab/Space and selector Space/arrow/Return work; first and last choices retain visible keyboard focus. |
| 5. Themes and phones | pass | Fresh current rendering at actual 375×720 and 1280×720, light and dark. Controls stay understandable beside meaningful changing summaries/state. Numeric contrast evidence is applicable as described below. |

## Confirmation results

| Accepted problem | Result | Evidence |
| --- | --- | --- |
| r01 visual-1: controls separated from one design's outcome on phones | confirmed repaired | Both design outcomes now sit immediately below the controls. All choices fit controls plus both summaries and their explanation within a 361–381 px vertical span; the reader can understand the comparison before examining the longer tables. [Phone, light](visual-confirm-evidence/r01-phone-light-mina.png), [phone, dark](visual-confirm-evidence/r01-phone-dark-remove.png). |
| r02 visual-1: tall control stack separated condition/result from order 103 | confirmed repaired | One labelled native selector replaces the stack. In every choice, selector through the bottom of order 103 spans 591 px, or 614 px for the longer OR query. The complete relationship fits one 720 px phone view in both themes. [Light, longest condition](visual-confirm-evidence/r02-phone-light-include.png), [dark, NULL comparison](visual-confirm-evidence/r02-phone-dark-equals.png). |
| M002: h3 labels inside r01 figures | confirmed repaired | Current article DOM contains zero figure h3 elements. The four changed panel labels are 14.4 px, weight 600 paragraphs; clear boundaries and captions preserve grouping. [DOM receipt](visual-confirm-evidence/r01-labels.json), [desktop labels](visual-confirm-evidence/r01-desktop-light-anomalies.png). |

## First reading of affected figures

Anomalies shows how three changes affect a sales sheet and separate customer/order tables; the immediate two-part outcome makes the comparison clear before the row details. Prices shows catalogue 20.00→25.00 beside the order line's 20.00→20.00, identifying two independently meaningful facts. NullFilter shows three stored notes, each condition's truth value and whether WHERE keeps it; the result sentence also explains the NULL row. Instant shows one stored instant, two local clock readings and a separately retained display zone. No unresolved visual uncertainty in this scope.

## Evidence and reuse

Fresh receipts: [all control states](visual-confirm-evidence/r01-controls.json), [predicate states](visual-confirm-evidence/r02-controls.json), [phone geometry and state matrix](visual-confirm-evidence/responsive-matrix.json), [keyboard/focus](visual-confirm-evidence/keyboard.json), [expanded text alternatives](visual-confirm-evidence/text-alternatives.json). Screenshots for every phone choice and both desktop themes are alongside these receipts.

Reused only applicable mechanics: [provenance](v02/mechanical/provenance.json) identifies the executed worksheets as unchanged and matches current figure/style/data hashes. r01 PostgreSQL 18.6 [result](v02/mechanical/r01/modelling-result.txt) corroborates four name copies, independent Edda/Tariq customer rows and catalogue/agreed prices 25.00/20.00. r02 PostgreSQL 18.6 [native run](v02/mechanical/r02/native-run.json), [predicate rows](v02/mechanical/r02/predicate-native.json) and current [model comparison](v02/mechanical/current-rendering/predicate-reuse-check.json) apply to unchanged worksheet/predicate/data hashes; fresh visible results agree with all 18 truth values. [Current control marks](v02/mechanical/current-rendering/r01-desktop-controls.json) corroborate the five name outlines, Edda outline and two crossed-out order rows. The [current contrast receipt](v02/mechanical/current-rendering/contrast.json) applies to these exact rendering hashes: changed text/control ratios are at least 6.03:1, including labels, result text, small note labels and truth/verdict text. The [current structure check](v02/mechanical/structure-check.json) reports no issues; the relevant heading condition was also inspected fresh.

## Findings and limits

No new finding; visual-2 remains unused separately for r01 and r02. No accepted problem remains in this confirmation scope.

Unchanged article media, every code example, the whole collection, full reference articles and SQL execution were not independently rechecked. No playback timing applies to the affected controls. Testing used the in-app browser and native selector; it is not a cross-browser or assistive-technology audit. Temporary theme and viewport changes were restored to System (resolved dark) and actual 1280×720, overrides reset and own tabs closed before releasing the QA lease. [Restoration receipt](visual-confirm-evidence/restored-settings.json).
