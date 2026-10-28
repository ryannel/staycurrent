# Identity and change: visual exploration

28 October 2026. Two figures for the introduction, deliberately departing from its previous diagram treatment. The reader should discover the mechanism by watching; optional interaction makes a useful comparison easier to feel.

## What to retain from the human references

The Indexes article makes an entry a stable, recognisable object. Building an index moves those entries into order while their rows stay put; a composite key changes which entries sit together. The picture explains an otherwise invisible relationship before the prose supplies the qualifications. The sequence and storage references likewise preserve the participants and the actual old/new values across a change. Their technical lesson is not their frame, player or palette.

Keep object continuity, simultaneous comparisons and one causal change at a time. Avoid dressing up a diagram with unrelated particles. Surface, depth, easing and small physical reactions should make the important transformation easier to notice.

## Figure 3: which requests may share an answer?

### A. The address sorter — selected

A compact, beautifully made sorting machine: two coloured shop tickets, one rounded mail slot, and cream product cards with blue-mug artwork. Large stamped text gives the key identity a tactile presence.

At first both tickets read P7. They arrive from north and south, settle into the same address slot and produce the same north £20 card. South’s £18 expectation remains beside its ticket; the mismatch is visible without a warning paragraph. The machine then adds the shop prefixes. One slot unfolds into two neatly labelled cubbies; the same tickets separate smoothly into `north:P7` and `south:P7`, each receiving its proper card. The delight is in a collision physically untangling into an orderly fit.

Choreography: establish the two shops; carry both identical tickets into the single slot; hold the wrong answer; attach shop-prefix tags; split the slot with spring settling; route each ticket to its own card; hold the resolved view. Use shallow depth, soft contact shadows, sharp readable type and restrained colour. It should feel like a small designed object sitting inside the article, not a dashboard.

Optional interaction: one switch, Include shop, reverses the meaningful structural change. No drag target, precision requirement or mandatory instructions. Default viewing shows both states. Static/reduced motion should show the collision and separation together, or retain a clearly labelled compact collision inset beside the resolved identities.

Technical boundaries: north and south are separate products, not two prices for one shared product. The issue is an incomplete application key, not a hash collision. Language, currency and format remain omitted from diagram labels and named in the caption; source/application create the representation. A successful lookup can still be wrong.

### B. Two coats, one cloakroom ticket

Treat the cards as hanging tags: both shops are given token P7, and the attendant returns whichever card occupies that hook. Adding the shop name gives each a separate hook. Gentle pendulum motion makes matching satisfying.

Why not selected: the cloakroom metaphor adds an attendant and implies arbitrary item ownership. The address sorter stays closer to the key-value mechanism while allowing richer material detail and typography.

## Figure 4: a source change leaves a copy behind

### A. The detached price tag — selected

Two carefully lit product-card displays hold the same blue mug. The source’s price is a mechanical split-flap tag; the cache has a detachable paper copy in a translucent sleeve. At commit, the source changes from £20 to £22 with a short, crisp flip. The copy remains £20, absolutely still. A subtle difference in light draws attention to the two readable prices without colour being the only cue.

After a deliberate hold, App A sends a small deletion token to the cache. Its sleeve releases the old tag. The tag peels or folds out and drops away; the sleeve is visibly empty. The source £22 remains. Nothing automatically synchronises or manufactures a replacement.

Choreography: hold two £20 values; animate only the source tag at commit; let the contradiction sit; send deletion from the application; release the cached copy with a satisfying paper motion; retain the empty sleeve and £22 source. Depth and paper motion are there to distinguish authoritative object from detached copy.

Optional interaction: a simple Hold old copy choice could linger in the stale interval, but omit it if it competes with the visual. Replay is enough for the default lesson. Static/reduced motion needs the £22/£20 disagreement visible as well as the empty-cache consequence, rather than only a final empty sleeve that erases the lesson.

Technical boundaries: source commit precedes deletion; the animation contains no overlapping read and does not establish a general race-free protocol. Deletion does not fetch a fresh card. The source’s £22 value is preserved. Animation timing is presentation time, not a TTL or service latency. Never use a 30-second visual countdown to imply a freshness guarantee.

### B. A copied photograph that cannot update itself

The source is a living product card; a photographic snapshot slides to the cache. An update changes the living card while the photograph retains £20. A delete command tears the photograph away, leaving its frame empty.

Why not selected: a literal camera risks teaching that only image rendering is cached. The detachable product tag communicates an ordinary serialised answer, while split-flap motion gives the price change enough visual character.

## Implemented trial

Implemented both selected concepts in `src/components/application-caching/delight/identity-change.mjs` and its paired CSS. The identity scene exposes the two key-design choices; the price-change scene is watchable with the shared player only. Its retained ending keeps “was £20” inside the empty sleeve so the removed value remains legible. A 101-frame sweep of each exposed mode produces finite SVG without missing values; rendered checking belongs to the coordinator’s assembled page.

Meaningful routing tracks were strengthened after the first dark desktop captures. Light `#687b90` and dark `#7d95ad` retain at least 3.27:1 and 3.33:1 respectively even against the strongest halo colour (a conservative check against its full colour rather than its translucent blend). The decorative grid remains quiet. Desktop identity and invalidation captures preserve legible object labels and the intended card/empty-sleeve relationship.
