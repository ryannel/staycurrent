/** Keep older bookmarks at the replacement passage, without changing its headings. */
export const relationalSectionAliases: Record<string, Record<string, string>> = {
  "RL76": {
    "tables": "tables-keys-and-joins",
    "relationships": "tables-keys-and-joins",
    "queries": "tables-keys-and-joins",
    "scaling": "distributed-sql-and-regional-failures",
    "choice": "choosing-an-implementation",
    "follow-one-booking-through-the-tables": "tables-keys-and-joins",
    "make-acceptance-one-database-decision": "transactions",
    "choose-where-the-database-runs": "embedded-databases-and-database-servers",
    "compare-actual-implementations-against-the-same-job": "choosing-an-implementation",
    "turn-the-choice-into-a-small-acceptance-trial": "choosing-an-implementation"
  },
  "RL77": {
    "relationships": "keys-express-identity-and-allowed-references",
    "history": "an-agreed-price-is-a-different-fact"
  },
  "RL81": {
    "missing-matches": "an-outer-join-preserves-missing-matches",
    "multiplied-rows": "two-independent-children-multiply-each-other"
  },
  "RL85": {
    "repeated": "count-the-sql-behind-the-response"
  },
  "RL87": {
    "reading-a-plan": "read-the-plan-as-rows-flowing-towards-the-result"
  },
  "RL90": {
    "working-through-checkout": "what-commit-makes-atomic",
    "failure": "what-commit-makes-atomic",
    "locking-read": "a-read-followed-by-a-write-can-lose-a-decision"
  },
  "RL93": {
    "operation-identity": "retain-the-identity-and-the-intent"
  },
  "RL104": {
    "composition": "privileged-code-changes-the-authority-of-a-call"
  },
  "RL105": {
    "local-partitions": "partitioning-and-replication-answer-different-questions",
    "moving-data": "what-the-implementation-takes-on"
  },
  "RL111": {
    "reader": "a-completed-vacuum-can-leave-dead-versions"
  }
};
