"""Distribution-artifact permanent coverage.

These tests pin two things: the RSS feed is actually SERVED (not merely
present on disk) at the real origin, and `scripts/prebuild.mjs` itself — the
one place a listTopics error sweep or an I/O failure must exit non-zero
BEFORE `next build` ever starts — genuinely does that for a concrete failure
shape, cheaply, without running a full `pnpm build`.

The prebuild-invoking test below calls `node scripts/prebuild.mjs` directly
against a throwaway fixture root. That script always writes into THIS repo's
real `services/site/public/` (`PUBLIC_DIR = resolve(cwd(), 'public')`, not
`STAYCURRENT_REPO_ROOT`-relative) — the invalid-frontmatter case fails before
any write, so nothing needs backing up around the run (the same pollution
`test_topic_versions_fixture.py`'s harness guards against for a full build).
"""

import os
import subprocess
import tempfile
import xml.etree.ElementTree as ET
from pathlib import Path

import httpx

REPO_ROOT = Path(__file__).resolve().parents[2]
SITE_DIR = REPO_ROOT / "services" / "site"


def test_rss_feed_is_served_and_validates(cluster, surfaces):
    base = surfaces["site"]["reach"]
    resp = httpx.get(f"{base}/rss.xml", timeout=10.0)
    assert resp.status_code == 200

    channel = ET.fromstring(resp.text)
    items = channel.findall("./channel/item")
    assert len(items) >= 1, "expected rss.xml to validate and carry at least one item"


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
