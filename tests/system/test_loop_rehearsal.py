"""Loop-rehearsal permanent coverage.

A regression guard over the CLI-integration layer the research loop relies
on — `workbench/cli.mjs` subprocessed against a git-initialized fixture copy
of the real `topics/databases/` tree, driving `convene`/`gate`/`cut`/`discard`
through the real publish gate and cut mechanics.

Split rationale: the CUT path and the DISCARD path are covered here, without
the site build. Cut is the highest-value guard — it is the only path that
exercises the full gate + executeCut + commit chain a new version snapshot
depends on. Discard is its zero-mutation complement, proving the guard rails
hold when a run is abandoned. The NO-CUT path (`log`/`recordNoCut`) is not
pinned here: `recordNoCut` already carries its own unit coverage at the core
level (core/src/session/recordNoCut.test.ts), so the marginal value of also
pinning its CLI-subprocess wrapper is lower than the cut path's. The site
build (the expensive half) stays out of this module by design — the
archived-version-page and changelog-ordering rendering a cut produces is
pinned in tests/system/test_topic_versions_fixture.py instead.
"""

from loop_rehearsal_fixture import (
    SLUG,
    all_paths_machinery_owned,
    changed_paths_since,
    git_log_subjects,
    is_repo_clean,
    read_frontmatter,
    run_cut_path,
    run_discard_path,
)


def test_cut_path_lands_exactly_one_commit_through_the_real_gate_and_cut_mechanics(tmp_path):
    result = run_cut_path(tmp_path)
    fixture_root = result["fixture_root"]
    baseline = result["baseline"]
    next_version = result["next_version"]
    assert next_version == result["live_version"] + 1, (
        "the rehearsal's staged set must be authored exactly one version above the live tree"
    )

    assert result["convene_result"].returncode == 0, result["convene_result"].stderr
    assert result["gate_result"].returncode == 0, (
        f"expected the staged v{next_version} set to PASS the gate.\n{result['gate_result'].stdout}"
    )
    assert result["cut_result"].returncode == 0, result["cut_result"].stderr

    subjects = git_log_subjects(fixture_root)
    assert subjects.count(f"cut({SLUG}): v{next_version}") == 1, (
        f"expected exactly one 'cut({SLUG}): v{next_version}' commit, found: {subjects}"
    )
    assert len(subjects) == 2, f"expected baseline + one cut commit only, found: {subjects}"

    topic_dir = fixture_root / "topics" / SLUG
    live_fm = read_frontmatter(topic_dir / "article.md")
    assert live_fm["version"] == next_version
    assert live_fm["status"] == "current"

    next_dir = topic_dir / "versions" / f"v{next_version}"
    assert (next_dir / "article.md").exists()
    assert (next_dir / "provenance.md").exists()

    changelog_text = (topic_dir / "changelog.md").read_text()
    top_heading = next(
        (line for line in changelog_text.splitlines() if line.strip().startswith("## ")), None
    )
    assert top_heading is not None and top_heading.strip().startswith(f"## v{next_version} —"), (
        f"expected the changelog's top entry to be a '## v{next_version}' heading, got {top_heading!r}"
    )

    assert not (fixture_root / ".staycurrent" / "sessions" / f"{SLUG}.md").exists()
    assert not (fixture_root / ".staycurrent" / "staged" / SLUG).exists()
    assert is_repo_clean(fixture_root)

    changed = changed_paths_since(fixture_root, baseline)
    assert changed, "expected the cut to have changed at least one path"
    assert all_paths_machinery_owned(changed), (
        f"expected every changed path to belong to topics/{SLUG}/**, found: {changed}"
    )
    assert all(p.startswith(f"topics/{SLUG}/") for p in changed), (
        f"the cut path must never touch .staycurrent/ in its committed diff, found: {changed}"
    )


def test_discard_path_leaves_zero_trace(tmp_path):
    result = run_discard_path(tmp_path)
    fixture_root = result["fixture_root"]
    baseline = result["baseline"]

    assert result["convene_result"].returncode == 0, result["convene_result"].stderr
    assert result["discard_result"].returncode == 0, result["discard_result"].stderr
    assert "status reverted to current" in result["discard_result"].stdout

    subjects = git_log_subjects(fixture_root)
    assert len(subjects) == 1, f"expected zero commits beyond the baseline, found: {subjects}"

    assert not (fixture_root / ".staycurrent" / "sessions" / f"{SLUG}.md").exists()
    assert not (fixture_root / ".staycurrent" / "staged" / SLUG).exists()

    live_fm = read_frontmatter(fixture_root / "topics" / SLUG / "article.md")
    assert live_fm["status"] == "current"
    assert live_fm["version"] == result["live_version"], (
        "a discard must leave the live version exactly where the baseline had it"
    )

    assert is_repo_clean(fixture_root)
    assert changed_paths_since(fixture_root, baseline) == set(), (
        "expected literally zero changed paths after a discard"
    )
