import fs from 'node:fs';
import matter from 'gray-matter';
import { CORE_SCHEMA, load } from 'js-yaml';
import { ContentValidationError } from '../errors.js';

export interface ParsedMatter {
  data: Record<string, unknown>;
  content: string;
}

// js-yaml's CORE_SCHEMA carries no timestamp type, so an unquoted YYYY-MM-DD
// scalar stays a string instead of being coerced to a JS Date (and silently
// rolled — 2026-02-30 becoming 2026-03-02). Every date field then flows through
// isIsoDate uniformly, which rejects calendrically impossible values outright,
// and a full timestamp fails the YYYY-MM-DD shape instead of parsing.
function parseYaml(src: string): object {
  return (load(src, { schema: CORE_SCHEMA }) ?? {}) as object;
}

/**
 * Reads and parses a frontmatter file. Returns undefined on ENOENT; rethrows
 * raw fs errors; converts any YAML/frontmatter parse failure into
 * `ContentValidationError` — the Loading API's two-error shape is exhaustive,
 * so a YAMLException must never escape as a bare throw.
 */
export function readMatterFile(
  filePath: string,
  slug: string,
  relPath: string
): ParsedMatter | undefined {
  let raw: string;
  try {
    raw = fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return undefined;
    throw err;
  }

  let data: unknown;
  let content: string;
  try {
    const parsed = matter(raw, { engines: { yaml: parseYaml } });
    data = parsed.data ?? {};
    content = parsed.content;
  } catch (err) {
    throw new ContentValidationError(slug, relPath, [
      `frontmatter failed to parse: ${(err as Error).message}`,
    ]);
  }

  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    throw new ContentValidationError(slug, relPath, ['frontmatter is not a YAML mapping']);
  }

  return { data: data as Record<string, unknown>, content };
}

/** Reads a plain text file; returns undefined on ENOENT, rethrows otherwise. */
export function readTextFile(filePath: string): string | undefined {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return undefined;
    throw err;
  }
}
