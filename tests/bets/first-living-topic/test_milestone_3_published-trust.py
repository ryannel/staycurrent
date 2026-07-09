"""Bet-progress test — Milestone 3: published-trust
Bet: first-living-topic

This test is RED by design. It defines the target state for Milestone 3.
Run './dev test bet first-living-topic' to see it fail; it will pass when Delivery is complete.
"""

import xml.etree.ElementTree as ET
from pathlib import Path

import yaml

REPO_ROOT = Path(__file__).resolve().parents[3]
OUT_DIR = REPO_ROOT / "services" / "site" / "out"
SLUG = "databases"
INSTALL_ONE_LINER = (
    f"curl -fsSL https://staycurrent.dev/skills/{SLUG}.zip -o /tmp/{SLUG}-skill.zip "
    f"&& unzip -o /tmp/{SLUG}-skill.zip -d ~/.claude/skills/"
)


def _workflow_triggers(doc: dict) -> dict:
    on = doc.get("on")
    if on is None:
        on = doc.get(True)  # PyYAML (YAML 1.1) parses a bare `on:` key as boolean True
    if isinstance(on, dict):
        return on
    if isinstance(on, list):
        return {name: None for name in on}
    if isinstance(on, str):
        return {on: None}
    return {}


# ---------------------------------------------------------------------------
# Front door (a cold reader and a skill adopter, on the deployed site — proven here
# against the built static export, its local stand-in for the deployed Pages output)
# ---------------------------------------------------------------------------
# Front door: the site carries the full trust apparatus — changelog, history, version
# redirect, the install page with the canonical one-liner, the site-wide changelog,
# the RSS feed, and the skill payload tree/zip — plus a fail-closed CI workflow
# gating both push-to-main and pull_request. Traces to
# decomposition/03-published-trust/index.md's Proof of work.


def test_per_topic_trust_routes_render_with_the_canonical_install_line():
    for rel in (
        f"{SLUG}/changelog/index.html",
        f"{SLUG}/history/index.html",
        f"{SLUG}/v/1/index.html",
        f"{SLUG}/skill/index.html",
        "changelog/index.html",
    ):
        path = OUT_DIR / rel
        assert path.exists(), f"{path.relative_to(REPO_ROOT)} does not exist yet"

    skill_html = (OUT_DIR / SLUG / "skill" / "index.html").read_text()
    assert INSTALL_ONE_LINER in skill_html, (
        "expected the install page to render the canonical one-liner verbatim"
    )


def test_site_wide_feed_and_skill_payloads_are_published():
    rss_path = OUT_DIR / "rss.xml"
    assert rss_path.exists(), f"{rss_path.relative_to(REPO_ROOT)} does not exist yet"
    channel = ET.fromstring(rss_path.read_text())
    items = channel.findall("./channel/item")
    assert len(items) >= 1, "rss.xml must validate and carry at least one item"

    zip_path = OUT_DIR / "skills" / f"{SLUG}.zip"
    assert zip_path.exists(), f"{zip_path.relative_to(REPO_ROOT)} does not exist yet"
    tree_dir = OUT_DIR / "skills" / SLUG
    assert tree_dir.is_dir() and (tree_dir / "SKILL.md").exists(), (
        f"expected a browsable skill tree at {tree_dir.relative_to(REPO_ROOT)}"
    )


def test_ci_workflow_gates_both_push_to_main_and_pull_request():
    workflows_dir = REPO_ROOT / ".github" / "workflows"
    workflow_files = []
    if workflows_dir.exists():
        workflow_files = list(workflows_dir.glob("*.yml")) + list(workflows_dir.glob("*.yaml"))
    assert workflow_files, f"no workflow files found under {workflows_dir.relative_to(REPO_ROOT)}"

    gated = False
    for wf_path in workflow_files:
        doc = yaml.safe_load(wf_path.read_text()) or {}
        triggers = _workflow_triggers(doc)
        if "push" in triggers and "pull_request" in triggers:
            push_cfg = triggers.get("push") or {}
            branches = push_cfg.get("branches") if isinstance(push_cfg, dict) else None
            if not branches or "main" in branches:
                gated = True
                break
    assert gated, (
        "expected a workflow triggering on both push-to-main and pull_request "
        "(gate -> RSS + payloads -> build [-> deploy on push])"
    )
