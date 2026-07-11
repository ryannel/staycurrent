"""Distribution-artifact permanent coverage — Slice 3.3 (distribution, bet
first-living-topic).

The bet-progress suite already proved these artifacts exist in the static
export at build time (test_slice_12_site_distribution.py). These permanent
tests pin two things that suite doesn't: the artifacts are actually SERVED
(not merely present on disk) at the real origin, and `scripts/prebuild.mjs`
itself — the one place a listTopics error sweep or an I/O failure must exit
non-zero BEFORE `next build` ever starts (Site Build Data Flow's Failure
modes) — genuinely does that for two concrete failure shapes, cheaply,
without running a full `pnpm build`.

The two prebuild-invoking tests below call `node scripts/prebuild.mjs`
directly against a throwaway fixture root. That script always writes into
THIS repo's real `services/site/public/` (`PUBLIC_DIR = resolve(cwd(),
'public')`, not `STAYCURRENT_REPO_ROOT`-relative) — the invalid-frontmatter
case fails before any write, but the missing-`skill/` case fails only after
rss.xml is written and `public/skills/` is rebuilt, so that test backs up and
restores both around the run (the same pollution
`test_topic_versions_fixture.py`'s harness guards against for a full build).
"""

import io
import json
import os
import subprocess
import shutil
import tempfile
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path

import httpx

REPO_ROOT = Path(__file__).resolve().parents[2]
SITE_DIR = REPO_ROOT / "services" / "site"
PUBLIC_DIR = SITE_DIR / "public"
RSS_PATH = PUBLIC_DIR / "rss.xml"
SKILLS_DIR = PUBLIC_DIR / "skills"
SLUG = "databases"


def test_rss_feed_is_served_and_validates(cluster, surfaces):
    base = surfaces["site"]["reach"]
    resp = httpx.get(f"{base}/rss.xml", timeout=10.0)
    assert resp.status_code == 200

    channel = ET.fromstring(resp.text)
    items = channel.findall("./channel/item")
    assert len(items) >= 1, "expected rss.xml to validate and carry at least one item"


def test_skill_zip_is_served_and_unzips_to_a_single_top_level_dir(cluster, surfaces):
    base = surfaces["site"]["reach"]
    resp = httpx.get(f"{base}/skills/{SLUG}.zip", timeout=10.0)
    assert resp.status_code == 200

    with zipfile.ZipFile(io.BytesIO(resp.content)) as zf:
        names = zf.namelist()
        assert names, "expected the served zip to carry at least one entry"
        assert all(n.startswith(f"{SLUG}/") for n in names), (
            "expected a single top-level <slug>/ directory in the zip — never "
            "loose files at the archive root (03-api-design.md's distribution "
            "contract)"
        )
        assert not any(n.endswith("index.html") for n in names), (
            "expected the zip to carry only the skill payload — the browsable "
            "tree's own index.html (GitHub Pages has no directory listing of "
            "its own) must never ride along in the archive"
        )
        skill_md = zf.read(f"{SLUG}/SKILL.md").decode()

    assert "article_version:" in skill_md, "expected the payload's article_version binding"
    assert "not yet authored" in skill_md.lower() or "placeholder" in skill_md.lower(), (
        "expected the honest placeholder labelling inside the served payload "
        "(change-proposal-2)"
    )


def test_skill_payload_directory_serves_a_minimal_index_naming_skill_md(cluster, surfaces):
    """GitHub Pages serves no directory listing of its own for the raw copied
    payload tree — history rows and the superseded-skill pointer link
    straight into `/skills/<slug>/[v/<n>/]`, so this route needs its own
    minimal, self-contained index.html or a reader following one of those
    links dead-ends."""
    base = surfaces["site"]["reach"]
    resp = httpx.get(f"{base}/skills/{SLUG}/", timeout=10.0)
    assert resp.status_code == 200
    assert "SKILL.md" in resp.text, (
        "expected the payload directory's minimal index.html to list "
        "SKILL.md as a relative link"
    )
    assert f"/{SLUG}/skill/" in resp.text, (
        "expected a link back to the topic's skill install page"
    )


def _run_prebuild(fixture_root: Path) -> subprocess.CompletedProcess:
    """Runs the prebuild script directly (no `next build`) — cheap, and the
    only way to reach its own fail-closed exit in isolation."""
    env = {**os.environ, "STAYCURRENT_REPO_ROOT": str(fixture_root)}
    return subprocess.run(
        ["node", "scripts/prebuild.mjs"],
        cwd=SITE_DIR,
        env=env,
        capture_output=True,
        text=True,
        timeout=30,
    )


def test_prebuild_exits_non_zero_naming_the_slug_for_an_invalid_frontmatter_topic():
    """listTopics' sweep runs BEFORE any write (main()'s first step) — this
    case fails closed with no touch to the real public/ at all."""
    with tempfile.TemporaryDirectory(prefix="staycurrent-prebuild-invalid-fm-") as tmp:
        fixture_root = Path(tmp) / "fixture-root"
        topic_dir = fixture_root / "topics" / "broken-frontmatter"
        topic_dir.mkdir(parents=True)
        (topic_dir / "article.md").write_text(
            "---\n"
            "topic: broken-frontmatter\n"
            "title: Broken Frontmatter Fixture\n"
            'stance: "A committed one-sentence position for testing purposes."\n'
            "version: 1\n"
            "status: current\n"
            "cadence: not-a-cadence\n"
            "last_researched: 2026-01-15\n"
            "---\n\n"
            "# Broken Frontmatter Fixture\n\nBody.\n"
        )

        result = _run_prebuild(fixture_root)

        combined = result.stdout + result.stderr
        assert result.returncode != 0, (
            f"expected prebuild to exit non-zero for an invalid-frontmatter topic.\n{combined}"
        )
        assert "broken-frontmatter" in combined, (
            f"expected the offending slug named in prebuild's output.\n{combined}"
        )


def test_prebuild_exits_non_zero_naming_the_slug_when_a_topic_lacks_skill_dir():
    """A validly-frontmattered, changelog-complete topic with no topics/<slug>/
    skill/ at all — listTopics and buildRss both succeed (rss.xml DOES get
    written to the real public/ before this fails), so this fails only in the
    skill-materialization loop's `cpSync`/ENOENT. public/rss.xml + public/
    skills/ are backed up and restored around the run."""
    rss_existed_before = RSS_PATH.exists()
    skills_existed_before = SKILLS_DIR.exists()

    with tempfile.TemporaryDirectory(prefix="staycurrent-prebuild-no-skill-") as tmp:
        tmp_path = Path(tmp)
        fixture_root = tmp_path / "fixture-root"
        topic_dir = fixture_root / "topics" / "no-skill-topic"
        topic_dir.mkdir(parents=True)
        (topic_dir / "article.md").write_text(
            "---\n"
            "topic: no-skill-topic\n"
            "title: No Skill Topic Fixture\n"
            'stance: "A committed one-sentence position for testing purposes."\n'
            "version: 1\n"
            "status: current\n"
            "cadence: 90d\n"
            "last_researched: 2026-01-15\n"
            "---\n\n"
            "# No Skill Topic Fixture\n\nBody.\n"
            # Deliberately no topics/no-skill-topic/skill/ directory.
        )
        (topic_dir / "changelog.md").write_text(
            "# No Skill Topic Fixture — Changelog\n\n## v1 — 2026-01-15\n\nFounding note.\n"
        )
        (fixture_root / "site.config.json").write_text(
            json.dumps(
                {
                    "name": "Fixture Site",
                    "url": "https://fixture.example.test",
                    "description": "A fixture site.config.json for the missing-skill/ fail-closed proof.",
                    "author": "fixture author",
                }
            )
        )

        rss_backup = tmp_path / "rss-backup.xml"
        if rss_existed_before:
            shutil.copy2(RSS_PATH, rss_backup)
        skills_backup = tmp_path / "skills-backup"
        if skills_existed_before:
            shutil.copytree(SKILLS_DIR, skills_backup)

        try:
            result = _run_prebuild(fixture_root)

            combined = result.stdout + result.stderr
            assert result.returncode != 0, (
                f"expected prebuild to exit non-zero for a topic missing skill/.\n{combined}"
            )
            assert "no-skill-topic" in combined, (
                f"expected the offending slug named in prebuild's output.\n{combined}"
            )
        finally:
            if rss_existed_before:
                shutil.copy2(rss_backup, RSS_PATH)
            else:
                RSS_PATH.unlink(missing_ok=True)

            if skills_existed_before:
                shutil.rmtree(SKILLS_DIR, ignore_errors=True)
                shutil.copytree(skills_backup, SKILLS_DIR)
            else:
                shutil.rmtree(SKILLS_DIR, ignore_errors=True)
