#!/usr/bin/env node
// services/site/scripts/prebuild.mjs
//
// The npm `prebuild` lifecycle script (package.json) — pnpm runs it
// automatically before `build` on every `pnpm build` / `pnpm start:static`,
// per the npm lifecycle contract: the `prebuild` script runs first and
// unconditionally, before `next build` starts.
//
// Reads site.config.json, calls @staycurrent/core's real buildRss, and
// writes services/site/public/rss.xml.
//
// Fail-closed: a listTopics error sweep, a buildRss throw, or any write
// failure exits non-zero here, before `next build` ever starts.
//
// A plain Node ESM script, not TypeScript through Next's bundler — this runs
// standalone via the npm `prebuild` hook, so it duplicates the small handful
// of things it shares with lib/content.ts (REPO_ROOT resolution, the
// site.config.json fallback) rather than importing that module.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
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
// hardcoded in services/site, so there is no default left to degrade to —
// every repo root a build runs against (real or fixture) must stage its own
// site.config.json.
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

function main() {
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

  console.log(`prebuild: wrote rss.xml for ${sweep.topics.length} topic(s).`);
}

main();
process.exit(process.exitCode ?? 0);
