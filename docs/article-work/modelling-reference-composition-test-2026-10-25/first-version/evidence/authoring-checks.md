# First-version authoring checks

Completed 25 October 2026. This is the first completed article before independent review or a repair assignment. The only edits during checks were ordinary authoring fixes: shared contents-list duplication, explicit table layout, a surface token, inherited scene margins, a narrow-screen scroll hint, and an all-candidate-key 2NF clarification/source.

## Rendered inspection

Used owned temporary browser tabs at the supplied localhost previews. Initial viewport was 1280 × 720; theme selection was System, resolved dark. Inspected all seven figures in desktop dark and light and at 375 × 900 in light and dark. Static rows/cards, table reconstruction results, captions and paragraph handoffs were visible and readable. On narrow screens cards stack and only the deliberately wide tables scroll; document width stayed 375 px. At desktop, document width stayed 1280 px. No screenshots are retained as separate files; the actual screenshot observations are in the authoring session.

Figure 4: exercised all four stages, Next/Back/Reset, Play→Pause→Play, playback to 4/4 with Replay, and Replay→Reset. Checked keyboard Enter/Space on Next, Enter on Play/Pause, Back and Reset; boundary Next reported aria-disabled=true. Opened and closed its complete text alternative with Enter. Horizontal keyboard scrolling changed the flattened table's scrollLeft on mobile (content width 523 px, region width 315 px). All states use native text/tables; the explanation has aria-live=polite.

The final source disclosure opened with keyboard Enter. The shared contents list appeared once and every in-page fragment resolved. Captured browser warn/error log query returned no entries.

## Contrast and motion

A read-only DOM calculation of foreground/background contrast across rendered figure leaf text found a minimum of 4.7635:1 in light (the teal cardinality text) and 6.1478:1 in dark (secondary card labels). Semantic arrows and emphasis use the same tokens. Pale card borders/table rules are decorative separators; text and explicit labels carry the relationships and invented-row meaning.

No separate reduced-motion emulation was performed. The only animated presentation is the shared hold bar; source inspection confirms the supplied shared player suppresses that animation under prefers-reduced-motion. Manual stepping remains available. This is an authoring check, not a full assistive-technology audit.

## Model and build checks

The focused Node calculation against facts.mjs passed the totals, payment-expansion count, unoffered triple, independent-set count and unsafe-decomposition count recorded in technical-sources.md. This is conceptual model evidence, not database execution.

Root reported the final isolated Astro build successful: one page compiled without errors, with authored-source hashes unchanged during compilation. The writer did not launch a server, install anything, run pnpm, alter infrastructure, commit or push. No production site check or publication was commissioned in this isolated assignment.

## Restoration

Restored System theme (confirmed selected, resolved dark), reset the temporary viewport override to the initial 1280 × 720, stopped/reset playback and closed both owned tabs. No user tab was operated. The browser lease was explicitly returned to root.

The finished article was reread in full via three bounded rendered-text reads, followed by its source disclosure; the continuity decisions are in continuity.md. No independent reader has assessed this version yet.
