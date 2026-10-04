---
name: staycurrent-research
description: Research a field or assess a development for Stay Current, checking evidence and what it changes for engineering choices. Use when drafting researched guidance or current assessments.
---

# Find evidence that helps an engineering decision

Stay Current connects durable understanding with changes that affect choices.
Use `docs/site-direction.md` for that purpose and `staycurrent-style` for prose.
Shape the investigation around the reader's question and the consequences of
getting the answer wrong.

Prefer primary documentation, papers, release notes, source and reproducible
observations for consequential claims. Keep enough source detail to revisit the
reasoning: where the claim comes from, when it was checked, the relevant version
or setting, and any inference you made. Existing article evidence notes are usually
a better home than another parallel research document.

A capability's existence does not settle whether it is a good choice. For current
assessments, connect the development to a workload and its demands, including the
cost of adding another system when the existing one is a credible option. Distinguish
engine, edition, extension and hosted service where those change the answer.
An unchanged conclusion is useful; it does not need to become manufactured news.

Evidence should improve the explanation rather than bury it in qualifications.
In the relational introduction, “each query gets a view from when it began” was
too broad: a PostgreSQL locking read can wait and see an updated row. Naming the
ordinary-read case preserved a short, useful explanation while keeping it consistent
with the lock example. A complete isolation survey would have served a different
article. Choose the precision the argument needs, and put deeper detail where a
reader can follow it.

Keep documented behaviour, illustrative models and observed execution distinct.
A browser simulation is not a benchmark; reading valid SQL is not running it.
Be candid about evidence that is missing, and narrow a claim when that still answers
the reader's question.

Offer a small set of annotated sources that help the reader continue. Preserve
reusable references in the evidence notes for the proposed shared library; local
claims should still be traceable. Where guidance may change, record what new evidence
would warrant revisiting it rather than inventing a routine review schedule.

Use `staycurrent-authoring` for producing the article and `staycurrent-review` for
independent challenge. Research and drafting are authorised within their commission;
they do not themselves authorise publication. The current site has no updates feed;
if one is commissioned later, its entries should describe real publication or
assessment work, never sample news or editorial changes presented as developments
in the field.
