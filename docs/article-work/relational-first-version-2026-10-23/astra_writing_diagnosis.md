The main problem is a mismatch between the promised standard and the standard actually enforced. The writing skill asks for an article that feels written by the reference author; the commission encourages a broad lifecycle survey; reviews pass it once that survey is coherent, correct and understandable. These are different targets.

I read all three complete clean reference exports, their provenance, the complete current introduction, the original writer inputs, teaching notes, relevant first/final reviews and decisions, and the two earlier opening samples. I made no changes.

1. **The commission strongly shapes a survey, despite explicitly freeing the headings.**  
   The nine outcomes in `docs/article-work/relational-full-reference-2026-10-23/reader-outcomes.json` map almost directly onto the nine substantive sections: facts, SQL, concurrent purchase, engine work, commit, request, distribution, recovery and system choice. The associated child briefs supply a wide catalogue of concerns. Permission to reshape is present, but practical acceptance still requires a newcomer to acquire useful judgement across virtually the whole application lifecycle.

   **Inference:** the writer is solving “cover these outcomes intelligibly” more than “develop the best introduction”. The tree’s ambition has partly migrated into its entrance article. Working depth is assigned to children, but the parent still carries too many independent distinctions for sustained teaching at the reference standard.

2. **The references organise explanation around recognisable subjects and questions, then earn their consequences.**  
   `reference-reading-clean/indexes.txt` develops “Sequential scan” → “Index entries and row locations” → “B-tree” → “Range scans”. At the B-tree transition it explicitly identifies the unresolved question: “So far, nothing says how a search finds the first 42.” In `storage.txt`, “Dirty pages” establishes why simply writing changed pages before replying is a poor answer; “Write-ahead log” then supplies the mechanism. The next subject is needed because of the previous explanation.

   The introduction often connects sections through the same purchase, but this is less demanding than a progression of understanding. Its engine-work section (`src/articles/relational-full-reference/introduction.astro:62`) moves through planner, indexes, bulk scans, page caches, spilling, lock waits, connection queues and measurement in seven short paragraphs. These statements are useful and mostly clear; collectively they behave like a compressed field guide. Naming a shared example does not automatically give every topic the reference articles’ explanatory development.

3. **The headings expose that drift; they are not the sole cause.**  
   The actual headings include:

   - “Tables describe different kinds of fact”
   - “The engine chooses work behind the statement”
   - “What successful COMMIT establishes”
   - “Choose an arrangement from the work it must support”

   These tend to restate a teaching outcome or conclusion. “The engine chooses work behind the statement” is particularly indirect as a name for query execution; “What successful COMMIT establishes” sounds like a contractual assessment. By contrast, the references use straightforward names such as “Buffer pool”, “Write-ahead log”, “Selectivity and the planner’s choice of scan” and “How much to draw”.

   This does **not** justify banning sentence headings. “A committed order and a successful request are different” identifies a useful distinction, and the references themselves use questions and claims where appropriate. The issue is whether the heading gives the reader an economical, recognisable handle on the subject, rather than narrating the author’s lesson.

4. **Review passes exactly the weaker criterion it was given.**  
   `.agents/skills/staycurrent-review/perspectives/editorial.md:7` requires headings to “Say what the section covers in reader-facing words.” Both `reviews/v1-editorial.md` and `reviews/v2-final-editorial.md` pass headings because they name the question or distinction below them. That is an accuracy test, not a comparison with the reference author’s judgement.

   `coordinator-final-reading.md` explicitly notices that some headings and roadmap wording remain formal, then classifies this as preference insufficient to reopen repair. The final editorial report also concludes that no substantive defect remains, rather than explaining whether this article reaches the references’ writing quality. This is direct evidence of calibration drift, not merely reviewer inattentiveness.

5. **The process captures local defects better than overall writing quality.**  
   First review caught mixed example states, compressed application duties and caption jargon. Those were worthwhile repairs. The coordinator also caught a first-figure teaching problem missed by specialist passes. But the repair process then concentrated on closing D1–D5. Fresh final readings still accepted the broad survey and formal heading register.

   `author-teaching-notes.md` describes the borrowed reference rhythm as “establish the mechanism, tell the reader what to watch, show it, explain the consequence, and link the working depth.” That is a useful pattern, but a weaker abstraction than what the references actually do: decide which question is worth developing, make its causal reasoning followable, and give it sufficient space. Reproducing the paragraph/figure rhythm does not ensure that judgement.

6. **Incomplete reference delivery is a real limitation, but not a sufficient explanation.**  
   `experiment-result.md` establishes truncation and late reading in the first writer’s reference exposure. It does not establish causation. The repair writer received fuller references, and the final blind editorial reader read the complete clean exports, yet the final headings passed. Reliable delivery should be fixed operationally; another untouched trial with complete references cannot by itself test corrected quality calibration.

   The earlier `relational-visual-test/opening.astro` and `relational-visual-repeat/opening.astro` show clearer, slower development around a narrow question. They are opening samples, however. Their success does not prove the same process could sustain a complete article under this much broader commission.

The smallest useful changes would be:

- **Commission:** state what this article must enable the reader to understand or do independently, then distinguish that from subjects it only introduces to make the next reading intelligible. Give the writer authority to move an outcome to a child when proper teaching would overwhelm the parent. Do not treat every child scope as an introductory coverage obligation.
- **Writing skill:** keep its compact reference-led approach, but clarify that the example and plan serve the developing explanation. A suitable addition is: “Let each section develop a subject or question the reader now has reason to understand; choose its name, scope and depth from that explanation, rather than turning the coverage plan into prose.”
- **Review calibration:** replace the weak heading criterion with a reference-relative judgement of clear subject naming and economical navigation. Require one overall answer: does this stand beside the references in explanatory selection, development and prose, or is it merely adequate? Support that answer with a few passages. Permit a broad selection/depth problem to be substantive even when no isolated sentence is wrong.
- **Throughput:** changing the number of reviews will not fix their shared threshold. The recorded ten reviews and roughly eighty minutes produced strong defect documentation, but did not resolve this mismatch. Calibrate the central reader judgement first; do not add another checklist or review layer.

The aim should remain newcomer-to-practitioner **through the tree**. The root should make the field understandable and the next questions worth pursuing, with a few foundations properly taught. It need not compress the whole practitioner lifecycle into introductory previews.
