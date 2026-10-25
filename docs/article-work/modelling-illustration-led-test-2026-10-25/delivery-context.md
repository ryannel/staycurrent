# Draft context

The shared shop example at docs/coverage/relational-example.md supplies the starting facts. Develop coherent worked scenarios from them and record scenario changes with the work. The plan's illustrative extensions are accepted: a later P7 catalogue price of 22.00; independent product tags and suppliers; supplier-product-location offers; category relationships; and optional tea/teaware details. Choose the small local facts needed and record them together in evidence/example-facts.md. No canonical collection record changes are commissioned.

The two child articles in the plan are planned, not written. Do not present them as available reading. Existing neighbouring articles can be linked at these routes, but their bodies are not inputs:
- Relational introduction: https://staycurrent.dev/learn/databases/relational/
- Values: https://staycurrent.dev/learn/databases/relational/values/
- Constraints: https://staycurrent.dev/learn/databases/relational/constraints/
- Queries: https://staycurrent.dev/learn/databases/relational/query-results/
- History: https://staycurrent.dev/learn/databases/relational/data-lifecycle/
- Transactions: https://staycurrent.dev/learn/databases/relational/transaction-boundaries/
- Indexes: https://staycurrent.dev/learn/databases/relational/indexes/

Root owns preview and build. The development URL is http://127.0.0.1:4602/review/modelling-first-draft/. Put the article at src/articles/modelling-first-draft/article.astro with article.meta.json (title, description, optional type). Own new figures/scripts/data under src/components/modelling-first-draft/ and optional assets under public/modelling-first-draft/. Shared infrastructure supplies ArticleBody, theme, styles, SQL and step controls. Request infrastructure changes from root.

Keep concise reference exposure, technical sources, example decisions and authoring-check evidence under evidence/. No independent review, repair assignment, commit or publication is commissioned.
