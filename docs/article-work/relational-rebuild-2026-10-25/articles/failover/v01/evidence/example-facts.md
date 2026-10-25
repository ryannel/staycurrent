# Example facts and continuity

Retains the supplied independent P7 catalogue experiment:20.00→22.00. H/U/C symbolic history/change/commit labels match the parent. A has a complete usable durable chain through C, replay before U; B lacks U/C. New snapshots on A after replay see22.00. B without additional history remains20.00. No native LSN, event timestamp, rate or log-size claim.

Core retained facts: post-103 stock P3/P7/P9=10/0/4; order103 pending; no payment103; agreed lines P7×1 at20.00 and P3×2 at4.50; total29.00. Catalogue edits never reprice the agreement. SQL verifier uses only an isolated projection of these facts, with no added business IDs or operations.

Local topology assumptions: monitor+A may lose contact with primary while an existing pool retains a direct connection. Safe illustration uses confirmed independent power fencing plus restart exclusion. Figure1 assumes candidate data ready to separate authority from history; Figure2 handles history explicitly. Figure3 follows B's lossy path; its later commits remain symbolic and add no shop facts. Token7/8 hypothetical receiver contract illustrates resource-scoped enforcement, independently of database fencing.

No change to shared business facts or neighbouring ownership requested. Native commands and return prerequisites delegated by links to pg-replication; detailed business/external-effect reconciliation remains with backups; retry identity stays with retry-outcomes; consensus/membership detail remains with distribution and cluster-change. Author continuity reread includes all captions, options, text alternatives and later uses.
