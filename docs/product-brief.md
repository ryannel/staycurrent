---
title: Stay Current
description: One place developers look to stay current on the major topics and fields of their work — living articles that state the modern best practice, kept current by a research loop, with version history, changelogs, and honest provenance.
type: product-brief
last_reviewed: 2026-09-29
---

# Stay Current — Product Brief

Stay Current gives developers one place to look to stay current on the major topics and fields of their work. Databases, event handling, observability, testing, and on: for each field it holds what technology is out there, how to pick between the options in a system-design context, and what the modern best practice is. Every piece states a stance, and a research loop rewrites it when the field moves, so what the reader finds is the state of the art rather than its history.

## The problem

Staying current is relentless work. A working engineer's practice spans many fields at once, and every one of them moves whether or not anyone is watching. Holding a current, nuanced, and opinionated view of each is an unbounded job, and nobody sustains it across every field they build in.

Technical writing decays from the day it is published. The stances in a good practice guide last for years, but the facts under them rot: a recommended tool goes dormant, an experimental standard stabilises, a platform limit disappears. A guide that still says any of those things a year later is worse than no guide, because it teaches with authority and is wrong.

The usual defences both fail. A "last reviewed" date depends on an author finding time that maintenance never wins. News feeds trade depth for volume: they tell a reader that something changed, never what the change means for how they should build.

## Who it serves

**Fresh readers** are meeting a topic for the first time. They want one deep, opinionated treatment they can trust to be current, not a dozen contradictory posts. Success is reading the article as the definitive current take and acting on it without cross-checking whether it has gone stale. Visible version history and provenance are what earn that trust.

**Returning readers** already know a topic at the level of the last version. Their scarce resource is attention. They want to learn what changed and what it means without rereading what they already know. The changelog entry is their document, and it has to stand alone.

**The operator** publishes the site and is its first user. They want a library of deep articles that stays current without hand-maintaining it. Success is treating their own site as their reference: consulting it instead of re-researching, and trusting the loop enough to publish straight out of the research conversation.

## What the site holds

**Living articles.** Each topic is one article with a stance: what to do, what to reject, and why. The article is always the current truth. When the field moves it is rewritten, not appended to.

**Catalogues.** A field such as databases is too big for one essay. It is served by a catalogue: a hub that maps the field and routes the reader, and a set of finer-grained pieces beneath it. Foundation pieces teach the mechanisms a choice rests on. Profiles describe the technologies on offer, each on the same decision axes so they can be compared side by side. The hub carries the chooser: which option for which workload, and why.

**Version history and changelog.** Every topic keeps its full history. Cutting a new version writes a changelog entry that describes what changed in the field and what it means for practice, at a depth that spares a returning reader the full article.

**Provenance.** Each version records what it rests on. Claims that trace to citable material carry their sources. Synthesis drawn from the research agent's own knowledge is labelled as synthesis, never dressed as a citation. Where a claim was measured for the article, the harness and raw logs are published beside it.

**Distribution.** An RSS feed announces each new version and carries the changelog entry, so a subscriber learns what changed from the feed itself. It is the site's only push channel.

## How it stays current

A schedule says when each topic is due. The operator convenes a research run inside Claude Code. The system investigates what has changed since the current version and presents it, the stance is argued, and the run ends in a significance decision. Findings that materially affect the claims or the stance cut a new version. Noise does not, and the run is logged either way.

The system researches, drafts, and recommends. The operator argues the stance and decides. Nothing publishes without the operator's explicit go, and once a version is cut there is no separate review pass. Version history, changelog, and provenance make every change visible and reversible, which is what makes that safe.

## Constraints

- **Research runs as a conversation, not a service.** The loop runs in the operator's own Claude Code session on their subscription. There is no hosted research service and no LLM integration in the product.
- **Every version discloses its provenance.** A version cannot publish without its sources-and-synthesis record.
- **One operator per site.** No roles, permissions, or editorial workflow.
- **Fully static.** The site is a set of files on a CDN. No servers, no accounts, no reader data.

## Out of scope

- **News aggregation.** The changelog digests what a change means for practice. The site never republishes headlines or streams links.
- **Community features.** No comments, no accounts, no social layer.
- **Multi-author workflow.** No draft queues or contributor management.

## Success indicators

- **The operator relies on their own site.** They answer questions in a covered field by consulting the article, and keep no parallel notes on covered topics.
- **The loop runs on schedule and is trusted.** Research runs happen when due, and the versions they cut publish with no separate review pass.
- **Changelog entries stand alone.** A returning reader can say what changed and what it means from the entry alone.
- **Returning readers exist.** Subscribers come back after a version is cut. Readership beyond the operator is the upside, not the survival condition.
