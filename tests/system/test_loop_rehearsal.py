"""Loop-rehearsal permanent coverage — Slice 4.2 (loop-rehearsal, bet
first-living-topic).

The bet-progress suite (tests/bets/first-living-topic/test_slice_15_workbench_
loop-rehearsal.py) proves the loop's three resolutions (cut, no-cut, discard)
end to end once, including the real site build, and is archived at bet close.
This file is what stays: a permanent regression guard over the CLI-integration
layer that mechanism relies on — `workbench/cli.mjs` subprocessed against a
git-initialized fixture copy of the real `topics/databases/` tree, driving
`convene`/`gate`/`cut`/`discard` through the real eleven-check publish gate
and cut mechanics.

Split rationale (this slice's rollout): the CUT path and the DISCARD path are
promoted here, without the site build. Cut is the highest-value permanent
guard — it is the only path that exercises the full gate + executeCut +
commit chain a v2 version snapshot depends on. Discard is its zero-mutation
complement, proving the guard rails hold when a run is abandoned. The NO-CUT
path (`log`/`recordNoCut`) is left to the bet-progress archive rather than
promoted alongside them: `recordNoCut` already carries its own permanent unit
coverage at the core level (core/src/session/recordNoCut.test.ts), so the
marginal permanent value of also pinning its CLI-subprocess wrapper here is
lower than the cut path's, and the site build (the other, more expensive half
of the bet-progress proof) stays out of this permanent module by design — it
is proven once, structurally, not on every regression run; the site's own
existing permanent coverage (tests/system/test_topic_versions_fixture.py)
already pins the archived-version-page and changelog-ordering rendering this
slice's site-build proof exercised.
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

    assert result["convene_result"].returncode == 0, result["convene_result"].stderr
    assert result["gate_result"].returncode == 0, (
        f"expected the staged v2 set to PASS the gate.\n{result['gate_result'].stdout}"
    )
    assert result["cut_result"].returncode == 0, result["cut_result"].stderr

    subjects = git_log_subjects(fixture_root)
    assert subjects.count(f"cut({SLUG}): v2") == 1, (
        f"expected exactly one 'cut({SLUG}): v2' commit, found: {subjects}"
    )
    assert len(subjects) == 2, f"expected baseline + one cut commit only, found: {subjects}"

    topic_dir = fixture_root / "topics" / SLUG
    live_fm = read_frontmatter(topic_dir / "article.md")
    assert live_fm["version"] == 2
    assert live_fm["status"] == "current"

    v2_dir = topic_dir / "versions" / "v2"
    assert (v2_dir / "article.md").exists()
    assert (v2_dir / "skill" / "SKILL.md").exists()
    assert (v2_dir / "provenance.md").exists()

    changelog_text = (topic_dir / "changelog.md").read_text()
    top_heading = next(
        (line for line in changelog_text.splitlines() if line.strip().startswith("## ")), None
    )
    assert top_heading is not None and top_heading.strip().startswith("## v2 —"), (
        f"expected the changelog's top entry to be a '## v2' heading, got {top_heading!r}"
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
    assert live_fm["version"] == 1

    assert is_repo_clean(fixture_root)
    assert changed_paths_since(fixture_root, baseline) == set(), (
        "expected literally zero changed paths after a discard"
    )
