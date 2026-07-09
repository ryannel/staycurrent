// Errors — every throw in this module is one of these three, never a bare Error
// (03-api-design.md, "Additional supporting types"). ContentValidationError and
// ContentNotFoundError cover the Loading API and the frontmatter-schema checks
// Cut/Session mechanics reuse; GateNotPassedError belongs to Cut mechanics alone.

import type { GateFailure } from './types.js';

export class ContentValidationError extends Error {
  readonly topic: string;
  readonly file: string; // dir-relative path of the offending file
  readonly issues: string[]; // one entry per violated field or rule

  constructor(topic: string, file: string, issues: string[]) {
    super(`${file}: ${issues.join('; ')}`);
    this.name = 'ContentValidationError';
    this.topic = topic;
    this.file = file;
    this.issues = issues;
  }
}

export class ContentNotFoundError extends Error {
  readonly topic: string;
  readonly path: string; // dir-relative path that does not exist

  constructor(topic: string, path: string) {
    super(`${topic}: not found at ${path}`);
    this.name = 'ContentNotFoundError';
    this.topic = topic;
    this.path = path;
  }
}

export class GateNotPassedError extends Error {
  readonly failures: GateFailure[];

  constructor(failures: GateFailure[], message?: string) {
    super(message ?? `publish gate did not pass: ${failures.length} failure(s)`);
    this.name = 'GateNotPassedError';
    this.failures = failures;
  }
}
