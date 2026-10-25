# Draft context

Write the modelling article from input/plan.yaml and input/commission.md. This is an orchestrator-managed first-version commission. Return the first complete article before any independent review or repair assignment. It is an unpublished experiment, not a replacement of the live article.

The core shop facts at docs/coverage/relational-example.md are authoritative. For this isolated draft, the coordinator accepts the plan's proposed illustrative extensions: a later hypothetical P7 catalogue price of 22.00; independent product tags and suppliers; supplier-product-location offers; category relationships; and optional tea/teaware details. You may choose the small local facts needed to explain those cases coherently and record them together in evidence/example-facts.md. Keep each illustration's assumptions clear and do not alter or silently extend the core snapshot. No canonical collection record changes are commissioned.

The two child articles in this plan are planned, not written. Introduce them as planned deeper reading, without suggesting that an unavailable article can already be read. Existing neighbouring subjects can be linked using these public routes, but their content is not an input to this experiment:
- Relational introduction: https://staycurrent.dev/learn/databases/relational/
- Values: https://staycurrent.dev/learn/databases/relational/values/
- Constraints: https://staycurrent.dev/learn/databases/relational/constraints/
- Queries: https://staycurrent.dev/learn/databases/relational/query-results/
- History: https://staycurrent.dev/learn/databases/relational/data-lifecycle/
- Transactions: https://staycurrent.dev/learn/databases/relational/transaction-boundaries/
- Indexes: https://staycurrent.dev/learn/databases/relational/indexes/

Use the references to lead writing, scope, headings and visual teaching. The plan supplies reader outcomes and boundaries; it is not a paragraph or figure specification. No further wording, figure design, length or count target is supplied.

Root owns the preview/build. The development page will be http://127.0.0.1:4590/review/modelling-first-draft/ once the article exists. The supplied neutral preview layout uses the site's shared ArticleBody, theme, styles, SQL component and stepped-figure helper. It carries no previous article content. Keep article content in src/articles/modelling-first-draft/article.astro and metadata in article.meta.json (title, description, optional type). Put any new figure components/scripts/data under src/components/modelling-first-draft/ and optional media under public/modelling-first-draft/. Keep technical sources, reference exposure, example facts and authoring-check limits in evidence/.

The writer performs the reread, continuity pass and rendering/control checks required to finish a first draft. These are authoring checks, not an independent review round. Do not load review histories, arrange readers, repair from review findings, publish or commit.
