// Date normalization and derivation helpers.
//
// The frontmatter parser (loaders/shared.ts) runs js-yaml with CORE_SCHEMA, which has
// no timestamp type — an unquoted `YYYY-MM-DD` scalar stays a string, so every date
// field validates uniformly through `isIsoDate` (03-api-design.md documents the
// default-schema Date-coercion gotcha this design removes at the source). The Date
// branch below is a defensive guard only — with CORE_SCHEMA it should be unreachable.

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Normalize a raw frontmatter value that should be an ISO date into its string form. */
export function normalizeDateValue(value: unknown): string | undefined {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return undefined;
    return value.toISOString().slice(0, 10);
  }
  if (typeof value === 'string') {
    return value;
  }
  return undefined;
}

/** True iff `value` is a syntactically and calendrically valid YYYY-MM-DD date. */
export function isIsoDate(value: string): boolean {
  if (!ISO_DATE_RE.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

/** due = last_researched + cadence(days) < today (UTC calendar day comparison). */
export function computeDue(lastResearched: string, cadence: string): boolean {
  const match = /^(\d+)d$/.exec(cadence);
  const days = match ? Number(match[1]) : 0;
  const last = new Date(`${lastResearched}T00:00:00Z`);
  if (Number.isNaN(last.getTime())) return false;
  const dueAt = last.getTime() + days * 86_400_000;

  const now = new Date();
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

  return dueAt < today;
}
