# Slice 3.4 — site: Publish Workflow

**Owner service:** site

**Surface:** site

**Complexity:** M

**Prerequisite:** Slice 3.3 merged

## Scope

This slice turns the local artifact into the public product: the single GitHub Actions workflow that gates, builds, and deploys to GitHub Pages, fail closed at every step. It is the repository's only path to production and the front door Milestone 3's proof drives. Closes maturity ledger G4 (no CI). The operator's manual half — Pages settings, custom-domain DNS for `staycurrent.dev` — is surfaced at delivery, not automated.

**Required Capabilities:**
- One workflow file, two triggers, per `02-data-flows.md`'s Publish Flow: `push` to `main` runs install (`pnpm install --frozen-lockfile`) → full-tree `runPublishGate` (every topic, every snapshot — the repository is the trust boundary, not the operator's machine) → prebuild + `next build` → deploy to Pages; `pull_request` runs the identical pipeline minus deploy — verification only, no deploy step present in that run.
- Any pipeline step failing stops the run before the next step starts — a gate failure never reaches prebuild, a build failure never reaches deploy, and a red run on `main` leaves the previous deploy live (Pages replaces its file set atomically only on a successful deploy step). The one exemption is the explicitly advisory step below, which can never block or fail the run.
- The gate step runs `runPublishGate` through the same `@staycurrent/core` code path the workbench's `cut` uses (ADR 0003; the CI seam in `03-api-design.md`) — never a re-implementation in workflow YAML.
- The static export deploys with the custom-domain artifact Pages requires (`CNAME` carrying `staycurrent.dev`, riding `public/` into `out/`), and `site.config.json`'s `url` already matches — the deployed origin and the canonical install one-liner agree.
- The workflow also runs the repository's verification suites (site unit tests and the bet-independent system gates) before deploy, so a deploy can never outrun a red suite. `npx groundwork-method check` runs as the pipeline's one advisory step (G4's original intent): its result is reported but exempt from the fail-closed rule above — it never gates deploy on doc currency.

## Design

Implements `technical-design/02-data-flows.md`'s Publish Flow (CI) end to end — the one-workflow/two-trigger shape, full-tree gate, the unmodified Site Build Data Flow as its middle, atomic Pages deploy as its terminal step, and the fail-closed ordering between them. Consumes only committed contracts: `runPublishGate` and the Loading API per the CI seam in `technical-design/03-api-design.md` § Versioning & Compatibility.

## Proof of work

**Proves:** The deployed site is reachable at the public origin serving the full trust apparatus, and a gate-breaking change shows a red check with no deploy while the live site keeps serving the previous good build.

**How we prove it:** Land the workflow and let `push` to `main` run it for real: gate green, build green, deploy green, and the deployed origin serves the article, trust routes, `rss.xml`, and the skill zip — the canonical install one-liner run from a fresh session against the deployed URL unpacks the payload (Milestone 3's acceptance walk). Then open a pull request carrying a deliberately gate-breaking content change (a fixture-grade violation on a branch — reverted, never merged): its `pull_request` run fails at the gate with a red check and no deploy step executed, while the deployed site still serves the previous good build. The PR is closed unmerged; the branch is deleted.

**Test file:** `tests/bets/first-living-topic/test_slice_13_site_publish-workflow.py` — generated red at Delivery start; traces to the Publish Flow in `technical-design/02-data-flows.md` and the CI seam in `technical-design/03-api-design.md` (asserts the workflow file's shape — triggers, step order, fail-closed structure, gate-through-core — the deployed-origin walk being the milestone's front-door proof).
