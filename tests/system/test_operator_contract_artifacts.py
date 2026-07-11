"""Operator-contract artifacts — permanent coverage (bet first-living-topic,
slice 4.1, workbench loop-skills).

The bet-progress suite (tests/bets/first-living-topic/test_slice_14_workbench_
loop-skills.py) proves this slice's shape once and is archived at bet close.
This file is what stays: a permanent regression guard pinning the same
committed shape — STAYCURRENT.md's session contract (state-block source,
closed vocabulary, seven-command CLI set, halt template, authority rule,
within its line budget) and the two workbench skills' verbatim microcopy and
authoring rules (docs/design-system.md § Agentic Protocol;
docs/bets/first-living-topic/technical-design/01-ui-design.md § workbench) —
so a later change cannot silently regress the operator's own instructions.

Also asserts the two-sided negative every skill must satisfy: no instruction
ever tells the agent to write into `topics/` directly, and each skill states
plainly that a hand-edit outside the action contract is a `violation` (design
system § Severity levels) — the two halves of "every topics/ mutation goes
through workbench/cli.mjs".
"""

import re
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
SKILLS_DIR = REPO_ROOT / ".agents" / "skills"

VOCAB = ["current", "due", "in-research", "superseded", "cut", "no-cut", "sourced", "synthesis"]
CLI_COMMANDS = ["status", "create", "convene", "gate", "cut", "log", "discard"]
HALT_LINES = ["Blocked:", "Cause:", "State:", "Action:"]


def _find_skill(fragment: str) -> Path:
    assert SKILLS_DIR.exists(), f"{SKILLS_DIR.relative_to(REPO_ROOT)} does not exist"
    candidates = [p for p in SKILLS_DIR.iterdir() if p.is_dir() and fragment in p.name]
    assert candidates, f"expected a skill directory matching '{fragment}' under .agents/skills/"
    skill_md = candidates[0] / "SKILL.md"
    assert skill_md.exists(), f"expected {candidates[0].name}/SKILL.md"
    return skill_md


# ---------------------------------------------------------------------------
# STAYCURRENT.md — the root session contract
# ---------------------------------------------------------------------------


def test_staycurrent_doc_exists_within_its_line_budget():
    doc_path = REPO_ROOT / "STAYCURRENT.md"
    assert doc_path.exists(), "STAYCURRENT.md is missing at the repo root"
    lines = doc_path.read_text().splitlines()
    assert len(lines) <= 150, f"STAYCURRENT.md has {len(lines)} lines, expected <= 150"


def test_staycurrent_doc_names_the_state_block_source():
    text = (REPO_ROOT / "STAYCURRENT.md").read_text()
    assert "workbench/cli.mjs" in text and "status" in text, (
        "expected the state block's data source (workbench/cli.mjs status) named"
    )


def test_staycurrent_doc_names_all_seven_cli_commands():
    text = (REPO_ROOT / "STAYCURRENT.md").read_text()
    for cmd in CLI_COMMANDS:
        assert re.search(rf"\b{re.escape(cmd)}\b", text), f"expected CLI command '{cmd}' named"


def test_staycurrent_doc_carries_the_eight_closed_vocabulary_terms():
    text = (REPO_ROOT / "STAYCURRENT.md").read_text()
    for token in VOCAB:
        assert token in text, f"expected closed-vocabulary term '{token}'"


def test_staycurrent_doc_carries_the_four_halt_template_lines():
    text = (REPO_ROOT / "STAYCURRENT.md").read_text()
    for line in HALT_LINES:
        assert line in text, f"expected the halt template's '{line}' line"


def test_staycurrent_doc_states_the_explicit_go_authority_rule():
    text = (REPO_ROOT / "STAYCURRENT.md").read_text()
    assert re.search(r"explicit go|never cuts without", text, re.IGNORECASE), (
        "expected the authority rule: the system never cuts without the operator's explicit go"
    )


def test_staycurrent_doc_points_at_both_workbench_skills():
    text = (REPO_ROOT / "STAYCURRENT.md").read_text()
    assert ".agents/skills/staycurrent-research/" in text
    assert ".agents/skills/staycurrent-writer/" in text


# ---------------------------------------------------------------------------
# Research skill — run choreography
# ---------------------------------------------------------------------------


def test_research_skill_has_valid_frontmatter():
    text = _find_skill("research").read_text()
    assert text.lstrip().startswith("---"), "expected skill frontmatter"


def test_research_skill_carries_the_four_verbatim_templates():
    text = _find_skill("research").read_text()
    assert "Sources first, digest when I have it." in text, (
        "expected the fresh-convene microcopy verbatim"
    )
    assert "Resume it or discard it?" in text, "expected the resume microcopy verbatim"
    assert "Verdict: cut." in text and "Verdict: no-cut." in text, (
        "expected both verdict templates verbatim"
    )
    assert "argue or approve" in text.lower(), "expected the cut verdict's pushback invitation"


def test_research_skill_names_the_staged_tree_and_the_digest_shape():
    text = _find_skill("research").read_text()
    assert ".staycurrent/staged/" in text, "expected the staged-tree authoring surface named"
    assert "consequence" in text.lower(), (
        "expected the ranked digest's shape (finding / source / consequence)"
    )


# ---------------------------------------------------------------------------
# Writer skill — cut artifacts
# ---------------------------------------------------------------------------


def test_writer_skill_has_valid_frontmatter():
    text = _find_skill("writ").read_text()
    assert text.lstrip().startswith("---"), "expected skill frontmatter"


def test_writer_skill_names_the_staged_tree():
    text = _find_skill("writ").read_text()
    assert ".staycurrent/staged/" in text, "expected the staged-tree authoring surface named"


def test_writer_skill_encodes_the_stance_disposition_rule():
    text = _find_skill("writ").read_text()
    assert "**Stance:**" in text and re.search(r"held.*bent.*reversed", text, re.DOTALL), (
        "expected the changelog stance-disposition rule (held | bent | reversed)"
    )


def test_writer_skill_encodes_provenances_two_section_anatomy():
    text = _find_skill("writ").read_text()
    assert "## Sources" in text and "## Synthesis" in text, (
        "expected provenance's two-section anatomy"
    )


def test_writer_skill_binds_the_skill_snapshot_to_article_version():
    text = _find_skill("writ").read_text()
    assert "article_version" in text, "expected the skill snapshot's version binding named"


# ---------------------------------------------------------------------------
# The two-sided negative: never a hand-edit instruction, always the
# violation-severity sentence
# ---------------------------------------------------------------------------


def test_no_skill_instructs_writing_into_topics_directly():
    for fragment in ("research", "writ"):
        text = _find_skill(fragment).read_text()
        assert not re.search(r"(write|edit|save|author)[^.\n]{0,60}\binto\s+`?topics/", text, re.IGNORECASE), (
            f"the {fragment} skill must never instruct writing into topics/ — every "
            "topics/ mutation goes through workbench/cli.mjs (the action contract)"
        )


def test_every_skill_states_the_hand_edit_is_a_violation_sentence():
    for fragment in ("research", "writ"):
        text = _find_skill(fragment).read_text()
        assert "violation" in text.lower() and re.search(r"never\s+overridable\s+in-session", text), (
            f"the {fragment} skill must classify a topics/ hand-edit as a `violation` — "
            "a hard stop, never overridable in-session (design system § Severity levels)"
        )
