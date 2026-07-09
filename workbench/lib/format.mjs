// Human-formatted output: the `status` state-block table and the `Blocked/Cause/
// State/Action` halt template (01-ui-design.md, "Surface: workbench"; the halt
// block quoted verbatim there and in 03-api-design.md's `cut` gate-failure
// response). `todayMs` is injectable throughout (a UTC-midnight epoch value) so
// the due/next-run derivations are deterministic under test — cli.mjs passes
// nothing and gets the real clock.

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function parseIsoUtc(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

/** 'DD MMM YYYY', e.g. '12 Jun 2026', '01 Mar 2026' — the `researched <date>`
 * column's format. The day is two-digit padded: 01-ui-design.md's rendered state
 * block ('01 Mar 2026') is normative ("matches the design system's state block
 * example byte-for-byte"). */
export function formatDateLong(iso) {
  const d = parseIsoUtc(iso);
  return `${String(d.getUTCDate()).padStart(2, '0')} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** 'DD MMM' (no year) — the `next run <date>` projection's format. */
export function formatDateShort(iso) {
  const d = parseIsoUtc(iso);
  return `${String(d.getUTCDate()).padStart(2, '0')} ${MONTHS[d.getUTCMonth()]}`;
}

function addDaysIso(iso, days) {
  const d = parseIsoUtc(iso);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function cadenceDays(cadence) {
  const m = /^(\d+)d$/.exec(cadence);
  return m ? Number(m[1]) : 0;
}

export function todayUtcMs() {
  const now = new Date();
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
}

/** One topic's trailing state column: `current — next run …`, `due — N days over`,
 * or `in-research` (03-api-design.md, `status` Response (human)). */
export function stateFor(topic, todayMs = todayUtcMs()) {
  if (topic.status === 'in-research') return 'in-research';

  const dueAtIso = addDaysIso(topic.last_researched, cadenceDays(topic.cadence));
  const dueAtMs = parseIsoUtc(dueAtIso).getTime();
  if (dueAtMs < todayMs) {
    const daysOver = Math.floor((todayMs - dueAtMs) / 86_400_000);
    return `due — ${daysOver} days over`;
  }
  return `current — next run ${formatDateShort(dueAtIso)}`;
}

/**
 * The state-block table: one column-aligned row per topic. Mirrors
 * 01-ui-design.md's rendered example byte-for-byte — each column (slug, version,
 * `researched <date>`) is padded to (the widest value in that column) + 3 spaces,
 * the pattern the worked example's spacing reduces to.
 */
export function renderStateBlock(topics, todayMs = todayUtcMs()) {
  if (topics.length === 0) return [];
  const slugW = Math.max(...topics.map((t) => t.topic.length)) + 3;
  const verW = Math.max(...topics.map((t) => `v${t.version}`.length)) + 3;
  const dateW =
    Math.max(...topics.map((t) => `researched ${formatDateLong(t.last_researched)}`.length)) + 3;

  return topics.map((t) => {
    const slugCol = t.topic.padEnd(slugW);
    const verCol = `v${t.version}`.padEnd(verW);
    const dateCol = `researched ${formatDateLong(t.last_researched)}`.padEnd(dateW);
    return `${slugCol}${verCol}${dateCol}${stateFor(t, todayMs)}`;
  });
}

/**
 * The Blocked/Cause/State/Action halt template — `cut`'s exclusive failure format
 * (03-api-design.md: "only `cut` renders the full ... halt template"). Label
 * spacing (`Blocked: `, `Cause:   `, `State:   `, `Action:  `) matches the
 * design-system block verbatim. Any GateFailure beyond the one named in `cause`
 * lists below the block as `FAIL <check-id>: <message>` — the same line shape
 * `gate` reports, per the shared "built directly from check + message" rule.
 */
export function renderHaltTemplate({ blocked, cause, state, action, extraFailures = [] }) {
  const lines = [`Blocked: ${blocked}`, `Cause:   ${cause}`, `State:   ${state}`, `Action:  ${action}`];
  for (const f of extraFailures) lines.push(`FAIL ${f.check}: ${f.message}`);
  return lines.join('\n');
}
