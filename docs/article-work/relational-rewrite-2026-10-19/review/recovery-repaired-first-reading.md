# Recovery: uncued first reading

This is a sequential source reading of `src/drafts/relational/rl129.md` on 19 October 2026. I read only the commissioned first-reading and blind-review-voice references before the article. I have not read its brief, history, coverage map, other reviews or other drafts. The audience is an intelligent application engineer new to backup and recovery in CockroachDB. Root owns rendered-page QA; this reading can assess the stated figure states and their sequence, but cannot establish their visual clarity or live behavior.

## Reading record

### Title, description and opening

The title promises backup and recovery in one particular product. The description promises a concrete chain, an earlier recovery point and a booking/capacity reconciliation that avoids taking the place twice. I expect to learn how the retained backups relate to recoverable states, then how to establish that a restored database is usable by the service.

The opening lets me explain why replication does not protect against a committed deletion: it copies that deletion, whereas separately retained recovery data can supply a prior state. It also establishes that successful restore is a narrower claim than recovered service. The SQL identity and accepted order examples give this distinction concrete content. I now expect an actual identity/access check as well as row checks.

The source explicitly bounds the lab to 25.4.17 and a separate cluster on the same host. The distinction between an inspectable temporary directory and a copy surviving machine loss is clear. No outside product knowledge was needed for that distinction.

### Define the state the service must recover

Heading expectation: identify the facts and relationships the application needs after recovery. This section delivers that through r80, r82 and capacity.

The fixture is understandable on direct entry. `t4` is a tenant, `42` a customer, `s7` a session, and r80/r82 are request identities. The absence of `concurrent-A` and the large event table marks a reset rather than leaving me to import a larger example. That reference costs a little attention on direct entry, but its explicit absence prevents a misleading continuity assumption.

The two wrong outcomes—order without capacity decrement, decrement without accepted request—make the target relationship easy to understand. The backup-scope paragraph supplies a reason to care about dependencies, but does not enumerate the identity consequences yet; that is a live expectation from the opening, not a gap at this point. I did not open the linked setup because I can follow the example's meaning without running it.

### A full backup establishes a base

Heading expectation: create the initial layer and explain what it establishes. The returned two rows map to the initial order and session; I do not need to infer that count from an unseen fixture.

The job-completion/access distinction extends the opening well. The explanation of `nodelocal://1/...` supplies the important storage meaning rather than assuming the URI is self-explanatory. The permissions/retention paragraph broadens the lab into an operational choice without a large detour. I can explain that the SQL success does not prove either destination access or independent survival.

### An incremental preserves the accepted booking

Heading expectation: admit r82, then retain its changes on top of the base. The section delivers both.

At “saves `cluster_logical_timestamp()` before accepting `r82`,” I can place the marker in the event order, but not yet say why that particular marker is needed. I hold that question for the next section.

I traced the mutation: the matching session with positive capacity updates from two to one and returns its tenant; that returned row supplies the insert's tenant, so r82 is inserted for customer 42 at €22. If the update returns no row, the insert receives no row. The following explanation confirms both branches. The text supplies the atomicity claim rather than requiring the reader to infer it merely from the CTE syntax.

The incremental's row counter is explicitly two; the page does not invite interpreting it as two total orders. The chain requirement is concrete enough to understand why the base remains necessary. `LATEST` is distinguished from the desired business state at the point I might otherwise equate them.

### Choose a point inside the retained history

Heading expectation: explain eligible historical points and the saved marker. The first paragraph explains that revision history is bounded rather than an arbitrary time machine.

The specific logical timestamp is identified as a saved value immediately before r82. The warning to capture a new value on rerun makes it an observed example rather than a portable constant. I can tell that the decimal string is the restore marker, not an amount, request identity or ordinary wall-clock display. I cannot yet perform the capture from the article alone; it says the linked worksheet does that. This is setup availability, not an observed execution failure.

The deletion is deliberately inconsistent with the booking operation: r82 disappears while its place remains consumed. That is a clear reason replication cannot repair this mistake.

Figure 1's stated sequence is readable as three database states: base has r80/€20/two places; accepted r82 plus incremental has two orders/€42/one place; mistake deletes r82 but keeps one place. Its caption contrasts the latest backup with a point before r82. At this point I ask: why choose the earlier point when the latest completed backup already contains the correct r82 state and predates the deletion? I expect the historical restore to demonstrate a different recovery tradeoff, rather than become the prescribed repair for this deletion.

### Restore away from the live authority — first half

Heading expectation: isolate the candidate restore from the current source and avoid treating restored data as serving authority immediately.

The fresh store and cluster identity establish separation; the shared host, directory and certificate authority keep the survival claim properly bounded. `new_db_name = 'valid_latest'` makes the restored database distinct from the live name.

The latest restore output is fully traceable: r80 €20, r82 €22, capacity one. The text explains why identity checks are stronger than just counts or totals. This is useful teaching: I now know what a naive check could miss, and the example has the identities needed to do better.

I am stopping this chunk before the earlier-timestamp restore. Outstanding question: why intentionally pick the earlier point for this example when the latest candidate already has the desired data? Outstanding promise: test the service's SQL identity.

### Restore away from the live authority — earlier point

The earlier restore has r80 and two places. The distinction is precise: it is correct for its chosen time but does not fulfill today's accepted booking. This answers what the earlier timestamp demonstrates. My question about why to choose it remains only as a choice of teaching example: the text is contrasting two eligible outcomes, and has not yet advised choosing the earlier one for this particular mistake.

### Reconcile the order and capacity once

Heading expectation: recover r82's coupled facts, then demonstrate that repeating recovery does not take a second place.

The explicit current database resolves which copy the unqualified SQL changes. I trace the first branch as follows: claim `(t4, r82)`, receive r82, decrement s7 from two to one in the same open transaction, then commit. A no-row update causes rollback. I can distinguish the caller's branch from commands to paste because the article says so before the repeat attempt.

The second attempt produces no inserted row. The caller verifies customer and amount, then commits without changing capacity. The conflicting-payload warning prevents equating any existing identity with success. The page has given me enough to predict that decrementing outside this branch would incorrectly leave zero places.

Figure 2's three stated states match this trace: absent/two; inserted/one; matching repeated identity/one. Its caption identifies the dependency that the request identity gates. The source exposes three states and navigation controls; I have not observed the default rendered state, navigation behavior, focus handling or layout.

At the replay itself, I know r82's identity, customer and amount because I have just read the fixture. I now ask where a real recovery operator obtains the surviving evidence of this accepted booking after losing the source. The timestamp was explicitly to be preserved outside loss; the accepted-work evidence has not received the equivalent treatment. This does not prevent tracing the SQL. It matters to transferring this rehearsal into a recovery procedure.

The retry link is a sensible boundary. I did not follow it: tracing this successful pair of attempts does not require the broader retry protocol. The external-effects sentence clearly limits what this fixture proves.

### A successful restore can still lack its caller

Heading expectation: fulfill the opening's SQL-identity promise. It does.

“Before the later booking” explicitly takes me back to the full-backup state and gives this additional copy the name `restored`. I have to reset from `valid_earlier` to a separately restored initial copy, but the text supplies both the name and state, so this is modest bookkeeping rather than an identity contradiction.

The sequence makes three checks distinct: missing user rejects authentication; adding user plus database/schema access still lacks table access; the full shown grant set permits SELECT while UPDATE remains forbidden. The administrator's negative-capacity attempt then tests a separate invariant. Those outcomes teach why a root row query alone is inadequate. I supply no missing product concept to follow this distinction.

The SQL is explicitly for a read-only caller. I do not read the denied UPDATE as an accidental obstacle to the service's booking path. The article does not explain how the lab authenticates this user, so I would need the setup for an actual connection attempt. I have not run it and record no execution failure.

### Missing dependencies need repair

Heading expectation: distinguish broken recovery inputs from a transient job failure. The wrong path and absent completed metadata make that distinction concrete; retrying cannot invent the missing collection.

Parent tables, keys and earlier layers extend the same causal idea. The foreign-key sentence makes the consequence of bypassing a dependency clear enough for this page. I do not need a full dependency catalog here.

The 1.02-second observation appeared in the preceding section and is repeated as a warning about production timing. The second mention earns its place by limiting the measurement's meaning; I would lose that explicit limit if the paragraph disappeared. Cross-version restrictions are a useful procedural boundary rather than an unexplained step in the current same-version run.

### Reopen after accounting for later work

Heading expectation: say when the candidate can replace the current authority. The former-writer fence and the closing records/identities/effects/write-authority conditions do that at an operational-summary level.

The latest-versus-earlier sentence resolves my earlier question without prescribing the earlier restore: latest already retains the pair, earlier needs replay. That comparison is now clear. A brief cue before the earlier restore could shorten the question's lifetime, but it is not necessary to understand the argument.

“List valid requests accepted after the chosen point” is exactly where the missing evidence question becomes operational. The page says what must be established, but not what must have survived to establish it. The external-effect example has a clear consequence: recovery can repeat an effect even when its database record went backwards. I did not follow the outbox link because this is explicitly a further planning concern and the local example remains understandable.

### Sources

The two native records are distinguished by fixture and scope. In particular, the larger record's uncoupled r82 is explicitly not evidence of this article's valid booking. That is a useful boundary rather than an identity silently changing meaning. I did not open source records, worksheets, other drafts or external documentation during this reading.

## Verdict and smallest repair

There is no blocking comprehension problem in this first reading. I can explain the base/incremental dependency, why a selectable historical state can be insufficient for today's service, why the order and capacity must move together, how identity makes this replay repeatable, and why restored rows do not establish usable application access. The running values remain traceable. Both figures' stated states support the argument.

One consequential transfer gap remains: the article asks the operator to identify later accepted work, while only the timestamp is explicitly preserved outside the source's loss.

- Trigger: “The native replay … tries to claim the original request identity,” followed later by “List valid requests accepted after the chosen point and reconcile those that must survive.”
- Observation: I can replay the known fixture, but the page does not tell me that a real operator needs surviving evidence that r82 was accepted and what its original facts were. The example itself supplies those facts to me as reader.
- Consequence: a reader could preserve the backup chain and marker yet have no reliable input for the required reconciliation. A timestamp identifies a point; it does not enumerate the later obligations.
- Smallest repair: add one sentence near the first replay or reopening instructions distinguishing this rehearsal's known fixture facts from a real service's independently retained evidence of accepted requests and their original details. Do not imply the lab tested an acceptance journal if it did not.
- Recheck: after a source-loss scenario, can a first reader name both the retained recovery point and the surviving evidence needed to reconstruct r82, without treating the timestamp as that evidence?

A smaller pacing cost is the deliberately older restore appearing before the reason to study it is fully explicit. “To test the case where the chosen point predates accepted work…” before that restore would make the comparison immediate. The later text already resolves it, so I would not hold the draft for this alone.

This verdict covers comprehension and prose sequence. It does not verify SQL against CockroachDB, the fixture's execution record, backup interval eligibility, exact error codes, rendered figures or live controls. Those remain separate checks.
