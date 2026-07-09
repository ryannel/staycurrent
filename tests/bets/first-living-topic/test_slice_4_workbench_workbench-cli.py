"""Bet-progress test — Slice 4: workbench-cli (service: workbench)
Bet: first-living-topic  |  Parent milestone: founding-cut

This test is RED by design. It proves the vertical capability this slice contributes
toward Milestone founding-cut. Tests are bounded by — not duplicates of — the parent
milestone tests.

Run './dev test bet first-living-topic' to see it fail; it will pass when this slice is merged.
"""

import re
import subprocess
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
SLUG = "databases"


def _run_cli(args: list, timeout: int = 30) -> subprocess.CompletedProcess:
    """Invoke the real workbench/cli.mjs front door, cwd = repo root, exactly as an
    operator would from a real shell — no stub, no mock of the process."""
    return subprocess.run(
        ["node", "workbench/cli.mjs", *args],
        cwd=REPO_ROOT,
        capture_output=True,
        text=True,
        timeout=timeout,
    )


# ---------------------------------------------------------------------------
# Slice capability proof (workbench service)
# ---------------------------------------------------------------------------
# Slice capability: an operator at a real shell can drive workbench/cli.mjs's command
# surface and see exactly the output strings and exit codes the command contract
# specifies. Traces to the "workbench/cli.mjs — command contract" table in
# technical-design/03-api-design.md (Slice 1.4's Proof of work). `create`/`discard`
# only ever touch .staycurrent/ — safe to run against the real repository.


def test_status_exits_zero():
    result = _run_cli(["status"])
    assert result.returncode == 0, (
        "expected `status` to exit 0; "
        f"got exit {result.returncode}.\nstdout:\n{result.stdout}\nstderr:\n{result.stderr}"
    )


def test_create_databases_prints_the_contract_string_or_the_exists_branch():
    result = _run_cli(["create", SLUG, "--title", "Databases"])
    created_line = (
        f"Created staged topic {SLUG} — draft at .staycurrent/staged/{SLUG}/. "
        f"Session: .staycurrent/sessions/{SLUG}.md"
    )
    if result.returncode == 0:
        assert created_line in result.stdout
    elif result.returncode == 2:
        # Slug already exists under topics/ or is already staged — the valid branch
        # once the founding cut has landed (03-api-design.md's `create` exit codes).
        assert (result.stdout + result.stderr).strip(), (
            "expected a usage-error line naming why the slug is unavailable"
        )
    else:
        raise AssertionError(
            f"unexpected exit code {result.returncode} for `create {SLUG}`: "
            f"stdout={result.stdout!r} stderr={result.stderr!r}"
        )


def test_gate_databases_prints_pass_or_fail_lines_per_contract():
    result = _run_cli(["gate", SLUG])
    if result.returncode == 0:
        assert re.match(rf"^PASS {re.escape(SLUG)} v\d+\s*$", result.stdout.strip()), (
            f"expected 'PASS {SLUG} v<N>', got: {result.stdout!r}"
        )
    elif result.returncode == 1:
        lines = [line for line in result.stdout.splitlines() if line.strip()]
        assert lines, "expected at least one FAIL line on a gate failure"
        for line in lines:
            assert re.match(r"^FAIL [a-z-]+: .+$", line), f"malformed FAIL line: {line!r}"
    elif result.returncode == 2:
        assert (result.stdout + result.stderr).strip(), "expected a 'nothing staged' usage error"
    else:
        raise AssertionError(
            f"unexpected exit code {result.returncode} for `gate {SLUG}`: "
            f"stdout={result.stdout!r} stderr={result.stderr!r}"
        )


def test_discard_databases_behaviour_per_contract():
    result = _run_cli(["discard", SLUG])
    discarded_line = f"Discarded session for {SLUG} — status reverted to current. Nothing published changed."
    if result.returncode == 0:
        assert discarded_line in result.stdout
    elif result.returncode == 2:
        assert (result.stdout + result.stderr).strip(), "expected a 'nothing to discard' usage error"
    else:
        raise AssertionError(
            f"unexpected exit code {result.returncode} for `discard {SLUG}`: "
            f"stdout={result.stdout!r} stderr={result.stderr!r}"
        )
