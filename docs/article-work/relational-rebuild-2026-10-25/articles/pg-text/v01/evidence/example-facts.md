# Local search example and continuity

Unit retrieved: one product. Separate illustrative catalogue_search projection; no core shop source changes. Product names exactly P3 Green tea, 50 g; P7 Blue mug; P9 Teapot. Stock is after order 103: 10/0/4. No order/payment/price changes. No currency assigned.

Local descriptions:
- P3: Loose green tea for a quiet afternoon.
- P7: Blue ceramic mugs for tea.
- P9: Blue teapot for green tea.

English config; name weight A, description D; default rank weights, ts_rank_cd with no normalisation for main example. Request blue OR tea ranks P7 1.2, P3 1.1, P9 0.2. In-stock top two P3, P9. Early top-two-before-stock counterexample loses P9 and returns only P3. Exact observations retained in PGlite and native results.

Separate snippets A The blue mugs; B Blue ceramic mugs; C Mugs in blue isolate membership versus phrase. A/B/C stand for row locators; they are not new catalogue products or native addresses. Mugs for tea / Mugs with tea / Mugs tea isolate stop-word distance. Ranking-variation snippets are independent documents at D weight.

P7 source-edit branch removes leading Blue from its description only; name and core stock unchanged. Configuration branch has its own one-row table and a private configuration, switching only ASCII-word mapping from english_stem to simple. It is not an application migration or change to built-in English config.

Continuity pass: vocabulary introduced in order source → token/lexeme → vector/query → position/phrase → field weights → GIN candidate → eligibility/rank → representation upkeep. Expressions use compatible explicit config. Figures explain model status. Stored vectors distinguished from index contents, matches from candidates, scoring from business eligibility. Parent owns wider method internals and write housekeeping; schema-change owns live migration procedure; vector owner retains embedding meaning and approximate retrieval evaluation. No requested central fact or ownership extension.
