# Example and continuity record

B17 is independent of the purchase execution. It starts at stock P3=12/P7=1/P9=4, catalogue prices4.50/20.00/35.00. Existing order103 agreements remain P7×1 at20.00 and P3×2 at4.50, total29.00. The runnable subset preserves these two lines to test reference refusal and agreement preservation; it omits unrelated customers/orders/payments tables and does not replay a purchase or change stock.

B17 identities and original proposals are fixed: (B17,1) P7/Blue mug/22.00; (B17,2) newP11/Tea strainer/8.00; (B17,3) P3/Green tea,50g/-4.50; (B17,4) P9/Teapot/36.00. Only names and catalogue prices are feed-owned. P11 inserts at stock0. Row3 is rejected for negative price and retained. Rows1/2 and their applied records commit together; the worker stops before starting row4’s chunk. At that point2applied+1rejected+1pending=4. Resume commits row4 and its applied record; final3applied+1rejected=4. Empty replay performs no further writes. No uncertain commit in this scenario.

Separate scenarios approved centrally in root’s message: duplicate-P7 proposed prices22.00/23.00, both rejected before application; stock replenishment starts at1 and adds2 to3, with accidental repeated delta giving5. The article’s duplicate table remains value-free; nearby prose and the verifier use22/23. These create no committed shared starting facts.

The guarded price example has two independent initial settings20.00 or22.00. Additional disposable verification uses a23.00 stale-price counterexample, broad update, negative constraint failure, referenced delete refusal and rollback. None is added to canonical shop history.

Importer boundary: one designated worker, immutable received input/decisions, no competing catalogue-field writer during application. SQL demonstrates ordinary final constraints, source uniqueness, atomic progress and known interruption. Permissions/procedure must enforce sealing; the sample does not implement role management, a multiworker claim protocol, source revision ordering or unknown-commit recovery. Application plumbing, concurrent invariant protocols and live backfill convergence stay with their named neighbours.
