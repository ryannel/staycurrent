# Example and continuity

- Reuses parent distribution’s illustrative A(customer1 Mina), B(customer2 Tariq), C(customer3 Edda), P(shared products), without asserting a hash function or one customer per physical shard.
- Post103 history:101 paid39.50;102 paid40;103 pending29/no payment. Report returns Tariq40 then Mina39.50; it measures agreed paid-order line values, not payments.
- Purchase is an explicitly independent pre103 replay: P7 1→0, P3 12→10; two lines; request purchase-103 fixed payload P7×1 at20/P3×2 at4.50; no payment. No shared business facts changed.
- The candidate Citus customer-distributed copy carries customer_id on lines; pair uniqueness is explicitly weaker than original order_id uniqueness. (1,103)/(2,103) is a counterexample, not valid new shop rows. No accepted migration or global ID protocol is asserted.
- Shared product reference projection is IDs/names; current stock remains one separate authority, not independent worker allowances.
- Generated count reuses exact customer selection formula,120000 orders and84000 for1001. Only cardinality calculation repeated; no generated workload benchmarks/traffic inferred.
- Paused groupA transfer adds local illustrative S/D location labels, durable route authority C and generations1/2. C/S/D are separate native clusters inside a single owned container. They are not independent failure domains or Raft memberships.
- Native fixture moves only Mina’s customer/order/line/payment/request-result slice, excludes product table and its actual foreign keys, and tests guarded result recovery rather than a new purchase. Original global reference and purchase contract are requirements discussed, not established by that fixture.
- Gate uses SELECT FOR SHARE held by transaction; closer UPDATE waits. Runtime has no direct table grants; root tests SET ROLE as a mechanism, not production authentication. All-writer coverage, controller recovery and routing-authority protection remain explicit production obligations.
- After D accepts later writes, return is conditional reconciliation/reverse transfer. Native fixture did not assert new business writes at D or controller crashes.

Complete author continuity reread finished against the final private preview. No central shared-fact extension needed.
