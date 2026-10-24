# r06 writer record — Aggregates, windows and ordered results

Completed as a draft for independent review on 2026-10-24T00:47:13.129182+00:00.

## Development and author reread

The starting knowledge is the newly completed r05's correct join/result-grain teaching, alongside the supplied r00 entrance. This piece develops aggregation by changing five lines into three order totals, then makes count denominators and missing inputs concrete with Edda. WHERE/HAVING/FILTER precede windows so the reader knows which rows a calculation receives. The first visual compares collapsing Mina's two orders with retaining them beside the same customer total. The later frame figure displays actual membership for each current row rather than relying on an unexplained running-total number.

The finished source, native outputs and rendered captions/controls were reread as one piece against the full reference calibration. The final author reread changed 'attach after totalling' to 'carry alongside' to follow the displayed query precisely, and changed RANGE's 'elapsed interval' wording to 'time interval' so it does not imply fixed24-hour days under every session zone. Individual-position tie-breakers and shared-rank peers are deliberately separated, and the later snapshot question is handed to r07 rather than implying deterministic order freezes data.

Ordinary rendered QA found the selected GroupWindow button's fill overridden by shared CSS despite correct aria-pressed. Strengthened its scoped selected selector and confirmed actual computed colours in the final immutable preview. No structural defect remained; root final site check passed.

## Native evidence

Run: `python3 evidence/run-owned.py src/components/relational-collection/r06/downloads/windows-experiment.sql` using PostgreSQL 18.6 at /opt/homebrew/opt/postgresql@18/bin, no-locale UTF-8 and UTC. Actual elapsed time 0.786s. The downloadable SQL includes all eight exact displayed SQL blocks and captures each stage's result before adding the later tie rows. evidence/prepare.py reuses the unchanged minimal shared core fixture with explicit provenance from the prior owned r05 script; it does not read an old article version.

Native results include line counts2/1/2 and totals39.50/40/29, Edda's joined-row count1 versus order count0, Mina's HAVING/window total68.50, previous instant for103 from101, per-line mean21.70 versus per-order36.17, default peer counts1/2/3/5/5 versus ROWS1/2/3/4/5, latest orders105/102/106, last-value whole-frame106 and the separate40/30/30/20 ranking illustration. ROWS and seven-day RANGE outputs are also recorded. Counterexamples are tied to displayed data rather than arbitrary timings.

## Rendered and controls

Both grouped/window shapes and all six frame×current-row states were checked (see frame-control-checks.json). Default RANGE at105 counts5; explicit ROWS counts4;106 counts5; the whole partition counts5. Both text alternatives opened and read. Buttons activated with Space; a native select choice was committed with keyboard Down/Return and its count checked. Desktop 1280×720 and375×812 phone views were inspected in both themes, including current-row arrow/outline, in-frame labels, expression wrapping and table width. No horizontal overflow or browser errors.

The final selected-fill correction was inspected in light/dark and on the phone. Final visible text contrast minima:5.52:1 light and6.15:1 dark; current/frame emphasis is textual as well as coloured. Controls/text alternatives reset, System→dark restored, viewport reset and actual 1280×720 verified; tabs closed before this record.

## Assignment and reference exposure

Fresh coherent assignment: r05, then r06, then r07. Only the original-repository operational assignment was read; all article work used the three explicit clean /private/tmp workspaces. No old article, review, unrelated draft, history or other agent's source was inspected. No delegation, build/server ownership, shared infrastructure, commit, push or publication action was taken.

Applied the supplied current staycurrent-write, staycurrent-figures and staycurrent-continuity skills. Read all 19 bounded fixed-reference text parts once from the r05 workspace, separately at sufficient output: sequences 1–6, indexes 1–7 and storage 1–6. Every END marker was delivered. The helper validated source/text hashes. Studied every finished drawing with its explanation at the supplied 4350 URLs: 13 sequence drawings (also the focused booking/email alternatives),11 index drawings and 10 storage drawings. Controls and completed outcomes were inspected. No viewport or theme changes during calibration; reference tabs closed. Root verified exact text delivery and acknowledged rendered study before any design/source. This complete identical calibration applies once to the coherent three-article assignment; it was not replaced by summaries or repeated between articles. Provenance is in evidence/reference-calibration.json.

The references led the use of one continuing example, concrete reader questions, explicit things to compare, explanation before/after each figure, and a clear separation between an illustrative drawing and native observations. Figure type and section sequence were selected by this writer from the learning problem; no visual prescription was received.

## Verification boundaries and handoff

Root exclusively owns routes, builds, publication exclusion and previews. Root's exact final integrated build passed with zero site-check issues; evidence/structure-check.json is its receipt. An earlier full desktop/375px author pass used immutable 4374/4376 pages. A focused final pass used current 4380 output for the affected presentation and final contrast. These are ordinary author checks, not independent review verdicts. Root will arrange the commissioned independent batch reviews.

All native execution was on an owned disposable PostgreSQL 18.6 Homebrew instance through its private socket, with inherited PG connection settings removed and psql -X. Ownership was verified using data_directory/current_user before creating or modifying inputs. Servers, sessions, data directories and sockets were removed after success; evidence/native-output.txt records completion. No existing database, production credential, hosted service, other engine or benchmark was used. Timings in evidence are diagnostic elapsed execution times, not article performance promises.

Download bytes were checked with bounded read-only HTTP requests on the gated 4368 endpoints, matched to the executed source and SHA256, and returned text/plain plus the intended attachment filename. See evidence/download-http.json. Immutable static outputs omit the trailing slash in their rendered file links, whereas the development endpoints use it. There was no unbounded browser download-event/path wait and no claim about the browser's final native save location.

Native evidence is tied to the unchanged downloadable artifact bytes and actual query/data/environment. The final CSS and stated prose clarifications did not alter those native mechanisms. evidence/source-manifest.json captures current source, shared data, download and verifier hashes plus current SQL-block hashes. Theme-safe styles use supplied site tokens. Text alternatives, visible result labels and named controls accompany the interactive figures. Author screenshots and DOM receipts remain in evidence/. No automated screen-reader or broad assistive-technology certification is claimed.
