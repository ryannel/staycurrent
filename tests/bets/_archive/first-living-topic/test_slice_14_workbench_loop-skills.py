"""Bet-progress test — Slice 14: loop-skills (service: workbench)
Bet: first-living-topic  |  Parent milestone: loop-closes

This test is RED by design. It proves the vertical capability this slice contributes
toward Milestone loop-closes. Tests are bounded by — not duplicates of — the parent
milestone tests.

Run './dev test bet first-living-topic' to see it fail; it will pass when this slice is merged.
"""

import re
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
SKILLS_DIR = REPO_ROOT / ".agents" / "skills"


# ---------------------------------------------------------------------------
# Slice capability proof (workbench service)
# ---------------------------------------------------------------------------
# Slice 4.1 proves the operator's agent has its instructions (01-loop-skills.md):
# STAYCURRENT.md at the repo root, <=150 lines, carrying the session contract —
# the state block's data source (workbench/cli.mjs status), the closed status
# vocabulary, the seven-command CLI set, the halt template's four lines, the
# explicit-go authority rule, and pointers to the two skills; a research skill
# (convene fresh/resume microcopy, digest table shape, cut/no-cut verdict
# templates verbatim) and a writer skill (changelog mini-essay rules, stance
# disposition line, provenance two-section anatomy with sourced/synthesis,
# staged-tree authoring) under .agents/skills/ — with no instruction anywhere
# to write into topics/ directly.

VOCAB = ["current", "due", "in-research", "superseded", "cut", "no-cut", "sourced", "synthesis"]
CLI_COMMANDS = ["status", "create", "convene", "gate", "cut", "log", "discard"]
HALT_LINES = ["Blocked:", "Cause:", "State:", "Action:"]


def _find_skill(fragment: str) -> Path:
    assert SKILLS_DIR.exists(), f"{SKILLS_DIR.relative_to(REPO_ROOT)} does not exist"
    candidates = [p for p in SKILLS_DIR.iterdir() if fragment in p.name]
    assert candidates, f"expected a skill directory matching '{fragment}' under .agents/skills/"
    skill_md = candidates[0] / "SKILL.md"
    assert skill_md.exists(), f"expected {candidates[0].name}/SKILL.md"
    return skill_md


def test_staycurrent_doc_carries_the_session_contract():
    doc_path = REPO_ROOT / "STAYCURRENT.md"
    assert doc_path.exists(), "STAYCURRENT.md is missing at the repo root"
    text = doc_path.read_text()
    lines = text.splitlines()
    assert len(lines) <= 150, f"STAYCURRENT.md has {len(lines)} lines, expected <= 150"

    assert "workbench/cli.mjs" in text and "status" in text, (
        "expected the state block's data source (workbench/cli.mjs status) named"
    )
    for cmd in CLI_COMMANDS:
        assert re.search(rf"\b{re.escape(cmd)}\b", text), f"expected CLI command '{cmd}' named"
    for token in VOCAB:
        assert token in text, f"expected closed-vocabulary term '{token}'"
    for line in HALT_LINES:
        assert line in text, f"expected the halt template's '{line}' line"
    assert re.search(r"explicit go|never cuts without", text, re.IGNORECASE), (
        "expected the authority rule: the system never cuts without the operator's explicit go"
    )


def test_research_skill_encodes_the_run_choreography():
    text = _find_skill("research").read_text()
    assert text.lstrip().startswith("---"), "expected skill frontmatter"
    assert "Sources first, digest when I have it." in text, (
        "expected the fresh-convene microcopy verbatim"
    )
    assert "Resume it or discard it?" in text, "expected the resume microcopy verbatim"
    assert "Verdict: cut." in text and "Verdict: no-cut." in text, (
        "expected both verdict templates verbatim"
    )
    assert "argue or approve" in text.lower(), "expected the cut verdict's pushback invitation"
    assert ".staycurrent/staged/" in text, "expected the staged-tree authoring surface named"
    assert "consequence" in text.lower(), (
        "expected the ranked digest's shape (finding / source / consequence)"
    )


def test_writer_skill_encodes_the_cut_artifacts():
    text = _find_skill("writ").read_text()
    assert text.lstrip().startswith("---"), "expected skill frontmatter"
    assert ".staycurrent/staged/" in text, "expected the staged-tree authoring surface named"
    assert "**Stance:**" in text and re.search(r"held.*bent.*reversed", text, re.DOTALL), (
        "expected the changelog stance-disposition rule (held | bent | reversed)"
    )
    assert "## Sources" in text and "## Synthesis" in text, (
        "expected provenance's two-section anatomy"
    )
    assert re.search(r"mini-essay|self-contained", text), (
        "expected the changelog entry's mini-essay rule"
    )
    assert "article_version" in text, "expected the skill snapshot's version binding named"


def test_no_skill_instructs_writing_into_topics_directly():
    for fragment in ("research", "writ"):
        text = _find_skill(fragment).read_text()
        assert not re.search(r"(write|edit|save|author)[^.\n]{0,60}\binto\s+`?topics/", text, re.IGNORECASE), (
            f"the {fragment} skill must never instruct writing into topics/ — every "
            "topics/ mutation goes through workbench/cli.mjs (the action contract)"
        )
