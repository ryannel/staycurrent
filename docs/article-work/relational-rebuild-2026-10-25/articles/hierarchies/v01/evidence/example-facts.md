# Chosen scenarios and continuity

Authority: supplied docs/coverage/relational-rebuild-2026-10-25-example.md, Hierarchy variations; incoming responsibility from data-modelling.

IDs unchanged: 0 Catalogue, 10 Teaware, 11 Mugs, 12 Blue mugs, 20 Gifts. Baseline direct edges 0→10,10→11,11→12,0→20. No products/memberships/orders added.

Independent variations: move Mugs by replacing 10→11 with20→11; shared ancestry adds20→11 while retaining10→11; rejected edge12→10; opposing10-under20/20-under10 attempts. Explicit synthetic Catalogue root. Blue mugs insertion is construction of the existing baseline, starting temporarily without12, not a new category extension.

Baseline path12=0.10.11.12; moved path12=0.20.11.12. Baseline tree closure12 pairs; moved12 pairs. Four outside crossing pairs deleted/four inserted, with root pairs returning at unchanged depths; net delete10→11/12 and add20→11/12. DAG distinct closure14 pairs, root path result7 rows but5 IDs. Deleting20→11 retains root reachability to11/12 through10.

Baseline bounds:0(1,10),10(2,7),11(3,6),12(4,5),20(8,9). Moved:0(1,10),10(2,3),20(4,9),11(5,8),12(6,7). Four logical bound rows differ; rebuild deletes/inserts all5. Bounds reserve marker IDs outside0..2147483646. Path/closure/bounds keep parentage authoritative. Multiple-parent scenario uses separate node/edge tables and depth-free pair closure.

Reader continuity pass: tree/forest/DAG and self inclusion introduced before recursion; grain of path versus reachable node explicit; cycle detection distinct from prevention; protected adjacency move precedes derived maintenance; old_path/destination only in clearly labelled function-body statements; closure depth qualified as tree-only; every main scenario resets to baseline, while figure3 uses its separately stated opposing branch move. General constraints/isolation/lifecycle/indexing delegated through exact canonical links. No unresolved shared-fact dependency.
