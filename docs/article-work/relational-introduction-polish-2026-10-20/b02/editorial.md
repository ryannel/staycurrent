# Editorial recheck: relational introduction, b02

**Verdict: pass. E1–E3 are closed. No remaining editorial findings in the changed material.**

This was a narrow recheck of the finished article and DecisionFigure changes against the b01 editorial findings and the previously read Sequence diagrams, Indexes, and Storage and durability standard. Inspected the frozen b02 render at `http://127.0.0.1:4439/review/relational-next/`. The current article and DecisionFigure hashes match the b02 manifest. Unchanged material was not reviewed again; no planning material, writer rationale or prior approval informed this recheck.

## Closure

- **E1, P2 — closed.** `a00.astro:78–81` introduces R103 as a purchase-attempt identifier, explicitly separates it from customer and order identifiers, and retains that term when discussing retries and the recorded result. Figure 3 uses the same noun in its initial state, caption and final narration. The new payment-request wording also names what must be reused. The qualification about an overlapping attempt still able to commit remains. In the rendered committed branch, the final explanation connects inspection using R103 to the risk of a duplicate purchase under a new identifier; the previous ambiguity is removed.
- **E2, P3 — closed.** `a00.astro:75,78,93,96` removes the abstract “values and authority” sentence, attributes rejection to the database rather than to a “refused constraint”, and describes the existing orders, older applications and optional delivery-instruction column directly. The surrounding explanation still reads naturally.
- **E3, P3 — closed.** `a00.astro:124` now states verification dates and the final illustrative-model boundary without recounting when figures were added. It retains the useful distinction between separately checked SQL and figures that do not execute the server.

## Additional changed figure wording

**Figure 4:** inspected the candidate-location stage for both scan and index routes and the following table-read stage. The added “Candidate location” card and route text make the intermediate result visible. “Page 3, found in index” together with “No table page visited yet” distinguishes knowing where to read from doing the read. The scan alternative explains why that location is not yet known. The caption continues to state that the index’s own pages are not counted, so the added wording does not overstate the displayed work counts. No editorial repair requested.

**Figure 5:** inspected the immediate-requirement and completed staged paths. The title, control, cards and narration now consistently identify the delivery instruction. The longer labels remain readable in the inspected render; the optional-column instruction in the following prose connects clearly to the staged figure. The caption preserves the historical-value qualification. No editorial repair requested.

The temporary browser tab was closed. No viewport or theme setting was changed. No source edits, builds, Git operations or nested reviews were performed.
