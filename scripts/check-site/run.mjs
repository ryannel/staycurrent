#!/usr/bin/env node
// Checks the built site against the house structure. Run after `astro build`.
//
//   node scripts/check-site/run.mjs             every issue, grouped by rule
//   node scripts/check-site/run.mjs --summary   one line per rule
//   node scripts/check-site/run.mjs --rule=title-line --page=/learn/drawing-systems/
//   node scripts/check-site/run.mjs --strict    warnings fail too
//   node scripts/check-site/run.mjs --json
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import config from './config.mjs';
import { rules } from './rules/index.mjs';
import { loadSite } from './site.mjs';
import { checkPages, checkSources, levelOf } from './check.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const args = Object.fromEntries(process.argv.slice(2).map((a) => {
  const [k, v] = a.replace(/^--/, '').split('=');
  return [k, v ?? true];
}));

const only = args.rule ? new Set(String(args.rule).split(',')) : null;
const unknown = only && [...only].filter((id) => !rules.some((r) => r.id === id));
if (unknown?.length) { console.error(`Unknown rule: ${unknown.join(', ')}`); process.exit(2); }
const selected = rules.filter((r) => !only || only.has(r.id));

const site = await loadSite(resolve(root, config.dist), { skip: config.skip });
let issues = [...checkPages(site, selected, config), ...await checkSources(root, selected, config)];
if (args.page) issues = issues.filter((i) => i.where.includes(args.page));

const failing = issues.filter((i) => i.level === 'error' || (args.strict && i.level === 'warn'));

if (args.json) {
  console.log(JSON.stringify({ pages: site.pages.length, issues }, null, 2));
} else {
  const byRule = Map.groupBy(issues, (i) => i.rule);
  console.log(`Site check: ${site.pages.length} pages, ${selected.length} rules`);
  for (const rule of selected) {
    const { level } = levelOf(config, rule.id);
    const found = byRule.get(rule.id) ?? [];
    const places = new Set(found.map((i) => i.where)).size;
    const status = level === 'off' ? 'off ' : found.length ? (level === 'error' ? 'FAIL' : 'warn') : 'ok  ';
    console.log(`  ${status} ${rule.id.padEnd(24)} ${found.length ? `${found.length} in ${places} ${rule.source ? 'files' : 'pages'}` : ''}`);
    if (args.summary || !found.length) continue;
    console.log(`       ${rule.why}`);
    for (const [where, list] of Map.groupBy(found, (i) => i.where)) {
      console.log(`       ${where}`);
      for (const i of list) console.log(`         ${i.message}`);
    }
  }
  if (failing.length) console.log(`\n${failing.length} issue(s) at error level${args.strict ? ' (--strict)' : ''}.`);
}
process.exit(failing.length ? 1 : 0);
