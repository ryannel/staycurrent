// Errors — every throw in this module's Loading API is one of these two,
// never a bare Error (GateNotPassedError belongs to Cut mechanics, a later slice).

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
