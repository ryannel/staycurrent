# How Stay Current draws a system

Our illustrations support the explanation in the surrounding text. A reader should see
what is grouped together, what moves, and what can be left alone. The current rendering reference is the restrained technical sketch chosen on
3 October 2026: [light artwork](../src/assets/explainers/sketch-relational-light.png)
and its [dark companion](../src/assets/explainers/sketch-relational-dark.png).
See the assembled relational illustration in the database field guide for its labels.
The Explore plates remain useful teaching examples; their heavier paper rendering
is an earlier direction, rather than the style to copy for new artwork.

## The visual language

Draw as a technical illustrator making a careful pencil explanation: fine, lightly
imperfect contours, a little hatching to reveal an edge, and small washes of muted
colour. A mug should look drawn, with a rim and handle, rather than like a flat icon.
Cards can have shallow depth without becoming heavy cardboard objects. Leave
generous space around the mechanism.

Use nearly smooth warm ivory paper and graphite in light mode; use warm charcoal
paper and pale pencil in dark mode. Keep texture quieter than the lines. The chosen
reference sits between the earlier tactile paper models and the flat vector plates:
adding grain to a vector drawing does not produce the same result. Avoid pronounced
shadows, thick bevels, distressed paper, and polished three-dimensional rendering.
Use a frontal view when it makes a relationship clearer; introduce perspective when
it actually explains containment, layers, or physical arrangement.

Use muted teal, amber, dusty blue, and terracotta for meaningful differences.
Keep a thing's color when it reappears. In the database essay, colored blocks
are data fields, ivory trays group data, and ivory cubes represent compute.
Position and captions must carry the meaning as well as color.

Show containers, layers, paths, and cutaways when spatial relationships help.
Every object and connection should have an explanation. Avoid stock server
racks, glowing circuits, cloud icons, and decorative machinery.

## Choosing the right medium

### Make interaction recognisable

The column-store page once used the same rounded boxes, teal borders, and
outlined highlights for diagrams and buttons. Readers could not tell what
they could change. Matching the palette was not enough to make a coherent
page; the controls needed their own visual conventions.

Static illustrations now use a labelled paper surface with graphite lines
and flat marks. Their values are rows or annotations, not raised pills.
SQL examples use code typography and ruled layouts, without experiment
framing. Paper follows the theme: ivory in light mode, charcoal in dark mode.
The distinction between illustration and control comes from shape, grouping,
and state, rather than forcing bright figures onto a dark page.

Experiments identify themselves as interactive and group their inputs in a
blue-accented Controls area. Rounded buttons, hover feedback, native input
affordances, and keyboard focus belong to things the reader can operate.
The separate Result area contains the changing diagram and counters. Its
paper surface connects it to the illustrations while its placement and label
explain what changes it. Data is still not clickable merely because it changes.

Mark a record with flat shading, a margin stroke, or an annotation rather
than the same ring used for keyboard focus. Keep disclosure arrows and
underlining on expandable notes. Do not solve this only with a “not clickable”
caption: the shapes, grouping, and states should carry the distinction before
the reader tries clicking. If a later diagram supports direct manipulation,
give that actual interaction visible affordances and an accessible control.

Check the page as a whole at rest, then with hover and keyboard focus, in both
themes and on a narrow screen. A style that works in one isolated figure can
still conflict with the experiment next to it.

### Choose what explains the idea

Distinguish the form the reader sees from the tool used to build it. An HTML
or SVG drawing is still a diagram. Monospace text is useful for actual code,
but does not by itself make a relationship visible. In the column-store
essay, SQL shows a reusable query and a table shows its answer; dictionary
encoding needs aligned records, a shared lookup card, and a traced conversion.
See the [worked editorial lessons](editorial-guide.md#lessons-from-the-column-store-essay)
for the failed example and why we changed it.

Use generated illustrations to establish a spatial model or reveal what a
component contains. Use HTML, SVG, or canvas for exact values, changing
state, and interactions. Add controls when changing a parameter teaches
something; motion alone does not make an explanation interactive.

For a diagram whose meaning depends on exact record counts, alignment, or
labels, a code-native drawing can carry the paper, graphite, and muted-colour
treatment without a generated bitmap. The dictionary figure is an example:
the same 16 records appear before and after encoding, and the dictionary is
visibly additional storage. It uses a flat view to keep those relationships
readable. Isometric perspective is a useful house technique, not a reason to
obscure a mapping. Schematic widths must not look like measured byte counts.

Borrow teaching methods from the references in the editorial guide: build
one idea at a time, keep the example visible, and expose the consequences.
Develop original compositions and assets.

Choose a figure for the question it answers:

- An opening plate establishes the central arrangement.
- A cutaway reveals the parts inside a newly introduced component.
- A comparison keeps familiar objects while changing one relationship.

These are options, not a quota. Add a figure where the prose needs the
reader to picture something they have not yet seen.

The opening of the column-store essay now shows online shops sending
page-view records, because that is what the opening paragraphs describe.
The original rows-and-columns plate remains a style reference but is no
longer in the essay. A relevant subject matters as much as matching the
palette. The text still explains the process when the figure is skipped.

## Labels, captions, and delivery

Label the important objects directly in the illustration. Put “Index”
under an index card, label the data part, and distinguish compute from storage.
The reader should not have to decode an object from the caption alone.
Use short, familiar names and place each label beside its object. Reserve
quiet space for labels when composing the artwork.
Label each object once. Put the label directly beneath or beside its visible
boundary. Explain internal details in the caption unless a precise callout
is needed; extra floating labels can make one object look like several.

Prefer rendering these labels as accessible HTML over the image so they stay sharp
and readable on small screens. Use graphite-colored type on the paper,
keep labels clear of objects and connecting lines, and check their placement
at phone width. The generated bitmap can remain free of text; the finished
illustration should contain the labels needed to understand it.
If a dense drawing includes baked-in labels, verify every word and connection,
provide an accessible text equivalent, and inspect the final size on a phone.
Captions state what to notice and name important omissions. Describe the
relationship in alt text without repeating every word of the caption.

Give supplementary plates a little less width than the opening image.
Keep comparison labels aligned with their groups. Avoid cropping an
explanatory image: the missing edge may hold a connection. Use intrinsic
dimensions, responsive sizes, and lazy loading below the opening screen.
Provide matching dark-paper variants for generated artwork. Keep composition,
counts, connections, and colour identities unchanged so the same HTML labels
fit both versions. Use theme-aware tokens for code-native diagrams and labels;
serve bitmap variants through a media-selected picture source. Avoid simply
dimming or inverting the light image. Inspect the assembled page in both
themes: an unlabeled generation preview is only the artwork, not the finished
illustration.

Save original PNGs under `src/assets/explainers/`. Use Astro's image
component to serve smaller WebP variants. The existing opening plate lives
under `public/images/explainers/`; retain it as a source reference for the column-store artwork.
Record the tool mode, full prompt, reference image, selected file, and
accuracy check in [the prompt record](illustration-prompts.md).

## Check the meaning

Inspect counts, containment, alignment, and every arrow. Check that the
picture does not imply a guarantee the system lacks. A shared storage tray,
for example, represents a service rather than one unreplicated disk.

Read the picture with its caption and the paragraphs on either side.
Check it in the browser at desktop and phone widths. Labels must remain
useful without zooming, images must load, and the layout must not overflow.
An attractive picture still needs to teach the right thing.
