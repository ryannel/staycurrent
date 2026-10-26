# Independent reader review — pg-access v01

## Scope and result

First independent editorial, teaching and rendered review of **PostgreSQL roles, policies and privileged code**, frozen v01, at `http://127.0.0.1:4606/review/relational-rebuild/postgresql/access-control/`. The five current source hashes matched `batch-37/review-source.json` at the end of the main review. No article edits, delegation, builds, commits or publication.

**No substantive finding.** This fulfils the planned reader understanding with one optional wording improvement below. The article can sit beside the references in its concrete explanation, selection and language.

The blind reading is recorded separately in `initial-notes.md`, saved before consulting the plan, ownership, neighbours, example facts or technical-source record. I then checked those intended outcomes without an automatic second complete reading. I did not consult earlier reviews or author quality verdicts.

## Teaching and editorial judgement

The five drawings carry the central sequence: inherited privileges versus assuming a role; object grants versus row admission; existing-row filtering versus proposed-row rejection; OR/AND policy combinations; and the authority used through views and functions. Rowan remains the forbidden result throughout. Figure 2 makes `UPDATE 0` visibly different from `ERROR 42501`, and Figure 5 gives the unsafe name lookup an actual disclosed-row outcome. The supporting body explains the consequences at the point they matter.

Two difficult boundaries are handled particularly well. “The setting is caller-controlled” immediately follows the transaction-local example, with the concrete consequence of setting 20. Later the separate support design removes raw customer grants and prior views before introducing a protected login mapping. Thus the reader is not invited to mistake request context for authentication or to imagine that the new function closes an earlier raw path automatically. The session-user/current-user explanation introduced with memberships is reused in the definer function and actual-login testing.

Headings such as “Row-level security”, “Combining policies” and “Default privileges belong to the creator” are precise and searchable. The stale session 20 restored after local 10 is a plain worked example, and the `WITH CHECK` explanation develops one failed proposal rather than stacking abstract warnings. The SQL has a stated illustrative/fixture context. Tenant integrity and extension lifecycle remain with their owners; the customer names, tenant IDs, order 103 and unchanged stored-state claims agree with the supplied example facts. This initial full reading also supplied the continuity pass.

Calibration used bounded source passages and their finished drawings: Sequence diagrams' lifelines/messages and synchronous/asynchronous explanation; Indexes' sequential scan, index entries and B-tree progression; Storage and durability's row-version comparison. The article's role/view paired paths teach a comparable distinction directly; its step results use the same concrete entity across the explanation, as the references do with customer 42 and P7.

## Rendered checks

Owned IAB tabs; desktop 1280×720 and phones with actual measured `innerWidth`/document width of 390/390 (844 high), followed by bounded 375/375 (812 high) confirmation. Inspected all five figures in desktop context, all static drawings at 390 light, Figure 5 at 390 dark, and representative Figure 2/3/5 states at 375 System/dark. Explicit Light and Dark were exercised under the coordinator's theme lease. Desktop light Figure 5 was also inspected.

All four Statement options and both Definition options produced the stated meaningful results. Manual progression covered grants, existing-row admission and proposed-row rejection; Back/Next keyboard activation retained focus on both figures at the first and last steps. Reset worked. Figure 5 Play progressed through identity change, counterfeit mapping and disclosure to the final Replay state; Pause stopped it. Its Figure-as-text disclosure gave the same safe/unsafe explanation. Controls and the changing result/explanation remain together at phone width. Stacked identity/view paths and wrapped policy expressions remained readable, with no document overflow at the measured phone widths.

Computed current figure-text samples, including secondary labels, had a minimum contrast of approximately 6.05:1 in light and 6.15:1 in dark against their rendered surfaces. Hidden rows use secondary text and dashed borders rather than disappearing. No readability, contradictory-state or consequential control problem found.

## Optional finding

**Low — final paragraph of “A narrow callable interface”.** “Types and extensions in PostgreSQL (planned) owns the additional installation and lifecycle privileges of extension code” uses editorial allocation language in a reader hand-off. The reference storage passage says the companion “looks inside” or “explains” the subject; a reader-facing verb would make this sentence equally natural. The intended boundary is already clear, so this does not require reopening delivery.

## Evidence and limits

Consequential practitioner spot checks used PostgreSQL 18 primary documentation: [Row Security Policies](https://www.postgresql.org/docs/18/ddl-rowsecurity.html), [CREATE VIEW](https://www.postgresql.org/docs/18/sql-createview.html) and [Writing SECURITY DEFINER Functions Safely](https://www.postgresql.org/docs/18/sql-createfunction.html#SQL-CREATEFUNCTION-SECURITY). These support the depicted ordinary-grant/RLS distinction, owner/invoker view checks and trusted-path/public-execution precautions. This reader review is not a replacement for the separately assigned full technical verification. I did not execute SQL or audit every native result/assertion. The article clearly distinguishes model drawings, disposable fixture observations and untested deployed authentication/application-pool behaviour.

An unrelated early HMR reset interrupted one Figure 2 selection; the interrupted case was repeated after the coordinator confirmed source stability. Browser screenshots and DOM observations were current; no smooth animation/frame-rate claim is made for background tabs, and playback was judged by changed text/steps, completion and pause rather than wall-clock frame cadence. Contrast sampling covered text, not a complete graphics/border audit. The 375 check was bounded to affected phone layout rather than repeating all 390 interactions.

Restored 1280×720/System, reset viewport overrides and players, and closed every owned tab before releasing the lease. Reference-origin theme remained System.
