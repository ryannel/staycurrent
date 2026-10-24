# Visual first-reading supplement · r44 · batch11-v01

Inputs read: exact batch11/v01/manifest.json identity/restrictions and mechanical/applicability.md; current isolated figure route on 4522; current keys-and-ranges article on 4522 only after the four Figure 1 combinations. No source, plan, history, earlier review or peer finding was read. This is the commissioned narrow first-reading/context facet, not a replacement full visual perspective on r44.

Highest severity: none in this facet.

## Read order and calibration

Before r44, I inspected all 34 styled fixed-reference drawings with their rendered explanations at 4350: Sequence diagrams Figures 1–13, Indexes Figures 1–11, Storage and durability Figures 1–10. I used full-figure rendered screenshots and the current rendered captions/explanations, with stepped drawings also inspected beyond their starting state. The 19-article text calibration is outside this role.

Actual browser viewport was verified as 1280 × 720. I then opened `/review/relational-collection/figures/r44/`, without reading article prose, and exercised Figure 1's native Layout and Read selects. I verified changed summaries and screenshots after each selection, in this order:

| Layout | Read | First apparent meaning |
| --- | --- | --- |
| Before primary split | Order 103 by primary key | One highlighted primary entry answers the specified shop/order key; none of the secondary entries is needed. R1 contains all three primary entries. |
| Before primary split | Mina’s orders by customer index | Two adjacent customer-index keys locate primary orders 101 and 103, both in R1. The highlights and explicit `locates primary` labels connect the two orders. |
| After split at (10, 103) | Mina’s orders by customer index | The same two secondary keys locate the same rows; the primary fetches now cross R1/R2. The boundary appears before 103 and the secondary run remains unchanged. |
| After split at (10, 103) | Order 103 by primary key | The same SQL key selects 103, now in R2, whose lower boundary includes 103. The secondary run remains unused. |

Before prose, the figure appeared to distinguish an index's ordering from the ranges owning its keys. The slash-separated numbers read as symbolic compound keys, supported by the explicit note that byte encodings, families and versions are omitted. I did not infer that the strings were literal stored bytes or that the primary and secondary runs shared one range. The split marker is restrained, but its boundary text and changing result made its meaning recoverable without the article. I had no unresolved first-reading uncertainty that stopped this comparison.

## In place

Only after all four combinations, I followed the article link and read the current article's explanation, including the passages around Figure 1. It confirms the reading: customer-prefix entries locate primary rows; a split changes the primary intervals involved without changing Mina's identity or the answer; separate indexes occupy separate portions of key space. The distinction between printed keys and real encodings is established before the drawing. The later native split account is explicitly separated from the invented range labels. I found no contradiction between the isolated reading and that context.

## Limits

This supplement reports Figure 1's isolated first reading and its resolution in context only. It does not claim new full r44 coverage of code execution, quorum playback, keyboard endpoints, themes, phone layout, contrast or native split reproduction. Those belong to the coordinator's separately reconciled r44 coverage. No browser download was attempted; saving is unverified. This assignment also has a separate full batch12 visual report.
