# Blind first-reader notes — crdb-performance v01

Written before consulting plans, example facts, author notes or any verdict. Scope so far: rendered article, all five figures' labels/captions; Figure 1's four steps and covering switch; Figure 4's four designs; full article prose via rendered DOM; bounded comparison with the Indexes reference's clustered-table explanation/drawing and native-plan teaching passage. Browser desktop verified at 1280×720, System resolves dark. Further theme/phone and reference checks remain.

## What I learned from the figures alone

The history route finds adjacent secondary entries and may then use their order IDs to fetch status; storing status removes that access without changing the answer. Local SQL processing can fetch remote KV data. Distributed partial totals for the same customer need a final combination. A time-leading key preserves a busy edge; customer-first or customer-only hashing preserves a busy customer's concentration; whole-key hashing can disperse that customer's independent orders but requires multiple history searches. Hashing does not make two P7 stock decisions independent. These lessons form a useful sequence and are consistent with the prose.

## First reading

The opening states two useful questions (how much work, where it lands) and the article follows through. The history example remains concrete. The distinctions between returned rows, decoded rows, KV pairs and calls prevent a common wrong inference, and the observed 10 fetches/one call makes the point usefully. The lock-only experiment is clearly distinguished from a whole purchase. The final workload section turns the mechanisms into distinct testable predictions.

Headings are established technical subjects: “Covering indexes and index joins”, “Reading EXPLAIN ANALYZE”, “Distributed execution and fan-out”, “Sequential keys and hash-sharded indexes”. Prose generally develops one point into its consequence. The line “Moving older ranges spreads stored data while the new demand follows the edge” is particularly economical. Some evidence paragraphs are dense but still relevant; no article-wide editorial problem observed.

## Candidate substantive problem

“Reading EXPLAIN ANALYZE” tells me to start at the scan, inspect index/spans, and follow rows upwards, but never shows the actual native plan those instructions refer to. The counter comparison table is helpful evidence but removes operator hierarchy, the actual span syntax and the placement of the index join/limit. The native observations download is a separate detailed record. Against the Indexes reference, whose EXPLAIN section presents the bounded native Limit → Index Only Scan excerpt before explaining its parts, this leaves the newcomer to supply the most important mapping from the conceptual Figure 1 route to the real diagnostic output. Likely medium teaching finding, to assess against intended outcomes.

## Other observations to retain

Figure 1 makes the selected customer and unnecessary primary access visible; Figure 4's small letter model makes the design trade concrete. Figure 3 correctly shows no reduction in the tiny three-line case and states that limitation. Captions clearly label illustrative placement and symbolic bucket values. Desktop diagrams and controls readable in the states inspected; no conclusion yet on phone or light theme.
