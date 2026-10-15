# Operations independent review

15 October 2026. Root reviewed the four complete articles and their lesson SQL,
separately from the author. The collection's separate sequential first reader is
also reading the assembled collection without these author notes.

The migration explains A/B/C readers and writers before showing DDL. Reviewed the
one-way trigger, historical backfill, null guard, validation and actual rollback
boundary. The old representation is explicitly no longer safe for A after C's
new-only writes. Browser blocks and server transaction boundaries are distinguished;
NOT VALID is not mistaken for disabled enforcement. No blocking finding.

Recovery distinguishes snapshot integrity, acknowledged operations and external
side effects. The script creates new databases, stops on errors and preserves the
archive for inspection. Omitting ACLs/ownership is explained. Actual server restore
execution is unavailable and disclosed next to the procedure; SQL reconciliation
is executed, not presented as a physical recovery test. No claim of measured RTO.

Access control introduces each authority before exercising it. The fixed-tenant
policy avoids implying a caller-controlled session variable establishes tenant
security. Reads needed for UPDATE/RETURNING are granted, table-wide SELECT is not.
Owner bypass, memberships, PUBLIC and default-privilege scope are explained. The
literal lesson verifies forbidden email/DELETE and the zero-row other-tenant update.

Lifecycle follows parent, child, external copy, retained snapshot and independent
deletion ledger. It neither equates logical deletion with physical erasure nor
lets a ledger restored from the same old backup supply missing decisions. Stable
identity reuse, delayed resurrection and retention bounds receive explicit treatment.

The prose develops the example continuously. Tables clarify release and recovery
states. SQL panels have concrete actor, setup and outcome context. No material
technical or teaching repairs were required in this pass. Rendered checks and
execution are recorded in the collection verification artifacts.
