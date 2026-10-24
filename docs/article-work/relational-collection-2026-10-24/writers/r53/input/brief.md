# Moving a SQL application to CockroachDB

Port an application contract and transfer writes from PostgreSQL to CockroachDB with a reconciled return path.

## What the reader should understand

- Find semantic incompatibilities behind SQL similarity
- Validate a consistent copy and a single write authority

## Starting knowledge

Application SQL, schema compatibility, request identity and CockroachDB transactions.

This article contributes to the collection’s newcomer-to-practitioner journey. Teach its subject properly; neighbouring scopes below are boundaries and optional further reading, not a checklist of introductory coverage.

## Neighbouring ownership

- Upgrading and migrating PostgreSQL: Owns PostgreSQL-native upgrades.
- PostgreSQL logical replication and change feeds: Owns PostgreSQL logical row streams.
- CockroachDB backup and recovery: Owns CockroachDB restore.

## Prerequisite context

- SQL at the application boundary: supplied complete draft source (r09.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/application-sql/. This is entry context, not an independent review verdict.
- Live schema changes and backfills: supplied complete draft source (r22.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/schema-changes/. This is entry context, not an independent review verdict.
- Retries when a commit reply is missing: supplied complete draft source (r16.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/conflicts-and-retries/. This is entry context, not an independent review verdict.
- CockroachDB transactions and retries: planned starting knowledge: Relate intents and transaction state to atomic visibility; Handle native retry and ambiguous-result paths without repeating external work. Its finished draft is not yet available; do not infer wording from old versions.

The supplied introduction establishes common entrance knowledge; its rendered context is http://127.0.0.1:4368/review/relational-collection/. The three fixed references remain the prose and teaching standard.

## Output

Body fragment: src/articles/relational-collection/r53.astro. Supporting components: src/components/relational-collection/r53/. The orchestrator supplies shell, navigation, contents and final source disclosure. Choose the final title and description in metadata.json. Use public collection article URLs in body links; the preview shell remaps ready drafts.
