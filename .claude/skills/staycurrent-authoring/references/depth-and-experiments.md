# Depth and practical experiments

The user found the first PostgreSQL deep dive shallow, despite its broad topic
coverage. The rebuild gave major mechanisms room of their own, including row
versions, maintenance, recovery, replication and specialised data. The later review
of the other relational articles retained much of their existing explanation and
repaired six articles where a practical decision was incomplete. Neither adding
pages nor rewriting everything is evidence of depth.

For a product branch, ask what the reader can now explain about its behaviour and
what design they could defend. Feature names are useful navigation, but “supports
JSON” does not explain representation, indexing, update cost or when separate
columns would help. Follow a selected capability through its mechanism, a concrete
use, a changed condition and the resulting design choice. The subject determines
which of those deserves space; this is not a section template.

The relational review found that several correct examples stopped too soon. A
restore reached a point before an accidental delete, but also lost a later valid
purchase. Following that purchase into reconciliation made the recovery decision
understandable. A backfill's short batch did not prove completion when another
writer could make selected rows ineligible. The missing depth was a consequence
of the demonstrated mechanism, not another introductory definition.

## Choose what the experiment can honestly show

The SQL playground executes PostgreSQL through PGlite. Its outbox and replication
exercises still use table models; they do not create independent servers or a
network. Preserve that distinction when designing another playground. A service
API implemented in the browser is a teaching model unless the real service is
actually being called. Compatibility in one operation does not establish the
service's durability, permission system or failure behaviour.

Choose the medium from the learning outcome. A local model can make otherwise
invisible states inspectable and reproducible. A native worksheet can expose real
multi-client behaviour. A cloud exercise may need an account, permissions and
cleanup. Explain the chosen setting where readers begin; do not bury its limits
after they have interpreted the result. Avoid requiring credentials for a lesson
whose useful decision can be taught without them.

Give a lesson a question worth testing, a visible starting state and an outcome
the reader can inspect. Its useful variation should change a condition relevant
to the article. The relational index lesson keeps the answer stable while changing
index order; the plan reveals why one arrangement examines more rows. A nearby
generic query would not teach that article's central investigation.

The result presentation belongs to the explanation. The SQL plan was executable
but difficult to read inside a narrow, padded result table. A compact, aligned plan
view made the hierarchy visible. Inspect the actual output, error, reset and
continuation states on a phone as well as a desktop. A screenshot of a long page
shrunk to fit is not evidence that its figures are legible.

Keep evidence proportional. Record what ran, under which implementation and
settings, what was observed, and what remains documented or modelled. Do not turn
a tiny timing result into a performance claim. Review the assembled prose after
technical repairs so that it still reads as an explanation rather than a sequence
of reviewer objections. The underlying examples and review limits are preserved
in `docs/article-work/relational-depth-review/`.
