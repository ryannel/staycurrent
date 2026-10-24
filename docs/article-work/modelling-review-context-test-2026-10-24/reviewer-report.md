# Editorial review: Relations, keys and normalisation

**Judgement: passes, with one optional wording improvement.** No substantive editorial repair is needed. The article could sit beside the three fixed references for the supplied audience: an engineer who has read the relational introduction and already knows the basic SQL concepts listed in `audience.txt`.

## Version and actual exposure

Reviewed the frozen finished page at `http://127.0.0.1:4580/review/relational-collection/modelling/`, backed by `/private/tmp/staycurrent-relational-r49-opening-v03/review/relational-collection/modelling/index.html` (HTML SHA-256 `08f38a066c23d2bd4c99e24bb3b56362b3c006a615be213e3b6503ae941947eb`). This identifies the exact reviewed version, rather than an editable source article.

Read the whole article through the live accessibility rendering and the exact saved HTML parsed as text, preserving code indentation. Exposure included both SQL fragments, the dependency notation, all three figures and captions, all Figure 2 states and its expanded text alternative, the expanded “Overlapping candidate keys and BCNF” section, the conclusion, navigation text and final expanded Sources. Browser screenshots supplied the opening and rendered figure/disclosure context. Only my own temporary tab was used; it is closed. No viewport, theme or shared preference was changed.

Read all supplied reference texts in full: Sequence diagrams parts 1–6, Indexes parts 1–7 and Storage and durability parts 1–6, including every END marker. Rendered comparisons on the same frozen server covered Sequence diagrams’ “Replies and activation bars” and Figure 2, Indexes’ opening and “Sequential scan” with Figure 1 and its caption, and Storage and durability’s opening and “Dirty pages” with Figure 4 and its caption. No collection link or external source was followed.

## Finding

**Low — Figure 2, “Keep Edda without orders”, explanatory sentence:** “A line-shaped row cannot record just a customer.” “Line-shaped” makes the reader translate a visual metaphor back into the already established meaning of an order-line row; row shape is not what prevents recording Edda. The adjacent “No order line exists for Edda” and following sentence about inventing a purchase make the intended meaning clear, so the reader can continue without missing understanding. Optional polish should name the row’s required purchase fact directly. Compare Indexes’ literal caption wording, “Each cell shows a row’s customer_id above its order number”, which explains the representation without introducing another metaphor.

## Coverage and whole-piece judgement

1. **Titles and headings pass.** The title names its subjects as directly as “Storage and durability”. Headings such as “What one row says” and “When a copy is a different fact” identify the question developed immediately below, in the manner of “Who writes a dirty page” and “What an index does with each condition”. “The checks called normal forms” fits its section’s purpose: naming and explaining the splits already developed.
2. **Plain sentences pass**, apart from the optional phrase above. “The line says what Mina agreed to pay then” makes the important distinction plainly. The concrete comparison “Keeping a list of order IDs and a separate list of customer IDs would lose who placed which order” gives the following lossless-decomposition term a clear meaning.
3. **Terms pass.** Grain, candidate key, superkey, determinant and the three anomalies are explained where introduced and then used consistently. The formal disclosure defines prime and nontrivial before using them in its stronger definitions.
4. **Openings pass.** The first paragraph immediately explains data modelling through orders and order lines; the receipt paragraph supplies the consequence, and the joins paragraph gives the cost. Like the Indexes opening, the article explains both the benefit and its trade before developing the mechanism. The assumed prior introduction is explicit and appropriate to this audience.
5. **Reader-facing text passes.** The article contains no editing history or author instructions. The worksheet and Sources statements tell the reader what was checked and distinguish conceptual comparisons from execution. The surrounding draft labels describe availability rather than interrupting the explanation.
6. **Captions and labels pass.** Figure 1 explains its arrows; Figure 2 explains outlines, crossing out, independent alternatives and omitted columns; Figure 3 identifies the two price meanings and their different changes. The Figure 2 options name exactly the change to compare. The low finding concerns one explanatory phrase, not an unclear control.
7. **One-piece reading passes.** The example develops from row meaning through identity, dependencies, anomalies and reconstruction, then distinguishes historical and derived copies. Qualifications sit beside the reasoning they affect: arrays and JSON beside splitting values; surrogate uniqueness beside identity; historical prices beside apparent duplication. The optional formal definitions do not break that progression. I found no passage that reads as an interrupting repair or an accumulated hypothetical objection.

The selection and development earn the final practical advice. “Test a proposed model with changes” recalls the three concrete mutations the reader has just compared, much as Indexes’ design procedure gathers the mechanisms its earlier sections have shown. The repetitions about valid future states reinforce the difference between rules and sample coincidences; they do not restart a lesson already completed.

## Material limits

This is the assigned editorial perspective, not technical certification, a collection-route review or exhaustive visual/accessibility testing. I did not inspect other articles, implementation, plans, history or earlier reviews; I did not open or run the worksheet or verify external source claims. Reference renderings were sampled for the comparisons named above; their complete supplied texts were read. No inputs were edited.
