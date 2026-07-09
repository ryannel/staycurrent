"""Token-conformance gate, one test per graphical surface — Tier 1 of the visual loop.

The deterministic answer to "did the polish actually land?" A behavioural test
passes while the atmosphere has silently degraded to a flat default. This gate
reads computed styles and asserts the atmosphere tokens resolve, the elevation is
a multi-layer stack, and any surface treatment in the DOM renders with its
backdrop blur and layered shadow rather than a framework default. Structural, not
aesthetic — taste is the designer's spec-conformance pass. Skips cleanly when a
surface is not reachable.
"""

import json
import pathlib

from playwright.sync_api import Page

_PROBE = """
() => {
  const root = getComputedStyle(document.documentElement);
  const tok = (n) => (root.getPropertyValue(n) || '').trim();
  const countLayers = (s) => {
    s = (s || '').trim();
    if (!s || s === 'none') return 0;
    let depth = 0, n = 1;
    for (const ch of s) {
      if (ch === '(') depth++;
      else if (ch === ')') depth--;
      else if (ch === ',' && depth === 0) n++;
    }
    return n;
  };
  const surfaces = [];
  for (const el of document.querySelectorAll('.surface-glass, .surface-elevated, .surface-hero')) {
    const cs = getComputedStyle(el);
    const bf = (cs.backdropFilter || cs.webkitBackdropFilter || '').trim();
    surfaces.push({
      cls: el.className,
      hasBlur: /blur\\(/.test(bf),
      shadowLayers: countLayers(cs.boxShadow),
    });
  }
  return {
    shadowMid: tok('--gw-shadow-mid'),
    shadowMidLayers: countLayers(tok('--gw-shadow-mid')),
    blurStandard: tok('--gw-blur-standard'),
    surfaces,
  };
}
"""


def _load_routes() -> tuple[str, ...]:
    manifest = pathlib.Path("tests/system/routes.json")
    if manifest.exists():
        try:
            routes = json.loads(manifest.read_text())
            if isinstance(routes, list) and routes:
                return tuple(routes)
        except Exception:  # noqa: BLE001 — a malformed manifest falls back to root
            pass
    return ("/",)


ROUTES = _load_routes()


def _assert_token_conformance(page: Page, surface_slug: str) -> None:
    for route in ROUTES:
        page.goto(route, wait_until="load")
        page.wait_for_load_state("networkidle")
        r = page.evaluate(_PROBE)

        assert r["shadowMid"], (
            f"{surface_slug} {route}: --gw-shadow-mid is undefined — the brand.css "
            f"projection did not reach the page."
        )
        assert r["blurStandard"], (
            f"{surface_slug} {route}: --gw-blur-standard is undefined."
        )
        assert r["shadowMidLayers"] >= 2, (
            f"{surface_slug} {route}: --gw-shadow-mid degraded to a single-layer "
            f"shadow ({r['shadowMidLayers']} layer)."
        )
        for s in r["surfaces"]:
            assert s["hasBlur"], (
                f"{surface_slug} {route}: '{s['cls']}' rendered with no backdrop blur."
            )
            assert s["shadowLayers"] >= 2, (
                f"{surface_slug} {route}: '{s['cls']}' rendered with "
                f"{s['shadowLayers']} shadow layer(s) — elevation stack lost."
            )


def test_site_token_conformance(cluster, site_page: Page):
    _assert_token_conformance(site_page, "site")
