"""Page object for `/` — the Topic Library (01-ui-design.md).

Helpers are content-based (element/attribute/text), matching
`topic_article_page.py`'s convention, so assertions survive a future
restyle.
"""

import re

from playwright.sync_api import expect

from .base_page import BasePage

# formatDisplayDate's rendered shape (lib/format-date.ts): "9 Jul 2026".
DATE_SHAPED_RE = re.compile(r"\d{1,2} [A-Z][a-z]{2} \d{4}")


class LibraryPage(BasePage):
    """The site's index: a card grid, one tile per topic, or the designed
    first-run empty state."""

    def _card(self, title: str):
        """Match the card whose `.topic-card-title` is exactly `title`.

        Not `has_text` over the whole tile (title + stance prose): that goes
        strict-mode-ambiguous the moment a second topic's stance substring
        happens to mention this topic's name.
        """
        return self.page.locator(".topic-card").filter(has=self.page.get_by_text(title, exact=True))

    def expect_topic_card(self, title: str, stance_substring: str, version_text: str) -> "LibraryPage":
        """Assert a card renders the given title, stance one-liner substring
        (2-line clamp), version badge text (e.g. 'v1'), and a meta row
        carrying the "researched" label plus a date-shaped value (e.g.
        '9 Jul 2026') — the real formatDisplayDate seam through to the
        rendered DOM, proven end-to-end rather than just at the component
        level."""
        card = self._card(title)
        expect(card).to_be_visible()
        expect(card).to_contain_text(stance_substring)
        expect(card.locator(".badge")).to_have_text(version_text)

        meta_text = card.locator(".topic-card-meta").inner_text()
        assert "researched" in meta_text, (
            f"expected the meta row to carry the 'researched' label; got {meta_text!r}"
        )
        assert DATE_SHAPED_RE.search(meta_text), (
            f"expected the meta row to carry a date-shaped value (e.g. '9 Jul 2026'); got {meta_text!r}"
        )
        return self

    def click_topic_card(self, title: str) -> None:
        """Click a card (the whole tile is one hit target — Key
        interactions). This navigates away from the library, so — unlike
        this class's other helpers — it does not return self."""
        self._card(title).click()

    def focus_topic_card(self, title: str) -> "LibraryPage":
        """Focus a card's anchor element directly — the keyboard-path entry
        point for Enter-to-navigate (Key interactions), mirroring
        `click_topic_card`'s mouse path."""
        self._card(title).focus()
        return self

    def expect_empty_state(self) -> "LibraryPage":
        """Assert the designed first-run empty state (Empty States pattern) —
        never a blank grid."""
        expect(self.page.locator(".empty-state")).to_contain_text(
            "No topics yet. The first research run creates one."
        )
        expect(self.page.locator(".topic-card")).to_have_count(0)
        return self
