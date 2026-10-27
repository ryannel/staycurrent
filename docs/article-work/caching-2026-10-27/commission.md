# Commission: application caching with Redis, 27 October 2026

The user's request, verbatim:

> Plan and write a collection of articles about application caching, using Redis as the concrete technology, for intelligent software engineers with application-building experience but no prior knowledge of caching.
>
> Take them to expert understanding and practice in using, operating, and designing systems in and around this technology. Optimise useful understanding against the reader's time and effort.
>
> Read https://ciechanow.ski/gears/ and https://samwho.dev/load-balancing/ and explore their interactive illustrations. Use them to judge the depth, teaching quality and writing style of each individual article.
>
> Aim for a collection that could sit naturally beside those articles.
>
> The reader should be able to understand each article's main ideas by following its animations and illustrations. Develop that understanding through clear, connected prose.
>
> Use established, searchable industry terms for article titles and headings where they fit naturally.
>
> Deliver the complete collection with working illustrations, publish and push to production once each article is complete.
>
> Be aware of your short comings as an agent, your context window and how it degrades based on size, how fresh the writing style guide is in your context when you write, and more, please account for those accordingly as you plan, write and review.

## What this authorises

Publication of each article to production (push to `origin/main`) once that
article has passed its review and its figures have been checked in a browser.
Unfinished articles stay out of reading, search and navigation; the collection
introduction may name planned articles as plain text, never as links.

Two earlier attempts at this collection were removed by the user for fresh
starts (commits `ee809715` and `17ac3cd5`). This attempt does not reuse or
consult their content.

## How the agent's limits are handled

- **Context decay.** The orchestrator keeps state on disk (`status.md`) and
  delegates each article to a fresh writer, so no article is written from a
  long, degraded context.
- **Style freshness.** Every writer reads the two reference essays and
  `brief.md` immediately before planning and again before revising, so the bar
  is in recent context while writing, not remembered from hours earlier.
- **Self-review blindness.** Every review is done by a fresh agent that did not
  write the article and has not seen earlier rounds. Repairs go to another fresh
  agent. The orchestrator matches findings across rounds.
- **Plausible but false technical claims.** Consequential Redis claims are
  checked against redis.io documentation or source and, where behaviour is
  observable, against a local Redis 8.10 server. Evidence transcripts are kept
  beside the article's records.
- **Figures that look right in code but not on screen.** Every figure is
  screenshotted in light and dark themes and at phone width, and its controls are
  exercised, before publication.
