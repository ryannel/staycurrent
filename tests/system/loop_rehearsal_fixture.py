"""Shared loop-rehearsal harness (bet first-living-topic, slice 4.2,
02-loop-rehearsal.md).

Builds a git-initialized fixture copy of the real `topics/databases/` tree
and drives the repository's own `workbench/cli.mjs` against it as a
subprocess (the CLI resolves its root as `process.cwd()`, and its
`../core/dist` import resolves relative to the CLI file itself — the
fixture repo never needs its own copy of `workbench/` or `core/`). The
repository's own `topics/` is never touched; every mutation lands only in a
`tmp_path` fixture.

Used by BOTH:
- `tests/bets/first-living-topic/test_slice_15_workbench_loop-rehearsal.py`
  (temporary bet-progress suite, archived at bet close) — drives all three
  resolution paths (cut, no-cut, discard) plus the real site build.
- `tests/system/test_loop_rehearsal.py` (permanent regression module) — the
  cut and discard paths only, without the site build (the expensive half),
  per this slice's stack-testing-strategy rollout.

Keeping the fixture-building and CLI-driving primitives in one module means
the two suites can never drift on how the fixture is built or the CLI is
invoked — only what each suite chooses to assert (and, for the bet suite,
the additional site-build proof) differs.
"""

from __future__ import annotations

import re
import subprocess
from datetime import datetime, timezone
from pathlib import Path

import yaml

REPO_ROOT = Path(__file__).resolve().parents[2]
CLI_PATH = REPO_ROOT / "workbench" / "cli.mjs"
SLUG = "databases"

FRONTMATTER_RE = re.compile(r"^---\n(.*?)\n---\n", re.DOTALL)


# ---------------------------------------------------------------------------
# Fixture construction
# ---------------------------------------------------------------------------


def build_fixture_repo(tmp_path: Path) -> Path:
    """A git-initialized fixture at `tmp_path/fixture-root/` carrying a copy
    of the real `topics/databases/` tree and `site.config.json`, committed as
    one baseline commit. `tmp_path` is created if it does not already exist —
    callers driving several fixtures under one test function pass distinct
    subdirectories of pytest's own `tmp_path`."""
    import shutil

    tmp_path.mkdir(parents=True, exist_ok=True)
    fixture_root = tmp_path / "fixture-root"
    (fixture_root / "topics").mkdir(parents=True)
    shutil.copytree(REPO_ROOT / "topics" / SLUG, fixture_root / "topics" / SLUG)
    shutil.copy2(REPO_ROOT / "site.config.json", fixture_root / "site.config.json")
    # Mirrors the real repo's .gitignore for the two quarantine paths
    # (04-data-design.md) — belt and suspenders; gitAddCommit's pathspec
    # (`topics/<slug>/`) already never sweeps .staycurrent/ in regardless.
    (fixture_root / ".gitignore").write_text(
        ".staycurrent/sessions/\n.staycurrent/staged/\n"
    )

    subprocess.run(["git", "init", "-q"], cwd=fixture_root, check=True)
    subprocess.run(
        ["git", "config", "user.email", "loop-rehearsal@example.com"],
        cwd=fixture_root,
        check=True,
    )
    subprocess.run(
        ["git", "config", "user.name", "Loop Rehearsal Fixture"], cwd=fixture_root, check=True
    )
    subprocess.run(["git", "add", "-A"], cwd=fixture_root, check=True)
    subprocess.run(
        ["git", "commit", "-q", "-m", "baseline: seed fixture from topics/databases"],
        cwd=fixture_root,
        check=True,
    )
    return fixture_root


def baseline_sha(fixture_root: Path) -> str:
    result = subprocess.run(
        ["git", "rev-parse", "HEAD"], cwd=fixture_root, capture_output=True, text=True, check=True
    )
    return result.stdout.strip()


# ---------------------------------------------------------------------------
# CLI + git probes
# ---------------------------------------------------------------------------


def run_cli(fixture_root: Path, args: list[str], timeout: int = 30) -> subprocess.CompletedProcess:
    """Subprocesses the repository's own workbench/cli.mjs with cwd at the
    fixture root."""
    return subprocess.run(
        ["node", str(CLI_PATH), *args],
        cwd=fixture_root,
        capture_output=True,
        text=True,
        timeout=timeout,
    )


def git_log_subjects(fixture_root: Path) -> list[str]:
    """One-line commit subjects, oldest first (baseline included)."""
    result = subprocess.run(
        ["git", "log", "--reverse", "--format=%s"],
        cwd=fixture_root,
        capture_output=True,
        text=True,
        check=True,
    )
    return [line for line in result.stdout.splitlines() if line.strip()]


def changed_paths_since(fixture_root: Path, baseline: str) -> set[str]:
    """Every path touched since `baseline`: the committed diff
    (`baseline..HEAD`) union the current working tree's own status
    (staged/unstaged/untracked) — the mechanical union a clean resolution
    must confine to the machinery's own contract."""
    diff = subprocess.run(
        ["git", "diff", "--name-only", f"{baseline}..HEAD"],
        cwd=fixture_root,
        capture_output=True,
        text=True,
        check=True,
    )
    status = subprocess.run(
        ["git", "status", "--porcelain"], cwd=fixture_root, capture_output=True, text=True, check=True
    )
    paths = {line.strip() for line in diff.stdout.splitlines() if line.strip()}
    for line in status.stdout.splitlines():
        if line.strip():
            paths.add(line[3:].strip())
    return paths


def is_repo_clean(fixture_root: Path) -> bool:
    result = subprocess.run(
        ["git", "status", "--porcelain"], cwd=fixture_root, capture_output=True, text=True, check=True
    )
    return result.stdout.strip() == ""


def all_paths_machinery_owned(paths: set[str]) -> bool:
    """The mechanical form of the zero-hand-edits invariant: every changed
    path belongs to the session/gate/cut mechanics' own contract."""
    return all(p.startswith(f"topics/{SLUG}/") or p.startswith(".staycurrent/") for p in paths)


def read_frontmatter(path: Path) -> dict:
    text = path.read_text()
    m = FRONTMATTER_RE.match(text)
    assert m, f"{path} has no frontmatter block"
    return yaml.safe_load(m.group(1)) or {}


# ---------------------------------------------------------------------------
# Next-version staged authoring — exactly per
# .agents/skills/staycurrent-writer/SKILL.md
# ---------------------------------------------------------------------------


def author_next_version_staged_set(staged_dir: Path, today: str) -> int:
    """Authors a small, realistic next-version delta into an already-convened
    staged tree, version-agnostically: the live version N is read from the
    staged article (convene seeds it from the live tree) and the set is
    authored as N+1, so the rehearsal keeps working after every real cut
    advances the topic. The set: the article rewrite (version bump + one new
    finding paragraph), the changelog's prepended '## v<N+1>' mini-essay with
    a line-start (never bulleted) Stance line, versions/v<N+1>/{article.md,
    skill/, provenance.md} with >=1 sourced and >=1 synthesis provenance
    entry, and both skill copies riding the bumped article_version — content
    unchanged per change-proposal-2, only the version binding moves. Returns
    the authored version number N+1."""

    article_path = staged_dir / "article.md"
    original = article_path.read_text()
    live_version = read_frontmatter(article_path)["version"]
    next_version = live_version + 1

    new_subsection = (
        "\n### Postgres 18 narrows the gap further\n\n"
        "Postgres 18 (2026) shipped asynchronous I/O for sequential scans and "
        "vacuum, cutting one more reason teams reached for a dedicated "
        "analytical engine on read-heavy workloads. It is one more data point "
        "for the absorption argument above, not a new force: the "
        "operational-bill logic already explained why a narrowing gap keeps "
        "favouring the general-purpose default.\n"
    )
    anchor = "\n## What would change this stance\n"
    assert anchor in original, "expected the fixture article to carry its known closing section"
    updated = original.replace(anchor, new_subsection + anchor, 1)

    bumped = re.sub(
        rf"(?m)^version: {live_version}$", f"version: {next_version}", updated, count=1
    )
    # re.sub silently no-ops on a miss (e.g. a padded or quoted frontmatter
    # value YAML still parses as the same int) — an unbumped article must fail
    # here, at the cause, not downstream at the gate.
    assert bumped != updated, (
        f"article version bump regex matched nothing — expected a literal 'version: {live_version}' line"
    )
    updated = re.sub(
        r"(?m)^last_researched: \d{4}-\d{2}-\d{2}$", f"last_researched: {today}", bumped, count=1
    )
    article_path.write_text(updated)

    # versions/v<N+1>/article.md — the frozen pair's article half: frontmatter
    # reduced to exactly `version` + `cut`, no `status` field.
    body_only = updated.split("---", 2)[2].lstrip("\n")
    next_dir = staged_dir / "versions" / f"v{next_version}"
    next_dir.mkdir(parents=True, exist_ok=True)
    (next_dir / "article.md").write_text(
        f"---\nversion: {next_version}\ncut: {today}\n---\n\n{body_only}"
    )

    # changelog.md — prepend the next version's mini-essay above the existing
    # entries.
    changelog_path = staged_dir / "changelog.md"
    changelog = changelog_path.read_text()
    next_entry = (
        f"## v{next_version} — {today}\n\n"
        "**What moved:** Postgres 18 shipped asynchronous I/O for sequential "
        "scans and vacuum, narrowing one more operational gap that used to "
        "justify a second analytical engine for read-heavy workloads.\n\n"
        "**What it means:** the absorption argument gains another data point "
        "— deferring a second engine on the strength of the extension "
        "ecosystem keeps paying off, and none of the three named breaking "
        "points (global write scale, sub-millisecond caching, billion-scale "
        "vector recall) move.\n\n"
        "**Stance:** held — Postgres 18's asynchronous I/O reinforces the "
        "general-purpose-first stance rather than testing it.\n\n"
    )
    heading, _, rest = changelog.partition("\n\n")
    changelog_path.write_text(f"{heading}\n\n{next_entry}{rest}")

    # provenance.md — two sections, at least one entry each.
    provenance_path = next_dir / "provenance.md"
    provenance_path.write_text(
        "## Sources\n\n"
        "- [PostgreSQL Documentation](https://www.postgresql.org/docs/current/release-18.html) "
        f"— accessed {today} — supports: the asynchronous I/O feature for "
        "sequential scans and vacuum cited in the changelog entry.\n\n"
        "## Synthesis\n\n"
        "- The absorption argument extends: each additional in-core capability "
        "(here, asynchronous I/O closing an OLTP-adjacent gap) is one more "
        "reason a second, specialised engine's operational bill stays hard to "
        "justify on performance grounds alone.\n"
    )

    # Skill snapshot — both staged copies bump article_version; content rides
    # unchanged (change-proposal-2), only the version binding moves.
    live_skill_path = staged_dir / "skill" / "SKILL.md"
    original_skill = live_skill_path.read_text()
    bumped_skill = re.sub(
        rf"(?m)^article_version: {live_version}$",
        f"article_version: {next_version}",
        original_skill,
        count=1,
    )
    assert bumped_skill != original_skill, (
        f"skill version bump regex matched nothing — expected a literal "
        f"'article_version: {live_version}' line (does SKILL.md's binding match the article's version?)"
    )
    live_skill_path.write_text(bumped_skill)
    next_skill_dir = next_dir / "skill"
    next_skill_dir.mkdir(parents=True, exist_ok=True)
    (next_skill_dir / "SKILL.md").write_text(bumped_skill)

    return next_version


# ---------------------------------------------------------------------------
# Full-path orchestration — the three resolutions the loop can reach
# ---------------------------------------------------------------------------


def run_cut_path(tmp_path: Path) -> dict:
    """Fresh fixture -> convene -> author the next-version staged set -> gate
    -> cut. Runs the full choreography synchronously (cut's own cleanup
    removes the session file and staged tree at the end), so the dict also
    carries the convene-time checkpoint facts (session file / staged tree
    presence, the live article's stamped status) a caller cannot observe
    after the fact, plus the live/next version pair the assertions key on."""
    fixture_root = build_fixture_repo(tmp_path)
    baseline = baseline_sha(fixture_root)
    live_version = read_frontmatter(fixture_root / "topics" / SLUG / "article.md")["version"]
    convene_result = run_cli(fixture_root, ["convene", SLUG])
    # UTC, mirroring the CLI's own todayIso() (workbench/cli.mjs) and the gate's
    # Date.UTC(...) clock (runPublishGate.checkCadenceDateValid) — a local-time
    # date would author last_researched/cut one day ahead of the gate's UTC
    # "today" in the pre-dawn window east of UTC and flake the cut-path gate red.
    today = datetime.now(timezone.utc).date().isoformat()
    staged_dir = fixture_root / ".staycurrent" / "staged" / SLUG
    session_file = fixture_root / ".staycurrent" / "sessions" / f"{SLUG}.md"
    session_file_existed_after_convene = session_file.exists()
    staged_dir_existed_after_convene = staged_dir.is_dir()
    live_status_after_convene = None
    next_version = None
    if convene_result.returncode == 0:
        live_status_after_convene = read_frontmatter(
            fixture_root / "topics" / SLUG / "article.md"
        ).get("status")
        next_version = author_next_version_staged_set(staged_dir, today)
    gate_result = run_cli(fixture_root, ["gate", SLUG])
    cut_result = run_cli(fixture_root, ["cut", SLUG])
    return {
        "fixture_root": fixture_root,
        "baseline": baseline,
        "today": today,
        "live_version": live_version,
        "next_version": next_version,
        "convene_result": convene_result,
        "gate_result": gate_result,
        "cut_result": cut_result,
        "session_file_existed_after_convene": session_file_existed_after_convene,
        "staged_dir_existed_after_convene": staged_dir_existed_after_convene,
        "live_status_after_convene": live_status_after_convene,
    }


def run_no_cut_path(tmp_path: Path, lines: list[str]) -> dict:
    """Fresh fixture -> convene -> log (no-cut)."""
    fixture_root = build_fixture_repo(tmp_path)
    baseline = baseline_sha(fixture_root)
    convene_result = run_cli(fixture_root, ["convene", SLUG])
    log_args = ["log", SLUG]
    for line in lines:
        log_args += ["--line", line]
    log_result = run_cli(fixture_root, log_args)
    return {
        "fixture_root": fixture_root,
        "baseline": baseline,
        "convene_result": convene_result,
        "log_result": log_result,
    }


def run_discard_path(tmp_path: Path) -> dict:
    """Fresh fixture -> convene -> discard."""
    fixture_root = build_fixture_repo(tmp_path)
    baseline = baseline_sha(fixture_root)
    live_version = read_frontmatter(fixture_root / "topics" / SLUG / "article.md")["version"]
    convene_result = run_cli(fixture_root, ["convene", SLUG])
    discard_result = run_cli(fixture_root, ["discard", SLUG])
    return {
        "fixture_root": fixture_root,
        "baseline": baseline,
        "live_version": live_version,
        "convene_result": convene_result,
        "discard_result": discard_result,
    }
