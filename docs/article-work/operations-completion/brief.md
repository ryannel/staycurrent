# Operations completion

Commissioned 15 October 2026 within the authorised relational publication.

Each article teaches a bounded operational job to an engineer who understands basic
SQL and transactions but has not yet designed the procedure.

- Schema changes: preserve a live read/write agreement across application versions,
  backfill existing records, establish the replacement constraint, and identify the
  rollback boundary before retiring the old representation. Use a same-meaning
  column replacement so compatibility is the central problem, not parsing data.
- Recovery: define the recoverable point and full service recovery time, restore an
  isolated target, and reconcile independently acknowledged requests. Provide an
  executable server drill, while distinguishing it from the browser model and
  explicitly disclosing lack of a server execution environment.
- Access: give a nonowner shipping role only its needed operations, columns and
  tenant records. Show both denied statements and the allowed work, then account for
  ownership, new-object defaults, connection context and useful audit identity.
- Lifecycle: complete a customer's deletion across dependent live records and
  copies, then prevent an older restore from silently reviving them. Keep retention
  choices policy-driven rather than asserting jurisdiction-specific legal rules.

Four independent sandbox lessons have explicit first-step setup, predictions,
interpretation, editable variations and resets. Failures use expectedError and
are verified over raw PostgreSQL protocol. No browser replication, physical disk
failure, real backup restore, authentication or multi-session test is claimed.

Coordinator owns independent review, assembled browser checks, registry integration,
build and authorised publication. Owned pages retain Working draft/noindex until
that publication pass.
