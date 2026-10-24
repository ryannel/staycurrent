# Editorial review · article batch · r00, r01, r02 · batch01-v01

Inputs read: the fixed [v01 manifest](v01/manifest.json), its [intended audience](v01/audience.md), and the complete finished rendered pieces at `http://127.0.0.1:4370/review/relational-collection/`, `/modelling/` and `/values/`. Read the rendered article prose, tables, figure captions and labels, all text disclosures (including all scripted states), Sources and collection navigation. No plans, context files, article/component source, mechanical records, writer notes, earlier versions, decisions or other reviews were read. This is blind first editorial coverage, not repair confirmation or the later final complete reading.

Highest severity: medium.

## Reference exposure and actual timing

Read all fixed reference text through `python3 scripts/read-writing-reference.py`, with each part returned separately at a 6,000-token budget: sequences 1–6, indexes 1–7, storage 1–6. Every part's END marker was present; no clipped part required recovery. The delivered full-text hashes were sequences `722e27d04275d6ee28dfa024951827a78b5c591dc8b5f98584af197b5884809c`, indexes `d60bf12b37f922f0ced9ec54a51b1ef6b94841a40da5f20be6dafdbf75bec8c1`, storage `2bebcdf28bacf1f5ecc2220e8d20a7c34682e052fff3ecde56ca1a56aba08c07`.

Studied all 34 finished rendered reference drawings, with their explanations: sequences Figures 1–13, indexes Figures 1–11 and storage Figures 1–10, at the supplied `http://127.0.0.1:4350/review/examples/` routes. Used three owned temporary IAB tabs. Advanced interactive reference drawings to their final states; recovered the upper portion of the tall crowded sequence drawing separately, and re-read the completed storage recovery/asynchronous-commit drawings after a container click restarted their playback. These were reference-calibration observations, not a visual QA claim. No viewport or theme setting was changed.

The first recorded clock checkpoint was 2026-10-23 23:49:26 UTC, during reference reading; the reference phase's exact start was not instrumented. Complete text and rendered reference study finished at 23:51:23 UTC and was reported to the coordinator then. Full batch rendered reading and contextual figure inspection ran from after that checkpoint to 23:53:01 UTC. The report was saved and all four owned temporary tabs were closed by the 23:54:27 UTC checkpoint. These are observed checkpoints, not estimated reading durations. The coordinator separately confirmed the public-output delivery of all 19 reference text parts.

## r00 · Relational databases

### Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Titles and headings | pass | The plain title and concrete headings give the newcomer useful questions, particularly “What an order contains” and “Two buyers, one mug”. |
| 2. Plain sentences | pass | Explanations name the row, value and action; the prose connects the examples without decorative compression. |
| 3. Terms | pass | Table, primary/foreign/composite key, schema, query, join, aggregation, constraint, transaction, atomicity and isolation are introduced where the example needs them. |
| 4. Openings | pass | The opening establishes both queries across facts and correctness of shared changes, then introduces the shop and the illustrative character of the figures. |
| 5. Reader-facing text only | pass | Article explanations and the evidence disclosure address the reader. The visibly labelled draft navigation is treated as the review shell, not as a claim that planned pieces are available. |
| 6. Captions and labels | pass | Captions identify the rows and the question; transaction captions explain observation boundaries. Customer, stock-method and transaction-ending controls name what changes. |
| 7. One piece | pass | The movement from identity to receipt, total, rules, atomicity and concurrent updates follows the same purchase. Qualifications generally sit with the promise they qualify. |

### Findings

None.

### Whole-piece judgement

This introduction could sit beside the references in selection, explanatory development and prose. It has an introductory scope rather than the references' deep-dive scope, but earns that breadth through one continuing shop. The two different prices emerge from what an order line means, rather than appearing as a detached rule. “Keep asking what one row means” then earns its place through the concrete two-lines-by-two-payments multiplication. The later sentence “Waiting alone would not rescue the first version” is supported by the saved-zero example, so the reader learns a distinction they can use rather than being handed a slogan about transactions.

The durability, external-provider and missing-reply paragraphs do add qualifications in succession, but each changes a specific promise just made about commit; they do not read as objections pasted onto an unrelated explanation. The final fit section also gives reasons and costs, rather than treating a relational database as universally preferable. No article-wide failure of the reference standard found.

## r01 · Relations, keys and normalisation

### Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Titles and headings | pass | Names are economical, with a helpful progression from row meaning and identity to dependencies and change. |
| 2. Plain sentences | pass | The main argument is precise and connected; functional dependency receives a plain explanation as well as notation. |
| 3. Terms | pass | Grain, candidate key, minimality, superkey, natural/surrogate keys, determinant, anomalies and decomposition are explained. The optional formal disclosure defines its symbols and “prime”. |
| 4. Openings | pass | The receipt supplies the problem, and the opening explains both the purpose of normalisation and the join cost. |
| 5. Reader-facing text only | finding | Figure 3 and its transition expose the collection's internal “accepted”/“core” history bookkeeping; see editorial-1. |
| 6. Captions and labels | finding | Captions explain the diagrams, but the repeated example-status qualifications interrupt the account of the changes; see editorial-1. |
| 7. One piece | finding | The argument is coherent, but editorial-status asides in the latter half make the finished explanation sound managed from outside the story; see editorial-1. |

### Findings

### editorial-1 · medium · r01 · Figures 2–3 and “When a copy is a different fact”

Problem: The finished explanation repeatedly asks the reader to recognise production categories that the argument does not need. Figure 2 says the name-change view works “without inventing a new name” and that removal “does not alter the collection’s core data”. The next section introduces “the collection’s later-price history”; Figure 3 calls it “The accepted later-price history”. The Sources disclosure repeats “accepted”. “Accepted” reports an editorial decision, and “core” versus a collection history is external bookkeeping rather than the shop's meaning.

Effect: At the point where the reader should follow the distinction between a current catalogue price and an agreed price, they also have to decide what this special history is and who accepted it. The diagram and reasoning are already sufficient to show the hypothetical change. The extra status commentary gives a coherent article the sound of protective additions made to satisfy a drafting contract. This is cumulative reading effort and an interruption to the example, rather than a concern about the word “accepted” alone.

Suggestion: Introduce the dated catalogue-price change directly as the next event in the example. Keep the useful facts that the diagrams compare alternative designs, that the deletion is hypothetical, and that the drawings are illustrative. Describe those facts once where they help interpretation, without explaining whether a demonstration modifies an internal canonical dataset.

Evidence: Rendered Figure 2 caption; the opening two paragraphs of “When a copy is a different fact”; Figure 3 caption and Sources disclosure. Compare the references' direct introductions of a hypothetical change, such as storage's “Suppose COMMIT replied straight away” and indexes' separately identified invented table and measured table: those descriptions tell the reader how to interpret the evidence without invoking internal acceptance history.

### Whole-piece judgement

The selection and main explanatory development meet the reference standard. The key is treated as a rule over possible future states, not as an accident in five rows. The progression from dependencies to Mina's update, Edda's insertion and Tariq's deletion then to reconstruction is concrete and economical. The distinction between a repeated reference, a historical agreement and a maintained derived copy is especially useful. The optional normal-form definitions are compact, but placed after the worked dependencies and expressly bounded; I do not regard their compactness alone as a substantive defect.

The piece is close to sitting beside the references, but editorial-1 remains a substantive interruption to its finished voice. It does not need a new structure or a broader rewrite: the argument should carry its own example without the collection's production bookkeeping. No separate article-wide failure found beyond that repeated interruption.

## r02 · Values, missing data and equality

### Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Titles and headings | pass | The title names the connected subject; headings identify decisions rather than decorative themes. |
| 2. Plain sentences | pass | Amounts, clocks, spellings and missing notes make the abstract distinctions concrete. |
| 3. Terms | pass | Exact/approximate representations, instant, zone-free reading, collation, Unicode normalisation, predicate and unknown are developed in context. |
| 4. Openings | pass | The opening relates types to three field meanings, then motivates the missing-value problem. |
| 5. Reader-facing text only | finding | “Core”, named “variants” and “extension” status repeatedly disclose example-management machinery; see editorial-1. |
| 6. Captions and labels | finding | Controls identify their predicates clearly; the instant caption also carries redundant collection provenance; see editorial-1. |
| 7. One piece | finding | The main decisions connect well, but repeated status qualifications make the examples feel like separately certified inserts; see editorial-1. |

### Findings

### editorial-1 · medium · r02 · example transitions across amounts, time and missing notes

Problem: The article repeatedly stops to classify its examples against an unexplained canonical collection: “the collection’s fixed-scale variant”, “The core prices have no assigned currency”, “the collection’s class-session extension”, “The collection’s class-session extension supplies the named display zone”, and “These notes are additional teaching data; the core order schema and payment state are unchanged”. The opening has already said that the notes are a separate illustration and that the controls illustrate logic. The later classifications add a layer of production provenance to otherwise direct explanations.

Effect: The intended newcomer must track which parts of a not-shown “core” or “extension” they are meant to remember, when the actual questions are simply what an integer amount counts, what the two clock readings denote, and whether absence differs from empty text. The repeated qualifications read as additions made to protect a shared example rather than a continuous explanation written for this reader. They spend attention without changing the decision being taught.

Suggestion: Let the running shop acquire a concrete example directly: count hundredths in an alternative exact representation, introduce one tea-class start, then add the three illustrative delivery notes once. Preserve essential limits—no currency should be inferred, examples are illustrative, native SQL results are distinct from the controls—in concise reader-facing explanations at their useful locations. Remove repeated announcements about the internal core schema or the example's registered extension status.

Evidence: “Amounts you can add”, opening and caption of “An instant or a calendar reading”, and opening of “A missing value is not empty text”. The visible example is understandable in each case without the collection-category phrases. The references likewise label invented models and measurements, but then develop their chosen changes as the system's story.

### Whole-piece judgement

The article's substantive selection and teaching progression are strong enough for the references. The two rounding calculations support an actual charging decision. The time section distinguishes an instant from a local reading before discussing local-day bounds. The note figure keeps false and unknown visible, and the prose follows through negation, OR and explicit absence tests instead of assuming that one warning about NULL is enough. The transition from empty payment set to an unknown payment amount is also a useful practical distinction.

The main prose is plain, and I found no diffuse motivational filler or repeated abstract conclusion substituting for an example. The example-management commentary in editorial-1 prevents a fully continuous finished reading, however. Repair that layer while preserving the existing progression; an article-wide restructure is not warranted by this reading.

## Limits

This is editorial article-batch coverage of the three named pieces, not corpus coverage of the collection's planned articles. Planned navigation was read as rendered navigation, not used as a plan input or treated as available reading. Draft labels themselves are intentional review-shell text and were not findings.

Read all scripted state text from rendered disclosures, as permitted; did not play every article control state. Inspected the article figures in context at the inherited appearance, but did not perform the visual reviewer's viewport/theme/control matrix or assess all geometry and contrast. No technical implementation, SQL execution, native evidence, source verification, link-target validation or build was performed. No claim of practitioner or visual approval is made. Only this report was written; owned browser tabs were closed on return.
