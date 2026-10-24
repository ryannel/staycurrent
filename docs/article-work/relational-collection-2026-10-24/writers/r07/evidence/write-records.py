from pathlib import Path
import datetime,hashlib,json,re
now=datetime.datetime.now(datetime.timezone.utc).isoformat()
shared='''## Assignment and reference exposure

Fresh coherent assignment: r05, then r06, then r07. Only the original-repository operational assignment was read; all article work used the three explicit clean /private/tmp workspaces. No old article, review, unrelated draft, history or other agent's source was inspected. No delegation, build/server ownership, shared infrastructure, commit, push or publication action was taken.

Applied the supplied current staycurrent-write, staycurrent-figures and staycurrent-continuity skills. Read all 19 bounded fixed-reference text parts once from the r05 workspace, separately at sufficient output: sequences1–6, indexes1–7 and storage1–6. Every END marker was delivered. The helper validated source/text hashes. Studied every finished drawing with its explanation at the supplied4350 URLs: 13 sequence drawings (also the focused booking/email alternatives),11 index drawings and10 storage drawings. Controls and completed outcomes were inspected. No viewport or theme changes during calibration; reference tabs closed. Root verified exact text delivery and acknowledged rendered study before any design/source. This complete identical calibration applies once to the coherent three-article assignment; it was not replaced by summaries or repeated between articles. Provenance is in evidence/reference-calibration.json.

The references led the use of one continuing example, concrete reader questions, explicit things to compare, explanation before/after each figure, and a clear separation between an illustrative drawing and native observations. Figure type and section sequence were selected by this writer from the learning problem; no visual prescription was received.
'''
common_end='''## Verification boundaries and handoff

Root exclusively owns routes, builds, publication exclusion and previews. Root's exact final integrated build passed with zero site-check issues; evidence/structure-check.json is its receipt. An earlier full desktop/375px author pass used immutable4374/4376 pages. A focused final pass used current4380 output for the affected presentation and final contrast. These are ordinary author checks, not independent review verdicts. Root will arrange the commissioned independent batch reviews.

All native execution was on an owned disposable PostgreSQL18.6 Homebrew instance through its private socket, with inherited PG connection settings removed and psql -X. Ownership was verified using data_directory/current_user before creating or modifying inputs. Servers, sessions, data directories and sockets were removed after success; evidence/native-output.txt records completion. No existing database, production credential, hosted service, other engine or benchmark was used. Timings in evidence are diagnostic elapsed execution times, not article performance promises.

Download bytes were checked with bounded read-only HTTP requests on the gated4368 endpoints, matched to the executed source and SHA256, and returned text/plain plus the intended attachment filename. See evidence/download-http.json. Immutable static outputs omit the trailing slash in their rendered file links, whereas the development endpoints use it. There was no unbounded browser download-event/path wait and no claim about the browser's final native save location.

Native evidence is tied to the unchanged downloadable artifact bytes and actual query/data/environment. The final CSS and stated prose clarifications did not alter those native mechanisms. evidence/source-manifest.json captures current source, shared data, download and verifier hashes plus current SQL-block hashes. Theme-safe styles use supplied site tokens. Text alternatives, visible result labels and named controls accompany the interactive figures. Author screenshots and DOM receipts remain in evidence/. No automated screen-reader or broad assistive-technology certification is claimed.
'''
records={
'r05':'''# r05 writer record — Joins and the meaning of a result row

Completed as a draft for independent review on {now}.

## Development and author reread

The starting context was the complete supplied r00 and r02 drafts. The article develops a join's pairing rule through the still-due question: first one match through a unique customer key, then an order line's grain, then the two-independent-collections multiplication. The two-by-two line/payment comparison reveals why an apparently correct zero balance can hide doubled contributions. It then contrasts that result with one total on each side. The second figure isolates ON versus WHERE using the same recorded card payments.

The full finished body and its figures, captions, control labels and text alternatives were reread from the newcomer starting point, against the complete fixed-reference calibration. The report was kept as the sustained question, with grouping detail passed naturally to r06 and physical plans to the execution article. The author finishing pass resolved the incomplete-order policy explicitly rather than silently pricing an order with no lines at zero. It also distinguishes no-payment absence from a positive balance and explains why DISTINCT cannot recover identities.

Root's first structural integration found h3 panel labels inside a figure invalid under the site contract. Replaced them with styled strong paragraph labels before author QA. This was a mechanical integration correction, not external editorial feedback.

## Native evidence

Run: `python3 evidence/run-owned.py src/components/relational-collection/r05/downloads/joins-experiment.sql` with /opt/homebrew/opt/postgresql@18/bin, PostgreSQL18.6, no-locale UTF-8, UTC. Actual elapsed time1.018s, recorded in native-output.txt. The downloadable SQL is built from shared JSON rows and the exact six displayed SQL blocks by evidence/prepare.py.

The detailed join produced79.00/79.00 for101 and lost103. The correct three report rows were39.50/39.50/0,40/40/0 and29/0/29; order total108.50, paid79.50, due29. Native assertions cover those identities/totals, customer/order absence, the NULL-bearing NOT IN counterexample, and SUM(DISTINCT) merging distinct equal-valued contributions. Synthetic order999 is an explicitly separate test of the missing-line policy, not a new shared shop fact. The reduced temporary input schema is for query semantics, not a test of all introductory constraints.

## Rendered and controls

Both multiplication choices, both outer-filter placements, their selected states, both expandable text alternatives, and Space activation were checked. The visible WHERE result has101/102 only; ON restores103 with missing payment columns. Desktop1280×720 and phone375×812 were inspected in light and dark. No page/figure horizontal overflow; no browser errors. Phone cards stack readably. Final measured visible text contrast minima:6.03:1 light,6.15:1 dark. Accent emphasis/focus uses the same theme tokens. Sources and SQL remain accessible through the normal shell.

After the final current4380 check, figures were restored to initial selections, alternatives closed, System theme restored (resolved dark), viewport reset and actual1280×720 confirmed; tabs closed before this record.
''',
'r06':'''# r06 writer record — Aggregates, windows and ordered results

Completed as a draft for independent review on {now}.

## Development and author reread

The starting knowledge is the newly completed r05's correct join/result-grain teaching, alongside the supplied r00 entrance. This piece develops aggregation by changing five lines into three order totals, then makes count denominators and missing inputs concrete with Edda. WHERE/HAVING/FILTER precede windows so the reader knows which rows a calculation receives. The first visual compares collapsing Mina's two orders with retaining them beside the same customer total. The later frame figure displays actual membership for each current row rather than relying on an unexplained running-total number.

The finished source, native outputs and rendered captions/controls were reread as one piece against the full reference calibration. The final author reread changed 'attach after totalling' to 'carry alongside' to follow the displayed query precisely, and changed RANGE's 'elapsed interval' wording to 'time interval' so it does not imply fixed24-hour days under every session zone. Individual-position tie-breakers and shared-rank peers are deliberately separated, and the later snapshot question is handed to r07 rather than implying deterministic order freezes data.

Ordinary rendered QA found the selected GroupWindow button's fill overridden by shared CSS despite correct aria-pressed. Strengthened its scoped selected selector and confirmed actual computed colours in the final immutable preview. No structural defect remained; root final site check passed.

## Native evidence

Run: `python3 evidence/run-owned.py src/components/relational-collection/r06/downloads/windows-experiment.sql` using PostgreSQL18.6 at /opt/homebrew/opt/postgresql@18/bin, no-locale UTF-8 and UTC. Actual elapsed time0.786s. The downloadable SQL includes all eight exact displayed SQL blocks and captures each stage's result before adding the later tie rows. evidence/prepare.py reuses the unchanged minimal shared core fixture with explicit provenance from the prior owned r05 script; it does not read an old article version.

Native results include line counts2/1/2 and totals39.50/40/29, Edda's joined-row count1 versus order count0, Mina's HAVING/window total68.50, previous instant for103 from101, per-line mean21.70 versus per-order36.17, default peer counts1/2/3/5/5 versus ROWS1/2/3/4/5, latest orders105/102/106, last-value whole-frame106 and the separate40/30/30/20 ranking illustration. ROWS and seven-day RANGE outputs are also recorded. Counterexamples are tied to displayed data rather than arbitrary timings.

## Rendered and controls

Both grouped/window shapes and all six frame×current-row states were checked (see frame-control-checks.json). Default RANGE at105 counts5; explicit ROWS counts4;106 counts5; the whole partition counts5. Both text alternatives opened and read. Buttons activated with Space; a native select choice was committed with keyboard Down/Return and its count checked. Desktop1280×720 and375×812 phone views were inspected in both themes, including current-row arrow/outline, in-frame labels, expression wrapping and table width. No horizontal overflow or browser errors.

The final selected-fill correction was inspected in light/dark and on the phone. Final visible text contrast minima:5.52:1 light and6.15:1 dark; current/frame emphasis is textual as well as coloured. Controls/text alternatives reset, System→dark restored, viewport reset and actual1280×720 verified; tabs closed before this record.
''',
'r07':'''# r07 writer record — Pagination and consistent exports

Completed as a draft for independent review on {now}.

## Development and author reread

Starting knowledge came from the newly completed r06 and the complete supplied r13 snapshot draft (plus r00 entrance). The article first gives OFFSET a precise meaning, then makes cancelling101 and moving103 visibly change positional continuation. It derives the full (placed_at,order_id) boundary at the105/106 tie. Query identity, precision, nullable ordering, direction and the cost of discarded rows follow from that boundary. The second half gives an export its separate snapshot promise and follows a writer cancelling103 between two batches.

The complete piece, source examples, browser text/captions/controls and native schedule results were reread against the reference calibration. The result explicitly separates a database cursor from a key-value API token. It also avoids pretending Repeatable Read is necessary merely to keep one plain PostgreSQL cursor query's view: native checks show that query view stays fixed at Read Committed too, while its separate count can change. The long-view cost leads to prompt bounded extraction or materialising the promised fields, with session loss and held-cursor limits stated.

Author QA found dynamically-created list items losing Astro scoped chip styles. The source now retains the five server-rendered li nodes and updates/hides them, preserving both box styling and saved-boundary emphasis. Snapshot's internal sections inherited article-section margins; replaced them with labelled groups and confirmed compact phone/desktop cards. Snapshot's existing selected-state CSS was observed to work, so no speculative selector change was made there. The final introduction naturally declares the centrally acknowledged later-header status.

## Native evidence

Run the actual downloadable file: `python3 src/components/relational-collection/r07/downloads/run-pagination.py --bindir /opt/homebrew/opt/postgresql@18/bin`. PostgreSQL18.6, owned no-locale UTF-8 cluster, private socket, UTC on each of three verified sessions. Actual elapsed time0.855s. The standard-library harness has bounded command/session waits and cleans owned sessions/server/data. It executes corresponding article SQL and checks the exact download, not a substitute model.

Five header rows are reset between independent histories. Unchanged second page103/105; timestamp-only boundary after105 loses106, while the pair returns106. Cancelling101 makes OFFSET return105/106 while keyset returns103/105. Moving103 earlier makes OFFSET repeat102; keyset misses the moved row. New Read Committed keyset query returns105/106 after cancellation of103; Repeatable Read retains103/105. A declared cursor returns103/105 then106 under both levels despite that writer commit; a separate count then sees4 at Read Committed and5 at Repeatable Read. A separate20,000-row indexed scratch fixture produced10,002 scan rows for OFFSET10000 LIMIT2 and2 for n>10000 LIMIT2, both Index Only Scan. Full plans are in native-output.txt; those row counts are not latency benchmarks.

## Rendered and controls

All six continuation change×method combinations and all eight snapshot option×step states were checked; JSON receipts are in evidence/. Back/Next/Reset and keyboard Space were exercised, including retained focus at an aria-disabled end. Play changed to Pause, advanced automatically, and paused to Play. Native-select keyboard choice was committed and its result checked. Text alternatives were expanded/read/closed. Desktop1280×720 and375×812 phone layouts were inspected in light/dark, with no overflow or browser errors.

Final4380 focused confirmation checked the declared initial statuses, all retained list styles under cancellation/movement, saved102 boundary's2px accent border versus1px ordinary chips, and compact labelled snapshot view cards. Final visible text contrast minima5.52:1 light and6.15:1 dark. System theme restored (dark), figures reset, alternatives closed, viewport reset and actual1280×720 verified; tab closed and root lease released before this record.
'''
}
continuity={
'r05':'''# r05 continuity pass

Completed full author pass from supplied introductory JOIN/GROUP BY/NULL knowledge. A row's meaning develops from order, to line, to line–payment pair, then back to order totals. CTE, grain, left join and correlated subquery are introduced before use. Figure captions/controls use the same pair/grain language as their surrounding prose.

Canonical core.json supplies displayed customers, orders, lines, payments and report totals. Mina=1, Tariq=2, Edda=3;101/103 belong to Mina and102 to Tariq.101 lines4.50+35=39.50 with payments30+9.50;102 is40/40;103 is29 unpaid. Amounts have no assigned currency. Product catalogue prices never replace agreed unit_price. No stock race or later tie row is combined with this report.

Missing payment totals mean zero recorded payments; missing line totals deliberately remain unknown. Non-empty orders are not silently assumed to be a schema constraint. No-payment absence is distinguished from a partial balance. The synthetic native999 and equal-valued10 contributions are edge fixtures, never shared identities/history.

No shared-fact extension proposed or required for r05. Related grouping/physical execution/application scopes remain with their owners. Links use requested public collection destinations; root handles ready-draft remapping. No unresolved continuity dependency.
''',
'r06':'''# r06 continuity pass

Completed full author pass from r05's finished correct-grain explanation. Grouping/counting precedes windows; partition precedes ordered sequence; current-row/peer/frame meanings precede ranking choices. All figure controls and text alternatives were reread in their context. Whole-partition totals repeated beside orders are explicitly not new contributions to sum.

Core JSON remains authoritative: five lines, three orders, totals39.50/40/29, combined108.50; Mina68.50, Tariq40; Edda has no core orders. Counts/averages are carefully labelled per-line versus per-order. No missing order is silently valued at zero.

The later105(Mina)/106(Edda) tie is labelled before use, fixed at2026-10-21 12:00Z. It supplies only identities/times for the frame/count/ranking explanation, no line or amount assumption and no change to the core still-due report. Its native pending headers are incidental to these windows; r07's proposed E3 pending status was centrally acknowledged by root/D023 and is not needed by the r06 calculations. The separate40/30/30/20 scores do not become shop sales facts.

The final total-order discussion hands snapshot/continuation to r07. Physical sort/memory plans remain with query execution. No additional shared extension or unresolved dependency.
''',
'r07':'''# r07 continuity pass

Completed full pass from r06's total order/peer understanding and supplied r13 statement/transaction snapshot basics. The boundary pair always matches ascending placed_at,order_id; DESC is described with the reversed comparison. An API token is distinguished from a database cursor, and a saved boundary from a snapshot. Figures describe chosen histories, not elapsed-time traces or database plans.

Core101/102/103 times/customers/statuses are unchanged at each fixture reset. The later105(Mina)/106(Edda) share2026-10-21 12:00Z and add no lines, payments or stock effects. E3 was proposed to root and explicitly acknowledged/centralised as decisionD023: both later headers initially pending for this non-cancelled-list illustration. The introduction now declares it naturally. This optional later fixture never enters r05's core still-due report. The originally supplied fact packet was not edited.

Cancelling101, moving103 to2026-10-13 12:00Z, and cancelling103 for the snapshot comparison are separate later illustrative histories, each reset, rather than a combined shared production history. Their business effects beyond list membership are not claimed. The20,000 numbered rows belong to an explicit scratch table with no customer/order/stock meaning.

No implication that monotonic IDs are commit order, an upper bound freezes membership, a cursor bounds sort work, or a read-only snapshot prevents writes. Retained versions/materialisation/session loss are kept with the promises they qualify. Distributed snapshots and resource budgets remain linked to their article owners. No unresolved continuity dependency.
'''
}
for key,body in records.items():
 root=Path('/private/tmp/staycurrent-relational-20261024-'+key)
 (root/'writer-record.md').write_text(body.format(now=now)+'\n'+shared+'\n'+common_end)
 (root/'evidence/continuity.md').write_text(continuity[key])
 manifest=json.loads((root/'src/reference-articles/reading/manifest.json').read_text())
 calibration={'checked':now,'text_parts':{'sequences':[1,2,3,4,5,6],'indexes':[1,2,3,4,5,6,7],'storage':[1,2,3,4,5,6]},'all_end_markers_delivered':True,'root_acknowledged_before_design':True,'rendered_origin':'http://127.0.0.1:4350','drawings_studied':{'sequences':13,'indexes':11,'storage':10},'reference_tabs_closed':True,'viewport_or_theme_changed_during_reference_study':False,'shared_once_for_assignment':['r05','r06','r07'],'references':manifest['references']}
 (root/'evidence/reference-calibration.json').write_text(json.dumps(calibration,indent=2)+'\n')
 article=root/('src/articles/relational-collection/'+key+'.astro')
 links=sorted(set(re.findall(r'href="(https://[^\"]+)"',article.read_text())))
 (root/'evidence/sources.json').write_text(json.dumps({'checked_utc':now,'basis':'Official PostgreSQL18 primary documentation opened during authoring; query/schedule claims also checked natively on18.6. No third-party technical source or observed other-engine claim.','urls':links},indent=2)+'\n')
 source_files=[article,root/'metadata.json',root/'src/lib/relational-collection/core.json',*sorted((root/('src/components/relational-collection/'+key)).rglob('*'))]
 if key!='r07':source_files += [root/'evidence/prepare.py',root/'evidence/run-owned.py']
 hashes={str(p.relative_to(root)):hashlib.sha256(p.read_bytes()).hexdigest() for p in source_files if p.is_file()}
 blocks=re.findall(r'code=\{`(.*?)`\}',article.read_text(),re.S)
 receipt={'captured_utc':now,'article':key,'sha256':hashes,'sql_blocks_sha256':[hashlib.sha256(s.encode()).hexdigest() for s in blocks],'native_output_sha256':hashlib.sha256((root/'evidence/native-output.txt').read_bytes()).hexdigest(),'download_bytes_unchanged_since_native_execution':True}
 (root/'evidence/source-manifest.json').write_text(json.dumps(receipt,indent=2)+'\n')
 print(key,hashes[str(article.relative_to(root))])
