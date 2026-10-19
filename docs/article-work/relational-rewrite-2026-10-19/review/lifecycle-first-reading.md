# PostgreSQL lifecycle: uncued first reading

Sequential source reading of `src/drafts/relational/rl119.md`, 19 October 2026. I used only the first-reading and blind-review-voice guidance before reading this artifact; no brief, history, evidence, map or prior findings. Audience: an intelligent application engineer new to operating PostgreSQL. This is source reading, including the figures' stated states, not rendered or interaction QA. No other article has been visited.

## Opening and first sections

The title and opening promise to explain how schema changes affect traffic and compatibility, then give a concrete path through failed index creation, index maintenance and a compatible backfill. At the end of the opening I can explain why a technically quick ALTER or a write-permitting index build may still be operationally disruptive. The sentences about locks and unusable remnants supply that understanding. I expect specific tests that justify calling each stage complete.

“A short operation can wait a long time” leads me to expect a cheap operation blocked by traffic. Client A's open read and B's timed ALTER supply precisely that. The text explains both the retained table lock and why the absence of a row write lock does not help. The queue paragraph extends the consequence to new traffic at the right time. I understand the purpose of the activity query, though I could not interpret every possible returned lock value without more product knowledge. That is not needed to follow the observed timeout. The distinction between lock_timeout and statement_timeout is useful and brief. The final historical-currency check prevents conflating a successful default addition with valid business data.

“Inspect rewrite and validation requirements” promises to generalize from that one ALTER. It does: actual expression and version control whether the operation rewrites data. The NOT VALID/VALIDATE split makes future-write enforcement different from checking old rows. The equality example involving `code_text` and `code` introduces fields not yet set up, so I currently take it as a generic illustration. I expect those names to return in the promised backfill. The SQL-unknown warning is clear enough if I remember SQL's null semantics; an inexperienced reader may need to recall that a comparison involving null is unknown rather than false. The text states the practical consequence directly, so I need not derive it to proceed.

“A failed concurrent index can remain” delivers the promised lifecycle failure. The fresh `change_lab` setup makes ids 1/2, code 7 and index name `change_code` easy to distinguish. I trace the duplicate failure and false/false flags. The text supplies what those flags mean for the observed case and warns that a later failure can leave a different maintenance state. I do not have to pretend false/false describes every invalid index.

Figure 1 presents requested build, invalid remnant, data/object repair, valid rebuilt index. The stated states teach that existence is weaker than a valid usable index. The accompanying executable repair has a defined business fact—row 2 should be code 8—so the arbitrary-looking UPDATE is justified. It avoids teaching that any changed duplicate is a legitimate repair. The source shows step controls; I cannot assess their rendered state or operation here.

The monitoring paragraph names snapshots, WAL and replicas without developing each. I can follow its practical claim—allow writes does not mean no waiting, disk or downstream work. The failed-REINDEX-copy warning opens an operational question about which copy to keep. I expect the next rebuilding section to give enough context for the successful case, not an exhaustive failure runbook.

## Measurement, rebuild and removal — next chunk

This chunk arrived with headings and bodies together; heading expectations here are retrospective.

The lifecycle section introduces a separate disposable server and maps integer 81 to the familiar order/request identities explicitly. The second tenant's independent 81/r81 at 90.00 gives tenant-aware keys a visible purpose. I can distinguish order ID, request ID, tenant, price and customer. The 250,001 full-load total follows from 250,000 t4 rows plus the other tenant; 25,002 survivors include the special retained 81 and the other tenant. The deletion rule and table make the arithmetic recoverable without hidden fixture knowledge.

The size table earns its detail. Same survivor keys and same index definition isolate the structural difference: 1,507 sparse leaves versus 151 freshly packed leaves. The approximate bytes per row carry the lesson without making me calculate all the divisions. I can explain why ordinary vacuum need not compact a tree whose leaves are each partly occupied.

The `pgstatindex` paragraph clearly treats inspection as work with permission and I/O costs, not a free dashboard. Density and fragmentation are separated before the reuse comparison. The second fixture demonstrates why a large file can still contain useful reusable capacity. “Advances beyond the deletion boundary” is vague on first encounter: I do not know whether this is an ID, transaction-age or time boundary. The following new-ID insertion tells me the eventual result, but not what the advance does or why a second vacuum is necessary. The linked vacuum article may explain the general rule, but the local phrase itself leaves that step indistinct.

Figure 2 is a component reference in source. The surrounding prose tells me to compare scattered and oldest-key deletion after vacuum. I cannot read its actual visible states from this artifact's source, so I cannot judge whether it teaches that difference or matches the native measurements. Root's rendered QA must supply that observation; I do not infer the figure's success from the stated intention.

The rebuild section ties a physical excess to a workload cost and future reuse expectation. The successful REINDEX explanation identifies a new copy, change catching, switch and retirement. Disk, sort spill, WAL and replicas are operationally relevant; the text distinguishes its single-server observations from replica capacity. The numerical WAL interval is carefully bounded as including other work.

The old-snapshot experiment gives the earlier warning about waiting a concrete outcome. One hundred callers committing while the build waits is stronger evidence than the “concurrent” name. The caveat about latency keeps the claim within what was observed. The before/after query results test identities and amounts as well as byte counts. The changing heap-fetch and buffer counts cost some attention, but they explain why a tempting speed comparison would be invalid. I understand that the structural size comparison and correct query result support different claims.

The structural checker paragraph limits what a clean result means. The failed-rebuild subsection then fulfills the earlier promise about temporary copies: valid original versus invalid/ready `_ccnew`, and the distinct `_ccold` possibility. This is a useful contrast with the original false/false duplicate failure. I know which object to keep in the observed case and why blindly deleting both names is wrong.

The removal section starts with zero scans as a candidate rather than a verdict. It then accounts for reset intervals, other servers and rare jobs. The six-scan versus zero example is explicitly a small defined workload, so it does not invite treating seconds of lab activity as production evidence.

The uniqueness section makes quiet constraints concrete: no reads does not mean no contract. The non-unique and longer-unique counterexamples are especially helpful; I can explain why the additional timestamp changes the uniqueness rule. The foreign-key distinction is useful too: a permitted drop can still create expensive work on parent changes.

The prefix section asks the reader to hold a long definition-comparison checklist. I understand its purpose, and the subsequent examples give several entries real consequences. Some terms—operator class, collation, predicate—are named rather than taught. The paragraph gives a useful local example and links the separate operator topic, so I read this as a boundary of this page rather than an unexplained prerequisite to the upcoming simple replacement. The passage could be shorter, but removing it entirely would lose the warning that matching column names is insufficient.

## Replacement and representation change — final chunk

The final chunk overlaps the preceding prefix paragraph because its line positions appear to have moved during the reading. I have not reread earlier content with outside context; the independent record above remains my first encounter. A later editorial reread will identify a stable revision explicitly.

The replacement adds status to INCLUDE, which gives the new index a concrete benefit and concrete size cost. The page verifies the request before dropping either old index, and explicitly retains the price-only history index pending broader workload evidence. I can explain why keeping that apparently overlapping index is consistent with the earlier prefix analysis rather than a contradiction.

Figure 3 distinguishes coexistence, completed drop and rebuilding after a regression. Its text makes “rollback” mean retained definition plus capacity and time, not an instant undo. The following PostgreSQL-specific paragraph closes the tempting invisible-index or global-planner-switch shortcuts. It supports the removal decision without pretending the fixture establishes every production request.

The transition to code representation is clear: access-path coexistence becomes old/new data-contract coexistence. The old `change_lab` fixture resumes explicitly. The trigger's integer authority is unambiguous; both the legacy insert and the modern insert are executable forms, and inconsistent new text is deliberately overwritten during this phase. I do not mistake this as the final desired contract for arbitrary text input.

The bounded backfill is traceable: select up to 100 mismatches in ID order, lock currently available rows, update their derived text, commit and repeat. I know the original two rows need backfill while subsequent trigger-maintained inserts do not. The warning about a zero-row SKIP LOCKED result arrives before the completion claim; it tells me why the full-predicate check and persistent write rule are necessary.

The count, NOT VALID check, validation and concurrent old/new client tests give a completion argument with distinct parts. Earlier SQL-unknown discussion now has its actual home. The source integer was declared nullable, but the trigger plus text-required constraint effectively makes null input fail at this stage. I wonder whether that change of allowed input is deliberate; the page does not explicitly discuss it. This does not obstruct the shown non-null fixture, but matters if I adapt it to the declared nullable column.

The final contract section keeps “text is populated” separate from “old integer callers may be retired.” It gives a concrete reason to define new text values first: some cannot fit the old integer representation. Rollback then has a stage-dependent information-loss risk, rather than merely an executable reverse migration. This completes the opening's compatibility promise.

The whole article is long but has a coherent sequence: traffic locks, validation, failed creation, measurement, rebuild/repair, removal, dual representation, completed backfill, retirement. The lifecycle expansion carries more detail than the compact DDL opening, but supplies decisions an application engineer would otherwise have to import. The local examples mostly pay for their length. There are two independent fixtures, each introduced at its entrance; direct entry into a section may require the preceding setup for values, but not an earlier article. Cross-links point to broader instruction rather than replacing the central local demonstrations.

## Independent verdict before evidence review

The article supplies a workable understanding of its central operating choices. Its strongest passages separate claims that are often collapsed: no rewrite versus no lock; invalid versus not maintained; file size versus active-tree excess; concurrent progress versus unchanged latency; a quiet index versus a dispensable contract; no claimable rows versus complete backfill.

Two local questions deserve resolution:

1. “The supplement advances beyond the deletion boundary, vacuums again…” does not identify what advances or why. Name the transaction/snapshot boundary if that is the observed dependency. Recheck whether a reader can explain why reuse required that step rather than merely retelling the file-size result.
2. The declared nullable `code` later acquires a required derived text constraint. The trigger maps null code to null text, which the constraint rejects. State that the fixture's intended source codes are non-null and enforce that contract explicitly, or adapt the equality rule to preserve legitimate null inputs. Recheck the migration using a null-valued legacy row/input rather than only the shown positive integers.

Figure 2 is not assessable from this source alone because its component markup does not expose the actual visible states. Root owns that rendered check. I did not run SQL, inspect evidence or browse documentation during this first reading. The next report separates that subsequent review from these uncued observations.
