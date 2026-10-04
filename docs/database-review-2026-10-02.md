# Database field review, 2 October 2026

The field now connects a decision guide, the existing visual overview, nine
mechanism explanations, and a first Postgres/vector assessment. The existing
column-store essay supplies one of the nine explanations. Graph databases were
added as a full explanation following the operator's correction.

Three Sol authors at high reasoning worked in separate file scopes. Authors
reviewed another author's work; a fresh reviewer received only the drafts and a
reader brief, without the conversation or intended conclusions. Its review was
from source, not a browser or assistive-technology session.

## Findings resolved

| Finding | Change |
| --- | --- |
| Nested documents appeared to justify a separate database by themselves | Compare the same product against a relational design with JSON, constraints, indexes, and operational cost |
| Targeted field edits sounded like general stale-write protection | Distinguish unrelated-field preservation from revision checks and atomic guarded operations |
| B-tree pages appeared before a reader knew what a page was | Define pages and draw a small separator/leaf lookup |
| Isolation levels were too abstract | Follow two reads around another transaction's commit; explain whole-transaction retry |
| Device partition model omitted known membership | Add a B1/B2 membership route between one-group lookup and full fanout |
| Quorum timing used two unexplained clocks | Name the leader-receipt clock and display both client journey legs |
| Refresh seemed to fetch catalogue changes | Show accepted indexing buffer and explicitly separate delivery from visibility |
| A finished graph traversal could imply complete reachability | Distinguish hop-bound termination from an exhausted frontier, naming unexpanded nodes |
| Cypher example differed from experiment around cycles and optional calls | Exclude the start endpoint and show the required-call predicate |
| Object overwrite offered a third step without a write | Finish that mode after two writes; manifest publication takes three |
| Exact cosine reference could include vectors absent from ANN indexes | Apply non-null, nonzero eligibility to both paths and track embedding coverage separately |
| Mobile and dark-theme presentation defects | Fix selector overflow, route an edge away from the Returns label, and correct overview SVG text colour |

The assessment's dated IVFFlat maintenance issue, exact-query guidance, recall
caveats, and provider-permission claims received independent primary-source
review. Provider availability of a specific extension release is not asserted.
The detailed source record is in [postgres-vectors-research.md](postgres-vectors-research.md).

## Verification

- All 41 pure-model tests pass, including the existing column-store tests.
- Production Astro build passes for 18 HTML pages plus RSS.
- All internal links and fragments resolve in generated HTML; teaching and
  assessment drafts retain `noindex`. RSS has no publication items.
- Browser checks exercised checkout overselling and rejection, document rename
  propagation, known-device routing, hot-key spreading, quorum timing, atomic and
  partial transfer recovery, cache expiry, search refresh/merge/filter ordering,
  bounded graph traversal, and manifest publication.
- New routes were checked at 390px and 320px. The 320px distributed-SQL overflow
  was corrected and rechecked. Wide tables and code retain local scrolling.
- Keyboard activation was checked on the manifest model. A complete keyboard or
  screen-reader accessibility audit has not been performed.
- Light-theme browser screenshots and a temporary dark CSS/media preview were
  reviewed. The preview did not change OS preferences; it is not a native
  prefers-color-scheme integration test. Diagram and control surfaces followed
  their theme tokens across the new explanations.
- No database benchmarks, SQL execution, restore drills, or production trials
  were performed. Model counts and timings are explicitly illustrative.

The editorial guide now includes concrete lessons from these reviews. It remains
a set of examples to reason from, rather than a prescribed article formula.
Nothing was committed, deployed, or entered in the publication feed.
