#!/usr/bin/env node
// services/site/scripts/prebuild.mjs
//
// The npm `prebuild` lifecycle script (package.json) — pnpm runs it
// automatically before `build` on every `pnpm build` / `pnpm start:static`,
// per the npm lifecycle contract (02-data-flows.md, Site Build Data Flow:
// "package.json's `prebuild` lifecycle script runs first and unconditionally,
// before `next build` starts").
//
// Reads site.config.json, calls @staycurrent/core's real buildRss, and
// writes services/site/public/rss.xml. Then materializes the skill payload
// distribution contract (03-api-design.md, "Skill payload distribution —
// build-artifact contract"): the browsable current tree at
// public/skills/<slug>/, archived trees at public/skills/<slug>/v/<n>/, the
// current zip at public/skills/<slug>.zip, archived zips at
// public/skills/<slug>/v/<n>.zip — every zip a single top-level <slug>/
// directory, never loose files at the archive root. Sourced directly from
// the gate-validated topics/<slug>/skill/ and topics/<slug>/versions/vN/
// skill/ snapshots — never re-derived.
//
// Fail-closed (Site Build Data Flow's Failure modes: "the prebuild script's
// own I/O failure ... -> non-zero exit before next build is invoked at
// all"): a listTopics error sweep, a buildRss throw, or any write failure
// exits non-zero here, before `next build` ever starts.
//
// A plain Node ESM script, not TypeScript through Next's bundler — this runs
// standalone via the npm `prebuild` hook, so it duplicates the small handful
// of things it shares with lib/content.ts (REPO_ROOT resolution, the
// site.config.json fallback) rather than importing that module.

import {
  createWriteStream,
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';
import { ZipArchive } from 'archiver';
import { buildRss, listTopics } from '@staycurrent/core';

// Mirrors lib/content.ts's REPO_ROOT exactly: this script runs with the same
// cwd (services/site) `next build` itself runs with, and must honour the
// same STAYCURRENT_REPO_ROOT fixture-root override the loading API respects,
// so a fixture build's prebuild reads the fixture's own topics/, never the
// real repository's.
const REPO_ROOT = process.env.STAYCURRENT_REPO_ROOT
  ? path.resolve(process.env.STAYCURRENT_REPO_ROOT)
  : path.resolve(process.cwd(), '..', '..');

const PUBLIC_DIR = path.resolve(process.cwd(), 'public');

// Mirrors lib/content.ts's getSiteConfig validation exactly (it cannot import
// that module — see this file's own header comment). Fails closed for BOTH
// an outright-missing file and a malformed one: no instance value is
// hardcoded in services/site (RC1), so there is no default left to degrade
// to — every repo root a build runs against (real or fixture) must stage its
// own site.config.json.
function readSiteConfig(root) {
  const configPath = path.join(root, 'site.config.json');
  if (!existsSync(configPath)) {
    throw new Error(
      `${configPath}: site.config.json not found — no instance value is hardcoded in ` +
        'services/site, so every repo root a build runs against must stage its own'
    );
  }
  const raw = JSON.parse(readFileSync(configPath, 'utf-8'));
  if (
    typeof raw !== 'object' ||
    raw === null ||
    typeof raw.name !== 'string' ||
    typeof raw.url !== 'string' ||
    typeof raw.description !== 'string' ||
    typeof raw.author !== 'string'
  ) {
    throw new Error(
      `${configPath}: must be a JSON object with string fields name, url, description, author`
    );
  }
  return raw;
}

function fail(message) {
  console.error(`prebuild: ${message}`);
  process.exitCode = 1;
}

/** Replaces `dest` wholesale with a copy of `source` — the browsable tree. */
function copyTree(source, dest) {
  rmSync(dest, { recursive: true, force: true });
  mkdirSync(path.dirname(dest), { recursive: true });
  cpSync(source, dest, { recursive: true });
}

/**
 * Zips `sourceDir`'s contents under a single top-level `slugName/` directory
 * (03-api-design.md's distribution contract) — never loose files at the
 * archive root, so `unzip -d ~/.claude/skills/` lands the payload at
 * `~/.claude/skills/<slug>/`.
 */
async function writeZip(sourceDir, zipPath, slugName) {
  mkdirSync(path.dirname(zipPath), { recursive: true });
  const output = createWriteStream(zipPath);
  const archive = new ZipArchive({ zlib: { level: 9 } });

  const closed = new Promise((resolve, reject) => {
    output.on('close', resolve);
    output.on('error', reject);
    archive.on('error', reject);
  });

  archive.pipe(output);
  archive.directory(sourceDir, slugName);
  await archive.finalize();
  await closed;
}

/**
 * Every relative file path under `dir`, recursively, `SKILL.md` sorted
 * first (03-api-design.md's distribution contract calls it out by name)
 * then the rest alphabetically — the ordering `skillIndexHtml` below lists
 * in its browsable index.
 */
function listPayloadFiles(dir) {
  const out = [];
  const walk = (sub) => {
    for (const entry of readdirSync(path.join(dir, sub), { withFileTypes: true })) {
      const rel = sub ? `${sub}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        walk(rel);
      } else {
        out.push(rel);
      }
    }
  };
  walk('');
  out.sort((a, b) => {
    if (a === 'SKILL.md') return -1;
    if (b === 'SKILL.md') return 1;
    return a.localeCompare(b);
  });
  return out;
}

/**
 * A minimal, self-contained index.html for one payload directory
 * (03-api-design.md's distribution contract: GitHub Pages serves no
 * directory listing for the raw copied trees at `public/skills/<slug>/`
 * and `public/skills/<slug>/v/<n>/`, so a reader following a History-row or
 * Archived-Version pointer link straight into one otherwise dead-ends).
 * Plain, self-contained inline styles — print-flat, `prefers-color-scheme`-
 * safe for both themes — and no site JS; this file is served standalone,
 * completely outside Next's own asset pipeline and this site's design
 * system. It must never ride along in the sibling `.zip`: `writeZip` always
 * zips straight from the `topics/` SOURCE tree, never this destination
 * directory this function writes into, so the file structurally can't leak
 * into the archive regardless of call order.
 */
function skillIndexHtml(slug, version, files, skillPageHref) {
  const items = files
    .map((file) => `      <li><a href="./${file}">${file}</a></li>`)
    .join('\n');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${slug} skill payload — v${version}</title>
<style>
  :root { color-scheme: light dark; }
  body {
    font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
    max-width: 40rem;
    margin: 2rem auto;
    padding: 0 1rem;
    color: #24211a;
    background: #f9f7f2;
  }
  a { color: #2b6a45; }
  h1 { font-size: 1rem; font-weight: 600; margin: 0 0 1rem; }
  ul { list-style: none; margin: 0 0 1.5rem; padding: 0; }
  li { margin: 0 0 0.4rem; }
  p.back { margin: 0; }
  @media (prefers-color-scheme: dark) {
    body { color: #dcd7cc; background: #1c1a17; }
    a { color: #8fd19e; }
  }
  @media print {
    body { background: none; color: #000; }
  }
</style>
</head>
<body>
  <h1>${slug} — skill payload (v${version})</h1>
  <ul>
${items}
  </ul>
  <p class="back"><a href="${skillPageHref}">&larr; ${slug} skill install page</a></p>
</body>
</html>
`;
}

/** Writes `destDir/index.html` for a payload tree already copied into place. */
function writeSkillIndexHtml(destDir, slug, version) {
  writeFileSync(
    path.join(destDir, 'index.html'),
    skillIndexHtml(slug, version, listPayloadFiles(destDir), `/${slug}/skill/`)
  );
}

async function main() {
  let sweep;
  try {
    sweep = listTopics(REPO_ROOT);
  } catch (err) {
    fail(`listTopics threw: ${err.message}`);
    return;
  }
  if (sweep.errors.length > 0) {
    const detail = sweep.errors.map((e) => `${e.slug}: ${e.message}`).join('; ');
    fail(`listTopics reported ${sweep.errors.length} invalid topic(s): ${detail}`);
    return;
  }

  let config;
  try {
    config = readSiteConfig(REPO_ROOT);
  } catch (err) {
    fail(`readSiteConfig threw: ${err.message}`);
    return;
  }

  let feed;
  try {
    feed = buildRss(REPO_ROOT, config);
  } catch (err) {
    fail(`buildRss threw: ${err.message}`);
    return;
  }

  try {
    mkdirSync(PUBLIC_DIR, { recursive: true });
    writeFileSync(path.join(PUBLIC_DIR, 'rss.xml'), feed, 'utf-8');
  } catch (err) {
    fail(`could not write public/rss.xml: ${err.message}`);
    return;
  }

  const skillsDir = path.join(PUBLIC_DIR, 'skills');
  try {
    rmSync(skillsDir, { recursive: true, force: true });
    mkdirSync(skillsDir, { recursive: true });

    for (const topic of sweep.topics) {
      const slug = topic.topic;

      // Current — mirrors the live topics/<slug>/skill/.
      const currentSkillSrc = path.join(REPO_ROOT, 'topics', slug, 'skill');
      const currentSkillDest = path.join(skillsDir, slug);
      copyTree(currentSkillSrc, currentSkillDest);
      writeSkillIndexHtml(currentSkillDest, slug, topic.version);
      await writeZip(currentSkillSrc, path.join(skillsDir, `${slug}.zip`), slug);

      // Archived — every version below the live one, mirroring
      // topics/<slug>/versions/vN/skill/ (1..current, matching
      // /[topic]/v/[n]/'s own enumeration in generateStaticParams).
      for (let n = 1; n < topic.version; n++) {
        const archivedSkillSrc = path.join(REPO_ROOT, 'topics', slug, 'versions', `v${n}`, 'skill');
        const archivedSkillDest = path.join(skillsDir, slug, 'v', String(n));
        copyTree(archivedSkillSrc, archivedSkillDest);
        writeSkillIndexHtml(archivedSkillDest, slug, n);
        await writeZip(archivedSkillSrc, path.join(skillsDir, slug, 'v', `${n}.zip`), slug);
      }
    }
  } catch (err) {
    fail(`could not materialize skill payloads: ${err.message}`);
    return;
  }

  console.log(`prebuild: wrote rss.xml + skill payloads for ${sweep.topics.length} topic(s).`);
}

await main();
process.exit(process.exitCode ?? 0);
