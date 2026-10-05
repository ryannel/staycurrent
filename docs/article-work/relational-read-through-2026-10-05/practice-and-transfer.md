# Practice and transfer follow-up

The user authorised three follow-ups: dogfood the SQL setup, run a real first-time-reader session, and add transfer exercises. The setup and exercises are ready as drafts. The human session is prepared but awaits a participant; no human observations have been collected.

## What changed

`/learn/databases/relational/practice/` now supplies one complete local PostgreSQL route: start Docker, wait for readiness, download and copy SQL, create separate article databases, enter psql, load the base, check its receipt and order count, recover temporary filter tables after reconnecting, and stop the disposable instance. The collection navigation and article setup passages link to it. Complete worked downloads are distinguished from following mutating article examples one statement at a time.

The JSON path has its own download through typed capacity, excluding the incompatible alternative table design. All four practice downloads use ordinary SQL file URLs. Astro had embedded them as data URLs; browser saving failed until the imports disabled inlining. The save API used hashed source filenames, so the guide explains replacing the source filename while preserving the container destination.

Three contextual prediction exercises ask the reader to apply earlier teaching: a catalogue change and historical receipt, a third line and shipment, and an empty recovery lookup after a lost commit reply. Answers remain closed until requested and explain the reasoning. Their preceding sections supply the required facts. Technical and fresh-reader reviews are linked below.

The review skill and its Claude mirror now carry the demonstrated lessons about delivered downloads, session lifetime, completed scripts, contextual exercises and preserving uncued human observations. Both skill validations passed.

The retry article now explicitly ends the successful SQL branch with COMMIT and explains how to finish the matching and conflicting duplicate branches. Previously a reader pasting the displayed SQL could stop with a provisional order.

## Checks and their limits

The local machine had no running PostgreSQL server and Docker Desktop was stopped. The test started its existing Docker installation, pulled the official `postgres:18` image, and followed the new disposable-container route without publishing a port or mounting user files. The running engine reported PostgreSQL 18.6, Debian `18.6-1.pgdg13+2`; image digest `sha256:5a5a84b19854a9ffaa54082c166ff4ec27473a361e496e5ea167f298f2da9722`. Docker installation itself was a prerequisite, not tested as a new install. The shell used was macOS zsh; the start command was made one line after review identified incompatible Windows continuation syntax. No Windows execution is claimed.

The four files were saved from the built browser links, then copied into the container under the guide’s filenames. The design and query routes used interactive psql, including `\i` and `\pset null`. The JSON, pagination and completed retry branches used the equivalent psql file-script mode, which sends statements separately.

| Probe | Observed result |
| --- | --- |
| Fresh design base | O12: Blue mug, 2, €18, €36; two orders |
| Catalogue-change variation | Sea-blue mug, 2, €18, €36; change rolled back |
| Query extension, same session | Expected joins and aggregates; three temporary filter customers |
| Reconnect | Temporary filter table absent; filter-only setup restored the four-row ON result and two-row WHERE result |
| Third line and shipment | Nine pairs; raw sum €192, DISTINCT sum €44; separate goods €64 and three shipments; change rolled back |
| Complete JSON path | Ceramic query matched P7 before final update; final stoneware description, typed capacity 350, no JSON capacity copy |
| Pagination script | First page O16/O15; five independent change experiments rolled back; cursor batches 2/2/1; oldest two headers returned all three lines |
| New and repeated K14 checkout | First claim O14, remaining stock 1, line committed; repeated claim inserted no row and recovered O14 without another reservation |

The lost-reply exercise remains a documented reasoning scenario; this follow-up did not sever a live connection around COMMIT or reproduce a concurrent claim wait. Its factual support was reviewed against PostgreSQL’s uniqueness, Read Committed and retry documentation. The actual successful and duplicate SQL branches were executed.

The built guide and exercises were inspected in light and dark at desktop and phone widths. Native answer disclosures opened with Enter, showed a visible focus outline, and stayed within the page width. The wider setup table and SQL commands use their labelled scroll regions; the setup command region scrolled with ArrowRight. `pnpm build` passed with 51 pages, and 1,167 local links from the built relational pages resolved, including fragments. The temporary practice container and local QA server were removed after verification; saved SQL downloads remain available.

## Independent evidence and next human step

- [Fresh-reader questions and contextual exercise recheck](practice-first-reader.md)
- [Technical review and repair resolution](practice-final-technical-review.md)
- [Independent technical execution results](practice-final-technical-results.json)
- [Actual PostgreSQL practice transcripts](practice-postgres-results.json)
- [Browser reveal and width checks](practice-ui-results.json)
- [Practice guide layout and scroll regions](practice-guide-ui-results.json)
- [Participant instructions and facilitator notes](reader-session.md)

The session packet preserves an uncued opening read and prediction before revealing the answer, records assistance and unfinished steps, and keeps targeted closing questions in facilitator-only notes. A real participant must supply the observations. Agent review and a successful SQL run do not establish how a novice human experiences the pages.
