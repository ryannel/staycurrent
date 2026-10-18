---
name: staycurrent-research
description: Research a field or assess a development for Stay Current, checking evidence and what it changes for engineering choices. Use when drafting researched guidance or current assessments.
---

# Find evidence that helps an engineering decision

Stay Current connects durable understanding with the changes that affect engineering
choices; `docs/site-direction.md` describes that purpose. Shape an investigation around
the reader's question and the consequences of getting the answer wrong. The aim is the
precision the reader's decision needs, delivered without burying the explanation.

Prefer primary documentation, papers, release notes, source and reproducible
observations for consequential claims. Keep enough detail to revisit the reasoning:
where a claim comes from, when it was checked, the version or setting, and any inference
you made. The article's existing evidence notes are usually a better home than another
parallel research document.

A capability's existence doesn't settle whether it's a good choice. For a current
assessment, connect the development to a workload and its demands, including the cost
of adding another system when the existing one is a credible option. An unchanged
conclusion is useful and doesn't need to become manufactured news.

Identify exactly what a guarantee belongs to before generalising it. Engine, edition,
extension and hosted service can each change the answer, and so can a vendor's default
versus specialised resource types or a compatible third-party endpoint. A general article
should check its central claims against more than the product it uses as an example.

Evidence should improve the explanation rather than bury it in qualifications. In the
relational introduction, "each query gets a view from when it began" was too broad,
because a PostgreSQL locking read can wait and then see an updated row. Naming the
ordinary-read case kept a short, useful explanation consistent with the lock example; a
full isolation survey would have served a different article.

Keep documented behaviour, illustrative models and observed execution distinct. A
browser simulation is not a benchmark, reading valid SQL is not running it, and local
emulation tests the teaching code without verifying the hosted service. Record enough of
a request, response and resulting state to support the lesson. Be candid about missing
evidence, and narrow a claim when that still answers the reader's question.

Offer a small set of annotated sources that help the reader continue, and keep reusable
references in the evidence notes. Where guidance may change, record what new evidence
would warrant revisiting it rather than inventing a review schedule.

Use `staycurrent-authoring` to produce the article and `staycurrent-review` for
independent challenge. Research and drafting don't authorise publication. The site has
no updates feed; if one is commissioned, its entries describe real publication or
assessment work, never sample news.
