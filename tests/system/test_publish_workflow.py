"""Publish-workflow permanent coverage — Slice 3.4 (publish-workflow, bet
first-living-topic).

The bet-progress suite (tests/bets/first-living-topic/test_slice_13_site_
publish-workflow.py) proves the workflow's shape once and is archived at bet
close. This file is what stays: it pins the same committed shape — one
workflow, two triggers, fail-closed install -> gate -> build -> deploy
ordering, the gate running through @staycurrent/core (never re-implemented
in YAML), and the CNAME/site.config.json origin agreement
(04-publish-workflow.md; 02-data-flows.md's Publish Flow (CI)) — as a
permanent regression guard, plus fixture-based coverage of
scripts/publish-gate.mjs itself: the one piece of real, newly-introduced
logic this slice ships (a full-tree scan is more than YAML plumbing and
deserves its own proof, the same way scripts/prebuild.mjs earned fixture
tests in test_distribution_artifacts.py).

The workflow's actual execution — a live push-to-main deploy, and a
deliberately gate-breaking pull_request showing a red check with no deploy
while the previous good build stays live — is the milestone's front-door
proof, driven once at milestone close against the real GitHub Actions
runner. It cannot be exercised from this local suite; what follows is the
committed shape, permanently.
"""

import json
import shutil
import subprocess
import tempfile
from pathlib import Path

import yaml

REPO_ROOT = Path(__file__).resolve().parents[2]
WORKFLOWS_DIR = REPO_ROOT / ".github" / "workflows"
GATE_SCRIPT = REPO_ROOT / "scripts" / "publish-gate.mjs"


def _load_workflow() -> dict:
    assert WORKFLOWS_DIR.exists(), ".github/workflows/ must exist — the repository's only path to production"
    candidates = sorted(WORKFLOWS_DIR.glob("*.yml")) + sorted(WORKFLOWS_DIR.glob("*.yaml"))
    assert candidates, "expected a workflow file under .github/workflows/"
    for path in candidates:
        doc = yaml.safe_load(path.read_text())
        triggers = doc.get("on") or doc.get(True) or {}
        if "push" in triggers and "pull_request" in triggers:
            return doc
    raise AssertionError("expected one workflow carrying both push and pull_request triggers")


def _all_steps(doc: dict) -> list:
    steps = []
    for job in (doc.get("jobs") or {}).values():
        steps.extend(job.get("steps") or [])
    return steps


def _step_text(step: dict) -> str:
    return json.dumps(step)


# ---------------------------------------------------------------------------
# Workflow shape — the permanent regression guard
# ---------------------------------------------------------------------------


def test_publish_workflow_triggers_push_to_main_and_pull_request():
    doc = _load_workflow()
    triggers = doc.get("on") or doc.get(True)
    push_branches = (triggers.get("push") or {}).get("branches") or []
    assert "main" in push_branches, "the push trigger must stay scoped to main"
    assert "pull_request" in triggers, "pull_request must keep running the identical pipeline minus deploy"


def test_publish_workflow_deploy_step_exists_and_is_guarded_to_push():
    doc = _load_workflow()
    jobs = doc.get("jobs") or {}
    steps = _all_steps(doc)

    deploy_steps = [s for s in steps if "deploy-pages" in _step_text(s) or "deploy" in (s.get("name") or "").lower()]
    assert deploy_steps, "a Pages deploy step must exist"

    deploy_guarded = any(
        "push" in json.dumps(job.get("if", ""))
        for job in jobs.values()
        if "deploy" in json.dumps(job).lower()
    )
    assert deploy_guarded, "the deploy job must stay conditioned to the push event — a pull_request run never deploys"


def test_publish_workflow_ordering_stays_install_gate_build_deploy():
    doc = _load_workflow()
    text_steps = [_step_text(s) for s in _all_steps(doc)]

    def first_index(needles):
        for i, s in enumerate(text_steps):
            if any(n in s for n in needles):
                return i
        return None

    def all_indices(needles):
        return [i for i, s in enumerate(text_steps) if any(n in s for n in needles)]

    install_i = first_index(["--frozen-lockfile"])
    gate_i = first_index(["runPublishGate", "gate"])
    # Anchored to "next build" ONLY — that text is carried by the site build
    # step's own name ("Build site (prebuild -> next build)"), not by core's
    # idiomatic `pnpm build` compile step. A looser needle (e.g. "pnpm build")
    # would false-match core's own build step, which runs before the gate —
    # collapsing the ordering proof entirely.
    build_i = first_index(["next build"])
    upload_i = first_index(["upload-pages-artifact"])
    deploy_i = first_index(["deploy-pages", "Deploy"])

    assert None not in (install_i, gate_i, build_i, upload_i, deploy_i), (
        f"expected all pipeline stages present (got {install_i}, {gate_i}, {build_i}, {upload_i}, {deploy_i})"
    )
    assert install_i < gate_i < build_i < deploy_i, (
        "fail-closed ordering must hold: install -> gate -> build -> deploy "
        f"(got {install_i}, {gate_i}, {build_i}, {deploy_i})"
    )

    # The bet-independent verification suites — the system suite and both
    # unit-test steps (core's and site's) — must run before the Pages
    # artifact is ever uploaded or deployed. A deploy can never outrun a red
    # suite.
    system_suite_indices = all_indices(["pytest system/"])
    unit_test_indices = all_indices(["pnpm test"])
    assert system_suite_indices, "expected a system-suite step (pytest system/)"
    assert len(unit_test_indices) >= 2, (
        f"expected both the core and site unit-test steps (pnpm test) to be present (got {unit_test_indices})"
    )
    assert all(i < upload_i for i in system_suite_indices), (
        "the system suite must run before the Pages artifact is uploaded"
    )
    assert all(i < upload_i for i in unit_test_indices), (
        "both unit-test steps must run before the Pages artifact is uploaded"
    )
    assert upload_i < deploy_i, "the Pages artifact upload must precede the deploy step"


def test_publish_workflow_gate_step_invokes_core_not_a_yaml_reimplementation():
    doc = _load_workflow()
    joined = json.dumps(_all_steps(doc))
    assert "runPublishGate" in joined or "gate" in joined, (
        "the gate step must invoke @staycurrent/core's runPublishGate path (ADR 0003), never re-implement checks in YAML"
    )
    # The gate step names the real script, not an inline shell re-implementation
    # of any of the ten checks.
    assert "publish-gate.mjs" in joined


def test_publish_workflow_only_the_advisory_doc_check_may_continue_on_error():
    """Every step fails closed by construction (this file's own preamble
    comment) except the one sanctioned advisory: the GroundWork doc-currency
    check. Exactly one step across the whole workflow may carry a truthy
    continue-on-error, and it must be that advisory step — not the gate, not
    either build step, not the system suite."""
    doc = _load_workflow()
    jobs = doc.get("jobs") or {}

    continue_on_error_steps = [
        step
        for job in jobs.values()
        for step in (job.get("steps") or [])
        if step.get("continue-on-error")
    ]
    assert len(continue_on_error_steps) == 1, (
        f"expected exactly one step carrying continue-on-error, got {len(continue_on_error_steps)}: "
        f"{[s.get('name') for s in continue_on_error_steps]}"
    )
    assert "groundwork-method check" in _step_text(continue_on_error_steps[0]), (
        "the sole continue-on-error step must be the advisory GroundWork doc-currency check"
    )

    # Belt and suspenders: name the fail-closed steps explicitly and assert
    # none of them carry the exemption.
    for step in _all_steps(doc):
        text = _step_text(step)
        if any(marker in text for marker in ("publish-gate.mjs", "next build", "pytest system/", "pnpm test")):
            assert not step.get("continue-on-error"), (
                f"gate/build/unit-test/suite step must never carry continue-on-error: {step.get('name')}"
            )


def test_publish_workflow_deploy_job_needs_build():
    doc = _load_workflow()
    jobs = doc.get("jobs") or {}

    deploy_job = None
    for job in jobs.values():
        if any("deploy-pages" in _step_text(s) for s in (job.get("steps") or [])):
            deploy_job = job
            break
    assert deploy_job is not None, "expected a deploy job containing the deploy-pages step"

    needs = deploy_job.get("needs")
    if isinstance(needs, str):
        needs = [needs]
    assert needs and "build" in needs, (
        f"the deploy job must declare `needs: build` — deploy must never outrun the build job (got {needs})"
    )


def test_publish_workflow_only_the_pages_upload_step_conditions_on_event_name():
    doc = _load_workflow()
    jobs = doc.get("jobs") or {}

    build_job = None
    for job in jobs.values():
        if any("publish-gate.mjs" in _step_text(s) for s in (job.get("steps") or [])):
            build_job = job
            break
    assert build_job is not None, "expected the build job containing the gate step"

    for step in build_job.get("steps") or []:
        cond = json.dumps(step.get("if", ""))
        if "event_name" in cond:
            assert "upload-pages-artifact" in _step_text(step), (
                "only the Pages-artifact upload step may condition on github.event_name within the "
                f"build job — an identical pipeline for push and pull_request must otherwise hold "
                f"(found on: {step.get('name')})"
            )


def test_custom_domain_artifact_rides_the_export_and_agrees_with_site_config():
    """public/CNAME does NOT bind staycurrent.dev to this deploy. For an
    Actions-based Pages deploy (actions/deploy-pages, as used here), GitHub
    ignores any CNAME file inside the uploaded artifact entirely — binding a
    custom domain is a one-time operator step (repo Settings -> Pages ->
    Custom domain) plus the matching DNS records, not a file in the export.
    This file is kept only because it's a harmless artifact that also keeps
    the tree compatible with a branch-based Pages deploy (which DOES read
    CNAME from the published branch), should that path ever be used instead.
    What this test actually pins is an origin-consistency check: the CNAME's
    domain and site.config.json's url must always agree, so the canonical
    install one-liner never drifts from the operator-configured deployed
    host.
    """
    cname = REPO_ROOT / "services" / "site" / "public" / "CNAME"
    assert cname.exists(), "public/CNAME must exist as a harmless, branch-deploy-compatible artifact"
    assert cname.read_text().strip() == "staycurrent.dev"

    config = json.loads((REPO_ROOT / "site.config.json").read_text())
    assert config.get("url", "").rstrip("/") == "https://staycurrent.dev", (
        "site.config.json's url must keep agreeing with the CNAME's domain — the deployed "
        "origin and the canonical install one-liner must always name the same host"
    )


# ---------------------------------------------------------------------------
# scripts/publish-gate.mjs — the full-tree gate invocation itself
# ---------------------------------------------------------------------------


def _run_gate(fixture_root: Path | None = None) -> subprocess.CompletedProcess:
    import os

    env = {**os.environ}
    if fixture_root is not None:
        env["STAYCURRENT_REPO_ROOT"] = str(fixture_root)
    else:
        # An ambient STAYCURRENT_REPO_ROOT export in the operator's/CI's shell
        # must never silently redirect the real-tree run below onto some
        # other root — this is the one invocation that must always resolve
        # against the actual repository.
        env.pop("STAYCURRENT_REPO_ROOT", None)
    return subprocess.run(
        ["node", str(GATE_SCRIPT)],
        cwd=REPO_ROOT,
        env=env,
        capture_output=True,
        text=True,
        timeout=30,
    )


def test_publish_gate_script_passes_over_the_real_committed_topics_tree():
    """The script's default invocation (no override) is exactly the CI step's
    own command — proving it against the real, committed tree is proving the
    workflow step itself, not a fixture stand-in."""
    result = _run_gate()
    combined = result.stdout + result.stderr
    assert result.returncode == 0, f"expected the real topics/ tree to pass its own gate.\n{combined}"
    assert "PASS" in result.stdout


_BROKEN_ARTICLE_MD = (
    "---\n"
    "topic: wrong-slug\n"
    "title: Broken\n"
    'stance: "A committed one-sentence position for testing purposes."\n'
    "version: 1\n"
    "status: current\n"
    "cadence: 90d\n"
    "last_researched: 2026-01-15\n"
    "---\n\n"
    "# Broken\n\nBody.\n"
    # Deliberately no versions/, changelog.md, or skill/ — several of
    # the ten checks fail at once.
)


def test_publish_gate_script_is_full_tree_naming_every_broken_topic_and_sparing_the_good_one():
    """Three topics, two broken — one sorting BEFORE the good topic
    (`broken-topic`) and one sorting AFTER it (`zz-broken`): the script must
    inspect ALL of them in a single run (full-tree, never stopping at the
    first failure) and name BOTH broken slugs, sparing the good one. A scan
    that stops at the first failing topic would still catch `broken-topic`
    (it sorts first) but silently drop `zz-broken` — this is what actually
    discriminates a full-tree scan from a stop-at-first one. The good topic
    is a byte copy of the repository's own already-gate-passing
    topics/databases/, so this isolates exactly one variable: the two
    deliberately-broken topics on either side of it alphabetically."""
    with tempfile.TemporaryDirectory(prefix="staycurrent-publish-gate-") as tmp:
        fixture_root = Path(tmp) / "fixture-root"
        topics_dir = fixture_root / "topics"
        topics_dir.mkdir(parents=True)

        shutil.copytree(REPO_ROOT / "topics" / "databases", topics_dir / "databases")

        for broken_slug in ("broken-topic", "zz-broken"):
            broken_dir = topics_dir / broken_slug
            broken_dir.mkdir()
            (broken_dir / "article.md").write_text(_BROKEN_ARTICLE_MD)

        result = _run_gate(fixture_root)
        combined = result.stdout + result.stderr

        assert result.returncode != 0, f"expected a non-zero exit when any topic fails its gate.\n{combined}"
        for broken_slug in ("broken-topic", "zz-broken"):
            assert broken_slug in combined, (
                f"expected {broken_slug} named among the failures in this one run — a scan that stops "
                f"at the first failing topic would silently drop whichever broken topic sorts after "
                f"it.\n{combined}"
            )
        assert "databases" not in combined, (
            f"expected the good topic (a verbatim copy of the real, gate-passing databases/) "
            f"to be inspected and cleared, never named among the failures.\n{combined}"
        )
        # More than one distinct check fires per broken topic (five-artifact
        # completeness alone accounts for several) — proving this is a real
        # multi-check scan, not a single early-exit assertion.
        fail_lines = [line for line in combined.splitlines() if line.startswith("FAIL")]
        assert len(fail_lines) >= 4, f"expected multiple named failures across both broken topics.\n{combined}"


def test_publish_gate_script_resolves_symlinked_topic_directories():
    """A topic directory symlinked into topics/ — pointing at a broken tree
    that lives outside topics/ entirely — must still be inspected and named
    in failures. listTopicSlugs' own comment commits to resolving symlinks
    via stat rather than skipping them; a scan that only checked
    entry.isDirectory() would silently pass over a symlinked topic and never
    gate its content."""
    with tempfile.TemporaryDirectory(prefix="staycurrent-publish-gate-symlink-") as tmp:
        fixture_root = Path(tmp) / "fixture-root"
        topics_dir = fixture_root / "topics"
        topics_dir.mkdir(parents=True)

        # The real, broken tree lives OUTSIDE topics/ ...
        real_broken_dir = Path(tmp) / "actual-broken-topic"
        real_broken_dir.mkdir()
        (real_broken_dir / "article.md").write_text(_BROKEN_ARTICLE_MD)

        # ... and topics/ carries only a symlink pointing at it.
        (topics_dir / "symlinked-topic").symlink_to(real_broken_dir, target_is_directory=True)

        result = _run_gate(fixture_root)
        combined = result.stdout + result.stderr

        assert result.returncode != 0, f"expected the symlinked broken topic to fail its gate.\n{combined}"
        assert "symlinked-topic" in combined, (
            f"expected the symlinked topic's slug to be named among the failures — symlinks must be "
            f"resolved, never silently skipped.\n{combined}"
        )


def test_publish_gate_script_fails_closed_when_topics_dir_is_absent():
    """A topics/ directory absent at the resolved root must never
    green-light a deploy — a mis-resolved root (a bad
    STAYCURRENT_REPO_ROOT, a broken checkout) is a far likelier explanation
    than a legitimate empty repository, and either way nothing has been
    gated."""
    with tempfile.TemporaryDirectory(prefix="staycurrent-publish-gate-absent-") as tmp:
        fixture_root = Path(tmp) / "fixture-root"
        fixture_root.mkdir(parents=True)
        result = _run_gate(fixture_root)
        combined = result.stdout + result.stderr
        assert result.returncode != 0, (
            f"expected a missing topics/ to fail closed, not exit zero.\n{combined}"
        )
        assert str(fixture_root) in combined, (
            f"expected the resolved root to be named in the failure message.\n{combined}"
        )


def test_publish_gate_script_fails_closed_when_topics_dir_exists_but_is_empty():
    """topics/ present but containing zero gateable topic directories must
    also fail closed: this repository always carries at least one topic, so
    an empty topics/ can only mean a broken checkout or a scaffold-only
    state the site cannot build from anyway (change-proposal-4) — never a
    legitimate "nothing to gate" no-op."""
    with tempfile.TemporaryDirectory(prefix="staycurrent-publish-gate-emptydir-") as tmp:
        fixture_root = Path(tmp) / "fixture-root"
        topics_dir = fixture_root / "topics"
        topics_dir.mkdir(parents=True)
        result = _run_gate(fixture_root)
        combined = result.stdout + result.stderr
        assert result.returncode != 0, (
            f"expected an empty (but present) topics/ to fail closed, not exit zero.\n{combined}"
        )
        assert "no topics/ found" not in combined, (
            f"the exists-but-empty case must get its own message, not the absent-directory one.\n{combined}"
        )
