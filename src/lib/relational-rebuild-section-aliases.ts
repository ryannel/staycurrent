/** Preserve bookmarks used by the retained practice, sandbox and drawing articles. */
const aliases: Record<string, Record<string, string>> = {
  "data-modelling": {
    "separate-and-reconnect": "decomposition",
    "when-a-copy-is-a-different-fact": "history"
  },
  "pg-upgrades": {
    "rehearse-the-transfer-mode": "pg-upgrade"
  },
  "query-results": {
    "two-independent-collections": "multiplication"
  },
  "transactions": {
    "one-purchase-one-commit": "purchase"
  },
  "retry-outcomes": {
    "name-the-logical-request": "request-identity"
  },
  "query-execution": {
    "the-two-plans-to-read": "measured-plan"
  },
  "partitioning": {
    "prove-a-partition-cannot-match": "pruning"
  },
  "pg-distribution": {
    "keep-a-receipt-local": "rules"
  },
  "pg-access": {
    "combine-command-rights-with-row-rights": "row-security"
  },
  "locks": {
    "what-a-row-lock-stops": "what-waits"
  }
};

export function relationalRebuildSectionAliases(html: string, key: string): string {
  for (const [oldId, target] of Object.entries(aliases[key] ?? {})) {
    if (new RegExp(`\\bid=["']${oldId}["']`).test(html)) continue;
    html = html.replace(new RegExp(`<([a-z][a-z0-9]*)\\b([^>]*\\bid=["']${target}["'][^>]*)>`, 'i'),
      match => `<span id="${oldId}" aria-hidden="true" data-pagefind-ignore></span>${match}`);
  }
  return html;
}
