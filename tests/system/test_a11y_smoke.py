"""Accessibility + console-hygiene smoke, one test per graphical surface.

Each test sweeps every route the bet declares in `tests/system/routes.json`
(same convention as the render-smoke/token-conformance/layout-geometry gates —
see `_load_routes()` there) via the surface's generated per-surface page
fixture (see conftest's surface fixtures) and asserts:

  1. No severe console errors during initial load — uncaught page errors and
     console.error output both fail the smoke.
  2. An axe-core scan (injected from CDN — no extra pip dependency) reports
     ZERO critical violations per route. Lower-impact findings are reported as
     warnings so they surface without blocking the loop.

Skips cleanly when a surface is not reachable (its page fixture skips) and
when the axe-core CDN is unreachable (offline runs must not false-fail).
"""

import json
import pathlib
import warnings

import pytest
from playwright.sync_api import Page

AXE_CDN_URL = "https://cdn.jsdelivr.net/npm/axe-core@4.10.2/axe.min.js"


def _load_routes() -> tuple[str, ...]:
    manifest = pathlib.Path(__file__).parent / "routes.json"
    if manifest.exists():
        try:
            routes = json.loads(manifest.read_text())
            if isinstance(routes, list) and routes:
                return tuple(routes)
        except Exception:  # noqa: BLE001 — a malformed manifest falls back to root
            pass
    return ("/",)


ROUTES = _load_routes()


def _a11y_smoke(page: Page, surface_slug: str) -> None:
    console_errors: list[str] = []
    page.on(
        "console",
        lambda msg: console_errors.append(msg.text) if msg.type == "error" else None,
    )
    page.on("pageerror", lambda exc: console_errors.append(f"pageerror: {exc}"))

    for route in ROUTES:
        console_errors.clear()
        page.goto(route, wait_until="load")
        # Let hydration and deferred requests settle so late errors are captured.
        page.wait_for_load_state("networkidle")

        ctx = f"{surface_slug} {route}"

        assert not console_errors, (
            f"{ctx} emitted severe console errors on load:\n  " + "\n  ".join(console_errors)
        )

        try:
            page.add_script_tag(url=AXE_CDN_URL)
        except Exception as exc:  # noqa: BLE001 — any injection failure means no scan
            pytest.skip(f"axe-core CDN unreachable, a11y scan skipped: {exc}")

        results = page.evaluate(
            "() => axe.run(document, { resultTypes: ['violations'] })"
        )
        violations = results.get("violations", [])

        non_critical = [v for v in violations if v.get("impact") != "critical"]
        if non_critical:
            summary = ", ".join(f"{v['id']} ({v.get('impact')})" for v in non_critical)
            warnings.warn(f"non-critical a11y violations on {ctx}: {summary}")

        critical = [v for v in violations if v.get("impact") == "critical"]
        assert not critical, (
            f"axe-core found CRITICAL accessibility violations on {ctx}:\n  "
            + "\n  ".join(
                f"{v['id']}: {v['help']} ({len(v.get('nodes', []))} node(s))"
                for v in critical
            )
        )


def test_site_a11y_smoke(cluster, site_page: Page):
    _a11y_smoke(site_page, "site")
