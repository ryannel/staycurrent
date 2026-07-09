"""Bet-progress test — Slice 5: databases-content (service: workbench)
Bet: first-living-topic  |  Parent milestone: founding-cut

This test is RED by design. It proves the vertical capability this slice contributes
toward Milestone founding-cut. Tests are bounded by — not duplicates of — the parent
milestone tests.

Run './dev test bet first-living-topic' to see it fail; it will pass when this slice is merged.
"""

import re
from pathlib import Path

import yaml

REPO_ROOT = Path(__file__).resolve().parents[3]
SLUG = "databases"


def _find_content_root() -> Path | None:
    """The databases content may live in the staged tree (pre-cut) or the
    committed tree (post-cut) — either is valid evidence for this slice."""
    staged = REPO_ROOT / ".staycurrent" / "staged" / SLUG
    if staged.exists():
        return staged
    live = REPO_ROOT / "topics" / SLUG
    if live.exists():
        return live
    return None


# ---------------------------------------------------------------------------
# Slice capability proof (workbench service)
# ---------------------------------------------------------------------------
# Slice capability: the databases article, founding changelog entry, and provenance
# are real, complete content — not stubs — satisfying the six gate checks their
# content governs. Traces to the article.md/changelog.md/versions/v1/provenance.md
# document anatomies in technical-design/04-data-design.md and the checks
# technical-design/03-api-design.md's Publish gate table names for them (Slice 1.5's
# Proof of work).


def test_article_frontmatter_and_body_satisfy_the_document_anatomy():
    content_root = _find_content_root()
    assert content_root is not None, (
        "expected a staged draft at .staycurrent/staged/databases/ or a cut topic at "
        "topics/databases/ — neither exists yet"
    )
    article_path = content_root / "article.md"
    assert article_path.exists(), f"{article_path} is missing"

    raw = article_path.read_text()
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", raw, re.DOTALL)
    assert m, "article.md must open with a --- delimited YAML frontmatter block"
    frontmatter = yaml.safe_load(m.group(1)) or {}
    body = m.group(2)

    assert frontmatter.get("topic") == SLUG
    assert frontmatter.get("title"), "frontmatter.title must be set"
    stance = frontmatter.get("stance", "")
    assert isinstance(stance, str) and stance.strip(), "frontmatter.stance must be a non-empty sentence"
    assert stance.strip().count(". ") == 0, "frontmatter.stance must read as one sentence, not several"
    assert isinstance(frontmatter.get("version"), int) and frontmatter["version"] >= 1
    assert re.match(r"^\d+d$", str(frontmatter.get("cadence", ""))), "cadence must match <int>d"
    assert re.match(r"^\d{4}-\d{2}-\d{2}$", str(frontmatter.get("last_researched", ""))), (
        "last_researched must be an ISO date"
    )

    h1_count = len(re.findall(r"(?m)^# ", body))
    assert h1_count == 1, f"expected exactly one H1 in the article body, found {h1_count}"
    assert re.search(r"(?m)^>\s", body), "expected a stance callout near the top of the body"
    mermaid_fences = len(re.findall(r"```mermaid", body))
    assert mermaid_fences >= 2, f"expected >= 2 mermaid diagrams, found {mermaid_fences}"
    assert not re.search(r"(?m)^####", body), "article body must not use heading levels below h3 (##/### only)"


def test_changelog_carries_the_v1_founding_entry_with_no_stance_line():
    content_root = _find_content_root()
    assert content_root is not None, (
        "expected a staged draft at .staycurrent/staged/databases/ or a cut topic at "
        "topics/databases/ — neither exists yet"
    )
    changelog_path = content_root / "changelog.md"
    assert changelog_path.exists(), f"{changelog_path} is missing"

    text = changelog_path.read_text()
    m = re.search(r"(?m)^## v1 — \d{4}-\d{2}-\d{2}\s*$", text)
    assert m, "expected a '## v1 — YYYY-MM-DD' founding entry"

    rest = text[m.end() :]
    next_heading = re.search(r"(?m)^## v\d", rest)
    entry_body = rest[: next_heading.start()] if next_heading else rest
    assert "**Stance:**" not in entry_body, "the v1 founding entry must carry no Stance: line"


def test_provenance_has_at_least_one_entry_with_the_bullet_grammar():
    content_root = _find_content_root()
    assert content_root is not None, (
        "expected a staged draft at .staycurrent/staged/databases/ or a cut topic at "
        "topics/databases/ — neither exists yet"
    )
    provenance_path = content_root / "versions" / "v1" / "provenance.md"
    assert provenance_path.exists(), f"{provenance_path} is missing"

    text = provenance_path.read_text()
    sources_match = re.search(r"(?ms)^## Sources\s*$(.*?)(?=^## |\Z)", text)
    synthesis_match = re.search(r"(?ms)^## Synthesis\s*$(.*?)(?=^## |\Z)", text)
    assert sources_match and synthesis_match, (
        "provenance.md must carry both ## Sources and ## Synthesis sections"
    )

    source_bullets = re.findall(r"(?m)^- .+$", sources_match.group(1))
    synthesis_bullets = re.findall(r"(?m)^- .+$", synthesis_match.group(1))
    assert source_bullets or synthesis_bullets, (
        "provenance.md must carry >= 1 entry across Sources and Synthesis combined"
    )

    source_grammar = re.compile(r"^- \[.+\]\(.+\) — accessed \d{4}-\d{2}-\d{2} — supports: .+$")
    for bullet in source_bullets:
        assert source_grammar.match(bullet), f"malformed Sources bullet: {bullet!r}"
