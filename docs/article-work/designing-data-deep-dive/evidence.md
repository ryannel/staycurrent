# Evidence and checks

Checked 14 October 2026. The shop and browser experiment are teaching examples.

## Sources

- https://www.postgresql.org/docs/18/ddl-constraints.html — required values,
  CHECK true/unknown acceptance, primary/composite keys, default unique null
  behaviour, single-column foreign keys, cascading/restricting deletion, and
  why CHECK is not a dependable cross-row rule.
- https://www.postgresql.org/docs/18/datatype-json.html — JSON objects inside
  relational rows, jsonb representation and row locking for updates.
- https://www.postgresql.org/docs/18/functions-json.html — jsonb_typeof returns
  the JSON value's type for the object check.
- Existing schema article's Berkeley/RPI normalization references and PostgreSQL
  numeric/date/collation references remain attached to their preserved material.
  The expansion does not change their examples or normal-form definitions.

The conclusions about record ownership, typed capacity, offers, historical data,
and the undesirability of the extra product-uniqueness rule are design reasoning
for the explicitly stated shop requirements, not general performance findings.

## Executed checks

`node docs/article-work/designing-data-deep-dive/verify.mjs` executed against
PostgreSQL 18.3 in PGlite 0.5.8 on 14 October 2026. Its temporary dependency is at
`/private/tmp/staycurrent-design-sql/node_modules/@electric-sql/pglite/dist/index.js`;
that path is a local verification dependency, not part of the website.

- Loaded the shared practice schema and records.
- Receipt still returns Blue mug, quantity 2, unit price 18.00, total 36.00.
- Executed the article's proposed second P7 line and JSON-object ALTER/UPDATE.
- Executed the mug-details CREATE/INSERT/query; capacity returned integer 350.
- Tested all five object-validation cases printed in the article.
- Checked all 192 combinations of six proposed rows and five enabled/disabled
  experiment rules against real SQL inserts in fresh probe tables.

All assertions passed. The browser model predicts acceptance, not constraint
error ordering. It does not execute SQL, model timing, accumulate inserted rows,
or simulate concurrent sessions. The independent browser review must exercise
controls, including reset preserving the selected proposal.

## Self-check and handoff

The existing normalisation anchor and route are preserved. The article itself
teaches constraint purpose, required values versus CHECK, identity versus product
uniqueness, reference/deletion choices, cross-row limits, object validation,
typed related details, and independent update boundaries. Child links extend
those arguments with enforcement and migration details. Onward main reading is
`/learn/databases/relational/query-results/`.

New media: `RDDesignRulesLab.astro`. Labels, checked states and result text carry
meaning without colour. Controls are hidden until initialized; a static record
and no-script explanation remain. Native selects, checkboxes and a button provide
keyboard access; one atomic status region announces results. Existing theme
tokens and the established controls/result conventions are used.

Build and independent editorial/technical/browser review are recorded by the
coordinating agent. Review findings may require changes after this handoff.
