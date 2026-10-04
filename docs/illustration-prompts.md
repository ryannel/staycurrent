# Companion illustration prompts

Generated on 2026-10-02 with the built-in imagegen tool. Both use
`public/images/explainers/rows-to-columns.png` as a style reference.
The original prompt is in [the opening image record](column-store-image-prompt.md).

## Inside a part

Saved asset: `src/assets/explainers/inside-a-part.png`.

Visual check: one tray, three columns with six aligned cells each, and a
separate guide card. This is a conceptual model, not a physical file format.
The caption makes that boundary explicit.

```text
Use case: scientific-educational
Asset type: explanatory editorial illustration for a database essay.
Input image: style reference only. Create a NEW companion plate in exactly the same warm ivory paper, fine graphite outline, matte mineral pigment, softly shaded isometric model-making style. Do not repeat its rows-to-columns composition.
Primary request: Show the anatomy of ONE database data part as a conceptual cutaway, not a literal disk format. One large shallow open ivory archival tray encloses THREE parallel equal-length strips of data, each strip divided into SIX aligned rectangular cells. The left strip is muted teal, the middle amber, the right dusty blue. All three strips run front-to-back within the SAME tray, with their six cell boundaries aligned across the strips: values at the same position belong to the same record. Small graphite ruler ticks outside the left edge align with the cells. One separate thin ivory index card hovers to the LEFT of the tray, with three simple graphite tick marks; three fine dotted guide lines lead from the index card to three positions on the tray's left ruler edge, suggesting a sparse guide into data. The index card is visibly smaller than the data tray. No blocks outside the tray.
Composition: landscape 3:2, one object centered with ample breathing room. Low 30 degree isometric view, open top clearly shows the three strips, soft top-left light, restrained tactile paper texture and contact shadows. Museum technical plate, calm and precise. Match the reference palette and line quality.
Text: no letters, words, numbers, captions or logos. Labels will be accessible HTML below the image.
Avoid: server racks, database cylinders, circuits, neon, glass, decorative machinery, arbitrary cables, people, excessive grain, heavy shadows. The illustration must make it clear a part contains several columns together.
```

## Separate and shared storage

Saved asset: `src/assets/explainers/separate-and-shared-storage.png`.

Visual check: two compute blocks in each arrangement. The left pair each has
its own data tray, with a replication arrow between trays. The right pair
connects to one shared tray. The caption explains that the tray represents a
storage service, not one physical disk. Metadata coordination and caches are
omitted. Both assets are served as responsive WebP images through Astro.

```text
Use case: scientific-educational
Asset type: a paired editorial illustration comparing separate storage with shared storage in a database essay.
Input image: style reference only. Make a NEW companion plate, matching its warm ivory paper, precise fine graphite outlines, matte mineral colors, gentle hand-rendered texture, 30-degree isometric view and soft top-left lighting.
Primary request: Two clean balanced groups, left and right, separated by a generous empty vertical gutter. LEFT GROUP: two small ivory compute blocks at the top. Each compute block has one fine vertical graphite connection to its OWN separate small open data tray below it. Each tray holds three strips, one teal, one amber, one dusty blue. A subtle double-ended horizontal arrow between the two separate trays indicates data replication. RIGHT GROUP: two identical ivory compute blocks at the top. Each has a fine graphite connection down to the SAME SINGLE wider open data tray below them. That shared tray holds three strips, one teal, one amber, one dusty blue. No connection between the left and right groups. The right tray represents an object storage service, not a disk. Keep the two compute blocks clearly separate in both groups. Compute blocks have only a small recessed square face detail; do not fill them with data, lights or text.
Composition: wide landscape 3:2 with the objects arranged in a shallow band through the center, ample quiet paper above and below. Precisely two compute blocks in EACH group, precisely two separate trays on left, precisely one shared tray on right. Both groups equal visual weight. Match reference sophistication and palette.
Text: NONE. All labels and explanation will be accessible HTML outside the image.
Avoid: clouds, cloud icons, server racks, cylinders, chips, circuits, neon, glass, tiny labels, extra connections, machinery, logos. Beautiful but diagrammatically clear.
```
# Dark-paper companions — 2026-10-02

Built-in imagegen edit mode, with each existing light illustration supplied as
its edit target. Selected assets: `src/assets/explainers/shops-to-page-views-dark.png`,
`src/assets/explainers/inside-a-part-dark.png`, and
`src/assets/explainers/separate-and-shared-storage-dark.png`.
Their corresponding light PNGs remain the reference and light-theme source.

Full prompt used for each target:

> Use case: style-transfer. Edit target: the supplied illustration. Create its dark-theme companion on warm charcoal paper (#292722), with slightly lighter charcoal card, tray and compute surfaces and fine warm chalk-gray outlines. Preserve the exact composition, object positions and sizes, all counts, connections, arrow directions, framing and 3:2 aspect ratio. Preserve teal, amber, dusty blue and terracotta colour identities; make them gently illuminated matte pigments, not neon. Keep the subtle paper grain and upper-left lighting, legible edges and modest shadows. Change only palette and surface lighting for dark reading. Do not add, remove or rearrange objects. No text, labels, typography or watermark: labels will be overlaid in HTML in their current positions. Keep all existing empty margins.

Visual check: four shops and their paths remain; the part retains three columns
of six blocks and the index connections; the storage comparison retains two
separate trays versus one shared tray. HTML labels remain overlaid in the same
positions and use pale text in dark mode. The page selects optimized WebP
variants with `prefers-color-scheme`.

## Field-guide filesystem plate — 3 October 2026

The light and dark filesystem artwork, complete prompts, and blind-review
findings are recorded in [the field-guide illustration review](illustration-review-2026-10-03.md).
Both images were made with the built-in imagegen tool and saved under
`src/assets/explainers/filesystem-folders-{light,dark}.png`.

## Restrained technical sketch — 3 October 2026

The operator chose the restrained technical sketch from the three rendering studies.
The database field guide now uses a matched light/dark set, with fine pencil contours,
selective hatching, shallow depth, and muted colour. The original Explore artwork stays
as a teaching reference. See [the current rendering guidance](illustration-style.md).

These are new drawings generated with the built-in imagegen tool. The records below
preserve the full prompts, reference inputs, and selected source files:

- [Relational records](sketch-relational-prompts.json)
- [Object storage and filesystems](sketch-objects-files-prompts.json)
- [Documents, keys, and columns](sketch-data-prompts.json)
- [Search, graphs, and caches](sketch-systems-prompts.json)

Project originals are `src/assets/explainers/sketch-*-light.png` and
`src/assets/explainers/sketch-*-dark.png`. Astro serves compressed WebP versions.
Each dark image is a companion drawing with the same meaning and composition;
none is an inverted or dimmed light image. Labels and captions are checked on the
assembled page, including the HTML labels layered over text-free art.
