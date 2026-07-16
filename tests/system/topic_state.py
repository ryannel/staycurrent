"""Live-topic state probes for the permanent system suite.

The founding-era suite hardcoded v1 as the databases topic's current version,
which broke on the first real v2 cut — the suite's assumptions were stale, not
the site. These probes read the same `topics/` tree the site build renders, so
assertions track current truth and survive every future cut instead of pinning
the founding constant.
"""

from __future__ import annotations

import re
from pathlib import Path

import yaml

REPO_ROOT = Path(__file__).resolve().parents[2]
FRONTMATTER_RE = re.compile(r"^---\n(.*?)\n---\n", re.DOTALL)


def topic_frontmatter(slug: str) -> dict:
    """Frontmatter of the live `topics/<slug>/article.md`, as a dict."""
    text = (REPO_ROOT / "topics" / slug / "article.md").read_text()
    m = FRONTMATTER_RE.match(text)
    assert m, f"topics/{slug}/article.md has no frontmatter block"
    return yaml.safe_load(m.group(1)) or {}


def live_topic_version(slug: str = "databases") -> int:
    """The live (current) version number of a topic — the value the site's
    trust surfaces render everywhere a version badge or binding appears."""
    version = topic_frontmatter(slug)["version"]
    # `type(...) is int`, not isinstance: bool subclasses int, and a stray
    # `version: true` must trip this assert rather than render as 'vTrue'.
    assert type(version) is int and version >= 1, (
        f"topics/{slug}/article.md frontmatter version is not a positive int: {version!r}"
    )
    return version
