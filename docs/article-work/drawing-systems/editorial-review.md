# Editorial review: introduction, layout and maintenance

Reviewed 16 October 2026. Scope: `index.md`, `layout.md`, `maintaining.md` and their six SVG figures. The reviewer authored the separate vocabulary article but did not author these three pieces. This is an informed, outline-first editorial review, not a blind novice reading. No edits were made to the three reviewed articles or their illustrations by this reviewer. The collection lead repaired the findings below; those changes were then reread and rendered again.

**Verdict after repair: ready as drafts for these three articles.** Their promised outcomes are taught, the two material figure discrepancies are repaired, and no remaining headline/outcome mismatch was found. This verdict does not establish publication permission or replace the whole-site build.

## Expectations and reading method

From their titles and openings, the introduction owes a way to choose a diagram by the question being asked and a useful route into the collection. It does not owe full notation instruction for every recognised family. The layout article owes a visible improvement to an actual drawing, a repeatable method for labels and connections, and a five-colour convention that survives monochrome. The maintenance article owes a way to decide what to retain, choose a maintenance tool, make a drawing intelligible outside its meeting, and know when to revisit it.

Initial excerpts included each opening and its first section; heading trees were then extracted before reading the remaining source. The article bodies were delivered in whole-page chunks, so later impressions are retrospective judgments, not section-by-section questions preserved before seeing each next section. Source reading was followed by browser inspection of all six assembled figures at `http://127.0.0.1:4331/learn/drawing-systems/`, `/layout/` and `/maintaining/`.

The heading maps are useful:

- Introduction: meeting shortcut → choosing by question → diagram/notation/tool/style → walking a case → other views → collection. The immediate-meeting diversion is deliberate and clearly optional; the main explanation resumes with the repair example.
- Layout: arrangement → hierarchy → connectors → palette → uncertainty → contrast and copies → exercise. It works from spatial structure toward emphasis and export, rather than asking colour to repair the drawing first.
- Maintenance: future use → tool selection → meaning review → comparison across views → capture record → change triggers → handoff exercise. The sections expose different decisions rather than presenting a checklist under interchangeable headings.

The rendered heading trees matched the source. There were no unexpected component headings in the main article content.

## Consequential findings and repairs

### Repaired: the first layout image claimed an unsupported reading order

`layout-before.svg` originally said “The API is read before the browser.” The browser was visibly at the upper left and the API below it. This did not follow from the image, and it distracted from the valid problem: the request route turns down to the API and back up to the database.

The lead replaced the sentence with “The request path turns down, then back up.” Re-rendered at phone width: the annotation now describes the visible route. The surrounding paragraph already explained that same down/up turn. No broader rewrite was needed.

The before/after pair preserves Browser → API, API → DB, Worker → DB and Worker → Provider. In particular, the worker's database arrow still describes a read dependency, not job movement. The caption makes that distinction clear rather than requiring the layout to force every arrow into one direction.

### Repaired: the process/lifecycle contrast used two lifecycle fragments

`maintaining-mismatch.svg` originally titled its upper panel “PROCESS · stated policy” but drew “Approved quote” → “Cancelled”. Those are conditions of an object, so the illustration blurred the very distinction the collection teaches. The lower fragment also used “Repairing” where the lifecycle article names the state “In repair”.

The lead changed the upper panel to “PROCESS · after quote approval”, with “Receive cancellation” → “Close request” and the qualifier “before repair begins”. The lower panel now shows Approved → In repair. The alt text was updated with the same account.

The revised figure now compares activities with allowed states. Its point is still the missing cancellation route in the deliberately incomplete lifecycle. Checked the referenced process article's cancellation scope and the lifecycle article's definition of Approved and In repair: the comparison is consistent with both. It does not pretend that a policy diagram proves implementation behaviour. The following paragraph explicitly retains a policy/implementation discrepancy when evidence requires it.

## Explanation and coverage

The introduction's opening makes an immediately useful distinction: the same unlabeled line can be read as an API relationship or a business handoff. The following paragraph supplies the alternative organising principles. Readers can therefore understand why the later table chooses by question instead of treating the list of diagram names as competing products.

The repair example gives the comparisons something to refer to. Walking R17 into a shared inbox and then changing the quote response produces concrete reasons to revise the drawing. The alternate views section stays bounded. Checked the relevant destinations: the process article includes a compact service blueprint and decision-table contrast, and the domains article contains a data-flow/trust-boundary contrast. Those links do supply the promised next step.

The layout lesson demonstrates its mechanism. The two paths share a store; the revised arrangement separates their visual reading without reversing the worker's dependency. The five-colour section gives actual working roles and keeps numbers, NEW, ! and ? as non-colour cues. The uncertainty example keeps a provider question local to the call and separates an unverified proposal. These examples support the exercise's concrete tests.

The maintenance article goes beyond “keep diagrams up to date”. It distinguishes a current operational view from a decision record, names the cost of asynchronous notification work, requires an absent reader to interpret the artifact, and supplies a capture record whose verification status is explicitly fictional. The review triggers match the abstraction level. The cross-view comparison shows what to do with a disagreement: investigate the policy and implementation, then preserve any real discrepancy. No full modelling-tool tutorial is owed by its title or description.

## Writing judgment after repair

The strongest prose follows a specific consequence. In layout, “That gives the board the order of the conversation. Someone reading it later needs the order of the explanation” leads directly into the before/after choice. In maintenance, the contrast between finding the owner of a failed notification and recording why delivery was separated gives the reader a practical reason to choose a different artifact.

The introduction's family/notation/tool/style section has enough concrete examples to keep four definitions from becoming a glossary exercise. The collection links describe distinct reading outcomes without promotional descriptions of completion. The maintenance sample's status qualification is placed directly after the sample, where it prevents a false reading of the invented verification claim.

The original layout annotation and process fragment were the strained parts because their captions asked the reader to infer a lesson their marks did not support. The repairs make the pictures and prose agree. Rereading their surrounding sections revealed no new repetition, broken transition or lost qualification. The remaining headings identify what their sections actually develop; no headline promises a broader treatment than the page provides.

## Browser and source evidence

Chromium at a 390 × 844 viewport rendered the three routes without horizontal page overflow. All six article images loaded after scrolling them into view and allowing lazy loading to complete. Each displayed at 358 CSS pixels wide. Inspected overview, both layouts, palette, annotation comparison and maintenance contrast as image captures; rechecked the two repaired figures. Also inspected the annotation figure with dark media emulation: the uncertainty and proposal remained distinguishable by their words and marks.

The explanatory notes are the smallest figure text on phones, around 12–13 CSS pixels at that width. They were legible in this check and have adjacent textual equivalents, but they leave little room for smaller screens or further reduction in a document. Raising note text toward 20–22 SVG units would be a useful refinement when the assets next change; it is not an unresolved semantic blocker.

An initial image `decode()` call raced lazy loading and failed. Waiting for the visible image to complete resolved it; repeat inspection showed the images loaded. This was a review-script timing issue, not a broken site image.

Checked [W3C use-of-colour guidance](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html), the [C4 review checklist](https://c4model.com/diagrams/checklist), and the [draw.io format guide](https://www.drawio.com/docs/manual/editor/save-file-formats/). Their specific supporting claims are appropriate: visible alternatives to colour, scope/notation/relationship review questions, and preservation of editable diagram data in supported export formats. This was not an exhaustive re-audit of every external product claim in the whole collection.

## Separate vocabulary repair

Repaired the vocabulary article and its relevant SVGs, alt text and printable reference so the API stores a request, not a booking. Composed headings now say “request a repair”. Booking site remains the UI label. This prevents the shape lesson from implying that request submission creates a scheduled Appointment. The change is recorded in `vocabulary-notes.md` and does not alter any other article.
