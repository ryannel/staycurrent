# Collection planning decisions

- Carry the illustration-led modelling candidate and plan forward unchanged in reader content, pending first independent review in the opening batch.
- Query results owns the narrow per-order GROUP BY/SUM summary required to complete the still-due report without multiplying line/payment amounts. General grouping/HAVING/FILTER, broader empty/count distinctions, windows and ordering methods have a separate owner.
- Query results owns the compact set-operation distinction: stacking compatible result rows, duplicate handling and its difference from joins. No thin extra child is required for that distinction alone.
- Provisionally consolidate generic storage/row versions and WAL/crash recovery into Storage and durability. Keep all generic storage/cleanup/restart outcomes explicit and native PostgreSQL procedures separately owned. Map both earlier routes to the combined owner; tree review will assess the complete route.

- Accept query scenarios reserving payment 504 (10.00 towards 103, leaving 19.00 due) and the optional equal-value order-102 lines. These do not replace starting rows; the shared example records both.
