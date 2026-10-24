# r05 writer record — Joins and the meaning of a result row

Completed as a draft for independent review on 2026-10-24T00:47:13.129182+00:00.

## Development and author reread

The starting context was the complete supplied r00 and r02 drafts. The article develops a join's pairing rule through the still-due question: first one match through a unique customer key, then an order line's grain, then the two-independent-collections multiplication. The two-by-two line/payment comparison reveals why an apparently correct zero balance can hide doubled contributions. It then contrasts that result with one total on each side. The second figure isolates ON versus WHERE using the same recorded card payments.

The full finished body and its figures, captions, control labels and text alternatives were reread from the newcomer starting point, against the complete fixed-reference calibration. The report was kept as the sustained question, with grouping detail passed naturally to r06 and physical plans to the execution article. The author finishing pass resolved the incomplete-order policy explicitly rather than silently pricing an order with no lines at zero. It also distinguishes no-payment absence from a positive balance and explains why DISTINCT cannot recover identities.

Root's first structural integration found h3 panel labels inside a figure invalid under the site contract. Replaced them with styled strong paragraph labels before author QA. This was a mechanical integration correction, not external editorial feedback.

## Native evidence

Run: `python3 evidence/run-owned.py src/components/relational-collection/r05/downloads/joins-experiment.sql` with /opt/homebrew/opt/postgresql@18/bin, PostgreSQL 18.6, no-locale UTF-8, UTC. Actual elapsed time 1.018s, recorded in native-output.txt. The downloadable SQL is built from shared JSON rows and the exact six displayed SQL blocks by evidence/prepare.py.

The detailed join produced79.00/79.00 for101 and lost103. The correct three report rows were39.50/39.50/0,40/40/0 and29/0/29; order total108.50, paid79.50, due29. Native assertions cover those identities/totals, customer/order absence, the NULL-bearing NOT IN counterexample, and SUM(DISTINCT) merging distinct equal-valued contributions. Synthetic order999 is an explicitly separate test of the missing-line policy, not a new shared shop fact. The reduced temporary input schema is for query semantics, not a test of all introductory constraints.

## Rendered and controls

Both multiplication choices, both outer-filter placements, their selected states, both expandable text alternatives, and Space activation were checked. The visible WHERE result has101/102 only; ON restores103 with missing payment columns. Desktop 1280×720 and phone 375×812 were inspected in light and dark. No page/figure horizontal overflow; no browser errors. Phone cards stack readably. Final measured visible text contrast minima:6.03:1 light,6.15:1 dark. Accent emphasis/focus uses the same theme tokens. Sources and SQL remain accessible through the normal shell.

After the final current 4380 check, figures were restored to initial selections, alternatives closed, System theme restored (resolved dark), viewport reset and actual 1280×720 confirmed; tabs closed before this record.

## Assignment and reference exposure

Fresh coherent assignment: r05, then r06, then r07. Only the original-repository operational assignment was read; all article work used the three explicit clean /private/tmp workspaces. No old article, review, unrelated draft, history or other agent's source was inspected. No delegation, build/server ownership, shared infrastructure, commit, push or publication action was taken.

Applied the supplied current staycurrent-write, staycurrent-figures and staycurrent-continuity skills. Read all 19 bounded fixed-reference text parts once from the r05 workspace, separately at sufficient output: sequences 1–6, indexes 1–7 and storage 1–6. Every END marker was delivered. The helper validated source/text hashes. Studied every finished drawing with its explanation at the supplied 4350 URLs: 13 sequence drawings (also the focused booking/email alternatives),11 index drawings and 10 storage drawings. Controls and completed outcomes were inspected. No viewport or theme changes during calibration; reference tabs closed. Root verified exact text delivery and acknowledged rendered study before any design/source. This complete identical calibration applies once to the coherent three-article assignment; it was not replaced by summaries or repeated between articles. Provenance is in evidence/reference-calibration.json.

The references led the use of one continuing example, concrete reader questions, explicit things to compare, explanation before/after each figure, and a clear separation between an illustrative drawing and native observations. Figure type and section sequence were selected by this writer from the learning problem; no visual prescription was received.

## Verification boundaries and handoff

Root exclusively owns routes, builds, publication exclusion and previews. Root's exact final integrated build passed with zero site-check issues; evidence/structure-check.json is its receipt. An earlier full desktop/375px author pass used immutable 4374/4376 pages. A focused final pass used current 4380 output for the affected presentation and final contrast. These are ordinary author checks, not independent review verdicts. Root will arrange the commissioned independent batch reviews.

All native execution was on an owned disposable PostgreSQL 18.6 Homebrew instance through its private socket, with inherited PG connection settings removed and psql -X. Ownership was verified using data_directory/current_user before creating or modifying inputs. Servers, sessions, data directories and sockets were removed after success; evidence/native-output.txt records completion. No existing database, production credential, hosted service, other engine or benchmark was used. Timings in evidence are diagnostic elapsed execution times, not article performance promises.

Download bytes were checked with bounded read-only HTTP requests on the gated 4368 endpoints, matched to the executed source and SHA256, and returned text/plain plus the intended attachment filename. See evidence/download-http.json. Immutable static outputs omit the trailing slash in their rendered file links, whereas the development endpoints use it. There was no unbounded browser download-event/path wait and no claim about the browser's final native save location.

Native evidence is tied to the unchanged downloadable artifact bytes and actual query/data/environment. The final CSS and stated prose clarifications did not alter those native mechanisms. evidence/source-manifest.json captures current source, shared data, download and verifier hashes plus current SQL-block hashes. Theme-safe styles use supplied site tokens. Text alternatives, visible result labels and named controls accompany the interactive figures. Author screenshots and DOM receipts remain in evidence/. No automated screen-reader or broad assistive-technology certification is claimed.
