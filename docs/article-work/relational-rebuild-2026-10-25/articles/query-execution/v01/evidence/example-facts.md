# Example and continuity

Core report is agreed order-line value on orders marked paid in October2026, UTC half-open bounds, grouped by customer and ordered descending value then customerID. Core result Tariq/customer2=40.00; Mina/customer1=39.50. Pending103 excluded; Edda3 has no row. Product prices are never used to reprice agreed lines. Payments are never joined into this report.

Root approved exact independent reporting fixture before measurements: 120000 generated orders100001–220000, customers1001–2000, exactly3lines/order, arithmetic offset20261025, no generated payments, preserving core rows. Fixture retains post103 stocks P3=10,P7=0,P9=4. Generated reporting history does not reconstruct stock.

For n=0..119999: day=(n*37+20261025)%365; noon UTC2026-01-01+day days. Customer1001 if n%10<7, otherwise1002+(n*17+20261025)%999. status_no=(n*53+20261025)%100. October is day273inclusive to304exclusive; paid iff status_no<90 there, or status_no<10 elsewhere. Every generated order has line1 P3/quantity1/4.50, line2 P7/1/20.00, line3 P9/1/35.00. These are deterministic modular rules, not random samples. Totals actually observed120003orders/360005lines,20158paid/9176Octoberpaid.

Root separately approved no-lines edge order900001, customer3, paid2026-10-25noonUTC. Only added after measured cases and removed with schema; no new core fact. Baseline HAVING COUNT(*)>0 deliberately preserves inner-join exclusion of empty orders. PGlite counterexample removing guard introduces Edda/null row; both guarded forms retain the original result.

Independent correlation arithmetic table10korders is labelled a separate model, not an observed fixture. Worker2×1000lines→4partialrows→2finalgroups is another labelled model; no exact byte sizes or distributed timing claims.
