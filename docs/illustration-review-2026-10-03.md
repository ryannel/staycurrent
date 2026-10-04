# Field-guide illustration reviews — 3 October 2026

The reader asked for three independent interpretations of every image, followed
by intent disclosure, suggested repairs, and another blind round after revision.
Reviews use rendered images with headings and labels, without the article prose,
captions, alt descriptions, or author intent. Each round has three separate
reviewers. A faulty initial filesystem screenshot was replaced and all three
reviewers re-read the corrected version before intent was disclosed.

## Round 1

| Image | Reader A | Reader B | Reader C | Revision |
| --- | --- | --- | --- | --- |
| Object storage | Reference versus contents clear | Same; storage location absent | Same; could be a filesystem | Named database and object-store containers; removed folded file corner |
| Filesystems | Hierarchy and partial edit clear | Hierarchy clear, edit granularity unspecified | Same; no separate open action | Label logical contents and edited portions; heading now matches what is drawn |
| Relational | Shared IDs clear | Same; stacks could imply copies | Same; P7 overlaps mug handle | Explicit table labels; moved P7 clear of mug |
| Documents | Containment clear; blue/ochre inconsistent | Could imply all size/colour combinations | Bracket unclear | Nested sizes enclosure and single colour field |
| Keys | Lookup clear; range missing | Whole list versus range unclear | Ordering clear; role in retrieval unclear | Device-plus-time request selects two rows from a larger ordered group |
| Columns | Projection clear; storage arrangement absent | Same | Same | Separate field strips, no rules connecting their rows, explicit storage label |
| Search | Word edges ambiguous | Same; vector boundary misleading | Same | Four independently routed word references; removed vector category boundary |
| Graphs | Two edges lack direction | Same | Same | Separate SVG paths with an arrowhead on every edge; question names Inventory |
| Caches | Hit/miss clear; fill absent | Cache appears to own source read | Same | Separate hit/miss scenes; application queries database and saves answer |

All three reviewers were then given the intended meanings and asked for visual
improvements. The revisions above reflect their shared findings. Differences in
detail were resolved by keeping the overview scope: the pictures explain a
representation or operation, not all capabilities or guarantees of a family.

## Round 2

Three fresh reviewers saw the revised images without the first round's context.
All three recovered the central meaning of all nine. Search remained medium
confidence for all three: the upper drawing implied an AND query but did not
state it, and the lower drawing did not distinguish distance comparisons from
selected results. After intent disclosure, all three recommended naming the
query and explaining the distance encoding. Those labels were added, with all
candidate points given the same colour. Search proceeds to a third blind round.

The other eight images needed no further mechanism changes. Reviewers noted
limits that belong in the surrounding explanation: object addressing context,
physical versus logical file writes, relational cardinality, document support
outside document databases, which stores support ordered ranges, aggregation,
graph traversal algorithms, and cache freshness. Existing captions and article
text supply those qualifications where relevant. The document illustration
shows containment, not an exclusive claim about a database family.

## Round 3

Three new reviewers independently read the final search image. All correctly
identified P7 as the AND intersection and the lower panel as distance comparisons
from a query to candidates. They did not read the dashed lines as directional
links or a selected result set. Individual mug identities and a precise winning
candidate remain unspecified, as intended for this schematic.

Mobile inspection found the relational order-reference line crossing the Order
lines heading. That line was routed outside the table; the same three readers
receive the relational image as a separate blind task, without its intent or
earlier reviews.

All three interpreted the final relational diagram correctly: order O12
references Ada/C4, and its order line references O12 and the blue mug/P7 with
quantity two. All read the arrows as references in the intended direction.

## Verification

There are nine technology sections and each has one figure. The final build
passes. Desktop and phone layouts were inspected, including the complete figures
with captions in both light and dark paper treatments. Review captures and
final previews are retained in the task's `storage-review` artifact directory.
The review sequence contains 60 image readings: 27 in each full round, then
three final readings each for search and relational storage.

## Artwork

Filesystem artwork uses the built-in imagegen tool. Original generated files were
copied into `src/assets/explainers/filesystem-folders-light.png` and
`src/assets/explainers/filesystem-folders-dark.png`. The assembled figure adds
accessible HTML labels and an explanatory caption. The other mechanisms use
native SVG so the connections, counts, IDs, and arrowheads can be checked exactly.

### Light artwork prompt

Use case: scientific-educational. Create a beautiful explanatory illustration for a database field guide in a restrained hand-crafted technical textbook style: warm ivory paper, fine graphite contours, matte paper/cardboard objects, muted dusty blue and teal with amber for a selected portion, soft upper-left light. Landscape 3:2 composition. Show a filesystem as a spatial directory tree: ONE open root folder at top centre, two fine graphite branching lines down to TWO smaller open folders side by side at middle left and middle right. Each lower folder contains two thin file sheets; the left folder has one selected blue audio-recording sheet visibly pulled forward. From that selected recording, a thin leader travels downward to an enlarged horizontal strip of eight equal connected sections at bottom centre. Only two adjacent middle sections of this strip are amber, the other six are ivory; a fine pencil arrow points to the changed sections. The picture teaches folders contain files and a program can change a portion of one file. Keep structure extremely legible, uncluttered, broad whitespace. Leave blank label space underneath each folder and above the bottom strip. NO text, NO letters, NO numbers, NO interface panels, NO buttons, NO decorative servers, NO code, NO humans. Standalone finished illustration, not a mockup.

### Dark artwork prompt

Make a dark-paper companion of this exact educational illustration. Preserve every object, position, count, connecting line and empty label region unchanged. Warm charcoal paper background, pale graphite lines, matte slate folder materials, muted teal and dusty blue, two amber sections in the bottom strip. Clearly readable on dark paper, same subtle pencil texture and gentle lighting. No text. Change palette only, do not invert the light image.

The dark edit referenced the generated light image. Both were inspected for the
same folder tree, recording connection, eight portions, and two highlighted
portions. The drawing concerns logical file content, not physical storage blocks.

## Restrained technical sketch set

On 3 October the operator selected the restrained technical sketch from three
rendering studies. All nine field-guide plates were redrawn in that style, with
paired light and dark assets. The Explore pages retain their earlier artwork.
The full generation records are linked from `illustration-prompts.md`.

An independent reader saw only the assembled illustrations, without the article,
captions, source, or prompts. They correctly identified the meaning of all nine:
separate photograph bytes; directory paths and partial edits; ID references;
nested product details; direct keys and ordered ranges; selected columns; word
intersection and vector distance; dependency traversal; and cache hit/miss paths.
Two additional peer reviews covered the whole set; those reviewers had each
contributed part of the artwork, so these were not blind readings.

The reviews caught the recording filename sitting near the exports folder. It now
sits under recordings. They also caught sans-serif labels in the object and file
plates beside serif labels elsewhere; those annotations now share the serif
face. The relational heading now uses the same placement as the other plates.
A cropped dark-cache review screenshot was a capture error; the full replacement
was reread by the independent reviewer, who confirmed matching meaning in both
themes. P7's highlight in the dark search image is subtle, but the converging
arrows identify the intersection independently of colour.

The assembled figures were inspected in both themes. Phone checks use a 390px
viewport. The dense search/cache drawings remain complete at rest, with an
explicit “Enlarge illustration” disclosure on narrow screens for a larger,
scrollable view, plus a text description. Static drawings have no button-like
hover treatment. The production build succeeds for all 18 pages and the feed.
