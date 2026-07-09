// Path helpers shared by every command handler in cli.mjs. `root` is always the
// process's cwd (03-api-design.md, command contract: "All commands resolve `root`
// as the current working directory").

import path from 'node:path';

// Mirrors core's `core/src/slug.ts` SLUG_RE exactly (kebab-case, at most three
// words) — not re-exported from `@staycurrent/core`'s public entry point, so the
// CLI carries its own copy as a pre-flight guard before any slug-derived path is
// built. Every core write call re-validates independently; this is defense in
// depth, not the authority.
export const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+){0,2}$/;

export function isValidSlugShape(slug) {
  return typeof slug === 'string' && SLUG_RE.test(slug);
}

export function topicDir(root, slug) {
  return path.join(root, 'topics', slug);
}

export function stagedDir(root, slug) {
  return path.join(root, '.staycurrent', 'staged', slug);
}

export function sessionsDir(root) {
  return path.join(root, '.staycurrent', 'sessions');
}

export function sessionFile(root, slug) {
  return path.join(sessionsDir(root), `${slug}.md`);
}
