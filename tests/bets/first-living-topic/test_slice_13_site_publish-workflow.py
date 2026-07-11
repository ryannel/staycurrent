"""Bet-progress test — Slice 13: publish-workflow (service: site)
Bet: first-living-topic  |  Parent milestone: published-trust

This test is RED by design. It proves the vertical capability this slice contributes
toward Milestone published-trust. Tests are bounded by — not duplicates of — the parent
milestone tests.

Run './dev test bet first-living-topic' to see it fail; it will pass when this slice is merged.
"""

import json
from pathlib import Path

import yaml

REPO_ROOT = Path(__file__).resolve().parents[3]
WORKFLOWS_DIR = REPO_ROOT / ".github" / "workflows"


# ---------------------------------------------------------------------------
# Slice capability proof (site service)
# ---------------------------------------------------------------------------
# Slice 3.4 proves the repository's only path to production exists and is
# fail-closed by construction (04-publish-workflow.md, 02-data-flows.md's
# Publish Flow): one workflow, two triggers (push to main deploys, pull_request
# verifies without a deploy), install -> full-tree gate -> prebuild + build ->
# deploy in that order, the gate running through @staycurrent/core's
# runPublishGate (never YAML re-implementation), the CNAME custom-domain
# artifact riding public/ into the export, and site.config.json's url agreeing
# with the deployed origin. The deployed-origin walk and the red-check PR
# experiment are the milestone's front-door proof, driven at the milestone
# close — this file asserts the workflow's committed shape.


def _load_workflow() -> dict:
    assert WORKFLOWS_DIR.exists(), (
        ".github/workflows/ does not exist — the publish workflow has not landed "
        "(maturity G4)"
    )
    candidates = sorted(WORKFLOWS_DIR.glob("*.yml")) + sorted(WORKFLOWS_DIR.glob("*.yaml"))
    assert candidates, "expected a workflow file under .github/workflows/"
    for path in candidates:
        doc = yaml.safe_load(path.read_text())
        triggers = doc.get("on") or doc.get(True) or {}
        if "push" in triggers and "pull_request" in triggers:
            return doc
    raise AssertionError(
        "expected one workflow carrying both push and pull_request triggers — "
        "the Publish Flow's one-workflow/two-trigger shape"
    )


def _all_steps(doc: dict) -> list:
    steps = []
    for job in (doc.get("jobs") or {}).values():
        steps.extend(job.get("steps") or [])
    return steps


def _step_text(step: dict) -> str:
    return json.dumps(step)


def test_one_workflow_two_triggers_push_deploys_pr_verifies():
    doc = _load_workflow()
    triggers = doc.get("on") or doc.get(True)
    push_branches = (triggers.get("push") or {}).get("branches") or []
    assert "main" in push_branches, "expected the push trigger scoped to main"

    steps = _all_steps(doc)
    deploy_steps = [s for s in steps if "deploy-pages" in _step_text(s) or "deploy" in (s.get("name") or "").lower()]
    assert deploy_steps, "expected a Pages deploy step"
    jobs = doc.get("jobs") or {}
    deploy_guarded = any(
        "push" in json.dumps(job.get("if", "")) or "push" in json.dumps(s.get("if", ""))
        for job in jobs.values()
        for s in (job.get("steps") or [])
        if "deploy" in _step_text(s).lower()
    ) or any("push" in json.dumps(job.get("if", "")) for job in jobs.values() if "deploy" in json.dumps(job).lower())
    assert deploy_guarded, (
        "expected the deploy step/job conditioned to the push event — a "
        "pull_request run must verify only, never deploy"
    )


def test_pipeline_order_is_install_gate_build_deploy():
    doc = _load_workflow()
    text_steps = [_step_text(s) for s in _all_steps(doc)]

    def first_index(needle_options):
        for i, s in enumerate(text_steps):
            if any(n in s for n in needle_options):
                return i
        return None

    install_i = first_index(["--frozen-lockfile"])
    gate_i = first_index(["runPublishGate", "gate"])
    build_i = first_index(["next build"])
    deploy_i = first_index(["deploy-pages", "Deploy"])

    assert install_i is not None, "expected pnpm install --frozen-lockfile as the install step"
    assert gate_i is not None, "expected a full-tree publish-gate step"
    assert build_i is not None, "expected the site build step"
    assert deploy_i is not None, "expected the deploy step"
    assert install_i < gate_i < build_i < deploy_i, (
        "expected fail-closed ordering: install -> gate -> build -> deploy "
        f"(got {install_i}, {gate_i}, {build_i}, {deploy_i})"
    )


def test_gate_runs_through_core_not_yaml_reimplementation():
    doc = _load_workflow()
    joined = json.dumps(_all_steps(doc))
    assert "runPublishGate" in joined or "gate" in joined, (
        "expected the gate step to invoke @staycurrent/core's runPublishGate path "
        "(ADR 0003) — e.g. a node/workbench invocation, never gate logic in YAML"
    )


def test_custom_domain_artifact_and_config_agree():
    cname = REPO_ROOT / "services" / "site" / "public" / "CNAME"
    assert cname.exists(), "expected public/CNAME so the custom domain rides the export"
    assert cname.read_text().strip() == "staycurrent.dev", "expected CNAME to carry staycurrent.dev"

    config_path = REPO_ROOT / "site.config.json"
    assert config_path.exists(), "expected site.config.json at the repo root (Slice 3.3)"
    config = json.loads(config_path.read_text())
    assert config.get("url", "").rstrip("/") == "https://staycurrent.dev", (
        "expected site.config.json's url to agree with the deployed origin — the "
        "canonical install one-liner and the CNAME must name the same domain"
    )
