# Relational databases · opening sample

Use the current `staycurrent-write` skill to write a fresh introduction and first section for **Relational databases**. The audience is intelligent engineers who have not used relational databases. The collection will take them towards expert practice; this commission is only its opening and first section.

Coverage intent from the accepted first-section plan:

> Show customers, orders, order lines and stock reservations as a small connected schema. Explain facts, keys and relationships through that example, and use one valid-quantity constraint to show a database-enforced rule. Establish that a schema expresses meaning, rather than being a collection of containers. Defer formal dependency analysis, SQL duplicates and missing-value semantics to their owning branches; introduce the shared-stock concurrency rule only in the transaction section.

The canonical running example is `docs/coverage/relational-example.md`. Parent-level scope: introduce related facts and database-enforced rules; later sections introduce queries, concurrency, physical work, application integration and operation. Detailed design and SQL have their own contextual articles. Choose the opening, heading and presentation using the writing skill.

Read the three complete fixed reference articles, including their figures. Finished reference previews are available at:

- `http://127.0.0.1:4346/review/examples/sequences/`
- `http://127.0.0.1:4346/review/examples/indexes/`
- `http://127.0.0.1:4346/review/examples/storage/`

Create an Astro body fragment at `src/articles/relational-reference-test/opening.astro`, without a page shell or h1. Put any supporting components under `src/components/relational-reference-test/`. The coordinator owns the shell, preview and build; request a build when the complete source is ready. Use existing shared site components where appropriate. Keep your work record at `docs/article-work/relational-reference-test-2026-10-22/writer-record.md` and mechanical receipts in that directory if needed. Native database checks, if needed, use an owned disposable cluster on port 56812 with private socket, sanitised connection settings, endpoint verification and guaranteed cleanup.

This is a fresh writing test. Do not read other relational article drafts, trial components, earlier skill versions, feedback, review history or experiment records. The historical paths mentioned inside the canonical example are provenance, not additional reading. Do not modify existing article drafts or shared site files. Do not build, serve, commit, push or arrange reviewers. This partial sample is not a completed-article review or publication commission.
