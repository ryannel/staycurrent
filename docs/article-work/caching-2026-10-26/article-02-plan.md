# Article 2 working plan — Cache keys and cached values

Start with the previous article's product:42 key. Two shops each have product 42;
first saves a blue mug, second asks for its own red bowl and receives the mug.
The technical error is a violated equivalence promise: requests mapped to one key
must be allowed to reuse the same answer. A high hit rate can measure collisions.

Visual 1: several request cards feed a shared-key grouping. Toggle tenant, locale,
currency or per-user partitioning. See collisions disappear when answer-changing
inputs are included, then see avoidable duplication when user identity partitions
an otherwise public answer. Keys readable, values actually derived from request
fields. A Send next control reveals first writer and later hit/mismatched result.
Show predicted key group before sending. Authenticate and authorise before lookup;
a key is not authorisation. Avoid leaking credentials or PII through cache keys.

Connect namespaces and unambiguous encoding: delimiter ambiguity with (a:b,c)
versus (a,b:c), solved by a documented canonical tuple representation or length
prefixes. Key schema versions separate incompatible readers/writers; canonical
sorting only where the request semantics permit it. Hashing does not restore a
missing tenant, hide secrets reliably, or prove equality. Bound key/cardinality
and admission for arbitrary attacker-controlled queries.

Visual 2: cached product entity versus a rendered page composed from product,
category, locale and price. Update category and show every dependent representation
that could be stale. Whole JSON string captures one value atomically; hashes permit
selected field access but separate reads/updates need consistency care. Retrieval
cost, invalidation surface and memory are related choices. List and query results
are dependencies too, including newly matching items that were not in old results.

Visual 3: negative caching. Missing product read, save explicit not-found envelope,
create source product, repeated read still not-found until expiry/invalidation.
Distinguish cache miss, cached absence and backend failure. Avoid caching transient
errors or authorisation-dependent absence as globally reusable. Short lifetime is
policy, not universal number; random-ID flood still defeats negative caching.

Practical Redis worksheet: namespaced tenant keys, JSON string, HSET/HGET/HMGET,
TYPE, missing hash fields vs empty values, HSET preserving unspecified old fields
(show replacement trap), and explicit negative result. Independent disposable
container script. Version baseline 8.2.2. No later SET conditional features.

Primary research started 26 October 2026:
- https://redis.io/docs/latest/develop/using-commands/keyspace/ (read content-of-keys)
- https://redis.io/docs/latest/develop/data-types/strings/ (opened; use bounded relevant sections)
- https://redis.io/docs/latest/commands/hset/ (read semantics and examples at lines 741–799)
- Hashes overview fetch exceeded tool size; use command references, not an unverified overview.
Need verify HGET/HMGET/TYPE, expiry interaction, and authorisation caching guidance
from authoritative primary documentation before drafting consequential claims.

Article 1 established typography and global CSS. Reuse controls/styles, not its
entire visual form. Native models are MJS; tests should target genuine invariants.
Keep article-02 out of public routes until completed and verified.
