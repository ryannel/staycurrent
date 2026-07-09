# Milestone 2: Article readable

**Type:** surface (site)

**Consumer:** a reader in a browser.

**Demonstrable goal:** The built static export renders the databases article end-to-end — the `/` topic library card, `/databases/` with its trust header (v1 · researched date · face links), the stance callout, the right-rail table of contents, themed mermaid diagrams with reserved space, `/about/`, light and dark rendering from the brand tokens, and readable content with JavaScript disabled.

**Sequencing rationale:** This is the first reader-visible rung — it lands the graphical design system (shell, tokens, type scale, base components) in the running app, and it consumes Milestone 1's real content exclusively through `@staycurrent/core`'s loading API, since the site never parses `topics/` itself. The trust header's face links (changelog · history · skill) render here, but their routes land in Milestone 3 — a reader clicking one in this milestone's build reaches the designed 404, an accepted mid-ladder state until Milestone 3 closes the ladder.

**Acceptance criteria (agreed front-door cases):**
- [ ] The three routes (`/`, `/databases/`, `/about/`) render from the real `topics/` tree on the built export (`pnpm build` → `out/`, served at port 4173).
- [ ] The build fails if a topic in the real `topics/` tree cannot state its version and last-researched date.
- [ ] The article reads end-to-end with JavaScript disabled, and both light and dark themes render from the brand tokens.
- [ ] The designed 404 page ships with the shell — one of the design system's honesty states — and is what a reader reaches from a trust-header face link whose route lands in Milestone 3.

## Proof of work

**Proves:** A reader driving the built static export sees the databases article render completely — trust header, stance callout, table of contents, and diagrams — in both themes, and can still read it with JavaScript off.

**How we prove it:** Build the site for real (`pnpm build` → `out/`) and serve the built export at port 4173. Open it in a browser: load `/` and see the databases topic card in the library; open `/databases/` and read the trust header (version, last-researched date, and the stance's supporting links), the stance callout, the right-rail table of contents, and the mermaid diagrams rendered with their reserved space; open `/about/`; follow a trust-header face link and land on the designed 404 page — the accepted mid-ladder state until Milestone 3 lands those routes; flip the theme and confirm both light and dark render from the brand tokens; then disable JavaScript and confirm the article is still readable. The build must fail if a topic in the real `topics/` tree cannot state version and last-researched — the pipeline's own gate, not a scripted stand-in for it.

**Test file:** `tests/bets/first-living-topic/test_milestone_2_article_readable.py` — generated red at Delivery start; drives the `site` surface in `technical-design/01-ui-design.md` over the Loading API in `technical-design/03-api-design.md`, against the built static export the `services/site` runner serves.

## Slices

> *Slices authored on arrival.*
