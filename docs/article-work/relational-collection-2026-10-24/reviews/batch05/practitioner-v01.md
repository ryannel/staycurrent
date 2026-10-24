# Practitioner review · article · r22, r25 · batch05-v01

Inputs read: [frozen manifest](v01/manifest.json); the commission, intended outcomes/entries, running example and relevant parent/sibling/child plans in `v01/context/`; both complete frozen articles, figure implementations, downloadable scripts/data and scoped mechanical records; complete rendered pieces at port 4418, including opened Sources and further reading disclosures and AI disclosure text. Current review skill and practitioner perspective only. No other reviews, author notes, findings or repair history were read. This is initial article coverage, not a corpus review.

Highest severity: none

## Checks · r22 Live schema changes and backfills

| Check | Result | Note |
| --- | --- | --- |
| 1. Correctness | pass | The fixed finite scale, authoritative decimal bridge, NOT VALID guard, row-local update and acceptance protocol are sound under the declared PostgreSQL conditions. |
| 2. Evidence | pass | Scratch edits are separated from the core history; exact verifier/data/environment match the local migration receipts and served bytes. |
| 3. Coverage | pass | Teaches mixed callers, stale backfill values, late rows, skipped work, meaningful acceptance, authority handover, rollback and load budgets. |
| 4. Depth, both ways | pass | Supplies a complete convergence argument and actionable deployment decisions at the stated entry; native DDL lock/index detail is sensibly left to its owner. |
| 5. Ownership | pass | Owns compatibility and convergence; directs PostgreSQL operational DDL and CockroachDB job mechanisms to their implementation articles. |

Practical challenge and judgement: a zero missing-row count can be invalidated by a late old-format writer, and a non-NULL integer can be wrong. The article tackles both, so neither cursor progress nor missing-only completion is offered as proof. It checks equality over the entire scope with the write guard still active, warns about row-hiding acceptance identities and replicas, and tests rendered application meaning as well as row equality. The trigger's decimal authority is explicit: an integer-only edit cannot silently become a second authority. Contracting requires stopping admission and draining old writers, including imports, workers, prepared commands and in-flight transactions. The controlled handover is a small-fixture choice; it is not passed off as a production rolling deployment test.

Depth/ownership judgement: the authorisation to use a row-local conversion is explained rather than generalised to every backfill. Other-row transformations and table copies are explicitly sent to a different protocol. The needed bridge/constraint implementation is justified by this article's promise. It does not duplicate the child's full lock, rewrite, index lifecycle or schema-job treatment. No substantive missing understanding or unnecessary depth was identified.

Primary sources checked: PostgreSQL 18 [ALTER TABLE](https://www.postgresql.org/docs/18/sql-altertable.html) for subsequent-write enforcement and validation, [Trigger Functions](https://www.postgresql.org/docs/18/plpgsql-trigger.html) for modified NEW rows, [Transaction Isolation](https://www.postgresql.org/docs/18/transaction-iso.html) for the waiting update's condition recheck, [SELECT](https://www.postgresql.org/docs/18/sql-select.html) for skipped locked work, [Numeric Types](https://www.postgresql.org/docs/18/datatype-numeric.html) for the declared exact numeric domain and bigint range, and [Constraints](https://www.postgresql.org/docs/18/ddl-constraints.html) for unknown-valued checks. No universal currency conversion or universal online-DDL property is inferred.

Evidence applicability: read the complete `run-migration.py` and `shop.json` and traced `v01/mechanical/r22/native-served-migration.txt` and the corresponding original local transcript. Script/data hashes match the frozen manifest, source-hash record and downloaded bytes. Current installed PostgreSQL 18.6 and Python 3.14.5 match the recorded environment. The verifier creates its own private directory/socket, clears inherited PG settings, checks actual directory/socket/user, observes the editor's lock wait, and cleans up. Its source checks stale 21.00/2000, a late line below progress, rollback leaving five missing lines, the bridged editor/waiting-backfill result, skipped locked work, validation, bridge-disabled refusal, final integer-only SQL and restoration of canonical 450/3500/2000/2000/450 with order 103 total 2900. These unchanged functional observations were reused; no ceremonial native rerun was made.

Fresh rendered use stepped all saved-copy states to 21.00/2000, switched to Decimal bridge (which reset the illustration), then stepped all bridge states to 21.00/2100 and the skipped missing-only write. The model and its textual alternative accurately label the scratch scenario. The final application handover, production caller inventory and load budgets remain operator acceptance work, not observations the five-row fixture can establish.

Findings: none for r22.

## Checks · r25 Database access and least privilege

| Check | Result | Note |
| --- | --- | --- |
| 1. Correctness | pass | Task-derived grants, role inheritance/SET boundaries, current-user row policies and the owner-authority support view match PostgreSQL's contract. |
| 2. Evidence | pass | Actual per-login sessions are evidenced; trust authentication and browser simulation limits are explicit. Exact script/data/environment and served bytes match. |
| 3. Coverage | pass | Covers allowed and denied work, existing other-shop data, spoofed context, ownership, bypass paths, pools, future objects, revocation and credential-path separation. |
| 4. Depth, both ways | pass | Gives useful parent-level design and acceptance judgement with sufficient native context; leaves privileged routine hardening and secure product setup to children. |
| 5. Ownership | pass | Keeps least-privilege decisions here; hands detailed PostgreSQL privileged code and CockroachDB native identity/security operations to their owners. |

Practical challenge and judgement: a tenant-scoped key does not authorise access, and a caller-settable shop value cannot contain arbitrary SQL using that credential. The article makes those boundaries visible with distinct P7 products and does not confuse an application filter with runtime containment. Its per-shop login model is explicit rather than silently assuming an unlimited pool architecture. It distinguishes current_user from session_user, denies SET paths that would change the effective identity, warns about owner-backed pool connections, and correctly treats zero affected rows differently from a denied insert. Support's all-shop projection is a deliberate exception, not an accidentally inherited tenant policy.

The actual permitted work is narrow catalogue editing; it does not promise that granting a table operation implements checkout or business approval. Future objects, default-creating roles and effective grant revocation are considered, and the piece does not claim SQL grants establish TLS, credential storage or tenant-safe privileged routines. No consequential missing understanding or unnecessary full child treatment was found at the declared entry.

Primary sources checked: PostgreSQL 18 [Privileges](https://www.postgresql.org/docs/18/ddl-priv.html), [GRANT](https://www.postgresql.org/docs/18/sql-grant.html), [Role Membership](https://www.postgresql.org/docs/18/role-membership.html), [Row Security Policies](https://www.postgresql.org/docs/18/ddl-rowsecurity.html), [System Information Functions](https://www.postgresql.org/docs/18/functions-info.html), [CREATE VIEW](https://www.postgresql.org/docs/18/sql-createview.html) and [ALTER DEFAULT PRIVILEGES](https://www.postgresql.org/docs/18/sql-alterdefaultprivileges.html). Checked owner re-grant authority, separate inheritance and SET membership options, USING/WITH CHECK and bypass, effective identity, view-owner versus invoker policies, and future-object scope.

Evidence applicability: read the complete unchanged `run-access.py` and fixed shop data, and traced `v01/mechanical/r25/native-served-access.txt` plus the corresponding original local transcript. Frozen script/data hashes, source record and served bytes agree; installed PostgreSQL 18.6 and Python 3.14.5 match. The verifier establishes separate actual login sessions with `-U`, checks both identity names, uses an owned private cluster/socket with inherited PG variables cleared and no TCP listener, and removes it. It checks unprotected all-shop access, context spoofing, corrected 3/1 row scopes, denied cross-shop insert and role switches, allowed local insert/rolled-back edit, owner/support controls, a future table, removal of the actual inherited SELECT grant and canonical final prices. These remain applicable functional receipts, so I did not repeat them.

Fresh rendered use changed runtime_10's caller setting to 20 and observed Copper mug, then selected Database identity and observed Blue mug. With runtime_20 and caller setting 10 it continued to return Copper mug. The complete figure source confirms the other combinations and declares that hidden means this SELECT's result, not every information channel. Production authentication, TLS, proxies, pool resets and rotation were neither reproduced nor claimed by the fixture.

Findings: none for r25.

## Limits

All 79 frozen manifest files matched. All four actual rendered download hrefs at port 4418 returned HTTP 200 and exact frozen source bytes; [raw scoped hash/download observations](practitioner-v01-observations.json) are separate. The checks above use fresh reading and applicable unchanged native receipts, not earlier quality judgements.

This report does not certify visual/accessibility quality, browser file saving, production deployment safety or production authentication. No viewport or theme was changed; no browser download-event/save/path wait was used. Bounded localhost byte verification succeeded after sandbox escalation. The temporary review tab was closed. No article repair, build, publication or delegation was performed.
