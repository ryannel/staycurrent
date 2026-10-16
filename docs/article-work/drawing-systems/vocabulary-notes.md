# A whiteboard shape vocabulary

Status: implemented for independent review. The collection lead owns integration and publication decisions.

## Commission and scope

Reader: an engineer drawing in a meeting who wants recognisable, repeatable symbols without pausing the conversation. Outcome: compose a small labelled view, draw its common ingredients, choose a coherent treatment, and distinguish optional recognition marks from the names and relationships that carry meaning.

The article begins with a composed Customer → Booking site → Repair API → Repair DB view, then teaches twelve shapes. It shows spare, soft and expressive versions of four symbols and of the same composed system. A separate queue exercise changes the design explicitly; it does not make a queue part of the collection’s shared repair architecture.

The symbols are proposed local conventions. They make no claims of UML, BPMN or C4 compliance. Queue rails, message cards, topic dots, database seams and worker prompt marks do not imply delivery guarantees, cardinalities, physical machines or deployment topology. The service’s named rectangle remains the fast fallback.

## Sources and voice

Read the repository authoring and style skills, README, site direction, content structure, illustration style and writing-style reference. Viewed the original light relational sketch at `src/assets/explainers/sketch-relational-light.png`.

Read Julia Evans, [How to teach technical concepts with cartoons](https://jvns.ca/teach-tech-with-cartoons/), accessed 16 October 2026. It informs the small vocabulary, composed scenes and concern that a friendly image can omit the mechanism needed for understanding. It is an annotated further-reading destination, not evidence that these particular glyphs are standard. No source wording or artwork was copied.

## Artwork and delivery

All 21 SVGs are original code-native artwork in `public/images/drawing-systems/vocabulary-*.svg`. SVG is deliberate: the article teaches exact strokes, additions, endpoints and consistent transformations. It needs editable diagrams, not generated illustrative scenery. No image-generation prompt or raster source exists.

Each SVG includes its own light/dark media CSS, a title, intrinsic dimensions, restrained contours, warm paper and readable text. Three construction panels show successive additions in blue. In those construction figures only, blue means the new strokes; that local legend is stated in the article and each figure. The rest of the vocabulary preserves the collection’s proposed pen roles: black structure, blue current trace, green proposal plus NEW, red concern plus !, purple open question plus ?. Personality flourishes are graphite so they do not acquire semantic colour roles.

Spare keeps essential silhouettes; soft adds rounded corners and a quiet wash; expressive adds hair or a small pair of hatch strokes. The user’s legs remain in the spare treatment because they help preserve the person silhouette. The composed versions preserve four nodes and three relationship endpoints exactly. The exercise solution deliberately uses plain rectangles, demonstrating the fallback while making ownership and worker-to-queue use direction visible.

The printable HTML reference reuses the SVGs directly. It has responsive single-column display on phones, a print button, a two-page A4 print layout, construction steps, personality examples, a timed prompt and a discussed textual solution. The article provides the drawn solution and text equivalents for every illustration.

## Verification evidence

Used Chromium through the bundled Playwright runtime to render the printable reference at 390 × 844 in light and dark media modes. All image elements loaded; document width did not exceed the viewport. Inspected full-page reference rendering and individual practice and expressive-system figures. Confirmed the dark treatment changes paper and ink while preserving content and alignment. Inspected construction additions and corrected a class replacement that originally left some new strokes graphite.

Printed the HTML with browser print CSS, print backgrounds enabled and preferred CSS page size. pypdf confirmed two A4 pages. Temporary screenshots and PDF were inspection output under `/tmp/`, not deliverables. The printable HTML is the durable deliverable.

Root coordinates the required whole-site `pnpm build` and independent assembled-page review. This note does not claim those checks have passed or that the article has been published.
