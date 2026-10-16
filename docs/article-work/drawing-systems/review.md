# Drawing systems and processes: completed draft

Status: **ready as a draft**, 16 October 2026. Ten complete articles, 54 original editable SVG illustrations and a two-page printable shape reference. The collection begins at `/learn/drawing-systems/`. Article sources are in `src/articles/drawing-systems/`; the route, layout and collection definition are separate from public reading-directory entries.

## Structure and independent review

The user commissioned the full section and specifically requested blind and adversarial structure reviews. Both were performed before the main production assignments. `structure-blind-review.md` preserves an uncued first reading; `structure-adversarial-review.md` records expected coverage before the reviewer saw the proposal. `structure.md` records the resulting decisions.

A new independent reader followed the complete ten-article journey and preserved questions where they arose in `blind-collection-review.md`. The final informed recheck found no unresolved consequential teaching or visual-meaning gaps in the reviewed material. An additional independent editorial reading of the introduction, layout and maintenance articles is in `editorial-review.md`, including an explicit writing judgment after repairs. The coordinator also read the assembled sources and inspected representative rendered figures.

Consequential repairs included:

- Give someone heading into a meeting an immediate route into drawing, with composition before the shape catalogue.
- Show the actual BPMN boundary-event marks and cancellation scope, rather than only naming the machinery.
- Correct an implied receipt-before-worker guarantee: the worker depends on the committed job, and can run before or after the browser receives its response.
- Keep RepairRequest distinct from an Appointment or booking throughout the vocabulary examples.
- Use activities in the process/lifecycle comparison; keep the lifecycle state name In repair consistent.
- Make the before-layout critique describe the visible down/up path, and move sequence labels clear of headers, strokes and frames.
- Compare the same worker and queue in opposite directions to show a structural use relationship versus information movement.

The blind record distinguishes the initial reading from informed rechecks and states its limits. It is agent review, not a human novice study. Timed drawing exercises are practice suggestions, not measured performance claims.

## Verification

`pnpm build` completed successfully after integration and final reference metadata changes: 88 pages built. The build emitted existing PGlite dependency warnings about browser-external Node functions and eval; no new drawing-section build failure remained. Markdown was moved out of `src/content/` to avoid an implicit legacy Astro collection.

`browser-verification.json` records **40 assembled views**: all ten articles at 390 and 1280 px, in light and dark. Every page returned 200, every image loaded and had alt text, contents anchors resolved, no page overflow occurred, and there were no browser page errors. Full-page captures are in `screenshots/`. Independent reviewers inspected meaningful figures, not only DOM measurements. The later site theme switcher was separately checked with forced dark on a light system: the SVGs followed the selected scheme and the phone page did not overflow.

Eleven unique internal destinations from the article bodies resolved, including the printable reference. The collection disclosure opened through the keyboard. Draft route metadata is noindex/nofollow. A built Pagefind query did not return the draft section; it remains absent from the reading directory. The standalone reference also carries noindex/nofollow.

`svg-verification.json` records the final geometry check with no text outside SVG view boxes. The six Mermaid examples rendered with Mermaid **12.2.0** in Chrome, installed outside the project. Their rendered SVGs and exact input sources are preserved in `mermaid-render-check/`. The author compared message order, identities and frame meaning with the instructional figures. The printable reference was checked at phone width and printed to two A4 pages.

## Delivery and shared-checkout state

The current preview is available locally at `http://127.0.0.1:4332/learn/drawing-systems/`. It is explicitly labelled as a draft. This commission does not itself authorise publication, and this agent has made no commit, push or deployment.

During work, another operation in the shared checkout committed and pushed a provisional snapshot in 6e6cd1b and badb1c7. Those commits were preserved; they precede the final review repairs and source-directory move. See `evidence.md`. Other concurrent work, including search and the site theme switcher, was not rewritten as part of this commission.

The examples deliberately describe an invented repair service. They teach drawing choices and bounded notation; they are not executable BPMN workflows, a verified production architecture, or a full course in threat modelling. These boundaries are stated where needed in the articles. No known material issue remains in the commissioned teaching work.

## Delivery authorisation

The user's follow-up on 16 October 2026 asks for commits and pushes to `origin/main` at relevant delivery points and directs that the completed work be pushed now. This supersedes the earlier no-commit/no-push boundary for this delivery. The completed collection, review repairs, illustrations and verification evidence are included together. The required build was run again successfully before committing.
