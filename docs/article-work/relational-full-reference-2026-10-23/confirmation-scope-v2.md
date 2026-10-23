# Confirmation scope · complete introduction v2

Accepted reader problems and pass conditions, plus the current changed locations. This supplies repair context; it contains no earlier review verdicts or author quality notes. Frozen-v2.json identifies the complete current source/preview.

## D1 · medium · first encounter with a table and relationships

Problem: the former first definition immediately asked a newcomer to interpret four related tables without visibly establishing one row/column or doing the matching work. Pass: establish what one row and one column mean through a concrete visible example before relationships; the reader can then follow a reference using that understanding. Form is the writer's choice.

Changed locations: the facts section adds ProductTable (Figure 1), a row/column reading prompt and an interpretation paragraph. It introduces the kinds of fact in customers/orders/order_items before the relationship prompt. ShopFacts (now Figure 2) is restructured to selected matching rows and explicit named-value transitions; the full figure is changed. Check the transition to primary/composite keys, prices and the later history query.

## D2 · medium · one coherent example moment

Problem: existing order 103 and its lines appeared beside pre-purchase stock, requiring an invented unfinished-order lifecycle. Pass: each illustrated state has one coherent moment, rewinds are established before use, and changes agree across the purchase and later examples.

Changed locations: productsAfter103 is derived from the unchanged starting products/items; opening figures use 10/0/4 after order 103 has been accepted. The first purchase paragraph explicitly rewinds to no order103/lines and stock1/12. Edda is introduced as a customer who can be registered without a purchase, because selected Figure2 rows no longer show her. Check after-state captions, 103 pending/unpaid meaning, query rows, transaction/atomicity statements, both race histories and later commit/request uses.

## D3 · medium · causal application explanation

Problem: a late checklist assumed parameter binding, borrowing connections and compatible rollout without explaining them or their failure. Pass: selected duties are understandable when met or give an intelligible route to their deeper owners, continuing the worked argument.

Changed locations: request section paragraph beginning “The application boundary matters on a read too” now uses customer identity/substituted value and query parameters to explain application responsibilities. The following route paragraph explains why coexisting versions affect a schema change. Check technical claims and placement/coherence with earlier SQL, lost replies, outbox and later distribution/choice.

## D4 · low · reader-facing caption

Problem: “supporting native check” was unexplained production terminology. Pass: ordinary language retains the illustration/actual-execution distinction. Changed location: purchase race Figure3 caption.

## D5 · low / required existing structural rule · figure labels

Problem: four figure h3 labels entered the document heading outline. Pass: labels stay understandable without becoming section headings; current complete draft satisfies existing structure checks. Changed locations: RaceFigure buyer/history labels use styled paragraphs, playback group/caption numbering becomes3. CommitFigure caption numbering becomes4; article cross-references updated. The first table's column boundary uses the normal secondary text colour for contrast.

## Evidence and assessment extent

All nine top-level sections retain the same argument order. SQL strings, original fixture exports, both protocol histories/events, native verifier and underlying observed results are unchanged. Only the new display export is added; evidence/repair-v2-data-check.json compares its final stock and displayed history rows with native-check.json. Mechanical-receipt-v2.md identifies current/reused checks and limits. Confirm applicability rather than treating a receipt as teaching judgement.

Teaching: complete current assessment, all seven checks, with placement judgement for every added/restructured passage/figure above. Editorial: D3/D4, all changed reader text and surroundings/dependencies with applicable checks. Visual: changed ProductTable/ShopFacts, caption/label/numbering changes, current rendering/control behaviour and affected dependencies with applicable checks. Practitioner: example states/relationships/derived data, causal parameter/identity/rollout claims and downstream consistency with applicable checks. Every checker finds new substantive issues too; these are informed confirmations, not the later independent complete readings.
