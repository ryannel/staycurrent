# Example and continuity record

No shared business facts or ownership changes proposed.

- Main lookup and customer index start after103: P3 stock10, P7 stock0, P9 stock4. P7 price20.00. Mina/customer1 has101 paid and103 pending; Tariq/customer2 has102 paid. Index figure shows selected columns only.
- Independent physical-storage replay: P7 price20.00→22.00; stock10/0/4, pending103, agreed line total29.00 and no payment remain. t₁/t₂ are illustrative MVCC version timestamps, not business effective/recording times. No claim that the drawn native version keys were inspected.
- Figure6 explicitly returns to before purchase103, independent of price change: P7 price20.00/stock1, P3 stock12; creates103 pending and its two supplied lines, yields0/10, no payment. Reference/constraint and supporting-index work omitted from drawing, without a fixed native range count.
- Price2.20 is explicitly a separate mistaken-change illustration. No native recovery or restore is claimed.
- Local model choices: gateway node4 has no replica of rangeA; nodes1/2/3 are its initial voters and node2 its leaseholder/leader. Roles are per range. Invented placement, not fixture topology.
- Fixed-membership agreement model uses current-term U, durable acknowledgements and non-malicious replicas. U is a compressed command for the price change, not a claim that one Raft command is a complete SQL commit. Applied price is local state; transaction outcome remains separately labelled.
- Split model places P3 left of a boundary beforeP7 and P7/P9 right. Initial copies1/2/3, right replacement2/3/4, lease2→4. These are illustrative boundaries and a deliberately separated movement schedule, not actual automatic native balancing.
- Qualitative demand options are independent key demand versus all demand onP7. No rates, timing or speedup are measured or promised.
- Three-region consequence uses one voter per regionA/B/C and leaseA. It derives remote dependencies without configuring table locality or claiming region survival.

Continuity reread covered body, all seven figures, every changing step, captions, text alternatives and controls. Definitions precede uses: KV before descriptors, range before replica roles, local WAL before comparison, MVCC before version figure. The purchase reset is explicit. Native single-node evidence will be reported independently from the three-voter model.
