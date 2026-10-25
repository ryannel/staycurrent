# Chosen shop scenarios

Independent purchase replay before order103 exists. Mina Shah/customer1 creates pending order103 at20October2026 10:15UTC. P7×1 at20.00 plus P3×2 at4.50 =29.00. No payment and no paid-status transition. P3 stock12→10; P7 stock1→0; P9 remains4. Existing101/102 and payments501–503 retained in downloadable SQL.

Approved work extension: `order-103-ack`, kind `order_received`, payload order103/customer1/total string29.00/message “Order received; payment still pending”. Insert with the purchase. Work identity/payload fixed through all delivery attempts. Caller request `purchase-103`, resulting order103, acknowledgement work identity and worker claim generations are distinct. No legal currency, address, retention duration or actual provider invented.

Approved illustrative schedule, centrally agreed:20October2026 A claims generation7 at10:16:00, deadline10:17:00. A pauses at10:16:20; expiry10:17:00; B claims8 at10:17:01, deadline10:18:01; A resumes/tries completion10:17:02 and is rejected; B completes10:17:03. Model starts after six earlier claims, which are not individually narrated or changes to shared core. Actual native clock values belong to verifier results and are not these fixed times.

Separate receiver contracts:

1. Delivery figure counts accepted acknowledgements, no real email. Without receiver deduplication an after-acceptance retry produces2; with atomic stable-ID/payload/effect/result contract it produces1. Before-call recovery produces1 either way; already-finished work is not retried.
2. Bounded external-resource fence: once receiver accepts generation8, it rejects lower7; without checking it,7 could run. Equality8 alone can repeat. These generations fence this one resource only if authority is allocated in its scope; unrelated per-job counters cannot be used as a shared-resource order.

Continuity pass: event means order received, never paid; explicit transaction replay versus starting rows; database row lock ends at commit while stored lease remains; expiry/complete/cancel/delete carry distinct meanings; all neighbour links use supplied exact destinations. Child/request recovery, general lock analysis and native change-feed setup remain with their owners. No unresolved shared-data extensions.
