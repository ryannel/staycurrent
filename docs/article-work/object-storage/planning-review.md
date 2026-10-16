# Object storage collection: independent planning review

## First reading: what the proposed journeys and tree promise

Recorded before reading the existing collection rationale or other reviews.

This promises a substantial application-engineering course in object storage, using
Amazon S3 throughout. The opening path moves from the shape of an object through
naming, reliable transfer and concurrent writes to a coherent dataset publication
protocol. A second path connects the store to an application through access,
delivery and asynchronous work. Recovery and cost offer entrances for readers who
already operate a system. The final S3 pages promise help selecting concrete AWS
resources and recognising when ordinary objects are insufficient.

The strongest promise is that a reader can follow a write beyond a successful PUT:
through a lost reply, a competing writer, publication, consumption, retention and
cleanup. The tree gives these decisions room. I expect a reader to leave able to
explain which state is authoritative and which operation can safely be retried.

Three boundaries are unclear on this first reading. The journey says “database
links”, but the tree gives database coordination a fragment of dataset publication;
an application that stores attachment metadata in SQL has no obvious entrance.
“Amazon S3 in practice” arrives after ten articles that already use S3, so it may
own essential setup or diagnosis too late. The final article joins tables, vectors
and directory buckets, although those answer substantially different questions.
The browser practice sounds plausible, but its promised learning tasks are still
unassigned to individual articles.

## Judgment after reading the site and depth reference

The proposed scope can meet the PostgreSQL branch's depth without copying its
shape. S3 is already the implementation used across the collection; it does not
need a parallel branch that repeats each family topic. Depth should come from
following the documented API, client and application state far enough to derive
outcomes. The plan should not promise to reconstruct undocumented service internals.

The existing introduction already teaches manifest publication and competing
writers in some detail. Those are useful seeds for the focused articles. Its new
opening should first establish buckets, objects, keys, metadata and requests, then
show the principal application arrangements and their limits. A reader should be
able to choose an onward path before committing to the full export protocol.
Retain a short publication example to make the missing multi-object transaction
concrete; give the complete protocol and its failures to the publication article.

I recommend the following changes before distributing authoring work.

### 1. Give the database-and-object lifecycle one clear owner

Add a focused article, provisionally **Objects and database records**, after private
uploads and before events. Its question is how an application publishes, replaces
and removes an attachment while SQL metadata and stored bytes can succeed or fail
separately. Follow a record through pending, uploaded, checked and usable states;
then fail the database update, retry completion, replace the attachment and reconcile
abandoned uploads. Show the application deciding which state permits a read.

This is a common application entrance in its own right. It should not require the
reader to translate a multi-file catalogue manifest into an upload form. Keep
permissions and the browser/server request sequence in Access; durable event work
and duplicate processing in Events; coherent generations and reader lifetimes in
Publishing. Each can link to the lifecycle article when it needs that shared state.

### 2. Separate the advanced questions that need different reasoning

Give **Tables on object storage** and **Vector storage and retrieval** distinct
articles. The first should derive what files, table metadata, a commit and a catalog
contribute, then explain the bounded S3 Tables decision. The second should follow
one vector write and filtered retrieval, including what the application must supply
and what the service returns, before discussing its fit. Existing relational search
reading can own detailed retrieval-quality teaching. The object-storage piece still
needs enough local orientation for a reader arriving directly.

Move directory buckets into concrete S3 resource choices and the performance
investigation. They change the storage resource decision; they are not another
higher-level data model alongside tables and vectors. Research must determine the
current guarantees and restrictions before the author commits to examples.

These two changes make fourteen articles from the proposed twelve. The number is
incidental: two presently compressed investigations and one missing application
journey acquire a clear home. No additional vendor branches are needed.

### 3. Make the S3 entrance available before the sequential path ends

Keep **Amazon S3 in practice** as a direct entrance from the collection map. Give it
a bounded purpose: choose the resource for a stated workload, identify the caller
and request destination, run a disposable exercise, and diagnose a failed request
from available evidence. Link back to the relevant mechanism rather than explaining
all of them again. Readers following the ordinary path should receive the minimum
S3 orientation locally in the first article and the first request example.

Access should explicitly own encryption and key-service dependencies, alongside
permissions and signed requests. Use one worked access failure to show how a caller
can be permitted by one part of the system and still fail elsewhere. Keep account
and network topology detail outside the foundation. This is a scope clarification,
not a request for another article.

Recovery should own the difference between retaining an old version, obtaining a
usable copy and recovering the application references that select it. Use a mistaken
delete or overwrite followed by a recovery attempt, then change a cleanup or
retention condition and derive what remains possible. Performance and cost can
reference these lifecycle choices for their charges without becoming a second
recovery article.

### 4. Assign browser practice to decisions before building the interface

The proposed browser model is feasible if it owns a small, documented state model.
It cannot provide the same evidence as an actual service engine. Give each lesson a
starting state, editable action, visible resulting state, changed condition and
specific omission. A useful first contract is:

| Article or path | What the learner should change and observe | Evidence boundary |
| --- | --- | --- |
| Introduction and layout | Store bytes and metadata, fetch by key, list a prefix across pages, and change a naming choice | Defined subset of object and listing behaviour |
| Transfers | Retry a failed part, lose the completion response, inspect state and clean up abandoned work | Explicit failure controls; no claim about network speed |
| Concurrent writers | Run two clients from the same observed state, accept one write and handle the rejected or uncertain outcome | Deterministic operation ordering and named conditional semantics |
| Dataset publication | Stop a publisher before and after the manifest change, keep an old reader alive, then attempt cleanup | Application protocol over the supported object operations |
| Objects and database records | Fail one side of an upload's completion, retry it and reconcile the orphan | Clearly labelled application-state model; no simulated SQL engine claim |
| Recovery | Create versions, delete, inspect retained state, then alter retention or cleanup and attempt recovery | Supported version transitions are visible; replication remains a separate model |
| Events | Deliver the same work twice and out of order, then reconcile missing work | Explicit event schedule; no claim to reproduce an AWS event service |
| Cost and throughput | Change object size, request count, retries and retained versions and inspect the arithmetic | Inputs and assumptions are visible; no inferred service benchmark |

Access, delivery and specialised-service pieces can use diagrams or narrowly named
models when those expose a decision better than executable requests. They do not
all need invented endpoints in the bucket sandbox. In particular, a permission
exercise must not look as though the browser has validated a real IAM policy.

The editable request surface needs a declared syntax and operation inventory.
Choose those before lesson writing: a browser command language presented as a
subset is fine; commands that look like full AWS CLI or SDK calls invite a broader
promise. A free exploration mode should preserve state across operations, allow
reset, and make unsupported operations intelligible. Guided lessons should use the
same underlying state transitions so that leaving the prescribed sequence still
teaches something coherent.

The real-service worksheet should be directly reachable from the sandbox and S3
entrance. It should name the environment, what execution actually verified, what
resources the learner creates, and how those resources are inspected and cleaned
up. The current promise to report unexecuted AWS steps honestly is sound.

## Ownership and depth checkpoint

Before writing the full batch, give every article a compact brief containing its
reader decision, central worked sequence, one changed condition that tests the
explanation, and the lesson or diagram that makes the state inspectable. This is
the missing link between the useful tree and the user's requested depth. A list of
features cannot establish that an article has taught its mechanisms.

Use the revised introduction, Transfers and Concurrent writers as the first depth
checkpoint while continuing research for the whole collection. Together they test
whether the prose establishes the interface, makes the client visible, and follows
success, failure and uncertainty precisely. Publishing then tests whether those
parts support a more demanding application protocol. This checkpoint controls
quality within the full commission; it should not reduce the commission to a small
initial batch.

The collection map should expose four useful entrances: learning the interface;
building uploads and application workflows; operating, recovering and paying for
the store; and choosing S3 resources or richer data services. Short local orientation
lets a practitioner start with a failure or a design decision. Sequential reading
remains available without turning the article order into a prerequisite chain.

## Scope of this review

Reviewed the proposed plan, the existing object-storage introduction, site direction,
coverage structure and PostgreSQL rebuild commission. The first impression above
was recorded before those contextual readings. No old object-storage planning
review or other reviewer's conclusions informed it. This is an editorial and
learning-design review; current S3 capability claims and model semantics still need
the planned primary-source research. No articles or application code were changed.

## Coordinator response

The coordinator accepted a dedicated **Objects and database records** article and
separate **S3 Tables** and **S3 Vectors** articles. **Amazon S3 in practice** remains
later in the main order but becomes a direct entrance from the introduction.
Directory buckets belong in that resource-selection article, with current append,
rename and scope restrictions researched explicitly. Advanced-service research is
recorded separately in `advanced-evidence.md` before article work begins.
