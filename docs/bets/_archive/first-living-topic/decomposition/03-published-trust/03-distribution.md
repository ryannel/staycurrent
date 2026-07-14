# Slice 3.3 — site: Distribution

**Owner service:** site

**Surface:** site

**Complexity:** M

**Prerequisite:** Slice 3.2 merged

## Scope

This slice builds the adopter's path: the prebuild step that materializes the feed and the skill payloads, and the install page that hands a fresh agent session the one command that fetches them. It is Success Signal 2's machinery — distribution proven with the honestly-labelled placeholder skill (change-proposal-2). After this slice the local export is byte-complete; only the pipeline that publishes it remains.

**Required Capabilities:**
- `site.config.json` exists at the repo root carrying this instance's identity (`url: https://staycurrent.dev`, site title) — the engine/instance boundary the Site Build Data Flow commits; no instance value is hardcoded in `services/site`.
- The site's npm `prebuild` script runs `buildRss(root, config)` and writes `services/site/public/rss.xml` — every `ChangelogEntry` site-wide, newest first, capped at 50, per `buildRss`'s contract in `03-api-design.md`; a non-empty `listTopics` error sweep fails the prebuild, and with it the build.
- The same prebuild materializes the skill payloads per the distribution contract in `03-api-design.md`: the browsable current tree at `public/skills/<slug>/`, archived trees at `public/skills/<slug>/v/<n>/`, the current zip at `public/skills/<slug>.zip`, archived zips at `public/skills/<slug>/v/<n>.zip` — each zip containing a single top-level `<slug>/` directory (never loose files), sourced from the gate-validated `skill/` snapshots, never re-derived.
- `/[topic]/skill/` renders the Skill Install Page per `01-ui-design.md`: the canonical install one-liner exactly as `03-api-design.md` states it (`curl -fsSL https://staycurrent.dev/skills/<slug>.zip -o /tmp/<slug>-skill.zip && unzip -o /tmp/<slug>-skill.zip -d ~/.claude/skills/`, origin resolved from `config.url`), the payload's `article_version` binding, and the placeholder skill honestly labelled per change-proposal-2 — the reader is told the skill is not yet authored and the article is the stance's only rendering.
- The prebuild's outputs ride the static export unchanged — `rss.xml` and the `skills/` tree are fetchable from the served `out/`, and the feed parses as valid RSS.
- The sidebar footer's RSS glyph link (deferred from Milestone 2) lands, pointing at `/rss.xml` per the Sidebar anatomy's footer cluster.

## Design

Implements the prebuild half of `technical-design/02-data-flows.md`'s Site Build Data Flow — `buildRss` (sole caller: this prebuild, per `03-api-design.md`) plus the skill-payload materialization — and the `/[topic]/skill/` Skill Install Page view in `technical-design/01-ui-design.md`, honestly labelled per change-proposal-2. Introduces `site.config.json` per the engine/instance boundary. Completes the sidebar footer cluster in `docs/design-system.md` § Sidebar anatomy.

## Proof of work

**Proves:** A fresh agent session can install the skill payload from the built site with the canonical one-liner, the feed validates, and the placeholder is honestly labelled at every point an adopter meets it.

**How we prove it:** Build the real repository and serve the export. Fetch `rss.xml` and validate it parses as RSS with the databases v1 founding entry. Open `/databases/skill/` and read the canonical one-liner and the placeholder labelling. Run the one-liner's fetch-and-unpack against the served origin (substituting the local origin for the deployed domain — the deployed-origin run is Milestone 3's front-door proof at the milestone close) into a scratch skills directory: the zip unpacks to a single `databases/` tree whose `SKILL.md` carries the `article_version: 1` binding and the honest placeholder text. Confirm the browsable tree at `/skills/databases/` serves the same bytes the zip carries.

**Test file:** `tests/bets/first-living-topic/test_slice_12_site_distribution.py` — generated red at Delivery start; traces to `buildRss` and the skill-payload distribution contract in `technical-design/03-api-design.md` and the prebuild stage of `technical-design/02-data-flows.md`'s Site Build Data Flow.
