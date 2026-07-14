"""Bet-progress test — Slice 15: loop-rehearsal (service: workbench)
Bet: first-living-topic  |  Parent milestone: loop-closes

This test is RED by design. It proves the vertical capability this slice contributes
toward Milestone loop-closes. Tests are bounded by — not duplicates of — the parent
milestone tests.

Run './dev test bet first-living-topic' to see it fail; it will pass when this slice is merged.
"""

import os
import shutil
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
SLUG = "databases"

# The fixture-building + CLI-driving harness lives permanently under
# tests/system/ (loop_rehearsal_fixture.py) so this temporary bet-progress
# suite and the promoted permanent module (tests/system/test_loop_rehearsal.py)
# never drift on how the fixture is built or the CLI is invoked. This suite's
# own directory has no path to tests/system/ by default (pytest inserts each
# collected file's own basedir onto sys.path), so it is added explicitly here
# rather than relying on collection order across `pytest bets/... system/...`.
SYSTEM_DIR = REPO_ROOT / "tests" / "system"
if str(SYSTEM_DIR) not in sys.path:
    sys.path.insert(0, str(SYSTEM_DIR))

from loop_rehearsal_fixture import (  # noqa: E402
    all_paths_machinery_owned,
    changed_paths_since,
    git_log_subjects,
    is_repo_clean,
    read_frontmatter,
    run_cut_path,
    run_discard_path,
    run_no_cut_path,
)

SITE_DIR = REPO_ROOT / "services" / "site"
OUT_DIR = SITE_DIR / "out"
PUBLIC_DIR = SITE_DIR / "public"
RSS_PATH = PUBLIC_DIR / "rss.xml"
SKILLS_DIR = PUBLIC_DIR / "skills"


# ---------------------------------------------------------------------------
# Slice capability proof (workbench service)
# ---------------------------------------------------------------------------
# Slice 4.2 proves the loop's machinery closes end to end before the operator's
# live run (02-loop-rehearsal.md): against a git-initialized fixture copy of the
# real topics/databases/ tree (the repo's own workbench/cli.mjs subprocessed
# with cwd at the fixture root — the CLI resolves its root as process.cwd()),
# the cut path yields exactly one `cut(databases): v2` commit whose tree passes
# the eleven-check gate and whose site build (STAYCURRENT_REPO_ROOT) renders v2's
# changelog entry standing alone with v1 archived; the no-cut path yields one
# `log(databases): no-cut` commit, a dated research-log entry, and no new
# version; the discard path yields zero commits and zero trace. Every changed
# path in each fixture diff belongs to the machinery's contract — the
# mechanical form of "zero hand-edits". The repository's own topics/ is never
# touched.


def test_cut_path_lands_one_machinery_commit_and_the_site_renders_v2(tmp_path):
    result = run_cut_path(tmp_path)
    fixture_root = result["fixture_root"]
    baseline = result["baseline"]
    today = result["today"]

    convene_result = result["convene_result"]
    assert convene_result.returncode == 0, (
        f"expected `convene {SLUG}` to exit 0.\nstdout:\n{convene_result.stdout}\n"
        f"stderr:\n{convene_result.stderr}"
    )
    assert "against v1" in convene_result.stdout
    assert result["session_file_existed_after_convene"], (
        "expected the session file to exist right after convene"
    )
    assert result["staged_dir_existed_after_convene"], "expected convene to seed the staged tree"
    assert result["live_status_after_convene"] == "in-research", (
        "expected convene to stamp the live article in-research"
    )

    gate_result = result["gate_result"]
    assert gate_result.returncode == 0, (
        f"expected `gate {SLUG}` to PASS after v2 authoring.\nstdout:\n{gate_result.stdout}\n"
        f"stderr:\n{gate_result.stderr}"
    )
    assert gate_result.stdout.strip() == f"PASS {SLUG} v2"

    cut_result = result["cut_result"]
    assert cut_result.returncode == 0, (
        f"expected `cut {SLUG}` to exit 0.\nstdout:\n{cut_result.stdout}\nstderr:\n{cut_result.stderr}"
    )
    assert f"cut({SLUG}): v2" in cut_result.stdout

    # Exactly one new commit landed, named cut(databases): v2.
    subjects = git_log_subjects(fixture_root)
    cut_commits = [s for s in subjects if s == f"cut({SLUG}): v2"]
    assert len(cut_commits) == 1, f"expected exactly one 'cut({SLUG}): v2' commit, found: {subjects}"
    assert len(subjects) == 2, f"expected baseline + one cut commit, found: {subjects}"

    topic_dir = fixture_root / "topics" / SLUG
    changelog_text = (topic_dir / "changelog.md").read_text()
    top_heading = next(
        (line for line in changelog_text.splitlines() if line.strip().startswith("## ")), None
    )
    assert top_heading is not None and top_heading.strip().startswith(f"## v2 — {today}"), (
        f"expected the changelog's top entry to be '## v2 — {today}', got {top_heading!r}"
    )

    v2_dir = topic_dir / "versions" / "v2"
    assert (v2_dir / "article.md").exists()
    assert (v2_dir / "skill" / "SKILL.md").exists()
    assert (v2_dir / "provenance.md").exists()

    live_fm = read_frontmatter(topic_dir / "article.md")
    assert live_fm["version"] == 2
    assert live_fm["status"] == "current"

    assert is_repo_clean(fixture_root), "expected a clean working tree after the cut"
    session_file = fixture_root / ".staycurrent" / "sessions" / f"{SLUG}.md"
    staged_dir = fixture_root / ".staycurrent" / "staged" / SLUG
    assert not session_file.exists(), "expected the session file removed after the cut"
    assert not staged_dir.exists(), "expected the staged tree removed after the cut"

    # Machinery-only mutation, mechanically: every changed path since baseline
    # belongs to topics/databases/**.
    changed = changed_paths_since(fixture_root, baseline)
    assert changed, "expected the cut to have changed at least one path"
    assert all(p.startswith(f"topics/{SLUG}/") for p in changed), (
        f"expected every changed path to live under topics/{SLUG}/, got: {changed}"
    )

    # --- Site-build half: the site pipeline renders v2 standing above v1 ---
    out_existed_before = OUT_DIR.exists()
    out_backup = tmp_path / "out-backup"
    if out_existed_before:
        shutil.copytree(OUT_DIR, out_backup)

    rss_existed_before = RSS_PATH.exists()
    rss_backup = tmp_path / "rss-backup.xml"
    if rss_existed_before:
        shutil.copy2(RSS_PATH, rss_backup)

    skills_existed_before = SKILLS_DIR.exists()
    skills_backup = tmp_path / "skills-backup"
    if skills_existed_before:
        shutil.copytree(SKILLS_DIR, skills_backup)

    try:
        # Turbopack does not key its .next cache on STAYCURRENT_REPO_ROOT, so a
        # prior build (the real v1-only tree, or an earlier fixture) leaves stale
        # route chunks that this build reuses wholesale — masking v2 render
        # regressions (false green) or missing the v2 entry (false red). Clear it
        # so the fixture-root build renders from scratch, matching the sibling
        # test_topic_versions_fixture harness.
        shutil.rmtree(SITE_DIR / ".next", ignore_errors=True)
        env = {**os.environ, "STAYCURRENT_REPO_ROOT": str(fixture_root)}
        build_result = subprocess.run(
            ["pnpm", "build"],
            cwd=SITE_DIR,
            env=env,
            capture_output=True,
            text=True,
            timeout=180,
        )
        combined = build_result.stdout + build_result.stderr
        assert build_result.returncode == 0, (
            f"expected `pnpm build` to succeed against the cut fixture.\n{combined}"
        )

        changelog_html = (OUT_DIR / SLUG / "changelog" / "index.html").read_text()
        assert 'id="v2"' in changelog_html and 'id="v1"' in changelog_html, (
            "expected both v2 and v1 changelog entries rendered"
        )
        assert changelog_html.index('id="v2"') < changelog_html.index('id="v1"'), (
            "expected v2 to stand above v1 in the rendered changelog"
        )

        archived_v1_html = (OUT_DIR / SLUG / "v" / "1" / "index.html").read_text()
        assert "archived-banner" in archived_v1_html, (
            "expected /databases/v/1/ to render the archived state (superseded banner)"
        )
        assert "version-redirect-stub" not in archived_v1_html, (
            "v1 is no longer current — it must render the archived page, not the redirect stub"
        )
        assert "<strong>v1</strong>" in archived_v1_html
        assert "<strong>v2</strong>" in archived_v1_html, (
            "expected the archived banner to name v2 as the current version"
        )

        rss_text = RSS_PATH.read_text()
        assert "<title>Databases v2</title>" in rss_text, (
            "expected the feed to carry the v2 changelog entry"
        )
    finally:
        if out_existed_before:
            shutil.rmtree(OUT_DIR, ignore_errors=True)
            shutil.copytree(out_backup, OUT_DIR)
        else:
            # out/ did not pre-exist (fresh clone, post git-clean, or the bet
            # suite running before any real build) — remove the fixture's v2
            # export so no later test that reads out/ sees fixture content.
            shutil.rmtree(OUT_DIR, ignore_errors=True)
        if rss_existed_before:
            shutil.copy2(rss_backup, RSS_PATH)
        else:
            RSS_PATH.unlink(missing_ok=True)
        if skills_existed_before:
            shutil.rmtree(SKILLS_DIR, ignore_errors=True)
            shutil.copytree(skills_backup, SKILLS_DIR)
        else:
            shutil.rmtree(SKILLS_DIR, ignore_errors=True)

    # The repository's own content tree is never touched by this proof.
    real_changelog = (REPO_ROOT / "topics" / SLUG / "changelog.md").read_text()
    assert "## v2" not in real_changelog, (
        "the repository's own topics/databases/changelog.md was modified by this test"
    )


def test_no_cut_path_logs_the_run_without_cutting(tmp_path):
    lines = [
        "Reviewed Postgres 18's asynchronous I/O release notes.",
        "Nothing found touches the stance or a named claim.",
    ]
    result = run_no_cut_path(tmp_path, lines)
    fixture_root = result["fixture_root"]
    baseline = result["baseline"]

    assert result["convene_result"].returncode == 0

    log_result = result["log_result"]
    assert log_result.returncode == 0, (
        f"expected `log {SLUG}` to exit 0.\nstdout:\n{log_result.stdout}\nstderr:\n{log_result.stderr}"
    )
    assert f"log({SLUG}): no-cut" in log_result.stdout

    subjects = git_log_subjects(fixture_root)
    no_cut_commits = [s for s in subjects if s == f"log({SLUG}): no-cut"]
    assert len(no_cut_commits) == 1, f"expected exactly one 'log({SLUG}): no-cut' commit, found: {subjects}"
    assert len(subjects) == 2, f"expected baseline + one log commit, found: {subjects}"

    topic_dir = fixture_root / "topics" / SLUG
    research_log = (topic_dir / "research-log.md").read_text()
    assert any(
        line.strip().startswith("## ") and line.strip().endswith("— no-cut")
        for line in research_log.splitlines()
    ), f"expected a '## <date> — no-cut' heading in research-log.md, got:\n{research_log}"
    for line in lines:
        assert line in research_log

    live_fm = read_frontmatter(topic_dir / "article.md")
    assert live_fm["status"] == "current"
    assert live_fm["version"] == 1

    assert not (topic_dir / "versions" / "v2").exists(), "expected no version increment on no-cut"
    changelog_text = (topic_dir / "changelog.md").read_text()
    assert "## v2" not in changelog_text, "expected no changelog change on no-cut"

    session_file = fixture_root / ".staycurrent" / "sessions" / f"{SLUG}.md"
    staged_dir = fixture_root / ".staycurrent" / "staged" / SLUG
    assert not session_file.exists(), "expected the session file removed after log"
    assert not staged_dir.exists(), "expected the staged tree removed after log"
    assert is_repo_clean(fixture_root)

    changed = changed_paths_since(fixture_root, baseline)
    assert changed, "expected the no-cut resolution to have changed at least one path"
    assert all(p.startswith(f"topics/{SLUG}/") for p in changed), (
        f"expected every changed path to live under topics/{SLUG}/, got: {changed}"
    )


def test_discard_path_leaves_zero_trace(tmp_path):
    result = run_discard_path(tmp_path)
    fixture_root = result["fixture_root"]
    baseline = result["baseline"]

    assert result["convene_result"].returncode == 0

    discard_result = result["discard_result"]
    assert discard_result.returncode == 0, (
        f"expected `discard {SLUG}` to exit 0.\nstdout:\n{discard_result.stdout}\n"
        f"stderr:\n{discard_result.stderr}"
    )
    assert "status reverted to current" in discard_result.stdout

    subjects = git_log_subjects(fixture_root)
    assert len(subjects) == 1, f"expected zero commits beyond the baseline, found: {subjects}"

    session_file = fixture_root / ".staycurrent" / "sessions" / f"{SLUG}.md"
    staged_dir = fixture_root / ".staycurrent" / "staged" / SLUG
    assert not session_file.exists()
    assert not staged_dir.exists()

    topic_dir = fixture_root / "topics" / SLUG
    live_fm = read_frontmatter(topic_dir / "article.md")
    assert live_fm["status"] == "current"
    assert live_fm["version"] == 1

    assert is_repo_clean(fixture_root)

    real_research_log = (REPO_ROOT / "topics" / SLUG / "research-log.md").read_text()
    fixture_research_log = (topic_dir / "research-log.md").read_text()
    assert fixture_research_log == real_research_log, "expected research-log.md unchanged by discard"

    changed = changed_paths_since(fixture_root, baseline)
    assert changed == set(), f"expected zero trace after discard, found changed paths: {changed}"


def test_every_fixture_mutation_belongs_to_the_machinery(tmp_path):
    cut_result = run_cut_path(tmp_path / "cut")
    no_cut_result = run_no_cut_path(tmp_path / "no-cut", ["A fixture finding line for the no-cut path."])
    discard_result = run_discard_path(tmp_path / "discard")

    assert cut_result["cut_result"].returncode == 0
    assert no_cut_result["log_result"].returncode == 0
    assert discard_result["discard_result"].returncode == 0

    for label, result in (("cut", cut_result), ("no-cut", no_cut_result), ("discard", discard_result)):
        fixture_root = result["fixture_root"]
        baseline = result["baseline"]
        changed = changed_paths_since(fixture_root, baseline)
        assert all_paths_machinery_owned(changed), (
            f"[{label}] expected every changed path to belong to the machinery's contract "
            f"(topics/{SLUG}/** or .staycurrent/**), found: {changed}"
        )
        assert is_repo_clean(fixture_root), f"[{label}] expected a clean working tree at the end of the path"

    # The discard path in particular must leave literally zero trace — the
    # strictest member of the allowlist check above.
    assert changed_paths_since(discard_result["fixture_root"], discard_result["baseline"]) == set()
