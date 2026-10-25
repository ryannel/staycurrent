import { PGlite } from '@electric-sql/pglite';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const root = new URL('../', import.meta.url);
const fixture = await readFile(new URL('input/generated-shop-fixture.sql', root), 'utf8');
const tail = await readFile(new URL('evidence/experiment-tail.sql', root), 'utf8');
const prefix = `-- Use only an explicitly owned disposable database. Everything is rolled back.\n-- The schema name must not already exist. No existing/default database is a safe target.\nBEGIN;\nCREATE SCHEMA partition_experiment;\nSET LOCAL search_path=partition_experiment,pg_catalog;\nSET LOCAL TIME ZONE 'UTC';\n`;
const sql = prefix + fixture + tail;
const downloadDir = new URL('public/relational-rebuild/partitioning/', root);
await mkdir(downloadDir, { recursive: true });
await writeFile(new URL('partition-experiment.sql', downloadDir), sql);
const hash = text => createHash('sha256').update(text).digest('hex');
const db = new PGlite();
try {
  const version = (await db.query('SELECT version() AS version')).rows[0].version;
  const output = await db.exec(sql);
  const checks = output.flatMap(x => x.rows || []).filter(x => x.check_name);
  const failed = checks.filter(x => x.ok !== true);
  if (failed.length) throw new Error(JSON.stringify(failed));
  let label;
  const plans = [];
  for (const result of output) {
    if (result.rows?.[0]?.plan_label) label = result.rows[0].plan_label;
    if (result.rows?.[0]?.['QUERY PLAN']) {
      const plan = result.rows[0]['QUERY PLAN'];
      const relations = [];
      const walk = node => { if (node['Relation Name']) relations.push({relation:node['Relation Name'],type:node['Node Type'],rows:node['Actual Rows'],loops:node['Actual Loops'],rejected:node['Rows Removed by Filter']}); for (const child of node.Plans || []) walk(child); };
      walk(plan[0].Plan);
      plans.push({ label, relations, plan });
    }
  }
  const evidence = { runtime: {library:'@electric-sql/pglite 0.5.8',version,node:process.version,storage:'Owned disposable in-memory PGlite instance; closed in finally',timeZone:'UTC'}, sourceHashes:{fixture:hash(fixture),tail:hash(tail),download:hash(sql)}, checks, plans, output, limits:['WASM observations, not a native server or concurrent-client run.','No production timing threshold, lock waits or concurrent safety established.','Generated workload is a reporting model, not reconstructed stock history.','Report copy has weaker composite uniqueness and no incoming foreign keys.'] };
  await writeFile(new URL('partition-evidence.json', downloadDir), JSON.stringify(evidence,null,2)+'\n');
  await writeFile(new URL('evidence/verification-summary.json', root), JSON.stringify({runtime:evidence.runtime,sourceHashes:evidence.sourceHashes,checks,plans:plans.map(({label,relations,plan})=>({label,relations,subplansRemoved:plan[0].Plan['Subplans Removed']}))},null,2)+'\n');
  console.log(JSON.stringify({checks:checks.length,plans:plans.map(x=>({label:x.label,relations:x.relations})),runtime:evidence.runtime},null,2));
} catch (error) { console.error(JSON.stringify({message:error.message,code:error.code,position:error.position,detail:error.detail})); process.exitCode=1; } finally { await db.close(); }
