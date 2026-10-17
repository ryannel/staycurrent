// Runs the rules against a loaded site and source files, returning issues.
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

/** A rule's level and options from the config: "warn" or ["warn", { ... }]. */
export function levelOf(config, id) {
  const entry = config.rules?.[id] ?? 'off';
  return Array.isArray(entry) ? { level: entry[0], options: entry[1] ?? {} } : { level: entry, options: {} };
}

const applies = (rule, page) => rule.kinds === 'all' || (Array.isArray(rule.kinds) && rule.kinds.includes(page.kind));

export function checkPages(site, rules, config) {
  const issues = [];
  for (const rule of rules.filter((r) => !r.source)) {
    const { level, options } = levelOf(config, rule.id);
    if (level === 'off') continue;
    const exceptions = config.exceptions?.[rule.id] ?? {};
    for (const page of site.pages) {
      if (!applies(rule, page) || page.url in exceptions) continue;
      for (const issue of rule.check(page, site, options)) issues.push({ rule: rule.id, level, where: page.url, ...issue });
    }
  }
  return issues;
}

async function* sourceFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* sourceFiles(path);
    else if (/\.(css|astro)$/.test(entry.name)) yield path;
  }
}

export async function checkSources(rootDir, rules, config) {
  const issues = [];
  for (const rule of rules.filter((r) => r.source)) {
    const { level, options } = levelOf(config, rule.id);
    if (level === 'off') continue;
    const exceptions = config.exceptions?.[rule.id] ?? {};
    for (const dir of rule.source) {
      for await (const path of sourceFiles(join(rootDir, dir))) {
        const rel = path.slice(rootDir.length + 1);
        if (rel in exceptions) continue;
        const file = { path: rel, text: await readFile(path, 'utf8') };
        for (const issue of rule.check(file, options)) issues.push({ rule: rule.id, level, where: rel, ...issue });
      }
    }
  }
  return issues;
}
