# More expressive designs: shared work and memory

28 October 2026. Brainstorm for introduction figures 5 and 6. User asked for a broad visual reset, retaining an effortless experience for the reader. These are designed teaching artefacts, not execution traces or performance measurements.

## What the human reference contributes

Storage and durability holds the product and change constant while changing one mechanism. Its page-fill figure makes byte cost occupy real space, so a larger row visibly leaves less room. Its group-commit comparison holds arrivals fixed while revealing the shared flush. Its dirty-eviction comparison shows who pays a cost rather than merely updating a total. The accompanying prose qualifies the model after the main event is visible. Sequence diagrams similarly insists that the depicted order has meaning; Indexes makes narrowing the search concrete. We can preserve that causal discipline while abandoning their technical-sketch appearance.

## Figure 5: four requests, one piece of work

### Candidate A — a kinetic print workshop (selected)

Four caller tickets wait along the edge of a small, polished workbench. In the upper scene, every ticket starts its own source press. Four translucent rollers turn, four circular lights sweep, and four blue-mug product cards emerge. In the lower scene, the same four tickets collect around one press. It turns once; four copies fan out from the single completed answer and settle at their respective tickets. The returning fan is the moment of delight and the proof that nobody vanished when work was shared.

Use deliberate materials: dark enamel bases, luminous ink, warm metal edges, rounded printed cards and a soft contact shadow. Give the moving tickets a slight anticipatory tilt and their delivered cards a short, damped settling motion. These effects should reinforce arrival, work and completion. No particles or confetti unrelated to the mechanism.

The default plays without touch. A small optional caller-count control can change four to eight and replay, making the unshared side visibly busier while the shared side still runs one source job. Default remains four, matching the surrounding prose. The final picture keeps every answer visible beside the 4-to-1 work comparison. Reduced motion uses that final picture.

The workshop is inside App A. The press represents a source read and assembly, not Redis producing the card. The four lower callers all wait for the one job. Fanning copies is distribution of one answer, not four independent source reads. Different keys, failure, cross-process coordination and measured timing stay outside this figure.

### Candidate B — braided light

Four luminous filaments flow towards separate work vortices, compared with four filaments braiding around one vortex and separating again. This is visually striking and could be very fluid, but the merge can imply that callers or responses cease to exist. The physical tickets and returned cards in candidate A make conservation of all four requests easier to see.

## Figure 6: the useful memory shelf

### Candidate A — a shelf of precisely sized objects (selected)

Two shallow, chamfered shelves have four clearly equal units of space. Four small blue-mug cards, P7/P3/P9/P40, fit snugly. A long 3 KiB query-result tile floats into the upper scene; as it settles across three units, P3/P9/P40 lift gently out and drift into the margin. P7 stays. The lower scene lets the big answer continue to its original caller and keeps its four cards. The subsequent P3/P9/P40 requests light three empty positions above and three matching cards below. Space causes the later misses, rather than a counter announcing them without explanation.

Use a restrained almost tactile material: coloured edge thickness, precise unit grooves, small floating shadows and a gentle spring when the incoming object lands. The query tile spans exactly three times a small tile’s width. There is no squash that could suggest compression or a cache storing more than its budget.

An optional answer-size control can vary the incoming answer from 1 to 3 KiB. The occupied width and displaced-card count change together. The default remains 3 KiB. A viewer who never touches the control still sees both admission choices and their consequences. The retained final image and reduced-motion image show capacity and the next hit/miss result together.

Both arrangements return the large answer to its original caller. The only difference is whether it occupies cache space. Sizes and eviction order are invented; the visual does not predict an actual eviction policy. The comparison assumes the next three requests need P3/P9/P40, not that a cache knows the future.

### Candidate B — packing a soft suitcase

A giant object presses into a bag and small objects pop out. This gives immediate physical comedy, but a flexible container undermines the fixed byte budget and soft objects imply compression. The rigid shelf retains the appealing spatial action without those false suggestions.

## Design test

The reader should be able to name the saved work in figure 5 and the displaced useful data in figure 6 after watching once, without following a step list. All primary labels must remain readable at phone width. Motion can be intricate; the state being explained should stay simple.

## First implementation

Implemented in `src/components/application-caching/delight/burst-memory.mjs` and its scoped stylesheet. The burst keeps four callers throughout; the proposed extra caller-count control was omitted because Replay is sufficient for revisiting this mechanism. Four rotating enamel presses and one larger shared press return the same four cards. The retained result keeps the source-read count beside all the replies.

The memory shelf offers the optional 1–3 KiB size control. A 1 KiB answer displaces P40; 2 KiB displaces P9/P40; 3 KiB displaces P3/P9/P40. The following three requests remain P3/P9/P40, so the upper comparison produces respectively one/two/three misses and two/one/zero hits. The lower comparison always retains all four cards and produces three hits. Caption names the default, and the text alternative follows the selected size.

Syntax and sampled render checks pass for both scenes at 0, .2, .4, .6, .8 and 1, including all three memory sizes, with finite geometry and unique SVG IDs. Static source-raster inspection repaired a shared-press footer overlap and separated P40’s text from its mug. Root owns browser checks of the integrated page.

Independent source review of the read/placement pair found no contradiction in cache-aside ownership or the process/network boundaries. The optional placement action duplicated Replay and was reported as removable polish. The long lower-right network label was flagged for phone rendering inspection.
