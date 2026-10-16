const step = (title, question, request, explanation, status = 200) => ({
  title,
  question,
  request,
  explanation,
  status,
});
const put = (key, body, extra = {}) => ({ op: "PUT", key, body, ...extra });
const get = (key, extra = {}) => ({ op: "GET", key, ...extra });
const link = (slug) => `/learn/databases/object-storage/${slug}/`;
export const lessons = [
  {
    id: "first-object",
    title: "Store and fetch an object",
    group: "Start here",
    article: "/learn/databases/object-storage/",
    description:
      "Start with an empty bucket. Store text bytes, read them back, then replace the body and inspect its retained versions.",
    scope:
      "One small versioned bucket. Text bodies stand in for files; metadata is stored, not interpreted.",
    seed: [],
    steps: [
      step(
        "Upload the first object",
        "What identifies the object, and what will a GET return?",
        put("notes/hello.txt", "Hello, object storage.", {
          metadata: { contentType: "text/plain" },
        }),
        "The key names the object. Its body is stored as text; the result reports a model version and content-derived model ETag.",
      ),
      step(
        "Read the bytes",
        "Will GET return the body or just its name?",
        get("notes/hello.txt"),
        "GET returns the current body and metadata. Open this key in the bucket inspector to compare the stored revision.",
      ),
      step(
        "Replace the object",
        "Does replacing a key create a second current key?",
        put("notes/hello.txt", "A replacement body."),
        "The current body changes under the same key. This model always retains earlier versions, as an enabled-versioning example.",
      ),
      step(
        "List the names",
        "How many current keys exist?",
        { op: "LIST" },
        "There is one current key, although its version history contains two bodies.",
      ),
    ],
  },
  {
    id: "keys",
    title: "Names and prefixes",
    group: "Start here",
    article: link("keys-and-layout"),
    description:
      "The bucket starts with photos/mug.jpg, photos/bowl.jpg and photographs/old.jpg. Change the prefix to see which names it selects.",
    scope:
      "A small complete listing. No delimiter grouping or pagination; real large listings require continuation tokens.",
    seed: [
      put("photos/mug.jpg", "mug"),
      put("photos/bowl.jpg", "bowl"),
      put("photographs/old.jpg", "old"),
    ],
    steps: [
      step(
        "List a precise prefix",
        "Which two names begin with photos/?",
        { op: "LIST", prefix: "photos/" },
        "Only the mug and bowl match. The slash is a character in the prefix.",
      ),
      step(
        "Broaden the prefix",
        "Does photo also select photographs/?",
        { op: "LIST", prefix: "photo" },
        "All three names match. Prefix matching does not understand a folder boundary you omitted.",
      ),
      step(
        "Add a new name",
        "Does this create a separately stored directory object?",
        put("photos/new/front.jpg", "front view"),
        "The new key exists. No directory object is created by this model.",
      ),
      step(
        "List the nested prefix",
        "Which key begins with photos/new/?",
        { op: "LIST", prefix: "photos/new/" },
        "The exact beginning selects the new image. The body is not searched.",
      ),
    ],
  },
  {
    id: "conditions",
    title: "Two writers, one old value",
    group: "Writes and transfers",
    article: link("consistency"),
    description:
      "settings.json starts with limit 10, colour blue and revision r1. Two writers read that state; one changes the limit and the other changes the colour.",
    scope:
      "One shared GET represents both writers reading the same initial state. Requests then run in a chosen order; the model does not create concurrent network requests.",
    seed: [
      put("settings.json", '{"limit":10,"colour":"blue","revision":"r1"}'),
    ],
    steps: [
      step(
        "Both writers read",
        "Which response field will both writers send in their If-Match condition?",
        get("settings.json", { saveAs: "base" }),
        "The response is saved as base. Later requests can use $base.etag. It remains the old token after another write.",
      ),
      step(
        "Writer A changes the limit",
        "Will the saved token still match?",
        put("settings.json", '{"limit":20,"colour":"blue","revision":"r2"}', {
          ifMatch: "$base.etag",
        }),
        "A succeeds because its premise was current.",
      ),
      step(
        "Writer B uses the old premise",
        "Will B restore limit 10?",
        put("settings.json", '{"limit":10,"colour":"green","revision":"r3"}', {
          ifMatch: "$base.etag",
        }),
        "The 412 leaves A’s limit 20 unchanged. Try removing ifMatch from B’s request: its old body can restore limit 10 while setting green. Restart afterwards to follow the guided sequence.",
        412,
      ),
      step(
        "B reads again",
        "Which limit must B now preserve?",
        get("settings.json", { saveAs: "fresh" }),
        "The current limit is 20. B must reconsider its body, not merely change the token.",
      ),
      step(
        "B merges the independent change",
        "Can green now coexist with limit 20?",
        put("settings.json", '{"limit":20,"colour":"green","revision":"r3"}', {
          ifMatch: "$fresh.etag",
        }),
        "The new body preserves A’s change and conditionally adds B’s.",
      ),
      step(
        "Attempt create-only",
        "Can If-None-Match create over a current object?",
        put("settings.json", "{}", { ifNoneMatch: "*" }),
        "Create-only rejects the occupied key. Older versions alone would not reserve a name hidden by a delete marker.",
        412,
      ),
    ],
  },
  {
    id: "lost-reply",
    title: "The write whose reply disappeared",
    group: "Writes and transfers",
    article: link("consistency"),
    description:
      "Apply a write, hide the response, and reconcile its revision instead of overwriting blindly.",
    scope:
      "The failure switch deliberately applies the write then hides its response. Real lost replies can also represent unapplied writes.",
    seed: [put("current.json", '{"revision":"r1"}')],
    steps: [
      step(
        "Read the premise",
        "What token protects our replacement?",
        get("current.json", { saveAs: "base" }),
        "Keep this response for the original conditional request.",
      ),
      step(
        "Lose the success reply",
        "Can the caller know whether r2 was published?",
        put("current.json", '{"revision":"r2"}', {
          ifMatch: "$base.etag",
          loseReply: true,
        }),
        "The model inspector can show the write, but the caller received no result. A real caller must reconcile.",
        "unknown",
      ),
      step(
        "Retry with the original premise",
        "Does a 412 prove that the first attempt failed?",
        put("current.json", '{"revision":"r2"}', { ifMatch: "$base.etag" }),
        "No. In this schedule the first attempt succeeded, so its old token no longer matches.",
        412,
      ),
      step(
        "Read the published revision",
        "Which revision is current now?",
        get("current.json"),
        "r2 is current, resolving this schedule. A later writer could obscure an earlier publication; that needs history if the application must distinguish it.",
      ),
    ],
  },
  {
    id: "multipart",
    title: "Complete an upload from parts",
    group: "Writes and transfers",
    article: link("transfers"),
    description:
      "Inspect unfinished parts, fail a completion, then repair it and read the assembled bytes.",
    scope:
      "Tiny text parts deliberately omit S3 minimum sizes, checksums, quotas and in-flight network races.",
    seed: [],
    steps: [
      step(
        "Initiate",
        "Is a readable object created yet?",
        { op: "CREATE_UPLOAD", key: "recording.txt", saveAs: "upload" },
        "An upload ID identifies unfinished work; the current-object list is still empty.",
      ),
      step(
        "Upload part one",
        "Where will these bytes appear?",
        {
          op: "UPLOAD_PART",
          upload: "$upload.upload",
          part: 1,
          body: "First half. ",
          saveAs: "one",
        },
        "They appear under unfinished uploads, not as a current object.",
      ),
      step(
        "Read too early",
        "Can an ordinary GET see that part?",
        get("recording.txt"),
        "The complete object does not yet exist.",
        404,
      ),
      step(
        "Complete with a missing part",
        "Can completion succeed when its list names a part that has not been uploaded?",
        {
          op: "COMPLETE_UPLOAD",
          upload: "$upload.upload",
          parts: [
            { part: 1, etag: "$one.etag" },
            { part: 2, etag: "missing" },
          ],
        },
        "Completion rejects the missing selected part. The accepted first part remains available.",
        400,
      ),
      step(
        "Supply part two",
        "Can we repair the upload without resending part one?",
        {
          op: "UPLOAD_PART",
          upload: "$upload.upload",
          part: 2,
          body: "Second half.",
          saveAs: "two",
        },
        "Both selected parts are now available. The uploader has saved each returned ETag for its completion request.",
      ),
      step(
        "Complete the ordered list",
        "Which byte order will the object use?",
        {
          op: "COMPLETE_UPLOAD",
          upload: "$upload.upload",
          parts: [
            { part: 1, etag: "$one.etag" },
            { part: 2, etag: "$two.etag" },
          ],
        },
        "The object concatenates the listed parts in part-number order. The unfinished upload is removed.",
      ),
      step(
        "Read the completed object",
        "Do the bytes match both intended halves?",
        get("recording.txt"),
        "The body contains both halves. Try resetting and omitting part two from the completion list: a successful shorter object is possible, so the client must verify its intended length.",
      ),
    ],
  },
  {
    id: "abort",
    title: "Remove an abandoned upload",
    group: "Writes and transfers",
    article: link("transfers"),
    description:
      "Distinguish deleting a key from aborting unfinished transfer work.",
    scope:
      "No real storage bill or requests in flight. Observe the explicit unfinished-upload state.",
    seed: [],
    steps: [
      step(
        "Start unfinished work",
        "Which identifier will cleanup need?",
        { op: "CREATE_UPLOAD", key: "abandoned.txt", saveAs: "upload" },
        "Keep the upload ID; deleting the key is a different operation.",
      ),
      step(
        "Store a part",
        "Are these bytes visible as an ordinary object?",
        {
          op: "UPLOAD_PART",
          upload: "$upload.upload",
          part: 1,
          body: "Unfinished bytes",
        },
        "The part remains in the unfinished upload.",
      ),
      step(
        "Delete the key",
        "Does a delete marker remove the upload?",
        { op: "DELETE", key: "abandoned.txt" },
        "No. The versioned key gets a marker while unfinished parts remain.",
        204,
      ),
      step(
        "Abort the upload",
        "Which state disappears now?",
        { op: "ABORT_UPLOAD", upload: "$upload.upload" },
        "The unfinished upload and parts are removed. The separate delete marker remains.",
        204,
      ),
    ],
  },
  {
    id: "publication",
    title: "Publish a complete generation",
    group: "Application protocols",
    article: link("publication"),
    description:
      "The mutable price and stock start at 20 and four. Generation A contains the same pair, selected by current.json. We want generation B to contain 24 and eight.",
    scope:
      "The reader follows explicit keys from a saved manifest. The model does not enforce immutability or perform garbage collection.",
    seed: [
      put("prices.json", "20"),
      put("stock.json", "4"),
      put("A/prices.json", "20"),
      put("A/stock.json", "4"),
      put(
        "current.json",
        '{"generation":"A","files":["A/prices.json","A/stock.json"]}',
      ),
    ],
    steps: [
      step(
        "Replace only prices",
        "What pair exists before stock is changed?",
        put("prices.json", "24"),
        "The mutable price is now 24; mutable stock is still four.",
      ),
      step(
        "Read stock",
        "Does a current origin read prevent a mixed export?",
        get("stock.json"),
        "It returns four. Pairing it with the new price is inconsistent at the application level.",
      ),
      step(
        "Save reader A’s manifest",
        "Which names must this reader keep using?",
        get("current.json", { saveAs: "readerA" }),
        "This reader holds A/prices.json and A/stock.json for its entire read.",
      ),
      step(
        "Upload B prices",
        "Will a reader following current.json discover B yet?",
        put("B/prices.json", "24", { ifNoneMatch: "*" }),
        "No. current.json still names A.",
      ),
      step(
        "Upload B stock",
        "What must exist before the manifest changes?",
        put("B/stock.json", "8", { ifNoneMatch: "*" }),
        "Both B files now exist. Publication can select the complete pair.",
      ),
      step(
        "Publish B",
        "Will reader A’s saved response change?",
        put(
          "current.json",
          '{"generation":"B","files":["B/prices.json","B/stock.json"]}',
          { ifMatch: "$readerA.etag" },
        ),
        "New readers discover B. readerA still holds its original response in saved variables.",
      ),
      step(
        "Finish the older reader",
        "Can it still obtain A’s stock?",
        get("A/stock.json"),
        "Yes. Retaining A lets a reader finish after B is published.",
      ),
      step(
        "Delete an old file too soon",
        "Will a reader still holding A’s manifest be able to finish?",
        { op: "DELETE", key: "A/stock.json" },
        "The delete marker hides A/stock.json from GET without a version ID. The saved manifest names only keys, so retaining older versions alone does not keep this reader working.",
        204,
      ),
      step(
        "Retry the older read",
        "Can the reader safely substitute B’s stock?",
        get("A/stock.json"),
        "It fails. Substituting B would silently mix generations; report an incomplete read or restart under an explicit policy.",
        404,
      ),
    ],
  },
  {
    id: "lifecycle",
    title: "Publish bytes through an application record",
    group: "Application protocols",
    article: link("database-records"),
    description:
      "Keep a pending record unpublished, validate an exact version, then survive a later overwrite.",
    scope:
      "The model tracks one record and binds it to an exact object version. It omits account ownership, competing account updates, SQL transactions and real content validation.",
    seed: [],
    steps: [
      step(
        "Create a pending record",
        "Does a row imply bytes exist?",
        { op: "APP_CREATE", id: "i83", key: "uploads/i83.txt" },
        "The pending record exists; no object does.",
        201,
      ),
      step(
        "Try to publish early",
        "Can a record become ready before its bytes exist and are verified?",
        { op: "APP_PUBLISH", id: "i83" },
        "Publication is refused until an exact version has been verified.",
        409,
      ),
      step(
        "Upload the bytes",
        "Does upload alone make the record ready?",
        put("uploads/i83.txt", "Approved image stand-in"),
        "The object exists but the record remains pending.",
      ),
      step(
        "Validate the stored revision",
        "Which version does the record bind to?",
        { op: "APP_VALIDATE", id: "i83", saveAs: "verified" },
        "The model records the current version and marks the record verified. This command only checks that bytes exist; a real worker must inspect their content before approving them.",
      ),
      step(
        "Overwrite the staging key",
        "Does this change the verified version?",
        put("uploads/i83.txt", "Unvalidated replacement"),
        "The current key changes. The earlier version is retained separately.",
      ),
      step(
        "Publish the verified identity",
        "Which bytes are eligible for delivery?",
        { op: "APP_PUBLISH", id: "i83", saveAs: "published" },
        "The ready record names the verified version, not whatever is current at the staging key.",
      ),
      step(
        "Read through the published identity",
        "Do we receive the unvalidated replacement?",
        get("uploads/i83.txt", { version: "$published.record.version" }),
        "The version-specific read returns the approved stand-in. A real design must also enforce permissions and retention.",
      ),
    ],
  },
  {
    id: "versions",
    title: "Recover the right version",
    group: "Operating the store",
    article: link("recovery"),
    description:
      "Distinguish a delete marker, an empty replacement and a retained good version.",
    scope:
      "Versioning is always enabled and no other writer changes the report during recovery. Object Lock, lifecycle scheduling, archive tiers and replication are outside this model.",
    seed: [],
    steps: [
      step(
        "Store the good report",
        "Which identity will recover these bytes later?",
        put("report.csv", "item,total\nmug,20", { saveAs: "good" }),
        "Save the returned version ID.",
      ),
      step(
        "Overwrite accidentally",
        "Does the earlier body disappear?",
        put("report.csv", "", { saveAs: "bad" }),
        "The empty body is current, but the good earlier version remains.",
      ),
      step(
        "Delete the key",
        "Is deletion the same as an empty object?",
        { op: "DELETE", key: "report.csv", saveAs: "marker" },
        "A marker hides the key from ordinary GET.",
        204,
      ),
      step(
        "Read the current key",
        "Which response does the marker cause?",
        get("report.csv"),
        "No current readable body is returned.",
        404,
      ),
      step(
        "Read the good version",
        "Can retained history still be read?",
        get("report.csv", { version: "$good.version" }),
        "The earlier good bytes are still available.",
      ),
      step(
        "Remove the marker",
        "Which version becomes current?",
        { op: "DELETE_VERSION", key: "report.csv", version: "$marker.version" },
        "The preceding version becomes visible; it is the accidental empty report.",
        204,
      ),
      step(
        "Check the visible body",
        "Did visibility alone recover the good content?",
        get("report.csv"),
        "No. The current body is empty. Select the good version deliberately.",
      ),
      step(
        "Restore verified content",
        "Can a new version publish the good body?",
        put("report.csv", "item,total\nmug,20"),
        "This PUT resends the good text we inspected earlier, creating a new current version. A real recovery can copy the verified source version; keep other writers paused or coordinate publication.",
      ),
      step(
        "Permanently remove the original",
        "Can versioning recreate explicitly deleted bytes?",
        { op: "DELETE_VERSION", key: "report.csv", version: "$good.version" },
        "The original version is removed. The new restored copy remains a separate version.",
        204,
      ),
      step(
        "Request the removed identity",
        "Does an old version ID still work?",
        get("report.csv", { version: "$good.version" }),
        "No. A retained restored copy does not make the deleted version ID exist again.",
        404,
      ),
    ],
  },
  {
    id: "cache",
    title: "Find which copy answered",
    group: "Operating the store",
    article: link("delivery"),
    description:
      "photo.txt starts with blue mug at model time zero, and the cache is empty. Replace the origin with green mug and compare the two read paths.",
    scope:
      "One deterministic cache with a ten-second TTL; no browser or CloudFront implementation is reproduced.",
    seed: [put("photo.txt", "blue mug")],
    steps: [
      step(
        "Fill the cache",
        "Which layer supplies the first response?",
        { op: "CACHE_GET", key: "photo.txt", ttl: 10 },
        "The cache misses and reads the origin model. It keeps the response until model time ten.",
      ),
      step(
        "Change the origin",
        "Does this push into the cache?",
        put("photo.txt", "green mug"),
        "Only origin state changes.",
      ),
      step(
        "Read the origin",
        "What is current in object storage?",
        get("photo.txt"),
        "The origin returns green.",
      ),
      step(
        "Read through the cache",
        "Can blue still be a valid cached response?",
        { op: "CACHE_GET", key: "photo.txt", ttl: 10 },
        "The response says servedBy: model cache and still contains blue. Its ten-second lifetime has not expired; the previous origin GET already showed green.",
      ),
      step(
        "Advance the clock",
        "Will the next request need fresh origin data?",
        { op: "TICK", seconds: 11 },
        "The stored cache entry is now expired, but no refresh occurs until a request.",
      ),
      step(
        "Read after expiry",
        "Which bytes are fetched now?",
        { op: "CACHE_GET", key: "photo.txt", ttl: 10 },
        "The cache refetches green from origin. Try using separate revision keys instead of overwriting one name.",
      ),
    ],
  },
  {
    id: "events",
    title: "Repeat and reorder processing work",
    group: "Application protocols",
    article: link("events"),
    description:
      "Revision two is newer than revision one. Deliver two first, stop its worker after writing the output, then retry and deliver older work. Inspect the application state as well as each response.",
    scope:
      "You supply the worker’s output bytes and application sequence number for one fixed transformation. No source fetch, image processing, SQS, Lambda or S3 sequencer is implemented.",
    seed: [],
    steps: [
      step(
        "Newer work stores its output",
        "Does a stored output prove the job completed?",
        {
          op: "PROCESS_EVENT",
          key: "image83",
          sequence: 2,
          body: "thumbnail revision 2",
          stopAfterOutput: true,
        },
        "The output exists, but the job ledger and latest pointer have not been updated.",
        202,
      ),
      step(
        "Retry the unfinished job",
        "Can the worker reuse the stable output identity?",
        {
          op: "PROCESS_EVENT",
          key: "image83",
          sequence: 2,
          body: "thumbnail revision 2",
        },
        "The same output is reconciled and revision two becomes latest.",
      ),
      step(
        "Older work finishes late",
        "Should completion time decide what is latest?",
        {
          op: "PROCESS_EVENT",
          key: "image83",
          sequence: 1,
          body: "thumbnail revision 1",
        },
        "Revision one is stored, but the latest pointer remains at two.",
      ),
      step(
        "Deliver two again",
        "Will duplicate delivery create another effect?",
        {
          op: "PROCESS_EVENT",
          key: "image83",
          sequence: 2,
          body: "thumbnail revision 2",
        },
        "The completed identity is recognised without another effect. Now change body while keeping key and sequence: conflicting bytes for the same job must be rejected. Delivery itself is still allowed to repeat.",
      ),
    ],
  },
  {
    id: "cost",
    title: "Count the work before pricing it",
    group: "Operating the store",
    article: link("performance-and-cost"),
    description:
      "Change object packing and retries while keeping the records visible in the arithmetic.",
    scope:
      "Full-scan arithmetic in decimal GB. Supplied prices are illustrative units, not current AWS rates or a full bill.",
    seed: [],
    steps: [
      step(
        "One record per object",
        "How many GETs does one complete scan need?",
        {
          op: "COST",
          records: 1000000,
          bytesPerRecord: 1000,
          recordsPerObject: 1,
          scans: 1,
          copies: 1,
        },
        "One million objects require one million whole-object GETs; payload is one decimal GB.",
      ),
      step(
        "Pack 1,000 records together",
        "Do bytes shrink when request count falls?",
        {
          op: "COST",
          records: 1000000,
          bytesPerRecord: 1000,
          recordsPerObject: 1000,
          scans: 1,
          copies: 1,
        },
        "GETs fall to 1,000 while payload remains one GB. A point lookup has a different tradeoff.",
      ),
      step(
        "Repeat scans and retain copies",
        "What changes storage versus transfer?",
        {
          op: "COST",
          records: 1000000,
          bytesPerRecord: 1000,
          recordsPerObject: 1000,
          scans: 30,
          copies: 3,
          retryFraction: 0.1,
          rates: {
            getPer1000: 0.0004,
            storagePerGBMonth: 0.02,
            transferPerGB: 0.09,
          },
        },
        "Three full-month copies retain three GB. Thirty scans plus ten percent full-request retries make 33,000 GETs and transfer 33 GB. At the supplied rates, those terms cost 0.06, 0.0132 and 2.97 units. Change one input and predict which term changes; omitted charges still matter.",
      ),
    ],
  },
  {
    id: "table-commit",
    title: "Append while compaction commits",
    group: "Beyond ordinary objects",
    article: link("tables"),
    description:
      "table.json starts at snapshot A, selecting F1 (September rows) and F2 (October rows). An append prepares F3 while compaction combines the existing rows into F12.",
    scope:
      "A simplified file-list protocol over the object model. It does not implement Iceberg metadata, S3 Tables or query execution.",
    seed: [
      put("F1", "September rows"),
      put("F2", "October rows"),
      put("table.json", '{"snapshot":"A","files":["F1","F2"]}'),
    ],
    steps: [
      step(
        "Both jobs start from A",
        "Which file set do both jobs know?",
        get("table.json", { saveAs: "base" }),
        "Both see F1 and F2 and the same pointer token.",
      ),
      step(
        "Prepare an append",
        "Does storing F3 commit it to the table?",
        put("F3", "New rows"),
        "F3 exists, but table.json still selects A and its F1/F2 files. A reader following that pointer does not discover F3 by listing the bucket.",
      ),
      step(
        "Prepare compaction",
        "Does F12 add new logical rows?",
        put("F12", "September rows + October rows"),
        "F12 contains the rows already in F1 and F2, without F3’s new rows. Merely uploading it has not changed the pointer; F1/F2 are still selected.",
      ),
      step(
        "Compaction commits C",
        "What does the current snapshot select?",
        put("table.json", '{"snapshot":"C","files":["F12"]}', {
          ifMatch: "$base.etag",
        }),
        "C selects F12. Older files remain for readers that still need them.",
      ),
      step(
        "The append tries its stale pointer",
        "Could this discard the winning layout?",
        put("table.json", '{"snapshot":"B","files":["F1","F2","F3"]}', {
          ifMatch: "$base.etag",
        }),
        "The condition fails. F3 remains prepared but unpublished.",
        412,
      ),
      step(
        "Reload the current state",
        "What must the append preserve now?",
        get("table.json", { saveAs: "fresh" }),
        "The writer sees C and can validate whether its independent append is reusable.",
      ),
      step(
        "Commit the rebased append",
        "Which files preserve both operations?",
        put("table.json", '{"snapshot":"D","files":["F12","F3"]}', {
          ifMatch: "$fresh.etag",
        }),
        "D selects F12 and F3, preserving compaction and the append. Adding F1/F2 as well would count the old rows twice. The model stores this file list as text; real table clients validate the operation before committing.",
      ),
    ],
  },
  {
    id: "vectors",
    title: "Filter before ranking",
    group: "Beyond ordinary objects",
    article: link("vectors"),
    description:
      "Derive exact distances in four visible records, then change the candidate set.",
    scope:
      "Exact two-dimensional squared Euclidean arithmetic with invented coordinates. Not S3 Vectors, approximate search or real embeddings.",
    seed: [],
    steps: [
      step(
        "Rank all four records",
        "Which two are closest to [1,0]?",
        { op: "VECTOR_QUERY", query: [1, 0], topK: 2 },
        "A has distance zero and B has 0.08. The result also shows all candidates and their distances.",
      ),
      step(
        "Filter to storage",
        "Will removing billing before ranking leave two results?",
        { op: "VECTOR_QUERY", query: [1, 0], topK: 2, category: "storage" },
        "B and C are now the candidates. Post-filtering the former top two would have returned only B.",
      ),
      step(
        "Move the query",
        "Which storage passage becomes nearest to [0,1]?",
        { op: "VECTOR_QUERY", query: [0, 1], topK: 2, category: "storage" },
        "C now has distance zero. The coordinates make the decision inspectable; they do not measure semantic relevance.",
      ),
    ],
  },
];
