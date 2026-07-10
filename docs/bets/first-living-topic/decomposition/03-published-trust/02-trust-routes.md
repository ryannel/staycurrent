# Slice 3.2 — site: Trust Routes

**Owner service:** site

**Surface:** site

**Complexity:** L

**Prerequisite:** Slice 3.1 merged

## Scope

This slice lands the topic's remaining faces and the site-wide timeline — the routes Milestone 2's face links already point at: `/[topic]/changelog/`, `/[topic]/history/`, `/[topic]/v/[n]/` (archived versions plus the current-version redirect), and `/changelog/`. After this slice a reader can walk the whole trust apparatus locally; only distribution (skill install, RSS) and deployment remain. The designed 404 stops being these links' destination — the accepted mid-ladder state Milestone 2 recorded closes here.

**Required Capabilities:**
- `/[topic]/changelog/` renders `loadChangelog`'s `ChangelogEntry[]` per the Changelog view in `01-ui-design.md`: newest first, each entry a self-contained mini-essay with its version, date, stance disposition (`held`/`bent`/`reversed`; the v1 founding entry carries none), rendered `bodyHtml`, and a `#vN` permalink anchor — the Linear Changelog technique named in the view's Design References.
- `/[topic]/history/` renders the version ledger per the Version History view: one row per version `1..current`, each linking its `/[topic]/v/[n]/` page, with the current version marked and its skill link pointing at `/[topic]/skill/` while superseded rows link their archived payload at `/skills/<slug>/v/<n>/` — exactly as the view specifies.
- `/[topic]/v/[n]/` renders the archived snapshot per the Archived Version view: `loadVersion`'s frozen article through the same shell, a superseded banner computed at build time (snapshot `N` vs live `TopicFrontmatter.version` — never a stored field, per the Site Build Data Flow), and the superseded-skill pointer ("This skill renders vN of the stance. Install the current version instead →") where the design places it.
- `/[topic]/v/[n]/` for `n === current` redirects to `/[topic]/` — the build-time redirect the Site Build Data Flow commits; a reader never sees a duplicate of the live article at a version URL.
- `/changelog/` renders every topic's entries merged newest-first per the Site-Wide Changelog view, each entry labelled with its topic and its "Read entry →" linking `/[topic]/changelog/#vN`; zero cross-topic entries is impossible while any topic exists (v1 founding entries), so the view's populated state is the only reachable one at this milestone.
- `generateStaticParams` enumerates the routes this slice lands exactly as the Site Build Data Flow specifies — one route per topic for the changelog and history faces plus one per version snapshot (the skill face's route completes the enumeration in Slice 3.3) — and `next build` stays fail-closed on any topic the loaders reject.
- The sidebar's changelog/history/skill face links and the site-wide `Changelog` entry resolve to real routes (skill's route lands in Slice 3.3; until then it remains the designed 404 — the one remaining mid-ladder link, closed next slice).

## Design

Implements the `/[topic]/changelog/`, `/[topic]/history/`, `/[topic]/v/[n]/`, and `/changelog/` views in `technical-design/01-ui-design.md` — wireframes, states, interactions, micro-polish — on Milestone 2's shell, tokens, and components, over `loadChangelog`/`loadVersion` from the Loading API in `technical-design/03-api-design.md`, realizing the topics × faces and topics × versions route enumeration in `technical-design/02-data-flows.md`'s Site Build Data Flow. Rendered bodies inherit Slice 3.1's hardened pipeline.

## Proof of work

**Proves:** Every trust face the pitch names — changelog, history, archived versions — renders from the real content tree on the built export, and the current-version URL folds into the live article instead of duplicating it.

**How we prove it:** Build the real repository and walk the export in a browser: `/databases/changelog/` shows the v1 founding entry as a rendered mini-essay with its `#v1` anchor; `/databases/history/` shows the v1 row linking its version page; `/databases/v/1/` redirects to `/databases/` (v1 is current, so the archived render and superseded banner are exercised through fixture topics with a second cut via `STAYCURRENT_REPO_ROOT`, the real pipeline against a fixture tree — the repository's own `topics/` is never touched); `/changelog/` lists the databases founding entry labelled with its topic, linking into the topic changelog. The sidebar's changelog and history face links land on the real routes, not the 404 (the skill face stays on the designed 404 until Slice 3.3).

**Test file:** `tests/bets/first-living-topic/test_slice_11_site_trust-routes.py` — generated red at Delivery start; traces to the four views in `technical-design/01-ui-design.md`, `loadChangelog`/`loadVersion` in `technical-design/03-api-design.md`, and the route enumeration in `technical-design/02-data-flows.md`.
