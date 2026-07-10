"""Page object for `/<topic>/v/<n>/` — Archived Version (01-ui-design.md)."""

import re

from playwright.sync_api import expect

from .base_page import BasePage


class TopicVersionPage(BasePage):
    """Either the frozen archived snapshot or the current-version redirect stub."""

    def expect_redirected_to_live_article(self, article_path: str, timeout_ms: float = 10_000) -> "TopicVersionPage":
        """Assert the 0-delay meta-refresh folded the URL into the live article."""
        # Built as escape(path.rstrip('/')) + '/?$' rather than
        # escape(path) + '?$': the latter only produces a genuinely optional
        # trailing slash when the caller's `article_path` already ends with
        # one — for any other caller, the literal '?' would instead make the
        # path's own LAST CHARACTER optional (e.g. '/databases?$' matches
        # '/database' too). Stripping first and appending the slash-then-'?'
        # as one unit makes the optional-slash intent hold for any caller.
        pattern = re.escape(self.base_url) + re.escape(article_path.rstrip("/")) + r"/?$"
        expect(self.page).to_have_url(re.compile(pattern), timeout=timeout_ms)
        return self

    def expect_archived_banner(self, version: int, current_version: int) -> "TopicVersionPage":
        """Assert the sticky archived banner names both the archived and the
        live version — "history must never masquerade as current"."""
        banner = self.page.locator(".archived-banner")
        expect(banner).to_contain_text(f"v{version}")
        expect(banner).to_contain_text(f"v{current_version}")
        return self

    def expect_frozen_article_text(self, text: str) -> "TopicVersionPage":
        expect(self.page.locator(".article-body")).to_contain_text(text)
        return self

    def expect_superseded_skill_pointer(self, slug: str, version: int) -> "TopicVersionPage":
        pointer = self.page.locator(".superseded-skill-pointer")
        expect(pointer).to_contain_text(f"v{version}")
        expect(pointer.locator(f"a[href='/skills/{slug}/v/{version}/']")).to_be_visible()
        return self
