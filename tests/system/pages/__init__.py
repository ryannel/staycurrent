"""Page objects for graphical-ui system tests.

Model each screen as a subclass of BasePage so selectors and navigation live
in one place instead of being repeated across tests.
"""

from .base_page import BasePage
from .topic_article_page import TopicArticlePage

__all__ = ["BasePage", "TopicArticlePage"]
