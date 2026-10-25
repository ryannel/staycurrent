# Technical source checks · 25 October2026

External primary sources were opened with the web tool and checked against the manuscript claims. These are a claim map, not copied source text.

| Source | Claims checked |
| --- | --- |
| https://www.postgresql.org/docs/18/rangetypes.html | Half-open/inclusive bounds, omitted/unbounded bounds, tstzrange, overlap and exclusion approach |
| https://www.postgresql.org/docs/18/functions-range.html | @> contains an instant, && tests overlap, upper_inf identifies an omitted upper bound |
| https://www.postgresql.org/docs/18/btree-gist.html | Text equality in a multicolumn GiST exclusion constraint via btree_gist |
| https://www.postgresql.org/docs/18/ddl-constraints.html | Foreign key existence, NO ACTION/RESTRICT, CASCADE, SET NULL, required references, cross-row rules are not ordinary row CHECKs |
| https://www.postgresql.org/docs/18/indexes-partial.html | Unique predicate index applies only to included rows |
| https://www.postgresql.org/docs/18/routine-vacuuming.html | Old physical versions remain for readers and are later reclaimed; logical deletion is not immediate removal of every physical copy |
| https://www.postgresql.org/docs/18/ddl-system-columns.html | Transaction IDs and physical row location are not retained business history/long-term logical identity |
| https://learn.microsoft.com/en-us/sql/relational-databases/tables/temporal/overview?view=sql-server-ver17 | System-versioned history captures old rows and FOR SYSTEM_TIME queries; system period timestamps use UTC transaction begin, not business time or exact commit visibility |
| https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/individual-rights/right-to-erasure/ | Erasure is conditional, recipients/copies and backups need treatment. No legal conclusion or fixed duration imported. Page currently says guidance under review. |
| https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/data-sharing/anonymisation/how-do-we-ensure-anonymisation-is-effective/ | Removing direct identifiers does not establish anonymity; linkability and context matter. Page currently says guidance under review. |

The IBM bitemporal page was attempted but returned403; no claim relies on it. The two-time model and its outcomes are explicitly worked from the supplied scenario, rather than attributed to an uninspected source.

`verify-sql.mjs` generated the reader’s SQL file from model.mjs, then read and executed that exact file. It also compared all8 figure3 clock choices with engine results and checked missing recording coverage, unsafe open-end selection, excluded overlap versus an unprotected table, a legal gap, inclusive-bound double match, flag-preserving reference, mandatory-reference deletion/null rejection and partial unique restoration conflict. `sql-results.json` retains version, values and SQLSTATEs. All18 checks passed. Runtime: an owned in-memory PGlite0.5.8 instance, PostgreSQL18.3/WASM, closed in finally. No native database, default connection or concurrency run was used.
