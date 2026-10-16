# First reading: object storage

## Method and artifact

Independent agent reading, 16 October 2026, http://localhost:4330/learn/databases/object-storage/. Audience: application engineers comfortable with files and basic HTTP. No article sources, prior reviews, evidence records, author intent or service documentation read. I necessarily bring technical knowledge; observations below identify where it fills a step. This is an agent comprehension review, not a human novice test.

Browser-rendered HTML text was extracted with Playwright and Chrome at 1280 × 1000; script/style nodes excluded. Closed details were replaced by a labelled optional-material boundary. The landing page arrived in one whole-page chunk (a granularity limitation); subsequent articles arrived as opening then one h2 section per read, with observations saved before the next chunk. Navigation order is the collection's own Objects and requests → Building applications → Operating the store → Amazon S3 sequence, followed by sandbox and real-service practice. Figures are captured from the live page after scrolling and image decode, at their rendered size. Extracted text establishes wording/order, not live widget results. Interactive work is recorded separately.

## Landing page

Opening understanding: an object is named bytes plus descriptive metadata in a bucket; the application gives those bytes meaning. The first product example makes the distinction useful: price is searchable in the database while image bytes are fetched by bucket/key. “Revision chosen by the application” makes me wonder whether S3 also has revisions; later versioning mention marks that as an operating topic rather than answering it yet.

The landing page teaches the request vocabulary and makes the one-object atomicity boundary concrete with new price/old stock. I can now explain why a manifest helps, but do not yet know what a reader does if it changes halfway through reading. The promise to use one manifest throughout supplies enough for this introduction. Later publication reading should supply the protocol.

No opening blocker. The final operating survey is deliberately dense (signed URLs, CDN, lifecycle, replication, restore), but each is attached to a consequence and offered as later reading. It would not support implementing those features alone; it does not promise to.

## 1. Keys, metadata and object layout

Opening understanding: the name looks like a path but gives no directory ownership or atomic rename. I can explain why name choice belongs to application design, not infer all properties from the apparent directory hierarchy. Immediate question: what makes a name dependable when the product changes? Awaiting the first section.

Identity and location answers the opening question using a product rename. The r1/r2 example also answers my landing-page revision question: these revisions are names chosen by the application, with the current choice in the database. Tenant prefix comes with its trust boundary before I could mistake the string for authorization. “Content digest” assumes a little vocabulary; the following identical-bytes sentence lets the reader infer its purpose, although the algorithm itself is deferred. No needed step missing.

Prefixes and listing: the i-8/i-83 collision is a good exact-input explanation. I can predict the prefix/delimiter result from the four names, then learn pagination before treating LIST as a fixed inventory. The final manifest distinction carries forward the landing page and adds why listing cannot replace it. I supplied the word “opaque” from expertise, but the instruction not to invent the token makes its operational meaning clear.

Metadata: “already identified by key” is the useful dividing line between a field and a search index. Copying an object to change user metadata surprises me, but it is stated before any recommendation to use it for mutable progress. Annotations are a new term with no example; I can follow because the only needed fact here is separate changeability. This is optional curiosity, not a continuity failure.

Object boundaries: the million-to-thousand calculation is traceable and useful. The figure is legible at its rendered 640px width; it repeats the request contrast compactly. The indexed-batches panel is less concrete than the first two: it names an index but does not show an offset/range. At this point I use prior knowledge to picture byte positions. The section has not asked me to implement a range read and links transfer next, so I retain that question for the transfer lesson rather than demand a diagram here.

Moving: copy → verify → publish reference → retain → delete follows from the identity distinction. “Retention rule” is still an application obligation; the article correctly sends me onward for lifecycle. The keys exercise is a useful prediction (photo also matches photographs or photo without slash), but I have not run it yet.

## 2. Uploads, downloads and integrity

Opening understanding: retryable uploaded parts and a GET-readable object are distinct states. This is enough to motivate completion rather than treating it as a ceremonial last request. I want to know what identifies those unfinished parts and what a retry preserves.

Three stages answers the ID question: upload ID selects the unfinished upload; part number positions bytes; returned ETag accompanies that part at completion. “ETag” arrives without its own definition, but I can treat it as the value returned by the service. I supplied its broader validator meaning from expertise and will not credit this section for explaining that. The explicit no-other-writer assumption keeps the example bounded. Arrival order vs part order is clearly explained.

Resume: the source-change example explains why persisting an ID is insufficient. I can trace e1/e2/e3 into the ordered completion list. The 10 MiB accidental completion is particularly useful depth: a successful API call cannot infer intended size. The HTTP-200/body-error case appears at the point success becomes a claim, so the warning earns its place. Lost completion reply leads naturally to reconciliation, although what “expected identity” comparison looks like remains deferred to later consistency/practice.

Checksum section resolves the digest vocabulary and distinguishes key/version/checksum/ETag without conflating them. The ETag explanation still gives its role rather than mechanics, which is sufficient for the returned-token use already shown. Composite vs full-file comparison is a useful limitation; a reader would need the linked service guide to choose actual checksum options. That is external implementation detail, not a missing inference in this article.

Range section answers the earlier index question at the needed level: byte 0–1023 is 1,024 bytes, header/index locates further sections, decoding still depends on format. The two-revision mixed download is easy to picture and extends one-object atomic replacement without contradicting it. The three ways to pin a revision are not implemented here, but later versioning and conditional writes are promised. No necessary extra visual; the exact range is clearer than a generic picture.

Finishing work completes the state distinction: incomplete parts require abort, not object delete. The in-flight-worker caveat gives a reason for verifying cleanup. The multipart figure is legible at its actual width and places ID, part tokens and ordered completion together; it reduces recall burden without adding another representation to learn. Sandbox scale omissions are explicit before the invitation.

## 3. Consistency and concurrent writers

Opening understanding: the origin makes a completed write visible and replaces one key atomically, but this does not select the right writer. “Origin” uses web infrastructure vocabulary not yet defined explicitly; basic HTTP audience may infer the object service from context. I do not yet know how to reconcile a retry whose first reply disappeared, which is the promised example I want to follow.

One key: limit 10 → 20 puts a concrete value behind atomicity. The final paragraph resolves “origin” through the alternative cached/replicated copy. “Control-plane” is unexplained jargon, but bucket-configuration contrast conveys the needed fact. Minor vocabulary friction, not a blocker.

Lost update: the article explicitly resets settings.json to three fields (“Now”), so the reused identifier does not silently change state. I can construct B’s stale document as limit 10/green/r1 and predict the loss. The explanation identifies the stale premise before introducing an API mechanism; strong learning continuity.

Conditional replacement supplies the ETag meaning missing earlier: read token returned as a precondition. I can predict B’s 412 and the required reread/reapply. The stale-body/new-header warning closes a common practical shortcut. Delete marker is a new undefined term here; it is used only for a versioned-bucket caveat and will need recovery later. Main single-current-object argument remains complete.

Token/history: the A→B→A example makes the distinction useful; fresh revision in each body preserves application history while If-Match still supplies atomic checking. This answers why the earlier settings document suddenly included r1. I understood the need before being asked to adopt the convention.

Lost reply: r2 comparison produces evidence of current publication, while a later r3 cannot rule out prior r2. This answers the transfer article’s expected-identity question conceptually. 404/409/412 is a dense paragraph, but the branches attach each result to a different event; I can distinguish them without memorising all codes. Re-upload after multipart 409 is surprising and clearly stated as a separate cost. I would use sandbox to test lost-success → retry rejection; no need for an extra diagram before that exercise.

Several objects: prices 24/stock four repeats and sharpens the introduction’s boundary, then turns one-key atomicity into an intentional publication point. The transition to publication has a live question: how long must the old generation remain?

Artifact continuity note: after consistency, the coordinator preserved the original built artifact unchanged at /private/tmp/staycurrent-object-first-reading and http://localhost:4331. All remaining initial readings use that copy while other reviewers repair the working source. These notes describe the initial artifact, not the repaired source.

## 4. Publishing a dataset

Opening understanding: immutable files plus one manifest create the group boundary only when readers obey it. This is more specific than “use a manifest”: publication is replacement of the small discovery object, and existing readers need the files it previously named.

Intermediate state: the example repeats earlier values consistently. The explanation that reversing order merely changes the mixture closes an obvious attempted fix. No question added.

Generation names: the JSON makes the manifest executable in my head. I can trace one reader: GET current once → save B → fetch B prices and stock. The text prevents fallback-to-A and second-manifest shortcuts. The source-snapshot caveat comes after the publication mechanism is complete, so it extends the guarantee without muddying the first explanation. The figure is legible and makes old/new readers visible side by side; the arrows are textual relationships, not a timing diagram, but the captions provide order.

Failed publisher: three crash points have distinct visible outcomes; publication ID reuses the prior lesson’s reconciliation principle. Immutability is correctly backed by create conditions and permissions rather than silently guaranteed by B in the name. Current-manifest and intervening-history limits remain consistent.

Competing publishers applies prior knowledge rather than reteaching it. Independent-snapshot discard vs dependent rebuild explains why not every conflict should merge. No ambiguity about publication ID replacing the condition.

Deletion answers the question I carried in: 5-minute cache lifetime plus 10-minute read lifetime gives 12:15. This is excellent concrete depth and I can reproduce the bound. The collector/publisher race adds a second dimension, but the stopped-job/new-generation rule provides a bounded design rather than ending with “coordinate somehow.” I had to picture two timelines (reader expiry and abandoned publisher), but the paragraphs handle them separately. A timeline could lower effort; not necessary to follow the arithmetic.

Next layer: table formats are introduced by what the simple manifest does not supply, and the one-row image case avoids pushing the same protocol everywhere. The closing exercise has a clear prediction: deleting A breaks a reader that already saved A even though B is current.

## 5. Access and private uploads

Opening understanding: application account ownership and storage authorization are different checks; backend bridges them. “AWS principal” is new, but the next section’s heading promises who makes a request. I can explain why a tenant prefix alone cannot establish ownership from the first article.

Request path explains the backend’s sequence and why bytes bypass it. “Role” is also new AWS vocabulary; the text provides enough functional meaning (server identity with permissions) without a formal definition. Figure is legible and accurately distinguishes application session from signer authority. At this point I want to know whether a signed URL can be reused, and whether it constrains file contents.

Permissions: concrete action/resource distinction explains why successful GET does not imply LIST. IAM, ACL and Block Public Access arrive as service terms in a dense paragraph; the article explains their consequences but not policy syntax. Appropriate for this protocol guide; real diagnosis remains an onward task. The warning against arbitrary user keys directly follows the ownership model.

Signed URL section answers both pending questions: reusable bearer authority, fixed method/signed fields, no content truth from declared media type. POST size-policy distinction is useful scope control. “Bearer” is my vocabulary, not the article’s required terminology; “whoever holds it” teaches it plainly.

CORS: preflight is introduced by what it asks, enough for the HTTP audience. The command-line/browser difference makes the separate mechanism testable. “Expose ETag” gains meaning from multipart; it is not an isolated header tip.

Validation: reusable upload → changed bytes after validation is an earned race, not an abstract security warning. The solution binds inspect and copy to one version and protects delivery write access. Version ID is known as an identity from transfer, though exact version-specific copy syntax is not given. I can trace failures without assuming a distributed transaction. The comparison needed after a lost copy reply is stated (“recorded source”) but requires implementation choices; the next lifecycle article promises more state.

Encryption: SSE-S3/SSE-KMS are introduced as labels with their operational difference (key service and permissions). No prior cloud knowledge needed to grasp the recovery dependency. Closing test route is complete and honestly outside the sandbox’s claims.

## 6. Objects and database records

Opening understanding: the two systems can commit independently, so durable unfinished state is the mechanism, not an error to wish away. Foreign-key vocabulary is beyond the stated minimum audience, but the next two sentences explain the missing enforcement without needing that term. I want the concrete fields and retry decision that make “durable” useful.

Ready: fields answer the pending question, and the ready invariant ties complete validated immutable bytes to the row. i-83 is reused from the product example for a profile photograph; it is explicitly a new application scenario, so this is a setup change, not continuity of the mug’s image. Keeping the previous photo until ready is understandable before the diagram arrives.

Upload/verify/publish: the single database transaction now gives “ready” an enforceable place. The overwrite race repeats access but links rather than re-deriving all the copy details. Idempotent is immediately defined by repeated completion not undoing a newer choice. Compare-and-set has been taught in the object context, so its reuse is accessible. Figure legible; it visually holds i-82 during pending then switches to i-83, which helps the temporal relation.

Failures: pending→abandoned and pending→ready share a condition, so I can predict which worker loses. The late-upload caveat prevents treating state exclusion as physical deletion. The action table is concrete enough to diagnose states without pretending it encodes every race. Current reference/missing object is correctly an integrity incident, not an automatic republish path.

Deletion: job-in-same-transaction closes the crash gap; deleting-state barrier closes the later new-reference gap. Both explain what coordination means concretely. Reused-key delayed job ties back to identity choices with a new failure consequence. Delete marker remains a purposeful forward reference and is now briefly defined.

Reconciliation: expected queue vs missed-state inventory is a useful distinction, and age margin keeps the sweep from undoing the protocol. Outbox is offered for deeper implementation after the pattern has already been explained. No blocking questions in this lesson.

## 7. Delivering and caching objects

Opening understanding: origin, CDN and browser each retain their own copies. This explicitly resolves the earlier “origin” vocabulary. The central question is now how to change the current reference while long-lived copies remain valid.

Which layer: noon/12:01/12:02 is a clear counterexample to origin-stale diagnosis. Figure is legible and supports independent cache states. “TTL” is not expanded, but ten-minute freshness teaches the concept. Positive CloudFront minimum overriding restrictive headers is a dense exception, justified because the article asks readers to design a cache policy; it will need a real configuration check beyond this lesson.

Immutable URLs answers the opening question with two cache policies: stable image and changing selector. Reusing i-83/r2 as a photo example is clear. The old-page/missing-image case carries the earlier retention arithmetic into delivery rather than assuming every cached page cached every asset.

Validation/invalidation: 304's meaning is supplied before using it to recommend anything. I can distinguish asking about a cached value from expelling it. Complete-compatible-set rollback echoes publication coherently; no new protocol demanded.

Private cache: Alice/Bob gives concrete depth to the crucial distinction between shared bytes and personalized bytes. Viewer authorization before cache use answers the question raised by a private origin feeding a shared cache. Expiry at request start makes the range/resume consequence predictable using transfer knowledge. This section is longer and service-heavy, but each paragraph answers a new operational question; no unsupported leap found.

Large files: prior range lesson is correctly reused. “Untrusted active content” and “origin privileges” introduce a browser-security boundary only briefly; an HTTP-only reader may not know why serving uploaded HTML is dangerous. This is optional onward learning within this article, but a link explaining same-origin privileges would help the security recommendation become adaptable. The cache exercise has a clear prediction: origin green/cache blue until its model clock expires the entry.

## 8. Events and object-processing workflows

Opening understanding: a successful upload and a successful thumbnail are different commits. Revision, intended effect and already-completed identity are the information needed by a retry. I want to know what a worker records before acknowledging an event.

Event identity: v1 event/current v2 is the precise wrong-read failure. Transformation version makes duplicate suppression adaptable when the algorithm changes. At-least-once is explained immediately as duplicate delivery, so no queue background is assumed. Destination acronyms are offered as names, not prerequisites. Encoded plus/space is a practical parser footgun, with a source for exact rules.

Repeat effect: this answers acknowledgment order and survives both crash windows. The 412 paragraph refuses to equate occupied key with correct output; provenance plus checksum links back to transfer. Processed-marker-before/after is concrete enough to derive both loss and repetition. Figure is legible and condenses the output-before-ack crash. The account-charge boundary keeps the example from promising exactly-once side effects elsewhere.

Old/new: account-selected source supplies authority instead of completion order, and output-exists/pointer-updated are explicitly separate milestones. Hex f→0f before 10 is a traceable sequencer example; prior programming knowledge supplies hexadecimal ordering, but this audience can follow the numeric label example. Sandbox’s application sequence numbers are clearly separated from opaque version IDs.

Failures: bounded retries, repair identity and output-trigger loop all follow the thumbnail task. “Visibility timeout/redrive policy” are unexplained deployment terms, but they are explicitly outside the object-store model. Useful next investigation: how long-running thumbnail work coordinates queue visibility and worker failure. Not needed to follow the article’s guarantee.

Reconciliation: empty queue has three possible meanings, which is a useful operational test of the earlier durable-state story. Stable target and overlapping scan passes reuse listing limitations taught at the start. No missing step blocking the conclusion.

## 9. Versions, retention and recovery

Opening understanding: durability retains what was written, including mistakes; recovery requires selecting an earlier usable state. I expect the previously introduced version ID/delete marker to become concrete here. The opening avoids promising that versioning alone gives a complete backup.

History: ordinary/current vs version-specific GET is now concrete. Copying good v1 creates new v3, which explains restoring contents without rewriting history. Pausing normal writer supplies the concurrency assumption before adopting that recovery method. Explicit distinction between service IDs and application revisions resolves the question from the landing figure fully.

Delete: “return to before our recovery copy” explicitly resets state, preventing v3 confusion. Empty v2 vs bodyless marker d3 is clearly distinguished; removing d3 restores visibility but wrong contents. Figure is legible; newest/earlier/oldest are horizontally arranged rather than a literal vertical stack, but order labels and caption remove ambiguity. Prediction for exercise: removing marker reveals empty v2; deleting v1 removes the only good historical report in this setup.

Lifecycle: expiration-current vs noncurrent deletion has a clear recovery consequence. Detection/investigation window is a useful decision criterion; age alone is tied back to readers. Deny-does-not-stop-lifecycle is a surprising exception with a direct rule-review action, rather than a vague warning.

Lock: version protection vs current visibility extends the just-taught stack, so I can predict why a locked object can appear missing. Mode details are linked without inviting an incidental irreversible experiment. No missing explanatory step.

Replication: asynchronous copy is connected to manifest arriving before its files, a strong application-level failure example. The four-row delete table is dense but each row changes one operation/configuration; I can see why ordinary GET differs across buckets. Filter/V2 are service-specific configuration labels, supplied only to identify which documented rule applies. The KMS acceptance-vs-working-copy distinction is concrete. No figure needed beyond the existing manifest model, but the deletion table deserves slow reading.

Application recovery: database backup/photo mismatch makes “recover everything” specific. The next question is now access time: retained does not necessarily mean immediately readable. That is a natural bridge to performance and cost.

## 10. Performance, storage classes and cost

Opening understanding: useful data per request connects latency and cost, while stored total alone hides the workload. I can carry forward the million-readings example and expect the article to add request latency/concurrency and access-tier constraints.

Latency/throughput: 1/0.05 = 20 requests/s; ten independent workers → up to 200, with explicit illustrative assumptions. This is reproducible rather than a service promise. “Tail latency” is not defined, but the main bottleneck claim can be understood without it; a short “slowest requests” gloss would reduce vocabulary friction.

Layout: repeated example adds decimal units, 1 GB total and 1 MB selective overfetch, making the cost tradeoff calculable. The sandbox promise says counts first and editable rates, so I will not mistake it for a current AWS price calculator.

Retries: backoff and jitter are named without definition; I supplied “increasing waits plus randomness” from experience. This audience may know them, but the stated minimum does not establish that. Minor necessary vocabulary if implementing the recommendation; a parenthetical gloss would suffice. The distinction between request count and user operations is useful and ties retries into cost before discussing rates.

Bill: all four terms reproduce 2 + .8 + .2 + 2.7 = 5.7, and excluded charges are stated. Thirty complete versions rather than diffs corrects a likely storage-size assumption using recovery knowledge. No missing arithmetic steps.

Classes: archive restore answers the question carried from recovery, and the temporary-copy lifetime makes “restore” operational rather than magical. Intelligent-Tiering’s different return-to-Frequent-Access flow is a dense but explicit contrast. The 128 KB transition rule is applied to the already-familiar 1 KB vs 1 MB layout; useful concrete depth, with configuration age qualified. These are current service claims for the technical reviewer; I did not independently verify external docs in this uncued reading.

Measurement: cold vs cached path ties back to delivery, and correctness/recovery constrain performance tuning. “Latency percentiles” is another assumed metric vocabulary; optional gloss would help, but the article’s central counts and cost reasoning is complete.

## 11. Amazon S3 in practice

Opening understanding: earlier examples deliberately used one resource contract; other S3 bucket types need their own assumptions. I want a mapping from required operation to resource, followed by a way to diagnose failed requests across permissions and endpoints.

Bucket/Region/client gives cloud newcomers the placement and endpoint basics that earlier protocol articles did not need. Practice environments are clearly distinct. No new question.

Resource table answers the mapping question while warning against changing only destination names. Availability Zone is new cloud vocabulary; “single-zone placement” implies a failure boundary but has not explained geographic subdivision. Next section should supply the consequence. Table/vector terms are previews to the next lessons, not prerequisites for selecting ordinary object storage.

Directory buckets: the failure-domain consequence of one zone is given, though a novice definition of Availability Zone remains absent. The append-vs-multipart contrast is useful precisely because transfer was already learned. Rename token retry has a concrete same-request/different-destination example. This is a dense compatibility section, but its role is bounded: evaluate migration using the linked checklist rather than memorize all unsupported features.

Failed request: latest success vs pinned-version failure exposes a concrete missing action; retesting exact version avoids false verification. This is more useful than a generic permissions checklist. 403/404 absence difference is explicitly mapped to ListBucket, with no inference that all 403s mean absence. No missing step.

Observe outcomes reiterates tested object route rather than accepted settings, with concrete checks carried from prior lessons. CloudTrail is new but not required to follow the principle; configuration note prevents assuming default audit visibility.

Compatibility: failure-path contract tests are understandable after the actual examples. The article closes without asserting emulator results establish hosted guarantees. Necessary vocabulary opportunities remain small (zone, some acronyms); no central argument gap.

## 12. Tables on object storage

Opening understanding: Parquet describes columnar files, Iceberg describes membership/types/history, S3 Tables manages that format, and a query engine answers SQL. I supplied what “columnar” means from prior knowledge; the opening links an onward reading but does not derive it. For the current table-membership problem this is enough: the argument concerns which files, not how columns are encoded. I expect the simple manifest protocol to grow a metadata tree.

Files/snapshot: F1/F2/F3 appends make table membership concrete. The metadata → snapshot → manifest list → manifests → files chain creates the first substantial recall burden in the collection. The figure is legible but compresses catalog+metadata and snapshot+manifests into three panels, omitting a visible separate manifest-list node. I can reconstruct the chain from prose; a novice may retain “references, not listing” while losing which layer points to which. This is reduced-effort opportunity, not a blocker for the publication result. I would recheck by asking which change exposes F3 (catalog’s new metadata pointer, awaiting next section).

Commit: catalog metadata-location/version-token supplies the exact publication point I predicted. Maintenance F1+F2→F12 competing with append F3 is concrete useful depth; the table permits reconstructing C then D without keeping all values in memory. Explicit same-rows statement prevents treating compaction as new purchases. Reusing existing conditional-write knowledge makes the distinction between stale retry and logical retry accessible.

Metadata pruning: separate September/October example is explicitly reset, avoiding collision with yesterday/today F1/F2. Bounds excluding October gives a clear reason to skip; unfiltered scan keeps both. Schema/partition evolution is less developed, but offered as another format responsibility with onward reading rather than an implementation lesson.

Managed maintenance: stale four-day F3 vs three-day cleanup threshold applies the publication collector race to managed tables. “Marked noncurrent” here is a service maintenance state, not explicitly the ordinary version-stack meaning previously taught; context says unreadable, so I can follow the outcome, but this reuse could confuse a reader expecting version-specific GET to work. A brief distinction or exact state label would reduce that ambiguity. Raw path references escaping table retention is well motivated.

Engine/format compatibility: the concrete Athena/V3 incompatibility explains why service acceptance is insufficient. This is a time-bound claim for technical verification, not something my first reading can certify. The requested test set matches the operations the table is meant to support.

Useful abstraction: the final choice follows actual added capabilities (schema/snapshots/file selection) rather than brand hierarchy. Sandbox prediction is F12+F3 after reloading maintenance’s state; it is explicitly a simplified pointer model, not an Iceberg implementation.

## 13. Vector storage and retrieval with S3

Opening understanding: vector = numeric list, embedding model maps content into a space of related inputs, search compares query vector to stored ones. Specialized index API supplies retrieval, while application supplies model/content/auth decisions. This prepares a reader without assuming machine-learning background. I want a small numerical example that makes “near” concrete.

Index: dimensions and metric are fixed configuration; same dimension is insufficient across models. This explains a migration before recommending it. Stable passage/source revision carries familiar identity work into a new domain. “Coordinates” can be understood from numeric positions but will become concrete in the next section.

Small result answers “near” exactly: B’s .2² + (−.2)² = .08. I can derive filtered top two B,C and see why filtering global A,B returns only B. Recall@10 is defined with an eight-of-ten count; relevance is separately judged. The table is the right medium for four exact inputs; no diagram is needed to follow these coordinates. A live scatter plot would be optional exploration rather than required media.

Real query: key→source fetch is clear, and mode/queryMode are both recorded rather than silently assumed. “Approximate” is mentioned without explaining why approximation is used; the earlier exact baseline/recall gives a way to judge effects, but a sentence about searching a subset/index tradeoff would help a newcomer understand why fewer than exact top-K can occur. This is a small explanatory gap, not an inability to use the four-row exercise.

Metadata/auth: ordinary-vs-filtered query permission difference mirrors version-specific GET diagnosis, so the additional action feels motivated. Tenant filter is correctly treated as backend enforcement rather than magic index security. Source access recheck makes record IDs insufficient authority.

Source/index: r7/r8 race is a strong transfer of event-workflow ideas. Separate keys prevent overwrite but leave obsolete candidates; the text acknowledges this retrieval cost instead of presenting immutability as a free fix. The practical question of refilling after filtering below K is left as measurement/reconciliation, not a guaranteed full-K design. The article promises usable retrieval judgment, so that boundary is acceptable; if it promised a complete production query loop it would need refill/oversampling policy.

Choice: comparison includes synchronization and authorization workload, not only nearest-neighbor latency. PostgreSQL alternative is linked for deeper evaluation. No blocking gap; central filtered-ranking arithmetic and source-version discipline are fully supported.

## Sandbox: optional applied route

I reached the sandbox after the complete article route. HTML extraction accidentally included noscript fallback text in its opening; that was not default-visible reading, and I discarded it when inspecting the live page. I now use live rendered text/editor/state plus actual-size screenshots. The model explicitly says tab memory, no credentials and no AWS calls. Optional state/reference details are kept separate. Initial screenshot: request editor, run/next controls and state are legible; at 1280×1000 the full request/result requires scrolling. The instruction to predict before running is clear. The state inspector warns that it exposes knowledge unavailable to the caller after a lost reply.

First-object opening: empty versioned bucket, PUT notes/hello.txt with literal text and contentType. Prediction: one current object and one version; subsequent GET returns that text. This is fully supported by prior reading.

For the remaining sandbox pass I group each lesson’s live prompt/request/result sequence into one delivered chunk, after the article predictions above. This is less strict than section-by-section first exposure: results and subsequent prompts arrive together. It is an applied whole-route check, not an uncued novice test of each prompt. Predictions carried forward before reading logs: prefix selection follows characters; one stale conditional writer fails; lost reply leaves caller uncertain but revision inspection can confirm current success; missing multipart part rejects completion; abort removes unfinished work; single manifest prevents mixed generation only while old files remain; pending/ready transitions remain separate; duplicate events retain one effect and old work cannot advance current pointer; marker removal restores visibility rather than necessarily good contents; cache retains prior bytes until expiry; packing reduces requests but not payload; append rebases onto F12; filtering storage before ranking yields B,C. First-object PUT live result matched its prediction (22 bytes, one version).

Sandbox first-object/keys/conditions/lost-reply: all observed results match the earlier predictions. Saved response references are explained at first use, so $base.etag need not be inferred from code syntax. Failed stale PUT stays a learning outcome and permits advancing; r3 is reused only for a previously rejected publication, consistent with not reusing a published revision. Lost-reply result explicitly exposes the model’s chosen hidden-success schedule and then asks a caller-level question; it does not claim real uncertainty was simulated. No setup blocker.

Sandbox multipart/abort/publication: request outputs trace to accepted parts and saved tokens. Multipart’s final prompt offers a meaningful perturbation (omit part two yet succeed shorter), supported by the article. Abort keeps the separately created delete marker, which tests rather than merely repeats the distinction. Publication begins with mutable price/stock and preexisting A/current objects; their exact starting values are not narrated in the lesson opening, but the full-route reader has them from the article and can inspect state. A direct entrant would need to inspect individual objects before predicting step 1; this is a setup-visibility opportunity, not a failure on my complete route. The final failed A read correctly refuses silent B substitution.

Sandbox lifecycle/events/versions: all three execute their stated distinctions. Validation binds v1, later overwrite creates v2, published read still fetches v1. Events stops after output, then separately completes ledger/pointer before duplicate suppression; old sequence does not advance latest. Version recovery deliberately restores a new copy before permanently deleting the original, and final old-ID failure teaches identity versus bytes. One wording nuance: “Can versioning recreate explicitly deleted bytes?” at version step 9 could sound like the good contents are gone, but its result immediately clarifies restored copy remains; no actual misunderstanding persists.

Sandbox cache/cost/table/vector: observed outcomes match predictions. Expiry changes eligibility but does not refresh until the next read, an especially useful separation. Cost step 3 displays 33.00000000000001 GB and 3.0432000000000006 units; vector outputs display 0.07999999999999999 and 1.2800000000000002 while explanatory text says 0.08 and 1.28. I supplied floating-point representation knowledge from expertise to reconcile them. That is unnecessary burden in an object-storage lesson; round the teaching display or explicitly distinguish a raw numeric response. Table model uses September/October F1/F2 rather than the article’s yesterday purchases, a deliberate simplified dataset in the inspector but not stated in its opening. The file-set transition remains F12+F3, so the changed labels do not break my full-route understanding.

All fourteen guided lessons (78 steps total) completed from their default requests on the original build. This records execution and reader interpretation, not exhaustive model correctness, alternate-request behavior or service validation.

## Real-S3 worksheet

Opening understanding: this is real terminal/account work; only the CLI schema was checked, no hosted run is claimed. I will read and trace commands without using AWS credentials or making service calls. That means any setup concern below is unattempted execution, not an observed cloud failure.

Preparation: same terminal, empty directory, owned disposable bucket and enabled versioning are explicit prerequisites. The 15-minute first-enable wait is distinguished from object consistency. I can map profile/Region/bucket placeholders to the requested service resources, but a reader with only files/basic HTTP still needs outside instructions to install CLI, authenticate a profile and create the bucket; this is a prerequisite, not proof of a self-contained cloud onboarding guide. Python 3 first appears in the unique-prefix command without being named in environment prerequisites. On a machine with AWS CLI but no python3, this command is an avoidable setup stop; add Python 3 explicitly or choose a documented alternative. This is not an executed failure. lab_owner’s command substitution and expected-owner guard are understandable shell code to an application engineer; the UUID purpose is stated before use.

Create/read: reader can trace local settings-r1.json into S3, returned VersionId into lab_v1, returned ETag into lab_etag and body into observed-r1.json. “Verify lab_v1 is a real version ID” gives no command or observable criterion. I know to print/check nonempty and not None/null from expertise; a novice may not know what an opaque real ID looks like. Small practical completion gap: show printing it and identifying missing/failed output before proceeding. The stop-on-failure rule is plain but manual.

Stale writer: carrying the prior article/sandbox prediction, I expected the second PUT to return PreconditionFailed and current GET to remain r2. The worksheet’s stated expected results match. It distinguishes AccessDenied/connection failure from a demonstrated conflict and verifies both rejection and unchanged contents. This is useful scientific discipline for a service exercise. These predictions were informed by earlier lessons; I did not execute the cloud commands.

Hide/recover: predicted ordinary miss, exact-v1 success, then r2 visibility after marker removal; all stated outcomes match prior teaching. The failed-GET/local-file warning is practical and does not imply absence of file proves anything. One continuity nuance: here r1 and r2 are both valid settings, unlike recovery article’s good/empty reports; the worksheet does not call r2 erroneous, so “good historical content” is a conceptual reminder rather than a reason to roll back.

Cleanup: version listing before/after and exact version deletion match the two-write sequence, including extra versions from reruns. Unique run prefix bounds cleanup. Lost-terminal-state recovery is specified through listing rather than guessing. No incidental infrastructure remains in this worksheet’s claimed scope.

## Supplemental visual and reference checks

The landing product-record/image-reference/object panel is not a figure element; I inspected it separately at actual 640px content width after the full reading. It is legible and the columns keep database fields, address and bytes distinct. This visual confirmation is later inspection, not my opening text-only impression.

Opened sandbox “Request reference and model boundaries” after the guided pass (optional material). It explicitly states always-enabled versioning, content-derived SHA-256 model ETags, sequential requests, supported fields, saved-reply paths and omitted service behaviors. This supports adapting requests without implying AWS CLI syntax. No hidden prerequisite reversed my interpretation of a guided result. The initial page already states the core no-AWS/no-credentials distinction; the optional reference adds implementation boundaries rather than hiding the central caveat.

## First-reading judgment

The complete route delivers a coherent object-storage model. I can now explain why named bytes need application identity; why one-key consistency does not prevent lost updates or mixed datasets; how conditions and immutable generations form publication boundaries; why validation, references, caches, jobs and recovery all have to name the same intended revision; and why retained bytes alone do not establish recoverability. Those conclusions were taught through concrete examples rather than supplied solely from expertise. No unresolved question prevented following the main argument or deriving the default exercise outcomes.

The strongest passages should survive revision: product rename vs image identity; missing third multipart part yielding a valid short object; stale body with a fresh ETag; 12:00 plus five-minute cache plus ten-minute reader; conditional pending/abandoned transitions; stable thumbnail output before acknowledgment; marker removal exposing the wrong version; compaction F12 competing with append F3; and filtered B,C versus post-filtered B. They give readers facts they can use to predict a different schedule.

Learning continuity is unusually strong across the long route. Recurring concepts gain new consequences rather than merely repeating warnings. The articles repeatedly define their small example, show the boundary of a guarantee, then connect the next protocol. A reader entering a later page directly will occasionally need the linked prerequisite (ETag/history, version IDs, database transactions); this complete-route review does not certify every direct entry as self-contained.

Writing is generally patient and specific. Dense service-compatibility paragraphs appear mainly after the mechanism is established. A few unexplained terms assume more than basic HTTP: control plane, IAM/ACL, Availability Zone, backoff/jitter and latency percentiles. These did not obscure the main argument because nearby consequences gave enough context, but small glosses would reduce reliance on engineering experience. The Vectors approximate-search mention is the most substantive omitted mechanism: an exact baseline is explained, but why a managed search might differ is only named.

Media supports the prose without becoming a prerequisite. All nine focused-article figures and the landing panel were inspected at their rendered desktop width; labels and captions are readable. Most are three-column text diagrams, best at holding actors/states side by side. The Iceberg hierarchy is the one place where the representation compresses enough levels that prose still carries the structural burden. The sandbox adds genuinely useful changes in request order and state. Its raw JSON results are verbose but traceable; numerical floating-point artifacts add unrelated work. I did not do a mobile layout audit or certify every interactive alternate input.

## Repair ideas, separate from the observations

These are improvements in reading order, not a quota of defects. None is a claim of failed hosted execution.

1. **Small vocabulary glosses where first used.** Trigger: control plane, backoff/jitter, tail latency/percentiles, Availability Zone. Consequence: readers supply operating terminology from experience. Smallest change: familiar-language parenthetical at first consequential use. Recheck: reader can state what changes between bucket configuration and object data; why retries wait different lengths; what single-zone placement puts at risk. Priority: reduced effort.
2. **Make the Iceberg reference chain visible.** Trigger: catalog → metadata → snapshot → manifest list → manifests → data files, compressed into three panels. Consequence: a reader reconstructs the nesting while also tracking F1/F2/F3. Smallest change: retain all levels in a labelled chain or clarify the grouped panel labels. Recheck: point to what the catalog updates and which references a snapshot reader follows. Priority: reduced effort, not a correctness blocker.
3. **Distinguish S3 Tables cleanup’s noncurrent state from ordinary version history.** Trigger: a four-day file marked noncurrent becomes unreadable. Consequence: earlier ordinary-bucket teaching makes “noncurrent” sound version-readable. Smallest change: qualify the managed-table state or state why ordinary version-specific retrieval is not the promised repair. Recheck: increasing a future threshold does not restore already-unavailable prepared F3. Priority: necessary local clarity if the terminology is retained.
4. **Briefly motivate approximate vector search.** Trigger: “pre-filtered approximate search” after an exact four-row calculation. Consequence: readers understand recall calculation but may not know why expected nearest neighbors can be missed. Smallest change: one sentence explaining the scale/speed tradeoff and that the exact baseline measures missed neighbors. Recheck: high recall is distinct from answer relevance and from exact retrieval. Priority: local explanatory completion.
5. **Round numerical teaching results in the sandbox.** Trigger: 33.00000000000001, 3.0432000000000006, 0.07999999999999999, 1.2800000000000002. Consequence: readers must supply floating-point knowledge to reconcile text and result. Smallest change: display intentional precision, optionally retaining raw output as inspectable detail. Recheck: cost input gives 33 GB and 3.0432 units; B’s distance reads 0.08 and moved-query B reads 1.28. Priority: clearest practical reading repair.
6. **Expose seeded sandbox setups for direct entrants.** Trigger: publication begins with mutable keys and generation A; table lesson uses September/October data. Consequence: exact initial values require opening state rather than being available with the first prediction. Smallest change: concise starting-state sentence or visible starting-state table. Recheck: predict publication step 1 and identify F12’s rows before running. Priority: reduced effort/direct-entry support; the full article route supplies enough context.
7. **Name Python 3 and demonstrate version-ID checks in real practice.** Trigger: python3 first appears in UUID command; “verify lab_v1 is a real version ID” lacks a concrete check. Consequence: a reader with CLI alone can stop at a new dependency or continue with an unset/None value. Smallest change: prerequisite plus explicit output/check instructions for captured IDs. Recheck: reader can identify their prerequisite and stop before a dependent command if initial capture failed. Priority: practical completion.

Optional onward curiosity, not required expansion: same-origin privileges for uploaded active content; queue visibility/redrive settings for long-running workers; detailed checksum algorithm/mode selection; an exact engine-specific table client walkthrough; refill policy when obsolete vector matches leave fewer than K usable passages. The articles already link or bound these areas sufficiently for their stated purposes.

## Coverage and limits

Read landing, all thirteen focused articles, every guided sandbox lesson and the full real-service worksheet. Article delivery was section-granular after the landing, with notes saved before the next section. Sandbox lesson transcripts grouped prompt/result sequences after prior article predictions. Read optional sandbox reference after the guided route. No article source, earlier review, evidence record or author-intent document was used for the initial interpretation. No AWS request was executed. The browser’s original build was preserved across the review; findings here should remain as a record even if another reviewer has already repaired them.

## Focused reread of the repaired build

16 October 2026. After completing and saving the initial judgment above, I reread the coordinator’s final build at http://localhost:4330. This is an informed repair check, not a new blind first reading. The original observations remain unchanged. I read the named repairs in their surrounding sections through rendered browser text, inspected the live controls/results, and captured the Tables figure and cost response at 1280px and 390px viewport widths. I did not read implementation source, repeat the whole collection, execute AWS requests, build or change articles.

### Prose and explanation

The introduction now qualifies the GET outcome with later replacement or deletion. That brings its first request explanation into alignment with the later consistency lesson without adding a distracting concurrency detour. “Step through competing conditional writes” accurately describes the sandbox’s sequential schedules; it no longer suggests that the browser exercise runs a network race.

The new first-use glosses resolve the vocabulary friction recorded above. Consistency defines control plane through configuring the service. Access expands IAM and ACL and connects each to the policies or grants under discussion. Performance explains backoff as increasing waits, jitter as variation to avoid simultaneous retries, tail latency as the slowest waits, and p99 through the fraction of requests completed. S3 defines Availability Zone before the resource table uses it. These additions make the operational advice followable from the stated audience knowledge. They are short and sit where the term becomes useful; none interrupts an established example.

The Tables figure now names all six levels in order: catalog, table metadata file, embedded snapshot record, manifest-list file, manifest files and data files. It explicitly says the snapshot record is inside the metadata, avoiding a false impression that every level is a separate file. I can point to the catalog’s current metadata location, then follow snapshot B to F1/F2/F3 without reconstructing the missing manifest-list layer. The caption still separates merely uploading F3 from committing discoverability. The managed-cleanup paragraph now distinguishes S3 Tables’ noncurrent stage from ordinary S3 version history, states the documented Support-mediated recovery boundary, and preserves the four-day-file/three-day-threshold consequence. The initial ambiguity is resolved: a normal version-specific GET is not presented as a repair, and increasing the threshold does not restore the inaccessible file.

Vectors now introduces approximation before the exact-baseline/recall discussion: avoiding comparison with every vector can speed retrieval but miss exact neighbors. The following eight-of-ten example therefore measures a loss whose cause has been explained. This is sufficient motivation for this article; it need not teach a particular index algorithm. The distinction between neighbor recall and answer usefulness remains intact.

The real-S3 worksheet now names Python 3 up front, says to run blocks individually because two errors are deliberate, and specifies the required bucket/object actions. It prints captured version and marker IDs, identifies empty/None/null as invalid evidence after the initial write, and asks the reader to verify r2 success before attempting the stale write. Those steps make the intended schedule concrete. The lost-response paragraph directs uncertain writes to version listing and exact reads rather than blind repetition. run-info.txt records the nonsecret location fields; recovery explicitly restores the old run ID rather than generating a new one, and cleanup checks both versions and markers. I can trace the reset-terminal path back to the same prefix. These repairs close the earlier practical questions. The worksheet still requires an installed/authenticated CLI and configured bucket; it states those prerequisites and does not claim a hosted execution that was not performed.

### Live sandbox and rendering

Visible setup prose now supplies the seeded names in Keys, the initial settings and shared GET in Conditions, the mutable and generation-A values in Publication, the empty-cache/time-zero state in Cache, and the September/October F1/F2 identities in Table commit. The vector lesson shows all four records before the first prediction. These make the first request predictable on direct entry rather than requiring an inspector or memory of the article. The Lost reply lesson continues to state its deliberately applied-write/hidden-response schedule; its first GET reveals the premise before any decision requires its value. No concealed starting-state dependency remained in the inspected path.

Cost step 3 now shows a default-visible summary of 1,000 objects, 33,000 GETs, 3 stored GB, 33 transferred GB and 3.0432 illustrative units. The explanation decomposes the total as 0.06 storage + 0.0132 requests + 2.97 transfer. These numbers follow the inputs and agree with one another. A closed “Raw model response” retains the original floating-point values; I opened it and verified that distinction. The rounding statement is visible before opening the detail. The main reading no longer requires floating-point knowledge, while the model remains inspectable.

The vector summary shows all ranked candidates and whether each is returned: initially A=0 and B=0.08 returned, C=2 and D=4 not returned; storage filtering gives B=0.08 and C=2; moving the query to [0,1] gives C=0 and B=1.28. These results agree with the supplied coordinates and preceding derivation. The before/after representation makes the filtering decision visible without duplicating a large JSON array. Raw response remains optional.

On entering cost step 3, the control reads “Final step” and the response still asks for a prediction. Only after executing that request does it read “Lesson complete.” I observed this timing at both desktop and phone widths, and the vector route also completes after executing its third request. This check covers the expected guided sequence, not every malformed or edited final request.

The repaired Tables figure is legible at its rendered 640px desktop width and 358px phone width. Its vertical ordered chain fits both, with no missing layer or clipped label. The cost response also fits the phone’s 358px content area: labels, values, rounding note, optional detail control and explanation remain readable. Both pages’ document widths matched their 1280px/390px viewports; there was no page-level horizontal overflow in these checks. The phone figure is longer, but the top-to-bottom reading order is preserved without shrinking the type.

### Repair judgment

The focused repairs resolve the consequential comprehension and practical-completion findings from the first pass. The prose remains concrete and connected; added definitions and checks explain decisions rather than forming a detached checklist. Tables now carries the hierarchy visibly, and the numerical sandbox summaries remove an unrelated learning burden while preserving exact raw output as optional inspection. No new blocking issue appeared in the changed passages or inspected default interactions.

This judgment establishes explanatory consistency, the worked arithmetic, observed local interaction timing and the inspected responsive layout. It is not independent verification of current AWS service contracts or a successful hosted worksheet run; those remain the technical review’s and real-service execution’s separate evidence.
