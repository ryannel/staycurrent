# Batch 25 initial blind reader notes

Version: pg-plans v01; fixed manifest review-source.json. Independent finished-page reading on 127.0.0.1:4606, before consulting the plan, example facts, author notes or any verdict. No edits to content.

The illustrations explain different units clearly: repeated lookup rows versus report totals (Figure 1); nested inclusive buffer counters (Figure 2); an estimate change that leaves work unchanged (Figure 3); an order-supplying access path that removes the sort and permits early stopping (Figure 4); memory allowance and temporary work (Figure 5); participating processes versus total rows (Figure 6); and generic/custom routes for skew (Figure 7). Figure 7's rare selector visibly changes the custom route and population while retaining the generic bitmap route. Figure 1 stages 1–5 have coherent explanations and Reset returns to stage 1.

The argument is connected and practically careful. “The scan estimate becomes accurate, but the scan still examines the whole table” is a particularly useful distinction. The direct-report comparison avoids treating fewer buffer accesses as proof of lower latency. Headings use recognisable PostgreSQL subjects. The references' same concrete mechanism → measurement → conclusion pattern is present in the access-path section.

Potential points for further bounded checking: Figure 1 is tall; when using its bottom controls at desktop width, the upper highlighted scan nodes are out of view, although the current stage explanation remains next to the controls. Assess phone behaviour before deciding whether that is a substantive issue. The native plan output is represented only by an inner-scan excerpt; assess whether the reader's commissioned understanding requires more instruction on finding and traversing the native tree. Neither is yet a confirmed finding.

Initial limits: desktop dark/System screenshots and all figure labels/captions; body read in rendered accessibility text. Phone, explicit light theme, playback and plan/outcome alignment still pending. No database execution or claim verification performed in this blind reading.
