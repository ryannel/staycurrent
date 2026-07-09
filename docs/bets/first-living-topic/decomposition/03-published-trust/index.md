# Milestone 3: Published trust

**Type:** surface (site)

**Consumer:** a cold reader and a skill adopter, on the deployed site.

**Demonstrable goal:** The full trust apparatus is live — `/databases/changelog/`, `/databases/history/`, `/databases/v/1/` (the current-version redirect stub per `01-ui-design.md`), `/databases/skill/` with the canonical install one-liner, the site-wide `/changelog/`, `rss.xml`, and the skill payload tree plus zip at `/skills/databases.zip` — deployed to GitHub Pages by the fail-closed Actions workflow (gate → RSS + payloads → next build → deploy).

**Sequencing rationale:** This milestone turns Milestone 2's local artifact into the public product; the install page and the feed are what Success Signals 1 and 2 observe.

**Acceptance criteria (agreed front-door cases):**
- [ ] The deployed URL serves all trust routes, and the feed at `rss.xml` validates.
- [ ] The install one-liner fetches and unpacks the payload from the deployed site into a fresh session's skills directory, and the placeholder skill is honestly labelled at the install page and inside the payload (companion-skill authoring deferred — change-proposal-2).
- [ ] A pull request carrying a gate-breaking change shows a red check — the workflow's `pull_request` run stops at the gate (gate → RSS + payloads → build, no deploy) — while the deployed site still serves the previous good build; nothing is merged.

## Proof of work

**Proves:** The deployed site carries the full trust apparatus — changelog, history, version redirect, install page, site-wide feed, and skill payloads — and a fresh agent session can fetch and install the payload from it (an honestly-labelled placeholder at v1, per change-proposal-2); a broken build never replaces a good deploy.

**How we prove it:** Drive the deployed site in a browser: open `/databases/changelog/`, `/databases/history/`, `/databases/v/1/` (confirming the current-version redirect), `/databases/skill/`, the site-wide `/changelog/`, and `rss.xml`, and confirm each renders or validates. In a fresh Claude Code session, run the canonical install one-liner from the install page against `/skills/databases.zip`, confirm the payload unpacks into the skills directory, and confirm the placeholder labelling is present both on the install page and inside the installed SKILL.md (stance-fidelity of an authored skill is deferred to the skill-design bet — change-proposal-2). Separately, open a pull request carrying a gate-breaking change and observe its `pull_request` workflow run fail closed at the gate — a red check, no deploy step — while the deployed site still serves the previous good build; merge nothing.

**Test file:** `tests/bets/first-living-topic/test_milestone_3_published_trust.py` — generated red at Delivery start; drives the `site` surface's deployed routes and the skill-payload distribution contract in `technical-design/03-api-design.md` (the canonical install one-liner and the `/skills/<slug>.zip` archive), over the deploy pipeline in `technical-design/02-data-flows.md`.

## Slices

> *Slices authored on arrival.*
