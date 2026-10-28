# Cache keys — draft record

28 October 2026. Finished draft at `src/articles/application-caching/cache-keys.astro`,
metadata status `draft`; five figure components in `src/components/application-caching/keys/`.
No publication, build, server, review or commit performed by this worker.

## Reference and teaching decisions

Read all 19 numbered text parts separately using `read-writing-reference.py`,
with >=4,000 output-token budgets and all END markers received. Inspected the
prepared Indexes figure 2 and Storage figure 3 images. The useful pattern was
keeping the same visible entities while changing one cause and stating the
observable consequence. The article develops the parent’s north/south collision,
then separates identity, byte encoding, permission, format and absent results.

Figures: component anatomy; selectable ambiguous join versus fixed JSON array;
permission before both cache paths; format version versus source revision;
missing-entry / established-absence / source-failure outcomes. Figure 2 has a
native labelled select, live result, initial server-rendered state and complete
text alternative. Static figures use real HTML text. Theme tokens only; responsive
layouts reduce to two component columns or one flow column on small screens.

## Primary sources checked

- Redis Keys and values: binary-safe keys and conventional colon sections;
  prefixes do not create a hierarchy.
  https://redis.io/docs/latest/develop/using-commands/keyspace/
- Django 5.2 cache documentation: prefixes, representation versions, explicit
  variation and backend key restrictions.
  https://docs.djangoproject.com/en/5.2/topics/cache/
- RFC 8259: string escaping, ordered array elements and JSON interoperability.
  https://www.rfc-editor.org/rfc/rfc8259
- OWASP authorisation guidance: validate permissions on every request.
  https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html
- Amazon caching guidance: mixed reader versions and load from discarded formats.
  https://aws.amazon.com/builders-library/caching-challenges-and-strategies/

## Focused evidence

Node assertion run against the actual figure module passed: the two colon-joined
requests collide; fixed JSON encoding distinguishes them; 169 combinations of
13 strings (empty, separator, quote, slash, comma, brackets, newline, Unicode)
round-trip to their exact input tuple with distinct keys; numeric IDs are rejected.
This is deterministic illustrative encoding evidence, not execution against Redis
or proof of a general canonical serialisation scheme. No digest is implemented.
The article explicitly states that a digest cannot repair omitted fields or
ambiguous input, and JSON needs an agreed encoder convention across clients.

## Continuity pass

Reread opening, prose, tables, figures, controls and captions in order. North P7
stays GBP20/revision1, later GBP22/revision2; south GBP18 remains a labelled
independent product. Locale/currency are supplied by the source. The envelope
matches the agreed schema/context/kind/product contract exactly. P99 absence
has no product field; source failures propagate. Five/30-second TTLs are labelled
example settings and no source-age promise is made.

Local scenario extensions are explicitly labelled: identifiers containing colons
for the encoding example; hypothetical v2 formatted-price field; an access-
restricted view with unnamed allowed/denied readers. The latter was reported to
the coordinator and does not change the public catalogue. List defaults are
local declared query semantics (page1, price ascending, ten cards, below £21).
No other article needs these extensions. The `product-json:v1:` alternative is
separate from the worked adapter’s baseline `product:v1:` key.

Freshness owns changes over time and permission revocation; operations owns
rollout and cache-store access. No new child article or error-cache chapter is
promised. All internal links use planned collection keys.

Coordinator owns rendered checks at desktop/375px in both themes, control and
keyboard exercise, preview build and article-targeted dense-prose output. These
checks are requested and not claimed here. No outstanding shared-example
question prevents the draft from being reviewed.
