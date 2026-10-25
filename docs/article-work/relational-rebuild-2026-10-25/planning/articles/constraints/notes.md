# Constraints plan notes

This is the detailed plan for the accepted `constraints` node. Ownership is unchanged. No new child is proposed: these outcomes fit one article; the existing transactions, history and access-control neighbours already own the deeper work introduced here. No article prose, implementation, execution claims or review has been produced.

## Reference exposure

Read every bounded part separately with `scripts/read-writing-reference.py`, receiving every END marker: sequences 1–6, indexes 1–7 and storage 1–6. The helper validated the supplied reference hashes. Studied the finished previews on port 4584 in one owned background tab, then closed it; no viewport or theme changes and no user tabs were used.

Studied sequences Figure 2's waiting relation, indexes Figure 7's composite entries and storage Figure 5's distinction between stored state and application knowledge. The outline adapts their progressive vocabulary, one changed fact at a time and explicit limits. Figure construction and prose remain with the fresh writer.

## Example decisions agreed with the coordinator

- Preserve supplied rows, amounts, names and table names. An `order_items` row is an order line. Reuse quantity > 0, price >= 0, stock >= 0 and existing status values without strengthening their meaning. There is no existing non-negative `unit_price` check.
- Reuse loyalty codes: Mina has TEA-7; Tariq and Edda have NULL. State the policy of unique assigned codes with multiple unassigned codes, and label engine behaviour. Conditional uniqueness needs no second worked business scenario.
- **Accepted tenant scenario:** tenant 10 contains the starting shop rows; tenant 20 has customer 4, Rowan Vale. A proposed (tenant 10, customer 4) order demonstrates a mismatch although both identifiers exist. Keep `customer_id` globally unique and add `UNIQUE (tenant_id, customer_id)` as the composite referenced key; the referencing pair enforces membership. Explain separately that local identifier reuse calls for scoped identity. Carry tenant membership through references to tenant-owned orders and products; do not imply a shared catalogue has the same ownership rule.
- **Accepted room-reservation scenario, separate from shop purchases:** tea-tasting room R1 has reservation 7001 [2026-11-02 10:00Z, 11:00Z). Attempted 7002 [10:30Z, 11:30Z) overlaps; adjacent 7003 [11:00Z, 12:00Z) is allowed. No earlier class-booking extension is carried forward. Required start/end values, end > start and explicit [start, end) bounds prevent missing or empty intervals escaping the intended rule. PostgreSQL scalar equality alongside range overlap commonly uses `btree_gist`; native operator/extension depth stays elsewhere.
- **Accepted payment counterexample, separate from 103's starting state:** an explicit illustrative rule rejects total payments above 29.00. Two hypothetical attempts each read 29.00 due and propose 20.00, making 40.00 together. This is not a universal prohibition on advance credit or a rule enforced by the supplied schema. No new committed payments or observed concurrent run are claimed. Transactions supplies the sound protocol.
- Deletion examples must be conditional on policy. The supplied foreign keys use their defaults; do not silently adopt cascade deletion for recorded purchases. Show what a chosen action would do and send policy design to history. Cancellation is a status change, not deletion.

## Primary-source checks

Checked external primary documentation on 25 October 2026. The writer must distinguish documented models from results run by the coordinator.

- [PostgreSQL 18: Constraints](https://www.postgresql.org/docs/18/ddl-constraints.html): CHECK true/unknown, changed-row scope, keys, references, NULLs and referential actions. [CREATE TABLE](https://www.postgresql.org/docs/18/sql-createtable.html): precise syntax, composite matching and suitable referenced keys. Preserve the NO ACTION/RESTRICT timing distinction and close unintended NULL escape paths.
- [PostgreSQL 18: Identity columns](https://www.postgresql.org/docs/18/ddl-identity-columns.html): value generation does not guarantee uniqueness; keep a declared primary or unique key.
- [PostgreSQL 18: Partial indexes](https://www.postgresql.org/docs/18/indexes-partial.html): uniqueness among qualifying rows; query matching and maintenance stay with index coverage.
- [PostgreSQL 18: Range types, constraints on ranges](https://www.postgresql.org/docs/18/rangetypes.html#RANGETYPES-CONSTRAINT): exclusion by overlap, combination with scalar equality using `btree_gist`, and explicit inclusive/exclusive bounds.
- [PostgreSQL 18: SET CONSTRAINTS](https://www.postgresql.org/docs/18/sql-set-constraints.html): eligible deferrable keys, references and exclusions; CHECK and NOT NULL are immediate. Deferral still requires a valid final state.
- [PostgreSQL 18: Index uniqueness checks](https://www.postgresql.org/docs/18/index-unique-checks.html): built-in uniqueness handles concurrent conflicts; an earlier application SELECT is not equivalent. Omit internal MVCC machinery.
- [PostgreSQL 18: Trigger behaviour](https://www.postgresql.org/docs/18/trigger-definition.html) and [CREATE TRIGGER](https://www.postgresql.org/docs/18/sql-createtrigger.html): old/new values, event scope and transactional execution. Full trigger engineering is outside this outline.
- [PostgreSQL 18: Transaction isolation](https://www.postgresql.org/docs/18/transaction-iso.html): statement snapshots and serial outcomes underpin the aggregate-check counterexample. Neither a trigger nor a deferred check is itself a complete concurrency protocol.
- [PostgreSQL 18: ALTER TABLE](https://www.postgresql.org/docs/18/sql-altertable.html): `NOT VALID` versus validated existing data. Explain the distinction without a rollout procedure.
- [SQLite: Foreign key support](https://www.sqlite.org/foreignkeys.html) and [CREATE TABLE](https://www.sqlite.org/lang_createtable.html): connection enforcement and engine-specific primary-key/NULL behaviour. These are portability checks, not a four-engine comparison.

## Continuity and remaining boundaries

The plan starts from row meaning, keys/references and NULL meaning, then introduces only the SQL needed to express each rule. It develops enough of the aggregate failure to make the handoff useful without requiring the transactions article first. Status membership, order settlement, row existence, minimum child counts and permission remain distinct. No currency is assigned. The stock race is a boundary reminder, not a second concurrent worked protocol.

The coordinator accepted all three scenarios and will add them centrally. The supplied ownership slice does not name the destination for detailed range/trigger engineering or live constraint rollout. No page is added or ownership changed: the outline confines these topics to recognising the boundary. The coordinator can map contextual links using the complete accepted tree. Sources/further-reading should follow the collection's bottom-of-article pattern.
