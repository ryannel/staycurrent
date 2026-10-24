# Focused heading repair: r02–r19

All 18 assigned articles were read in full and checked for article/section naming. 107 literal h2/h3 heading texts changed. All article titles were judged suitable and retained; all metadata files are byte-identical. No h4 headings were present.

The frozen delivery batches are `ready-1.json` (r02–r06), `ready-2.json` (r07–r11), `ready-3.json` (r12–r16), and `ready-4.json` (r17–r19). Each lists exact old → new pairs and the final article SHA-256. All 18 files match those manifests.

Calibration used the actual fixed reference names and the relevant explanations: Indexes names “Index entries and row locations”, “B-tree”, “Range scans”, “Composite (multicolumn) indexes” and “Write cost and upkeep”; Storage and durability uses “Pages”, “Row versions and undo logs”, “What COMMIT waits for”, “Crash recovery” and “Asynchronous commit”; Sequence diagrams uses “How much to draw”, “Choosing what to draw”, “Flows with no caller”, “Fork and stair” and “Other dialects”. These permit short subject names and contextual questions rather than a miniature summary in each heading. The surrounding reference passages confirm how those names introduce developed subjects.

Repairs remove strained lesson slogans, metaphors and vague directions where ordinary names work better: for example, r10’s “Jump to the start, then walk” becomes “B-tree searches and range scans”, r08’s “A duplicate is a question” becomes “Upserts and source versions”, and r19’s “Prove the boundary” becomes “Choosing and checking a recovery target”. Useful existing names remain, including r02’s “Which local day?”, r03’s “Rules about one row”, r06’s “Ties and frames”, r07’s “What the cursor carries”, r11’s “Estimated work and measured work”, r14’s “What a row lock stops”, r15’s “Pages and addresses” and “What an update writes”, and r17’s “What fencing adds”. No universal standalone-heading rule was imposed.

Continuity was checked within each article: the new names fit the surrounding explanations and later uses, while all example facts, terminology, narrative, links and sources remain unchanged. Names such as request keys, source versions, claim tokens and snapshots keep their existing distinctions.

Preservation was checked again across all 18 final files: masking only literal h2/h3/h4 inner text leaves identical byte sequences; opening/closing tags, levels, attributes and IDs are retained; every metadata file is byte-identical. The manifests record equal before/after nonheading hashes and metadata hashes. No source outside r02–r19 was edited.

This is the requested editorial naming repair, not a new technical, teaching or corpus review. No technical claims, examples, figures, controls or body prose were revised. No build, server, browser or native experiment was run. Integration, rendered checks, Git and publication belong to the coordinator.
