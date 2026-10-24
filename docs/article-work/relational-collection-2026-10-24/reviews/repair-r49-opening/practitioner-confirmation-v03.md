# Practitioner confirmation · article · r49 · repair-r49-opening-v03

Inputs read: assignment `practitioner-assignment-v03.txt`; current review skill and practitioner perspective; [fixed manifest](v03/manifest.json); complete current r49 source and current HTML from `http://127.0.0.1:4552/review/relational-collection/cockroachdb/operations/`, including the final Sources section outside the article body; `Removal.astro`, including all five scripted states; audience, commission, canonical example, r49 brief and relevant plans RL104, RL109, RL123, RL127, RL128 and RL131. Mechanical inputs: applicability, current/original source hashes, complete verifier and relevant native result entries. Current phone-light opening image inspected as a finished rendered piece. No peer reports, earlier article versions or author quality notes read.

Version verified: 108 manifest files all match their recorded SHA-256 values. Manifest SHA-256 is `bed33c322c0ba2fd9cac378d3ab3161298a845a71f6d8715513b9dba874428b7`; r49 source is `80a8a852341555c13b070c30861c87af96d4a8b86e372015adebb4b56e0f33d7`. This is an informed local confirmation, not independent complete article or corpus coverage.

Reference calibration: the Storage and durability fixed reference opening, through its statement of the promise's limits (`src/reference-articles/reading/storage.txt`, lines 4–11). This calibrates stating an operational consequence in ordinary language before explaining physical mechanisms. The changed sentence does not require reloading the reference's detailed storage figures or the other two complete articles.

Highest severity: none.

## Checks

| Check | Result | Note |
| --- | --- | --- |
| Correctness | pass within affected scope | The conditional server-failure/data-unavailability consequence is supported by pinned CockroachDB 25.4 primary documentation; the surrounding maintenance explanation supplies the range-majority conditions later. |
| Evidence | pass within affected scope | The opening says “may”, making no observed failure or universal single-failure claim. The drawing remains explicitly conceptual; reused native evidence retains its one-host mechanism limits. |
| Coverage | pass within affected scope | The opening still motivates both secure runtime identity and planned removal, and distinguishes a successful query from evidence that the service meets its intended boundaries. |
| Depth, both ways | pass within affected scope | A security-entry reader needs only ordinary server and data-availability concepts here. Range, voting-copy and movement detail is introduced at the explicit maintenance preparation point. No extra prerequisite is needed to understand the revised opening. |
| Ownership | pass within affected scope | RL104 remains the security prerequisite; RL123 and RL109 supply the later range and membership preparation. Local operating decisions remain in r49, with locality, upgrades and recovery referred to their owners. |

## Accepted problem and pass condition

**Pass.** The actual current sentence is “The next server failure may make some of its data unavailable.” It names a possible failure and its consequence without requiring the reader to know replicas, voters, ranges or physical placement. The opening's two cases remain recognisable: excessive application authority and insufficient availability when a server fails. Its following sentence explicitly limits what a successful query establishes.

The next paragraph gives the two concrete changes that the article follows: a secure, limited catalogue identity and permanent node removal. The security sections can therefore be read from their stated starting knowledge. “Read health at the range” then explicitly distinguishes that standalone security branch from the additional maintenance preparation, links RL123 and RL109, and introduces the relevant terms locally before the health checks. The subsequent three-voter example and removal drawing explain how a further failure can exhaust a range's allowance. The opening neither pre-empts that explanation nor contradicts it.

## Primary claim check

Independently opened the article's pinned [CockroachDB 25.4 Replication Layer](https://docs.cockroachlabs.com/docs/v25.4/architecture/replication-layer) documentation: Overview, Raft, non-voting replicas, per-replica circuit breakers and Leases. It describes per-range agreement and failure tolerance, and requests failing when they access an unavailable range.

Independently checked [Troubleshoot Self-Hosted Setup](https://docs.cockroachlabs.com/docs/v25.4/cluster-setup-troubleshooting), especially “DB Console shows under-replicated/unavailable ranges” and “Partial availability issues”. These support the consequence that an additional unavailable server can remove a required majority from an already vulnerable range. The article's “may” is appropriate: it does not imply that every healthy three-voter range becomes unavailable after one server loss, or that one successful query establishes the state of all data. This is a documentation-based conditional check, not a new observed failure experiment.

## Reused native evidence and applicability

The unchanged verifier is `e7ce7fa370ac5531e2caae135f442e63caf7f2fdc348e4f42c4107a2d2058c3d`. The removal component remains `f685f1dfa22b9e26713df21a8d914f797b37860ccc1a295476e66911affcc657`. The supplied applicability record identifies the single opening sentence as the only change and leaves later explanations, code, controls, fixture and verifier unchanged. The original article hash identifies the executed baseline; it is not misrepresented as the current article hash.

The retained result pins CockroachDB 25.4.17 CCL, Darwin arm64, build commit `3981ecae25dbf445f122d375bf813b8859158a14`. The verifier starts four secure loopback processes with fresh private certificates/stores, a cleaned connection environment and a unique ownership marker. Its fixture has the named shop 10/20 P7 rows and the same effective-identity policy as the article; the executable scratch database/table names are `ops.products`, while the article uses the explanatory `shop.products` name. Relevant recorded results show the pre-policy cross-shop counterexample, separate runtime results, rejected role/policy bypass attempts, an allowed update followed by rollback, inspected voting placement, decommission dry run and `--wait=all`, followed by range voters `{1,2,4}` and node 3 marked decommissioned.

That evidence remains applicable to the unchanged identity/RLS and local four-to-three removal mechanism claims. It does not establish the revised opening through an observed additional server failure, independent physical failure domains, production load or production acceptance. No native process was started or rerun for this confirmation.

## Findings

None. No new substantive defect found in the changed opening, its surrounding branch preparation or affected downstream use. The next available practitioner finding number remains r49:1.

## Limits

All five practitioner checks were applied to the changed sentence, surrounding explanation and affected dependencies. This confirmation does not repeat every unchanged security, SQL, upgrade, recovery or licensing primary-source check, and does not provide a new complete technical verdict on those areas. Existing mechanical evidence was reused under the identified source/data/environment/verifier limits. Interactive playback and visual control behaviour were not rerun; no control or figure changed. No CUA was used, no build was run, and no source edits, publication, commit or push were performed. Only this report was saved.
